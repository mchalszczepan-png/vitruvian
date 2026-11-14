# 08 — Architecture plan: glasses emulation → Gemini Decisions → DiffusionGemma → spoken nudge

Date: 2026-11-14. Direction B (smart-glasses cancer-risk coach). Companion to [05-diffusiongemma.md](05-diffusiongemma.md) (model and hosting facts) and [03-sdk-samples-sweep.md](emulation/03-sdk-samples-sweep.md) (SDK facts).

Terms: **Decisions API** = Gemini Decisions API (model `gemini-decision-1`). **DG** = DiffusionGemma. **gateway** = our small backend. **vLLM** = the inference server that hosts DG. **TTS** = text-to-speech. **p50/p90** = median / 90th-percentile latency.

Items marked **UNVERIFIED** are our estimates or unverified claims. Everything else has a source link.

---

## 1. Components (text diagram)

```
 ANDROID PHONE (Kotlin, Compose, CameraX)            MODAL (backend, no keys on phone)                 GOOGLE
 ┌──────────────────────────────────────┐   HTTPS    ┌───────────────────────────────────────┐
 │ FrameSource                          │  JPEG +    │ GATEWAY (CPU, FastAPI, always warm)   │
 │  - CameraXFrameSource (live)         │  demo tok  │  1 POST /v1/nudge                     │
 │  - VideoFileFrameSource (emulation)  │ ─────────▶ │  2 REST POST /v1beta/decisions ─────────▶ gemini-decision-1
 │ every 2 s, ~768 px JPEG              │            │  3 pick top risk (p ≥ 0.7) or stop   │ ◀── probabilities
 │                                      │            │  4 POST /v1/chat/completions ──┐      │
 │ NudgeClient (OkHttp + kotlinx JSON)  │ ◀───────── │                               ▼      │
 │ Cooldown + risk state (pure Kotlin)  │  JSON      │ VLLM (1× H100 80 GB, min_containers=1)│
 │ TTS (Android TextToSpeech)           │            │  DiffusionGemma, BF16, canvas 256     │
 │ Compose UI: preview, chips, caption  │            │  → nudge text ≤ 20 words              │
 └──────────────────────────────────────┘            └───────────────────────────────────────┘
```

