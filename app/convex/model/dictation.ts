// Dictation: one recorded clip (base64, inline) to Gemini, back as a clean note. No streaming, no Live API.
// Two modes: 'dictate' (the GP dictates the note) and 'visit' (the GP records the visit, Gemini drafts the note).
// The Interactions API is called with store:false, so Google does not keep the audio. Nothing here stores it either.
// Pure apart from the fetch it is given. Research prototype. Not a medical device. Not for clinical use.
import { chatCompletion, fetchRetry, type ChatCfg } from './openai';

export type DictationMode = 'dictate' | 'visit';
export interface Dictation {
  language: 'fi' | 'en';
  note: string;
  /** a faithful English translation; the note itself when spoken in English; '' when the reply was not JSON */
  english: string;
}

export const DICTATION_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
/** Gemini 4 Hydrogen: the current fast multimodal model in the Gemini docs (audio in, JSON out). */
export const DICTATION_MODEL = 'gemini-4-hydrogen';
/** A long visit clip can take a while to read. Under the 10 min action limit. */
const DICTATION_TIMEOUT_MS = 90_000;

const JSON_RULE = `Reply with one JSON object: {"language": "fi" or "en", "note": string, "english": string}.
"language" is the language spoken. "english" is a faithful English translation of "note"; if it was spoken in English, repeat the note.`;

export const DICTATE_SYSTEM = `You transcribe a GP's dictated clinical note. Keep the language spoken (Finnish or English).
Remove fillers and false starts. Fix medical terms and spelling. Write drug names as their international generic names when you hear them clearly.
Keep every number, dose, duration and negation exactly.
Never add findings, diagnoses or advice that were not said. If something is unclear, write [unclear].
${JSON_RULE}`;

export const VISIT_SYSTEM = `Write a GP visit note from this recorded doctor-patient conversation, in the language of the visit (Finnish or English).
Use these headings, in this order: Reason for visit, History (what the patient reported, with durations), Findings (only what the doctor said they found), Plan.
In Finnish use: Käynnin syy, Esitiedot, Löydökset, Suunnitelma. Put each heading on its own line, followed by its text on the next line.
Include only what was said. Never add diagnoses, findings or advice that were not said. Leave out small talk.
Keep every number, dose, duration and negation exactly. Write drug names as their international generic names when you hear them clearly.
Mark anything unclear as [unclear].
${JSON_RULE}`;

export const systemFor = (mode: DictationMode): string => (mode === 'visit' ? VISIT_SYSTEM : DICTATE_SYSTEM);

const SCHEMA = {
  type: 'object',
  properties: { language: { type: 'string', enum: ['fi', 'en'] }, note: { type: 'string' }, english: { type: 'string' } },
  required: ['language', 'note', 'english'],
};

/** The request body. Exported for the request-shape test. */
export function dictationBody(audioBase64: string, mimeType: string, mode: DictationMode) {
  return {
    model: DICTATION_MODEL,
    store: false,
    system_instruction: systemFor(mode),
    input: [
      { type: 'text', text: mode === 'visit' ? 'Draft the visit note from this recording.' : 'Transcribe and clean up this dictated note.' },
      { type: 'audio', data: audioBase64, mime_type: mimeType },
    ],
    response_format: { type: 'text', mime_type: 'application/json', schema: SCHEMA },
  };
}

/** The text of the last model_output step. */
function outputText(reply: unknown): string {
  const steps = (reply as { steps?: { type?: string; content?: { type?: string; text?: string }[] }[] })?.steps ?? [];
  const out = steps.filter((s) => s.type === 'model_output').at(-1);
  return (out?.content ?? []).filter((c) => c.type === 'text' && typeof c.text === 'string').map((c) => c.text).join('');
}

const stripFence = (s: string): string => s.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

