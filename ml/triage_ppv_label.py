#!/usr/bin/env python3
"""Re-score the cancer-pointer data from published risk figures (PPV) instead of Gemini's own judgement.

Research prototype. All notes and patients are synthetic. Not clinically validated.

    uv run --with requests python3 ml/triage_ppv_label.py            # all pairs (cached, reruns are free)
    uv run --with requests python3 ml/triage_ppv_label.py --limit 4  # smoke test
    python3 ml/triage_ppv_label.py --self-test                      # scoring checks, no network

Input: ml/data/triage/{train,eval}.jsonl (the redacted notes and truth from triage_label.py; unchanged).
Gemini only READS the notes: for each symptom in the published table, on how many visits it was recorded, with a
quote in each language, plus the lowest haemoglobin, iron deficiency and the latest CA-125. Gemini never scores.
The score is then computed in code from docs/build/risk-ppv.json, the same table and the same "highest yes row"
rule as the backend's app/convex/core/ppvRisk.ts (UK primary-care PPVs: Jones 2007, Hamilton 2005/2009, NICE NG12).

History counts: a symptom on any earlier visit counts, and the cough rows need it at 2 or 3 separate visits.

Score scale (fixed, published-anchored): 0 = no symptom with a published figure; otherwise
    score = clamp(round(5 + 2.5 * log2(ppv% / 3)), 1, 10)
so 5 is the NICE NG12 3% referral threshold and each doubling of the published risk adds 2.5 points
(0.75% -> 1, 1.5% -> 2.5, 6% -> 7.5, 12% -> 10).

Writes ml/data/triage-ppv/{train,eval}.jsonl: same ids, inputs and suspectedCancer (= truth) as triage/, new scores,
riskGradient, riskReason (names the published row) and evidence (quotes for that row), plus a `ppv` block.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import sys
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ML_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ML_DIR))
from triage_label import ENDPOINT, KEY_PATH, LOCK, MODEL, TOK, base_id, notes_text, pairs_of  # noqa: E402

IN_DIR = ML_DIR / "data" / "triage"
OUT_DIR = ML_DIR / "data" / "triage-ppv"
CACHE = ML_DIR / ".cache" / "triage-ppv"
PPV_JSON = ML_DIR.parent / "docs" / "build" / "risk-ppv.json"
CANCERS = ("lung", "colorectal", "ovarian")
WORKERS = 16
MAX_ATTEMPTS = 3
NG12_THRESHOLD_PCT = 3.0

TABLE = json.loads(PPV_JSON.read_text(encoding="utf-8"))
SYMPTOMS: list[str] = TABLE["symptomKeys"]
LAB_SYMPTOMS = {"low-haemoglobin", "iron-deficiency-anaemia", "raised-ca125"}
NOTE_SYMPTOMS = [s for s in SYMPTOMS if s not in LAB_SYMPTOMS]

SYMPTOM_MEANING = {
    "abdominal-distension": "visibly swollen or distended abdomen (not just a feeling of bloating)",
    "abdominal-pain": "abdominal or pelvic pain",
    "appetite-loss": "loss of appetite / reduced appetite",
    "bloating": "bloating (a feeling of fullness or bloating)",
    "breathlessness": "shortness of breath / breathlessness",
    "chest-pain": "chest pain",
    "cough": "cough",
    "diarrhoea": "diarrhoea or looser / more frequent stools",
    "fatigue": "tiredness / fatigue",
    "haemoptysis": "coughing up blood (haemoptysis), including blood-streaked sputum",
    "postmenopausal-bleeding": "vaginal bleeding after the menopause",
    "rectal-bleeding": "rectal bleeding / blood in or on the stool",
    "urinary-frequency": "passing urine more often / urgency",
    "weight-loss": "unexplained weight loss (not intended dieting)",
}

SYMPTOM_SCHEMA = {
    "type": "object",
    "properties": {"visits": {"type": "integer"}, "quoteEn": {"type": "string"}, "quoteFi": {"type": "string"}},
    "required": ["visits", "quoteEn", "quoteFi"],
}
REPLY_SCHEMA = {
    "type": "object",
    "properties": {
        "symptoms": {"type": "object", "properties": {s: SYMPTOM_SCHEMA for s in NOTE_SYMPTOMS}, "required": NOTE_SYMPTOMS},
        "lowestHbGdl": {"type": "number", "nullable": True},
        "hbQuoteEn": {"type": "string"},
        "hbQuoteFi": {"type": "string"},
        "ironDeficiency": {"type": "boolean"},
        "latestCa125": {"type": "number", "nullable": True},
        "ca125QuoteEn": {"type": "string"},
        "ca125QuoteFi": {"type": "string"},
    },
    "required": ["symptoms", "lowestHbGdl", "hbQuoteEn", "hbQuoteFi", "ironDeficiency", "latestCa125",
                 "ca125QuoteEn", "ca125QuoteFi"],
}

PROMPT = """You read made-up GP visit notes for a research prototype. Do not judge or score anything. Only report what is
recorded. Below are the same patient's notes in English and in Finnish (one is a translation of the other).

