# 02 – Gemini Decisions API (`gemini-decision-1`): what we can rely on

Research date: 2026-11-14. Scope: REST contract, image input, limits, latency, pricing, free tier, calibration, and gaps for the glasses cancer-risk coach.

Sources used (all fetched 2026-11-14 unless marked; the key facts were re-checked the same day, and corrections are marked "(corrected)"):
- Decisions API guide: https://aistudio.google.com/docs/decisions-api.md (Markdown fetched via web-scrape)
- Model page: https://aistudio.google.com/docs/models/gemini-decision-1.md
- Pricing, Gemini Decision 1 section: https://aistudio.google.com/docs/pricing.md (highlights only)
- Rate limits, Gemini Decision 1 section: https://aistudio.google.com/docs/rate-limits.md (highlights only)
- Google blog, launch post dated Nov 11, 2026: https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/
- Project skill section "Decisions API": `.claude/skills/gemini-api-dev/SKILL.md` lines 330–378 (in repo)

---

## 1. Endpoint and auth

- `POST https://generativelanguage.googleapis.com/v1beta/decisions`
- Header `x-goog-api-key: $GEMINI_API_KEY`, `Content-Type: application/json` (source: [decisions-api guide](https://aistudio.google.com/docs/decisions-api.md), REST tab; endpoint and header re-checked 2026-11-14).
- Only on `v1beta` (decisions-api.md "Limitations": "Available on the Gemini Developer API (v1beta) with Gemini Decision 1 only").
- Python and JS SDKs need SDK 3.2+ (`pip install -U google-genai`, `npm install @google/genai@latest`). The guide says "Requires SDK 3.2 or later" and documents Python, JavaScript and REST only (checked 2026-11-14). **UNVERIFIED:** whether an official Kotlin/Java SDK exists. Plan: call REST from our backend (the API key must stay server-side anyway).

## 2. Request body

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `model` | string | yes | `gemini-decision-1` |
| `input` | string, Content, or Content[] | yes | Shared context for all questions. Cannot be empty. |
| `questions` | map string → Question | yes | 1–1,000 questions. Keys match `[A-Za-z0-9_-]+`, max 64 chars. Answers come back under the same keys. |

Each question: `type` (`noul` | `choice` | `score`), `instructions` (text only), and `criteria` (required for `choice` and `score`; optional for `noul`).

### 2a. `noul` (yes/no) – request and response

Request (from decisions-api.md, REST tab):
```json
{
  "model": "gemini-decision-1",
  "input": "Customer returned the sweater because they preferred green over blue.",
  "questions": {
    "is_defect": {
      "type": "noul",
      "instructions": "Is the customer reporting a product defect?",
      "criteria": {
        "true_description": "The product itself is broken or faulty.",
        "false_description": "Preference, sizing, shipping, or pricing complaint."
      }
    }
  }
}
```

Response (from decisions-api.md, "Yes or no (noul)"):
```json
{ "type": "noul", "noul": 0.03, "confidence": 0.97 }
```
Full response wrapper (from the multi-question example; corrected: the earlier note cited the quickstart section): `{"answers": {"<key>": {...}}, "usage": {...}}`.

### 2b. `choice` – request and response

Request (decisions-api.md, "Pick one option (choice)"):
```json
{
  "model": "gemini-decision-1",
  "input": "I was charged twice for my order.",
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "Which department should handle this request?",
      "criteria": {
        "billing": "Payments, invoices, and refunds.",
        "technical": "Problems using the product.",
        "shipping": "Delivery and tracking.",
        "other": "Anything outside these categories."
      }
    }
  }
}
```

Response:
```json
{
  "type": "choice",
  "choice": "billing",
  "probabilities": { "billing": 0.99, "shipping": 0.004, "other": 0.003, "technical": 0.002 },
  "confidence": 0.99
}
```

### 2c. `score` – request and response

Request (decisions-api.md, "Rate on a scale (score)"):
```json
{
  "model": "gemini-decision-1",
  "input": "Export fails in Safari but works in Chrome.",
  "questions": {
    "severity": {
      "type": "score",
      "instructions": "How severe is this issue for the user?",
      "criteria": [
        "Cosmetic: appearance only, no lost functionality.",
        "Workaround available: a task fails, but another way works.",
        "Fully blocked: a task fails with no workaround."
      ]
    }
  }
}
```

Response:
```json
{
  "type": "score",
  "score": 1.12,
  "legend": {
    "0": "Cosmetic: appearance only, no lost functionality.",
    "1": "Workaround available: a task fails, but another way works.",
    "2": "Fully blocked: a task fails with no workaround."
  },
  "probabilities": { "0": 0.03, "1": 0.83, "2": 0.15 },
  "confidence": 0.83
}
```

Doc note: `score` is the probability-weighted expected level (0-based indices), so it can sit between levels. Check the per-level probabilities too.

### 2d. Response envelope and usage

```json
{
  "answers": { "...": { "type": "noul", "noul": 0.94, "confidence": 0.94 } },
  "usage": {
    "total_input_tokens": 324,
    "input_tokens_by_modality": [{ "modality": "text", "tokens": 324 }],
    "total_output_tokens": 0,
    "total_tokens": 324
  }
}
```
Source: decisions-api.md multi-question example.

### 2e. Error on safety block

When input safety filters block a request, the API returns HTTP 400 with no `answers`:
```json
{ "error": { "code": "safety", "message": "Request blocked due to safety violations (harmful content). Please modify your input and retry." } }
```
`code` is one of `safety`, `prohibited_content`, `blocklist`, `image_safety`, `content_blocked` (decisions-api.md, "Request and response reference"). Plan: the backend treats 400-safety as "skip this frame", never as a risk signal.

## 3. Sending an image

Two options, both documented:

1. **Inline base64** (`data`): `{"type":"image","data":"<base64>","mime_type":"image/jpeg","resolution":"low|medium|high|ultra_high"}`. Limit: 100 MB per request for inline data (decisions-api.md, "Input"). **Recommended for glasses frames**: the backend already holds the frame, no upload step.
2. **URI** (`uri`): Files API URI, or a public/signed HTTPS URL up to 15 MB. Not `gs://`, not YouTube.

Image MIME types accepted: `image/png`, `image/jpeg`, `image/webp`, `image/heic`, `image/heif`, `image/gif`, `image/bmp`, `image/tiff` (guide, checked 2026-11-14).

Values: `low`, `medium`, `high`, `ultra_high`. The guide says "Ultra-high resolution applies to images only; audio and document blocks don't use resolution settings." (corrected: the earlier note said "images/video only".) **UNVERIFIED:** how many tokens each resolution costs for a typical glasses frame. The doc does not say. Measure with `usage.total_input_tokens` before choosing a default.

Input block order: the guide's examples put text first and image second, but the guide gives no rule for order. It does say adjacent text blocks are concatenated with no separator. Add `\n` yourself.

## 4. Working curl example with an image

Inline base64 image, three questions, built with `jq` so no value is hand-escaped. The API key is read from the environment and never printed.

```sh
#!/bin/sh
# Usage: GEMINI_API_KEY=... sh decide_frame.sh frame.jpg
# Needs: curl, jq, GNU base64 (base64 -w0).
set -eu
FRAME="$1"
REQ="$(mktemp)"
trap 'rm -f "$REQ"' EXIT

IMG_B64="$(base64 -w0 "$FRAME")"

jq -n --arg img "$IMG_B64" '{
  model: "gemini-decision-1",
  input: [
    { type: "image", data: $img, mime_type: "image/jpeg", resolution: "medium" },
    { type: "text", text: "Glasses point-of-view frame." }
  ],
  questions: {
    processed_meat_visible: {
      type: "noul",
      instructions: "Is a processed meat (sausage, hot dog, bacon, ham, salami) visible on a plate, in a bun, or in a hand?"
    },
    cigarette_visible: {
      type: "noul",
      instructions: "Is a cigarette, cigar, or pipe visible in someone'\''s hand or mouth?"
    },
    main_meat_type: {
      type: "choice",
      instructions: "Which category best describes the most prominent meat in view?",
      criteria: {
        processed_meat: "Sausage, hot dog, bacon, ham, salami, or cold cuts.",
        red_meat_unprocessed: "Beef, pork, lamb, or minced meat, not cured.",
        poultry: "Chicken, turkey, or duck.",
        no_meat_visible: "No meat is visible.",
        other: "Anything else, or unclear."
      }
    }
  }
}' > "$REQ"

curl -sS -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @"$REQ"
```

Status of this example: **the JSON build was checked locally with `jq` on dummy bytes (the image block and key validation passed). No live call was made in this session**, so the response was not observed. Run it once with a real key before relying on it.

The full 26-question production request is in `04-question-set.request.json` (same folder).

## 5. Limits

| Limit | Value | Source |
| --- | --- | --- |
| Questions per request | 1–1,000, bounded by context window | decisions-api.md "Limits" |
| Context window | 262,144 tokens (shared input + all questions) | decisions-api.md; model page |
| Options per choice | 2–255 | decisions-api.md |
| Levels per score | 2–255 non-empty (2–10 recommended) | decisions-api.md |
| Question key | 1–64 chars, `[A-Za-z0-9_-]+` | decisions-api.md |
| Option key | 1–128 chars (≤512 UTF-8 bytes) | decisions-api.md |
| Inline data per request | 100 MB (50 MB for PDFs) | decisions-api.md "Input" |
| External URI size | 15 MB | decisions-api.md "Input" |
| Question instructions | text only | decisions-api.md |
| Yes/no probability range | 0.01–0.99 | decisions-api.md |
| JSON nesting depth | 100 | decisions-api.md |

Rate limits, Gemini Decision 1 ([rate-limits.md](https://aistudio.google.com/docs/rate-limits.md), checked 2026-11-14; the page says RPD "reset at midnight Pacific time"; the "per project" wording was not checked):

| Tier | RPM | TPM (input) | RPD |
| --- | --- | --- | --- |
| Free | 200 | 50,000 | 10,000 |
| Tier 1 | 1,500 | 1,000,000 | 50,000 |
| Tier 2 | 5,000 | 4,000,000 | Unlimited |
| Tier 3 | 15,000 | 10,000,000 | Unlimited |

Free tier arithmetic (ours): at one frame every 2 s, one user uses 1,800 requests/hour. The free daily cap of 10,000 requests is roughly 5.5 hours at that rate. At 500 input tokens per frame (UNVERIFIED assumption), the 50,000 TPM cap allows about 100 frames/min, so RPD is the binding limit. Use the 1 frame per 2 s design; do not send continuous video.

Batch API, Context caching, Flex and Priority inference: **not supported** (model page; decisions-api.md "Limitations"). Repeated input across requests is billed in full.

## 6. Latency

- Blog: "150–250 ms end-to-end latency", "median latency 50–100 ms of model compute", with "contexts up to 16K tokens" and "nearly flat from 1 to 100 questions per request" (vendor claim, https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/).
- The doc does not give latency numbers.
- **UNVERIFIED for glasses:** these are Google's figures on their benchmark setup. Our real phone→backend→API round trip must be measured. Budget at least one network hop on each side.

## 7. Pricing

- Paid: **$0.10 per 1M input tokens**, **$0 output** ([pricing.md](https://aistudio.google.com/docs/pricing.md), Gemini Decision 1 section, checked 2026-11-14; blog).
- Shared input is billed once per request: the pricing page says "Each request bills shared input tokens once, regardless of question count." Each question adds its own instruction and criteria tokens (our reading of the request format; not stated on the pricing page).
- No context caching, no Batch discount.
- Free tier: **"Free of charge"** for input in the pricing table (pricing.md). The blog calls it an "API no-cost tier" usable in AI Studio for prototyping.
- Cost estimate (ours, assumes 500 input tokens/frame, UNVERIFIED): $0.00005 per frame → 1,800 frames/hour (one every 2 s) = 0.9M tokens = about $0.09 per hour of glasses use. The per-frame input size needs measuring (see section 3).

## 8. Calibration rules (what the API promises)

From decisions-api.md "Answers, probabilities, and confidence" and "Best practices":

- **noul:** `noul` = calibrated P(yes), range 0.01–0.99. `confidence` = `max(noul, 1 - noul)`. **So for yes/no answers, `confidence` carries no information beyond `noul`.** Gate on `noul` and use separate questions (for example `image_quality_ok`) for input quality.
- **choice:** probabilities sum to 1 over all options; `confidence` = the top option's probability. The API sorts option keys alphabetically (UTF-8 byte order) and ties break to the alphabetically first key. Use a catch-all `other` option, not `none_of_the_above`.
- **score:** probability-weighted mean of 0-based level indices. Keep level descriptions linearly spaced. Exponential scales skew the mean.
- Doc: "Set thresholds using labeled examples from your own traffic. Weigh the cost of a false positive against a false negative." The doc gives no per-domain calibration procedure and no reliability diagrams. The "calibrated" claim is Google's (blog: "lowest calibration error" on benchmarks). **UNVERIFIED for our frames:** we must build our own labelled set (see 04 and 03).
- Doc on untrusted input: "Treat input as untrusted. User-supplied text can argue for its own classification." Relevant to glasses: text on signs or packaging in frame could sway answers. Add an explicit instruction, and test.
- Doc on dependence: "The API evaluates each question independently against the shared input." and "Questions can't see each other, and adding or removing one doesn't change the other answers." Combine answers in our backend code.

## 9. What it cannot do

- **No text output.** The model page lists "Text generation" as not supported. It cannot write the spoken nudge. The nudge text must come from templates or another model (the plan's DiffusionGemma/Gemma path, outside this doc).
- **No free-form description** of what is in the frame. You only get answers to the questions you wrote.
- **No conversation history, tool calls, thought blocks** as input (decisions-api.md "Limitations").
- **No media inside question instructions**; instructions are text only.
- **No YouTube or `gs://` URIs.**
- **No Live API, function calling, structured outputs, grounding, code execution, or image generation.** The model page lists each as "not supported". Streaming is not on that page (corrected: the earlier note listed streaming as not supported; the closest entry is "Live API").
- **No caching or Batch** (see section 5).
- **Cannot read temperature.** For example, the "above 65 °C" hot drink rule (IARC) is not visible in a frame. Use proxies and label them (see 03).
- **Cannot replace a medical judgement.** Nudges are general health information, not diagnosis. Keep a disclaimer in the product copy. (Design choice, not from the sources.)

## 10. Open items (UNVERIFIED)

1. Tokens per glasses frame at each `resolution` value. Measure with `usage`.
2. Real end-to-end latency from our backend. Google's figures are benchmarks.
3. Accuracy of each question on real POV frames. Needs a labelled set of our own (plan in 04).
4. Whether a Kotlin SDK exists. Plan assumes REST from the backend.
5. Whether `resolution: "low"` still shows a cigarette or a sausage at a distance.
6. Whether the free-tier TPM and RPD limits in rate-limits.md match what the AI Studio dashboard shows for our project. Check in AI Studio.

## Sources

- https://aistudio.google.com/docs/decisions-api.md
- https://aistudio.google.com/docs/models/gemini-decision-1.md
- https://aistudio.google.com/docs/pricing.md
- https://aistudio.google.com/docs/rate-limits.md
- https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/
- `.claude/skills/gemini-api-dev/SKILL.md` (repo, "Decisions API" section)
