# 12 - GP cancer-risk tool: research

Researched: 2026-11-14. Research only. No code.

Tags:
- READ = I opened the page or PDF and read the text.
- SNIPPET = only the search summary. Check before quoting.
- REF-CHECK = citation checked against OpenAlex (title, authors, year, DOI). Content not read.
- UNVERIFIED = from memory or not checked.
- NOT FOUND = I searched and found nothing. Not proof that nothing exists.
- [source needed] = no working URL found yet. The claim stays.

Terms:
- CDS = clinical decision support (prompts inside the GP record).
- eRAT = electronic risk assessment tool (ERICA's version of a RAT).
- RAT = risk assessment tool (paper-era or early electronic cancer tool).
- PPV = positive predictive value: share of flagged people who really have the cancer.
- SMART on FHIR = standard way for third-party apps to plug into an EHR.
- FIT = faecal immunochemical test (blood in stool).
- 2WW = two-week-wait urgent referral (UK term).

## Short answer

- No Finnish GP cancer-risk prompt was found in use. The main national CDS (Duodecim EBMEDS) shows no cancer red-flag rule on its public pages.
- The best outcome trial (ERICA, England) has no published result that I could find.
- Finland has no published time-to-diagnosis or stage data by GP route, so a Finnish claim of "faster" cannot be tested yet.

## 1. What already exists in Finland

### 1a. Duodecim EBMEDS (decision support in EHRs)
- READ: Apotti (Epic) chose EBMEDS. It gives "reminders and warnings" and "context sensitive guidance at the point of care". Cancer or red-flag rules are not mentioned. Source: https://www.duodecim.fi/english/?p=956 (2017 announcement).
- READ: Duodecim product page says the service "automatically analyzes patient data and provides professionals with patient-specific instructions". No cancer rule named. Source: https://www.duodecim.fi/ebmeds/en/frontpage/
- SNIPPET: EBMEDS is a Class IIa medical device under EU MDR 2017/745 (from the search summary of the user manual). [source needed: manual not linked]
- UNVERIFIED: whether a public health centre has switched on any cancer-specific rule locally.
- The citizen "Symptom Checker" triages urgency (READ, same page). It is not clinician red-flag logic.

### 1b. Käypä hoito (Current Care) and referral criteria
- SNIPPET (search summary): lung. Chest X-ray shadow, maybe with enlarged hilar or mediastinal nodes, plus symptoms, means urgent referral to the lung clinic. [source needed]
- SNIPPET: prostate. Raised PSA with normal rectal exam: recheck after 1–2 months before more tests. A normal PSA does not rule out cancer. [source needed]
- SNIPPET: asymptomatic men over 70 are not advised to have PSA. [source needed]
- NOT FOUND: colorectal suspected-cancer referral criteria in Käypä hoito.
- NOT FOUND: ovarian or CA-125 criteria in Käypä hoito.
- My two guessed kaypahoito.fi URLs opened the wrong pages (one was a stroke guideline, READ). The PDFs returned by search failed to decode (not readable). So the exact wording is still not read.

### 1c. EHRs used by public health centres
| EHR | What I found | Tag |
|---|---|---|
| Apotti (Epic, Helsinki region, HUS + 4 municipalities) | EBMEDS is built in (see 1a). SMART App Launch is named as the main route for third-party apps. | READ |
| Omni360 (CGI) | Vendor pages list decision support and AI. Plugin route for terveyskeskus not found. [source needed] | SNIPPET |
| Lifecare (Tietoevry) | Vendor page: guideline-based notifications, drug interaction alerts. [source needed] | SNIPPET |
| Effica | No result at all. | NOT FOUND |
| Esko APTJ, Health Village | Both support SMART App Launch (per Finnish SMART guide). | READ |

- READ: Finnish SMART guide: apps can run standalone or inside the EHR view. Lifecare is linked through an InterSystems adapter. Source: https://fhir.fi/finnish-smart
- Our reading: a CDS plugin is technically possible. Whether a GP would get the screen or the rules is UNVERIFIED.

### 1d. Finnish pilots of AI or cancer-risk prompts in primary care
- SNIPPET: Oulu (2021 data). A deep learning tool read all primary-care chest X-rays. It found more lung-suspect findings than radiologists, but its specificity was low. Lääkärilehti 2026 summary: https://www.laakarilehti.fi/tieteessa/raportti/tekoalyn-hyoty-perusterveydenhuollon-keuhkokuvien-arvioinnissa-jai-vahaiseksi/en
- SNIPPET: Aiforia (pathology AI) is used at Fimlab labs. It is lab work, not primary care. [source needed]
- NOT FOUND: Kaiku Health in cancer risk. HUS, Pirkanmaa, Sitra or Business Finland cancer-prompt pilots. (English search only; a Finnish search was not run.)

## 2. Outcome evidence for GP cancer-risk tools

### 2a. ERICA (England, cluster RCT)
- READ (protocol, PMC10030284, https://pmc.ncbi.nlm.nih.gov/articles/PMC10030284/): 530 practices overall; 239 practices per arm (478 in total); 5,497 patients in the sample-size calculation. Corrected: the earlier note said "239 per arm, plus 10% attrition allowance", which mixed practices and patients.
- READ: primary outcome is stage at diagnosis, early (1–2) vs advanced (3–4), from National Cancer Registry data.
- READ: six cancers: lung, colorectal, oesophago-gastric, ovarian, kidney, bladder.
- READ: prompt pops up when risk is 2% or more for any of the six. GP can also use a symptom checker.
- READ: sample size assumes an odds ratio of 0.8 for advanced stage (4.8 percentage points). Needs 5,497 patients. Expects 12,190 cancer diagnoses in total.
- SNIPPET: ISRCTN22560297 says the trial is completed and not recruiting (last edited Feb 2025). [source needed: ISRCTN page not opened]
- NOT FOUND: any published stage-at-diagnosis result (extended search). The 2025/2026 BMJ result you asked about was not found.
- SNIPPET: nested GP interview study says eRATs interrupt consultations and that only intervention practices were sampled. [source needed]
- REF-CHECK: protocol DOI 10.1136/bmjopen-2023-065232 is correct (2023). An earlier OpenAlex note said 2022; the protocol page confirms 2023.

### 2b. QCancer (UK, GP software)
- SNIPPET (CRUK-led 2013 pilot evaluation): could not show effects on number of cancers or stage. Found no strong evidence of more 2WW referrals. Participation was voluntary. [source needed]
- READ (BJGP 2019 postal survey, [doi 10.3389/...](https://doi.org/10.3399/bjgp19X703745), [PMC6592323](https://pmc.ncbi.nlm.nih.gov/articles/PMC6592323/)): 975 practices sampled; 227 replied (23.3%). 476 GPs in those 227 practices. 172 English practices analysed. Corrected: earlier text said "68 with a tool". The count of 68 is not verified in this pass.
  - Adjusted difference in 2WW referrals: 3.1 per 100,000 (95% CI −5.5 to 11.7). No difference found. The p-value (0.478) is not verified in this pass.
  - Response was low (10.3% of GPs). Authors call the tools "an underused resource" and ask for a trial.
- REF-CHECK: QCancer 2015 BMJ Open (Hippisley-Cox & Coupland, [DOI 10.1136/bmjopen-2015-007825](https://doi.org/10.1136/bmjopen-2015-007825)) is correct. Title: "Development and validation of risk prediction algorithms to estimate future risk of common cancers in men and women: prospective cohort study". Coefficients not read.

### 2c. Hamilton RATs (UK, paper and early electronic tools)
- REF-CHECK: "Evaluation of risk assessment tools for suspected cancer in general practice: a cohort study", Hamilton W et al., BJGP, [DOI 10.3399/bjgp13x660751](https://doi.org/10.3399/bjgp13x660751). Year 2013 verified (63(606):30–36). The earlier OpenAlex 2012 note is not used.
- SNIPPET: 614 GPs in 165 practices. More diagnostic activity and extra cancer diagnoses. Time to diagnosis not measured. [source needed: 614/165 not confirmed]
- SNIPPET (Hamilton 2013 abstract, suspected colorectal cancer): RAT pilot showed 304 more 2WW referrals, 270 more colonoscopies, and 10 more colorectal cancers. Corrected: earlier text attributed these to a Macmillan CDS summary; the figures come from the Hamilton 2013 abstract. These are RAT numbers, not QCancer, and stage was not shown.

### 2d. Nordic evidence (blood tests and symptom PPVs)
- REF-CHECK: CCLM 2021, Sørensen PD et al., [DOI 10.1515/cclm-2021-1015](https://doi.org/10.1515/cclm-2021-1015). Title: "Using artificial intelligence in a primary care setting to identify patients at risk for cancer: a risk prediction model based on routine laboratory tests". Denmark.
- SNIPPET: the model gives a 90-day cancer risk from routine blood tests. It was as good as logistic regression. The authors say it needs validation in other populations.
- SNIPPET: Silkeborg (Denmark, 2017): 12.2% of 1,499 GP-referred patients had cancer. Abnormal bloods raised risk, but none was cancer-specific. [source needed]
- SNIPPET: Sweden FIT cohort (15,789 patients): FIT PPV about 4.7–8.1% for colorectal cancer. [source needed]
- SNIPPET: 493-GP cohort (Norway, Denmark, Sweden, Scotland, Belgium, Netherlands): PPV above 3% for macroscopic haematuria, rectal bleeding, involuntary weight loss. Author label "Ca-PRI" and author list not confirmed. [source needed]
- SNIPPET: Sweden STEADY-CAN (380,114 adults): new anaemia is a strong marker of cancer and death. Microcytosis links to highest cancer risk. [source needed]
- SNIPPET: UK CPRD microcytosis: 4.0% (497 of 12,289) had a new cancer within 1 year. [source needed]
- SNIPPET (secondary Danish resource): thrombocytosis PPV in CPRD 11.6% in men, 6.2% in women. [source needed]
- NOT FOUND: a Finnish PPV study for symptoms or lab patterns.

### 2e. Stage or time outcomes, summary
- Only ERICA (protocol READ, results NOT FOUND) and CASNET2 (see section 5) are built to measure stage or time.
- No published study showed a GP tool shortened time to diagnosis or moved stage.
- Our reading: a 2% prompt threshold means about 98 of every 100 flagged patients do not have that cancer. Workload is the real cost (interrupted consults, extra tests).

## 3. Which cancers to target in Finland

- READ (team file 07, RESEARCH-SUMMARY): spread data (TNM, stage or free text) recorded for 41.9% of Finnish registry cases (stage alone 5.4%) ([factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)). Target 70%. Note: the 07 file says the parts add to 40.8%, not 41.9%.
- NOT FOUND: Finnish share diagnosed via emergency care, by cancer type.
- SNIPPET (EU cancer inequalities report): 15–40% of colorectal cancers across Europe are found via emergency care. Linked to worse outcomes. Finland not given. [source needed]
- READ (Public Health Scotland, not Finland): 22.8% of cancers found via emergency admission in 2022. Late stage (III–IV) for 16 cancer types combined: 41.1%. [source needed]
- READ (08 file): Finnish lung pathway 155 days, 41 days in primary care.
- SNIPPET (Verkkouutiset headline): people with colorectal cancer see a doctor several times before diagnosis. [source needed]
- NOT FOUND: Finnish late-stage or emergency numbers for pancreas, ovary or myeloma.

Candidate shortlist (our reading, to test with real counts):
| Cancer | Why it may fit | Finnish gap |
|---|---|---|
| Colorectal | FIT screening since 2022; repeated GP visits; blood-in-stool and anaemia signals | Finnish diagnostic FIT rules not found |
| Lung | Urgent route exists; chest X-ray trigger; 155-day pathway | No wait data by county |
| Ovarian | Vague symptoms; CA-125 is non-specific | No Finnish CA-125 criteria |
| Pancreas | Vague symptoms, late | No Finnish data found |
| Myeloma | Anaemia, bone pain | No Finnish data found |

- SNIPPET: Finnish screening programme (FIT, threshold 25 µg Hb/g) started 2022. Participation 74% in 2023 (OECD, SNIPPET). Non-participation rising (Finnish Cancer Registry, SNIPPET). [source needed]
- READ (08 file): Potilasvakuutuskeskus found 326 compensated cancer delays in six years. Largest groups: breast, brain, lung, colorectal.

## 4. What a GP can do after a flag in Finland

- READ (08 file): Oulu rule: CT and MRI need a specialist referral or a specialist consult. For adults, GP can order urgently only a leg-vein ultrasound. Urgent CT is mostly through emergency X-ray. Source: [PPSHP imaging booking guide](https://www.ppshp.fi/dokumentit/Kuvantamisen%20ohje%20sislttyyppi/Oulun%20kaupungin%20terveysasemien%20kuvantamistutkimusten%20ajanvaraus%20oys%20kuv%20til.docx).
- READ (08 file): Finland has the lowest primary-care CT access in the Nordics (Acta Oncologica 2025 survey, news summary): [helsinki.fi](https://www.helsinki.fi/fi/uutiset/terveys/miksi-suomessa-keuhkosyopaan-kuollaan-aiemmin-kuin-pohjoismaissa). SNIPPET.
- NOT FOUND: national or county CT/ultrasound wait times by referral source.
- SNIPPET: Pirkanmaa lung pathway (dev version): urgent referral handled within 1–2 working days ([pirha development draft](https://pirha.fi/documents/d/kehitysversio/keuhkosyopapotilaan-hoitopolku)).
- SNIPPET: FIT for symptoms in primary care. Finnish guidance NOT FOUND. UK NICE DG56 uses quantitative FIT with thresholds (SNIPPET) [source needed].
- SNIPPET: PSA recheck after 1–2 months if raised (see 1b). [source needed]
- NOT FOUND: Finnish CA-125 referral thresholds.
- READ (08 file): treatment guarantee moved from 2 weeks to 3 months. Kuittinen says this can send urgent patients to long waits.
- Our reading (bottleneck): the GP can flag but often cannot image or test directly. Access rules, not the prompt, decide speed.

## 5. Equity: who never reaches the GP, and record-based case finding

- SNIPPET (FinSote 2024, THL): unmet health need is higher for people on income support, women, younger people and poor health. Barriers: opening hours, travel, user fees. [source needed] Corrected: earlier text gave "nearly 1 in 10 in the lowest income fifth" and "4.5 times the EU average". Neither is confirmed; both removed.
- SNIPPET: a FinSote 2018/2020 study on who forgoes care exists (search summary only, no URL). [source needed]
- READ (Max Planck WP 2025-016 title and authors from PDF metadata; full text did not load, [PDF](https://www.demogr.mpg.de/papers/working/wp-2025-016.pdf)): "Disparities in cancer stage at diagnosis, treatment, and mortality across socioeconomic groups in Finland" (Zai, Li, Dei Bardi, Korhonen, Moretti, Myrskylä, Martikainen). Related: [doi 10.1136/bmjph-2025-002829](https://doi.org/10.1136/bmjph-2025-002829).
- SNIPPET (search summary of same paper): higher education gives 10–16% higher chance of early-stage diagnosis. Not confirmed in full text.
- SNIPPET: Finnish lymphoma cohort (160 patients): age, income and job decide first provider; delays differ by provider. [source needed] Kuitunen 2026 ([research.utu.fi](https://research.utu.fi/converis/portal/detail/Publication/523655373), snippet) may be related; not confirmed.
- SNIPPET (Jäntti et al., EJPH 2021): education, gender and marital status predict non-participation in Finnish colorectal screening. [source needed]
- SNIPPET: Danish FIT screening: top income quintile OR 1.94 vs bottom. [source needed]
- Record-based case finding:
  - SNIPPET: UK CASNET2 (stepped-wedge RCT, EMIS practices). Uses a record search, alerts and templates for abnormal results and people who did not attend. Outcome: consultations from first symptom to referral. Results NOT FOUND. ISRCTN page did not load. [source needed]
  - SNIPPET: UCLH and other NHS safety-netting toolkits exist. [source needed]
  - NOT FOUND: any Finnish GP record search for non-attenders or abnormal results.
- REF-CHECK: Obermeyer et al., Science 2019, [DOI 10.1126/science.aax2342](https://doi.org/10.1126/science.aax2342) (correct). Warning: a label built from past care copies past gaps (finding from 11 file, SNIPPET).
- Data route (SNIPPET, Findata/Kanta): Findata grants permits. Kanta data include diagnoses and lab data (added 2022). About 90% of requests are research. [source needed] Findata figure from 11 file: 85% of permits in under 3 months (2025 report) [source needed].

## 6. Data for a 36-hour demo (legal, no patient data)

| Option | What it is | Tag |
|---|---|---|
| Synthea | Apache 2.0 licence. Outputs FHIR R4, bulk FHIR, C-CDA, CSV. Default demographics US (Massachusetts). No Finnish module. | READ (https://github.com/synthetichealth/synthea) |
| QCancer coefficients | Published in a 2015 BMJ Open paper (DOI correct). UK model. Use only on made-up patients, labelled as UK. | REF-CHECK (coefficients not read) |
| FinnGen summary statistics | GWAS summaries for DF13 (>500,000 people, >2,750 endpoints). Free after online form. Good for disease counts, not patient records. | SNIPPET [source needed] |
| SYNDATE (Turku AMK) | Synthetic Finnish health data test platform. Access terms not checked. | SNIPPET [source needed] |
| THL Sotkanet | Public aggregate counts. Licence CC BY 4.0. | UNVERIFIED [source needed] |
| Finnish Cancer Registry | Spread data (TNM, stage or free text) 41.9% recorded; stage alone 5.4% ([factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)). Aggregate counts only if obtained. | READ (team file) |

- Safe demo (our reading): Synthea records (FHIR) plus published QCancer-style coefficients on made-up patients, plus aggregate Finnish counts. No patient-level Finnish data.
- Synthea has no Finnish codes. Mapping would need work and is UNVERIFIED.

## What exists / what is missing in Finland

| Item | Exists in Finland? | Evidence |
|---|---|---|
| EHR decision support (EBMEDS) | Yes, built into Apotti | READ |
| Cancer red-flag rule in that CDS | Not shown | READ (absence on public pages) |
| Käypä hoito lung and prostate triggers | Yes | SNIPPET |
| Käypä hoito colorectal and ovarian criteria | Not found | NOT FOUND |
| SMART on FHIR route to Apotti | Yes | READ |
| Cancer-risk prompt in a GP record | Not found | NOT FOUND |
| GP-risk tool outcome study | Not found | NOT FOUND (ERICA result not published) |
| Emergency-route share by cancer | Not found | NOT FOUND |
| Spread data recorded (TNM, stage or free text) | 41.9%; stage alone 5.4% | READ (team file) |
| County CT/US waits by referral source | Not found | NOT FOUND |
| Finnish symptom or lab PPVs | Not found | NOT FOUND |
| Record search for non-attenders | Not found | NOT FOUND |
| Synthetic Finnish patients | SYNDATE only | SNIPPET |

## Verdict (our reading)

1. The idea fits a real gap, but Finland has no outcome data yet to show a GP prompt would shorten waits or shift stage.
2. The best trial (ERICA) has a stage endpoint and no published result; QCancer and RATs show weak or no referral effects.
3. For the demo, build a referral-rule simulation on aggregate counts with Synthea and labelled UK coefficients. Do not claim a patient-level Finnish risk score.

## Citation issues found

- ERICA protocol DOI: 2023-065232 is correct (checked against the protocol page). The earlier OpenAlex 2022 note is not used.
- Hamilton RAT cohort: year 2013 verified (63(606):30–36). The earlier OpenAlex 2012 note is not used.
- QCancer BMJ Open 2015 DOI: correct.
- Sørensen CCLM 2021: correct DOI; a Danish lab-test model, not Ca-PRI.

## Questions for a Finnish GP or oncologist

1. Where do you lose most time in a suspected-cancer case: the first visit, the imaging order, or the specialist queue?
2. Can a terveyskeskus GP order CT or ultrasound directly in your county, and what is the wait today?
3. Would you accept a risk prompt in Apotti, Omni360 or Lifecare, and how many prompts per day would you tolerate before ignoring them?
4. Do you use FIT or CA-125 for symptoms in primary care, and which cut-off do you trust?
5. Can your county give aggregate counts of cancer referrals returned or rejected, and of emergency-route diagnoses, by cancer type?

## Limits of this pass

- Käypä hoito PDFs, Max Planck full text, Macmillan CDS PDF, ISRCTN CASNET2 page and the BJGP 2019 PDF did not load. Their findings are SNIPPET or REF-CHECK only. The BJGP 2019 numbers above come from a search summary and the PMC abstract, not the full PDF.
- English search only, except two Finnish queries. Finnish-language grey literature (THL, county reports) was not searched in depth.
- No Lääkärilehti or Terveysportti access.
