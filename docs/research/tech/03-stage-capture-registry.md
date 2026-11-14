# 03 - Automated stage capture and registry reporting (Problem 4)

Tags: READ = I opened the page. SNIPPET = search result text only. UNVERIFIED = memory or brief, not checked. [source needed] = no source found after search.

## Summary

1. Software can already pull TNM from pathology text well in research studies ([S1](https://pmc.ncbi.nlm.nih.gov/articles/PMC12630577), [S2](https://pmc.ncbi.nlm.nih.gov/articles/PMC13042155/)). Those studies are small, mostly English or non-Finnish, and do not cover clinical stage.
2. Finland's gap sits upstream: clinical notifications are missing, and the stage often lives in free text. Extraction alone does not send a notification.
3. Denmark and Sweden win on automatic feeds from lab and patient systems into national registers ([S19](https://pubmed.ncbi.nlm.nih.gov/21775350/), [S21](https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511)). Finland's fix needs data definitions, feed work across hospital districts, and clear owners.

## Solution table

| solution | what it does | where used | evidence | why it does not solve P4 in Finland | gap left |
| --- | --- | --- | --- | --- | --- |
| LLM TNM extraction from pathology text (gyn. oncology, npj Precision Oncology) | LLM reads unstructured pathology text and outputs T, N, M | One hospital, gyn. cancer registry ([SNIPPET S1](https://pmc.ncbi.nlm.nih.gov/articles/PMC12630577)) | Gemini 1.5: T 0.994, N 0.993, M 0.909. Qwen2.5 72B: T 0.971, N 0.923, M 0.895. Manual registry pT error 5.5-17.0% ([SNIPPET S1](https://pmc.ncbi.nlm.nih.gov/articles/PMC12630577)) | Single centre, English-style reports, not Finnish. Needs pathology text, so cases without histology get nothing. It does not create a clinical notification ([S1](https://pmc.ncbi.nlm.nih.gov/articles/PMC12630577)) | Finnish validation, cloud LLM data rules, integration into Apotti/Lifecare/Omni360 |
| Rule and ontology NLP vs LLM platforms (Brim Analytics) | Compares NLP platforms for registry fields | US pancreas and breast registries ([SNIPPET S2](https://pmc.ncbi.nlm.nih.gov/articles/PMC13042155/)) | Pancreas TNM accuracy above 95%. Mean 96.7% pancreas, 93.7% breast ([SNIPPET S2](https://pmc.ncbi.nlm.nih.gov/articles/PMC13042155/)) | Vendor study, US English text. Pancreas stage is a narrow case | Finnish and Swedish text, cross-hospital drift |
| Open-source oncology IE pipeline | Open pipeline for T, N, M and lymph node fields | Research ([SNIPPET S3](https://pmc.ncbi.nlm.nih.gov/articles/PMC12443949)) | After fixing wrong ground truth: T 90%, N 92%, M 82% ([SNIPPET S3](https://pmc.ncbi.nlm.nih.gov/articles/PMC12443949)) | Research code, no hospital deployment shown. M-stage weakest | Ownership, maintenance, Finnish models |
| Finnish clinical NLP research (FinBERT on Finnish histopathology; LLM retrieval from Finnish EHR) | Finnish-language models on Finnish pathology notes | Research only ([SNIPPET S5](https://arxiv.org/html/2603.26434), [S6](https://arxiv.org/abs/2604.14815v2)) | Breast pathology reports and staging text in EHR retrieval ([SNIPPET S5](https://arxiv.org/html/2603.26434)). FinBERT pretraining on histopathology ([SNIPPET S6](https://arxiv.org/abs/2604.14815v2)). Authors note data access is highly regulated ([S6](https://arxiv.org/abs/2604.14815v2)) | No stage-capture result for Finland in my snippets. Breast-focused | Finnish stage benchmark, approved data access |
| TurkuNLP (Finnish NLP group) | Finnish NLP tools and models | Research (SNIPPET: publications page only) [source needed] | No stage-specific result found | Not checked in depth. Stage extraction not shown | Finnish TNM model, if one exists (UNVERIFIED) |
| SEER*DMS NLP (MOSSAIC API) | NLP fills site, histology, behaviour, laterality from electronic pathology. API used by 19 US registries ([S10](https://pmc.ncbi.nlm.nih.gov/articles/PMC11300011/)) | US NCI registries ([SNIPPET S8](https://www.imsweb.com/seer-dms/), [S9](https://seer.cancer.gov/seerdms/manual/chap09.screening.for.reportability.pdf)) | Reported as "extremely accurate" on the algorithm with confidence flags ([SNIPPET S9](https://seer.cancer.gov/seerdms/manual/chap09.screening.for.reportability.pdf)) | Snippets list no stage field, so it may not cover stage (UNVERIFIED). US system, English text | Stage scope, Finnish fit |
| Norway KREMT | Free web form for clinical notifications, used by most institutions. Other systems allowed if they follow the registry spec ([SNIPPET S11](https://www.fhi.no/en/cancer/reporting/kremt-cancer-registrys-electronic-reporting-service/), [S12](https://www.fhi.no/en/cancer/reporting/clinical-reporting-kremt/)) | Norway | No completeness figure in my snippets | Still needs someone to fill the form. Finnish registry has the same kind of e-form ([S13](https://syoparekisteri.fi/ilmoituspalvelu/)), so the tool is not the missing part | Duty, workflow owner, automated send from EHR |
| Denmark automatic coding and feeds (LPR3, Patobank) | Electronic reporting since 2008 with automatic coding ([SNIPPET S19](https://pubmed.ncbi.nlm.nih.gov/21775350/)). Pathology data via Patobank. LPR3 replaced SDS LPR in 2019 ([SNIPPET S20](https://www.medrxiv.org/content/10.1101/2024.04.11.24305663v1.full)) | Denmark | Brief says about 96% lung staging [source needed] (UNVERIFIED, from brief) | Danish national systems are one set of registers. Finland has several hospital districts on different EHRs (Apotti, Lifecare, Omni360). Re-use needs per-system interfaces | Finnish feed design across districts |
| Sweden INCA and automatic lab transfer | Lab systems send pathology automatically. Clinical data via forms or about 30 quality registers. INCA is the shared platform. TNM reporting mandatory since 2004 for clinics and pathology ([SNIPPET S21](https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511), [S22](https://cancercentrum.se/syd/regional-cancer-centres/knowledge-based-healthcare/cancer-registry/), [S23](https://medicaljournalssweden.se/actaoncologica/article/view/35232/46219)) | Sweden | Completeness figure not in snippets (UNVERIFIED) [source needed] | Shows that a legal duty alone was not enough. Automation of the lab feed mattered. Finland already has the duty ([S15](https://syoparekisteri.fi/2018/10/30/syopailmoituksen-voi-tehda-vuodenvaihteen-jalkeen-vain-sahkoisesti/)) | Finnish equivalent of automatic lab feed, clinical notification automation |
| Structured (synoptic) pathology reporting (ICCR, CAP eCC) | Fixed fields for pT, pN, grade in the pathology report | Many labs (UNVERIFIED) [source needed] | Not checked in this pass | Helps pTNM only. Clinical stage and cases without histology still missed | Finnish lab adoption status (UNVERIFIED) |
| mCODE and FHIR staging | Stage is an Observation. Stage group, with optional T, N, M observations ([SNIPPET S25](https://www.hl7.org/fhir/us/mcode/group-disease.html)) | US EHR standard ([SNIPPET S25](https://www.hl7.org/fhir/us/mcode/group-disease.html)) | Standard, not an accuracy result | Describes how to store stage. Does not say who fills it or where it comes from | Mapping to Finnish EHRs, Kanta |
| OMOP oncology extension | Stage and TNM stored as Measurement with "Cancer Modifier" domain ([SNIPPET S26](https://hiplab.mc.vanderbilt.edu/git/mz-health/OMOP/raw/tag/v0.2.0/docs/oncology.html), [S27](https://pmc.ncbi.nlm.nih.gov/articles/PMC8140810/)) | Research networks (SNIPPET) | No completeness result | Research data model, not a notification. Version unclear (CDM v5.5 vs v6.1 in sources) | Not a capture tool. Mapping from mCODE to OMOP not found |
| Epic structured TNM (US centre, Beacon since 2011) | Structured TNM capture inside Epic (search summary, source unclear) [source needed] | One US centre (UNVERIFIED) | Authors say TNM often stays unstructured (UNVERIFIED) | Apotti is Epic-based but no Apotti staging module found in my search. Stage fields may differ by district | Check Apotti stage fields and registry export |
| Vendors (Inspirata, Ontada, Flatiron, Carevive, Syapse, CDC eMaRC) | Abstraction and NLP for registries and oncology data | US mostly (UNVERIFIED) [source needed] | Not checked | Not searched in this pass. US payers and data, not Finnish public route | Need a separate check if the team wants a vendor view |

## Finland facts (the main test case)

- Stage reporting form asks for TNM, stage group, or free text. Free text is allowed ([SNIPPET S13](https://syoparekisteri.fi/ilmoituspalvelu/)). Structured capture is not enforced.
- Clinical notification is a legal duty for every health professional ([SNIPPET S15](https://syoparekisteri.fi/2018/10/30/syopailmoituksen-voi-tehda-vuodenvaihteen-jalkeen-vain-sahkoisesti/)).
- Two routes exist: monthly extraction from the hospital system, or the e-form ([SNIPPET S17](https://syoparekisteri.fi/tietoa-syoparekisterista/tietotilinpaatos2020/)). The paper form was removed at the end of 2019 ([SNIPPET S15](https://syoparekisteri.fi/2018/10/30/syopailmoituksen-voi-tehda-vuodenvaihteen-jalkeen-vain-sahkoisesti/)).
- The Lääkärilehti article ([READ, S16, 2018](https://www.laakarilehti.fi/ajassa/ajankohtaista/kliinisten-syopailmoitusten-maara-on-romahtanut/)) says over 50% of clinical notifications were missing for 2015. Melanoma and urological cancers were most missing. Responsibility for sending was unclear in many units after reorganisation.
- The registry and hospital districts agreed on THL data definitions for extraction from hospital systems (READ, [S16](https://www.laakarilehti.fi/ajassa/ajankohtaista/kliinisten-syopailmoitusten-maara-on-romahtanut/)). Build status is unknown.
- The registry publishes clinical-notification share by wellbeing area ([SNIPPET S18](https://syoparekisteri.fi/tilastot/kliinisten-ilmoitusten-tilasto/)). This is useful for an equity check.
- Syöpä 2023 says clinical notifications matter most where no histology exists ([SNIPPET S14](https://syoparekisteri.fi/assets/files/2025/06/Syopa_2023_fi.pdf)).

## Nordic registry feeds (short notes)

- Finland: duty exists, e-form exists, extraction from hospital systems is being built. Completeness is still low. 41.9% for 2024 is confirmed: the registry factsheet gives 41.9% national spread-data coverage (TNM, stage or free text; stage alone 5.4%) ([factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)).
- Norway: KREMT is the default channel. Other systems allowed with spec. Pathology labs send reports separately ([SNIPPET S11](https://www.fhi.no/en/cancer/reporting/kremt-cancer-registrys-electronic-reporting-service/), [S12](https://www.fhi.no/en/cancer/reporting/clinical-reporting-kremt/)).
- Denmark: automatic coding and national registers ([SNIPPET S19](https://pubmed.ncbi.nlm.nih.gov/21775350/), [S20](https://www.medrxiv.org/content/10.1101/2024.04.11.24305663v1.full)).
- Sweden: automatic lab transfer, TNM mandatory since 2004, INCA platform ([SNIPPET S21](https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511), [S22](https://cancercentrum.se/syd/regional-cancer-centres/knowledge-based-healthcare/cancer-registry/), [S23](https://medicaljournalssweden.se/actaoncologica/article/view/35232/46219)).
- Kanta reporting by 2029 (THL act 5 j) is from the brief only [source needed] (UNVERIFIED in my searches).

## Equity and access notes (Finland)

- Structured tools need EHR vendor work per district. Smaller or older units may wait longer.
- Public and private providers may use different systems (UNVERIFIED) [source needed].
- Finnish NLP models are research-grade. No deployed Finnish stage extractor was found.
- Data use goes through the Secondary Use Act and Findata ([Findata legislation page](https://findata.fi/en/services-and-instructions/legislation/)). Model training on patient text needs an approval path. Snippets say access is regulated ([S6](https://arxiv.org/abs/2604.14815v2)).
- Cost, GDPR, and language rules: not checked in depth (UNVERIFIED).

## White space

- No Finnish or Swedish TNM extractor found in my sources. A tested Finnish model would be new.
- No public Apotti staging-field mapping found.
- No study tests stage extraction across two or more Finnish hospital systems.
- No study links NLP stage capture to notification completeness by region or income.
- mCODE-to-OMOP mapping for stage not found.

## Gap left

The registry says clinical notifications arrive for only about half of new cases ([factsheet 2024](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)), so the main gap is notification. Extraction from pathology text covers pTNM when histology exists. It does not cover clinical stage or cases without pathology. A Finnish solution must send the notification (or a draft for sign-off) from the hospital system, with clear ownership per unit. Model accuracy is a second step.

## Sources

- S1 https://pmc.ncbi.nlm.nih.gov/articles/PMC12630577 (SNIPPET; npj Precision Oncology gyn TNM study)
- S2 https://pmc.ncbi.nlm.nih.gov/articles/PMC13042155/ (SNIPPET)
- S3 https://pmc.ncbi.nlm.nih.gov/articles/PMC12443949 (SNIPPET)
- S4 https://arxiv.org/abs/2604.13328v1 (SNIPPET; LoRA multi-task staging, abstract only)
- S5 https://arxiv.org/html/2603.26434 (SNIPPET; Finnish EHR LLM retrieval)
- S6 https://arxiv.org/abs/2604.14815v2 (SNIPPET; FinBERT on Finnish histopathology)
- S7 https://pmc.ncbi.nlm.nih.gov/articles/PMC12267331 (SNIPPET; NLP oncology registry survey)
- S8 https://www.imsweb.com/seer-dms/ (SNIPPET)
- S9 https://seer.cancer.gov/seerdms/manual/chap09.screening.for.reportability.pdf (SNIPPET)
- S10 https://pmc.ncbi.nlm.nih.gov/articles/PMC11300011/ (SNIPPET; MOSSAIC API, 19 registries)
- S11 https://www.fhi.no/en/cancer/reporting/kremt-cancer-registrys-electronic-reporting-service/ (SNIPPET)
- S12 https://www.fhi.no/en/cancer/reporting/clinical-reporting-kremt/ (SNIPPET)
- S13 https://syoparekisteri.fi/ilmoituspalvelu/ (SNIPPET; Finnish e-form, TNM/stage/free text)
- S14 https://syoparekisteri.fi/assets/files/2025/06/Syopa_2023_fi.pdf (SNIPPET)
- S15 https://syoparekisteri.fi/2018/10/30/syopailmoituksen-voi-tehda-vuodenvaihteen-jalkeen-vain-sahkoisesti/ (SNIPPET)
- S16 https://www.laakarilehti.fi/ajassa/ajankohtaista/kliinisten-syopailmoitusten-maara-on-romahtanut/ (READ, 2018)
- S17 https://syoparekisteri.fi/tietoa-syoparekisterista/tietotilinpaatos2020/ (SNIPPET)
- S18 https://syoparekisteri.fi/tilastot/kliinisten-ilmoitusten-tilasto/ (SNIPPET)
- S19 https://pubmed.ncbi.nlm.nih.gov/21775350/ (SNIPPET; Danish Cancer Registry)
- S20 https://www.medrxiv.org/content/10.1101/2024.04.11.24305663v1.full (SNIPPET; LPR3 and Patobank)
- S21 https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511 (SNIPPET; Nordic TNM registration)
- S22 https://cancercentrum.se/syd/regional-cancer-centres/knowledge-based-healthcare/cancer-registry/ (SNIPPET)
- S23 https://medicaljournalssweden.se/actaoncologica/article/view/35232/46219 (SNIPPET; TNM mandatory since 2004)
- S24 https://www.socialstyrelsen.se/contentassets/80bfd95b0f0c40f7aabd5ababc8cd85b/2024-8-9189.pdf (SNIPPET)
- S25 https://www.hl7.org/fhir/us/mcode/group-disease.html (SNIPPET)
- S26 https://hiplab.mc.vanderbilt.edu/git/mz-health/OMOP/raw/tag/v0.2.0/docs/oncology.html (SNIPPET)
- S27 https://pmc.ncbi.nlm.nih.gov/articles/PMC8140810/ (SNIPPET; OMOP oncology extension)
- S28 https://ecancer.org/en/journal/article/1920-a-comparative-analysis-of-cancer-stage-classification-systems-for-registries (SNIPPET)
- Findata legislation page: https://findata.fi/en/services-and-instructions/legislation/ (SNIPPET, from the team's law notes)
- Not checked: Epic Beacon claim, Apotti staging, vendors, CDC eMaRC, Kanta plan, Findata rules (UNVERIFIED)
