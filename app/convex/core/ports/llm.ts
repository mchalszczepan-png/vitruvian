// The live port for gemma and modal-lora. One implementation: they differ only in env (the chat endpoint and model id) and,
// for modal-lora, the fill goes to the LoRA first (cfg.lora) and falls back to the gemma chat endpoint on any failure.
// modal-lora's risk is a chain: MedGemma (cfg.medgemma) first, then the triage LoRA (cfg.triage, same endpoint as the fill LoRA),
// then the prompted risk. Each step is optional; a step that fails hands on to the next (risk below).
// It owns the one chat client (model/openai.ts: 20 s timeout, one retry), the one JSON parser, the Gemini Decisions POST
// and the contract fill call (model/contract.ts, unchanged). It throws on a bad reply with the HTTP status only: no silent
// risk 0 and no silent empty Facts.
// Decisions API: https://aistudio.google.com/docs/decisions-api.md. POST v1beta/decisions, model gemini-decision-1,
// questions map of {type: "noul", instructions}, answer at answers.<key>.noul as a probability 0.01 to 0.99.
// Research prototype. Not a medical device. Not for clinical use.
import { chatCompletion, fetchRetry, type CallLimits, type ChatCfg } from '../../model/openai';
import { fieldProblems, fillFromNote, recordFactsFor, type FillOutput } from '../../model/contract';
import { buildTriageMessages } from '../../model/triagePrompt';
import { coerceFacts, factsJson, FACT_KEYS } from '../facts';
import type { CancerType } from '../../../src/data/types';
import type { Decision, FillInput, ModelPort, RiskInput, RiskOutput } from '../port';

