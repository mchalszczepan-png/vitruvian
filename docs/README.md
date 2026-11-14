# Vitruvian – Junction 2026 docs

Main track: AstraZeneca, equal and effective cancer care in Finland. We are exploring two **separate** directions; only one will be built. One project can enter several tracks at once, so we pick side tracks (and free sponsor tools) that fit the chosen direction. Sponsor tools go in [sponsors.md](sponsors.md).

## Direction A – Law and care pathway

Find where Finnish law and how it is applied slow down cancer care (detection → referral → diagnosis → treatment start), and build an AI tool that helps counties work with the law better.

- Track brief: [tracks/astrazeneca-cancer-care.md](tracks/astrazeneca-cancer-care.md)
- Legal research: [research/law/](research/law/)

## Direction B – Smart-glasses cancer-risk coach

Meta smart glasses + Gemini API (and/or Gemma) image analysis spot potentially carcinogenic foods and behaviours (e.g. processed meat, smoking, sunburn risk) to lower cancer risk.

- Build: native Android app in Kotlin (Jetpack Compose). Glasses are emulated (phone camera or recorded POV video), no real Meta hardware. API key stays on a small backend, never in the APK.
- Model plan (draft):
  - Gemini Decisions API (`gemini-decision-1`, launched 2026-11-11, `v1beta`, $0.10/1M input, no output tokens): one call asks up to 1,000 yes/no, choice or score questions about a glasses frame ("processed meat?", "smoking?", "strong sun, no shade?") and returns calibrated probabilities. No text output. Skill: `.claude/skills/gemini-api-dev` (section "Decisions API").
  - DiffusionGemma (open, Apache 2.0, released 2026-06-10, built on Gemma 4 26B-A4B, text + image input (per HF card google/diffusiongemma-26B-A4B-it), up to ~4x faster but less accurate): fast short spoken tips. Counts as Gemma for the Gemma track. Host on Modal (1x H100, vLLM; not on Featherless or Verda inference). Fallback: gemma-4-26b-a4b-it via Gemini API. See research/glasses/05-diffusiongemma.md.
- Main track: AstraZeneca (note: this is prevention, which is strategy Goal 2; the brief requires at least one Goal 3 indicator)
- Side tracks it would also enter:
  - [tracks/google-deepmind-gemini.md](tracks/google-deepmind-gemini.md)
  - [tracks/google-deepmind-gemma.md](tracks/google-deepmind-gemma.md)
