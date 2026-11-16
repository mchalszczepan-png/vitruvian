# Audit log, batch 8 (in-8.jsonl -> out-8.jsonl)

Opus 5.5 GP-coder audit of 48 synthetic training records against `ml/data/eval-audit.md` conventions (lines 1-33).

## Totals

- Records: 48. Records changed: 48.
- Field values changed (set, nulled or removed): 317.
- Evidence entries changed (re-quoted, added or removed): 486.
- Note texts fixed for self-contradictory durations or dates: 8 (lung-en-047, lung-fi-065, lung-en-082, lung-ctrl-en-019, colorectal-en-064, colorectal-en-096, ovarian-fi-019, ovarian-en-038).
- Validation: `ml/validate_data.py out-8.jsonl --against-eval eval.jsonl` -> 48 records, 0 failing.

Top error types in the input: invented smokingStatus ('never'/'unknown'); invented generalCondition; invented empty or filled medicine/illness lists; invented "no" booleans (fitDone, ca125Done, ascites, IDA, family history) and 'not_done'/'not_tested'/'unknown' enums; invented polite gpQuestions; invented test dates; wrong durations (3 months = 13 weeks) and visit counts; fragment evidence ('2', '8', 'normal', 'FIT'); invented findings (e.g. 'hilar enlargement', 'B-Kvr 2.1', ibuprofen 600 mg).

## Per record

