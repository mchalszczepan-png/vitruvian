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
  severityV,
  stagingReportV,
  stagingTemplateV,
} from './validators';

/** Visit embeddings: Gemini gemini-embedding-001 at 768 dimensions (outputDimensionality 768). */
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

  severity: defineTable(severityV).index('by_cancer', ['cancer']),

  // Single row (the county screen is one document).
  countyGap: defineTable(countyGapV),

  referrals: defineTable({ ...referralV.fields, ...referralStatusFieldsV }).index('by_referral_id', ['id']).index('by_decided_at', ['decidedAt']),

  // Decisions API answer cache: key -> JSON string. Written only by internal.cache.setMany.
  decisionCache: defineTable({ key: v.string(), value: v.string() }).index('by_key', ['key']),
});
