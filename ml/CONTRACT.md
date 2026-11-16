# Note → Referral-fields contract (prompted Gemma and LoRA share it)

Research prototype. All notes and patients are synthetic.

## Request (OpenAI chat completions, `POST /v1/chat/completions`)
- `model`: set by the provider config (Hackerpack Gemma id, or the Modal LoRA id).
- `temperature`: 0. `max_tokens`: 2048.
- `messages`: exactly two, built by `ml/prompt.py::build_messages(cancer, today_note, earlier_notes, record_facts)`.
  - system: fixed instructions + the cancer's JSON Schema (`ml/schemas/<cancer>.json`).
  - user: JSON text `{"cancer", "todayNote", "earlierNotes":[{"date","note"}], "recordFacts":{...}}`.

## Response
`choices[0].message.content` is one JSON object, no prose, no code fence:
```json
{ "fields":   { "<schema field>": <value valid against the cancer schema> },
  "evidence": { "<schema field>": "<exact words copied from the notes>" } }
```
- `fields` validates against `ml/schemas/<cancer>.json`. Unknown required value: `null`. Unknown optional field: left out.
- `evidence` keys are a subset of `fields` keys. Fields from `recordFacts` carry no evidence.
- The backend validates, retries once, then marks failing fields origin `empty` (SPEC "Gemma").

## Switching
Backend provider config = base URL + model id + key. Same code path for prompted Gemma and the Modal LoRA.

## Data record (one JSON object per line in `data/train.jsonl` and `data/eval.jsonl`)
```json
{ "id": "lung-en-007", "split": "train|eval", "synthetic": true, "language": "en|fi",
  "cancer": "lung|colorectal|ovarian", "kind": "cancer|control",
  "input":  { "todayNote": "...", "earlierNotes": [{"date": "2026-09-03", "note": "..."}],
              "recordFacts": {"patientId": "SYN-101", "age": 62, "sex": "male", "referralDate": "2026-11-14", "referringGpId": "GP-014"} },
  "target": { "fields": {...valid against schema...}, "evidence": {...exact substrings of the notes...} } }
```
`kind: control` = a patient without cancer red flags (e.g. viral cough) run through the cancer's template; target fields stay honest (haemoptysis false, tests not_done, no invented findings).
Eval notes never appear in train (different ids, different generation call, no near-duplicate text).
