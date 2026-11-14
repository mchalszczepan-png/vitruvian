# Desk answers to the doctor questions

Our own answers from published sources, written before the doctor interview. Compare them with what the doctor says. Questions are in [06-expert-questions-spoken.md](06-expert-questions-spoken.md). Each answer has a short answer, evidence with sources, a confidence level and what the doctor can add.

## Desk answers: questions 1-7

Date: 2026-11-14. Part A of the expert questions (06-expert-questions-spoken.md). Desk research only.

Tags: "Our guess:" = our inference, not a source. [source needed] = no source found. "Snippet" = seen only in a search result, not read in full.

Terms: THL = Finnish National Institute for Health and Welfare. STM = Ministry of Social Affairs and Health. PPSHP = North Ostrobothnia hospital district (Oulu). TYKS = Turku University Hospital. Pirha = Pirkanmaa wellbeing county. EBMEDS = Duodecim decision support tool used in Apotti. Ohjaus 21/2016 = THL guide to measuring cancer waits.

### Corrections to the question sheet (read first)

1. (Fixed 2026-11-14 in the summary and sheet 06.) The "THL repeated it in 2014" link (ISBN 978-952-302-185-3) is, per our repo check, THL's 2014 National Cancer Plan part II, with no access target times. Do not cite it for 6 weeks until someone checks. Source: docs/research/law/07-verification.md, line 29.
2. The 6-week figure is in STM 2010:6, section 7.2. We checked this text ourselves on 2026-11-14. But the report calls it a proposal (see Q4).
3. "Finland fines providers" is not supported by any Finnish law text we read (see Q5).
4. The Pirkanmaa 42% to 80% figures come from a search snippet. The registry article returned HTTP 403 when opened. The 42% is also the national spread-data figure, so do not mix them (see Q6).

### Q1. Where do patients lose the most time?

**Short answer:** In the few studies we found, most delay comes after the first GP contact, in tests and hospital steps. Delay before first contact is real but smaller. Only one small cohort compares public and occupational routes.

**Evidence**
- Lymphoma, one cohort of 160 patients (Tokola et al. 2025): mean symptom-to-treatment 146 days, of which 54 days were before first contact, so about 92 days came after. Snippet only. docs/research/context/08-primary-care-fast-lanes.md lines 70-74; docs/discovery/05-issues-and-causes.md row 4. [source needed for URL]
- Lymphoma, route (Kuitunen et al. 2026, Cancer Medicine, doi 10.1002/cam4.71920): median 127 days for public route vs 76 days for private or occupational (n=48 vs 39). Income and education did not predict delay; route did. Small cohort, industry-funded per our repo note. docs/discovery/05-issues-and-causes.md row 15. Full text not read.
- Lung, unpublished study by Kuittinen, quoted by Yle MOT (read): symptom to treatment about 155 days. Over 50 days patient, 41 primary care, 58 specialist care. https://yle.fi/a/74-20251023
- Survey of 684 cancer patients (STT release, 12 March 2025, not opened): one in three felt diagnosis was delayed; over half felt symptoms were not taken seriously; a third had 3 or more contacts before diagnosis. Self-selected sample. https://www.sttinfo.fi/tiedote/70972938/kyselyselvitys-joka-kolmas-syopapotilas-kokee-diagnoosin-viivastyneen?publisherId=69820264
- Avoiding care (Syöpäriskitietoisuusraportti 2024, PDF read in repo): nearly a quarter avoided care for symptoms that could be cancer. Among them, "fear of findings" was often a reason for 37%, "cannot afford tests" for 33%. https://www.syopajarjestot.fi/wp-content/uploads/2026/02/Syopariskitietoisuusraportti_2024_2.pdf

*Follow-up, occupational health:*
- About 2.09 million employees had employer occupational health in 2024; 92% of wage earners covered (Kela, snippet, not opened). https://www.kela.fi/tietotarjotin/1434746-tyoterveyshuollon-kustannukset-olivat-vuonna-2024-noin-600-euroa-tyontekijaa-kohti
- No Finnish source found on occupational-health cancer timing. [source needed]

**Confidence:** Medium that most measured delay is after first contact (two small or unpublished sources). Low on the occupational comparison.

**What the doctor can add:** Where the time goes in their own clinic, and whether occupational-health patients get scans faster.

### Q2. Can a health-centre GP book a CT scan?

**Short answer:** Not in the rules we found. The Oulu rule needs a specialist referral for CT and MRI. We found no county where a health-centre doctor orders CT alone, and no CT wait figure for health centres.