/** Parse the model text. Not JSON (or the wrong shape): the text itself becomes the note, with no translation. */
export function parseDictation(text: string): Dictation {
  const raw = stripFence(text);
  try {
    const j = JSON.parse(raw) as Partial<Dictation>;
    if (typeof j.note === 'string' && j.note.trim()) {
      const language = j.language === 'fi' ? 'fi' : 'en';
      return { language, note: j.note.trim(), english: typeof j.english === 'string' ? j.english.trim() : '' };
    }
  } catch {
    /* fall through to the raw text */
  }
  return { language: /[äöå]/i.test(raw) ? 'fi' : 'en', note: raw, english: '' };
}

export async function transcribe(args: {
  audioBase64: string;
  mimeType: string;
  mode: DictationMode;
  apiKey: string;
  fetchImpl?: typeof fetch;
}): Promise<Dictation> {
  const res = await fetchRetry(
    DICTATION_ENDPOINT,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': args.apiKey, 'Api-Revision': '2026-05-20' },
      body: JSON.stringify(dictationBody(args.audioBase64, args.mimeType, args.mode)),
    },
    args.fetchImpl,
    DICTATION_TIMEOUT_MS,
    1,
  );
  if (!res.ok) throw new Error(`Dictation failed: HTTP ${res.status}`);
  const text = outputText(await res.json());
  if (!text.trim()) throw new Error('Dictation failed: empty reply');
  const d = parseDictation(text);
  if (!d.note) throw new Error('Dictation failed: empty note');
  return d;
}

// ---- Medicine check: MedGemma lists doubtful medicine or medical terms in the cleaned note. It never rewrites the note. ----

/** The base MedGemma 27B, served by the same Modal app as the triage LoRA (ml/modal_medgemma_serve.py). */
export const MEDICINE_CHECK_MODEL = 'google/medgemma-27b-text-it';
/** Cold, slow or failed: skip quietly. Never wait on a cold start (Modal answers 303 then). */
export const MEDICINE_CHECK_TIMEOUT_MS = 8_000;

export interface TermFlag {
  /** an exact span of the note */
  text: string;
  suggestion: string;
  reason: string;
}

export const MEDICINE_CHECK_SYSTEM = `You check a GP's clinical note (Finnish or English) for doubtful medicine names and medical terms: misspellings, wrong or non-existent drug names, and doses that look wrong for the drug.
Do not rewrite the note. Do not comment on style, grammar or anything else.
Reply with a JSON array only: [{"text": the exact span as written in the note, "suggestion": the corrected term, "reason": a few words}].
Leave out terms that are correct. If nothing is doubtful, reply [].`;

/** Parse and keep only flags whose text is an exact span of the note and whose suggestion differs. Bad JSON: no flags. */
export function parseFlags(reply: string, note: string): TermFlag[] {
  let arr: unknown;
  try {
    arr = JSON.parse(stripFence(reply));
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const out: TermFlag[] = [];
  for (const f of arr as Partial<TermFlag>[]) {
    if (!f || typeof f.text !== 'string' || typeof f.suggestion !== 'string') continue;
    const text = f.text.trim();
    const suggestion = f.suggestion.trim();
    if (!text || !suggestion || text === suggestion || !note.includes(text) || seen.has(text)) continue;
    seen.add(text);
    out.push({ text, suggestion, reason: typeof f.reason === 'string' ? f.reason.trim().slice(0, 120) : '' });
    if (out.length >= 10) break;
  }
  return out;
}

/** Any failure (cold start, timeout, HTTP error, bad JSON): no flags. The Gemini note stands as it is. */
export async function checkTerms(note: string, cfg: ChatCfg, fetchImpl?: typeof fetch): Promise<TermFlag[]> {
  if (!note.trim()) return [];
  try {
    const reply = await chatCompletion({
      cfg: { baseUrl: cfg.baseUrl, apiKey: cfg.apiKey, model: cfg.model },
      messages: [
        { role: 'system', content: MEDICINE_CHECK_SYSTEM },
        { role: 'user', content: note },
      ],
      temperature: 0,
      maxTokens: 600,
      fetchImpl,
      limits: { timeoutMs: MEDICINE_CHECK_TIMEOUT_MS, retry: false, manualRedirect: true },
    });
    return parseFlags(reply, note);
  } catch {
    return [];
  }
}
