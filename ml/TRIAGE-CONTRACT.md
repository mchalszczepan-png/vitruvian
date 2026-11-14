# Cancer pointer (triage) LoRA: request and response contract

Research prototype. All notes and patients are synthetic.

**Label (use this wording everywhere: techUsed badge, docs, pitch):** "Gemma 4 E4B, fine-tuned on synthetic GP
notes, Gemini-teacher labels, not clinically validated."

A drop-in for the backend's prompted `model.risk` step (`app/convex/core/aid.ts`). The cited NG12 Rules stay the
authority for "Suspected cancer" (decision 14 in docs/BUILD-PLAN.md: the risk sits next to the matched Rules).
The backend reads `scores[<cancer the Rules picked>]` as the 0-10 risk. If the model's own `suspectedCancer`
differs from the Rules, show that as a note. It does not override the Rules.

## Endpoint

- `POST https://mchalszczepan-png-vitruvian--vitruvian-serve-serve.us-east.modal.run/v1/chat/completions`
  (same URL and bearer key as the form-fill LoRA)
- `model: "vitruvian-triage"`, `temperature: 0`, `max_tokens: 1024`
- GPU compute in the EU (Modal `region="eu"`); routing, storage and logs are in the US.

## Request

Messages must be built exactly like `ml/triage_prompt.py::build_triage_messages` (the model was trained on that
prompt, byte for byte):

```json
[
  {"role": "system", "content": "<triage_prompt.SYSTEM, verbatim>"},
  {"role": "user", "content": "{\"patient\": {\"age\": 64, \"sex\": \"male\"}, \"earlierNotes\": [{\"date\": \"2026-05-02\", \"note\": \"...\"}], \"todayNote\": \"...\"}"}
]
```

The user message is `JSON.stringify({patient, earlierNotes, todayNote})` with keys in that order and non-ASCII kept
as is (Python `ensure_ascii=False`). `earlierNotes` is oldest first. English or Finnish notes both work.

## Response (message content, one JSON object)

```json
{"suspectedCancer": "lung", "riskGradient": 4,
 "scores": {"lung": 4, "colorectal": 2, "ovarian": 2},
 "riskReason": "Persistent unexplained fatigue and loss of appetite for 6 weeks in a smoker.",
 "evidence": ["Fatigue and loss of appetite for 6 weeks", "smoker"]}
```

- `suspectedCancer`: `lung | colorectal | ovarian | none` (the model's own guess; advisory only)
- `scores`: integer 0-10 per cancer. Use `scores[ruleCancer]` as the risk next to the matched Rules.
  When no Rule matched, use `riskGradient` (the highest score).
- Input is the raw visit note text (today's note plus earlier ones), not the extracted facts.
- `riskReason`: one English line, at most 30 words.
- `evidence`: 1-4 phrases copied from the notes (in the notes' language), for highlighting.
- Parse defensively: strip a ```json fence if present, clamp scores to 0-10, and fall back to the prompted
  risk step on any parse error or HTTP error.

## How well it does (held-out, 78 synthetic patients: 44 cancer, 34 control; en + fi)

The headline number is **cancer-type accuracy on synthetic notes**: how often the model's lung / colorectal /
ovarian / none call matches the cancer the synthetic patient was generated with. It is not a measure of risk
accuracy; no real-world risk outcome exists for these patients.

| Model | Cancer-type accuracy (4-way) | Cancer flagged | Control left at none | AUROC risk | Latency |
| --- | --- | --- | --- | --- | --- |
| `vitruvian-triage` (E4B + LoRA) | 92.3% | 97.7% | 85.3% | 0.957 | 2.2 s |
| prompted Gemma 4 E4B (same base, same prompt) | 79.5% | 84.1% | 73.5% | 0.890 | 2.1 s |
| prompted Gemma 4 31B (Featherless) | 84.6% | 81.8% | 88.2% | 0.904 | 15.8 s |

LoRA vs prompted E4B: 13 patients right only with the LoRA, 3 only with the base (exact McNemar p = 0.02).
LoRA vs prompted 31B: 10 vs 4 (p = 0.18). This does **not** show it beats 31B; do not claim that.
One training config, chosen before scoring.

Caveats: synthetic notes from one generator; scores are taught by a Gemini 3.5 Flash teacher; the notes were
redacted to remove sentences that state the conclusion ("2WW lung cancer referral"). Not a medical device.
Results: `ml/results/triage/`. Data: `ml/triage_label.py`. Eval: `ml/triage_eval.py`.
