// Deterministic stub port. Used by tests and the offline demo (MODEL_PROVIDER=stub).
// Ported from app/src/data/api.ts (readFacts, checks, riskOf, fillTemplateFromNote); the Rule ids are the docs ids.
// FIT (COLO-01) and CA-125 (OVAR-06) are not here: numeric Rules are decided in code from the Rule's bands in every mode.
// Research prototype. Not a medical device. Not for clinical use.
import type { Facts } from '../facts';
import type { Decision, FillInput, ModelPort, PatientView, Who } from '../port';
import type { FillOutput } from '../../model/contract';

const neg = (text: string, word: string) => new RegExp(`\\bno (\\w+ ){0,2}${word}|not noticed any ${word}|${word}[^.]*not noticed`, 'i').test(text);
const sentenceWith = (text: string, re: RegExp) => text.split(/(?<=\.)\s+/).find((s) => re.test(s))?.trim();
const lastNum = (text: string, re: RegExp) => {
  const all = [...text.matchAll(re)];
  return all.length ? Number(all.at(-1)![1]) : undefined;
};

/** Facts from one visit's note (safety-net sentences already removed by the caller). */
export function readFacts(note: string): Facts {
  const weightPair = note.match(/weight (\d+) kg, was (\d+) kg/i);
  const tests: string[] = [];
  const hb = lastNum(note, /Hb (\d+) g\/L/gi);
  if (hb) tests.push(`Hb ${hb} g/L`);
  const fit = lastNum(note, /FIT[^.]*?(\d+) µg Hb\/g/gi);
  if (fit !== undefined) tests.push(`FIT ${fit} µg Hb/g`);
  const crp = lastNum(note, /CRP (\d+)/gi);
  if (crp !== undefined) tests.push(`CRP ${crp}`);
  const ca125 = lastNum(note, /CA-?125[^.]*?(\d+) (?:IU|U|kU)/gi);
  if (ca125 !== undefined) tests.push(`CA-125 ${ca125} IU/mL`);
  const spo2 = note.match(/SpO2 (\d+)%/);
  if (spo2) tests.push(`SpO2 ${spo2[1]}% on air`);
  const examSentence = sentenceWith(note, /chest:|chest clear|abdomen|DRE|rectal exam/i);
  const f: Facts = {
    coughWeeks: /cough/i.test(note) ? lastNum(note, /(\d+) weeks/gi) : undefined,
    haemoptysis: /coughed up[^.]*blood|blood in sputum|blood streak/i.test(note) && !neg(note, 'blood'),
    weightLossKg: weightPair ? Number(weightPair[2]) - Number(weightPair[1]) : lastNum(note, /lost about (\d+) kg/gi),
    appetiteLoss: /appetite (still |slightly )?(down|poor|loss)|loss of appetite|eating less/i.test(note),
    tired: /tired|fatigue/i.test(note),
    breathless: /breathless/i.test(note) && !neg(note, 'breathless'),
    chestSigns: /reduced (air )?entry|dull/i.test(note) ? sentenceWith(note, /reduced (air )?entry|dull/i) : undefined,
    packYears: lastNum(note, /(\d+) pack-years/gi) ?? (/20 a day for 30 years/.test(note) ? 30 : undefined),
    bowelChange: /bowel habit|bowel change|looser stools/i.test(note),
    bowelWeeks: /bowel/i.test(note) ? lastNum(note, /(\d+) weeks/gi) : undefined,
    rectalBleeding: /rectal bleeding|blood on (toilet paper|glove)|bright red blood/i.test(note),
    abdominalMass: /\bmass\b/i.test(note) && !/no (palpable )?mass|no mass felt/i.test(note),
    hb,
    ironDeficiency: /iron-deficiency anaemia/i.test(note) || (lastNum(note, /ferritin (\d+)/gi) ?? 99) < 15,
    fit,
    rectalExam: sentenceWith(note, /rectal exam/i),
    ovarianSymptoms: [
      /bloat/i.test(note) && 'bloating',
      /full (quickly|early)|early (fullness|satiety)|feels full/i.test(note) && 'early fullness',
      /(pelvic|abdominal) (pain|discomfort)/i.test(note) && 'pelvic pain',
      /urinary (urgency|frequency)|passing urine more often/i.test(note) && !/no urinary/i.test(note) && 'urinary urgency',
    ].filter(Boolean) as string[],
    ca125,
    ultrasoundSuggests: /(ultrasound|scan)[^.]*(suggest|suspicious|complex|solid)/i.test(note) && !/scan is abnormal|if the scan/i.test(sentenceWith(note, /(ultrasound|scan)[^.]*(suggest|suspicious|complex|solid)/i) ?? ''),
    ascitesOrMass: /ascites|pelvic mass|adnexal mass/i.test(note) && !/no (ascites|pelvic mass|adnexal mass)/i.test(note),
    exam: examSentence,
    tests,
    medicines: sentenceWith(note, /tamsulosin|salbutamol|oral iron|iron infusion/i),
  };
  return f;
}

