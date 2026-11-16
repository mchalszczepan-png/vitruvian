#!/usr/bin/env python3
"""Seam 2 eval: note -> Referral-fields task, scored per field against eval records.

Scores a chat-completions model (prompted Gemma or the Modal LoRA) on ml/data/eval.jsonl.
The scoring functions are pure (no network) so ml/tests/test_eval_scoring.py can cover them.

Run from the repo root:
  uv run --with requests --with jsonschema ml/eval.py --label gemma-prompted \
      --base-url https://HOST/v1 --model MODEL_ID --key-file PATH_TO_KEY_FILE
  uv run --with requests --with jsonschema ml/eval.py --compare ml/results/a.json ml/results/b.json
  uv run --with requests --with jsonschema ml/eval.py --self-test --data ml/tests/fixtures/eval_sample.jsonl
  uv run --with requests --with jsonschema ml/eval.py --dry-run --label plumbing --data ml/tests/fixtures/eval_sample.jsonl

--base-url is the API root that already ends in /v1; the script appends /chat/completions.
The key is read from --key-file and sent only in the Authorization header. It is never printed.
"""
from __future__ import annotations

import argparse
import copy
import functools
import json
import re
import sys
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from statistics import mean
from typing import Any, Callable

import jsonschema

ML_DIR = Path(__file__).resolve().parent
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))
import prompt  # noqa: E402  shared prompt builder; prompted Gemma, training data and the LoRA all use it

DEFAULT_DATA = ML_DIR / "data" / "eval.jsonl"
FIXTURE_DATA = ML_DIR / "tests" / "fixtures" / "eval_sample.jsonl"
RESULTS_DIR = ML_DIR / "results"
CANCERS = ("lung", "colorectal", "ovarian")
LANGUAGES = ("en", "fi")
KINDS = ("cancer", "control")
WRONG_VALUE = "WRONG VALUE"
REPAIR_MESSAGE = (
    'Your reply was not one JSON object of the form {"fields": {...}, "evidence": {...}}. '
    "Reply again with only that JSON object: no prose, no code fence."
)
FENCE_RE = re.compile(r"\A\s*```(?:json)?\s*(.*?)\s*```\s*\Z", re.DOTALL | re.IGNORECASE)
FIELD_KINDS = ("exact", "text", "exact_set", "text_set", "tests", "object")


# ---------------------------------------------------------------- schema and text helpers

@functools.lru_cache(maxsize=None)
def schema_for(cancer: str) -> dict:
    return prompt.load_schema(cancer)


def normalise_text(text: str) -> str:
    """Lowercase, fold diacritics (a-umlaut -> a), turn punctuation into spaces, collapse whitespace."""
    decomposed = unicodedata.normalize("NFKD", text)
    without_marks = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    folded = without_marks.casefold()
    without_punct = re.sub(r"[^\w\s]|_", " ", folded)
    return " ".join(without_punct.split())


def field_kind(name: str, prop: dict) -> str:
    """How a schema field is compared. Ids, dates, enums, booleans and numbers are exact; free text is normalised."""
    if name == "testsDone":
        return "tests"
    types = prop.get("type")
    types = types if isinstance(types, list) else [types]
    non_null = [t for t in types if t != "null"]
    if "array" in non_null:
        return "exact_set" if "enum" in prop.get("items", {}) else "text_set"
    if "object" in non_null:
        return "object"
    is_free_text = "string" in non_null and not any(k in prop for k in ("enum", "const", "format", "pattern"))
    return "text" if is_free_text else "exact"


def _exact(a: Any, b: Any) -> bool:
    if isinstance(a, bool) or isinstance(b, bool):
        return isinstance(a, bool) and isinstance(b, bool) and a == b  # True must not match 1
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return float(a) == float(b)
    if isinstance(a, str) and isinstance(b, str):
        return a.strip() == b.strip()
    return a == b


def _item_key(item: Any, normalise: bool) -> Any:
    if isinstance(item, str):
        return normalise_text(item) if normalise else item.strip()
    return json.dumps(item, sort_keys=True, ensure_ascii=False)


