// Public patient functions. Mirror getPatients, getPatient and getRepeatVisit in app/src/data/api.ts.
// Research prototype. Not a medical device. Not for clinical use. All patients are made up.
// Security assumption: no auth yet (prototype). Anyone who can reach the dev deployment can read these made-up records.
import { v } from 'convex/values';
import type { Patient, RepeatVisitFlag } from '../src/data/types';
import { internal } from './_generated/api';
import { action, query } from './_generated/server';
import { repeatFlag, SIMILARITY_MIN } from './lib/repeat';
import { readPatient, readVisits } from './lib/read';

export const list = query({
  args: {},
  handler: async (ctx): Promise<Patient[]> => {
    const rows = await ctx.db.query('patients').collect();
    const out: Patient[] = [];
    for (const row of rows) {
      const p = await readPatient(ctx.db, row.id);
      if (p) out.push(p);
    }
    return out;
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, { id }): Promise<Patient | null> => readPatient(ctx.db, id),
});

/** Repeat visit from the symptom field only (the fallback path). Queries cannot run vector search, so see repeatVisitSimilar. */
export const repeatVisit = query({
  args: { id: v.string() },
  handler: async (ctx, { id }): Promise<RepeatVisitFlag | null> => {
    const visits = await readVisits(ctx.db, id);
    return repeatFlag(visits.map((x) => ({ id: x.id, date: x.date, symptom: x.symptom })));
  },
});

/**
 * Repeat visit with vector search, filtered by patient. Uses visit embeddings when today's visit has one;
 * otherwise falls back to the symptom field. Actions are the only place vectorSearch runs.
 */
export const repeatVisitSimilar = action({
  args: { id: v.string() },
  handler: async (ctx, { id }): Promise<RepeatVisitFlag | null> => {
    const docs = await ctx.runQuery(internal.data.visitDocs, { patientId: id });
    const flat = docs.map((d) => ({ id: d.visitId, date: d.date, symptom: d.symptom }));
    const today = docs.at(-1);
    if (!today?.embedding) return repeatFlag(flat);

    const hits = await ctx.vectorSearch('visits', 'by_embedding', {
      vector: today.embedding,
      limit: 20,
      filter: (q) => q.eq('patientId', id),
    });
    const hitIds = new Set(hits.filter((h) => h._score >= SIMILARITY_MIN).map((h) => h._id));
    const similarIds = new Set(docs.filter((d) => hitIds.has(d._id)).map((d) => d.visitId));
    return repeatFlag(flat, { similarIds });
  },
});
