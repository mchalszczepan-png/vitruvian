// makePort: the ONLY place that reads env. MODEL_PROVIDER = stub | gemma | modal-lora, default stub, so an unset key never
// means a network call. gemma and modal-lora share one llmPort (GEMMA_BASE_URL, GEMMA_API_KEY, GEMMA_MODEL, GEMINI_API_KEY).
// modal-lora also reads LORA_BASE_URL, LORA_API_KEY, LORA_MODEL: its fill goes to the LoRA and falls back to gemma (llm.ts).
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

export function makePort(env: Env, store?: Store, fetchImpl?: typeof fetch): ModelPort {
  const name = env.MODEL_PROVIDER ?? 'stub';
  if (name === 'stub') return stubPort();
  if (name !== 'gemma' && name !== 'modal-lora') throw new Error(`MODEL_PROVIDER must be stub, gemma or modal-lora (got "${name}")`);
  const { GEMMA_BASE_URL: baseUrl, GEMMA_API_KEY: apiKey, GEMMA_MODEL: model, GEMINI_API_KEY: geminiKey } = env;
  if (!baseUrl || !apiKey || !model) throw new Error('GEMMA_BASE_URL, GEMMA_API_KEY and GEMMA_MODEL must be set in Convex env');
  if (!geminiKey) throw new Error('GEMINI_API_KEY must be set in Convex env');
  const lora = name === 'modal-lora' ? loraCfg(env) : undefined;
  const port = llmPort({ name, chat: { baseUrl, apiKey, model }, lora, geminiKey, fetchImpl });
  // A modal-lora port names the LoRA in its cache keys, so a new LORA_MODEL does not replay the old answers. gemma keys are unchanged.
  const cacheModel = lora ? `${model}+${lora.model}` : model;
  return store ? withCache(port, store, cacheModel) : port;
}
