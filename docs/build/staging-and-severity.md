# Staging report and Severity: research notes

Research prototype. Not a medical device. Not for clinical use.

Written 2026-11-14. Terms follow `GLOSSARY.md`: **Staging report**, **Specialist**, **Severity**, **Suspected cancer type**.

Key: **[unverified]** = I could not confirm this from a source I read. Every number has a link.

## 0. Read this first

- **TNM 8th edition:** the category meanings and stage-group grids below come from open secondary sources (review papers, Peptiko, ACS). Lung and colorectal grids agree across the sources read. The official UICC/AJCC manual was not read. Items still marked [unverified] need it before a picker is built.
- **Finnish registry fields:** the current (v1.1) field list was **not readable**. The registry pages return HTTP 403. The fields below come from our earlier research and from an older form. Treat them as a draft.
- **Ovarian (FIGO):** the FIGO 2014 table was read through a secondary summary, not the primary paper. No 2023 revision was found. The TNM equivalent for ovary is not verified. Items marked [unverified] need the primary check before a picker is built.
- **Survival:** Finnish 5-year figures are age-specific for ages 60–69 (lung, colorectal; Johansson 2024, checked against the full text). National all-ages figures exist for lung (Clin Epidemiol 2023, 2016–2020, age-standardised). The colon figure is 68% (Sotkanet 2024). The earlier 73% was a cervix value, not colon. Finnish ovarian 5-year relative survival is 49.1% for 2017–2021 (Hemminki 2024, Supplementary Table S3, NORDCAN data; see the last section). Other ovarian figures are US and Nordic, and are labelled as such. No Finnish stage-specific figure from 2010 or later was found.

## Part 1. Staging report

### 1.1 Why it matters

Spread data (TNM, stage or free text) is recorded for 41.9% of solid cancers in Finland (2024 factsheet: https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html); stage alone is 5.4%. The factsheet's three parts add up to 40.8%, not 41.9%. This is unexplained (`docs/research/context/07-stage-data-practice.md`).

### 1.2 TNM 8th edition in plain words

- **T** = size and reach of the main tumour.
- **N** = lymph nodes near it.
- **M** = spread to distant places.
- **Stage groups I–IV** are built from T, N and M. Ovarian uses FIGO stages instead (see the ovarian section in 1.2).
- The 8th edition is the UICC/AJCC version from 2017 (UICC = Union for International Cancer Control; AJCC = American Joint Committee on Cancer).

#### Lung (non-small cell)

