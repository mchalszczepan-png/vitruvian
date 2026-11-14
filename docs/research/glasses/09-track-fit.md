# 09 · Track fit: cancer-risk glasses coach (Direction B) vs the AstraZeneca track

Date: 2026-11-14 · Researcher: research sub-agent · Scope: honest, critical fit check. This file is not meant to support the idea.

Terms
- **Goal 2** = prevention and early detection ("Vähennetään syöpätaakkaa ehkäisyn ja varhaisen toteamisen avulla"). **Goal 3** = equal, effective treatment ("Varmistetaan yhdenvertainen ja vaikuttava syövänhoito").
- **Strategy p.** = printed page number in the national cancer strategy 2026–2035 PDF.
- **Brief** = `docs/tracks/astrazeneca-cancer-care.md` (line refs below).
- **Deck** = `docs/tracks/astrazeneca-insights-deck.md` (PDF page refs).
- **D** = "Option D" in `06-goal3-link.md` (equal reach and regional data).
- **P1–P11** = problem IDs in `docs/discovery/02-problem-map.md`.

---

## 1. What the brief and the strategy actually require

**Problem statement** (Brief line 7): "Help ensure equitable and effective cancer care for everyone in Finland."

**Scope** (Brief line 9): "Identify where the cancer care pathway can be strengthened: earlier detection, smoother referrals between health centres and hospitals, or faster treatment initiation."

**Target** (Brief line 11): "Time to diagnosis should be optimal and patients should start treatment within target timeframes, wherever they live."

**Required steps** (Brief lines 15–17):
1. "Identify the gap. Detect differences in access to cancer care or treatment outcomes."
2. "Locate the gap in the care pathway." (detection, referral, diagnosis, or treatment initiation)
3. "Recommend what to do (most important). … Diagnosing is not enough."

**Minimum requirements** (Brief lines 28–31): reliable evidence with a source for every claim (28); **at least one Goal 3 indicator** (29); actionable recommendations (30); a **working demo**, "slides alone are not enough" (31).

**Bottlenecks** (Brief lines 35–37): late detection; primary-to-specialist transition; diagnosis-to-treatment.

**Data rule** (Brief line 41): "Public, aggregate data only; no patient-level data."

**Judging** (Brief lines 70–76): Actionability 30% · Insight 25% · Data quality and transparency 20% · Execution 15% · Clarity 10%.

**Prevention is not in the brief's scope.** Line 9 and lines 35–37 cover detection, referral, diagnosis and treatment start. The deck does put prevention first in the inequality chain (Deck p.7: "Prevention → screening → symptom recognition → access → treatment…"), so a judge could count it as context. It is not the thing the brief asks us to fix.

**Track owner's emphasis** (Deck):
- p.8: "Effective prevention requires policies and services that reach disadvantaged populations." About half of cancers may be preventable; lifestyle risks cluster in lower SES.
- p.7: drivers include health literacy and navigation.
- p.10: patient delay (step 2: fear, minimising, low health literacy) and system delay (steps 3–8).

**Strategy, what Goal 2 and Goal 3 say** (PDF, checked 2026-11-14):
- Goal 2 headline, p.5: preventable cancers fall by 1,000 cases a year (footnote: about 10,000 preventable cancers per year in total); 80% screening participation in every county; 70% of cancers at stage I–II.
- Goal 2, p.21: "Jopa 30–40 % uusista syöpätapauksista voitaisiin välttää" (up to 30–40% of new cancers could be avoided). Same page: "Syöpien kehittyminen vie vuosia, ja myös syöpää ehkäisevien toimien vaikutus tulee näkyväksi vasta pidemmällä aikavälillä." = cancers take years to develop, and prevention effects only show over a longer time.
- Sub-goal 2.1, p.22–23: prevention = **policy levers** (tax, alcohol policy, shade, built environment). Not individual nudges.
- Sub-goal 2.2, p.24–25: "Syövän ehkäisyyn liittyvää neuvontaa, mini-interventioita ja palveluohjausta annetaan sekä ehkäisevissä että sairaanhoidon palveluissa." = prevention counselling, mini-interventions and service guidance are given **in public services**. Same page: public services serve "keskimääräistä sairaampia ja vähävaraisempia" people (sicker, lower-income people on average). Target: smoking, alcohol, nutrition and exercise counselling must be available to those who need it.
- Goal 3 headline, p.5 and sub-goal 3.1, p.33: "Potilaat pääsevät hoitoon tavoiteaikojen puitteissa" = patients get treatment within target times.
- Sub-goal 3.2, p.36 (the data indicator D relies on): "Saatavilla on luotettavaa tietoa syövän diagnostiikka- ja hoitokäytäntöjen alueellisista eroista, minkä avulla voidaan kaventaa eroja hoitotuloksissa." = reliable data on regional differences in **diagnostics and treatment practice**, to narrow outcome gaps.
- p.35: "Syövän hoidon laaturekisteriä ei ole Suomessa vielä perustettu" = the cancer treatment quality register does not exist yet.
- Equality, cross-cutting theme, p.11–12: names education, health literacy and socioeconomic factors; "nykyinen rinnakkaisiin perusterveydenhuoltopalveluihin perustuva palvelujärjestelmä" (parallel primary-care systems) can create and keep gaps.