**Evidence**
- Oulu (PPSHP) health-centre imaging booking guide (snippet, not opened): "Muissa tietokonetomografia- ja magneettitutkimuksissa on oltava erikoislääkärin lähete." Translation: other CT and MRI exams need a specialist referral. https://www.ppshp.fi/dokumentit/Kuvantamisen%20ohje%20sislttyyppi/Oulun%20kaupungin%20terveysasemien%20kuvantamistutkimusten%20ajanvaraus%20oys%20kuv%20til.docx
- Same Oulu guide (snippet): an adult GP can order urgently only a leg-vein ultrasound. Urgent CT is mostly done through emergency X-ray. docs/research/context/08-primary-care-fast-lanes.md line 32.
- Nordic comparison (Khalife et al., Acta Oncologica 2025, abstract summary): Finland has the lowest primary-care access to CT and the longest primary-care waits among Nordic countries. https://medicaljournalssweden.se/actaoncologica/article/view/42778
- Model abroad: NHS Highland (Scotland) lets GPs order CT chest, abdomen and pelvis for unexplained weight loss, fatigue or pain for 4+ weeks, age 40+. Pathway page read. Full link: docs/research/tech/02-gp-risk-decision-support.md line 26.
- CT wait from a Finnish health centre: none found. [source needed]

**Confidence:** Medium for the Oulu rule (one county, snippet). Low for the rest of Finland.

**What the doctor can add:** Whether their health centre can order CT directly, and the current wait.

### Q3. Which dates does the hospital system record?

**Short answer:** THL's cancer wait guide (Ohjaus 21/2016) names four dates: referral arrival at specialist care, first visit (or phone substitute), placement on the treatment waiting list, and first treatment. We found no proof that hospitals keep all four per patient.

**Evidence**
- Four measurement points, from a search summary of Ohjaus 21/2016. Full text not readable. docs/research/law/07-verification.md lines 22-23. https://core.ac.uk/download/78470017.pdf (HTTP 403 when opened).
- Ohjaus 2/2022 (specialist-care access, definitions for 2021) lists "Lähetteen saapuminen" (referral arrival) and "Yhteydenotto" (contact) in its contents. Search summary says monthly reporting; not verified. https://core.ac.uk/download/491363924.pdf (HTTP 403).
- THL publishes monthly specialist-care access data by wellbeing county since 2021. Cancer is not split out in the pages we read. https://thl.fi/en/data-and-statistics/access-to-treatment/access-to-services-in-specialised-health-care (read, docs/research/context/09-cancer-wait-targets.md).
- TYKS publishes colorectal cancer access times by stage. 2025 surgery averages: 19, 32 and 24 days. Radiotherapy: 69 days (first half of 2025). Shows a hospital district can publish dated cancer waits. https://www.tyks.fi/potilaille-ja-laheisille/hoidot-ja-tutkimukset/syopa/suolistosyovan-hoitoonpaasyajat (read, docs/research/context/09).
- HUS, TAYS, KYS and OYS: no published cancer wait figures found. docs/research/context/09 section 2.

**Confidence:** Medium on the four dates (official definitions, body text not read). Low on what hospital systems store per patient.

**What the doctor can add:** Which dates their record system (Apotti, Omni or Lifecare) keeps per patient, including referral arrival.

### Q4. Is the 6-week target still used?

**Short answer:** The 6-week maximum is in the 2010 STM report, but as a proposal, not a legal rule. We could not confirm it is still used in practice. Do not present it as the current target yet.

**Evidence**
- STM 2010:6, section 7.2 (pp. 51-53). Text extracted from the PDF by us on 2026-11-14: "Syöpäepäilyn vuoksi laaditun lähetteen saapumisesta ensimmäiseen hoitoon (leikkaus, lääke- tai sädehoito) saa kulua enintään 6 viikkoa." Translation: at most 6 weeks from referral arrival to first treatment (surgery, drugs or radiotherapy) for suspected cancer. https://www.iccp-portal.org/system/files/plans/selv_2010_6_syovan_hoito_verkko.pdf
- Same section: "Näin sitä koskevia määräaikoja ei aiemmin ole määritelty eikä niistä ole säädetty." Translation: no cancer deadlines had been set before, and none were set by law.
- Same section: the times are "ehdotukset" (proposals). "Aikarajat ovat aluksi ohjeelliset noin kahden vuoden ajan" (guidance for about two years), then they might be tightened "kuudesta neljään viikkoon" (from six to four weeks). Binding deadlines would need a law.
- Health Care Act 1326/2010: §51a (adult primary care, first treatment within 3 months) and §52 (specialist care: 3 weeks to start assessment, 6 months to treatment). No cancer term in the full text. docs/research/law/01-access-deadlines.md.
- THL Ohjaus 21/2016 (valid from 2017): one search snippet says 6 weeks from referral to first treatment (docs/research/law/07-verification.md line 27). Another search result showed no day target. Body not read. Conflict, unresolved.
- Strategy 2026-2035 press release wants care "saatavilla yhdenvertaisesti ja viiveettä" (available equally and without delay), with no day numbers. https://valtioneuvosto.fi/-/1271139/yhteinen-suunta-ihmislahtoiseen-ja-vaikuttavaan-syovan-ehkaisyyn-ja-hoitoon-kansallinen-syopastrategia-on-julkaistu
- Our guess: 6 weeks is neither binding nor publicly tracked today.

**Confidence:** High that the 2010 report sets 6 weeks as a proposal. Low that it is used now.

