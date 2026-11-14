# Audit log, batch 7 (in-7.jsonl -> out-7.jsonl)

GP-coder audit of 48 training records, following the conventions in `ml/data/eval-audit.md` (lines 1-33).

## Totals

- Records changed: 48 of 48. All ids, split, language, kind and recordFacts are unchanged.
- Field values changed: 404.
  - 234 corrected values, including free text rewritten to match the notes.
  - 155 invented values set to null (required fields) or left out (optional fields).
  - 15 values filled in from null, where the notes support them.
- Evidence entries changed: 494. These were re-quoted as full phrases, added where a phrase exists, or removed from derived and absent fields.
- Notes fixed: 14 records, for self-contradictory durations or dates, plus one stray non-Finnish token.
- Fields changed most often:
  - gpQuestion 39
  - mainSymptom 38
  - testsDone 34
  - suspectedDiagnosis 32
  - currentMedicines 32
  - examFindings 28
  - generalCondition 27
  - otherIllnesses 26
  - symptomDurationWeeks 25
  - smokingStatus 22
- Validation: `uv run --quiet --with jsonschema ml/validate_data.py ml/data/audit/out-7.jsonl --against-eval ml/data/eval.jsonl` reports 48 records, 0 failing.

## Top error types found

1. **Invented values.**
   - Placeholders: `unknown` or `not_tested` for smoking, menopause and BRCA status.
   - Empty lists given for medicines and illnesses when the notes say nothing.
   - False tests: `fitDone`, `ca125Done` or `pelvicUltrasoundResult: not_done` with no supporting statement.
   - Exam values such as `ascites`/`abdominalMass` false, or general condition, with no supporting text.
   - Made-up test dates and medicine doses.
2. **gpQuestion paraphrased or invented** ("please advise on ...") instead of the question or referral reason as written.
3. **Wrong durations.** Months were not converted with ×4.35, elapsed time since earlier notes was ignored, and some notes contradicted their own earlier notes.
4. **Evidence fragments that do not support the value.** Examples: bare numbers ("3", "85"), date strings missing from the note, a mass phrase used as ascites evidence, a negation dropped, and evidence given for derived values (visit count, suspectedCancerType).

## Per-record changes