export const symptomList = (f: Facts) =>
  [f.coughWeeks && 'cough', f.tired && 'tiredness', f.breathless && 'breathlessness', f.weightLossKg && 'weight loss', f.appetiteLoss && 'appetite loss'].filter(Boolean) as string[];

type Check = (f: Facts, p: Who) => string | false;

/** Mock checks keyed by docs Rule ids. Rules the mock never had (LUNG-01, LUNG-05..08, COLO-03, COLO-07) have no check and answer no. */
const checks: Record<string, Check> = {
  'LUNG-02': (f, p) => p.age >= 40 && f.haemoptysis && 'Coughed up blood, no cause found. Age 40+.',
  'LUNG-03': (f, p) => p.age >= 40 && symptomList(f).length >= 2 && `${symptomList(f).join(', ')}. Age 40+.`,
  'LUNG-04': (f, p) =>
    p.age >= 40 && p.smokingStatus !== 'never' && symptomList(f).length >= 1 && `${p.smokingStatus === 'former' ? 'Ex-smoker' : 'Smoker'}${f.packYears ? `, ${f.packYears} pack-years` : ''}, with ${symptomList(f)[0]}.`,
  'LUNG-09': (f) => !!f.chestSigns && f.chestSigns,
  'COLO-02': (f) => f.abdominalMass && 'Abdominal mass in the note.',
  'COLO-04': (f) => f.bowelChange && `Change in bowel habit${f.bowelWeeks ? `, ${f.bowelWeeks} weeks` : ''}.`,
  'COLO-05': (f) => f.ironDeficiency && `Iron-deficiency anaemia${f.hb ? `, Hb ${f.hb} g/L` : ''}.`,
  'COLO-06': (f, p) => p.age >= 60 && !!f.hb && f.hb < (p.sex === 'female' ? 117 : 134) && `Hb ${f.hb} g/L. Age 60+.`,
  'COLO-08': (f, p) => p.age >= 50 && (f.rectalBleeding || !!f.weightLossKg) && [f.rectalBleeding && 'Rectal bleeding', f.weightLossKg && `${f.weightLossKg} kg weight loss`].filter(Boolean).join(', ') + '. Age 50+.',
  'COLO-09': (f, p) => p.age < 50 && f.rectalBleeding && !!f.weightLossKg && 'Rectal bleeding with weight loss. Under 50.',
  'OVAR-01': (f) => f.ascitesOrMass && 'Ascites or pelvic mass in the note.',
  'OVAR-02': (f, p) => p.sex === 'female' && f.ovarianSymptoms.includes('bloating') && 'Bloating in the notes.',
  'OVAR-03': (f, p) => p.sex === 'female' && (f.ovarianSymptoms.includes('early fullness') || f.appetiteLoss) && [f.ovarianSymptoms.includes('early fullness') && 'Early fullness', f.appetiteLoss && 'poor appetite'].filter(Boolean).join(', ') + '.',
  'OVAR-04': (f, p) => p.sex === 'female' && f.ovarianSymptoms.includes('pelvic pain') && 'Pelvic pain on and off.',
  'OVAR-05': (f, p) => p.sex === 'female' && f.ovarianSymptoms.includes('urinary urgency') && 'Urinary urgency or frequency.',
  'OVAR-07': (f) => f.ultrasoundSuggests && 'Ultrasound suggests ovarian cancer.',
  'OVAR-08': (f, p) => p.sex === 'female' && p.age <= 39 && f.ovarianSymptoms.length > 0 && `${f.ovarianSymptoms.join(', ')}. Age 39 or under.`,
};