For each symptom, count on how many separate visits (earlier notes plus today) the notes record the patient HAS it,
reported by the patient or found on exam. A symptom that is denied ("no haemoptysis", "ei veriyskää") or only mentioned
as something to watch for does not count. 0 when never recorded as present. When visits >= 1, quoteEn and quoteFi are
one short phrase (3 to 15 words) copied character for character from the English and Finnish notes showing it;
otherwise both are "".
Symptoms:
{symptoms}

Blood tests (any visit):
- lowestHbGdl: the lowest haemoglobin result, converted to g/dL (a value in g/L is divided by 10, so "Hb 98 g/L" is 9.8);
  null when no haemoglobin number is given. hbQuoteEn / hbQuoteFi: the phrase with that result, or "".
- ironDeficiency: true only when a result says low ferritin or iron deficiency (e.g. "ferritin 8", "iron deficient").
- latestCa125: the most recent CA-125 value in U/mL, or null. ca125QuoteEn / ca125QuoteFi: the phrase, or "".

Return JSON only.

ENGLISH NOTES:
{en}
FINNISH NOTES:
{fi}
"""


def call(prompt: str) -> dict:
    import requests

    key = KEY_PATH.read_text().strip()  # read in code only, never printed
    body = {
        "model": MODEL,
        "input": prompt,
        "store": False,
        "generation_config": {"temperature": 0},
        "response_format": {"type": "text", "mime_type": "application/json", "schema": REPLY_SCHEMA},
    }
    response = None
    for attempt in range(6):
        try:
            response = requests.post(ENDPOINT, headers={"Content-Type": "application/json", "x-goog-api-key": key},
                                     json=body, timeout=300)
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


# ---------- published-risk scoring (a port of app/convex/core/ppvRisk.ts) ----------

def row_applies(row: dict, age: int, sex: str) -> bool:
    return ((row["sex"] is None or row["sex"] == sex)
            and (row["ageMin"] is None or age >= row["ageMin"])
            and (row["ageMax"] is None or age <= row["ageMax"]))


def symptom_holds(key: str, row: dict, found: dict) -> bool:
    """found = {"visits": {symptom: n}, "lowestHbGdl", "ironDeficiency", "latestCa125"}."""
    hb = found["lowestHbGdl"]
    if key == "low-haemoglobin":
        # COLO-PPV-12 asks below 10 g/dL, COLO-PPV-15 below 9.9 g/dL (each row's own question).
        cut = 9.9 if row["id"] == "COLO-PPV-15" else 10.0
        return hb is not None and hb < cut
    if key == "iron-deficiency-anaemia":
        cut = 11.0 if row["sex"] == "male" else 10.0
        return found["ironDeficiency"] and hb is not None and hb < cut
    if key == "raised-ca125":
        return found["latestCa125"] is not None and found["latestCa125"] >= 35
    return found["visits"].get(key, 0) >= (row.get("visitsRequired") or 1)


def band_width(row: dict) -> float:
    return math.inf if row["ageMin"] is None or row["ageMax"] is None else row["ageMax"] - row["ageMin"]


def best_row(cancer: str, age: int, sex: str, found: dict) -> dict | None:
    """Yes rows grouped by symptom set; each group keeps its narrowest band; the highest PPV wins. Nothing is added."""
    groups: dict[str, list[dict]] = {}
    for row in TABLE["cancers"][cancer]:
        if row_applies(row, age, sex) and all(symptom_holds(k, row, found) for k in row["symptoms"]):
            groups.setdefault(" + ".join(sorted(row["symptoms"])), []).append(row)
    narrower = lambda r: (band_width(r), r["sex"] is None, r["tier"] != "primary", r["id"])  # noqa: E731
    winners = [min(rows, key=narrower) for rows in groups.values()]
    return min(winners, key=lambda r: (-r["ppvPct"], r["tier"] != "primary", r["id"]), default=None)


def score_from_ppv(pct: float | None) -> int:
    if pct is None:
        return 0
    return max(1, min(10, math.floor(5 + 2.5 * math.log2(pct / NG12_THRESHOLD_PCT) + 0.5)))


def short_source(row: dict) -> str:
    return row["source"]["label"].split(",")[0].strip()


def reason_for(cancer: str, row: dict | None, age: int, sex: str) -> str:
    if row is None:
        return "No recorded symptom has a published UK primary-care risk figure for lung, colorectal or ovarian cancer."
    what = " and ".join(s.replace("-", " ") for s in row["symptoms"])
    if row.get("visitsRequired"):
        what += f" at {row['visitsRequired']} or more visits"
    pct = f"{row['ppvPct']:g}%" + (" or more" if row["ppvIsLowerBound"] else "")
    side = "at or above" if row["ppvPct"] >= NG12_THRESHOLD_PCT else "below"
    return (f"{what.capitalize()}, {sex} aged {age}: published {cancer} risk {pct} ({short_source(row)}), "
            f"{side} the NICE 3% threshold.")


def quotes_for(row: dict | None, reply: dict, lang: str) -> list[str]:
    if row is None:
        return []
    suffix = "En" if lang == "en" else "Fi"
    out = []
    for key in row["symptoms"]:
        if key in ("low-haemoglobin", "iron-deficiency-anaemia"):
            q = reply[f"hbQuote{suffix}"]
        elif key == "raised-ca125":
            q = reply[f"ca125Quote{suffix}"]
        else:
            q = reply["symptoms"][key][f"quote{suffix}"]
        if q and q not in out:
            out.append(q)
    return out[:4]


def found_of(reply: dict) -> dict:
    return {
        "visits": {k: max(0, int(v["visits"])) for k, v in reply["symptoms"].items()},
        "lowestHbGdl": reply["lowestHbGdl"],
        "ironDeficiency": bool(reply["ironDeficiency"]),
        "latestCa125": reply["latestCa125"],
    }


# ---------- labelling ----------

def check(reply: dict, pair: dict) -> str | None:
    n_visits = len(pair["en"]["input"]["earlierNotes"]) + 1
    texts = {lang: notes_text(pair[lang]) for lang in ("en", "fi")}
    for key, v in reply["symptoms"].items():
        if v["visits"] > n_visits:
            return f"{key}: {v['visits']} visits > {n_visits}"
        if v["visits"] > 0:
            for lang, field in (("en", "quoteEn"), ("fi", "quoteFi")):
                if not v[field] or v[field] not in texts[lang]:
                    return f"{key}: {lang} quote not in notes"
    for field, lang in (("hbQuoteEn", "en"), ("hbQuoteFi", "fi"), ("ca125QuoteEn", "en"), ("ca125QuoteFi", "fi")):
        if reply[field] and reply[field] not in texts[lang]:
            return f"{field} not in notes"
    if reply["lowestHbGdl"] is not None and not 3 <= reply["lowestHbGdl"] <= 20:
        return f"Hb {reply['lowestHbGdl']} g/dL out of range"
    return None


def label_pair(pair: dict) -> dict | None:
    symptoms = "\n".join(f"- {k}: {SYMPTOM_MEANING[k]}" for k in NOTE_SYMPTOMS)
    prompt = PROMPT.format(symptoms=symptoms, en=notes_text(pair["en"]), fi=notes_text(pair["fi"]))
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
        problem = check(reply, pair)
        if problem is None:
            return reply
    print(f"drop {base_id(pair['en']['id'])}: {problem}", file=sys.stderr)
    return None


def relabel(rec: dict, reply: dict) -> dict:
    who = rec["input"]["patient"]
    age, sex = who["age"], who["sex"]
    found = found_of(reply)
    rows = {c: best_row(c, age, sex, found) for c in CANCERS}
    scores = {c: score_from_ppv(rows[c]["ppvPct"] if rows[c] else None) for c in CANCERS}
    truth = rec["truth"]
    top = truth if truth != "none" else max(CANCERS, key=lambda c: (scores[c], -CANCERS.index(c)))
    gradient = scores[truth] if truth != "none" else max(scores.values())
    out = dict(rec)
    out["target"] = {
        "suspectedCancer": truth,
        "riskGradient": gradient,
        "scores": scores,
        "riskReason": reason_for(top, rows[top], age, sex),
        "evidence": quotes_for(rows[top], reply, rec["language"]),
    }
    out["ppv"] = {c: ({"rowId": r["id"], "pct": r["ppvPct"]} if r else None) for c, r in rows.items()}
    return out


def self_test() -> int:
    blank = {"visits": {}, "lowestHbGdl": None, "ironDeficiency": False, "latestCa125": None}
    cases = [
        # (cancer, age, sex, found, expected row id)
        ("lung", 68, "male", {**blank, "visits": {"haemoptysis": 1}}, "LUNG-PPV-08"),
        ("lung", 58, "female", {**blank, "visits": {"fatigue": 1, "appetite-loss": 1}}, "LUNG-PPV-22"),
        ("lung", 60, "male", {**blank, "visits": {"cough": 2}}, "LUNG-PPV-20"),
        ("lung", 60, "male", {**blank, "visits": {"cough": 3}}, "LUNG-PPV-19"),
        ("lung", 60, "male", {**blank, "visits": {"cough": 1}}, None),
        ("colorectal", 66, "female", {**blank, "lowestHbGdl": 9.4, "ironDeficiency": True}, "COLO-PPV-14"),
        ("colorectal", 72, "male", {**blank, "visits": {"rectal-bleeding": 1}}, "COLO-PPV-25"),
        ("ovarian", 62, "female", {**blank, "latestCa125": 140}, "OVAR-PPV-10"),
        ("ovarian", 62, "male", {**blank, "latestCa125": 140}, None),
    ]
    bad = 0
    for cancer, age, sex, found, want in cases:
        got = best_row(cancer, age, sex, found)
        got_id = got["id"] if got else None
        if got_id != want:
            bad += 1
            print(f"FAIL {cancer} {age} {sex} {found}: {got_id} != {want}")
    for pct, want in ((None, 0), (0.57, 1), (1.7, 3), (3.0, 5), (4.8, 7), (8.37, 9), (12.5, 10), (20.43, 10)):
        if score_from_ppv(pct) != want:
            bad += 1
            print(f"FAIL score_from_ppv({pct}) = {score_from_ppv(pct)} != {want}")
    print("self-test", "ok" if not bad else f"{bad} failures")
    return 1 if bad else 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, help="only N pairs per split (smoke test)")
    ap.add_argument("--self-test", action="store_true")
    args = ap.parse_args()
    if args.self_test:
        return self_test()

    load = lambda p: [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]  # noqa: E731
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    suffix = ".smoke" if args.limit else ""
    for split in ("eval", "train"):
        pairs = list(pairs_of(load(IN_DIR / f"{split}.jsonl")).values())
        if args.limit:
            pairs = pairs[: args.limit]
        with ThreadPoolExecutor(max_workers=WORKERS) as pool:
            replies = list(pool.map(label_pair, pairs))
        recs = [relabel(p[lang], r) for p, r in zip(pairs, replies) if r for lang in ("en", "fi")]
        (OUT_DIR / f"{split}{suffix}.jsonl").write_text(
            "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in recs), encoding="utf-8")
        dropped = sum(r is None for r in replies)
        by_truth = Counter((r["truth"], r["target"]["riskGradient"]) for r in recs if r["language"] == "en")
        print(f"{split}{suffix}: {len(recs)} records, {dropped} pairs dropped")
        for truth in ("lung", "colorectal", "ovarian", "none"):
            dist = sorted((g, n) for (t, g), n in by_truth.items() if t == truth)
            print(f"  {truth:10s} riskGradient distribution {dist}")
    print(f"gemini calls {TOK['calls']}, tokens in {TOK['in']}, out {TOK['out']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