| # | id | main changes |
|---|---|---|
| 0 | lung-en-010 | Note: today '5 weeks' -> '7 weeks' (lump already present at 2026-04-12 visit, 6.4 wk earlier). Removed invented smoking 'never', general condition, meds [], asbestos-as-illness, haemoptysis false; duration 5->7; exam, gpQuestion as written; evidence re-quoted (no '5' fragment). |
| 1 | lung-en-016 | Removed invented meds [] and asbestos false; testsDone null->[] (CXR ordered, no result); gpQuestion as written; evidence added/re-quoted (testsDone, chestXrayResult, gpQuestion). |
| 2 | lung-en-024 | Duration 12->13 (three months x 4.35); testsDone []->null (tests never mentioned); evidence added for smoking, duration, meds, illnesses, urgency, lungSymptoms. |
| 3 | lung-fi-027 | Notes: cough durations fixed (10-05 'yli 6' -> 'noin 10' vk, today 'noin 7' -> 'noin 13' vk; cough began late July). Duration 7->13; removed invented asbestos false; meds add unnamed antihypertensive, salbutamol 'as needed'; FBC dated 2026-09-01; gpQuestion as written; evidence re-quoted (dropped 'viime viikkoina' for visit count, smoking quote now current status). |
| 4 | lung-fi-035 | Removed packYears 25 (vague '25 v/kk', '25 v-y'), invented salbutamol, asbestos false; duration 12->13; CRP 42 added; breathlessness added (2026-08-23); gpQuestion as written; evidence re-quoted (no '25'/'3 kk' fragments; fixed visit-count evidence). |
| 5 | lung-en-048 | Removed invented smoking 'never', FBC/CRP 'normal' results and dates, CXR date and findings (findings null, abnormal), haemoptysis false; visit count 3->1 (neck node first noted today; earlier note 'no lymphadenopathy'); cough added; gpQuestion and diagnosis as written; evidence added. |
| 6 | lung-fi-044 | Visit count 3->2 (two documented cough visits); duration 12->13; removed invented general condition 'good'; gpQuestion includes requested chest CT; evidence re-quoted (fixed visit-count evidence, 'keuhkosyövän' fragment, packYears added). |
| 7 | lung-en-063 | packYears 20->10 (10/day = 0.5 pack x 20 y); removed invented FBC/CRP 'normal' results (ordered only -> []); removed asbestos false; suspectedDiagnosis -> null (notes never name one); gpQuestion as written (was invented letter); chestXrayResult null->not_done; evidence added. |
| 8 | lung-en-074 | Removed invented packYears 20 (only '20-year history'), general condition 'Poor', salbutamol, hypertension, haemoptysis false, asbestos false, CT request in gpQuestion; added FBC/CRP normal (2026-05-09); duration 12 kept (since first visit); evidence added. |
| 9 | lung-en-080 | Note: today '6+ weeks' -> 'about 15 weeks' (cough present 1-2 wk before 2026-07-04 visit). Duration 6->15; gpQuestion as written (was invented 'urgently ... lung ca'); removed evidence for suspectedCancerType; evidence re-quoted ('6+' fragment). |
| 10 | lung-en-087 | gpQuestion as written (was invented); evidence re-quoted (fragments '30','8','1','6.5'; removed visit-count and suspectedCancerType evidence). |
| 11 | lung-fi-096 | Duration 8->19 (2 months at 2026-07-04 + 10 wk since); removed invented meds []; illnesses [] kept ('Perusterve'); exam 'breath sounds clear' -> 'lungs OK' as written; gpQuestion as written; evidence re-quoted (dropped 'toinen kerta'). |
| 12 | lung-en-103 | Removed invented smoking 'never', meds [], breast cancer as current illness (kept as priorCancer), haemoptysis false; evidence added/re-quoted ('3'). |
| 13 | lung-ctrl-en-002 | Removed invented smoking 'never', general condition, asthma as known illness, haemoptysis false, CXR not_done (CXR never mentioned -> null); urgency null->urgent_2_week ('2WW lung cancer pathway', dataset rule); gpQuestion as written; evidence re-quoted ('6','2'). |
| 14 | lung-ctrl-fi-008 | Note: today '6 viikkoa' -> 'noin 14 viikkoa' (cough since 2025-12-26). Duration 6->14; meds translated (budesonide), salbutamol 'as needed'; smoking conflict kept latest 'never'; evidence re-quoted ('6','3','hyvä' fragments). |
| 15 | lung-ctrl-en-017 | Note: today 'cough lasting 3 weeks' -> '9 weeks' (cough already 3 wk at 2026-03-29, 6 wk earlier). Duration 6->9; removed invented smoking 'never', meds [], illnesses [], haemoptysis false (evidence was 'no wheeze'); breathlessness added; gpQuestion as written. |
| 16 | colorectal-en-006 | Removed invented general condition 'good' and CRP 'normal' (CRP result not given); exam adds DRE; gpQuestion as written; illness 'HTN' expanded; evidence re-quoted ('2','4kg','140','none','normal' fragments; visit count derived). Smoking conflict (never vs ex-smoker) -> latest 'former'. |
| 17 | colorectal-fi-012 | Removed invented smoking 'unknown', fitDone false, rectal exam not_done; exam de-duplicated; diagnosis and gpQuestion as written; evidence re-quoted ('2','1'). |
| 18 | colorectal-en-022 | Visit count 3->2 (2026-09-28 visit had no complaints); removed invented smoking 'unknown', general condition 'good', fitDone false; suspectedDiagnosis -> null (not named); gpQuestion as written (was invented); evidence re-quoted ('4','3','98' fragments). |
| 19 | colorectal-en-032 | Removed invented smoking 'unknown', general condition, IDA false, fitDone false, testsDone [] (never mentioned -> null), suspectedDiagnosis (not named); gpQuestion 'please review' -> as written; evidence re-quoted ('12','4'). |
| 20 | colorectal-fi-027 | Duration 8->9 (2 kk); removed invented smoking 'unknown', IDA false, fitDone false, suspectedDiagnosis (not named); urgency urgent_2_week->urgent (plain 'kiireellisenä', no cancer suspicion written); mainSymptom drops abdominal pain (earlier visit only); gpQuestion as written; evidence re-quoted ('2','5','112','normaali'). |
| 21 | colorectal-fi-045 | Removed invented smoking 'never', IDA false (evidence was 'Ei verta ulosteessa'), fitDone false, rectal exam not_done, Hb date; illness translated; gpQuestion as written; evidence re-quoted ('8','2','5','tyydyttävä','kolorektaalisyöpä' not a substring). |
| 22 | colorectal-fi-048 | Note: today '2 vk' -> 'n. 4 vk' (diarrhoea already reported by phone 2026-03-01). Duration 2->4, visit count 1->2; removed invented IDA false; testsDone null->[] (no FIT), meds null->[] ('Ei lääkitystä'); exam adds DRE; evidence added/re-quoted. |
| 23 | colorectal-fi-060 | Removed invented smoking 'unknown', general condition 'good', IDA false, suspectedDiagnosis (suspicion not named); duration evidence added; testsDone null->[] (FIT not yet done); gpQuestion as written; exam adds rectal finding. |
| 24 | colorectal-fi-066 | Removed invented BPH, FIT date 2026-07-15, general condition 'Deteriorated' (-> 'satisfactory' from 2026-07-12), IDA false; meds translated; evidence re-quoted (visit-count evidence was a date, '6.5 kg', IDA). |
| 25 | colorectal-en-078 | Removed invented smoking 'unknown', general condition 'well', antibiotics as current med, illnesses [], testsDone [] (never mentioned), fitDone false ('no' evidence), rectal exam not_done, suspectedDiagnosis (not named); gpQuestion as written; evidence re-quoted. |
| 26 | colorectal-fi-087 | Note: today '2 vko' -> 'n. 3 vko' (loose stools already several days at 2026-07-02). Duration 2->3; removed invented IDA false, fitDone false, rectal exam not_done; testsDone null->[] ('ei tutkimuksia vielä'); gpQuestion as written; evidence re-quoted ('2','4,5'; added illnesses). |
| 27 | colorectal-en-094 | Removed invented smoking 'unknown' and fitDone false; duration 8->9 (2 months); gpQuestion as written (was invented); exam and general condition fuller; evidence added/re-quoted ('5','poor','normal','no blood'). |
| 28 | colorectal-fi-098 | Notes: pain durations fixed (2026-01-23 'n. 4' -> 'n. 7' vkoa, today 'noin 8' -> 'noin 11' viikkoa; pain already 'muutaman viikon' at 2025-12-23) and FIT 'tehty tammikuussa' -> 'tulos tammikuussa' (sample taken 2025-12-23). Duration 8->11; FIT date 2026-01-23 -> 2025-12-23; removed invented smoking 'never', meds [], illnesses [], IDA false (Hb not checked); diagnosis 'cancer to be excluded' as written; gpQuestion as written. |
| 29 | colorectal-fi-107 | Removed invented smoking 'never' and general condition 'good'; diagnosis 'cancer to be excluded' as written; gpQuestion as written; evidence re-quoted ('8','4,5','FIT','25'). |
| 30 | colorectal-ctrl-en-007 | abdominalMass false -> null (only PR mass and 'No abdo pain' stated); removed invented fitDone false; gpQuestion as written; evidence added (meds, illnesses, diagnosis) and re-quoted ('10 weeks','well'). |
| 31 | colorectal-ctrl-fi-018 | Duration null->0 (3 days); removed invented smoking 'unknown', testsDone [], meds [], illnesses [], abdominalMass false, fitDone false, rectal exam 'normal'; gpQuestion as written ('pyynnöstä'). |
| 32 | ovarian-en-007 | Duration 8->9 (2 months); removed invented general condition, ca125Done false, ultrasound not_done; evidence added (duration, meds, illnesses) and urgency re-quoted ('2WW'). |
| 33 | ovarian-fi-011 | Duration 8->9 (2 kk); visit count 3->4 (urinary symptoms 2026-03-08 and 04-25, bloating 05-12, today); removed invented meds [], illnesses [], ultrasound not_done, brca not_tested; gpQuestion as written (was invented gynae/USS request); evidence re-quoted ('3'). |
| 34 | ovarian-en-018 | Note: today '~6 wks' -> '~8 wks' (pain/discomfort first seen 2026-09-18). Duration 6->8; removed invented general condition, omeprazole dose, ascites false, ultrasound not_done, family history false, brca not_tested, test dates; ca125Date -> null (draw date not stated); diagnosis as written; evidence re-quoted (ascites quote was the mass phrase; '6','85','2026-10-09' not in notes). |
| 35 | ovarian-en-026 | Duration 16->17 (4 months); testsDone null->[] (tests ordered, no results); removed invented brca not_tested; smoking conflict (never vs ex-smoker) -> latest 'former'; gpQuestion as written; evidence re-quoted (urinary quote lacked negation; dropped suspectedCancerType, visit count). |
| 36 | ovarian-fi-036 | Removed invented smoking 'unknown', meds [], illnesses [], ultrasound not_done; added ascites/palpableMass false (stated); ca125Done false now quoted ('no new tests'); exam and CXR evidence completed. |
| 37 | ovarian-fi-045 | Notes: earlier-note dates '2006-...' -> '2026-...' (matched note dates). Removed invented meds [], illnesses [], ca125Done false, ultrasound not_done, brca not_tested; gpQuestion and diagnosis as written; evidence added (bloating, satiety, tests, family history) and re-quoted (visit count, menopause now from 'related to periods'). |
| 38 | ovarian-en-051 | Note: today 'about 8 weeks' -> 'about 14 weeks' (started ~6 wks before 2026-02-24). Duration 8->14; removed invented smoking, general condition, FBC/U&E results, test dates, meds, illnesses, ascites false (quote was the mass phrase), family history, brca; ca125Date -> null; gpQuestion as written. |
| 39 | ovarian-fi-061 | Removed invented smoking 'unknown', meds [], illnesses [], brca 'unknown'; menopause 'unknown' -> postmenopausal (age 60, derived); evidence added (tests, urgency, CA-125, ultrasound). |
| 40 | ovarian-fi-064 | Note: today 'n. 4 kk' -> 'n. 3 kk' (onset 'a few weeks' before 2026-09-11). Duration 16->13; removed invented test dates 2026-10-20, CA-125 unit, Bisoprolol dose, ascites false, brca not_tested; ca125Date -> null; evidence re-quoted (visit count dropped, urgency full phrase). |
| 41 | ovarian-fi-074 | Note: today header date 24.10.2026 -> 16.10.2026 (referral date). testsDone null->[] ('no lab tests yet'); removed invented smoking/menopause/brca 'unknown', ultrasound not_done; priorCancer treatment cleaned; evidence added (prior cancer, tests, urgency, pain, ascites) and re-quoted ('3'). |
| 42 | ovarian-en-083 | Removed invented FBC date and omeprazole dose; added CRP and ultrasound to tests; diagnosis 'ovarian carcinoma' -> as written (2WW referral); evidence re-quoted ('2','480','8 wks' fragments) and added (tests, diagnosis, urgency). |
| 43 | ovarian-en-094 | Removed invented smoking 'never' and brca 'unknown'; gpQuestion as written (was invented 'please advise'); testsDone null->[] and exam 'not examined' (both stated); menopause kept from age 36 without evidence; dropped suspectedCancerType evidence. |
| 44 | ovarian-fi-096 | Notes: 2026-04-16 '2 kuukautta' -> '2,5 kuukautta', today '2 kuukautta' -> '3 kuukautta' (onset weeks before 2026-02-21); stray non-Finnish token removed. Duration 8->13; removed invented test dates 2026-04-18 (ca125Date -> null); evidence re-quoted ('CA-125', urgency incl. suspicion) and added (tests). |
| 45 | ovarian-ctrl-en-002 | Duration null->12 (since first visit 2026-06-01); removed invented illnesses [], ca125Done false, brca not_tested; ultrasound findings add 'ovaries normal'; evidence added (tests, diagnosis) and re-quoted (visit count '3' dropped). |
| 46 | ovarian-ctrl-en-008 | pelvicOrAbdominalPain true -> false ('No ... abdominal pain'; pain only on micturition); removed invented smoking 'unknown', nitrofurantoin as current med (5-day course in Jan), 'recurrent UTI' as other illness, test date, ascites false, ca125Done false, ultrasound not_done, family history false, brca not_tested; menopause 'unknown' -> postmenopausal (age 63); gpQuestion as written. |
| 47 | ovarian-ctrl-en-014 | Duration 24->26 (6 months); removed invented ca125Done false; gpQuestion as written (was invented 'please advise'); evidence added (duration, tests, diagnosis, menopause) and re-quoted. |

