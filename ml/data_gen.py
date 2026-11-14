# /// script
# requires-python = ">=3.11"
# dependencies = ["requests>=2.31", "jsonschema>=4.21"]
# ///
"""Synthetic GP-note records for Vitruvian. All patients are made up.

Run from anywhere:
    uv run ml/data_gen.py --split train
    uv run ml/data_gen.py --split eval

Each job asks Gemini (one call per attempt) for a hidden plan (the ground
truth), the notes, the target fields as a JSON string, and the evidence as a
JSON string. The script then validates everything locally and keeps only
records that pass. Progress is appended to data/<split>.jsonl per record, so
re-running resumes where it stopped.

Null rule: a REQUIRED field that the notes do not state is stored as null,
which is the contract's "unknown" value. Validation swaps each such null for a
dummy value of the right type first, so the rest of the record is still
checked against the schema. An OPTIONAL field that is unknown is left out,
as the contract says. Nulls are never used to pass a broken value.
"""

import argparse
import copy
import json
import math
import random
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, timedelta
from pathlib import Path

import requests
from jsonschema import Draft202012Validator, FormatChecker

ML_DIR = Path(__file__).resolve().parent
DATA_DIR = ML_DIR / "data"
sys.path.insert(0, str(ML_DIR))
from prompt import load_schema  # noqa: E402  (same schemas the prompt uses)

KEY_PATH = Path("/home/michal/.t3/userdata/secrets/files/57225e16f5746ddf45988e4595c74bfd")
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions"
MODEL = "gemini-3.5-flash-lite"  # cheapest current Flash-class model
PRICE_IN_PER_M = 0.30   # USD per 1M input tokens (aistudio latest-model page)
PRICE_OUT_PER_M = 2.50  # USD per 1M output tokens, thought tokens included
BUDGET_USD = 5.0
WORKERS = 8
MAX_ATTEMPTS = 3        # first try + 2 regenerations
NEAR_DUP_JACCARD = 0.5  # 5-gram Jaccard at or above this counts as a near-duplicate
EN_SHARE = 0.55
CANCERS = ("lung", "colorectal", "ovarian")
FACT_KEYS = ("patientId", "age", "sex", "referralDate", "referringGpId")  # set from recordFacts
AID_KEYS = ("matchedRuleIds", "riskGradientAiEstimate")                    # set by the Aid, never by the model
DEMO_IDS = {"SYN-001", "SYN-002", "SYN-003"}
REF_DATE_START = date(2026, 2, 1)
REF_DATE_END = date(2026, 11, 14)

# (cancer: (cancer cases, controls)). Train: ~110 per cancer + 60 controls. Eval: 22 cases + 3 controls.
TRAIN_PLAN = {"lung": (110, 20), "colorectal": (110, 20), "ovarian": (110, 20)}
EVAL_PLAN = {"lung": (8, 1), "colorectal": (7, 1), "ovarian": (7, 1)}

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "plan": {"type": "string"},
        "todayNote": {"type": "string"},
        "earlierNotes": {
            "type": "array",
            "items": {"type": "object", "properties": {"note": {"type": "string"}}, "required": ["note"]},
        },
        "fieldsJson": {"type": "string"},
        "evidenceJson": {"type": "string"},
    },
    "required": ["plan", "todayNote", "earlierNotes", "fieldsJson", "evidenceJson"],
}


def scenario(text, age_min, age_max, vague=False):
    return {"text": text, "amin": age_min, "amax": age_max, "vague": vague}


