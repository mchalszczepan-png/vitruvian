"""Shared prompt builder. Prompted Gemma, training data and the LoRA all use this exact prompt."""
import json
from pathlib import Path

SCHEMAS = Path(__file__).parent / "schemas"

SYSTEM_TEMPLATE = """You fill a GP Referral template from free-text GP notes. The notes may be English or Finnish.
Return ONE JSON object, no prose, no code fence: {{"fields": {{...}}, "evidence": {{...}}}}.
- "fields" must validate against the JSON Schema below. Use only facts in the notes or recordFacts. Never invent.
- If a required value is not in the notes, use null. If an optional field is not in the notes, leave it out.
- Write every free-text value in "fields" in English, even when the notes are Finnish (translate faithfully).
- "evidence" maps a field name to the exact words copied from the notes that justify it, in the notes' own language. Skip fields taken from recordFacts.
- Dates are YYYY-MM-DD. This is a research prototype with made-up patients.

JSON Schema:
{schema}"""


def load_schema(cancer: str) -> dict:
    return json.loads((SCHEMAS / f"{cancer}.json").read_text())


def build_messages(cancer: str, today_note: str, earlier_notes: list[dict], record_facts: dict) -> list[dict]:
    schema = json.dumps(load_schema(cancer), separators=(",", ":"))
    user = {"cancer": cancer, "todayNote": today_note, "earlierNotes": earlier_notes, "recordFacts": record_facts}
    return [
        {"role": "system", "content": SYSTEM_TEMPLATE.format(schema=schema)},
        {"role": "user", "content": json.dumps(user, ensure_ascii=False)},
    ]
