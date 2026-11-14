# Vitruvian Convex backend

Research prototype. Not a medical device. Not for clinical use. All patients are made up.

Source of truth: `docs/SPEC.md` ("Convex backend", "Aid pipeline", "Gemini Decisions API", "Testing Decisions"). Types contract: `app/src/data/types.ts`. UI seam: `app/src/data/api.ts`.

## Public Convex functions (the contract between the three work packages)

Return shapes are exactly the types in `app/src/data/types.ts`. Convex functions may import types from `../src/data/types` (type-only).

| Convex function | Kind | Mirrors in api.ts | Returns |
| --- | --- | --- | --- |
| `patients:list` | query | `getPatients()` | `Patient[]` (visits oldest first; `Visit.symptom` set) |
| `patients:get {id}` | query | `getPatient(id)` | `Patient \| null` |
| `patients:repeatVisit {id}` | query | new `getRepeatVisit(id)` | `RepeatVisitFlag \| null` (3 visits in 6 months, window configurable) |
| `templates:referral {cancer}` | query | `getReferralTemplate` | `ReferralTemplate` |
| `templates:staging {cancer}` | query | `getStagingTemplate` | `StagingTemplate` |
| `staging:demo {cancer}` | query | `getDemoStaging` | `StagingReport` |
| `staging:draft {referralId}` | query | `getStagingDraft` | `StagingReport` (story 32: prefilled from the Referral and patient) |
| `staging:save {report}` | mutation | `saveStagingReport` | `SavedStagingReport` (story 33: status from `checkStaging`, upsert by `referralId`, else `patientId` + `cancer`) |
| `staging:saved` | query | `getSavedStagingReports` | `SavedStagingReport[]` newest first |
| `county:get` | query | `getCountyGap` | `CountyGap` |
| `referrals:send {referral}` | mutation | `sendReferral` | `Referral` (upsert by `id`) |
| `referrals:list` | query | `getReferrals` | `Referral[]` newest first |
| `aid:get {patientId}` | action | `getAid` | `AidResult` |
| `fill:fromNote {patientId, cancer, matched}` | action | `fillTemplateFromNote` | `FieldValues` |
| `seed:run` | mutation | n/a | idempotent seed from `docs/build` data |

Internal functions: `internal.data.aidInputs {patientId}` (patient with visits, Rule rows, severity rows), `internal.data.patientIds`, `internal.cache.getMany {keys}` and `internal.cache.setMany {entries}` (model answer cache), `internal.aid.prewarm` (fills the cache for every patient: `npx convex run aid:prewarm`).

## Aid pipeline layout

`aid.ts` and `fill.ts` are shells. The pipeline is `core/aid.ts` (`analyze`, `runAid`) and `core/fill.ts` (`fillReferral`), pure over a Rule book (`core/rulebook.ts`, built from the seed Rules and `docs/build/rule-extras.json`) and one `ModelPort` (`core/port.ts`). `core/ports/index.ts` `makePort(env, store?)` is the only env reader. See `core/DESIGN.md`.

## Rule IDs

Convex uses the ids in `docs/build/rules.md` (`LUNG-02`, `COLO-04`, `OVAR-06`). The mock in `app/src/data/mock/rules.ts` still has older ids (`lung-haemoptysis`, `crc-fit`); the contract test maps them.

## Model provider switch

Convex env `MODEL_PROVIDER` = `stub` (deterministic, tests and offline demo) | `gemma` (prompted hosted Gemma, OpenAI-style API) | `modal-lora` (the Modal-served LoRA for the Referral fill only; facts, decisions and risk still run as `gemma`). `GEMMA_BASE_URL`, `GEMMA_API_KEY`, `GEMMA_MODEL` for `gemma` and `modal-lora`; `GEMINI_API_KEY` for the Decisions API and embeddings. `modal-lora` also needs `LORA_BASE_URL` (ends in `/v1`), `LORA_MODEL` (`vitruvian-lora`) and `LORA_API_KEY`; `makePort` throws, naming them, when one is missing. Keys live only in Convex env. Never in client code, docs or git.

`modal-lora` fill: one request to the LoRA with a 25 s timeout and no retry. A timeout, a 303 (the Modal cold start, ~13 min; redirects are not followed), a non-2xx or output the contract rejects falls back to the `gemma` fill, logs one line `fill: modal-lora failed (<reason>), fell back to gemma`, and the result says `servedBy: gemma`. A fallback fill is not cached under the LoRA key. `aid:prewarm` schedules `aid:warmLora` first (GET `/models`, 9 min limit) so the LoRA starts warm; run prewarm again once it is warm to cache LoRA fills.

### Note to Referral fields (contract)

`fill:fromNote` with `gemma` or `modal-lora` follows `ml/CONTRACT.md`. One code path, switched only by env.

- Request: `POST {GEMMA_BASE_URL}/chat/completions`, body `model` = `GEMMA_MODEL`, `temperature` 0, `max_tokens` 2048, two messages. `model/prompt.ts` is a port of `ml/prompt.py` (same text). System = prompt plus the cancer schema; user = JSON with `cancer`, `todayNote`, `earlierNotes`, `recordFacts`.
- Schemas: `app/convex/model/schemas/*.json` is a copy of `ml/schemas/*.json`. Refresh with `sh app/scripts/sync-schemas.sh`. `app/scripts/schemas.test.ts` fails if the copy drifts.
- Reply: `choices[0].message.content` is `{"fields": {...}, "evidence": {...}}`. A ```json fence is stripped. Validation uses the hand-written specs in `model/referralSchema.ts`. Invalid output gets one retry (same two messages). Fields still invalid: required gets origin `empty`, optional is left out.
- Record fields (`patientId`, `age`, `sex`, `referralDate`, `referringGpId`) come from the record, origin `record`. The model never sets them. Model values get origin `gemma`; `evidence` is the reply's evidence for that field.
- Gemma/LoRA config (prompted target): `GEMMA_BASE_URL=https://api.featherless.ai/v1`, `GEMMA_MODEL=google/gemma-4-26B-A4B-it`. Modal LoRA: `LORA_BASE_URL` (the Modal URL, ends in `/v1`), `LORA_MODEL=vitruvian-lora`, `LORA_API_KEY`; its fill falls back to the Featherless `GEMMA_*` config above.
- Tests: `model/prompt.test.ts` (golden from `python3 -I`), `model/contract.test.ts` (mocked fetch), `scripts/schemas.test.ts` (copy check).

## Client switch

`VITE_BACKEND=mock|convex` (default `mock`) and `VITE_CONVEX_URL`. If a Convex call fails, api.ts falls back to the mock (SPEC story 41).