CANCER_SCENARIOS = {
    "lung": [
        scenario("cough for 6+ weeks, streaks of blood in sputum on several mornings, weight loss, smoker; cough got worse over 2-3 earlier visits", 45, 84),
        scenario("abnormal chest X-ray today with a shadow or nodule in one upper lobe; earlier cough and tiredness", 45, 84),
        scenario("unexplained weight loss and tiredness with cough, ex-smoker, chest X-ray not done yet", 45, 84),
        scenario("two chest infections (pneumonia) within a year and a persistent cough, former smoker", 45, 84),
        scenario("finger clubbing and persistent cough in a long-term smoker, enlarged lymph node above the collarbone", 48, 84),
        scenario("persistent enlarged lymph node in the neck for 5 weeks plus breathlessness; never-smoker with asbestos exposure at work", 42, 80),
        scenario("chest pain on one side and breathlessness on stairs, current smoker, pack-years stated", 45, 84),
        scenario("VAGUE: first visit, mild cough for 3 weeks, mostly well, one symptom only, no X-ray", 38, 60, vague=True),
        scenario("VAGUE: tiredness and reduced appetite for 6 weeks, current smoker, tests planned but not sent yet", 40, 66, vague=True),
    ],
    "colorectal": [
        scenario("FIT 186 ug Hb/g (positive) with rectal bleeding; change in bowel habit for about 12 weeks", 45, 85),
        scenario("iron-deficiency anaemia on bloods (low Hb, low ferritin), no bleeding reported, weight loss", 60, 85),
        scenario("change in bowel habit for 12 weeks, alternating loose and hard stools, weight loss about 4 kg", 45, 85),
        scenario("palpable abdominal mass on examination with weight loss and a change in bowel habit", 45, 85),
        scenario("rectal mass felt on digital rectal examination, dark blood on the glove, bowel change", 45, 85),
        scenario("FIT below threshold but symptoms persist: abdominal pain for 8 weeks, bowel change, anaemia not checked yet", 40, 80),
        scenario("anaemia with bloody stools in the last month, older adult, rectal examination done", 60, 80),
        scenario("VAGUE: loose stools for 2 weeks after antibiotics, first visit, no bleeding, no weight loss", 25, 60, vague=True),
        scenario("VAGUE: bloating and tiredness, one visit, FIT not sent yet, weight stable", 30, 60, vague=True),
    ],
    "ovarian": [
        scenario("bloating most days for 4 months, early feeling of fullness, postmenopausal", 50, 85),
        scenario("CA-125 raised (value in the notes), persistent pelvic pain for 6 weeks, bloating", 45, 85),
        scenario("abnormal pelvic ultrasound with a complex cyst about 7 cm, bloating for 3 months", 45, 85),
        scenario("palpable pelvic mass and ascites on examination, weight loss, bloating", 50, 85),
        scenario("urinary frequency more than 12 times a month plus bloating for 2 months, CA-125 not done yet", 45, 75),
        scenario("persistent bloating and pelvic pain for 3 months in a young woman under 40; CA-125 not used alone", 22, 39),
        scenario("mother and aunt had ovarian cancer, BRCA1 pathogenic variant known in the family, bloating for 2 months", 35, 60),
        scenario("VAGUE: bloating about 3 days a month, one visit, no tests yet", 30, 60, vague=True),
        scenario("VAGUE: mild lower abdominal discomfort, one visit, possibly related to periods", 25, 50, vague=True),
    ],
}

CONTROL_SCENARIOS = {
    "lung": [
        scenario("viral upper respiratory infection, cough for 2 weeks, chest clear, afebrile, no blood in sputum, non-smoker", 20, 75),
        scenario("asthma flare with wheeze, on inhaler, night cough, no blood, no weight loss", 18, 75),
        scenario("reflux-related chronic cough worse lying down, no weight loss, chest clear, no blood", 30, 80),
        scenario("acute bronchitis, fever resolved, cough 3 weeks and settling, normal examination", 20, 75),
    ],
    "colorectal": [
        scenario("IBS-type symptoms: bloating, alternating stools, FIT 3 ug Hb/g (negative), Hb normal", 20, 70),
        scenario("haemorrhoids with bright red blood on the paper, no change in bowel habit, normal bloods", 25, 70),
        scenario("constipation after opioid painkillers, no blood, normal bloods, no weight loss", 20, 75),
        scenario("gastroenteritis that has resolved, loose stools 3 days ago, nothing else", 18, 70),
    ],
    "ovarian": [
        scenario("uterine fibroids with heavy periods, clearly uterine on ultrasound, no ascites, no bloating outside periods", 30, 55),
        scenario("recurrent cystitis with urgency and frequency, urine culture positive, pain only on passing urine", 20, 70),
        scenario("endometriosis-type pain with periods, no bloating, examination normal", 20, 40),
        scenario("functional bloating after meals, normal examination, no persistent symptoms", 20, 60),
    ],
}

