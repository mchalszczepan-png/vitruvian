# Eval set audit (ml/data/eval.jsonl)

Audited 2026-11-14 by Claude (Opus 5.5) as a GP-coder pass over the 25 Gemini-written eval records. Research prototype; all patients synthetic.
Original kept at `ml/data/eval.gemini-original.jsonl`. Validator: `uv run --quiet --with jsonschema ml/validate_data.py ml/data/eval.jsonl` → 25 records, 0 failing.

## Totals

- Records changed: 25 of 25
- Target field values changed (added, removed or new value): 204
- Evidence entries changed (added, removed or re-quoted): 232
- Records with note text fixed (incoherent dates/durations, one typo): 5

## Conventions applied (same rule in every record)

- **English free text.** Per Michal's rule change, every free-text value in `fields` (symptom, exam, condition, diagnosis, question, findings, test names/results, medicines, illnesses, priorCancer) is English, translated faithfully with numbers and units unchanged. Evidence stays a verbatim quote in the note's language. All 11 Finnish records were translated; individual translations are not listed below.
- **Unknown required = null.** A required field no note mentions is `null` (also `smokingStatus`, `brcaStatus`, `menopausalStatus`: the enum value `unknown`/`not_tested` is used only if a note says so). Unknown optional fields are left out.
- **Empty list vs null.** `currentMedicines`/`otherIllnesses` are `[]` only when a note says none ("no regular meds", "ei lääkitystä"); a negation is never an item. `testsDone` is `[]` when the notes address testing but nothing has a result (planned, requested, "no tests yet"); `null` when tests are never mentioned.
- **Booleans** need a specific statement ("no haemoptysis", "ei virtsatieoireita"). A blanket "no other symptoms" does not set a specific boolean. The latest note wins when notes conflict.
- **Duration (weeks).** Stated duration, or stated duration plus elapsed time when it was stated at an earlier visit, or time since the first documented visit for an ongoing symptom; rounded to the nearest week. Months × 4.35 (3 months = 13 weeks).
- **symptomVisitCount** = visits for this symptom including today.
- **urgency** follows the dataset's generation rule (also used for train): `urgent_2_week` for a 2WW / two-week wording or an urgent referral for suspected cancer (Finnish "kiireellinen lähete … syöpäepäily"); `null` when no urgency is written.
- **gpQuestion** is the GP's question or referral reason as written in the note; Gemini's invented polite questions were replaced.
- **Evidence** is an exact substring of the notes for every note-derived field where a phrase exists; fragments such as "2", "12", "no", "normal" were replaced by the full phrase. No evidence for recordFacts fields or `suspectedCancerType`; none for derived values with no phrase (e.g. `symptomVisitCount` 1, menopause from age).

## Judgement calls (ambiguous, reasoning recorded)

- `eval-lung-fi-008`: "Ei tupakoi" → `never` (standard Finnish entry for a non-smoker; ex-smokers are written as such). Same reading in ovarian-fi-001/-003.
- `eval-lung-en-001`: "started around November last year" read as mid-November 2025 → 26 weeks.
- `eval-ovarian-fi-003`: `brcaStatus` = `pathogenic_variant` for a BRCA1 variant known in the family (template counts patient or family); patient's own test not stated.
- `eval-ovarian-fi-005`: smoking conflicts across notes ("aiemmin tupakoitsija" vs later "tupakoi ei koskaan"); latest wins → `never`. `menopausalStatus` = postmenopausal derived from age 76.
- `eval-ovarian-ctrl-en-001`: `symptomDaysPerMonth` = 30 (pelvic dragging pain is "constant"); 5 would be the heavy-bleeding days.
- `urgency` for Finnish "kiireellinen" suspected-cancer referrals (lung-fi-007, lung-fi-008, colorectal-fi-003, ovarian-fi-001, ovarian-fi-003) kept as `urgent_2_week` under the dataset rule; a literal reading would give `urgent`.

## Per record

Format: field: old → new. Evidence changes are summarised, not listed one by one.

### eval-lung-fi-007 (fi, cancer)

- Note text: earlier notes carried year 2025 inside 2026-dated notes; year fixed to 2026 (incoherent dates).
- testsDone null → [] (X-ray only planned; testing addressed, nothing done).
- Evidence: symptomDurationWeeks '6' → full phrase; added urgency, lungSymptoms, chestXrayResult, testsDone evidence.
- Field diff (6): `examFindings`: 'keuhkot puhtaat, sydän normaali' → 'lungs clear, heart normal'; `generalCondition`: 'tyydyttävä' → 'satisfactory'; `gpQuestion`: 'keuhkosyövän poissulku' → 'rule out lung cancer'; `mainSymptom`: 'väsymys ja ruokahaluttomuus' → 'fatigue and loss of appetite'; `suspectedDiagnosis`: 'epäily keuhkosyövästä' → 'suspected lung cancer'; `testsDone`: null → []
- Evidence entries changed: 6

