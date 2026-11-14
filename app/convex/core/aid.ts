// The Aid pipeline (docs/SPEC.md "Aid pipeline"), pure: patient + Rule book + ModelPort in, AidResult out. No Convex, no env.
// analyze() is the one place the pipeline order is written. The model sets only the Risk gradient and its reason.
// Research prototype. Not a medical device. Not for clinical use.
import type { AidResult, CancerType, MatchedRule, Patient, TechUsed } from '../../src/data/types';
import { overTimeMatch, type OverTime } from '../lib/overTime';
import { repeatFlag } from '../lib/repeat';
import { severityForPatient } from '../lib/severity';
import { factsJson, mergeFacts, type Facts } from './facts';
import type { Decision, ModelPort, Question, Who } from './port';
import type { RuleBook, RuleRow } from './rulebook';

/** Visits read, and distinct fact sets decided, at most this many in flight. */
const CONCURRENCY = 6;

export interface AidInput {
  patient: Patient;
  book: RuleBook;
  model: ModelPort;
}

/** The Aid plus what Referral filling reuses. */
export interface Analysis {
  aid: AidResult;
  /** facts known up to the last visit */
  facts: Facts;
  /** matched Rules of every cancer, before the suspected cancer is picked */
  allMatched: MatchedRule[];
  repeat: ReturnType<typeof repeatFlag>;
}

/** Drops safety-net advice ("return if rectal bleeding", "sooner if any blood in sputum"): it names a symptom the patient does not have. */
export const withoutSafetyNet = (note: string) => note.replace(/\b(return|sooner|refer|review)\w*\b[^.]*?\bif\b[^.]*\.?/gi, '');

/** The sentence of a note where a Rule's evidence sits (by the Rule's cue), or the visit reason. At most 70 characters. */
export function snippetOf(note: string, reason: string, cue: RegExp | undefined): string {
  const sentences = note.split(/(?<=\.)\s+/);
  const s = (cue && (sentences.find((x) => cue.test(x) && !/^no\b/i.test(x)) ?? sentences.find((x) => cue.test(x)))) || reason;
  return s.length > 70 ? `${s.slice(0, 68).trimEnd()}…` : s;
}

/**
 * Most matched Rules wins. A tie goes to the cancer with more Rules in the catalogue.
 * No match: the fallback from api.ts pickCancer (last visit's symptom group, then sex).
 */
export function pickCancer(
  matched: Pick<MatchedRule, 'rule'>[],
  catalogueCount: Record<CancerType, number>,
  lastSymptom: string,
  sex: 'male' | 'female',
): CancerType {
  const cancers = Object.keys(catalogueCount) as CancerType[];
  const counts = cancers.map((c) => matched.filter((m) => m.rule.cancer === c).length);
  const best = Math.max(...counts);
  if (best > 0) {
    const tied = cancers.filter((_, i) => counts[i] === best);
    return tied.sort((a, b) => catalogueCount[b] - catalogueCount[a])[0];
  }
  return lastSymptom === 'bowel change' ? 'colorectal' : lastSymptom === 'bloating' && sex === 'female' ? 'ovarian' : 'lung';
}

/** The model port names this module accepts. An unknown name is a bug, not a provider to guess. */
function portProvider(name: string): 'stub' | 'gemma' | 'modal-lora' {
  if (name === 'stub' || name === 'gemma' || name === 'modal-lora') return name;
  throw new Error(`Unknown model port "${name}"`);
}

/**
 * Story 40: which tech served each Aid step. Gemma and modal-lora answer the yes/no Rules on the Gemini Decisions API,
 * so the decisions step is 'gemini' there and 'stub' only for the stub port.
 * The Repeat flag here is the symptom-field count (aid:get never runs vector search), so repeat is always 'symptom-match'.
 */
export function techUsedFor(portName: string): TechUsed[] {
  const port = portProvider(portName);
  return [
    { step: 'facts', provider: port },
    { step: 'decisions', provider: port === 'stub' ? 'stub' : 'gemini' },
    { step: 'risk', provider: port },
    { step: 'repeat', provider: 'symptom-match' },
    { step: 'fill', provider: port },
  ];
}

/** Rules backed by more than one visit: the symptom has lasted. */
export const lastingCount = (matched: Pick<MatchedRule, 'visits'>[]) => matched.filter((m) => m.visits.length > 1).length;