def values_match(name: str, prop: dict, target: Any, predicted: Any) -> bool:
    """True when one predicted field value matches its target value under the field's comparison kind."""
    if target is None or predicted is None:
        return target is None and predicted is None  # null means unknown, so it must match null
    kind = field_kind(name, prop)
    if kind == "exact":
        return _exact(target, predicted)
    if kind == "text":
        return isinstance(target, str) and isinstance(predicted, str) and normalise_text(target) == normalise_text(predicted)
    if kind in ("exact_set", "text_set"):
        if not (isinstance(target, list) and isinstance(predicted, list)):
            return False
        normalise = kind == "text_set"
        return {_item_key(x, normalise) for x in target} == {_item_key(x, normalise) for x in predicted}
    if kind == "tests":
        if not (isinstance(target, list) and isinstance(predicted, list)):
            return False
        return _test_keys(target) == _test_keys(predicted)
    # object: same keys, each value compared with its own schema property
    if not (isinstance(target, dict) and isinstance(predicted, dict)) or set(target) != set(predicted):
        return False
    sub_props = prop.get("properties", {})
    return all(values_match(key, sub_props.get(key, {}), target[key], predicted[key]) for key in target)


def _test_keys(tests: list) -> set:
    """testsDone compares name and result only (normalised). The date is not scored."""
    keys = set()
    for item in tests:
        if isinstance(item, dict):
            keys.add((normalise_text(str(item.get("name", ""))), normalise_text(str(item.get("result", "")))))
        else:
            keys.add(_item_key(item, True))
    return keys


# ---------------------------------------------------------------- per-record scoring

def score_fields(cancer: str, target_fields: dict, predicted_fields: dict) -> dict[str, dict]:
    """Per schema field: correct and present. Optional fields absent on both sides count correct (absent-both)."""
    props = schema_for(cancer).get("properties", {})
    scores: dict[str, dict] = {}
    for name in sorted(set(props) | set(target_fields) | set(predicted_fields)):
        in_target = name in target_fields
        in_predicted = name in predicted_fields
        present = in_target or in_predicted
        if not present:
            correct = True
        elif in_target != in_predicted:
            correct = False  # missing a target field, or an extra field the target does not have
        else:
            correct = values_match(name, props.get(name, {}), target_fields[name], predicted_fields[name])
        scores[name] = {"correct": correct, "present": present}
    return scores


def schema_errors(cancer: str, fields: dict) -> list[str]:
    """Validate fields against the cancer schema. A null required field is 'unknown', so it is removed before validation."""
    schema = copy.deepcopy(schema_for(cancer))
    required = schema.get("required", [])
    # A field made required by an if/then clause (e.g. ca125Done true -> ca125ValueIuPerMl) is "required" too,
    # so null there also means unknown (same rule as ml/validate_data.py).
    conditional = {name for clause in schema.get("allOf", []) for name in clause.get("then", {}).get("required", [])}
    unknown = {name for name in set(required) | conditional if name in fields and fields[name] is None}
    cleaned = {k: v for k, v in fields.items() if k not in unknown}
    schema["required"] = [name for name in required if name not in unknown]
    for clause in schema.get("allOf", []):
        then = clause.get("then", {})
        if "required" in then:
            then["required"] = [name for name in then["required"] if name not in unknown]
    validator = jsonschema.Draft202012Validator(schema, format_checker=jsonschema.FormatChecker())
    problems = []
    for error in sorted(validator.iter_errors(cleaned), key=lambda e: list(e.absolute_path)):
        where = "/".join(str(p) for p in error.absolute_path) or "(root)"
        problems.append(f"{where}: {error.message}")
    return problems


def evidence_grounding(evidence: dict, notes: list[str]) -> tuple[int, int]:
    """Returns (grounded entries, total entries). An entry is grounded when its text is an exact substring of one note."""
    grounded = sum(
        1 for quote in evidence.values()
        if isinstance(quote, str) and quote and any(quote in note for note in notes)
    )
    return grounded, len(evidence)


def parse_reply(content: Any) -> tuple[dict | None, bool, str]:
    """Returns (parsed {"fields", "evidence"} or None, fenced, problem). A fenced reply is a format miss but still parses."""
    if not isinstance(content, str):
        return None, False, "reply content is not a string"
    fence = FENCE_RE.match(content)
    fenced = fence is not None
    body = fence.group(1) if fenced else content
    try:
        obj = json.loads(body)
    except json.JSONDecodeError as exc:
        return None, fenced, f"invalid JSON: {exc.msg}"
    if not isinstance(obj, dict) or not isinstance(obj.get("fields"), dict):
        return None, fenced, "reply has no fields object"
    evidence = obj.get("evidence", {})
    return {"fields": obj["fields"], "evidence": evidence if isinstance(evidence, dict) else {}}, fenced, ""


