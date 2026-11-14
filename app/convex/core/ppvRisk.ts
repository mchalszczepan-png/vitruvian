// Published-risk evidence (PPV): which rows can apply, the yes/no questions for the Decisions API, and the highest yes row.
// Pure: no env, Convex, fetch or node imports. It never calls a model. The caller passes the Decisions API answers in.
// Research prototype. Not a medical device. Not for clinical use.
import type { CancerType } from '../../src/data/types';
import type { Facts } from './facts';
import type { Decision, Question, Who } from './port';
import { NG12_THRESHOLD_PCT, PPV_ROWS, type PpvRow, type SymptomKey } from './ppvRows';

export interface PublishedRisk {
  cancer: CancerType;
  /** the published PPV of the chosen row, in percent */
  pct: number;
  /** true when the row's PPV is a floor, shown as "X% or more" */
  isLowerBound: boolean;
  rowId: string;
  row: PpvRow;
  sourceLabel: string;
  sourceUrl: string;
  /** the Decisions API's reason for the yes, or the row question when it gave none */
  because: string;
  /** pct is at or above the NICE NG12 3% threshold. A note only: the GP decides. */
  aboveNg12Threshold: boolean;
}

/** How the stub decides one symptom from Facts. `fact` is the phrase used in the because-line. */
export interface SymptomFact {
  fact: string;
  /** rowSex is the row's sex, which sets the iron-deficiency Hb cut-off */
  holds: (facts: Facts, rowSex: PpvRow['sex']) => boolean;
}

/** facts.hb is in g/L (the note regex reads "Hb 98 g/L"). The PPV cut-offs are written in g/dL, so divide by 10. */
const GL_PER_GDL = 10;

/**
 * Every SymptomKey, mapped to its Facts test, or null when no Facts field holds it.
 * A null symptom can only be decided by the real Decisions API (from the notes); the stub answers no.
 */
export const SYMPTOM_FACTS: Record<SymptomKey, SymptomFact | null> = {
  haemoptysis: { fact: 'haemoptysis recorded', holds: (f) => f.haemoptysis },
  // Cough rows that need a visit count are answered no by the stub (see decideRow).
  cough: { fact: 'cough recorded', holds: (f) => (f.coughWeeks ?? 0) > 0 },
  'weight-loss': { fact: 'weight loss recorded', holds: (f) => (f.weightLossKg ?? 0) > 0 },
  breathlessness: { fact: 'breathlessness recorded', holds: (f) => f.breathless },
  fatigue: { fact: 'tiredness recorded', holds: (f) => f.tired },
  'appetite-loss': { fact: 'appetite loss recorded', holds: (f) => f.appetiteLoss },
  'rectal-bleeding': { fact: 'rectal bleeding recorded', holds: (f) => f.rectalBleeding },
  'low-haemoglobin': { fact: 'Hb below 9.9 g/dL', holds: (f) => f.hb !== undefined && f.hb / GL_PER_GDL < 9.9 },
  'iron-deficiency-anaemia': {
    fact: 'iron deficiency with Hb below the sex cut-off',
    // Men below 11 g/dL, women below 10 g/dL. No row has a null sex, so null takes the women's cut-off.
    holds: (f, rowSex) => f.ironDeficiency && f.hb !== undefined && f.hb / GL_PER_GDL < (rowSex === 'male' ? 11 : 10),
  },
  bloating: { fact: 'bloating recorded', holds: (f) => f.ovarianSymptoms.includes('bloating') },
  'raised-ca125': { fact: 'CA-125 35 U/mL or more', holds: (f) => f.ca125 !== undefined && f.ca125 >= 35 },
  'chest-pain': null,
  'abdominal-pain': null,
  diarrhoea: null,
  'abdominal-distension': null,
  'postmenopausal-bleeding': null,
  'urinary-frequency': null,
};

const ROW_BY_ID = new Map<string, PpvRow>(PPV_ROWS.map((r) => [r.id, r]));

/** The row's age band and sex limit the patient, checked in code before any question is asked. Null means open. */
function rowApplies(row: PpvRow, who: Who): boolean {
  return (row.sex === null || row.sex === who.sex) && (row.ageMin === null || who.age >= row.ageMin) && (row.ageMax === null || who.age <= row.ageMax);
}

/** ", and is the patient a man aged 55 to 64?" and the like. Age and sex are checked in code (rowApplies). */
const WHO_CLAUSE = /, and is the patient (?:a (?:wo)?man)?(?: ?aged [^?]+)?\?$/;

/**
 * The row question without its age and sex clause. The Decisions API input holds the facts only, not the age or sex,
 * so it answered "no" to "a man aged 55 to 64?" for a 62-year-old man and the wider all-ages row won.
 */
export const symptomQuestion = (question: string): string => question.replace(WHO_CLAUSE, '?');

/** The questions for one cancer's rows that can apply to this person. The caller asks only the suspected cancer. */
export function ppvQuestionsFor(cancer: CancerType, who: Who): Question[] {
  return PPV_ROWS.filter((r) => r.cancer === cancer && rowApplies(r, who)).map((r) => ({ id: r.id, question: symptomQuestion(r.question) }));
}

