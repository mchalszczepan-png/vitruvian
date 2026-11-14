# Expert interview: AstraZeneca expert, 14 Nov 2026

This doc is the cleaned transcript of our talk with the AstraZeneca expert at Junction, plus what it changes for us. Questions were from [06-expert-questions-spoken.md](06-expert-questions-spoken.md). Our desk answers to the same questions are in [08-desk-answers.md](08-desk-answers.md).

Source: our own conversation notes (speech-to-text, lightly cleaned). The expert is one person giving their view. Where they quote a study, the study is the source to chase, not the expert.

## What they said, by question

**Where do patients lose time? (Q1)**
- A professor in Finland talked about this in the media recently. She has an **unpublished lung cancer study**. Our notes give her name as "Kuitinen" or "Kuitton", at a university in Eastern Finland. It is **Prof. Outi Kuittinen** (University of Eastern Finland). Yle MOT reported the study: lung cancer delay 155 days, over 50 before the patient seeks care, 41 in primary care, 58 in specialised care; hospitals in Kuopio, Tampere, Turku and Rovaniemi ([Yle](https://yle.fi/a/74-20251023); details in [context/14](../research/context/14-kuittinen-delay-study.md)).
- Her split of the delay: **one third** the patient not seeking care, **one third** time with the GP in primary care, **one third** the GP running tests before the referral. (Yle gives the last third as time in specialised care, not GP tests.)
- Sometimes the GP doesn't suspect cancer, treats it as a normal infection and sends the patient home.
- The goal is to cut the time at the health centre. The patient needs a referral to specialised care, where oncologists, surgeons and radiotherapists confirm the diagnosis, take samples and decide on treatment.
- Why patients don't come in: cost, lack of trust, socioeconomic background, fear of the diagnosis, and not knowing enough about health.
- No publication date known for the study.

**Fast track or risk flag on the referral? (Q8)**
- The referral should carry all patient data, and the more aggressive the cancer, the more it should stand out.
- They know of **no fast-track system** for these patients.

**Can a GP book a CT? (Q2)**
- **No.** Primary care doctors in Finland currently can't order a CT scan. This is a known gap.

**Stage in the referral (Q12)**
- GPs don't have to state the cancer stage in the referral. **One county does** require it (they didn't say which).
- Referral quality varies a lot. Some are complete, others miss key information.
- Staging usually needs a CT, and primary care can't order one.

**How long until treatment? (Q4)**
- They described a law with a first appointment within **3 weeks** and treatment within **6 months**. They said 2014; the deadlines match the Health Care Act 1326/2010 §52 ([Finlex](https://www.finlex.fi/fi/lainsaadanto/2010/1326)). They didn't mention the 6-week cancer target.
- Enforcement is unclear.
- Cancer strategy talks point to **Denmark's** system as the example, but gaps remain.

**What should we build?**
- "A concrete tool that can be implemented in healthcare or by patients, primarily AI-based, to support patients and be usable by doctors or nurses."
- It should be a tangible thing that can be offered to the government.

**Marketing guidelines:** everything is in the booklet. The expert took photos of it.

## What this changes for us

| Point | Before | Now |
| --- | --- | --- |
| GP can't order CT | Desk: true in Oulu, unknown elsewhere (Medium) | Expert: true nationally and a known gap. Strongest pain point for package A. |
| No fast track | Desk: Yle MOT says none national | Expert agrees: none known. |
| Where the delay is | Desk: mostly after first GP contact (lymphoma) | Lung study (unpublished, per Yle): 155 days. Over 50 patient, 41 primary care, 58 hospital. Not equal thirds: 41 is about a quarter. |
| Stage in referral | Desk: registry notification gap | Expert adds: GPs aren't asked for stage, referral quality varies, one county requires it. |
| Patient-facing tool | We ruled it out | Expert says "in healthcare or by patients" is fine. A third of the delay is the patient not coming in. Our call stays GP-side, but a small patient piece is allowed. |
| Legal clock | Health Care Act §52 | Expert confirms 3 weeks / 6 months, says enforcement is unclear. |

Our reading: package A fits what they said. The GP prompt plus a fast route that includes a CT the GP can trigger cuts the GP share (41 of 155 days, about a quarter) and, with the CT already done, part of the specialist share (58 days). The auto-filled referral with stage fields fixes the "quality varies" point.

## Still open
- The Kuittinen study is unpublished; Yle is the only source. Yle names only cost and fear as patient reasons.
- Which county requires stage in the GP referral.
- Desk questions 3, 5, 6 and 7 were not covered in the talk.