**What the doctor can add:** Whether they still work to 6 weeks, and whether anyone checks it.

### Q5. Does Finland fine providers that miss waits?

**Short answer:** An OECD (2020) excerpt says Finland used penalties for providers that miss maximum waits. In the Finnish law text we could read, we found complaints and supervision, not fines, and nothing cancer-specific. Treat "Finland fines providers" as unproven.

**Evidence**
- OECD 2020, "Waiting Times for Health Services: Next in Line", search excerpt (full report HTTP 403): "Maximum waiting times have been used in England and Finland as targets with penalties for providers not meeting them." Also: "sanctions for providers not making progress towards the targets in some cases and strong regulatory oversight." https://www.oecd.org/en/publications/waiting-times-for-health-services_242e3c8c-en/full-report/component-7.html
- Minilex, guarantee breach (hoitotakuun laiminlyönti), summary read: patient complaints go to the provider, then to AVI or Valvira. A complaint does not give compensation or change the treatment decision. https://www.minilex.fi/a/hoitotakuun-laiminlyonti
- Search summary of the same page: some hospital districts were ordered to fix waits "uhkasakon uhalla" (under threat of a fine). Amounts and legal basis not found. [source needed]
- A threat fine for dental care in Pohjanmaa was removed in 2026. Not cancer, not paid to anyone. https://www.sttinfo.fi/tiedote/72333207/ (search result only)
- Our guess: enforcement is supervision orders and threat fines by AVI or Valvira. We found no fine paid for a missed cancer wait.

**Confidence:** Medium that no cancer-specific fine exists (negative search). Low on the OECD wording (excerpt only).

**What the doctor can add:** Whether any county has ever faced an order or fine over cancer waits. AVI or Valvira would know.

### Q6. Why does Pirkanmaa record stage more often?

**Short answer:** Pirkanmaa's spread-data coverage was 72% in 2024, against 41.9% nationally (factsheet read). The registry says clinical notifications rose from 42% (2022) to 80% (2024). We found no outcome change for patients from the new workflow.

**Evidence**
- 2024 registry factsheet (read): spread data 41.9% nationally; Pirkanmaa 71.9%. https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html
- Registry article, 26 June 2025 (snippet; HTTP 403 when opened): notifications 42% (2022) to 80% (2024). The notification is built into the diagnosis entry. Built by CGI with the registry and Pirha. https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/
- Caution: 42% is also the national spread-data figure. docs/research/context/13-pirkanmaa-stage-effects.md, "Do not mix these numbers".
- Conflict: a Syöpäjärjestöt summary calls Sisä-Suomi the most complete area, yet gives Pirkanmaa 72% and Sisä-Suomi 60%. Unresolved (docs/research/context/13 section 3).
- No outcome found for Pirkanmaa: stage shift, time to treatment, survival or MDT decisions. This is an absence in our searches. docs/research/context/13 section 2.
- Comparison: a Danish national pathway showed no clear overall stage shift (OR 0.88, 95% CI 0.73 to 1.06, all cancers). Snippet. https://pmc.ncbi.nlm.nih.gov/articles/PMC4871309
- Our guess: better recording can move stage numbers with no change in patients.

**Confidence:** Medium that Pirkanmaa's coverage is well above national (factsheet read). Low on the 42% to 80% change (snippet). No evidence yet of patient benefit.

**What the doctor can add:** Did the recording change how they treated patients, or only the registry return?

### Q7. Would a GP use a cancer-risk prompt?

**Short answer:** We found no cancer-risk prompt in use in Apotti, Omni360 or Lifecare. Doctors often override alerts in other settings: drug alert override rates were 46% to 96% in one review. We found no number of prompts per day where doctors start ignoring them.

**Evidence**
- Apotti chose EBMEDS, which gives "reminders and warnings". No cancer red-flag rule named on public pages. https://www.duodecim.fi/english/?p=956 (2017) and https://www.duodecim.fi/ebmeds/?p=960. docs/research/context/12-gp-risk-tool.md line 31; docs/research/tech/02-gp-risk-decision-support.md line 25.
- Omni360 and Lifecare: vendor pages list decision support or guideline alerts. No cancer rule found. docs/research/context/12-gp-risk-tool.md lines 49-50 (snippets).
- No Finnish record-system cancer-risk alert found. docs/research/tech/02-gp-risk-decision-support.md line 31 (negative search).
- England, ERICA trial: electronic prompt when cancer risk is 2% or higher, patients 40+ (docs/research/context/11-risk-score-idea.md line 47). Protocol read; results not found. https://pmc.ncbi.nlm.nih.gov/articles/PMC10030284/
- Ancker et al. 2017 (112 primary-care clinicians, EHR data 2010-2013): clinicians overrode more when one patient got several alerts. Sources conflict on whether repeated exposure drives overrides. Full text not opened. https://psnet.ahrq.gov/issue/effects-workload-work-complexity-and-repeated-alerts-alert-fatigue-clinical-decision-support
- Drug alert override rates (not cancer prompts): Poly et al., JMIR Medical Informatics 2020, 23 studies, 46.2% to 96.2% (search summary). https://medinform.jmir.org/2020/7/e15653/PDF. Bittmann, Haefeli and Seidling: 49% to 100% in routine practice (search result). https://www.thieme-connect.com/products/ejournals/pdf/10.1055/s-0042-1748146.pdf
- ERICA nested GP interview study (snippet): prompts interrupted consultations. [source needed]
- Our guess: interruption during the visit, more than the daily count, is what makes doctors ignore prompts. Test this with the GP.

