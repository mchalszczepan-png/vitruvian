// @vitest-environment node
// The Rule book against the code it replaced: the old ruleAllowed, the old FIT / CA-125 checks and the old gate (testNeededFor),
// copied here as they were. If the seed extras (docs/build/rule-extras.json) ever drift from rules.md behaviour, this fails.
// Also keeps the stub's check table in step with the seed Rules. Research prototype. Not a medical device.
import { describe, expect, it } from 'vitest';
import rules from '../seed/rules.json';
import severities from '../seed/severity.json';
import { buildRuleBook, type RuleRow } from './rulebook';
import { emptyFacts, type Facts } from './facts';
import { STUB_CHECKED } from './ports/stub';

const book = buildRuleBook({ rules: rules as RuleRow[], severities: severities as never });
const row = (id: string) => book.rules.find((r) => r.id === id)!;
type Who = { age: number; sex: 'male' | 'female'; smokingStatus: 'never' | 'former' | 'current' | 'unknown' };

/* ---- the old code, verbatim ---- */
function oldRuleAllowed(ruleId: string, p: Who): boolean {
  const age = p.age;
  switch (ruleId) {
    case 'LUNG-01': case 'LUNG-02': case 'LUNG-03': case 'LUNG-05': case 'LUNG-06': case 'LUNG-07': case 'LUNG-08': case 'LUNG-09':
      return ruleId === 'LUNG-01' || age >= 40;
    case 'LUNG-04': return age >= 40 && p.smokingStatus !== 'never';
    case 'COLO-06': return age >= 60;
    case 'COLO-07': return age >= 40;
    case 'COLO-08': return age >= 50;
    case 'COLO-09': return age < 50;
    case 'OVAR-02': case 'OVAR-03': case 'OVAR-04': case 'OVAR-05': case 'OVAR-06': return p.sex === 'female';
    case 'OVAR-08': return p.sex === 'female' && age <= 39;
    default: return true;
  }
}
function oldCa125Limit(age: number): number | undefined {
  if (age < 40) return undefined;
  if (age < 50) return 35;
  if (age < 60) return 31;
  if (age < 70) return 24;
  if (age < 80) return 25;
  return 31;
}
function oldTestNeeded(cancer: string, age: number, fit: number | undefined, ca125: number | undefined, matched: { rule: { id: string; source: unknown; gate?: { test: string; threshold: string; source: unknown } } }[]) {
  const has = (id: string) => matched.some((m) => m.rule.id === id);
  const gated = matched.filter((m) => m.rule.gate);
  const gateMissing = (cancer === 'colorectal' && fit === undefined) || (cancer === 'ovarian' && ca125 === undefined && age >= 40);
  const scanFirst = cancer === 'ovarian' && (has('OVAR-06') || has('OVAR-08')) && !has('OVAR-01') && !has('OVAR-07');
  const scanRule = matched.find((m) => m.rule.id === 'OVAR-06' || m.rule.id === 'OVAR-08');
  if (scanFirst && scanRule) {
    return { test: 'Urgent ultrasound', threshold: '', why: `${scanRule.rule.id} says: arrange an urgent direct-access ultrasound of the abdomen and pelvis. Refer if the scan suggests ovarian cancer (OVAR-07).`, source: scanRule.rule.source };
  }
  if (gateMissing && gated.length > 0) {
    const g = gated[0].rule.gate!;
    return { test: g.test, threshold: g.threshold, why: `${cancer === 'colorectal' ? 'Colorectal' : 'Ovarian'} symptom Rules lead to a Referral only after a ${g.test} result.`, source: g.source };
  }
  return undefined;
}

