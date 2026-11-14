# Cancer choice: prostate vs candidates for the GP tool

Research prototype. Not a medical device. Not for clinical use.

Written 2026-11-14. Research note for Michal. No files outside this one were edited, and nothing was committed.

Key:
- **VERIFIED** = read in the full text or the registry page (by me or by a sweep; see the note on each row).
- **[unverified]** = seen only in a search snippet, a secondary site, or an AI summary of a page. Check before a slide uses it.
- **NOT FOUND** = no usable source in this pass.
- Abbreviations: **RS** = relative survival. **OS** = overall survival. **NG12** = NICE guideline on suspected cancer referral (UK). **FBC** = full blood count. **SPE** = serum protein electrophoresis. **SFLC** = serum free light chains. **FINEGO** = Finnish National Esophago-Gastric Cancer Cohort. **OCRWE** = a Finnish multicentre ovarian cohort. **R-ISS** = Revised International Staging System (myeloma).

---

## 0. Short answer

1. **Prostate survival is high mainly because most cancers are slow and found early.** Overdiagnosis from PSA testing is reported to add more of those slow cancers, which inflates the headline figure (our reading; see section 1.3). The men who die are a minority with spread at diagnosis or high-grade disease. Finnish metastatic data were not found; US figures are used as a proxy (section 1).
2. **Best fit for the GP tool: ovarian.** It has a named blood test in NG12 (CA-125), a repeat-visit pattern that matches the flag, and a large early vs late gap in the snippet data. Its blocker is a missing Finnish 5-year survival figure (section 3).
3. **Fallback: myeloma**, because the national cancer strategy says Finland lags the Nordic countries on myeloma outcomes (section 4).

---

## 1. Prostate: why 5-year survival is so high

### 1.1 Figures

