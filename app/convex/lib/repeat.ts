// Repeat visit rule as a pure function, so it can be unit-tested without Convex.
// Mirrors getRepeatVisit in app/src/data/api.ts: 3 or more visits for the same symptom group
// within the window, counting today's visit. Research prototype. Not for clinical use.
import type { RepeatVisitFlag } from '../../src/data/types';

/** Rule constants. Change here only; the UI copy says "3 visits in 6 months" (see docs/SPEC.md). */
export const REPEAT_RULE = { minVisits: 3, windowMonths: 6 } as const;

/** Cosine similarity floor for vector search hits (tunable; Gemini embeddings of short GP notes sit high). */
export const SIMILARITY_MIN = 0.7;

export interface RepeatVisitInput {
  id: string;
  /** ISO date, e.g. "2026-09-14" */
  date: string;
  /** normalised symptom group, e.g. "cough" */
  symptom: string;
}

export interface RepeatOptions {
  /** Visit ids to count instead of matching the symptom field (vector search path). Today's visit is always counted. */
  similarIds?: ReadonlySet<string>;
  windowMonths?: number;
  minVisits?: number;
}

/**
 * Returns the flag for the latest visit (last in date order, oldest first), or null.
 * Visits are read as given; the last one is today's open visit.
 */
export function repeatFlag(visits: RepeatVisitInput[], opts: RepeatOptions = {}): RepeatVisitFlag | null {
  const today = visits.at(-1);
  if (!today) return null;
  const windowMonths = opts.windowMonths ?? REPEAT_RULE.windowMonths;
  const minVisits = opts.minVisits ?? REPEAT_RULE.minVisits;

  const from = new Date(today.date);
  from.setUTCMonth(from.getUTCMonth() - windowMonths);

  const picked = visits.filter((v) => {
    const inGroup = opts.similarIds ? v.id === today.id || opts.similarIds.has(v.id) : v.symptom === today.symptom;
    return inGroup && new Date(v.date) >= from && new Date(v.date) <= new Date(today.date);
  });
  if (picked.length < minVisits) return null;
  return { symptom: today.symptom, count: picked.length, windowMonths, visitIds: picked.map((v) => v.id) };
}