/**
 * Stub answer for one Rule on the facts known so far. Returns the because-line, or false.
 * The caller applies the Rule's limits (age, sex) before this.
 */
export function checkRule(ruleId: string, f: Facts, p: Who): string | false {
  const check = checks[ruleId];
  if (!check) return false;
  const out = check(f, p);
  return out === undefined ? false : out;
}

/** Rule ids the stub has a check for. A test keeps this list and the seed Rules in step. */
export const STUB_CHECKED = Object.keys(checks);

/** Stub Risk gradient (api.ts riskOf): matched Rules, any Rule on 2+ visits, Repeat visit and age 60+. */
export function stubRiskScore(input: { matchedCount: number; lastingCount: number; repeatVisit: boolean; age: number }): number {
  const raw = input.matchedCount * 1.5 + (input.lastingCount > 0 ? 1 : 0) + (input.repeatVisit ? 1 : 0) + (input.age >= 60 ? 1 : 0);
  return Math.min(10, Math.round(raw));
}

export function stubRiskReason(input: { matchedCount: number; lastingCount: number; repeatVisit: boolean; age: number; visitCount: number }): string {
  const { matchedCount, lastingCount, repeatVisit, age, visitCount } = input;
  return `${matchedCount} matched Rule${matchedCount === 1 ? '' : 's'}${lastingCount ? ` (${lastingCount} seen on 2+ visits)` : ''}${repeatVisit ? ', Repeat visit' : ''}${age >= 60 ? ', age 60+' : ''}. Read from ${visitCount === 1 ? "today's note" : `today's note and ${visitCount - 1} earlier visit${visitCount === 2 ? '' : 's'}`}.`;
}