# Hard cases. Each record gets at most one of these (plus the missing-value hint for some cancer cases).
HARD_HINTS = [
    "Write one value as words, not digits, where the target needs a number (for example 'kaksi viikkoa' or 'three weeks').",
    "Write a weight with a decimal comma, for example '4,5 kg' (Finnish style), and set the target to 4.5.",
    "Write one date in European form, for example '3.9.2026', and set the target to YYYY-MM-DD.",
    "One earlier note gives a different value for a field than today's note (for example weight, smoking or Hb). The most recent note is the truth; say so in the plan.",
    "Give smoking as 'N a day for M years' with no pack-year total. Target packYears = M * N / 20 (20 cigarettes = 1 pack).",
    "Give a FIT or CA-125 value with unusual units or spacing, for example 'FIT 186 ug Hb/g', 'CA-125 84 U/ml' or 'CA125 31 IU/l'.",
    "Write Hb in g/dl once (for example '10.9 g/dl'); the target is in g/L (109).",
    "Mention a past test with its date in an earlier note (for example a chest X-ray or FBC) so it belongs in testsDone.",
    "Mention an earlier cancer treated years ago, so priorCancer is filled with type, yearDiagnosed and treatment.",
    "A symptom is only implied (for example 'no weight change'). Do not infer a number: leave the number field unknown.",
]
MISSING_HINT = (
    "A required value a GP would normally record is NOT in any note (for example the chest X-ray result, "
    "the CA-125 value, the FIT value or the smoking history). Its target is null."
)

PERSONAS_TRAIN = [
    "terse GP shorthand with abbreviations, few full sentences",
    "ordinary GP prose, short sentences, some abbreviations",
    "structured note with short headings (Finnish: 'Oire:', 'Status:', 'Tutkimukset:', 'Suunnitelma:'; English: 'Symptoms:', 'Exam:', 'Tests:', 'Plan:')",
    "busy locum: a few typos, missing articles, quick observations",
    "thorough GP who writes negatives explicitly ('no', 'nil'; Finnish 'ei')",
]
PERSONAS_EVAL = [
    "telegraphic lines separated by semicolons, minimal punctuation",
    "one long narrative paragraph that quotes the patient's own words",
    "lab-printout style: values and units listed one per line, then a short plan",
]

LANG_STYLE = {
    "en": "British English GP notes with NHS abbreviations (GP, FBC, CRP, CXR, FIT, 2WW, SOB, c/o, Hx).",
    "fi": (
        "Finnish GP notes in Finnish shorthand, as in Finnish primary-care records (for example "
        "'Yskä 3 vk, ei kuumetta, keuhkot puhtaat', 'Hb 109 g/l', 'FIT 186 µg Hb/g', 'ei verta ulosteessa'). "
        "Write the notes in Finnish. Free-text field values (mainSymptom, examFindings, generalCondition, "
        "suspectedDiagnosis, gpQuestion, chestXrayFindings, testsDone names and results) are also in Finnish. "
        "Enum values stay English exactly as the schema says."
    ),
}


class BudgetStop(Exception):
    pass


class Context:
    """Shared state for one run. Everything that touches files or counters goes through `lock`."""

    def __init__(self, split, refs, out_path):
        self.split = split
        self.refs = refs  # list of (record id, [note shingle sets])
        self.out_path = out_path
        self.lock = threading.Lock()
        self.stop = threading.Event()
        self.counts = {
            "attempts": 0, "validation_failures": 0, "call_failures": 0,
            "near_duplicates": 0, "records_ok": 0, "records_failed": 0,
            "pruned_evidence": 0, "in_tokens": 0, "out_tokens": 0,
        }

    def cost(self):
        return (self.counts["in_tokens"] * PRICE_IN_PER_M + self.counts["out_tokens"] * PRICE_OUT_PER_M) / 1e6


def normalize_ws(text):
    return re.sub(r"\s+", " ", text).strip()


def note_shingles(text):
    tokens = re.findall(r"\w+", text.lower())
    return {tuple(tokens[i:i + 5]) for i in range(len(tokens) - 4)}


def jaccard(a, b):
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def near_duplicate_of(note_sets, refs):
    for ref_id, ref_sets in refs:
        for a in note_sets:
            for b in ref_sets:
                if jaccard(a, b) >= NEAR_DUP_JACCARD:
                    return ref_id
    return None


