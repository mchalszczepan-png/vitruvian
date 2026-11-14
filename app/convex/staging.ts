// Demo staging report (made-up patient). Mirrors getDemoStaging in app/src/data/api.ts.
// Research prototype. Not a medical device. Not for clinical use.
import type { StagingReport } from '../src/data/types';
import { query } from './_generated/server';
import { cancerV } from './validators';
import { readDemoStaging } from './lib/read';

export const demo = query({
  args: { cancer: cancerV },
  handler: async (ctx, { cancer }): Promise<StagingReport> => {
    const r = await readDemoStaging(ctx.db, cancer);
    if (!r) throw new Error(`Demo staging for ${cancer} is not seeded. Run seed:run.`);
    return r;
  },
});
