> **Desk draft. Hypotheses only. No customer testimony yet.**

# Problem map: cancer care equity in Finland (desk draft)

Date: 2026-11-14. Built only from the desk files below. Next step: interviews, then update this map ([guide §7](01-interview-guide.md) item 10). **Humans own** the target group and the MVP scope. This map ranks; it does not choose.

## Source keys

Cite as `[key p.x]` or `[key §x]`. Paths are under `docs/`. Each key links to the file; URLs for the underlying facts are given next to the claims.

- **deck**: [`tracks/astrazeneca-insights-deck.md`](../tracks/astrazeneca-insights-deck.md) (Kuitunen slide notes, 13.11.2026; p. = PDF page; PDF: [astrazeneca-insights-deck-2026-11-13.pdf](../tracks/astrazeneca-insights-deck-2026-11-13.pdf))
- **brief**: [`tracks/astrazeneca-cancer-care.md`](../tracks/astrazeneca-cancer-care.md) (challenge rules, Goal 3 wording)
- **disc**: [`discovery/00-discovery-brief.md`](00-discovery-brief.md)
- **guide**: [`discovery/01-interview-guide.md`](01-interview-guide.md)
- **law00**: [`research/law/00-synthesis.md`](../research/law/00-synthesis.md)
- **law07**: [`research/law/07-verification.md`](../research/law/07-verification.md) (corrects law00, see warnings)
- **gl03 / gl06 / gl07**: [`research/glasses/03-risk-evidence.md`](../research/glasses/03-risk-evidence.md), [`06-goal3-link.md`](../research/glasses/06-goal3-link.md), [`07-privacy-regulation.md`](../research/glasses/07-privacy-regulation.md)
- **secondary**: [`discovery/03-secondary-evidence.md`](03-secondary-evidence.md) (S1–S13 with URLs)

Confidence: **medium** = a primary text was read or several sources agree. **low** = one secondary source, or our own inference.

## Warnings on the sources

