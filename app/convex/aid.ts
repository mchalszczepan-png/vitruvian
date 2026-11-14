// aid:get {patientId}: the Aid pipeline (docs/SPEC.md "Aid pipeline"). A shell: read the inputs, pick the port, run core/aid.ts.
// aid:prewarm fills the model cache for every patient, so aid:get then makes zero model calls (demo prep: `npx convex run aid:prewarm`).
// Security: no auth yet (prototype with made-up patients). Anyone with the deployment URL can call it.
// Research prototype. Not a medical device. Not for clinical use.
import { v } from 'convex/values';
import { action, internalAction } from './_generated/server';
import { internal } from './_generated/api';
import type { AidResult } from '../src/data/types';
import { runAid } from './core/aid';
import { makePort } from './core/ports';
import { buildRuleBook } from './core/rulebook';
import { convexStore } from './lib/store';

export const get = action({
  args: { patientId: v.string() },
  handler: async (ctx, { patientId }): Promise<AidResult> => {
    const { patient, rules, severities } = await ctx.runQuery(internal.data.aidInputs, { patientId });
    return runAid({ patient, book: buildRuleBook({ rules, severities }), model: makePort(process.env, convexStore(ctx)) });
  },
});

/** Runs the Aid for every patient, one after another. Logs ids and status only, never notes or keys. */
export const prewarm = internalAction({
  args: {},
  returns: v.object({ done: v.number(), failed: v.array(v.string()) }),
  handler: async (ctx) => {
    const ids = await ctx.runQuery(internal.data.patientIds, {});
    const model = makePort(process.env, convexStore(ctx));
    const failed: string[] = [];
    let done = 0;
    for (const patientId of ids) {
      try {
        const { patient, rules, severities } = await ctx.runQuery(internal.data.aidInputs, { patientId });
        await runAid({ patient, book: buildRuleBook({ rules, severities }), model });
        done++;
      } catch (e) {
        failed.push(patientId);
        console.log(`prewarm ${patientId} failed: ${e instanceof Error ? e.message : 'error'}`);
      }
    }
    console.log(`prewarm: ${done} of ${ids.length} patients done`);
    return { done, failed };
  },
});
