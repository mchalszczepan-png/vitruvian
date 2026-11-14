# Audit log: in-3.jsonl → out-3.jsonl

GP-coder audit of 49 synthetic training records, using the conventions in `ml/data/eval-audit.md` lines 1-33.

## Totals

- Records changed: 49 of 49 (ids, split, language, kind and recordFacts unchanged; same order).
- Field values changed: 392. Evidence entries changed: 537. Records with note text fixed: 7.
- Field change types: 152 invented values removed (set to null or left out), 163 values corrected or re-worded to match the note (mostly English free text, test lists, medicines, exam findings), 36 gpQuestion rewritten as written in the note, 25 durations corrected, 12 null values filled where the note supports them, 4 visit counts corrected.
- Top error types: invented "no"/false booleans and "never"/"unknown"/"not_tested" statuses; invented test dates; invented gpQuestion wording ("please review/advise"); evidence that was a fragment ("8", "2", "78") or quoted from an unrelated phrase.
- Validation: `uv run --quiet --with jsonschema ml/validate_data.py ml/data/audit/out-3.jsonl --against-eval ml/data/eval.jsonl` gives 49 records, 0 failing.

## Note-text fixes (self-contradictory dates or durations)

- lung-fi-008: "16 viikkoa" → "19 viikkoa".
- lung-fi-021: earlier note headers 2007-07-07 and 2004-08-04 → 2026.
- lung-fi-060: "n. 3 viikkoa" → "n. 9 viikkoa".
- lung-fi-069: "19.07.2019" → "19.07.2026".
- colorectal-fi-002: earlier "noin 6 vk ajan" → "noin 4 vk ajan"; today "noin 12 vk" → "noin 6 vk".
- colorectal-fi-036: "heikentynyt 2 kk ajan" → "3 kk ajan".
- ovarian-fi-069: today "noin 8 viikkoa" → "noin 13 viikkoa" (the 02.08 note says symptoms began "pari kuukautta sitten").

