# Vitruvian: product

Surface mode: Operate.

## What it is

Vitruvian is a hackathon prototype for Junction 2026, AstraZeneca track "Equal Care Across Finland".
It helps a GP in a Finnish public health centre notice possible cancer early.
It then helps the GP send a complete, structured Referral.
A Specialist records the stage in a Staging report.

Research prototype. Not a medical device. Not for clinical use.

## Users

- **GP** (yleislääkäri), health centre. The main user. Writes the Referral.
- **Referral desk** (lähetekäsittely), hospital. Accepts a Referral or returns it.
- **Specialist** (erikoislääkäri), hospital. Confirms the diagnosis and records the stage.
- **Wellbeing services county** (hyvinvointialue). Reads the county gap figures.

## The four screens

1. **GP.** The Vitruvian panel docks beside a generic, unbranded record system.
   The panel has three steps: Patient, Referral template, Aid.
   Gemma reads the notes into the Referral template. The Aid then shows the result.
   The GP chooses what happens next.
2. **Referral desk.** Lists received Referrals. Shows the Suspected cancer type, Risk gradient, Severity and matched Rules. The desk accepts or returns each one.
3. **Specialist.** The Staging report for one cancer at a time. Required fields are marked. The report can be marked ready for the registry.
4. **County.** A gap screen with public figures only. Each figure names its area level (national, county or cooperation area). It ends with a "What a county does next" panel.

## Cancers in scope

- Lung
- Colorectal
- Ovarian

Each cancer has its own Referral template, Rules and Staging report.
Breast is a stretch goal only.

## Non-negotiables

- Show "Research prototype. Not a medical device. Not for clinical use." on every screen.
- Every number has a visible source link next to it.
- UI is in English. Finnish terms go in brackets, for example "Referral desk (lähetekäsittely)".
- Patients are made up. Use only the mock patients in `docs/build/mock-patients.json`.
- The GP decides. The Aid informs and never decides.
- Show the Risk gradient with the label "AI estimate".
- Gemma is mocked as a rule-based reader of the notes. Never say the model was "trained" or "fine-tuned".
- Use the GLOSSARY terms exactly: Referral, Referral template, Aid, Rule, Red flag, Suspected cancer type, Risk gradient, Severity, Repeat visit, Staging report, Specialist, Referral desk.

## What the GP sees in the Aid

- Suspected cancer type, from the matched Rules.
- Risk gradient, 0 to 10, labelled "AI estimate".
- Severity, as a cited five-year survival figure.
- Matched Rules, each with its guideline source.
- A Repeat visit flag when the same symptom comes back three times in the set window. The flag is a prompt to look again.
- A "GP decides" panel with the choices: refer urgently, order a test, refer routinely, or not now.

## Out of scope for the build

- The patient side (Omaolo). Slides only.
- Live data feeds. All figures are public or made up.
- Any claim that a real system is connected or used.
