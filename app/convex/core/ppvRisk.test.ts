// Published-risk (PPV) combiner: which rows apply, the highest yes row, the source line, and the stub Decisions API.
// The Decisions API is stubbed two ways: decideRowsFromFacts (deterministic) and a hand-written stub. No network.
// Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it } from 'vitest';
import seedPatients from '../seed/patients.json';
import type { CancerType } from '../../src/data/types';
import { emptyFacts, type Facts } from './facts';
import type { Decision, Question, Who } from './port';
import { PPV_ROWS, type PpvRow, type SymptomKey } from './ppvRows';
import {
  decideRowsFromFacts,
  formatPublishedRisk,
  ppvQuestionsFor,
  ppvRiskFrom,
  reasonWithPublishedRisk,
  symptomQuestion,
  SYMPTOM_FACTS,
  type PublishedRisk,
} from './ppvRisk';

type SeedPatient = { id: string; age: number; sex: 'male' | 'female'; smokingStatus: Who['smokingStatus'] };
const seedWho = (id: string): Who => {
  const p = (seedPatients as SeedPatient[]).find((x) => x.id === id);
  if (!p) throw new Error(`no seed patient ${id}`);
  return { age: p.age, sex: p.sex, smokingStatus: p.smokingStatus };
};

// Who the cases are about. Matti, Anneli and Sirpa come from the seed file, so the facts below match the notes.
const matti = seedWho('SYN-001');
const anneli = seedWho('SYN-002');
const sirpa = seedWho('SYN-003');
const control: Who = { age: 45, sex: 'female', smokingStatus: 'never' };
const man65: Who = { age: 65, sex: 'male', smokingStatus: 'never' };
const woman62: Who = { age: 62, sex: 'female', smokingStatus: 'never' };
const woman60: Who = { age: 60, sex: 'female', smokingStatus: 'never' };
const woman30: Who = { age: 30, sex: 'female', smokingStatus: 'never' };

// Facts read from the notes (the latest value wins for numbers; see docs/build/mock-patients.json).
// Matti: blood streaks in sputum on the third visit, 4 kg lost, appetite down, tired, cough 10 weeks, 30 pack-years.
const mattiFacts: Facts = { ...emptyFacts(), haemoptysis: true, weightLossKg: 4, appetiteLoss: true, tired: true, coughWeeks: 10, packYears: 30 };
// Anneli: rectal bleeding on visits 2 and 3, Hb 98 g/L (9.8 g/dL), ferritin 6 (iron deficiency), FIT 186, 67 kg to 64 kg.
const anneliFacts: Facts = {
  ...emptyFacts(),
  bowelChange: true,
  bowelWeeks: 14,
  rectalBleeding: true,
  hb: 98,
  ironDeficiency: true,
  fit: 186,
  weightLossKg: 3,
  tired: true,
  breathless: true,
  ovarianSymptoms: ['bloating'],
};
// Sirpa: bloating, early fullness, pelvic pain, poor appetite, CA-125 180 IU/mL, 1 kg lost. Abdominal distension has no fact.
const sirpaFacts: Facts = {
  ...emptyFacts(),
  ovarianSymptoms: ['bloating', 'early fullness', 'pelvic pain'],
  appetiteLoss: true,
  weightLossKg: 1,
  ca125: 180,
};

const rowById = (id: string): PpvRow => {
  const row = PPV_ROWS.find((r) => r.id === id);
  if (!row) throw new Error(`no row ${id}`);
  return row;
};

const yes = (because?: string): Decision => (because === undefined ? { yes: true } : { yes: true, because });

/** The real flow: ask the (stubbed) Decisions API the suspected cancer's questions, then combine. */
const riskFromStub = (cancer: CancerType, who: Who, facts: Facts) =>
  ppvRiskFrom(cancer, who, decideRowsFromFacts(facts, who, ppvQuestionsFor(cancer, who)));