def load_jsonl(path):
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def build_jobs(split):
    plan = TRAIN_PLAN if split == "train" else EVAL_PLAN
    personas = PERSONAS_TRAIN if split == "train" else PERSONAS_EVAL
    seed_base = "train-1000" if split == "train" else "eval-90000"
    id_prefix = "" if split == "train" else "eval-"
    patient_base = 100 if split == "train" else 500

    slots = []
    for cancer in CANCERS:
        n_cancer, n_control = plan[cancer]
        for kind, count in (("cancer", n_cancer), ("control", n_control)):
            for n in range(1, count + 1):
                slots.append((cancer, kind, n))

    rng_lang = random.Random(f"{seed_base}:languages")
    n_en = math.floor(len(slots) * EN_SHARE + 0.5)
    languages = ["en"] * n_en + ["fi"] * (len(slots) - n_en)
    rng_lang.shuffle(languages)

    jobs = []
    for index, ((cancer, kind, n), lang) in enumerate(zip(slots, languages), start=1):
        rng = random.Random(f"{seed_base}:{cancer}:{kind}:{n}")
        if kind == "cancer":
            pool = CANCER_SCENARIOS[cancer]
            vague_pool = [s for s in pool if s["vague"]]
            firm_pool = [s for s in pool if not s["vague"]]
            chosen = rng.choice(vague_pool if rng.random() < 0.25 else firm_pool)
        else:
            chosen = rng.choice(CONTROL_SCENARIOS[cancer])
        hints = []
        if rng.random() < 0.55:
            hints.append(rng.choice(HARD_HINTS))
        if kind == "cancer" and rng.random() < 0.2:
            hints.append(MISSING_HINT)
        ref_date = REF_DATE_START + timedelta(days=rng.randint(0, (REF_DATE_END - REF_DATE_START).days))
        gap_count = rng.choices([0, 1, 2, 3], weights=[0.2, 0.35, 0.3, 0.15])[0]
        earlier_dates, cursor = [], ref_date
        for _ in range(gap_count):
            cursor = cursor - timedelta(days=rng.randint(14, 60))
            earlier_dates.append(cursor.isoformat())
        earlier_dates.reverse()  # oldest first
        cancer_id = f"{cancer}-ctrl-{lang}" if kind == "control" else f"{cancer}-{lang}"
        jobs.append({
            "id": f"{id_prefix}{cancer_id}-{n:03d}",
            "cancer": cancer,
            "kind": kind,
            "language": lang,
            "persona": rng.choice(personas),
            "scenario": chosen["text"],
            "hints": hints,
            "facts": {
                "patientId": f"SYN-{patient_base + index:03d}",
                "age": rng.randint(chosen["amin"], chosen["amax"]),
                "sex": "female" if cancer == "ovarian" else rng.choice(["female", "male"]),
                "referralDate": ref_date.isoformat(),
                "referringGpId": f"GP-{rng.randint(1, 60):03d}",
            },
            "earlierDates": earlier_dates,
        })
    return jobs


