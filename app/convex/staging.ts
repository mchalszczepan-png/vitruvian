// Staging reports. Mirror getDemoStaging, getStagingDraft, saveStagingReport and getSavedStagingReports in app/src/data/api.ts.
// Story 32: the draft is built from a Referral and its patient. Story 33: save runs the check on the server and never trusts a client status.
// Security assumption: no auth yet (prototype). Any caller can read a draft or save a report. Do not use with real patients.
// Research prototype. Not a medical device. Not for clinical use.
import { v } from 'convex/values';
import type { SavedStagingReport, StagingReport, StagingStatus } from '../src/data/types';
import { checkStaging } from '../src/data/stagingCheck';
import { buildStagingDraft } from '../src/data/stagingDraft';
import type { Doc } from './_generated/dataModel';
import { mutation, query, type MutationCtx } from './_generated/server';
import { cancerV, savedStagingReportV, stagingReportFullV } from './validators';
import { plain, readDemoStaging, readPatient, readStagingTemplate } from './lib/read';

export const demo = query({
  args: { cancer: cancerV },
  returns: stagingReportFullV,
  handler: async (ctx, { cancer }): Promise<StagingReport> => {
    const r = await readDemoStaging(ctx.db, cancer);
    if (!r) throw new Error(`Demo staging for ${cancer} is not seeded. Run seed:run.`);
    return r;
  },
});

/** Story 32: the Staging report the Specialist starts from, built from the Referral row, its patient and the staging template. */
export const draft = query({
  args: { referralId: v.string() },
  returns: stagingReportFullV,
  handler: async (ctx, { referralId }): Promise<StagingReport> => {
    const row = await ctx.db
      .query('referrals')
      .withIndex('by_referral_id', (q) => q.eq('id', referralId))
      .unique();
    if (!row) throw new Error(`Unknown Referral ${referralId}`);
    const referral = plain(row);
    const patient = await readPatient(ctx.db, referral.patientId);
    if (!patient) throw new Error(`Unknown patient ${referral.patientId}`);
    const template = await readStagingTemplate(ctx.db, referral.cancer);
    if (!template) throw new Error(`Staging template for ${referral.cancer} is not seeded. Run seed:run.`);
    return buildStagingDraft(referral, patient, template);
  },
});

/**
 * Story 33: save a Staging report. The status comes from checkStaging on the stored template, never from the client
 * (the args do not accept a status, and v.object rejects unknown fields).
 * Upsert by referralId when present, otherwise by patientId + cancer, otherwise a new row.
 */
export const save = mutation({
  args: { report: stagingReportFullV },
  returns: savedStagingReportV,
  handler: async (ctx, { report }): Promise<SavedStagingReport> => {
    const template = await readStagingTemplate(ctx.db, report.cancer);
    if (!template) throw new Error(`Staging template for ${report.cancer} is not seeded. Run seed:run.`);
    if (report.referralId !== undefined) {
      const referralId = report.referralId;
      const referral = await ctx.db
        .query('referrals')
        .withIndex('by_referral_id', (q) => q.eq('id', referralId))
        .unique();
      if (!referral) throw new Error(`Unknown Referral ${referralId}`);
    }

    const check = checkStaging(template, report.values);
    const status: StagingStatus = check.readyForRegistry ? 'ready-for-registry' : 'draft';
    const savedAt = new Date().toISOString();
    const existing = await existingSubmission(ctx, report);

    if (existing) {
      await ctx.db.replace(existing._id, { ...report, id: existing.id, status, check, savedAt });
      return plain((await ctx.db.get(existing._id))!);
    }
    // The id is the new row's Convex id, so it is unique and needs no randomness. Insert, then set it.
    const docId = await ctx.db.insert('stagingSubmissions', { ...report, id: 'pending', status, check, savedAt });
    await ctx.db.patch(docId, { id: `STG-${docId}` });
    return plain((await ctx.db.get(docId))!);
  },
});

/** The row this report updates, or null when it is a new report. */
async function existingSubmission(ctx: MutationCtx, report: StagingReport): Promise<Doc<'stagingSubmissions'> | null> {
  if (report.referralId !== undefined) {
    const referralId = report.referralId;
    return ctx.db
      .query('stagingSubmissions')
      .withIndex('by_referral', (q) => q.eq('referralId', referralId))
      .first();
  }
  if (report.patientId !== undefined) {
    const patientId = report.patientId;
    return ctx.db
      .query('stagingSubmissions')
      .withIndex('by_patient_and_cancer', (q) => q.eq('patientId', patientId).eq('cancer', report.cancer))
      .first();
  }
  return null;
}

/** Story 33: saved Staging reports, newest first by savedAt. Bounded to the newest 200. */
export const saved = query({
  args: {},
  returns: v.array(savedStagingReportV),
  handler: async (ctx): Promise<SavedStagingReport[]> => {
    const rows = await ctx.db.query('stagingSubmissions').withIndex('by_saved_at').order('desc').take(200);
    return rows.map((row) => plain(row));
  },
});