describe('Rule book equals the code it replaced', () => {
  it('derives the cancers and counts from the seed', () => {
    expect(book.cancers).toEqual(['lung', 'colorectal', 'ovarian']);
    expect(book.catalogueCount).toEqual({ lung: 9, colorectal: 9, ovarian: 8 });
  });

  it('allowed() equals ruleAllowed for every Rule, age 0 to 100, sex and smoking', () => {
    for (const r of book.rules) {
      for (let age = 0; age <= 100; age++) {
        for (const sex of ['male', 'female'] as const) {
          for (const smokingStatus of ['never', 'former', 'current', 'unknown'] as const) {
            const who = { age, sex, smokingStatus };
            expect(book.allowed(r, who), `${r.id} ${age} ${sex} ${smokingStatus}`).toBe(oldRuleAllowed(r.id, who));
          }
        }
      }
    }
  });

  it('numeric Rules equal the old FIT cut-off and CA-125 age bands, with the same sentence', () => {
    for (let age = 0; age <= 100; age++) {
      const who = { age, sex: 'female', smokingStatus: 'never' } as const;
      for (let value = 0; value <= 60; value++) {
        const fit = book.decideNumeric(row('COLO-01'), who, { ...emptyFacts(), fit: value });
        expect(fit.yes).toBe(value >= 10);
        if (fit.yes) expect(fit.because).toBe(`FIT ${value} µg Hb/g.`);
        const limit = oldCa125Limit(age);
        const ca = book.decideNumeric(row('OVAR-06'), who, { ...emptyFacts(), ca125: value });
        expect(ca.yes, `CA-125 ${value} at ${age}`).toBe(limit !== undefined && value >= limit);
        if (ca.yes) expect(ca.because).toBe(`CA-125 ${value} IU/mL. Threshold at age ${age} is ${limit}.`);
      }
      expect(book.decideNumeric(row('COLO-01'), who, emptyFacts()).yes).toBe(false);
    }
  });

  it('testNeeded() equals the old gate for the FIT, CA-125 and ultrasound cases', () => {
    const sets: Record<string, string[]> = {
      colorectal: ['', 'COLO-04', 'COLO-01', 'COLO-04,COLO-01'],
      ovarian: ['', 'OVAR-02', 'OVAR-06', 'OVAR-08', 'OVAR-06,OVAR-07', 'OVAR-01,OVAR-08', 'OVAR-02,OVAR-06', 'OVAR-02,OVAR-03'],
      lung: ['', 'LUNG-02'],
    };
    const pub = (id: string) => ({ rule: book.publicRule(row(id)) });
    for (const [cancer, lists] of Object.entries(sets)) {
      for (const list of lists) {
        const matched = list ? list.split(',').map(pub) : [];
        for (const age of [30, 39, 40, 55, 70, 85]) {
          for (const fit of [undefined, 12]) {
            for (const ca125 of [undefined, 50]) {
              const facts: Facts = { ...emptyFacts(), fit, ca125 };
              const got = book.testNeeded({ cancer: cancer as never, age, facts, matched });
              expect(got, `${cancer} [${list}] age ${age} fit ${fit} ca125 ${ca125}`).toEqual(oldTestNeeded(cancer, age, fit, ca125, matched as never));
            }
          }
        }
      }
    }
  });

  it('publicRule leaves no seed extras on the Rule the client sees', () => {
    for (const r of book.rules) expect(Object.keys(book.publicRule(r)).filter((k) => ['overTime', 'limits', 'numeric', 'scan', 'cue'].includes(k))).toEqual([]);
  });
});

describe('stub check table', () => {
  // Rules the stub has never had a check for: they answer no in stub mode (api.ts mock parity).
  const NO_STUB_CHECK = ['LUNG-01', 'LUNG-05', 'LUNG-06', 'LUNG-07', 'LUNG-08', 'COLO-03', 'COLO-07'];

  it('has a check for every seed Rule that is not numeric and not on the no-check list, and no check for anything else', () => {
    const numeric = book.rules.filter((r) => r.numeric).map((r) => r.id);
    const expected = book.rules.map((r) => r.id).filter((id) => !numeric.includes(id) && !NO_STUB_CHECK.includes(id));
    expect([...STUB_CHECKED].sort()).toEqual(expected.sort());
  });
});