/** Stub fill (api.ts fillTemplateFromNote): values with the note words they came from. Record fields are not set here. */
export function stubFill(input: {
  cancer: 'lung' | 'colorectal' | 'ovarian';
  patient: PatientView;
  facts: Facts;
  repeatCount: number | undefined;
  matchedIds: string[];
  riskScore: number;
}): { values: Record<string, unknown>; evidence: Record<string, string> } {
  const { cancer, patient: p, facts: f, repeatCount } = input;
  const today = p.visits.at(-1)!;
  const values: Record<string, unknown> = {};
  const evidence: Record<string, string> = {};
  const set = (key: string, value: unknown, ev?: string) => {
    if (value === undefined || value === '') return;
    values[key] = value;
    if (ev) evidence[key] = ev;
  };
  // Evidence: the first note sentence matching re, today's note first, then earlier visits.
  const ev = (re: RegExp) => {
    for (let i = p.visits.length - 1; i >= 0; i--) {
      const s = sentenceWith(p.visits[i].note, re);
      if (s) return s;
    }
    return undefined;
  };
  const allNotes = p.visits.map((v) => v.note).join(' ');
  const latest = today.note;

  set('smokingStatus', p.smokingStatus, ev(/smok/i));
  set('packYears', f.packYears, ev(/pack-years|a day for/i));
  set('mainSymptom', today.reason, 'Visit reason');
  set('symptomDurationWeeks', f.coughWeeks ?? f.bowelWeeks ?? (cancer === 'ovarian' ? lastNum(latest, /(\d+) weeks/gi) : undefined), ev(/weeks/i));
  set('symptomVisitCount', repeatCount ?? p.visits.filter((x) => x.symptom === today.symptom).length, 'Visit history');
  set('examFindings', f.exam, f.exam);
  set('generalCondition', f.tired ? 'Tired' : /looks well|well/i.test(latest) ? 'Well' : undefined, ev(/tired|well/i));
  set('weightLossKg', f.weightLossKg, ev(/kg/i));
  set('testsDone', f.tests.map(testObject).filter(Boolean), ev(/FBC|CA-?125|FIT|CRP/i));
  set('currentMedicines', f.medicines ? [f.medicines] : undefined, f.medicines);
  set('suspectedDiagnosis', `Suspected ${cancer} cancer`);
  set('suspectedCancerType', cancer);
  set('urgency', /urgent/i.test(latest) ? 'urgent_2_week' : undefined, ev(/urgent/i));
  set('gpQuestion', `Please assess for suspected ${cancer} cancer and arrange the next investigations.`, ev(/plan|referral/i));

  if (cancer === 'lung') {
    const sym = symptomList(f);
    const map: Record<string, string> = { cough: 'cough', tiredness: 'fatigue', breathlessness: 'breathlessness', 'weight loss': 'weight_loss', 'appetite loss': 'appetite_loss' };
    set('lungSymptoms', sym.map((s) => map[s]).filter(Boolean), ev(/cough/i));
    set('haemoptysis', f.haemoptysis, ev(/blood/i));
    set('chestXrayResult', /chest x-ray today|x-ray requested/i.test(latest) ? 'not_done' : undefined, ev(/x-ray/i));
  }
  if (cancer === 'colorectal') {
    set('bowelHabitChange', f.bowelChange, ev(/bowel/i));
    set('rectalBleeding', f.rectalBleeding, ev(/blood|bleeding/i));
    set('abdominalMass', f.abdominalMass, ev(/mass/i));
    set('ironDeficiencyAnaemia', f.ironDeficiency, ev(/iron|ferritin/i));
    set('haemoglobinGPerL', f.hb, ev(/Hb/));
    set('fitDone', f.fit !== undefined, ev(/FIT/));
    set('fitValueUgHbPerG', f.fit, ev(/FIT/));
    set('rectalExamResult', f.rectalExam ? (/no mass/i.test(f.rectalExam) ? 'normal' : 'abnormal') : undefined, f.rectalExam);
  }
  if (cancer === 'ovarian') {
    const sym = f.ovarianSymptoms;
    const ca125Visit = [...p.visits].reverse().find((x) => /CA-?125 sent/i.test(x.note));
    set('bloatingOrDistension', sym.includes('bloating'), ev(/bloat/i));
    set('earlySatietyOrAppetiteLoss', sym.includes('early fullness') || f.appetiteLoss, ev(/full|appetite/i));
    set('pelvicOrAbdominalPain', sym.includes('pelvic pain'), ev(/pain/i));
    set('urinarySymptoms', sym.includes('urinary urgency'), ev(/urin/i));
    set('ascites', /ascites/i.test(latest) ? !/no ascites/i.test(latest) : undefined, ev(/ascites/i));
    set('palpableMass', /mass/i.test(latest) ? !/no (palpable )?mass/i.test(latest) : undefined, ev(/mass/i));
    set('ca125Done', f.ca125 !== undefined, ev(/CA-?125/i));
    set('ca125ValueIuPerMl', f.ca125, ev(/CA-?125[^.]*IU/i));
    set('ca125Date', f.ca125 !== undefined && ca125Visit ? ca125Visit.date : undefined, ca125Visit && sentenceWith(ca125Visit.note, /CA-?125 sent/i));
    set('pelvicUltrasoundResult', /ultrasound/i.test(latest) && !f.ultrasoundSuggests ? 'not_done' : undefined, ev(/ultrasound/i));
    set('menopausalStatus', /postmenopausal/i.test(allNotes) ? 'postmenopausal' : /premenopausal|periods regular/i.test(allNotes) ? 'premenopausal' : undefined, ev(/menopaus|periods/i));
  }
  return { values, evidence };
}

/** "Hb 110 g/L" -> { name: "Hb", result: "110 g/L" }. Used for the testsDone array. */
function testObject(text: string): { name: string; result: string } | undefined {
  const m = text.match(/^(.*?)\s*(\d.*)$/);
  if (!m || !m[1].trim()) return undefined;
  return { name: m[1].trim(), result: m[2].trim() };
}


export function stubPort(): ModelPort {
  return {
    name: 'stub',
    async extractFacts(note) {
      return readFacts(note);
    },
    async decide({ facts, who, questions }) {
      const out: Record<string, Decision> = {};
      for (const q of questions) {
        const because = checkRule(q.id, facts, who);
        out[q.id] = because === false ? { yes: false } : { yes: true, because };
      }
      return out;
    },
    async risk({ matched, history }) {
      const input = { matchedCount: matched.length, lastingCount: history.lasting, repeatVisit: history.repeatVisit, age: history.age, visitCount: history.visitCount };
      return { score: stubRiskScore(input), reason: stubRiskReason(input) };
    },
    async fill(input: FillInput): Promise<FillOutput> {
      return stubFill({ cancer: input.cancer, patient: input.patient, facts: input.facts, repeatCount: input.repeatCount, matchedIds: input.matchedIds, riskScore: input.riskScore });
    },
  };
}