/** Hand-written Decisions API: yes only to the chosen ids, no to every other question asked. */
const handStub = (chosen: Record<string, Decision>) => (questions: Question[]): Record<string, Decision> =>
  Object.fromEntries(questions.map((q) => [q.id, chosen[q.id] ?? { yes: false }]));

const riskFromHandStub = (cancer: CancerType, who: Who, chosen: Record<string, Decision>) =>
  ppvRiskFrom(cancer, who, handStub(chosen)(ppvQuestionsFor(cancer, who)));

/** One row's answer from the deterministic stub. */
const decideOne = (id: string, who: Who, facts: Facts): Decision =>
  decideRowsFromFacts(facts, who, [{ id, question: rowById(id).question }])[id];

const KNOWN_CANCERS: CancerType[] = ['lung', 'colorectal', 'ovarian'];

describe('SYMPTOM_FACTS: how the stub decides each symptom from Facts', () => {
  it('has an entry for every symptom key used by PPV_ROWS', () => {
    const used = new Set<SymptomKey>(PPV_ROWS.flatMap((r) => r.symptoms));
    for (const key of used) expect(key in SYMPTOM_FACTS, key).toBe(true);
  });

  it('is null exactly for the six symptoms with no Facts field', () => {
    const unmapped = Object.entries(SYMPTOM_FACTS)
      .filter(([, v]) => v === null)
      .map(([k]) => k)
      .sort();
    expect(unmapped).toEqual([
      'abdominal-distension',
      'abdominal-pain',
      'chest-pain',
      'diarrhoea',
      'postmenopausal-bleeding',
      'urinary-frequency',
    ]);
  });
});

describe('decideRowsFromFacts: the deterministic stub of the Decisions API', () => {
  it('answers yes to a mapped row with a because line naming the fact', () => {
    const d = decideOne('LUNG-PPV-06', matti, mattiFacts);
    expect(d.yes).toBe(true);
    expect(d.because?.toLowerCase()).toContain('haemoptysis');
  });

  it('answers no to a row whose symptom has no fact (only the real API can answer those)', () => {
    expect(decideOne('COLO-PPV-07', woman60, { ...emptyFacts(), chestSigns: 'reduced entry' })).toEqual({ yes: false });
  });

  it('answers no to a cough row that needs a visit count, because the stub cannot count visits', () => {
    expect(decideOne('LUNG-PPV-19', matti, mattiFacts).yes).toBe(false);
    expect(decideOne('LUNG-PPV-20', matti, mattiFacts).yes).toBe(false);
  });

  it('answers no for a row that does not apply by age or sex', () => {
    expect(decideOne('LUNG-PPV-06', woman62, mattiFacts).yes).toBe(false);
  });

  it('answers a pair row yes only when both symptoms are yes (distension has no fact, so no)', () => {
    expect(decideOne('OVAR-PPV-08', woman60, { ...emptyFacts(), appetiteLoss: true }).yes).toBe(false);
  });

  it('uses the row sex for the iron-deficiency Hb cut-off, in g/L: men below 110, women below 100', () => {
    const ironDeficient = { ...emptyFacts(), ironDeficiency: true };
    expect(decideOne('COLO-PPV-13', man65, { ...ironDeficient, hb: 105 }).yes).toBe(true);
    expect(decideOne('COLO-PPV-13', man65, { ...ironDeficient, hb: 110 }).yes).toBe(false);
    expect(decideOne('COLO-PPV-14', anneli, { ...ironDeficient, hb: 105 }).yes).toBe(false);
    expect(decideOne('COLO-PPV-14', anneli, { ...ironDeficient, hb: 98 }).yes).toBe(true);
  });

  it('reads the low-haemoglobin cut-off (9.9 g/dL) from Hb in g/L: 98 is yes, 99 is no', () => {
    expect(decideOne('COLO-PPV-15', anneli, { ...emptyFacts(), hb: 98 }).yes).toBe(true);
    expect(decideOne('COLO-PPV-15', anneli, { ...emptyFacts(), hb: 99 }).yes).toBe(false);
  });

  it('answers every question it is given', () => {
    const questions = ppvQuestionsFor('colorectal', anneli);
    const out = decideRowsFromFacts(anneliFacts, anneli, questions);
    expect(Object.keys(out).sort()).toEqual(questions.map((q) => q.id).sort());
  });
});