### eval-lung-en-005 (en, cancer)

- weightLossKg 6.5 → removed (note says 'unquantified weight loss'; number invented).
- symptomDurationWeeks 8 → 7 ('about 2 months' is the weight-loss duration; cough/tiredness first documented 2026-08-20, ongoing → 47 days ≈ 7 weeks).
- haemoptysis false → null (blood in sputum never mentioned; old evidence 'no' was not about haemoptysis).
- testsDone [] → FBC 2026-08-20 normal (stated in earlier note).
- gpQuestion invented wording → referral reason from note.
- Evidence: replaced '2'/'25'/'2WW' fragments with real phrases; added chestXrayResult, testsDone.
- Field diff (5): `gpQuestion`: 'please review for suspected lung malignancy' → 'assessment for suspected lung cancer (2WW)'; `haemoptysis`: false → null; `symptomDurationWeeks`: 8 → 7; `testsDone`: [] → [{"name": "FBC", "date": "2026-08-20", "result": "normal"}]; `weightLossKg`: 6.5 → (removed)
- Evidence entries changed: 9

### eval-lung-en-006 (en, cancer)

- suspectedDiagnosis wording aligned ('suspected lung cancer'); evidence lengthened; added evidence for empty meds/illnesses/tests.
- Field diff (1): `suspectedDiagnosis`: 'suspected lung malignancy' → 'suspected lung cancer'
- Evidence entries changed: 6

### eval-lung-fi-008 (fi, cancer)

- smokingStatus unknown → never ('Ei tupakoi' is the standard Finnish entry for a non-smoker; no ex-smoking mentioned). Judgement call.
- currentMedicines [] → null, otherIllnesses [] → null (never mentioned; 'Ei muita oireita' is about symptoms).
- Free text translated to English; evidence added for smoking, duration, gpQuestion, lungSymptoms, chestXrayResult.
- Field diff (8): `currentMedicines`: [] → null; `examFindings`: 'keuhkot puhtaat, auskultoiden siisti' → 'lungs clear, clean on auscultation'; `generalCondition`: 'yleiskunto hyvä' → 'good'; `gpQuestion`: 'Keuhkosyövän poissulku / jatkoselvittelyt' → 'further investigation for suspected lung cancer: chest X-ray and n…; `mainSymptom`: 'lievä yskä' → 'mild cough'; `otherIllnesses`: [] → null; `smokingStatus`: 'unknown' → 'never'; `suspectedDiagnosis`: 'keuhkosyöpäepäily' → 'suspected lung cancer'
- Evidence entries changed: 7

### eval-lung-en-003 (en, cancer)

- currentMedicines [] → null (never mentioned).
- otherIllnesses ['occupational asbestos exposure'] → null (exposure is not an illness; it is in asbestosExposure).
- haemoptysis false → null (never mentioned).
- gpQuestion invented wording ('given CXR findings and neck node') → 'urgent review for suspected lung cancer' from the Plan.
- generalCondition 'PS 0, NAD' → 'PS 0' (NAD is an exam finding).
- Field diff (6): `currentMedicines`: [] → null; `generalCondition`: 'PS 0, NAD' → 'PS 0'; `gpQuestion`: 'Please urgently review for suspected lung cancer given CXR finding… → 'urgent review for suspected lung cancer'; `haemoptysis`: false → null; `otherIllnesses`: ["occupational asbestos exposure"] → null; `suspectedDiagnosis`: 'lung cancer' → 'suspected lung cancer'
- Evidence entries changed: 9

### eval-lung-fi-004 (fi, cancer)