Key rules:
- The APK holds **only** the gateway URL and a demo token. No Gemini key, no HF token ([Modal webhooks doc](https://modal.com/docs/guide/webhooks) for auth headers; Gemini key goes in a Modal Secret).
- Gemini Decisions has **no Kotlin SDK**, so the gateway calls its REST endpoint directly ([03 sweep, section 3](emulation/03-sdk-samples-sweep.md)).

---

## 2. Backend choice: one Modal app, two deployments

**Pick: Modal.** Two small deployments in one Modal project:

| Deployment | Hardware | Role | Why |
| --- | --- | --- | --- |
| `nudge-gateway` | CPU | Public HTTPS endpoint, calls Decisions REST and vLLM | Always warm (`min_containers=1`), no GPU billing |
| `dg-vllm` | 1× H100 80 GB | Runs `vllm serve google/diffusiongemma-26B-A4B-it` | Only GPU spend; can scale to zero outside demo |

Facts behind this:
- Expose the gateway with `@modal.fastapi_endpoint` (the recommended decorator), or `@modal.asgi_app` for a full FastAPI app. The old name `@modal.web_endpoint` was used before v0.73.82 ([Modal webhooks doc](https://modal.com/docs/guide/webhooks)).
- Modal can require proxy auth headers `Modal-Key` and `Modal-Secret`. An app-level bearer token can be checked in the handler ([Modal webhooks doc](https://modal.com/docs/guide/webhooks)).
- To run vLLM as a server inside a GPU container, use `@modal.web_server(port)` ([Modal webhooks doc](https://modal.com/docs/guide/webhooks)). The gateway then calls it over HTTPS.
- Warm/idle controls: `min_containers`, `buffer_containers`, `scaledown_window` (2 s to 20 min, default 60 s) ([Modal cold-start doc](https://modal.com/docs/guide/cold-start)).
- Billing per second; H100 SXM $0.001097/s ([Modal pricing](https://modal.com/pricing)). The ≈ $3.95/h is our conversion (3,600 s), not a page figure; the page does not name the 80 GB memory size.
- Response bodies are documented as "unlimited in size"; streaming responses are **not documented** on that page, so we use plain JSON ([Modal webhooks doc](https://modal.com/docs/guide/webhooks)).

**Why Python on Modal and not Ktor:** vLLM is a Python server, so DG needs a Python deployment anyway. A Ktor gateway would be a second service and still need Modal for the GPU. Ktor is fine if the team wants Kotlin-only backend code, but it adds a deployment (not fetched; no claims made about Ktor).

**Gateway contract (JSON):**
```
POST /v1/nudge
Authorization: Bearer <demo token>
{ "session_id": "s1", "frame_jpeg_b64": "...", "mime": "image/jpeg" }
→ 200 { "risk": "processed_meat" | null, "p": 0.91,
        "probs": { "processed_meat": 0.91, "smoking": 0.04, ... },
        "nudge": "Processed meat is linked to higher cancer risk; try beans or fish today.",
        "timings_ms": { "decisions": 240, "dg": 610 } }
```

---

## 3. Android modules

Single Gradle project, five modules. Kotlin, Jetpack Compose, CameraX.

| Module | Contents | Notes |
| --- | --- | --- |
| `:app` | Compose screens, ViewModel, settings (gateway URL, demo token), debug overlay (timings, probs) | Only module that knows Android UI |
| `:capture` | `FrameSource` interface; `CameraXFrameSource`; `VideoFileFrameSource` | CameraX `ImageAnalysis` with `STRATEGY_KEEP_ONLY_LATEST` (non-blocking, keeps newest frame); must call `ImageProxy.close()` after each frame ([CameraX analyze guide](https://developer.android.com/media/camera/camerax/analyze)). `VideoFileFrameSource` replays recorded POV clips for emulation ([04-test-media.md](emulation/04-test-media.md)). |
| `:nudge-api` | DTOs, `NudgeClient` (OkHttp + kotlinx.serialization), timeouts, retry once | No Gemini code here. OkHttp chosen for small surface (choice, UNVERIFIED that it is fastest). |
| `:speech` | `NudgeSpeaker` wrapping `TextToSpeech`; init at app start; queue with `QUEUE_FLUSH`; `shutdown()` on destroy | `TextToSpeech` must finish initialising before `speak()` ([Android TextToSpeech reference](https://developer.android.com/reference/android/speech/tts/TextToSpeech)). |
| `:core` | Models (`Risk`, `Nudge`, `Probs`), throttle (1 frame / 2 s), cooldown (per risk, default 20 s), threshold | Pure Kotlin, unit-testable without a device. |

Emulation: phone clipped at chest height, live CameraX, or a recorded POV clip through `VideoFileFrameSource`. The clip path makes the demo repeatable.

---

## 4. Data flow (one nudge)

1. `:capture` takes a frame; `:core` throttles to one frame every 2 s.
2. The frame is scaled to ~768 px wide and JPEG-encoded on the phone.
3. `:nudge-api` POSTs to `POST /v1/nudge` with the demo token.
4. Gateway builds a Decisions request:
   - `model`: `gemini-decision-1`
   - `input`: one `image` content block (`data` base64, `mime_type` `image/jpeg`)
   - `questions`: 8–12 keyed questions. Keys match `[A-Za-z0-9_-]+`, ≤ 64 chars. Types are `noul` (yes/no), `choice`, `score`.
   - Sent as `POST https://generativelanguage.googleapis.com/v1beta/decisions` with header `x-goog-api-key` ([Decisions API docs](https://aistudio.google.com/docs/decisions-api), checked this session: endpoint, `x-goog-api-key` header, key rules and types confirmed).
5. Decisions returns `answers`. For a `noul` question the probability is `noul` (0.01–0.99) ([Decisions API docs](https://aistudio.google.com/docs/decisions-api)).
6. Gateway picks the highest-probability risk with p ≥ 0.7. If none, it returns `risk: null` and the phone stays quiet.
7. Gateway calls DG on vLLM: `POST /v1/chat/completions`, `max_tokens` 40, a system prompt "one short, non-medical tip, ≤ 20 words", and the detected risk as user text. Text only; DG does not get the frame.
8. Gateway returns JSON (section 2).
9. `:speech` speaks the nudge. The Compose UI shows the caption and the top probability. `:core` starts the cooldown for that risk.

**Nudge rule:** every nudge is one sentence, framed as a non-medical tip. Show a visible "not medical advice" line in the UI.

---

## 5. Latency budget (per nudge, warm)

| Step | Budget p50 | Budget p90 | Basis |
| --- | --- | --- | --- |
| Frame pick + JPEG encode (phone) | 60 ms | 120 ms | UNVERIFIED estimate |
| Upload phone → gateway (~100 KB) | 150 ms | 400 ms | UNVERIFIED estimate (venue Wi-Fi may be worse) |
| Gateway routing (warm) | 10 ms | 20 ms | UNVERIFIED estimate |
| Decisions call | 250 ms | 500 ms | Google: "150–250 ms end-to-end", "contexts up to 16K tokens" (the blog ties this to latency benchmarks; it is not a general input limit), "nearly flat from 1 to 100 questions per request" ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)); p90 margin is ours |
| Pick risk + build prompt | 5 ms | 10 ms | Pure logic |
| DG call (vLLM, warm, ≤ 40 tokens) | 600 ms | 1000 ms | UNVERIFIED; see [05 §6](05-diffusiongemma.md) (canvas = 256, 15–20 tokens/pass, measure in hour 0–6) |
| Response gateway → phone | 100 ms | 200 ms | UNVERIFIED estimate |
| TTS first audio | 150 ms | 400 ms | UNVERIFIED estimate; `TextToSpeech` pre-initialised at launch |
| **Total** | **≈ 1.3 s** | **≈ 2.6 s** | Our sum |

Two speed-ups if the budget is missed:
- Pipeline: run DG on the **previous** frame's top risk while Decisions runs on the new frame. Saves ~250 ms (UNVERIFIED benefit).
- Demo mode: `min_containers=1` on `dg-vllm` so no cold start during the pitch. Cold start loads ~50 GB of weights and can take minutes ([05 §7](05-diffusiongemma.md)) [source needed: weight size is not stated on the HF model card].

---

## 6. Sponsor credits: which ones we use

Sources: [docs/sponsors.md](../../sponsors.md) (local file, from the hackerpack screenshots, 2026-11-13).

| Credit | Use | Amount | Verdict |
| --- | --- | --- | --- |
| **Google DeepMind** (Gemini API) | Decisions API (`gemini-decision-1`); fallback `gemma-4-26b-a4b-it` | Credits for up to 400 teams, keys via AI Studio | **Use.** Core model for B. |
| **Modal** | GPU for `dg-vllm` (H100) + CPU gateway | $100 per participant (sponsors list, [docs/sponsors.md](../../sponsors.md)); ≈ 25 H100-hours at list price (our calculation from [Modal pricing](https://modal.com/pricing)) | **Use.** Primary GPU. |
| **Featherless** | Hosted `google/gemma-4-26B-A4B-it` as fallback 2 | $50 via Junction coupon | **Backup.** Does **not** host DG ([05 §5](05-diffusiongemma.md)). |
| **Verda** | Rent one GPU VM and run the vLLM command if Modal fails | €200 | **Backup.** Verda's inference catalog has no Gemma/DG ([Verda models](https://docs.verda.com/inference/models/), catalog claim not re-checked in this sweep); GPU price not verified. |
| **Context.dev** | Research only (already in `.mcp.json`) | 50k credits | **Not in product.** |
| **Exa** | Optional stretch: "find the evidence" citations on each nudge | $50 per participant | **Stretch only.** Sponsors page says judges weight sourcing at 20%. |
| Cloudinary, Aiven, MariaDB, Oxylabs, SCAILAB, OpenAI, Arduino, Wendy, CRACI, IronShard, Qualia | — | — | **Not needed** for the MVP. We store no frames; state lives in memory. |

Ask for the Google credit key early. Put it in a Modal Secret, never in the repo or the APK.

---

## 7. 36-hour build plan (4 people)

Hours count from kickoff. Owner roles:
- **P1 — Android capture and UI:** `:app`, `:capture`, `:speech`, emulation sources.
- **P2 — Client and gateway:** `:nudge-api`, `:core` (throttle, cooldown), `nudge-gateway` on Modal, Decisions REST.
- **P3 — Model serving:** `dg-vllm` on Modal, nudge prompt, latency tests, fallback switch.
- **P4 — Content, eval, demo:** question set, labelled test frames, accuracy check, pitch deck, video, sponsor credits, Gemma-track question to organisers.

| Hours | Work | Milestone |
| --- | --- | --- |
| 0–3 | P1: CameraX preview + JPEG. P2: gateway skeleton returning fake probs. P3: start `dg-vllm` deploy, pull weights, first `curl`. P4: write 10–12 Decisions questions, label 30 frames from `04-test-media.md`. | **M0 (h3):** repo builds, Modal secrets set, DG answers one `curl` |
| 3–10 | P1: frames POST to gateway. P2: real Decisions REST with probs. P3: nudge prompt tuned; first 50-run latency test. P4: eval script on the 30 labelled frames. | **M1 (h10):** one frame → real probs → nudge text on screen (no audio yet) |
| 10–16 | P1: TTS + cooldown + UI chips. P2: threshold + risk pick + timings in JSON. P3: decide primary (DG) vs fallback (Gemini `gemma-4`) from latency. P4: recorded POV clips for emulation. | **M2 (h16):** spoken nudge from phone, live camera and recorded clip |
| 16–24 | Hardening: timeouts, one retry, offline message, "not medical advice" line. Threshold tuned on labelled frames. P4: pitch draft; email organisers about Gemma-track eligibility. | — |
| 24–28 | Feature freeze at **h28**. Bug fixes only. | **M3 (h28):** frozen |
| 28–32 | Three full demo rehearsals with `min_containers=1`. Record backup video. Test fallback switch (env var). | **M4 (h32):** rehearsed + backup video |
| 32–35 | Slides, screenshots, submission text. Deploy freeze at h34. | **M5 (h34):** submitted-ready |
| 35–36 | Buffer, submit. | — |

---

## 8. Two-minute demo script

Stage: phone clipped to a chest strap (glasses POV), projector shows the live camera and the debug overlay. Backup: pre-recorded clip of the same walk, played if the venue Wi-Fi fails.

| Time | What happens | Words (short, plain) |
| --- | --- | --- |
| 0:00–0:15 | Hook | "Smart glasses see your food and the sun. Nobody tells you the risk. We do, in one sentence, in about a second." |
| 0:15–0:35 | Show the emulation rig | "No glasses on stage. The phone is the glasses. Our backend holds every API key." |
| 0:35–1:05 | Walk to a plate with sausage | Spoken nudge (example): "Processed meat is linked to higher cancer risk; a vegetable side is a better choice." Caption and probability on screen. |
| 1:05–1:25 | Step into strong sun with no shade | Spoken nudge (example): "Strong sun without shade: use shade and sunscreen at midday." Show the cooldown: repeat the sausage plate and nothing plays for 20 s. |
| 1:25–1:50 | Architecture slide | "One frame. Gemini Decisions gives calibrated probabilities for ten questions in one call. DiffusionGemma writes the sentence. About 1.3 seconds in our tests." (Replace with measured numbers from M4.) |
| 1:50–2:00 | Close | "DiffusionGemma (Apache 2.0 per its [HF model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it); Gemma 4 base licence [source needed]): every word you heard came from an open Gemma model. Questions?" |

Rules for the demo:
- Say "example" or "not medical advice" once, on screen, in the first 15 seconds.
- Do not claim a reduction in cancer risk. Claim a prompt to make a different choice.

---

## 9. Risks (short)

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Gemma track may not count DiffusionGemma | Lose track prize | Ask organisers in writing; keep Gemma 4 env switch (05 §8) |
| DG latency above budget | Slow nudge | Measure on day 1; switch to Gemini-hosted `gemma-4-26b-a4b-it` (05 §9) |
| Weight load at cold start | Minutes of dead air | Volume cache + `min_containers=1` during demo |
| Decisions probabilities wrong on frames | Wrong nudges | 30 labelled frames; threshold p ≥ 0.7 tuned; show probs on screen |
| Health claims | Harm, judge penalty | Non-medical tip wording; "not medical advice" line |
| Venue Wi-Fi | Slow or lost calls | Phone hotspot as backup; recorded clip backup |
| Decisions REST shape | Wrong request body | Verify on the docs page first hour (WebFetch extraction is secondary) |
| Meta DAT not used | Judges expect real glasses? | Out of scope for MVP; emulation is the stated direction ([docs/README.md](../../README.md) (local file)) |

---

## Sources

- [Modal webhooks / web endpoints](https://modal.com/docs/guide/webhooks)
- [Modal cold starts and scaledown](https://modal.com/docs/guide/cold-start)
- [Modal pricing](https://modal.com/pricing)
- [Gemini Decisions API — Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)
- [Gemini Decisions API docs (extraction via WebFetch; verify directly)](https://aistudio.google.com/docs/decisions-api)
- [CameraX image analysis](https://developer.android.com/media/camera/camerax/analyze)
- [Android TextToSpeech reference](https://developer.android.com/reference/android/speech/tts/TextToSpeech)
- [DiffusionGemma model card (HF)](https://huggingface.co/google/diffusiongemma-26B-A4B-it)
- [DiffusionGemma developer guide (Google)](https://developers.googleblog.com/en/diffusiongemma-the-developer-guide/)
- [Verda inference models](https://docs.verda.com/inference/models/)
- Local: [05-diffusiongemma.md](05-diffusiongemma.md), [03-sdk-samples-sweep.md](emulation/03-sdk-samples-sweep.md), [04-test-media.md](emulation/04-test-media.md), [docs/sponsors.md](../../sponsors.md), [docs/tracks/google-deepmind-gemma.md](../../tracks/google-deepmind-gemma.md), [docs/README.md](../../README.md)
