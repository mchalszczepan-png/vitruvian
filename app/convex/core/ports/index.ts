// makePort: the ONLY place that reads env. MODEL_PROVIDER = stub | gemma | modal-lora, default stub, so an unset key never
// means a network call. gemma and modal-lora share one llmPort (GEMMA_BASE_URL, GEMMA_API_KEY, GEMMA_MODEL, GEMINI_API_KEY).
// Optional GEMMA_FALLBACK_BASE_URL, GEMMA_FALLBACK_API_KEY, GEMMA_FALLBACK_MODEL (all three or none): a second chat endpoint
// that serves a chat call when the primary fails (model/openai.ts chatCompletion). The cache key does not change for it.
// modal-lora also reads LORA_BASE_URL, LORA_API_KEY, LORA_MODEL: its fill goes to the LoRA and falls back to gemma (llm.ts).
// Optional LORA_TRIAGE_MODEL (modal-lora only, same endpoint and key): the triage LoRA answers the risk step; the prompted risk is the fallback.
// The port is wrapped in the cache decorator when a store is given. Keys are never logged or returned.
// Research prototype. Not a medical device. Not for clinical use.
import type { ChatCfg } from '../../model/openai';
import type { ModelPort } from '../port';
import { withCache, type Store } from '../cached';
import { llmPort } from './llm';
import { stubPort } from './stub';

export type Env = Record<string, string | undefined>;

/** The LoRA endpoint from LORA_*. Throws, naming the variables, when one is missing. Used by makePort and aid:warmLora. */
export function loraCfg(env: Env): ChatCfg {
  const { LORA_BASE_URL: baseUrl, LORA_API_KEY: apiKey, LORA_MODEL: model } = env;
  if (!baseUrl || !apiKey || !model) throw new Error('LORA_BASE_URL, LORA_API_KEY and LORA_MODEL must be set in Convex env for MODEL_PROVIDER=modal-lora');
  return { baseUrl, apiKey, model };
}

/** The gemma fallback endpoint from GEMMA_FALLBACK_*. undefined when none is set. Throws when only some are set. */
export function gemmaFallbackCfg(env: Env): ChatCfg | undefined {
  const { GEMMA_FALLBACK_BASE_URL: baseUrl, GEMMA_FALLBACK_API_KEY: apiKey, GEMMA_FALLBACK_MODEL: model } = env;
  if (!baseUrl && !apiKey && !model) return undefined;
  if (!baseUrl || !apiKey || !model) throw new Error('GEMMA_FALLBACK_BASE_URL, GEMMA_FALLBACK_API_KEY and GEMMA_FALLBACK_MODEL must all be set, or none');
  return { baseUrl, apiKey, model };
}

export function makePort(env: Env, store?: Store, fetchImpl?: typeof fetch): ModelPort {
  const name = env.MODEL_PROVIDER ?? 'stub';
  if (name === 'stub') return stubPort();
  if (name !== 'gemma' && name !== 'modal-lora') throw new Error(`MODEL_PROVIDER must be stub, gemma or modal-lora (got "${name}")`);
  const { GEMMA_BASE_URL: baseUrl, GEMMA_API_KEY: apiKey, GEMMA_MODEL: model, GEMINI_API_KEY: geminiKey } = env;
  if (!baseUrl || !apiKey || !model) throw new Error('GEMMA_BASE_URL, GEMMA_API_KEY and GEMMA_MODEL must be set in Convex env');
  if (!geminiKey) throw new Error('GEMINI_API_KEY must be set in Convex env');
  const fallback = gemmaFallbackCfg(env);
  const lora = name === 'modal-lora' ? loraCfg(env) : undefined;
  // The triage LoRA shares the fill LoRA's endpoint and key. Only LORA_TRIAGE_MODEL is new; unset means no triage (prompted risk only).
  const triage: ChatCfg | undefined = lora && env.LORA_TRIAGE_MODEL ? { baseUrl: lora.baseUrl, apiKey: lora.apiKey, model: env.LORA_TRIAGE_MODEL } : undefined;
  const chat: ChatCfg = fallback ? { baseUrl, apiKey, model, fallback } : { baseUrl, apiKey, model };
  const port = llmPort({ name, chat, lora, triage, geminiKey, fetchImpl });
  // A modal-lora port names the LoRA in its cache keys, so a new LORA_MODEL does not replay the old answers. gemma keys are unchanged.
  // The triage model id goes to the risk key only (withCache), so a new LORA_TRIAGE_MODEL does not invalidate facts, decisions or fills.
  const cacheModel = lora ? `${model}+${lora.model}` : model;
  return store ? withCache(port, store, cacheModel, triage?.model) : port;
}
