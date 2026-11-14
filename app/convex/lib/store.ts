// The model-answer Store (core/cached.ts) backed by the decisionCache table, from inside an action.
// Research prototype. Not a medical device. Not for clinical use.
import type { ActionCtx } from '../_generated/server';
import { internal } from '../_generated/api';
import type { Store } from '../core/cached';

export function convexStore(ctx: Pick<ActionCtx, 'runQuery' | 'runMutation'>): Store {
  return {
    getMany: (keys) => (keys.length === 0 ? Promise.resolve({}) : ctx.runQuery(internal.cache.getMany, { keys })),
    async setMany(entries) {
      if (entries.length > 0) await ctx.runMutation(internal.cache.setMany, { entries });
    },
  };
}
