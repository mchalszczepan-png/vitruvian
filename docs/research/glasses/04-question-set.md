# 04 – Decisions API question set and nudge policy

Research date: 2026-11-14. Companion files: `02-decisions-api.md` (API contract, limits, calibration) and `03-risk-evidence.md` (which factors matter and why).

- Request body: `/home/michal/.t3/projects/vitruvian/docs/research/glasses/04-question-set.request.json`
  - One call per frame: `model` `gemini-decision-1`, one image block (`"data": "__FRAME_JPEG_BASE64__"`, placeholder for the frame), one short text block, and **26 questions** (21 `noul`, 3 `choice`, 2 `score`).
  - The backend replaces the placeholder with the base64 JPEG and posts it to `POST https://generativelanguage.googleapis.com/v1beta/decisions` (`x-goog-api-key` header). See 02, section 4.
- Question limits and format come from 02 (keys `[A-Za-z0-9_-]+`, max 64 chars; `noul` 0.01–0.99; `score` is a weighted mean of 0-based level indices). Sources: https://aistudio.google.com/docs/decisions-api.md
- The question set is **a draft**. None of the thresholds below have been tested on real frames. Everything in the nudge policy marked "proposal" is our design, not a sourced rule.

## 1. How to read the answers

- **`noul`** → use the `noul` value only (P(yes)). Do **not** use `confidence` for yes/no: the doc defines `confidence = max(noul, 1 − noul)`, so it adds nothing (02, section 8).
- **`choice`** → use the top option and its `probabilities` value. Options are sorted in UTF-8 byte order and ties go to the alphabetically first key (guide, "Pick one option (choice)", checked 2026-11-14).
- **`score`** → the `score` is a weighted mean of level indices, so check the per-level `probabilities` as well (02, section 2c).
- **400 `safety` error** → skip the frame. It is never a risk signal (02, section 2e).

## 2. The 26 questions

Factor ranks refer to `03-risk-evidence.md`. Keys are the exact keys in the request JSON.

| # | Key | Type | What it asks | Role in the policy | Factor (03 rank) |
| --- | --- | --- | --- | --- | --- |
| 1 | `scene_has_food` | noul | Food or drink in view? | Gate for all food nudges | 6, 7, 8, 9 |
| 2 | `image_quality_ok` | noul | Sharp and bright enough? | Gate: skip frame if low | All |
| 3 | `child_visible` | noul | Child or teen clearly in frame? | **Veto**: no spoken nudge in this frame | All |
| 4 | `scene_setting` | choice | Home, restaurant, outdoors, office, vehicle, other | Context only; logged | — |
| 5 | `wearer_outdoors` | noul | Wearer outside now? | Gate for sun nudges | 6 |
| 6 | `cigarette_visible` | noul | Cigarette, cigar or pipe in hand or mouth? | Trigger | 1 |
| 7 | `smoke_nearby` | noul | Someone smoking within about 2 m? | Trigger | 2 |
| 8 | `vape_visible` | noul | E-cigarette or vape in hand or mouth? | Trigger (vaping evidence **UNVERIFIED**, see 03) | 1 |
| 9 | `alcohol_visible` | noul | Alcoholic drink visible? | Trigger, needs veto check (10) | 5 |
| 10 | `alcohol_nonalcoholic_label` | noul | Drink is labelled or looks non-alcoholic? | **Veto** for 9 | 5 |
| 11 | `alcohol_being_drunk` | noul | Wearer drinking or about to drink alcohol? | Trigger (stronger than 9) | 5 |
| 12 | `processed_meat_visible` | noul | Processed meat visible? | Trigger | 4 |
| 13 | `processed_meat_being_eaten` | noul | Wearer eating or about to eat it? | Trigger (stronger than 12) | 4 |
| 14 | `main_meat_type` | choice | Most prominent meat: processed, red, poultry, fish, none, other | Tie-break between 12 and 15 | 4, 8 |
| 15 | `red_meat_visible` | noul | Unprocessed beef, pork, lamb or minced meat visible? | Trigger | 8 |
| 16 | `red_meat_portion` | score | Red-meat share of the plate, 0 to 3 levels | Trigger only at level 2 or 3 | 8 |
| 17 | `charred_food` | noul | Food visibly blackened or burnt? | Trigger | 7 |
| 18 | `open_flame_cooking` | noul | Food cooking over flame or on a grill now? | Context for 17 | 7 |
| 19 | `hot_drink_visible` | noul | Hot drink with steam? | Logged only (off by default) | 9 |
| 20 | `hot_drink_being_sipped` | noul | Wearer drinking a hot drink? | Logged only (off by default) | 9 |
| 21 | `sun_exposed_skin` | noul | Bare skin in direct bright sun? | Trigger for sun | 6 |
| 22 | `sun_protection_used` | choice | None, hat, shade, long sleeves, other | **Veto**: no sun nudge if protection is seen | 6 |
| 23 | `sunbed_visible` | noul | Sunbed, tanning booth or UV tanning panel? | Trigger (highest priority) | 3 |
| 24 | `sunburn_visible` | noul | Red or peeling skin on the wearer? | Trigger for sun (stronger than 21) | 6 |
| 25 | `vegetables_share` | score | Share of the plate that is vegetables or fruit | Optional positive feedback (off by default) | 10 |
| 26 | `sugary_drink_visible` | noul | Sugary soft drink, energy drink or sweet juice visible? | Logged only (off by default) | 10 |