---

## 2. Fit table

Fit scale: **strong / partial / weak / none**.

| Requirement or criterion | Fit | Why | Evidence |
|---|---|---|---|
| Problem statement: equitable, effective care | **Weak** | Glasses act before any symptom. The equity claim depends on who owns and uses the device, and owners skew high-SES (see §3). | Brief l.7; Deck p.8; research Q1–Q2 |
| Scope: detection, referral, diagnosis, treatment start | **None** | Smoking, meat, alcohol and sun are prevention, before the pathway starts. The coach does not find any pathway gap. A symptom-prompt version would fit step 2 (patient delay), but that is a different product with a medical-device problem. | Brief l.9, 35–37; Deck p.7, p.10; gl07 §4 |
| Req 1: identify the gap | **None** | The glasses produce no access or outcome data. The gap must come from public data (registry, THL). | Brief l.15; gl06 §3 |
| Req 2: locate the gap in the pathway | **None** | Same as above. | Brief l.16 |
| Req 3: recommend what to do (most important) | **Partial** | A nudge is an action for one person. A county cannot run "wear the glasses" as a service. The strategy's own action is counselling in public services (2.2), which the glasses are not. | Brief l.17; Strategy p.24–25 |
| Min: sources for every claim | **Partial** | Cancer-risk facts (IARC, ECAC5) are sourced. The glasses-specific claims have no evidence: most of gl03 is UNVERIFIED or snippet-only. | gl03; research Q3 |
| Min: a Goal 3 indicator | **Weak** | Prevention is Goal 2 (strategy p.21). The Goal 3 headline is treatment time and survival. A 36-hour demo cannot move these. See the D mismatch in §3.6. | Brief l.29; Strategy p.5, p.21, p.33 |
| Min: actionable recommendation | **Partial** | Actionable for an individual, not for a wellbeing county. | Brief l.30 |
| Min: working demo | **Partial** | Buildable (phone + Gemini + backend). But there is no real user data (Brief l.41). Bystander filming is limited (gl07 §5). The demo shows a tip, not a gap. | Brief l.31, 41; gl07 §5–6 |
| Judging: actionability (30%) | **Weak** | A consumer wearable with no route to county purchase. Medical-device and GDPR limits block the strongest message ("lower your cancer risk"). | gl07 §2, §4; research Q1 |
| Judging: insight (25%) | **Weak** | The insight would be about lifestyle, not where the pathway breaks. The one insight with a real hook is the deck's equity point, and that point argues against a gadget. | Deck p.8; research Q2 |
| Judging: data quality and transparency (20%) | **Partial** | Can be honest if limits are stated. But D's data is screening uptake (a Goal 2 target), while the indicator it cites is about diagnostics and treatment practice. A judge who reads the strategy will catch that. | gl06 §2.3, §4; Strategy p.36 |
| Judging: execution (15%) | **Partial** | Feasible, but the device is emulated, and Google-side logging is on by default for some projects. | gl07 §2.4 |
| Judging: clarity (10%) | **Partial** | "Glasses that give cancer tips" is easy to say. But the two-minute story has no gap, no pathway, and no Goal 3 number. | Brief l.43 |
| Track owner: prevention must reach lower SES (Deck p.8) | **Weak** | Device ownership and app uptake follow income and education (see §3.2). The idea starts with the people least likely to be reached. | Deck p.8; research Q1–Q2 |
| Time to outcome (Goal 3 horizon) | **Weak** | Benefits show over years to decades (Strategy p.21). A demo cannot show any outcome change. | research Q4 |

