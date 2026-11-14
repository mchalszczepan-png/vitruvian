Archived 2026-11-14: third cancer changed to ovarian

## Prostate

### PROS-01: prostate feels malignant on rectal examination
- **Red flag:** prostate feels abnormal or hard on digital rectal examination.
- **Threshold:** any age.
- **Action:** refer using a suspected cancer pathway referral.
- **NG12:** 1.6.1 [2015]. Link: https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer
- **Finnish:** [Käypä hoito prostate](https://www.kaypahoito.fi/hoi11060) (published 17.12.2025, under revision): an abnormal DRE finding is an indication for biopsy (section 5.2.1). Read through the page summary, not the full text.
- **Decisions question:** Does the note say the prostate felt hard, lumpy or abnormal on rectal examination?
- **Note facts needed:** examination finding (text).

### PROS-02: PSA above the age limit
- **Red flag:** PSA (prostate-specific antigen) above the limit for the patient's age.
- **Threshold (µg/L):** age 40–49: above 2.5. Age 50–59: above 3.5. Age 60–69: above 4.5. Age 70–79: above 6.5. Under 40 and over 79: clinical judgement, no automatic Rule. These are NG12 Table 2 numbers, used as the age reference until Käypä values are found.
- **Action:** consider referral. Take into account the patient's preferences and other illnesses.
- **NG12:** 1.6.3 [2021] (Table 2). Same link.
- **Finnish:** Käypä hoito (above) says repeat PSA if above the age reference value and under 20, and refer to urology if it stays raised (section 5.2.3.4). The page does not list the reference values. **[unverified]** Finnish numbers.
- **Decisions question:** Does the note say the PSA is above the age limit for this patient: 2.5 µg/L at ages 40–49, 3.5 at 50–59, 4.5 at 60–69, or 6.5 at 70–79?
- **Note facts needed:** age (structured); PSA result and unit (test result). Code can compare the number; the question is for free-text notes only.

### PROS-03: lower urinary tract symptoms
- **Red flag:** lower urinary tract symptoms, such as getting up at night to pass urine, frequency, hesitancy, urgency or retention.
- **Threshold:** no age in NG12.
- **Action:** consider PSA and digital rectal examination. This is a test prompt, not a referral.
- **NG12:** 1.6.2 [2015]. Same link.
- **Finnish:** Käypä hoito says urinary symptoms follow the separate "Virtsaamisoireet (miehet)" guideline, which includes DRE and PSA (section 5.2). **[unverified]** not opened.
- **Decisions question:** Does the note say the man has lower urinary symptoms, such as getting up at night to pass urine, passing urine often, weak flow, urgency, or retention?
- **Note facts needed:** symptoms (text); sex (structured).

### PROS-04: erectile dysfunction
- **Red flag:** erectile dysfunction.
- **Threshold:** no age in NG12.
- **Action:** consider PSA and digital rectal examination. This is a test prompt, not a referral.
- **NG12:** 1.6.2 [2015]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say the man has erectile dysfunction?
- **Note facts needed:** symptom (text).

### PROS-05: visible blood in urine
- **Red flag:** visible haematuria.
- **Threshold:** no age in NG12 for prostate. Bladder Rule (NG12 1.6.4): age 45+, unexplained, no UTI, refer.
- **Action:** consider PSA and digital rectal examination. For the bladder Rule, see the note above.
- **NG12:** 1.6.2 [2015] (prostate); 1.6.4 [2015] (bladder). Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say there is visible blood in the urine?
- **Note facts needed:** symptom (text); age (structured); infection status (text).

### PROS-06: bone pain, possible spread
- **Red flag:** unexplained bone pain, especially back pain, that may mean the cancer has spread.
- **Threshold:** no threshold found. **[unverified]**.
- **Action:** Käypä hoito says PSA and DRE are recommended when suspicion of advanced disease is raised (section 5.1.2). The Aid should show this as Finnish-only.
- **NG12:** not found in the prostate section. **[unverified]**.
- **Finnish:** [Käypä hoito prostate](https://www.kaypahoito.fi/hoi11060). Read through the page summary. **[unverified]**.
- **Decisions question:** Does the note say the man has unexplained bone pain, especially in the back?
- **Note facts needed:** symptom (text); sex (structured).

### PROS-07: PSA raised but rectal examination normal (repeat, do not refer yet)
- **Red flag:** PSA above the age limit (PROS-02) with a normal rectal examination. This is an action Rule, not a referral Rule.
- **Threshold:** PSA above the age limit in PROS-02, and PSA below 20 µg/L.
- **Action:** repeat PSA in 1–2 months before more tests. Refer if it stays raised. Measure PSA no earlier than 6 weeks after a febrile urinary infection, and avoid it for at least a month after a biopsy (Käypä table 10, section 5.2.2).
- **NG12:** 1.6.3 [2021] for the threshold. Same link.
- **Finnish:** [Käypä hoito prostate](https://www.kaypahoito.fi/hoi11060) section 5.2.3.4 (repeat after 1–2 months). Section 5.2.2 says recheck PSA between 3 and 10 µg/L before biopsy. Read through the page summary, not the full text. **[unverified]** wording.
- **Decisions question:** Does the note say the PSA is raised but the rectal examination was normal?
- **Note facts needed:** PSA result and age (structured/test result); rectal examination finding (text); any recent urinary infection or biopsy (text).

### PROS-08: repeat PSA still raised after an earlier raised PSA (refer)
- **Red flag:** a repeat PSA is still above the age limit after an earlier raised PSA (see PROS-07).
- **Threshold:** repeat PSA above the PROS-02 age limit and below 20 µg/L. Applies whatever the rectal examination result. NG12 Table 2 numbers are the age reference until Käypä values are found.
- **Action:** refer to urology, as Käypä says when the PSA stays raised.
- **NG12:** none for the repeat step. Threshold from NG12 1.6.3 [2021] via PROS-02. Same link.
- **Finnish:** [Käypä hoito prostate](https://www.kaypahoito.fi/hoi11060), section 5.2.3.4 (refer to urology if the PSA stays raised). Summary read. **[unverified]** wording.
- **Decisions question:** Does the note say the PSA was raised before and is still raised on a repeat test?
- **Note facts needed:** two PSA results and dates (test results); age (structured).

## JSON for the app (prostate, archived)

### Prostate
```json
[
  {"id": "PROS-01", "cancerType": "prostate", "redFlag": "Prostate feels malignant on digital rectal examination", "threshold": "any age", "question": "Does the note say the prostate felt hard, lumpy or abnormal on rectal examination?", "sources": [{"label": "NICE NG12 1.6.1 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}, {"label": "Käypä hoito Eturauhassyöpä, section 5.2.1 (summary read)", "url": "https://www.kaypahoito.fi/hoi11060"}]},
  {"id": "PROS-02", "cancerType": "prostate", "redFlag": "PSA above the age-specific limit", "threshold": "40–49: above 2.5 µg/L; 50–59: above 3.5; 60–69: above 4.5; 70–79: above 6.5; under 40 and over 79: clinical judgement; NG12 numbers used as the age reference until Käypä values are found", "question": "Does the note say the PSA is above the age limit for this patient: 2.5 µg/L at ages 40–49, 3.5 at 50–59, 4.5 at 60–69, or 6.5 at 70–79?", "sources": [{"label": "NICE NG12 1.6.3 Table 2 [2021]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}, {"label": "Käypä hoito Eturauhassyöpä, section 5.2.3.4 (summary read; Finnish reference values [unverified])", "url": "https://www.kaypahoito.fi/hoi11060"}]},
  {"id": "PROS-03", "cancerType": "prostate", "redFlag": "Lower urinary tract symptoms (test prompt, not referral)", "threshold": "no age in NG12", "question": "Does the note say the man has lower urinary symptoms, such as getting up at night to pass urine, passing urine often, weak flow, urgency, or retention?", "sources": [{"label": "NICE NG12 1.6.2 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}, {"label": "Käypä hoito Eturauhassyöpä, section 5.2 (summary read) [unverified]", "url": "https://www.kaypahoito.fi/hoi11060"}]},
  {"id": "PROS-04", "cancerType": "prostate", "redFlag": "Erectile dysfunction (test prompt, not referral)", "threshold": "no age in NG12", "question": "Does the note say the man has erectile dysfunction?", "sources": [{"label": "NICE NG12 1.6.2 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}]},
  {"id": "PROS-05", "cancerType": "prostate", "redFlag": "Visible haematuria (test prompt, not referral; see bladder Rule NG12 1.6.4)", "threshold": "no age in NG12 for prostate", "question": "Does the note say there is visible blood in the urine?", "sources": [{"label": "NICE NG12 1.6.2 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}]},
  {"id": "PROS-06", "cancerType": "prostate", "redFlag": "Unexplained bone pain, possible spread (Finnish only) [unverified]", "threshold": "no threshold found [unverified]", "question": "Does the note say the man has unexplained bone pain, especially in the back?", "sources": [{"label": "Käypä hoito Eturauhassyöpä, section 5.1.1–5.1.2 (summary read) [unverified]", "url": "https://www.kaypahoito.fi/hoi11060"}]},
  {"id": "PROS-07", "cancerType": "prostate", "redFlag": "PSA raised but rectal examination normal: repeat, do not refer yet (action Rule)", "threshold": "PSA above the age limit (PROS-02) and below 20 µg/L; repeat after 1–2 months", "question": "Does the note say the PSA is raised but the rectal examination was normal?", "sources": [{"label": "Käypä hoito Eturauhassyöpä, section 5.2.3.4 (summary read) [unverified wording]", "url": "https://www.kaypahoito.fi/hoi11060"}, {"label": "NICE NG12 1.6.3 [2021] (threshold)", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}]},
  {"id": "PROS-08", "cancerType": "prostate", "redFlag": "Repeat PSA still raised above the age-specific limit after an earlier raised PSA (refer)", "threshold": "repeat PSA above the PROS-02 age limit and below 20 µg/L; applies whatever the rectal exam result; NG12 numbers are the age reference until Käypä values are found", "question": "Does the note say the PSA was raised before and is still raised on a repeat test?", "sources": [{"label": "Käypä hoito Eturauhassyöpä, section 5.2.3.4 (summary read) [unverified wording]", "url": "https://www.kaypahoito.fi/hoi11060"}, {"label": "NICE NG12 1.6.3 [2021] (threshold, via PROS-02)", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}]}
]
```
