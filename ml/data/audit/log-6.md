# Audit log, batch 6 (ml/data/audit/in-6.jsonl -> out-6.jsonl)

## Totals

- Records audited: 49. Records changed: 49.
- Field values changed, added or removed: 425 (target fields, excluding evidence).
- Evidence entries changed, added or removed: 625.
- Note text fixes: 13 edits in 11 records (only self-contradicting durations or dates).
- Records with gpQuestion rewritten to the GP's own words: 37. Records with a duration change or note fix: 29.
- Validation: `uv run --quiet --with jsonschema ml/validate_data.py ml/data/audit/out-6.jsonl --against-eval ml/data/eval.jsonl` -> 49 records, 0 failing.

## Top error types found

1. Invented values: smokingStatus 'never'/'unknown', generalCondition 'good', comorbidities, medicines, test dates, 'normal' results for tests with no result, brcaStatus 'not_tested'/'unknown', menopausal status from age alone.
2. Unmentioned booleans or tests set to false/'not_done' (fitDone, ca125Done, rectalExamResult, pelvicUltrasoundResult, ascites, earlySatiety, urinarySymptoms) -> null or removed.
3. gpQuestion paraphrased into an invented question -> the referral reason as written.
4. Empty lists [] for medicines/illnesses with no 'none' statement -> null; negations stored as items (e.g. ['no']) -> [].
5. Evidence as fragments ('12', '2', 'normal', 'hyvä') or pointing at the wrong phrase -> full verbatim phrases; evidence added where a phrase existed.
6. Durations: months not converted (3 months = 13 weeks), or note durations that contradicted earlier notes.

## Per record