**Confidence:** Medium that override rates are high for drug alerts. Low for cancer prompts and for any daily limit.

**What the doctor can add:** How many prompts per day they would accept, and at what point in the visit they would read one.

### Sources we could not open

- Ohjaus 21/2016 full text (julkari login; CORE HTTP 403; STM HTTP 404).
- Registry Pirkanmaa article (HTTP 403).
- OECD 2020 full report (HTTP 403).
- Syöpärekisteri 2024 full report (HTTP 403, per docs/research/context/13).

## Desk answers: questions 8-14

Date: 2026-11-14. Desk research only. Questions from [06-expert-questions-spoken.md](06-expert-questions-spoken.md).

Terms: **NG12** = NICE guideline 12, the UK red-flag symptom list. **NKR** = Netherlands Cancer Registry. **PALGA** = Dutch pathology network. **MOC** = Belgian multidisciplinary oncology consultation (tumour board). **2WW** = UK two-week-wait urgent referral. **DLBCL** = diffuse large B-cell lymphoma. **Hilmo** = THL national hospital discharge register. **Pirha** = Pirkanmaa wellbeing county. **RAT** = risk assessment tool. **Our guess** = our reasoning, not a source.

Source tags: **[opened]** = page we read. **[snippet]** = search summary only. **[repo]** = a file in this repo, read in an earlier pass.

---

### Q8. Does your county have a fast track for suspected cancer from the health centre?

**Short answer:** No county fast track found. Yle MOT reports Finland has none.

