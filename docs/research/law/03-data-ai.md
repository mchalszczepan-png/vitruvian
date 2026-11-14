# Law 03 — Data and AI law that limits or enables cancer-pathway monitoring (Finland / EU)

Scope: Junction 2026 AstraZeneca track. Public, aggregate data only (no patient-level data).
Date of research: 2026-11-13.

**Tools and limits (read first):**
- context.dev search and scrape hit the shared rate limit (10 units/min) early. Per instruction, I switched to WebSearch/WebFetch.
- WebFetch on Finlex statute pages (552/2019, 703/2023, English Finlex page) returned site navigation only, **not the statute text**. So every section reading below comes from secondary sources (Findata, Kanta, THL, STM, EUR-Lex/EC pages, search summaries). Section numbers are as cited by those sources. **Re-check each § against Finlex before quoting it on a slide.**
- Where a claim comes only from a search summary or my background knowledge, it is marked **UNVERIFIED**.

Abbreviations: THL = Finnish Institute for Health and Welfare. Findata = national health-data permit authority (tietolupaviranomainen). Kanta = national patient-record services. HDAB = health data access body (EHDS term). MDR = EU Medical Device Regulation 2017/745. AI Act = Regulation (EU) 2024/1689. EHDS = European Health Data Space Regulation (EU) 2025/327. Hoitotakuu = national treatment-guarantee deadline.

---

## 1. Key laws

