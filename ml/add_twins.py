# /// script
# requires-python = ">=3.11"
# dependencies = ["requests>=2.31", "jsonschema>=4.21"]
# ///
"""Add the missing-language twin for every record in a Vitruvian JSONL file.

    uv run ml/add_twins.py FILE.jsonl [--avoid OTHER.jsonl ...]

A twin keeps the source record's split, cancer, kind, recordFacts (except a new
patientId) and target fields (identical values). Only the notes are translated,
and evidence is re-quoted from the translated notes:
  en record -> fi twin, id + "-fitr"
  fi record -> en twin, id + "-entr"
Records that are twins themselves are skipped, and so are records whose twin
id already exists, so a rerun adds nothing (idempotent). A twin keeps its source's
patient ID (same patient, other language); with --new-patient-ids it gets a fresh one
from SYN-550 up, unique within FILE and across the --avoid files' patient IDs.
Translations are cached by record content, so an edited record is translated again. Each quote must be an exact
substring of the translated notes (whitespace-normalised, as the validator
checks). Up to 2 regenerations, then the twin is dropped and a rerun retries it.
The file is rewritten through a temp file with the twins appended.
"""

import argparse
import hashlib
import json
import os

import requests
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ML_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ML_DIR))
from translate_fields import CACHE, MAX_ATTEMPTS, PRICE_IN_PER_M, PRICE_OUT_PER_M, TOK, WORKERS, call, norm  # noqa: E402

TARGET = {"fi": ("en", "-entr"), "en": ("fi", "-fitr")}
TWIN_SUFFIXES = ("-entr", "-fitr")
LANG = {"en": "English", "fi": "Finnish"}
STYLE = {
    "en": "natural English GP-note style (short, clinical)",
    "fi": "natural Finnish GP-note style (short, clinical; Finnish decimal commas are fine)",
}
FIRST_NEW_PID = 550

TWIN_RESP = {
    "type": "object",
    "properties": {
        "todayNote": {"type": "string"},
        "earlierNotes": {"type": "array", "items": {"type": "string"}},
        "evidence": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"key": {"type": "string"}, "quote": {"type": "string"}},
                "required": ["key", "quote"],
            },
        },
    },
    "required": ["todayNote", "earlierNotes", "evidence"],
}

TWIN_PROMPT = """You translate synthetic GP referral notes from {src} into {tgt}, in {style}.
Input: todayNote, earlierNotes (with dates), and evidenceKeys mapping each key to {{"fieldValue": ..., "sourceQuote": ...}}.
Produce:
1. todayNote and earlierNotes: a faithful translation into {tgt}. Keep every date, number, unit, drug name and abbreviation exact. Keep the same number of earlier notes, in the same order. Do not add or remove facts.
2. evidence: for each evidence key, copy a phrase of 3 to 25 words, word for word, from your translated todayNote or one of your translated earlierNotes that supports the fieldValue. The phrase must be an exact, character-for-character substring of that translated note. Never quote the {src} text.
Output JSON only.

INPUT:
"""


def is_twin(rec: dict) -> bool:
    return rec["id"].endswith(TWIN_SUFFIXES)


def finalize(raw: dict, old_pid: str, new_pid: str):
    t = raw["todayNote"].replace(old_pid, new_pid)
    e = [x.replace(old_pid, new_pid) for x in raw["earlierNotes"]]
    ev = {k: q.replace(old_pid, new_pid) for k, q in raw["evidence"].items()}
    return t, e, ev


