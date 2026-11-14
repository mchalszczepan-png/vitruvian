// The live port for gemma and modal-lora. One implementation: they differ only in env (the chat endpoint and model id) and,
// for modal-lora, the fill goes to the LoRA first (cfg.lora) and falls back to the gemma chat endpoint on any failure.
// It owns the one chat client (model/openai.ts: 20 s timeout, one retry), the one JSON parser, the Gemini Decisions POST
// and the contract fill call (model/contract.ts, unchanged). It throws on a bad reply with the HTTP status only: no silent
// risk 0 and no silent empty Facts.
// Decisions API: https://aistudio.google.com/docs/decisions-api.md. POST v1beta/decisions, model gemini-decision-1,
// questions map of {type: "noul", instructions}, answer at answers.<key>.noul as a probability 0.01 to 0.99.
// Research prototype. Not a medical device. Not for clinical use.
import { chatCompletion, fetchRetry, type CallLimits, type ChatCfg } from '../../model/openai';
import { fieldProblems, fillFromNote, recordFactsFor, type FillOutput } from '../../model/contract';
import { coerceFacts, factsJson, FACT_KEYS } from '../facts';
import type { Decision, FillInput, ModelPort, RiskOutput } from '../port';

export interface LlmCfg {
  name: 'gemma' | 'modal-lora';
  /** gemma: the endpoint for every call. modal-lora: the Featherless endpoint for facts, decisions, risk and the fill fallback. */
  chat: ChatCfg;
  /** modal-lora only: the LoRA endpoint (LORA_*), which answers the fill alone. */
  lora?: ChatCfg;
  /** GEMINI_API_KEY for the Decisions API */
  geminiKey: string;
  fetchImpl?: typeof fetch;
}

const DECISIONS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/decisions';
const DECISIONS_MODEL = 'gemini-decision-1';
/** A probability at or above this counts as yes. */
export const YES_AT = 0.5;
/**
 * The LoRA fill: 25 s, one request, no retry. A cold start (~13 min) must not hold a fill, so a timeout, a 303 (a redirect
 * is returned, not followed) or invalid output falls back to gemma at once.
 */
export const LORA_LIMITS: CallLimits = { timeoutMs: 25_000, retry: false, manualRedirect: true };
const LORA_INVALID = 'LoRA reply was not valid fill output';

/** Pulls the first JSON object out of a model reply (fenced or bare). Returns null when none parses. */
function jsonObjectFrom(text: string): Record<string, unknown> | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    const parsed: unknown = JSON.parse(text.slice(start, end + 1));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function llmPort(cfg: LlmCfg): ModelPort {
  const chatJson = async (system: string, user: string, what: string): Promise<Record<string, unknown>> => {
    const text = await chatCompletion({
      cfg: cfg.chat,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0,
      fetchImpl: cfg.fetchImpl,
    });
    const obj = jsonObjectFrom(text);
    if (!obj) throw new Error(`model reply for ${what} was not a JSON object`);
    return obj;
  };

  return {
    name: cfg.name,

    async extractFacts(note) {
      const system = 'You extract structured clinical facts from a GP note. Reply with one JSON object only. No prose.';
      const user = `Keys (omit a key when the note does not say): ${FACT_KEYS.join(', ')}.
Booleans are true only when the note affirms the finding. Numbers are the value written in the note. ovarianSymptoms uses: bloating, early fullness, pelvic pain, urinary urgency.
Note:
${note}`;
      return coerceFacts(await chatJson(system, user, 'facts'));
    },

    async decide({ facts, questions }) {
      const out: Record<string, Decision> = {};
      if (questions.length === 0) return out;
      const body = {
        model: DECISIONS_MODEL,
        input: `Structured facts from a GP's notes, read visit by visit up to the last visit. Answer each question from these facts only.\n${factsJson(facts)}`,
        questions: Object.fromEntries(questions.map((q) => [q.id, { type: 'noul', instructions: q.question }])),
      };
      const res = await fetchRetry(
        DECISIONS_ENDPOINT,
        { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': cfg.geminiKey }, body: JSON.stringify(body) },
        cfg.fetchImpl,
      );
      if (!res.ok) {
        // Only the error code, never the message body or the key.
        const err = (await res.json().catch(() => null)) as { error?: { code?: string } } | null;
        throw new Error(`Decisions API call failed: HTTP ${res.status}${err?.error?.code ? ` (${err.error.code})` : ''}`);
      }
      const json = (await res.json()) as { answers?: Record<string, { noul?: number }> };
      for (const q of questions) {
        const p = json.answers?.[q.id]?.noul;
        out[q.id] = { yes: typeof p === 'number' && p >= YES_AT };
      }
      return out;
    },

    async risk({ cancer, matched, history }): Promise<RiskOutput> {
      const system = 'You give an AI risk gradient for a suspected cancer referral. Reply with one JSON object: {"score": integer 0 to 10, "reason": one line}. You never add or remove matched Rules.';
      const user = `Suspected ${cancer} cancer. Matched Rules:\n${matched.map((m) => `- ${m.id}: ${m.because}`).join('\n') || '- none'}
History: ${history.visitCount} visit(s); Repeat visit ${history.repeatVisit ? 'yes' : 'no'}; Rules seen on 2+ visits ${history.lasting}; age ${history.age}; sex ${history.sex}.
Visits: ${history.visits.map((v) => `${v.date} ${v.reason}`).join('; ')}.
Persistent or recurrent matches raise the score.`;
      const raw = await chatJson(system, user, 'risk');
      if (typeof raw.score !== 'number' || !Number.isFinite(raw.score)) throw new Error('model reply for risk had no numeric score');
      const reason = typeof raw.reason === 'string' && raw.reason.trim() ? raw.reason.trim().split('\n')[0] : 'No reason returned by the model.';
      return { score: raw.score, reason };
    },

    /**
     * The contract call (ml/CONTRACT.md): one request, one retry on invalid output. Today's note is the last visit.
     * modal-lora: the LoRA first, alone (LORA_LIMITS). Any failure, or output the contract would reject, logs one line and
     * falls back to the gemma fill. The result says which one served it (servedBy); a gemma port sets no servedBy.
     */
    async fill(input: FillInput): Promise<FillOutput> {
      const visits = input.patient.visits;
      const today = visits[visits.length - 1];
      const call = {
        cancer: input.cancer,
        todayNote: today.note,
        earlierNotes: visits.slice(0, -1).map((v) => ({ date: v.date, note: v.note })),
        recordFacts: recordFactsFor(input.patient),
        specs: input.specs,
        fetchImpl: cfg.fetchImpl,
      };
      if (!cfg.lora) return fillFromNote({ ...call, chat: cfg.chat });
      try {
        const out = await fillFromNote({ ...call, chat: cfg.lora, limits: LORA_LIMITS });
        if (Object.keys(out.values).length === 0 || fieldProblems(input.specs, out.values, input.cancer).length > 0) throw new Error(LORA_INVALID);
        return { ...out, servedBy: 'modal-lora' };
      } catch (e) {
        // The error text names the HTTP status or the timeout only (model/openai.ts), never the body or a key.
        console.log(`fill: modal-lora failed (${e instanceof Error ? e.message : 'error'}), fell back to gemma`);
        return { ...(await fillFromNote({ ...call, chat: cfg.chat })), servedBy: 'gemma' };
      }
    },
  };
}
