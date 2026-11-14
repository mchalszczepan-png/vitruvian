// Note -> Referral-fields contract (ml/CONTRACT.md). Prompted Gemma and the Modal LoRA both use this one path.
// One request: temperature 0, max_tokens 2048, two messages from prompt.ts. One reply: {"fields": {...}, "evidence": {...}}.
// Validation uses the hand-written field specs in referralSchema.ts. Invalid output gets ONE retry; fields still invalid are
// left for fill.ts to mark origin empty (required) or leave out (optional). Record fields never come from the model.
// Research prototype. Not a medical device. Not for clinical use.
import type { CancerType, FieldValue, FieldValues } from '../../src/data/types';
import { chatCompletion, type CallLimits, type ChatCfg } from './openai';
import { buildMessages, type ChatMessage, type CancerName, type EarlierNote, type RecordFacts } from './prompt';
import { fieldError, isRequired, RECORD_KEYS, type FieldSpec } from './referralSchema';

/** Keys the pipeline sets itself, never from the model: the record fields and the Aid results. */
export const PIPELINE_KEYS = new Set<string>([...RECORD_KEYS, 'matchedRuleIds', 'riskGradientAiEstimate']);

/** The text stored in FieldValue.value. */
export function formatValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  if (Array.isArray(value)) {
    const objects = value.every((x) => x !== null && typeof x === 'object');
    if (objects) return value.map((x) => `${(x as { name: string }).name} ${(x as { result: string }).result}`).join('; ');
    return value.map(String).join(', ');
  }
  return String(value);
}

/**
 * Model fields as FieldValues. Valid values get origin gemma (evidence from the reply). A required field that is missing or
 * invalid after the retry gets origin empty. An optional invalid field is left out. Pipeline keys are never set here.
 */
export function modelFieldValues(specs: FieldSpec[], out: FillOutput, cancer: CancerType): FieldValues {
  const result: FieldValues = {};
  for (const spec of specs) {
    if (PIPELINE_KEYS.has(spec.key)) continue;
    const value = out.values[spec.key];
    const missing = value === undefined || value === null || value === '';
    if (missing || fieldError(spec, value, cancer)) {
      if (isRequired(spec, out.values)) result[spec.key] = { value: '', origin: 'empty' };
      continue;
    }
    result[spec.key] = { value: formatValue(value), origin: 'gemma', evidence: out.evidence[spec.key] } satisfies FieldValue;
  }
  return result;
}

/** The GP the referral is sent from. The record system does not carry one yet (mock parity). */
export const REFERRING_GP_ID = 'GP-DEMO-01';

export const CONTRACT_TEMPERATURE = 0;
export const CONTRACT_MAX_TOKENS = 2048;

export interface ModelReply {
  fields: Record<string, unknown>;
  evidence: Record<string, string>;
}

export interface FillOutput {
  values: Record<string, unknown>;
  evidence: Record<string, string>;
  /** Set only by modal-lora: 'modal-lora' when the LoRA answered, 'gemma' when the Featherless fallback did. Absent otherwise. */
  servedBy?: 'modal-lora' | 'gemma';
}

/** Removes a ```json ... ``` (or bare ```) fence around the reply. Returns the text unchanged when there is none. */
export function stripFence(text: string): string {
  const t = text.trim();
  const m = t.match(/^```[A-Za-z]*[ \t]*\r?\n?([\s\S]*?)\r?\n?```$/);
  return m ? m[1].trim() : t;
}

const isPlainObject = (x: unknown): x is Record<string, unknown> => x !== null && typeof x === 'object' && !Array.isArray(x);

/** Parses one model reply. Returns null when it is not the {"fields": {...}} object. Evidence keeps string values only. */
export function parseReply(content: string): ModelReply | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripFence(content));
  } catch {
    return null;
  }
  if (!isPlainObject(parsed) || !isPlainObject(parsed.fields)) return null;
  const evidence: Record<string, string> = {};
  if (isPlainObject(parsed.evidence)) {
    for (const [k, v] of Object.entries(parsed.evidence)) if (typeof v === 'string') evidence[k] = v;
  }
  return { fields: parsed.fields, evidence };
}

/**
 * Schema keys that fail validation. A null (or absent optional) value means "unknown" and is fine.
 * An absent required key is a failure: the contract says unknown required values are null.
 */
export function fieldProblems(specs: FieldSpec[], fields: Record<string, unknown>, cancer: CancerType): string[] {
  const bad: string[] = [];
  for (const spec of specs) {
    if (PIPELINE_KEYS.has(spec.key)) continue;
    const value = fields[spec.key];
    if (value === null) continue;
    if (value === undefined) {
      if (isRequired(spec, fields)) bad.push(spec.key);
      continue;
    }
    if (fieldError(spec, value, cancer)) bad.push(spec.key);
  }
  return bad;
}

/** Record fields for the request, in the key order of ml/prompt.py's example. Dates come from the record, not the model. */
export function recordFactsFor(patient: { id: string; age: number; sex: string; visits: { date: string }[] }): RecordFacts {
  const today = patient.visits[patient.visits.length - 1];
  return {
    patientId: patient.id,
    age: patient.age,
    sex: patient.sex,
    referralDate: today.date,
    referringGpId: REFERRING_GP_ID,
  };
}

/**
 * One contract call with one retry. Returns the fields and evidence of the last reply that parsed.
 * A reply that does not parse at all leaves no fields, so every required field becomes origin empty in fill.ts.
 * With `limits.retry` false (the LoRA fill) there is one request and no retry on invalid output; the caller decides what invalid means.
 */
export async function fillFromNote(args: {
  cancer: CancerName;
  todayNote: string;
  earlierNotes: EarlierNote[];
  recordFacts: RecordFacts;
  specs: FieldSpec[];
  chat: ChatCfg;
  fetchImpl?: typeof fetch;
  limits?: CallLimits;
}): Promise<FillOutput> {
  const messages: ChatMessage[] = buildMessages(args.cancer, args.todayNote, args.earlierNotes, args.recordFacts);
  const ask = async (): Promise<ModelReply | null> =>
    parseReply(
      await chatCompletion({
        cfg: args.chat,
        messages,
        temperature: CONTRACT_TEMPERATURE,
        maxTokens: CONTRACT_MAX_TOKENS,
        fetchImpl: args.fetchImpl,
        limits: args.limits,
      }),
    );

  let reply = await ask();
  if ((!reply || fieldProblems(args.specs, reply.fields, args.cancer).length > 0) && args.limits?.retry !== false) {
    const second = await ask();
    if (second) reply = second;
  }
  if (!reply) return { values: {}, evidence: {} };
  return { values: reply.fields, evidence: reply.evidence };
}
