// Public patient functions. Mirror getPatients, getPatient and getRepeatVisit in app/src/data/api.ts.
// Research prototype. Not a medical device. Not for clinical use. All patients are made up.
// Security assumption: no auth yet (prototype). Anyone who can reach the dev deployment can read these made-up records.
import { v } from 'convex/values';
import type { Patient, RepeatVisitFlag } from '../src/data/types';
import { internal } from './_generated/api';
import { action, mutation, query } from './_generated/server';
import { repeatFlag } from './lib/repeat';
import { vectorRepeat } from './lib/repeatVector';
import { embedderFrom } from './model/embed';
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
    // An embedder or vector search failure falls back to the symptom field, as aid:get does. Providers are never mixed.
    let vector: Awaited<ReturnType<typeof vectorRepeat>> = null;
    try {
      vector = await vectorRepeat(ctx, id, docs, embedderFrom(process.env));
    } catch (e) {
      console.log(`repeatVisitSimilar ${id} vector Repeat failed, using the symptom field: ${e instanceof Error ? e.message : 'error'}`);
    }
    if (vector) return vector.flag;
    return repeatFlag(docs.map((d) => ({ id: d.visitId, date: d.date, symptom: d.symptom })));
  },
});

const NOTE_MAX = 4000;
const today = () => new Date().toISOString().slice(0, 10);
/** The visit's short reason line: the note's first line, cut to 60 characters. */
const reasonOf = (note: string) => note.trim().split('\n')[0].slice(0, 60);

/** Add a made-up patient with one open visit (today's note). Returns the new patient. */
export const add = mutation({
  args: { name: v.string(), age: v.number(), sex: v.union(v.literal('male'), v.literal('female')), county: v.string(), note: v.string() },
  handler: async (ctx, a): Promise<Patient> => {
    const name = a.name.trim();
    const note = a.note.trim();
    if (!name || name.length > 80) throw new Error('Name: 1 to 80 characters');
    if (!Number.isInteger(a.age) || a.age < 18 || a.age > 110) throw new Error('Age: a whole number from 18 to 110');
    if (!note || note.length > NOTE_MAX) throw new Error(`Note: 1 to ${NOTE_MAX} characters`);
    const id = `NEW-${Date.now().toString(36).toUpperCase()}`;
    await ctx.db.insert('patients', { id, name, age: a.age, sex: a.sex, smokingStatus: 'unknown', county: a.county.trim() || 'Pirkanmaa' });
    const reason = reasonOf(note);
    await ctx.db.insert('visits', { patientId: id, visitId: `${id}-v1`, order: 0, date: today(), reason, symptom: reason.toLowerCase(), note });
    return (await readPatient(ctx.db, id))!;
  },
});

/** Correct a visit's note. The old text goes into `history`, so the original stays readable. Returns the patient. */
export const editVisit = mutation({
  args: { patientId: v.string(), visitId: v.string(), note: v.string() },
  handler: async (ctx, { patientId, visitId, note }): Promise<Patient> => {
    const text = note.trim();
    if (!text || text.length > NOTE_MAX) throw new Error(`Note: 1 to ${NOTE_MAX} characters`);
    const row = await ctx.db
      .query('visits')
      .withIndex('by_visit_id', (q) => q.eq('visitId', visitId))
      .unique();
    if (!row || row.patientId !== patientId) throw new Error('Visit not found');
    if (row.note !== text) {
      const history = [...(row.history ?? []), { note: row.note, replacedAt: new Date().toISOString() }];
      // The embedding was made from the old text, so it goes; the Repeat visit flag then counts the symptom field.
      // The English note changed, so the Finnish display copy no longer matches it.
      await ctx.db.patch(row._id, { note: text, history, embedding: undefined, gpNoteFi: undefined });
    }
    return (await readPatient(ctx.db, patientId))!;
  },
});
