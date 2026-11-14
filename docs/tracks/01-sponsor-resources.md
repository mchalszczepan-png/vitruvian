# Junction 2026 – sponsor resources (hackerpacks)

Read on 2026-11-14 from "Developer Tools and Assets": https://hackjunction.app/participate/45/hackerpacks (each item: `/hackerpacks/<id>`).
**No secrets copied.** Claim links, coupon codes and promo codes are on the portal pages; I note "in portal" instead. Where it says "form", one person per team fills it unless stated.

## Do these first (for our stack)

| Priority | Resource | Why |
| --- | --- | --- |
| 1 | **Gemini API credits** (form, up to 400 teams) | Core of our idea; may run out |
| 2 | **Verda €200** or **Modal $100** (pick the Gemma host) | Gemma step |
| 3 | **Anthropic $20 Claude credits** | If we call Claude anywhere |
| 4 | **Featherless $50** | Backup hosted Gemma / open models over an OpenAI-style API |
| 5 | **Aiven $50** | Postgres for the county-wait data (+ Aiven tech challenge) |

## Google DeepMind

| Resource | What | How to claim | Limits / deadline | Use for us |
| --- | --- | --- | --- | --- |
| Gemini API credits | Credits for Gemini API in Google AI Studio | Google Form linked on the page; **one person per team**; instructions for accounts come during the event. Link in portal. | **Up to 400 teams** only; participants **18+** only. Source: [/hackerpacks/68](https://hackjunction.app/participate/45/hackerpacks/68), [/tech-challenges/48](https://hackjunction.app/participate/45/tech-challenges/48) | **High.** Do it now. |
| Google AI Studio / docs / quickstart | Create keys, try models | https://aistudio.google.com/ , https://ai.google.dev/gemini-api/docs , https://ai.google.dev/gemini-api/docs/quickstart | No credit needed for basic use; rate limits apply | High |
| Support | Google DeepMind booth; "Build with Google DeepMind" workshop was Fri 20:00 (already done) | Booth on site | Source: Guide | Ask the booth for credit status and Gemma access tips |
| Gemma access | Via Featherless (hosted API), Modal, Verda, AI Studio (browser), Hugging Face | See each row below | See `google-deepmind-gemma.md` | Medium |

## Compute and model hosting

| Resource | What | How to claim | Limits / deadline | Use for us |
| --- | --- | --- | --- | --- |
| **Verda** €200 | GPU instances, inference API for open-weight models, CPU instances, auto-scaling containers, batch jobs | Sign up to Verda Console; submit the claim form; redeem and share with team via Verda docs (links in portal). Booth #6, floor 3. Source: [/hackerpacks/71](https://hackjunction.app/participate/45/hackerpacks/71) | €200 per participant; Verda tech challenge needs a summary link in Discord | **Medium.** Host Gemma via the inference API. |
| **Modal** $100 per participant | CPUs and GPUs (T4 up to B300), web endpoints with public URLs, Sandboxes, Volumes, starter kit, Modal Dojo | Account on modal.com; instructions in portal + Discord; workshop **Sat 13:30–14:00 (now/just ended)**, Loft 4th floor. Source: [/hackerpacks/62](https://hackjunction.app/participate/45/hackerpacks/62) | Billed per second, scales to zero | **Medium.** Easy public URL for a Gemma endpoint. |
| **Featherless** API $50 | Hosted open-weight models (OpenAI-compatible API, base `https://api.featherless.ai/v1`) | Redeem the Junction coupon link (in portal), create account, get key. Source: [/hackerpacks/51](https://hackjunction.app/participate/45/hackerpacks/51) | $50 per participant | **Medium.** Fastest way to call Gemma without hosting. |
| Featherless GPU credits | Bare-metal GPU credits for "selected teams" | Not self-serve (selected by Featherless). Source: [/hackerpacks/52](https://hackjunction.app/participate/45/hackerpacks/52) | Selected teams only | Low |
| **NVIDIA** build API (from the Nemotron challenge text, not a hackerpack) | Free hosted APIs; OpenAI-compatible base `https://integrate.api.nvidia.com/v1` | Per-key at build.nvidia.com | Free tier ~40 requests/min per key; each teammate own key. Source: Nemotron challenge on the Tech Challenges tab | Low–Med |
| OpenRouter (same Nemotron text) | Serverless gateway | Own account | `:free` models: 20 req/min, 50/day (1,000/day after buying $10 credits) | Low |

## AI API credits

| Resource | What | How to claim | Limits | Use for us |
| --- | --- | --- | --- | --- |
| **Anthropic** $20 Claude API credit | Claude API | Offer link on the page (in portal). Source: [/hackerpacks/67](https://hackjunction.app/participate/45/hackerpacks/67) | $20 per participant | Medium (build tooling or fallback model) |
| **OpenAI** $100 Codex credits | Codex usage credits (2,500 credits), **not** API credits, no paid subscription | A code is already assigned in the portal; open on desktop, sign in to the personal ChatGPT account. Source: [/hackerpacks/70](https://hackjunction.app/participate/45/hackerpacks/70) | Valid 30 days after redeeming; one redeem per code | Low (only if we use Codex) |
| **Exa** $50 | Search API (fast/balanced/deep), Contents API, Websets, Monitors, MCP, SDKs | In portal; Exa Discord; demos at demos.exa.ai. Source: [/hackerpacks/49](https://hackjunction.app/participate/45/hackerpacks/49). Workshop **Sat 16:30–17:00** (Loft) | $50 per participant | Low–Med (live web evidence with sources) |
| **Context.dev** 50,000 credits | Web, company, news → structured data; monitors, webhooks; MCP; TS/Python SDKs | No credit card; engineers on site. Source: [/hackerpacks/60](https://hackjunction.app/participate/45/hackerpacks/60). Workshop Sat 17:30–18:00 | No expiry; 50 concurrent requests | Low–Med |
| **Oxylabs** Web API | `/search` and `/scrape` | Promo code in portal: first-month discount on a $500 plan; **credit card required and you must cancel** to avoid charges. Source: [/hackerpacks/61](https://hackjunction.app/participate/45/hackerpacks/61) | Paid plan with discount | Low – skip |

## Data, storage, infra

| Resource | What | How to claim | Limits | Use for us |
| --- | --- | --- | --- | --- |
| **Aiven** $50 | Managed Postgres, Valkey, Kafka, ClickHouse, OpenSearch, Runtime | Sign up (link in portal); mentors on site all days. Source: [/hackerpacks/66](https://hackjunction.app/participate/45/hackerpacks/66) | $50 free credits | **Medium** (+ Aiven tech challenge) |
| **MariaDB** | Database, free to use in any challenge; "mention MariaDB in your submission" to be found by them | None needed. Source: [/hackerpacks/69](https://hackjunction.app/participate/45/hackerpacks/69). Workshop (Maria01) Sat 18:00 | Work gets published on mariadb.org | Low |
| **IronShard** | S3-compatible object storage, MCP access, one-click dataset forking; also for big artifacts (>100 MiB GitHub limit) | Account on the portal item. Source: [/hackerpacks/59](https://hackjunction.app/participate/45/hackerpacks/59) | Challenge datasets preloaded "where applicable"; **no AstraZeneca dataset mentioned** | Low |
| **CRACI** platform, €1,000 credits | CI/CD on GitHub-Actions-compatible runners, SBOMs, AI vulnerability fixes, API | Invite code from Discord `#craci` or booth; ~10 min setup. Source: [/hackerpacks/64](https://hackjunction.app/participate/45/hackerpacks/64) | Per team; token shown once | Low |
| **Cloudinary** | Image/video API, free tier | Survey form needed to enter challenge. Source: [/hackerpacks/63](https://hackjunction.app/participate/45/hackerpacks/63) | Free tier | Low |
| MLH partner tools (MongoDB Atlas $50 student credit/free tier, Vultr credits, Tiger Data, Entire, Solana, ElevenLabs) | See each tech challenge text | Sign up with MLH links in the challenge text | Free tiers | Low |

## Hardware, robotics, vision (not our track)

| Resource | What | Where |
| --- | --- | --- |
| Junction Hardware Lab | Devices to borrow, 5th floor. [/hackerpacks/57](https://hackjunction.app/participate/45/hackerpacks/57) | Floor 5 |
| Arduino UNO Q kits + App Lab | Borrow at Arduino booth, 5th floor. [/hackerpacks/65](https://hackjunction.app/participate/45/hackerpacks/65) | Floor 5 |
| Wendy, Qualia, Scailab (Scaipipe) | Robot/edge dev tools, robot dataset curation, vision-model pipeline. [/56](https://hackjunction.app/participate/45/hackerpacks/56), [/53](https://hackjunction.app/participate/45/hackerpacks/53), [/50](https://hackjunction.app/participate/45/hackerpacks/50) | Not relevant |

## AstraZeneca resources (from the challenge page, not a hackerpack)

Source: [/challenges/344](https://hackjunction.app/participate/45/challenges/344). Already summarised in `astrazeneca-cancer-care.md`.

| Resource | Notes |
| --- | --- |
| National cancer strategy 2026–2035 (PDF, "Background pack"), roadmap 2026–2031 (PDF, Finnish), source list PDF | Links in `astrazeneca-cancer-care.md` |
| Public data: Finnish Cancer Registry, THL regional health indicators | Public, aggregate only. No patient-level data. |
| Mentors | Fri from 18:00 (past); **Sat daytime: Kaisa Kaitila (Medical Affairs)**; **Sun 14:00 judging: Hanna Rusila, Laura Aaltonen, Joanna Tuormaa** |
| Contacts | Main: Joanna Tuormaa. Questions: Laura Aaltonen (phone on the challenge page) |

## NVIDIA

Mentors attending: Maxime Pariente, Ryan Reese; Discord channel and NVIDIA table; contact is on the challenge page (not copied). Prize: 2× RTX 5080.

## Workshops still ahead (Guide schedule)

| When | Workshop | Place |
| --- | --- | --- |
| Sat 14:30–15:15 | "Can It Be a Company?" with Kiuas (business sparring, one-page guide to validate the business case) | Loft, 4th floor |
| Sat 16:30–17:00 | Exa | Loft |
| Sat 17:30–18:00 | Context | Loft |
| Sat 18:00–18:30 | Maria01 | Loft |

Workshops are first come, first served. The Google DeepMind (Fri) workshop is over. Source: https://hackjunction.app/participate/45/guide
