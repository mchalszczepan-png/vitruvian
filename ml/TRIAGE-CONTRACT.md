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

## Published-risk variant: `vitruvian-triage-ppv` (live on the same endpoint, not wired into the backend yet)

**Label:** "Gemma 4 E4B, fine-tuned on synthetic GP notes; scores computed from published UK primary-care PPVs;
not clinically validated."

Same request and response shape. Two differences:

- `model: "vitruvian-triage-ppv"`, and the system message is `triage_prompt.SYSTEM_PPV` (verbatim), not `SYSTEM`.
- `scores` mean something fixed: the published positive predictive value (PPV) of the strongest symptom recorded on
  **any** visit, for this age and sex, from the same table as the backend's published-risk line
  (`docs/build/risk-ppv.json`: Jones 2007, Hamilton 2005/2009, NICE NG12 evidence). Score = 0 when no symptom has a
  figure, else `round(5 + 2.5 * log2(PPV% / 3))` clamped to 1-10. **5 = the NICE NG12 3% threshold**; 1% ≈ 1,
  1.5% ≈ 3, 6% ≈ 8, 12%+ = 10. Earlier visits count (a cough at 2 or 3 visits has its own row). `riskReason` names
  the symptom, the PPV and the study. `evidence` may be empty when no symptom has a figure.

How the training labels were made (`ml/triage_ppv_label.py`): Gemini only reads the notes (which symptoms, on how many
visits, lowest Hb, iron deficiency, latest CA-125, each with a quote). The score is computed in code from the table,
with the same "highest yes row" rule as `app/convex/core/ppvRisk.ts`. Gemini never scores. `suspectedCancer` is
still the cancer the synthetic patient was generated with.

Held-out, same 78 patients (target = the published-risk score):

| Model | Shown score off by (MAE) | All 3 scores exact | Cancer-type accuracy | Control left at none | Latency |
| --- | --- | --- | --- | --- | --- |
| `vitruvian-triage-ppv` (E4B + LoRA) | **0.59** | **80.8%** | 94.9% | 97.1% | 2.2 s |
| `vitruvian-triage` (current, Gemini-teacher scores) | 3.08 | 0% | 92.3% | 85.3% | — |
| prompted Gemma 4 E4B with `SYSTEM_PPV` | 3.38 | 9.0% | 67.9% | 44.1% | 2.4 s |

Shown score = the score the GP sees (true cancer's score; top score for a control). Paired sign test on that error:
closer than the current LoRA on 70 patients, further on 8 (p ≈ 2e-13); closer than prompted E4B on 60, further on 6
(p ≈ 3e-12). Cancer-type accuracy vs the current LoRA: 5 vs 3 patients (McNemar p = 0.73), so **no claim that it is
better at picking the cancer**; vs prompted E4B 21 vs 0 (p < 0.001). One training config (r16, 3 epochs), chosen
before scoring.

Honest caveat: the published single-symptom figures are low for most of these synthetic lung patients (smoking is not
in the table), so the published score separates cancer from control less well (AUROC 0.75 for the target itself,
0.81 for the model) than the Gemini-teacher score did (0.96). It is closer to published evidence, not a better
detector. Results: `ml/results/triage-ppv/`.