| Part | Plain meaning | 8th edition detail | Source |
| --- | --- | --- | --- |
| T | Size and reach of main tumour | Size bands: up to 1 cm (T1a), 1–2 cm (T1b), 2–3 cm (T1c), 3–4 cm (T2a), 4–5 cm (T2b), 5–7 cm (T3), over 7 cm (T4). Tis = in situ. T1mi = minimally invasive adenocarcinoma. Invasion rules for T3/T4 [unverified] | Size bands: [review, Annals of Translational Medicine](https://atm.amegroups.org/article/view/26835/25519) (snippet). Categories: [NCI lung PDQ](https://www.cancer.gov/types/lung/hp/non-small-cell-lung-treatment-pdq) (fetched) |
| N | Lymph nodes | N0 none. N1 same side, near the lung. N2 same side, middle of chest. N3 other side of chest, or above the collarbone | [NCI lung PDQ](https://www.cancer.gov/types/lung/hp/non-small-cell-lung-treatment-pdq) (fetched) |
| M | Spread elsewhere | M0 none. M1a fluid around lung or heart, or nodules in the other lung. M1b one distant spot. M1c several distant spots | Same NCI page. It is labelled AJCC 9th edition (2025), not 8th [unverified: edition] |

Stage groups, lung (8th edition). Confirmed in two open reviews, [PMC6339680](https://pmc.ncbi.nlm.nih.gov/articles/PMC6339680) and [PMC10649001](https://pmc.ncbi.nlm.nih.gov/articles/PMC10649001). Paraphrased:

| Stage | Combinations (M0 unless stated) |
| --- | --- |
| IA1 | T1mi or T1a, N0 |
| IA2 | T1b, N0 |
| IA3 | T1c, N0 |
| IB | T2a, N0 |
| IIA | T2b, N0 |
| IIB | T1–T2b with N1, or T3 with N0 |
| IIIA | T1–T2b with N2, or T3 with N1, or T4 with N0 or N1 |
| IIIB | T1–T2b with N3, or T3 or T4 with N2 |
| IIIC | T3 or T4 with N3 |
| IVA | any T, any N, with M1a or M1b |
| IVB | any T, any N, with M1c |

Changes from 7th: IA split, IIIC added, IV split into IVA and IVB ([PMC6015190](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6015190/), snippet). Still [unverified]: T3/T4 invasion lists and the exact M1a wording. Small-cell staging: not checked.

9th edition (2025) note, [one review, unverified](https://pmc.ncbi.nlm.nih.gov/articles/PMC11444491): N2 is split into N2a (one nodal station) and N2b (several stations), and some combinations move to other stage groups. T descriptors appear unchanged. Do not build the lung picker on the 9th edition.

#### Colorectal (colon and rectum)

| Part | Plain meaning | 8th edition detail | Source |
| --- | --- | --- | --- |
| T | Depth into bowel wall | Tis = lining only. Higher T = deeper, through to the outer layer, nearby tissue or organs. Exact layer for T1–T4b [unverified] | [NCI colon PDQ](https://www.cancer.gov/types/colorectal/hp/colon-treatment-pdq) (fetched) |
| N | Lymph nodes | N0 none. N1 one to three nodes; N1a = one node, N1b = two or three nodes [unverified: sub-letters not in a source read]. N2 four or more: N2a = four to six, N2b = seven or more ([Peptiko](https://peptiko.gr/colorectal-cancer-staging-ajcc-8th-edition), snippet). N1c = tumour deposits without node tissue | NCI colon PDQ (fetched); Peptiko (N2 sub-letters) |
| M | Distant spread | M0 none. M1a one distant site. M1b two or more sites. M1c spread to the lining of the abdomen (peritoneum) | NCI colon PDQ (fetched) |

Stage groups, colorectal (8th edition). From [Peptiko](https://peptiko.gr/colorectal-cancer-staging-ajcc-8th-edition), a secondary source. The AJCC text was not read.

| Stage | Combinations (M0 unless stated) |
| --- | --- |
| 0 | Tis, N0 |
| I | T1–T2, N0 |
| IIA | T3, N0 |
| IIB | T4a, N0 |
| IIC | T4b, N0 |
| IIIA | T1–T2 with N1 (N1 or N1c), or T1 with N2a |
| IIIB | T3–T4a with N1 (N1 or N1c), T2–T3 with N2a, or T1–T2 with N2b |
| IIIC | T4a with N2a, T3–T4a with N2b, or T4b with N1 or N2 |
| IVA / IVB / IVC | any T, any N, with M1a / M1b / M1c |

Rectum-specific rules: [unverified].

#### Ovarian (FIGO 2014; TNM equivalent not verified)

Ovarian cancer (ovary, fallopian tube or peritoneum) is staged mainly from surgery, using FIGO stages. In plain words: **I** = in the ovary or tube only; **II** = spread within the pelvis; **III** = spread beyond the pelvis and/or to lymph nodes behind the abdomen; **IV** = distant spread.

FIGO stage table, paraphrased. Primary reference: FIGO 2014 staging for ovary, fallopian tube and primary peritoneal cancer (Prat J, Int J Gynaecol Obstet 2014). [unverified: the paper was not opened in this pass; the table was read through a secondary summary. Check the primary before a slide uses it.]

| FIGO stage | Plain meaning |
| --- | --- |
| IA | One ovary or tube, capsule intact, no tumour on the surface, no cancer cells in fluid |
| IB | Both ovaries or both tubes, capsule intact |
| IC1 | Stage I, with spill during surgery |
| IC2 | Capsule burst before surgery, or tumour on the surface |
| IC3 | Cancer cells in ascites fluid or washings |
| IIA | Spread to the uterus or a tube |
| IIB | Spread to other pelvic tissue |
| IIIA1 | Lymph nodes behind the abdomen only: (i) 10 mm or less, (ii) over 10 mm [unverified: summary said 1 cm; check the table] |
| IIIA2 | Microscopic spread beyond the pelvis, in the lining of the abdomen |
| IIIB | Macroscopic spread beyond the pelvis, up to 2 cm |
| IIIC | Macroscopic spread beyond the pelvis over 2 cm, and/or lymph node spread [unverified: node wording] |
| IVA | Cancer cells in fluid around the lung (pleural effusion) |
| IVB | Spread to liver or spleen tissue, to other organs outside the abdomen, or to groin nodes |

**FIGO 2023.** No 2023 revision was found in our search, so the table above is FIGO 2014. [unverified: the search was not exhaustive.] The sources read disagree on where spread to lymph nodes behind the abdomen alone belongs (IIIA1 or IIIC) [unverified].

**TNM equivalent: not verified.** The AJCC ovary categories were not read, so this page gives no T, N or M codes for ovary. The ovarian JSON uses FIGO.

**Histology.** Types follow the WHO classification, 5th edition (2020) [unverified: no link opened in this pass]. Main types: high-grade serous, low-grade serous, endometrioid, clear cell, mucinous. The schema adds "other" and "unknown".

**Early vs late survival:** see section 2.2 (US SEER summary stages). SEER's localised, regional and distant groups are not the same as FIGO I–IV.

#### Stage groups side by side (summary only)

| Stage | Lung | Colorectal | Ovarian (FIGO 2014) |
| --- | --- | --- | --- |
| I | Small, no node spread | Into the wall, no node or distant spread | Ovary or tube only (IA–IC) |
| II | Bigger, or near-node spread on same side | Through the wall, no node spread | Spread within the pelvis (IIA–IIB) |
| III | Nodes in middle of chest or other side, or large local spread | Node spread | Beyond the pelvis, and/or nodes behind the abdomen (IIIA–IIIC) |
| IV | Spread to other lung, fluid or organs | Distant spread | Distant: fluid with cancer cells around the lung, or liver, spleen or other organs (IVA–IVB) |

### 1.3 What the Finnish Cancer Registry asks for

The registry calls its notification "ilmoitus". Our term for the document is **Staging report** (the glossary says not to call it a registry notification).

| Item | What we know | Status | Source |
| --- | --- | --- | --- |
| Duty to report | Every confirmed or strongly suspected cancer must be reported | Verified | [Cancer Registry notification page](https://syoparekisteri.fi/ilmoituspalvelu/); `docs/research/law/09-stage-recording-law.md` |
| Two notifications | Clinical (kliininen) and pathology (patologian) | Verified (registry page, via our research) | Same |
| Spread at diagnosis (levinneisyys) | Required in clinical model v1.1 (in force 1.1.2024). Codes 0, 1, 2, 3, 9 | Required: verified. Code meanings: [unverified] | Model zip and guide, not reachable. `docs/research/law/09-stage-recording-law.md` V6 |
| Stage | Asked only when spread is 2 or 3. Spread can be given as TNM, a verbal code, or stage | Verified (V7, V8 in our research) | Same |
| Form fields | Date and way of diagnosis; pathology diagnosis; spread at diagnosis, by TNM, stage or text | Verified (form text) | Registry notification page |
| Clinical TNM | cTNM preferred since 2015, "missing in most notifications" | Snippet only [unverified] | Engholm et al. 2024, [Acta Oncologica](https://medicaljournalssweden.se/actaoncologica/article/view/35232), via `docs/research/context/07-stage-data-practice.md` |
| Basis of diagnosis | Codes: clinical, surgery, X-ray, cytology, histology (primary or metastasis), autopsy, tumour markers, unknown | From an older form. Not checked against v1.1 | [medical-data-models 4072](https://medical-data-models.org/4072?lang=en) and [4701](https://medical-data-models.org/4701) (fetched; marked outdated) |
| Old stage codes 1–5 | Localised, regional nodes, distant, unknown primary, unknown | From the old form. Do not reuse with v1.1 codes | Same |
| ICD-O codes, TNM edition field, Gleason/ISUP, PSA | Not in any source I could read | [unverified] | None found |

The JSON Schemas below carry the draft field list. `patientRef` is a pseudonymous prototype ID only. It must never be a national identity number.

### 1.4 JSON Schemas (draft 2020-12), one per cancer

#### Lung

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Staging report: lung cancer (prototype)",
  "description": "Research prototype. Not for clinical use. TNM 8th edition categories. Registry fields are a draft (section 1.3).",
  "type": "object",
  "required": ["cancerType", "patientRef", "diagnosisDate", "basisOfDiagnosis", "spreading", "tnmEdition", "histology", "clinicalT", "clinicalN", "clinicalM", "stageGroup"],
  "properties": {
    "cancerType": { "const": "lung" },
    "patientRef": { "type": "string", "description": "Pseudonymous prototype ID. Never a national identity number." },
    "diagnosisDate": { "type": "string", "format": "date" },
    "basisOfDiagnosis": {
      "type": "string",
      "enum": ["clinical", "surgery", "imaging", "cytology", "histology_primary", "histology_metastasis", "autopsy_micro", "autopsy_macro", "tumour_markers", "unknown"],
      "description": "Paraphrase of an older registry code list. Not checked against v1.1."
    },
    "spreading": { "type": "integer", "enum": [0, 1, 2, 3, 9], "description": "Registry Spreading field, v1.1 codes. Meanings [unverified]. Stage is asked when this is 2 or 3." },
    "tnmEdition": { "const": "8" },
    "histology": { "type": "string", "enum": ["adenocarcinoma", "squamous_cell", "other_non_small_cell", "small_cell", "unknown"] },
    "tumourSizeMm": { "type": "number", "minimum": 0 },
    "clinicalT": { "$ref": "#/$defs/T" },
    "clinicalN": { "$ref": "#/$defs/N" },
    "clinicalM": { "$ref": "#/$defs/M" },
    "pathologicalT": { "$ref": "#/$defs/T" },
    "pathologicalN": { "$ref": "#/$defs/N" },
    "pathologicalM": { "$ref": "#/$defs/M" },
    "stageGroup": { "type": "string", "enum": ["I", "II", "III", "IV", "unknown"] },
    "stageSubgroup": { "type": "string", "description": "Optional, for example IA2 or IIIB. Cut-offs [unverified]." }
  },
  "$defs": {
    "T": { "type": "string", "enum": ["TX", "Tis", "T1mi", "T1a", "T1b", "T1c", "T2a", "T2b", "T3", "T4"] },
    "N": { "type": "string", "enum": ["NX", "N0", "N1", "N2", "N3"] },
    "M": { "type": "string", "enum": ["MX", "M0", "M1a", "M1b", "M1c"] }
  },
  "additionalProperties": false
}
```

#### Colorectal

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Staging report: colorectal cancer (prototype)",
  "description": "Research prototype. Not for clinical use. TNM 8th edition categories. Registry fields are a draft (section 1.3).",
  "type": "object",
  "required": ["cancerType", "patientRef", "site", "diagnosisDate", "basisOfDiagnosis", "spreading", "tnmEdition", "histology", "clinicalT", "clinicalN", "clinicalM", "stageGroup"],
  "properties": {
    "cancerType": { "const": "colorectal" },
    "patientRef": { "type": "string", "description": "Pseudonymous prototype ID. Never a national identity number." },
    "site": { "type": "string", "enum": ["colon", "rectum"], "description": "Rectum-specific staging rules [unverified]." },
    "diagnosisDate": { "type": "string", "format": "date" },
    "basisOfDiagnosis": {
      "type": "string",
      "enum": ["clinical", "surgery", "imaging", "cytology", "histology_primary", "histology_metastasis", "autopsy_micro", "autopsy_macro", "tumour_markers", "unknown"],
      "description": "Paraphrase of an older registry code list. Not checked against v1.1."
    },
    "spreading": { "type": "integer", "enum": [0, 1, 2, 3, 9], "description": "Registry Spreading field, v1.1 codes. Meanings [unverified]. Stage is asked when this is 2 or 3." },
    "tnmEdition": { "const": "8" },
    "histology": { "type": "string", "enum": ["adenocarcinoma", "other", "unknown"] },
    "clinicalT": { "$ref": "#/$defs/T" },
    "clinicalN": { "$ref": "#/$defs/N" },
    "clinicalM": { "$ref": "#/$defs/M" },
    "pathologicalT": { "$ref": "#/$defs/T" },
    "pathologicalN": { "$ref": "#/$defs/N" },
    "pathologicalM": { "$ref": "#/$defs/M" },
    "tumourDepositsPresent": { "type": "boolean", "description": "Noted separately in TNM. Registry handling [unverified]." },
    "stageGroup": { "type": "string", "enum": ["0", "I", "II", "III", "IV", "unknown"] },
    "stageSubgroup": { "type": "string", "description": "Optional, for example IIIB or IVA. Cut-offs [unverified]." }
  },
  "$defs": {
    "T": { "type": "string", "enum": ["TX", "Tis", "T1", "T2", "T3", "T4a", "T4b"] },
    "N": { "type": "string", "enum": ["NX", "N0", "N1", "N2"], "description": "N1 = 1–3 nodes, N2 = 4 or more (summary). Sub-letters [unverified]." },
    "M": { "type": "string", "enum": ["MX", "M0", "M1a", "M1b", "M1c"] }
  },
  "additionalProperties": false
}
```

#### Ovarian

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Staging report: ovarian cancer (prototype)",
  "description": "Research prototype. Not for clinical use. FIGO 2014 stage groups; the 2023 revision and the TNM equivalent are not verified. Registry fields are a draft (section 1.3).",
  "type": "object",
  "required": ["cancerType", "patientRef", "diagnosisDate", "basisOfDiagnosis", "spreading", "figoEdition", "histology", "figoStage"],
  "properties": {
    "cancerType": { "const": "ovarian" },
    "patientRef": { "type": "string", "description": "Pseudonymous prototype ID. Never a national identity number." },
    "diagnosisDate": { "type": "string", "format": "date" },
    "basisOfDiagnosis": {
      "type": "string",
      "enum": ["clinical", "surgery", "imaging", "cytology", "histology_primary", "histology_metastasis", "autopsy_micro", "autopsy_macro", "tumour_markers", "unknown"],
      "description": "Paraphrase of an older registry code list. Not checked against v1.1."
    },
    "spreading": { "type": "integer", "enum": [0, 1, 2, 3, 9], "description": "Registry Spreading field, v1.1 codes. Meanings [unverified]. Stage is asked when this is 2 or 3." },
    "figoEdition": { "type": "string", "enum": ["2014"], "description": "2023 revision not verified." },
    "histology": { "type": "string", "enum": ["high_grade_serous", "low_grade_serous", "endometrioid", "clear_cell", "mucinous", "other", "unknown"], "description": "WHO types [unverified list]." },
    "histologicalGrade": { "type": "string", "enum": ["low", "high", "unknown"] },
    "figoStage": { "type": "string", "enum": ["I", "II", "III", "IV", "unknown"] },
    "figoSubstage": { "type": "string", "enum": ["IA", "IB", "IC1", "IC2", "IC3", "IIA", "IIB", "IIIA1", "IIIA2", "IIIB", "IIIC", "IVA", "IVB", "unknown"], "description": "Check in the app that the substage matches figoStage. Cut-offs from FIGO 2014 (summary, unverified)." }
  },
  "additionalProperties": false
}
```

## Part 2. Severity

Severity = the cited 5-year relative survival for the Suspected cancer type (glossary). It shows the patient's age band and sex when we have it.

### 2.1 Survival, Finland

| Cancer | Figure | Group and measure | Period | Source |
| --- | --- | --- | --- | --- |
| Lung | **16.7%** | Men, 60–69 (95% CI 15.2–18.2). Age-specific | 2017–2021 | [Johansson et al. 2024, Table 2](https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/) |
| Lung | **25.5%** | Women, 60–69 (CI 23.3–27.8). Age-specific | 2017–2021 | Same |
| Lung | **16.4%** men; **25.5%** women | All ages. Age-standardised relative survival (Pohar Perme), ages 0–89 | 2016–2020 | [Clin Epidemiol 2023, Nordic lung survival, Table 2(b)](https://dovepress.com/survival-in-lung-cancer-in-the-nordic-countries-through-a-half-century-peer-reviewed-fulltext-article-CLEP). Figures read from the article text; the table is an image |
| Colorectal | **68%** | Colon only, both sexes. Age-standardised, national (region 658) | Sotkanet statistical year 2024 | [THL Sotkanet indicator 3627](https://sotkanet.fi/rest/1.1/json?indicator=3627&genders=total&years=2024&region=658) (API, re-checked 2026-11-14). Corrected: the earlier 73% was cervix (indicator 3626) |
| Colorectal | **68.1%** | Men, 60–69 (CI 66.1–70.3). Age-specific | 2017–2021 | [Johansson et al. 2024, Table 2](https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/) |
| Colorectal | **72.4%** | Women, 60–69 (CI 70.1–74.6). Age-specific | 2017–2021 | Same |
| Ovarian (Finland) | **49.1%** (95% CI 47.1–51.3), 5-year relative survival, all ages, age-standardised | Finland block, Nordic paper using NORDCAN data | 2017–2021 | [Hemminki et al., Cancers 2024, Supplementary Table S3](https://pmc.ncbi.nlm.nih.gov/articles/PMC11201377). VERIFIED (supplementary PDF read via Europe PMC, 2026-11-14). See the last section |
| Ovarian (US) | **52.0%** all stages. Localised **91.9%**, regional **70.1%**, distant **31.5%** | US, women, 5-year relative survival, SEER summary stage. Not Finnish | 2016–2022 | [SEER Stat Facts, ovary](https://seer.cancer.gov/statfacts/html/ovary.html). VERIFIED (read on the SEER page) |
| Ovarian (Nordic) | **about 50%** | Nordic, 5-year relative survival. Not Finnish | after 2015 | [Hemminki et al., Cancers 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11201377), text: "In the Nordic countries, the 5-year relative survival of ovarian cancer was about 50% after 2015". VERIFIED (full text via Europe PMC) |

Other age bands in the same Johansson Table 2 (same period, same measure):

| Cancer | Men | Women |
| --- | --- | --- |
| Lung | under 50: 36.8%. 50–59: 17.3%. 70–79: 15.0%. 80–89: 5.1% | under 50: 44.2%. 50–59: 31.0%. 70–79: 22.9%. 80–89: 11.7% |
| Colorectal | 60–69: 68.1%. Other bands not extracted [unverified] | 60–69: 72.4%. Other bands not extracted [unverified] |
| Ovarian | Not applicable | No ovary row in Johansson Table 2 (VERIFIED) |

Colon series, national (Sotkanet 3627, region 658, both sexes): 2015 = 63, 2020 = 66, 2023 = 67, 2024 = 68. The older series (57–72, with a 2023 value of 55) came from the region=358 call. The API ignores the region filter, so do not use it.

### 2.2 Notes

- **Measures differ.** Johansson = age-specific 5-year relative survival. Sotkanet = age-standardised. Do not put them side by side as one number.
- **By stage (Finland):** not found for lung or ovary. Johansson says TNM stage was not in its NORDCAN data. Dovepress says stage data were not available. The only old Finnish lung figure is localised disease, 29% for men in 1985–1994 (Teppo et al. 1999, search snippet, [unverified]). Too old for Severity. For colorectal, one search snippet (BMC Cancer, doi 10.1186/s12885-022-09460-0) gives stage I 93.6%, II 84.2%, III 68.2%, IV 14.0% for diagnoses 2006–2015. The country and the full text are not confirmed [unverified]. I left it out of the JSON.
- **Early vs late (ovary, US):** SEER 5-year relative survival by summary stage, 2016–2022: localised 91.9%, regional 70.1%, distant 31.5%. This is US data, not Finnish. SEER summary stages are not FIGO stages. The early vs late split for Finland is NOT FOUND.
- **Matti case (pitch):** `docs/pitch/SLIDES-OUTLINE.md` D3 uses 16.7% for a man aged 60–69 with lung cancer. That matches Table 2.
- **Verification level:** the Johansson Table 2 values (ages 60–69) were re-read from the PMC full text on 2026-11-14 and match. The paper uses NORDCAN version 9.3, with data to 2021. The table also gives all-sites 60–69 figures (men 68.3%, women 75.5%). These are for context and are not per cancer. The Dovepress lung women figure (25.5%, 2016–2020, all ages) is the same number as the Johansson women 60–69 figure (2017–2021). The groups and periods differ, so it may be a coincidence. Both figures come from their own texts.
- **Registry and NORDCAN:** the Cancer Registry statistics pages (Cloudflare block) still could not be read. NORDCAN's gco.iarc.fr factsheets were unreachable from the research environment. The nordcan.iarc.fr home page redirects, and its survival queries were not tested.

### 2.3 Severity JSON

Keys follow the brief: `cancerType`, `survival5y`, `byStage` (optional), `period`, `source`. I added three optional keys, `sex`, `ageBand` and `measure`, because the figures are age- and sex-specific. For the ovarian rows I also added `country` and `status` (VERIFIED or [unverified]).

```json
[
  { "cancerType": "lung", "survival5y": 16.7, "sex": "male", "ageBand": "60-69", "measure": "age-specific 5-year relative survival", "period": "2017-2021", "source": { "label": "Johansson et al., Acta Oncologica 2024, Table 2", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/" } },
  { "cancerType": "lung", "survival5y": 25.5, "sex": "female", "ageBand": "60-69", "measure": "age-specific 5-year relative survival", "period": "2017-2021", "source": { "label": "Johansson et al., Acta Oncologica 2024, Table 2", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/" } },
  { "cancerType": "lung", "survival5y": 16.4, "sex": "male", "ageBand": "all (0-89, age-standardised)", "measure": "age-standardised 5-year relative survival (Pohar Perme)", "period": "2016-2020", "source": { "label": "Clin Epidemiol 2023, Nordic lung survival, Table 2(b)", "url": "https://dovepress.com/survival-in-lung-cancer-in-the-nordic-countries-through-a-half-century-peer-reviewed-fulltext-article-CLEP" } },
  { "cancerType": "lung", "survival5y": 25.5, "sex": "female", "ageBand": "all (0-89, age-standardised)", "measure": "age-standardised 5-year relative survival (Pohar Perme)", "period": "2016-2020", "source": { "label": "Clin Epidemiol 2023, Nordic lung survival, Table 2(b)", "url": "https://dovepress.com/survival-in-lung-cancer-in-the-nordic-countries-through-a-half-century-peer-reviewed-fulltext-article-CLEP" } },
  { "cancerType": "colorectal", "survival5y": 68, "sex": "all", "ageBand": "all (age-standardised)", "measure": "age-standardised 5-year relative survival, colon only, national", "period": "Sotkanet statistical year 2024", "source": { "label": "THL Sotkanet indicator 3627 (colon), national", "url": "https://sotkanet.fi/rest/1.1/json?indicator=3627&genders=total&years=2024&region=658" } },
  { "cancerType": "colorectal", "survival5y": 68.1, "sex": "male", "ageBand": "60-69", "measure": "age-specific 5-year relative survival", "period": "2017-2021", "source": { "label": "Johansson et al., Acta Oncologica 2024, Table 2", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/" } },
  { "cancerType": "colorectal", "survival5y": 72.4, "sex": "female", "ageBand": "60-69", "measure": "age-specific 5-year relative survival", "period": "2017-2021", "source": { "label": "Johansson et al., Acta Oncologica 2024, Table 2", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/" } },
  { "cancerType": "ovarian", "survival5y": 49.1, "sex": "female", "ageBand": "all", "measure": "5-year relative survival (Pohar Perme), age-standardised, all stages", "country": "Finland", "period": "2017-2021", "status": "VERIFIED", "source": { "label": "Hemminki et al., Cancers 2024, Supplementary Table S3 (NORDCAN data)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11201377" } },
  { "cancerType": "ovarian", "survival5y": 52.0, "sex": "female", "ageBand": "all", "measure": "5-year relative survival, all stages; byStage = SEER summary stage", "byStage": { "localised": 91.9, "regional": 70.1, "distant": 31.5 }, "country": "US (not Finland)", "period": "2016-2022", "status": "VERIFIED", "source": { "label": "SEER Stat Facts, ovary", "url": "https://seer.cancer.gov/statfacts/html/ovary.html" } },
  { "cancerType": "ovarian", "survival5y": 50, "sex": "female", "ageBand": "all", "measure": "5-year relative survival, Nordic", "country": "Nordic (not Finland)", "period": "after 2015", "status": "VERIFIED", "source": { "label": "Hemminki et al., Cancers 2024 (text)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11201377" } }
]
```

## Gaps

1. **OPEN (not in this pass). Registry v1.1 field list and Spreading code meanings.** Registry pages return 403. Michal can download `Syopailmoitus-kliininen-tietomalli-v1.1.zip` and `kliin_ohje.txt` by hand from syoparekisteri.fi. Also the THL decision THL/5273/5.03.00/2023 and its annex.
2. **Lung edition: RESOLVED for 8th, 9th note added.** The 8th-edition stage grid is confirmed from two open reviews (section 1.2). The 9th-edition note rests on one review ([unverified]). Still OPEN: T3/T4 invasion lists, and small-cell staging.
3. **Ovarian FIGO: OPEN.** The FIGO 2014 table is read through a secondary summary; the primary paper still needs checking. The IIIA1 size (10 mm or 1 cm) is [unverified]. No 2023 revision found. OPEN: the TNM equivalent for ovary (the AJCC manual is needed). Prostate TNM notes are archived.
4. **Colorectal: PARTLY RESOLVED.** Stage grid (IIA–C, IIIA–C, IVA–C) and N2a/N2b confirmed from one secondary source (Peptiko). N1a/N1b [unverified]. OPEN: rectum-specific rules, and a check against the AJCC text.
5. **All-ages 5-year survival by sex: PARTLY RESOLVED.** Lung is resolved: 16.4% men, 25.5% women, 2016–2020, age-standardised (Clin Epidemiol 2023). Colon is national 68% (2024), corrected from 73%. Ovarian Finland is resolved: 49.1%, 2017–2021, age-standardised (Hemminki 2024, Table S3). US SEER and Nordic figures are labelled as not Finnish.
6. **Finnish survival by stage: OPEN.** No recent Finnish stage-specific figure for lung, colorectal or ovary. The Johansson and Dovepress papers say stage was not in their data. The lung localised figure (1985–1994) is too old. The colorectal stage figures remain an unverified snippet.
7. **Johansson values: RESOLVED.** Table 2 (ages 60–69) was re-read from the PMC full text on 2026-11-14 and matches.

## Abbreviations

- **TNM**: tumour, node, metastasis. **UICC**: Union for International Cancer Control. **AJCC**: American Joint Committee on Cancer.
- **FIGO**: International Federation of Gynaecology and Obstetrics (ovarian stage groups). **SEER**: US National Cancer Institute's cancer registry programme.
- **ISUP**: International Society of Urological Pathology (grade groups). **PSA**: prostate-specific antigen.
- **NORDCAN**: IARC's Nordic cancer statistics database. **PMC**: PubMed Central (free full-text articles).
- **NCI PDQ**: US National Cancer Institute's cancer treatment summaries. **Sotkanet**: THL's open indicator database.

## Ovarian survival, Finland (checked 2026-11-14)

- **Figure for Severity:** 49.1% (95% CI 47.1–51.3), Finland, all ages, age-standardised, 5-year relative survival (Pohar Perme), 2017–2021.
- **Source:** Hemminki et al., Cancers 2024, 16(12):2198, Supplementary Table S3, Finland block, row "Age stand.", column 2017–2021: `49.1 [47.1 - 51.3]*`. Caption: "Age-specific 5-year relative survival (Pohar Perme estimates [95% CI]) in ovarian cancer in the Nordic countries (1972-2021)". Data come from NORDCAN. Paper: [PMC11201377](https://pmc.ncbi.nlm.nih.gov/articles/PMC11201377); supplementary PDF read via the Europe PMC supplementary-files endpoint on 2026-11-14.
- **Finnish age bands, same table, 2017–2021:** 0–49 77.7%, 50–59 65.6%, 60–69 49.4%, 70–79 40.8%, 80–89 23.4%.
- **Related (not for Severity):** Table 1 of the same paper gives 5/1-year conditional survival (women who already lived one year), Finland 58.3% (56.1–60.6). Different measure; do not show it as 5-year survival.
- **Not a registry table.** The Finnish Cancer Registry pages returned 403, so this was not checked against a registry table.
