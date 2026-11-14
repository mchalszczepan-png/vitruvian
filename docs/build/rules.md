# Rules for the Aid: lung, colorectal, ovarian

Research prototype. Not a medical device. Not for clinical use.

Written 2026-11-14 for BUILD-PLAN §8. Terms follow `GLOSSARY.md` (Rule, Red flag, Aid, Risk gradient, Suspected cancer type).

## Read this first

- **Primary text read:** NICE NG12 "Recommendations organised by site of cancer" (page read 2026-11-14). Recommendation tags such as [2015], [2021] and [2023] are the year each item was last set, as NICE shows them. We paraphrase. We copy no NICE tables.
- **Finnish criteria are thin.** The Käypä hoito lung recommendation (2017, "Keuhkosyöpä") was removed on 15.12.2023 with no replacement. The Pirha referral guides for lung and colorectal give routing, not red flags. For ovarian, no Finnish referral criteria were found; Duodecim gives ultrasound as the first test, with no CA-125 number.
- **Colorectal works by FIT.** NG12 says to offer a FIT test for most colorectal symptoms. Referral follows if the FIT is at least 10 µg Hb/g. The Aid should show "FIT needed" before "refer". The FIT rule comes from the UK. We found no Finnish FIT referral rule ([unverified] for Finland).
- **Ages are structured facts, not note text.** The Decisions API answers the symptom question from the note. Code checks the age and the numbers (PSA, FIT, platelets).
- **Out of scope:** NG12 1.6.4 (bladder: unexplained visible haematuria at 45+ without a UTI, refer) was in the archived prostate section. It is not in this set. See `archive/prostate-rules.md`.
- **CA-125 is not the NG12 flat 35.** NG12 2026 Table 1 uses age bands, so the Aid uses those bands (OVAR-06). Labs print 35 IU/mL as a reference limit; that is not a referral rule.

## Over time

Decision 15 in BUILD-PLAN: the Aid reads the whole visit history. Every Rule has an `overTime` object in the JSON below.

- **Pattern.**
  - `single`: one visit is enough. `minVisits` is 1 and there is no window or duration.
  - `persistent`: the red flag is in the notes at `minVisits` visits or more, and the first and last matching visits are at least `minDurationDays` apart.
  - `recurrent`: the red flag is in the notes at `minVisits` visits or more inside `windowDays`. The visits need not be next to each other.
  - `worsening`: reserved for a later version. No current Rule uses it.
- **Counting.** Symptoms are extracted from each earlier visit, not only today's note. A visit counts only when its note or structured result shows the red flag. Visits are read in date order.
- **Risk gradient.** Symptoms that persist, recur or get worse raise the AI risk gradient (0–10). The amount of the raise is not set in this document.
- **Evidence.** Each match lists the backing visit dates, so the GP can see which notes it came from.
- **Numbers.** NG12 gives wording for some Rules but no visit count or duration for most. Where it gives no number, the count and day gap are design choices, labelled in each `basis`. Defaults: `persistent` is 2 visits at least 28 days apart; `recurrent` is 3 visits in 120 days, matching the demo ("third visit for cough in 4 months").
- **Verbatim check.** The `basis` text quotes NG12 only where the paraphrase in this file says so. The NICE page returned HTTP 403 on 2026-11-14, so exact NG12 quotes still need a check before a slide quotes them.

---

## Lung

