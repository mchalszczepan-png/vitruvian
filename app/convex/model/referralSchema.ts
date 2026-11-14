// Referral template field specs, one per cancer, from docs/build/referral-templates.md (JSON Schema, 2020-12).
// Hand-written validator (no ajv): ajv is not used because the Convex runtime is a plain V8 isolate and the schema is small.
// Keep in sync with the schema blocks in that doc: lung lines 134-211, colorectal 217-290, ovarian 296-382.
// Research prototype. Not a medical device. Not for clinical use.
import type { CancerType } from '../../src/data/types';

export type FieldSpec = {
  key: string;
  type: 'string' | 'integer' | 'number' | 'boolean' | 'enum' | 'stringArray' | 'objectArray' | 'date' | 'const';
  required: boolean;
  values?: string[];
  min?: number;
  max?: number;
  minLength?: number;
  pattern?: RegExp;
  /** required only when another field equals a value (JSON Schema if/then) */
  requiredIf?: { key: string; equals: unknown };
};

/** Record fields: copied from the GP's record system, never from the model. */
export const RECORD_KEYS = ['patientId', 'age', 'sex', 'referringGpId', 'referralDate'] as const;

const common: FieldSpec[] = [
  { key: 'patientId', type: 'string', required: true, pattern: /^SYN-[0-9]{3}$/ },
  { key: 'age', type: 'integer', required: true, min: 0, max: 120 },
  { key: 'sex', type: 'enum', required: true, values: ['female', 'male', 'other', 'unknown'] },
  { key: 'smokingStatus', type: 'enum', required: true, values: ['never', 'former', 'current', 'unknown'] },
  { key: 'packYears', type: 'number', required: false, min: 0 },
  { key: 'mainSymptom', type: 'string', required: true, minLength: 1 },
  { key: 'symptomDurationWeeks', type: 'integer', required: true, min: 0 },
  { key: 'symptomVisitCount', type: 'integer', required: true, min: 0 },
  { key: 'examFindings', type: 'string', required: true, minLength: 1 },
  { key: 'generalCondition', type: 'string', required: true, minLength: 1 },
  { key: 'weightLossKg', type: 'number', required: false, min: 0 },
  { key: 'testsDone', type: 'objectArray', required: true },
  { key: 'currentMedicines', type: 'stringArray', required: true },
  { key: 'otherIllnesses', type: 'stringArray', required: true },
  { key: 'suspectedDiagnosis', type: 'string', required: true, minLength: 1 },
  { key: 'suspectedCancerType', type: 'const', required: true },
  { key: 'gpQuestion', type: 'string', required: true, minLength: 1 },
  { key: 'urgency', type: 'enum', required: true, values: ['urgent_2_week', 'urgent'] },
  { key: 'referralDate', type: 'date', required: true },
  { key: 'referringGpId', type: 'string', required: true, minLength: 1 },
  { key: 'matchedRuleIds', type: 'stringArray', required: false },
  { key: 'riskGradientAiEstimate', type: 'integer', required: false, min: 0, max: 10 },
];

const bool = (key: string, required = true): FieldSpec => ({ key, type: 'boolean', required });

const lung: FieldSpec[] = [
  { key: 'lungSymptoms', type: 'stringArray', required: true, values: ['cough', 'fatigue', 'breathlessness', 'chest_pain', 'weight_loss', 'appetite_loss', 'finger_clubbing', 'lymph_node_enlargement', 'recurrent_pneumonia'] },
  bool('haemoptysis'),
  { key: 'chestXrayResult', type: 'enum', required: true, values: ['normal', 'abnormal', 'not_done'] },
  { key: 'chestXrayFindings', type: 'string', required: false, minLength: 1, requiredIf: { key: 'chestXrayResult', equals: 'abnormal' } },
  { key: 'chestXrayDate', type: 'date', required: false },
  bool('asbestosExposure', false),
];

const colorectal: FieldSpec[] = [
  bool('bowelHabitChange'),
  bool('rectalBleeding'),
  bool('abdominalMass'),
  bool('ironDeficiencyAnaemia'),
  { key: 'haemoglobinGPerL', type: 'number', required: false, min: 0 },
  bool('fitDone'),
  { key: 'fitValueUgHbPerG', type: 'number', required: false, min: 0, requiredIf: { key: 'fitDone', equals: true } },
  { key: 'rectalExamResult', type: 'enum', required: false, values: ['normal', 'abnormal', 'not_done'] },
];