| # | Law (number) | Section(s) | What it says (one line) | URL |
|---|---|---|---|---|
| 1 | Laki sosiaali- ja terveystietojen toissijaisesta käytöstä, "toisiolaki" (552/2019) | §§ 6, 11, 35, 43, 45 (as cited by sources; [source needed]); § 41 covers *tietojohtaminen* per a 2021 statement (UNVERIFIED text) | Sets when health/social data may be used for purposes other than care (research, statistics, development, education, **tietojohtaminen = knowledge management**, supervision, authority planning). Permits go to Findata when data come from several controllers, Kanta, or private providers; a single public controller can grant its own permit. | Finlex: https://www.finlex.fi/en/legislation/2019/552 (nav only when fetched) · Findata overview: https://findata.fi/en/services-and-instructions/legislation/ |
| 2 | Toisiolain muutokset (HE 87/2025 vp; StVM 15/2025 vp) | Amendments | Passed 19.11.2025, confirmed 5.12.2025. Clinical-research provisions in force **1.1.2026**; all other amendments in force **1.5.2026**. Stated aims: more flexible permits/requests/datasets, transfers to secure foreign environments, and a fee for work on data requests. | https://valtioneuvosto.fi/-/1271139/toisiolain-muutokset-on-vahvistettu-ja-ne-tulevat-voimaan-2026 · fee: https://stm.fi/se/-/toisiolain-mukaisista-tietopyynnoista-aiheutuvasta-tyosta-voi-peria-maksun |
| 3 | Laki sosiaali- ja terveydenhuollon asiakastietojen käsittelystä, "asiakastietolaki" (703/2023) | § 53 (inter-provider right of access); § 102 (transition) | In force 1.1.2024. Sharing between social and health care is based on the law itself (§ 53); Kanta is the primary channel. Luovutuslupa (sharing permit) for inter-provider access must be in use by **1 March 2027** (Kanta source). | Law: https://www.finlex.fi/en/legislation/2023/703 · Kanta overview: https://www.kanta.fi/systemutvecklare/aktuellt/asiakastietolaki-kokoaa-yhteen-sote-tiedonhallinnan-s%C3%A4%C3%A4d%C3%B6kset · Kanta info (§ 53 basis): https://www.kanta.fi/documents/portlet_file_entry/20143/Kanta-info+materiaalit_26092025.pdf · 1 March 2027 date: https://www.kanta.fi/documents/portlet_file_entry/20143/08.+Tiedonsaantioikeus+sosiaali-+ja+terveydenhuollon+v%C3%A4lill%C3%A4.pdf |
| 4 | Terveydenhuollon valtakunnallisista henkilörekistereistä annettu laki (556/1989) and asetus (774/1989) | Asetus § 1 (list of registers incl. *syöpärekisteri*), § 7 (cancer register content) | Basis for national health registers, including the cancer register. § 7 says the cancer register holds patient identity data, cancer data, death-certificate data, and screening data. **Status: old text, may be superseded — UNVERIFIED whether still in force.** | https://finlex.fi/fi/laki/alkup/1989/19890774 |
| 5 | Cancer notification duty (THL / Syöpärekisteri) | Statutory duty since 1961 (per THL) | All health professionals, hospitals, and pathology/haematology labs must report each new cancer case when diagnosed or strongly suspected. Registry run by Suomen Syöpäyhdistys for THL. | https://blogi.thl.fi/syopien-ilmoittamisen-haasteisiin-vastataan/ |
| 6 | Terveydenhuoltolaki (1326/2010) | § 52 (specialised care), § 51c (specialised care via primary care); § 50 and § 50a not checked | Treatment guarantee for specialist care (corrected: the clocks are in §52 and §51c, not §50). Assessment must start within **3 weeks** of a referral (lähete) arriving at the unit; if specialist review or imaging is needed, the assessment must finish within 3 months (§52). Treatment must start within **6 months** of the need being found (§52). For specialised care via primary care (§51c), treatment is due within 3 months of assessment, and the limit may be exceeded by up to 3 months for justified reasons. | Finlex 1326/2010, §51c and §52 (text read 2026-11-14): https://www.finlex.fi/fi/lainsaadanto/2010/1326 · EV 150/2022: https://www.eduskunta.fi/pdf/EV+150/2022 |
| 7 | Hilmo / AvoHilmo (THL national care reporting) | Legal basis **UNVERIFIED** ([source needed]) | Mandatory provider reporting of care data to THL (inpatient and outpatient). Purchasers of purchased services must make sure those services are reported. THL 2023 draft decision: no change to content; data kept permanently. | https://www.innokyla.fi/sites/default/files/2025-11/Perusterveydenhuollon%20hoitoonp%C3%A4%C3%A4sytietojen%20kehitt%C3%A4minen_2.pdf (PDF unreadable via WebFetch) · AvoHilmo handbook: via THL site (URL not fetched) |
| 8 | EU GDPR (Reg. 2016/679) | Art. 6(1)(e), Art. 9(2)(g)–(j) | Health data are a special category. Art. 9(2)(h) covers care and management of health systems; (i) public-health interest; (j) research/statistics with safeguards. Findata's own notice cites 6(1)(e) and 9(2)(g) for its permit processing. | Findata privacy notice: https://findata.fi/wp-content/uploads/sites/3/2020/02/955905e7-henkilotietojen-kasittelyseloste-tietopyynnot-sosiaali-ja-terveysalan-tietolupaviranomainen-findata.pdf · Regulation: https://eur-lex.europa.eu/eli/reg/2016/679/oj (article wording **UNVERIFIED** here, from memory; [source needed]) |
| 9 | AI Act, Reg. (EU) 2024/1689 + "AI Omnibus" (Reg. (EU) 2026/1744, per EUR-Lex index) | Art. 6(1), Annex I (product law incl. MDR), Annex III | Prohibitions and AI literacy from 2.2.2025; GPAI from 2.8.2025. **Annex III high-risk: 2.12.2027. Annex I high-risk (product-embedded, incl. MDR-class devices): 2.8.2028.** Omnibus publication date conflicts across sources (one says OJ 24.7.2026, in force ~27.7.2026) — verify on EUR-Lex. | https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai · https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ%3AL_202601744 |
| 10 | MDR, Reg. (EU) 2017/745, Annex VIII Rule 11 | Rule 11 (+ MDCG 2019-11 Rev.1, June 2025) | Software that gives information used for diagnostic or therapeutic decisions is a device; default Class IIa, higher if a wrong decision could cause serious or irreversible harm. Classification depends on intended purpose. Commission proposed a Rule 11 revision in Dec 2025 (COM(2025) 1023). Exact class wording **UNVERIFIED** from source; check Annex VIII text. | MDCG 2019-11 Rev.1 summary: https://gmpinsiders.com/mdcg-2019-11-rev1-mdr-ivdr/ · Rule 11 overview: https://casrai.org/guides/eu-mdr-rule-11 · COM(2025) 1023 (Commission proposal, Dec 2025): https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025PC1023 · Authority: Fimea (Finland) — role confirmed by general knowledge only, **UNVERIFIED** (https://www.fimea.fi, not fetched) |
| 11 | European Health Data Space, Reg. (EU) 2025/327 | Ch. IV (secondary use), HDAB rules | Published OJ 5.3.2025, in force 25.3.2025. **Secondary use applies from 26.3.2029** for most data categories (incl. EHR data); **26.3.2031** for others (e.g. genetic data). HDABs must be ready to receive applications by those dates. Commission implementing acts due by 26.3.2027. | https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en · FAQ: https://health.ec.europa.eu/document/download/4dd47ec2-71dd-49fc-b036-ad7c14f6ed68_en?filename=ehealth_ehds_qa_en.pdf |