describe('ppvQuestionsFor: only the rows that can apply by code', () => {
  it('excludes male-only rows for a woman', () => {
    const ids = ppvQuestionsFor('colorectal', anneli).map((q) => q.id);
    expect(ids).toContain('COLO-PPV-22');
    expect(ids).not.toContain('COLO-PPV-19');
    expect(ids).not.toContain('COLO-PPV-13');
    for (const id of ids) expect(['female', null]).toContain(rowById(id).sex);
  });

  it('excludes 40+ rows for a 30-year-old', () => {
    const ids = ppvQuestionsFor('colorectal', woman30).map((q) => q.id);
    expect(ids).toContain('COLO-PPV-18');
    expect(ids).not.toContain('COLO-PPV-01');
    expect(ids).not.toContain('COLO-PPV-02');
    for (const id of ids) {
      const r = rowById(id);
      expect(r.ageMin === null || r.ageMin <= 30).toBe(true);
      expect(r.ageMax === null || r.ageMax >= 30).toBe(true);
    }
  });

  it('gives question ids that are unique and belong to the asked cancer only, with the row question minus age and sex', () => {
    for (const cancer of KNOWN_CANCERS) {
      for (const who of [matti, anneli, sirpa, control]) {
        const questions = ppvQuestionsFor(cancer, who);
        const ids = questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const q of questions) {
          expect(rowById(q.id).cancer).toBe(cancer);
          expect(q.question).toBe(symptomQuestion(rowById(q.id).question));
        }
      }
    }
  });
});

describe('symptomQuestion: the Decisions API is asked the symptom only', () => {
  it('drops each age and sex clause form', () => {
    expect(symptomQuestion('Has the patient had haemoptysis (coughing up blood) on any visit, and is the patient a man aged 55 to 64?')).toBe(
      'Has the patient had haemoptysis (coughing up blood) on any visit?',
    );
    expect(symptomQuestion('Has X, and is the patient a man?')).toBe('Has X?');
    expect(symptomQuestion('Has X, and is the patient a woman aged 50 or over?')).toBe('Has X?');
    expect(symptomQuestion('Has X, and is the patient aged 40 to 69?')).toBe('Has X?');
    expect(symptomQuestion('Has X?')).toBe('Has X?');
  });

  it('leaves no age or sex in any question sent (the API input has no age or sex)', () => {
    for (const r of PPV_ROWS) expect(symptomQuestion(r.question)).not.toMatch(/\b(aged|a man|a woman)\b/);
  });

  it('Matti: an API that cannot see age or sex still gives the 55-64 male row, 8.37%, not the all-ages 7.5%', () => {
    // The live bug: the API answered no to "a man aged 55 to 64?" (it is never told the age), so LUNG-PPV-13 won.
    const decisions = Object.fromEntries(
      ppvQuestionsFor('lung', matti).map((q) => [q.id, { yes: /haemoptysis/.test(q.question) && !/aged|a man|a woman/.test(q.question) }]),
    );
    const r = ppvRiskFrom('lung', matti, decisions)!;
    expect(r.rowId).toBe('LUNG-PPV-06');
    expect(r.pct).toBe(8.37);
  });
});

