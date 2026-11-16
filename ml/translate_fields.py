# /// script
# requires-python = ">=3.11"
# dependencies = ["requests>=2.31", "jsonschema>=4.21"]
# ///
"""Make the Vitruvian training targets English, and add English-notes copies.

Input:  ml/data/train.pre-english.jsonl (the untouched backup; never edited here)
Output: ml/data/train.jsonl (rewritten in full, via a temp file)

Phase 1, fields: every free-text string in target.fields (schema string with no
enum/const/format/pattern; array-of-string items; testsDone[].name/.result;
nested priorCancer.type/.treatment) is sent to Gemini in one JSON call per
record, but only for records where some string looks Finnish. Values that are
already English come back unchanged. Evidence and notes are never touched.

Phase 2, nulls: an OPTIONAL field whose value is null is removed, with its
evidence entry.

Phase 3, entr: every language "fi" record gets an English-notes twin: id + "-entr",
language "en", a new patientId (SYN-491 upward), the translated notes, and evidence
re-quoted from the translated notes. Each quote must be an exact substring of
the translated notes (whitespace-normalised, as the validator checks); up to 2
regenerations, then the twin is dropped.

Each record's Gemini result is cached in CACHE, so a rerun resumes. Run:
    uv run ml/translate_fields.py
"""

import json
import os
import random
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import requests

ML_DIR = Path(__file__).resolve().parent
DATA = ML_DIR / "data"
SRC = DATA / "train.pre-english.jsonl"
OUT = DATA / "train.jsonl"
CACHE = ML_DIR / ".cache" / "translate"  # gitignored; Gemini replies, so reruns cost nothing
sys.path.insert(0, str(ML_DIR))
from prompt import load_schema  # noqa: E402  (same schemas the prompt uses)

KEY_PATH = Path("/home/michal/.t3/userdata/secrets/files/57225e16f5746ddf45988e4595c74bfd")
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions"
MODEL = "gemini-3.5-flash-lite"
PRICE_IN_PER_M = 0.30
PRICE_OUT_PER_M = 2.50
WORKERS = 8
MAX_ATTEMPTS = 3          # first try + 2 regenerations
NEW_PID_START = 491       # train uses SYN-101..SYN-490

API_KEY = KEY_PATH.read_text().strip()  # read in code only, never printed
HEADERS = {"Content-Type": "application/json", "x-goog-api-key": API_KEY}
LOCK = threading.Lock()
TOK = {"in": 0, "out": 0, "calls": 0}

# Finnish detector: word list plus ä/ö. Checked against the English-tagged
# records: no false hits (suffix patterns were dropped because they matched
# English "staging", "iliac fossa" and "mebeverine").
FI_WORDS = re.compile(
    r"\b(ja|ei|ovat|kanssa|viikkoa|viikon|kuukautta|kuukauden|vuotta|potilas|tupakoi|"
    r"tupakka|vatsa|verta|lähete|epäily|kipu|kipua|laihtunut|yskä|päivää|päivän|kertaa|"
    r"aiemmin|nykyinen|entinen|ulosteessa|ummetus|ripuli|lääke|lääkkeet|sairaus|sairaudet|"
    r"muut|normaali|röntgen|tekemättä|kuukausi|viikko|vuosi|tutkimus|tutkimukset|löydös|"
    r"paino|tulos|tulokset|tehty|verikoe|verikokeet|rintakehän|mammografia)\b",
    re.IGNORECASE,
)
FI_CHARS = re.compile(r"[äöÄÖ]")
TOKEN = re.compile(r"\[(\d+)\]|\.?([A-Za-z_]\w*)")
NORM = re.compile(r"\s+")

FIELD_RESP = {
    "type": "object",
    "properties": {
        "translations": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"key": {"type": "string"}, "text": {"type": "string"}},
                "required": ["key", "text"],
            },
        }
    },
    "required": ["translations"],
}