---

## 2. Inefficiencies in the law that slow detection and fixing of cancer-care gaps

Each row: rule → why it hurts → pathway stage → evidence → confidence.

| # | Rule | Why it hurts | Pathway stage | Evidence (URL) | Confidence |
|---|---|---|---|---|---|
| 2.1 | Multi-controller or Kanta-based health data for secondary use needs a **Findata permit**, not a county decision. | A county cannot link its primary-care referrals with specialist and registry data without a permit route. The national view (cross-county gaps) is exactly the case that goes to Findata. Permit timelines are not verified here. | Referral (primary → specialist), diagnosis, treatment start | Findata: "Findata grants data permits ... when the application concerns data from several public health and social sector data controllers ... data stored in the Kanta Services" — https://findata.fi/en/services-and-instructions/legislation/ | High (routing) · Low (timelines, UNVERIFIED) |
| 2.2 | A single public controller can use its **own** register data via its own permit decision, but only if the request does not link to other controllers. | Forces a split: county-only analysis is fast; any cross-county or cross-setting monitoring needs Findata. The line between "own" and "linked" is easy to cross by accident. | Referral, diagnosis | Findata Loppuraportti: "Jos tietolupahakemus kohdistuu vain yhden julkisen ... rekisterinpitäjän ... tietolupahakemus osoitetaan kyseiselle julkiselle rekisterinpitäjälle" — https://findata.fi/wp-content/uploads/sites/13/2022/07/Loppuraportti-toisiolain-tulkinnat-tyopajasarja.pdf | Med |
| 2.3 | Inter-provider sharing via Kanta is tied to a **luovutuslupa** (sharing permit) and client informing; the rollout deadline is 1 March 2027. | Until the permit/informing model is live everywhere, referral data between primary and specialist care can be missing or delayed. Regional pilots (e.g. Uusimaa) used interim rules. | Referral (primary → specialist) | Kanta: "luovutuslupa tulee ottaa käyttöön viimeistään 1 päivänä maaliskuuta 2027" — https://www.kanta.fi/documents/portlet_file_entry/20143/08.+Tiedonsaantioikeus+sosiaali-+ja+terveydenhuollon+v%C3%A4lill%C3%A4.pdf · Uusimaa interim: https://www.kanta.fi/documents/d/guest/asiakas-ja-potilastietojen-luovutustenhallinnan-yleiskuvaus-v-2-1 | High (dates) · Med (effect) |
| 2.4 | Cancer registry notification is mandatory, but the **completeness and timeliness** of notifications are only reported for older periods. | A 2002 validation (trial cohort, 1985–97 data) found that 95% of cases were notified within **0.9 years**, with longer delays for lung and pancreatic cancer. So a registry-only monitor lags by many months. | Diagnosis (and detection) | Validation study: https://pubmed.ncbi.nlm.nih.gov/12234031/ · 2017 quality review (completeness 96% solid tumours, 86% non-solid; timeliness figures not seen): European Journal of Cancer, vol 77, pp 31-39, DOI 10.1016/j.ejca.2017.02.017 (seen in a search snippet; page not opened). (corrected: the URL first recorded here, article/view/26654, is the 2002 validation paper, not this review, and the review is in European Journal of Cancer, not Acta Oncologica.) | Med (old data) |
| 2.5 | The registry content (per the 1989 decree) covers identity, cancer, death-certificate and screening data. It does **not** list referral, diagnosis-date-to-treatment, or treatment-start dates. | No national, legally required timestamps for referral receipt, specialist assessment, or treatment start in the cancer register. A pathway-timing KPI cannot be built from the registry alone. | Referral, diagnosis → treatment | Asetus 774/1989 § 7: https://finlex.fi/fi/laki/alkup/1989/19890774 (old text, status UNVERIFIED) · no statute found that requires these timestamps (search only; **UNVERIFIED negative**) | Med (for the registry) · Low (for the wider absence claim) |
| 2.6 | Treatment-guarantee clock starts at referral arrival. The specialised-care treatment limit is 6 months after the need is found (§52). The +3 month justified-delay extension applies to specialised care via primary care (§51c), not to §52 (corrected: the earlier "3 or 4 months" conflict came from wrong section numbers). | The justified-delay exception makes it hard to tell a true breach from an allowed delay in a monitor, and the exception is in §51c only. | Referral → specialist assessment → treatment start | Finlex 1326/2010 §51c and §52: https://www.finlex.fi/fi/lainsaadanto/2010/1326 · EV 150/2022: https://www.eduskunta.fi/pdf/EV+150/2022 | High (law text) · Med (how the exception is applied in practice) |
| 2.7 | Data requests for secondary use can be **charged** (fee rules added in the 2026 amendments). | Fees and cost reporting add friction and cost for a county or a small academic team. Amounts and criteria are not found. | All stages (cost of access) | STM: https://stm.fi/se/-/toisiolain-mukaisista-tietopyynnoista-aiheutuvasta-tyosta-voi-peria-maksun · valtioneuvosto: https://valtioneuvosto.fi/-/1271139/toisiolain-muutokset-on-vahvistettu-ja-ne-tulevat-voimaan-2026 | High (fee exists) · Low (amount, UNVERIFIED) |
| 2.8 | Permit-based access timelines are long and phased: EHDS secondary use applies from **2029 (most data) and 2031 (others)**. | Any EU-harmonised cross-border or pooled-data route is years away. National Findata routes are the only near-term option. | Monitoring infrastructure | https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en | High |
| 2.9 | The MDR Rule 11 class for decision-support software depends on the **intended purpose and harm level**, and the rule is being revised (Dec 2025 proposal). | Any tool that tells a clinician what to do for a patient risks a device class; uncertainty slows adoption by health centres and counties. | Detection, referral triage | MDCG 2019-11 Rev.1 (June 2025): https://gmpinsiders.com/mdcg-2019-11-rev1-mdr-ivdr/ · Rule 11 overview: https://casrai.org/guides/eu-mdr-rule-11 | Med |
| 2.10 | AI Act high-risk dates moved (Annex I to 2.8.2028; Annex III to 2.12.2027), and the omnibus publication date is disputed in sources. | Planning horizon for an AI monitoring tool is unclear; vendors may delay compliance. | Any AI-based stage | https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai | High (Annex dates) · Med (omnibus status) |

