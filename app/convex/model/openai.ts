// OpenAI-compatible chat client shared by gemma and modal-lora. One code path. The config (GEMMA_BASE_URL, GEMMA_MODEL,
// GEMMA_API_KEY) is read from env in one place only, core/ports/index.ts makePort, and passed in here as ChatCfg.
// Every call has a 20 s timeout and one retry on a network error, 429 or 5xx, unless a caller passes CallLimits.
// Errors name the HTTP status only: never the body or the key. Research prototype. Not a medical device. Not for clinical use.
import type { ChatMessage } from './prompt';

export interface ChatCfg {
  baseUrl: string;
  apiKey: string;
  model: string;
  /** Optional second endpoint (GEMMA_FALLBACK_*). Tried when the primary fails; see chatCompletion. Never nested. */
  fallback?: ChatCfg;
}

/** Per-call limits. Omitted: the 20 s timeout, one retry, redirects followed (the default for gemma and the Decisions call). */
export interface CallLimits {
  timeoutMs?: number;
  /** false: one HTTP request and no retry. */
  retry?: boolean;
  /** true: a 3xx is returned as the response instead of followed (a Modal cold start answers 303). */
  manualRedirect?: boolean;
}

export const REQUEST_TIMEOUT_MS = 20_000;
const RETRY_DELAY_MS = 300;

const retryable = (status: number) => status === 429 || status >= 500;

/**
 * fetch with a timeout and one retry on a network error, timeout, 429 or 5xx (attempts 2), or a single attempt.
 * Returns the last response (the caller checks `ok`). A network failure throws without the cause text.
 */
export async function fetchRetry(
  url: string,
  init: RequestInit,
  doFetch: typeof fetch = fetch,
  timeoutMs = REQUEST_TIMEOUT_MS,
  attempts: 1 | 2 = 2,
): Promise<Response> {
  let last: Response | null = null;
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const res = await doFetch(url, { ...init, signal: ctl.signal });
      if (!retryable(res.status)) return res;
      last = res;
    } catch {
      last = null;
    } finally {
      clearTimeout(timer);
    }
  }
  if (!last) throw new Error('model call failed: network error or timeout');
  return last;
}

/**
 * POST {baseUrl}/chat/completions to one endpoint. Returns choices[0].message.content, or '' when the reply has none.
 * Used by chatCompletion; it never looks at cfg.fallback.
 */
async function chatOnce(args: {
  cfg: ChatCfg;
  messages: ChatMessage[];
  temperature: number;
  maxTokens?: number;
  fetchImpl?: typeof fetch;
  limits?: CallLimits;
}): Promise<string> {
  const { baseUrl, apiKey, model } = args.cfg;
  const body: Record<string, unknown> = { model, temperature: args.temperature };
  if (args.maxTokens !== undefined) body.max_tokens = args.maxTokens;
  body.messages = args.messages;
  const res = await fetchRetry(
    `${baseUrl.replace(/\/+$/, '')}/chat/completions`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      redirect: args.limits?.manualRedirect ? 'manual' : 'follow',
    },
    args.fetchImpl,
    args.limits?.timeoutMs ?? REQUEST_TIMEOUT_MS,
    args.limits?.retry === false ? 1 : 2,
  );
  if (!res.ok) throw new Error(`model call failed: HTTP ${res.status}`);
  // A reply that is not JSON (an HTML page, say) must not reach the error text: it could carry the body.
  const json = (await res.json().catch(() => {
    throw new Error('model call failed: reply was not JSON');
  })) as { choices?: { message?: { content?: unknown } }[] };
  const content = json.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content : '';
}

/**
 * POST {baseUrl}/chat/completions. Returns choices[0].message.content, or '' when the reply has none.
 * With cfg.fallback: the primary is tried once (no retry, timeout from limits or 20 s). Any error from it logs one line and
 * the fallback is called with the defaults (20 s, one retry). If the fallback fails too, its error propagates.
 * Without a fallback: one endpoint, unchanged behaviour.
 */
export async function chatCompletion(args: {
  cfg: ChatCfg;
  messages: ChatMessage[];
  temperature: number;
  maxTokens?: number;
  fetchImpl?: typeof fetch;
  limits?: CallLimits;
}): Promise<string> {
  const { fallback } = args.cfg;
  if (!fallback) return chatOnce(args);
  try {
    return await chatOnce({ ...args, limits: { ...args.limits, retry: false } });
  } catch (e) {
    // The message names the HTTP status or the failure only (chatOnce), never the body, URL or key.
    console.log(`chat: primary failed (${e instanceof Error ? e.message : 'error'}), served by fallback`);
    return chatOnce({ ...args, cfg: fallback, limits: undefined });
  }
}
