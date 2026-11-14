# Archived 2026-11-14: third cancer changed to ovarian

Prostate material moved out of the live build files on 2026-11-14, when the third cancer changed from prostate to ovarian (Michal, 2026-11-14). The text below is copied unchanged from the source files. Each section gives its source line range. Terms follow GLOSSARY.md (note: GLOSSARY.md still lists prostate as a Suspected cancer type; not edited here).

## A. Referral template: prostate fields and PSA decision note

From referral-templates.md, lines 93–108 (Part 4).

## Part 4: Prostate Referral template

| Field (camelCase) | English label | Finnish label | Type | Required? | Why | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `psaValueUgL` | PSA (µg/L) | PSA-arvo (µg/l) | number ≥ 0 | Required | Käypä: raised PSA above the age reference → urology. NG12 uses age bands (secondary). | [Käypä prostate](https://www.kaypahoito.fi/kht00068); NG12 Table 2 via Bradford aid (secondary) |
| `psaRepeatedlyRaised` | PSA raised on repeat | PSA koholla toistuvasti | boolean | Required | Käypä refers when a raised PSA is repeated. | [Käypä prostate](https://www.kaypahoito.fi/kht00068) |
| `psaDate` | PSA date | PSA-näytteen päivämäärä | date | Optional | Shows whether the PSA is a repeat. | Our inference. [unverified] |
| `rectalExamResult` | Rectal examination | Eturauhasen tunnustelu | enum: normal, suspicious_nodule, not_done | Required | Käypä: palpable nodule is a referral trigger. A normal exam → repeat PSA in 1–2 months before more tests. | [Käypä prostate](https://www.kaypahoito.fi/kht00068) |
| `fiveAlphaReductaseInhibitor` | On 5-alpha-reductase inhibitor | 5-alfa-reduktaasin estäjä | boolean | Required | Käypä: these drugs lower PSA, so the reading is read differently. | [Käypä prostate](https://www.kaypahoito.fi/kht00068) |
| `lowerUrinarySymptoms` | Lower urinary symptoms | Alavirtatieoireet | boolean | Required | NG12: consider PSA with these symptoms (secondary). | NG12 via Bradford aid; [CRUK poster](https://publications.cancerresearchuk.org/cdn/shop/files/NICE_NG12_poster_March_2024_1.pdf) |
| `erectileDysfunction` | Erectile dysfunction | Erektiohäiriö | boolean | Required | NG12: consider PSA with this symptom (secondary). | NG12 via Bradford aid |
| `visibleHaematuria` | Visible blood in urine | Näkyvä verivirtsaisuus | boolean | Required | NG12: consider PSA with this symptom (secondary). | NG12 via Bradford aid |

Prostate testing age: Käypä starts testing at 50, or 40–45 if risk is raised ([Käypä prostate](https://www.kaypahoito.fi/kht00068)). The HUSLAB lab page uses fixed thresholds that conflict with the repeat rule (over 70: PSA above 6.5 µg/l; [snippet](https://huslab.fi/ohjekirjan_liitteet/tkl_ohjeisto/eturauhassyopa.html)). The team must choose one rule. Check it locally.

Decision (2026-11-14): use the Käypä hoito rule (repeat PSA against the age reference).

## B. Referral JSON Schema: prostate

From referral-templates.md, lines 280–351 (section 5.3).

### 5.3 Prostate

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:vitruvian:referral-template:prostate:v1",
  "title": "Prostate Referral template",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "patientId", "age", "sex", "smokingStatus", "mainSymptom", "symptomDurationWeeks",
    "symptomVisitCount", "examFindings", "generalCondition", "testsDone", "currentMedicines",
    "otherIllnesses", "suspectedDiagnosis", "suspectedCancerType", "gpQuestion", "urgency",
    "referralDate", "referringGpId", "psaValueUgL", "psaRepeatedlyRaised", "rectalExamResult",
    "fiveAlphaReductaseInhibitor", "lowerUrinarySymptoms", "erectileDysfunction", "visibleHaematuria"
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
    "suspectedCancerType": { "const": "prostate" },
    "gpQuestion": { "type": "string", "minLength": 1 },
    "urgency": { "type": "string", "enum": ["urgent_2_week", "urgent"] },
    "referralDate": { "type": "string", "format": "date" },
    "referringGpId": { "type": "string", "minLength": 1 },
    "matchedRuleIds": { "type": "array", "items": { "type": "string" } },
    "riskGradientAiEstimate": { "type": "integer", "minimum": 0, "maximum": 10 },
    "psaValueUgL": { "type": "number", "minimum": 0 },
    "psaRepeatedlyRaised": { "type": "boolean" },
    "psaDate": { "type": "string", "format": "date" },
    "rectalExamResult": { "type": "string", "enum": ["normal", "suspicious_nodule", "not_done"] },
    "fiveAlphaReductaseInhibitor": { "type": "boolean" },
    "lowerUrinarySymptoms": { "type": "boolean" },
    "erectileDysfunction": { "type": "boolean" },
    "visibleHaematuria": { "type": "boolean" }
  }
}
```

## C. Staging: prostate TNM, grading, PSA and stage groups

From staging-and-severity.md, lines 81–110 (section 1.2).

#### Prostate

| Part | Plain meaning | 8th edition detail | Source |
| --- | --- | --- | --- |
| T (clinical) | Tumour, from biopsy and scans | T1 = not seen on scan or exam (T1c = found by needle biopsy after a raised PSA [unverified]). T2 = inside the gland. T3a = beyond the gland's capsule, not seminal vesicles. T3b = seminal vesicles. T4 = other nearby structures. 8th edition keeps T2a–c (ACS staging table, secondary source). Lobe definitions [unverified] | [PMC5679543](https://pmc.ncbi.nlm.nih.gov/articles/PMC5679543/) (fetched) |
| N | Lymph nodes | N0 none. N1 regional (pelvic) nodes | PMC5679543 (fetched) |
| M | Distant spread | M0 none. M1 spread to bone, distant soft tissue or organs, or nodes outside the region. M1a/b/c split by site [unverified] | PMC5679543 (fetched) |

Grading and PSA (prostate):

| Measure | Values | Source |
| --- | --- | --- |
| Gleason score | Two most common patterns (each 3–5), added. Total 6–10 | [PMC5679543](https://pmc.ncbi.nlm.nih.gov/articles/PMC5679543/) (fetched) |
| ISUP grade group | 1 = Gleason 6 or less. 2 = 3+4 (7). 3 = 4+3 (7). 4 = Gleason 8. 5 = Gleason 9–10 | PMC5679543 (fetched) |
| PSA bands used in staging | Under 10, 10 to under 20, 20 or more (ng/mL) | PMC5679543 (fetched). Low/intermediate/high labels are a clinical convention [unverified] |

Stage groups, prostate (8th edition). Clinical-style rows from the [ACS staging table](https://www.cancer.org/cancer/types/prostate-cancer/detection-diagnosis-staging/staging.html), a secondary source. The AJCC text was not read.

- **I:** T1 or T2a, grade group 1, PSA under 10, N0 M0.
- **IIA:** T1 or T2a, grade group 1, PSA 10 to under 20; or T2b–T2c, grade group 1, PSA under 20.
- **IIB:** T1–T2, grade group 2, PSA under 20. [unverified against AJCC]
- **IIC:** T1–T2, grade group 3–4, PSA under 20. [unverified against AJCC]
- **IIIA:** T1–T2, grade group 1–4, PSA 20 or more.
- **IIIB:** T3–T4, grade group 1–4, any PSA, N0 M0.
- **IIIC:** any T, grade group 5, any PSA, N0 M0.
- **IVA:** any T, N1, M0. Confirmed here, so N1 maps to IVA on the clinical rows.
- **IVB:** any T, any N, M1.

Open: M1a/b/c subcategories, and whether clinical and pathological rules differ. The ACS table does not split them. [unverified]


## D. Staging: side-by-side stage table (original, with prostate column)

From staging-and-severity.md, lines 111–118.

#### Stage groups side by side (summary only)

| Stage | Lung | Colorectal | Prostate |
| --- | --- | --- | --- |
| I | Small, no node spread | Into the wall, no node or distant spread | Small, grade group 1, PSA under 10 |
| II | Bigger, or near-node spread on same side | Through the wall, no node spread | Bigger, higher grade or PSA, still in gland |
| III | Nodes in middle of chest or other side, or large local spread | Node spread | PSA 20+ or grade group 5, organ-confined, or beyond the gland |
| IV | Spread to other lung, fluid or organs | Distant spread | Node spread (N1, IVA) or distant spread (M1, IVB) |

## E. Staging JSON Schema: prostate

From staging-and-severity.md, lines 221–262 (section 1.4).

#### Prostate

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Staging report: prostate cancer (prototype)",
  "description": "Research prototype. Not for clinical use. TNM 8th edition categories with grade group and PSA. Registry fields are a draft (section 1.3).",
  "type": "object",
  "required": ["cancerType", "patientRef", "diagnosisDate", "basisOfDiagnosis", "spreading", "tnmEdition", "clinicalT", "clinicalN", "clinicalM", "gleasonScore", "isupGradeGroup", "psaAtDiagnosisNgPerMl", "stageGroup"],
  "properties": {
    "cancerType": { "const": "prostate" },
    "patientRef": { "type": "string", "description": "Pseudonymous prototype ID. Never a national identity number." },
    "diagnosisDate": { "type": "string", "format": "date" },
    "basisOfDiagnosis": {
      "type": "string",
      "enum": ["clinical", "surgery", "imaging", "cytology", "histology_primary", "histology_metastasis", "autopsy_micro", "autopsy_macro", "tumour_markers", "unknown"],
      "description": "Paraphrase of an older registry code list. Not checked against v1.1."
    },
    "spreading": { "type": "integer", "enum": [0, 1, 2, 3, 9], "description": "Registry Spreading field, v1.1 codes. Meanings [unverified]. Stage is asked when this is 2 or 3." },
    "tnmEdition": { "const": "8" },
    "clinicalT": { "$ref": "#/$defs/T" },
    "clinicalN": { "$ref": "#/$defs/N" },
    "clinicalM": { "$ref": "#/$defs/M" },
    "pathologicalT": { "$ref": "#/$defs/T" },
    "pathologicalN": { "$ref": "#/$defs/N" },
    "pathologicalM": { "$ref": "#/$defs/M" },
    "primaryGleasonPattern": { "type": "integer", "minimum": 3, "maximum": 5 },
    "secondaryGleasonPattern": { "type": "integer", "minimum": 3, "maximum": 5 },
    "gleasonScore": { "type": "integer", "minimum": 6, "maximum": 10, "description": "Should equal primary plus secondary pattern. Check in the app." },
    "isupGradeGroup": { "type": "integer", "minimum": 1, "maximum": 5 },
    "psaAtDiagnosisNgPerMl": { "type": "number", "minimum": 0 },
    "stageGroup": { "type": "string", "enum": ["I", "II", "III", "IV", "unknown"] },
    "stageSubgroup": { "type": "string", "description": "Optional. Cut-offs [unverified]." }
  },
  "$defs": {
    "T": { "type": "string", "enum": ["TX", "T1a", "T1b", "T1c", "T2", "T2a", "T2b", "T2c", "T3a", "T3b", "T4"], "description": "T2a–c kept or dropped in 8th edition [unverified]." },
    "N": { "type": "string", "enum": ["NX", "N0", "N1"] },
    "M": { "type": "string", "enum": ["MX", "M0", "M1a", "M1b", "M1c"] }
  },
  "additionalProperties": false
}
```

## F. Survival rows: prostate

From staging-and-severity.md, section 2.1 (lines 278–279), the age-band table (line 287, with its header at lines 283–284), and the Severity JSON entry (line 312).

| Prostate | **95.5%** | Men, 60–69 (CI 94.8–96.3). Age-specific | 2017–2021 | Same |
| Prostate | **93.6%** [92.8–94.4] | Men, all ages. NORDCAN relative survival | 2016–2020 (NORDCAN v9.2) | NORDCAN Finland prostate factsheet (gco.iarc.fr). **[unverified]: search snippet only.** The page was unreachable from the research environment |
| Cancer | Men | Women |
| --- | --- | --- |
| Prostate | under 50: 91.5%. 50–59: 96.7%. 70–79: 95.0%. 80–89: 88.0% | Not applicable |

Severity JSON entry (was an array item, line 312):

```json
  { "cancerType": "prostate", "survival5y": 95.5, "sex": "male", "ageBand": "60-69", "measure": "age-specific 5-year relative survival", "period": "2017-2021", "source": { "label": "Johansson et al., Acta Oncologica 2024, Table 2", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/" } }
```

## G. Gap notes: prostate

From staging-and-severity.md, Gaps items 3 and 5 (lines 320, 322) and referral-templates.md, Gaps item 9 (line 365).

3. **Prostate: PARTLY RESOLVED.** T2a–c kept in 8th edition, and N1 → IVA and M1 → IVB, all from ACS (secondary). Stage groups IIA–IIIC are listed, but IIB and IIC criteria are [unverified]. OPEN: M1a/b/c subcategories, lobe definitions for T2a–c, and clinical vs pathological rules. The AJCC text is needed.
5. **All-ages 5-year survival by sex: PARTLY RESOLVED.** Lung is resolved: 16.4% men, 25.5% women, 2016–2020, age-standardised (Clin Epidemiol 2023). Colon is national 68% (2024), corrected from 73%. Prostate has only a NORDCAN snippet (93.6%, [unverified]). OPEN: a fetched prostate figure from NORDCAN or the Cancer Registry.
9. **Conflicting PSA rules.** Käypä (repeat against the age reference) vs HUSLAB (fixed thresholds). The team must choose one for the demo.