def record_notes(record: dict) -> list[str]:
    inputs = record["input"]
    return [inputs["todayNote"]] + [note["note"] for note in inputs.get("earlierNotes", [])]


def evaluate_reply(record: dict, reply_text: str, *, latency_s: float = 0.0, usage: dict | None = None,
                   attempts: int = 1, error: str = "") -> dict:
    """Score one model reply for one eval record. Pure: no network."""
    cancer = record["cancer"]
    target_fields = record["target"]["fields"]
    if error:
        parsed, fenced, problem = None, False, ""
    else:
        parsed, fenced, problem = parse_reply(reply_text)
    predicted = parsed["fields"] if parsed else {}
    evidence = parsed["evidence"] if parsed else {}
    errors = schema_errors(cancer, predicted) if parsed else ["no parsable reply"]
    grounded, evidence_total = evidence_grounding(evidence, record_notes(record))
    scores = score_fields(cancer, target_fields, predicted)
    if parsed is None:
        # No usable reply: absent-both optional fields would otherwise score correct, so every field is wrong.
        for score in scores.values():
            score["correct"] = False
    return {
        "id": record["id"],
        "cancer": cancer,
        "language": record["language"],
        "kind": record["kind"],
        "json_valid": parsed is not None,
        "format_miss": fenced,
        "schema_valid": parsed is not None and not errors,
        "schema_errors": errors[:5],
        "field_scores": scores,
        "evidence_total": evidence_total,
        "evidence_grounded": grounded,
        "latency_s": latency_s,
        "attempts": attempts,
        "usage": usage or {},
        "error": error,
        "parse_problem": problem,
        "raw_reply": reply_text,
    }


# ---------------------------------------------------------------- aggregation

def _rate(numerator: int, denominator: int) -> float | None:
    return numerator / denominator if denominator else None


def _metrics(results: list[dict]) -> dict:
    n = len(results)
    all_fields = [s for r in results for s in r["field_scores"].values()]
    present_fields = [s for s in all_fields if s["present"]]
    usage_rows = [r["usage"] for r in results if r["usage"]]
    return {
        "records": n,
        "field_accuracy": _rate(sum(s["correct"] for s in all_fields), len(all_fields)),
        "field_accuracy_present": _rate(sum(s["correct"] for s in present_fields), len(present_fields)),
        "json_valid_rate": _rate(sum(r["json_valid"] for r in results), n),
        "schema_valid_rate": _rate(sum(r["schema_valid"] for r in results), n),
        "format_miss_rate": _rate(sum(r["format_miss"] for r in results), n),
        "evidence_grounded_rate": _rate(sum(r["evidence_grounded"] for r in results),
                                        sum(r["evidence_total"] for r in results)),
        "mean_latency_s": mean(r["latency_s"] for r in results) if results else None,
        "errors": sum(1 for r in results if r["error"]),
        "prompt_tokens_total": sum(u.get("prompt_tokens", 0) for u in usage_rows) if usage_rows else None,
        "completion_tokens_total": sum(u.get("completion_tokens", 0) for u in usage_rows) if usage_rows else None,
    }


def _per_field(results: list[dict]) -> dict[str, dict]:
    names = sorted({name for r in results for name in r["field_scores"]})
    table = {}
    for name in names:
        scores = [r["field_scores"][name] for r in results if name in r["field_scores"]]
        correct = sum(s["correct"] for s in scores)
        table[name] = {"correct": correct, "total": len(scores), "accuracy": _rate(correct, len(scores))}
    return table


def summarise(results: list[dict]) -> dict:
    def grouped(key: str) -> dict[str, dict]:
        return {value: _metrics([r for r in results if r[key] == value])
                for value in sorted({r[key] for r in results})}

    return {
        "overall": _metrics(results),
        "per_field": _per_field(results),
        "per_cancer": grouped("cancer"),
        "per_language": grouped("language"),
        "per_kind": grouped("kind"),
    }


# ---------------------------------------------------------------- data loading