**Evidence**
- Yle MOT says Finland "has no fast-track system for suspected cancer". [opened, via [repo 08](../research/context/08-primary-care-fast-lanes.md) section 1, https://yle.fi/a/74-20251023]
- Searches for Varha, TAYS, KYS, OYS and HUS suspected-cancer fast-track units found nothing. [repo 08 section 1]
- Pirkanmaa lung cancer route: urgent referral to the central hospital lung clinic, usually handled in 1-2 working days. [snippet, https://pirha.fi/documents/d/kehitysversio/keuhkosyopapotilaan-hoitopolku, via [repo 08](../research/context/08-primary-care-fast-lanes.md)] This is a lung-only urgent referral, not a fast track for all suspected cancers.
- HUS head and neck guide: GP should refer at once if malignancy is suspected. [snippet, same HUS PDF as in [repo 08](../research/context/08-primary-care-fast-lanes.md)]
- Desk search for 2026 found no new county fast track. [snippet, desk search]

**Confidence:** Medium. Search cannot prove a negative.

**What the doctor can add:** Is there a local urgent route from the health centre, and who runs it?

---

### Q9. Would the "about 50 days longer" public-route gap hold for lung, bowel or breast cancer?

**Short answer:** The 50-day number is the lymphoma paper's median gap (127 vs 76 days). We found no study of other cancers by route in Finland.

**Evidence**
- Kuitunen et al. 2026: 160 DLBCL patients, 7 hospitals. Median time to treatment 127 days for primary-care route vs 76 days for private or occupational route (n=48 vs 39, p=0.027). The gap is 51 days. [repo 04-cause-map, line 134](04-cause-map.md); [repo 08 section 5](../research/context/08-primary-care-fast-lanes.md)
- The deck's 207 vs 123 days are in the paper too (Figure 1, days from symptom to treatment). The paper's statistical test uses medians, 127 vs 76 days (p = 0.027). Say which one you quote. [repo research/law/08-inefficiencies.md line 45; [Kuitunen 2026](https://doi.org/10.1002/cam4.71920)]
- Route, not income or education, predicted delay in that cohort. [repo 05-issues-and-causes line 15]
- Other cancers: no Finnish or Nordic route comparison found for lung, colorectal or breast. [desk search, two agents]
- Yle MOT lung data (unpublished, Kuittinen): 155 days from symptoms to treatment. Patient 50+ days, primary care 41, specialist care 58. This is a time split, not a public vs private split. [opened, https://yle.fi/a/74-20251023, via [repo 08](../research/context/08-primary-care-fast-lanes.md)]
- Helsinki head and neck study: public primary care referred 36% of 2016 cases, rest came from private care. One city, one cancer, no intervals. [snippet, source needed for URL]

**Confidence:** High that the lymphoma numbers are right. Low for other cancers (none found).

**What the doctor can add:** Do lung, bowel or breast patients in their work come in through occupational or private care, and does that change how fast they reach treatment?

---

### Q10. Does anyone record how a patient came in?

**Short answer:** We found no routine record of entry route. The Kuitunen study recorded it for research only.

**Evidence**
- Kuitunen 2026 recorded first provider type (health centre, private, occupational, student) for the research cohort. [repo 08 section 5; repo 10-patient-delay line 71]
- Hilmo referral-source field: not found. The Hilmo guide mentions referral arrival and outgoing referral, but we did not get the field definitions. [desk search, low certainty; source needed for field list]
- Finnish Cancer Registry fields: the factsheet page returned HTTP 403 today. [opened today, https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html]
- Our guess: routine data do not carry the entry route, so the team cannot measure it nationally without a new field or a chart review.

**Confidence:** Low. Hilmo and Kanta field lists were not read.

**What the doctor can add:** Is the entry source (health centre, occupational, private) written anywhere in the chart, or only in a referral letter?

---

### Q11. How often does a hospital send a GP referral back?

**Short answer:** No Finnish rate found. Rules on what a referral must contain exist, but they are local.

**Evidence**
- No Finnish referral return or rejection rate for cancer found. [repo 08 section 3; desk search, two agents]
- HUS guide: the referral needs a clear summary. It warns against an ICD-10 C (cancer) code unless histology confirms cancer. [snippet, repo 08 section 3]
- HUS long-term pain referral guide: a referral is returned if required details are missing. This is a local rule, no rate. [snippet, https://kehitys.palveluketju.hus.fi/wp-content/uploads/2025/07/Liite-5-HUS-Pitkaaikaisen-kivun-hoidon-laheteohje.pdf]
- Helsinki city guidance lists required referral content. [snippet, https://www.hel.fi/fi/paatoksenteko-ja-hallinto/kaupungin-organisaatio/toimialat/sosiaali-terveys-ja-pelastustoimiala/yhteistyokumppaneille/ohjeita-sosiaali-ja-terveysalan-ammattilaisille]
- Lääkärilehti 2025 editorial on referral content: lead only, not found in desk search. [repo 08 section 3]
- Our guess: returns happen often enough that content rules exist, but no one publishes the count.

**Confidence:** Low.

**What the doctor can add:** How often do they get a referral back, and for what reason?

---

### Q12. Who sends the clinical report to the Cancer Registry? (Follow-up: is stage written but not sent?)

**Short answer:** Health care organisations must send it. The sender's role is not named in what we read. Nobody has published whether stage is written but not sent.

**Evidence**
- Health care organisations have a legal duty to send data on every cancer case, or strong suspicion of one, to the Cancer Registry. [repo 09 section 3, quoting https://syoparekisteri.fi/ilmoituspalvelu/, read in an earlier pass; page returned 403 today]
- A THL decision (THL/5273/5.03.00/2023) binds wellbeing counties to send the data. The annex was not readable. [repo 09 section 3]
- The clinical notification asks for spread at diagnosis, by TNM, stage or text. [repo 09 section 3]
- Share with spread data recorded (TNM, stage or free text): 42% nationally in the 2024 report (41.9% in its table), target 70%. Pirkanmaa 72%. [opened, https://www.verkkouutiset.fi/a/syopatiedoissa-isot-alueelliset-erot-yksi-seutu-erottuu/; factsheet in [repo 07](../research/context/07-stage-data-practice.md) gives 41.9%]
- No source says whether the gap is "not written" or "written but not sent". [repo 07 section 1]
- Pirkanmaa raised notifications from 42% (2022) to 80% (2024) by moving the clinical notification into the diagnosis entry in the IT system. [repo 13 lines 27 and 40; repo 07 line 142]
- Our guess: most of the gap is "written but not sent", because Pirkanmaa's fix was workflow, not new data. This is an inference, not a finding.

**Confidence:** Low to Medium on the sender. Low on the "written but not sent" split.

**What the doctor can add:** Who fills in the notification in their hospital, the treating doctor or a secretary? Is stage in the notes?

---

### Q13. Could stage be filled in on a short form at the tumour board, like in the Netherlands?

**Short answer:** The Netherlands does not appear to do this. Its registry staff record stage from records and pathology feeds. The closest form-at-a-meeting example is Belgium's MOC form.

**Evidence**
- NKR: "The recording of data in this database is performed by registration employees of IKNL." TNM stage is recorded. No tumour board form is mentioned. [opened, https://iknl.nl/en/ncr]
- NKR trained abstractors read stage from hospital records. Stage codes: pTNM first, cTNM if no surgery. [repo 02 Netherlands file, row 34, snippet]
- Diagnoses come in from PALGA pathology feed. Data managers enter extra info from the health record by hand. [repo 02 row 35; snippet, https://iknl.nl/en/about-iknl/annual-report-iknl-2019]
- Belgium: MOC form links the tumour board to the Cancer Registry. The MOC fee is tied to the registration form. [repo 02 section 7; snippet, INAMI page via repo 02 line 100]
- No study found that the MOC form raised stage completeness. [repo 02 line 109]
- Finnish tumour board: Pirkanmaa records clinical notifications inside MDT meetings. Breast reached 97%. No outcome data. [repo 13 line 42]

**Confidence:** Medium for the Netherlands. Low for Belgium's form details.

**What the doctor can add:** Does their tumour board already record stage in a coded field? If yes, a short form may be cheap to add.

**Correction for the team:** The question says "like in the Netherlands". The sources point to Belgium's MOC form for a meeting-linked stage form.

---

### Q14. Would a national list of warning symptoms help GPs more than a risk prompt?

**Short answer:** No evidence settles it. Finland has no national red-flag list. In the UK, the NG12 list exists, but we found no study of its effect. Prompt trials show no clear gain so far.

**Evidence**
- Finland has no national red-flag list for GPs. Consumer symptom lists exist, but they are not clinical guidance. [repo 08 section 4; desk search]
- UK NG12 lists symptoms by cancer site. [opened in search, https://www.nice.org.uk/guidance/ng12]. No study of NG12's effect on referral or diagnosis found. [desk search]
- ERICA (England cluster trial): prompt when risk is 2% or more for six cancers. Primary outcome is stage at diagnosis. Results not found. [repo 12 section 2a, protocol https://pmc.ncbi.nlm.nih.gov/articles/PMC10030284/]
- QCancer (BJGP 2019 survey): no difference in 2WW referrals (adjusted difference 3.1 per 100,000, 95% CI -5.5 to 11.7). Response 23%. [repo 12 section 2b, https://doi.org/10.3399/bjgp19X703745]
- Hamilton RAT pilot (2013): 304 more 2WW referrals, 270 more colonoscopies, 10 more colorectal cancers. Stage not shown. [repo 12 section 2c, snippet]
- Alert fatigue: a 2025 qualitative review found many GP reminders are ignored. [snippet, https://jmir.org/2025/1/e62763/PDF]
- Our guess: a list is cheaper and harder to ignore than a prompt, but a list does nothing without a GP acting on it. A prompt can at least target a patient. Neither has been tested for time or stage in Finland.

**Confidence:** Low.

**What the doctor can add:** Which symptoms would they want on a list? Would they click a prompt, and how many a day before they stop?

## Desk answers: questions 15-21

Prepared 2026-11-14 from desk research only. Check each answer with the doctor.

Key:
- "Q15" means question 15 in `06-expert-questions-spoken.md`.
- OPENED = we opened the page or text ourselves. SNIPPET = search summary only. REPO = from an earlier file in this repo (path given), not re-checked here.
- FIT = faecal immunochemical test (blood in stool). CA-125 = blood marker used in ovarian cancer. CT = computed tomography scan. PPV = positive predictive value. IQR = middle half of the values.

---

### Q15. Would a GP-booked CT from a risk prompt save time, or just move the queue?

**Short answer:** Our guess: it saves time only if the GP can order the CT directly and the scanner has spare slots. No Finnish wait data exists to test this.
**Confidence:** Medium (GP ordering limits), Low (time effect)

**Evidence**
- Oulu (PPSHP) rule: CT and MRI need a specialist referral, or a note that a specialist was consulted. Urgent CT is mostly done through emergency X-ray. SNIPPET. REPO `docs/research/context/08-primary-care-fast-lanes.md`, section 2.
- No national rule for GP-ordered CT was found. Kela's reimbursement page limits some CT and MRI reimbursements to specialist orders, but it does not say how this applies in public care. OPENED: https://www.kela.fi/yhteistyokumppanit-terveydenhuolto-sairaanhoitokorvaukset-tutkimus-ja-hoito-radiologiset-tutkimukset-ja-toimenpiteet
- Finland has the lowest primary-care CT access in the Nordics, per an Acta Oncologica 2025 survey. SNIPPET: https://www.helsinki.fi/fi/uutiset/terveys/miksi-suomessa-keuhkosyopaan-kuollaan-aiemmin-kuin-pohjoismaissa
- A UK risk tool in GP software (QCancer, BJGP 2019) did not change urgent (two-week-wait) referrals: adjusted difference 3.1 per 100,000 (95% CI -5.5 to 11.7). SNIPPET/abstract: https://pmc.ncbi.nlm.nih.gov/articles/PMC6592323/ . REPO `docs/research/context/12-gp-risk-tool.md`, section 2b.

**What the doctor can add:** Can a health-centre doctor here order a CT without a specialist note, and how long is the CT wait today?

---

### Q16. Do you use FIT or CA-125 when a patient comes in with symptoms?

**Short answer:** We found no Finnish guidance on either test for symptomatic patients in primary care. The real answer is the doctor's own habit.
**Confidence:** Low

**Evidence**
- Finnish screening FIT threshold is 25 micrograms Hb per gram since 2022 (screening only). SNIPPET, cut-off not confirmed. REPO `docs/research/context/12-gp-risk-tool.md`, section 3.
- Käypä hoito (Finnish guideline): lung and prostate referral triggers exist. No colorectal or ovarian referral criteria were found. SNIPPET/NOT FOUND. REPO `docs/research/context/12-gp-risk-tool.md`, section 1b.
- A 2025 Lääkärilehti editorial calls FIT central to structured symptom assessment. SNIPPET, no URL kept. [source needed]
- European joint guideline (2022): FIT at 10 micrograms Hb per gram or more to prioritise urgent investigation. SNIPPET from a news summary, guideline not opened: https://www.healio.com/news/gastroenterology/20220915/european-societies-release-joint-guideline-for-use-of-fit-in-colorectal-cancer-diagnosis
- CA-125: the UK NICE guideline (NG12) offers it to women with persistent abdominal symptoms. UK, not Finnish. SNIPPET: https://www.nice.org.uk/guidance/ng12/chapter/Recommendations
- A trial of 78,216 women aged 55 to 74 found CA-125 screening did not reduce ovarian cancer deaths. SNIPPET: https://evidence.unboundmedicine.com/evidence/view/infoPOEMs/427335/1/Screening_CA_125_and_transvaginal_ultrasound_does_not_reduce_ovarian_cancer_mortality
- A 2020 Turku thesis says CA-125 is not specific on its own. SNIPPET: https://utupub.fi/bitstream/10024/150369/1/AnnalesD1503Salminen.pdf

**What the doctor can add:** For a 60-year-old with bloating or blood in stool, which test do you order first, and what result sends them on?

---

### Q17. Would Catalonia's one form and one named hospital work here?

**Short answer:** The idea fits the gap we see, if counties agree on one shared form and one named hospital per health centre. Catalonia's target is a first test within 2 weeks and treatment in about 30 days on average. We found no outcome evaluation.
**Confidence:** Medium (how it works), Low (results)

**Evidence**
- Catalonia's rapid diagnosis circuit now covers 11 tumour types (announced 31 Dec 2025). One electronic referral form in the shared record. Each primary-care team has one reference hospital. First test and report within 2 weeks. Treatment start about 30 days on average. OPENED: https://www.3cat.cat/3catinfo/amplien-a-11-tumors-el-circuit-de-diagnostic-rapid-per-facilitar-lacces-al-tractament-en-30-dies/noticia-amp/3387454/
- 2009 figures: mean 30 to 37 days from primary-care suspicion to treatment (breast 32, colorectal 30, lung 37). SNIPPET, full text behind login: https://doi.org/10.1038/bjc.2011.308 (Prades et al., BJC 2011)
- No PPV or stage data for the Catalan circuit was found. REPO `docs/research/countries/04-europe-other.md`, Catalonia section.
- Finland has no fast track for suspected cancer from primary care (Yle MOT, Oct 2025). REPO `docs/research/context/08-primary-care-fast-lanes.md`, section 1.
- Our guess: a shared form across counties needs county agreements. Law already allows cross-county hospital choice (Health Care Act §47-48). REPO `docs/research/law/00-synthesis.md`, item 5.

**What the doctor can add:** Would one referral form to one named hospital work across county borders, or does the county boundary break it?

---

### Q18. If we showed a county a map of cancer waits, who would act?

**Short answer:** Our guess: county cancer or hospital leaders would act on their own numbers next to a national target. Some fixes would need national steering. No official county wait table exists yet to put on the map.
**Confidence:** Low

**Evidence**
- A Finnish government report warns that wellbeing counties may give unequal access because of regional segregation. SNIPPET: https://valtioneuvosto.fi/en/-/1271139/ministry-of-social-affairs-and-health-report-wellbeing-services-counties-handle-core-tasks-well-but-with-a-risk-of-unequal-access-to-services-due-to-regional-segregation
- The national cancer strategy 2026-2035 says recommendations and pathways are not coordinated nationally, and this keeps regional inequality. REPO `docs/research/law/06-workforce-strategy.md`, line 158.
- Counties decide on new cancer drugs one by one, with no uniform criteria. REPO `docs/research/law/00-synthesis.md`, item 4, and `docs/research/law/08-inefficiencies.md`, I-15.
- Trust risk: crude and adjusted figures can differ a lot (see Q21). A map without case mix would be challenged. Our guess.

**What the doctor can add:** Who in your county reads cancer numbers each quarter, and what would make them open a map?

---

### Q19. Is there a table of waits, stage or referrals by county?

**Short answer:** No open county table of cancer waits or referrals was found. Several open county cancer tables exist, and the lung report gives timing by area. Stage by county is not confirmed as open.
**Confidence:** High (no waits table found), Medium (list below)

**Open tables we checked**
1. Sotkanet, screening attendance by wellbeing county (indicators 6103 colorectal, 3621 breast, 3620 cervical). JSON, OPENED (HTTP 200): https://sotkanet.fi/rest/1.1/json?indicator=6103&genders=total&years=2024&regions= . Licence (CC BY 4.0) not checked. REPO `docs/research/context/02-data-landscape.md`, row 6.
2. Sotkanet, indicator 3625, five-year survival by county. JSON, OPENED (24 records, 2024, region codes only): https://sotkanet.fi/rest/1.1/json?indicator=3625&genders=total&years=2024&regions= . The indicator title is not in the response, so confirm it is breast before use.
3. Sotkanet indicator list (3,797 indicators), to search for other cancer or wait measures. OPENED (HTTP 200): https://sotkanet.fi/rest/1.1/indicators
4. Statistics Finland, cancer deaths by county and cause (table 13u5). Table metadata OPENED, data not pulled: https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px
5. Finnish Cancer Registry, lung cancer report, section 4.1. Median days from diagnosis to first treatment by cooperation area (surgery: 13.5 days in North, 46.0 days in South). OPENED (text): https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf
6. Finnish Cancer Registry, breast screening statistics with county, cooperation area and education. OPENED in part (HTTP 200, page truncated in our read): https://stats.cancerregistry.fi/joukkistilastot/rinta.html . REPO `docs/research/context/02-data-landscape.md`, row 1.
7. Sotkanet, oncology and radiotherapy outpatient visits (indicator 2475). REPO only, not opened in this pass: https://sotkanet.fi/rest/1.1/json?indicator=2475&genders=total&years=2023&regions=

**Not found as open tables**
- County referral-to-treatment waits for cancer.
- County stage at diagnosis. National spread-data recording (TNM, stage or free text) is 41.9% (2024 factsheet). REPO only: https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html
- THL Sampo access-to-treatment data exists, but we did not open it or check for cancer. SNIPPET: https://www.hus.fi/en/patient/patient-guide/your-rights-patient/access-treatment-specialist-medical-care

**What the doctor can add:** Which of these do you use, and is there a Sampo or hospital extract with cancer waits by county?

---

### Q20. Can you give one cancer treated differently in two counties?

**Short answer:** Yes, for lung cancer. Surgery came a median 13.5 days after diagnosis in the North and 46 days in the South. The data shows timing, not the reason. The areas are five cooperation areas, not counties.
**Confidence:** Medium

**Evidence**
- Finnish Cancer Registry lung report, section 4.1 (text checked by us): median diagnosis to surgery 13.5 days in North Finland (IQR 0.0 to 44.0) and 46.0 days in South Finland (IQR 33.0 to 63.0). Radiotherapy timing also varied by area. https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf
- Lung treatment mix differs by region (qualitative, no days or percentages): more surgery in central Finland, more first-line radiotherapy or drug therapy in East and North Finland. Based on the registry report, read by our lookup agent: https://www.verkkouutiset.fi/a/keuhkosyovan-hoidossa-on-suuria-alueellisia-eroja/
- New cancer drugs are adopted county by county, with no uniform criteria. REPO `docs/research/law/08-inefficiencies.md`, I-15. National-only drug statistics: https://www.hila.fi/toiminta-ja-organisaatio/tilastot/2024-2/ (OPENED).
- Our guess: the lung gap may come from tumour board timing, scan access or surgical capacity. Not checked.

**What the doctor can add:** Is the lung gap about surgical teams, tumour boards, or waiting for the scan?

---

### Q21. People with less education get surgery less often, 36% against 51%. What is behind that?

**Short answer:** Our guess: age, other illnesses, stage and the route into care explain part of it. The paper does not give a clear cause. The raw shares look much bigger than the paper's adjusted odds ratios, so the 36 vs 51 needs a caveat.
**Confidence:** Medium (the numbers are in the paper), Low (the cause)

**Evidence**
- Zai et al. 2025 (BMJ Public Health), Results, read by us in full text: "the highly educated were always more likely to receive the treatment ... surgery (high: 51%, low: 36%)". Radiotherapy 25% vs 14%, chemotherapy 24% vs 15%. These are shares, and the denominator is not stated in that sentence. https://pmc.ncbi.nlm.nih.gov/articles/PMC12551501/
- Same paper, surgery models (OPENED): odds ratio for low vs high education 0.91 for men (all cancers) and 0.94 for women. The gap is much smaller than the raw shares. We did not confirm which covariates the surgery models use.
- Same paper, limitations (OPENED): no data on other chronic illnesses. Lower-education patients may have had more conditions, which could affect treatment decisions.
- Norway, lung cancer (Nilssen et al., Int J Cancer 2016): lower education predicted no surgery, and comorbidity was independently linked to surgery. SNIPPET, 24,324 patients: https://doi.org/10.1002/ijc.29875
- Route into care: a small Finnish lymphoma study (160 patients) found the route (public or occupational), not education or income, predicted delay. REPO `docs/research/RESEARCH-SUMMARY.md`, Kuitunen 2026.
- Repo files disagree on whether the 36/51 figures were checked. The figures first appear in the AstraZeneca deck (REPO `docs/tracks/astrazeneca-insights-deck.md`, pp. 14-15). We now confirm them in the paper text.

**What the doctor can add:** In your clinic, do age, fitness for surgery and stage at the first visit explain most of the gap?