const ovarian: FieldSpec[] = [
  bool('bloatingOrDistension'),
  bool('earlySatietyOrAppetiteLoss'),
  bool('pelvicOrAbdominalPain'),
  bool('urinarySymptoms'),
  { key: 'symptomDaysPerMonth', type: 'integer', required: true, min: 0, max: 31 },
  bool('ascites'),
  bool('palpableMass'),
  bool('ca125Done'),
  { key: 'ca125ValueIuPerMl', type: 'number', required: false, min: 0, requiredIf: { key: 'ca125Done', equals: true } },
  { key: 'ca125Date', type: 'date', required: false, requiredIf: { key: 'ca125Done', equals: true } },
  { key: 'pelvicUltrasoundResult', type: 'enum', required: true, values: ['normal', 'abnormal', 'not_done'] },
  { key: 'pelvicUltrasoundFindings', type: 'string', required: false, minLength: 1, requiredIf: { key: 'pelvicUltrasoundResult', equals: 'abnormal' } },
  { key: 'pelvicUltrasoundDate', type: 'date', required: false },
  { key: 'menopausalStatus', type: 'enum', required: true, values: ['premenopausal', 'postmenopausal', 'unknown'] },
  bool('familyHistoryBreastOrOvarianCancer'),
  { key: 'brcaStatus', type: 'enum', required: true, values: ['pathogenic_variant', 'no_pathogenic_variant', 'not_tested', 'unknown'] },
];

export const SCHEMAS: Record<CancerType, FieldSpec[]> = {
  lung: [...common, ...lung],
  colorectal: [...common, ...colorectal],
  ovarian: [...common, ...ovarian],
};

export function specFor(cancer: CancerType): FieldSpec[] {
  return SCHEMAS[cancer];
}

/** Returns the error for one value, or null when it is valid. `isRequired` is the effective requirement after requiredIf. */
export function fieldError(spec: FieldSpec, value: unknown, cancer: CancerType): string | null {
  if (spec.type === 'const') return value === cancer ? null : `must be "${cancer}"`;
  switch (spec.type) {
    case 'string':
      if (typeof value !== 'string') return 'must be a string';
      if (spec.minLength && value.length < spec.minLength) return 'must not be empty';
      if (spec.pattern && !spec.pattern.test(value)) return `does not match ${spec.pattern}`;
      return null;
    case 'integer':
      if (!Number.isInteger(value)) return 'must be an integer';
      break;
    case 'number':
      if (typeof value !== 'number' || !Number.isFinite(value)) return 'must be a number';
      break;
    case 'boolean':
      return typeof value === 'boolean' ? null : 'must be true or false';
    case 'enum':
      return typeof value === 'string' && spec.values!.includes(value) ? null : `must be one of ${spec.values!.join(', ')}`;
    case 'stringArray': {
      if (!Array.isArray(value) || !value.every((x) => typeof x === 'string')) return 'must be a list of text';
      if (spec.values && !value.every((x) => spec.values!.includes(x))) return `items must be one of ${spec.values.join(', ')}`;
      return null;
    }
    case 'objectArray':
      return Array.isArray(value) && value.every((x) => x && typeof x === 'object' && typeof (x as { name?: unknown }).name === 'string' && typeof (x as { result?: unknown }).result === 'string') ? null : 'must be a list of {name, result}';
    case 'date':
      return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? null : 'must be a date YYYY-MM-DD';
  }
  if (spec.min !== undefined && (value as number) < spec.min) return `must be at least ${spec.min}`;
  if (spec.max !== undefined && (value as number) > spec.max) return `must be at most ${spec.max}`;
  return null;
}

/** Applies requiredIf: true when the field must be present given the other values. */
export function isRequired(spec: FieldSpec, values: Record<string, unknown>): boolean {
  if (spec.requiredIf) return values[spec.requiredIf.key] === spec.requiredIf.equals;
  return spec.required;
}