---

## 3. Ways to work WITH the current law

### 3a. What an AI tool can do today with public aggregate data (no permit)

- Use published aggregate statistics (THL, Syöpärekisteri public tables, Sotkanet-type indicators). Aggregate, non-personal data is outside the toisiolaki permit flow ([source needed]). Requests for aggregated THL statistics go through a separate service: https://www.suomi.fi/services/data-request-to-obtain-aggregated-statistics-created-from-healthcare-and-social-welfare-data-the-national-institute-for-health-and-welfare-thl/61b15da8-da90-401f-92a8-310b2e8c1014 · Confidence: **Med** (I did not read the service terms).
- Build trend, comparison and early-warning logic on those aggregates, **with small-cell suppression** (e.g. hide counts below a safe minimum). Threshold **UNVERIFIED** ([source needed]); check THL's own rule.
- Explain gaps by region using published indicators, and show the limit: aggregates cannot show where in the pathway a delay happens. That needs a pathway-stage data source.

### 3b. What needs a permit

- Any linked, record-level or pseudonymised analysis across providers or counties, or Kanta-based data: **Findata permit** (toisiolaki). Source: https://findata.fi/en/services-and-instructions/legislation/
- Registry record-level data (e.g. cancer register extracts): THL is the controller and its register data are covered by toisiolaki ([source needed]); the THL route (own decision vs Findata) is **UNVERIFIED** for the cancer register specifically. THL's registry-data decisions are listed at https://thl.fi/aiheet/tiedonhallinta-sosiaali-ja-terveysalalla/maaraykset-ja-maarittelyt/hallintopaatokset (not read in full).
- Anything that identifies a patient, even indirectly: GDPR special-category rules (Art. 9) plus the toisiolaki permit. Not in scope for this challenge (brief: public aggregate only).