### LUNG-01: chest X-ray suggests lung cancer
- **Red flag:** chest X-ray finding that suggests lung cancer (for example a mass, nodule or shadow).
- **Threshold:** any age.
- **Action:** refer using a suspected cancer pathway referral.
- **NG12:** 1.1.1 [2015]. Link: https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer
- **Finnish:** none usable. Käypä hoito lung removed 15.12.2023 ([notice](https://www.kaypahoito.fi/kaypa-hoito-suositukset-poistuvat-kaytosta-15-12-2023)).
- **Decisions question:** Does the note say a chest X-ray showed a finding that suggests lung cancer, such as a mass, nodule or shadow?
- **Note facts needed:** chest X-ray result (text).

### LUNG-02: unexplained coughing up blood, age 40+
- **Red flag:** unexplained haemoptysis (coughing up blood).
- **Threshold:** age 40 and over.
- **Action:** refer using a suspected cancer pathway referral.
- **NG12:** 1.1.1 [2015]. Same link as LUNG-01.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient has coughed up blood, with no clear cause found?
- **Note facts needed:** age (structured); symptom and whether a cause was found (text).

### LUNG-03: two or more unexplained chest symptoms, age 40+
- **Red flag:** two or more of: cough, fatigue, shortness of breath, chest pain, weight loss, appetite loss, all unexplained.
- **Threshold:** age 40 and over. No duration threshold in NG12.
- **Action:** offer an urgent direct-access chest X-ray.
- **NG12:** 1.1.2 [2015]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient has two or more of these unexplained symptoms: cough, tiredness, breathlessness, chest pain, weight loss, or loss of appetite?
- **Note facts needed:** age (structured); symptom list and whether each is unexplained (text).

### LUNG-04: one unexplained chest symptom, ever smoked, age 40+
- **Red flag:** one or more of the same six symptoms as LUNG-03, in someone who has ever smoked.
- **Threshold:** age 40 and over, and ever smoked. No duration threshold in NG12.
- **Action:** offer an urgent direct-access chest X-ray.
- **NG12:** 1.1.2 [2015]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient has at least one of these unexplained symptoms: cough, tiredness, breathlessness, chest pain, weight loss, or loss of appetite?
- **Note facts needed:** age and ever-smoked (structured); symptom (text).

### LUNG-05: persistent or recurrent chest infection, age 40+
- **Red flag:** chest infection that is persistent or keeps coming back.
- **Threshold:** age 40 and over.
- **Action:** consider an urgent direct-access chest X-ray.
- **NG12:** 1.1.3 [2015]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient has had a chest infection that keeps coming back or does not clear?
- **Note facts needed:** age (structured); infection history (text).

### LUNG-06: finger clubbing, age 40+
- **Red flag:** finger clubbing.
- **Threshold:** age 40 and over.
- **Action:** consider an urgent direct-access chest X-ray.
- **NG12:** 1.1.3 [2015]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient has finger clubbing?
- **Note facts needed:** age (structured); examination finding (text).

### LUNG-07: enlarged lymph nodes above the collarbone or persistent in the neck, age 40+
- **Red flag:** supraclavicular lymphadenopathy, or persistent cervical lymphadenopathy.
- **Threshold:** age 40 and over.
- **Action:** consider an urgent direct-access chest X-ray.
- **NG12:** 1.1.3 [2015]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient has enlarged lymph nodes above the collarbone, or enlarged neck lymph nodes that have persisted?
- **Note facts needed:** age (structured); examination finding (text).

### LUNG-08: raised platelet count, age 40+
- **Red flag:** thrombocytosis (raised platelets).
- **Threshold:** age 40 and over. NG12 gives no number. **[unverified]** lab cut-off. Use the lab's own upper reference limit until a number is found.
- **Action:** consider an urgent direct-access chest X-ray.
- **NG12:** 1.1.3 [2015]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the platelet count is raised?
- **Note facts needed:** age (structured); platelet count and reference limit (test result). Code can answer this from the number.

### LUNG-09: chest signs consistent with lung cancer, age 40+
- **Red flag:** chest examination findings consistent with lung cancer.
- **Threshold:** age 40 and over.
- **Action:** consider an urgent direct-access chest X-ray.
- **NG12:** 1.1.3 [2015]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note describe chest examination findings that could fit lung cancer?
- **Note facts needed:** age (structured); examination findings (text).

Mesothelioma (NG12 1.1.4–1.1.6) is not lung cancer and is left out.

---

## Colorectal

NG12 1.3.1 says offer quantitative FIT for most symptoms below. FIT is the gate. Refer when FIT is 10 µg Hb/g or more (COLO-01).

### COLO-01: FIT result at or above 10 µg Hb/g
- **Red flag:** FIT (faecal immunochemical test) of at least 10 micrograms of haemoglobin per gram of faeces.
- **Threshold:** 10 µg Hb/g or more. Any age.
- **Action:** refer using a suspected cancer pathway referral.
- **NG12:** 1.3.2 [2023]. Link: https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer
- **Finnish:** none found. Pirha colorectal guide gives routing only ([Pirha](https://www.pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/suolistosyovan-laheteohjeet-ja-konsultaatiot)). **[unverified]** Finnish FIT cut-off for referral.
- **Decisions question:** Does the note give a FIT result of 10 micrograms of haemoglobin per gram of faeces or more?
- **Note facts needed:** FIT number and unit (test result). Code can answer this from the number; the question is for free-text notes only.

### COLO-02: abdominal mass
- **Red flag:** abdominal mass (a lump in the tummy).
- **Threshold:** any age.
- **Action:** offer FIT (NG12 1.3.1). If the GP has strong concern, refer without waiting for FIT (NG12 1.3.3).
- **NG12:** 1.3.1 [2023] and 1.3.3 [2023]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say the patient has an abdominal mass, a lump in the tummy?
- **Note facts needed:** examination finding (text).

### COLO-03: rectal mass
- **Red flag:** mass felt in the rectum.
- **Threshold:** any age.
- **Action:** consider a suspected cancer pathway referral. No FIT needed first.
- **NG12:** 1.3.5 [2015, amended 2023]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say a mass was felt in the rectum on examination?
- **Note facts needed:** examination finding (text).

### COLO-04: change in bowel habit
- **Red flag:** change in bowel habit.
- **Threshold:** no age in NG12.
- **Action:** offer FIT.
- **NG12:** 1.3.1 [2023]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say the patient has had a change in their bowel habit, such as new diarrhoea or constipation?
- **Note facts needed:** symptom and duration (text).

### COLO-05: iron-deficiency anaemia
- **Red flag:** iron-deficiency anaemia.
- **Threshold:** no age in NG12.
- **Action:** offer FIT.
- **NG12:** 1.3.1 [2023]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say the patient has iron-deficiency anaemia?
- **Note facts needed:** blood result or diagnosis (test result or text).

### COLO-06: anaemia at 60 or over, with or without iron deficiency
- **Red flag:** anaemia, even without iron deficiency.
- **Threshold:** age 60 and over. NG12 gives no haemoglobin number. **[unverified]** cut-off; use the lab's reference limit.
- **Action:** offer FIT.
- **NG12:** 1.3.1 [2023]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say the patient has anaemia, meaning low haemoglobin?
- **Note facts needed:** age (structured); haemoglobin result (test result).

### COLO-07: unexplained weight loss and abdominal pain, age 40+
- **Red flag:** unexplained weight loss together with unexplained abdominal pain.
- **Threshold:** age 40 and over.
- **Action:** offer FIT.
- **NG12:** 1.3.1 [2023]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say the patient has both unexplained weight loss and abdominal pain?
- **Note facts needed:** age (structured); symptoms (text).

### COLO-08: rectal bleeding, abdominal pain or weight loss, age 50+
- **Red flag:** unexplained rectal bleeding, unexplained abdominal pain, or unexplained weight loss.
- **Threshold:** age 50 and over; any one of the three is enough.
- **Action:** offer FIT. Bleeding without pain or weight loss is also FIT-gated. Do not refer on symptoms alone.
- **NG12:** 1.3.1 [2023]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say the patient has unexplained rectal bleeding, unexplained abdominal pain, or unexplained weight loss?
- **Note facts needed:** age (structured); symptoms (text).

### COLO-09: rectal bleeding with abdominal pain or weight loss, under 50
- **Red flag:** unexplained rectal bleeding together with unexplained abdominal pain or unexplained weight loss.
- **Threshold:** under 50.
- **Action:** offer FIT.
- **NG12:** 1.3.1 [2023]. Same link.
- **Finnish:** none found.
- **Decisions question:** Does the note say the patient has unexplained rectal bleeding together with unexplained abdominal pain or weight loss?
- **Note facts needed:** age (structured); symptoms (text).

Anal cancer (NG12 1.3.6) is left out.

---

## Ovarian

NG12 section 1.5 (ovarian cancer). Text read 2026-11-14 from the NICE page (HTTP 200, direct). Tags: 2011, amended 2020 and 2026.

- **CA-125 is the gate, as FIT is for colorectal.** OVAR-02 to OVAR-05 say "CA-125 needed" (age 40 and over). The Aid shows "CA-125 needed" before "ultrasound" or "refer". OVAR-06 decides the ultrasound. OVAR-07 decides the referral.
- **CA-125 uses age bands** (NG12 Table 1, 2026): 35 IU/mL at 40–49, 31 at 50–59, 24 at 60–69, 25 at 70–79, 31 at 80 and over. The older flat 35 IU/mL no longer applies to all ages.
- **"More than 12 times per month"** is NG12's wording for the symptom list in 1.5.2. Code cannot count bloating or pelvic pain, so the questions ask for "persistent or frequent". Only OVAR-05 (urinary) uses the 12-a-month figure.
- **Under 40** uses OVAR-08 (CA-125 not used alone).
- **Finnish criteria: none usable.** Duodecim (Terveyskirjasto, dlk00156, summary read) says ultrasound is the first test and gives no CA-125 number or referral rule. Pirha's gynaecologic referral guide was not readable. A Käypä hoito "Munasarjasyöpä" entry shows "poistettu" (removed) in a listing snippet **[unverified]**.

### OVAR-01: ascites or pelvic or abdominal mass on examination
- **Red flag:** fluid in the abdomen (ascites), or a mass in the pelvis or abdomen on examination.
- **Threshold:** any age. Not obviously uterine fibroids.
- **Action:** refer using a suspected cancer pathway referral to a gynaecological cancer service.
- **NG12:** 1.5.1 [2011, amended 2020]. Link: https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer
- **Finnish:** none usable.
- **Decisions question:** Does the note say the examination found fluid in the abdomen (ascites), or a mass in the pelvis or abdomen that is not obviously fibroids?
- **Note facts needed:** examination finding (text).

### OVAR-02: persistent or frequent bloating or abdominal distension
- **Red flag:** persistent or frequent abdominal distension, often called bloating.
- **Threshold:** any age. NG12 says "especially" 50 and over; no hard age cut-off for this step. CA-125 applies from age 40 (OVAR-06).
- **Action:** CA-125 needed (age 40 and over; under 40 see OVAR-08). Not a referral on its own.
- **NG12:** 1.5.2 [2011]. Same link.
- **Finnish:** none usable. Duodecim lists bloating as a symptom but gives no referral rule.
- **Decisions question:** Does the note say the patient has had persistent or frequent bloating or abdominal swelling?
- **Note facts needed:** symptom and duration (text); age (structured).

### OVAR-03: persistent or frequent feeling full, or loss of appetite
- **Red flag:** feeling full early (early satiety) or loss of appetite, on a persistent or frequent basis.
- **Threshold:** any age; NG12 says "especially" 50 and over. CA-125 applies from age 40.
- **Action:** CA-125 needed (age 40 and over; under 40 see OVAR-08). Not a referral on its own.
- **NG12:** 1.5.2 [2011]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient has had persistent or frequent early fullness after small amounts of food, or loss of appetite?
- **Note facts needed:** symptom and duration (text); age (structured).

### OVAR-04: persistent or frequent pelvic or abdominal pain
- **Red flag:** pelvic or abdominal pain on a persistent or frequent basis.
- **Threshold:** any age; NG12 says "especially" 50 and over. CA-125 applies from age 40.
- **Action:** CA-125 needed (age 40 and over; under 40 see OVAR-08). Not a referral on its own.
- **NG12:** 1.5.2 [2011]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient has had pelvic or abdominal pain that persists or keeps coming back?
- **Note facts needed:** symptom and duration (text); age (structured).

### OVAR-05: persistent urinary urgency or frequency (more than 12 times a month)
- **Red flag:** increased urinary urgency or frequency on a persistent or frequent basis, particularly more than 12 times a month.
- **Threshold:** any age; NG12 says "especially" 50 and over. A short urine infection that clears is not this Rule. CA-125 applies from age 40.
- **Action:** CA-125 needed (age 40 and over; under 40 see OVAR-08). Not a referral on its own.
- **NG12:** 1.5.2 [2011]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient passes urine more than 12 times a month, or has urgency or frequency that persists, with no urine infection explaining it?
- **Note facts needed:** symptom and frequency (text); infection status (text); age (structured).

### OVAR-06: CA-125 at or above the age threshold
- **Red flag:** raised serum CA-125 for the patient's age band.
- **Threshold:** age 40 and over. Bands (NG12 Table 1, 2026): 40–49: 35 IU/mL or more; 50–59: 31; 60–69: 24; 70–79: 25; 80 and over: 31. Under 40: OVAR-08. Labs often print 35 IU/mL as their reference limit; that is a lab range, not a referral rule.
- **Action:** arrange an urgent direct-access ultrasound of the abdomen and pelvis.
- **NG12:** 1.5.9 [2026] and Table 1. Same link.
- **Finnish:** none usable. Duodecim says CA-125 is imprecise and cannot diagnose on its own.
- **Decisions question:** Does the note say the CA-125 is at or above the age threshold: 35 IU/mL at ages 40–49, 31 at 50–59, 24 at 60–69, 25 at 70–79, or 31 at 80 and over?
- **Note facts needed:** age (structured); CA-125 result and unit (test result). Code can compare the number; the question is for free-text notes only.

### OVAR-07: ultrasound suggests ovarian cancer
- **Red flag:** ultrasound finding that suggests ovarian cancer.
- **Threshold:** any age.
- **Action:** refer to a gynaecological cancer service using a suspected cancer pathway referral.
- **NG12:** 1.5.10 [2011, amended 2026]. Same link.
- **Finnish:** Duodecim (summary read) says ultrasound is the first test. No referral rule found.
- **Decisions question:** Does the note say the ultrasound scan suggested ovarian cancer?
- **Note facts needed:** scan result (text).

### OVAR-08: persistent symptoms at 39 or under (CA-125 not used alone)
- **Red flag:** persistent symptoms that suggest ovarian cancer (bloating, early fullness, pelvic or abdominal pain, or urinary urgency or frequency) in a woman, trans man or non-binary person with female reproductive organs aged 39 or under.
- **Threshold:** age 39 and under. Do not use CA-125 alone for decisions.
- **Action:** consider an urgent direct-access ultrasound of the abdomen and pelvis. If it is normal, look for other causes and advise a return to the GP if symptoms become more frequent or persistent.
- **NG12:** 1.5.6 and 1.5.7 [2026]. Same link.
- **Finnish:** none usable.
- **Decisions question:** Does the note say the patient is 39 or under and has persistent symptoms that suggest ovarian cancer?
- **Note facts needed:** age (structured); symptoms and duration (text).

---

## Gaps: what we could not fill

1. **Finnish lung criteria.** The Käypä hoito lung recommendation was removed on 15.12.2023 with no replacement. The Pirha lung guide gives routing only. Lung rows cite NG12 alone. Next step: ask the Pirha or Tampere lung clinic for the current criteria, or search for a successor guideline.
2. **Finnish colorectal criteria.** None found. The Käypä hoito colorectal page was not found. The Pirha colorectal guide gives routing only.
3. **Finnish FIT rule.** The FIT ≥10 µg Hb/g rule is from UK NG12. The Finnish screening FIT cut-off (reported as 25 µg Hb/g) is unconfirmed.
4. **NG12 numbers for lab cut-offs.** NG12 gives no number for raised platelets (LUNG-08) or anaemia (COLO-06). We use the lab's own reference range.
5. **Finnish ovarian criteria.** None usable. Duodecim (Terveyskirjasto) gives ultrasound as the first test, with no number or referral rule. Pirha's gynaecologic referral guide was not readable. Käypä hoito "Munasarjasyöpä" shows as removed in a listing snippet (unverified). Next step: check with a local gynaecology clinic or the Käypä listing.
6. **Ovarian CA-125 wording.** Read from the NICE page directly (2026 text). Check the Table 1 numbers against the printed NICE PDF before a slide quotes them.
7. **Pirha guides.** The referral pages are long. Their bodies were read from the raw HTML and give routing and urgency only.
8. **NICE use outside the UK.** NICE terms were reachable (HTTP 200) but not read. Our text is a paraphrase. Check the terms before a slide quotes NG12 directly ([NICE terms](https://www.nice.org.uk/terms-and-conditions)).
9. **Decisions API privacy and model.** Not covered here (BUILD-PLAN decision 12).
10. **Duration thresholds.** NG12 sets none for these lung, colorectal or ovarian items ("persistent or frequent" is NG12's wording for OVAR-02 to OVAR-05). The `overTime` values are design choices, marked as such in each `basis`. They are not guideline numbers.

---

## JSON for the app

### Lung
```json
[
  {"id": "LUNG-01", "cancerType": "lung", "redFlag": "Chest X-ray finding that suggests lung cancer", "threshold": "any age", "question": "Does the note say a chest X-ray showed a finding that suggests lung cancer, such as a mass, nodule or shadow?", "sources": [{"label": "NICE NG12 1.1.1 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "LUNG-02", "cancerType": "lung", "redFlag": "Unexplained haemoptysis", "threshold": "age 40 and over", "question": "Does the note say the patient has coughed up blood, with no clear cause found?", "sources": [{"label": "NICE NG12 1.1.1 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "LUNG-03", "cancerType": "lung", "redFlag": "Two or more unexplained symptoms: cough, fatigue, shortness of breath, chest pain, weight loss, appetite loss", "threshold": "age 40 and over; no duration in NG12", "question": "Does the note say the patient has two or more of these unexplained symptoms: cough, tiredness, breathlessness, chest pain, weight loss, or loss of appetite?", "sources": [{"label": "NICE NG12 1.1.2 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "design choice (no guideline number). NG12 gives no duration for this item."}},
  {"id": "LUNG-04", "cancerType": "lung", "redFlag": "One or more unexplained symptoms (as LUNG-03) in someone who has ever smoked", "threshold": "age 40 and over; ever smoked; no duration in NG12", "question": "Does the note say the patient has at least one of these unexplained symptoms: cough, tiredness, breathlessness, chest pain, weight loss, or loss of appetite?", "sources": [{"label": "NICE NG12 1.1.2 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "design choice (no guideline number). NG12 gives no duration for this item."}},
  {"id": "LUNG-05", "cancerType": "lung", "redFlag": "Persistent or recurrent chest infection", "threshold": "age 40 and over", "question": "Does the note say the patient has had a chest infection that keeps coming back or does not clear?", "sources": [{"label": "NICE NG12 1.1.3 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "recurrent", "minVisits": 3, "windowDays": 120, "minDurationDays": null, "basis": "NG12 wording, paraphrase not verified verbatim (NICE returned 403 on 2026-11-14): 'persistent or recurrent chest infection'. Visit count and 120-day window: design choice."}},
  {"id": "LUNG-06", "cancerType": "lung", "redFlag": "Finger clubbing", "threshold": "age 40 and over", "question": "Does the note say the patient has finger clubbing?", "sources": [{"label": "NICE NG12 1.1.3 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "LUNG-07", "cancerType": "lung", "redFlag": "Supraclavicular or persistent cervical lymphadenopathy", "threshold": "age 40 and over", "question": "Does the note say the patient has enlarged lymph nodes above the collarbone, or enlarged neck lymph nodes that have persisted?", "sources": [{"label": "NICE NG12 1.1.3 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "design choice (no guideline number). A supraclavicular node on one visit is enough; the 28-day check applies to persistent cervical nodes."}},
  {"id": "LUNG-08", "cancerType": "lung", "redFlag": "Thrombocytosis (raised platelets)", "threshold": "age 40 and over; lab reference limit [unverified: NG12 gives no number]", "question": "Does the note say the platelet count is raised?", "sources": [{"label": "NICE NG12 1.1.3 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "LUNG-09", "cancerType": "lung", "redFlag": "Chest signs consistent with lung cancer", "threshold": "age 40 and over", "question": "Does the note describe chest examination findings that could fit lung cancer?", "sources": [{"label": "NICE NG12 1.1.3 [2015]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}}
]
```

### Colorectal
```json
[
  {"id": "COLO-01", "cancerType": "colorectal", "redFlag": "FIT at or above 10 µg Hb/g", "threshold": "10 µg Hb/g or more; any age; Finnish cut-off [unverified]", "question": "Does the note give a FIT result of 10 micrograms of haemoglobin per gram of faeces or more?", "sources": [{"label": "NICE NG12 1.3.2 [2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}, {"label": "Pirha colorectal referral guide (routing only)", "url": "https://www.pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/suolistosyovan-laheteohjeet-ja-konsultaatiot"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "COLO-02", "cancerType": "colorectal", "redFlag": "Abdominal mass", "threshold": "any age; refer without waiting for FIT if strong concern", "question": "Does the note say the patient has an abdominal mass, a lump in the tummy?", "sources": [{"label": "NICE NG12 1.3.1 and 1.3.3 [2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "COLO-03", "cancerType": "colorectal", "redFlag": "Rectal mass", "threshold": "any age; no FIT first", "question": "Does the note say a mass was felt in the rectum on examination?", "sources": [{"label": "NICE NG12 1.3.5 [2015, amended 2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "COLO-04", "cancerType": "colorectal", "redFlag": "Change in bowel habit (offer FIT)", "threshold": "no age in NG12", "question": "Does the note say the patient has had a change in their bowel habit, such as new diarrhoea or constipation?", "sources": [{"label": "NICE NG12 1.3.1 [2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "design choice (no guideline number). NG12 gives no duration for this item."}},
  {"id": "COLO-05", "cancerType": "colorectal", "redFlag": "Iron-deficiency anaemia (offer FIT)", "threshold": "no age in NG12", "question": "Does the note say the patient has iron-deficiency anaemia?", "sources": [{"label": "NICE NG12 1.3.1 [2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "COLO-06", "cancerType": "colorectal", "redFlag": "Anaemia even without iron deficiency (offer FIT)", "threshold": "age 60 and over; haemoglobin cut-off [unverified: NG12 gives no number]", "question": "Does the note say the patient has anaemia, meaning low haemoglobin?", "sources": [{"label": "NICE NG12 1.3.1 [2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "COLO-07", "cancerType": "colorectal", "redFlag": "Unexplained weight loss and abdominal pain (offer FIT)", "threshold": "age 40 and over", "question": "Does the note say the patient has both unexplained weight loss and abdominal pain?", "sources": [{"label": "NICE NG12 1.3.1 [2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "design choice (no guideline number). NG12 gives no duration for this item."}},
  {"id": "COLO-08", "cancerType": "colorectal", "redFlag": "Unexplained rectal bleeding, abdominal pain or weight loss (offer FIT)", "threshold": "age 50 and over; any one of the three", "question": "Does the note say the patient has unexplained rectal bleeding, unexplained abdominal pain, or unexplained weight loss?", "sources": [{"label": "NICE NG12 1.3.1 [2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "design choice (no guideline number). NG12 gives no duration for this item."}},
  {"id": "COLO-09", "cancerType": "colorectal", "redFlag": "Rectal bleeding with abdominal pain or weight loss (offer FIT)", "threshold": "under 50", "question": "Does the note say the patient has unexplained rectal bleeding together with unexplained abdominal pain or weight loss?", "sources": [{"label": "NICE NG12 1.3.1 [2023]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "design choice (no guideline number). NG12 gives no duration for this item."}}
]
```

### Ovarian
```json
[
  {"id": "OVAR-01", "cancerType": "ovarian", "redFlag": "Ascites, or a pelvic or abdominal mass on examination", "threshold": "any age; not obviously uterine fibroids", "question": "Does the note say the examination found fluid in the abdomen (ascites), or a mass in the pelvis or abdomen that is not obviously fibroids?", "sources": [{"label": "NICE NG12 1.5.1 [2011, amended 2020]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "OVAR-02", "cancerType": "ovarian", "redFlag": "Persistent or frequent bloating (abdominal distension); CA-125 needed", "threshold": "any age, especially 50 and over; CA-125 from age 40 (OVAR-06)", "question": "Does the note say the patient has had persistent or frequent bloating or abdominal swelling?", "sources": [{"label": "NICE NG12 1.5.2 [2011]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "NG12 wording, paraphrase not verified verbatim (NICE returned 403 on 2026-11-14): 'persistent or frequent'. Visit count and 28-day gap: design choice."}},
  {"id": "OVAR-03", "cancerType": "ovarian", "redFlag": "Persistent or frequent feeling full early, or loss of appetite; CA-125 needed", "threshold": "any age, especially 50 and over; CA-125 from age 40", "question": "Does the note say the patient has had persistent or frequent early fullness after small amounts of food, or loss of appetite?", "sources": [{"label": "NICE NG12 1.5.2 [2011]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "NG12 wording, paraphrase not verified verbatim (NICE returned 403 on 2026-11-14): 'persistent or frequent'. Visit count and 28-day gap: design choice."}},
  {"id": "OVAR-04", "cancerType": "ovarian", "redFlag": "Persistent or frequent pelvic or abdominal pain; CA-125 needed", "threshold": "any age, especially 50 and over; CA-125 from age 40", "question": "Does the note say the patient has had pelvic or abdominal pain that persists or keeps coming back?", "sources": [{"label": "NICE NG12 1.5.2 [2011]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "NG12 wording, paraphrase not verified verbatim (NICE returned 403 on 2026-11-14): 'persistent or frequent'. Visit count and 28-day gap: design choice."}},
  {"id": "OVAR-05", "cancerType": "ovarian", "redFlag": "Persistent or frequent urinary urgency or frequency, particularly more than 12 times a month; CA-125 needed", "threshold": "any age, especially 50 and over; not a short urine infection; CA-125 from age 40", "question": "Does the note say the patient passes urine more than 12 times a month, or has urgency or frequency that persists, with no urine infection explaining it?", "sources": [{"label": "NICE NG12 1.5.2 [2011]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "NG12 wording, paraphrase not verified verbatim (NICE returned 403 on 2026-11-14): 'persistent or frequent' and 'more than 12 times a month'. Visit count and 28-day gap: design choice."}},
  {"id": "OVAR-06", "cancerType": "ovarian", "redFlag": "CA-125 at or above the age-band threshold: urgent direct-access ultrasound", "threshold": "age 40 and over; 40–49: 35 IU/mL; 50–59: 31; 60–69: 24; 70–79: 25; 80+: 31 (NG12 Table 1, 2026)", "question": "Does the note say the CA-125 is at or above the age threshold: 35 IU/mL at ages 40–49, 31 at 50–59, 24 at 60–69, 25 at 70–79, or 31 at 80 and over?", "sources": [{"label": "NICE NG12 1.5.9 and Table 1 [2026]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "OVAR-07", "cancerType": "ovarian", "redFlag": "Ultrasound suggests ovarian cancer", "threshold": "any age", "question": "Does the note say the ultrasound scan suggested ovarian cancer?", "sources": [{"label": "NICE NG12 1.5.10 [2011, amended 2026]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "single", "minVisits": 1, "windowDays": null, "minDurationDays": null, "basis": "design choice (no guideline number)"}},
  {"id": "OVAR-08", "cancerType": "ovarian", "redFlag": "Persistent symptoms that suggest ovarian cancer at 39 or under: do not use CA-125 alone; consider urgent ultrasound", "threshold": "age 39 and under", "question": "Does the note say the patient is 39 or under and has persistent symptoms that suggest ovarian cancer?", "sources": [{"label": "NICE NG12 1.5.6 and 1.5.7 [2026]", "url": "https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer"}], "overTime": {"pattern": "persistent", "minVisits": 2, "windowDays": null, "minDurationDays": 28, "basis": "NG12 wording, paraphrase not verified verbatim (NICE returned 403 on 2026-11-14): 'persistent symptoms'. Visit count and 28-day gap: design choice."}}
]
```

---

## Sources used

- NICE NG12, recommendations by site of cancer (read 2026-11-14): https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer
- Terveyskirjasto (Duodecim), Munasarjasyöpä ja munanjohdinsyöpä, dlk00156, dated 20.01.2025 (summary read): https://www.terveyskirjasto.fi/dlk00156
- NICE NG12 section 1.5, ovarian cancer, read 2026-11-14 (direct, HTTP 200): https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer
- Käypä hoito removal notice, 15.12.2023 (lung recommendation removed): https://www.kaypahoito.fi/kaypa-hoito-suositukset-poistuvat-kaytosta-15-12-2023
- Pirha referral guides, routing only: [lung](https://www.pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/keuhkosyovan-laheteohjeet-ja-konsultaatiot), [colorectal](https://www.pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/suolistosyovan-laheteohjeet-ja-konsultaatiot), [gynaecologic oncology (not readable)](https://pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/gynekologisen-onkologian-laheteohjeet-ja-konsultaatiot)
- Repo context: `docs/research/context/12-gp-risk-tool.md` §1b, `docs/discovery/08-desk-answers.md` Q14–Q16, `docs/research/context/08-primary-care-fast-lanes.md` §4. These are older snippets. The Käypä lung snippet in §1b is out of date.
