#!/usr/bin/env python3
"""Build the cancer-pointer (triage) data from the existing synthetic records.

Research prototype. All notes and patients are synthetic.

    uv run --with requests python3 ml/triage_label.py            # all pairs (cached, reruns are free)
    uv run --with requests python3 ml/triage_label.py --limit 4  # smoke test

The existing notes were written as referral letters, so most of them state the GP's conclusion
("Plan: 2WW urgent lung cancer referral"). A pointer model trained on those would just read the answer.
For each record and its language twin, one Gemini call:
  1. deletes every sentence or clause that states a cancer suspicion, a diagnosis, a referral or its urgency,
     keeping symptoms, history, exam and test results word for word;
  2. scores how strongly the remaining notes (plus age and sex) point to lung, colorectal and ovarian cancer (0-10),
     with a one-line English reason and exact quotes from the redacted notes in each language.
The true answer (which cancer, or none for a control) comes from how the record was generated, not from Gemini.
Gemini is told it, so its scores agree with it; the scores are the teacher's judgement, the answer is ground truth.

Writes ml/data/triage/{train,eval}.jsonl. Triage eval = the 50 field-eval notes + 15 control pairs held out of
train (5 per cancer), so false alarms are measured on 36 no-cancer notes, not 6.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import random
import re
import sys
import threading
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import requests

ML_DIR = Path(__file__).resolve().parent
DATA = ML_DIR / "data"
OUT = DATA / "triage"
CACHE = ML_DIR / ".cache" / "triage"  # gitignored; Gemini replies, so reruns cost nothing
KEY_PATH = Path("/home/michal/.t3/userdata/secrets/files/57225e16f5746ddf45988e4595c74bfd")
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions"
MODEL = "gemini-3.5-flash"
WORKERS = 8
MAX_ATTEMPTS = 3
CANCERS = ("lung", "colorectal", "ovarian")
EXTRA_EVAL_CONTROL_PAIRS = 5  # per cancer, moved from train to the triage eval
SEED = 7

# Words that give the answer away. Checked on every redacted note (both languages).
LEAK = re.compile(
    r"cancer|malignan|carcinom|tumou?r|neoplas|oncolog|metasta|2\s?ww|two[- ]week|referr|\brefer\b|"
    r"syöp|maligni|kasvain|karsinoom|onkolog|etäpesäk|lähete|lähett|lähettä",
    re.I,
)

LOCK = threading.Lock()
TOK = {"calls": 0, "in": 0, "out": 0}


def base_id(rec_id: str) -> str:
    for suffix in ("-fitr", "-entr"):
        if rec_id.endswith(suffix):
            return rec_id[: -len(suffix)]
    return rec_id


NOTES_SCHEMA = {
    "type": "object",
    "properties": {
        "todayNote": {"type": "string"},
        "earlierNotes": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["todayNote", "earlierNotes"],
}
REPLY_SCHEMA = {
    "type": "object",
    "properties": {
        "en": NOTES_SCHEMA,
        "fi": NOTES_SCHEMA,
        "scores": {
            "type": "object",
            "properties": {c: {"type": "integer"} for c in CANCERS},
            "required": list(CANCERS),
        },
        "riskReason": {"type": "string"},
        "evidenceEn": {"type": "array", "items": {"type": "string"}},
        "evidenceFi": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["en", "fi", "scores", "riskReason", "evidenceEn", "evidenceFi"],
}

PROMPT = """You prepare training data for a research prototype (made-up patients only). A GP model will read visit notes
BEFORE the GP has decided anything, and point out whether the symptoms suggest lung, colorectal or ovarian cancer.

Below are the same patient's notes in English and in Finnish (one is a translation of the other).

