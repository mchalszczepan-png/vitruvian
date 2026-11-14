// Validators for every table and every public argument. Shapes mirror app/src/data/types.ts.
// Research prototype. Not a medical device. All patients are made up.
import { v } from 'convex/values';

export const cancerV = v.union(v.literal('lung'), v.literal('colorectal'), v.literal('ovarian'));
export const sexV = v.union(v.literal('male'), v.literal('female'));

export const sourceV = v.object({
  label: v.string(),
  url: v.string(),
  placeholder: v.optional(v.boolean()),
  short: v.optional(v.string()),
});

export const visitInputV = v.object({
  id: v.string(),
  date: v.string(),
  reason: v.string(),
  symptom: v.string(),
  note: v.string(),
  reasonFi: v.optional(v.string()),
  gpNoteFi: v.optional(v.string()),
});

export const patientV = v.object({
  id: v.string(),
  name: v.string(),
  age: v.number(),
  sex: sexV,
  smokingStatus: v.union(v.literal('never'), v.literal('former'), v.literal('current'), v.literal('unknown')),
  county: v.string(),
});

export const overTimeV = v.object({
  pattern: v.union(v.literal('single'), v.literal('persistent'), v.literal('recurrent'), v.literal('worsening')),
  minVisits: v.number(),
  windowDays: v.union(v.number(), v.null()),
  minDurationDays: v.union(v.number(), v.null()),
  basis: v.string(),
});

/** Rule extras from docs/build/rule-extras.json (restating rules.md for code): who a Rule may be asked about. */
export const limitsV = v.object({
  minAge: v.optional(v.number()),
  maxAge: v.optional(v.number()),
  sex: v.optional(sexV),
  /** smoking status is not 'never' */
  smokedEver: v.optional(v.boolean()),
});

/** A test decided in code from bands (FIT, CA-125). `fact` is a numeric key of FACT_SPEC. */
export const numericV = v.object({
  test: v.string(),
  fact: v.string(),
  unit: v.string(),
  bands: v.array(v.object({ minAge: v.number(), maxAge: v.union(v.number(), v.null()), atLeast: v.number() })),
});

export const ruleV = v.object({
  id: v.string(),
  cancer: cancerV,
  text: v.string(),
  question: v.string(),
  source: sourceV,
  gate: v.optional(v.object({ test: v.string(), threshold: v.string(), source: sourceV })),
  conditions: v.optional(v.string()),
  overTime: v.optional(overTimeV),
  limits: v.optional(limitsV),
  numeric: v.optional(numericV),
  /** asks: the Rule leads to an urgent ultrasound. settles: the Rule leads straight to a Referral. */
  scan: v.optional(v.union(v.literal('asks'), v.literal('settles'))),
  /** JS regex literal, e.g. "/bloat/i": where the Rule's evidence sits in a note (visit snippet) */
  cue: v.optional(v.string()),
});

const fieldKindV = v.union(v.literal('text'), v.literal('longtext'), v.literal('number'), v.literal('date'), v.literal('choice'), v.literal('yesno'));

export const templateFieldV = v.object({
  key: v.string(),
  label: v.string(),
  kind: fieldKindV,
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
  unit: v.optional(v.string()),
  hint: v.optional(v.string()),
  source: v.optional(sourceV),
});

export const referralTemplateV = v.object({
  cancer: cancerV,
  title: v.string(),
  fields: v.array(templateFieldV),
  source: sourceV,
});

export const stagingFieldV = v.object({
  key: v.string(),
  label: v.string(),
  kind: fieldKindV,
  required: v.boolean(),
  options: v.optional(v.array(v.string())),
  unit: v.optional(v.string()),
  hint: v.optional(v.string()),
  source: v.optional(sourceV),
  group: v.union(v.literal('tumour'), v.literal('tnm'), v.literal('diagnosis'), v.literal('registry')),
});

export const stagingTemplateV = v.object({
  cancer: cancerV,
  title: v.string(),
  tnmEdition: v.string(),
  fields: v.array(stagingFieldV),
  source: sourceV,
});

export const stagingReportV = v.object({
  cancer: cancerV,
  patientLabel: v.string(),
  values: v.record(v.string(), v.string()),
});