/** The stub Decisions API: the same yes/no per question as the real one, decided from Facts. Unknown ids get no. */
export function decideRowsFromFacts(facts: Facts, who: Who, questions: Question[]): Record<string, Decision> {
  return Object.fromEntries(questions.map((q) => [q.id, decideRow(facts, who, ROW_BY_ID.get(q.id))]));
}

function decideRow(facts: Facts, who: Who, row: PpvRow | undefined): Decision {
  // Visit counts are not in Facts, so a row that needs a count is left to the real Decisions API.
  if (!row || !rowApplies(row, who) || row.visitsRequired !== undefined) return { yes: false };
  const holding: string[] = [];
  // A pair row is yes only when every one of its symptoms is yes.
  for (const key of row.symptoms) {
    const test = SYMPTOM_FACTS[key];
    if (!test || !test.holds(facts, row.sex)) return { yes: false };
    holding.push(test.fact);
  }
  const text = holding.join(' and ');
  return { yes: true, because: `${text.charAt(0).toUpperCase()}${text.slice(1)}.` };
}

const compare = (a: number | string, b: number | string): number => (a < b ? -1 : a > b ? 1 : 0);
/** Open ends (null) count as the widest band. */
const bandWidth = (r: PpvRow): number => (r.ageMin === null || r.ageMax === null ? Infinity : r.ageMax - r.ageMin);
const sexRank = (r: PpvRow): number => (r.sex === null ? 1 : 0);
const tierRank = (r: PpvRow): number => (r.tier === 'primary' ? 0 : 1);

/** Within one symptom group: narrowest band, then sex-specific, then primary, then lower id. */
const narrowerFirst = (a: PpvRow, b: PpvRow): number =>
  compare(bandWidth(a), bandWidth(b)) || compare(sexRank(a), sexRank(b)) || compare(tierRank(a), tierRank(b)) || compare(a.id, b.id);

/** Across groups: highest PPV, then primary, then lower id. */
const higherFirst = (a: PpvRow, b: PpvRow): number => compare(b.ppvPct, a.ppvPct) || compare(tierRank(a), tierRank(b)) || compare(a.id, b.id);

/**
 * The published risk for a patient. Only this cancer's rows that apply by code AND were answered yes count.
 * Yes rows are grouped by symptom set; each group keeps its narrowest band; the highest PPV wins.
 * Nothing is added or multiplied. No yes row gives null.
 */
export function ppvRiskFrom(cancer: CancerType, who: Who, decisions: Record<string, Decision>): PublishedRisk | null {
  const groups = new Map<string, PpvRow[]>();
  for (const row of PPV_ROWS) {
    if (row.cancer !== cancer || !rowApplies(row, who) || decisions[row.id]?.yes !== true) continue;
    const key = [...row.symptoms].sort().join(' + ');
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const groupWinners = [...groups.values()].map((rows) => [...rows].sort(narrowerFirst)[0]);
  const best = [...groupWinners].sort(higherFirst)[0];
  if (!best) return null;

  const decision = decisions[best.id];
  return {
    cancer,
    pct: best.ppvPct,
    isLowerBound: best.ppvIsLowerBound,
    rowId: best.id,
    row: best,
    sourceLabel: best.source.label,
    sourceUrl: best.source.url,
    because: decision.because?.trim() ? decision.because : best.question,
    aboveNg12Threshold: best.ppvPct >= NG12_THRESHOLD_PCT,
  };
}

/** Two decimals under 1%, one decimal above. Trailing zeros are dropped: 5 not 5.0, 0.5 not 0.50. */
const formatPct = (pct: number): string => String(Number(pct.toFixed(pct < 1 ? 2 : 1)));

/** "8.4% (Jones 2007 BMJ)". A lower bound reads "5% or more". The source is the label before its first comma. */
const valueAndSource = (r: PublishedRisk): string =>
  `${formatPct(r.pct)}%${r.isLowerBound ? ' or more' : ''} (${r.sourceLabel.split(',')[0].trim()})`;

/** "Published risk: 8.4% (Jones 2007 BMJ)". */
export function formatPublishedRisk(r: PublishedRisk): string {
  return `Published risk: ${valueAndSource(r)}`;
}

/** A percentage with its optional "(source)", except the NICE "3% threshold". */
const PCT_FIGURE = /\b\d+(?:\.\d+)?\s?%(?!\s*threshold)(?:\s*\([^)]*\))?/g;

/**
 * The risk model's reason with every published figure replaced by the box's value and source, or removed when there is
 * no box. The box (ppvRiskFrom) is the only source of the published risk, so one card never shows two numbers.
 */
export function reasonWithPublishedRisk(reason: string, r: PublishedRisk | null | undefined): string {
  return reason
    .replace(PCT_FIGURE, r ? valueAndSource(r) : '')
    .replace(/\s+([,.;)])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
