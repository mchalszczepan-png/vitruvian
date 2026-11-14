# 04 — Test media for the glasses emulator (hackathon)

Goal: first-person clips and images to feed the emulated glasses camera, so the Gemini Decisions API can flag cancer-risk behaviour (processed meat, smoking, alcohol, sunbathing without sunscreen, very hot drinks) plus negative cases.

Status: sweep done by one research agent. Licence text for several datasets could not be confirmed from official pages. Treat every licence line below as "check before use".

## 1. Egocentric datasets

| Dataset | Licence (as found) | Hackathon / demo use | Size | Access steps and wait | Source |
|---|---|---|---|---|---|
| Ego4D | Data under its own licence agreement (not MIT; MIT covers code only). Third-party pages say non-commercial; not verified in the signed text. | Unclear for a commercial demo. Research-oriented. | Full primary ~7.1 TB; entire 30+ TB; annotations ~2 GB; narrations-only subset ~350 MB; benchmark clips ~1 TB | Accept licence at lab22.ai, credentials by email, ~48 h wait, expire after 14 days, download locally. Too big for a hackathon; use a subset or skip. | https://ego4d-data.org/docs/start-here/ |
| EPIC-KITCHENS-100 | Official page did not show a licence. VISOR (extension) is CC BY-NC 4.0 with commercial use by negotiation. | Probably non-commercial only. Verify before a public demo. | Not confirmed | Not confirmed; site redirects to EPIC-KITCHENS 2026 page | https://epic-kitchens.github.io/site , https://epic-kitchens.github.io/VISOR/site |
| EgoExo4D | Requires licence acceptance; commercial terms conflict between sources. | Not verified | Large (multi-TB class) | Licence via https://ego-exo4d-data.org/ ; wait not confirmed | https://ego-exo4d-data.org/ |
| Food-101 | Official page states no licence. Images from Foodspotting, not owned by ETH. Treat as research-only. | Not clean for a demo. Use only for internal model checks, not shipped media. | food-101.tar.gz ~5 GB (5.06 GB parquet on HF) | Direct download, no form seen | https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/ |

Recommendation: do not use these for the demo. They are large, slow to get, or licence-unclear. Ego4D and EPIC are useful only as background reading.

## 2. Free-licence stock POV and action clips

Licence for all Pexels links: Pexels License (free to use, attribution not required, identifiable people may not be shown in a bad light, no implied endorsement, no resale unaltered). Checked on https://www.pexels.com/license/ . Each clip was taken from search hits. Clips were not opened one by one, so confirm each is first-person before use.

| # | Risk | Pexels link | Notes |
|---|---|---|---|
| 1 | Eating (food) | https://www.pexels.com/video/a-woman-eating-her-meal-while-looking-at-the-camera-6554648/ | Eating to camera; not POV |
| 2 | Eating (junk food) | https://www.pexels.com/video/a-woman-eating-junk-foods-6689958/ | Junk food, indoors |
| 3 | Eating (meal) | https://www.pexels.com/video/a-person-is-eating-a-plate-of-food-28514871/ | Plate in front of person |
| 4 | Eating (Indian meal) | https://www.pexels.com/video/woman-eating-food-9346259/ | Close-up at table |
| 5 | Smoking | https://www.pexels.com/video/person-smoking-cigarette-4777887/ | Hand holding cigarette, close-up |
| 6 | Smoking | https://www.pexels.com/video/a-man-smoking-a-cigarette-4310186/ | Close-up hand, blurred background |
| 7 | Smoking | https://www.pexels.com/video/a-person-smoking-a-cigarette-7230301/ | Hand with cigarette, dim room |
| 8 | Smoking | https://www.pexels.com/video/a-person-smoking-cigarette-10273281/ | Indoors |
| 9 | Alcohol (wine) | https://www.pexels.com/photo/low-angle-shot-of-a-person-holding-a-glass-of-wine-8472895/ | Photo, hand holding wine glass |
| 10 | Alcohol (wine) | https://www.pexels.com/photo/a-close-up-shot-of-a-person-pouring-wine-in-a-glass-13293120/ | Photo, pouring |
| 11 | Alcohol (beer) | https://www.pexels.com/video/hand-drink-beer-mockup-4068401/ | Video, hand holds beer bottle |
| 12 | Alcohol (beer) | https://www.pexels.com/photo/beer-bottle-in-hand-5054683/ | Photo, hand with bottle |
| 13 | Sunbathing, no sunscreen (risk) | https://www.pexels.com/photo/woman-applying-sunscreen-on-beach-8157159/ | Note: she applies sunscreen = negative case |
| 14 | Sunbathing (negative, sunscreen on) | https://www.pexels.com/photo/woman-applying-sunscreen-on-legs-8156014/ | Sunscreen applied |
| 15 | Hot drink | https://www.pexels.com/video/close-up-video-of-a-cup-6278951/ | Hand picks up steaming cup |
| 16 | Hot drink | https://www.pexels.com/video/a-hot-coffee-on-a-cup-6890261/ | Steaming cup close-up |

