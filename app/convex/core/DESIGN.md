# Aid pipeline design (architect synthesis, 2026-11-14)

Research prototype. Not a medical device. Not for clinical use.

Full candidates: candidate A (pure core + one ModelPort) and candidate B (persisted evidence, data-driven Rules), written in the session scratchpad. This file is the agreed contract that implementation follows.

## Problem

`aid:get` and `fill:fromNote` spread one pipeline over `aid.ts`, `fill.ts`, `lib/*`, `model/*`. Facts are kept in many places: two OpenAI clients and two JSON parsers, the provider mode branched in three files, risk computed in both actions, the CA-125 table in three files, Rule ids hand-listed in four. A cold live run makes 2V+1 model calls with no timeouts, against a 15 s client race that silently falls back to the mock. `fill:fromNote` trusts the client's `matched`.

Fixed constraints:
- `src/data/types.ts` and the `api.ts` signatures stay.
- The `ml/CONTRACT.md` fill call stays (`model/contract.ts`, `prompt.ts`, `schemas/*` unchanged).
- The model sets only the Risk gradient.
- The tests stay green.
- Code freeze is 02:30.

## Usage (caller's view)

```ts
// aid.ts: a shell
export const get = action({ args: { patientId: v.string() }, handler: async (ctx, { patientId }) => {
  const input = await ctx.runQuery(internal.data.aidInputs, { patientId });     // patient + visits, rule rows, severities
  return runAid({ ...input, model: makePort(process.env, convexStore(ctx)) });
}});

// fill.ts: a shell. `matched` stays in args for api.ts compatibility and is ignored.
return fillReferral({ ...input, cancer, model: makePort(process.env, convexStore(ctx)) });

// test: whole pipeline, no Convex, no network
const aid = await runAid({ patient: syn003, book: buildRuleBook(ref), model: makePort({ MODEL_PROVIDER: 'stub' }) });
```

Demo prep: `npx convex run aid:prewarm` fills the cache for every patient. After that, `aid:get` makes zero model calls.

## Shape

The base is candidate A, with three pieces taken from B.

- **Rule knowledge is data.** `seed/rules.json` rows gain four optional fields:
  - `limits` (age, sex, ever smoked);
  - `numeric` (FIT and CA-125 bands);
  - `scan` (`asks` | `settles`);
  - `cue` (snippet regex).

  These fields live in `docs/build/rule-extras.json` (from B) and are merged by `scripts/build-seed.mjs`, so a rebuild from `docs/build/rules.md` never wipes them. `buildRuleBook(ref)` derives the cancer list, catalogue counts, `allowed(who)`, numeric bands, scan settlers, `publicRule` (no void hack) and severity by cancer. No Rule id or cancer list is hand-written outside the seed, tests and the stub's own check table.
- **Facts are declared once.** `FACT_SPEC` in `core/facts.ts` is the one list. The `Facts` type, `emptyFacts`, `coerceFacts`, `mergeFacts` and the extraction key list all derive from it.
- **One seam.** `ModelPort { name; extractFacts(note); decide({facts, who, questions}); risk(input); fill(input) }`, with domain types only.
  - `makePort(env, store?)` is the only env reader.
  - `stub` gives `stubPort()`. `gemma` and `modal-lora` give the same `llmPort(cfg)`, wrapped in `withCache(port, store)`.
  - Optional `GEMMA_FALLBACK_*` (all three or none) adds a second chat endpoint: `chatCompletion` tries the primary once, and on any failure logs one line and calls the fallback. The LoRA call has no fallback, so its 25 s single attempt is unchanged. The cache key uses `GEMMA_MODEL` only.
  - `modal-lora` reads `LORA_BASE_URL`, `LORA_API_KEY`, `LORA_MODEL` (`loraCfg`, makePort) and uses them for the fill, and for the risk when `LORA_TRIAGE_MODEL` is set (`vitruvian-triage`, same endpoint and key): 25 s, no retry, redirects not followed. The triage risk falls back to the prompted risk on any failure (`servedBy: 'gemma'`, one log line, not cached). The triage model id is in the risk cache key only. Its cancer guess is a note (`riskModelPointer`); the Rules pick the cancer. Research prototype: 92.3% cancer-type accuracy on 78 synthetic held-out notes, not risk accuracy. On any failure the fill falls back to the `gemma` endpoint (`GEMMA_*`), logs one line, and returns `servedBy: 'gemma'`. `withCache` does not store a fallback fill under the LoRA key. The `techUsed` fill step is static `modal-lora` (the aid result runs no fill, and `FieldValues` has no tech field).
  - `llmPort` owns the one chat client (`model/openai.ts` plus a 20 s timeout and one retry on network, 429 or 5xx), the one JSON parser, the Gemini Decisions POST and the unchanged contract fill.
- **Numeric Rules are decided in code.** COLO-01 (FIT) and OVAR-06 (CA-125) are computed from the bands in every mode, so they are exact and free.
- **The cache** is the existing `decisionCache` key/value table with batched `getMany`/`setMany`. It caches:
  - `extractFacts` by `(port, model id, sha(note))`;
  - `decide` by `(rule, question, sha(facts))`;
  - `risk` by `sha(input)`, with the triage model id when there is one (`risk:v2:`).

  Fill is never cached. All calls run at temperature 0, so replaying from the cache is correct. This gives B's "do model work once per note" without three new tables.
