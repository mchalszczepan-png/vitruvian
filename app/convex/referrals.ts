// Referral desk. Mirrors sendReferral and getReferrals in app/src/data/api.ts.
// Security assumption: no auth yet (prototype). Any caller can write a Referral. Do not use with real patients.
import type { Referral, ReferralView } from '../src/data/types';
import { toReferralView } from '../src/data/referralSummary';
import { mutation, query } from './_generated/server';
import { plain, readReferralTemplate, readRules, readVisits } from './lib/read';
import { v } from 'convex/values';
import { referralV, referralViewV } from './validators';

/** Upsert by Referral id: replaces the row with the same id, otherwise inserts it. The stored row keeps the Risk gradient (audit). */
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

/** Newest first, by decidedAt (ISO string, sorts by time). Returns the Referral desk view: no Risk gradient, plus the summary (decision 16). */
export const list = query({
  args: {},
  returns: v.array(referralViewV),
  handler: async (ctx): Promise<ReferralView[]> => {
    const rows = await ctx.db.query('referrals').withIndex('by_decided_at').order('desc').take(200);
    const rules = await readRules(ctx.db);
    const views: ReferralView[] = [];
    for (const row of rows) {
      const referral = plain(row);
      const template = await readReferralTemplate(ctx.db, referral.cancer);
      if (!template) throw new Error(`No Referral template for ${referral.cancer}`);
      const visits = await readVisits(ctx.db, referral.patientId);
      views.push(toReferralView(referral, { visits, template, rules }));
    }
    return views;
  },
});
