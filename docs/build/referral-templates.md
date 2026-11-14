# Referral templates: lung, colorectal, ovarian

Written 2026-11-14 as build research. Updated the same day: the third cancer changed from prostate to ovarian. The prostate material is archived in [archive/prostate-template-and-staging.md](archive/prostate-template-and-staging.md). It feeds the "Referral templates" in `docs/BUILD-PLAN.md` §3. Terms follow [GLOSSARY.md](../../GLOSSARY.md). "BUILD-PLAN decision 14" means decision 14 in `docs/BUILD-PLAN.md` §2 (the AI risk gradient).

## Read this first

- **Finnish field lists are thin.** Only one hospital (KYS, Kuopio) has a list of minimum Referral contents. It applies to a referral after a cancer diagnosis is confirmed, so we use it as a floor, not the full standard. TAYS, HUS, OYS and TYKS: no field list found. No Finnish national standard for suspected-cancer Referral content found.
- **Clinical triggers come from NICE NG12 through secondary copies.** NICE returned HTTP 403, so NG12 recommendation numbers are not verified.
- **Finnish labels are our translation.** A Finnish clinician should check them before the demo.
- **[unverified]** marks anything we could not verify.
- **Required** means the app and Gemma must give a value. `null` fails the schema, so the app shows the field in red. **Optional** means it may be left out.

## Sources

