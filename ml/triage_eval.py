#!/usr/bin/env python3
"""Cancer pointer (triage) eval: does the model point to the right cancer, or none, with a sensible 0-10 risk?

Research prototype. All notes and patients are synthetic.

Scores a chat-completions model (prompted Gemma or the triage LoRA) on ml/data/triage/eval.jsonl.
Truth is the cancer each synthetic patient was generated with ("none" for controls). The notes were
redacted first (ml/triage_label.py), so they no longer say "2WW lung cancer referral".

  uv run --with requests python3 ml/triage_eval.py --label triage-prompted-e4b \
      --base-url https://HOST/v1 --model MODEL_ID --key-file PATH_TO_KEY_FILE
  uv run --with requests python3 ml/triage_eval.py --compare ml/results/a.json ml/results/b.json
  python3 ml/triage_eval.py --self-test
  python3 ml/triage_eval.py --dry-run --label plumbing

Metrics (overall and per language):
  accuracy      4-way: lung / colorectal / ovarian / none matches the truth (primary)
  sensitivity   cancer patients flagged (suspectedCancer != none)
  specificity   control patients left at none
  right_cancer  of cancer patients flagged, share pointing at the right cancer
  auroc_risk    AUROC of riskGradient, cancer vs control (ranking quality of the risk number)
  auroc_truth   AUROC of scores[true cancer] for that cancer's patients vs controls, pooled
  score_mae     mean |score - target score| over the 3 cancers (target = Gemini labels in triage/, published-PPV
                scores in triage-ppv/)
  scores_exact  all 3 scores equal the target; truth_score_mae: |score - target| for the true cancer (or the top
                score for a control), the number the GP sees
  --prompt rubric|ppv picks triage_prompt.SYSTEM or SYSTEM_PPV (default: ppv for data under triage-ppv/)
  valid_json, grounded (evidence copied from the notes), latency
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from statistics import mean
from typing import Any

ML_DIR = Path(__file__).resolve().parent
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))
import triage_prompt  # noqa: E402
from eval import Caller, make_chat_caller, normalise_text  # noqa: E402

DEFAULT_DATA = ML_DIR / "data" / "triage" / "eval.jsonl"
RESULTS_DIR = ML_DIR / "results"
CANCERS = triage_prompt.CANCERS
CHOICES = triage_prompt.CHOICES
FENCE_RE = re.compile(r"\A\s*```(?:json)?\s*(.*?)\s*```\s*\Z", re.DOTALL | re.IGNORECASE)
REPAIR_MESSAGE = ("Your reply was not one JSON object with suspectedCancer, riskGradient, scores, riskReason and "
                  "evidence. Reply again with only that JSON object: no prose, no code fence.")


def parse_reply(content: Any) -> tuple[dict | None, str]:
    if not isinstance(content, str):
        return None, "reply is not a string"
    m = FENCE_RE.match(content)
    body = m.group(1) if m else content
    try:
        obj = json.loads(body)
    except json.JSONDecodeError as exc:
        return None, f"invalid JSON: {exc.msg}"
    if not isinstance(obj, dict):
        return None, "reply is not an object"
    if obj.get("suspectedCancer") not in CHOICES:
        return None, f"bad suspectedCancer {obj.get('suspectedCancer')!r}"
    scores = obj.get("scores")
    if not isinstance(scores, dict) or any(not isinstance(scores.get(c), (int, float)) for c in CANCERS):
        return None, "scores missing or not numbers"
    risk = obj.get("riskGradient")
    if not isinstance(risk, (int, float)):
        return None, "riskGradient missing"
    clamp = lambda v: max(0.0, min(10.0, float(v)))  # noqa: E731
    return {
        "suspectedCancer": obj["suspectedCancer"],
        "riskGradient": clamp(risk),
        "scores": {c: clamp(scores[c]) for c in CANCERS},
        "riskReason": obj.get("riskReason") if isinstance(obj.get("riskReason"), str) else "",
        "evidence": [e for e in obj.get("evidence", []) if isinstance(e, str)] if isinstance(obj.get("evidence"), list) else [],
    }, ""


def record_notes(record: dict) -> list[str]:
    inp = record["input"]
    return [inp["todayNote"]] + [n["note"] for n in inp.get("earlierNotes", [])]


def evaluate_reply(record: dict, reply: str, *, latency_s: float = 0.0, attempts: int = 1, error: str = "") -> dict:
    parsed, problem = parse_reply(reply) if not error else (None, error)
    out = {"id": record["id"], "language": record["language"], "truth": record["truth"],
           "latency_s": round(latency_s, 2), "attempts": attempts, "valid": parsed is not None,
           "problem": problem, "reply": reply[:2000] if isinstance(reply, str) else ""}
    if parsed is None:
        return out
    notes = normalise_text("\n".join(record_notes(record)))
    grounded = sum(1 for e in parsed["evidence"] if e.strip() and normalise_text(e) in notes)
    teacher = record["target"]["scores"]
    out.update({
        "predicted": parsed["suspectedCancer"],
        "risk": parsed["riskGradient"],
        "scores": parsed["scores"],
        "riskReason": parsed["riskReason"],
        "correct": parsed["suspectedCancer"] == record["truth"],
        "evidence_total": len(parsed["evidence"]),
        "evidence_grounded": grounded,
        "score_abs_err": mean(abs(parsed["scores"][c] - teacher[c]) for c in CANCERS),
        "scores_exact": all(round(parsed["scores"][c]) == teacher[c] for c in CANCERS),
        "truth_score_abs_err": (abs(parsed["scores"][record["truth"]] - teacher[record["truth"]])
                                if record["truth"] != "none"
                                else abs(max(parsed["scores"].values()) - max(teacher.values()))),
    })
    return out


def auroc(pos: list[float], neg: list[float]) -> float | None:
    """Probability a random positive outranks a random negative (ties count half)."""
    if not pos or not neg:
        return None
    wins = sum((p > n) + 0.5 * (p == n) for p in pos for n in neg)
    return wins / (len(pos) * len(neg))


def _rate(num: int, den: int) -> float | None:
    return num / den if den else None


def metrics(results: list[dict]) -> dict:
    """Invalid replies count as wrong (and as none for the flag rates; risk 0 for AUROC)."""
    n = len(results)
    cancer = [r for r in results if r["truth"] != "none"]
    control = [r for r in results if r["truth"] == "none"]
    pred = lambda r: r.get("predicted", "none")  # noqa: E731
    risk = lambda r: r.get("risk", 0.0)  # noqa: E731
    flagged = [r for r in cancer if pred(r) != "none"]
    truth_pos = [r["scores"][r["truth"]] if r["valid"] else 0.0 for r in cancer]
    truth_neg = [r["scores"][c] if r["valid"] else 0.0 for r in control for c in CANCERS]
    valid = [r for r in results if r["valid"]]
    return {
        "n": n, "n_cancer": len(cancer), "n_control": len(control),
        "accuracy": _rate(sum(pred(r) == r["truth"] for r in results), n),
        "sensitivity": _rate(len(flagged), len(cancer)),
        "specificity": _rate(sum(pred(r) == "none" for r in control), len(control)),
        "right_cancer": _rate(sum(pred(r) == r["truth"] for r in flagged), len(flagged)),
        "auroc_risk": auroc([risk(r) for r in cancer], [risk(r) for r in control]),
        "auroc_truth": auroc(truth_pos, truth_neg),
        "score_mae": mean(r["score_abs_err"] for r in valid) if valid else None,
        "scores_exact": _rate(sum(r["scores_exact"] for r in valid), n),
        "truth_score_mae": mean(r["truth_score_abs_err"] for r in valid) if valid else None,
        "valid_json": _rate(len(valid), n),
        "grounded": _rate(sum(r["evidence_grounded"] for r in valid), sum(r["evidence_total"] for r in valid)),
        "mean_latency_s": mean(r["latency_s"] for r in results) if results else None,
        "errors": sum(1 for r in results if r["problem"].startswith(("HTTP", "RuntimeError", "Connection", "Read", "Timeout"))),
    }


def summarise(results: list[dict]) -> dict:
    by_lang = {lang: metrics([r for r in results if r["language"] == lang]) for lang in ("en", "fi")}
    by_truth = {t: _rate(sum(r.get("predicted") == t for r in results if r["truth"] == t),
                         sum(r["truth"] == t for r in results)) for t in CHOICES}
    confusion = {t: {p: sum(1 for r in results if r["truth"] == t and r.get("predicted", "invalid") == p)
                     for p in (*CHOICES, "invalid")} for t in CHOICES}
    return {"overall": metrics(results), "by_language": by_lang, "recall_by_truth": by_truth, "confusion": confusion}


def run_eval(records: list[dict], caller: Caller, concurrency: int, system: str = triage_prompt.SYSTEM) -> list[dict]:
    def one(record: dict) -> dict:
        inp = record["input"]
        messages = triage_prompt.build_triage_messages(inp["todayNote"], inp.get("earlierNotes", []), inp["patient"],
                                                       system)
        attempts, reply, error = 0, "", ""
        t0 = time.monotonic()
        try:
            attempts += 1
            reply, _ = caller(record, messages)
            if parse_reply(reply)[0] is None:
                attempts += 1
                reply, _ = caller(record, messages + [{"role": "assistant", "content": reply},
                                                      {"role": "user", "content": REPAIR_MESSAGE}])
        except Exception as exc:  # error text never includes the key
            error = f"{type(exc).__name__}: {exc}"
        return evaluate_reply(record, reply, latency_s=time.monotonic() - t0, attempts=attempts, error=error)

    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        return list(pool.map(one, records))


def load_records(path: Path, limit: int | None) -> list[dict]:
    recs = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    assert all(r.get("task") == "triage" for r in recs), f"{path} is not triage data"
    return recs[:limit] if limit else recs


def target_caller(record: dict, _m: list[dict]) -> tuple[str, dict]:
    return triage_prompt.target_json(record["target"]), {}


def wrong_caller(record: dict, _m: list[dict]) -> tuple[str, dict]:
    t = dict(record["target"])
    t["suspectedCancer"] = next(c for c in CHOICES if c != record["truth"])
    t["riskGradient"] = 10 - t["riskGradient"]
    return triage_prompt.target_json(t), {}


LINES = [("accuracy", "4-way accuracy", "pct"), ("sensitivity", "cancer flagged", "pct"),
         ("specificity", "control left at none", "pct"), ("right_cancer", "right cancer when flagged", "pct"),
         ("auroc_risk", "AUROC risk (cancer vs control)", "f3"), ("auroc_truth", "AUROC true-cancer score", "f3"),
         ("score_mae", "score MAE vs target", "f2"), ("truth_score_mae", "shown-score MAE vs target", "f2"),
         ("scores_exact", "all 3 scores exact", "pct"), ("valid_json", "valid JSON", "pct"),
         ("grounded", "evidence grounded", "pct"), ("mean_latency_s", "mean latency s", "f2"), ("errors", "call errors", "int")]


def fmt(v: Any, kind: str) -> str:
    if v is None:
        return "-"
    return {"pct": f"{100 * v:.1f}%", "f3": f"{v:.3f}", "f2": f"{v:.2f}", "int": str(v)}[kind]


def print_summary(label: str, s: dict) -> None:
    o = s["overall"]
    print(f"\n{label}: {o['n']} records ({o['n_cancer']} cancer, {o['n_control']} control)")
    for key, name, kind in LINES:
        en, fi = s["by_language"]["en"].get(key), s["by_language"]["fi"].get(key)
        print(f"  {name:32} {fmt(o[key], kind):>8}   en {fmt(en, kind):>8}  fi {fmt(fi, kind):>8}")
    print("  recall by truth: " + ", ".join(f"{t} {fmt(v, 'pct')}" for t, v in s["recall_by_truth"].items()))
    print("  confusion (truth -> predicted): " + json.dumps(s["confusion"]))


def compare(a: Path, b: Path) -> int:
    sa, sb = (json.loads(p.read_text())["summary"]["overall"] for p in (a, b))
    print(f"{'metric':32} {a.stem:>24} {b.stem:>24}")
    for key, name, kind in LINES:
        print(f"{name:32} {fmt(sa.get(key), kind):>24} {fmt(sb.get(key), kind):>24}")
    return 0


def self_test(records: list[dict]) -> int:
    good = summarise(run_eval(records, target_caller, 8))["overall"]
    bad = summarise(run_eval(records, wrong_caller, 8))["overall"]
    ok = good["accuracy"] == 1.0 and good["valid_json"] == 1.0 and good["score_mae"] == 0 and bad["accuracy"] == 0.0
    print(f"self-test target: acc {good['accuracy']}, mae {good['score_mae']}, grounded {fmt(good['grounded'], 'pct')}; "
          f"wrong: acc {bad['accuracy']} -> {'PASS' if ok else 'FAIL'}")
    return 0 if ok else 1


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Score a cancer-pointer model on triage eval records.")
    p.add_argument("--data", type=Path, default=DEFAULT_DATA)
    p.add_argument("--label")
    p.add_argument("--base-url")
    p.add_argument("--model")
    p.add_argument("--key-file", type=Path)
    p.add_argument("--out", type=Path)
    p.add_argument("--compare", nargs=2, type=Path, metavar=("A", "B"))
    p.add_argument("--limit", type=int)
    p.add_argument("--concurrency", type=int, default=4)
    p.add_argument("--timeout", type=float, default=120.0)
    p.add_argument("--self-test", action="store_true")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--prompt", choices=sorted(triage_prompt.SYSTEMS), help="default: ppv for triage-ppv data")
    a = p.parse_args(argv)
    prompt = a.prompt or ("ppv" if a.data.parent.name == "triage-ppv" else "rubric")

    if a.compare:
        return compare(*a.compare)
    records = load_records(a.data, a.limit)
    if a.self_test:
        return self_test(records)
    assert a.label, "--label is required"
    if a.dry_run:
        caller = target_caller
    else:
        assert a.base_url and a.model, "--base-url and --model are required"
        key = a.key_file.read_text().strip() if a.key_file else None
        caller = make_chat_caller(a.base_url, a.model, key, a.timeout)
    t0 = time.time()
    results = run_eval(records, caller, a.concurrency, triage_prompt.SYSTEMS[prompt])
    summary = summarise(results)
    out = a.out or RESULTS_DIR / f"{a.label}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"label": a.label, "model": a.model, "data": str(a.data), "task": "triage",
                               "prompt": prompt, "wall_s": round(time.time() - t0, 1), "summary": summary, "results": results},
                              indent=2, ensure_ascii=False))
    print_summary(a.label, summary)
    print(f"\nwrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
