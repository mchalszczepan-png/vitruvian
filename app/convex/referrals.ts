// Referral desk. Mirrors sendReferral and getReferrals in app/src/data/api.ts.
// Security assumption: no auth yet (prototype). Any caller can write a Referral. Do not use with real patients.
import type { Referral } from '../src/data/types';
import { mutation, query } from './_generated/server';
import { plain } from './lib/read';
import { referralV } from './validators';

/** Upsert by Referral id: replaces the row with the same id, otherwise inserts it. */
export const send = mutation({
  args: { referral: referralV },
  handler: async (ctx, { referral }): Promise<Referral> => {
    const row = await ctx.db
      .query('referrals')
      .withIndex('by_referral_id', (q) => q.eq('id', referral.id))
      .unique();
    if (row) await ctx.db.replace(row._id, referral);
    else await ctx.db.insert('referrals', referral);
    return referral;
  },
});

/** Newest first, by decidedAt (ISO string, sorts by time). */
export const list = query({
  args: {},
  handler: async (ctx): Promise<Referral[]> => {
    const rows = await ctx.db.query('referrals').withIndex('by_decided_at').order('desc').collect();
    return rows.map(plain);
  },
});
