// The only module the UI calls for data. Every function is async so Convex can replace the mock later.
// Research prototype. Not a medical device. Not for clinical use.
import rawPatients from '../../../docs/build/mock-patients.json';
import rawPatientsFi from '../../../docs/build/mock-patients.fi.json';
import * as convex from './convexBackend';
import { countyGap } from './mock/county';
import { rules, severity } from './mock/rules';
import { S } from './mock/sources';
import { demoStaging, stagingTemplates } from './mock/staging';
import { referralTemplates } from './mock/templates';
import type {
  AidResult,
  CancerType,
  CountyGap,
  FieldValues,
  MatchedRule,
  Patient,
  Referral,
  ReferralTemplate,
  ReferralView,
  RepeatVisitFlag,
  Rule,
  SmokingStatus,
  StagingReport,
  StagingTemplate,
  Visit,
} from './types';
import { toReferralView } from './referralSummary';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------- Patients ---------- */

interface RawPatient {
  patientId: string;
  name: string;
  age: number;
  sex: 'male' | 'female';
  smokingStatus: SmokingStatus;
  wellbeingServicesCounty: string;
  visits: { date: string; reason: string; gpNote: string }[];
}

/** Finnish twin of rawPatients (same order, visit counts and dates). */
const rawFiByPatient = new Map((rawPatientsFi as RawPatient[]).map((p) => [p.patientId, p]));

/** Symptom groups for the Repeat visit flag. Order matters: the first match wins. */
const SYMPTOM_GROUPS: [string, RegExp][] = [
  ['asthma', /asthma|wheeze/i],
  ['cough', /cough|sputum/i],
  ['bowel change', /bowel|stool|fit\b|rectal/i],
  ['bloating', /bloat|fullness|full early/i],
  ['reflux', /reflux|heartburn/i],
  ['back pain', /back pain/i],
];

function symptomOf(reason: string): string {
  return SYMPTOM_GROUPS.find(([, re]) => re.test(reason))?.[0] ?? reason.toLowerCase();
}

const patients: Patient[] = (rawPatients as RawPatient[]).map((p) => {
  const fi = rawFiByPatient.get(p.patientId);
  return {
    id: p.patientId,
    name: p.name,
    age: p.age,
    sex: p.sex,
    smokingStatus: p.smokingStatus,
    county: p.wellbeingServicesCounty,
    visits: p.visits.map(
      (v, i): Visit => ({
        id: `${p.patientId}-v${i + 1}`,
        date: v.date,
        reason: v.reason,
        symptom: symptomOf(v.reason),
        note: v.gpNote,
        reasonFi: fi?.visits[i]?.reason,
        gpNoteFi: fi?.visits[i]?.gpNote,
      }),
    ),
  };
});

async function mockGetPatients(): Promise<Patient[]> {
  return patients;
}

async function mockGetPatient(id: string): Promise<Patient | undefined> {
  return patients.find((p) => p.id === id);
}

/** Repeat visit: 3 or more visits for the same symptom group within 6 months, counting today's visit. */
export const REPEAT_RULE = { minVisits: 3, windowMonths: 6 };

export function repeatVisit(p: Patient): RepeatVisitFlag | undefined {
  const today = p.visits.at(-1);
  if (!today) return undefined;
  const from = new Date(today.date);
  from.setMonth(from.getMonth() - REPEAT_RULE.windowMonths);
  const same = p.visits.filter((v) => v.symptom === today.symptom && new Date(v.date) >= from);
  if (same.length < REPEAT_RULE.minVisits) return undefined;
  return { symptom: today.symptom, count: same.length, windowMonths: REPEAT_RULE.windowMonths, visitIds: same.map((v) => v.id) };
}

/* ---------- Mock Gemma: facts from the notes ---------- */