TASK 1 - redact, both languages. Delete every sentence or clause that states or hints at the GP's conclusion: a cancer
suspicion or diagnosis, words like cancer/malignancy/tumour (syöpä, kasvain, ...), a referral, its urgency (2WW, urgent),
the patient's worry about cancer, or a plan that names a cancer pathway. Keep everything else WORD FOR WORD: dates,
symptoms, durations, history, smoking, exam findings, test results, and neutral plans (e.g. "FBC requested", "review in
2 weeks"). Only delete; never add or reword. Keep the same number of earlier notes, in the same order. If a sentence mixes
a fact with the conclusion, keep the fact part only when that needs no rewording; otherwise drop the sentence.

TASK 2 - score. Using ONLY the redacted notes plus age and sex, score 0-10 how strongly they point to each cancer, for a GP
deciding whether to look closer (NICE NG12-style red flags):
  0-1 nothing pointing to it; 2-3 vague, common, or a clear benign explanation; 4-5 one red flag or a persistent
  unexplained symptom in the right age group; 6-7 several red flags, or one red flag that persists or recurs across visits;
  8-10 strong signs (e.g. haemoptysis with abnormal chest X-ray, rectal mass or FIT well above threshold, ascites or
  pelvic mass with raised CA-125).
Ovarian is always 0 for a male patient.
The true answer for this made-up case is: {truth}. Your scores must agree with it: {rule}
If the redacted notes are weak, score honestly low-to-mid rather than inventing strength.

TASK 3 - explain. riskReason: one English line (max 30 words) naming the findings that drive the top score.
evidenceEn / evidenceFi: 1 to 4 short phrases (3 to 20 words each) copied character for character from YOUR redacted
notes in that language, supporting the reason. Never quote deleted text.

Return JSON only.

Age: {age}. Sex: {sex}.
ENGLISH NOTES:
{en}
FINNISH NOTES:
{fi}
"""


def call(prompt: str) -> dict:
    key = KEY_PATH.read_text().strip()  # read in code only, never printed
    body = {
        "model": MODEL,
        "input": prompt,
        "store": False,
        "generation_config": {"temperature": 0.2},
        "response_format": {"type": "text", "mime_type": "application/json", "schema": REPLY_SCHEMA},
    }
    response = None
    for attempt in range(6):
        try:
            response = requests.post(ENDPOINT, headers={"Content-Type": "application/json", "x-goog-api-key": key}, json=body, timeout=300)
        except requests.RequestException:
            time.sleep(min(30, 2 ** attempt))
            continue
        if response.status_code in (429, 500, 502, 503, 504):
            time.sleep(min(30, 2 ** attempt + random.random()))
            continue
        break
    if response is None or response.status_code != 200:
        raise RuntimeError(f"HTTP {getattr(response, 'status_code', 'none')}")
    data = response.json()
    usage = data.get("usage") or {}
    with LOCK:
        TOK["calls"] += 1
        TOK["in"] += usage.get("total_input_tokens", 0)
        TOK["out"] += usage.get("total_output_tokens", 0) + usage.get("total_thought_tokens", 0)
    text = "".join(
        part.get("text", "")
        for step in data.get("steps", [])
        if step.get("type") == "model_output"
        for part in step.get("content", [])
        if part.get("type") == "text"
    )
    return json.loads(text)


def notes_text(rec: dict) -> str:
    lines = [f"[earlier {i + 1}, {n['date']}] {n['note']}" for i, n in enumerate(rec["input"]["earlierNotes"])]
    lines.append(f"[today] {rec['input']['todayNote']}")
    return "\n".join(lines)


def truth_of(rec: dict) -> str:
    return rec["cancer"] if rec["kind"] == "cancer" else "none"


def check(reply: dict, pair: dict, truth: str, sex: str) -> str | None:
    """Return a problem string, or None when the reply is usable."""
    for lang in ("en", "fi"):
        rec, red = pair[lang], reply[lang]
        if len(red["earlierNotes"]) != len(rec["input"]["earlierNotes"]):
            return f"{lang}: earlier note count changed"
        texts = [red["todayNote"], *red["earlierNotes"]]
        if not red["todayNote"].strip():
            return f"{lang}: today note empty"
        for t in texts:
            m = LEAK.search(t)
            if m:
                return f"{lang}: leak word {m.group(0)!r}"
        joined = "\n".join(texts)
        quotes = reply["evidenceEn" if lang == "en" else "evidenceFi"]
        if not quotes:
            return f"{lang}: no evidence"
        for q in quotes:
            if q not in joined:
                return f"{lang}: evidence not in redacted notes: {q[:60]!r}"
    s = reply["scores"]
    if any(not 0 <= s[c] <= 10 for c in CANCERS):
        return "score out of range"
    if sex == "male" and s["ovarian"] != 0:
        return "ovarian score for a male"
    if truth == "none":
        if max(s.values()) > 4:
            return f"control scored {max(s.values())}"
    else:
        if s[truth] < 3 or any(s[c] >= s[truth] for c in CANCERS if c != truth):
            return f"scores {s} disagree with truth {truth}"
    return None


def label_pair(pair: dict) -> dict | None:
    en, fi = pair["en"], pair["fi"]
    truth = truth_of(en)
    facts = en["input"]["recordFacts"]
    rule = (
        "every score must be 4 or lower (this is a benign case)." if truth == "none"
        else f"{truth} must have the highest score (at least 3) and be strictly above the other two."
    )
    prompt = PROMPT.format(truth=f"{truth} cancer" if truth != "none" else "no cancer (benign)", rule=rule,
                           age=facts.get("age"), sex=facts.get("sex"), en=notes_text(en), fi=notes_text(fi))
    CACHE.mkdir(parents=True, exist_ok=True)
    problem = None
    for attempt in range(MAX_ATTEMPTS):
        cache = CACHE / (hashlib.sha256(f"{MODEL}|{attempt}|{prompt}".encode()).hexdigest()[:24] + ".json")
        if cache.is_file():
            reply = json.loads(cache.read_text())
        else:
            try:
                reply = call(prompt)
            except Exception as exc:  # noqa: BLE001 - one bad call drops one pair, logged
                problem = f"call failed: {type(exc).__name__}"
                continue
            cache.write_text(json.dumps(reply, ensure_ascii=False))
        problem = check(reply, pair, truth, facts.get("sex"))
        if problem is None:
            return {"reply": reply, "truth": truth}
    print(f"drop {base_id(en['id'])}: {problem}", file=sys.stderr)
    return None


def to_record(pair: dict, lab: dict, lang: str, split: str) -> dict:
    src, reply = pair[lang], lab["reply"]
    red = reply[lang]
    scores = {c: int(reply["scores"][c]) for c in CANCERS}
    earlier = [{"date": n["date"], "note": t} for n, t in zip(src["input"]["earlierNotes"], red["earlierNotes"])]
    facts = src["input"]["recordFacts"]
    return {
        "id": src["id"],
        "split": split,
        "synthetic": True,
        "task": "triage",
        "language": lang,
        "truth": lab["truth"],
        "source_cancer": src["cancer"],
        "kind": src["kind"],
        "input": {
            "todayNote": red["todayNote"],
            "earlierNotes": earlier,
            "patient": {"age": facts.get("age"), "sex": facts.get("sex")},
        },
        "target": {
            "suspectedCancer": lab["truth"],
            "riskGradient": max(scores.values()) if lab["truth"] == "none" else scores[lab["truth"]],
            "scores": scores,
            "riskReason": reply["riskReason"].strip(),
            "evidence": reply["evidenceEn" if lang == "en" else "evidenceFi"],
        },
    }


def pairs_of(records: list[dict]) -> dict[str, dict]:
    groups = defaultdict(dict)
    for r in records:
        groups[base_id(r["id"])][r["language"]] = r
    return {k: v for k, v in groups.items() if set(v) == {"en", "fi"}}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, help="label only N pairs per split (smoke test)")
    args = ap.parse_args()

    load = lambda p: [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]  # noqa: E731
    train_pairs, eval_pairs = pairs_of(load(DATA / "train.jsonl")), pairs_of(load(DATA / "eval.jsonl"))

    rng = random.Random(SEED)
    moved = set()
    for cancer in CANCERS:
        pool = sorted(k for k, p in train_pairs.items() if p["en"]["cancer"] == cancer and p["en"]["kind"] == "control")
        moved |= set(rng.sample(pool, EXTRA_EVAL_CONTROL_PAIRS))
    jobs = [(k, p, "eval") for k, p in eval_pairs.items()] + [(k, train_pairs[k], "eval") for k in sorted(moved)]
    jobs += [(k, p, "train") for k, p in train_pairs.items() if k not in moved]
    if args.limit:
        jobs = [j for j in jobs if j[2] == "eval"][: args.limit] + [j for j in jobs if j[2] == "train"][: args.limit]

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        labels = list(pool.map(lambda j: label_pair(j[1]), jobs))

    OUT.mkdir(parents=True, exist_ok=True)
    out = {"train": [], "eval": []}
    for (k, pair, split), lab in zip(jobs, labels):
        if lab:
            out[split] += [to_record(pair, lab, lang, split) for lang in ("en", "fi")]
    suffix = ".smoke" if args.limit else ""
    for split, recs in out.items():
        (OUT / f"{split}{suffix}.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in recs), encoding="utf-8")
        counts = defaultdict(int)
        for r in recs:
            counts[r["truth"]] += 1
        print(f"{split}{suffix}: {len(recs)} records {dict(counts)}")
    dropped = sum(lab is None for lab in labels)
    print(f"pairs {len(jobs)}, dropped {dropped}; gemini calls {TOK['calls']}, tokens in {TOK['in']}, out {TOK['out']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
