// Structured facts per visit (docs/SPEC.md "Gemma": extraction output). FACT_SPEC is the one list:
// the Facts type, emptyFacts, coerceFacts, mergeFacts and the key list all derive from it.
// Research prototype. Not a medical device. Not for clinical use.

export const FACT_SPEC = {
  coughWeeks: 'number',
  haemoptysis: 'boolean',
  weightLossKg: 'number',
  appetiteLoss: 'boolean',
  tired: 'boolean',
  breathless: 'boolean',
  chestSigns: 'string',
  packYears: 'number',
  bowelChange: 'boolean',
  bowelWeeks: 'number',
  rectalBleeding: 'boolean',
  abdominalMass: 'boolean',
  hb: 'number',
  ironDeficiency: 'boolean',
  fit: 'number',
  rectalExam: 'string',
  ovarianSymptoms: 'strings',
  ca125: 'number',
  ultrasoundSuggests: 'boolean',
  ascitesOrMass: 'boolean',
  exam: 'string',
  tests: 'strings',
  medicines: 'string',
} as const;

type KindMap = { number: number; boolean: boolean; string: string; strings: string[] };
type Spec = typeof FACT_SPEC;
/** Booleans and lists are always present (false, []). Numbers and text are optional. */
type Always = 'boolean' | 'strings';

export type Facts = { [K in keyof Spec as Spec[K] extends Always ? K : never]: KindMap[Spec[K]] } & {
  [K in keyof Spec as Spec[K] extends Always ? never : K]?: KindMap[Spec[K]];
};

export type FactKey = keyof Spec;
/** Fact keys that hold a number: the ones a Rule's `numeric` test may read. */
export type NumericFact = { [K in FactKey]: Spec[K] extends 'number' ? K : never }[FactKey];

export const FACT_KEYS = Object.keys(FACT_SPEC) as FactKey[];

export const isNumericFact = (key: string): key is NumericFact => (FACT_SPEC as Record<string, string>)[key] === 'number';

export function emptyFacts(): Facts {
  const out: Record<string, unknown> = {};
  for (const k of FACT_KEYS) {
    if (FACT_SPEC[k] === 'boolean') out[k] = false;
    else if (FACT_SPEC[k] === 'strings') out[k] = [];
  }
  return out as unknown as Facts;
}

/** Keeps only the known fact keys with the right type. Anything else from the model is dropped. */
export function coerceFacts(raw: unknown): Partial<Facts> {
  const out: Record<string, unknown> = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const k of FACT_KEYS) {
    const v = (raw as Record<string, unknown>)[k];
    const kind = FACT_SPEC[k];
    if (kind === 'number' && typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (kind === 'boolean' && typeof v === 'boolean') out[k] = v;
    else if (kind === 'string' && typeof v === 'string' && v.trim()) out[k] = v;
    else if (kind === 'strings' && Array.isArray(v)) out[k] = v.filter((x): x is string => typeof x === 'string');
  }
  return out as Partial<Facts>;
}

/**
 * Merges per-visit facts into the facts known up to the last visit:
 * arrays are unioned, booleans are OR-ed (a symptom reported once stays), numbers and text take the latest defined value.
 */
export function mergeFacts(list: Partial<Facts>[]): Facts {
  const out = emptyFacts() as unknown as Record<string, unknown>;
  for (const f of list) {
    for (const k of FACT_KEYS) {
      const val = (f as Record<string, unknown>)[k];
      if (val === undefined) continue;
      if (Array.isArray(val)) {
        const prev = out[k] as unknown[];
        out[k] = [...prev, ...val.filter((x) => !prev.includes(x))];
      } else if (typeof val === 'boolean') {
        out[k] = out[k] === true || val;
      } else {
        out[k] = val;
      }
    }
  }
  return out as unknown as Facts;
}

/** Stable JSON in FACT_SPEC key order, undefined left out. The input to cache keys. */
export function factsJson(f: Partial<Facts>): string {
  const out: Record<string, unknown> = {};
  for (const k of FACT_KEYS) {
    const v = (f as Record<string, unknown>)[k];
    if (v !== undefined) out[k] = v;
  }
  return JSON.stringify(out);
}