def build_prompt(job, feedback):
    cancer = job["cancer"]
    schema = {k: v for k, v in load_schema(cancer).items() if k not in ("$schema", "$id", "title")}
    schema_text = json.dumps(schema, ensure_ascii=False, separators=(",", ":"))
    facts = job["facts"]
    if job["kind"] == "control":
        kind_text = (
            "control: a patient WITHOUT cancer red flags, sent through this template anyway. Keep every field honest: "
            "no invented findings; cancer tests are not_done or normal only if the notes say so; urgency null unless the notes say urgent."
        )
    else:
        kind_text = "suspected-cancer referral (scenario below). Vague cases use the same template; keep unknowns unknown."
    earlier_lines = "\n".join(f"  {i}. dated {d}" for i, d in enumerate(job["earlierDates"], 1)) or "  (none: no earlier notes)"
    hints_text = " ".join(job["hints"]) if job["hints"] else "none"
    feedback_text = ""
    if feedback:
        feedback_text = (
            "\nPREVIOUS ATTEMPT FAILED VALIDATION. Fix these problems, keep the plan's facts:\n- "
            + "\n- ".join(feedback[:12]) + "\n"
        )
    return f"""You write one synthetic GP referral case for a research prototype. The patient is made up.
Return JSON only, following the response schema.

CASE SETTINGS (fixed)
- Referral template: {cancer} cancer. Kind: {kind_text}
- Language: {LANG_STYLE[job["language"]]}
- Writing style: {job["persona"]}
- Clinical scenario: {job["scenario"]}
- Hard-case hints: {hints_text}
- recordFacts (already decided, the notes must agree): age {facts["age"]}, sex {facts["sex"]}, today's referral date {facts["referralDate"]}.
- Today's note is dated {facts["referralDate"]}. Earlier notes: exactly {len(job["earlierDates"])}, oldest first:
{earlier_lines}

WRITE IN THIS ORDER
1. "plan": the hidden ground truth in short bullets: for each schema field the true value or UNKNOWN; the decision for each hard-case hint; which note is latest if notes conflict. Nobody else reads it.
2. "todayNote": the GP note for today.
3. "earlierNotes": exactly {len(job["earlierDates"])} objects, in the order listed above, each with the GP note for that visit.
4. "fieldsJson": a JSON object, as a string, with the schema fields, values taken from the plan.
5. "evidenceJson": a JSON object, as a string, mapping field names to exact words copied from the notes.

RULES
- The notes must match the plan. Never state a fact the plan marks UNKNOWN. Never invent numbers.
- Do NOT put patientId, age, sex, referralDate or referringGpId in fieldsJson or evidenceJson; the pipeline sets them from recordFacts.
- A required field whose value is UNKNOWN: null. An optional field whose value is unknown: leave the key out.
- Dates YYYY-MM-DD. Numbers as JSON numbers in the schema unit: '4,5 kg' -> 4.5; '109 g/l' -> 109. Pack-years = packs per day x years, 20 cigarettes = 1 pack ('20 a day for 30 years' -> 30).
- Booleans true/false only when the notes say so. 'no blood' or 'ei verta' -> false. No mention of a required boolean -> null.
- Use exactly the schema enum values (English), even in Finnish notes.
- urgency: 'urgent_2_week' when the GP writes a 2-week or suspected-cancer urgent referral; 'urgent' for other urgent wording; null if the notes do not say.
- evidenceJson: each value is a string copied word for word from one note (same characters and punctuation; a phrase of 3-25 words). Only for fields with a non-null value that come from the notes. Keys are schema field names. Never paraphrase or summarise: if no phrase is copied word for word from a note, leave that field out of evidenceJson (for example a diagnosis the GP never wrote in words).
- No keys outside the schema.
{feedback_text}
SCHEMA (the five recordFacts fields are excluded from your output)
{schema_text}
"""


def extract_text(data):
    texts = []
    for step in data.get("steps", []):
        if step.get("type") == "model_output":
            for part in step.get("content", []):
                if part.get("type") == "text":
                    texts.append(part.get("text", ""))
    return "".join(texts)


def call_gemini(api_key, prompt, ctx):
    if ctx.cost() > BUDGET_USD:
        ctx.stop.set()
        raise BudgetStop(f"estimated cost {ctx.cost():.2f} USD above budget")
    body = {
        "model": MODEL,
        "input": prompt,
        "store": False,
        "generation_config": {"temperature": 0.9},
        "response_format": {"type": "text", "mime_type": "application/json", "schema": RESPONSE_SCHEMA},
    }
    headers = {"Content-Type": "application/json", "x-goog-api-key": api_key}
    response = None
    for attempt in range(5):
        response = requests.post(ENDPOINT, headers=headers, json=body, timeout=180)
        if response.status_code in (429, 500, 502, 503, 504):
            time.sleep(min(30, 2 ** attempt + random.random()))
            continue
        break
    if response.status_code != 200:
        raise RuntimeError(f"HTTP {response.status_code}")
    data = response.json()
    usage = data.get("usage") or {}
    with ctx.lock:
        ctx.counts["in_tokens"] += usage.get("total_input_tokens", 0)
        ctx.counts["out_tokens"] += usage.get("total_output_tokens", 0) + usage.get("total_thought_tokens", 0)
    return extract_text(data)


def dummy_for(prop):
    """A value of the right type, used only inside validation for required fields the notes do not state."""
    if "enum" in prop:
        return prop["enum"][0]
    if "const" in prop:
        return prop["const"]
    kind = prop.get("type")
    if isinstance(kind, list):
        kind = next(t for t in kind if t != "null")
    if kind == "string":
        return "2026-01-01" if prop.get("format") == "date" else "n/a"
    if kind in ("integer", "number"):
        return 0
    if kind == "boolean":
        return False
    if kind == "array":
        return []
    return {}