- Note text: 2026-10-01 note said lump duration 'noin 5 viikkoa' but the 2026-08-29 note already gave 2 weeks (→ ~7 weeks); fixed to 7.
- symptomDurationWeeks 5 → 12 (lump 2 weeks on 2026-08-29 + 72 days to 2026-11-09 ≈ 12.3 weeks; 5 was a stale earlier value).
- Free text translated to English (meds 'Verenpainelääke' → 'blood pressure medication', etc.).
- Evidence: '5' fragment replaced; added testsDone, meds, illnesses, suspectedDiagnosis, urgency, visit count.
- Field diff (10): `chestXrayFindings`: 'varjostuma' → 'shadowing (opacity)'; `currentMedicines`: ["Verenpainelääke"] → ["blood pressure medication"]; `examFindings`: 'kaulassa edelleen tuntuu kiinteä noin 2 cm imusolmuke' → 'lungs clear on auscultation; firm lymph node of about 2 cm still p…; `generalCondition`: 'yleiskunto hyvä' → 'good'; `gpQuestion`: 'pyydetään kiireellinen 2 viikon lähete keuhkosairauksien poliklini… → 'urgent 2-week referral to the pulmonary outpatient clinic for susp…; `mainSymptom`: 'kaulan kyhmy' → 'lump in the neck'; `otherIllnesses`: ["Hypertensio"] → ["hypertension"]; `suspectedDiagnosis`: 'Epäily keuhkosyövästä' → 'suspected lung cancer'; `symptomDurationWeeks`: 5 → 12; `testsDone`: [{"name": "keuhkokuva", "result": "varjostuma"}] → [{"name": "chest X-ray", "result": "shadowing (opacity)"}]
- Evidence entries changed: 11

### eval-lung-en-001 (en, cancer)

- Note text: earlier notes had wrong years with '(corrected internally to …)' artefacts; cleaned to the real 2026 dates.
- packYears 35 → removed ('20 a day for many years': years unknown, so pack-years cannot be computed).
- asbestosExposure false → removed (never mentioned).
- generalCondition 'good performance status' → null (invented; nothing about general condition except 'wiped out' fatigue).
- symptomDurationWeeks 24 → 26 ('started around November last year' read as mid-Nov 2025 → 2026-05-17 ≈ 26 weeks). Judgement call.
- lungSymptoms + fatigue ('I feel completely wiped out', 2026-03-18).
- gpQuestion invented wording → referral reason from note.
- Field diff (9): `asbestosExposure`: false → (removed); `examFindings`: 'finger clubbing and enlarged left supraclavicular lymph node' → 'noticeable finger clubbing and a firm, non-tender left supraclavic…; `generalCondition`: 'good performance status' → null; `gpQuestion`: 'please evaluate for suspected lung malignancy' → '2WW assessment for suspected lung cancer'; `lungSymptoms`: ["cough", "finger_clubbing", "lymph_node_enlargement"] → ["cough", "fatigue", "finger_clubbing", "lymph_node_enlargement"]; `mainSymptom`: 'persistent cough' → 'worsening persistent cough'; `packYears`: 35 → (removed); `suspectedDiagnosis`: 'lung cancer' → 'suspected lung cancer'; `symptomDurationWeeks`: 24 → 26
- Evidence entries changed: 12

### eval-lung-fi-002 (fi, cancer)

