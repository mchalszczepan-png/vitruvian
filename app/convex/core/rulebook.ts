// The Rule book: what the seed Rules say, as one object. Everything the pipeline needs to know about Rules
// (who may be asked, numeric bands, the ultrasound role, snippet cues, cancer list, catalogue counts, severity)
// is derived here from the seed rows. No Rule id or cancer list is written anywhere else in the pipeline.
// The medical source is docs/build/rules.md; the extra fields come from docs/build/rule-extras.json via scripts/build-seed.mjs.
// Research prototype. Not a medical device. Not for clinical use.
import type { AidResult, CancerType, MatchedRule, Rule, Severity } from '../../src/data/types';
import { isNumericFact, type Facts, type NumericFact } from './facts';
import type { Decision, Who } from './port';

/** Who a Rule may be asked about. Ages are whole years. */
export interface Limits {
  minAge?: number;
  maxAge?: number;
  sex?: 'male' | 'female';
  /** smoking status is not 'never' ('unknown' counts) */
  smokedEver?: boolean;
}

/** A test decided in code from age bands: a value at or above `atLeast` for the patient's band means yes. */
export interface Numeric {
  test: string;
  fact: string;
  unit: string;
  bands: { minAge: number; maxAge: number | null; atLeast: number }[];
}

export interface RuleExtras {
  limits?: Limits;
  numeric?: Numeric;
  /** asks: the Rule leads to an urgent ultrasound first. settles: the Rule leads straight to a Referral. */
  scan?: 'asks' | 'settles';
  /** JS regex literal, e.g. "/bloat/i": where the Rule's evidence sits in a note */
  cue?: string;
}

/** A seed Rule row: the Rule type plus the extras. */
export type RuleRow = Rule & RuleExtras;

export interface RuleBookRef {
  rules: RuleRow[];
  severities: Severity[];
}

export interface RuleBook {
  rules: RuleRow[];
  /** in order of first appearance in the seed */
  cancers: CancerType[];
  catalogueCount: Record<CancerType, number>;
  /** true when the Rule may be asked at all for this patient */
  allowed(rule: RuleRow, who: Who): boolean;
  isNumeric(rule: RuleRow): boolean;
  /** FIT and CA-125 style Rules, decided in code on the facts */
  decideNumeric(rule: RuleRow, who: Who, facts: Facts): Decision;
  /** the Rule as the client sees it: no overTime and no extras */
  publicRule(rule: RuleRow): Rule;
  /** where the Rule's evidence sits in a note */
  cue(ruleId: string): RegExp | undefined;
  /** "test needed": a gate test is missing, or an urgent ultrasound comes first */
  testNeeded(args: { cancer: CancerType; age: number; facts: Facts; matched: Pick<MatchedRule, 'rule'>[] }): AidResult['testNeeded'];
  severityFor(cancer: CancerType): Severity | undefined;
}

const bandFor = (n: Numeric, age: number) => n.bands.find((b) => age >= b.minAge && (b.maxAge === null || age <= b.maxAge));

/** Parses "/body/flags" into a RegExp. */
function parseCue(id: string, text: string): RegExp {
  const m = text.match(/^\/([\s\S]+)\/([a-z]*)$/);
  if (!m) throw new Error(`Rule ${id}: cue must be a /regex/flags literal`);
  return new RegExp(m[1], m[2]);
}

export function buildRuleBook(ref: RuleBookRef): RuleBook {
  const rules = ref.rules;
  const byId = new Map(rules.map((r) => [r.id, r]));
  const cancers: CancerType[] = [];
  for (const r of rules) if (!cancers.includes(r.cancer)) cancers.push(r.cancer);
  const catalogueCount = Object.fromEntries(cancers.map((c) => [c, rules.filter((r) => r.cancer === c).length])) as Record<CancerType, number>;

  const cues = new Map<string, RegExp>();
  for (const r of rules) {
    if (r.cue) cues.set(r.id, parseCue(r.id, r.cue));
    if (r.numeric) {
      if (!isNumericFact(r.numeric.fact)) throw new Error(`Rule ${r.id}: numeric.fact "${r.numeric.fact}" is not a numeric fact`);
      if (r.numeric.bands.length === 0) throw new Error(`Rule ${r.id}: numeric needs at least one band`);
    }
  }
  /** the Rule that holds the scan result: the last Rule that settles straight to a Referral */
  const scanResult = [...rules].reverse().find((r) => r.scan === 'settles');

  const book: RuleBook = {
    rules,
    cancers,
    catalogueCount,

    allowed(rule, who) {
      const l = rule.limits;
      if (!l) return true;
      if (l.minAge !== undefined && who.age < l.minAge) return false;
      if (l.maxAge !== undefined && who.age > l.maxAge) return false;
      if (l.sex !== undefined && who.sex !== l.sex) return false;
      if (l.smokedEver && who.smokingStatus === 'never') return false;
      return true;
    },

    isNumeric: (rule) => rule.numeric !== undefined,

    decideNumeric(rule, who, facts) {
      const n = rule.numeric;
      if (!n) return { yes: false };
      const value = facts[n.fact as NumericFact];
      const band = bandFor(n, who.age);
      if (value === undefined || !band || value < band.atLeast) return { yes: false };
      return { yes: true, because: `${n.test} ${value} ${n.unit}.${n.bands.length > 1 ? ` Threshold at age ${who.age} is ${band.atLeast}.` : ''}` };
    },

    publicRule(rule) {
      const { overTime: _o, limits: _l, numeric: _n, scan: _s, cue: _c, ...plain } = rule;
      return plain;
    },

    cue: (ruleId) => cues.get(ruleId),

    testNeeded({ cancer, age, facts, matched }) {
      const row = (m: Pick<MatchedRule, 'rule'>) => byId.get(m.rule.id);
      const asks = matched.filter((m) => row(m)?.scan === 'asks');
      const settled = matched.some((m) => row(m)?.scan === 'settles');
      if (asks.length > 0 && !settled) {
        const first = asks[0].rule;
        return {
          test: 'Urgent ultrasound',
          threshold: '',
          why: `${first.id} says: arrange an urgent direct-access ultrasound of the abdomen and pelvis.${scanResult ? ` Refer if the scan suggests ovarian cancer (${scanResult.id}).` : ''}`,
          source: first.source,
        };
      }
      const gated = matched.filter((m) => m.rule.gate);
      const testMissing = rules.some((r) => r.cancer === cancer && r.numeric && facts[r.numeric.fact as NumericFact] === undefined && bandFor(r.numeric, age));
      if (testMissing && gated.length > 0) {
        const g = gated[0].rule.gate!;
        return {
          test: g.test,
          threshold: g.threshold,
          why: `${cancer === 'colorectal' ? 'Colorectal' : 'Ovarian'} symptom Rules lead to a Referral only after a ${g.test} result.`,
          source: g.source,
        };
      }
      return undefined;
    },

    severityFor: (cancer) => ref.severities.find((s) => s.cancer === cancer),
  };
  return book;
}