interface Facts {
  latest: string;
  all: string;
  coughWeeks?: number;
  haemoptysis: boolean;
  weightLossKg?: number;
  appetiteLoss: boolean;
  tired: boolean;
  breathless: boolean;
  chestSigns?: string;
  packYears?: number;
  bowelChange: boolean;
  bowelWeeks?: number;
  rectalBleeding: boolean;
  abdominalMass: boolean;
  hb?: number;
  ironDeficiency: boolean;
  fit?: number;
  rectalExam?: string;
  ovarianSymptoms: string[];
  ca125?: number;
  ultrasoundSuggests: boolean;
  ascitesOrMass: boolean;
  exam?: string;
  tests: string[];
  medicines?: string;
}

const neg = (text: string, word: string) => new RegExp(`\\bno (\\w+ ){0,2}${word}|not noticed any ${word}|${word}[^.]*not noticed`, 'i').test(text);
const sentenceWith = (text: string, re: RegExp) => text.split(/(?<=\.)\s+/).find((s) => re.test(s))?.trim();
const lastNum = (text: string, re: RegExp) => {
  const all = [...text.matchAll(re)];
  return all.length ? Number(all.at(-1)![1]) : undefined;
};

function readFacts(p: Patient): Facts {
  const latest = p.visits.at(-1)?.note ?? '';
  const all = p.visits.map((v) => v.note).join(' ');
  const weightPair = latest.match(/weight (\d+) kg, was (\d+) kg/i);
  const tests: string[] = [];
  const hb = lastNum(latest, /Hb (\d+) g\/L/gi);
  if (hb) tests.push(`Hb ${hb} g/L`);
  const fit = lastNum(all, /FIT[^.]*?(\d+) µg Hb\/g/gi);
  if (fit !== undefined) tests.push(`FIT ${fit} µg Hb/g`);
  const crp = lastNum(latest, /CRP (\d+)/gi);
  if (crp !== undefined) tests.push(`CRP ${crp}`);
  const ca125 = lastNum(all, /CA-?125[^.]*?(\d+) (?:IU|U|kU)/gi);
  if (ca125 !== undefined) tests.push(`CA-125 ${ca125} IU/mL`);
  const spo2 = latest.match(/SpO2 (\d+)%/);
  if (spo2) tests.push(`SpO2 ${spo2[1]}% on air`);
  const examSentence = sentenceWith(latest, /chest:|chest clear|abdomen|DRE|rectal exam/i);
  return {
    latest,
    all,
    coughWeeks: /cough/i.test(latest) ? lastNum(latest, /(\d+) weeks/gi) : undefined,
    haemoptysis: /coughed up[^.]*blood|blood in sputum|blood streak/i.test(latest) && !neg(latest, 'blood'),
    weightLossKg: weightPair ? Number(weightPair[2]) - Number(weightPair[1]) : lastNum(latest, /lost about (\d+) kg/gi),
    appetiteLoss: /appetite (still |slightly )?(down|poor|loss)|loss of appetite|eating less/i.test(latest),
    tired: /tired|fatigue/i.test(latest),
    breathless: /breathless/i.test(latest) && !neg(latest, 'breathless'),
    chestSigns: /reduced (air )?entry|dull/i.test(latest) ? sentenceWith(latest, /reduced (air )?entry|dull/i) : undefined,
    packYears: lastNum(all, /(\d+) pack-years/gi) ?? (/20 a day for 30 years/.test(all) ? 30 : undefined),
    bowelChange: /bowel habit|bowel change|looser stools/i.test(all),
    bowelWeeks: /bowel/i.test(latest) ? lastNum(latest, /(\d+) weeks/gi) : undefined,
    rectalBleeding: /rectal bleeding|blood on (toilet paper|glove)|bright red blood/i.test(latest),
    abdominalMass: /\bmass\b/i.test(latest) && !/no (palpable )?mass|no mass felt/i.test(latest),
    hb,
    ironDeficiency: /iron-deficiency anaemia/i.test(latest) || (lastNum(latest, /ferritin (\d+)/gi) ?? 99) < 15,
    fit,
    rectalExam: sentenceWith(latest, /rectal exam/i),
    ovarianSymptoms: [
      /bloat/i.test(latest) && 'bloating',
      /full (quickly|early)|early (fullness|satiety)|feels full/i.test(latest) && 'early fullness',
      /(pelvic|abdominal) (pain|discomfort)/i.test(latest) && 'pelvic pain',
      /urinary (urgency|frequency)|passing urine more often/i.test(latest) && !/no urinary/i.test(latest) && 'urinary urgency',
    ].filter(Boolean) as string[],
    ca125,
    ultrasoundSuggests: /(ultrasound|scan)[^.]*(suggest|suspicious|complex|solid)/i.test(latest) && !/scan is abnormal|if the scan/i.test(sentenceWith(latest, /(ultrasound|scan)[^.]*(suggest|suspicious|complex|solid)/i) ?? ''),
    ascitesOrMass: /ascites|pelvic mass|adnexal mass/i.test(latest) && !/no (ascites|pelvic mass|adnexal mass)/i.test(latest),
    exam: examSentence,
    tests,
    medicines: sentenceWith(all, /tamsulosin|salbutamol|oral iron|iron infusion/i),
  };
}