## Judgement calls

- **Note edits (only for self-contradiction):**
  - lung-en-010: today "5 weeks" -> "7 weeks".
  - lung-fi-027: the 2026-10-05 note "yli 6" -> "noin 10" viikkoa; today "noin 7" -> "noin 13".
  - lung-en-080: "6+ weeks" -> "about 15 weeks".
  - lung-ctrl-fi-008: "6 viikkoa" -> "noin 14 viikkoa".
  - lung-ctrl-en-017: "3 weeks" -> "9 weeks".
  - colorectal-fi-048: "2 vk" -> "n. 4 vk".
  - colorectal-fi-087: "2 vko" -> "n. 3 vko".
  - colorectal-fi-098: earlier "n. 4 vkoa" -> "n. 7 vkoa"; today "noin 8" -> "noin 11"; "(tehty tammikuussa)" -> "(tulos tammikuussa)".
  - ovarian-en-018: "~6 wks" -> "~8 wks".
  - ovarian-fi-045: earlier-note dates "2006-..." -> "2026-...".
  - ovarian-en-051: "about 8 weeks" -> "about 14 weeks".
  - ovarian-fi-064: "n. 4 kk" -> "n. 3 kk".
  - ovarian-fi-074: today's header date 24.10.2026 -> 16.10.2026, to match the referral date.
  - ovarian-fi-096: "2 kuukautta" -> "2,5" (earlier) and "3 kuukautta" (today). A stray Chinese token "于是" was also removed. That token is not a contradiction, but it is corruption that would harm training.
