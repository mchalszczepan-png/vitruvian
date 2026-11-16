"""Validate data records against ml/CONTRACT.md.

Usage: uv run --with jsonschema ml/validate_data.py FILE.jsonl [--against-eval ml/data/eval.jsonl]
Exit code 1 if any record fails. Prints one line per failure, never the note text in full.
"""
import argparse
import copy
import json
import re
import sys
from pathlib import Path

from jsonschema import Draft202012Validator

sys.path.insert(0, str(Path(__file__).parent))
from prompt import load_schema  # noqa: E402

DEMO_IDS = {"SYN-001", "SYN-002", "SYN-003"}


def normalise_ws(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def shingles(text: str, n: int = 5) -> set:
    words = re.findall(r"\w+", text.lower())
    return {tuple(words[i : i + n]) for i in range(max(0, len(words) - n + 1))}


def dummy_for(prop: dict):
    """Stand-in for a required field the notes do not state (target null), so the rest still validates."""
    if "const" in prop:
        return prop["const"]
    if "enum" in prop:
        return prop["enum"][0]
    t = prop.get("type")
    t = t[0] if isinstance(t, list) else t
    return {"string": "x", "integer": 0, "number": 0, "boolean": False, "array": [], "object": None}.get(t, "x")


def check_record(rec: dict) -> list[str]:
    errs = []
    for key in ("id", "split", "synthetic", "language", "cancer", "kind", "input", "target"):
        if key not in rec:
            errs.append(f"missing key {key}")
    if errs:
        return errs
    if rec["synthetic"] is not True:
        errs.append("synthetic is not true")
    if rec["language"] not in ("en", "fi"):
        errs.append("language not en/fi")
    if rec["kind"] not in ("cancer", "control"):
        errs.append("kind not cancer/control")
    schema = load_schema(rec["cancer"])
    facts = rec["input"].get("recordFacts", {})
    pid = facts.get("patientId", "")
    if not re.fullmatch(r"SYN-[0-9]{3}", pid or "") or pid in DEMO_IDS:
        errs.append(f"bad patientId {pid!r}")
    fields = rec["target"].get("fields", {})
    filled = copy.deepcopy(fields)
    # A field made required by an if/then clause (e.g. fitDone true -> fitValue) is still "required":
    # the prompt says unknown required values are null, so treat it like a top-level required field.
    required = list(schema.get("required", []))
    for clause in schema.get("allOf", []):
        cond = clause.get("if", {})
        holds = all(
            name in fields and fields[name] == spec.get("const")
            for name, spec in cond.get("properties", {}).items()
            if "const" in spec
        )
        if holds:
            required += [n for n in clause.get("then", {}).get("required", []) if n in fields]
    for name in required:
        if filled.get(name) is None:
            filled[name] = dummy_for(schema["properties"][name])
    for e in Draft202012Validator(schema).iter_errors(filled):
        errs.append(f"schema: {'/'.join(map(str, e.path))}: {e.message[:120]}")
    notes = [rec["input"].get("todayNote", "")] + [n.get("note", "") for n in rec["input"].get("earlierNotes", [])]
    corpus = normalise_ws(" ".join(notes))
    for field, words in rec["target"].get("evidence", {}).items():
        if field not in fields:
            errs.append(f"evidence for absent field {field}")
        elif not isinstance(words, str) or normalise_ws(words) not in corpus:
            errs.append(f"evidence not an exact quote: {field}")
    return errs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--against-eval", help="fail if any record is a near-duplicate of an eval note")
    args = ap.parse_args()
    recs = [json.loads(l) for l in Path(args.file).read_text().splitlines() if l.strip()]
    eval_sh = []
    if args.against_eval:
        for l in Path(args.against_eval).read_text().splitlines():
            if l.strip():
                e = json.loads(l)
                eval_sh.append(shingles(e["input"]["todayNote"]))
    seen, bad = set(), 0
    for rec in recs:
        errs = check_record(rec)
        if rec.get("id") in seen:
            errs.append("duplicate id")
        seen.add(rec.get("id"))
        if eval_sh:
            s = shingles(rec["input"]["todayNote"])
            worst = max((len(s & e) / max(1, len(s | e)) for e in eval_sh), default=0)
            if worst >= 0.5:
                errs.append(f"near-duplicate of an eval note (jaccard {worst:.2f})")
        for e in errs:
            print(f"{rec.get('id')}: {e}")
        bad += bool(errs)
    print(f"{len(recs)} records, {bad} failing")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