## Per record
1. `lung-en-001`: duration 14→11 (since first cough visit 16/05); invented FBC result 'Hb 132, WCC 11.2' and FBC row removed (FBC/CRP had no result); invented Salbutamol → currentMedicines null; fatigue added to lungSymptoms; gpQuestion as written; evidence re-quoted (packYears '35', CXR date fragment).
2. `lung-fi-008`: note fix: today '16 viikkoa' contradicted 'pari viikkoa' on 23.05 → 19 viikkoa; duration 16→19; invented asbestosExposure false removed; La 34 labelled ESR; exam extended (no clubbing, no nodes); evidence re-quoted, count fragment '4' removed.
3. `lung-fi-021`: note fix: earlier-note header dates 2007-07-07/2004-08-04 → 2026; smokingStatus 'unknown' (not stated) → null; invented currentMedicines [] → null; otherIllnesses [] kept ('Perusterve'); gpQuestion as written; evidence re-quoted ('3' fragment).
4. `lung-en-030`: generalCondition 'poor, frail' → as written; gpQuestion as written; evidence re-quoted ('12','2' fragments; count evidence removed).
5. `lung-en-036`: packYears 15 added (15/day × 20 yrs); invented currentMedicines/otherIllnesses [] → null; gpQuestion as written; generalCondition completed; evidence re-quoted ('Sm' fragment).
6. `lung-fi-042`: duration 12→9 (12 came from weight-loss 'muutaman kk'; first cough visit 05.02 → 9 wk); urgency urgent_2_week → null (no urgency written); currentMedicines 'Ventoline as needed'; evidence re-quoted.
7. `lung-fi-051`: duration 12→7 (12 came from weight-loss wording; first visit 28.4 → 7 wk); mainSymptom → weight loss + prolonged cough (today's reason); 'visibly weight-loss' removed from generalCondition; evidence re-quoted.
8. `lung-fi-060`: note fix: today '3 viikkoa' contradicted 'Yskä 3 vk' on 15.5 → 9 viikkoa; duration 3→9; visitCount 1→2 (phone contact 15.5 counted); smokingStatus 'unknown' → null; gpQuestion as written ('exclusion' not in note).
9. `lung-fi-069`: note fix: earlier-note header date 19.07.2019 → 2026; visitCount 2→1 (earlier visit symptom-free); generalCondition 'good' → satisfactory; invented haemoptysis false → null; testsDone null → [] (ordered, not done); evidence re-quoted ('6' fragment).
10. `lung-fi-075`: duration 12→13 ('ehkä 3 kk'); generalCondition 'good' → 'clinical condition ok'; testsDone null → Hb ok (28.02); gpQuestion as written; evidence re-quoted ('30','3','5,5' fragments).
11. `lung-fi-083`: invented currentMedicines/otherIllnesses [] → null; invented asbestosExposure false removed; gpQuestion as written; evidence re-quoted ('6','2','18.9.' fragments; smoking quoted from 'tupakoitsija').
12. `lung-en-092`: duration 5→9 (4 wks on 14/01 + 4.6 wks); packYears 25 added; invented generalCondition 'good' → null; 'inhaler' dropped from Salbutamol; invented asbestosExposure removed; CXR test result 'abnormal' → finding; gpQuestion as written; evidence re-quoted.
13. `lung-fi-100`: invented CXR finding 'Shadowing in the left upper zone' → findings null (note only says abnormal), test result 'abnormal'; invented haemoptysis false → null; invented currentMedicines/otherIllnesses [] → null; suspectedDiagnosis null (no diagnosis written); evidence added for most fields.
14. `lung-ctrl-en-001`: invented smokingStatus 'never' → null; testsDone null → [] ('No CXR done'); evidence re-quoted ('12','1' fragments; haemoptysis).
15. `lung-ctrl-en-007`: invented currentMedicines/otherIllnesses [] → null; examFindings completed; evidence re-quoted ('2' fragment removed).
16. `lung-ctrl-en-013`: duration 12→16 (2 months on 23/04 + 7 wks); invented smokingStatus 'never' and generalCondition 'well' → null; weightLossKg 4.5 removed (GP retracts it: '? No, wait'); weight_loss added (clothes loose); CXR invented date removed; gpQuestion as written; evidence added.
17. `colorectal-fi-002`: note fix: durations '6 vk' (3.8) and '12 vk' (17.8) contradicted 'pari viikkoa' on 19.7 → 4 vk / 6 vk; duration 12→6; smokingStatus 'unknown' → null; invented currentMedicines/otherIllnesses [] → null; FIT date (report date, not sample date) removed; rectalExamResult removed ('Peräaukon seutu siisti' is inspection, not PR); gpQuestion as written.
18. `colorectal-en-010`: smokingStatus 'unknown' → null; generalCondition 'tired' (a symptom) → null; testsDone null → [] (FIT discussed, not sent); evidence re-quoted ('colorectal','not done' fragments).
19. `colorectal-en-019`: smokingStatus 'unknown' → null; invented otherIllnesses [] and ironDeficiencyAnaemia false → null; invented rectalExamResult not_done removed; currentMedicines [] kept ('No regular meds'); gpQuestion as written; evidence added.
20. `colorectal-en-028`: visitCount 3→2 (3/2 was a routine check); smokingStatus 'unknown' → null; invented bowelHabitChange false and fitDone false → null; Hb 105 (31/3) added to testsDone; gpQuestion as written; evidence re-quoted, evidence on suspectedCancerType removed.
21. `colorectal-fi-036`: note fix: today '2 kk' contradicted 'pari kuukautta' on 25.08 → 3 kk; duration 8→13; visitCount 1→2 (same symptoms 25.08); invented currentMedicines/otherIllnesses [] and ironDeficiencyAnaemia false → null; rectal exam added to examFindings; evidence re-quoted ('2 kk', 'Vastaanotolla').
22. `colorectal-en-043`: smokingStatus 'unknown' → null; invented currentMedicines [], ironDeficiencyAnaemia false → null; invented rectalExamResult not_done removed; otherIllnesses [] kept ('No PMH'); gpQuestion/diagnosis as written; evidence added.
23. `colorectal-fi-047`: urgency urgent_2_week → null (no urgency written); invented 'irritable bowel syndrome' diagnosis replaced by note's reason; smokingStatus 'unknown' → null; invented currentMedicines/otherIllnesses [] → null; invented rectalExamResult removed; testsDone null → [] ('Ei otettu'/'Ei uusia'); gpQuestion as written.
24. `colorectal-en-056`: invented generalCondition 'fair' → 'stable' (12/03); test dates (invented 04-10) removed, Jan FBC Hb 108 added; prostate cancer added to otherIllnesses; mainSymptom includes fatigue (3 visits); evidence re-quoted ('98','145','3','last month').
25. `colorectal-en-063`: invented ironDeficiencyAnaemia false → null; generalCondition 'good' → as written; gpQuestion as written; FIT result completed; evidence added (FIT, PR, bowel, bleeding).
26. `colorectal-fi-071`: duration 8→9 (≈1 month on 29.06 + 5 wk); invented smokingStatus 'never' and generalCondition 'good' → null; earlier low Hb added to testsDone; free text translated (Ferritin, Omeprazole, Hypertension); suspectedDiagnosis as written; evidence added.
27. `colorectal-fi-082`: smokingStatus 'unknown' → null; currentMedicines ['antibiotics'] → [] (course finished, 'ei aiempaa lääkitystä'); invented fitDone false → null; invented diagnosis 'functional bowel disorder' replaced by note's wording; evidence re-quoted (fitDone quoted the rectal-exam phrase).
28. `colorectal-en-091`: invented generalCondition 'good', currentMedicines/otherIllnesses [], ironDeficiencyAnaemia false, fitDone false → null; testsDone [] → null (tests never mentioned); evidence re-quoted ('8','6' fragments).
29. `colorectal-fi-097`: duration 8→9 ('n. 2 kk' = 8.7); invented fitDone false → null; smokingStatus 'unknown' → null; diagnosis 'rectal cancer' as written; evidence re-quoted.
30. `colorectal-en-105`: duration 12→13 ('past 3 months'); invented smokingStatus 'never' and generalCondition 'frail, alert and oriented' → null; invented doses (20mg OD, 1g QDS) and invented test dates removed; gpQuestion as written; evidence re-quoted ('6.5','4.2' fragments).
31. `colorectal-fi-110`: invented test dates (FIT, Hb) removed; earlier normal DRE folded into exam; evidence re-quoted ('12 viikkoa','normaali','kiireelliseen' fragments; count evidence removed).
32. `colorectal-ctrl-fi-010`: duration 6→8 ('parin viikon' on 18.5 + 6 wk); invented smokingStatus 'never' → null; invented fitDone false and abdominalMass false (no abdominal exam) → null; rectalExamResult normal → abnormal (palpable internal haemorrhoids); diagnosis/gpQuestion as written; evidence added.
33. `colorectal-ctrl-en-019`: invented smokingStatus 'never' and generalCondition 'good' → null; invented fitDone false → null; otherIllnesses [] → ['Back pain']; FBC 04-02 added; invented 'opioid-induced' diagnosis and 'please review' question replaced by note wording; evidence added.
34. `ovarian-en-003`: duration 14→20 (bloating ≈6 wk on 29/03 + 13.6 wk; '3/12' read as the increasing distension); invented pelvicOrAbdominalPain false (evidence was the FH phrase), symptomDaysPerMonth 30 and brcaStatus not_tested → null; invented doses removed; invented FBC date removed; urine dipstick added; evidence re-quoted ('85yo F' as count evidence removed).
35. `ovarian-en-017`: duration 16→17 (4 months); invented smokingStatus, generalCondition, HRT, hypertension, ascites false, familyHistory false → null; symptomDaysPerMonth 22 ('most days') → null; gpQuestion as written; evidence re-quoted ('None', 'urinary symptoms' fragments; suspectedCancerType evidence removed).
36. `ovarian-en-024`: invented brcaStatus 'unknown' → null; invented pelvicUltrasoundResult not_done → null; evidence re-quoted ('6','1','78','never' fragments).
37. `ovarian-fi-033`: duration 16→17 (4 months); smokingStatus/brcaStatus 'unknown' → null; invented currentMedicines/otherIllnesses [], pain false, urinary false, familyHistory false, pelvicUltrasoundResult not_done → null; symptomDaysPerMonth 25 ('useimmilla viikonpäivillä') → null; testsDone null → [], ca125Done null → false ('Ei otettuja laboratoriotutkimuksia'); gpQuestion as written; evidence re-quoted ('Menopausi ohit' fragment).
38. `ovarian-en-040`: smokingStatus/brcaStatus 'unknown' → null; symptomDaysPerMonth 28 ('most days') → null; examFindings/generalCondition as written; evidence re-quoted ('four months','2' fragments) and added (CA-125, ultrasound, illnesses).
39. `ovarian-en-050`: duration 7→6 (since first visit 26/03); invented CA-125 date 2026-04-20 → ca125Date null; invented symptomDaysPerMonth 6, ascites false, pelvicUltrasoundResult not_done, currentMedicines/otherIllnesses [] → null; smokingStatus 'unknown' → null; gpQuestion/diagnosis as written; evidence added.
40. `ovarian-en-056`: duration 8→9 (since first visit 23/06); invented pelvicUltrasoundResult not_done → null; testsDone null → [] ('No CA-125 done yet'); breast cancer added to otherIllnesses; gpQuestion/diagnosis as written; evidence added.
41. `ovarian-fi-062`: invented smokingStatus 'never', earlySatiety false, familyHistory false, brcaStatus not_tested → null; invented gpQuestion replaced by the plan wording; Finnish names in free text translated; evidence re-quoted ('78','3.3.2026' fragments) and added.
42. `ovarian-fi-069`: note fixed: today 'noin 8 viikkoa' contradicted 'pari kuukautta sitten' on 02.08 → 'noin 13 viikkoa'; duration 8→13; invented CA-125 date 2026-08-10 → ca125Date null, invented USS date removed; invented symptomDaysPerMonth 30 and brcaStatus not_tested → null; mainSymptom fragment fixed; ultrasound added to tests; gpQuestion as written; evidence re-quoted.
43. `ovarian-en-081`: invented smokingStatus 'never', generalCondition 'well', currentMedicines/otherIllnesses [], bloating/earlySatiety/urinary false, familyHistory false → null; brcaStatus 'unknown' → null; invented gpQuestion replaced by plan wording; evidence re-quoted ('8','2' fragments).
44. `ovarian-en-090`: duration 3→2 (first visit 17/07, 'a couple weeks ago'); smokingStatus/brcaStatus 'unknown' → null; invented currentMedicines/otherIllnesses [] → null; invented gpQuestion replaced by plan wording; evidence re-quoted ('2ww','periods' fragments).
45. `ovarian-fi-093`: invented earlySatiety false, urinary false, symptomDaysPerMonth 15, ascites false, brcaStatus not_tested → null; ultrasound added to tests; evidence added (smoking, pack-years, tests, medicines, illnesses, urgency, CA-125) and re-quoted.
46. `ovarian-fi-100`: duration 12→13 (3 kk); invented otherIllnesses [], earlySatiety/pain/urinary/ascites false (evidence was FH or tenderness phrases), symptomDaysPerMonth 20 → null; brcaStatus not_tested ('Ei sukurasitetta' is family history) → null; CA-125/USS dates were the reporting visit → ca125Date null, USS date removed; ultrasound added to tests; evidence re-quoted.
47. `ovarian-ctrl-en-001`: duration 12→13 (3 months); generalCondition 'NAD, wt stable' (exam, not condition) → null; otherIllnesses [] → melanoma listed; evidence re-quoted ('2','3 months','2WW' fragments) and added for tests.
48. `ovarian-ctrl-en-011`: duration 6→12 (6 wks on 13/04 + 6 wk); smokingStatus 'unknown' → null; nitrofurantoin was previous → currentMedicines null; otherIllnesses (the presenting complaint) → null; pelvicOrAbdominalPain true → false (pain only on micturition); invented bloating/earlySatiety/ascites false, ca125Done false, USS not_done, familyHistory false, brcaStatus not_tested → null; menopausalStatus null → postmenopausal (age 60); invented diagnosis → null; gpQuestion as written; evidence added.
49. `ovarian-ctrl-fi-018`: duration 12→13 (3 kk); invented ca125Done false → null; Finnish names in free text translated; evidence added (tests, medicines, illnesses, days per month, menopause).

## Judgement calls

- **Vague durations.** "Muutaman viikon", "a few weeks" and "a couple of weeks" use the time since the first documented visit (lung-fi-042 9 wk, lung-fi-051 7 wk, ovarian-en-050 6 wk, ovarian-en-090 2 wk). colorectal-ctrl-fi-010 used "parin viikon" (2 wk) plus the elapsed time (8 wk).
- **Stated vs elapsed.** When a duration is stated today, it is kept unless an earlier stated duration plus the elapsed time clearly contradicts it. ovarian-en-003 uses bloating of about 6 weeks on 29/03 plus elapsed time = 20 wk. colorectal-fi-047 and colorectal-en-063 keep a small drift.
- **Visits.** A phone contact counts as a visit (lung-fi-060). A combined mainSymptom counts visits for any part of it.
- **Urgency.** "Lähete syöpäepäilyn vuoksi" with no urgency word → null (lung-fi-042). Finnish "kiireellinen" plus a cancer suspicion → urgent_2_week.
- **symptomDaysPerMonth.** Only an explicit count is used ("~15 days/month", "7 pv kuukaudessa"). "Most days", "persistent" and "useimmilla viikonpäivillä" → null (ovarian-en-003, -017, -040, ovarian-fi-033), matching the eval, which used 30 only for "constant".
- **Test dates.** A date that only shows when a result was reported (the visit date) is removed. ca125Date then stays null and present (ovarian-en-050, ovarian-fi-069, ovarian-fi-100).
- **Rectal exam.** "Peräaukon seutu siisti" is an inspection, not a DRE, so it is left out. A DRE with palpable haemorrhoids is "abnormal" (colorectal-en-028, colorectal-ctrl-fi-010). not_done is removed when no DRE is mentioned.
- **Ultrasound or CA-125 not_done / false.** These are kept only when the note addresses testing ("Tests: None", "no tests done yet", "Ei otettuja laboratoriotutkimuksia"). Otherwise null.
- **Menopause.** Taken from age for ages 60 and over (ovarian-en-017 at 78, ovarian-ctrl-en-011 at 60). Premenopausal is taken from "related to periods" or heavy periods (ovarian-en-056, -081, -090, ovarian-ctrl-fi-018).
- **otherIllnesses.** "Perusterve" and "No PMH" → []. "Fit and well" → null. A prior cancer is listed in otherIllnesses as well as priorCancer. A medicine's stated reason counts as an illness (co-codamol for back pain).
- **currentMedicines.** A finished antibiotic course → [] (colorectal-fi-082). "On nitrofurantoin previously" → null (ovarian-ctrl-en-011).
- **Pain from urination only.** Dysuria is not pelvic or abdominal pain, so ovarian-ctrl-en-011 pelvicOrAbdominalPain → false ("no abdo pain away from micturition", "pain only when passing water").
- **Retracted values.** lung-ctrl-en-013 weightLossKg was removed because the GP retracts it ("? No, wait").
- **suspectedDiagnosis.** Uses the note's own wording, or null when no diagnosis or suspicion is written. It never takes an inferred diagnosis (e.g. "opioid-induced constipation").
- **"Clothes loose"** counts as weight-loss wording but gives no kg value.
- **"Ei sukurasitetta"** is family history, not a BRCA test, so brcaStatus → null (ovarian-fi-100).
