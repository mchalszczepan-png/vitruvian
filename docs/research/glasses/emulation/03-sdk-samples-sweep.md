# 03 — SDK and sample sweep (Meta DAT Android, open-source glasses→Gemini projects, Google Gemini paths)

Sweep date: 2026-11-13. Method: web search, primary-page fetches, GitHub API (`gh api`), Maven Central metadata. Items marked **unverified** were seen only in search snippets.

Terms used: **DAT** = Meta Wearables Device Access Toolkit. **MockDeviceKit** = Meta's simulated-glasses library.

---

## 1. Meta Wearables Device Access Toolkit (Android)

| Item | Finding | Source |
| --- | --- | --- |
| Official docs hub | https://wearables.developer.meta.com/docs/develop/ | [FAQ](https://developers.meta.com/wearables/faq/) |
| Android integration guide | https://wearables.developer.meta.com/docs/develop/dat/build-integration-android/ | [guide](https://wearables.developer.meta.com/docs/develop/dat/build-integration-android/) |
| GitHub repo | https://github.com/facebook/meta-wearables-dat-android — 402★, last push 2026-10-25, license shown as `NOASSERTION` (a LICENSE file exists; no SPDX id detected) | [repo](https://github.com/facebook/meta-wearables-dat-android) (GitHub API) |
| Sample apps | Top-level `samples/` folder on the repo. Exact sample path not confirmed on the page. | [repo](https://github.com/facebook/meta-wearables-dat-android) |
| Maven group | `com.meta.wearable` | [Maven Central](https://repo1.maven.org/maven2/com/meta/wearable/mwdat-core/maven-metadata.xml) |
| Artifacts | `mwdat-core`, `mwdat-camera`, `mwdat-display`, `mwdat-inputs`, `mwdat-motion`, `mwdat-mockdevice`, `mwdat-speech` (repo README lists all seven) | [repo](https://github.com/facebook/meta-wearables-dat-android) |
| Latest version | **1.0.1** (`<latest>` and `<release>`). Versions on Central: 0.7.0, 0.8.0, 0.9.0, 1.0.0, 1.0.1. Index `lastUpdated` = 2026-10-09. Per-version publish date not shown. | [Maven metadata](https://repo1.maven.org/maven2/com/meta/wearable/mwdat-core/maven-metadata.xml) |
| Repository | Maven Central. The integration page says no GitHub Packages token is needed. | [guide](https://wearables.developer.meta.com/docs/develop/dat/build-integration-android/) |
| Manifest | Metadata `com.meta.wearable.mwdat.APPLICATION_ID` and `com.meta.wearable.mwdat.CLIENT_TOKEN`. Use `0` for both in Developer Mode. | [guide](https://wearables.developer.meta.com/docs/develop/dat/build-integration-android/) |
| Min Android / Kotlin | Android 10+ and Kotlin 2.2+ per a search snippet of the docs. Not on the fetched page. **Unverified.** | [search snippet](https://wearables.developer.meta.com/docs/develop/dat/build-integration-android/) |
| **Mock / simulated glasses** | **Yes.** `mwdat-mockdevice` artifact = MockDeviceKit, "Test without physical glasses". Phone camera can act as the mock feed (needs `CAMERA` permission). Speech testing also uses it. | [repo](https://github.com/facebook/meta-wearables-dat-android), [guide](https://wearables.developer.meta.com/docs/develop/dat/build-integration-android/) |
| Release status (conflict) | FAQ says DAT 1.0 rolls out 2026-09-30. The integration page still says "developer preview". Maven has 1.0.x. Treat 1.0.1 as current. | [FAQ](https://developers.meta.com/wearables/faq/), [guide](https://wearables.developer.meta.com/docs/develop/dat/build-integration-android/) |
| AI tooling | Docs MCP at `mcp.developer.meta.com/wearables` (tool `search_dat_docs`) and `wearables.developer.meta.com/llms.txt`. | [search snippet](https://wearables.developer.meta.com/docs/ai-assisted/) |

---

## 2. Open-source projects: glasses (or phone camera) → Gemini / vision LLM → spoken reply

Stars and dates from the GitHub API. Sorted by relevance to our use case.

| # | Project | ★ | Last push | Licence | Platform | Gemini / vision path | Reuse |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [Intent-Lab/VisionClaw](https://github.com/Intent-Lab/VisionClaw) (formerly `sseanliu/VisionClaw`) | 2,622 | 2026-10-21 | `NOASSERTION` (LICENSE file) | iOS + Android | Gemini Live over WebSocket, native audio. Also OpenClaw agent actions. | Best reference for live voice+vision loop. Android sample reported at `samples/CameraAccessAndroid/`. |
| 2 | [Intent-Lab/Matcha](https://github.com/Intent-Lab/Matcha) | 35 | 2026-09-26 | `NOASSERTION` | Android (sample) | Gemini 2.0 Flash Live API. Lists Meta Ray-Ban camera "via DAT SDK" as Working. | Smaller, Android-first. Opens `samples/CameraAccessAndroid/` in Android Studio. |
| 3 | [przemek-nowicki/meta-lens-ai](https://github.com/przemek-nowicki/meta-lens-ai) | 138 | 2026-10-28 | MIT | Android 12+ | Hands-free talk with ChatGPT or Gemini and "live vision". Streams to YouTube, Twitch, Kick (TikTok in repo description). Which vendor gets frames is unclear. | Reuse the Android glasses camera and voice plumbing. Check the privacy section before reusing it. |
| 4 | [straff2002/OpenGlasses](https://github.com/straff2002/OpenGlasses) | 133 | 2026-11-13 | `NOASSERTION` | **unverified** | Non-Meta model selection, agentic features. Gemini support **unverified**. | Look at model-agnostic routing. Platform not checked. |
| 5 | [DarlingtonDeveloper/OpenGlass](https://github.com/DarlingtonDeveloper/OpenGlass) | 20 | 2026-02-24 | MIT | **unverified** (earlier snippet said iOS) | "Meta Ray-Bans + Gemini Live + OpenClaw". | Small, MIT, likely iOS. Low priority. |
| 6 | [googleapis/java-genai](https://github.com/googleapis/java-genai) | 401 | 2026-11-13 | Apache-2.0 | JVM (not Android-specific) | Official Gen AI Java SDK. Maven `com.google.genai:google-genai`, latest shown 2.3.0. Java 17+. | Not a glasses project. It is the Google SDK candidate (see section 3). |
| 7 | FixIt Genie (Gemini Live Agent Challenge hackathon) | unknown | unknown | unknown | Android (Kotlin, Compose) | Streams glasses video via **DAT SDK v0.4** (outdated). I420→JPEG, sends to **Gemini 2.5 Flash Native Audio** over WebSocket. Source: [fixit-genie.web.app](https://fixit-genie.web.app/blog.html). Repo URL not found (guessed URL returned 404). | **Unverified** lead. Good pattern for frame conversion and WebSocket. Needs the real repo URL. |

Notes:
- Only #1 and #2 are confirmed Android samples for DAT-based camera streaming with Gemini.
- The Matcha `samples/CameraAccessAndroid/` path appears in both the Matcha and VisionClaw fetches. Verify on the repo before relying on it.

---

## 3. Google's official Kotlin/Android path to Gemini (Nov 2026)

| Option | Android/Kotlin coordinates and version | Decisions API (`gemini-decision-1`)? | Source |
| --- | --- | --- | --- |
| **Firebase AI Logic** (`firebase-ai`) | BoM `com.google.firebase:firebase-bom:35.2.0`; `firebase-ai` 18.2.0. Backends: Gemini Developer API (`GenerativeBackend.googleAI()`) or Vertex AI. Kotlin example model `gemini-3.8-flash`. | **No.** Searches found no Decisions or decision-1 support. Firebase's April 2026 post covers function calling only. | [Firebase docs](https://firebase.google.com/docs/ai-logic/get-started), [search](https://firebase.google.com/docs/ai-logic) |
| **Google Gen AI Java SDK** (`google-genai`) | `com.google.genai:google-genai` 2.3.0 (Maven snippet on repo). Apache-2.0, Java 17+. | **Not mentioned** in its README. | [repo](https://github.com/googleapis/java-genai) |
| **Google Gen AI Python / JS SDKs** | Python `google-genai` 3.2+ per secondary sources; JS also supported. | **Yes.** Python: `client.decisions.create(...)` with `http_options={"api_version": "v1beta"}`. | [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/), [search](https://flaviocopes.com/gemini-decisions-api/) |
| **REST** | `POST https://generativelanguage.googleapis.com/v1beta/decisions`, auth header `x-goog-api-key`. **Path from third-party sources, not Google's reference docs.** | Yes (third-party). | [search](https://flaviocopes.com/gemini-decisions-api/) |

**Verdict:** No official Kotlin/Java SDK or Firebase path supports the Decisions API. **Use REST from Kotlin** (Ktor/OkHttp against `v1beta/decisions`), or the Python SDK for prototyping. Confirm the REST path against Google's own Decisions API doc before coding.

Decisions API facts (from the [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/) and [SiliconANGLE](https://siliconangle.com/2026/11/11/google-enters-the-decision-model-market-with-gemini-decisions-api/)):
- Launched **2026-11-11**. Model `gemini-decision-1`.
- Up to **1,000 questions** per request. Shared input across text, image, audio, video, PDF.
- Question types: yes/no (probability), choice (2–255 options), score (2–255 rubric levels).
- Input up to ~256K tokens. Price **$0.10 / 1M input tokens**, output $0. Free tier in AI Studio.
- No context caching, no Batch API at launch. Google Cloud/Vertex support "coming soon".
- Latency 150–250 ms end-to-end (Google's figure).

---

## 4. Summary

- **Meta DAT:** Use Maven `com.meta.wearable:mwdat-core:1.0.1` (+ `mwdat-camera`, `mwdat-mockdevice`). MockDeviceKit exists for no-hardware testing. Repo: https://github.com/facebook/meta-wearables-dat-android.
- **Reference projects:** Start with Intent-Lab/VisionClaw (2,622★, iOS+Android, Gemini Live) and Intent-Lab/Matcha (Android sample, Gemini 2.0 Flash Live). Licences are `NOASSERTION` and need a read before reuse.
- **Decisions API:** `gemini-decision-1` launched 2026-11-11 on the Gemini Developer API, `v1beta`.
- **Google SDK support:** Firebase AI Logic and the Java SDK do not list Decisions. Python `google-genai` does. For Kotlin, use REST.
- **Open items:** Confirm the REST path and body shape on Google's docs. Find the FixIt Genie repo. Check the DAT 1.0 release status against Meta's FAQ.
