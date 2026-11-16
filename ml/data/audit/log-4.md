# Audit log, batch 4 (in-4.jsonl -> out-4.jsonl)

## Totals

- Records: 49 audited, 49 changed (ids, split, language, kind and recordFacts kept; same order).
- Fields changed: 404. Evidence entries changed or added: 588.
- Records with note-text fixes (self-contradictory durations or dates only): 16.
- Validation: `ml/validate_data.py ml/data/audit/out-4.jsonl --against-eval ml/data/eval.jsonl` -> 49 records, 0 failing.

## Top error types (records affected)

1. Invented values (46/49): "false"/"no" booleans never mentioned (IDA, fitDone, earlySatiety, ascites, family history), smoking "never"/"unknown", generalCondition, empty `[]` medicines/illnesses, BRCA `not_tested`, CA-125 `false`/ultrasound `not_done`, symptomDaysPerMonth from vague wording, and some made-up meds, illnesses, diagnoses and test results.
2. gpQuestion paraphrased or invented instead of taken as written (39).
3. Evidence fragments ("2", "6", "42", "HTN") or evidence quoting the wrong phrase; re-quoted as full phrases (nearly all).
4. Wrong duration (24) and wrong symptomVisitCount (7); months now x 4.35, visits count only this symptom.
5. Inferred test dates (from "last week", result-report visits) removed (17); ca125Date set to null and kept present when the sample date is unstated.
6. Note contradictions fixed (16): durations that did not add up across visits, and results dated after the visit that reported them.

## Per record

