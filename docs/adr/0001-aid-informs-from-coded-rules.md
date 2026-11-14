---
status: superseded in part (2026-11-14 17:40)
---

# The Aid informs from coded, cited Rules; models never set the Risk band

**Update, 2026-11-14 17:40:** Michal chose an AI risk gradient (0–10) set by the model, shown next to the matched cited Rules, instead of rule-set bands. Reason: the hackathon shows the concept, and a government version would be tuned and validated. The "Aid informs, GP decides" part still holds. See BUILD-PLAN decision 14.

The GP Aid shows a Suspected cancer type, a Risk band and a Severity, but the GP always decides. The Risk band comes from coded Rules with guideline sources (NICE NG12, Käypä hoito), and Severity comes from a cited survival table. The Gemini Decisions API answers one yes/no question per Rule, and Gemma turns notes into fields. Neither model sets the band. We chose this over a model-made score or a UK formula (QCancer-style) for three reasons. Every output must trace to a source, because the AstraZeneca judging gives 20% to data quality and transparency. No Finnish patient-level risk model exists to validate against (docs/research/context/12-gp-risk-tool.md). Even an aid that only informs is likely MDR Class IIa or higher (docs/research/law/03-data-ai.md), so the demo is labelled a research prototype, not a medical device.

## Consequences

- Adding a cancer type means adding Rules and a survival figure with sources, not retraining.
- The UI must show the source of each matched Rule and say that the GP decides.
