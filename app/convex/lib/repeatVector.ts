// Repeat visit flag from Convex vector search: the lib/repeat.ts rule, counting visits whose stored embedding is close to today's.
// Shared by aid:get (core/aid.ts override) and patients:repeatVisitSimilar. Actions only: ctx.vectorSearch is not in queries.
// Uses the stored visit embeddings, so it makes no new embedding call.
// Research prototype. Not a medical device. Not for clinical use.
import type { RepeatVisitFlag } from '../../src/data/types';
import type { Doc } from '../_generated/dataModel';
import type { ActionCtx } from '../_generated/server';
import { repeatFlag, SIMILARITY_MIN } from './repeat';

/**
 * Vector Repeat flag for one patient's visits (oldest first, as data.visitDocs returns them).
 * Returns null when today's visit has no embedding: the caller then counts the symptom field instead.
 * Throws when vector search fails: the caller decides the fallback.
 */
export async function vectorRepeat(
  ctx: Pick<ActionCtx, 'vectorSearch'>,
  patientId: string,
  docs: Doc<'visits'>[],
): Promise<{ flag: RepeatVisitFlag | null } | null> {
  const today = docs.at(-1);
  if (!today?.embedding) return null;

  // limit covers every visit the patient has, so no earlier visit is cut before the window check.
  const hits = await ctx.vectorSearch('visits', 'by_embedding', {
    vector: today.embedding,
    limit: Math.min(256, docs.length),
    filter: (q) => q.eq('patientId', patientId),
  });
  const hitIds = new Set(hits.filter((h) => h._score >= SIMILARITY_MIN).map((h) => h._id));
  const similarIds = new Set(docs.filter((d) => hitIds.has(d._id)).map((d) => d.visitId));
  const flat = docs.map((d) => ({ id: d.visitId, date: d.date, symptom: d.symptom }));
  return { flag: repeatFlag(flat, { similarIds }) };
}
