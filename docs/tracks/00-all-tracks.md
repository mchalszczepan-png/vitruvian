# Junction 2026 – all tracks and challenges

Read on the participant platform on 2026-11-14 (Sat, ~13:30 Espoo time), logged in. Platform: https://hackjunction.app/participate/45
Main challenge list: https://hackjunction.app/participate/45/challenges (tabs "Main Challenges" and "Tech Challenges"). Per-challenge pages: `/challenges/<id>` (main) and `/tech-challenges/<id>` (tech).

Our idea used for the fit column: GP cancer fast lane + risk prompt via Gemini Decisions API, county cancer-wait view, automatic stage report.

**How the two lists work (source: Guide + announcement 13 Nov 21:28):** you pick **one main challenge** in the submission form, and you can enter **any number of tech challenges** on top. For each tech challenge, say how you used the tech. Main challenge winners are picked by the sponsor; the overall Junction winner (€10,000) is picked by peer review + 7 judges.

## Our main track

| Sponsor | Challenge | Prize | Judging | Fit |
| --- | --- | --- | --- | --- |
| AstraZeneca (Healthcare track) | **Equal Care Across Finland** – gap in cancer care across Finland, where in the pathway, and what to do. Working demo required, Goal 3 indicator, every claim sourced. Source: [/challenges/344](https://hackjunction.app/participate/45/challenges/344) | €1,000 / €750 / €250 | Actionability 30%, Insight 25%, Data quality & transparency 20%, Execution (live demo) 15%, Clarity (decision-maker gets it in 2 min) 10% | **HIGH** (our submission is already a draft under this challenge). Full brief: `astrazeneca-cancer-care.md`. |

The AstraZeneca page matched our saved brief. New facts it adds: the prize amounts above, and "account level" wording (= county/wellbeing-services level).

## Tech challenges that stack on top (enter several)

| Sponsor | Challenge | Prize | Judging / requirement | Fit |
| --- | --- | --- | --- | --- |
| Google DeepMind | **Best Use of Gemini API** – open innovation; explain problem, how Gemini is integrated, why it is innovative, why Gemini matters. Source: [/tech-challenges/48](https://hackjunction.app/participate/45/tech-challenges/48) | 1st €4,000 + $1,000 Google Cloud credits per member; 2nd €2,000; 3rd €1,000 | Write the four points above in the submission. Credits need a form, up to 400 teams, 18+ only. | **HIGH** (risk prompt + stage report are real Gemini work). |
| Google DeepMind | **Best Use of Gemma** – most innovative, impactful use of open Gemma models. Source: [/tech-challenges/47](https://hackjunction.app/participate/45/tech-challenges/47) | €1,000 each for top 3, no ranking | Creative use, strong execution, open models solving real problems | **MED** – good privacy story (patient-adjacent text stays on open models in Europe). Needs one real Gemma step, not a label. |
| Verda | **Verda Compute Track** – best use of Verda compute; needs a summary link posted in Discord. Source: [/tech-challenges (Verda)](https://hackjunction.app/participate/45/challenges) tab "Tech Challenges" | 1st $10,000 cloud credits + hoodies; 2nd and 3rd $2,500 credits | Ambitious idea where compute makes it possible, right Verda product, path idea→prototype, bonus for scaling story. Their examples include "run open-weight models on infrastructure you control to keep sensitive data in Europe". | **MED** – fits if Gemma runs on Verda (inference API or GPU). Pick Verda **or** Modal for Gemma, not both. |
| Modal | **Best use of Modal** – serve a model / run agents / fine-tune on Modal. Source: same Tech Challenges tab | 1st team only: $2,000 cash + $3,000 Modal credits | "Most ambitious working AI system built on Modal" | **MED** – alternative host for Gemma (public URL for judges). |
| NVIDIA | **Best Use of Nemotron** – must use Nemotron 3.5 Super VL in the working solution; short text explanation in the form. Source: same tab | 2 teams: 1× RTX 5080 each | Meaningful Nemotron use, technical execution, AI output quality, creativity | **LOW–MED** – would need Nemotron doing real work (for example reading scanned referral letters). Only if cheap. |
| Aiven | **Best Use of Aiven** – at least one Aiven service as a meaningful part (Postgres, Valkey, Kafka, ClickHouse, OpenSearch, Runtime). Source: same tab | €1,000 / €750 / €500 | Thoughtful, meaningful use of one service | **MED** – easy add-on: host the county-wait data in Aiven Postgres. $50 free credits. |
| OpenAI | **Best Use of Codex** – meaningfully used Codex while building; open to any challenge. Source: same tab | $10,000 / $5,000 / $2,500 API credits | Show how Codex accelerated the build | **LOW** unless the team really builds with Codex. |
| CRACI | **Best use of CRACI** – any project whose CI/CD runs on CRACI (`runs-on: craci`). Source: same tab | LEGO set / Red Bull 24-pack / Slush lunch invite (per team member) | Boldest software-supply-chain ideas | **LOW** – only worth it if CI is set up in 10 minutes. |
| Context.dev | **Best Use of Context.dev** – at least one endpoint in the core flow; repo + demo + note | €750 + swag / €250 + swag / swag | Data visibly drives the demo | **LOW–MED** – could pull live THL / county pages, but our data is mostly static public tables. |
| Oxylabs | **Best agentic use of Oxylabs Web API** – live `/search` or `/scrape` call at runtime, source URLs shown | €1,000 Apple voucher + $500 credits per member | Live call in demo, sources shown | **LOW** – discount code needs a credit card and a cancelled subscription. |
| MLH (several) | Best Use of MongoDB Atlas, Vultr, Tiger Data, Entire, Solana, ElevenLabs | Hardware gadgets | One-line descriptions on tab | **LOW** (ElevenLabs maybe for a spoken county brief; not needed). |
| Arduino | Best use of Arduino Uno Q (hardware) | UNO Q + kit per member | Physical prototype | **LOW** |
| Atech | Atech Real World Challenge (hardware) | Pro kit | Physical device demo | **LOW** |
| Cloudinary | Best Use of Cloudinary (images/video) | $500 Amazon gift card per member | Needs a separate survey form | **LOW** |

## Other main challenges (all LOW fit; listed so nothing is missed)

| Track | Sponsor | Challenge | Prize | Why low |
| --- | --- | --- | --- | --- |
| Healthcare | Aalto University | Beyond the Clinic – at-home maintenance after depression (TMS) treatment. [/challenges/343](https://hackjunction.app/participate/45/challenges/343) | €2,000 + brain stimulation lab visit | Mental health, closed-loop home product; not cancer pathway |
| Agentic AI | Hostinger | Decode the Noise – propaganda/bot detection, live on Hostinger. [/357](https://hackjunction.app/participate/45/challenges/357) | €2,000 / €1,000 + hosting | Different domain |
| Agentic AI | Tieto | Earned Trust in AI Code. [/351](https://hackjunction.app/participate/45/challenges/351) | €2,000 / €1,000 / €500 | Different domain |
| Agentic AI | Cala | Make Unicorns Real (founder/investor data). [/350](https://hackjunction.app/participate/45/challenges/350) | Winners become "Cala Comets" (~€5,000 travel value) + €1,000 credits; runner-up €500 credits | Different domain |
| Agentic AI | Bahn Express | Spread – simulated car-transport company; final Sun 08:00. [/349](https://hackjunction.app/participate/45/challenges/349) | €2,000 / €1,000 / €500 | Different domain |
| Agentic AI | AfterQuery | Break the Agent – RL environment. [/328](https://hackjunction.app/participate/45/challenges/328) | €3,000 / €1,500 / €500 + work trial | Different domain |
| Agentic AI | Valio Aimo | Trusted Trade Agents (B2B ordering agents). [/327](https://hackjunction.app/participate/45/challenges/327) | €4,000 / €2,000 / €1,000 | Different domain |
| Agentic AI | Exa | The Internet Butler / Personal Assistant. [/298](https://hackjunction.app/participate/45/challenges/298) | $2,500 + $5,000 credits / $1,500 + $3,000 / $500 + $1,000 | Different domain |
| Hardware | Arduino | The Green European Renaissance (Edge AI). [/356](https://hackjunction.app/participate/45/challenges/356) | Ventuno Q / UNO Q 4G kits per member | Hardware |
| Hardware | Meta | AI Glasses for Everyone, Everyday. [/342](https://hackjunction.app/participate/45/challenges/342) | Ray-Ban Meta per member | Hardware |
| Hardware | Ignite Next × Intel | Physical AI robot arm challenge. [/330](https://hackjunction.app/participate/45/challenges/330) | €5,000 / €3,000 / €2,000 | Hardware |
| Hardware | Rokoko | Robot Teleoperation. [/326](https://hackjunction.app/participate/45/challenges/326) | Mocap gear | Hardware |
| Hardware | Aalto University | Aaltonomous Humanoid (Unitree G1). [/320](https://hackjunction.app/participate/45/challenges/320) | €2,000 + lab visit | Hardware |
| AI Infrastructure (Verda) | Stoa | Make Blueprints Talk (construction drawings Q&A). [/335](https://hackjunction.app/participate/45/challenges/335) | €1,000 + work trial / €750 / €250 | Different domain |
| Data | Context.dev | The Web Is Your Real-Time Database. [/332](https://hackjunction.app/participate/45/challenges/332) | €2,000 / €500 / swag | Different domain |
| Data | City of Espoo | Rethinking Recruitment. [/319](https://hackjunction.app/participate/45/challenges/319) | €1,500 / €1,000 / €500 | Different domain |
| Data | MariaDB | Wikipedia Through Time (RAG + versioned tables). [/307](https://hackjunction.app/participate/45/challenges/307) | €1,000 + €1,000 UpCloud credits + certs / €500 / €250 | Different domain |
| FinTech | S-Pankki | Personal Economic Trainer. [/311](https://hackjunction.app/participate/45/challenges/311) | Airbnb gift cards €2,000 / €1,000 / €500 | Different domain |

## Overall Junction prize

- **Main prize €10,000** (total pool €100,000). Chosen by peer review → top 5 pitch live → 7 judges vote. Criteria: **Innovation, Impact, Implementation** (guide). Source: https://hackjunction.app/participate/45/guide
- Eligibility needs us to take part in live peer review on Sunday. See `02-event-rules.md`.

## Suggested stack of entries (my recommendation)

1. **Main:** AstraZeneca (the real target; the actionable recommendation and the live demo are 45% of the score).
2. **Tech:** Gemini API (core) + Gemma (one real open-model step, hosted on Verda *or* Modal) + Aiven (cheap data layer). Add Verda/Modal only if the Gemma step is truly hosted there.
3. Skip the rest unless an item is already in our build.