/* ---------- Rule matching (mock Decisions API) ---------- */

type Check = (f: Facts, p: Patient) => string | false;

/** NG12 Table 1 (2026) CA-125 thresholds by age band, IU/mL. Under 40: CA-125 not used alone (OVAR-08). */
function ca125Limit(age: number): number | undefined {
  if (age < 40) return undefined;
  if (age < 50) return 35;
  if (age < 60) return 31;
  if (age < 70) return 24;
  if (age < 80) return 25;
  return 31;
}

const symptomList = (f: Facts) =>
  [f.coughWeeks && 'cough', f.tired && 'tiredness', f.breathless && 'breathlessness', f.weightLossKg && 'weight loss', f.appetiteLoss && 'appetite loss'].filter(
    Boolean,
  ) as string[];

const checks: Record<string, Check> = {
  'lung-haemoptysis': (f, p) => p.age >= 40 && f.haemoptysis && 'Coughed up blood, no cause found. Age 40+.',
  'lung-two-symptoms': (f, p) => p.age >= 40 && symptomList(f).length >= 2 && `${symptomList(f).join(', ')}. Age 40+.`,
  'lung-smoker-symptom': (f, p) =>
    p.age >= 40 && p.smokingStatus !== 'never' && symptomList(f).length >= 1 && `${p.smokingStatus === 'former' ? 'Ex-smoker' : 'Smoker'}${f.packYears ? `, ${f.packYears} pack-years` : ''}, with ${symptomList(f)[0]}.`,
  'lung-chest-signs': (f) => !!f.chestSigns && f.chestSigns,
  'crc-fit': (f) => f.fit !== undefined && f.fit >= 10 && `FIT ${f.fit} µg Hb/g.`,
  'crc-abdo-mass': (f) => f.abdominalMass && 'Abdominal mass in the note.',
  'crc-bowel-habit': (f) => f.bowelChange && `Change in bowel habit${f.bowelWeeks ? `, ${f.bowelWeeks} weeks` : ''}.`,
  'crc-ida': (f) => f.ironDeficiency && `Iron-deficiency anaemia${f.hb ? `, Hb ${f.hb} g/L` : ''}.`,
  'crc-anaemia-60': (f, p) => p.age >= 60 && !!f.hb && f.hb < (p.sex === 'female' ? 117 : 134) && `Hb ${f.hb} g/L. Age 60+.`,
  'crc-bleeding-50': (f, p) => p.age >= 50 && (f.rectalBleeding || !!f.weightLossKg) && [f.rectalBleeding && 'Rectal bleeding', f.weightLossKg && `${f.weightLossKg} kg weight loss`].filter(Boolean).join(', ') + '. Age 50+.',
  'crc-bleeding-under-50': (f, p) => p.age < 50 && f.rectalBleeding && !!f.weightLossKg && 'Rectal bleeding with weight loss. Under 50.',
  // Ovarian, OVAR-01 to OVAR-08 (docs/build/rules.md). CA-125 uses NG12 2026 age bands.
  'OVAR-01': (f) => f.ascitesOrMass && 'Ascites or pelvic mass in the note.',
  'OVAR-02': (f, p) => p.sex === 'female' && f.ovarianSymptoms.includes('bloating') && 'Bloating in the notes.',
  'OVAR-03': (f, p) => p.sex === 'female' && (f.ovarianSymptoms.includes('early fullness') || f.appetiteLoss) && [f.ovarianSymptoms.includes('early fullness') && 'Early fullness', f.appetiteLoss && 'poor appetite'].filter(Boolean).join(', ') + '.',
  'OVAR-04': (f, p) => p.sex === 'female' && f.ovarianSymptoms.includes('pelvic pain') && 'Pelvic pain on and off.',
  'OVAR-05': (f, p) => p.sex === 'female' && f.ovarianSymptoms.includes('urinary urgency') && 'Urinary urgency or frequency.',
  'OVAR-06': (f, p) => {
    const limit = ca125Limit(p.age);
    return p.sex === 'female' && limit !== undefined && f.ca125 !== undefined && f.ca125 >= limit && `CA-125 ${f.ca125} IU/mL. Threshold at age ${p.age} is ${limit}.`;
  },
  'OVAR-07': (f) => f.ultrasoundSuggests && 'Ultrasound suggests ovarian cancer.',
  'OVAR-08': (f, p) => p.sex === 'female' && p.age <= 39 && f.ovarianSymptoms.length > 0 && `${f.ovarianSymptoms.join(', ')}. Age 39 or under.`,
};

