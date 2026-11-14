// Builds the Referral view that the Referral desk and Specialist see (docs/SPEC.md "Who sees the Risk gradient", decision 16).
// The AI Risk gradient and the matched Rules objects are dropped; a summary of checkable facts is added instead.
// Pure: types only, so the mock path (api.ts) and the Convex functions (convex/referrals.ts) both use it.
// Research prototype. Not a medical device. Not for clinical use.
import type {
  CancerType,
  FieldValues,
  GpDecision,
  Referral,
  ReferralStatus,
  ReferralSummary,
  ReferralTemplate,
  ReferralTestValue,
  ReferralView,
  Rule,
  Visit,
} from './types';

/** A stored Referral plus the Referral desk's answer. A row without status counts as 'sent'. */
export type ReferralRecord = Referral & { status?: ReferralStatus; statusReason?: string; statusAt?: string };

/** Longest reason the Referral desk can give for a return (Convex and the mock both check it). */
export const STATUS_REASON_MAX = 500;

export interface ReferralViewContext {
  visits: Visit[];
  template: ReferralTemplate;
  rules: Rule[];
}

/** Referral template field keys that hold a yes/no red flag. Test-done flags (fitDone, ca125Done) and risk factors are left out. */
const RED_FLAG_FIELD_KEYS: Record<CancerType, string[]> = {
  lung: ['haemoptysis'],
  colorectal: ['bowelHabitChange', 'rectalBleeding', 'abdominalMass', 'ironDeficiencyAnaemia'],
  ovarian: ['bloatingOrDistension', 'earlySatietyOrAppetiteLoss', 'pelvicOrAbdominalPain', 'urinarySymptoms', 'ascites', 'palpableMass'],
};

/** The Referral template field that holds each gate test's value. */
const TEST_VALUE_FIELD_KEY: Record<string, string> = {
  FIT: 'fitValueUgHbPerG',
  'CA-125': 'ca125ValueIuPerMl',
};

export function toReferralView(referral: ReferralRecord, ctx: ReferralViewContext): ReferralView {
  const { riskGradient: _riskGradient, matchedRules: _matchedRules, fields, status, statusReason, statusAt, ...rest } = referral;
  const { riskGradientAiEstimate: _aiEstimate, ...fieldsWithoutRisk } = fields;
  return {
    ...rest,
    fields: fieldsWithoutRisk,
    summary: buildSummary(referral, ctx),
    status: status ?? 'sent',
    ...(statusReason !== undefined ? { statusReason } : {}),
    ...(statusAt !== undefined ? { statusAt } : {}),
  };
}

function buildSummary(referral: Referral, ctx: ReferralViewContext): ReferralSummary {
  return {
    gpDecision: gpDecisionOf(referral.urgency),
    urgency: referral.urgency,
    timeline: [...ctx.visits]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((visit) => ({
        visitId: visit.id,
        date: visit.date,
        reason: visit.reason,
        ...(visit.reasonFi !== undefined ? { reasonFi: visit.reasonFi } : {}),
      })),
    matchedRules: referral.matchedRules.map((m) => ({
      ruleId: m.rule.id,
      text: m.rule.text,
      source: m.rule.source,
      because: m.because,
      visitDates: m.visits.map((v) => v.date),
    })),
    tests: testsFor(referral, ctx),
    redFlags: redFlagsFor(referral, ctx.template),
    missingFields: ctx.template.fields
      .filter((field) => field.required && filledValue(referral.fields, field.key) === undefined)
      .map((field) => ({ key: field.key, label: field.label })),
  };
}

function gpDecisionOf(urgency: Referral['urgency']): GpDecision {
  return urgency === 'urgent' ? 'refer-urgent' : 'refer-routine';
}

/** One entry per gate test the cancer's Rules name (FIT for colorectal, CA-125 for ovarian). Lung has no gate, so no entries. */
function testsFor(referral: Referral, ctx: ReferralViewContext): ReferralTestValue[] {
  const age = numberOrNull(filledValue(referral.fields, 'age'));
  const seenTests = new Set<string>();
  const tests: ReferralTestValue[] = [];
  for (const rule of ctx.rules) {
    if (rule.cancer !== referral.cancer || !rule.gate || seenTests.has(rule.gate.test)) continue;
    const { test, threshold, source } = rule.gate;
    seenTests.add(test);
    const key = TEST_VALUE_FIELD_KEY[test];
    const value = key ? numberOrNull(filledValue(referral.fields, key)) : null;
    tests.push({
      test,
      value,
      unit: ctx.template.fields.find((field) => field.key === key)?.unit ?? '',
      threshold,
      meetsThreshold: value === null ? null : thresholdMet(threshold, value, age),
      source,
    });
  }
  return tests;
}

/**
 * Compares a value with the threshold text the gate Rule states. Only numbers written in that text are used:
 * "≥ 10 µg Hb/g" for FIT, and "by age: 35 IU/mL at 40–49, …" for CA-125 (the NICE age band, OVAR-06).
 * Returns null when the text states no usable threshold, so no threshold is ever invented.
 */
function thresholdMet(threshold: string, value: number, age: number | null): boolean | null {
  if (threshold.startsWith('by age:')) {
    const atLeast = age === null ? null : ageBandThreshold(threshold, age);
    return atLeast === null ? null : value >= atLeast;
  }
  const match = threshold.match(/≥\s*(\d+(?:\.\d+)?)/);
  return match ? value >= Number(match[1]) : null;
}

/** "by age: 35 IU/mL at 40–49, 31 at 50–59, 24 at 60–69, 25 at 70–79, 31 at 80+" → the figure for `age`, or null. */
function ageBandThreshold(threshold: string, age: number): number | null {
  for (const band of threshold.matchAll(/(\d+(?:\.\d+)?)\s*(?:IU\/mL)?\s*at\s*(\d+)(?:\s*[–-]\s*(\d+)|\+)/g)) {
    const [, atLeast, minAge, maxAge] = band;
    if (age >= Number(minAge) && age <= (maxAge === undefined ? Infinity : Number(maxAge))) return Number(atLeast);
  }
  return null;
}

/**
 * present = red-flag template fields answered yes, plus the text of every matched Rule (each Rule is a red-flag condition).
 * ruledOut = red-flag template fields answered no. Labels come from the template.
 */
function redFlagsFor(referral: Referral, template: ReferralTemplate): ReferralSummary['redFlags'] {
  const flagKeys = RED_FLAG_FIELD_KEYS[referral.cancer];
  const present: string[] = [];
  const ruledOut: string[] = [];
  for (const field of template.fields) {
    if (!flagKeys.includes(field.key)) continue;
    const answer = filledValue(referral.fields, field.key)?.toLowerCase();
    if (answer === 'yes' || answer === 'true') present.push(field.label);
    else if (answer === 'no' || answer === 'false') ruledOut.push(field.label);
  }
  for (const m of referral.matchedRules) {
    if (!present.includes(m.rule.text)) present.push(m.rule.text);
  }
  return { present, ruledOut };
}

/** The trimmed value, or undefined when the field is absent, empty, or origin 'empty'. */
function filledValue(fields: FieldValues, key: string): string | undefined {
  const field = fields[key];
  if (!field || field.origin === 'empty') return undefined;
  const value = field.value.trim();
  return value === '' ? undefined : value;
}

function numberOrNull(text: string | undefined): number | null {
  if (text === undefined) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}