- **Pack-years:**
  - lung-fi-035 and lung-en-074: packYears dropped, because "25 v/kk", "25 v-y" and "20-year history" are not clear pack-year figures.
  - lung-en-063: packYears 20 -> 10 (10 cigarettes a day for 20 years).
- **Main symptom and visit count:**
  - lung-en-048: the main symptom is the neck node, so the visit count is 1 (an earlier note says "no lymphadenopathy").
  - ovarian-fi-011: the main symptom is bloating plus urinary frequency, so the visit count is 4 (urinary visits from 2026-03-08).
- **suspectedDiagnosis set to null where none is named:** lung-en-063, colorectal-en-022, colorectal-en-032, colorectal-fi-027, colorectal-fi-060 and colorectal-en-078.
- **Urgency:**
  - colorectal-fi-027: "urgent", because it is a plain urgent referral with no cancer suspicion written.
  - "Kiireellinen" referrals to exclude suspected ovarian cancer (ovarian-fi-045, -fi-064, -fi-074, -fi-096): kept as urgent_2_week, following the eval precedent.
  - ovarian-en-051: "Routine 2WW suspected cancer referral" -> urgent_2_week; the 2WW wording wins.
  - ovarian-ctrl-en-008: "Routine referral" -> null.
- **Anaemia and smoking:**
  - colorectal-en-006, colorectal-en-094 and colorectal-ctrl-en-007: ironDeficiencyAnaemia false, from Hb 135 or "FBC normal".
  - Where smoking status conflicts between notes, the latest note wins: colorectal-en-006, lung-ctrl-fi-008 and ovarian-en-026 ("Never smoked" -> "Ex-smoker", so former).
