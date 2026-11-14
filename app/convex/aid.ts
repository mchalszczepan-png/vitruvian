// aid:get {patientId}: the Aid pipeline (docs/SPEC.md "Aid pipeline"). A shell: read the inputs, pick the port, run core/aid.ts.
// aid:prewarm fills the model cache for every patient, so aid:get then makes zero model calls (demo prep: `npx convex run aid:prewarm`).
// It also warms fill:fromNote for each patient with a suspected cancer (noRuleMatched false), so the Referral fill is cache-warm too.
// With MODEL_PROVIDER=modal-lora, prewarm first schedules aid:warmLora: the Modal LoRA scales to zero (~13 min cold start), and
// the fill falls back to gemma while it is cold. Fallback fills are not cached, so run prewarm again once the LoRA is warm.
// Security: no auth yet (prototype with made-up patients). Anyone with the deployment URL can call it.
// Research prototype. Not a medical device. Not for clinical use.
import { v } from 'convex/values';
import { action, internalAction, type ActionCtx } from './_generated/server';
import { internal } from './_generated/api';
import type { AidResult } from '../src/data/types';
import { mapLimit, runAid, type RepeatOverride } from './core/aid';
import { fillReferral } from './core/fill';
import { loraCfg, makePort } from './core/ports';
import { buildRuleBook } from './core/rulebook';
import { embedderFrom } from './model/embed';
import { convexStore } from './lib/store';
import { vectorRepeat } from './lib/repeatVector';
import { aidResultV } from './validators';

export const get = action({
  args: { patientId: v.string() },
  returns: aidResultV,
  handler: async (ctx, { patientId }): Promise<AidResult> => {
    const { patient, rules, severities } = await ctx.runQuery(internal.data.aidInputs, { patientId });
    const repeat = await vectorRepeatOrUndefined(ctx, patientId);
    return runAid({ patient, book: buildRuleBook({ rules, severities }), model: makePort(process.env, convexStore(ctx)), repeat });
  },
});

/**
 * Repeat from vector search over the stored embeddings: techUsed 'embeddinggemma' when EmbeddingGemma made the query vector,
 * else 'convex-vector' (Gemini or no embedder). Undefined when there is no query vector or the embedder or vector search
 * throws: core/aid.ts then counts the symptom field ('symptom-match'). Logs the error message only.
 */
async function vectorRepeatOrUndefined(ctx: ActionCtx, patientId: string): Promise<RepeatOverride | undefined> {
  try {
    const embedder = embedderFrom(process.env);
    const docs = await ctx.runQuery(internal.data.visitDocs, { patientId });
    const vector = await vectorRepeat(ctx, patientId, docs, embedder);
    const source = embedder?.provider === 'embeddinggemma' ? 'embeddinggemma' : 'convex-vector';
    return vector ? { flag: vector.flag, source } : undefined;
  } catch (e) {
    console.log(`aid:get ${patientId} vector Repeat failed, using the symptom field: ${e instanceof Error ? e.message : 'error'}`);
    return undefined;
  }
}

/** Fill calls in flight at once while prewarming. Each is a slow model call (~1 min on Gemma). */
const FILL_CONCURRENCY = 4;
/** Under the 10 min action limit. A cold LoRA start takes ~13 min, so this may end with ok false; the next call then warms it. */
const WARM_TIMEOUT_MS = 9 * 60 * 1000;

/**
 * Wakes the Modal LoRA: GET {LORA_BASE_URL}/models with the Bearer key, redirects followed, one attempt. Logs status and ms only.
 * status is null on a network error or the timeout.
 */
export const warmLora = internalAction({
  args: {},
  returns: v.object({ ok: v.boolean(), status: v.union(v.number(), v.null()), ms: v.number() }),
  handler: async () => {
    const cfg = loraCfg(process.env);
    const started = Date.now();
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), WARM_TIMEOUT_MS);
    let status: number | null = null;
    let ok = false;
    try {
      const res = await fetch(`${cfg.baseUrl.replace(/\/+$/, '')}/models`, {
        headers: { authorization: `Bearer ${cfg.apiKey}` },
        signal: ctl.signal,
      });
      status = res.status;
      ok = res.ok;
      await res.text(); // drain the small body so the connection closes
    } catch {
      status = null; // network error or the timeout: no reason text, it could carry a URL or key
    } finally {
      clearTimeout(timer);
    }
    const ms = Date.now() - started;
    console.log(`warmLora: status ${status ?? 'none'} in ${ms} ms`);
    return { ok, status, ms };
  },
});

/**
 * Runs the Aid for every patient, one after another, then warms the Referral fill for each patient whose Aid matched a Rule
 * (fill is for the suspected cancer). Logs ids and status only, never notes or keys.
 */
export const prewarm = internalAction({
  args: {},
  returns: v.object({ done: v.number(), filled: v.number(), failed: v.array(v.string()) }),
  handler: async (ctx) => {
    const ids = await ctx.runQuery(internal.data.patientIds, {});
    const model = makePort(process.env, convexStore(ctx));
    // Start the LoRA now, in its own action, so the model calls below do not wait on it. Only the fill uses it.
    if (model.name === 'modal-lora') await ctx.scheduler.runAfter(0, internal.aid.warmLora, {});
    const failed: string[] = [];
    const toFill: { patientId: string; cancer: AidResult['suspectedCancer'] }[] = [];
    let done = 0;
    for (const patientId of ids) {
      try {
        const { patient, rules, severities } = await ctx.runQuery(internal.data.aidInputs, { patientId });
        const aid = await runAid({ patient, book: buildRuleBook({ rules, severities }), model });
        done++;
        if (!aid.noRuleMatched) toFill.push({ patientId, cancer: aid.suspectedCancer });
      } catch (e) {
        failed.push(patientId);
        console.log(`prewarm ${patientId} failed: ${e instanceof Error ? e.message : 'error'}`);
      }
    }
    let filled = 0;
    await mapLimit(toFill, FILL_CONCURRENCY, async ({ patientId, cancer }) => {
      try {
        const { patient, rules, severities } = await ctx.runQuery(internal.data.aidInputs, { patientId });
        await fillReferral({ patient, cancer, book: buildRuleBook({ rules, severities }), model });
        filled++;
      } catch (e) {
        failed.push(patientId);
        console.log(`prewarm fill ${patientId} failed: ${e instanceof Error ? e.message : 'error'}`);
      }
    });
    console.log(`prewarm: ${done} of ${ids.length} patients done, ${filled} of ${toFill.length} fills warmed`);
    return { done, filled, failed };
  },
});
