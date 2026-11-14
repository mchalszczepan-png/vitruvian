# Build plan – Vitruvian (Junction 2026, AstraZeneca track)

Written 2026-11-14, 17:00, after the scope grill with Michal. These are **notes**. The spec comes next (`to-spec`). Terms follow `/GLOSSARY.md`. Key decision: `docs/adr/0001-aid-informs-from-coded-rules.md`.

Deadlines: build done Saturday night. Final submit **Sun 15 Nov 10:00** with a 2-min video (`docs/tracks/00-all-tracks.md`).

## 1. Problem and users

**Problem (one sentence):** On the public route, a GP may not suspect cancer, or may send a referral that is incomplete. In an unpublished lung cancer study, patients spent 41 of 155 days (about a quarter) in primary healthcare; the article gives no public vs occupational split ([Yle MOT on the Kuittinen study](https://yle.fi/a/74-20251023)). Separately, spread data (TNM, stage or free text) is recorded for 41.9% of solid cancers nationally in 2024, and 58.1% are missing ([Cancer Registry 2024 factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)). The registry gives the cause as low coverage of clinical notifications, about half of new cases (RESEARCH-SUMMARY row 4).

**Users:**
- **GP** at a public health centre (main user). The expert named "doctors or nurses" as users (`docs/discovery/09-expert-interview-2026-11-14.md`).
- **Specialist**, for the Staging report (second user).

## 2. Decisions made in the grill

| # | Decision | Choice |
| --- | --- | --- |
| 1 | Whose problem first | GP. The hospital side is a second screen. The county is a slide. |
| 2 | GP flow | One flow: Aid informs, then feeds a pre-filled Referral |
| 3 | Specialist side | Full build: Staging report for all 3 cancers. Colorectal and ovarian are cut first if late. |
| 4 | Cancers | Lung, colorectal, ovarian (changed from prostate on 2026-11-14: prostate has ~95% 5-year survival and its deaths come mostly from tumour type, not GP delay; see docs/build/cancer-choice.md). Breast is a stretch goal. |
| 5 | Tech roles | Gemma fills the template from notes. Vector search flags Repeat visits. The Decisions API answers one question per Rule. Gemma gives the AI risk gradient 0–10, shown next to the matched cited Rules (decision 14). |
| 6 | Patient side | Slides only, no code |
| 6b | County gap screen (added after the Opus review, 17:30) | Built live from public figures: the primary-care share of lung delay (41 of 155 days, national), the lymphoma route gap (127 vs 76 days, one national cohort), spread-data coverage by area, lung surgery days. It names the Goal 3 indicators and has a "what a county does next" panel. It answers the brief's "find the gap, show where, recommend action". |
| 7 | Demo story | Matti, 62, ex-smoker, lung, 3rd visit |
| 8 | AfterQuery | Optional booth ask (clinician test cases or an eval rubric). Not in the build. |
| 9 | Stack | Vite + React + TypeScript front end. Convex for backend, data and vector search. |
| 10 | Gemma hosting | Free Junction-hosted inference for the demo. The pitch says Gemma and DiffusionGemma can run fully local. |
| 11 | Gemma training | Prompted Gemma first. LoRA fine-tune on Modal only if time is left. Say "fine-tuned" only if it really ran. |
| 12 | Decisions API privacy | Gemini Decisions API runs on a paid Google API key (paid-tier terms), GDPR compliant per Michal (2026-11-14). |
| 13 | Hospital calls, GP talks | 5 questions, see section 6. Michal can also talk to GPs. |
| 14 | Risk display | An AI risk gradient, 0–10, set by the model and shown next to the matched cited Rules. Michal's call: the hackathon shows the concept, and a government version would be tuned and validated. This supersedes ADR 0001's "rules set the band". |
| 15 | Patient history (Michal, 2026-11-14) | The Aid reads the patient's whole visit history, not only today's note. Gemma extracts symptoms from every earlier visit, the Decisions API and the risk gradient see the full history, and every Rule for all 3 cancers carries an "over time" condition (how many visits or how long, from NICE NG12 wording where it gives one, otherwise marked as our design choice) checked across visits. Symptoms that persist, recur or get worse raise the AI risk gradient. Each matched Rule shows which visits it came from. Details: docs/build/rules.md, "Over time" section. |

## 3. In and out tonight

**In (build):**
- **Referral templates** for lung, colorectal and ovarian. Each is a JSON schema of fields, rendered on screen, with required fields marked.
- **Gemma note filling:** the GP's free-text notes become template fields, and missing required fields are flagged.
- **County gap screen:** public figures with sources, the primary-care delay and lymphoma route figures (national, not by county), the Goal 3 indicators, and a "what a county does next" panel.
- **Aid panel:**
  - Suspected cancer type, AI risk gradient 0–10 (labelled "AI estimate"), Severity (a cited survival figure).
  - The source link for each matched Rule.
  - A "GP decides" control.
  - The matched Rules go into the Referral with an urgency flag.
- **Decisions API:** one yes/no question per Rule, run on the structured fields from today's note plus all earlier visits (decision 15).
- **Repeat-visit flag:** about 20 made-up patients with visit history in Convex. Vector search finds earlier visits for the same symptom. The Aid shows which earlier visits back each matched Rule (date + short note).
- **Staging reports** for lung and colorectal (TNM fields) and ovarian (FIGO stage, basis of diagnosis), marked "ready for registry".
- **Gemma LoRA fine-tune on Modal** for the note-to-fields task.

**Out (slides only):**
- **Patient side.** Omaolo (DigiFinland, CE-marked) collects symptoms, and its notes *could* feed the GP tool. No public data feed was found, so the slide must not say "does" ([DigiFinland](https://digifinland.fi/toimintamme/omaolo-palvelu/)).
- **County wait view:** now built as the County gap screen above. Real figures only. Lung surgery is a median 13.5 days after diagnosis in the North vs 46 in the South. These are cooperation areas, not counties, and the North range starts at 0 days ([registry lung report](https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf)).
- **GP can't order CT:** a problem slide (expert interview).

**Out completely:** real patient data, login, Apotti integration, a patient app, breast (unless there is time).

## 4. Demo flow (2-min video)

1. **Problem (15 s):** 155 days in total, 41 of them in primary care (unpublished study, reported by Yle). Spread data (TNM, stage or free text) is recorded for 41.9% of solid cancers nationally, 2024 ([factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)).
2. **History:** Matti, 62. The tool shows 2 earlier visits for cough, treated as infection, and flags "3rd visit for cough in 4 months".
3. **GP notes:** the GP types messy free text. Gemma fills the lung Referral template, and the missing fields show in red.
4. **Aid:** "Possible lung cancer · AI estimate: 8/10 · Severity: 5-year survival X% (source)". The matched Rules show with source links, and the GP clicks "refer urgently".
5. **Referral:** complete, flagged urgent, nothing missing, so nothing to send back.
6. **Specialist:** the lung Staging report (TNM) is filled and "ready for registry". Switch quickly to colorectal and ovarian.
7. **Close (20 s):** the County gap screen live, slides for Omaolo input, and the scaling ask (one Referral template across counties).

## 5. Build order and rough hours (1 builder + agents, 1 pitch and calls)

| When | Builder (+ agents) | Pitch & calls |
| --- | --- | --- |
| 17:00–17:45 | Scaffold Vite + React + TS + Convex. Repo hygiene. Keys: Gemini Decisions API, Junction Gemma endpoint, Modal. Test one call each. | Hospital calls (section 6) |
| 17:45–19:30 | 6 schemas (3 referral, 3 staging), with field sources (see open facts). 20 made-up patients incl. Matti, visit history in Convex, vector search, Repeat-visit flag | Hospital calls (section 6). Slides start. |
| 19:30–21:30 | Template renderer + required-field marks + Referral view. Prompted Gemma note-to-fields through the hosted endpoint (this is the fallback). Start the LoRA data prep. | GP talks (row 13). Slides. |
| 21:30–23:30 | Rules per cancer, with sources. Decisions API questions. AI risk gradient 0–10. Severity table. Aid panel. County gap screen. LoRA fine-tune on Modal (benchmark a small run first) | Slides: a source on every claim |
| 23:30–01:00 | Staging report screens for 3 cancers. Serve the fine-tuned Gemma. Swap it in behind the same interface. | AfterQuery booth ask (row 8, optional). Slides. |
| **21:00** | **Matti flow works end to end** on prompted Gemma | |
| **01:00** | **Cut point.** Cut in this order: LoRA → colorectal and ovarian staging → vector search (fall back to a symptom match) → Decisions API | |
| 01:00–02:30 | Wire the full Matti flow end to end. Polish the demo data. | Write the Gemma, Gemini and Modal tech-challenge text. Slides. |
| **02:30** | **Feature freeze** | |
| Sun 07:00–09:30 | Record the video. | Michal finishes the slides. |
| Sun 10:00 | Submit | |

Michal: hospital calls (section 6), the AfterQuery booth ask, slides, and checking every slide claim has a source.

## 6. Hospital calls

**Who is open today (Sat 14 Nov, after 17:00):**
1. **TAYS switchboard 03 311 611**, daily 7–23. Ask for oncology consultation. Professionals are asked to try a written or electronic consultation first ([Pirha](https://www.pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/syopatautien-laheteohjeet-ja-konsultaatiot), opened; `docs/research/context/15-gp-ct-fast-track-stage.md`).
2. **TYKS switchboard +358 2 313 0000**, said to be 24/7 (search snippet only, page not opened).
3. **OYS advice line 08 669 9600**, Sat–Sun 8–16, so it opens Sunday morning (oys.fi homepage, opened). It's a patient advice line, so it's a weak fit.

Everything else (KYS, HUS, Docrates, the Syöpäjärjestöt helpline 0800 19414) is weekdays only, which means after our deadline. Never use 112 or 116117 for research calls. **Risk:** the weekend switchboards may not put us through to a clinician, so plan to build on desk research.

**Questions, in order (about 5 min):**
1. How often do you send a GP's suspected-cancer referral back, and for what missing information?
2. Which fields must a lung, bowel or ovarian referral have?
3. Would a referral marked "aid: high risk, survival X%" change how fast you book it?
4. Who writes stage for the Cancer Registry, and when?
5. Would you accept referrals in a fixed structured format, or does Apotti, Omni or Lifecare block that?

Write the answers to `docs/discovery/10-hospital-calls-2026-11-14.md`.

## 7. Risky assumptions

| Assumption | How we check |
| --- | --- |
| Incomplete referrals really get sent back and cost time | Call Q1. Supporting evidence: in Leeds, DART (Digitally Assembled Referral Toolkit) used mandatory fields. Form completion rose from 44% to 99%, and handling fell from 96 s to 35 s per referral ([PMC5697536](https://pmc.ncbi.nlm.nih.gov/articles/PMC5697536)). It was a before-after study, and time to diagnosis wasn't measured. |
| A risk flag on the referral changes booking speed | Call Q3. No evidence yet. |
| Stage is known but not sent | Call Q4. Our inference from the Pirkanmaa workflow fix (`docs/discovery/08-desk-answers.md` Q12) |
| A structured format fits Finnish record systems | Call Q5 |
| A GP acts on an aid. UK prompts (QCancer) did not raise referrals ([BJGP 2019](https://doi.org/10.3399/bjgp19X703745)) | We can't check it tonight. Pitch it as an aid plus a complete referral, not as a prompt alone. |
| A small LoRA run fits in about 2 h | Benchmark first. The tutorial says a run with Gemma 3 1B and about 1,000 examples takes "several minutes" on a T4. The ~15 min figure comes from its sample log ([Google LoRA tutorial](https://ai.google.dev/gemma/docs/core/lora_tuning)) |

## 8. Open facts to look up (Haiku subagents)

- The field list for each Referral template: NICE NG12 and Käypä hoito triggers. NICE content may need permission for use outside the UK, so cite it and paraphrase it. Don't copy its tables ([NICE terms](https://www.nice.org.uk/terms-and-conditions)).
- Staging report fields: the TNM edition per cancer, plus the Cancer Registry clinical notification fields (not found so far).
- Severity: a cited 5-year survival figure for lung, colorectal and ovarian cancer (Cancer Registry).
- The fine-tune dataset: MedSyn-synthetic (MIT, 41k made-up notes, [Hugging Face](https://huggingface.co/datasets/Glebkaa/MedSyn-synthetic)), plus made-up note-to-field pairs. MIMIC is excluded because it needs credentialing.
- Modal's Gemma LoRA path. Their example uses Qwen, so we adapt it ([Modal](https://modal.com/docs/examples/llm-finetuning)).
- The Decisions API: model `gemini-decision-1`, yes/no and choice questions ([docs](https://aistudio.google.com/docs/decisions-api.md)).

## 9. Tech challenges we enter

| Challenge | Our real use |
| --- | --- |
| AstraZeneca (main) | The whole product |
| Gemini API | Decisions API questions per Rule |
| Gemma | Fine-tuned (or prompted) note-to-fields |
| Modal | Gemma LoRA fine-tune and serving |
| Verda | Only if the free Junction Gemma inference runs on Verda |

No DB prize: Convex isn't a listed partner. Adding MongoDB or Aiven just for a prize would add a hop without helping the product.

## 10. Rules for the build

- Patients are made-up and labelled as such. No real data.
- Every screen carries the label "Research prototype. Not a medical device. Not for clinical use." Software that informs decisions about one patient is likely MDR Class IIa or higher (`docs/research/law/03-data-ai.md`).
- Say "trained" only if the fine-tune really ran.
- Every number on a slide or screen carries its source.
- Convex work goes to an agent with the Convex plugin (Michal's standing rule).
