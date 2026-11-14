# 11 - Risk score idea: research

Researched: 2026-11-14. Research only. No code.

Tags:
- [READ] = I read the source text.
- [SNIPPET] = only the search-result text, not the full paper.
- [SECONDARY] = a blog or summary, not the primary source.
- [UNVERIFIED] = from memory. Not checked.
- [NOT FOUND] = I looked and did not find it.
- [source needed] = no working URL found yet. The claim stays.
- [INFERENCE] or "Our reading:" = our reasoning, not a source claim.

Terms:
- PPV = positive predictive value: share of flagged people who really have cancer.
- NG12 = NICE guideline 12, the UK rules for suspected-cancer referral.
- DUA = data use agreement.
- PMID = PubMed ID. DOI = paper ID.
- MDR = EU medical device rules. AI Act = EU AI law.

## Short answer

- The idea is a risk score. It can run after diagnosis (ranks people already found) or before diagnosis (a GP tool).
- The team's own evidence says the Finnish gap sits before diagnosis: no fast lane, no red-flag list. Source: `/home/michal/.t3/projects/vitruvian/docs/research/context/08-primary-care-fast-lanes.md` [READ].
- Our reading: a patient-level score cannot be trained legally with Finnish data in 36 hours. The brief also bans patient-level data.

## 1. Post-diagnosis prognosis and Finnish urgency practice