def required_now(schema, fields):
    required = set(schema.get("required", []))
    for clause in schema.get("allOf", []):
        if Draft202012Validator(clause["if"]).is_valid(fields):
            required.update(clause["then"].get("required", []))
    return required


def normalize_fields(raw, cancer, facts):
    """Returns (fields, errors). Fields keep null only for required values the notes do not state."""
    if not isinstance(raw, dict):
        return None, ["fieldsJson is not a JSON object"]
    schema = load_schema(cancer)
    errors = []
    unknown = [k for k in raw if k not in schema["properties"] and k not in AID_KEYS]
    if unknown:
        errors.append(f"keys not in schema: {unknown}")
    fields = {k: v for k, v in raw.items() if k not in FACT_KEYS and k not in AID_KEYS}
    fields.update(facts)
    fields["suspectedCancerType"] = cancer
    required = required_now(schema, fields)
    for key in list(fields):
        if fields[key] is None and key not in required:
            del fields[key]
    for key in required:
        fields.setdefault(key, None)
    check = copy.deepcopy(fields)
    for key in required:
        if check[key] is None:
            check[key] = dummy_for(schema["properties"][key])
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    for err in sorted(validator.iter_errors(check), key=lambda e: [str(p) for p in e.path]):
        where = "/".join(str(p) for p in err.path) or "(root)"
        errors.append(f"schema {where}: {err.message[:150]}")
    return fields, errors


def normalize_evidence(raw, fields, notes_norm):
    """Returns (evidence, pruned_count). Kept evidence is an exact (whitespace-normalised) substring of the notes.

    Evidence is advisory, so an entry that is paraphrased, empty, or on a fact or null field is pruned
    and counted, not fatal. The model often paraphrases a diagnosis; a fatal error would throw away
    a whole otherwise-valid record. Field values stay strictly validated.
    """
    if not isinstance(raw, dict):
        return {}, 1  # not an object: all evidence discarded, counted once
    evidence, pruned = {}, 0
    for key, value in raw.items():
        if key in FACT_KEYS or key not in fields or fields[key] is None:
            pruned += 1
            continue
        text = normalize_ws(value) if isinstance(value, str) else ""
        if not text or not any(text in note for note in notes_norm):
            pruned += 1
            continue
        evidence[key] = text
    return evidence, pruned


def check_generation(job, gen):
    """Returns (errors, record, note_shingle_sets, dropped_evidence_count)."""
    if not isinstance(gen, dict):
        return ["model output is not a JSON object"], None, None, 0
    today = gen.get("todayNote")
    earlier = gen.get("earlierNotes")
    errors = []
    if not isinstance(today, str) or not today.strip():
        errors.append("todayNote is empty")
    if not isinstance(earlier, list) or len(earlier) != len(job["earlierDates"]):
        errors.append(f"earlierNotes must have {len(job['earlierDates'])} items")
        return errors, None, None, 0
    earlier_texts = [e.get("note") if isinstance(e, dict) else None for e in earlier]
    if any(not isinstance(t, str) or not t.strip() for t in earlier_texts):
        errors.append("an earlier note is empty")
    if errors:
        return errors, None, None, 0
    try:
        fields_raw = json.loads(gen.get("fieldsJson", ""))
    except (TypeError, json.JSONDecodeError):
        return ["fieldsJson is not valid JSON"], None, None, 0
    try:
        evidence_raw = json.loads(gen.get("evidenceJson", ""))
    except (TypeError, json.JSONDecodeError):
        return ["evidenceJson is not valid JSON"], None, None, 0

    facts = job["facts"]
    fields, field_errors = normalize_fields(fields_raw, job["cancer"], facts)
    notes = [today] + earlier_texts
    notes_norm = [normalize_ws(t) for t in notes]
    evidence, pruned = normalize_evidence(evidence_raw, fields or {}, notes_norm)
    if field_errors:
        return field_errors, None, None, pruned
    record = {
        "id": job["id"],
        "split": job["split"],
        "synthetic": True,
        "language": job["language"],
        "cancer": job["cancer"],
        "kind": job["kind"],
        "input": {
            "todayNote": today,
            "earlierNotes": [{"date": d, "note": n} for d, n in zip(job["earlierDates"], earlier_texts)],
            "recordFacts": facts,
        },
        "target": {"fields": fields, "evidence": evidence},
    }
    return [], record, [note_shingles(t) for t in notes], pruned