Gaps: no verified Pexels POV clip of sunbathing without sunscreen was found. No verified Pexels POV of smoking was found either. Expect to film these ourselves.

Other sources (licence not verified, mostly watermark-free per site text): Mixkit (https://mixkit.co/free-stock-video/smoking/ , https://mixkit.co/free-stock-video/eating/), Coverr (https://coverr.co/stock-video-footage/smoking). Mixkit licence page did not load the terms.

Wikimedia Commons: search hits were mostly stills with CC BY / CC BY-SA labels (e.g. https://commons.wikimedia.org/wiki/File:Vegan_meal_(3).jpg , CC BY 2.0). Not first-person. Only use as fallback for food-only stills, with attribution.

## 3. Film our own clips: faster?

Yes. Search results do not give many first-person clips for smoking, alcohol, or sunbathing without sunscreen. Licence checks take longer than filming. Shoot 10–15 short POV clips (5–10 s each) on a phone held at chest height, like the glasses view.

Shot list (expected Decisions answer = what we expect; confirm with the real API):

| # | Scene | Risk | Expected answer |
|---|---|---|---|
| 1 | Hand picks up sausage or bacon at a table | Processed meat | Flag: processed meat |
| 2 | Plate of hot dog or ham sandwich, eating | Processed meat | Flag |
| 3 | Lit cigarette held in hand, lifted to mouth | Smoking | Flag: smoking |
| 4 | Vape or cigarette held near face, indoors | Smoking | Flag |
| 5 | Pint or glass of beer, raised to mouth | Alcohol | Flag: alcohol |
| 6 | Wine glass poured and held | Alcohol | Flag |
| 7 | Sunbathing on lounger, bare skin, no sunscreen visible | Sun exposure | Flag: no sunscreen |
| 8 | Hand squeezing sunscreen onto arm | Sun (negative) | No flag |
| 9 | Tea or coffee cup, steam visible, held to mouth | Very hot drink | Flag: very hot drink (if model is set for temperature cues) |
| 10 | Water glass held at table | Hydration (negative) | No flag |
| 11 | Salad bowl, fork in hand | Diet (negative) | No flag |
| 12 | Fruit bowl, banana or apple | Diet (negative) | No flag |
| 13 | Sitting in shade, under umbrella, bare arm | Sun (negative) | No flag |
| 14 | Empty room, hands on keyboard | Baseline (negative) | No flag |
| 15 | Smoke-free cigarette pack, unopened, on table | Edge case | Decide: flag or not (note for demo) |

Filming tips:
- Use the same orientation and framing as the emulator (landscape or portrait, fixed).
- Film 3–5 s clips; shorter files keep upload time low.
- Keep 3 negative clips and 3 positive clips at minimum for the demo.
- Name files by row number, e.g. `01-processed-meat.mp4`.

Remaining risk: Decisions behaviour is unverified in this sweep. Run every clip through the API once before the demo and adjust the expected column to what it really returns.

## Next steps (for the team)
1. Film rows 1–14 this week (one phone, one afternoon).
2. Run each clip through the Decisions API; record the real answer.
3. Use Pexels clips 5, 6, 11, 16 as backup for smoking, alcohol, and hot drinks only if our footage fails.
4. Skip Ego4D, EPIC, EgoExo4D, and Food-101 for the demo (licence or size).