| Fact | Figure | Period, country | Link | Status |
| --- | --- | --- | --- | --- |
| 5-year RS, men 60–69 | **95.5%** (CI 94.8–96.3) | 2017–2021, Finland | [Johansson et al. 2024, Acta Oncol, Table 2](https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/) | VERIFIED. Re-read in full text 2026-11-14 (`docs/research/…`, see `docs/build/staging-and-severity.md`) and re-checked for this note |
| 5-year RS by age, same table | under 50: **91.5%**. 50–59: 96.7%. 70–79: 95.0%. 80–89: **88.0%** | 2017–2021, Finland | Same | VERIFIED |
| 5-year RS, all ages | **93.6%** [95% CI 92.8–94.4] | 2016–2020, Finland | NORDCAN Finland factsheet (gco.iarc.fr; page blocked in our tests) | [unverified]: search snippet only |
| Stage at diagnosis, metastatic (distant) | **Finland: NOT FOUND.** A 2026 secondary paper says "more than 20%" of Finnish patients have regional or distant spread [unverified] | Finland | No URL captured. NORDCAN factsheet not opened | NOT FOUND for Finland |
| Stage at diagnosis, US proxy | localised **69%**, regional 14%, distant (metastatic) **9%**, unknown 8% | US SEER 2016–2022, men | [SEER Stat Facts, prostate](https://seer.cancer.gov/statfacts/html/prost.html) | VERIFIED (US, not Finnish) |
| 5-year RS, metastatic vs localised | distant **40.1%** vs localised **100.0%** (regional 100.0%) | US SEER 2016–2022 | Same SEER page | VERIFIED (US). **Finnish or Nordic figure: NOT FOUND** |
| Prostate cancer deaths per year | **920** men died of prostate cancer in 2020 | Finland, Statistics Finland (via search summary) | Statistics Finland causes-of-death 2020: https://www2.tilastokeskus.fi/til/ksyyt/2020/ksyyt_2020_2021-12-10_kat_002_en.html (search result, not fetched) | [unverified]. 2023 count NOT FOUND |
| Death rate | 13.62 per 100,000 men | Finland, 2023 (secondary site citing Our World in Data) | https://geofactbook.com/countries/finland/prostate-cancer-mortality-rate | [unverified] |
| Case count per year | NOT FOUND | Finland | NORDCAN factsheet (not reached) | NOT FOUND |

### 1.2 Overdiagnosis and PSA: what the sources say

- **Seikkula et al. 2017, Acta Oncologica 56(7):971–977** ("Stage-specific mortality and survival trends of prostate cancer patients in Finland before and after introduction of PSA"). [Link](https://medicaljournalssweden.se/actaoncologica/article/view/25139). **VERIFIED** (fetched by the sweep).
  - Cohort: 91,329 men, Finland, 1985–2013. Unknown stage in 28% (the authors' main limitation).
  - Mortality ratio for metastatic disease: **4.51** (1985–89) falling to **3.01** (2000–04).
  - Mortality ratio for localised disease: **1.43** falling to **0.98**.
  - 10-year RS for localised disease after PSA: **94.6%** (CI 91.4–97.8).
  - Reading: the drop in deaths after PSA is real, but this paper does not separate overdiagnosis from real benefit.
- **Seikkula et al. 2018, Int J Cancer 142:891–898**, doi [10.1002/ijc.31109](https://doi.org/10.1002/ijc.31109). Socioeconomic status and stage-specific survival before and after PSA in Finland. **[unverified]: search snippets only.** Reported: 10-year prostate-cancer-specific survival for localised disease, higher vs basic education, 68% vs 63% before PSA and 90% vs 85% after. Mortality rate ratio 0.76 before PSA and 0.61 after. The education gap also appears in metastatic disease. Our earlier notes called this paper "2017"; the sweep found the year is 2018. Use 2018 until the PDF is checked.
- **ERSPC (European screening trial), 23-year follow-up** (Roobol et al., NEJM 2025; PubMed [41160819](https://pubmed.ncbi.nlm.nih.gov/41160819/)). [unverified]: search snippet. 162,236 men in 8 countries. Mortality 13% lower in the screening arm (RR 0.87, CI 0.80–0.95). Incidence RR 1.30. About 12 diagnoses per death avoided. Finland is not named in the snippet. Not read in full.
- **Lead-time bias review for prostate survival statistics: NOT FOUND** in this pass.
- **Finnish policy:** no national PSA programme. An expert panel advised against one on 5 May 2023 ([Valtioneuvosto statement](https://valtioneuvosto.fi/-/1271139/suomalaisen-asiantuntijaryhman-kannanotto-eturauhassyovan-seulontaan-valmistunut)). Opportunistic PSA tests vary by county ([our law note, `docs/research/law/04-screening-detection.md`](../research/law/04-screening-detection.md)). **VERIFIED.**

### 1.3 Who makes up the rest, and what drives the gap

Our reading, not a finding from one source:

- **Most of the high figure is the case mix.** Most diagnoses are localised (US: 69%), and many are slow-growing cancers. Relative survival counts a patient who would never have died from the cancer as a survivor. This is the overdiagnosis effect the Seikkula and ERSPC work points to.
- **The people who die are a small minority:** men with spread at diagnosis (US: 9% of cases, 40% 5-year RS). Survival also falls with age (Finland, 80–89: 88%, against 95.5% at 60–69).
- **Late detection vs aggressive tumours vs care:** the data we have point mainly to tumour biology and the stage mix. There is evidence of a care or social gap (education gap in Seikkula 2018, unverified; a Finnish study on education and stage by Zai et al. 2025, all cancers, verified in `docs/research/context/03-what-others-tried.md`). We found **no Finnish data that isolates GP delay** as the cause of the prostate gap.
- **Implication for the swap:** the case for swapping prostate holds. Its headline survival is already high, and its late cases are few. The stronger reason is that PSA already finds most prostate cancers, so a GP flag adds less there.

---

## 2. Candidate comparison

Abbreviations explained above. Each cell has its own status.

| Cancer | Finland 5-year RS (period, source) | Early vs late 5-year survival (country, source) | Share diagnosed late | Average or share of GP consultations before referral (UK, Lyratzopoulos 2012) | NICE NG12 primary-care rule and test | Staging system | Finnish route or delay data |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Ovarian** | **NOT FOUND.** Nordic "about 50% after 2015" [unverified: snippet, no URL] | US SEER 2007–13: stage I about **89%**, stage IV about **20%** [unverified: snippet; source not opened]. Norway, older cohort: 86% vs 11% [unverified] | Finland, hospital-based OCRWE 2014–19: stage III 33.6% + IV 17.0% = about **51%** (n=1,711) [unverified: snippet, no URL; hospital data, not national] | **NOT FOUND** | Persistent symptoms: CA-125, then ultrasound [SNIPPET: NG12 pages returned 403; secondary sources] | FIGO 2014 [Prat 2014, IJGO, PMC4629993](https://pmc.ncbi.nlm.nih.gov/articles/PMC4629993) [unverified] | **NOT FOUND.** Finnish CA-125 criteria NOT FOUND (`docs/research/context/12-gp-risk-tool.md`) |
| **Pancreatic** | **Johansson et al. 2024**, age-specific 5-year RS, 2017–21: men **60–69: 9.1%** (CI 7.3–11.3); women **60–69: 10.4%** (CI 8.3–12.9). [Acta Oncol full text](https://medicaljournalssweden.se/actaoncologica/article/download/35094/45856?inline=1). VERIFIED (confirmed by me 2026-11-14). All-ages figure 10–13% [unverified: snippet] | Localised vs metastatic: **NOT FOUND** from a reputable source (the only figure, about 44% localised, is from a non-registry site and not usable) | Turku single centre: **77%** metastatic at presentation (n=1,006) [unverified: snippet, no URL]. National figure NOT FOUND | Share with 3+ GP consultations: **41.3%** (crude). Adjusted OR vs rectal cancer: **2.35** [SNIPPET: Lyratzopoulos 2012, see section 2.2] | Age 60+ with weight loss plus a listed symptom: urgent direct-access CT [SNIPPET] | UICC TNM 9th edition, in force 1 Jan 2026 [UICC news](https://www.uicc.org/news-and-updates/25-7-announcements/9th-edition-uicc-tnm-classification-malignant-tumours-now-available) [unverified: snippet] | **NOT FOUND.** In Finland, GPs can't order CT on their own (Oulu rule, `docs/research/context/12-gp-risk-tool.md`), so the Rule's test needs a specialist |
| **Multiple myeloma** | **NOT FOUND** for 5-year RS. Quoted 5-year **OS** (not relative): 35% (2005–10) to 41% (2011–15), in Ruotsalainen et al., Ann Hematol, [doi 10.1007/s00277-023-05571-1](https://doi.org/10.1007/s00277-023-05571-1). VERIFIED as quoted, not as a relative figure | Revised ISS (R-ISS), 5-year **OS**: stage I **82%**, II **62%**, III **40%** [unverified: snippet; R-ISS validation; source not opened]. Swedish Myeloma Registry median RS: 8.2, 5.6, 3.2 years [unverified] | Finland share at ISS III: **NOT FOUND** | Share with 3+ GP consultations: **50.6%** (crude). Adjusted OR vs rectal cancer: **3.42** [SNIPPET: Lyratzopoulos 2012] | 2025 NG12 update reportedly adds SPE and SFLC to first tests [unverified: snippet; NG12 page blocked] | ISS and R-ISS [ISS, JCO 2005, PubMed 15809451](https://pubmed.ncbi.nlm.nih.gov/15809451/); [R-ISS, JCO 2015, PubMed 26240224](https://pubmed.ncbi.nlm.nih.gov/26240224/) [SNIPPET] | **NOT FOUND.** The national strategy says Finland "has fallen behind other Nordic countries" in myeloma outcomes ([strategy p. 8](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=8)). HUS vs NORDCAN 70% vs 59% (female, 2019–23) [unverified: poster snippet] |
| **Non-Hodgkin lymphoma** | **NOT FOUND** for all NHL. Snippet 52.7% (1999–2003), period and subgroup unclear [unverified]. Johansson 2024 covers Finland 2002–21, but NHL not confirmed | Dutch DLBCL only (not all NHL): stage I 96–67%, stage II–IV 75–46% by age group [unverified: snippet]. All-NHL: NOT FOUND | NOT FOUND | Share with 3+ GP consultations: **NOT FOUND** (the table was not readable) | **NOT FOUND.** No NG12 lymphoma rule found in our search. Finnish handbook B symptoms (10% weight loss in 6 months, fever above 38 °C, night sweats) [SNIPPET] | Lugano 2014, with Ann Arbor for extent [Lugano, JCO 2014](https://imaging.cancer.gov/clinical_trials/docs/Lugano%20Recommendations%20for%20Lymphoma%20-%20JCO%202014.pdf) [SNIPPET] | **Kuitunen et al. 2026**, DLBCL, Finland, n=156. Median time from first contact to treatment: **127 days** (public primary care) vs **76 days** (private or occupational), Mann–Whitney **p = 0.027**. See section 3 |
| **Stomach** | **Hemminki et al. 2023**, age-standardised 5-year RS, 2010–19: men **24.6%** (CI 22.7–26.5); women **29.6%** (27.3–32.0). [Cancer Med, Table 2, PMC10225220](https://pmc.ncbi.nlm.nih.gov/articles/PMC10225220/). VERIFIED (re-checked 2026-11-14) | Finland stage-specific: **NOT FOUND**. Japan (resected, TNM): stage IA **91.8%**, stage IV **16.6%** [unverified: snippet, [PMC6737396](https://pmc.ncbi.nlm.nih.gov/articles/PMC6737396/)] | Finland: **NOT FOUND** as a share. FINEGO 41.1% "local" (n=7,798) is not a late share [unverified: [BMJ Open 2022](https://bmjopen.bmj.com/content/12/4/e056320.full.pdf)] | Share with 3+ GP consultations: **NOT FOUND**. Adjusted OR vs rectal: **1.96** [SNIPPET] | Dysphagia, or age 55+ with weight loss plus upper symptoms: urgent direct-access endoscopy [SNIPPET: NG12 rec 1.2.7, page blocked] | TNM 9th edition, 2026 [NHS staging sheet](https://nhsd-proxy.openprescribing.net/ndrs/data/cancer-data-training-materials/staging-sheets-v9/stomach) [SNIPPET]. Finnish registry uses local / locally advanced / advanced | **NOT FOUND** |
| **Oesophageal** | **Hemminki et al. 2023**, age-standardised 5-year RS, 2010–19: men **14.9%** (CI 13.0–16.9); women **17.7%** (14.0–21.7). [Table 3, PMC10225220](https://pmc.ncbi.nlm.nih.gov/articles/PMC10225220/). VERIFIED (re-checked 2026-11-14). Finnish registry, all stages: 17.3% [unverified: FINEGO, Söderström et al., BMJ Open 2020] | Finland: **NOT FOUND**. International review: about 39% localised, 5% distant [unverified: snippet, no URL] | FINEGO surgical cohort 1987–2016, n=2,045: advanced **18.7%**, locally advanced 18.7%, local 28.9%. Surgical cohort only, not a population share. VERIFIED. [PMC7559040](https://pmc.ncbi.nlm.nih.gov/articles/PMC7559040) | Share with 3+ GP consultations: **NOT FOUND**. Adjusted OR vs rectal: **NOT FOUND** (stomach 1.96 is listed above) | Dysphagia, or age 55+ with weight loss plus upper symptoms: urgent endoscopy [SNIPPET] | TNM 9th edition, 2026 [NHS staging sheet](https://nhsd-proxy.openprescribing.net/ndrs/data/cancer-data-training-materials/staging-sheets-v9/oesophagus-including-oesophagogastric-junction) [SNIPPET] | **NOT FOUND** |

### 2.1 Reading the table

- **Only one Finnish 5-year relative survival figure is verified for a candidate:** pancreas, 60–69 (9.1% men, 10.4% women), and stomach and oesophagus (all ages, 2010–19). **Ovarian and myeloma have none** (myeloma has only a quoted overall survival). Severity needs a cited figure, so this is a gap for either pick.
- **Pancreas and stomach show poor prognosis in Finland,** and neither has a clear GP-orderable test in the Rule (CT, endoscopy).
- **Ovarian has the largest early vs late gap in the snippet data**, but the early and late figures are from the US and Norway, not Finland.

### 2.2 Lyratzopoulos et al. 2012, the GP-consultation numbers

- Paper: Lyratzopoulos G, et al. "Variation in number of general practitioner consultations before hospital referral for cancer: findings from the 2010 National Cancer Patient Experience Survey in England." *Lancet Oncol* 2012;13(4):353–65. DOI [10.1016/S1470-2045(12)70041-4](https://doi.org/10.1016/S1470-2045(12)70041-4). PMID [22365494](https://pubmed.ncbi.nlm.nih.gov/22365494/). **VERIFIED** (bibliographic). Abstract only partly read.
- Study: England, 41,299 patients, 24 cancers, 2010 survey. **Note that the paper reports the share with 3 or more GP consultations, not an average number of consultations.** Your brief said "average", so the table uses the share.
- Crude share with 3+ consultations: pancreas **41.3%**, myeloma **50.6%**, breast 7.4%, melanoma 10.1% [unverified: search summary].
- Adjusted OR vs rectal cancer: myeloma **3.42**, pancreas **2.35**, stomach **1.96**, lung **1.68** [unverified: search summary].
- Ovarian, NHL and oesophageal values: **NOT FOUND** (the full table was not reachable).
- Finnish data on GP consultations before referral: Turku lung cohort, 2001, n=132, median GP delay 16 days [unverified: snippet, source not identified]. Hermiö et al. 2023, colorectal, visit counts: NOT FOUND in the readable text ([BMC Health Serv Res, doi 10.1186/s12913-023-09298-7](https://doi.org/10.1186/s12913-023-09298-7)). **No Finnish GP-consultation count for ovarian, pancreatic, myeloma or lymphoma was found.**

### 2.3 NICE NG12 and the test

- NG12 pages returned HTTP 403 in every attempt. Every NG12 cell is therefore **[unverified]** from search snippets or secondary sites. Check the NG12 pages directly (for example the PDF, or a site that does not block).
- The "3% PPV" threshold wording: NOT FOUND in the NICE text we could read.
- Finland: no national red-flag list like NG12 was found ([our primary-care note](../research/context/08-primary-care-fast-lanes.md)). **VERIFIED** as a negative search result.

---

## 3. Finnish route and delay data (lymphoma)

### 3.1 Correction to the deck figure

- **The deck's 207 vs 123 days is not in the paper.** The Kuitunen 2026 paper (DLBCL, n=156) reports:
  - Median symptoms-to-treatment: **102 days** overall (mean 148, range 13–1,124).
  - Median from first contact to treatment, public primary care: **127 days** (mean 201).
  - Median from first contact to treatment, private or occupational care: **76 days** (mean 126).
  - Mann–Whitney **p = 0.027**.
  - Kruskal–Wallis p-values: age 0.019; marital status 0.016 in one summary and 0.023 in the Utupub abstract. Check the PDF.
- **Use 127 vs 76 days, median, p = 0.027.** Source: [doi 10.1002/cam4.71920](https://doi.org/10.1002/cam4.71920), PMID 42108510, PMCID PMC13158131. Bibliographic data VERIFIED (Europe PMC and Utupub). The 127/76 figures came from an automated summary of the PMC full text, not from the raw text. **Spot-check the PDF before a slide uses them.**
- Author name: Europe PMC lists **Kuitunen**. The Yle article spells it "Kuittinen". Use the Europe PMC spelling in citations.

### 3.2 Related Finnish DLBCL paper (Tokola et al. 2025), same cohort

- "Prolonged time from symptoms to diagnosis is associated with an inferior progression-free survival in diffuse large B-cell lymphoma." *Cancer Med* 2025;14(22):e71409, doi [10.1002/cam4.71409](https://doi.org/10.1002/cam4.71409). [Utupub](https://www.utupub.fi/items/72a0d00d-0ed6-440e-88ac-fc3a9799e842/full). **VERIFIED.**
- Mean times: symptoms to treatment **146 days**; patient delay to first contact **54 days**; symptoms to biopsy **130 days**; biopsy to treatment **19 days**.
- No public vs private comparison in this paper.
- Our earlier note said this paper was "not found". It exists.

### 3.3 Lung pathway, for reference

- Finnish lung pathway: 155 days from symptoms to treatment, 41 in primary care (unpublished study, reported by Yle MOT, `https://yle.fi/a/74-20251023`). **VERIFIED as a news report; study not published.**

---

## 4. Recommendation

Three-line version for Michal:

1. **Ovarian is the best fit** for a GP Repeat-visit flag, Rules and a live demo. Vague abdominal symptoms with repeat visits match the flag, NG12 names a blood test a GP can order (CA-125), and the early-to-late survival gap is the largest in the snippet data.
2. **Blocker before the slides:** a Finnish 5-year survival figure for ovarian. Without it, the Severity panel can only show a US or Norwegian figure, and that must be labelled as such. Check the NORDCAN Finland ovarian factsheet first.
3. **Fallback: myeloma**, if the CA-125 rule does not verify. Finland lags the Nordic countries on myeloma (national strategy, p. 8), and FBC and SFLC are blood tests a GP can order. Avoid pancreas and stomach for the demo: their Rules need CT or endoscopy, which a Finnish GP cannot order on their own (CT verified; endoscopy [unverified]).

Why not lymphoma: it has the best Finnish route data (Kuitunen 2026, Tokola 2025), but no NG12 rule was found, so the Rule and the test would be invented.

---

## 5. Gaps and checks before use

1. **Ovarian and myeloma Finnish 5-year RS:** NORDCAN Finland factsheets and the Cancer Registry (syoparekisteri.fi, returned 403 in our tests). Highest priority.
2. **NG12 primary-care rules** for all six candidates: the NICE pages returned 403. Read the PDF or a non-blocked copy.
3. **Lyratzopoulos 2012 full table:** needed for ovarian, NHL and oesophageal shares.
4. **Kuitunen 2026 figures:** the 127/76-day numbers come from an automated summary. Check the PDF.
5. **Seikkula 2018 vs 2017:** check the Int J Cancer paper (doi 10.1002/ijc.31109) for the year and the numbers. The Acta Oncologica 2017 paper is verified.
6. **Johansson 2024 (pancreas):** the sweep read the full text and my spot-check matched. Still fine to cite.
7. **US figures** (SEER, ovarian stage I vs IV): label them as US in any slide.

## 6. Corrections to earlier notes in `docs/research`

- Lymphoma: the 207 vs 123 day figure is not in the paper. The correct figures are 127 vs 76 days (median, p = 0.027), from the summary of the full text (see section 3.1).
- Tokola 2025 is found (section 3.2). The earlier note said "not found".
- Seikkula is 2018 for the Int J Cancer paper (SES, doi 10.1002/ijc.31109). The earlier note said 2017. The Acta Oncologica 2017 stage-specific paper is a separate paper.
- The strategy footnote gives pancreas as "+6 points vs the Nordic level". It does not give the measure, so use it only with a caveat.
- Stomach and oesophageal: the TNM 9th edition is in force in 2026 (UICC snippet). Earlier notes assumed the 8th edition. Check the NHS staging sheet before a slide uses either edition.
