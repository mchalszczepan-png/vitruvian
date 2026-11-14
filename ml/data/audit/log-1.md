# Audit log, batch 1 (`in-1.jsonl` -> `out-1.jsonl`)

## Totals

- Records: 49 in, 49 out, same order; ids, split, language, kind and recordFacts unchanged.
- Records with a target change: 49 of 49.
- Field changes: 321 in total.
  - 134 were invented values set to null or removed: unstated smoking or general condition, "no" booleans, [] for medicines or illnesses, "unknown" or "not_tested" enums, made-up tests, dates, drugs and illnesses.
  - 176 were corrected values: duration, visit count, gpQuestion and suspectedDiagnosis taken as written, exam text, test lists, translations.
  - 11 went from null to a stated value.
- Evidence was rewritten in all 49 records: fragments such as "2", "4", "no" or "Vastaanotto" were re-quoted as full phrases, and missing evidence was added.
- Note text changed in 17 records:
  - 15 self-contradictory durations or dates were fixed.
  - 2 generator tags were removed: "(truth)" and "today's is truth".
- Validation: `ml/validate_data.py ... --against-eval ml/data/eval.jsonl` gives 49 records, 0 failing.

## Per record

1. `lung-en-002`: generalCondition, currentMedicines [], otherIllnesses [] were invented -> null; gpQuestion as written; evidence re-quoted (duration, tests, CXR, symptoms).
2. `lung-fi-006`: Invented Salbutamol, hypertension and asbestos false removed; examFindings adds the reduced right upper breath sounds; generalCondition 'good'; gpQuestion translated as written; fragment evidence ('40', '12', '2', 'Kiireellinen', bare date) re-quoted.
3. `lung-fi-014`: Note fix: earlier note said cough 'runsaan kuukauden' 5 weeks before a 7-week total -> 'pari viikkoa'; invented [] medicines, hypertension and asbestos false removed; examFindings adds 'no breathlessness'; evidence re-quoted.
4. `lung-fi-026`: symptomVisitCount 3 -> 2 (2025-12-15 was a cold, not fatigue); testsDone null -> [] (planned, not done); evidence added for tests, CXR, diagnosis.
5. `lung-en-034`: generalCondition 'good', medicines [] and illnesses [] invented -> null; testsDone null -> []; exam keeps node size; gpQuestion as written; evidence added for packYears, duration.
6. `lung-en-038`: Note fix: 2026-03-07 swelling 'approx one month ago' contradicted 5 weeks on 04-12 -> 'a few days ago'; symptomVisitCount 3 -> 2 (02-10 was fatigue only); suspectedDiagnosis drops invented 'cervical lymphadenopathy' wording; evidence completed.
7. `lung-en-050`: Note fixes: '5 weeks since first seen' after 3 weeks -> 3 weeks; today 'first noticed 5 weeks ago' for a lump seen 11 weeks earlier -> 11 weeks; duration 5 -> 11; currentMedicines [] from 'no meds'; generalCondition from 'Fit and well'; FIT date dropped (not stated); evidence completed.
8. `lung-fi-056`: Note fix: cough 'noin 3 viikkoa' although present since 2026-02-02 -> 'noin 7 viikkoa'; duration 3 -> 7; testsDone null -> []; gpQuestion as written; evidence added (smoking unknown is stated).
9. `lung-en-066`: symptomVisitCount 3 -> 1 (earlier visits were a check-up and a URTI); gpQuestion as written; evidence for tests, meds, illnesses, urgency added; invalid evidence key suspectedCancerType dropped.
10. `lung-fi-071`: Values were right; gpQuestion translated as written; fragment evidence ('12', '2', 'kiireellisenä', bare date) re-quoted; tests evidence added.
11. `lung-fi-084`: testsDone null -> [] (planned, not taken); suspectedDiagnosis names lung cancer; gpQuestion as written; evidence re-quoted (no trailing fragments).
12. `lung-en-090`: smokingStatus 'unknown', medicines [], illnesses [] and haemoptysis false were invented -> null; gpQuestion as written; evidence added for tests, CXR.
13. `lung-fi-098`: Note fix: 'kestänyt kaksi viikkoa' although symptoms recorded 2026-04-28 -> 'noin kuusi viikkoa'; duration 2 -> 6; symptomVisitCount 3 -> 2 (03-04 had no lung symptoms); gpQuestion as written.
14. `lung-en-107`: generalCondition 'PS 1', 'mild asthma' and haemoptysis false (quoted 'mild dry cough') were invented -> null/removed; symptomVisitCount 2 -> 1 (neck lump new today); adds 09-24 bloods result; gpQuestion as written.
15. `lung-fi-110`: Duration 3 months = 13 weeks (was 12); hypertension (only a BP reading), haemoptysis false and asbestos false invented -> removed; exam adds 'no oedema'; smoking evidence was the pack-year phrase; bogus visit-count evidence dropped.
16. `lung-ctrl-en-015`: Note fix: 'cough for 2 weeks' although cough recorded since 2026-01-04 -> 10 weeks; duration 2 -> 10; medicines [], illnesses [] and CXR not_done invented -> null; gpQuestion as written.
17. `colorectal-en-003`: smokingStatus 'unknown', generalCondition 'fit and well' and FIT date 2026-06-25 were invented -> null/dropped; gpQuestion as written; evidence for meds/illnesses/DRE added, '8' re-quoted.
18. `colorectal-en-007`: generalCondition 'good' invented -> null; ironDeficiencyAnaemia false -> null ('Anaemia not checked yet'); gpQuestion as written; removed generator tag '(truth)' from note; evidence re-quoted ('8', '2').
19. `colorectal-fi-015`: Duration 20 -> 28 (two months stated on 2026-05-07 + 19 weeks); never-smoker, amlodipine and hypertension (left in Finnish) invented -> null; ironDeficiencyAnaemia false not stated -> null; adds 06-19 'Hb normaali' test; evidence added for all booleans.
20. `colorectal-en-025`: testsDone [], fitDone false, ironDeficiencyAnaemia false, otherIllnesses [] invented (no tests mentioned; history is a prior cancer) -> null; generalCondition 'fit' from 'Fit non-smoker'; gpQuestion as written; evidence added.
21. `colorectal-fi-034`: urgency urgent_2_week invented (plain colonoscopy referral) -> null; suspectedDiagnosis 'colorectal neoplasm' not stated -> 'unclear clinical picture'; never-smoker, medicines [], anaemia false, DRE not_done invented -> null/removed; otherIllnesses [] kept from 'Perusterve'.
22. `colorectal-en-040`: generalCondition 'good' and FIT date 2026-09-20 ('last month') invented -> null/dropped; gpQuestion as written; evidence re-quoted ('8 weeks', '2', 'normal', 'FIT result').
23. `colorectal-en-046`: mainSymptom typo 'blooding' -> 'bloating'; smokingStatus 'unknown', anaemia false and DRE not_done invented -> null/removed; evidence for tests, meds, illnesses added.
24. `colorectal-fi-054`: Note fix: fatigue 'kuukauden verran' although recorded since 2026-06-20 -> 'noin 10 viikkoa'; duration 4 -> 10; invented omeprazole/'Hypertonia' replaced by the stated BP medication; smoking, general condition, abdominal mass, fitDone false invented -> null; Hb date dropped, low iron stores added.
25. `colorectal-en-065`: ironDeficiencyAnaemia false not stated -> null; generalCondition evidenced from 02-09 'looks well'; removed generator tag 'today's is truth' from note; gpQuestion as written; evidence added for almost every field.
26. `colorectal-en-073`: Duration 3 months = 13 (was 12); symptomVisitCount 2 -> 1 (01-12 visit was fatigue, weight loss first recorded today); invented test dates, smoking, general condition, DRE not_done removed; suspectedDiagnosis and gpQuestion as written.
27. `colorectal-fi-077`: Note fix: fatigue 'viimeisen kuukauden' although recorded 'a few weeks' on 2026-09-21 -> 'noin 9 viikkoa' (bleeding stays one month); duration 4 -> 9; iron-deficiency anaemia (Hb only, no iron studies), bowel change false, abdominal mass false, medicines [], smoking, general condition invented -> null.
28. `colorectal-en-088`: Note fix: 2026-08-02 note cited a future '3.9.2026 check' -> 'Recovery expected within days'; smoking, general condition, medicines [], illnesses [], DRE not_done invented -> null/removed; gpQuestion as written; urgency evidence added.
29. `colorectal-fi-095`: smoking 'unknown', medicines [], illnesses [], anaemia false and abdominal mass false (only 'soft, non-tender') invented -> null; gpQuestion as written; fragment evidence ('12', '4', 'Kiireellinen') re-quoted.
30. `colorectal-fi-099`: Note fix: today 'kuukauden ajan' contradicted fatigue since 2026-06-19 and blood since early August -> '9 weeks' blood, '16 weeks' fatigue; duration 4 -> 16; Hb series added; omeprazole dose and 'Hypertonia' invented -> stated BP medication + omeprazole; abdominal mass, IDA (no iron studies), fitDone false invented -> null.
31. `colorectal-ctrl-en-004`: never-smoker, general condition, medicines [] and fitDone false invented -> null; otherIllnesses [] -> piles ('Hx of piles'); gpQuestion as written; evidence re-quoted ('3', '2', 'normal').
32. `colorectal-ctrl-fi-012`: symptomVisitCount 2 -> 1 (07-30 visit was back pain); invented gpQuestion ('GI surgery clinic, prolonged constipation') -> as written; never-smoker, general condition, fitDone false, DRE not_done invented -> null/removed; Krea named Creatinine.
33. `colorectal-ctrl-fi-014`: bowelHabitChange false -> true (stools still looser; evidence was 'Ei verta ulosteessa'); invented gpQuestion ('prolonged symptoms') -> as written; never-smoker, anaemia false, fitDone false, DRE not_done invented -> null/removed.
34. `ovarian-fi-005`: Note fix: bloating 'noin 2 kk' although it began a good month before 2026-09-27 -> 'noin 12 viikon'; duration 8 -> 12; testsDone null -> []; family history false from 'Ei aikaisempaa sukutaustaa'; menopause evidence (age only) dropped.
35. `ovarian-fi-009`: Duration 3 months = 13 (was 12); ca125Done false and brcaStatus not_tested invented (never mentioned) -> null; symptomDaysPerMonth 30 for continuous ('jatkuva') bloating; amlodipine translated; evidence added for smoking, pack-years, tests, meds.
36. `ovarian-en-023`: Duration 2 months = 9 (was 8); medicines [], ascites false, ultrasound not_done, family history false, BRCA not_tested invented -> null; gpQuestion as written; evidence added for duration and days/month.
37. `ovarian-en-027`: Note fix: today '3/12' contradicted 7 weeks on 2026-02-28 -> '9 wks'; duration 12 -> 9; otherIllnesses [] and ca125Done false invented -> null; premenopausal now evidenced by 'Men regular'; gpQuestion as written.
38. `ovarian-en-037`: Duration 3 months = 13 (was 12); ascites false, ultrasound not_done, BRCA 'unknown' invented -> null; pending CA-125 removed from testsDone (no result), ca125Date = sample date today; generalCondition latest 'good'; suspectedDiagnosis and gpQuestion as written; fragment '3' dropped.
39. `ovarian-fi-048`: urgency urgent_2_week invented (no urgency written) -> null; smoking 'unknown', medicines [], illnesses [] invented -> null; gpQuestion as written; fragment '1' dropped.
40. `ovarian-fi-043`: earlySatiety false invented (note reports abdominal fullness, no denial) -> null; mainSymptom adds bloating/fullness; evidence re-quoted ('6', '78', bare symptom words) and added for smoking, tests, illnesses, pain, urinary.
41. `ovarian-fi-059`: earlySatiety true (quoted weight loss) and symptomDaysPerMonth 30 (not stated) invented -> null; ultrasound test name translated; evidence re-quoted ('8 vko', '480', '1') and widened to full phrases.
42. `ovarian-fi-068`: smoking, menopause and BRCA 'unknown', medicines [], illnesses [] invented -> null; gpQuestion as written; bogus visit-count evidence dropped; evidence added for tests, CA-125, ultrasound.
43. `ovarian-fi-075`: Note fix: today '2 kuukautta' although bloating began 2025-10-15 -> '19 viikkoa'; duration 8 -> 19; testsDone [], CA-125 false, ultrasound not_done, medicines [], illnesses [] ('no metabolic disease' only), pain false (exam tenderness only), BRCA 'unknown' invented -> null; gpQuestion as written; evidence added (had 3 fragments).
44. `ovarian-fi-086`: Note fix: today 'parin kuukauden' although '2 kk' was already stated on 2026-06-26 -> 'noin kolmen kuukauden'; duration 8 -> 13; smoking 'unknown' invented -> null; testsDone null -> [] (CA-125 not yet done); evidence re-quoted ('Vastaanotto', 'hypertensio').
45. `ovarian-fi-098`: Duration 2 months = 9 (was 8); testsDone [], CA-125 false, ultrasound not_done (never mentioned), illnesses [], premenopausal at 48 invented -> null; brcaStatus pathogenic_variant -> null (variant known in the family, patient's own status not stated); gpQuestion as written.
46. `ovarian-en-102`: Note fix: today '3 months' although bloating recorded since 2026-04-27 -> 'about 5 months'; duration 12 -> 22; smokingStatus current (only 'Hx of smoking') -> null, pack-years 15 kept; hypertension, general condition, CA-125 false, family history false, BRCA not_tested invented -> null; gpQuestion as written.
47. `ovarian-fi-105`: Duration 3 months = 13 (was 12); mainSymptom fragment 'bloating and weight' fixed; 'fatigued' invented in generalCondition; BRCA not_tested (quoted family history) invented -> null; ultrasound test name translated; pain evidence added.
48. `ovarian-ctrl-fi-005`: BRCA not_tested invented -> null; gpQuestion includes the stated precautionary reason; Hb unit kept; bogus visit-count evidence dropped; evidence added for menopause and ultrasound.
49. `ovarian-ctrl-fi-013`: Invented 'Laaja PVK normal' test removed; palpableMass true (from ultrasound fibroids, not exam) -> null; duration null -> 10 (since first documented visit 2026-02-06, onset only 'pitkään'); suspectedDiagnosis as written ('myoomia'); fragment '3' dropped.

## Judgement calls

- Phone contacts count as visits for symptomVisitCount (lung-fi-056).
- When the main symptom is fatigue followed later by bleeding, duration and visit count follow the first symptom (colorectal-fi-054, -077, -099).
- A new symptom whose earlier visits were for something else gets visitCount 1 (lung-en-107, colorectal-en-073, colorectal-ctrl-fi-012, lung-fi-098 counts only visits with lung symptoms).
- ovarian-fi-068: the earlier visits mention only vague "vatsavaivoja", so they were not counted as bloating visits. visitCount stays 1 and duration stays null.
- ovarian-ctrl-fi-013: duration is 10 weeks, counted from the first documented visit, because onset is only "pitkään".
- lung-fi-014: visitCount 3, because "edellisestä kerrasta" in the earlier note implies a prior visit.
- Dates:
  - A result reported in a dated earlier note gets that note's date (lung-en-107).
  - Vague dates such as "last month" are dropped (colorectal-en-040, lung-en-050 FIT).
  - ovarian-en-037: ca125Date is the sample date ("taken today"). The pending CA-125 is not listed in testsDone because it has no result.
- Haemoglobin and anaemia:
  - Hb alone, without iron studies, gives ironDeficiencyAnaemia null.
  - A normal FBC gives false (colorectal-ctrl-en-004).
  - Low iron stores give true (colorectal-fi-054).
- abdominalMass needs an explicit "no mass"; "soft, non-tender" alone gives null.
- Symptom days per month:
  - "yli 12 pvä" gives 12 (ovarian-fi-005).
  - Continuous ("jatkuva") bloating gives 30 (ovarian-fi-009).
  - Not stated gives null (ovarian-fi-059).
- "Fit non-smoker" was read as general condition "fit" (colorectal-en-025).
- lung-en-050: generalCondition comes from the first visit's "Fit and well" (the only statement).
- An ultrasound or CA-125 that was "requested" or "not yet taken" counts as not done or false. A plain "Ei aikaisempia tutkimuksia" / "Ei muita kokeita" also counts as testing addressed (testsDone [], CA-125 false, ultrasound not_done).
- ovarian-fi-098: brcaStatus is null. The BRCA1 variant is known in the family, but the patient's own status is not stated.
- ovarian-en-102: "Hx of smoking 10 a day for 30 years" does not say current or ex, so smokingStatus is null and pack-years stay 15.
- Urgency: Finnish "kiireellinen" with a stated cancer suspicion counts as urgent_2_week (ovarian-fi-059, -075, -105). A referral with no urgency wording gets null (colorectal-fi-034, ovarian-fi-048).
- Note fixes rewrite the smallest phrase needed. Durations were made consistent with the earlier notes' stated duration plus elapsed time, or with the first documented visit.
- Flag: ovarian-fi-075 today note has no spaces between words (generator artefact). Only the duration phrase was fixed. Evidence quotes the spaceless text, so consider regenerating that note.
- Controls: chestXrayResult, DRE and similar fields stay null when not mentioned, even in control records (lung-ctrl-en-015).