def check_record(record: dict) -> list[str]:
    """Data QC for one eval record: split, labels, target validity, evidence grounding."""
    problems = []
    # "dev" is a slice held out of train for choosing hyperparameters (ml/split_dev.py), so eval.jsonl
    # stays untouched until the final comparison.
    if record.get("split") not in ("eval", "dev"):
        problems.append(f"split is {record.get('split')!r}, eval scoring refuses non-eval/dev records")
    if record.get("cancer") not in CANCERS:
        problems.append(f"unknown cancer {record.get('cancer')!r}")
    if record.get("language") not in LANGUAGES:
        problems.append(f"unknown language {record.get('language')!r}")
    if record.get("kind") not in KINDS:
        problems.append(f"unknown kind {record.get('kind')!r}")
    target = record.get("target", {})
    fields = target.get("fields", {})
    evidence = target.get("evidence", {})
    if record.get("cancer") in CANCERS:
        problems += [f"target: {e}" for e in schema_errors(record["cancer"], fields)]
    stray = sorted(set(evidence) - set(fields))
    if stray:
        problems.append(f"evidence keys not in fields: {stray}")
    grounded, total = evidence_grounding(evidence, record_notes(record))
    if grounded != total:
        problems.append(f"{total - grounded} target evidence quote(s) are not exact substrings of the notes")
    return problems


def load_records(path: Path, limit: int | None) -> list[dict]:
    if not path.is_file():
        raise SystemExit(f"Eval data not found: {path}. Generate it, or pass --data {FIXTURE_DATA}")
    records = []
    for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError as exc:
            raise SystemExit(f"{path}:{lineno}: not JSON ({exc.msg})")
        problems = check_record(record)
        if problems:
            raise SystemExit(f"{path}:{lineno} ({record.get('id')}): " + "; ".join(problems))
        records.append(record)
    return records[:limit] if limit else records


# ---------------------------------------------------------------- running

Caller = Callable[[dict, list[dict]], tuple[str, dict]]


def make_chat_caller(base_url: str, model: str, key: str | None, timeout: float) -> Caller:
    import requests  # imported here so pure scoring works without requests installed

    url = base_url.rstrip("/") + "/chat/completions"
    headers = {"Content-Type": "application/json"}
    if key:
        headers["Authorization"] = f"Bearer {key}"

    def call(_record: dict, messages: list[dict]) -> tuple[str, dict]:
        body = {"model": model, "messages": messages, "temperature": 0, "max_tokens": 2048}
        response = requests.post(url, headers=headers, json=body, timeout=timeout)
        if response.status_code >= 400:
            raise RuntimeError(f"HTTP {response.status_code} from model endpoint")
        data = response.json()
        content = data["choices"][0]["message"].get("content") or ""
        return content, data.get("usage") or {}

    return call


def target_reply(record: dict) -> dict:
    return {"fields": copy.deepcopy(record["target"]["fields"]), "evidence": copy.deepcopy(record["target"]["evidence"])}


def dry_run_caller(record: dict, _messages: list[dict]) -> tuple[str, dict]:
    return json.dumps(target_reply(record), ensure_ascii=False), {}


def wrong_value(prop: dict, value: Any) -> Any:
    if isinstance(value, bool):
        return not value
    if isinstance(value, (int, float)):
        return value + 1
    if "enum" in prop:
        return next((e for e in prop["enum"] if e != value), WRONG_VALUE)
    if isinstance(value, list):
        return [WRONG_VALUE]
    return WRONG_VALUE


def perturbed_caller(record: dict, _messages: list[dict]) -> tuple[str, dict]:
    """Target reply with its first field changed to a wrong value, so the score must drop below 100%."""
    reply = target_reply(record)
    props = schema_for(record["cancer"]).get("properties", {})
    name = next(iter(reply["fields"]))
    reply["fields"][name] = wrong_value(props.get(name, {}), reply["fields"][name])
    return json.dumps(reply, ensure_ascii=False), {}