| Key | Source | Status |
| --- | --- | --- |
| KYS | [Lähete KYSin Syöpäkeskuksen poliklinikalle](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf), Syöpäkeskus work instruction v1, dated 17.12.2024 | Read (PDF text). Says a Referral "must contain at least": diagnosis and reason, symptoms, general condition and status, tests done, lab and imaging results, earlier cancers, other illnesses, medicines. Scope: the Cancer Centre clinic, after diagnosis and spread are confirmed. |
| Käypä prostate (archive only) | [Käypä hoito, prostate cancer, primary care](https://www.kaypahoito.fi/kht00068), dated 17.12.2025 | Read. Not paywalled. |
| Käypä hereditary (ovarian) | [Käypä hoito, hereditary breast and ovarian cancer, dated 22.9.2025](https://www.kaypahoito.fi/nix03573) | Read for the family-history and BRCA fields. The ovarian section itself was not found. [unverified] |
| NG12 ovarian (secondary) | [GPnotebook, urgent referral for suspected ovarian cancer](https://gpnotebook.com/en-GB/pages/general-practice/urgent-referral-for-suspected-ovarian-cancer) (full text read) and [CRUK NG12 poster](https://publications.cancerresearchuk.org/cdn/shop/files/NICE_NG12_body_poster.pdf) | Symptoms and tests. The CA-125 age bands come from the live NICE page (`docs/build/rules.md` OVAR-06). |
| Käypä lung (snippet) | Duodecim lung summary, search snippet only. The page [duo92223](https://www.duodecimlehti.fi/duo92223) came back empty. Related: [Käypä hoito pneumonia](https://www.kaypahoito.fi/hoi50100) (snippet) | Snippet. [unverified] |
| Kanta | [Kanta referral and feedback CDA R2 structure](https://www.kanta.fi/jarjestelmakehittajat/lahetteen-ja-hoitopalautteen-cda-r2-rakenne) | Read. A technical standard with versions. No field list on the page. |
| TAYS | [Pirha, cancer referral guidance](https://www.pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/syopatautien-laheteohjeet-ja-konsultaatiot), and the lung page | Read, but mostly navigation. Cancer referrals are classed urgent (snippet). Lung page body cut off. |
| HUS | [HUS referral guides](https://www.hus.fi/ammattilaiselle/laheteohjeet) and the navigator | Read. No cancer field list. Snippet from a HUS psychiatry guide: the referral is returned if the information needed for assessment is missing. Not cancer-specific. |
| NG12 | [NICE NG12](https://www.nice.org.uk/guidance/ng12/chapter/Recommendations) | 403 on our fetch. Live HTML read later by another agent (`docs/build/rules.md` OVAR-06). Secondary copies used: [Bradford VTS aid, built on NG12 (Apr 2026)](https://www.bradfordvts.co.uk/wp-content/onlineresources/clinical-knowledge/palliative-care/2ww%20Referral%20Criteria%20for%20the%20Different%20Cancers.pdf) and [CRUK NG12 poster, Mar 2024](https://publications.cancerresearchuk.org/cdn/shop/files/NICE_NG12_poster_March_2024_1.pdf). [unverified] |
| DART | [BJGP 2017, DART (Leeds)](https://bjgp.org/content/67/665/560) (title and journal only). PMC5697536 not reachable | Figures come from snippets only. [unverified] |
| Satakunta | [Satakunnan Kansa, 2026-11-11](https://www.satakunnankansa.fi/satakunta/art-2000012403607.html) (lung CT pathway, 20+ pack-years) | News item, cited via [docs/research/context/15](../research/context/15-gp-ct-fast-track-stage.md). |
| Internal | [Expert interview](../discovery/09-expert-interview-2026-11-14.md); [desk answers](../discovery/08-desk-answers.md) Q14 and §3 of [08-primary-care-fast-lanes](../research/context/08-primary-care-fast-lanes.md) | Internal notes. |

## Returned referrals: what we know

- **No Finnish rate** of returned cancer referrals was found. [unverified: no number]
- **Finnish return rules exist, but they are local.** HUS says a referral is returned if required details are missing (HUS long-term pain referral guide, [snippet](https://kehitys.palveluketju.hus.fi/wp-content/uploads/2025/07/Liite-5-HUS-Pitkaaikaisen-kivun-hoidon-laheteohje.pdf)). The HUS psychiatry guide says the same (snippet).
- **DART (Leeds)** reported completion rising from 44% to 99%, and processing time falling from 96 s to 35 s per referral (snippet, [unverified]). It measured completion and processing time. It did not measure returns or time to diagnosis.
- **No study found** of a structured Referral template and its effect on return rate or time to diagnosis. BUILD-PLAN §7 says the same.

---

## Part 1: Common core (every Referral)

Finnish labels: our translation. "Why" gives the reason the field is needed. "Source" gives the evidence.

| Field (camelCase) | English label | Finnish label | Type | Required? | Why | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `patientId` | Patient ID (made up) | Potilastunnus | string, `SYN-nnn` | Required | Identifies the patient. Demo IDs are made up. | [unverified] no Finnish list names it. BUILD-PLAN §10 (made-up patients) |
| `age` | Age | Ikä | integer 0–120 | Required | Sets the NG12 age rules. | NG12 via [Bradford aid](https://www.bradfordvts.co.uk/wp-content/onlineresources/clinical-knowledge/palliative-care/2ww%20Referral%20Criteria%20for%20the%20Different%20Cancers.pdf) (secondary) |
| `sex` | Sex | Sukupuoli | enum: female, male, other, unknown | Required | Ovarian rules apply to women. | NG12 ovarian via GPnotebook (see Sources) [unverified] |
| `smokingStatus` | Smoking status | Tupakointi | enum: never, former, current, unknown | Required | Lung rules use smoking. NG12 chest X-ray route covers people who ever smoked (secondary). | [Satakunta](https://www.satakunnankansa.fi/satakunta/art-2000012403607.html); NG12 via Bradford aid |
| `packYears` | Pack-years | Pakkausvuodet | number ≥ 0 | Optional | Satakunta's lung CT route uses 20+ pack-years. | [Satakunta](https://www.satakunnankansa.fi/satakunta/art-2000012403607.html) (news) |
| `mainSymptom` | Main symptom | Pääoire | string | Required | Referral must contain the symptoms. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) ("oireet") |
| `symptomDurationWeeks` | Symptom duration (weeks) | Oireen kesto (viikkoa) | integer ≥ 0 | Required | NG12 triggers use "persistent" or "unexplained". Duration shows which applies. Our inference. | NG12 via Bradford aid (secondary). [unverified] Finnish source |
| `symptomVisitCount` | Visits for this symptom | Käyntejä tästä oireesta | integer ≥ 0 | Required | Input to the Repeat-visit flag (see GLOSSARY "Repeat visit"). | BUILD-PLAN §3. [unverified] no Finnish list asks for visit counts |
| `examFindings` | Examination findings | Status | string | Required | Minimum item. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) ("status") |
| `generalCondition` | General condition | Yleiskunto | string | Required | Minimum item. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) ("yleiskunto") |
| `weightLossKg` | Weight loss (kg) | Painonlasku (kg) | number ≥ 0 | Optional | NG12 weight-loss rule (2026 change, per Bradford aid). | NG12 via Bradford aid (secondary). [unverified] |
| `testsDone` | Tests done and results | Tehdyt tutkimukset ja tulokset | array of `{name, date?, result}`; may be empty | Required | Lab and imaging results are minimum items. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) ("laboratoriokokeiden ja kuvantamistutkimusten tulokset") |
| `currentMedicines` | Current medicines | Käytössä oleva lääkitys | array of string; may be empty | Required | Minimum item. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) |
| `otherIllnesses` | Other illnesses | Muut sairaudet | array of string; may be empty | Required | Minimum item. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) |
| `priorCancer` | Earlier cancer | Aiempi syöpä | object `{type, yearDiagnosed, treatment}` or null | Optional | Needed if the patient had cancer before. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) ("aikaisemmin syöpäsairauksia") |
| `suspectedDiagnosis` | Suspected diagnosis | Epäilty diagnoosi | string (say "suspected"; no ICD-10 C code) | Required | Minimum item. The cancer is not confirmed yet, so no C code. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) ("diagnoosi"). HUS C-code warning: [snippet, [unverified] URL](../research/context/08-primary-care-fast-lanes.md) |
| `suspectedCancerType` | Suspected cancer type | Epäilty syöpätyyppi | const per template: lung, colorectal, ovarian | Required | Picks the Referral template. | GLOSSARY "Suspected cancer type"; BUILD-PLAN §2 |
| `gpQuestion` | Question to the Specialist | Kysymys erikoislääkärille | string | Required | Minimum item: reason for referral. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) ("lähettämisen syy") |
| `urgency` | Urgency | Kiireellisyys | enum: `urgent_2_week`, `urgent` | Required | KYS: referrals are always handled as urgent. NG12 has a 2-week route (secondary). | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf); [internal, 2-week target](../research/context/15-gp-ct-fast-track-stage.md) |
| `referralDate` | Referral date | Lähetteen päivämäärä | date | Required | Starts the 2-week clock and the Primary-care interval (GLOSSARY). | [internal, 2-week target](../research/context/15-gp-ct-fast-track-stage.md); GLOSSARY |
| `referringGpId` | Referring GP ID (made up) | Lähettävän lääkärin tunnus | string | Required | The Specialist calls the referring doctor if needed. | [KYS](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf) ("lähettävän lääkärin kanssa"). Inferred as required. |
| `matchedRuleIds` | Matched Rules | Täsmäävät säännöt | array of string | Optional | Set by the Aid, not the GP. Shown with the Referral (BUILD-PLAN §3). | BUILD-PLAN §3; GLOSSARY "Rule" |
| `riskGradientAiEstimate` | AI estimate (risk gradient) | Tekoälyarvio (0–10) | integer 0–10 | Optional | Set by the model, labelled "AI estimate" (BUILD-PLAN decision 14). Not a validated score. | BUILD-PLAN decision 14; GLOSSARY "Risk gradient" |

## Part 2: Lung Referral template

| Field (camelCase) | English label | Finnish label | Type | Required? | Why | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `lungSymptoms` | Lung symptoms | Keuhko-oireet | array of enum: cough, fatigue, breathlessness, chest_pain, weight_loss, appetite_loss, finger_clubbing, lymph_node_enlargement, recurrent_pneumonia; may be empty | Required | NG12 lists these symptoms (secondary). Recurrent pneumonia is a referral trigger in Käypä (snippet). | NG12 via [Bradford aid](https://www.bradfordvts.co.uk/wp-content/onlineresources/clinical-knowledge/palliative-care/2ww%20Referral%20Criteria%20for%20the%20Different%20Cancers.pdf); [Käypä pneumonia](https://www.kaypahoito.fi/hoi50100) (snippet) |
| `haemoptysis` | Coughing up blood | Veriyskä | boolean | Required | Haemoptysis at age 40+ is a 2-week route in NG12 (secondary). Käypä lung snippet: always a reason to refer. | NG12 via Bradford aid; Duodecim lung (snippet, [unverified] URL) |
| `chestXrayResult` | Chest X-ray result | Keuhkojen röntgen, tulos | enum: normal, abnormal, not_done | Required | First test for suspected lung cancer (Käypä snippet). Abnormal film → 2-week route (NG12, secondary). | Duodecim lung (snippet); NG12 via Bradford aid |
| `chestXrayFindings` | Chest X-ray findings | Röntgen löydökset | string | Required if `chestXrayResult` is abnormal | Specialist needs the finding. | Our inference. [unverified] no Finnish list |
| `chestXrayDate` | Chest X-ray date | Röntgen päivämäärä | date | Optional | Shows how old the film is. | Our inference. [unverified] |
| `asbestosExposure` | Asbestos exposure | Asbestialtistus | boolean | Optional | NG12 mesothelioma route uses asbestos exposure (secondary). | NG12 via Bradford aid (secondary) |

Lung route note: Finland has no GP-ordered CT (expert interview). The CT route is for the Specialist. Satakunta is the exception (news).

## Part 3: Colorectal Referral template

| Field (camelCase) | English label | Finnish label | Type | Required? | Why | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `bowelHabitChange` | Change in bowel habit | Suolentoiminnan muutos | boolean | Required | NG12 FIT trigger (secondary). | NG12 via [Bradford aid](https://www.bradfordvts.co.uk/wp-content/onlineresources/clinical-knowledge/palliative-care/2ww%20Referral%20Criteria%20for%20the%20Different%20Cancers.pdf) |
| `rectalBleeding` | Rectal bleeding | Peräsuolen verenvuoto | boolean | Required | NG12 FIT trigger, with abdominal pain or weight loss (secondary). | NG12 via Bradford aid |
| `abdominalMass` | Abdominal mass | Vatsan tuntuva kasvain | boolean | Required | NG12 FIT trigger. A mass means no waiting for FIT (secondary). | NG12 via Bradford aid; [CRUK poster](https://publications.cancerresearchuk.org/cdn/shop/files/NICE_NG12_poster_March_2024_1.pdf) |
| `ironDeficiencyAnaemia` | Iron-deficiency anaemia | Rautapuutosanemia | boolean | Required | NG12 FIT trigger. Age 60+ with anaemia also gets FIT (secondary). | NG12 via Bradford aid |
| `haemoglobinGPerL` | Haemoglobin (g/L) | Hemoglobiini (g/l) | number ≥ 0 | Optional | Shows the trend across visits (mock patient SYN-002). Hb is not a colorectal trigger in NG12 (secondary). | [unverified] no Finnish list. NG12 via Bradford aid |
| `fitDone` | FIT done | FIT tehty | boolean | Required | NG12 uses FIT. | NG12 via Bradford aid (secondary). Finnish FIT rule: not found. [unverified] |
| `fitValueUgHbPerG` | FIT value (µg Hb/g) | FIT-arvo (µg Hb/g) | number ≥ 0 | Required if `fitDone` is true | NG12: 10 µg Hb/g or more → 2-week route. Below 10 still refers if concern persists (secondary). Finnish cut-off not found. | NG12 via Bradford aid; CRUK poster. [unverified] Finnish cut-off |
| `rectalExamResult` | Rectal examination | Peräsuolen tutkimus | enum: normal, abnormal, not_done | Optional | Anal or rectal mass: do not wait for FIT (secondary). Making it required is [unverified]. | NG12 via Bradford aid (secondary). [unverified] required |

## Part 4: Ovarian Referral template

Ovarian symptoms are vague, so the template asks for the NG12 symptom set and how often the symptoms occur. Sources for the symptoms and tests: a GPnotebook summary of NG12 (full text read) and the CRUK NG12 poster. The CA-125 age-band cut-off is recorded in OVAR-06 (`docs/build/rules.md`, from the live NICE NG12 Table 1, 2026). The template stores the value and date only (gap 9 resolved).

| Field (camelCase) | English label | Finnish label | Type | Required? | Why | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `bloatingOrDistension` | Bloating or abdominal distension | Vatsan turvotus tai pullistelu | boolean | Required | NG12: persistent or frequent abdominal distension is an ovarian symptom. | NG12 via [GPnotebook](https://gpnotebook.com/en-GB/pages/general-practice/urgent-referral-for-suspected-ovarian-cancer) (read in full); [CRUK NG12 poster](https://publications.cancerresearchuk.org/cdn/shop/files/NICE_NG12_body_poster.pdf) |
| `earlySatietyOrAppetiteLoss` | Early satiety or loss of appetite | Nopea kylläisyyden tunne tai ruokahaluttomuus | boolean | Required | NG12 ovarian symptom. | Same as above |
| `pelvicOrAbdominalPain` | Pelvic or abdominal pain | Lantion tai vatsan kipu | boolean | Required | NG12 ovarian symptom. | Same as above |
| `urinarySymptoms` | Urinary urgency or frequency | Virtsaamisen kiireellisyys tai tiheys | boolean | Required | NG12 ovarian symptom. | Same as above |
| `symptomDaysPerMonth` | Days per month with symptoms | Oireiden päivät kuukaudessa | integer 0–31 | Required | GPnotebook: frequency "particularly more than 12 times per month". The NG12 day-count for "persistent" was not found. | GPnotebook (read in full); the "persistent" definition [unverified] |
| `ascites` | Ascites (fluid in the abdomen) | Askites (vatsaontelon neste) | boolean | Required | NG12 trigger for a gynaecological cancer referral, together with a palpable mass. | GPnotebook and CRUK poster (text read). Finnish source NOT FOUND |
| `palpableMass` | Palpable pelvic or abdominal mass | Tuntuva lantion tai vatsan kasvain | boolean | Required | NG12 trigger, unless the mass is clearly uterine fibroids. | Same as above |
| `ca125Done` | CA-125 test done | CA-125-tutkimus tehty | boolean | Required | NG12: measure CA-125 in people aged 40+ with persistent symptoms. Under 40, CA-125 alone is not used (GPnotebook). | GPnotebook (read in full) |
| `ca125ValueIuPerMl` | CA-125 (IU/mL) | CA-125 (IU/ml) | number ≥ 0 | Required if `ca125Done` is true | The value is needed to act on the test. The age-band cut-off is in OVAR-06 (NG12 Table 1, 2026: 35 IU/mL at 40–49, 31 at 50–59, 24 at 60–69, 25 at 70–79, 31 at 80 and over). The schema stores no cut-off. | GPnotebook; live NICE NG12 HTML via OVAR-06 |
| `ca125Date` | CA-125 date | CA-125-näytteen päivämäärä | date | Required if `ca125Done` is true | Shows how old the value is. | Our inference [unverified] |
| `pelvicUltrasoundResult` | Pelvic ultrasound result | Lantion ultraäänitutkimus, tulos | enum: normal, abnormal, not_done | Required | NG12: ultrasound is the next test. The CRUK poster lists an ultrasound suggestive of ovarian cancer as the urgent (2-week) action. | GPnotebook (read in full); CRUK poster (text read) |
| `pelvicUltrasoundFindings` | Ultrasound findings | Ultraäänilöydökset | string | Required if the result is abnormal | The Specialist needs the finding. | Our inference [unverified] |
| `pelvicUltrasoundDate` | Ultrasound date | Ultraäänitutkimuksen päivämäärä | date | Optional | Shows how old the scan is. | Our inference [unverified] |
| `menopausalStatus` | Menopausal status | Vaihdevuositila | enum: premenopausal, postmenopausal, unknown | Required | CA-125 reference values may differ before and after menopause. The split ranges were only found on a blocked page. | [unverified]: catalogue snippet only |
| `familyHistoryBreastOrOvarianCancer` | Family history of breast or ovarian cancer | Suku-anamneesi: rinta- tai munasarjasyöpä | boolean | Required | Käypä hoito lists family patterns that make hereditary breast or ovarian cancer suspected, such as 3+ breast and/or ovarian cancers in close relatives (one under 50), or 2+ ovarian cancers. | [Käypä hoito, hereditary breast and ovarian cancer, dated 22.9.2025](https://www.kaypahoito.fi/nix03573) (read in full) |
| `brcaStatus` | Known BRCA or other high-risk gene variant | Tunnettu BRCA- tai muu riskigeenimuutos | enum: pathogenic_variant, no_pathogenic_variant, not_tested, unknown | Required | Käypä hoito: a known pathogenic variant in a high or intermediate risk gene, in the patient or family, is a trigger for suspected hereditary cancer. | Same Käypä hoito page (read in full) |

Ovarian route notes:
- **Käypä hoito ovarian guideline and Finnish primary-care symptoms: NOT FOUND.** One search snippet says the ovarian item was removed from the Käypä list [unverified].
- **CA-125 cut-off: resolved.** The live NICE NG12 page (Table 1, 2026) uses age bands: 35 IU/mL at 40–49, 31 at 50–59, 24 at 60–69, 25 at 70–79, 31 at 80 and over. Recorded in OVAR-06 (`docs/build/rules.md`). The flat 35 IU/mL is a lab reference limit, not a referral rule (rules.md line 14). The schema stores no cut-off.
- The GPnotebook page says the Käypä hoito tool suspects hereditary cancer only. It does not say whether to refer or order BRCA testing.

---

## Part 5: JSON Schemas (draft 2020-12)

One schema per Referral template. Each is self-contained, so the app and Gemma can validate with one file each. `additionalProperties: false` keeps the output strict. Gemma should return `null` for unknown required values and leave out unknown optional fields. The `patientId` pattern is the demo pattern from `docs/build/mock-patients.json`. Change it for real use.

Validators skip `format: date` unless format checking is turned on.

### 5.1 Lung

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:vitruvian:referral-template:lung:v1",
  "title": "Lung Referral template",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "patientId", "age", "sex", "smokingStatus", "mainSymptom", "symptomDurationWeeks",
    "symptomVisitCount", "examFindings", "generalCondition", "testsDone", "currentMedicines",
    "otherIllnesses", "suspectedDiagnosis", "suspectedCancerType", "gpQuestion", "urgency",
    "referralDate", "referringGpId", "lungSymptoms", "haemoptysis", "chestXrayResult"
  ],
  "properties": {
    "patientId": { "type": "string", "pattern": "^SYN-[0-9]{3}$", "description": "Made-up demo ID only." },
    "age": { "type": "integer", "minimum": 0, "maximum": 120 },
    "sex": { "type": "string", "enum": ["female", "male", "other", "unknown"] },
    "smokingStatus": { "type": "string", "enum": ["never", "former", "current", "unknown"] },
    "packYears": { "type": "number", "minimum": 0 },
    "mainSymptom": { "type": "string", "minLength": 1 },
    "symptomDurationWeeks": { "type": "integer", "minimum": 0 },
    "symptomVisitCount": { "type": "integer", "minimum": 0 },
    "examFindings": { "type": "string", "minLength": 1 },
    "generalCondition": { "type": "string", "minLength": 1 },
    "weightLossKg": { "type": "number", "minimum": 0 },
    "testsDone": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "result"],
        "properties": {
          "name": { "type": "string", "minLength": 1 },
          "date": { "type": "string", "format": "date" },
          "result": { "type": "string", "minLength": 1 }
        }
      }
    },
    "currentMedicines": { "type": "array", "items": { "type": "string" } },
    "otherIllnesses": { "type": "array", "items": { "type": "string" } },
    "priorCancer": {
      "type": ["object", "null"],
      "additionalProperties": false,
      "required": ["type", "yearDiagnosed", "treatment"],
      "properties": {
        "type": { "type": "string" },
        "yearDiagnosed": { "type": "integer" },
        "treatment": { "type": "string" }
      }
    },
    "suspectedDiagnosis": { "type": "string", "minLength": 1 },
    "suspectedCancerType": { "const": "lung" },
    "gpQuestion": { "type": "string", "minLength": 1 },
    "urgency": { "type": "string", "enum": ["urgent_2_week", "urgent"] },
    "referralDate": { "type": "string", "format": "date" },
    "referringGpId": { "type": "string", "minLength": 1 },
    "matchedRuleIds": { "type": "array", "items": { "type": "string" } },
    "riskGradientAiEstimate": { "type": "integer", "minimum": 0, "maximum": 10 },
    "lungSymptoms": {
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "string",
        "enum": ["cough", "fatigue", "breathlessness", "chest_pain", "weight_loss", "appetite_loss", "finger_clubbing", "lymph_node_enlargement", "recurrent_pneumonia"]
      }
    },
    "haemoptysis": { "type": "boolean" },
    "chestXrayResult": { "type": "string", "enum": ["normal", "abnormal", "not_done"] },
    "chestXrayFindings": { "type": "string", "minLength": 1 },
    "chestXrayDate": { "type": "string", "format": "date" },
    "asbestosExposure": { "type": "boolean" }
  },
  "allOf": [
    {
      "if": { "properties": { "chestXrayResult": { "const": "abnormal" } }, "required": ["chestXrayResult"] },
      "then": { "required": ["chestXrayFindings"] }
    }
  ]
}
```

### 5.2 Colorectal

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:vitruvian:referral-template:colorectal:v1",
  "title": "Colorectal Referral template",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "patientId", "age", "sex", "smokingStatus", "mainSymptom", "symptomDurationWeeks",
    "symptomVisitCount", "examFindings", "generalCondition", "testsDone", "currentMedicines",
    "otherIllnesses", "suspectedDiagnosis", "suspectedCancerType", "gpQuestion", "urgency",
    "referralDate", "referringGpId", "bowelHabitChange", "rectalBleeding", "abdominalMass",
    "ironDeficiencyAnaemia", "fitDone"
  ],
  "properties": {
    "patientId": { "type": "string", "pattern": "^SYN-[0-9]{3}$", "description": "Made-up demo ID only." },
    "age": { "type": "integer", "minimum": 0, "maximum": 120 },
    "sex": { "type": "string", "enum": ["female", "male", "other", "unknown"] },
    "smokingStatus": { "type": "string", "enum": ["never", "former", "current", "unknown"] },
    "packYears": { "type": "number", "minimum": 0 },
    "mainSymptom": { "type": "string", "minLength": 1 },
    "symptomDurationWeeks": { "type": "integer", "minimum": 0 },
    "symptomVisitCount": { "type": "integer", "minimum": 0 },
    "examFindings": { "type": "string", "minLength": 1 },
    "generalCondition": { "type": "string", "minLength": 1 },
    "weightLossKg": { "type": "number", "minimum": 0 },
    "testsDone": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "result"],
        "properties": {
          "name": { "type": "string", "minLength": 1 },
          "date": { "type": "string", "format": "date" },
          "result": { "type": "string", "minLength": 1 }
        }
      }
    },
    "currentMedicines": { "type": "array", "items": { "type": "string" } },
    "otherIllnesses": { "type": "array", "items": { "type": "string" } },
    "priorCancer": {
      "type": ["object", "null"],
      "additionalProperties": false,
      "required": ["type", "yearDiagnosed", "treatment"],
      "properties": {
        "type": { "type": "string" },
        "yearDiagnosed": { "type": "integer" },
        "treatment": { "type": "string" }
      }
    },
    "suspectedDiagnosis": { "type": "string", "minLength": 1 },
    "suspectedCancerType": { "const": "colorectal" },
    "gpQuestion": { "type": "string", "minLength": 1 },
    "urgency": { "type": "string", "enum": ["urgent_2_week", "urgent"] },
    "referralDate": { "type": "string", "format": "date" },
    "referringGpId": { "type": "string", "minLength": 1 },
    "matchedRuleIds": { "type": "array", "items": { "type": "string" } },
    "riskGradientAiEstimate": { "type": "integer", "minimum": 0, "maximum": 10 },
    "bowelHabitChange": { "type": "boolean" },
    "rectalBleeding": { "type": "boolean" },
    "abdominalMass": { "type": "boolean" },
    "ironDeficiencyAnaemia": { "type": "boolean" },
    "haemoglobinGPerL": { "type": "number", "minimum": 0 },
    "fitDone": { "type": "boolean" },
    "fitValueUgHbPerG": { "type": "number", "minimum": 0 },
    "rectalExamResult": { "type": "string", "enum": ["normal", "abnormal", "not_done"] }
  },
  "allOf": [
    {
      "if": { "properties": { "fitDone": { "const": true } }, "required": ["fitDone"] },
      "then": { "required": ["fitValueUgHbPerG"] }
    }
  ]
}
```

### 5.3 Ovarian

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:vitruvian:referral-template:ovarian:v1",
  "title": "Ovarian Referral template",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "patientId", "age", "sex", "smokingStatus", "mainSymptom", "symptomDurationWeeks",
    "symptomVisitCount", "examFindings", "generalCondition", "testsDone", "currentMedicines",
    "otherIllnesses", "suspectedDiagnosis", "suspectedCancerType", "gpQuestion", "urgency",
    "referralDate", "referringGpId", "bloatingOrDistension", "earlySatietyOrAppetiteLoss",
    "pelvicOrAbdominalPain", "urinarySymptoms", "symptomDaysPerMonth", "ascites", "palpableMass",
    "ca125Done", "pelvicUltrasoundResult", "menopausalStatus", "familyHistoryBreastOrOvarianCancer", "brcaStatus"
  ],
  "properties": {
    "patientId": { "type": "string", "pattern": "^SYN-[0-9]{3}$", "description": "Made-up demo ID only." },
    "age": { "type": "integer", "minimum": 0, "maximum": 120 },
    "sex": { "type": "string", "enum": ["female", "male", "other", "unknown"] },
    "smokingStatus": { "type": "string", "enum": ["never", "former", "current", "unknown"] },
    "packYears": { "type": "number", "minimum": 0 },
    "mainSymptom": { "type": "string", "minLength": 1 },
    "symptomDurationWeeks": { "type": "integer", "minimum": 0 },
    "symptomVisitCount": { "type": "integer", "minimum": 0 },
    "examFindings": { "type": "string", "minLength": 1 },
    "generalCondition": { "type": "string", "minLength": 1 },
    "weightLossKg": { "type": "number", "minimum": 0 },
    "testsDone": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "result"],
        "properties": {
          "name": { "type": "string", "minLength": 1 },
          "date": { "type": "string", "format": "date" },
          "result": { "type": "string", "minLength": 1 }
        }
      }
    },
    "currentMedicines": { "type": "array", "items": { "type": "string" } },
    "otherIllnesses": { "type": "array", "items": { "type": "string" } },
    "priorCancer": {
      "type": ["object", "null"],
      "additionalProperties": false,
      "required": ["type", "yearDiagnosed", "treatment"],
      "properties": {
        "type": { "type": "string" },
        "yearDiagnosed": { "type": "integer" },
        "treatment": { "type": "string" }
      }
    },
    "suspectedDiagnosis": { "type": "string", "minLength": 1 },
    "suspectedCancerType": { "const": "ovarian" },
    "gpQuestion": { "type": "string", "minLength": 1 },
    "urgency": { "type": "string", "enum": ["urgent_2_week", "urgent"] },
    "referralDate": { "type": "string", "format": "date" },
    "referringGpId": { "type": "string", "minLength": 1 },
    "matchedRuleIds": { "type": "array", "items": { "type": "string" } },
    "riskGradientAiEstimate": { "type": "integer", "minimum": 0, "maximum": 10 },
    "bloatingOrDistension": { "type": "boolean" },
    "earlySatietyOrAppetiteLoss": { "type": "boolean" },
    "pelvicOrAbdominalPain": { "type": "boolean" },
    "urinarySymptoms": { "type": "boolean" },
    "symptomDaysPerMonth": { "type": "integer", "minimum": 0, "maximum": 31 },
    "ascites": { "type": "boolean" },
    "palpableMass": { "type": "boolean" },
    "ca125Done": { "type": "boolean" },
    "ca125ValueIuPerMl": { "type": "number", "minimum": 0 },
    "ca125Date": { "type": "string", "format": "date" },
    "pelvicUltrasoundResult": { "type": "string", "enum": ["normal", "abnormal", "not_done"] },
    "pelvicUltrasoundFindings": { "type": "string", "minLength": 1 },
    "pelvicUltrasoundDate": { "type": "string", "format": "date" },
    "menopausalStatus": { "type": "string", "enum": ["premenopausal", "postmenopausal", "unknown"] },
    "familyHistoryBreastOrOvarianCancer": { "type": "boolean" },
    "brcaStatus": { "type": "string", "enum": ["pathogenic_variant", "no_pathogenic_variant", "not_tested", "unknown"] }
  },
  "allOf": [
    {
      "if": { "properties": { "ca125Done": { "const": true } }, "required": ["ca125Done"] },
      "then": { "required": ["ca125ValueIuPerMl", "ca125Date"] }
    },
    {
      "if": { "properties": { "pelvicUltrasoundResult": { "const": "abnormal" } }, "required": ["pelvicUltrasoundResult"] },
      "then": { "required": ["pelvicUltrasoundFindings"] }
    }
  ]
}
```

---

## Gaps we could not fill

1. **Finnish field list for TAYS, HUS, OYS, TYKS.** Not found. Only KYS has one, and it covers confirmed cancers. Next step: the HUS navigator (opened, came back empty) and the full TAYS lung page (body cut off).
2. **Finnish suspected-cancer Referral standard.** Not found. Lääkärilehti 2025 editorial on referral contents: a lead only, not opened.
3. **Käypä hoito lung and colorectal primary-care pages.** Not opened (search returned snippets only). The lung wording above is a snippet.
4. **Finnish FIT cut-off** for primary care. Not found. The 10 µg Hb/g figure is from NG12 (secondary).
5. **NG12 recommendation numbers.** Not verified. NICE returned 403. Check NG12 in a browser before any slide cites a number.
6. **DART completion figures and mandatory-field list.** Only snippets. PMC5697536 unreachable.
7. **Allergies, and patient identity fields beyond `patientId`.** Not verified in any Finnish source. Kanta's CDA R2 page lists no content items.
8. **Required status** for `rectalExamResult` (colorectal) and `symptomVisitCount` has no Finnish source.
9. **Ovarian CA-125 cut-off: RESOLVED** (live NICE NG12 Table 1, 2026; recorded in `docs/build/rules.md` OVAR-06). Finnish Käypä hoito ovarian guidance and Finnish CA-125 cut-offs: NOT FOUND. Menopausal split ranges: [unverified].
10. **Naming mismatch.** This file uses camelCase, but `docs/build/mock-patients.json` uses snake_case and `ex-smoker` for smoking status. Our enum is `former`. **Resolved 2026-11-14:** mock data converted to camelCase and `former`.
11. **Schemas not run through a validator.** The validator is not installed in this environment, so the schemas are unchecked against a validator.