/** Words that show where a Rule's evidence sits in a note, for the visit snippet. */
const cue: Record<string, RegExp> = {
  'lung-haemoptysis': /blood/i,
  'lung-two-symptoms': /cough|breathless|tired|lost|appetite/i,
  'lung-smoker-symptom': /cough/i,
  'lung-chest-signs': /reduced (air )?entry|dull/i,
  'crc-fit': /FIT/,
  'crc-abdo-mass': /\bmass\b/i,
  'crc-bowel-habit': /bowel|stools/i,
  'crc-ida': /iron|ferritin|Hb/i,
  'crc-anaemia-60': /Hb/i,
  'crc-bleeding-50': /bleeding|blood|weight|lost/i,
  'crc-bleeding-under-50': /bleeding|blood/i,
  'OVAR-01': /ascites|mass/i,
  'OVAR-02': /bloat/i,
  'OVAR-03': /full|appetite|eating less/i,
  'OVAR-04': /pelvic|abdominal pain/i,
  'OVAR-05': /urin/i,
  'OVAR-06': /CA-?125/i,
  'OVAR-07': /ultrasound|scan/i,
  'OVAR-08': /bloat|full|pelvic|urin/i,
};

function snippetOf(v: Visit, ruleId: string): string {
  const re = cue[ruleId];
  const sentences = v.note.split(/(?<=\.)\s+/);
  const s = (re && (sentences.find((x) => re.test(x) && !/^no\b/i.test(x)) ?? sentences.find((x) => re.test(x)))) || v.reason;
  return s.length > 70 ? `${s.slice(0, 68).trimEnd()}…` : s;
}

/**
 * BUILD-PLAN decision 15: the Aid reads today's note and every earlier visit.
 * A Rule matches on the whole history, and keeps the visits whose notes back it.
 */
/** Drops safety-net advice ("return if rectal bleeding", "sooner if any blood in sputum"): it names a symptom the patient does not have. */
const withoutSafetyNet = (note: string) => note.replace(/\b(return|sooner|refer|review)\w*\b[^.]*?\bif\b[^.]*\.?/gi, '');