ENTR_RESP = {
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

FIELD_PROMPT = """You translate values from synthetic GP referral notes into English for a demo.
The input is a JSON object mapping keys to strings. Some values are Finnish, some are already English.
Return JSON {"translations": [{"key": ..., "text": ...}]} with exactly one entry per input key, using the same key strings.
Rules:
- Translate Finnish into natural clinical English, as a UK GP would write it.
- A value that is already English is returned unchanged, character for character.
- Keep numbers, units, dates, drug names, brand names, abbreviations (for example FIT, CA-125, Hb, CXR, PS, NAD) and IDs exactly.
- Do not add or remove information. Do not explain. Output JSON only.

INPUT:
"""

ENTR_PROMPT = """You write English GP referral notes. The input has a Finnish note for today and earlier notes (with dates), plus referral fields with English values under evidenceKeys.
Produce:
1. todayNote and earlierNotes: a faithful, natural English translation in GP-note style (short, clinical). Keep every date, number, unit, drug name and abbreviation exact. Keep the same number of earlier notes, in the same order. Do not add or remove facts.
2. evidence: for each key in evidenceKeys, copy a phrase of 3 to 25 words, word for word, from your translated todayNote or one of your translated earlierNotes that supports that field's value. The phrase must be an exact, character-for-character substring of that translated note. Never quote the Finnish text. One evidence entry per key.
Output JSON only.

INPUT:
"""


def call(prompt: str, schema: dict) -> dict:
    body = {
        "model": MODEL,
        "input": prompt,
        "store": False,
        "generation_config": {"temperature": 0.2},
        "response_format": {"type": "text", "mime_type": "application/json", "schema": schema},
    }
    response = None
    for attempt in range(5):
        response = requests.post(ENDPOINT, headers=HEADERS, json=body, timeout=180)
        if response.status_code in (429, 500, 502, 503, 504):
            time.sleep(min(30, 2 ** attempt + random.random()))
            continue
        break
    if response.status_code != 200:
        raise RuntimeError(f"HTTP {response.status_code}")
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


def is_finnish(text: str) -> bool:
    return bool(FI_WORDS.search(text) or FI_CHARS.search(text))


def ptype(prop: dict):
    t = prop.get("type")
    if isinstance(t, list):
        return next((x for x in t if x != "null"), None)
    return t


def is_free_text(prop: dict) -> bool:
    return ptype(prop) == "string" and not ({"enum", "const", "format", "pattern"} & prop.keys())


def collect(prop: dict, value, path: str, out: dict) -> None:
    t = ptype(prop)
    if t == "string":
        if is_free_text(prop) and isinstance(value, str):
            out[path] = value
    elif t == "array" and isinstance(value, list):
        for i, item in enumerate(value):
            collect(prop.get("items", {}), item, f"{path}[{i}]", out)
    elif t == "object" and isinstance(value, dict):
        for k, v in value.items():
            sub = prop.get("properties", {}).get(k)
            if sub is not None:
                collect(sub, v, f"{path}.{k}", out)


def free_strings(schema: dict, fields: dict) -> dict:
    out = {}
    for name, value in fields.items():
        if name == "matchedRuleIds" or name not in schema["properties"]:
            continue
        collect(schema["properties"][name], value, name, out)
    return out


def set_path(fields: dict, path: str, value) -> None:
    toks = []
    for m in TOKEN.finditer(path):
        toks.append(int(m.group(1)) if m.group(1) is not None else m.group(2))
    cur = fields
    for t in toks[:-1]:
        cur = cur[t]
    cur[toks[-1]] = value


def norm(text: str) -> str:
    return NORM.sub(" ", text).strip()


def translate_fields(rec: dict) -> dict:
    """Return {path: english_text} for this record, from cache or Gemini."""
    cache = CACHE / "fields" / f"{rec['id']}.json"
    if cache.exists():
        return json.loads(cache.read_text())
    strings = free_strings(load_schema(rec["cancer"]), rec["target"]["fields"])
    if not any(is_finnish(v) for v in strings.values()):
        result = {}
    else:
        payload = json.dumps(strings, ensure_ascii=False)
        result = None
        for _ in range(MAX_ATTEMPTS):
            out = call(FIELD_PROMPT + payload, FIELD_RESP)
            got = {x["key"]: x["text"] for x in out.get("translations", [])}
            if set(got) == set(strings) and all(t.strip() for t in got.values()):
                result = got
                break
        if result is None:
            raise RuntimeError(f"{rec['id']}: field translation failed after {MAX_ATTEMPTS} attempts")
    cache.write_text(json.dumps(result, ensure_ascii=False))
    return result


def make_entr(rec: dict, new_pid: str):
    """Return the English twin's notes and evidence, or None if it could not be quoted."""
    cache = CACHE / "entr" / f"{rec['id']}.json"
    old_pid = rec["input"]["recordFacts"]["patientId"]
    fields = rec["target"]["fields"]
    ev_keys = list(rec["target"]["evidence"])
    earlier = rec["input"]["earlierNotes"]
    if cache.exists():
        raw = json.loads(cache.read_text())
    else:
        payload = json.dumps(
            {
                "todayNote": rec["input"]["todayNote"],
                "earlierNotes": [n["note"] for n in earlier],
                "evidenceKeys": {k: fields[k] for k in ev_keys},
            },
            ensure_ascii=False,
        )
        raw = None
        for _ in range(MAX_ATTEMPTS):
            out = call(ENTR_PROMPT + payload, ENTR_RESP)
            if len(out["earlierNotes"]) != len(earlier) or not out["todayNote"].strip():
                continue
            quotes = {x["key"]: x["quote"] for x in out["evidence"]}
            if set(ev_keys) - set(quotes):
                continue
            raw = {"todayNote": out["todayNote"], "earlierNotes": out["earlierNotes"],
                   "evidence": {k: quotes[k] for k in ev_keys}}
            # quotes must hold against the translated notes, with the same ID swap applied
            t, e, ev = finalize(raw, old_pid, new_pid)
            corpus = norm(" ".join([t] + e))
            if all(norm(q) and norm(q) in corpus for q in ev.values()) and all(e):
                break
            raw = None
        if raw is None:
            return None
        cache.write_text(json.dumps(raw, ensure_ascii=False))
    return finalize(raw, old_pid, new_pid)


def finalize(raw: dict, old_pid: str, new_pid: str):
    t = raw["todayNote"].replace(old_pid, new_pid)
    e = [x.replace(old_pid, new_pid) for x in raw["earlierNotes"]]
    ev = {k: q.replace(old_pid, new_pid) for k, q in raw["evidence"].items()}
    return t, e, ev


def main() -> int:
    recs = [json.loads(l) for l in SRC.read_text().splitlines() if l.strip()]
    (CACHE / "fields").mkdir(parents=True, exist_ok=True)
    (CACHE / "entr").mkdir(parents=True, exist_ok=True)
    errors = []

    # Phase 1: translate free-text fields.
    with ThreadPoolExecutor(WORKERS) as ex:
        futures = {ex.submit(translate_fields, r): r for r in recs}
        mappings = {}
        for fut, rec in futures.items():
            try:
                mappings[rec["id"]] = fut.result()
            except Exception as exc:  # collect, stop at the end
                errors.append(str(exc))
    if errors:
        print("\n".join(errors[:20]))
        print(f"{len(errors)} field translations failed; rerun resumes from cache")
        return 1

    fields_translated = 0
    recs_translated = 0
    for rec in recs:
        mapping = mappings[rec["id"]]
        before = free_strings(load_schema(rec["cancer"]), rec["target"]["fields"])
        changed = False
        for path, text in mapping.items():
            if before.get(path) is not None and before[path] != text:
                fields_translated += 1
                changed = True
            set_path(rec["target"]["fields"], path, text)
        recs_translated += changed

    # Phase 2: drop null optional fields, with their evidence.
    nulls_removed = []
    for rec in recs:
        schema = load_schema(rec["cancer"])
        required = set(schema.get("required", []))
        fields = rec["target"]["fields"]
        for k in list(fields):
            if fields[k] is None and k not in required:
                del fields[k]
                rec["target"]["evidence"].pop(k, None)
                nulls_removed.append(f"{rec['id']}.{k}")
        for k in list(rec["target"]["evidence"]):
            if k not in fields:
                rec["target"]["evidence"].pop(k)

    # Phase 3: English-notes twins for Finnish records.
    fi = [r for r in recs if r["language"] == "fi"]
    taken = {r["input"]["recordFacts"]["patientId"] for r in recs}
    plans = []
    n = NEW_PID_START
    for r in fi:
        while f"SYN-{n:03d}" in taken:
            n += 1
        plans.append((r, f"SYN-{n:03d}"))
        taken.add(f"SYN-{n:03d}")
        n += 1
    if n > 999:
        print("ran out of SYN ids")
        return 1

    twins, dropped = [], []
    with ThreadPoolExecutor(WORKERS) as ex:
        futures = [(ex.submit(make_entr, r, pid), r, pid) for r, pid in plans]
        for fut, r, pid in futures:
            res = fut.result()
            if res is None:
                dropped.append(r["id"])
                continue
            t, e, ev = res
            facts = dict(r["input"]["recordFacts"], patientId=pid)
            fields = dict(r["target"]["fields"], patientId=pid)
            twins.append({
                "id": r["id"] + "-entr",
                "split": "train",
                "synthetic": True,
                "language": "en",
                "cancer": r["cancer"],
                "kind": r["kind"],
                "input": {
                    "todayNote": t,
                    "earlierNotes": [dict(old, note=new) for old, new in zip(r["input"]["earlierNotes"], e)],
                    "recordFacts": facts,
                },
                "target": {"fields": fields, "evidence": ev},
            })

    out_recs = recs + twins
    tmp = OUT.with_suffix(".jsonl.tmp")
    tmp.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in out_recs))
    os.replace(tmp, OUT)

    cost = TOK["in"] / 1e6 * PRICE_IN_PER_M + TOK["out"] / 1e6 * PRICE_OUT_PER_M
    print(f"records in: {len(recs)}, translated records: {recs_translated}, fields translated: {fields_translated}")
    print(f"nulls removed: {len(nulls_removed)} {nulls_removed}")
    print(f"entr twins written: {len(twins)}, dropped: {len(dropped)} {dropped}")
    print(f"gemini calls: {TOK['calls']}, in tokens: {TOK['in']}, out tokens: {TOK['out']}, est cost USD: {cost:.3f}")
    print(f"wrote {len(out_recs)} records to {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