- **Durations:**
  - colorectal-en-094: 9 weeks, from "over 2mths" of weight loss.
  - colorectal-fi-012: 2 weeks, from the antibiotic-associated loose stools.
  - colorectal-ctrl-fi-018: 0 weeks, from "3 vrk".
  - ovarian-ctrl-en-002: 12 weeks since the first visit.
- **Exam findings:**
  - colorectal-en-022: rectalExamResult kept "abnormal", because haemorrhoids were felt.
  - colorectal-ctrl-en-007: abdominalMass null. "No palpable mass on PR" is a rectal finding, not an abdominal one.
  - ovarian-en-094: examFindings "not examined today", because the note says so.
- **Symptoms and history:**
  - lung-fi-027: weight_loss kept, because clothes feel loose.
  - lung-ctrl-en-002: asthma not added to otherIllnesses, because it appears only in the impression.
  - ovarian-ctrl-en-008: nitrofurantoin is not a current medicine (it was a 5-day course in January), and "recurrent UTI" is the presenting problem, not another illness. pelvicOrAbdominalPain false, from "No ... abdominal pain".
- **Tests:**
  - CA-125 date set to null where the sample date is not stated (ovarian-en-018, -en-051, -fi-064, -fi-096).
  - ovarian-en-083: the stated dates (15/04/26 and 18/04/26) are kept.
  - ca125Done false is accepted from blanket test statements ("Ei uusia kokeita otettu", "Ei aikaisempia tutkimuksia", "Laboratoriotestejä ei ole vielä tehty", "No tests ordered yet"). Ultrasound not_done is accepted only where the statement covers imaging (ovarian-fi-061, ovarian-en-094).
- **Menopause:**
  - Derived from age, without evidence: ovarian-fi-061 (60), ovarian-en-051 (82), ovarian-ctrl-en-008 (63), ovarian-en-094 (36).
  - Taken from menstruation statements: ovarian-fi-045 ("related to periods") and ovarian-ctrl-en-014 (heavy periods at 54).
- **BRCA:** ovarian-en-007 and ovarian-fi-096 are pathogenic_variant, because a variant is known in the family.