function matchRules(p: Patient, f: Facts): MatchedRule[] {
  const perVisit = p.visits.map((v) => ({ v, f: readFacts({ ...p, visits: [{ ...v, note: withoutSafetyNet(v.note) }] }) }));
  return rules.flatMap((rule: Rule) => {
    const check = checks[rule.id];
    if (!check) return [];
    const hits = perVisit.filter((x) => check(x.f, p));
    const because = check(f, p) || (hits.length > 0 && check(hits.at(-1)!.f, p));
    if (!because) return [];
    const backing = hits.length > 0 ? hits.map((x) => x.v) : [p.visits.at(-1)!];
    return [{ rule, because, visits: backing.map((v) => ({ visitId: v.id, date: v.date, snippet: snippetOf(v, rule.id) })) }];
  });
}

const CANCERS: CancerType[] = ['lung', 'colorectal', 'ovarian'];

function pickCancer(p: Patient, matched: MatchedRule[]): CancerType {
  const counts = CANCERS.map((c) => matched.filter((m) => m.rule.cancer === c).length);
  const best = Math.max(...counts);
  if (best > 0) return CANCERS[counts.indexOf(best)];
  const s = p.visits.at(-1)?.symptom;
  return s === 'bowel change' ? 'colorectal' : s === 'bloating' && p.sex === 'female' ? 'ovarian' : 'lung';
}

/** Rules seen on more than one visit: the symptom has lasted. */
const lasting = (matched: MatchedRule[]) => matched.filter((m) => m.visits.length > 1).length;

/** Placeholder Risk gradient until the model is wired: matched Rules, any Rule seen on 2+ visits, Repeat visit and age. */
function riskOf(p: Patient, matched: MatchedRule[]): number {
  const raw = matched.length * 1.5 + (lasting(matched) > 0 ? 1 : 0) + (repeatVisit(p) ? 1 : 0) + (p.age >= 60 ? 1 : 0);
  return Math.min(10, Math.round(raw));
}

/* ---------- Public API ---------- */

async function mockGetReferralTemplate(cancer: CancerType): Promise<ReferralTemplate> {
  return referralTemplates[cancer];
}

async function mockGetAid(patientId: string): Promise<AidResult> {
  await wait(500);
  const p = patients.find((x) => x.id === patientId)!;
  const f = readFacts(p);
  const allMatched = matchRules(p, f);
  const cancer = pickCancer(p, allMatched);
  const matched = allMatched.filter((m) => m.rule.cancer === cancer);
  const repeat = repeatVisit(p);
  // Placeholder gradient until the model is wired: matched Rules, any Rule seen on 2+ visits, Repeat visit and age.
  const riskGradient = riskOf(p, matched);
  const gated = matched.filter((m) => m.rule.gate);
  const gateMissing = (cancer === 'colorectal' && f.fit === undefined) || (cancer === 'ovarian' && f.ca125 === undefined && p.age >= 40);
  const has = (id: string) => matched.some((m) => m.rule.id === id);
  const scanFirst = cancer === 'ovarian' && (has('OVAR-06') || has('OVAR-08')) && !has('OVAR-01') && !has('OVAR-07');
  const scanRule = matched.find((m) => m.rule.id === 'OVAR-06' || m.rule.id === 'OVAR-08');
  const testNeeded: AidResult['testNeeded'] = scanFirst
    ? {
        test: 'Urgent ultrasound',
        threshold: '',
        why: `${scanRule!.rule.id} says: arrange an urgent direct-access ultrasound of the abdomen and pelvis. Refer if the scan suggests ovarian cancer (OVAR-07).`,
        source: scanRule!.rule.source,
      }
    : gateMissing && gated.length > 0
      ? {
          test: gated[0].rule.gate!.test,
          threshold: gated[0].rule.gate!.threshold,
          why: `${cancer === 'colorectal' ? 'Colorectal' : 'Ovarian'} symptom Rules lead to a Referral only after a ${gated[0].rule.gate!.test} result.`,
          source: gated[0].rule.gate!.source,
        }
      : undefined;
  return {
    suspectedCancer: cancer,
    riskGradient,
    riskReason: `${matched.length} matched Rule${matched.length === 1 ? '' : 's'}${lasting(matched) ? ` (${lasting(matched)} seen on 2+ visits)` : ''}${repeat ? ', Repeat visit' : ''}${p.age >= 60 ? ', age 60+' : ''}. Read from ${p.visits.length === 1 ? "today's note" : `today's note and ${p.visits.length - 1} earlier visit${p.visits.length === 2 ? '' : 's'}`}.`,
    matchedRules: matched,
    severity: severity[cancer],
    testNeeded,
  };
}