### Example questions as they appear in the request JSON

`noul` (from the file, key `cigarette_visible`):
```json
"cigarette_visible": {
  "type": "noul",
  "instructions": "Is a cigarette, cigar, or pipe visible in someone's hand or mouth?",
  "criteria": {
    "true_description": "A tobacco product is held, lit, or being smoked.",
    "false_description": "Pens, sticks, food, straws, or nothing similar."
  }
}
```

`choice` (from the file, key `sun_protection_used`):
```json
"sun_protection_used": {
  "type": "choice",
  "instructions": "What sun protection is the wearer using right now?",
  "criteria": {
    "none_visible": "No hat, shade, long clothing, or sunscreen is visible.",
    "hat_or_cap": "A hat or cap shades the face.",
    "shade_or_umbrella": "The wearer is under a tree, roof, awning, or umbrella.",
    "long_sleeves": "Long sleeves or a shirt covers the arms and shoulders.",
    "other": "Anything else, or unclear."
  }
}
```

`score` (from the file, key `red_meat_portion`):
```json
"red_meat_portion": {
  "type": "score",
  "instructions": "How large is the red meat portion in view compared with the plate?",
  "criteria": [
    "No red meat visible.",
    "A small side portion of red meat.",
    "About a quarter to a half of the plate, or one large piece of red meat.",
    "Most of the plate, or a whole large cut of red meat."
  ]
}
```

### Question design notes

- Every question is scored **on its own**; questions cannot see each other (02, section 8). Combining them is the backend's job, as the policy below does.
- Each `choice` uses an `other` option, not `none_of_the_above` (02, section 8).
- The instructions say "the wearer" because the frame is point-of-view. The `input` text block says so too.
- Glasses frames may show text on packaging or signs. The API doc warns that user-supplied text can sway answers (02, section 8). **Not yet tested** here.
- Count check: 26 questions, inside the 20–40 target. Adding more costs little in tokens (02 doc: shared input is billed once), but each question must be labelled and tested before use.

## 3. Nudge policy (all thresholds are PROPOSALS, UNVERIFIED)

Thresholds are starting values. Tune them on a labelled set of our own frames (section 4) before the demo. Google gives no per-domain calibration guidance (02, section 8).

### 3.1 Per-frame pipeline

1. **Skip the frame** if the call fails, times out, or returns a 400 `safety` error. Do not nudge. Do not treat it as a risk signal.
2. **Veto checks** (any of these → log the frame, no spoken nudge):
   - `image_quality_ok.noul` < 0.70
   - `child_visible.noul` ≥ 0.50 (no nudge that could reach or target a child; see 03, "child-directed")
3. **Trigger checks.** A category fires only if its trigger passes its threshold *and* its veto (if any) does not apply. Triggers are listed in section 3.2.
4. **Pick one category.** If several fire, speak only the highest-priority one (section 3.3).
5. **Confirm across frames.** The same category must fire in **2 of the last 3 frames** (about 4–6 s at one frame every 2 s) before anything is spoken. This reduces one-off false positives. (Proposal.)
6. **Cooldown check** (section 3.4). If it passes, speak the nudge text (section 3.5).

### 3.2 Triggers and thresholds