/** Runs async work over items with at most `limit` in flight. Keeps order of results. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

export async function analyze({ patient, book, model }: AidInput): Promise<Analysis> {
  const visits = patient.visits;
  if (visits.length === 0) throw new Error(`Patient ${patient.id} has no visits`);
  const who: Who = { age: patient.age, sex: patient.sex, smokingStatus: patient.smokingStatus };

  // 1. Facts per visit (decision 15: every earlier visit is read), then the facts known up to and including each visit.
  const perVisit = await mapLimit(visits, CONCURRENCY, (vis) => model.extractFacts(withoutSafetyNet(vis.note)));
  const cumulative: Facts[] = perVisit.map((_, i) => mergeFacts(perVisit.slice(0, i + 1)));

  // 2. One model call per distinct cumulative-facts set. Rules that may not be asked (age, sex) are left out; numeric Rules are decided in code.
  const asked = book.rules.filter((r) => book.allowed(r, who));
  const questions: Question[] = asked.filter((r) => !book.isNumeric(r)).map((r) => ({ id: r.id, question: r.question }));
  const distinct = new Map<string, Facts>();
  for (const f of cumulative) distinct.set(factsJson(f), f);
  const keys = [...distinct.keys()];
  const answered = await mapLimit(keys, CONCURRENCY, (k) => model.decide({ facts: distinct.get(k)!, who, questions }));
  const byFacts = new Map<string, Record<string, Decision>>(keys.map((k, i) => [k, answered[i]]));
  const decisionAt = (rule: RuleRow, i: number): Decision | undefined =>
    book.isNumeric(rule) ? (book.allowed(rule, who) ? book.decideNumeric(rule, who, cumulative[i]) : undefined) : byFacts.get(factsJson(cumulative[i]))?.[rule.id];

  // 3. overTime across visits, per Rule.
  const allMatched: MatchedRule[] = [];
  for (const rule of book.rules) {
    const hits = visits.flatMap((vis, i) => (decisionAt(rule, i)?.yes ? [{ visitId: vis.id, date: vis.date, i }] : []));
    const ot: OverTime = rule.overTime ?? { pattern: 'single', minVisits: 1, windowDays: null, minDurationDays: null };
    const result = overTimeMatch(ot, hits.map((h) => ({ visitId: h.visitId, date: h.date })));
    if (!result.matches) continue;
    const backing = result.backing.map((b) => {
      const vis = visits.find((x) => x.id === b.visitId)!;
      return { visitId: vis.id, date: vis.date, snippet: snippetOf(vis.note, vis.reason, book.cue(rule.id)) };
    });
    const lastYes = hits[hits.length - 1];
    // The port's fact sentence when it gave one, otherwise the Rule text plus the backing visit's words.
    const because = decisionAt(rule, lastYes.i)?.because ?? `${rule.text}: "${backing[backing.length - 1].snippet}"`;
    allMatched.push({ rule: book.publicRule(rule), because, visits: backing });
  }

  // 4. Suspected cancer, then the Repeat visit flag.
  const last = visits[visits.length - 1];
  const cancer = pickCancer(allMatched, book.catalogueCount, last.symptom, patient.sex);
  const matched = allMatched.filter((m) => m.rule.cancer === cancer);
  const repeat = repeatFlag(visits);

  // 5. Risk gradient (the only model output that reaches the Aid) and its one-line reason. Clamped once, here.
  const risk = await model.risk({
    cancer,
    matched: matched.map((m) => ({ id: m.rule.id, because: m.because })),
    history: {
      visitCount: visits.length,
      repeatVisit: !!repeat,
      lasting: lastingCount(matched),
      age: patient.age,
      sex: patient.sex,
      visits: visits.map((x) => ({ date: x.date, reason: x.reason })),
    },
  });
  const riskGradient = Math.min(10, Math.max(0, Math.round(risk.score)));

  // 6. Gates and the urgent ultrasound, on the facts known so far.
  const facts = cumulative[cumulative.length - 1];
  const testNeeded = book.testNeeded({ cancer, age: patient.age, facts, matched });

  // 7. Severity: the all-ages headline plus the matching age band.
  const sev = book.severityFor(cancer);
  if (!sev) throw new Error(`No severity row for ${cancer}`);

  return {
    aid: {
      suspectedCancer: cancer,
      noRuleMatched: allMatched.length === 0,
      techUsed: techUsedFor(model.name),
      riskGradient,
      riskReason: risk.reason,
      matchedRules: matched,
      severity: severityForPatient(sev, patient.age, patient.sex),
      testNeeded,
    },
    facts,
    allMatched,
    repeat,
  };
}

export async function runAid(input: AidInput): Promise<AidResult> {
  return (await analyze(input)).aid;
}