/** Mock of Gemma reading the notes into the Referral template. Every value keeps the note words it came from. */
async function mockFillTemplateFromNote(patientId: string, cancer: CancerType, matched: MatchedRule[]): Promise<FieldValues> {
  await wait(1200);
  const p = patients.find((x) => x.id === patientId)!;
  const f = readFacts(p);
  const today = p.visits.at(-1)!;
  const repeat = repeatVisit(p);
  const v: FieldValues = {};
  const g = (key: string, value: string | number | undefined | false, evidence?: string) => {
    if (value === undefined || value === false || value === '') return;
    v[key] = { value: String(value), origin: 'gemma', evidence };
  };
  const rec = (key: string, value: string | number) => {
    v[key] = { value: String(value), origin: 'record', evidence: 'From the record system' };
  };
  const ev = (re: RegExp) => sentenceWith(f.latest, re) ?? sentenceWith(f.all, re);
  rec('patientId', p.id);
  rec('age', p.age);
  rec('sex', p.sex);
  rec('referringGpId', 'GP-DEMO-01');
  g('smokingStatus', p.smokingStatus, ev(/smok/i));
  g('packYears', f.packYears, ev(/pack-years|a day for/i));
  g('mainSymptom', today.reason, 'Visit reason');
  g('symptomDurationWeeks', f.coughWeeks ?? f.bowelWeeks ?? (cancer === 'ovarian' ? lastNum(f.latest, /(\d+) weeks/gi) : undefined), ev(/weeks/i));
  g('symptomVisitCount', repeat?.count ?? p.visits.filter((x) => x.symptom === today.symptom).length, 'Visit history');
  g('examFindings', f.exam, f.exam);
  g('generalCondition', f.tired ? 'Tired' : /looks well|well/i.test(f.latest) ? 'Well' : undefined, ev(/tired|well/i));
  g('weightLossKg', f.weightLossKg, ev(/kg/i));
  g('testsDone', f.tests.join('; '), ev(/FBC|CA-?125|FIT|CRP/i));
  g('currentMedicines', f.medicines ? f.medicines : undefined, f.medicines);
  g('suspectedDiagnosis', `Suspected ${cancer} cancer`);
  g('suspectedCancerType', cancer);
  g('urgency', /urgent/i.test(f.latest) ? 'urgent_2_week' : undefined, ev(/urgent/i));
  rec('referralDate', today.date);
  g('gpQuestion', `Please assess for suspected ${cancer} cancer and arrange the next investigations.`, ev(/plan|referral/i));
  g('riskGradientAiEstimate', riskOf(p, matched), 'Aid');
  g('matchedRuleIds', matched.map((m) => m.rule.id).join(', '), 'Aid');
  if (cancer === 'lung') {
    const sym = symptomList(f);
    const map: Record<string, string> = { cough: 'cough', tiredness: 'fatigue', breathlessness: 'breathlessness', 'weight loss': 'weight_loss', 'appetite loss': 'appetite_loss' };
    g('lungSymptoms', sym.map((s) => map[s]).join(', '), ev(/cough/i));
    g('haemoptysis', f.haemoptysis ? 'yes' : 'no', ev(/blood/i));
    g('chestXrayResult', /chest x-ray today|x-ray requested/i.test(f.latest) ? 'not_done' : undefined, ev(/x-ray/i));
  }
  if (cancer === 'colorectal') {
    g('bowelHabitChange', f.bowelChange ? 'yes' : 'no', ev(/bowel/i));
    g('rectalBleeding', f.rectalBleeding ? 'yes' : 'no', ev(/blood|bleeding/i));
    g('abdominalMass', f.abdominalMass ? 'yes' : 'no', ev(/mass/i));
    g('ironDeficiencyAnaemia', f.ironDeficiency ? 'yes' : 'no', ev(/iron|ferritin/i));
    g('haemoglobinGPerL', f.hb, ev(/Hb/));
    g('fitDone', f.fit !== undefined ? 'yes' : 'no', ev(/FIT/));
    g('fitValueUgHbPerG', f.fit, ev(/FIT/));
    g('rectalExamResult', f.rectalExam ? (/no mass/i.test(f.rectalExam) ? 'normal' : 'abnormal') : undefined, f.rectalExam);
  }
  if (cancer === 'ovarian') {
    // docs/build/referral-templates.md Part 4. Fields the notes do not mention stay empty for the GP.
    const sym = f.ovarianSymptoms;
    const ca125Visit = p.visits.find((x) => /CA-?125 sent/i.test(x.note));
    g('bloatingOrDistension', sym.includes('bloating') ? 'yes' : 'no', ev(/bloat/i));
    g('earlySatietyOrAppetiteLoss', sym.includes('early fullness') || f.appetiteLoss ? 'yes' : 'no', ev(/full|appetite/i));
    g('pelvicOrAbdominalPain', sym.includes('pelvic pain') ? 'yes' : 'no', ev(/pain/i));
    g('urinarySymptoms', sym.includes('urinary urgency') ? 'yes' : 'no', ev(/urin/i));
    g('ascites', /ascites/i.test(f.latest) ? (/no ascites/i.test(f.latest) ? 'no' : 'yes') : undefined, ev(/ascites/i));
    g('palpableMass', /mass/i.test(f.latest) ? (/no (palpable )?mass/i.test(f.latest) ? 'no' : 'yes') : undefined, ev(/mass/i));
    g('ca125Done', f.ca125 !== undefined ? 'yes' : 'no', ev(/CA-?125/i));
    g('ca125ValueIuPerMl', f.ca125, ev(/CA-?125[^.]*IU/i));
    g('ca125Date', f.ca125 !== undefined && ca125Visit ? ca125Visit.date : undefined, ca125Visit && sentenceWith(ca125Visit.note, /CA-?125 sent/i));
    g('pelvicUltrasoundResult', /ultrasound/i.test(f.latest) && !f.ultrasoundSuggests ? 'not_done' : undefined, ev(/ultrasound/i));
    g('menopausalStatus', /postmenopausal/i.test(f.all) ? 'postmenopausal' : /premenopausal|periods regular/i.test(f.all) ? 'premenopausal' : undefined, ev(/menopaus|periods/i));
  }
  return v;
}

