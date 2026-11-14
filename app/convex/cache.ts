// Model answer cache: key -> value (JSON string), in batches. Internal only; used by core/cached.ts through lib/store.ts.
// Research prototype. Not a medical device. Not for clinical use.
import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

/** Most keys one call may ask for (a patient's Rules, or a handful of notes). */
const MAX_KEYS = 200;

export const getMany = internalQuery({
  args: { keys: v.array(v.string()) },
  returns: v.record(v.string(), v.string()),
  handler: async (ctx, { keys }) => {
    if (keys.length > MAX_KEYS) throw new Error(`cache: at most ${MAX_KEYS} keys per call`);
    const out: Record<string, string> = {};
    for (const key of keys) {
      const row = await ctx.db
        .query('decisionCache')
        .withIndex('by_key', (q) => q.eq('key', key))
        .unique();
      if (row) out[key] = row.value;
    }
    return out;
  },
});

export const setMany = internalMutation({
  args: { entries: v.array(v.object({ key: v.string(), value: v.string() })) },
  returns: v.null(),
  handler: async (ctx, { entries }) => {
    if (entries.length > MAX_KEYS) throw new Error(`cache: at most ${MAX_KEYS} entries per call`);
    for (const { key, value } of entries) {
      const row = await ctx.db
        .query('decisionCache')
        .withIndex('by_key', (q) => q.eq('key', key))
        .unique();
      if (row) await ctx.db.patch(row._id, { value });
      else await ctx.db.insert('decisionCache', { key, value });
    }
    return null;
  },
});
