// Seeding from docs/build data (built into convex/seed/*.json by app/scripts/build-seed.mjs).
// seed:run clears and reinserts the seeded tables (idempotent). It keeps `referrals` and `decisionCache`.
// seed:embedVisits (internal) embeds visit notes with Gemini gemini-embedding-001 at 768 dims. No-op without GEMINI_API_KEY.
// Research prototype. Not a medical device. Not for clinical use. All patients are made up.
/// <reference types="node" />
import { v } from 'convex/values';
import type { CountyGap, Patient, ReferralTemplate, Rule, Severity, StagingReport, StagingTemplate } from '../src/data/types';
import { internal } from './_generated/api';
import type { Id, TableNames } from './_generated/dataModel';
import { internalAction, internalMutation, mutation, type MutationCtx } from './_generated/server';
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

const GEMINI_EMBED_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

async function embedText(apiKey: string, text: string): Promise<number[]> {
  const res = await fetch(GEMINI_EMBED_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({ content: { parts: [{ text }] }, outputDimensionality: EMBEDDING_DIMS }),
  });
  // The error text is not echoed: it could carry request details.
  if (!res.ok) throw new Error(`Gemini embedContent failed with HTTP ${res.status}`);
  const json = (await res.json()) as { embedding?: { values?: number[] } };
  if (!json.embedding?.values) throw new Error('Gemini embedContent returned no values');
  return json.embedding.values;
}

export const embedVisits = internalAction({
  args: {},
  handler: async (ctx): Promise<{ skipped: string | null; embedded: number }> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { skipped: 'GEMINI_API_KEY not set', embedded: 0 };

    const rows = await ctx.runQuery(internal.data.allVisitDocs, {});
    let embedded = 0;
    for (const row of rows) {
      if (row.embedding) continue;
      const embedding = await embedText(apiKey, row.note);
      await ctx.runMutation(internal.seed.setEmbedding, { id: row._id as Id<'visits'>, embedding });
      embedded++;
    }
    return { skipped: null, embedded };
  },
});