/* ---------- Referral desk (in memory) ---------- */

const sent: Referral[] = [];

async function mockSendReferral(r: Referral): Promise<Referral> {
  await wait(400);
  const i = sent.findIndex((x) => x.id === r.id);
  if (i >= 0) sent[i] = r;
  else sent.unshift(r);
  return r;
}

/** The Referral desk sees the view without the Risk gradient, built from the same visits, template and Rules as Convex. */
async function mockGetReferrals(): Promise<ReferralView[]> {
  return sent.map((r) => {
    const patient = patients.find((p) => p.id === r.patientId)!;
    return toReferralView(r, { visits: patient.visits, template: referralTemplates[r.cancer], rules });
  });
}

/* ---------- Specialist and county ---------- */

async function mockGetStagingTemplate(cancer: CancerType): Promise<StagingTemplate> {
  return stagingTemplates[cancer];
}

async function mockGetDemoStaging(cancer: CancerType): Promise<StagingReport> {
  return structuredClone(demoStaging[cancer]);
}

async function mockGetCountyGap(): Promise<CountyGap> {
  return countyGap;
}

export const MOCK_NOTICE = {
  gemma: 'Gemma is mocked in this prototype: rule-based reading of today’s note and every earlier visit.',
  gradient: 'Placeholder until the model is wired.',
  source: S.ng12Sites,
};

