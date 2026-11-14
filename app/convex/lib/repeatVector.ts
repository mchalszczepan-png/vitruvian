// Repeat visit flag from Convex vector search: the lib/repeat.ts rule, counting visits whose stored embedding is close to today's.
// Shared by aid:get (core/aid.ts override) and patients:repeatVisitSimilar. Actions only: ctx.vectorSearch is not in queries.
// Query vector: with EmbeddingGemma, today's note is embedded again as a query (the search prefix), so query and stored vectors
// come from one model. With Gemini (or no embedder), today's stored vector is used, as before: no new embedding call.
// The floor depends on the provider (similarityMinFor). Logs the top scores only, rounded to 2 dp, never note text.
// Research prototype. Not a medical device. Not for clinical use.
import type { RepeatVisitFlag } from '../../src/data/types';
import type { Doc } from '../_generated/dataModel';
import type { ActionCtx } from '../_generated/server';
import type { Embedder } from '../model/embed';
import { repeatFlag, similarityMinFor } from './repeat';

/**
 * Vector Repeat flag for one patient's visits (oldest first, as data.visitDocs returns them).
 * Returns null when there is no query vector (Gemini and today's visit has no embedding): the caller then counts the symptom field.
 * Throws when the embedder or vector search fails: the caller decides the fallback (no mixing of providers).
 */
export async function vectorRepeat(
  ctx: Pick<ActionCtx, 'vectorSearch'>,
  patientId: string,
  docs: Doc<'visits'>[],
  embedder?: Embedder,
): Promise<{ flag: RepeatVisitFlag | null } | null> {
  const today = docs.at(-1);
  if (!today) return null;
  const provider = embedder?.provider ?? 'gemini';
  const queryVector = embedder?.provider === 'embeddinggemma' ? await embedder.embedQuery(today.note) : today.embedding;
  if (!queryVector) return null;

  const min = similarityMinFor(provider);
  // limit covers every visit the patient has, so no earlier visit is cut before the window check.
  const hits = await ctx.vectorSearch('visits', 'by_embedding', {
    vector: queryVector,
    limit: Math.min(256, docs.length),
    filter: (q) => q.eq('patientId', patientId),
  });
  const top = hits
    .map((h) => h._score)
    .sort((a, b) => b - a)
    .slice(0, 5)
    .map((s) => s.toFixed(2));
  console.log(`repeat ${provider} top scores ${top.join(' ') || 'none'} (floor ${min})`);

  const hitIds = new Set(hits.filter((h) => h._score >= min).map((h) => h._id));
  const similarIds = new Set(docs.filter((d) => hitIds.has(d._id)).map((d) => d.visitId));
  const flat = docs.map((d) => ({ id: d.visitId, date: d.date, symptom: d.symptom }));
  return { flag: repeatFlag(flat, { similarIds }) };
}
