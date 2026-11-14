# 02 - GP cancer-risk decision support (research, Nov 2026)

Scope: tools that help a GP spot possible cancer, from symptoms, notes or labs.
Finland question: does any of this give a fast lane for suspected cancer in public primary care (terveyskeskus)?

**Summary**
1. Many cancer-risk tools exist (UK, Australia, Netherlands). Almost none have strong proof that they cut time to diagnosis or improve stage. The best trials show small or no effect ([Future Health Today, BJGP 2025](https://bjgp.org/content/75/754/e306)).
2. The ERICA trial (530 UK practices) finished, but I found no published results by 14 Nov 2026 ([protocol](https://bmjopen.bmj.com/content/13/3/e065232), [registry](https://www.isrctn.com/ISRCTN22560297)).
3. No Finnish tool found: no cancer red-flag rule in Duodecim EBMeDS, Terveystalo, or Apotti/Lifecare/Omni alerts. The only "direct CT" model found is regional, in Scotland ([NHS Highland pathway](https://rightdecisions.scot.nhs.uk/tam-treatments-and-medicines-nhs-highland/adult-therapeutic-guidelines/cancer/imaging-pathway-for-primary-care-direct-access-to-ct-chestabdomenpelvis-for-suspected-malignancy-guidelines/)).

Tags: **READ** = I opened the page. **SNIPPET** = search summary only. **UNVERIFIED** = memory, not checked. **[source needed]** = no source found after search.

## Table

| Solution | What it does | Where used | Evidence | Why it does not solve P3 in Finland | Gap left |
|---|---|---|---|---|---|
| C the Signs (UK, AI decision support) | Shows cancer risk in the consultation and after it; helps referral choice. | 1,000+ GP practices ([NHS page](https://transform.england.nhs.uk/key-tools-and-info/digital-playbooks/cancer-digital-playbook/an-AI-support-tool-to-help-healthcare-professionals-in-primary-care-to-identify-patients-at-risk-of-cancer-earlier)) or 1,500+ (developer, [HSJ](https://www.hsj.co.uk/technology-and-innovation/the-future-of-cancer-diagnosis-will-be-proactive-not-reactive/7041845.article)). England only. | Company evaluation: 235k assessments, 1,084 practices, "20% better conversion", 61k unnecessary urgent referrals avoided (SNIPPET, developer) [source needed]. St Mary's study of 4 practices: GPs barely used the decision-support part; admin staff still sent referrals ([source](https://research.stmarys.ac.uk/id/eprint/6434/1/Accepted%20version%20-%20Perceived%20benefits%20and%20challenges%20of%20using%20an%20electronic%20cancer%20prediction%20system.docx)). No independent outcome study found. | Company-made numbers, no stage or survival data. Built for English systems (not Apotti). Tool is for GP triage, not a patient fast lane. | No public proof it moves stage or survival. |
| QCancer (Hippisley-Cox; in EMIS/SystmOne) | Risk score for ~15 cancers [source needed] from age, sex, smoking, symptoms, labs. | NHS England, built into EMIS Web (~2013, [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC7896585)) and Vision (RATs, [source](https://bjgp.org/content/69/684/e437)). | 18.3% of GPs used RAT or QCancer in one survey ([source](https://bjgp.org/content/69/684/e437)). English evaluation found no clear rise in urgent referrals and could not measure stage ([source](https://news.cancerresearchuk.org/wp-content/uploads/2014/11/CDS-evaluation-report-Executive-summary.pdf)). | Low use. GPs distrust the score (qualitative study; date and link [source needed]; related: [BMJ Open 2021 synthesis](https://bmjopen.bmj.com/content/11/2/e043338)). Not in Apotti. Score sets risk only; GP still needs a route to a scan. | Did not raise referral volume; no stage data. |
| Hamilton RATs / Macmillan eRATs / eCDS | Symptom-based risk prompts in consultation (lung, colorectal, others) with audit tables; runs on iCAP. | Downloaded by 1,250+ UK practices ([source](https://www.macmillan.org.uk/_images/pilot-study-ecds-tool-uk-gp-practice-poster_tcm9-292020.pdf)). | Cohort of 614 GPs (7 networks): more investigations and more diagnoses ([source](https://www.cambridge.org/core/product/68DA8A5663EEE2F274B6755D812EF412)). Pilot qualitative: GPs want full EHR integration ([source](https://www.macmillan.org.uk/_images/pilot-study-ecds-tool-uk-gp-practice-poster_tcm9-292020.pdf)). | Only UK-practice packages (EMIS, Vision). No Apotti build found. Not a Finnish symptom list. | No outcome data on stage or time to diagnosis. |
| ERICA trial (eRAT suite, [530 practices](https://bmjopen.bmj.com/content/13/3/e065232), 2022-2024 [source needed]) | Cluster RCT of the Macmillan eRATs vs usual care. Primary outcome: share of cancers found at stage 1-2 vs 3-4. | England. | Protocol: [BMJ Open 2023](https://bmjopen.bmj.com/content/13/3/e065232). Registry: "Completed" ([ISRCTN](https://www.isrctn.com/ISRCTN22560297)). Nested qualitative study 2025: GPs felt eRATs cut their clinical freedom ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12421273/), READ-level abstract). No primary results paper found (searched Nov 2026). | Even if positive, it tests UK eRAT tools. Finnish transfer needs new trial. | Results still unpublished as far as I can see. **This is the most important open item.** |
| Future Health Today (FHT) cancer module | Flags patients with risk from age, sex, cancer history and labs (iron deficiency, raised PSA, thrombocytosis). | Victoria and Tasmania, Australia, 2021-22 [source needed for dates]. | Cluster RCT. No effect on follow-up of abnormal blood tests (already high; "ceiling effect") ([BJGP 2025](https://bjgp.org/content/75/754/e306)). Symptom-based decision support suggested as next step. | Lab-based, not symptom-based. Shows that a GP alert alone does not change much when follow-up is already good. | No symptom-led RCT with stage outcome. |
| Amsterdam UMC free-text lung model (Schut et al., BJGP 2025) | Reads free text plus codes in GP records to flag lung cancer risk. | Research only: 525k patients, 4 Dutch GP networks ([press](https://www.eurekalert.org/news-releases/1081280)). | Retrospective cohort. 62% of lung cancers flagged 4 months before referral ([press](https://www.eurekalert.org/news-releases/1081280)). Precision: ~1 in 34 flagged had cancer ([BJGP](https://bjgp.org/content/75/754/e316.full.pdf); DOI 10.3399/BJGP.2023.0489). BJGP PDF did not open (binary). | Needs free text in a rich EHR. Finnish notes are in Apotti/Lifecare/Omni [source needed], but no data-access route found. Low precision means many false alarms. Lung only. | Not tested as a live alert. |
| PinPoint blood test (Leeds / Yorkshire, UK) | ML on routine blood tests gives a cancer probability (red/amber/green) for 2WW triage. | Leeds and Mid Yorkshire (from Jul 2026, [source](https://nhsaccelerator.com/innovations/the-pinpoint-test/)). | Retrospective: 371,799 referrals (Leeds, 2011-19) in [BMJ Open 2022](https://bmjopen.bmj.com/content/12/4/e053590). NHS "99% of gynae cancers" claim is a press claim [source needed]. Authors say prospective study needed. | Only for patients already referred. Not a fast lane. Blood tests in Finnish public care are also used; but no Finnish validation found. | Triage after referral, not before. |
| ColonFlag (ML, UK validation by Holt et al.) | Score from GP records to flag colorectal cancer risk for people 40+. | UK validation (CPRD). Israel-origin tool. | AUROC 0.736 at 18-24 months; falls to 0.536 after adjusting for age ([source](https://www.phc.ox.ac.uk/publications/publication_modal/1319579)). NICE MIB142 reviewed it ([source](https://www.nice.org.uk/advice/mib142/chapter/Clinical-and-technical-evidence)). No randomised alert trial found. | Mostly tested for accuracy, not outcomes. Age does most of the work. | No outcome trial. |
| Duodecim EBMeDS + Symptom Checker (Finland) | Clinical decision support in Apotti ([source](https://www.duodecim.fi/ebmeds/?p=960)). Also patient symptom checker for urgency. | Finnish public and private care. | **READ** (duodecim.fi/ebmeds): claims MDR 2017/745 compliance; no cancer red-flag rules named; no evaluation data. | No cancer red-flag rule. No outcome data. Triage is about "need for care and urgency", not cancer. | No cancer red-flag list in Finland. |
| Scotland GP direct-access CT pathway (NHS Highland; Scottish referral guidance) | Not an AI tool. Rule set: GP can order CT chest/abdomen/pelvis (or ultrasound) for unexplained weight loss, fatigue or pain for 4+ weeks, age 40+, no localising signs. | Scotland, regional (North NHS Highland pathway; national guidance SNIPPET). | **READ** ([NHS Highland pathway](https://rightdecisions.scot.nhs.uk/tam-treatments-and-medicines-nhs-highland/adult-therapeutic-guidelines/cancer/imaging-pathway-for-primary-care-direct-access-to-ct-chestabdomenpelvis-for-suspected-malignancy-guidelines/)): CT booked within 2 weeks; report 1-2 weeks; full exam + bloods + CXR first. No outcome data on the page. | Proof that a GP *can* order CT directly. Finnish GP has no such national right found. | Shows the missing piece in P3: a direct scan route with symptom rules. |
| HealthPathways (Australia/NZ; Melbourne, NW Melbourne PHN, Canberra) | Local referral pathway web pages; condensed cancer pathways (e.g. colorectal: [colonoscopy in 4 weeks](https://nwmphn.org.au/?p=19948)). | Australian regions (SNIPPET). | No outcome data found. [Canberra](https://canberrahealthservices.act.gov.au/__data/assets/word_doc/0008/1981538/Optimal-Cancer-Care-Pathway-for-Lung-Cancer-Patients-Adults-Only-.docx) uses central intake nurses for lung referrals (SNIPPET). | Local content, not a national list. Not in Finland. Clinicians set own content. | No national cancer red-flag list in the tool. |
| Danish / Norwegian / Swedish tools | Danish: AI on routine lab panel (25 tests) for cancer risk ([source](https://www.degruyterbrill.com/document/doi/10.1515/cclm-2021-1015/html)). Danish: algorithm to find urgent cancer referrals from free text (corrected: the 2016 study says Denmark has no such system, though all referrals are stored electronically; one region, sensitivity 0.939, specificity 0.937) ([source](https://www.dovepress.com/article/download/29685)). Multi-country GP cohort of 493 GPs: GP intuition of cancer predicts diagnosis [source needed]. | Research only. | Retrospective or validation. No Nordic live GP alert trial found. | Research, not deployed. Our reading: the Danish study shows referral text can be flagged, which is a model for Finland. | No Nordic live tool with outcomes found. |
| Terveystalo symptom assessment (Oirearvio) | Symptom-based triage for occupational health customers; CE-marked (company claim). Routes to a specialist, channel, and time. | Terveystalo occupational health since 2023 ([source](https://www.terveystalo.com/en/articles/digital-leadership-in-occupational-health-services-the-benefits-and-customer-experience-of-the-symptom-assessment-tool), company). | Company claim only. No cancer symptom list named. No outcome data. | Private and occupational route. Steers to care; does not ask for a scan. Not public primary care. | Two-speed: occupational route has triage tools, public route has none. |
| Mehiläinen / Pihlajalinna AI triage | None found. | - | - | Search found no public material. | Unknown; ask the companies. |
| Lifecare Omni / Apotti / Kanta cancer alerts | None found. Apotti alerts exist for records errors ([source](https://www.verkkouutiset.fi/a/hs-apotti-keskeyttaa-tyonteon-seitseman-miljoonaa-kertaa-vuodessa/), SNIPPET, HS). | Finnish EHRs. | No cancer-risk alert found in any Finnish EHR. | No tool to adapt in a public setting found. | No cancer-risk alert in Finnish public EHRs (as far as I found). |
| US tools (Epic, Optum, Kaiser ColonFlag use, Mendel, Kheiron) | Not verified in this run. Epic and Kaiser ML models exist [source needed] (UNVERIFIED memory). | US health systems. | No eval found in this run (search returned nothing relevant). | US insurance and EHR model; no Finnish fit. | Not checked enough to rate. |

## Evidence quality notes

- Most numbers come from companies or press (C the Signs, PinPoint, Future Health Today press). Treat them as claims.
- Only two RCTs in this set: ERICA (no results published by Nov 2026, as far as I can see) and Future Health Today (lab-based, no effect on follow-up). Neither measured stage at diagnosis for a symptom-led tool.
- Stage at diagnosis and survival are almost never reported. The one that tried (QCancer English evaluation, [source](https://news.cancerresearchuk.org/wp-content/uploads/2014/11/CDS-evaluation-report-Executive-summary.pdf)) could not measure it.
- Equity is not reported in any of the main sources I read. Minority, sex, and deprivation effects are unknown. ColonFlag's signal is mostly age ([source](https://www.phc.ox.ac.uk/publications/publication_modal/1319579)). Risk tools that use ethnicity or deprivation need checking, not assumed.
- Public vs private route: Terveystalo (private) has the only triage tool found in Finland; public primary care has none.
- Language: UK tools are English only [source needed]. Finnish and Swedish versions were not found.
- Regulation: many of these are software-as-medical-device. Most cancer-risk AI would be MDR class IIa or higher [source needed], which makes it "high-risk" under the EU AI Act. (corrected) The Digital Omnibus on AI sets 2 Aug 2028 for AI in medical devices (Annex I); Annex III systems follow on 2 Dec 2027 ([source](https://meddeviceguide.com/blog/eu-ai-act-omnibus-amendment-2026-medical-device-impact-guide), [source](https://www.taylorwessing.com/en/international-life-sciences-newsletter/life-sciences-legal-lens-vol-2/update-ai-enabled-medical-devices-and-ivds-confirmed-as-high-risk)). Final publication not confirmed in the search results. Check before any build.
- Limits of this run: 429 rate limits hit the context search tool several times. One scrape failed on DNS (transform.england.nhs.uk). The BJGP PDF did not open. Some results are SNIPPET only.

## White space (no solution found)

1. A symptom-led national red-flag list for public primary care in Finland. None found (Duodecim EBMeDS has none).
2. A GP direct-access scan route with symptom rules, national, outside Scotland. Only Scotland found.
3. Any live alert that measures stage at diagnosis or time to scan in a public Finnish practice.
4. Equity data (who is missed) for any tool, in any country, that I read.
5. Finnish-language, Apotti-integrated cancer alert. None found.

## Gap left

No public-route tool in Finland combines (a) a red-flag symptom list, (b) an EHR alert, and (c) a GP-orderable fast scan. The UK and Australian tools cover one or two parts. Only occupational (Terveystalo) has triage, and it does not order cancer scans for the public route.

## Sources

Tag key: READ = opened; SNIPPET = search summary; UNVERIFIED = memory.

- https://bmjopen.bmj.com/content/13/3/e065232 (ERICA protocol) - SNIPPET
- https://www.isrctn.com/ISRCTN22560297 (ERICA registry, "Completed") - SNIPPET (fetch returned no content)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12421273/ (ERICA nested qualitative study) - SNIPPET
- https://research.stmarys.ac.uk/id/eprint/6434/1/Accepted%20version%20-%20Perceived%20benefits%20and%20challenges%20of%20using%20an%20electronic%20cancer%20prediction%20system.docx (C the Signs, 4 practices) - SNIPPET
- https://www.easternahsn.org/about-us/our-projects/c-the-signs (C the Signs project page) - SNIPPET
- https://www.hsj.co.uk/technology-and-innovation/the-future-of-cancer-diagnosis-will-be-proactive-not-reactive/7041845.article (developer claims, 1,500 practices) - SNIPPET
- https://transform.england.nhs.uk/key-tools-and-info/digital-playbooks/cancer-digital-playbook/an-AI-support-tool-to-help-healthcare-professionals-in-primary-care-to-identify-patients-at-risk-of-cancer-earlier (1,000+ practices) - SNIPPET (fetch failed)
- https://www.macmillan.org.uk/_images/pilot-study-ecds-tool-uk-gp-practice-poster_tcm9-292020.pdf (eRAT pilot) - SNIPPET
- https://www.cambridge.org/core/product/68DA8A5663EEE2F274B6755D812EF412 (RATs, 614 GPs cohort) - SNIPPET
- https://www.pulsetoday.co.uk/news/politics/cancer-decision-tool-influences-gp-decision-on-half-of-occasions/ (RAT influence) - SNIPPET
- https://www.cancerresearchuk.org/node/306886 (ERICA page; no longer recruiting) - SNIPPET
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6592323 and https://bjgp.org/content/69/684/e437 (same survey: 18.3% used RAT or QCancer) - SNIPPET
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7896585 (QCancer and eRAT in GP systems from 2013) - SNIPPET
- https://bmjopen.bmj.com/content/11/2/e043338 (CCDT qualitative synthesis) - SNIPPET
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9053195 (risk-tool evidence; mapping to claims not confirmed) - SNIPPET
- https://news.cancerresearchuk.org/wp-content/uploads/2014/11/CDS-evaluation-report-Executive-summary.pdf (English CDS evaluation, QCancer/RAT) - SNIPPET
- https://bjgp.org/content/75/754/e306 and https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12010534/ (Future Health Today) - SNIPPET
- https://bjgp.org/content/bjgp/75/754/e316.full.pdf (Schut et al., Amsterdam lung model) - SNIPPET (PDF fetch failed)
- https://www.eurekalert.org/news-releases/1081280 (Amsterdam press release) - SNIPPET
- https://bmjopen.bmj.com/content/12/4/e053590 (PinPoint, retrospective BMJ Open) - SNIPPET
- https://nhsaccelerator.com/innovations/the-pinpoint-test/ (PinPoint developer page) - SNIPPET
- https://www.phc.ox.ac.uk/publications/publication_modal/1319579 (ColonFlag validation) - SNIPPET
- https://www.nice.org.uk/advice/mib142/chapter/Clinical-and-technical-evidence (NICE MIB142 ColonFlag) - SNIPPET
- https://www.duodecim.fi/ebmeds/?p=960 (EBMeDS, MDR claim, no cancer rules) - READ
- https://www.duodecim.fi/english/?p=1429 (EBMeDS class IIa under MDR) - SNIPPET
- https://humanfactors.jmir.org/2024/1/e55099 (Omaolo, CE marking; usability study) - SNIPPET
- https://rightdecisions.scot.nhs.uk/tam-treatments-and-medicines-nhs-highland/adult-therapeutic-guidelines/cancer/imaging-pathway-for-primary-care-direct-access-to-ct-chestabdomenpelvis-for-suspected-malignancy-guidelines/ (GP direct-access CT criteria) - READ
- https://www.duodecim.fi/wp-content/uploads/sites/9/2026/05/Duodecimin-eduskuntavaalitavoitteet.pdf (Duodecim election goals, Kaypa hoito funding) - SNIPPET
- https://www.verkkouutiset.fi/a/syopapotilaat-kokevat-ettei-heidan-oireitaan-oteta-vakavasti/ (Finnish cancer patients: symptoms not taken seriously) - SNIPPET
- https://www.terveystalo.com/en/articles/digital-leadership-in-occupational-health-services-the-benefits-and-customer-experience-of-the-symptom-assessment-tool (Terveystalo symptom tool) - SNIPPET
- https://www.helsinki.fi/fi/uutiset/tekoaly/tekoaly-jo-ihmista-parempi-seulomaan-syopakasvaimia-kudoskuvista (Finnish AI legal obstacles) - SNIPPET
- https://www.verkkouutiset.fi/a/hs-apotti-keskeyttaa-tyonteon-seitseman-miljoonaa-kertaa-vuodessa/ (Apotti alerts) - SNIPPET
- https://canberrahealthservices.act.gov.au/__data/assets/word_doc/0008/1981538/Optimal-Cancer-Care-Pathway-for-Lung-Cancer-Patients-Adults-Only-.docx (Canberra lung pathway) - SNIPPET
- https://nwmphn.org.au/?p=19948 (HealthPathways colorectal case) - SNIPPET
- https://www.degruyterbrill.com/document/doi/10.1515/cclm-2021-1015/html (Danish lab-panel AI) - SNIPPET
- https://www.dovepress.com/article/download/29685 (Toftegaard et al., Clinical Epidemiology 2016, Danish urgent-referral algorithm) - SNIPPET
- https://meddeviceguide.com/blog/eu-ai-act-omnibus-amendment-2026-medical-device-impact-guide (AI Act omnibus, 2 Aug 2028 for Annex I) - SNIPPET
- https://www.taylorwessing.com/en/international-life-sciences-newsletter/life-sciences-legal-lens-vol-2/update-ai-enabled-medical-devices-and-ivds-confirmed-as-high-risk (AI Act high-risk dates) - SNIPPET
- EU AI Act MDR class IIa default for Rule 11 software - [source needed]
- Epic / Kaiser / Optum model details - UNVERIFIED (memory)
