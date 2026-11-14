// County gap screen (one document). Mirrors getCountyGap in app/src/data/api.ts.
// Research prototype. Not a medical device. Not for clinical use.
import type { CountyGap } from '../src/data/types';
import { query } from './_generated/server';
import { readCountyGap } from './lib/read';

export const get = query({
  args: {},
  handler: async (ctx): Promise<CountyGap> => {
    const c = await readCountyGap(ctx.db);
    if (!c) throw new Error('County gap data is not seeded. Run seed:run.');
    return c;
  },
});