def make_twin(rec: dict, new_pid: str):
    src = rec["language"]
    tgt, suffix = TARGET[src]
    old_pid = rec["input"]["recordFacts"]["patientId"]
    fields = rec["target"]["fields"]
    evidence = rec["target"]["evidence"]
    earlier = rec["input"]["earlierNotes"]
    payload = json.dumps(
        {
            "todayNote": rec["input"]["todayNote"],
            "earlierNotes": [n["note"] for n in earlier],
            "evidenceKeys": {k: {"fieldValue": fields[k], "sourceQuote": evidence[k]} for k in evidence},
        },
        ensure_ascii=False,
    )
    # Keyed on content, not id: an audited record with edited notes or evidence must not reuse a stale translation.
    content_hash = hashlib.sha256(payload.encode()).hexdigest()[:16]
    cache = CACHE / "twins" / f"{rec['id']}{suffix}.{content_hash}.json"
    if cache.exists():
        raw = json.loads(cache.read_text())
    else:
        prompt = TWIN_PROMPT.format(src=LANG[src], tgt=LANG[tgt], style=STYLE[tgt]) + payload
        raw = None
        for _ in range(MAX_ATTEMPTS):
            try:
                out = call(prompt, TWIN_RESP)
            except (ValueError, RuntimeError, KeyError, requests.RequestException):
                continue  # runaway or truncated JSON from Gemini, or a failed request: retry, then drop
            if len(out["earlierNotes"]) != len(earlier) or not out["todayNote"].strip():
                continue
            if not all(x.strip() for x in out["earlierNotes"]):
                continue
            quotes = {x["key"]: x["quote"] for x in out["evidence"]}
            if set(evidence) - set(quotes):
                continue
            cand = {"todayNote": out["todayNote"], "earlierNotes": out["earlierNotes"],
                    "evidence": {k: quotes[k] for k in evidence}}
            t, e, ev = finalize(cand, old_pid, new_pid)
            corpus = norm(" ".join([t] + e))
            if all(norm(q) and norm(q) in corpus for q in ev.values()):
                raw = cand
                break
        if raw is None:
            return None
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps(raw, ensure_ascii=False))
    t, e, ev = finalize(raw, old_pid, new_pid)
    twin = json.loads(json.dumps(rec))
    twin["id"] = rec["id"] + suffix
    twin["language"] = tgt
    twin["input"]["todayNote"] = t
    twin["input"]["earlierNotes"] = [dict(old, note=new) for old, new in zip(earlier, e)]
    twin["input"]["recordFacts"]["patientId"] = new_pid
    twin["target"]["fields"]["patientId"] = new_pid
    twin["target"]["evidence"] = ev
    return twin


def read_jsonl(path: Path) -> list[dict]:
    return [json.loads(l) for l in path.read_text().splitlines() if l.strip()]


def next_pid(taken: set) -> str:
    n = FIRST_NEW_PID
    while f"SYN-{n:03d}" in taken:
        n += 1
    if n > 999:
        raise SystemExit("ran out of SYN ids")
    return f"SYN-{n:03d}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("file", type=Path)
    ap.add_argument("--avoid", action="append", default=[], type=Path,
                    help="other JSONL file whose patient IDs must not be reused")
    ap.add_argument("--new-patient-ids", action="store_true",
                    help="give each twin a fresh SYN id (default: keep the source's id, it is the same patient)")
    args = ap.parse_args()

    recs = read_jsonl(args.file)
    ids = {r["id"] for r in recs}
    taken = {r["input"]["recordFacts"]["patientId"] for r in recs}
    for path in args.avoid:
        taken |= {r["input"]["recordFacts"]["patientId"] for r in read_jsonl(path)}

    jobs = []
    for r in recs:
        if is_twin(r) or r["language"] not in TARGET:
            continue
        _, suffix = TARGET[r["language"]]
        if r["id"] + suffix in ids:
            continue
        if args.new_patient_ids:
            pid = next_pid(taken)
            taken.add(pid)
        else:
            pid = r["input"]["recordFacts"]["patientId"]  # same patient, other language
        jobs.append((r, pid))

    (CACHE / "twins").mkdir(parents=True, exist_ok=True)
    new, dropped = [], []
    with ThreadPoolExecutor(WORKERS) as ex:
        futures = [(ex.submit(make_twin, r, pid), r) for r, pid in jobs]
        for fut, r in futures:
            res = fut.result()
            if res is None:
                dropped.append(r["id"])
            else:
                new.append(res)

    if new:
        out_recs = recs + new
        tmp = args.file.with_name(args.file.name + ".tmp")
        tmp.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in out_recs))
        os.replace(tmp, args.file)
    else:
        out_recs = recs

    by_lang = lambda rs: {lg: sum(r["language"] == lg for r in rs) for lg in ("en", "fi")}  # noqa: E731
    cost = TOK["in"] / 1e6 * PRICE_IN_PER_M + TOK["out"] / 1e6 * PRICE_OUT_PER_M
    print(f"before: {len(recs)} records {by_lang(recs)}")
    print(f"created: {len(new)} twins {by_lang(new)}, dropped: {len(dropped)} {dropped}")
    print(f"after: {len(out_recs)} records {by_lang(out_recs)}")
    print(f"gemini calls this run: {TOK['calls']}, in tokens: {TOK['in']}, out tokens: {TOK['out']}, est cost USD: {cost:.3f}")
    return 0 if not dropped else 2


if __name__ == "__main__":
    sys.exit(main())
