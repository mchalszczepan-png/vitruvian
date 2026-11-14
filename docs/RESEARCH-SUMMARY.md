# Research summary – read this one

Junction 2026, AstraZeneca track. Updated 2026-11-14. This is the single file to read. It condenses about 25 research files (index at the end). Research only: this lists **problems we could address**, not solutions. Evidence strength: **H** high, **M** medium, **L** low.

> Expert interview done (section 0). All research runs are finished. Weakest numbers are marked as such; check them before they go on a slide.

---

## 0. What the AstraZeneca expert told us (14 Nov)

Full notes: `docs/discovery/09-expert-interview-2026-11-14.md`. One expert's view; the study they quoted is unpublished.

- **GPs in Finland can't order a CT scan.** It's a known gap. Staging needs a CT, so GPs can't stage either.
- **No fast track** for suspected cancer that they know of.
- **Where the delay is:** the expert quoted an unpublished lung cancer study by Prof. Outi Kuittinen (University of Eastern Finland). Yle reports it as **155 days in total: over 50 before the patient seeks care, 41 in primary care, 58 in specialised care** ([Yle MOT](https://yle.fi/a/74-20251023); hospitals in Kuopio, Tampere, Turku, Rovaniemi). Not equal thirds: over 50 patient, 41 primary healthcare (about a quarter), 58 specialised care. The expert remembered the last part as "GP tests"; Yle says specialised care.
- Patients stay away because of cost, distrust, background, fear and not knowing enough.
- GPs don't have to put stage in the referral; one county does. Referral quality varies a lot.
- The legal clock is 3 weeks to first appointment, 6 months to treatment. Enforcement is unclear.
- **What they want from us:** a concrete, mainly AI-based tool, used in healthcare or by patients, that doctors or nurses can use and that can be offered to the government.

Our reading: this backs package A. A GP risk prompt that opens a fast route with a CT the GP can trigger, plus a pre-filled referral with stage fields, cuts the GP share (41 days, about a quarter) and, because the CT is already done, part of the specialist share (58 days).

---

## 1. The short version

- **The track asks:** find where cancer care in Finland is unequal, show where in the pathway it happens, and recommend concrete fixes a county or the nation can act on. Must use public data, cite everything, and hit a **Goal 3** indicator of the national cancer strategy.
- **What the evidence says:** people with less education or money, and people who must use public primary care, get diagnosed later, get less curative treatment and die more often. The biggest measurable gap opens **early**: getting to a doctor and getting referred.
- **Why it persists (our reading, not a study's finding):** the law sets a separate clock for each step (Health Care Act §51c, §52 – checked in the law text) and no cancer deadline, so **nobody owns or measures the total wait**. The data to see the gap (time to diagnosis, stage) is missing or patchy, and the strategy itself says equity monitoring has no funding.
- **Glasses / phone coach (Direction B): weak fit.** Prevention is Goal 2, not Goal 3; users skew educated; no proof it works; outcomes take decades.

---

## 2. The outcome gaps (what is unequal)

| Gap | Numbers | Strength |
| --- | --- | --- |
| Treatment by education (higher vs lower) | Surgery 51% vs 36%, radiotherapy 25% vs 14%, chemo 24% vs 15%. Raw shares, not adjusted for age or cancer type ([Zai 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12551501/)) | H |
| Cancer death by education | Hazard 1.13–1.14× for lower education; more stage IV | H |
| Time to treatment, public vs private/occupational route (lymphoma) | **207 vs 123 days** from symptom to treatment (the paper's Figure 1, same as the deck). The paper's statistical test gives medians of 127 vs 76 days (p = 0.027) ([Kuitunen 2026](https://doi.org/10.1002/cam4.71920), n = 160). Route mattered, not education or income directly | M (one small, drug-company-funded study) |
| Where the delay sits (lymphoma) | Only 54 of 146 days (on average) before the first contact; the rest is inside the health system. Same patients, different paper ([Tokola 2025](https://doi.org/10.1002/cam4.71409)) | M |
| Severe mental illness | ~1.4–1.5× cancer death, not explained by stage | H |
| Screening | Somali/African-born women cervical 46% vs 73%; Helsinki, Vantaa–Kerava, Länsi-Uusimaa below 68% | M |
| Regions | Lung surgery median 13.5 days after diagnosis in the North vs 46 days in the South | M |
| Cost | 23% of patients avoided care; 4 in 5 of those because of cost | M (patient survey) |
| Feeling dismissed | Over half felt symptoms weren't taken seriously; a third needed 3+ contacts | M (patient survey) |
| Why people wait (public survey, n=1,000, 2024) | 61% say cost often or sometimes delays tests (top reason); 51% fear the findings; ~1 in 4 avoided care for possible cancer symptoms, mostly younger people; men mainly minimise symptoms | M |
| Health literacy | Limited in 15% of people overall, **42% of migrant-origin people**; lower with less education. Migrants mix up health centre and hospital | M |

---

## 3. Problems we could address (ranked)

Scored on: how strong the evidence is, how well it fits the brief and Goal 3, whether public data exists to show it by county, and whether a county could act on it. **Ranking is a recommendation; the choice is yours.**

| Rank | Problem | Main cause | Pathway step | Evidence | Goal 3 fit | Public county data | County can act |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **1** | **Nobody sees the total cancer wait.** No cancer deadline in law. A national target exists only in guidance: **max 6 weeks from suspicion referral to first treatment**, imaging and biopsy within 1 week (STM 2010:6; THL Ohjaus 21/2016 defines how to measure it). Nobody publishes cancer waits against it (THL's county waits don't split out cancer; only Turku University Hospital (TYKS) publishes some bowel-cancer averages). The strategy indicator "treated within target times" names no targets | Separate legal clocks per step; monitoring unfunded (strategy p.33); no time-to-diagnosis indicator | Referral → treatment | H (law and strategy text) | **Direct** (Goal 3 headline indicator H3) | **No** – the gap itself is the finding; proxies exist | Yes: log timestamps, publish waits, put cancer targets in county agreements |
| **2** | **Two-speed entry into care.** People without occupational or private care take the slow public route | Occupational care for employees; Kela private refund cut to €8/visit (2026); fees | First contact → referral | M | Strong (equal access, 3.1) | Partial (GP access by county, screening, survival) | Partly: public fast lane for suspected cancer |
| **3** | **Suspected cancer gets no fast lane in public primary care.** Repeated visits, symptoms dismissed. No national fast track exists (Yle MOT); only a few local ones (e.g. lung, Pirkanmaa), none evaluated. No national red-flag symptom list like the UK's. GPs often can't order CT/MRI directly (Oulu needs a specialist referral); Finland has the lowest primary-care CT access in the Nordics (snippet). Patients overlooked at the first visit had 1.89× higher 3-year death risk (old 1996 cohort) | "Urgent" in law means acute; adults' limit 3 months; GP shortage (Vantaa–Kerava 44% within legal time vs >90% North Karelia) | Physician visit → referral | M | Strong | **No** (no data on GP-to-scan time or referral returns) | Yes: fast lane, red-flag list, direct imaging |
| **4** | **Spread data (TNM, stage or free text) is missing for most cases** (registry's 2024 report, solid cancers: 41.9% recorded, 58.1% missing in its table; Pirkanmaa 71.9%; target ≥70%; [factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)). Denmark had stage for 96% of lung cancers in 2014–16 ([PMC11332511](https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511/)). Without it you can't see stage shift or stage gaps by region or education. **Proven fixable:** Pirkanmaa raised clinical notifications from 42% to 80% (2022–2024) by changing its recording workflow | Mostly a **notification gap**: the registry says clinical notifications cover only about half of new cases, caused by low reporter activity (factsheet section 4.4), not hospitals refusing to send. Reporting is a binding THL duty, but no penalties and no automatic feed | Diagnosis | H (registry report) | Direct (3.2 quality-register coverage 90%, 90% automated reporting by 2030) | Yes, completeness by region | Yes: structured recording, automated reporting |
| **5** | **Screening misses some groups and areas** | County extras optional; no outreach duty; language | Before symptoms | M | Weak–medium (screening is mostly Goal 2) | **Best data**: screening by county and education 2018–2024 | Yes: targeted outreach |
| **6** | **Treatment differs by education and county** (surgery gap; lung surgery 13.5 vs 46 days; new drugs adopted county by county) | No binding national treatment-selection criteria (deck p.16); county budgets; centralisation | Treatment | H (education), M (region) | Direct | Yes (survival by county; lung report) | National more than county |
| 7 | Severe mental illness and migrants fall through | Stigma, language, outreach, comorbidity | Whole pathway | H (mental illness), M (migrants) | Medium | Little | Partly |
| 8 | Cost deters care | Client fees, discretionary waivers, debt collection | Before first contact | M | Medium | Little | Yes (fee waivers) |
| 9 | Distance in the north and east | Radiotherapy centralised (Oulu only northern unit) | Treatment | M | Medium | Some | Limited |

**Our read:** problems 1–4 form one story – *the public route is slower early on, and the system can't see it because the timestamps and stage data aren't collected or published.* That fits the brief's three asks (find the gap, locate it, recommend action) and Goal 3 directly.

### 3b. Possible solution directions per problem (first ideas, not chosen)

These are starting points to test, not decisions. Each has a main risk taken from the research above.

| # | Problem | Possible solution direction | Main risk |
| --- | --- | --- | --- |
| 1 | Nobody sees the total wait | County **pathway-delay view**: which dates hospitals record, the wait against the 6-week target by county, and where the time goes. Recommendation: publish it and put the target in county agreements | Cancer wait data isn't public; demo needs proxies or expert-supplied tables |
| 2 | Two-speed entry | **Route-gap simulator**: show how many people depend on public GP care by county (unemployed, retired, low income), and model a public fast lane for suspected cancer | No public data on which route patients took; rests on one lymphoma study |
| 3 | No fast lane at the GP | **GP referral rule + risk prompt**: a red-flag list and direct-CT rule, with a score from past records and symptoms as an add-on. Also a **repeat-visit flag** (3+ visits for the same symptom) | Regulated device if it ranks patients; weak proof that such tools change referrals; CT capacity |
| 4 | Stage missing | **Stage-completeness tracker + Pirkanmaa playbook**: completeness by county, and the workflow change that took Pirkanmaa from 42% to 80% | Less exciting demo; county-level numbers partly from news reports |
| 5 | Screening gaps | **Outreach planner**: low-uptake areas and groups, with invitation language and reminders | Closer to Goal 2 (prevention) than Goal 3 |
| 6 | Treatment differs by county | **Treatment-variation map**: surgery and time to surgery by county and education | Differences may reflect patient mix; acting on it is national more than county |
| 7 | Mental illness, migrants | **Navigator protocol**: a named contact who follows high-risk groups through the pathway | Navigation narrows gaps only a little (US: 108→97 vs 65 days); little Finnish data |
| 8 | Cost | **Fee-waiver check**: automatic waiver for suspected-cancer visits; no debt collection for them | Policy change, little tech; little data |
| 9 | Distance | **Travel-burden map** for radiotherapy, with options such as travel support or lodging | Low novelty; limited county action |

**Our read:** 1 + 3 + 4 together tell one story: *speed up the public route early, and make it visible.* A demo could show the delay view (1), with the GP rule (3) and the stage tracker (4) as the actions.

### 3b+. Folding problem 2 (two-speed entry) into 1, 3, 4

The gap is about **route** more than money: in the one Finnish study, route (public GP vs occupational/private) predicted delay; income and education did not reach significance. Low earners just start in public GP care more often (37.5% vs 15.4%). Source: Kuitunen 2026 via `law/08` I-12.

| Part | How it covers two-speed entry |
| --- | --- |
| 1. Wait view | Split every wait by **entry route** and by area income/unemployment. That makes the two speeds visible |
| 3. GP fast lane | It sits in **public** primary care, exactly where the slow route is. Watch the route split for crowd-out (Sweden's fast tracks crowded out vulnerable patients) |
| 4. Stage | Stage by route and area shows whether the slow route also means later stage |

Data: route is not in public data. Use county proxies (unemployment, income by municipality from Statistics Finland; occupational-care coverage) and give the made-up patients a route field.

### 3b++. What else we take on (Michal, 2026-11-14)

Some smaller problems sit next to 1, 3 and 4. This is what we do with each.

| Problem | What we do |
| --- | --- |
| Patients go back to the GP 3 or more times with the same symptom | Fix it. The GP tool flags the third visit. |
| Hospitals send GP referrals back | Fix it. The wait view counts a returned referral as a step, so the lost time shows. |
| GPs can't order CT directly | Problem slide only. Our fast lane helps a bit. |
| Cancers found only in A&E | Problem slide only. Earlier GP referral helps a bit. |
| Time before the first GP visit | Maybe a slide. |
| Fees and debt collection | Maybe a slide. |
| Separate county data, registry funding, mental illness, migrants | Left out. |

### 3c. Four ways to package it

| | A. The loop | B. Measure first | C. Diagnostic centre | D. GP tool only |
| --- | --- | --- | --- | --- |
| What we build | GP fast-lane rule, risk prompt, county wait view, auto-filled stage report | County wait view and stage tracker | A Danish-style centre for vague symptoms, simple GP tests, wait view | Risk prompt and repeat-visit flag |
| Problems it covers | 1, 3, 4 | 1, 4 | 1, 3 | 3 |
| Proof it works elsewhere | Mixed | Good (Pirkanmaa) | Good (Denmark) | Weak |
| Real data for the demo | Some | Most | Some | None |
| Risk of not finishing | High | Low | Medium | Low |

We lean to **A**. We ask the doctor on Saturday morning and lock the scope by Saturday noon. The build has to end Saturday night, because the final submission is due Sunday at 10:00.

If A turns out too big, fall back to B and show the GP fast lane as a simulation on top. Full detail is in `docs/discovery/07-solution-directions.md`.

---

## 4. Laws that slow things down or make them unequal

| Law | What it does to cancer care |
| --- | --- |
| Health Care Act §51–52 (1326/2010, [Finlex](https://www.finlex.fi/fi/lainsaadanto/2010/1326)) | Each step has its own deadline. Contact the same day, and a primary-care visit within 3 months. At the hospital, the assessment starts within 3 weeks of the referral arriving and ends within 3 months. Treatment starts within 6 months of the need being found (§52). None of these is for cancer. "Urgent" in the law means a sudden turn for the worse, so a suspected cancer waits in the normal queue. |
| Client fees act (734/1992) | Patients pay fees. A waiver is up to the county, and unpaid fees go to debt collection. This puts off people on low incomes. |
| Kela refund cut (2026) | Kela now pays back only €8 for a private doctor visit. People without occupational care lose the private shortcut. |
| Kela change (1 July 2026) | Kela no longer refunds medicines that counties give out. Counties now carry that cost. |
| Screening decree (339/2011) | Sets the national minimum. Extra screening is up to each county, and no law makes them reach out to people who don't come. |
| County laws (611/2021, 617/2021) | Each county sets its own care pathways and budget. Many run deficits, so the speed of care differs by county. |
| THL act §5 c (668/2008) | Hospitals must report every cancer to the registry. No law names stage, but the registry's data rules ask for it. There is no penalty for not reporting, and only about 40% of cases get the clinical report that carries stage. We couldn't open THL's 2023 decision annex. |

We first wrote that adults must get a primary-care visit within 7 days. That plan was cancelled, so the limit is still 3 months.

---

## 5. What others tried, and what it means for us

Sources: `research/context/03`, `research/context/13`, `research/tech/00`, `research/countries/00`.

### For problem 1: nobody sees the total wait

- Denmark has published cancer pathway times for each region every quarter since 2012. Hospitals log fixed points along the pathway in the patient register.
- Denmark, Norway, Sweden and England all run wait clocks. Each starts at referral or diagnosis, and none splits the wait by how the patient got in.
- Finland publishes no cancer wait at all. Its lung-cancer waits are the longest in the Nordics: 14 days to a health-centre visit, 2 to 4 weeks to a specialist, and 4 weeks to diagnosis (IHE 2026 dashboard, citing Khalife 2025).
- Finnish counties have had cancer pathways since 2023. We found no evaluation of them.

### For problem 3: no GP fast lane

- Fast tracks in Denmark, Norway, Sweden and the UK cut the first wait. Denmark saved 17 days. Treatment start often stays slow and misses the target.
- UK risk prompts (C the Signs, QCancer, eRATs) have not been shown to catch cancer at an earlier stage. Rolling out QCancer did not raise referrals.
- In Scotland GPs can book a CT, but they get no prompt. We found nobody who links a risk prompt to a scan the GP can book. That is the gap we would fill.
- Catalonia gives GPs one electronic referral form and a named hospital for each health centre. The first test comes within 2 weeks and treatment in about 30 days.
- HUS's ÄLLI tool sorts referrals once they reach the hospital. We work one step earlier, at the GP. In the UK, LungIMPACT reordered a queue and the waits did not get shorter.

### For problem 4: stage is missing

- Pirkanmaa made the registry report part of the diagnosis entry, built by CGI with the registry. Its reports went from 42% to 80% of cases. The data got better, but no patient result has been published. A national order to report came in at the same time, so we can't tell how much of the rise the new workflow caused.
- The Netherlands and Belgium record stage for over 90% of cases. They use trained registrars, or a short stage form at the tumour board.
- Sweden's legal duty to report did not close its gaps. An automatic data feed did.
- AI can read stage from English pathology reports with 0.9 to 0.99 accuracy. We found no tool that does it in Finnish.
- Denmark's cancer pathways did not clearly shift stage overall (odds ratio 0.88, not significant). Patients sent through the fast pathway were found at an earlier stage a bit more often (0.77). So a fast lane may help the people who get into it, not everyone (`research/context/13`).

### For fairness (the route gap)

- No country has shown that a fast lane narrows the gap between rich and poor.
- Sweden's fast tracks pushed vulnerable patients further back. In Norway, poorer patients got onto pathways less often. Ireland's rapid prostate clinics did not cut late-stage diagnosis. Danish direct CT helped only the GPs who used it.
- In the US, patient navigators narrowed the gap but did not close it. Waits fell from 108 to 97 days, against 65 days for the comparison group.
- Almost nobody measures delay, stage and income together.

### What this means for package A (our reading)

1. Measure every step up to the first treatment, not just one part.
2. Log who gets into the fast lane, by route and area income. Otherwise it may help the people who already get in fast.
3. Teach GPs the rule when the prompt goes live. A prompt on its own did little in the UK.
4. Treat missing stage as a warning sign, because it is missing most often for older and poorer patients.
5. Pre-fill the stage report and let a named doctor sign it.

---

## 6. Data we can actually use

| Dataset | What it shows |
| --- | --- |
| Cancer Registry: screening by county and education, 2018–2024 | Who misses screening, and where |
| Cancer Registry: lung cancer report | Time from diagnosis to surgery, by region |
| THL Sotkanet (open API). CC BY 4.0 covers THL's own data only; Kela and Statistics Finland indicators have their own terms ([licence page](https://sotkanet.fi/sotkanet/en/ohje/74)) | 5-year survival, new cases, cancer clinic visits and screening, by county |
| THL access-to-care statistics | Primary-care waits by county |

What is missing:

- cancer waits from referral to treatment, by county;
- stage by county (we only know how often it is recorded);
- anything that links delay to income or education.

---

## 7. Direction B: glasses or a free phone app (parked)

We looked at a patient-side tool and dropped it. It fits the main track badly either way. It could still enter the Gemini or Gemma side challenges.

| Problem with it | Glasses | Free phone app |
| --- | --- | --- |
| Costs money, so richer people get it | Yes | No |
| Needs digital skills. 42% of people aged 75–89 use a smartphone, and 76% of people with basic education do, against 96% of graduates | Yes | Yes |
| Users quit. On average 43% drop out, and educated users stay longer | Yes | Yes |
| No proof it changes what people do | Yes | Yes |
| It is about prevention, which is Goal 2, not Goal 3 | Yes | Yes |

### 7b. Idea: patient risk score that fast-tracks high-risk patients

| | After diagnosis (needs stage and location) | Before diagnosis (GP tool) |
| --- | --- | --- |
| Problem it hits | Orders people already in the queue; not where the gap is | Problem 3: no fast lane, no red-flag list |
| Already exists | Yes: TNM, PREDICT, IPI | UK QCancer, Hamilton RATs, NICE NG12; nothing in Finland |
| Proof it helps | Accurate, but no proof it shortens waits | Accurate; weak proof it changes referrals |
| Demo data | Published formulas on made-up patients | Same |
| Regulation | Likely MDR class IIa+; AI Act high-risk from Dec 2027 | Same; a missed case is worse |
| Equity risk | High: 58% missing stage, foreign training data | High: QCancer under-predicts in minorities |
| Brief fit | Weak: no county action; brief allows aggregate data only | Better, if tied to a county referral rule |

**Verdict:** the after-diagnosis version misses the gap. The GP version fits better, but the score should be an add-on: the core is a county referral rule (what triggers a fast referral or direct CT) and its effect, shown on aggregate data. Detail: `docs/research/context/11-risk-score-idea.md`.

**GP version, deeper check** (`docs/research/context/12-gp-risk-tool.md`):
- **Already in Finland:** Duodecim EBMeDS decision support runs inside Apotti, and Apotti accepts add-on apps (SMART on FHIR). No cancer red-flag rule or cancer-risk prompt was found in it. Current Care guidelines have lung and prostate referral triggers (snippets only); colorectal and ovarian criteria were not found.
- **Evidence:** the biggest UK trial (ERICA, 530 practices, endpoint: later vs earlier stage) has no published result. Rolling out QCancer did not raise referrals (+3.1 per 100,000, not significant).
- **Missing Finnish data:** emergency-route share, how often each symptom turns out to be cancer, CT waits by county.
- **Demo data:** made-up Synthea patients (Apache 2.0) with UK model formulas, clearly labelled; plus county totals.
- **Verdict:** real gap, unproven fix. Present it as a referral rule a county could adopt, with the prompt as the delivery; don't claim a Finnish patient-level score.

---

## 8. Things we got wrong and fixed

- Deck lymphoma figure: we first said "207 vs 123" wasn't in the paper. It is (Figure 1). The paper's test uses medians, 127 vs 76 days. Both are fine to quote if we say which is which.
- The "146 days, 54 before first contact" figures are from Tokola 2025 (same patients), not Kuitunen 2026.
- Denmark: we first wrote that its pathways improved stage. The study shows no clear overall shift.
- Babylon (UK AI triage) went into administration in Aug 2023, not "collapsed Sep 2023".
- TAYS (Tampere) has a mid-tier OECI cancer accreditation, not "comprehensive cancer centre".
- Adults' primary-care limit: 3 months, not 7 days.
- "No county data": only true for **cancer waiting times**; many other cancer measures are public by county.
- "Only hospital policy decides stage recording": **false** – it's a binding national THL duty, but weakly enforced.
- Earlier "Goal 3 link" for the glasses (screening uptake) doesn't hold.
- **OECD "Finland monitors cancer waits and fines providers"**: checked. The OECD Finland 2025 profile has a heading saying waits are monitored, but the text only states the 6-week target, with no data. The "fines" line is in a separate OECD 2024 report (highlights only) and most likely means general care-guarantee supervision, not cancer waits. Problem 1 stands: nobody publishes cancer waits against the target. Expect a judge to raise it.

---

## 9. Biggest unknowns

1. Total time from first symptom to treatment, by county and income – no public data.
2. Is stage missing from patient charts, or just not sent? The registry says mostly not sent, but no study splits the two.
3. Whether any county measures itself against the 6-week target internally (nothing published found).
4. Time from first GP contact to scan or specialist, by county; referral return rates. No data found.
5. How much of the education survival gap remains after stage and treatment.
6. Time from symptom to first contact, by education and age, with the reasons (cost, fear, not knowing where to go, phone/digital booking). No Finnish study measures it.

---

## 10. Questions for the doctor

**Before you ask: what question 4 is about.**

- In 2010 the health ministry set a goal: a suspected cancer should start treatment within **6 weeks** of the referral ([STM 2010:6, section 7.2](https://www.iccp-portal.org/system/files/plans/selv_2010_6_syovan_hoito_verkko.pdf)). THL's 2016 guide on measuring cancer waits ([Ohjaus 21/2016](https://www.julkari.fi/items/0424a55a-f159-406f-8883-5dfdad4d6772)) sets how to measure it; we could not open its full text.
- It's only guidance, not law. The law's deadlines are 3 weeks to start assessing, 3 months to finish, 6 months to treat, and none is for cancer ([Health Care Act §52](https://www.finlex.fi/fi/lainsaadanto/2010/1326)). So a patient can wait months and every legal deadline is still met.
- Nobody publishes cancer waits against the 6 weeks ([THL](https://thl.fi/en/data-and-statistics/access-to-treatment/access-to-services-in-specialised-health-care)). That's our problem 1.
- What the answer means: "yes, and we check it" means the dates exist and we can use them. "Yes, but nobody checks" is exactly problem 1. "What target?" means our pitch is "a county should adopt it, and our tool tracks it".

The full read-aloud sheet is `docs/discovery/06-expert-questions-spoken.md` (21 questions). Ask these 7 first:

1. On the public route, where do patients lose the most time? Getting in to see the GP, getting referred, or waiting for tests?
2. Can a health centre GP book a CT scan themselves? And how long is the wait for it?
3. Which dates does the hospital system actually record?
4. Do you still work to the six-week target? Does anyone check it?
5. An OECD report says Finland fines providers that miss wait targets. Has that ever happened for cancer?
6. Pirkanmaa records stage way more often than everyone else. Why? And did it help patients, or just the data?
7. Would you use a cancer-risk prompt in your patient record system? How many a day before you'd start ignoring them?

---

## Index of source files (only if you want detail)

- Track: `docs/tracks/astrazeneca-cancer-care.md`, `docs/tracks/astrazeneca-insights-deck.md`
- Discovery: `docs/discovery/00`–`05` (brief, problem map, secondary evidence, cause map, issues and causes)
- Law: `docs/research/law/00-synthesis.md`, `07-verification.md`, `08-inefficiencies.md`, `09-stage-recording-law.md`
- Context: `docs/research/context/01`–`10` (strategy, data, other countries, regions, vulnerable groups, stakeholders, stage data, fast lanes, wait targets, patient delay)
- Direction B: `docs/research/glasses/02`–`09`, `docs/research/glasses/emulation/`