- **lung-en-004** (fields 3, evidence 12): CXR date removed (only the result-received date is stated); evidence re-quoted (pack-years, 2WW, duration); suspectedDiagnosis evidence added.
- **lung-en-017** (fields 4, evidence 11): duration 8->9 (2 months); invented generalCondition 'good' -> null; invented gpQuestion replaced by referral text; evidence re-quoted (fragment '2'), added for tests/CXR.
- **lung-fi-025** (fields 7, evidence 9): duration 24->19 (cough 3 wk on 2025-12-31 + 16 wk); invented salbutamol and hypertension -> null; invented gpQuestion replaced; CXR test date removed (film date not stated); evidence added.
- **lung-en-032** (fields 1, evidence 9): mainSymptom aligned to note wording; evidence added for tests/meds and re-quoted for urgency/symptoms.
- **lung-en-043** (fields 1, evidence 6): testsDone null -> [] (note says no CXR yet); smoking 'unknown' kept because the note says it was not asked; evidence added.
- **lung-en-047** (fields 7, evidence 11, note): note fixed: lump 'first noticed 5 weeks ago' contradicted the 2026-06-01 visit -> 10 weeks; duration 5->10; invented 'hilar enlargement' removed; CXR date removed (not stated); invented gpQuestion replaced; evidence re-quoted.
- **lung-en-057** (fields 3, evidence 13): invented gpQuestion replaced by the written plan; evidence re-quoted (fragments '35', '8', '4.5') and added for tests, findings, symptoms.
- **lung-fi-065** (fields 5, evidence 10, note): note fixed: today said 6 weeks although 2026-02-01 already recorded about 6 weeks -> 'noin 14 viikkoa'; duration 6->14; visit count 3->2 (2025-12-31 visit was for cough only); embellished suspectedDiagnosis trimmed; evidence added.
- **lung-fi-070** (fields 5, evidence 8): invented generalCondition 'satisfactory', asthma and asbestos=false removed; gpQuestion taken as written; evidence added; bad visit-count evidence dropped.
- **lung-en-082** (fields 6, evidence 13, note): notes fixed: cough durations ('over 6 weeks' today, '8 weeks total' in July) contradicted the 2026-05-12 visit -> 19 weeks; duration 6->19; visit count 3->4; FBC/CRP added to tests; invented asbestos=false removed; invented gpQuestion replaced; evidence re-quoted.
- **lung-fi-089** (fields 6, evidence 8): invented smoking 'unknown' and empty meds/illness lists -> null; gpQuestion taken as written; evidence added.
- **lung-en-095** (fields 5, evidence 10): duration 12->9 (since first visit 2026-08-28); pending CXR removed from testsDone (no result; chestXrayResult stays null); evidence re-quoted ('current' fragment) and added.
- **lung-en-104** (fields 5, evidence 11): FBC Hb 10.9 added to tests (was []); invented empty meds/illness lists -> null; invented gpQuestion replaced; evidence re-quoted ('30', '6', '2WW').
- **lung-ctrl-en-003** (fields 8, evidence 4): duration 3->7 (cough since the 2026-05-17 bronchitis visit; '3 weeks' is the settling period); tests, CXR, meds, illnesses never mentioned -> null; 'acute bronchitis' diagnosis and invented gpQuestion replaced by note wording.
- **lung-ctrl-en-012** (fields 5, evidence 5): invented smoking 'never', general condition 'good' and diagnosis 'asthma flare' -> null; duration 12->13 (3 months); FBC normal added to tests; evidence added.
- **lung-ctrl-en-019** (fields 9, evidence 6, note): note fixed: '2 wks' contradicted the cough already present at the 2025-12-30 visit -> 5 wks; duration 2->5; tests, CXR, meds, illnesses never mentioned -> null; invented gpQuestion replaced; evidence re-quoted ('cough', '2 wks').
- **colorectal-en-005** (fields 4, evidence 21): rectalBleeding false -> null ('no blood' on DRE is not a history of no rectal bleeding); invented gpQuestion replaced; evidence re-quoted (fragments '8', '6.5', '104', '145', 'normal'), added for pack-years, tests, illnesses.
- **colorectal-fi-013** (fields 8, evidence 11): invented smoking 'unknown', B-Kvr result '2.1', ASA dose, iron deficiency (only Hb given) and fitDone=false removed; earlier Hb 112 added; evidence re-quoted.
- **colorectal-en-024** (fields 5, evidence 14): invented smoking 'unknown' and fitDone=false -> null; duration 12->13 (3 months); invented gpQuestion replaced; evidence added for all booleans, tests, meds.
- **colorectal-en-031** (fields 6, evidence 11): invented smoking 'never', general condition 'fit and well' and IDA=false -> null; FIT test date removed (only the result-received date is stated); invented gpQuestion replaced; evidence re-quoted ('186') and added.
- **colorectal-fi-037** (fields 6, evidence 14): duration 12->13 (3 months); testsDone null -> [] (no tests yet); invented fitDone=false -> null; wrong gpQuestion ('gastrocolonoscopy') replaced; smoking 'unknown' kept (note says not recorded); evidence re-quoted ('3 kk', 'ei verta').
- **colorectal-en-049** (fields 6, evidence 9): invented general condition and empty meds/illness lists -> null; FIT date removed (not stated); invented gpQuestion 'please review' replaced; evidence re-quoted ('8').
- **colorectal-en-057** (fields 5, evidence 11): invented IDA=false (evidence was the FIT sentence) -> null; testsDone null -> [] (note says no FIT yet); evidence added for meds and re-quoted.
- **colorectal-en-064** (fields 7, evidence 12, note): notes fixed: FBC date 3.9.2026 lay in the future of the 2026-03-19 visit -> 3.2.2026; test date 2026-03-09 -> 2026-02-03; visit count 3->1 (bleeding is new today); invented smoking 'never', general condition and empty meds -> null; invented gpQuestion replaced; rectalBleeding evidence was 'no PR bleeding' -> fixed.
- **colorectal-fi-072** (fields 5, evidence 8): duration 12->9 ('pari kuukautta' = 2 months); invented smoking 'unknown', abdominalMass=false (only a rectal mass) and fitDone=false -> null; invented gpQuestion replaced; evidence added.
- **colorectal-en-079** (fields 7, evidence 9): invented smoking 'unknown', general condition 'frail', empty tests/meds/illness lists and fitDone=false -> null; invented gpQuestion replaced; evidence re-quoted ('12', '4', 'normal').
- **colorectal-en-089** (fields 6, evidence 14): invented smoking 'never', empty tests list, IDA=false and fitDone=false -> null; invented gpQuestion replaced; evidence added for meds, illnesses, booleans.
- **colorectal-en-096** (fields 10, evidence 11, note): note fixed: 'bleeding and bowel change for twelve weeks' contradicted bowel change since 2026-02-13 and 'no bleeding yet' then -> 16 wk bowel change, 7 wk bleeding; duration 12->16; invented smoking, general condition, empty meds/illnesses, IDA=false and rectal exam 'not_done' removed; FIT date removed (only the result date); evidence re-quoted ('FIT').
- **colorectal-en-104** (fields 6, evidence 9): pending FBC/FIT removed from testsDone (no results -> []); invented smoking 'never', general condition and empty meds/illnesses -> null; invented gpQuestion replaced; evidence re-quoted ('8', 'not returned yet').
- **colorectal-ctrl-en-001** (fields 8, evidence 9): invented smoking 'never', general condition 'well' (today not stated) and diagnosis 'gastroenteritis' -> null; FBC normal (2026-06-27 note) added to tests; rectal exam 'not_done' removed (not mentioned); invented gpQuestion replaced; evidence added.
- **colorectal-ctrl-en-008** (fields 6, evidence 11): invented smoking 'never', empty meds list and diagnosis -> null; rectal exam 'not_done' removed; invented gpQuestion replaced; evidence re-quoted ('132', '3', 'good').
- **colorectal-ctrl-fi-017** (fields 9, evidence 8): duration 8->9 (2 months); invented smoking, empty meds/illnesses, abdominalMass=false, fitDone=false -> null; rectal exam 'normal' removed (only perianal inspection, showing haemorrhoids); evidence added.
- **ovarian-fi-006** (fields 10, evidence 7): testsDone null -> [] (note says no labs or imaging); invented smoking 'never', empty meds/illnesses, family history=false and BRCA 'unknown' -> null; ascites=false was evidenced by 'no bloating' -> null; invented gpQuestion replaced; evidence added.
- **ovarian-en-015** (fields 9, evidence 11): invented general condition 'fair', early satiety=false, 30 days/month ('persistent' only), CA-125/ultrasound/family/BRCA values -> null; invented gpQuestion replaced; evidence re-quoted ('12', '5').
- **ovarian-fi-019** (fields 13, evidence 11, note): note fixed: '6 viikon ajan' contradicted bloating since 2026-07-21 and pain since 2026-08-30 -> 15 and 9 weeks; duration 6->15; invented CA-125 and ultrasound dates removed (ca125Date null); invented smoking, antihypertensive, hypertension, early satiety, urinary, family history, BRCA removed; ascites=true from ultrasound 'fluid' -> null; evidence re-quoted.
- **ovarian-fi-025** (fields 6, evidence 12): duration 12->13 (3 months); ultrasound added to testsDone; medicines translated; ca125Done=false (evidence 'Ei todeta') and BRCA 'unknown' -> null; smoking 'unknown' kept (note says not known); evidence re-quoted.
- **ovarian-en-038** (fields 12, evidence 10, note): note fixed: 'twelve weeks' contradicted '3 months' bloating on 2026-07-09 -> seventeen weeks; duration 12->17; invented ultrasound date, general condition, 30 days/month, ascites, CA-125, family history, BRCA removed; invented gpQuestion replaced; evidence added.
- **ovarian-en-046** (fields 9, evidence 15): visit count 1->3 (discomfort reported 2026-06-12 and 2026-08-08); invented smoking 'never', general condition, FBC date, ascites=false, ultrasound 'not_done' and family history=false removed; PRN salbutamol added (was []); invented gpQuestion replaced; evidence fixed (fragments 'early satiety', 'urinary symptoms', 'Abdomen soft' for ascites).
- **ovarian-fi-053** (fields 6, evidence 8): duration 4->5 ('reilu kuukauden' = a good month); visit count 1->2 (phone visit 2026-09-21 for bloating); invented smoking, empty meds/illnesses and menopause 'unknown' -> null; evidence added.
- **ovarian-fi-060** (fields 8, evidence 12): duration 12->13 (3 months); invented general condition and BRCA 'not_tested' -> null; 'E-pillerit' translated; test names translated; gpQuestion taken as written; evidence re-quoted (fragment 'virtsatieoireita').
- **ovarian-en-070** (fields 10, evidence 8): duration null->5 (since first bloating contact 2026-01-01); visit count 1->2; invented smoking 'unknown', general condition 'well', empty meds/illnesses and premenopausal (age 41, not stated) -> null; invented gpQuestion replaced; evidence added.
- **ovarian-en-077** (fields 4, evidence 13): duration 8->9 (2 months); days/month 12->13 (3 days a week); invented CA-125 done=false and ultrasound 'not_done' -> null; evidence added; BRCA pathogenic_variant kept (family variant, as in eval).
- **ovarian-en-084** (fields 5, evidence 11): invented FBC/U&E/CA-125 dates (request and review dates) and ultrasound date 2026-08-16 removed (ca125Date null); ultrasound added to tests; BRCA 'not_tested' -> null; smoking 'unknown' kept (note says not recorded); evidence re-quoted ('6', 'good', '85') and added for meds, illnesses, urgency.
- **ovarian-en-092** (fields 11, evidence 8): invented smoking 'never', general condition, omeprazole, hypertension, family history=false and BRCA 'not_tested' -> null; 22 days/month ('most days') -> null; test dates added (10/06/2026 stated); diagnosis and invented gpQuestion replaced by note wording; evidence added.
- **ovarian-en-101** (fields 6, evidence 10): duration 8->9 (2 months); 30 days/month (not stated) and BRCA 'unknown' -> null; invented gpQuestion replaced; exam findings completed; CA-125 false and ultrasound 'not_done' now evidenced ('to be arranged at hospital'); evidence re-quoted ('2 months', '6 kg').
- **ovarian-fi-110** (fields 2, evidence 7): duration 16->17 (4 months); BRCA 'not_tested' -> null; evidence added for tests, meds, illnesses, ultrasound.
- **ovarian-ctrl-fi-006** (fields 10, evidence 8): ibuprofen dose '600 mg PRN' invented -> 'ibuprofen'; invented 'no underlying conditions', ascites=false, CA-125 false, ultrasound 'not_done' and BRCA -> null; 'PVK ja tlk' translated; gpQuestion and diagnosis taken from note; evidence added.
- **ovarian-ctrl-fi-015** (fields 12, evidence 7): past nitrofurantoin course removed from current medicines; invented general condition, 'no long-term illnesses', diagnosis 'recurrent cystitis', premenopausal (age 46), CA-125, ultrasound and BRCA -> null; early satiety (evidence 'no bowel symptoms') and ascites (evidence 'no swelling') -> null; culture date added; invented gpQuestion replaced.