| Category | Trigger (all must hold) | Veto | Nudge uses |
| --- | --- | --- | --- |
| Tobacco, wearer (priority 1) | `cigarette_visible.noul` ≥ 0.80 **or** `vape_visible.noul` ≥ 0.80 | — | Factor 1 nudge |
| Passive smoke (priority 2) | `smoke_nearby.noul` ≥ 0.80 | — | Factor 2 nudge |
| Sunbed (priority 3) | `sunbed_visible.noul` ≥ 0.85 | — | Factor 3 nudge |
| Processed meat (priority 4) | `processed_meat_being_eaten.noul` ≥ 0.70 **or** (`processed_meat_visible.noul` ≥ 0.85 **and** `main_meat_type` top = `processed_meat` with probability ≥ 0.60) | — | Factor 4 nudge |
| Alcohol (priority 5) | `alcohol_being_drunk.noul` ≥ 0.70 **or** (`alcohol_visible.noul` ≥ 0.85) | `alcohol_nonalcoholic_label.noul` ≥ 0.50 | Factor 5 nudge |
| Strong sun (priority 6) | (`sun_exposed_skin.noul` ≥ 0.80 **or** `sunburn_visible.noul` ≥ 0.80) and `wearer_outdoors.noul` ≥ 0.50 | `sun_protection_used` top is `hat_or_cap`, `shade_or_umbrella` or `long_sleeves` with probability ≥ 0.60 | Factor 6 nudge |
| Charred food (priority 7) | `charred_food.noul` ≥ 0.80 and `open_flame_cooking.noul` ≥ 0.50 | — | Factor 7 nudge |
| Red meat (priority 8) | `red_meat_visible.noul` ≥ 0.85 **and** P(level 2) + P(level 3) of `red_meat_portion` ≥ 0.50 | `main_meat_type` top = `processed_meat` (let the processed-meat trigger decide) | Factor 8 nudge |
| Hot drink (off by default) | Logged only. Never spoken until tested on frames. Reason: temperature is not visible (02, section 9). | — | — |
| Sugary drink (off by default) | Logged only. | — | — |

Notes on the table:
- Sun veto: "protection seen" must be strong to suppress the nudge. We cannot see SPF or sunscreen, so this is a rough proxy.
- Sunbed thresholds are high because nail UV lamps and phone lights look similar (see the `sunbed_visible` criteria).
- Red meat only fires at a larger portion (score level 2 or 3), because the evidence is Group 2A and a small side portion should not trigger a nudge.

### 3.3 Priority and single-nudge rule

- Only **one** spoken nudge at a time. A new nudge waits until the current one has finished playing.
- If several categories pass in the same confirmed window, speak the highest priority (1 is highest), as in the table.
- Categories with no spoken nudge (hot drink, sugary drink) are logged only.

### 3.4 Cooldowns (proposal)

| Rule | Value | Why |
| --- | --- | --- |
| Global gap between any two spoken nudges | 3 min | Avoid nagging |
| Same category | 30 min | Repeat only if the behaviour continues |
| Maximum spoken nudges per hour | 6 | Keeps the coach useful, not constant |
| After the wearer stops the nudge or dismisses it | 60 min for that category | Respect the choice |
| After a `child_visible` veto | Pause all spoken nudges for 60 s | A child may still be near |

### 3.5 Nudge wording (from 03; one line each)

Each nudge is one short sentence, a general-information statement, with no shaming and no command.

| Category | Nudge text (proposal) |
| --- | --- |
| Tobacco, wearer | "Smoking causes many cancers. Stopping at any age lowers your risk." |
| Passive smoke | "Smoke from others also raises your risk. Step away from it when you can." |
| Sunbed | "Sunbeds raise your skin-cancer risk. Skip them, and use shade instead." |
| Processed meat | "Bacon, ham and sausages are linked to bowel cancer. Choose them less often." |
| Alcohol | "Alcohol is a known cause of several cancers. Having less, or none, lowers your risk." |
| Strong sun | "Strong sun on bare skin raises skin-cancer risk. Try shade, a hat or sunscreen." |
| Charred food | "Avoid burning food. Cook gently and skip the blackened bits." |
| Red meat | "Red meat is linked to bowel cancer. Limit it and fill half your plate with vegetables." |