describe('reasonWithPublishedRisk: the AI reason never carries its own published figure', () => {
  const box = (): PublishedRisk => riskFromStub('lung', matti, mattiFacts)!;
  const live = 'Haemoptysis on the third visit: published lung risk 8.38% (Jones 2007 BMJ), at or above the NICE 3% threshold.';

  it("Matti: the model's 8.38% (the women 65-74 row) becomes the box's 8.4%, and the NICE 3% stays", () => {
    expect(reasonWithPublishedRisk(live, box())).toBe(
      'Haemoptysis on the third visit: published lung risk 8.4% (Jones 2007 BMJ), at or above the NICE 3% threshold.',
    );
  });

  it('removes the figure and its source when there is no box', () => {
    expect(reasonWithPublishedRisk(live, null)).toBe('Haemoptysis on the third visit: published lung risk, at or above the NICE 3% threshold.');
  });

  it('leaves a reason with no figure unchanged', () => {
    expect(reasonWithPublishedRisk('Blood in sputum and weight loss in a smoker.', box())).toBe('Blood in sputum and weight loss in a smoker.');
  });
});

describe('ppvRiskFrom: the published risk for a patient', () => {
  it('Matti (62 M, haemoptysis): the 55-64 male haemoptysis row, 8.37%, wins', () => {
    const r = riskFromStub('lung', matti, mattiFacts);
    expect(r).not.toBeNull();
    expect(r!.rowId).toBe('LUNG-PPV-06');
    expect(r!.pct).toBe(8.37);
    expect(r!.isLowerBound).toBe(false);
    expect(r!.aboveNg12Threshold).toBe(true);
    expect(r!.cancer).toBe('lung');
    expect(r!.row).toBe(rowById('LUNG-PPV-06'));
    expect(r!.sourceUrl).toBe('https://pmc.ncbi.nlm.nih.gov/articles/PMC1871798/');
    expect(r!.sourceLabel).toContain('Jones 2007 BMJ');
  });

  it('Anneli (58 F, colorectal): the female iron-deficiency anaemia row, 7.7%, wins', () => {
    const r = riskFromStub('colorectal', anneli, anneliFacts);
    expect(r!.rowId).toBe('COLO-PPV-14');
    expect(r!.pct).toBe(7.7);
    expect(r!.aboveNg12Threshold).toBe(true);
  });

  it('Sirpa (57 F, ovarian): the CA-125 50-or-over row, 12.5%, wins', () => {
    const r = riskFromStub('ovarian', sirpa, sirpaFacts);
    expect(r!.rowId).toBe('OVAR-PPV-10');
    expect(r!.pct).toBe(12.5);
    expect(r!.aboveNg12Threshold).toBe(true);
  });

  it('a patient with no mapped facts gets null for all three cancers', () => {
    for (const cancer of KNOWN_CANCERS) expect(riskFromStub(cancer, control, emptyFacts())).toBeNull();
  });

  it('keeps the narrowest age band in a group: a 62-year-old woman with rectal bleeding gets the 55-64 row', () => {
    const r = riskFromHandStub('colorectal', woman62, {
      'COLO-PPV-01': yes(),
      'COLO-PPV-02': yes(),
      'COLO-PPV-17': yes(),
      'COLO-PPV-22': yes(),
    });
    expect(r!.rowId).toBe('COLO-PPV-22');
    expect(r!.pct).toBe(2.75);
  });

  it('the narrowest band beats a wider one even when the wider one is higher (65-year-old man, weight loss)', () => {
    const r = riskFromHandStub('colorectal', man65, { 'COLO-PPV-04': yes(), 'COLO-PPV-05': yes() });
    expect(r!.rowId).toBe('COLO-PPV-05');
    expect(r!.pct).toBe(0.74);
    expect(r!.aboveNg12Threshold).toBe(false);
  });

  it('on a tie in band width, the sex-specific row beats the sex-null row', () => {
    const r = riskFromHandStub('colorectal', woman62, { 'COLO-PPV-01': yes(), 'COLO-PPV-17': yes() });
    expect(r!.rowId).toBe('COLO-PPV-17');
    expect(r!.pct).toBe(2.0);
  });

  it('never adds or multiplies: two yes rows in different groups give the highest single row', () => {
    const r = riskFromHandStub('lung', matti, { 'LUNG-PPV-06': yes(), 'LUNG-PPV-16': yes(), 'LUNG-PPV-22': yes() });
    expect(r!.rowId).toBe('LUNG-PPV-06');
    expect(r!.pct).toBe(8.37);
  });

  it('ignores unknown ids and ids of another cancer', () => {
    expect(ppvRiskFrom('lung', matti, { 'NOT-A-ROW': yes(), 'COLO-PPV-22': yes('x') })).toBeNull();
  });

  it('ignores a row answered yes:false', () => {
    const r = ppvRiskFrom('lung', matti, { 'LUNG-PPV-06': { yes: false, because: 'no' }, 'LUNG-PPV-16': yes() });
    expect(r!.rowId).toBe('LUNG-PPV-16');
    expect(r!.pct).toBe(1.2);
  });

  it('applies the age and sex check in code too: a yes for a row that does not apply is ignored', () => {
    expect(ppvRiskFrom('lung', woman62, { 'LUNG-PPV-06': yes() })).toBeNull();
  });

  it('returns null when no row is yes', () => {
    expect(ppvRiskFrom('lung', matti, {})).toBeNull();
  });

  it('uses the decision because when given, and the row question when not', () => {
    expect(ppvRiskFrom('lung', matti, { 'LUNG-PPV-06': yes('Coughed up blood') })!.because).toBe('Coughed up blood');
    expect(ppvRiskFrom('lung', matti, { 'LUNG-PPV-06': yes() })!.because).toBe(rowById('LUNG-PPV-06').question);
    expect(ppvRiskFrom('lung', matti, { 'LUNG-PPV-06': yes('   ') })!.because).toBe(rowById('LUNG-PPV-06').question);
  });

  it('a pair row with both symptoms yes gives the 5% lower bound', () => {
    const r = riskFromHandStub('ovarian', woman60, { 'OVAR-PPV-08': yes('Swollen belly and no appetite') });
    expect(r!.rowId).toBe('OVAR-PPV-08');
    expect(r!.pct).toBe(5);
    expect(r!.isLowerBound).toBe(true);
    expect(r!.aboveNg12Threshold).toBe(true);
  });
});