- `lung-en-005` (7 fields, 8 evidence): removed invented weightLossKg 6.5, hypertension, medicines [] and haemoptysis false; gpQuestion as written; exam re-worded to note; evidence re-quoted
- `lung-en-013` (4 fields, 9 evidence): symptomDurationWeeks null -> 19 (since first cough visit 2026-04-03); testsDone [] (blood tests and CXR ordered, no result); smokingStatus current kept from 'Advised to stop smoking'; gpQuestion as written; evidence added
- `lung-fi-022` (7 fields, 10 evidence): duration 12 -> 9 (since 2026-02-13); removed invented Salbutamol, hypertension, asbestos false, CXR date; added CRP 42 test; gpQuestion as written; evidence re-quoted
- `lung-en-031` (2 fields, 10 evidence): smokingStatus unknown -> null; removed invented haemoptysis false; evidence for empty lists, CXR and lungSymptoms added, '3' fragment re-quoted
- `lung-fi-041` (7 fields, 8 evidence): smokingStatus unknown -> null; removed invented empty medicines/illnesses and haemoptysis false; gpQuestion as written; evidence added
- `lung-en-046` (7 fields, 9 evidence): duration 12 -> 4 (since first visit 2026-02-20, 'few weeks' unquantified); removed invented generalCondition good, asthma, CXR date; gpQuestion as written; evidence re-quoted ('10' -> full phrase)
- `lung-en-055` (8 fields, 8 evidence, note fix): note fix: today 'abt 6 weeks ago' -> 'abt 8 weeks ago' (tiredness already reported 2026-12-19); duration 6 -> 8; visitCount 3 -> 2 (routine check not for symptom); added Hb 10.9 test; removed invented omeprazole, hypertension; evidence added
- `lung-en-058` (3 fields, 15 evidence, note fix): note fix: '20 a day for 15 years' -> '20 a day for 30 years' in 2026-08-31 and today notes (contradicted 30 pack-years); removed inferred FBC/CRP dates; gpQuestion as written; evidence re-quoted
- `lung-en-068` (8 fields, 11 evidence, note fix): note fix 2026-05-12: cough 'lasting three weeks now' -> 'three months now' (cough documented since 2026-02-10); duration 3 -> 21; FBC/CRP merged, invented dates and wrong CRP result removed; gpQuestion as written; evidence re-quoted
- `lung-en-077` (7 fields, 8 evidence): removed invented smokingStatus former, empty medicines/illnesses, haemoptysis false; gpQuestion as written; evidence added
- `lung-fi-067` (7 fields, 14 evidence, note fix): note fix: cough durations '4 viikkoa' (2026-03-27) -> 10 and '7 viikkoa' (today) -> 17 (cough already 2 weeks on 2026-01-30); duration 7 -> 17; exam adds lymph nodes; evidence re-quoted
- `lung-en-093` (8 fields, 12 evidence): removed invented amlodipine dose and haemoptysis false; exam adds vitals; gpQuestion as written; evidence re-quoted
- `lung-fi-097` (9 fields, 8 evidence): duration null -> 11 (since 2026-03-06); generalCondition 'tired, lost weight' (symptoms) -> 'ok' from 2026-03-21; FBC named; gpQuestion invented -> as written; evidence added
- `lung-en-105` (9 fields, 15 evidence, note fix): note fix: cough '6 wks' (2026-03-18) -> 8 and '7 wks' (today) -> 14 (already 2 wks on 2026-02-02); duration 7 -> 14; removed invented COPD, hypertension, FBC date, asbestos false; gpQuestion as written; evidence re-quoted
- `lung-ctrl-fi-004` (6 fields, 8 evidence): smokingStatus never invented -> null; testsDone null -> [] ('Ei uusia kokeita'); medicine translated; gpQuestion as written; evidence added
- `lung-ctrl-fi-010` (6 fields, 8 evidence): visitCount 4 -> 1 (earlier visits not for cough); suspectedDiagnosis invented 'acute bronchitis' removed; exam adds temperature; gpQuestion as written; evidence re-quoted
- `colorectal-en-004` (4 fields, 13 evidence): removed invented weightLossKg 6.5; exam adds PR and general appearance; FBC result completed; evidence re-quoted (fragments '125','142','eight')
- `colorectal-en-009` (9 fields, 17 evidence): generalCondition fair invented -> 'looks slightly pale'; removed invented rectalBleeding false and fitDone false (FIT never mentioned -> null); gpQuestion as written; evidence re-quoted
- `colorectal-en-020` (8 fields, 13 evidence, note fix): note fix: today 'x 12wks' -> 'x 10wks' (2 wks on 2026-06-29 + 8 wks); duration 12 -> 10; removed invented generalCondition good and fitDone false; gpQuestion as written; evidence re-quoted
- `colorectal-fi-029` (6 fields, 9 evidence): smokingStatus unknown -> null; removed invented generalCondition Good and ironDeficiencyAnaemia false; exam translation completed; evidence re-quoted
- `colorectal-en-035` (5 fields, 14 evidence, note fix): note fix: removed garbled future date '3.9.2026 style timeline check'; smokingStatus never invented -> null; FBC/CRP sample dates removed; exam adds PR; gpQuestion as written; evidence added
- `colorectal-en-042` (9 fields, 14 evidence, note fix): note fix: '8 weeks' (2026-01-23) -> 11 and 'about 12 weeks' (today) -> 13 (bleeding already 'few weeks' on 2025-11-27); duration 12 -> 13; removed invented smoking never, generalCondition good, IDA false, FIT date; gpQuestion as written; evidence re-quoted
- `colorectal-en-053` (10 fields, 11 evidence): smokingStatus unknown -> null; removed invented generalCondition, empty medicines/illnesses, rectalExamResult not_done; FBC dated today; gpQuestion as written; evidence re-quoted
- `colorectal-en-059` (9 fields, 8 evidence): smokingStatus unknown -> null; removed invented FIT date, empty medicines/illnesses, rectalExamResult not_done; suspectedDiagnosis and gpQuestion as written; evidence added
- `colorectal-en-067` (8 fields, 17 evidence): removed invented smoking never, generalCondition good; ironDeficiencyAnaemia true -> null (Hb 112 only, iron not stated); evidence re-quoted
- `colorectal-en-075` (11 fields, 9 evidence, note fix): note fix: today 'about 12 weeks' -> 'about 14 weeks' (already ~12 weeks on 2026-04-15); duration 12 -> 14; removed invented smoking current, 30 pack-years, generalCondition, Ramipril, hypertension, IDA false, FIT date; gpQuestion as written; evidence re-quoted
- `colorectal-en-081` (9 fields, 13 evidence, note fix): note fix: today 'over the last 5 months' -> '4 months' (bowel change started 'a few weeks' before 2026-07-06); duration 20 -> 17; visitCount 4 -> 3 (2026-05-27 was lethargy/aches); removed inferred FBC/CRP dates and invented IDA false; gpQuestion as written; evidence re-quoted
- `colorectal-en-083` (7 fields, 18 evidence): removed invented generalCondition and fitDone false; tests renamed as written; gpQuestion as written; evidence re-quoted (fragments '12','6.5','98')
- `colorectal-en-102` (8 fields, 9 evidence): duration 8 -> 9 (2 months x 4.35); smokingStatus unknown -> null; removed invented IDA false and fitDone false; gpQuestion as written; evidence added
- `colorectal-en-106` (10 fields, 13 evidence): duration 8 -> 9 (2 months x 4.35); smokingStatus unknown -> null; removed invented generalCondition frail, fitDone false, rectalExamResult not_done; bloods dated 2026-05-04; gpQuestion as written; evidence re-quoted
- `colorectal-ctrl-en-003` (7 fields, 15 evidence): visitCount 3 -> 1 (new resolved episode); removed invented fitDone false (evidence was 'No current meds'), rectalExamResult not_done; IDA false -> null (Hb 10.9, iron not stated); suspectedDiagnosis and gpQuestion as written; evidence re-quoted
- `colorectal-ctrl-fi-009` (8 fields, 17 evidence): duration 12 -> 13 (3 months x 4.35); medicines/illnesses 'no medication' items -> []; invented IBS diagnosis replaced by GP's wording; test sample dates removed; gpQuestion as written; evidence added
- `colorectal-ctrl-fi-020` (10 fields, 9 evidence): visitCount 4 -> 2 (bleeding visits 2026-02-11 and today); removed invented smoking never, empty medicines/illnesses, fitDone false; exam completed; gpQuestion completed as written; evidence re-quoted
- `ovarian-fi-002` (15 fields, 22 evidence, note fix): note fix: 2026-04-21 note reported results dated 15.5/18.5 (after the visit) -> 15.4/18.4; duration 12 -> 11 (since first visit 2026-03-24); removed invented symptomDaysPerMonth 30, menopausal postmenopausal (age only), family history false, BRCA not_tested, 'large' mass, surgery planning in gpQuestion; evidence re-quoted (fragment '3')
- `ovarian-fi-016` (11 fields, 7 evidence): weightLossKg 0.5 -> 0 (note says no weight loss, +0.5 kg is a gain); removed invented testsDone [], empty medicines/illnesses, ca125Done false, ultrasound not_done, BRCA not_tested; exam adds no ascites; evidence re-quoted (garbage evidence on ca125/US/BRCA)
- `ovarian-fi-021` (5 fields, 10 evidence): gpQuestion as written (removed invented 'further investigation'); suspectedDiagnosis 'suspected'; test names/results as written; evidence re-quoted (fragments '16 viikkoa','2') and added for exam/tests
- `ovarian-en-032` (11 fields, 16 evidence, note fix): note fix: today 'for 6 weeks' -> 'for 10 weeks' (already ~3 wks on 2026-02-08); duration 6 -> 10; visitCount 4 -> 3 (2025-10-27 was a BP check); removed invented generalCondition good, empty medicines (ramipril stopped, nothing else stated), earlySatiety/urinary/ascites false, BRCA not_tested; gpQuestion as written; evidence re-quoted (fragments '6','78','HTN','bloating')
- `ovarian-en-042` (8 fields, 11 evidence): weightLossKg 6.5 invented -> 3 (only quantity stated, 2026-04-11); removed invented testsDone [], empty medicines, ca125Done false, ultrasound not_done; exam adds thin/BP/HR; gpQuestion as written; evidence re-quoted (fragments '8','2')
- `ovarian-fi-044` (12 fields, 14 evidence): removed invented 'normal' results for PVK/Krea/ALAT (only ordered), symptomDaysPerMonth 30, inferred CA-125/US dates (results reported 24.05, sample date unstated -> ca125Date null); mainSymptom/generalCondition fixed; translated meds/illness; evidence re-quoted
- `ovarian-fi-055` (12 fields, 13 evidence): duration 8 -> 9 (2 months x 4.35); visitCount 3 -> 2 (2026-01-16 had no complaints); smokingStatus unknown -> null; brcaStatus pathogenic_variant -> null (family variant known, patient's own result not stated); removed invented testsDone [], empty medicines/illnesses, ca125Done false, ultrasound not_done; gpQuestion as written; evidence re-quoted
- `ovarian-en-067` (9 fields, 13 evidence): removed invented smoking never, empty medicines/illnesses, family history false, BRCA unknown; testsDone [] kept ('Tests: None today'); suspectedDiagnosis/gpQuestion as written; evidence re-quoted (fragments '3','2','5', wrong 'None today' on family history)
- `ovarian-en-072` (12 fields, 18 evidence, note fix): note fix: 2026-02-10 note reported CA-125/USS dated 02-15/02-18 (after the visit) -> 02-05/02-08; duration 12 -> 13 (3 months x 4.35); removed invented FBC/CRP 'normal' results (only ordered), generalCondition 'fit and active', empty illnesses, premenopausal, family history false, BRCA not_tested; gpQuestion as written; evidence re-quoted (fragments '42.5','2WW')
- `ovarian-en-080` (9 fields, 16 evidence, note fix): note fix: today 'for last 4 months' -> 'for last 12 weeks' (6 wks on 2026-03-18 + 6 wks); duration 16 -> 12; removed invented generalCondition good, CA125 unit 'IU/ml', symptomDaysPerMonth 22 ('most days'), family history false, BRCA not_tested; mainSymptom adds early satiety; evidence re-quoted (fragments '4 months','2','42')
- `ovarian-en-089` (11 fields, 15 evidence, note fix): note fix: today 'for 6 weeks' -> 'for 9 weeks' (already 6 weeks on 2026-04-13); duration 6 -> 9; smokingStatus unknown -> null; removed invented generalCondition, empty medicines, symptomDaysPerMonth 30, postmenopausal (age only), family history false, BRCA not_tested; gpQuestion as written; evidence re-quoted (fragments '6','85.0')
- `ovarian-fi-091` (6 fields, 9 evidence): duration 8 -> 9 (2 months x 4.35); removed invented generalCondition, symptomDaysPerMonth 15 ('over 12 times a month' urinary frequency, not days); test names translated; gpQuestion as written; evidence re-quoted and added for tests/meds/illness
- `ovarian-en-104` (6 fields, 14 evidence): duration 12 -> 13 (3 months x 4.35); removed invented exam details ('adnexal', 'deep palpation'), 'fit and well', ca125Done false ('not used alone' is not 'not done'); pelvic USS added to testsDone; gpQuestion as written; evidence added
- `ovarian-fi-108` (13 fields, 15 evidence, note fix): note fix: today '6 viikkoa' -> '8 viikkoa' (symptoms already present at 2026-05-29 visit, 7+ weeks earlier); duration 6 -> 8; removed invented Paracetamol (note: unnamed BP medicine), earlySatiety false, ascites false, inferred CA-125/US dates (sample dates unstated -> ca125Date null); suspectedDiagnosis/gpQuestion as written; evidence re-quoted (ascites evidence was family-history text)
- `ovarian-ctrl-fi-010` (10 fields, 8 evidence): duration 52 invented -> 7 (since first documented visit 2025-12-19); smokingStatus unknown -> null; removed invented 'endometriosis exacerbation' diagnosis, ascites false, ca125Done false, BRCA not_tested; ultrasound not_done (referral for it); translated meds/illness; evidence added
- `ovarian-ctrl-fi-019` (11 fields, 7 evidence): pelvicOrAbdominalPain true -> false ('pain only on urination, no other abdominal pain'); removed invented empty medicines/illnesses, 'recurrent cystitis' diagnosis, ca125Done false, ultrasound not_done, BRCA not_tested; gpQuestion as written; evidence re-quoted

## Judgement calls

- `lung-en-005`: kept the stated 3 weeks although fatigue appears at the 2026-09-25 visit.
- `lung-en-013`: smoking current from "Advised to stop smoking"; generalCondition null ("feeling generally unwell" is a symptom, not a condition grade).
- `lung-en-046`: "few weeks" is unquantified, so duration counts from the first visit (4 weeks).
- `lung-en-093`: duration 6 taken from the weight-loss span.
- `lung-fi-097`: generalCondition "ok" taken from the 2026-03-21 note.
- `lung-ctrl-fi-010`: the typo "Torstailääkitys ei käytössä" read as no regular medicines; note not changed (not a date issue). Same for the "GP-99" / "GP-988" artefacts in `colorectal-en-035` and `ovarian-en-104` (left in place).
- `colorectal-fi-029`: haemorrhoids on PR exam coded as rectalExamResult abnormal.
- `colorectal-en-004`, `colorectal-en-067`, `colorectal-ctrl-en-003`: "no blood" on PR/DRE or in history coded as rectalBleeding false.
- Finnish "kiireellinen" plus cancer suspicion coded urgent_2_week (dataset rule).
- fitDone and chestXrayResult are null when the test is never mentioned; ca125Done false / ultrasound not_done kept only when the note says "not yet done", "None today" or refers the patient for that test (`ovarian-en-032`, `ovarian-en-067`, `ovarian-fi-091`, `ovarian-ctrl-fi-010`).
- `ovarian-en-104`: "CA-125 not used alone per protocol" does not say it was not done, so ca125Done null.
- `ovarian-fi-055`: brcaStatus null; the note says a familial BRCA1 variant is known but not the patient's own result.
- `ovarian-en-042`: weightLossKg 3 (the only stated amount, 2026-04-11) although loss is "ongoing" today.
- `ovarian-fi-016`: weightLossKg 0 ("no weight loss"; the +0.5 kg is a gain).
- `ovarian-fi-091`: symptomDaysPerMonth null; "over 12 times a month" is urinary frequency, not a day count.
- `ovarian-en-067`, `ovarian-ctrl-fi-010`: premenopausal from documented periods.
- `ovarian-ctrl-fi-010`, `ovarian-ctrl-fi-019`: family history false from "no family history of ovarian / gynaecological cancer" (breast not named).
- `ovarian-fi-021`: ascites false from the exam ("ei askites") although ultrasound mentions fluid.
- `ovarian-fi-002`, `ovarian-en-072`: results dated after the visit that reported them; result dates moved before that visit rather than moving the visit.
- `ovarian-en-080`: the March note's smoking self-correction left as is; latest note says never smoked.