def run_job(job, ctx, api_key):
    feedback = []
    for _attempt in range(MAX_ATTEMPTS):
        if ctx.stop.is_set():
            return "budget_stop"
        with ctx.lock:
            ctx.counts["attempts"] += 1
        try:
            gen = json.loads(call_gemini(api_key, build_prompt(job, feedback), ctx))
        except BudgetStop:
            return "budget_stop"
        except Exception as exc:  # network, HTTP, or JSON parse failure
            with ctx.lock:
                ctx.counts["call_failures"] += 1
            feedback = [f"call or JSON failure: {type(exc).__name__}"]
            continue
        errors, record, note_sets, pruned = check_generation(job, gen)
        with ctx.lock:
            ctx.counts["pruned_evidence"] += pruned
            if errors:
                ctx.counts["validation_failures"] += 1
                feedback = errors
                continue
            near = near_duplicate_of(note_sets, ctx.refs)
            if near:
                ctx.counts["near_duplicates"] += 1
                feedback = [f"notes are a near-duplicate of record {near}; write a different case"]
                continue
            with ctx.out_path.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(record, ensure_ascii=False) + "\n")
            ctx.refs.append((record["id"], note_sets))
            ctx.counts["records_ok"] += 1
        return "ok"
    with ctx.lock:
        ctx.counts["records_failed"] += 1
        with (DATA_DIR / f"failures_{ctx.split}.jsonl").open("a", encoding="utf-8") as handle:
            handle.write(json.dumps({"id": job["id"], "errors": feedback[:6]}, ensure_ascii=False) + "\n")
    return "failed"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--split", choices=["train", "eval"], required=True)
    parser.add_argument("--limit", type=int, default=0, help="only the first N jobs (smoke test)")
    parser.add_argument("--workers", type=int, default=WORKERS)
    args = parser.parse_args()

    DATA_DIR.mkdir(exist_ok=True)
    api_key = KEY_PATH.read_text(encoding="utf-8").strip()
    out_path = DATA_DIR / f"{args.split}.jsonl"
    other_split = "eval" if args.split == "train" else "train"

    jobs = build_jobs(args.split)
    for job in jobs:
        job["split"] = args.split
        assert re.fullmatch(r"SYN-\d{3}", job["facts"]["patientId"]) and job["facts"]["patientId"] not in DEMO_IDS
    if args.limit:
        jobs = jobs[: args.limit]

    existing = load_jsonl(out_path)
    done_ids = {r["id"] for r in existing}
    # Near-duplicate reference: this split's records so far, plus the other split's records if they exist.
    refs = []
    for record in existing + load_jsonl(DATA_DIR / f"{other_split}.jsonl"):
        refs.append((record["id"], [note_shingles(n) for n in [record["input"]["todayNote"]] + [e["note"] for e in record["input"]["earlierNotes"]]]))

    ctx = Context(args.split, refs, out_path)
    todo = [job for job in jobs if job["id"] not in done_ids]
    print(f"split={args.split} jobs={len(jobs)} already_done={len(jobs) - len(todo)} todo={len(todo)} model={MODEL}")

    results = {"ok": 0, "failed": 0, "budget_stop": 0}
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(run_job, job, ctx, api_key) for job in todo]
        for done, future in enumerate(as_completed(futures), start=1):
            results[future.result()] += 1
            if done % 25 == 0 or done == len(futures):
                print(f"progress {done}/{len(futures)} est_cost_usd={ctx.cost():.3f}", flush=True)

    final = load_jsonl(out_path)
    summary = {
        "split": args.split,
        "records_in_file": len(final),
        "by_cancer_kind_language": {},
        "run_counts": ctx.counts,
        "run_results": results,
        "est_cost_usd": round(ctx.cost(), 4),
        "price_assumption_usd_per_M": {"in": PRICE_IN_PER_M, "out": PRICE_OUT_PER_M},
    }
    for record in final:
        key = f"{record['cancer']}/{record['kind']}/{record['language']}"
        summary["by_cancer_kind_language"][key] = summary["by_cancer_kind_language"].get(key, 0) + 1
    (DATA_DIR / f"stats_{args.split}.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(summary, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