describe('formatPublishedRisk: the one-line source text', () => {
  const base: PublishedRisk = riskFromStub('lung', matti, mattiFacts)!;

  it('shows one decimal and the short source label', () => {
    expect(formatPublishedRisk(base)).toBe('Published risk: 8.4% (Jones 2007 BMJ)');
  });

  it('shows a lower bound as "or more"', () => {
    const pair = riskFromHandStub('ovarian', woman60, { 'OVAR-PPV-08': yes() })!;
    expect(formatPublishedRisk(pair)).toBe('Published risk: 5% or more (Hamilton 2009 BMJ)');
  });

  it('keeps only the text before the first comma of a long label', () => {
    expect(formatPublishedRisk(riskFromStub('ovarian', sirpa, sirpaFacts)!)).toBe(
      'Published risk: 12.5% (NICE NG12 evidence review B (CA125))',
    );
  });

  it('shows values under 1% with two decimals', () => {
    expect(formatPublishedRisk({ ...base, pct: 0.36 })).toBe('Published risk: 0.36% (Jones 2007 BMJ)');
  });

  it('does not say "decided by Gemini" (the UI adds that)', () => {
    expect(formatPublishedRisk(base).toLowerCase()).not.toContain('gemini');
  });
});

describe('data integrity of PPV_ROWS', () => {
  it('every row has a question, a quote and an https source url, and a positive pct', () => {
    for (const r of PPV_ROWS) {
      expect(r.question.trim(), r.id).not.toBe('');
      expect(r.quote.trim(), r.id).not.toBe('');
      expect(r.source.url, r.id).toMatch(/^https:\/\//);
      expect(r.ppvPct, r.id).toBeGreaterThan(0);
    }
  });

  it('every row id is unique and every cancer is one of the three', () => {
    const ids = PPV_ROWS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of PPV_ROWS) expect(KNOWN_CANCERS, r.id).toContain(r.cancer);
  });
});
