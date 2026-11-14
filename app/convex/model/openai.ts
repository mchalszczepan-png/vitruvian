// OpenAI-compatible chat client shared by gemma and modal-lora. One code path. The config (GEMMA_BASE_URL, GEMMA_MODEL,
// GEMMA_API_KEY) is read from env in one place only, core/ports/index.ts makePort, and passed in here as ChatCfg.
// Every call has a 20 s timeout and one retry on a network error, 429 or 5xx.
// Errors name the HTTP status only: never the body or the key. Research prototype. Not a medical device. Not for clinical use.
import type { ChatMessage } from './prompt';

export interface ChatCfg {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export const REQUEST_TIMEOUT_MS = 20_000;
const RETRY_DELAY_MS = 300;

const retryable = (status: number) => status === 429 || status >= 500;

/**
 * fetch with a timeout and one retry on a network error, timeout, 429 or 5xx.
 * Returns the last response (the caller checks `ok`). A network failure throws without the cause text.
 */
export async function fetchRetry(url: string, init: RequestInit, doFetch: typeof fetch = fetch, timeoutMs = REQUEST_TIMEOUT_MS): Promise<Response> {
  let last: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
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

/** POST {baseUrl}/chat/completions. Returns choices[0].message.content, or '' when the reply has none. */
export async function chatCompletion(args: {
  cfg: ChatCfg;
  messages: ChatMessage[];
  temperature: number;
  maxTokens?: number;
  fetchImpl?: typeof fetch;
}): Promise<string> {
  const { baseUrl, apiKey, model } = args.cfg;
  const body: Record<string, unknown> = { model, temperature: args.temperature };
  if (args.maxTokens !== undefined) body.max_tokens = args.maxTokens;
  body.messages = args.messages;
  const res = await fetchRetry(
    `${baseUrl.replace(/\/+$/, '')}/chat/completions`,
    { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` }, body: JSON.stringify(body) },
    args.fetchImpl,
  );
  if (!res.ok) throw new Error(`model call failed: HTTP ${res.status}`);
  const json = (await res.json()) as { choices?: { message?: { content?: unknown } }[] };
  const content = json.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content : '';
}