- symptomDurationWeeks 12 → 13 ('kolme kuukautta' = 3 × 4.35 weeks ≈ 13).
- gpQuestion 'Keuhkosyövän poissulku' (not in note) → referral reason as written; free text translated to English.
- Field diff (10): `chestXrayFindings`: 'varjostuma vasemmassa ylälohkossa' → 'opacity in the left upper lobe'; `currentMedicines`: ["Salbutamoli"] → ["salbutamol inhaler"]; `examFindings`: 'keuhkoissa heikentynyt hengitysääni vasemmalla, ei rahinoita' → 'reduced breath sounds on the left, no crackles'; `generalCondition`: 'hyvä yleistila' → 'good'; `gpQuestion`: 'Keuhkosyövän poissulku' → 'specialist assessment for suspected lung cancer'; `mainSymptom`: 'sitkeä yskä' → 'persistent cough'; `otherIllnesses`: ["hypertonia"] → ["hypertension"]; `suspectedDiagnosis`: 'Keuhkosyöpäepäily' → 'suspected lung cancer'; `symptomDurationWeeks`: 12 → 13; `testsDone`: [{"name": "keuhkokuva", "date": "2026-04-03", "result": "varjostuma… → [{"name": "chest X-ray", "date": "2026-04-03", "result": "opacity i…
- Evidence entries changed: 9

### eval-colorectal-en-004 (en, cancer)

- smokingStatus 'unknown' → null (not mentioned; contract: unknown required = null).
- generalCondition 'wt 57,5 kg' → null (body weight is not general condition).
- currentMedicines ['antibiotics'] → null (a finished course that triggered the diarrhoea, not a current medicine).
- testsDone [] → null, otherIllnesses [] → null (never mentioned).
- ironDeficiencyAnaemia false → null, fitDone false → null (no bloods or FIT mentioned; invented negatives).
- suspectedDiagnosis 'colorectal cancer' → 'suspected colorectal cancer'.
- Field diff (8): `currentMedicines`: ["antibiotics"] → null; `fitDone`: false → null; `generalCondition`: 'wt 57,5 kg' → null; `ironDeficiencyAnaemia`: false → null; `otherIllnesses`: [] → null; `smokingStatus`: 'unknown' → null; `suspectedDiagnosis`: 'colorectal cancer' → 'suspected colorectal cancer'; `testsDone`: [] → null
- Evidence entries changed: 7

### eval-colorectal-fi-003 (fi, cancer)

- smokingStatus 'unknown' → null (not mentioned).
- currentMedicines ['ei lääkitystä'] → [] and otherIllnesses ['ei perussairauksia'] → [] (the notes say none; a negation is not an item).
- rectalExamResult 'not_done' → removed (optional; rectal exam never mentioned).
- Evidence symptomVisitCount '1' (matched inside '186') removed; free text translated.
- Field diff (9): `currentMedicines`: ["ei lääkitystä"] → []; `examFindings`: 'vatsa pehmeä, ei aristusta, ei palpoitavia massoja' → 'abdomen soft, no tenderness, no palpable masses'; `generalCondition`: 'yleistila hyvä' → 'good'; `gpQuestion`: 'pyydetään kiireellistä tähystystä' → 'urgent endoscopy requested'; `mainSymptom`: 'suolen toiminnan muutos' → 'change in bowel habit'; `otherIllnesses`: ["ei perussairauksia"] → []; `rectalExamResult`: 'not_done' → (removed); `smokingStatus`: 'unknown' → null; `suspectedDiagnosis`: 'kolorektaalisyöepäily' → 'suspected colorectal cancer'
- Evidence entries changed: 6

### eval-lung-ctrl-fi-001 (fi, control)

- testsDone result 'normaali' → the reported finding; free text translated.
- Evidence: dropped meaningless symptomVisitCount quote; completed truncated 'Ei veriyskä'; added exam, tests, X-ray evidence.
- Field diff (7): `chestXrayFindings`: 'keuhkot puhtaat ilman tuoreita infiltraatteja' → 'lungs clear, no fresh infiltrates or signs of pneumonia'; `examFindings`: 'keuhkot puhtaat, sydänänet normaalit' → 'lungs clear, no added sounds; heart sounds normal and regular'; `generalCondition`: 'hyvä' → 'good'; `gpQuestion`: 'jatkoarvio' → 'further assessment, referral made as a precaution'; `mainSymptom`: 'yskä' → 'cough'; `suspectedDiagnosis`: 'akuutti bronkiitti' → 'acute bronchitis'; `testsDone`: [{"name": "keuhkoröntgen", "result": "normaali"}] → [{"name": "chest X-ray", "result": "lungs clear, no fresh infiltrat…
- Evidence entries changed: 9

### eval-colorectal-en-002 (en, cancer)

- testsDone: invented date 2026-07-10 removed; split into Hb 98 g/l and ferritin 12 ug/l (ferritin is not part of FBC).
- suspectedDiagnosis trimmed to 'suspected colorectal cancer' (IDA is a finding, kept in ironDeficiencyAnaemia).
- Evidence: '12'/'1' fragments fixed; weightLossKg evidence added ('nearly six kilos' → 6).
- Field diff (5): `examFindings`: 'Abdomen soft, non-tender, no palpable masses; rectal examination n… → 'abdomen soft, non-tender, no palpable masses'; `gpQuestion`: 'Please kindly investigate for underlying malignancy given IDA and … → 'Please kindly investigate for underlying malignancy given IDA and …; `otherIllnesses`: ["Hypertension"] → ["hypertension"]; `suspectedDiagnosis`: 'Iron-deficiency anaemia and suspected colorectal cancer' → 'suspected colorectal cancer'; `testsDone`: [{"name": "FBC", "date": "2026-07-10", "result": "Hb 98 g/l, ferrit… → [{"name": "Hb", "result": "98 g/l"}, {"name": "ferritin", "result":…
- Evidence entries changed: 5

### eval-colorectal-en-001 (en, cancer)

- smokingStatus 'never' → null, generalCondition 'good' → null, currentMedicines [] → null, otherIllnesses ['hypertension'] → null: none of these is in any note (invented).
- rectalBleeding false → null and fitDone false → null (never mentioned).
- ironDeficiencyAnaemia false → null: Hb 125 g/l is below the usual male reference range and no ferritin was done, so 'no IDA' is not supported.
- testsDone: invented 2026-07-16 dates removed (bloods ordered 2026-04-16, sample date not stated); name 'FBC Hb' → 'FBC'.
- gpQuestion invented wording → referral reason; evidence for suspectedCancerType removed.
- Field diff (9): `currentMedicines`: [] → null; `fitDone`: false → null; `generalCondition`: 'good' → null; `gpQuestion`: 'please assess for suspected colorectal cancer 2WW' → '2WW assessment for suspected colorectal cancer'; `ironDeficiencyAnaemia`: false → null; `otherIllnesses`: ["hypertension"] → null; `rectalBleeding`: false → null; `smokingStatus`: 'never' → null; `testsDone`: [{"name": "FBC Hb", "date": "2026-07-16", "result": "125 g/l"}, {"n… → [{"name": "FBC", "result": "Hb 125 g/l"}, {"name": "CRP", "result":…
- Evidence entries changed: 9

### eval-colorectal-en-006 (en, cancer)

- testsDone: CRP 'normal' removed (CRP was requested, no result given); FBC 'normal' → 'bloods: no anaemia' as written.
- generalCondition 'good' → null (not stated; patient 'feels fatigued').
- gpQuestion invented wording → referral reason; evidence '12'/'4'/'normal' fragments replaced; smoking evidence added.
- Field diff (3): `generalCondition`: 'good' → null; `gpQuestion`: 'please review for suspected colorectal cancer 2WW' → '2WW colorectal cancer pathway assessment'; `testsDone`: [{"name": "FBC", "result": "normal"}, {"name": "CRP", "result": "no… → [{"name": "bloods", "result": "no anaemia"}, {"name": "FIT", "resul…
- Evidence entries changed: 15

### eval-colorectal-en-005 (en, cancer)

- smokingStatus 'never' → null and generalCondition 'good' → null (not in notes).
- fitDone false → null (FIT never mentioned).
- testsDone: date 2026-03-01 removed (that is when FBC was requested, not done); result 'normal' → 'no anaemia' as written.
- gpQuestion invented wording → referral reason; suspectedDiagnosis 'malignancy' → 'cancer' as written.
- Field diff (6): `fitDone`: false → null; `generalCondition`: 'good' → null; `gpQuestion`: 'please review urgently via 2WW pathway' → '2WW colorectal cancer assessment'; `smokingStatus`: 'never' → null; `suspectedDiagnosis`: 'suspected colorectal malignancy' → 'suspected colorectal cancer'; `testsDone`: [{"name": "FBC", "date": "2026-03-01", "result": "normal"}] → [{"name": "FBC", "result": "no anaemia"}]
- Evidence entries changed: 9

### eval-colorectal-en-007 (en, cancer)

- smokingStatus 'never' → null, generalCondition 'Fair' → null, currentMedicines [] → null (not in notes).
- fitDone false → null (FIT never mentioned).
- symptomDurationWeeks 20 kept (tiredness first documented 2025-09-25, ongoing → 20 full weeks); evidence added.
- testsDone: dates dropped (latest bloods are today's 'persistent' values, sample date not stated).
- gpQuestion invented wording → referral reason as written.
- Field diff (8): `currentMedicines`: [] → null; `examFindings`: 'Abdo soft, no mass palpable' → 'abdo soft, no mass palpable; rectal exam NAD'; `fitDone`: false → null; `generalCondition`: 'Fair' → null; `gpQuestion`: 'Please expedite urgent lower GI investigation for IDA and weight l… → '2WW colorectal cancer assessment'; `smokingStatus`: 'never' → null; `suspectedDiagnosis`: 'Suspected colorectal cancer' → 'suspected colorectal cancer'; `testsDone`: [{"name": "FBC", "date": "2025-09-25", "result": "Hb 10.9 g/dl"}, {… → [{"name": "FBC", "result": "Hb 10.9 g/dl"}, {"name": "ferritin", "r…
- Evidence entries changed: 8

### eval-colorectal-ctrl-en-001 (en, control)

- smokingStatus 'never' → null, generalCondition 'fit and well' → null (not in notes).
- symptomDurationWeeks 7 → 8 ('about 4 weeks' on 2026-04-04 + 29 days to 2026-05-03).
- otherIllnesses [] → ['back pain'] (the reason she takes co-codamol).
- fitDone false → null; rectalExamResult 'not_done' removed (neither mentioned).
- gpQuestion: long invented paragraph → referral reason as written.
- Field diff (8): `examFindings`: 'abdomen soft, non-tender, no masses' → 'abdomen soft and non-tender with no palpable masses'; `fitDone`: false → null; `generalCondition`: 'fit and well' → null; `gpQuestion`: 'Please review this 27-year-old female for persistent constipation … → 'referral via the colorectal cancer pathway for reassurance'; `otherIllnesses`: [] → ["back pain"]; `rectalExamResult`: 'not_done' → (removed); `smokingStatus`: 'never' → null; `symptomDurationWeeks`: 7 → 8
- Evidence entries changed: 8

### eval-ovarian-fi-001 (fi, cancer)

- urinarySymptoms null → false ('Ei todettu virtsatieoireita').
- ca125Done false → null (CA-125 never mentioned).
- symptomDurationWeeks 12 → 13 ('noin 3 kuukautta' ≈ 13 weeks).
- Free text translated; evidence 'Vastaanotolla' for visit count removed; evidence added for meds, illnesses, ultrasound.
- Field diff (8): `ca125Done`: false → null; `examFindings`: 'vatsa pehmeä, ei aristusta, ei palpoitavaa massaa' → 'abdomen soft, no tenderness, no palpable mass, no ascites'; `generalCondition`: 'hyvä' → 'good'; `gpQuestion`: 'pyydetään kiireellistä gynekologista arviota ja ultraäänitutkimusta' → 'urgent gynaecological assessment and ultrasound requested'; `mainSymptom`: 'turvotus ja alavatsakipu' → 'persistent abdominal bloating and lower abdominal pain'; `suspectedDiagnosis`: 'epäily munasarjasyövästä' → 'suspected ovarian cancer'; `symptomDurationWeeks`: 12 → 13; `urinarySymptoms`: null → false
- Evidence entries changed: 8

### eval-ovarian-fi-002 (fi, cancer)

- currentMedicines ['Verenpainelääkitys'] → null and otherIllnesses ['Hypertonia'] → null (invented; no note mentions them).
- brcaStatus 'not_tested' → null and ca125Done false → null (never mentioned).
- symptomDaysPerMonth null → 30 (earlier note: bloating 'päivittäin', daily).
- suspectedDiagnosis 'Ovarioitumiskasvain' (not a word in the notes) → 'suspected ovarian cancer'; free text translated.
- Field diff (12): `brcaStatus`: 'not_tested' → null; `ca125Done`: false → null; `currentMedicines`: ["Verenpainelääkitys"] → null; `examFindings`: 'vatsa pehmeä, lievää aristusta alavatsalla, ei selvää massaa' → 'abdomen soft, mild lower abdominal tenderness, no definite mass, n…; `generalCondition`: 'hyvä' → 'good'; `gpQuestion`: 'Lähete kiireellisiin tutkimuksiin munasarjasyöpäepäilyn vuoksi' → 'urgent investigations within two weeks for suspected ovarian cancer'; `mainSymptom`: 'vatsan turvotus' → 'abdominal bloating and distension'; `otherIllnesses`: ["Hypertonia"] → null; `pelvicUltrasoundFindings`: 'Kompleksinen kysta n. 7 cm oikeassa ovaraariossa' → 'complex cyst about 7 cm in the right ovary'; `suspectedDiagnosis`: 'Ovarioitumiskasvain' → 'suspected ovarian cancer'; `symptomDaysPerMonth`: null → 30; `testsDone`: [{"name": "Pelviperäinen UÄ", "result": "Kompleksinen kysta n. 7 cm… → [{"name": "gynaecological ultrasound", "result": "complex cyst abou…
- Evidence entries changed: 10

### eval-ovarian-en-006 (en, cancer)

- smokingStatus 'unknown' → null, currentMedicines [] → null, otherIllnesses [] → null (not in notes).
- familyHistoryBreastOrOvarianCancer false → null and brcaStatus 'unknown' → null (never mentioned).
- gpQuestion invented wording → referral reason; evidence '2'/'ascites'/'urinary symptoms' fragments replaced with full phrases.
- Field diff (7): `brcaStatus`: 'unknown' → null; `currentMedicines`: [] → null; `familyHistoryBreastOrOvarianCancer`: false → null; `gpQuestion`: 'please advise and investigate for possible ovarian pathology' → '2WW ovarian cancer assessment'; `otherIllnesses`: [] → null; `smokingStatus`: 'unknown' → null; `suspectedDiagnosis`: 'suspected ovarian malignancy' → 'suspected ovarian cancer'
- Evidence entries changed: 14

### eval-ovarian-fi-004 (fi, cancer)

- Note text: typo 'kahdessa viossa' → 'kahdessa viikossa' (within two weeks).
- palpableMass true → false (exam: 'ei selkeää resistenssiä' = no definite palpable mass; the mass is on ultrasound only).
- ascites false → null (never mentioned; old evidence was the mass phrase).
- symptomDaysPerMonth 30 → null (frequency never stated).
- symptomDurationWeeks 6 → 11 ('kuusi viikkoa' on 2026-06-14 + 34 days to 2026-07-18 ≈ 11 weeks; 6 was stale).
- brcaStatus 'not_tested' → null (never mentioned).
- gpQuestion invented ('jatkotutkimuksia ja hoidon arviota varten' not in note) → referral as written; suspectedDiagnosis 'Ovarioepäily' → 'suspected ovarian cancer'; free text translated.
- Field diff (14): `ascites`: false → null; `brcaStatus`: 'not_tested' → null; `currentMedicines`: ["Parasetamol 1 g tarvittaessa"] → ["paracetamol 1 g as needed"]; `examFindings`: 'aristava alavatsa, ei selkeää resistenssiä' → 'abdomen soft, tender lower abdomen, no definite mass'; `generalCondition`: 'hyvä' → 'good'; `gpQuestion`: 'Lähete erikoissairaanhoitoon jatkotutkimuksia ja hoidon arviota va… → 'urgent referral to specialist care within two weeks'; `mainSymptom`: 'alavatsakipu' → 'lower abdominal pain and bloating'; `otherIllnesses`: ["Hypertonia"] → ["hypertension"]; `palpableMass`: true → false; `pelvicUltrasoundFindings`: 'kiinteä massa oikealla ovariossa' → 'solid mass in the right ovary'; `suspectedDiagnosis`: 'Ovarioepäily' → 'suspected ovarian cancer'; `symptomDaysPerMonth`: 30 → null; `symptomDurationWeeks`: 6 → 11; `testsDone`: [{"name": "S -CA125", "date": "2026-06-14", "result": "78 U/l"}, {"… → [{"name": "serum CA-125", "date": "2026-06-14", "result": "78 U/l"}…
- Evidence entries changed: 15

### eval-ovarian-fi-005 (fi, cancer)

- currentMedicines ['Omepratsoli'] → null and otherIllnesses ['Hypertonia'] → null (invented; no note mentions them).
- earlySatietyOrAppetiteLoss false → null (old evidence 'ei kipua' is about pain); ascites false → null (never mentioned).
- symptomDaysPerMonth 30 → null (frequency not stated).
- familyHistoryBreastOrOvarianCancer false → null and brcaStatus 'not_tested' → null (never mentioned).
- symptomDurationWeeks 12 → 13 ('3 kk'); testsDone + gynaecological ultrasound 2026-09-10.
- smokingStatus kept 'never': earlier note says 'aiemmin tupakoitsija', today's 'tupakoi ei koskaan' is the latest. Notes conflict; latest wins.
- menopausalStatus kept 'postmenopausal' though not written: derived from age 76 (recordFacts). Free text translated.
- Field diff (15): `ascites`: false → null; `brcaStatus`: 'not_tested' → null; `currentMedicines`: ["Omepratsoli"] → null; `earlySatietyOrAppetiteLoss`: false → null; `examFindings`: 'vatsa pehmeä, ei aristusta, ei selvää massaa palpoitavissa' → 'abdomen soft, no tenderness, no definite palpable mass'; `familyHistoryBreastOrOvarianCancer`: false → null; `generalCondition`: 'hyvä yleistila' → 'good'; `gpQuestion`: 'Lähete jatkotutkimuksiin ja hoitoarvioon' → 'urgent assessment and further investigations within 2 weeks'; `mainSymptom`: 'vatsa turvottanut' → 'abdominal bloating'; `otherIllnesses`: ["Hypertonia"] → null; `pelvicUltrasoundFindings`: 'Kookas noin 7 cm kompleksinen kysta oikeassa ovariossa' → 'large complex cyst about 7 cm in the right ovary'; `suspectedDiagnosis`: 'Ovariaalisyöpäepäily' → 'suspected ovarian cancer'; `symptomDaysPerMonth`: 30 → null; `symptomDurationWeeks`: 12 → 13; `testsDone`: [{"name": "Ca-125", "date": "2026-09-10", "result": "45.2 IU/ml"}] → [{"name": "gynaecological ultrasound", "date": "2026-09-10", "resul…
- Evidence entries changed: 11

### eval-ovarian-fi-003 (fi, cancer)

- Note text: today said bloating 'kahden kuukauden ajan' but bloating is documented since 18.3.2026 (~13 weeks); changed to 'kolmen kuukauden ajan'.
- symptomDurationWeeks 8 → 13.
- menopausalStatus 'premenopausal' → null (never stated; age 38 but chemotherapy in 2025 can cause menopause, so not derivable).
- otherIllnesses ['rintasyöpä hoidettu vuosi sitten'] → null (the only condition named is the prior cancer, already in priorCancer; no other illnesses stated).
- currentMedicines ['ei jatkuvaa lääkitystä'] → [] (negation, not an item).
- testsDone + pelvic ultrasound 2026-06-12. brcaStatus kept 'pathogenic_variant' (BRCA1 variant known in the family; the template counts patient or family). Judgement call.
- Free text and priorCancer translated to English.
- Field diff (12): `currentMedicines`: ["ei jatkuvaa lääkitystä"] → []; `examFindings`: 'vatsa pehmeä, ei aristusta, ei selkeää resistenssiä' → 'abdomen soft, no tenderness, no definite mass; no ascites'; `generalCondition`: 'hyvä' → 'good'; `gpQuestion`: 'pyydetään kiireellistä gynekologin arviota ja kuvantamista' → 'urgent gynaecological assessment and imaging requested'; `mainSymptom`: 'vatsa turvottaa' → 'abdominal bloating'; `menopausalStatus`: 'premenopausal' → null; `otherIllnesses`: ["rintasyöpä hoidettu vuosi sitten"] → null; `pelvicUltrasoundFindings`: 'munasarjassa kiinteä muutos' → 'solid lesion in the ovary'; `priorCancer`: {"type": "rintasyöpä", "yearDiagnosed": 2025, "treatment": "leikkau… → {"type": "breast cancer", "yearDiagnosed": 2025, "treatment": "surg…; `suspectedDiagnosis`: 'epäillään munasarjasyöpää' → 'suspected ovarian cancer'; `symptomDurationWeeks`: 8 → 13; `testsDone`: [{"name": "CA-125", "date": "2026-06-10", "result": "85"}] → [{"name": "CA-125", "date": "2026-06-10", "result": "85"}, {"name":…
- Evidence entries changed: 9

### eval-ovarian-en-007 (en, cancer)

- smokingStatus 'never' → null (not in notes).
- symptomDaysPerMonth 25 → null ('most days' is not a number).
- familyHistoryBreastOrOvarianCancer false → null and brcaStatus 'not_tested' → null (never mentioned).
- testsDone: FBC/CRP invented date 2026-08-21 removed (ordered 2026-06-04, sample date not stated).
- gpQuestion invented wording → referral reason; evidence for suspectedCancerType removed.
- Field diff (8): `brcaStatus`: 'not_tested' → null; `examFindings`: 'soft abdomen with mild distension, no palpable mass' → 'abdomen soft, mild distension, no palpable mass, no ascites'; `familyHistoryBreastOrOvarianCancer`: false → null; `gpQuestion`: 'Please advise on management for suspected ovarian cancer' → '2WW ovarian cancer assessment'; `smokingStatus`: 'never' → null; `suspectedDiagnosis`: 'suspected ovarian malignancy' → 'suspected ovarian cancer'; `symptomDaysPerMonth`: 25 → null; `testsDone`: [{"name": "FBC", "date": "2026-08-21", "result": "Hb 124 g/l, WCC 6… → [{"name": "FBC", "result": "Hb 124 g/l, WCC 6.5, Plt 250"}, {"name"…
- Evidence entries changed: 8

### eval-ovarian-ctrl-en-001 (en, control)

- symptomDurationWeeks 8 → 16 ('eight weeks ago' on 2026-03-13 + 53 days to 2026-05-05 ≈ 16 weeks; 8 was stale).
- generalCondition 'fit and well' → null (not stated; she reports exhaustion).
- testsDone/pelvicUltrasoundDate: invented date 2026-04-10 removed ('from last month' only).
- otherIllnesses [] → null; ca125Done false → null; brcaStatus 'not_tested' → null (none mentioned).
- symptomDaysPerMonth 5 → 30: the ovarian-type symptom (pelvic dragging pain) is 'constant'; 5 days is the heavy bleeding. Judgement call.
- gpQuestion invented wording → referral as written.
- Field diff (10): `brcaStatus`: 'not_tested' → null; `ca125Done`: false → null; `generalCondition`: 'fit and well' → null; `gpQuestion`: 'please advise on management for symptomatic uterine fibroids' → 'gynaecology review regarding symptomatic fibroids'; `otherIllnesses`: [] → null; `pelvicUltrasoundDate`: '2026-04-10' → (removed); `suspectedDiagnosis`: 'uterine fibroids' → 'symptomatic uterine fibroids'; `symptomDaysPerMonth`: 5 → 30; `symptomDurationWeeks`: 8 → 16; `testsDone`: [{"name": "pelvic ultrasound", "date": "2026-04-10", "result": "ute… → [{"name": "pelvic ultrasound", "result": "uterine fibroids with cle…
- Evidence entries changed: 12
