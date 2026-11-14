// Seeding from docs/build data (built into convex/seed/*.json by app/scripts/build-seed.mjs).
// seed:run clears and reinserts the seeded tables (idempotent). It keeps `referrals`, `stagingSubmissions` and `decisionCache`.
// seed:embedVisits (internal, args { force?: boolean }) embeds visit notes at 768 dims with model/embed.ts embedderFrom:
// EmbeddingGemma when EMBED_BASE_URL, EMBED_API_KEY and EMBED_MODEL are set, else Gemini gemini-embedding-001 with GEMINI_API_KEY.
// No-op without either. It skips rows that already have a vector unless force is true. Vectors from the two providers are not
// comparable: after a provider switch run it with { force: true }.
// seed:run schedules seed:embedVisits, so a reseed re-embeds the rows it clears.
// Research prototype. Not a medical device. Not for clinical use. All patients are made up.
/// <reference types="node" />
import { v } from 'convex/values';
import type { CountyGap, Patient, ReferralTemplate, Rule, Severity, StagingReport, StagingTemplate } from '../src/data/types';
import { internal } from './_generated/api';
import type { Doc, Id, TableNames } from './_generated/dataModel';
import { internalAction, internalMutation, mutation, type MutationCtx } from './_generated/server';
import { embedderFrom, type EmbedProvider } from './model/embed';
import { EMBEDDING_DIMS } from './schema';
import countyGapJson from './seed/countyGap.json';
import patientsJson from './seed/patients.json';
import referralTemplatesJson from './seed/referralTemplates.json';
import rulesJson from './seed/rules.json';
import severityJson from './seed/severity.json';
import stagingReportsJson from './seed/stagingReports.json';
import stagingTemplatesJson from './seed/stagingTemplates.json';
import visitsJson from './seed/visits.json';

const SEEDED_TABLES = [
  'patients',
  'visits',
  'rules',
  'referralTemplates',
  'stagingTemplates',
  'stagingReports',
  'severity',
  'countyGap',
] as const satisfies readonly TableNames[];

async function clear(ctx: MutationCtx, table: (typeof SEEDED_TABLES)[number]): Promise<void> {
  for (const row of await ctx.db.query(table).collect()) await ctx.db.delete(row._id);
}

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    for (const table of SEEDED_TABLES) await clear(ctx, table);

    const patients = patientsJson as Omit<Patient, 'visits'>[];
    for (const p of patients) await ctx.db.insert('patients', p);

    const visits = visitsJson as { patientId: string; visitId: string; order: number; date: string; reason: string; symptom: string; note: string; reasonFi?: string; gpNoteFi?: string }[];
    for (const r of visits) await ctx.db.insert('visits', r);

    for (const r of rulesJson as Rule[]) await ctx.db.insert('rules', r);
    for (const t of referralTemplatesJson as ReferralTemplate[]) await ctx.db.insert('referralTemplates', t);
    for (const t of stagingTemplatesJson as StagingTemplate[]) await ctx.db.insert('stagingTemplates', t);
    for (const r of stagingReportsJson as unknown as StagingReport[]) await ctx.db.insert('stagingReports', r);
    for (const s of severityJson as Severity[]) await ctx.db.insert('severity', s);
    await ctx.db.insert('countyGap', countyGapJson as CountyGap);
    // Clearing visits drops their embeddings, so embed the new rows (no-op without an embedder).
    await ctx.scheduler.runAfter(0, internal.seed.embedVisits, {});

    return {
      patients: patients.length,
      visits: visits.length,
      rules: rulesJson.length,
      referralTemplates: referralTemplatesJson.length,
      stagingTemplates: stagingTemplatesJson.length,
      stagingReports: stagingReportsJson.length,
      severity: severityJson.length,
    };
  },
});

export const setEmbedding = internalMutation({
  args: { id: v.id('visits'), embedding: v.array(v.float64()) },
  handler: async (ctx, { id, embedding }) => {
    if (embedding.length !== EMBEDDING_DIMS) throw new Error(`embedding has ${embedding.length} dims, expected ${EMBEDDING_DIMS}`);
    await ctx.db.patch(id, { embedding });
  },
});

/**
 * Embeds visit notes with embedderFrom(env) (EmbeddingGemma, else Gemini). Rows that already have a vector are skipped unless
 * force is true: Gemini and EmbeddingGemma vectors are not comparable, so after a provider switch run it with { force: true }.
 * Returns skipped (rows left as they were), embedded (rows written) and provider (null when no embedder is configured).
 */
export const embedVisits = internalAction({
  args: { force: v.optional(v.boolean()) },
  returns: v.object({
    skipped: v.number(),
    embedded: v.number(),
    provider: v.union(v.literal('embeddinggemma'), v.literal('gemini'), v.null()),
  }),
  handler: async (ctx, { force }): Promise<{ skipped: number; embedded: number; provider: EmbedProvider | null }> => {
    const embedder = embedderFrom(process.env);
    if (!embedder) {
      console.log('embedVisits: no embedder, set EMBED_BASE_URL, EMBED_API_KEY and EMBED_MODEL, or GEMINI_API_KEY');
      return { skipped: 0, embedded: 0, provider: null };
    }
    const rows: Doc<'visits'>[] = await ctx.runQuery(internal.data.allVisitDocs, {});
    const todo = force ? rows : rows.filter((r) => !r.embedding);
    const vectors = await embedder.embedDocs(todo.map((r) => r.note));
    for (let i = 0; i < todo.length; i++) {
      await ctx.runMutation(internal.seed.setEmbedding, { id: todo[i]._id as Id<'visits'>, embedding: vectors[i] });
    }
    return { skipped: rows.length - todo.length, embedded: todo.length, provider: embedder.provider };
  },
});
