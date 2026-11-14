// fill:fromNote {patientId, cancer, matched}: fills the Referral template from the notes (docs/SPEC.md "Gemma"). A shell around core/fill.ts.
// The server owns the Aid: `matched` stays in the args for api.ts compatibility and is ignored. fillReferral runs the Aid itself.
// Security: no auth yet (prototype). Research prototype. Not a medical device. Not for clinical use.
import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import type { FieldValues } from '../src/data/types';
import { cancerV, fieldValuesV } from './validators';
import { fillReferral } from './core/fill';
import { makePort } from './core/ports';
import { buildRuleBook } from './core/rulebook';
import { convexStore } from './lib/store';

export const fromNote = action({
  args: { patientId: v.string(), cancer: cancerV, matched: v.any() },
  returns: fieldValuesV,
  handler: async (ctx, { patientId, cancer }): Promise<FieldValues> => {
    const { patient, rules, severities } = await ctx.runQuery(internal.data.aidInputs, { patientId });
    return fillReferral({ patient, cancer, book: buildRuleBook({ rules, severities }), model: makePort(process.env, convexStore(ctx)) });
  },
});