---

## 3. Main risks to fit

1. **Scope and indicator mismatch (highest).** The brief asks where the pathway breaks. The idea is upstream prevention. The Goal 3 link (D) uses screening uptake as the data, which is Goal 2. The indicator it cites (3.2) is about diagnostic and treatment practice differences, and the register that would hold that data does not exist yet (p.35). The honest claim is "Goal 2 prevention prototype, no Goal 3 outcome". The 06 file's recommended wording ("addresses the screening-uptake gap that the strategy's equality theme names") is weaker than it looks.

2. **Equity: the idea may widen the gap it is meant to close.**
   - Smart-wearable owners skew high-income and educated. US data (2020–22): owners earning $200k+ had adjusted OR 2.27 (2.01–2.57) for owning a wearable (corrected from "about 2.3x"); 31.4% of owners had an advanced degree vs 13.5% of non-owners (corrected: 31% is a share, not an odds ratio) [READ abstract, https://jmir.org/2024/1/e56504; 23,974 respondents, 2020–22]. Pew (survey June 2019, published Jan 2020): about 3 in 10 households earning $75k+ wear a tracker vs 12% under $30k [https://pewresearch.org/short-reads/2020/01/09/about-one-in-five-americans-use-a-smart-watch-or-fitness-tracker]. **No Finnish or Nordic wearable-by-SES figure was found.**
   - Digital lifestyle uptake follows education. Finnish Healthy Finland subgroup: higher education linked to higher odds of starting a web lifestyle intervention, OR 2.19 (1.82–2.63) [SNIPPET, utupub.fi/handle/11111/56530] [source needed: 2.19 not found in the sweep]. Yang et al. 2025 review: higher education and income linked to mHealth adoption [SNIPPET].
   - "Intervention-generated inequalities" (Lorenc, Petticrew and colleagues, J Epidemiol Community Health, vol 67, 2013): downstream preventive interventions are more likely to widen health inequalities than upstream ones (paraphrase; corrected from "individual-level vs structural") [READ, https://researchonline.lshtm.ac.uk/id/eprint/146732]. König et al. 2023 warn that digital technology "risks re-enacting or even widening disparities" [abstract, https://doaj.org/article/f04b37cfa18e48ef924f64cb28dcc3f7] (corrected: the phrase "may widen rather than bridge" did not appear in the source).
   - So the deck's warning (p.8) is backed by the literature. This is the risk judges are most likely to test.

3. **No evidence the glasses change behaviour, and effects may not last.**
   - Closest evidence is text reminders for smoking. Cochrane 2019 (26 RCTs, 33,849 people): automated texts vs minimal support, RR 1.54 (1.19–2.00); apps RR 1.00 (0.66–1.52) [READ, NIHR summary, evidence.nihr.ac.uk/alert/text-messaging-support-helps-smokers-quit-but-apps-not-yet-shown-to-work]. Note: texts work, apps do not. Glasses are neither.
   - Lower-SES smokers: Project ACTION (Vidrine et al., JAMA Intern Med 2019, https://read.qxmd.com/read/30556832/efficacy-of-mobile-phone-delivered-smoking-cessation-interventions-for-socioeconomically-disadvantaged-individuals-a-randomized-clinical-trial): abstinence 12.0% with NRT, 12.0% with NRT plus texts, 25.5% with NRT plus texts plus a counselling call. Texts alone "may not increase cessation rates" in disadvantaged smokers [abstract].
   - Alcohol just-in-time apps: mostly pre-post studies, small samples (Xu and Smit 2023, DOI 10.1177/20552076231183543: [source needed: the 592 people and g = 0.77 figures did not match the source found in the sweep]). One veterans RCT's effect did not persist to day 168 [SNIPPET; source needed].
   - Sun apps: one Queensland app-plus-UV-monitor RCT was null on habits [SNIPPET; source needed]. Diet prompts: **not searched**.

4. **Time to outcome.** Smoking: excess lung-cancer risk after quitting still 57% at 5 years and 37% at 10 years (Reitsma et al. 2020, Annals ATS, https://doi.org/10.1513/AnnalsATS.201909-659OC) [source needed: the 57% and 37% figures were not confirmed; the paper reports a different measure]; half-life 9.9 years (95% CI about 9.3 to 10.6) (Regulatory Toxicology and Pharmacology 2013, vol 67, pp 13–26; https://peeref.com/zh/works/15312316; one listing names a tobacco-industry funder) [SNIPPET]. Alcohol: after more than 20 years without drinking, oesophageal risk is no longer significantly different from never-drinkers (Rehm 2007, https://www.news-medical.net/news/2007/09/27/30432.aspx) (corrected: the "about 5 years" half-benefit figure is from Jarl and Gerdtham 2012, https://www.news-medical.net/news/20120914/Cessation-of-drinking-may-reduce-risk-of-oesophageal-cancer.aspx, not Rehm 2007). Sunbed law (2012, under-18 ban in Finland; the 2012 law makes the under-18 limit binding on operators, https://www.finlex.fi/api/media/statute/88262/mainPdf/main.pdf) has **no Finnish evaluation found**. The strategy says the same thing (p.21). A demo cannot show Goal 3 movement.

5. **Medical-device and GDPR limits shape the pitch.** "Lower your cancer risk" + risk scores = likely class IIa medical device (gl07 §4.2–4.3). Health inferences (smoking, alcohol, food) are special-category data (gl07 §2.1). Bystanders cannot be filmed or stored (gl07 §2.2). The wellness-only version is the one that is legally safe, and it is the weakest for the track.

6. **Data on hand is not the data the claim needs.** No real access or outcome data. The county-level gaps come from public registry statistics (Syöpärekisteri 2024 prelim., figures from press summaries, gl06 §3). The glasses add no data. Any "shows the gap" slide must be labelled as public-data context, not as the glasses' output.

---

## 4. What would have to be true for the idea to fit well

- The coach is used **after symptoms**, in the patient-delay step (step 2 of the deck's model), not as general prevention. (Condition on scope, not a new product.)
- Evidence shows the specific prompt type changes the target behaviour **in lower-SES adults**, and the effect lasts beyond the trial period.
- Lower-SES reach is **measured**, not assumed. Uptake data from the actual user group would show whether the tool narrows or widens the gap (Deck p.8).
- The Goal 3 claim names an indicator the team's data can actually move or measure. For sub-goal 3.2, that means county data on diagnostics and treatment practice. The team does not have it. Otherwise the claim is Goal 2 only, and the brief's Goal 3 minimum needs another route.
- The county can use it through its own channel (health centre mini-interventions, strategy 2.2), not as a device it must buy.
- The intended purpose is wellness only: no disease claim in the app, no risk numbers shown (gl07 §5). Legal or Fimea view obtained.
- Privacy controls are in place: on-device face blur, no stored frames, Gemini logging checked (gl07 §2.4, §6).
- The demo says what it is: a prototype with staged scenes, no outcome claim.

---

## 5. Verdict

**Weak fit.** The idea sits upstream of the brief's pathway and Goal 3, and its natural users skew toward the groups the track owner wants to reach.
Argue it, if at all, as a Goal 2 prevention prototype, and drop D's claim that the data matches sub-goal 3.2.

---

## Research gaps (not covered, or unverified)
- No Finnish or Nordic wearable-by-SES data found (Statistics Finland and Eurostat tables not opened).
- Most effect sizes are from search snippets. Cochrane and PMC pages were blocked or empty; check before quoting.
- Diet prompts (processed and red meat, sugary drinks) not searched. Processed-meat latency not found.
- Project ACTION and the 2025 Cochrane SES review not read in full.
- The Finnish under-18 sunbed law has no evaluation found.

## Sources
- Strategy PDF (local copy checked): https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf — pp. 5, 11–12, 21–25, 33, 35–36
- jmir.org/2024/1/e56504 (US wearable owners, SNIPPET) · utupub.fi/handle/11111/56530 (Finland, READ page, OR SNIPPET) · researchonline.lshtm.ac.uk/id/eprint/146732 (IGI, READ) · c4tbh.org (König 2023 summary, READ)
- evidence.nihr.ac.uk/alert/text-messaging-support-helps-smokers-quit-but-apps-not-yet-shown-to-work (Cochrane 2019 summary, READ) · pmc.ncbi.nlm.nih.gov/articles/PMC10373115 (alcohol JITAI, SNIPPET) · news-medical.net/news/2007/09/27/30432.aspx (Rehm 2007, SNIPPET)
- Other files in this folder: `03-risk-evidence.md`, `06-goal3-link.md`, `07-privacy-regulation.md`; `docs/discovery/02-problem-map.md`

## Variant: free phone app (camera on phone, no glasses)

Date: 2026-11-14 · Same question, with the glasses swapped for a free app on the phone camera. [READ] = full text or full page read. [SNIPPET] = search summary only, check before quoting.

**Short answer.** A free app removes the device cost, the wearable-owner skew and the bystander-filming problem. It does not remove the scope gap, the Goal 2 vs Goal 3 mismatch, the digital-skill gate, or the lack of outcome evidence.

### Who uses free public digital services in Finland

- **Smartphone by age and education, 2021** [READ, stat.fi/til/sutivi/2021/sutivi_2021_2021-11-30_tau_013_fi.html, table 13]: age 16–24 99%; age 75–89 42%; basic education 76%; tertiary 96%; all adults 88%; pensioners 67%. No income split.
- **2024 release** [READ in part, stat.fi/julkaisu/clmukhkph0zpz0aunma2iqvxr]: "over half" of 75–89-year-olds have a smartphone. Age (table 13ud) and education (13v7) tables exist, but were not opened. Internet use in past 3 months, 75–89: 64% [SNIPPET].
- **Omakanta** (national patient record app): 82% of respondents used it (corrected: survey March 2023, respondents aged 75 and older; paper published Jan 2026) [https://pubmed.ncbi.nlm.nih.gov/41529285/]. No education split found.
- **Omaolo** (symptom checker): no user split by education or income found. Closest is the 2025 Finnish BitHabit study ("S7" in `03-secondary-evidence.md`): aOR 1.10 (1.08–1.12) per year of education (corrected: not a "higher education" category); e-service use was the strongest predictor [READ earlier; source needed: paper link]. Not Omaolo-specific.
- **EU** [SNIPPET, Monasterio et al., JMIR 2026, e81841]: older, less-educated, lower-SES, minority and low-digital-skill people use eHealth tools less. Full text empty.

### Free smartphone lifestyle apps: effects, drop-off, SES

- **Diet**: König et al. 2025 umbrella review, npj Digital Medicine, 46 reviews [READ]: digital diet and activity tools mostly work at all ages; men gained more than women; income and education "rarely studied". LSHTM 2025 review (Curtin et al. 2025, IJBNPA, 21 studies; https://www.lshtm.ac.uk/newsevents/news/2025/smartphone-apps-could-support-healthier-and-more-sustainable-diets-new-study): fruit and veg +0.48 portions a day (0.18 to 0.78), meat -0.10 portions a day; effect peaks about 12 weeks. "four in five" kept using the apps [source needed: not found in the sweep]. Szinay et al. 2023, Obesity Reviews, 13 studies [SNIPPET]: uptake checked in one study (no gap); education differences in some engagement and effect results; authors call the evidence "inconclusive".
- **Smoking**: Cochrane 2019 (see §3): texts RR 1.54; apps RR 1.00 [READ summary]. Apps have no proven effect.
- **Alcohol**: Staiger et al. 2020, first decade of tobacco/alcohol/drug apps [SNIPPET, PMC7723745]: effects unclear, no meta-analysis, few control groups. Youth meta-analysis 2024: very uncertain [SNIPPET].
- **Sun**: Snyder et al. 2020, narrative review [READ]: SolarCell app raised shade use 33.7% → 41.0% (p = 0.03 [source needed]; figures from Buller et al. 2015, JAMA Dermatology, https://jamanetwork.com/journals/jamadermatology/fullarticle/2091959, as cited in Snyder 2020; corrected attribution); Go Smart Sun no overall gain; SunSmart app no different from control. Effect "mild to moderate". One study: lower-income app users were more confident; no SES analysis of effect.
- **Drop-off**: Meyerowitz-Katz et al. 2020, JMIR 22(9):e20283 [READ; https://www.jmir.org/2020/9/e20283], 17 studies: pooled dropout 43% (95% CI 29–57); observational 49%, RCTs 40%; I² > 99%. Younger people dropped out less; postgraduate education and health literacy linked to lower dropout. SES not analysed; authors say age and social status "are likely to be barriers to app access".

### Risk table

| Risk | Free app | Why | Source |
|---|---|---|---|
| Device cost; wearable owners skew rich and educated | **Gone** | Most adults already own a phone. Gap remains for older and basic-educated people. | stat.fi 2021 table 13 [READ]; US wearable data [SNIPPET] |
| Bystander filming, device privacy | **Reduced** | No face camera in public, but the phone still records people. | gl07 §2.2 (from file) |
| Medical-device class | **Unchanged** | Depends on claims and risk output, not hardware. | gl07 §4 (from file) |
| Health data is special category (GDPR) | **Unchanged** | Diet, smoking and alcohol data stay special category. | gl07 §2.1 (from file) |
| Digital skill gate | **Unchanged** | Setup and login still needed. | BitHabit [READ]; Monasterio [SNIPPET] |
| Uptake and drop-off skew to educated | **Unchanged** | Pooled dropout 43%; no evidence a free app fixes it. | Meyerowitz-Katz 2020 [READ] |
| Effect by SES unknown | **Unchanged** | Evidence "inconclusive" or "rarely studied". | Szinay 2023 [SNIPPET]; König 2025 [READ] |
| No proof of behaviour change | **Unchanged** | Smoking apps RR 1.00; alcohol and sun effects small or uncertain. | Cochrane 2019; Staiger 2020; Snyder 2020 |
| Scope: prevention is Goal 2, not the pathway | **Unchanged** | Same idea, same scope. | Brief l.9, 35–37; strategy p.21 |
| No Goal 3 indicator | **Unchanged** | App gives no county or outcome data. | Brief l.29, 41 |
| Time to outcome (years) | **Unchanged** | A demo cannot show cancer change. | Strategy p.21 |
| Equity: individual tools widen gaps | **Unchanged** | Lorenc and Petticrew 2013 (from file). | file §3.2 |
| County must buy hardware | **Gone** | Free app; county can use its own channel (strategy p.24–25). Meets §4 condition 5. | Strategy p.24–25 |

### Does it change the Goal 3 fit?

Partly. The free app removes two blockers from §2–3: the purchase and the wearable-owner skew. It helps the county-channel condition in §4. It does not change scope, the indicator, the time horizon or the equity risk. Goal 3 fit stays weak. As a Goal 2 counselling aid, it is more plausible.

**Verdict:** Still a weak Goal 3 fit. Better than the glasses as a Goal 2 prototype, because cost and device skew go away.
Keep the same claim limits: no outcome claim, and argue reach only if lower-SES use is measured.

### Gaps for this variant
- No Finnish Omaolo or Omakanta user data by education or income.
- Tables 13ud and 13v7 (2024) not opened.
- LSHTM diet review and Yang 2025 mHealth inequality review: full text blocked or empty.
- An undated MTV news item says 5% of 75–89-year-olds have a smartphone. Not used: no year, and it conflicts with the 2021 table.

### Sources
- stat.fi/til/sutivi/2021/sutivi_2021_2021-11-30_tau_013_fi.html · stat.fi/julkaisu/clmukhkph0zpz0aunma2iqvxr
- pmc.ncbi.nlm.nih.gov/articles/PMC7556375 (Meyerowitz-Katz 2020) · pmc.ncbi.nlm.nih.gov/articles/PMC7471243 (Snyder 2020)
- researchportal.bath.ac.uk (König 2025 umbrella review)
- doi 10.1111/obr.13542 (Szinay 2023) · pmc.ncbi.nlm.nih.gov/articles/PMC7723745 (Staiger 2020) · jmir.org/2026/1/e81841 (Monasterio 2026) · jmir.org/2025/1/e71349 (Yang 2025) · lshtm.ac.uk news 2025 (diet review)