What exists:
- PREDICT (breast cancer, UK). Checked in many cohorts, including 45,789 patients in Scottish registry data (Gray et al., Br J Cancer 2018, PMID 30220705) [SNIPPET] [source needed]. Latest version v2.2 tested in trial patients (PMC12808956) [SNIPPET] [source needed]. Some studies show it underestimates survival in HER2-positive patients (Agostinetto et al., NPJ Breast Cancer 2022, [doi 10.1038/s41523-022-00452-8](https://doi.org/10.1038/s41523-022-00452-8)) [SNIPPET].
- IPI (lymphoma), Shipp et al., NEJM 1993, [doi 10.1056/NEJM199309303291402](https://doi.org/10.1056/NEJM199309303291402) [SNIPPET]. Still valid in the rituximab era (Ziepert et al., JCO 2010, [doi 10.1200/JCO.2009.26.2493](https://doi.org/10.1200/JCO.2009.26.2493)) [SNIPPET].
- Machine-learning prognostic models in oncology: about 84% were at high risk of bias ([PMC9261114](https://pmc.ncbi.nlm.nih.gov/articles/PMC9261114/), not opened) [SNIPPET].

Finnish urgency practice:
- No Finnish fast lane for suspected cancer from primary care ([Yle, 23 Oct 2025](https://yle.fi/a/74-20251023)) [SNIPPET]. No national red-flag list (08 file) [READ].
- STM 2010:6 sets a six-week maximum from referral to treatment. Quote: six weeks from arrival of referral, dated 5.3.2010 ([STM 2010:6 PDF](https://www.iccp-portal.org/system/files/plans/selv_2010_6_syovan_hoito_verkko.pdf)) [READ]. It is a maximum, not a law. No law sets cancer deadlines (09 file).
- Public county data on cancer-specific waits is thin. Only TYKS publishes colorectal waits by stage ([TYKS](https://www.tyks.fi/potilaille-ja-laheisille/hoidot-ja-tutkimukset/syopa/suolistosyovan-hoitoonpaasyajat)) [READ].

Read-across (our reading): a post-diagnosis score can help order a treatment queue. I found no Finnish evidence that prognosis scores shorten waits [NOT FOUND].

## 2. Pre-diagnosis (GP) tools

- QCancer (UK). Risk from GP records: age, sex, smoking, family history and more. Hippisley-Cox & Coupland, BMJ Open 2015, [doi 10.1136/bmjopen-2015-007825](https://doi.org/10.1136/bmjopen-2015-007825) [SNIPPET].
- QCancer-Ovarian: sensitivity 64.1% and specificity 90.1% at a 10% threshold (Funston et al. 2020) [SECONDARY, via [PMC9472236](https://pmc.ncbi.nlm.nih.gov/articles/PMC9472236/), not opened].
- Referral effect is weak. Moffat et al. 2014 (Macmillan and BMJ Informatica) found no conclusive evidence that QCancer raised specialist referrals [SECONDARY, via [PMC9472236](https://pmc.ncbi.nlm.nih.gov/articles/PMC9472236/), not opened].
- Hamilton et al., BJGP 2013 (RATs, symptom risk tools), [doi 10.3399/bjgp13X660751](https://doi.org/10.3399/bjgp13X660751) [SNIPPET]. Year 2013 verified (63(606):30–36). Outcome data not read.
- ERICA: electronic prompt at 2% or higher risk, patients 40+. Trial protocol, BMJ Open 2023, [doi 10.1136/bmjopen-2023-065232](https://doi.org/10.1136/bmjopen-2023-065232) and [PMC10030284](https://pmc.ncbi.nlm.nih.gov/articles/PMC10030284/) [READ]. The 2023 DOI year is correct. Outcome not read; no published result found.
- NICE NG12 uses a 3% PPV threshold for referral. Critics say it misses cases ([PMC12770854](https://pmc.ncbi.nlm.nih.gov/articles/PMC12770854/), not opened) [SNIPPET].
- Urgent referral and survival: Round et al., BJGP 2020, [doi 10.3399/bjgp20X709433](https://doi.org/10.3399/bjgp20X709433) [SNIPPET, abstract only].
- Rural cluster RCT: shorter time to diagnosis (Emery et al., Br J Cancer 2017) [SNIPPET] [source needed].
- Denmark: 30-day maximum from suspicion to completed assessment. 21 diagnostic centres. About 9,900 patients a year on the vague-symptom pathway ([PMC13745819](https://pmc.ncbi.nlm.nih.gov/articles/PMC13745819/), not opened) [SNIPPET]. Danish urgent referral since 2008 ([PMC4385978](https://pmc.ncbi.nlm.nih.gov/articles/PMC4385978/), not opened) [SNIPPET].
- Denmark compliance: sources disagree. A Danish news report gives "more than nine in ten" in 2024 ([dknyt](https://www2.dknyt.dk/artikel/mere-end-ni-ud-af-ti-kraeftpatienter-faar-behandling-i-tide)) [SNIPPET]. The "over 99%" figure is not linked [source needed]. Not resolved (09 file) [READ].
- Finland: CT/MRI needs specialist referral under the Oulu rule ([PPSHP imaging booking guide](https://www.ppshp.fi/dokumentit/Kuvantamisen%20ohje%20sislttyyppi/Oulun%20kaupungin%20terveysasemien%20kuvantamistutkimusten%20ajanvaraus%20oys%20kuv%20til.docx)) (08 file) [READ]. Finland has the lowest primary-care CT access in the Nordics ([helsinki.fi news](https://www.helsinki.fi/fi/uutiset/terveys/miksi-suomessa-keuhkosyopaan-kuollaan-aiemmin-kuin-pohjoismaissa), news summary) (08 file) [SNIPPET].
- A Finnish-era cohort: patients overlooked at first visit had HR 1.89 for death within 3 years (CMAJ 2006, 221 patients) ([CMAJ](https://www.cmaj.ca/content/174/6/779)) (08 file) [READ].

## 3. Data you can legally get, and how long it takes

- SEER (US registry). Needs a Research Data Use Agreement before access ([SEER data access](https://seer.cancer.gov/data/access)) [SNIPPET]. Approval time: [NOT FOUND]. Not Finnish data.
- UK Biobank. Response rate 5.5%. "Healthy volunteer" effect. Deprived areas 16% of the cohort vs 33% of the UK population. Cancer incidence 10-18% lower than the population ([PMC5860371](https://pmc.ncbi.nlm.nih.gov/articles/PMC5860371/), [PMC9938115](https://pmc.ncbi.nlm.nih.gov/articles/PMC9938115/), not opened) [SNIPPET]. Good for links between risk and outcome, not for rates. Not Finnish.
- Findata (Finnish permit authority for health data reuse). 2025 annual report: 85% of permits processed in under 3 months [SNIPPET] [source needed]. Older figure: median 80 days, range 1-440 [SECONDARY, dated] [source needed].
- Finnish Cancer Registry: spread data (TNM, stage or free text) recorded for 41.9% of cases nationally (stage alone 5.4%). Target 70% or more ([factsheet, syopa 2024](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)) [READ]. Note: the 07 file says the parts add to 40.8%, not 41.9%.
- Pirkanmaa raised clinical stage notifications from 42% to 80% (2022-2024) by changing its workflow (07 file; [Syöpärekisteri, 26 June 2025](https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/)) [READ]. Our reading: the gap can be fixed locally.
- THL Sotkanet: public aggregate data. Licence CC BY 4.0 [UNVERIFIED] [source needed].
- Our reading (inference, not a source claim): published model coefficients (PREDICT, IPI, QCancer) can run on made-up patients. No patient data needed.
- Synthetic Finnish patient data: [NOT CHECKED].

Timing (our reading): a real patient-level build cannot happen in 36 hours. Approval alone can take longer than the event.

## 4. Regulation

- EU MDR Rule 11 (MDCG 2019-11): decision-support software for diagnosis or therapy is class IIa by default. IIb if a wrong decision could cause serious harm. III if it could cause death or irreversible harm [SNIPPET] [source needed: MDCG 2019-11 PDF not linked].
- Our reading: a score that sends patients to fast track is likely IIa or higher, by Rule 11.
- Our reading: a hackathon demo on synthetic data that informs no real decision is probably not a device on the market. Not checked against Fimea, the Finnish regulator [UNVERIFIED].
- EU AI Act: Regulation (EU) 2026/1744 (Digital Omnibus on AI), OJ L, 24.7.2026 [source needed: only a law-firm note was found; EUR-Lex not opened].
- Annex III high-risk uses (incl. healthcare access) apply from 2 December 2027, and AI in regulated products such as medical devices (Article 6(1)) from 2 August 2028 ([Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/)) [SECONDARY]. Article numbers not checked in the full text.
- Read-across (our reading): the dates do not block a 2026 demo. A live deployment needs MDR and AI Act conformity work first.

## 5. Equity effects

- Obermeyer et al., Science 2019, [doi 10.1126/science.aax2342](https://doi.org/10.1126/science.aax2342), PMID 31649194 [SNIPPET]. A health algorithm used past cost as a stand-in for need. Black patients were sicker before being flagged. Fixing the label raised enrolment from 17.7% to 46.5% ([PMC11897215](https://pmc.ncbi.nlm.nih.gov/articles/PMC11897215/), not opened) [SNIPPET]. Our reading: a label built from past care copies past gaps. A "dangerous cancer" label built from past diagnosis or treatment has the same risk.
- Colorectal risk models: the race-neutral model had worse calibration and more false negatives in minority groups (PMID 37318804) [SNIPPET] [source needed].
- QCancer-10 under-predicted risk in minority ethnic groups in a UK colorectal study ([PMC9644277](https://pmc.ncbi.nlm.nih.gov/articles/PMC9644277/), not opened) [SNIPPET].
- Stage is missing for about 58% of Finnish cases (07 file; [factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)). Our reading: a model trained on recorded stage only learns from the easier-to-record cases [INFERENCE].
- Our reading: training on US or UK data and applying it in Finland risks a transport gap (different people, care and coding). Supported by the UK Biobank and Obermeyer evidence above [INFERENCE].

## 6. Fit with the brief and Goal 3

- Brief step 1-2: identify a gap and where it sits. A risk score finds people, not a county gap.
- Brief step 3 (most important): recommend an action. A score does not say what a county should change.
- Brief data rule: public aggregate data only ([judging weights and brief, HackJunction](https://hackjunction.app/participate/45/challenges/344)). A score needs patient-level training data. That conflicts with the rule. Only compliant route: a model card plus a simulation on aggregate counts.
- Goal 3 indicator: the strategy PDF was not read in this pass, so I cannot name the indicator. Must check before claiming fit [NOT CHECKED].
- Judging weights (HackJunction page above): data quality and transparency (20%) and actionability (30%). Our reading: data quality will score low for synthetic data with no real validation. Actionability is low unless the output maps to a referral rule a county can change.

## Comparison: post-diagnosis vs pre-diagnosis (GP) version

| Dimension | Post-diagnosis version (score after cancer is found) | Pre-diagnosis version (GP tool before diagnosis) |
|---|---|---|
| Problem addressed | Orders people already in treatment queues. Does not touch time to diagnosis (08 file) [READ]. | Targets the gap the team's evidence points to: no fast lane, no red-flag list (08 file) [READ]. Matches brief's "earlier detection". |
| Evidence it works | Accuracy strong: PREDICT, IPI validated in many cohorts [SNIPPET]. No evidence found that it cuts waits [NOT FOUND]. | Accuracy shown (QCancer) [SNIPPET]. Referral effect weak: Moffat 2014 inconclusive [SECONDARY]. ERICA outcome not read. |
| Novelty | Low. PREDICT, IPI and NCCN-IPI already exist. Adds little unless Finland-specific. | Medium. QCancer and RATs exist in the UK. No Finnish equivalent in use (08 file) [READ]. A Finnish-calibrated tool would be new. |
| Demo data | Published coefficients on made-up patients. SEER needs a DUA (US). UK Biobank is volunteer, not Finnish. | Published QCancer coefficients on made-up patients. Finnish aggregate counts only if obtained from THL or the registry. No patient data. |
| Regulation | MDR Rule 11 likely IIa or higher if it drives treatment decisions. AI Act Annex III from 2 Dec 2027. | MDR Rule 11 likely IIa or higher if it drives referrals. Higher stakes: a false negative means a missed cancer. |
| Equity risk | High. Label bias (Obermeyer). Stage missing for about 58%. Training on US or UK data. | High. QCancer under-predicts in minority groups (PMC9644277). Deprived people under-represented in UK Biobank. GP access is already unequal. |
| Brief fit | Weak. Finds people, not the county gap. No action named. Patient-level training conflicts with the data rule. | Better fit if tied to a county referral rule and a measured gap (wait by county). Still needs the Goal 3 indicator. |

## Verdict (our reading)

1. The pre-diagnosis GP version fits the Finnish gap better, but evidence that GP tools shorten waits is weak.
2. The post-diagnosis version is easy to build on published models, but it misses the brief's gap and cannot use patient-level training data in 36 hours.
3. Keep the idea only as a referral-rule simulation on aggregate data, with the score as an add-on, not the core.

## Gaps and next checks

1. Goal 3 indicator text: read the strategy PDF (link in the brief).
2. ERICA outcome and Round 2020 effect size: read full papers.
3. Fimea position on clinical decision software: check.
4. SEER and UK Biobank approval times: check their pages.
5. Synthetic Finnish data sources: not checked.
6. AI Act dates: confirmed only in a law-firm note. Check EUR-Lex and article numbers in the full text.
7. Still [source needed]: PREDICT (Gray 2018), PMC12808956, Emery 2017, Findata figures, THL Sotkanet licence, MDCG 2019-11, Regulation 2026/1744, PMID 37318804.