- **deck p.11 (DLBCL numbers):** one lymphoma cohort, Kuitunen et al. 2026 ([abstract and discussion read](https://www.utupub.fi/bitstreams/c41f15c1-55cb-4bc6-9b88-6b80856ded77/download), see [secondary S5](03-secondary-evidence.md)). *(Corrected 2026-11-14: "nobody has read it" is out of date. The full text could not be read in this session, because the PDF returned no extractable text.)* The deck notes say the slide's times match the paper. The paper's route test is given there as median 127 vs 76 days (n=48 vs 39, p=0.027). That is a different cut from the slide's cumulative 207 vs 123, so check which interval the 127/76 refers to before any slide uses it. Education, income and occupation were not significant for the delay ([deck notes, p.11 corrections](../tracks/astrazeneca-insights-deck.md)). Kuitunen et al. was Incyte-funded. The deck notes also say the two DLBCL papers are one cohort design, so count them as one source.
- **deck p.14–15 (education gap):** the gap is by **education**, not income or occupation. Group 1 is defined by the route (public vs private). Do not call the education gap an income finding. The numbers 51 vs 36 (surgery) and 27 vs 47 (cancer deaths) are crude shares from Zai et al. 2025 ([paper](https://bmjpublichealth.bmj.com/content/3/2/e002829)). The paper's adjusted cancer-death hazard ratio is 1.13 (men) and 1.14 (women), low vs high education ([deck notes, p.15](../tracks/astrazeneca-insights-deck.md)). The publisher page returned 403 in this session, so these figures are from the deck notes only.
- **deck p.2 and brief:** the brief calls the mentors "AstraZeneca mentor insights" ([brief, Reliable evidence](../tracks/astrazeneca-cancer-care.md)). The speaker's consulting link to AstraZeneca is not in the deck notes. [source needed] Treat their input as expert opinion, not neutral data.
- **law00 is out of date in one place:** row 6 says "7 days", which applies only to a non-doctor-to-doctor referral (§51a). The "3 weeks / 3 months / 6 months" clocks in its TL;DR are correct. **[law07 §2](../research/law/07-verification.md) corrects row 6.** Use law07. Current law, per the [Finlex consolidated Terveydenhuoltolaki 1326/2010](https://www.finlex.fi/fi/lainsaadanto/2010/1326): assessment of a specialist referral within 3 weeks of arrival (§52); adults 3 months after assessment (§51a); under-23 general medicine 14 days (§51a); specialist care 3 months from need assessed, +3 if justified (§51c); treatment within 6 months of need established (§52). The [STM guidance of 25.3.2025](https://valtioneuvosto.fi/-/1271139/miten-hoitotakuuta-koskevia-saannoksia-sovelletaan-stm-julkaisi-ohjeet-hyvinvointialueille) agrees and mentions no 7-day limit.

## Pathway used here

The 8-step delay model from [deck p.10](../tracks/astrazeneca-insights-deck.md): 1 symptoms begin · 2 deciding to seek care · 3 first contact · 4 physician assessment · 5 tests and referral · 6 diagnosis · 7 team plan (MDT) · 8 treatment start. Prevention sits before step 1 [deck p.7–8](../tracks/astrazeneca-insights-deck.md).

## The one hard number set: DLBCL, public vs private [deck p.11]

Source numbers are cumulative days from symptom onset ([deck notes, p.11](../tracks/astrazeneca-insights-deck.md); the paper's numbers are not confirmed here, see the warning above). The "days in stage" column is our subtraction (interpretation, not in the source).

| Stage | Days in stage: public | Days in stage: private | Gap (public − private) |
| --- | --- | --- | --- |
| Onset → first contact (steps 1–3) | 72 | 42 | **+30** |
| First contact → physician (step 4) | 22 | 1 | **+21** |
| Physician → referral (step 5) | 53 | 34 | **+19** |
| Referral → specialist | 57 | 41 | **+16** |
| Specialist → treatment start (step 8) | 3 | 5 | **−2** |
| **Total (onset → treatment start)** | **207** | **123** | **+84** |

Read: most of the public-route gap comes **before** the specialist. In this one cohort the last measured step shows no gap. That cuts against the brief's "diagnosis → treatment" bottleneck ([brief, Known bottlenecks 3](../tracks/astrazeneca-cancer-care.md#known-bottlenecks-starting-points)). The notes give no diagnosis date, so step 6 is not measured here.

---

## Group 1: adults with possible cancer symptoms, using public primary care

*Provisional group from [disc, group 1](00-discovery-brief.md). Lower SES is assumed, not measured.*

- **Situation:** notices a symptom, uses the public GP route, has no work or private health cover.
- **Job to get done:** get a doctor to take the symptom seriously, get a referral, and start treatment without months of waiting.
- **Problems along the 8 steps:**
  - Step 2: delay from fear, playing it down, low health literacy [deck p.10; health literacy named as a driver, p.7](../tracks/astrazeneca-insights-deck.md). Survey support: over half felt symptoms were not taken seriously, and 23% avoided care for possible cancer symptoms ([S1](https://www.sttinfo.fi/tiedote/70972938/kyselyselvitys-joka-kolmas-syopapotilas-kokee-diagnoosin-viivastyneen?publisherId=69820264), [S2](https://www.verkkouutiset.fi/a/en-halua-tietaa-moni-pelkaa-etta-oireiden-taustalla-on-syopa/); see [secondary](03-secondary-evidence.md)). → **P1**
  - Steps 1–3: +30 days before first contact vs private route [deck p.11](../tracks/astrazeneca-insights-deck.md). The data include step 2, so patient delay and first-contact delay cannot be split. → **P1**
  - Step 3→4: first contact to physician 22 days vs 1 day. "Limited GP access" [deck p.10](../tracks/astrazeneca-insights-deck.md). → **P2**
  - Step 4→5: same-day contact only in office hours ([law07 §51](../research/law/07-verification.md); [Finlex 1326/2010 §51](https://www.finlex.fi/fi/lainsaadanto/2010/1326)). A non-acute suspicion is not "urgent" in law, so it goes to the ordinary queue. This is an inference, marked UNVERIFIED against Käypä hoito or county practice ([law00 row 6](../research/law/00-synthesis.md)). → **P3**
  - Step 5→6: specialist wait 57 vs 41 days [deck p.11](../tracks/astrazeneca-insights-deck.md). The legal limit is 3 months (+3) and is not cancer-specific ([law07 §51c](../research/law/07-verification.md); [Finlex 1326/2010 §51c](https://www.finlex.fi/fi/lainsaadanto/2010/1326)). → **P4**
  - Steps 6–7: no source gives diagnosis or team-plan timings by route. **Evidence gap.** Tokola et al. 2025: symptom-to-biopsy over 7 weeks is linked to worse progression-free survival [deck p.11](../tracks/astrazeneca-insights-deck.md). *[source needed: Tokola et al. URL not found in two searches.]* Corrected: the 7-week cut-off is data-driven and unadjusted. The PFS link is strongest in the high Ki-67 subgroup, and for the whole cohort 2-year PFS is 89% vs 74% (p=0.012) ([deck notes, p.11 corrections](../tracks/astrazeneca-insights-deck.md)).
  - Step 8: 3 vs 5 days after specialist; no gap in this cohort [deck p.11](../tracks/astrazeneca-insights-deck.md).
  - Outcome: lower SES → later stage, fewer curative treatments [deck p.7, p.12–13](../tracks/astrazeneca-insights-deck.md). The Nordic review (Ammitzbøll et al. 2022, 98 studies) reports the same pattern: [Acta Oncologica 61(11):1317–1331](https://medicaljournalssweden.se/actaoncologica/article/view/23823), DOI [10.1080/0284186X.2022.2143278](https://doi.org/10.1080/0284186X.2022.2143278). Education: surgery 51% vs 36%; cancer mortality 27% vs 47% (crude shares of people who died of cancer in 2000–2019; [Zai et al. 2025](https://bmjpublichealth.bmj.com/content/3/2/e002829); see the warning above).
- **Current workarounds** (hypotheses, no source yet): private or work care if money or work allows [deck p.5: these give faster routes](../tracks/astrazeneca-insights-deck.md); paying fees and travel, which delay tests [deck p.5](../tracks/astrazeneca-insights-deck.md); asking contacts for navigation [deck p.7](../tracks/astrazeneca-insights-deck.md). Use of the Omaolo symptom checker by this group: unknown ([gl06 §5](../research/glasses/06-goal3-link.md); [Omaolo study](https://journal.fi/finjehew/article/view/97020/72893)).
- **Confidence:** medium that a public-route delay exists (deck + one cohort). Low on which step is most fixable.
- **Interview that confirms or kills it:** [guide §2](01-interview-guide.md) prompts 1–3 and "How long from first call to first appointment?". **Kill** if most of the delay comes after referral, or if private care was picked by preference, not because public care was too slow.

## Group 2: primary care doctors and nurses who must spot and refer suspected cancer

*Provisional group from [disc, group 2].*

- **Situation:** sees vague symptoms in a busy practice, decides if it is suspicious, picks the route and the form.
- **Job to get done:** spot suspected cancer early, refer fast, and find out what happened next.
- **Problems along the 8 steps:**
  - Steps 3–4: "symptoms not recognised" and "limited GP access" are named system delays [deck p.10](../tracks/astrazeneca-insights-deck.md). Finnish health centres had 325 unfilled doctor posts on one survey day in Oct 2022 (8% of doctor posts) ([S10](https://www.verkkouutiset.fi/a/terveyskeskusten-laakarivaje-on-pahentunut/), news report). → **P2**
  - Step 4→5: strategy asks for "standardised referral criteria" in care pathways ([gl06 §2.5](../research/glasses/06-goal3-link.md); [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)). Asking for it suggests they are not standard yet (inference). → **P3**
  - Step 5: no statute requires referral-arrival or treatment-start timestamps ([law00 row 2](../research/law/00-synthesis.md); [Finlex 1326/2010](https://www.finlex.fi/fi/lainsaadanto/2010/1326)). This is a negative finding from search only, not verified (law00 rates it low, UNVERIFIED). The GP may not hear back. → **P3, P6**
  - Regional variation: "different service networks, digital tools and pathways lead or enable inequities" [deck p.3–4](../tracks/astrazeneca-insights-deck.md). → **P9**
- **Current workarounds:** unknown. Nothing in the files. [guide §3 RQ2](01-interview-guide.md) asks about tools and forms.
- **Confidence:** low. No Finnish GP-side source and no GP interview yet. UK GP evidence (interview study, 2017) points the same way: [S11](https://doaj.org/article/49afc2d797e54917a47cd54817512854).
- **Interview:** [guide §3](01-interview-guide.md) (no contact yet). **Kill** if referrals are fast and the delay sits in patient timing or the specialist queue.

## Group 3: county service managers (wellbeing county)

*Provisional group from [disc, group 3].*

- **Situation:** owns pathway timeliness, equity and budget. Decides on extra screening, drug adoption and cross-county agreements.
- **Job to get done:** see where the county falls behind, act within law and budget, and show equity.
- **Problems:**
  - No owner of the total wait. Clocks are split, and the treatment clock starts at "need established" ([law00 row 2](../research/law/00-synthesis.md); [law07 §2](../research/law/07-verification.md); [Finlex 1326/2010 §52](https://www.finlex.fi/fi/lainsaadanto/2010/1326)). → **P6**
  - No public county cancer waiting data. Only a non-cancer specialist-wait proxy by wellbeing area, from news reports ([law07 §3](../research/law/07-verification.md); [news report, not opened](https://www.verkkouutiset.fi/a/erikoissairaanhoidon-jonot-kasvoivat-edelleen-huhtikuussa/)). → **P7**
  - New hospital cancer drugs are adopted county by county, with no uniform procedure ([law00 row 4](../research/law/00-synthesis.md); [strategy PDF, p.52](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf); [STM 2026](https://stm.fi/documents/1271139/248296494/Laakehuollon_ohjauksen_kehittaminen.pdf/b6ac93c1-9c74-d3d6-a8c5-0d94263b2ba2?t=1793016170164)). → **P10**
  - Screening beyond the national programme is optional for the county ([law00 row 5](../research/law/00-synthesis.md); [Finlex 1326/2010 §14](https://www.finlex.fi/fi/lainsaadanto/2010/1326)). §14 was amended 22.5.2026/375 and has not been re-read, so re-read before citing ([law07 §4](../research/law/07-verification.md)). → **P9**
  - Linked data needs a Findata permit; the national quality register has no legal base yet ([law00 rows 3, 7](../research/law/00-synthesis.md); [Findata](https://findata.fi/en/services-and-instructions/legislation/); [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)). → **P7**
- **Current workarounds:** public proxies. [Syöpärekisteri screening statistics](https://syoparekisteri.fi/tilastot/seulontatilastot/), 2024 preliminary ([gl06 §3](../research/glasses/06-goal3-link.md)). [Sotkanet](https://sotkanet.fi/rest/1.1/indicators?lang=fi), first 200,000 characters only ([law07 §3](../research/law/07-verification.md)). Cooperation areas as a pilot unit ([law00 §3 rank 6](../research/law/00-synthesis.md); [Finlex 612/2021 §35–36](https://www.finlex.fi/fi/lainsaadanto/2021/612)).
- **Confidence:** medium on the governance gap (law text read). Low on "no data exists" (Sotkanet IDs above 707 unread; no official table).
- **Interview:** none yet. [guide §7 item 4](01-interview-guide.md): the guide has **no county section**. Suggested section in U9 below. **Kill** if a county already publishes referral-to-treatment times.
- Possible contact: the deck speaker is Service Area Director at Oulu University Hospital / Pohde, North Ostrobothnia wellbeing county ([deck notes, source line](../tracks/astrazeneca-insights-deck.md)). Whether to approach her is a human choice.

## Group 4: adults with high lifestyle risk in lower-SES groups (Direction B)

*Provisional group from [disc, group 4]. Sits before the 8-step pathway (prevention).*

- **Situation:** trying to cut back on smoking, drinking or unhealthy food.
- **Job to get done:** change a habit with help they can reach.
- **Problems:**
  - Lifestyle risks cluster in lower SES [deck p.8](../tracks/astrazeneca-insights-deck.md). → **P11**
  - "Effective prevention requires policies and services that reach disadvantaged populations" [deck p.8](../tracks/astrazeneca-insights-deck.md).
  - Risk: a gadget for wealthy early adopters could widen the gap ([deck notes, "What this means for us"](../tracks/astrazeneca-insights-deck.md)). Hypothesis, no data. One Finnish uptake study points the same way: people with more education, higher income and e-service use were more likely to start a digital lifestyle app ([S7](https://mhealth.jmir.org/2025/1/e63896/PDF)). Uptake only, no outcome.
  - This is Goal 2 work, not a Goal 3 indicator ([gl06 §1, §4](../research/glasses/06-goal3-link.md)).
- **Workarounds:** unknown ([guide §4](01-interview-guide.md)).
- **Nudge evidence:** the facts behind each nudge are sourced ([gl03, ranked list](../research/glasses/03-risk-evidence.md)). **No evidence** that a glasses nudge changes behaviour. Reminder evidence is for letters and texts, not glasses (unverified) ([gl06 §3.1](../research/glasses/06-goal3-link.md)). *(Corrected: the reminder evidence is in gl06 §3.1, not gl03 §3.1.)*
- **Limits on the product:** health-related data and bystander filming ([gl07 §1–2](../research/glasses/07-privacy-regulation.md)). MDR wellness scope only ([gl07 §4–5](../research/glasses/07-privacy-regulation.md); [MDR 2017/745](https://eur-lex.europa.eu/eli/reg/2017/745/oj)).
- **Confidence:** low. No data on reach to lower-SES adults.
- **Interview:** [guide §4](01-interview-guide.md). **Kill** if cost and time did not decide whether people tried (RQ2).

---

## Ranked problems

Problem IDs **P1–P11** are labels made in this file ("P" = problem). Rank 1 = best on that column. Ranks are rough; the units differ (days, % points, mortality %). **No overall order is given.** The team weighs the three columns.

| ID | Problem | Equity gap size | Fixable in 36 h demo | Goal 3 indicator fit |
| --- | --- | --- | --- | --- |
| P8 | Education gradient in surgery and cancer mortality ([deck p.14–15](../tracks/astrazeneca-insights-deck.md); [Zai 2025](https://bmjpublichealth.bmj.com/content/3/2/e002829)) | 1: registry scale; education proxy | 9: can show it, cannot fix it | 3: matches headline outcomes; demo cannot move them |
| P1 | Late first contact after symptoms [deck p.11](../tracks/astrazeneca-insights-deck.md) | 2: +30 days; one cohort | 6: patient side, no data | 8: Goal 2 (early detection) |
| P9 | Screening participation gaps by region, sex, education ([gl06 §3](../research/glasses/06-goal3-link.md); [law00 row 5](../research/law/00-synthesis.md)) | 3: men 69% vs women 78%; basic vs highly educated 62% vs 79% (2024 prelim.; search summaries, [registry app not opened](../research/glasses/06-goal3-link.md)) | =2: public aggregates exist ([registry statistics](https://syoparekisteri.fi/tilastot/seulontatilastot/)) | 7: Goal 2 target; Goal 3 only via equality theme |
| P2 | Wait for a physician after first contact [deck p.11](../tracks/astrazeneca-insights-deck.md) | 4: +21 days | 8: needs GP access data | =5 |
| P3 | Primary-care referral step; no referral tracking ([deck p.11](../tracks/astrazeneca-insights-deck.md); [law00 rows 2, 6](../research/law/00-synthesis.md)) | 5: +19 days | =2: recommendation (log timestamps), no data needed | =4 |
| P4 | Referral to specialist [deck p.11](../tracks/astrazeneca-insights-deck.md) | 6: +16 days | 8: hospital-level data | =4 |
| P10 | County-by-county new drug adoption ([law00 row 4](../research/law/00-synthesis.md)) | 7: size unknown | 7: county dates not public | 6: equal-treatment wording (action sits in Goal 4) |
| P12 | Cross-county care depends on agreements and patient knowledge ([law00 row 9](../research/law/00-synthesis.md); [Finlex 612/2021](https://www.finlex.fi/fi/lainsaadanto/2021/612)) | 8: unknown | 10: needs hospital data | 6: Goal 3.1 "equal, timely care" |
| P11 | Prevention does not reach lower-SES adults ([deck p.8](../tracks/astrazeneca-insights-deck.md); [S7](https://mhealth.jmir.org/2025/1/e63896/PDF)) | 9: qualitative only, plus one uptake study | 5: glasses demo possible; privacy and MDR limits | 10: Goal 2 |
| P6 | No owner of total cancer wait; no referral timestamps ([law00 row 2](../research/law/00-synthesis.md)) | 10: not measured | =2: recommendation layer, no data | =2: Goal 3.1 target times |
| P7 | No public county cancer waiting data ([law07 §3](../research/law/07-verification.md)) | 11: cannot be measured (this is the evidence gap) | =1: show the missing data as a named finding | 1: Goal 3.2 wording "reliable data on regional differences" ([gl06 §2.2](../research/glasses/06-goal3-link.md); [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)) |

- **Not ranked:** DLBCL specialist → treatment start shows no gap (−2 days) [deck p.11](../tracks/astrazeneca-insights-deck.md). Keep as a finding that challenges the brief's bottleneck 3.

---

## Key unknowns and the interview questions that test them

Unknown IDs **U1–U11** are labels made in this file ("U" = unknown). "Test now" = a question already in [guide](01-interview-guide.md). "Add" = suggested new question. New questions still need a human check on wording and ethics.

| ID | Unknown | Test now | Add (suggested) |
| --- | --- | --- | --- |
| U1 | Is the public delay mostly patient side (step 2) or system side (steps 3–5)? (tests P1, P2) | [guide §2] "What made you act that day?"; "How long from first call to first appointment?" | §2: "When did you first think this might be serious? What made you wait before calling?" |
| U2 | Which step is the biggest fixable delay for public-route patients? [disc open Q1] | [guide §1] prompt 1 and "Which step was that?"; [guide §3] RQ1 | none |
| U3 | Does a non-acute suspicion get an urgent route or the normal queue? (P3) | none | §3: "When you suspected cancer, was the referral urgent or normal? Was there a special form or fast track?" |
| U4 | Does the referral result come back to the GP? (P3, P6) | [guide §3] RQ3 and "What do you see but can't follow up?" | none |
| U5 | How long are diagnosis, team plan and treatment start, by route? (steps 6–8) | weak: [guide §2] prompt 3 | §2: "After the diagnosis, how long until someone explained the plan and treatment started?" |
| U6 | Workarounds: private care, paying, an online symptom checker before calling? | [guide §2] prompt 2 | §2: "Did you try an online symptom checker before calling? What did it say?" |
| U7 | Does the DLBCL pattern hold for other cancers, and are the numbers medians or means? (P1–P4) | none: interviews cannot test this | Desk: read [Kuitunen et al. 2026](https://www.utupub.fi/bitstreams/c41f15c1-55cb-4bc6-9b88-6b80856ded77/download) in full [deck p.11]. Mentors: ask "Do these gaps match what you see for other cancers?" |
| U8 | Which timestamps are recorded, in which system, and is any county aggregate public? (P6, P7) | [guide §1] "What data would have shown this earlier?" | Mentor question only ([law00 §5 Q2](../research/law/00-synthesis.md)) |
| U9 | Who uses and who buys or approves a tool (county, GP, patient)? [disc open Q2] | none; no county guide | New county guide §5: 3–5 questions on referral tracking, data, and budget decisions |
| U10 | Does a prevention tool reach lower-SES adults or widen the gap? [disc open Q3] (P11) | [guide §4] RQ2 "Did cost, time or access decide whether they tried?" | §4: "What did it cost you in time or money? What would have made it fit your day?" |
| U11 | Which SES measure matters for group 1: education, income, or work/private cover? (P8, P1) | [guide §0] broad groups only | §2, optional: "Was a work or private option open to you?" (only if they want to answer) |

### Desk unknowns (not interview questions)

- Cancer target times: THL Ohjaus 21/2016 section 4.3 is unread, so no day counts can go on a slide ([law07 §1](../research/law/07-verification.md); [core.ac.uk PDF, not opened](https://core.ac.uk/download/78470017.pdf), which returned 403).
- The DLBCL and Zai papers: the deck notes say they were read on 2026-11-14. This session could not extract the full text of the Kuitunen PDF, and the Zai page returned 403. Tokola et al. is not located. *(Corrected: "unread" was out of date for the deck notes.)*
- Syöpärekisteri 2024 figures are preliminary and the registry app was not opened ([gl06 §8](../research/glasses/06-goal3-link.md)).
- The metric behind "cancer mortality 27% vs 47%" is defined in Zai et al. 2025 as the share who died of cancer in 2000–2019, crude, not a survival rate ([secondary S6](03-secondary-evidence.md)). *(Corrected: the notes did not define it, the paper does.)*

## Suggested next steps (human decides)

1. Read Kuitunen et al. 2026 and Zai et al. 2025 in full before any slide uses their numbers. Find the Tokola et al. 2025 URL.
2. Put the mentor questions from [law00 §5](../research/law/00-synthesis.md) to the mentors (Kaitila: Sat daytime; Toivola: listed Fri 18:00 only, per [track brief](../tracks/astrazeneca-cancer-care.md)).
3. Decide on a county guide section (U9) and the added questions above.
4. Choose the target group and whether direction A (law and county) or B (glasses) goes forward. Both are open in [disc](00-discovery-brief.md). **Not decided here.**
5. After any interviews: update this map and mark which claims now have testimony.