- `lung-fi-011`: meds/illnesses [] -> null (not mentioned); testsDone null -> [] (labs planned, X-ray not done); gpQuestion invented -> referral sentence; evidence re-quoted (fragments '40', '6', 'hyvä').
- `lung-fi-015`: urgency urgent_2_week -> null (no urgency written); chestXrayResult not_done -> null (X-ray never mentioned); exam limited to 'lungs clear'; evidence re-quoted.
- `lung-fi-020`: duration 5 -> 8 (5 wk at 10.2 + 18 days); testsDone null -> [] (X-ray done, report missing); meds/illnesses [] -> null; gpQuestion invented -> referral sentence; exam adds lung finding.
- `lung-fi-023`: NOTE FIX 12.3 note '5 vkoa' -> '7 vkoa' (symptoms already present 28.1); duration 5 -> 13; smoking unknown -> never ('Ei tupakoi'); haemoptysis false -> null, CXR not_done -> null, testsDone [] -> null (never mentioned); meds/illnesses -> null; gpQuestion as written.
- `lung-fi-039`: duration 12 -> 13 (3 months); meds/illnesses [] -> null; gpQuestion as written; evidence re-quoted (visit-count '3' was the months figure, removed).
- `lung-en-045`: asbestos false removed (not mentioned); gpQuestion invented -> as written; mainSymptom adds SOB; evidence re-quoted (fragments '4', '2', 'good').
- `lung-fi-053`: invented X-ray date 2026-10-25 removed (testsDone and chestXrayDate); 'suspicious' dropped from findings; meds/illnesses negation items -> []; haemoptysis false -> null; gpQuestion as written.
- `lung-en-064`: testsDone null -> FBC/CRP normal + CXR 2026-09-11; evidence re-quoted (packYears '40', CXR 'shadow'); duration kept 13 (stated 3 months).
- `lung-fi-072`: NOTE FIX today '6 viikkoa' -> '8 viikkoa' (symptoms 'a couple of weeks' already on 17.7); duration 6 -> 8; meds [] -> null; prostate cancer moved out of otherIllnesses (kept in priorCancer); asbestos false removed.
- `lung-en-079`: smokingStatus 'unknown' kept (note says status unclear); gpQuestion invented -> as written; priorCancer evidence added; evidence re-quoted (fragments '3', '1').
- `lung-en-086`: generalCondition 'good' -> null; invented CXR 'pending' with date -> testsDone [] (report missing); haemoptysis false -> null; gpQuestion invented -> as written; packYears evidence added.
- `lung-en-094`: duration 11 -> 10 (first documented visit 27.12, 'few weeks' too vague to add); CRP normal added; gpQuestion invented -> as written; evidence added (smoking, meds, urgency) and suspectedCancerType evidence removed.
- `lung-fi-101`: duration 8 -> 9 (2 months x 4.35); antihypertensive added to meds; otherIllnesses 'Hypertension' -> null (only a BP medicine is named); exam 'right base' -> 'basally' (side not stated); gpQuestion as written.
- `lung-fi-108`: duration 12 -> 13 (3 months); exam adds reduced breath sounds left; packYears evidence added; gpQuestion as written; evidence re-quoted.
- `lung-ctrl-en-009`: duration null -> 10 (since first visit 12.3); generalCondition 'good' -> null; gpQuestion invented -> as written; urgency null kept (routine).
- `lung-ctrl-en-016`: currentMedicines [] -> ['amlodipine'] (stated in 2.10 note); Hb 10.9 g/dl added to testsDone; gpQuestion invented -> as written; exam adds red throat.
- `colorectal-fi-001`: invented 'Simvastatiini' and 'Hyperkolesterolemia' -> null; invented FIT date removed; Finnish test name translated; smoking evidence added; gpQuestion includes the referral reason.
- `colorectal-en-011`: NOTE FIX first note header '3.1.2026' -> '8.1.2026' (record date 2026-01-08); duration 16 -> 17 (4 months); fitDone false -> null (FIT never mentioned); generalCondition invented 'good performance status' -> 'stable but pale'; invented test dates removed; suspectedDiagnosis as written.
- `colorectal-fi-017`: invented lab dates removed; fitDone evidence fixed (was 'no blood in stool'; FIT ordered, no result); medicine translated; exam adds rectal finding; smoking evidence added; gpQuestion as written.
- `colorectal-fi-023`: smoking 'unknown' -> null (not mentioned); ironDeficiencyAnaemia true -> null (anaemia stated, iron status never tested); test names and medicine translated; exam adds abdominal findings; evidence re-quoted (fragments '4', '98', '210', 'hyvä').
- `colorectal-en-038`: smoking 'unknown' -> null; FBC 'no anaemia' added to testsDone; gpQuestion invented -> as written; evidence added (meds, suspectedDiagnosis, urgency) and fragments re-quoted ('12', '2', '186', 'normal').
- `colorectal-en-044`: smoking 'never' -> null (not mentioned); invented test dates removed; FBC/CRP merged as 'bloods normal'; gpQuestion invented -> as written; evidence added (meds, illnesses, urgency) and fragments re-quoted.
- `colorectal-fi-052`: NOTE FIX 14.1 '6 vkoa' -> '11 vkoa' and today '8 vk' -> '17 vk' (pain documented since 2.11.2025); duration 8 -> 17; rectalExamResult 'normal' removed (no rectal exam); meds/illnesses [] -> null; gpQuestion invented question -> as written; smoking: latest note wins (current).
- `colorectal-en-061`: smoking 'never', generalCondition 'good', meds [] and 'hypertension' all invented -> null; invented test dates removed; gpQuestion as written; evidence added (duration, urgency, Hb, FIT value, rectal exam).
- `colorectal-fi-068`: duration 12 -> 13 (3 months); ironDeficiencyAnaemia false -> null (wrong evidence; iron status not tested); fitDone false -> null and rectalExamResult 'not_done' removed (never mentioned); meds/illnesses [] -> null; gpQuestion invented colonoscopy -> as written.
- `colorectal-en-076`: duration 4 -> 11 (tiredness documented since 11/07, matching visit count 3); abdominalMass false -> null (only a PR exam, abdomen not examined); gpQuestion invented -> as written; evidence fragments re-quoted ('3', 'last month', '145', 'normal'); meds/illness evidence added.
- `colorectal-fi-086`: NOTE FIX today 'last month' contradicted fatigue since 24.6 and blood since 21.8 -> 'fatigue since June, blood since August'; duration 4 -> 15; smoking 'never', atorvastatin and hypertension all invented -> null; earlier Hb 112 added; FIT unit fixed; evidence added (tests, IDA, FIT, rectal exam, urgency).
- `colorectal-en-092`: smoking 'unknown' -> null; ironDeficiencyAnaemia false -> null (evidence was 'No abdo pain'); meds evidence 'No meds' added; evidence fragments re-quoted ('4,5 kg', '2WW', 'normal').
- `colorectal-en-103`: generalCondition 'good' invented -> null; testsDone [] -> null and illnesses [] -> null (never mentioned); ironDeficiencyAnaemia/fitDone false -> null, rectalExamResult 'not_done' removed (never mentioned); gpQuestion invented -> as written; evidence added (smoking, meds, exam, urgency).
- `colorectal-en-108`: meds/illnesses [] -> null (no 'none' statement); rectalExamResult 'not_done' removed; suspectedDiagnosis 'possible lower GI malignancy' -> as written (rule out pathology, likely benign); gpQuestion invented -> as written; evidence added (tests, FIT, urgency).
- `colorectal-ctrl-fi-006`: smoking 'unknown' -> null; meds/illnesses [] -> null; abdominalMass false -> null (evidence was 'no abdominal pain'; no abdominal exam); fitDone false -> null, rectalExamResult 'not_done' removed; evidence fragments re-quoted ('hyvä', '1').
- `colorectal-ctrl-en-015`: smoking 'never' invented -> null; IBS removed from otherIllnesses (it is the working diagnosis of this complaint) -> null; rectalExamResult 'not_done' removed; evidence added for 15 fields (tests, prior cancer, FIT, Hb, meds).
- `ovarian-en-004`: invented CA-125 date (ca125Date -> null) and invented 'FBC normal' removed; USS added to testsDone; earlySatiety/urinary/ascites false -> null, symptomDaysPerMonth 30 -> null, brca 'not_tested' -> null (never stated); gpQuestion invented -> as written; generalCondition 'good, fit and well' -> 'generally well'.
- `ovarian-en-010`: currentMedicines [] -> ['amlodipine'] (stated in 17.01 note); smoking 'never', generalCondition 'good', postmenopausal, family hx false, brca 'not_tested' all invented -> null; earlySatiety/pain/urinary false and symptomDaysPerMonth 30 -> null; FBC/CRP visit dates dropped; gpQuestion invented -> as written.
- `ovarian-en-022`: symptomVisitCount 1 -> 4 (discomfort at every visit since 19.4); duration 12 -> 13 (~3 months); smoking 'unknown', 'fit and well', family hx false, brca 'unknown' invented -> null; testsDone [] -> null, ca125Done false and USS 'not_done' -> null (never mentioned); gpQuestion invented -> as written; evidence fixed (single words like 'early satiety').
- `ovarian-en-029`: smoking 'unknown', generalCondition 'good', brca 'unknown' invented -> null; meds/illnesses [] -> null; gpQuestion invented -> as written; evidence added for 'Tests: none yet' (tests, CA-125, USS) and fragments re-quoted ('3', '1').
- `ovarian-fi-031`: NOTE FIX today '2 kk' -> '3 kk' (bloating already 'a few weeks' on 27.08); duration 8 -> 13; otherIllnesses ['no'] -> [] (a negation is not an item); brca 'pathogenic_variant' -> null (the variant is in the family, the patient's own status not stated); premenopausal and ascites false invented -> null; CA-125/USS dates (only the result-review date) -> null/removed; pill name 'combined' removed.
- `ovarian-fi-039`: duration 12 -> 13 (3 months); invented 'Normal' result for ordered bloods removed; urinarySymptoms null -> false ('ei virtsatieoireita'); ca125Done false and brca 'not_tested' -> null (never mentioned); gpQuestion invented -> as written; evidence added (tests, suspicion, urinary).
- `ovarian-en-052`: duration 8 -> 9 (2 months); premenopausal invented -> null; USS 'not_done' -> null (never mentioned); meds/illnesses [] -> null; pelvicOrAbdominalPain null -> false ('No abdo pain'); evidence added (duration, days/month, tests, diagnosis).
- `ovarian-fi-057`: duration 8 -> 13 (3 months); smoking/brca 'unknown' -> null; testsDone/meds/illnesses [] -> null and USS 'not_done' -> null (never mentioned); familyHistory null -> false ('no known hereditary cancer risk'); gpQuestion invented -> as written; fragments re-quoted ('3 kk', '5 kg', 'Vastaanotolle').
- `ovarian-fi-065`: duration 12 -> 13 (3 months); smoking/menopausal/brca 'unknown' -> null; meds [] and 'no long-term illnesses' invented -> null; gpQuestion invented -> as written; fragments re-quoted ('n. 3 kk', '07.07.2026', 'vatsan turvotuksen').
- `ovarian-en-076`: NOTE FIX 31.03 note header said '3.9.2026' -> '31.3.2026'; duration 12 -> 13 (3 months); 'good performance status' invented -> null; ascites false, ca125Done false, brca 'not_tested' -> null (never mentioned); USS date (only the review date) removed; gpQuestion invented -> as written.
- `ovarian-fi-079`: smoking 'never' -> former (latest note: has now quit completely); duration 8 -> 9 (2 months); meds null -> [] ('Ei lääkityksiä'); brca 'pathogenic_variant' -> null (family variant, patient untested); premenopausal (evidence was the age) -> null; ca125Done false and USS 'not_done' -> null (never mentioned); gpQuestion invented -> as written.
- `ovarian-en-088`: NOTE FIX today 'for 3m' -> 'for almost 4m' (already 3m on 13.10); duration 12 -> 16; smoking/brca 'unknown', generalCondition 'good', family hx false invented -> null; gpQuestion 'please review' -> full ask; evidence added (meds, urgency, tests, duration); suspectedCancerType evidence removed.
- `ovarian-en-099`: NOTE FIX today 'pain for 6 weeks' -> '3 months' (pain/bloating documented since 14.01, 'started about a month ago' on 09.02); duration 6 -> 13; generalCondition invented -> null; symptomDaysPerMonth 15 invented -> null; ascites false, USS 'not_done', family hx false -> null (never mentioned); gpQuestion invented -> as written.
- `ovarian-en-106`: duration 8 -> 9 (2 months); smoking 'unknown', 'fit and well', family hx false invented -> null; USS 'not_done' -> null (never mentioned); gpQuestion invented -> as written; evidence added (meds, tests, days/month, satiety, pain).
- `ovarian-ctrl-fi-004`: NOTE FIX 20.12 diet advice dated 3.9.2025 (before symptom onset) -> 'Marraskuussa'; today '12 viikkoa' -> '16 viikkoa' (bloating seen since 31.10.2025); duration 12 -> 16; testsDone null -> [] (CA-125/USS stated not done); brca 'not_tested' (evidence 'ei tehty' was about other tests) -> null; gpQuestion fuller as written.
- `ovarian-ctrl-fi-016`: NOTE FIX today 'neljä viikkoa' -> 'kymmenen viikkoa' (bloating seen since 21.08); duration 4 -> 10; earlySatiety false (evidence 'no weight loss') and ascites false (evidence 'no masses') -> null; meds/illnesses [] -> null; CA-125/USS/menopausal/brca invented -> null; gpQuestion as written.
- `ovarian-ctrl-fi-012`: mainSymptom 'recurrent UTI' -> urinary frequency and urgency as written; duration 10 -> 9 (since 01.04); nitrofurantoin course (not current) -> meds null; otherIllnesses -> [] ('Ei muita sairauksia'); negative culture added; smoking/menopausal/family/brca, satiety false, ascites false, CA-125/USS invented -> null; evidence added for 11 fields.

## Judgement calls

- 'Ei tupakoi', 'non-smoker', 'Not smoking', 'Tupakoimaton' -> never. Latest note wins when smoking status changes (colorectal-fi-052 current; colorectal-en-076 and ovarian-fi-079 former). 'Ex-smoker status unclear' (lung-en-079) -> unknown.
- Chest X-ray done but report missing -> chestXrayResult null, testsDone [] (lung-fi-020, lung-en-086). X-ray never mentioned -> null (lung-fi-015, lung-fi-023).
- Durations: stated duration kept when earlier notes roughly agree (lung-en-064 13 weeks though notes suggest ~15; ovarian-en-052 and ovarian-fi-079 kept at the stated 2 months = 9 weeks). Notes were edited only where the stated duration was clearly shorter than the documented history (e.g. 4 weeks stated, symptom documented 10 weeks earlier).
- colorectal-en-076: duration counted from the first tiredness visit (11 weeks) so it matches symptomVisitCount 3; abdominalMass null because only a PR exam was done.
- ironDeficiencyAnaemia: true from low Hb plus low ferritin/B-Fe (colorectal-fi-001, colorectal-fi-086); false when the note says 'no anaemia' or Hb is clearly normal (colorectal-ctrl-fi-006 Hb 134, colorectal-ctrl-en-015 Hb 135); null for anaemia without iron studies or borderline Hb (colorectal-fi-023, colorectal-en-061 Hb 125).
- FIT handed out or ordered with no result -> fitDone false (colorectal-fi-017, colorectal-en-108); FIT never mentioned -> null.
- Test dates kept only when the note gives the date the test was taken or done; dropped when only the date the result was reviewed is known (ovarian-fi-031 ca125Date null, ovarian-en-076 USS date removed).
- brcaStatus null when the pathogenic variant is in the family and the patient's own status is not stated (ovarian-fi-031, ovarian-fi-079).
- symptomDaysPerMonth: NICE-style '>12 times a month' -> 12 (ovarian-en-106); 'persistent'/'most days' with no count -> null; 'daily' -> 30.
- Menopausal status 'premenopausal' kept from 'maybe related to periods' (ovarian-en-022) and from an explicit statement (ovarian-ctrl-fi-004); never from age alone.
- 'No known hereditary cancer risk' -> familyHistoryBreastOrOvarianCancer false (ovarian-fi-057).
- IBS kept as the suspected diagnosis, not as an other illness (colorectal-ctrl-en-015); prostate cancer only in priorCancer (lung-fi-072); antihypertensive without a named illness -> otherIllnesses null (lung-fi-101).
- ovarian-ctrl-fi-012: a finished nitrofurantoin course is not a current medicine (null); 'pain only on urination' -> pelvicOrAbdominalPain false.
- Finnish 'kiireellinen' plus suspected cancer -> urgent_2_week; referral with no urgency word -> null (lung-fi-015, control records).
