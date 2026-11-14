// Referral desk. Mirrors sendReferral, getReferrals and setReferralStatus in app/src/data/api.ts.
// Security assumption: no auth yet (prototype). Any caller can write a Referral or change its status. Do not use with real patients.
import type { DatabaseReader, MutationCtx } from './_generated/server';
import type { Doc } from './_generated/dataModel';
import type { Referral, ReferralView } from '../src/data/types';
import { STATUS_REASON_MAX, toReferralView } from '../src/data/referralSummary';
import { mutation, query } from './_generated/server';
import { plain, readReferralTemplate, readRules, readVisits } from './lib/read';
import { v } from 'convex/values';
import { referralV, referralViewV } from './validators';

/** The view the Referral desk and Specialist see: no Risk gradient, plus the summary and the desk's status. */
async function viewOf(db: DatabaseReader, row: Doc<'referrals'>): Promise<ReferralView> {
  const referral = plain(row);
  const template = await readReferralTemplate(db, referral.cancer);
  if (!template) throw new Error(`No Referral template for ${referral.cancer}`);
  const visits = await readVisits(db, referral.patientId);
  const rules = await readRules(db);
  return toReferralView(referral, { visits, template, rules });
}

/**
 * Upsert by Referral id: replaces the row with the same id, otherwise inserts it. The stored row keeps the Risk gradient (audit).
 * A re-send keeps the Referral desk's status: the answer belongs to the desk, not to the GP's copy.
 */
export const send = mutation({
  args: { referral: referralV },
  handler: async (ctx, { referral }): Promise<Referral> => {
    const row = await ctx.db
      .query('referrals')
      .withIndex('by_referral_id', (q) => q.eq('id', referral.id))
      .unique();
    if (row) {
      const { status, statusReason, statusAt } = row;
      await ctx.db.replace(row._id, {
        ...referral,
        ...(status !== undefined ? { status } : {}),
        ...(statusReason !== undefined ? { statusReason } : {}),
        ...(statusAt !== undefined ? { statusAt } : {}),
      });
    } else {
      await ctx.db.insert('referrals', referral);
    }
    return referral;
  },
});

/** Newest first, by decidedAt (ISO string, sorts by time). Returns the Referral desk view: no Risk gradient, plus the summary (decision 16). */
export const list = query({
  args: {},
  returns: v.array(referralViewV),
  handler: async (ctx): Promise<ReferralView[]> => {
    const rows = await ctx.db.query('referrals').withIndex('by_decided_at').order('desc').take(200);
    const views: ReferralView[] = [];
    for (const row of rows) views.push(await viewOf(ctx.db, row));
    return views;
  },
});

/**
 * The Referral desk's answer: accepted, or returned with a reason. A return needs a non-empty reason; an accept clears any old one.
 * Any status can be set again (the desk may change its mind). Returns the updated view.
 */
export const setStatus = mutation({
  args: {
    referralId: v.string(),
    status: v.union(v.literal('accepted'), v.literal('returned')),
    reason: v.optional(v.string()),
  },
  returns: referralViewV,
  handler: async (ctx: MutationCtx, { referralId, status, reason }): Promise<ReferralView> => {
    const trimmed = (reason ?? '').trim();
    if (status === 'returned' && trimmed === '') throw new Error('A returned Referral needs a reason');
    if (trimmed.length > STATUS_REASON_MAX) throw new Error(`The reason is longer than ${STATUS_REASON_MAX} characters`);

    const row = await ctx.db
      .query('referrals')
      .withIndex('by_referral_id', (q) => q.eq('id', referralId))
      .unique();
    if (!row) throw new Error(`Unknown Referral ${referralId}`);

    // patch removes a field when it is set to undefined, so an accept clears statusReason.
    await ctx.db.patch(row._id, {
      status,
      statusAt: new Date().toISOString(),
      statusReason: status === 'returned' ? trimmed : undefined,
    });
    const updated = await ctx.db.get(row._id);
    if (!updated) throw new Error(`Referral ${referralId} disappeared while its status was set`);
    return viewOf(ctx.db, updated);
  },
});