export const severityV = v.object({
  cancer: cancerV,
  fiveYearSurvivalPct: v.union(v.number(), v.null()),
  population: v.string(),
  breakdown: v.optional(v.array(v.object({ label: v.string(), pct: v.number() }))),
  ageBands: v.optional(
    v.array(
      v.object({
        sex: sexV,
        min: v.number(),
        max: v.number(),
        pct: v.number(),
        period: v.string(),
        source: sourceV,
      }),
    ),
  ),
  source: sourceV,
});

export const figureV = v.object({ id: v.string(), label: v.string(), value: v.string(), detail: v.optional(v.string()), source: sourceV });
export const areaComparisonV = v.object({
  id: v.string(),
  title: v.string(),
  unit: v.string(),
  note: v.string(),
  higherIsBetter: v.boolean(),
  bars: v.array(v.object({ area: v.string(), value: v.number(), display: v.string() })),
  source: sourceV,
});
export const goal3V = v.object({ id: v.string(), name: v.string(), howVitruvianMoves: v.string(), source: sourceV });
export const nextActionV = v.object({
  id: v.string(),
  title: v.string(),
  detail: v.string(),
  owner: v.string(),
  source: v.optional(sourceV),
});

export const countyGapV = v.object({
  headline: v.array(figureV),
  comparisons: v.array(areaComparisonV),
  goal3: v.array(goal3V),
  nextActions: v.array(nextActionV),
});

export const fieldValueV = v.object({
  value: v.string(),
  origin: v.union(v.literal('record'), v.literal('gemma'), v.literal('gp'), v.literal('empty')),
  evidence: v.optional(v.string()),
});

/** Mirrors FieldValues in app/src/data/types.ts: field key -> value. */
export const fieldValuesV = v.record(v.string(), fieldValueV);

export const repeatVisitFlagV = v.object({
  symptom: v.string(),
  count: v.number(),
  windowMonths: v.number(),
  visitIds: v.array(v.string()),
});

export const matchedRuleV = v.object({
  rule: ruleV,
  because: v.string(),
  visits: v.array(v.object({ visitId: v.string(), date: v.string(), snippet: v.string() })),
});

export const referralV = v.object({
  id: v.string(),
  patientId: v.string(),
  cancer: cancerV,
  urgency: v.union(v.literal('urgent'), v.literal('routine')),
  decidedBy: v.literal('GP'),
  decidedAt: v.string(),
  fields: v.record(v.string(), fieldValueV),
  matchedRules: v.array(matchedRuleV),
  riskGradient: v.number(),
  severity: severityV,
  repeatVisit: v.optional(repeatVisitFlagV),
});

/** Mirrors ReferralSummary in app/src/data/types.ts. Checkable facts only: no Risk gradient (decision 16). */
export const referralSummaryV = v.object({
  gpDecision: v.union(v.literal('refer-urgent'), v.literal('refer-routine'), v.literal('order-test'), v.literal('not-now')),
  urgency: v.union(v.literal('urgent'), v.literal('routine')),
  timeline: v.array(
    v.object({ visitId: v.string(), date: v.string(), reason: v.string(), reasonFi: v.optional(v.string()) }),
  ),
  matchedRules: v.array(
    v.object({ ruleId: v.string(), text: v.string(), source: sourceV, because: v.string(), visitDates: v.array(v.string()) }),
  ),
  tests: v.array(
    v.object({
      test: v.string(),
      value: v.union(v.number(), v.null()),
      unit: v.string(),
      threshold: v.string(),
      meetsThreshold: v.union(v.boolean(), v.null()),
      source: sourceV,
    }),
  ),
  redFlags: v.object({ present: v.array(v.string()), ruledOut: v.array(v.string()) }),
  missingFields: v.array(v.object({ key: v.string(), label: v.string() })),
});

/** Mirrors ReferralView in app/src/data/types.ts: referralV without riskGradient and matchedRules, plus summary. */
export const referralViewV = v.object({
  id: v.string(),
  patientId: v.string(),
  cancer: cancerV,
  urgency: v.union(v.literal('urgent'), v.literal('routine')),
  decidedBy: v.literal('GP'),
  decidedAt: v.string(),
  fields: v.record(v.string(), fieldValueV),
  severity: severityV,
  repeatVisit: v.optional(repeatVisitFlagV),
  summary: referralSummaryV,
});