### 3c. How a county could run pathway monitoring on its own data

- **Legal route (most likely):** the county acts as controller of its own records. Under toisiolaki the county may use its own data for *tietojohtaminen* (knowledge management) and planning, which Findata lists as a stated purpose (https://findata.fi/wp-content/uploads/sites/13/2023/03/2023-03-15-infotilaisuus-hyvinvointialueille.pdf). **Whether this needs no permit at all, or only the controller's own permit decision, is UNVERIFIED** — the § 41 text could not be read, and the Findata statements point to "own controller" handling for single-register requests (see 2.2).
- Keep it single-controller: one county's own register, no linkage to Kanta or other counties. Any cross-county view goes through Findata.
- Pathway timestamps (referral received, specialist assessment, first treatment) must come from the county's own EHR or referral-management records. Confirm with the county which fields exist (not a legal fact; implementation question).
- Rule for the demo: state "own data, aggregate outputs, no patient-level view" on the slide, and point to the permit route for national use.

### 3d. Staying outside MDR / AI Act high-risk scope (or what it takes to be inside)

To **stay outside** (reasoned from Rule 11 and AI Act Annex I/III, not verified against Fimea guidance):
- No patient-level output. Outputs are aggregate, population-level indicators and recommendations for **management** (where to add capacity), not for an individual's diagnosis or treatment.
- Intended purpose written down as administrative and planning support. Avoid words like "diagnose", "recommend treatment", "triage patients" in the product description.
- No automated decision about a patient, and no clinician-facing alert that changes a clinical decision for one patient.
- Document the rule-11 reasoning in a short note (intended purpose, output level, who uses it).

To be **inside** (what it takes if the product drifts):
- Clinical decision software for an individual → MDR Class IIa or higher (Rule 11), notified body, Fimea registration (**UNVERIFIED process details**).
- Such software that is also an AI system in a product covered by MDR → AI Act Annex I high-risk, from **2.8.2028** (per the omnibus; verify).
- Annex III use (e.g. AI for access to essential services, if it decides who gets care) → high-risk from **2.12.2027**. **UNVERIFIED** whether that category fits a care-pathway tool; likely not if outputs are aggregate.

---

## 4. Open questions for AstraZeneca mentors

Ranked, with the mentor best placed to answer (names from the brief):

1. **Own data vs Findata (for a county pilot):** Can a wellbeing services county run pathway KPIs on its own records under *tietojohtaminen* without a Findata permit, and does the county need its own permit decision? (Kaisa Kaitila, Medical Affairs; Joanna Tuormaa, Business Excellence)
2. **Pathway timestamps:** Which dates are actually recorded (referral received, specialist assessment, first treatment) and in which system — Kanta, Hilmo, county EHR, or the registry? Is there any national requirement to record them? (Hanna Toivola, Diagnostics)
3. **Registry timeliness:** What is the current registry notification lag for breast, colorectal, lung and prostate cancer? That decides whether a registry feed can support a "current" monitor or only a retrospective one. (Hanna Toivola)
4. **Hoitotakuu:** The law text sets 6 months for specialised treatment (§52). Does the county record the justified-delay exception (§51c), and how? (Kaisa Kaitila)
5. **Device boundary:** Would AstraZeneca's medical-affairs team accept a management-level tool (no patient output) as out of MDR scope? Does AstraZeneca have a Fimea or notified-body view on Rule 11 for similar tools? (Kaisa Kaitila)
6. **Fees and timelines:** What do Findata permits cost and how long do they take in practice, for a pilot? (Laura Aaltonen, Marketing / Joanna Tuormaa)
7. **Small-cell suppression:** What minimum cell size does THL or the registry use for public tables, so the demo follows the same rule? (Hanna Toivola)
8. **Partner route:** For the follow-up project with a county, which data-access route do they expect (own permit, Findata, or a Kanta-based view) and who signs it? (Joanna Tuormaa)

---

## Unverified items (summary)

- § 41 toisiolaki text on own-data use (tietojohtaminen): **UNVERIFIED** (Finlex text not readable via WebFetch).
- Current status of 556/1989 and 774/1989 (cancer register law): **UNVERIFIED**.
- Hilmo / AvoHilmo legal basis (any statute number): **UNVERIFIED**. The 159/2007 name appeared only in a search summary as background knowledge, not checked.
- Terveydenhuoltolaki § 50 and § 50a (1.10.2025 amendment): **not checked**. The hoitotakuu clocks are now read from §§ 51c and 52 (Finlex), so the 3-vs-4-month conflict is closed.
- Whether HE 159/2025 (care follow-up as a service) changes timestamp recording: **UNVERIFIED** (summary only).
- Decentralised permit option in the 2026 toisiolaki amendment: **UNVERIFIED** (one search summary says yes; the STM/valtioneuvosto page does not mention it).
- Omnibus publication and entry-into-force dates (2026/1744): **UNVERIFIED**, sources disagree.
- GDPR Art. 9(2)(h)–(j) wording: **UNVERIFIED** (from memory).
- Fimea's role for MDR software: **UNVERIFIED** (general knowledge).
- Small-cell suppression threshold used by THL: **UNVERIFIED**.
- Permit processing times and fee amounts: **UNVERIFIED**.
- Innokylä "hoitoonpääsytietojen kehittäminen" PDF (Nov 2025): could not read text via WebFetch (binary PDF).

## Recommended next checks (for the team)

1. Read toisiolaki §§ 6, 11, 35, 41, 43, 45 on Finlex (ajantasainen), and HE 87/2025 vp section on § 41.
2. Read asiakastietolaki §§ 53 and 102 on Finlex; confirm the 1.3.2027 date in the Kanta notice.
3. Read terveydenhuoltolaki § 50 and § 50a as amended 1.10.2025; find HE 159/2025 vp.
4. Read EUR-Lex 2024/1689 Art. 6 and Annex I/III; confirm 2026/1744 publication and entry into force.
5. Read MDR Annex VIII Rule 11 and MDCG 2019-11 Rev.1 directly.
