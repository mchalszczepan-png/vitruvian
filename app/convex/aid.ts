// aid:get {patientId}: the Aid pipeline (docs/SPEC.md "Aid pipeline"). A shell: read the inputs, pick the port, run core/aid.ts.
// aid:prewarm fills the model cache for every patient, so aid:get then makes zero model calls (demo prep: `npx convex run aid:prewarm`).
// It also warms fill:fromNote for each patient with a suspected cancer (noRuleMatched false), so the Referral fill is cache-warm too.
// Security: no auth yet (prototype with made-up patients). Anyone with the deployment URL can call it.
// Research prototype. Not a medical device. Not for clinical use.
import { v } from 'convex/values';
import { action, internalAction } from './_generated/server';
import { internal } from './_generated/api';
import type { AidResult } from '../src/data/types';
import { mapLimit, runAid } from './core/aid';
import { fillReferral } from './core/fill';
import { makePort } from './core/ports';
import { buildRuleBook } from './core/rulebook';
import { convexStore } from './lib/store';
import { aidResultV } from './validators';

export const get = action({
  args: { patientId: v.string() },
  returns: aidResultV,
  handler: async (ctx, { patientId }): Promise<AidResult> => {
    const { patient, rules, severities } = await ctx.runQuery(internal.data.aidInputs, { patientId });
    return runAid({ patient, book: buildRuleBook({ rules, severities }), model: makePort(process.env, convexStore(ctx)) });
  },
});

/** Fill calls in flight at once while prewarming. Each is a slow model call (~1 min on Gemma). */
const FILL_CONCURRENCY = 4;

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