## Judgement calls

- **Smoking 'unknown' kept** only where a note says smoking was not asked or not recorded (lung-en-043, colorectal-fi-037, ovarian-fi-025, ovarian-en-084). Everywhere else, unstated smoking -> null.
- **Test dates**: a date is kept only when the note gives the date the test was done. Result-received or review dates are not test dates (lung-en-004, lung-fi-025, lung-en-047, colorectal-en-031, en-049, en-096, ovarian-en-038, fi-019, en-084). ovarian-en-092 keeps 10/06/2026 ("investigations performed on").
- **Never-mentioned tests are null, not 'not_done'/false.** This includes controls (eval convention over the CONTRACT example). 'not_done'/false is kept only with a quote such as "No CXR done yet" or "imaging to be arranged at hospital". An optional rectal exam that is never mentioned is removed.
- **Rectal bleeding**: "no blood" on DRE does not mean no bleeding history -> null (colorectal-en-005). Blood on the glove -> true (colorectal-en-089).
- **Anaemia**: a normal Hb/FBC supports ironDeficiencyAnaemia=false. A low Hb alone does not support true (colorectal-fi-013 -> null).
- **Ascites**: ultrasound "fluid"/"free fluid" is not taken as ascites (ovarian-fi-019 -> null). ovarian-en-084 keeps false because the exam says "no ascites".
- **Symptom frequency**: "constant/daily/jatkuva" -> 30; "3 days a week" -> 13; "persistent" or "most days" alone -> null (ovarian-en-015, en-092, en-101).
- **Durations**: months x 4.35 rounded ('reilu kuukausi' -> 5 for ovarian-fi-053; 'pari kuukautta' -> 9 for colorectal-fi-072). lung-ctrl-en-003 -> 7 (since the bronchitis visit; "3 weeks" is the settling period). Stated 8 and 7 weeks kept for lung-en-057 and lung-fi-070, and 12 weeks for ovarian-en-015, despite small elapsed-time mismatches. ovarian-en-101 -> 9 (weight loss over 2 months; bloating had no stated start).
- **Visit counts**: lung-en-104 = 1 (the 06-18 phone mention of fatigue was put down to stress); colorectal-en-064 = 1 (bleeding is new today); lung-fi-065 = 2; ovarian-en-046 = 3.
- **General condition** from an earlier visit is kept only in the same episode (colorectal-fi-037, colorectal-ctrl-fi-017, ovarian-en-084, ovarian-ctrl-fi-006).
- **Menopausal status** comes from age only when clearly >= 70. Ages 41-46 -> null unless stated. ovarian-ctrl-fi-006 (age 24, menstrual pain documented) keeps premenopausal.
- **Urgency**: Finnish "kiireellinen ... syöpäepäily" / "2 viikon" referrals -> urgent_2_week.
- **Medicines**: a finished antibiotic course is not a current medicine (ovarian-ctrl-fi-015). "Kokeiltu ibuprofeenia" -> ibuprofen without the invented dose (ovarian-ctrl-fi-006).
- **BRCA**: family pathogenic variant -> pathogenic_variant (ovarian-en-077). 'not_tested'/'unknown' without a statement -> null.
- **lung-en-095**: CXR pending -> chestXrayResult null.
- **gpQuestion**: taken as written from the referral sentence; when the note has no explicit question, the referral reason is used.