Sources for the underlying claims (URLs checked 2026-11-14; details in 03):
- Tobacco: smoking is Group 1 for many cancer sites, https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547. "Stopping at any age lowers your risk": https://cdc.gov/tobacco/about/benefits-of-quitting.html (search snippet).
- Passive smoke: passive smoking is Group 1 (lung), https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547.
- Sunbed: tanning devices are Group 1 (melanoma), https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547; IARC page, https://www.iarc.who.int/news-events/sunbeds-and-uv-radiation/.
- Processed meat: Group 1, colorectal (bowel) cancer, https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354.
- Alcohol: Group 1, https://pmc.ncbi.nlm.nih.gov/articles/PMC10216822. "Several cancers": **[source needed]**.
- Strong sun: solar radiation is Group 1 (skin melanoma), https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547.
- Charred food: PAH and HCA form when grilling and frying, https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354. The advice itself is our inference and **UNVERIFIED** as official advice.
- Red meat: colorectal link, https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354. "Fill half your plate with vegetables": **[source needed]**, and our inference, **UNVERIFIED** as official advice.
- Hot drinks: not nudged. Oesophagus and the 65 °C threshold: https://www.paho.org/es/node/11069.

### 3.6 Wording rules

- No shaming, guilt, fear or blame. Use neutral, factual language.
- Never comment on body weight, body shape, or appearance.
- Never speak about a child, or to a parent about a child. The `child_visible` veto applies.
- Never judge another person's food or habits out loud. Passive-smoke wording speaks to the wearer, not to the smoker.
- No diagnosis, no personal risk percentage, no dose claims. Stay with "linked to" or "raises your risk" (03, "not supported").
- Add a one-time disclaimer on first use, not in every nudge: "General health information, not medical advice."
- The spoken text comes from these fixed templates. The Decisions API cannot write text (02, section 9). Using DiffusionGemma for text is a separate choice, outside this file.

### 3.7 What the policy does not do

- It does not keep or send frames beyond the single API call (privacy; to decide in the product spec).
- It does not identify people.
- It does not nudge about hot drinks or sugary drinks until tested.

## 4. Validation plan before the demo (proposal)

1. Record about 100 POV frames (phone camera or recorded POV video), covering food, drinks, smoking, sun and sunbeds. Include negatives (nail lamps, pens, grilled vegetables, shade).
2. Label each frame by hand for each trigger category, with two labellers. Mark disagreements.
3. Send the frames to the API with the request file. Record `noul`, `choice`, `score`, and `usage.total_input_tokens` (for cost and token count, see 02, section 10).
4. For each category, check precision and recall at the thresholds in section 3.2. Adjust thresholds, not the wording.
5. Repeat at `resolution` `low` and `medium`. Keep the cheaper one if accuracy holds (02, section 10, item 5).
6. Record latency from phone to backend to API and back (02, section 6). Google's 150–250 ms figure is a benchmark, not our number.

## 5. Open items (UNVERIFIED)

- Whether the 26 questions are accurate on real POV frames (unknown until section 4 is done).
- Tokens per frame at each `resolution` (02, section 10, item 1).
- Whether the free tier limits in `rate-limits.md` match the AI Studio dashboard for our project (02, section 10, item 6).
- Whether the live curl example in 02 works with a real key. It has not been run.

## Sources

- https://aistudio.google.com/docs/decisions-api.md (question format, criteria, limits, calibration, safety error)
- https://aistudio.google.com/docs/models/gemini-decision-1.md (model page)
- https://aistudio.google.com/docs/pricing.md (pricing)
- https://aistudio.google.com/docs/rate-limits.md (rate limits)
- https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/ (launch claims, latency)
- https://cancer-code-europe.iarc.who.int/ (ECAC5 recommendations, used in 03)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10216822 (Table 1, IARC groups; used in 03)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547 (Table 1, IARC groups; used in 03)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354 (processed and red meat groups; used in 03)
- https://www.paho.org/es/node/11069 (very hot drinks, 65 °C; used in 03)
- https://www.iarc.who.int/news-events/sunbeds-and-uv-radiation/ (sunbeds; used in 03)
- https://cdc.gov/tobacco/about/benefits-of-quitting.html (search snippet; used in 04 nudges)
- Companion files: `02-decisions-api.md`, `03-risk-evidence.md`, `04-question-set.request.json` (same folder)
