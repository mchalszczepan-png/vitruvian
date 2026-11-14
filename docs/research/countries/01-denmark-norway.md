# Denmark and Norway: cancer pathway monitoring, stage data, outcomes, GP side

Scope: deeper look at Denmark (DK) and Norway (NO). Problems: (1) total cancer wait not measured, (3) no fast lane from public GP, (4) stage missing in ~58% of Finnish registry cases. Lens: two-speed entry.

Tags: **READ** = I read the page or abstract text. **SNIPPET** = only a search summary. **UNVERIFIED** = memory or secondary source. **META** = DOI checked, title and authors only, result not read. Every factual claim has a link next to it, or a `[source needed]` tag.

Acronyms: CPP = Cancer Patient Pathway (DK and NO name for the fast-track cancer route). NSSC = non-specific symptoms and signs of cancer. TNM = tumour, node, metastasis stage. DLCR = Danish Lung Cancer Registry. LPR = Danish National Patient Registry (Landpatientregisteret). CT = computed tomography scan. GP = family doctor. DOI = digital object identifier.

## Summary table

Sources for each row are in the section it names: row 1 in [section 1](#1-denmark-public-monitoring-of-pathway-times); rows 2 and 3 in [section 2](#2-denmark-cpp-effect-on-waits-and-survival); row 4 in [section 5](#5-norway-cpp-design-target-and-pathway-compliance); row 5 and row 6 in [section 3](#3-registry-stage-completeness-denmark-norway-nordic); row 7 in [section 6](#6-gp-side-direct-access-to-ct-and-referral-routes); row 8 in [section 4](#4-equity-education-income-stage-and-pathway-entry).

| Initiative | Country | Problem | Did it | Evidence it worked | What made it work | Confidence |
|---|---|---|---|---|---|---|
| Quarterly CPP timing monitor by region | DK | 1 | Yes, since 2012 | Monitoring exists (READ). Shows waits, not outcomes. | Law/ministry mandate, coded monitoring points, mandatory regional reporting | High (did it) |
| CPP cut diagnostic interval | DK | 1, 3 | Yes | Waits fell. Primary: Jensen 2015 (READ, abstract): 17 days shorter after CPP. Secondary: about 17 days (SNIPPET). | National plan, standard times per cancer | High (did it), Medium (effect size) |
| CPP and survival | DK | outcome | Yes | Observational. Survival up after CPP, but CPP vs non-CPP not significant overall (READ) | Standard pathways + coordinator | Medium. Lead-time bias noted by authors |
| Norway CPP target 70% | NO | 1, 3 | Yes, from 2015 | 70% target met within 1 year (READ, Nilssen 2020). Nationally met only in 2020 and 2021 per Helsedirektoratet (READ). Timing compliance uneven (READ) | National target, pathway coordinator, registry linkage | High (did it), Medium (outcomes) |
| Danish Lung Cancer Registry (DLCR) validity | DK | 4 | Yes | Stage agrees with charts 90.1% (READ). "96% completeness" NOT confirmed | Clinical registry, electronic notification | Medium-high |
| Nordic TNM availability | DK, NO, SE | 4 | Measured | DK 75–95% for most sites, falling in DK (READ) | Registry notification, algorithm for missing stage | Medium (table mapping unclear) |
| Direct CT access for GPs (RCT) | DK | 3 | Tested | No effect on stage. Small time gain. Training mattered (READ) | Needs GP training, not just access | High (trial) |
| Equity: education, income, stage | DK, NO | lens | Studied | Lower education, living alone: later stage (DK, READ). Low income: less CPP inclusion (NO, SNIPPET) | Data linkage | Medium |

---

## 1. Denmark: public monitoring of pathway times

**What it is.** Since 2012 the Danish ministry set a national model. Regions must report pathway times with mandatory coded monitoring points. Numbers are published quarterly, per region and nationally. **READ** (Sundhedsstyrelsen page, Danish): https://www.sst.dk/vidensbase/sygdomme-og-behandling/kraeftsygdom/pakkeforloeb-for-kraeft/standardforloebstider-og-monitorering-af-pakkeforloeb-for-kraeft

Three windows: referral → first visit; first visit → treatment decision; work-up done → treatment start. **READ** (same page).

**Latest report seen.** Sundhedsdatastyrelsen quarterly report, Q4 2025, published 13 March 2026. **READ** (highlights from PDF): https://cdn1.gopublic.dk/sundhedsdatastyrelsen/Media/639089831953237646/monitorering_kraeft_q4_2025.pdf
- Source: LPR (National Patient Registry), data as of 10 Feb 2026.
- Standard times are set per organ and treatment type. Examples: surgery 28 days, medical 32, radiotherapy 32, particle therapy 39. Other pathway groups have longer standards (e.g. 43/44/48). (Same PDF.)
- Outcome per pathway = share finished within the standard time (indicator OF4). Also share where suspicion was ruled out in the diagnostic period (OA1). (Same PDF.)
- Regional tables. Figures marked "preliminary".

**Did it / proven?** Did it: yes, operating and public (READ). Proven to shorten waits: see CPP section below.

**Timestamps.** The page says "codes for registering monitoring points" (READ). Specific code names such as "AFB..." are **UNVERIFIED**. I did not see them in any page I read.

---

## 2. Denmark: CPP effect on waits and survival

### 2a. Waiting times
- Jensen H, Tørring ML, Olesen F, Overgaard J, Fenger-Grøn M, Vedsted P. BMC Cancer 2015. **READ** (PubMed abstract): median diagnostic interval 14 days shorter during and 17 days shorter after CPP implementation than before. https://doi.org/10.1186/s12885-015-1317-7 (PubMed 25900050). (Corrected: the earlier note gave 49 → 32 days. The abstract I read does not show those figures; the 17-day difference is the one that matches.)
- Secondary press (CRUK 2025) says CCP/CPP: about 8 in 10 patients included, about 8 in 10 seen in target time, wait about 17 days shorter on average. **SNIPPET** (https://news.cancerresearchuk.org/2025/09/19/improving-cancer-survival-lessons-from-denmark-national-cancer-plan/). Primary source not checked. Treat as **UNVERIFIED**.

### 2b. Survival after CPP (observational)
**READ.** Jensen H, Tørring ML, Vedsted P. "Prognostic consequences of implementing cancer patient pathways in Denmark: a comparative cohort study of symptomatic cancer patients in primary care." BMC Cancer 2017. DOI 10.1186/s12885-017-3623-8 (verified, OpenAlex): https://doi.org/10.1186/s12885-017-3623-8
- 7,725 cases: 1,202 before, 4,187 during, 2,336 after CPP.
- All cancers, 3-year relative survival rose from 45% to 54%.
- Lung cancer and gynaecological cancers: statistically significant gains.
- Excess mortality ratio 3-year: 1.35 (before vs after).
- CPP-referred vs non-CPP-referred: no significant survival difference. Excess mortality trend lower for CPP (1-year ratio 0.86, CI 0.73–1.01, not significant).
- Authors discuss lead-time bias. They cite another study: lead time explains less than 15% of the 1-year survival gain.

**Did it vs proven:** Survival improved after CPP, but this is a before/after cohort, not randomised. Effect is real in direction; size is uncertain.

### 2c. Stage shift and survival trend (secondary)
- Nordic registry paper (below) says Danish national cancer plans and accelerated pathways "are considered to have substantially contributed" to better stage distribution and survival. **READ** (PMC11332511, discussion): https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511/
- Denmark lung cancer 2008–2022: survival up at all stages; stage IV gains most in 2018–2022. Stage IA rise attributed to CT use. **SNIPPET** (https://pmc.ncbi.nlm.nih.gov/articles/PMC11332512/).
- A Danish Acta Oncologica paper says "the previous survival disadvantage in Denmark is no longer present for most sites." **SNIPPET** (tandfonline 10.1080/0284186X.2020.1822544, not read in full): https://doi.org/10.1080/0284186X.2020.1822544

---

## 3. Registry stage completeness (Denmark, Norway, Nordic)

### 3a. Danish Lung Cancer Registry validity
**READ.** Gouliaev A, Ali F, Jakobsen E, Dalton SO, et al. "The Danish lung cancer registry: a nationwide validation study." Lung Cancer 2024. DOI 10.1016/j.lungcan.2024.107527 (verified): https://doi.org/10.1016/j.lungcan.2024.107527
- Random sample of 1,000 NSCLC patients, diagnosed 2014–2016. Compared with medical charts.
- Stage agreement: 90.1% (95% CI 88.0–91.9).
- Diagnosis date agreement: 93.8%.
- Treatment-intent PPV: 87.4%.
- Authors conclude the data are "complete, detailed and accurate."

**Important:** this is **validity** (accuracy of recorded stage), not the **completeness** (share with any stage recorded) the brief mentions. The "~96% completeness" figure from the brief is **UNVERIFIED**. The Nordic table below may be the source; see 3b.

### 3b. Nordic TNM availability (2004–2016)
**READ.** "TNM stage in the Nordic Cancer Registries 2004–2016: Registration and availability." PMC11332511 https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511/
- Available TNM stage: 75–95% for most cancers in DK, Sweden, Iceland. Norway generally lower.
- **Denmark's availability fell over time.** More than 10 percentage points drop from 2009–13 to 2014–16 for several cancers.
- Sweden rose over time.
- Lung row in the table reads 94 / 97 / 96 / 63 / 72 / 78 / 92 / 96 / 96. The column mapping is **unclear** in the rendered page. I cannot safely say which value is Denmark. Do not quote "lung 96%" for Denmark without re-checking the table.
- Method caveat: missing stage is counted with an algorithm "N0M0 for NXMX" (missing coded as no spread). This inflates some stage shares. Important for our problem 4.
- About half of lung cases are stage IV at diagnosis in all Nordic countries (READ, same paper).

### 3c. Norway
- Norway's TNM availability is lower than Denmark's in the same paper (READ, PMC11332511).
- Norwegian studies: shorter wait and better stage distribution 2007–2016. Cited, not read. **READ-as-cited** (PMC11332511, discussion): https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511/

### 3d. How stage is captured (general)
- Denmark: electronic notification from hospitals and primary care since 2004, with TNM recorded. **SNIPPET** (Clinical Epidemiology 2012 supplement, https://www.tandfonline.com/doi/pdf/10.2147/CLEP.S33873; DOI verified, Olsen/Søgaard).
- Norway: the Cancer Registry of Norway is linked three times a year with the Norwegian Patient Registry (NPR) to ensure completeness. **READ** (Nilssen 2022, Methods, "Cancer registry of Norway"): https://doi.org/10.1186/s12885-022-09306-9
- Denmark TNM completeness, lung 2004–2009: overall 77.5% (SCLC) and 77.9% (NSCLC). Lower in age over 80 and high comorbidity. Clinical Epidemiology, DOI 10.2147/CLEP.S33315: https://doi.org/10.2147/CLEP.S33315. **SNIPPET** (abstract in search result). Old data; shows the same age and comorbidity gap as Finland may have.
- Prostate example: 75% stage recorded at age 0–39 vs 11% at 80+. **READ** (editorial "Quality of cancer registry data: completeness of TNM staging and potential implications", PMC3266864): https://pmc.ncbi.nlm.nih.gov/articles/PMC3266864/. (Corrected: the editorial text I read does not name Denmark or the 2004–2009 years; the earlier note said so and is not confirmed.)

---

## 4. Equity: education, income, stage and pathway entry

### 4a. Denmark, lung cancer 2001–2008
**READ.** Dalton SO et al. "Socioeconomic position, stage of lung cancer and time between referral and diagnosis in Denmark, 2001–2008." Br J Cancer 2011. DOI 10.1038/bjc.2011.342 (verified, OpenAlex): https://doi.org/10.1038/bjc.2011.342. 18,103 patients from the Danish Lung Cancer Register.
- Higher education: lower odds of advanced stage (OR 0.92, 95% CI 0.84–0.99).
- Living alone: higher odds of advanced stage (OR 1.06, CI 1.01–1.13).
- Higher education: lower odds of waiting more than 28 days from referral to diagnosis (OR 0.82 for early and for advanced stage).
- High income: lower odds of long wait in early-stage patients.
- Authors: "vulnerable patients presenting with lung cancer symptoms require special attention."
- Limit: data pre-date most of the CPP rollout.

### 4b. Denmark, survival inequality
- Dalton SO et al. "Socioeconomic inequality in cancer survival – changes over time. Denmark 1987–2013." Acta Oncol 2019. DOI 10.1080/0284186x.2019.1566772 (verified): https://doi.org/10.1080/0284186x.2019.1566772. **META**. Result direction not read.

### 4c. Norway, CPP inclusion
**READ.** Olsen F et al. "Equitable access to cancer patient pathways in Norway – a national registry-based study." BMC Health Serv Res 2021. DOI 10.1186/s12913-021-07250-1 (verified): https://doi.org/10.1186/s12913-021-07250-1
- Age and place of residence explained most of the variation.
- For CPP patients, income and education effects were inconsistent.
- For all cancer patients, odds of CPP inclusion rose with income.
- Lung CPP: education gradient found (direction described as higher education, higher odds of not receiving a diagnosis via CPP). Read carefully; the abstract is ambiguous.

**SNIPPET.** Nilssen Y et al. 2020 (BMC Cancer, DOI 10.1186/s12885-020-06979-y, verified in OpenAlex): https://doi.org/10.1186/s12885-020-06979-y. Prostate cancer, older age, high comorbidity or low income were associated with not being in a CPP. Target 70% met within 1 year. (The 2020 paper's full text was read as PMC7260744; see section 5a.)

---

## 5. Norway: CPP design, target and pathway compliance

### 5a. Did it, and the target
- Norway introduced CPP in 2015. **READ** (PMC8883731, intro and methods): https://pmc.ncbi.nlm.nih.gov/articles/PMC8883731/. Directorate of Health target: at least 70% of new cancer patients in a CPP, and at least 70% of those treated within the set timeframes.
- Target "met within 1 year of CPP implementation" (Nilssen 2020). **READ** (PMC7260744): https://pmc.ncbi.nlm.nih.gov/articles/PMC7260744/
- Patients included in a CPP are assigned a cancer pathway coordinator as main contact. **READ** (PMC7260744). (Corrected: the paper applies this to patients in a CPP, not to every cancer patient.)

### 5b. Indicators and publication (Helsedirektoratet)
Helsedirektoratet indicator page, "Pakkeforløp for 24 organspesifikke kreftformer" (URL slug says 26; page title says 24; see note): https://www.helsedirektoratet.no/statistikk/kvalitetsindikatorer/kreft-behandling-og-overlevelse/pakkeforl%C3%B8p-for-26-organspesifikke-kreftformer. **READ** (highlights, page modified 2026-09-24):
- Indicator: share of pathways within the standard time for 24 organ-specific cancers, regardless of treatment type. Also shares by surgery, drug and radiotherapy start.
- Target: 70% of pathways within the recommended time. Nationally met only in 2020 and 2021. No regional health trust met it in 2023–2025.
- Publication is paused: data reported to NPR had an error, and national figures will not be published until it is corrected.

Other indicators, **SNIPPET** (helsedirektoratet.no search results):
- Indicator "nye kreftpasienter i pakkeforløp" (https://www.helsedirektoratet.no/statistikk/kvalitetsindikatorer/kreft-behandling-og-overlevelse/nye-kreftpasienter-i-pakkeforlop-for-24-kreftformer): share of new cancer patients included in a pathway.
- Publication: new figures four times a year per calendar; most indicators updated once a year. **[source needed]** for the schedule; the 24-organ page above does not show it.
- Caveat on page: patient is credited to the hospital that started the pathway, even if treatment happens elsewhere. **[source needed]** on the page read.
- Note: page titles say 22, 24 and 26 cancer types. Count is inconsistent across pages. Not resolved. The "nye kreftpasienter" page title says 22 types with a URL that says 24.
- "Forløpskoder" (pathway codes): **UNVERIFIED** (term not confirmed in any page I read).

### 5c. Compliance and delays (2015–2016 cohort)
**READ.** Nilssen Y et al. "Compliance with recommended cancer patient pathway timeframes and choice of treatment differed by cancer type and place of residence..." BMC Cancer 2022. DOI 10.1186/s12885-022-09306-9 (verified): https://doi.org/10.1186/s12885-022-09306-9. 20,668 patients (colorectal, lung, breast, prostate).
- Within time: colon surgery 84%; breast surgery 76%; lung systemic treatment 76%; prostate surgery 43%.
- Main delay for all cancers: decision → treatment start.
- Travelling outside home trust lengthened waits; lower odds of surgery (lung) and radiotherapy (rectal).
- Colon: trust-to-trust gap about 25 days after case-mix adjustment.

**Did it vs proven:** Norway did it and publishes timing. Outcome proof (survival) not found in what I read. The "improved stage distribution" claim is cited second-hand (PMC11332511). **UNVERIFIED** for primary data.

---

## 6. GP side: direct access to CT and referral routes

### 6a. Danish direct-access CT trial (RCT)
**READ.** Guldbrandt LM et al. "The effect of direct access to CT scan in early lung cancer detection: an unblinded, cluster-randomised trial." BMC Cancer 2015. DOI 10.1186/s12885-015-1941-2 (verified, OpenAlex): https://doi.org/10.1186/s12885-015-1941-2
- Intervention: GPs could order CT directly.
- Result: no significant change in stage at diagnosis; limited change in time to diagnosis.
- Median primary-care interval 16 days; median diagnostic interval 39 days.
- Control GPs 44 days vs intervention GPs 36 days (not significant, p = 0.299).
- Within intervention GPs: those who attended the training (CME) had much shorter intervals (primary care 9 vs 37 days; diagnostic 23 vs 66 days).
- Lesson: **access alone did not do it; uptake and training did.**

### 6b. NSSC pathway (danish "three-legged" concept)
- Ingeman MLS et al. "The Danish cancer pathway for patients with serious non-specific symptoms and signs of cancer." BMC Cancer 2015. DOI 10.1186/s12885-015-1424-5 (verified): https://doi.org/10.1186/s12885-015-1424-5. **META**. Result not read.
- Damhus CS et al. "Non-specific symptoms and signs of cancer: different organisations of a cancer patient pathway in Denmark." Scand J Prim Health Care 2021. DOI 10.1080/02813432.2021.1880094 (verified): https://doi.org/10.1080/02813432.2021.1880094. **META**. Shows that organisation varies by region.
- Jarbøl D et al. Acta Oncologica 2026 (lung diagnostic pathways, GP events, first referral, stage). DOI 10.2340/1651-226x.2026.45851: https://doi.org/10.2340/1651-226x.2026.45851. **META**. Snippet says the GP imaging type (chest X-ray vs CT) is not recorded in registry. That is a data gap.
- Hyldgaard C et al. BMC Cancer 2022 (CT use increases stage IA detection). DOI 10.1186/s12885-022-09585-2: https://doi.org/10.1186/s12885-022-09585-2. **META**.
- The "tre-benet" (three-legged) model in detail was **not searched** (budget limit). Not verified.

---

## Transferable to Finland

- **Publish the clock by region and by cancer type.** Denmark does this quarterly with fixed standard times per organ (READ, [section 1](#1-denmark-public-monitoring-of-pathway-times) and the Q4 2025 PDF). Norway uses a 70% target (READ, [section 5a](#5a-did-it-and-the-target)). Norway's own national result has been missed since 2022 (READ, [section 5b](#5b-indicators-and-publication-helsedirektoratet)). Finland's gap (problem 1) can be closed with the same public tables.
- **Use coded monitoring points in the patient register.** Denmark's national model since 2012 requires coded monitoring points and mandatory regional reporting (READ, https://www.sst.dk/vidensbase/sygdomme-og-behandling/kraeftsygdom/pakkeforloeb-for-kraeft/standardforloebstider-og-monitorering-af-pakkeforloeb-for-kraeft). Find out what the Finnish equivalent is before proposing.
- **Measure the decision-to-treatment gap separately.** Norway found this is the main delay (READ, Nilssen 2022: https://doi.org/10.1186/s12885-022-09306-9). Finland should see if its data show the same.
- **Report pathway entry by income, education and residence.** Norway found low income and comorbidity reduced inclusion (SNIPPET, Nilssen 2020: https://doi.org/10.1186/s12885-020-06979-y). Denmark found low education and living alone raised late-stage risk (READ, Dalton 2011: https://doi.org/10.1038/bjc.2011.342). This answers the two-speed-entry lens directly.
- **Fund GP training with any direct-access tool.** The Danish CT trial showed no effect unless GPs took part in training (READ, Guldbrandt 2015: https://doi.org/10.1186/s12885-015-1941-2).
- **Add a stage-completeness KPI and treat it as a trend.** Denmark's TNM availability fell in parts of the period (READ, PMC11332511: https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511/). Also note that missing stage coded as N0M0 inflates some shares (READ, same paper). Stage completeness must be reported as its own number.

## Could not verify

- **DLCR "~96% completeness"** (from brief). Not found. Only 90.1% stage agreement (validity) is verified. Nordic table lung value (94–97) unclear by country.
- **Danish registration codes "AFB..."**: not found in any page read. UNVERIFIED.
- **Norway "forløpskoder"**: not found. UNVERIFIED.
- **Helsedirektoratet indicator count** (22 vs 24 vs 26 cancer types): inconsistent across pages. Not resolved.
- **CRUK numbers** (8 in 10 in CPP, 8 in 10 in target, −17 days, 3-year survival +10 points, lung survival "almost doubled"): secondary press, not checked against primary.
- **Norwegian survival gains from pathways**: no primary outcome paper found in this pass.
- **Dalton 2019 survival inequality direction**: metadata only.
- **Jarbøl 2026, Ingeman 2015, Damhus 2021, Hyldgaard 2022, Gouliaev 2023 (Nordic lung registry comparison)**: metadata only. Results not read.
- **Danish "tre-benet" (three-legged) GP model and NSSC pathway results**: not read.
- **Norway GP access and direct-access rules**: not searched.
- **Norway pathway publication schedule and the "patient credited to starting hospital" caveat**: [source needed].
- **Failures**: web search hit the 10 requests/minute limit several times. Two scrapes timed out (Gouliaev full text via lungcancerjournal; Gouliaev via doi.org). The Gouliaev abstract was read from ScienceDirect instead. Springer and PMC pages block plain curl and some WebFetch calls; Springer full text was read through the Context scraper.
