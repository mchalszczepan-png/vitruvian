# Solution directions – problems 1, 3, 4

Date: 2026-11-14. Skill: explore-solution-directions (broad mode + relationships). **No interviews**; evidence is secondary and desk research. Nothing here is chosen: the human picks scope later (choose-mvp-scope).

Problems (user chose these three, 2026-11-14, from [RESEARCH-SUMMARY](../RESEARCH-SUMMARY.md) §3):
- **P1** Nobody sees the total cancer wait (6-week guidance target, unpublished; the 6 weeks is from a search snippet, [julkari guide](https://www.julkari.fi/server/api/core/bitstreams/f99e6277-82c4-4ef7-9313-588e4b9f0f4f/content), not confirmed, [law/07](../research/law/07-verification.md); official text [source needed]).
- **P3** No fast lane for suspected cancer at the public GP ([law/00](../research/law/00-synthesis.md) row 6).
- **P4** Spread data (TNM, stage or free text) missing for most cases (41.9% recorded, 58.1% missing, [Syöpä 2024 factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)).

Evidence tags: **E** = external evidence the mechanism works somewhere, **W** = weak or mixed, **H** = our hypothesis, **U** = unverified (from memory, check before citing).

## Broad directions

| ID | Problem | Direction (how it might help) | Evidence | Main uncertainty | Source |
| --- | --- | --- | --- | --- | --- |
| D1.1 | P1 | **County wait view** from hospital dates (referral, scan, diagnosis, team decision, treatment) against the 6-week target, split by area and route | E: [TYKS](https://www.tyks.fi/potilaille-ja-laheisille/hoidot-ja-tutkimukset/syopa/suolistosyovan-hoitoonpaasyajat) publishes bowel-cancer waits; [Denmark monitors its packages](https://www.sst.dk/vidensbase/sygdomme-og-behandling/kraeftsygdom/pakkeforloeb-for-kraeft/standardforloebstider-og-monitorering-af-pakkeforloeb-for-kraeft) | Which dates are actually recorded; no public data | [context/09](../research/context/09-cancer-wait-targets.md) |
| D1.2 | P1 | **Make the target binding**: cancer waits in county agreements or the strategy's H3 indicator | H | Political, slow; not a product | [law/08](../research/law/08-inefficiencies.md) |
| D1.3 | P1 | **Patient-reported timeline**: patients record symptom start and visits, covering the time before any hospital record exists | H | Digital-skills bias (see Direction B) | [glasses/09](../research/glasses/09-track-fit.md) |
| D1.4 | P1 | **GP record audit**: a sample audit of time from first GP visit to referral (like England's national diagnosis audit) | E | Needs GP record access | [England audit, PMC5737321](https://pmc.ncbi.nlm.nih.gov/articles/PMC5737321/) |
| D3.1 | P3 | **Fast-lane rule**: red-flag list + direct CT/ultrasound for flagged patients | E: Denmark −17 days to first step; W: Sweden crowded out vulnerable patients | CT capacity; who pays | [context/03](../research/context/03-what-others-tried.md), [context/08](../research/context/08-primary-care-fast-lanes.md) |
| D3.2 | P3 | **GP risk prompt** from past records + symptoms (user's idea) | W: QCancer did not raise referrals; ERICA result unpublished | Alert fatigue; MDR class IIa+ | [context/11](../research/context/11-risk-score-idea.md), [context/12](../research/context/12-gp-risk-tool.md), [tech/02](../research/tech/02-gp-risk-decision-support.md) (QCancer and ERICA links) |
| D3.3 | P3 | **Repeat-visit flag**: 3+ visits for the same symptom → review or referral | H: a third of patients needed 3+ contacts | No Finnish test; definition of "same symptom" | [S1](https://www.sttinfo.fi/tiedote/70972938/kyselyselvitys-joka-kolmas-syopapotilas-kokee-diagnoosin-viivastyneen?publisherId=69820264) |
| D3.4 | P3 | **Vague-symptom diagnostic centre**: one place a GP sends unclear cases (Danish model, 2024: 9,897 referred to the non-specific symptoms pathway, 21 diagnostic centres, [PMC13745819](https://pmc.ncbi.nlm.nih.gov/articles/PMC13745819/)) | E (Denmark) | Cost; county must build it | [context/12](../research/context/12-gp-risk-tool.md) |
| D3.5 | P3 | **Simple GP tests**: FIT, CA-125, blood-count patterns to triage | W | Finnish cut-offs unknown | [context/12](../research/context/12-gp-risk-tool.md) |
| D4.1 | P4 | **Auto-filled stage report** from pathology and imaging results, sent to the registry | H, supported by law: Kanta reporting due by 2029 ([THL act §5 j](https://www.finlex.fi/fi/lainsaadanto/2008/668)) | Is stage in the chart at all? | [law/09](../research/law/09-stage-recording-law.md) |
| D4.2 | P4 | **Completeness tracker + feedback** by county and hospital | E: Pirkanmaa clinical notifications 42% (2022) → 80% (2024) after a workflow and IT change (corrected) | Pirkanmaa's exact change only partly documented (registry credits an integrated recording system) | [registry](https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/), [context/07](../research/context/07-stage-data-practice.md) |
| D4.3 | P4 | **Pirkanmaa playbook**: copy the process, no tech | E (one region) | Transferable? | [registry](https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/), [context/07](../research/context/07-stage-data-practice.md) |

**Gap:** no credible direction measures the time **before the first GP visit** at scale except D1.3, which is biased. Recorded as a gap.

## Relationships

| From → To | Type | Why | Confidence |
| --- | --- | --- | --- |
| D3.1 → D3.2, D3.3 | Prerequisite | A flag changes nothing if the GP can't order the scan (UK tools alone showed little [source needed]) | Medium |
| D1.1 → D3.x | Prerequisite for proof | Without dates you can't show the fast lane cut the wait | High |
| D4.x → D3.x | Prerequisite for proof | Earlier stage is the real outcome; needs stage data | High |
| D1.1 ↔ D4.1 | Shared capability | Both pull structured events from hospital records (Apotti, FHIR) | Medium |
| D3.1 ↔ D3.4 | Alternative or complement | Clear red flags → fast lane; vague symptoms → centre | Medium |
| D3.1 ↔ equity | Conflict / trade-off | Sweden: fast tracks crowded out vulnerable patients; D1.1 split by route can watch for it | Medium |
| D3.2 ↔ D3.3 | Complementary | Prompt catches risk patterns; repeat flag catches being dismissed | Low |

## Packages to compare

| | **A. The loop** (D3.1 + D3.2/3.3 + D1.1 + D4.1) | **B. Measure first** (D1.1 + D4.2 + D1.2) | **C. Diagnostic-centre route** (D3.4 + D3.5 + D1.1) | **D. GP tool only** (D3.2 + D3.3) |
| --- | --- | --- | --- | --- |
| Problems hit | 1, 3, 4 | 1, 4 (3 only as a recommendation) | 1, 3 | 3 |
| Evidence mechanism works | Mixed: fast lane E, prompt W | E for feedback (Pirkanmaa) | E (Denmark) | W |
| Brief fit (find gap, locate, act) | Strong story | Strong on find/locate, action = recommendations | Medium | Weak: finds patients, not county gaps |
| Demo data | Synthetic patients + county totals | County totals (stage completeness, GP access) – most real data | Synthetic + Danish numbers | Synthetic only |
| Regulation | Prompt part is a likely device | Low (aggregate, management level) | Low–medium | Likely device |
| Equity risk | Crowd-out; prompt bias | Low | Who gets referred to the centre | Prompt bias |
| Scope risk in 36 h | High: three parts | Low | Medium | Low |

## Read (not a choice)

- **A** tells the best story but is three products; it is honest only if the GP part is shown as a rule a county adopts, with the prompt as delivery.
- **B** is safest for judging (real data, low regulation) but has no intervention of its own.
- A middle path: **B as the core, with D3.1 (+ your prompt) as the recommended action, shown as a simulation.** Sizing that is the job of choose-mvp-scope.

## Open questions that could change this

1. Which hospital dates exist ([expert sheet 06](06-expert-questions-spoken.md), Q3) – decides if D1.1/D4.1 are real.
2. Can GPs order CT directly anywhere ([sheet 06](06-expert-questions-spoken.md), Q2) – decides D3.1's size.
3. Is stage in the chart but not sent ([sheet 06](06-expert-questions-spoken.md), Q12) – decides D4.1 vs D4.3.

## Decisions so far (human: Michal, 2026-11-14, in chat)

- **Leaning A (the loop)**, not yet selected. Ask the experts Saturday morning, then lock the scope by Saturday noon (choose-mvp-scope).
- **Model roles (accepted):** each Decisions API question maps to one named risk factor (for example "unexplained weight loss?"). The API supports yes/no, multiple-choice and score questions with probabilities, per [glasses/02](../research/glasses/02-decisions-api.md). A clear rule turns the flags into a fast-referral decision. Gemma runs locally to summarise history and draft the referral. The vector database only retrieves history and does not score risk.
- Open: the source of the risk-factor list (NICE NG12 / Hamilton RATs / Current Care) and whether an embedding model (e.g. EmbeddingGemma, unverified) is needed.

## Linked problems: scope decisions (human: Michal, 2026-11-14, in chat)

| Linked problem | Decision | Where |
| --- | --- | --- |
| Repeat visits (a third needed 3+ contacts) | **In scope, addressed directly** | GP fast lane: repeat-visit flag (D3.3) |
| Referrals sent back by hospitals (no data) | **In scope, addressed directly** | Fast lane + wait view: log returned referrals as a pathway step |
| GPs can't order CT directly | Problem slide; improved indirectly | Presentation |
| Cancers found via A&E (no Finnish data) | Problem slide; improved indirectly | Presentation |
| Time before first GP visit | Maybe in presentation | Presentation |
| Fees and debt collection | Maybe in presentation | Presentation |
| Separate county data / Findata, quality-register funding, mental illness and migrants | Not mentioned; parked | – |

Presentation: 3 minutes.

## Model and vendor notes (Michal, 2026-11-14)

- [Gemini Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/): Gemini Decisions API runs on a paid Google API key (paid-tier terms), GDPR compliant per Michal (2026-11-14). The MDR medical-device question is separate from GDPR and still applies to live use.
- Alternatives we can name: partner models (e.g. NVIDIA) or a local decision model that **could** be post-trained for government use later. Pitch it as a future option, not as done.

## Event limits that change the plan (from [tracks/02-event-rules](../tracks/02-event-rules.md), 2026-11-14)

- **Final submission: Sun 15 Nov 10:00** ("Submit Final"; drafts are not reviewed). Not Sunday afternoon: the build must end Saturday night.
- **Pitch video: max 2 min.** The 3 min live pitch (+3 min Q&A) is only for the top 5.
- Peer review is at the venue on Sunday and is required for the main prize.
- Only code written at the event; the public repo is MIT licensed: https://github.com/mchalszczepan-png/vitruvian
