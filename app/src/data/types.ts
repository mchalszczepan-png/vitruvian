// Domain types. Terms follow /GLOSSARY.md.
// The UI only depends on these types and on ./api.ts, so Convex can replace the mock data later.

export type CancerType = 'lung' | 'colorectal' | 'ovarian';

/** Every number or claim on screen points to one of these. */
export interface Source {
  label: string;
  url: string;
  /** true while the figure is a stand-in waiting for docs/build/*.md */
  placeholder?: boolean;
  /** short label for tight spaces; the full label shows on hover */
  short?: string;
}

export interface Visit {
  id: string;
  date: string; // ISO date
  /** short reason line from the record system */
  reason: string;
  /** normalised symptom group, e.g. "cough", used for the Repeat visit flag */
  symptom: string;
  /** GP free-text note */
  note: string;
  /** Finnish translation of `reason`, for display only (the Aid reads English `note`) */
  reasonFi?: string;
  /** Finnish translation of `note`, for display only (the Aid reads English `note`) */
  gpNoteFi?: string;
}

export type SmokingStatus = 'never' | 'former' | 'current' | 'unknown';

export interface Patient {
  id: string; // made-up demo ID, e.g. SYN-001
  name: string;
  age: number;
  sex: 'male' | 'female';
  smokingStatus: SmokingStatus;
  /** wellbeing services county (hyvinvointialue), a label only */
  county: string;
  /** oldest first; the last one is today's open visit */
  visits: Visit[];
}

export interface RepeatVisitFlag {
  symptom: string;
  count: number; // includes today
  windowMonths: number;
  visitIds: string[];
}

export type FieldKind = 'text' | 'longtext' | 'number' | 'date' | 'choice' | 'yesno';

export interface TemplateField {
  key: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  options?: string[];
  unit?: string;
  hint?: string;
  source?: Source; // why this field is on the Referral template
}

export interface ReferralTemplate {
  cancer: CancerType;
  title: string; // "Lung Referral template"
  fields: TemplateField[];
  source: Source;
}

/** record = copied from the GP's record system; gemma = read from the note; gp = typed or changed by the GP */
export type FieldOrigin = 'record' | 'gemma' | 'gp' | 'empty';

export interface FieldValue {
  value: string;
  origin: FieldOrigin;
  /** the words from the note that Gemma used */
  evidence?: string;
}

export type FieldValues = Record<string, FieldValue>;

export interface Rule {
  id: string;
  cancer: CancerType;
  text: string; // plain-language red-flag condition
  /** the yes/no question the Decisions API answers on the structured fields */
  question: string;
  source: Source;
  /** a test that must be done before this Rule can lead to "refer", e.g. FIT >= 10 µg Hb/g for colorectal */
  gate?: { test: string; threshold: string; source: Source };
  /** age limits or other plain-language conditions, shown on hover */
  conditions?: string;
  /** how the Rule reads the visit history (docs/build/rules.md "Over time"); optional, only the Convex seed sets it */
  overTime?: { pattern: 'single' | 'persistent' | 'recurrent' | 'worsening'; minVisits: number; windowDays: number | null; minDurationDays: number | null; basis: string };
}

export interface MatchedRule {
  rule: Rule;
  /** why it matched, in the patient's facts */
  because: string;
  /** the visits whose notes back this Rule, oldest first (BUILD-PLAN decision 15: the Aid reads the whole visit history) */
  visits: RuleVisit[];
}

export interface RuleVisit {
  visitId: string;
  date: string;
  /** short words from that visit's note */
  snippet: string;
}

export interface Severity {
  cancer: CancerType;
  /** null while the figure waits for a checked source */
  fiveYearSurvivalPct: number | null;
  population: string; // e.g. "Finland, both sexes, 2019–2023"
  /** optional split, e.g. by stage or sex */
  breakdown?: { label: string; pct: number }[];
  /** age-specific figures, matched to the patient's age and sex */
  ageBands?: { sex: 'male' | 'female'; min: number; max: number; pct: number; period: string; source: Source }[];
  source: Source;
}

export interface AidResult {
  suspectedCancer: CancerType;
  riskGradient: number; // 0–10, AI estimate
  riskReason: string;
  matchedRules: MatchedRule[];
  severity: Severity;
  /** set when a gate test is missing: the Aid shows "FIT needed" before "refer" */
  testNeeded?: { test: string; threshold: string; why: string; source: Source };
}

export type GpDecision = 'refer-urgent' | 'refer-routine' | 'order-test' | 'not-now';

export interface Referral {
  id: string;
  patientId: string;
  cancer: CancerType;
  urgency: 'urgent' | 'routine';
  decidedBy: 'GP';
  decidedAt: string;
  fields: FieldValues;
  matchedRules: MatchedRule[];
  riskGradient: number;
  severity: Severity;
  repeatVisit?: RepeatVisitFlag;
}

export interface StagingField extends TemplateField {
  group: 'tumour' | 'tnm' | 'diagnosis' | 'registry';
}

export interface StagingTemplate {
  cancer: CancerType;
  title: string;
  /** staging system, e.g. TNM 8th edition, or FIGO for ovarian */
  tnmEdition: string;
  fields: StagingField[];
  source: Source;
}

export interface StagingReport {
  cancer: CancerType;
  patientLabel: string;
  values: Record<string, string>;
}

export interface Figure {
  id: string;
  label: string;
  value: string;
  detail?: string;
  source: Source;
}

export interface AreaBar {
  area: string;
  value: number;
  /** printed next to the bar */
  display: string;
}

export interface AreaComparison {
  id: string;
  title: string;
  unit: string;
  note: string;
  higherIsBetter: boolean;
  bars: AreaBar[];
  source: Source;
}

export interface Goal3Indicator {
  id: string;
  name: string;
  howVitruvianMoves: string;
  source: Source;
}

export interface NextAction {
  id: string;
  title: string;
  detail: string;
  owner: string; // e.g. "Wellbeing services county"
  source?: Source;
}

export interface CountyGap {
  headline: Figure[];
  comparisons: AreaComparison[];
  goal3: Goal3Indicator[];
  nextActions: NextAction[];
}
