// Convex schema for the Vitruvian prototype. Research prototype. Not a medical device. All patients are made up.
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import {
  countyGapV,
  patientV,
  referralTemplateV,
  referralV,
  referralStatusFieldsV,
  ruleV,
  savedStagingReportV,
  severityV,
  stagingReportV,
  stagingTemplateV,
} from './validators';

/**
 * Visit embeddings, 768 dims. Either EmbeddingGemma (google/embeddinggemma-300m, task prefixes from model/embed.ts) or
 * Gemini gemini-embedding-001 (outputDimensionality 768). Never mixed in one index: after a switch, re-embed all rows
 * (seed:embedVisits with { force: true }). The schema does not record which model made a vector.
 */
export const EMBEDDING_DIMS = 768;

export default defineSchema({
  // One row per made-up patient. `id` is the demo ID, e.g. SYN-001.
  patients: defineTable(patientV).index('by_patient_id', ['id']),

  // One row per visit. `order` keeps oldest-first order. `embedding` is optional until seedEmbedVisits runs.
  visits: defineTable({
    patientId: v.string(),
    visitId: v.string(),
    order: v.number(),
    date: v.string(),
    reason: v.string(),
    symptom: v.string(),
    note: v.string(),
    reasonFi: v.optional(v.string()),
    gpNoteFi: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
  })
    .index('by_patient', ['patientId', 'order'])
    .index('by_visit_id', ['visitId'])
    .vectorIndex('by_embedding', { vectorField: 'embedding', dimensions: EMBEDDING_DIMS, filterFields: ['patientId'] }),

  rules: defineTable(ruleV).index('by_rule_id', ['id']).index('by_cancer', ['cancer']),

  referralTemplates: defineTable(referralTemplateV).index('by_cancer', ['cancer']),

  stagingTemplates: defineTable(stagingTemplateV).index('by_cancer', ['cancer']),

  stagingReports: defineTable(stagingReportV).index('by_cancer', ['cancer']),

  // Story 33: Staging reports the Specialist saved. Kept by seed:run (not in its SEEDED_TABLES).
  // by_report_id, not by_id: Convex reserves the by_id index name.
  stagingSubmissions: defineTable(savedStagingReportV)
    .index('by_report_id', ['id'])
    .index('by_referral', ['referralId'])
    .index('by_patient_and_cancer', ['patientId', 'cancer'])
    .index('by_saved_at', ['savedAt']),

  severity: defineTable(severityV).index('by_cancer', ['cancer']),

  // Single row (the county screen is one document).
  countyGap: defineTable(countyGapV),

  referrals: defineTable({ ...referralV.fields, ...referralStatusFieldsV }).index('by_referral_id', ['id']).index('by_decided_at', ['decidedAt']),

  // Decisions API answer cache: key -> JSON string. Written only by internal.cache.setMany.
  decisionCache: defineTable({ key: v.string(), value: v.string() }).index('by_key', ['key']),
});