def run_eval(records: list[dict], caller: Caller, concurrency: int) -> list[dict]:
    def one(record: dict) -> dict:
        inputs = record["input"]
        messages = prompt.build_messages(record["cancer"], inputs["todayNote"],
                                         inputs.get("earlierNotes", []), inputs["recordFacts"])
        usage_total: dict[str, int] = {}
        attempts, reply, error = 0, "", ""
        started = time.monotonic()
        try:
            attempts += 1
            reply, usage = caller(record, messages)
            _add_usage(usage_total, usage)
            if parse_reply(reply)[0] is None:  # retry once, showing the model its bad reply
                repair = messages + [{"role": "assistant", "content": reply},
                                     {"role": "user", "content": REPAIR_MESSAGE}]
                attempts += 1
                reply, usage = caller(record, repair)
                _add_usage(usage_total, usage)
        except Exception as exc:  # the error text never includes the key
            error = f"{type(exc).__name__}: {exc}"
        latency = time.monotonic() - started
        return evaluate_reply(record, reply, latency_s=latency, usage=usage_total,
                              attempts=attempts, error=error)

    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        return list(pool.map(one, records))


def _add_usage(total: dict[str, int], usage: dict) -> None:
    for key in ("prompt_tokens", "completion_tokens", "total_tokens"):
        if isinstance(usage.get(key), int):
            total[key] = total.get(key, 0) + usage[key]


# ---------------------------------------------------------------- output

def metric_lines(summary: dict) -> dict[str, tuple[str, Any, str]]:
    """Ordered metric key -> (label, value, format). Format is pct, num or int."""
    overall = summary["overall"]
    lines: dict[str, tuple[str, Any, str]] = {
        "records": ("Records", overall["records"], "int"),
        "overall": ("Field accuracy (all schema fields)", overall["field_accuracy"], "pct"),
        "overall_present": ("Field accuracy (fields present in target or reply)", overall["field_accuracy_present"], "pct"),
        "json_valid": ("JSON-valid rate", overall["json_valid_rate"], "pct"),
        "schema_valid": ("Schema-valid rate", overall["schema_valid_rate"], "pct"),
        "format_miss": ("Format misses (fenced JSON)", overall["format_miss_rate"], "pct"),
        "grounded": ("Evidence grounded rate", overall["evidence_grounded_rate"], "pct"),
        "latency": ("Mean latency per record (s)", overall["mean_latency_s"], "num"),
        "prompt_tokens": ("Prompt tokens, total", overall["prompt_tokens_total"], "int"),
        "completion_tokens": ("Completion tokens, total", overall["completion_tokens_total"], "int"),
        "errors": ("Call errors", overall["errors"], "int"),
    }
    for group, title in (("per_cancer", "cancer"), ("per_language", "language"), ("per_kind", "kind")):
        for value, metrics in summary.get(group, {}).items():
            lines[f"{title}:{value}"] = (f"Field accuracy, {title} {value}", metrics["field_accuracy"], "pct")
    for name, row in summary.get("per_field", {}).items():
        lines[f"field:{name}"] = (f"  {name}", row["accuracy"], "pct")
    return lines


def _format(value: Any, fmt: str) -> str:
    if value is None:
        return "n/a"
    if fmt == "pct":
        return f"{value * 100:.1f}%"
    if fmt == "num":
        return f"{value:.2f}"
    return str(value)


def render_table(headers: list[str], rows: list[tuple[str, list[Any], str]]) -> str:
    cells = [[label] + [_format(v, fmt) for v in values] + [delta(values, fmt)] for label, values, fmt in rows]
    head = ["Metric"] + headers + ["Delta (B-A)"]
    widths = [max(len(head[i]), *(len(row[i]) for row in cells)) for i in range(len(head))] if cells else [len(h) for h in head]
    out = ["  ".join(h.ljust(widths[i]) if i == 0 else h.rjust(widths[i]) for i, h in enumerate(head))]
    out.append("  ".join("-" * w for w in widths))
    for row in cells:
        out.append("  ".join(c.ljust(widths[i]) if i == 0 else c.rjust(widths[i]) for i, c in enumerate(row)))
    return "\n".join(out)


def delta(values: list[Any], fmt: str) -> str:
    if len(values) != 2 or values[0] is None or values[1] is None:
        return ""
    diff = values[1] - values[0]
    if fmt == "pct":
        return f"{diff * 100:+.1f} pp"
    return f"{diff:+.2f}" if fmt == "num" else f"{diff:+d}"


