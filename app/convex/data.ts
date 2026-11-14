// Internal functions used by package B (Aid pipeline). Not callable from the client.
// Research prototype. Not a medical device. All patients are made up.
import { v } from 'convex/values';
import { internalQuery } from './_generated/server';
import { readPatient, readRules, readSeverities } from './lib/read';

/** Everything one Aid run needs, in one read: the patient with visits, the Rule rows, the severity rows. */
export const aidInputs = internalQuery({
  args: { patientId: v.string() },
  handler: async (ctx, { patientId }) => {
    const patient = await readPatient(ctx.db, patientId);
    if (!patient) throw new Error(`Unknown patient ${patientId}`);
    return { patient, rules: await readRules(ctx.db), severities: await readSeverities(ctx.db) };
  },
});

/** Every patient id, for aid:prewarm. */
export const patientIds = internalQuery({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => (await ctx.db.query('patients').take(1000)).map((p) => p.id),
});

/** Raw visit rows, with Convex _id and embedding. Used by the vector search action and by seed:embedVisits. */
export const visitDocs = internalQuery({
  args: { patientId: v.string() },
  handler: async (ctx, { patientId }) =>
    ctx.db
      .query('visits')
      .withIndex('by_patient', (q) => q.eq('patientId', patientId))
      .order('asc')
      .collect(),
});

export const allVisitDocs = internalQuery({
  args: {},
  handler: async (ctx) => ctx.db.query('visits').collect(),
});
