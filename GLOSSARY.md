# Vitruvian

A GP-side tool for suspected cancer in Finland. It helps the GP notice possible cancer and send a complete, structured referral. A specialist then records stage in a structured report.

## People

**GP**:
The primary-care doctor at a public health centre who sees the patient and writes the referral. The tool's main user.
_Avoid_: doctor (too broad), clinician, user

**Specialist**:
The hospital doctor who receives the referral, confirms the diagnosis and records stage.
_Avoid_: oncologist (not always), hospital

**Referral desk**:
The hospital unit that receives GP referrals and accepts them or sends them back.
_Avoid_: triage, intake

## Documents

**Referral**:
The GP's request that sends a patient with suspected cancer to specialised care.
_Avoid_: lähete (only use it in Finnish UI), letter, order

**Referral template**:
The fixed list of required and optional fields that a Referral must fill for one cancer type.
_Avoid_: form, protocol, proforma

**Staging report**:
The Specialist's structured record of a confirmed cancer, including stage, that can go to the Cancer Registry.
_Avoid_: specialist report, registry notification, clinical notification

**Returned referral**:
A Referral that the Referral desk sends back to the GP, usually because something is missing.
_Avoid_: rejected referral, bounced referral

## Decision support

**Aid**:
The panel that informs the GP about possible cancer. It shows Suspected cancer type, Risk gradient, matched Rules and Severity. It never decides, and the GP always chooses what happens next.
_Avoid_: risk score, prompt, alert, AI diagnosis

**Red flag**:
One symptom, sign or test result that a published guideline links to a cancer type (for example haemoptysis for lung cancer).
_Avoid_: risk factor (when it is a symptom), trigger

**Rule**:
One coded red-flag condition with a cited guideline source. The Aid shows matched Rules next to the Risk gradient.
_Avoid_: model, algorithm

**Suspected cancer type**:
The cancer type that the matched Rules point to: lung, colorectal or ovarian.
_Avoid_: diagnosis, prediction

**Risk gradient**:
An AI estimate from 0 to 10 of how likely cancer is, set by the model and always labelled "AI estimate". It is shown next to the matched Rules and is not a validated score (BUILD-PLAN decision 14).
_Avoid_: risk band (old term), probability, percentage, diagnosis

**Severity**:
How dangerous the Suspected cancer type would be, shown as a cited survival figure for that cancer.
_Avoid_: danger score, aggressiveness, prognosis

**Repeat visit**:
A visit where the patient comes back for the same symptom. The third such visit within a set window is flagged to the GP.
_Avoid_: frequent attender, revisit

## Pathway

**Public route**:
Entry into care through a public health centre GP, as opposed to occupational or private care.
_Avoid_: public sector, municipal route

**Primary-care interval**:
The time from the patient's first GP contact to the Referral being accepted.
_Avoid_: GP delay, doctor delay