/* ---------- Backend switch: VITE_BACKEND=mock|convex (default mock), story 41 fallback ---------- */

const CONVEX_TIMEOUT_MS = 30_000;
let convexFellBack = false;

function backend(): 'mock' | 'convex' {
  return import.meta.env.VITE_BACKEND === 'convex' ? 'convex' : 'mock';
}

/** 'mock', 'convex', or 'convex-fallback' after a Convex call failed and the mock answered. For a status line in the UI. */
export function activeBackend(): 'mock' | 'convex' | 'convex-fallback' {
  if (backend() === 'mock') return 'mock';
  return convexFellBack ? 'convex-fallback' : 'convex';
}

async function viaConvex<T>(name: string, call: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  if (backend() === 'mock') return fallback();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      call(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`timed out after ${CONVEX_TIMEOUT_MS} ms`)), CONVEX_TIMEOUT_MS);
      }),
    ]);
    convexFellBack = false;
    return result;
  } catch (err) {
    convexFellBack = true;
    console.warn(`[vitruvian] Convex ${name} failed, using the mock: ${err instanceof Error ? err.message : String(err)}`);
    return fallback();
  } finally {
    clearTimeout(timer);
  }
}

export function getPatients(): Promise<Patient[]> {
  return viaConvex('getPatients', () => convex.getPatients(), mockGetPatients);
}

export function getPatient(id: string): Promise<Patient | undefined> {
  return viaConvex('getPatient', () => convex.getPatient(id), () => mockGetPatient(id));
}

/** Repeat visit flag from the backend. The sync `repeatVisit(p)` above stays for screens that already hold the patient. */
export function getRepeatVisit(patientId: string): Promise<RepeatVisitFlag | undefined> {
  return viaConvex('getRepeatVisit', () => convex.getRepeatVisit(patientId), async () => {
    const p = patients.find((x) => x.id === patientId);
    return p ? repeatVisit(p) : undefined;
  });
}

export function getReferralTemplate(cancer: CancerType): Promise<ReferralTemplate> {
  return viaConvex('getReferralTemplate', () => convex.getReferralTemplate(cancer), () => mockGetReferralTemplate(cancer));
}

export function getAid(patientId: string): Promise<AidResult> {
  return viaConvex('getAid', () => convex.getAid(patientId), () => mockGetAid(patientId));
}

export function fillTemplateFromNote(patientId: string, cancer: CancerType, matched: MatchedRule[]): Promise<FieldValues> {
  return viaConvex('fillTemplateFromNote', () => convex.fillTemplateFromNote(patientId, cancer, matched), () =>
    mockFillTemplateFromNote(patientId, cancer, matched),
  );
}

export function sendReferral(r: Referral): Promise<Referral> {
  return viaConvex('sendReferral', () => convex.sendReferral(r), () => mockSendReferral(r));
}

export function getReferrals(): Promise<ReferralView[]> {
  return viaConvex('getReferrals', () => convex.getReferrals(), mockGetReferrals);
}

export function getStagingTemplate(cancer: CancerType): Promise<StagingTemplate> {
  return viaConvex('getStagingTemplate', () => convex.getStagingTemplate(cancer), () => mockGetStagingTemplate(cancer));
}

export function getDemoStaging(cancer: CancerType): Promise<StagingReport> {
  return viaConvex('getDemoStaging', () => convex.getDemoStaging(cancer), () => mockGetDemoStaging(cancer));
}

export function getCountyGap(): Promise<CountyGap> {
  return viaConvex('getCountyGap', () => convex.getCountyGap(), mockGetCountyGap);
}