- **The pure core.** `core/aid.ts` `analyze()` is the one place the pipeline order is written:
  1. Extract facts for all visits in parallel (cap 6) and build cumulative facts.
  2. Call `decide` once per distinct cumulative-facts set.
  3. Decide numeric Rules in code.
  4. Run `overTimeMatch`.
  5. `pickCancer`, then `repeatFlag`, then `risk`, which is clamped once.
  6. Gates and scan from the book. Published risk: one `decide` call on the last cumulative facts for the suspected cancer's PPV evidence rows (`ppvRisk.ts`), skipped when no Rule matched; a failure logs one line and leaves it absent. It is UK primary-care aggregate evidence for the GP, not a personal probability, and does not change the risk gradient.
  7. Severity.

  `because` is the decision's fact sentence if the port gave one, otherwise the Rule text plus the backing visit's snippet (SPEC: "why it matched, in the patient's facts").
- **Fill is server-owned.** `fillReferral` calls `analyze` itself (cache hits when warm) and ignores the client's `matched`. When the GP picks a cancer other than the suspected one, `matchedRuleIds` keeps only that cancer's Rules and `riskGradientAiEstimate` is left out.
- **Failures are loud.** A failed model call throws with the HTTP status only. There is no silent risk 0 and no silent empty Facts. The `api.ts` race for `getAid` and fill goes from 15 s to 30 s (one constant in the backend-owned switch).
- **Prewarm (from B):** `aid:prewarm` is an internalAction that runs `runAid` for every patient, sequentially, and logs only the status.

## Synthesis decision

The base is A. It has the smallest public surface (`runAid`, `fillReferral`, `buildRuleBook`, `makePort` and the `ModelPort` type) and no schema migrations, and cheap agents can build it before the freeze.

Taken from B:
- the extras file outside `rules.json`, so rebuilds stay safe;
- precompute as an explicit command;
- a server-owned Aid for fill.

B's per-stage tables are replaced by A's cache decorator: the same "once per note" behaviour with no new tables.

Rejected from B:
- The `Cond` predicate DSL: about an hour of interpreter work for a test double. The stub keeps its check table, guarded by a coverage test.
- The `aidResults` first-writer-wins row: a cached `risk` gives the same determinism.
- `labTests` as a table: `numeric` bands on the Rule are enough.

## Tradeoffs accepted

- **Rule extras:** we accept four optional extra fields in a second docs file in exchange for deleting four hand-synced lists.
- **Providers:** we accept that the three providers are two implementations (`gemma` and `modal-lora` differ only in env) in exchange for one code path.
- **Errors:** we accept throwing on a bad model reply. A visible fallback is better than a wrong risk shown as real.
- **Fill cost:** we accept that fill re-runs `analyze`, which costs cache reads only when warm, in exchange for no client trust and one risk path.
- **Cold runs:** we accept that a cold live run is still three hops (extract, decide, risk). Prewarm makes the demo warm.
- **Not done now:** we don't derive `referralSchema.ts` from the JSON schemas yet (`priorCancer` drift), and we don't strip the safety net from the fill input, because that is the ML thread's call input.

## Alternatives considered

- **Helpers only, keep `ModelProvider`:** the smallest edit, but mode branching and pipeline order stay in three files. The interface stays wide.
- **Candidate B in full:** three tables and a DSL. It is deeper, but about two hours more work than the time we have.
- **Async job plus polling:** this changes the `api.ts` signatures and the UI contract.

## Open questions and risks

- Rule extras are a design choice next to NICE NG12. `docs/build/rules.md` stays the medical source; the extras restate its age, sex and threshold text as data and must cite the same lines.
- The 30 s client race: is the UI thread OK with it?

## Build order (subtract first)

1. **Baseline and subtract.** Take a golden stub-mode snapshot of `aid:get` and `fill:fromNote` for all seed patients. Delete dead exports, `chatJson` and `parseJsonObject`. The tests stay green.
2. **Scaffold.** Write `core/facts.ts`, `core/port.ts` and `core/rulebook.ts` types, plus `rule-extras.json` and the build-seed merge, with an equivalence test against the old `ruleAllowed` and gate tables. Then delete `model/limits.ts`.
3. **Ports.** Write `core/ports/stub.ts` (moved from `model/stub.ts`), `core/ports/llm.ts`, `core/cached.ts` and `core/ports/index.ts`, tested with fetch mocks.
4. **Core and shells.** Write `core/aid.ts` and `core/fill.ts`. Turn `aid.ts` and `fill.ts` into shells, and add `data.aidInputs`, `cache.getMany/setMany`, `aid:prewarm` and the `api.ts` timeout. The golden snapshot must match, except for the new `because` text.
5. **Live smoke.** Run `MODEL_PROVIDER=gemma` for the four demo patients, cold then warm, and time each hop.
