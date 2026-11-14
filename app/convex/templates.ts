// Referral and staging template queries. Mirror getReferralTemplate and getStagingTemplate in app/src/data/api.ts.
// Research prototype. Not a medical device. Not for clinical use.
import type { ReferralTemplate, StagingTemplate } from '../src/data/types';
import { query } from './_generated/server';
import { cancerV } from './validators';
import { readReferralTemplate, readStagingTemplate } from './lib/read';

export const referral = query({
  args: { cancer: cancerV },
  handler: async (ctx, { cancer }): Promise<ReferralTemplate> => {
    const t = await readReferralTemplate(ctx.db, cancer);
    if (!t) throw new Error(`Referral template for ${cancer} is not seeded. Run seed:run.`);
    return t;
  },
});

export const staging = query({
  args: { cancer: cancerV },
  handler: async (ctx, { cancer }): Promise<StagingTemplate> => {
    const t = await readStagingTemplate(ctx.db, cancer);
    if (!t) throw new Error(`Staging template for ${cancer} is not seeded. Run seed:run.`);
    return t;
  },
});