def compare_files(path_a: Path, path_b: Path) -> int:
    runs = [json.loads(p.read_text(encoding="utf-8")) for p in (path_a, path_b)]
    labels = [run.get("label", p.stem) for run, p in zip(runs, (path_a, path_b))]
    lines = [metric_lines(run["summary"]) for run in runs]
    keys = list(dict.fromkeys(list(lines[0]) + list(lines[1])))
    rows = []
    for key in keys:
        label, _, fmt = (lines[0].get(key) or lines[1].get(key))
        rows.append((label, [lines[0].get(key, (None, None, None))[1], lines[1].get(key, (None, None, None))[1]], fmt))
    print(render_table(labels, rows))
    return 0


def print_summary(label: str, summary: dict) -> None:
    rows = [(label_, [value], fmt) for label_, value, fmt in metric_lines(summary).values()]
    print(f"\n== {label}")
    print(render_table([label], rows))


# ---------------------------------------------------------------- self test

def self_test(records: list[dict]) -> int:
    if not records:
        print("FAIL: no records to self-test")
        return 1
    perfect = summarise(run_eval(records, dry_run_caller, concurrency=4))["overall"]
    perturbed = summarise(run_eval(records, perturbed_caller, concurrency=4))["overall"]
    checks = [
        ("targets validate against their schema", perfect["schema_valid_rate"] == 1.0),
        ("target reply scores 100% field accuracy", perfect["field_accuracy"] == 1.0),
        ("target reply is JSON-valid 100%", perfect["json_valid_rate"] == 1.0),
        ("target evidence is grounded 100%", perfect["evidence_grounded_rate"] in (None, 1.0)),
        ("perturbed reply scores below 100%", perturbed["field_accuracy"] is not None and perturbed["field_accuracy"] < 1.0),
    ]
    failed = False
    for name, ok in checks:
        failed |= not ok
        print(f"{'PASS' if ok else 'FAIL'}: {name}")
    print(f"  target reply accuracy {_format(perfect['field_accuracy'], 'pct')}, "
          f"perturbed reply accuracy {_format(perturbed['field_accuracy'], 'pct')}, records {len(records)}")
    return 1 if failed else 0


# ---------------------------------------------------------------- CLI

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Score a note -> Referral-fields model on eval records (Seam 2).")
    p.add_argument("--data", type=Path, default=DEFAULT_DATA, help="eval JSONL (default ml/data/eval.jsonl)")
    p.add_argument("--label", help="run name; also the default output file name")
    p.add_argument("--base-url", help="API root ending in /v1, e.g. https://HOST/v1")
    p.add_argument("--model", help="model id for the provider")
    p.add_argument("--key-file", type=Path, help="file holding the API key (read, never printed)")
    p.add_argument("--out", type=Path, help="results JSON (default ml/results/LABEL.json)")
    p.add_argument("--compare", nargs=2, type=Path, metavar=("A", "B"), help="side-by-side table of two results files; no model calls")
    p.add_argument("--limit", type=int, help="score only the first N records")
    p.add_argument("--concurrency", type=int, default=4)
    p.add_argument("--timeout", type=float, default=120.0, help="seconds per request")
    p.add_argument("--self-test", action="store_true", help="score the target against itself (must be 100%) and a perturbed copy (must be below)")
    p.add_argument("--dry-run", action="store_true", help="use the target as the model reply; no network")
    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.compare:
        return compare_files(*args.compare)
    if args.self_test:
        return self_test(load_records(args.data, None))

    if not args.dry_run and not (args.base_url and args.model):
        parser.error("a real run needs --base-url and --model (or use --dry-run, --self-test, --compare)")
    label = args.label or ("dry-run" if args.dry_run else None)
    if not label:
        parser.error("--label is required for a real run")

    records = load_records(args.data, args.limit)
    if args.dry_run:
        caller = dry_run_caller
    else:
        key = None
        if args.key_file:
            try:
                key = args.key_file.read_text(encoding="utf-8").strip()
            except OSError as exc:
                parser.error(f"cannot read --key-file: {exc.strerror}")
        caller = make_chat_caller(args.base_url, args.model, key, args.timeout)

    started = time.strftime("%Y-%m-%dT%H:%M:%S")
    results = run_eval(records, caller, args.concurrency)
    summary = summarise(results)

    out = args.out or (RESULTS_DIR / f"{label}.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "label": label,
        "model": None if args.dry_run else args.model,
        "base_url": None if args.dry_run else args.base_url,
        "data": str(args.data),
        "dry_run": args.dry_run,
        "started": started,
        "summary": summary,
        "records": results,
    }
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print_summary(label, summary)
    print(f"\nWrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