export interface LlmCfg {
  name: 'gemma' | 'modal-lora';
  /** gemma: the endpoint for every call. modal-lora: the Featherless endpoint for facts, decisions, risk and the fill fallback. */
  chat: ChatCfg;
  /** modal-lora only: the LoRA endpoint (LORA_*), which answers the fill alone. */
  lora?: ChatCfg;
  /** modal-lora only: MedGemma 27B triage (MEDGEMMA_TRIAGE_*). Its risk goes first, then the triage LoRA, then the prompted risk. */
  medgemma?: ChatCfg;
  /** modal-lora only: the triage LoRA (LORA_TRIAGE_MODEL on the same endpoint as lora). Its risk goes second; the prompted risk is the last fallback. */
  triage?: ChatCfg;
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
/** The MedGemma triage: 20 s, one request, no retry. A cold start (~4m20s) is a fallback to the E4B triage at once, never a wait. */
export const MEDGEMMA_LIMITS: CallLimits = { timeoutMs: 20_000, retry: false, manualRedirect: true };
const LORA_INVALID = 'LoRA reply was not valid fill output';
const TRIAGE_CANCERS = ['lung', 'colorectal', 'ovarian', 'none'] as const;
const clampScore = (x: number) => Math.min(10, Math.max(0, Math.round(x)));

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

/**
 * Reads the triage reply (ml/TRIAGE-CONTRACT.md), from MedGemma or the E4B triage LoRA (same contract). Throws on a missing or
 * non-numeric score, or an empty riskReason, so the caller falls to the next step. The Rules pick the cancer:
 * score = scores[input.cancer], or the riskGradient when no Rule matched.
 */
function parseTriage(text: string, input: RiskInput, servedBy: 'medgemma' | 'modal-lora'): RiskOutput {
  const obj = jsonObjectFrom(text);
  if (!obj) throw new Error('triage reply was not a JSON object');
  const scores = obj.scores as Record<string, unknown> | undefined;
  const cancers = ['lung', 'colorectal', 'ovarian'] as const;
  if (!scores || typeof scores !== 'object' || cancers.some((c) => typeof scores[c] !== 'number' || !Number.isFinite(scores[c]))) {
    throw new Error('triage reply had no numeric scores');
  }
  const clean = Object.fromEntries(cancers.map((c) => [c, clampScore(scores[c] as number)])) as Record<(typeof cancers)[number], number>;
  if (typeof obj.riskReason !== 'string' || !obj.riskReason.trim()) throw new Error('triage reply had no riskReason');
  const riskGradient =
    typeof obj.riskGradient === 'number' && Number.isFinite(obj.riskGradient) ? clampScore(obj.riskGradient) : Math.max(...Object.values(clean));
  const pointer = (TRIAGE_CANCERS as readonly unknown[]).includes(obj.suspectedCancer) ? (obj.suspectedCancer as CancerType | 'none') : undefined;
  const evidence = Array.isArray(obj.evidence)
    ? obj.evidence.flatMap((x) => (typeof x === 'string' && x.trim() ? [x.trim()] : [])).slice(0, 4)
    : [];
  return {
    score: input.noRuleMatched ? riskGradient : clean[input.cancer],
    reason: obj.riskReason.trim().split('\n')[0],
    pointer,
    evidence,
    servedBy,
  };
}

/** One triage call (ml/TRIAGE-CONTRACT.md): the same messages, temperature 0 and 1024 tokens for MedGemma and the E4B triage. */
async function triageRisk(
  chat: ChatCfg,
  input: RiskInput,
  limits: CallLimits,
  servedBy: 'medgemma' | 'modal-lora',
  fetchImpl: typeof fetch | undefined,
): Promise<RiskOutput> {
  const { today, earlier } = input.notes;
  const messages = buildTriageMessages(today, earlier, { age: input.history.age, sex: input.history.sex });
  const text = await chatCompletion({ cfg: chat, messages, temperature: 0, maxTokens: 1024, limits, fetchImpl });
  return parseTriage(text, input, servedBy);
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

  /** The prompted risk (gemma, and the modal-lora fallback). */
  async function promptedRisk({ cancer, matched, history }: RiskInput): Promise<RiskOutput> {
    const system = 'You give an AI risk gradient for a suspected cancer referral. Reply with one JSON object: {"score": integer 0 to 10, "reason": one line}. You never add or remove matched Rules.';
    const user = `Suspected ${cancer} cancer. Matched Rules:\n${matched.map((m) => `- ${m.id}: ${m.because}`).join('\n') || '- none'}
History: ${history.visitCount} visit(s); Repeat visit ${history.repeatVisit ? 'yes' : 'no'}; Rules seen on 2+ visits ${history.lasting}; age ${history.age}; sex ${history.sex}.
Visits: ${history.visits.map((v) => `${v.date} ${v.reason}`).join('; ')}.
Persistent or recurrent matches raise the score.`;
    const raw = await chatJson(system, user, 'risk');
    if (typeof raw.score !== 'number' || !Number.isFinite(raw.score)) throw new Error('model reply for risk had no numeric score');
    const reason = typeof raw.reason === 'string' && raw.reason.trim() ? raw.reason.trim().split('\n')[0] : 'No reason returned by the model.';
    return { score: raw.score, reason };
  }

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

    /**
     * modal-lora: MedGemma first (MEDGEMMA_LIMITS), then the triage LoRA (LORA_LIMITS), then the prompted risk. Each failure logs one
     * line and hands on. servedBy names the step that answered; 'gemma' is the prompted fallback and is set only when a triage step
     * is configured. A gemma port, or modal-lora with no triage step, runs the prompted risk alone (no servedBy).
     */
    async risk(input): Promise<RiskOutput> {
      if (!cfg.medgemma && !cfg.triage) return promptedRisk(input);
      // The error text names the HTTP status, the timeout or our own parse message only, never the body, URL or key.
      if (cfg.medgemma) {
        try {
          return await triageRisk(cfg.medgemma, input, MEDGEMMA_LIMITS, 'medgemma', cfg.fetchImpl);
        } catch (e) {
          const next = cfg.triage ? 'trying the E4B triage' : 'fell back to gemma';
          console.log(`risk: medgemma failed (${e instanceof Error ? e.message : 'error'}), ${next}`);
        }
      }
      if (cfg.triage) {
        try {
          return await triageRisk(cfg.triage, input, LORA_LIMITS, 'modal-lora', cfg.fetchImpl);
        } catch (e) {
          console.log(`risk: triage failed (${e instanceof Error ? e.message : 'error'}), fell back to gemma`);
        }
      }
      return { ...(await promptedRisk(input)), servedBy: 'gemma' };
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
