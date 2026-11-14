// @vitest-environment node
// GEMMA_FALLBACK_*: an optional second chat endpoint for gemma and modal-lora. Mocked fetch, no network. Covers the primary
// failing (503, network error, timeout) and the fallback serving, the primary succeeding (fallback never called), both failing
// (no key or URL in the error or the log), no fallback (unchanged 2 attempts), makePort's all-or-none env check, and the
// modal-lora chain (LoRA and Featherless both fail, the gemma fallback serves). Research prototype. Not a medical device. Not for clinical use.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { chatCompletion, type ChatCfg } from '../../model/openai';
import type { ChatMessage } from '../../model/prompt';
import type { FieldSpec } from '../../model/referralSchema';
import { emptyFacts } from '../facts';
import type { FillInput } from '../port';
import { makePort, type Env } from './index';

const PRIMARY = 'https://primary.test/v1';
const FALLBACK = 'https://fallback.test/v1';
const PRIMARY_URL = `${PRIMARY}/chat/completions`;
const FALLBACK_URL = `${FALLBACK}/chat/completions`;
const KEY_P = 'k-primary';
const KEY_F = 'k-fallback';
const MESSAGES: ChatMessage[] = [{ role: 'user', content: 'hi' }];
const ANSWER = 'fallback answer';

const cfgWithFallback: ChatCfg = {
  baseUrl: PRIMARY,
  apiKey: KEY_P,
  model: 'm-primary',
  fallback: { baseUrl: FALLBACK, apiKey: KEY_F, model: 'm-fallback' },
};
const cfgNoFallback: ChatCfg = { baseUrl: PRIMARY, apiKey: KEY_P, model: 'm-primary' };

const okReply = (content: string) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
const status = (code: number) => new Response('upstream body must not leak', { status: code });
/** A fetch that never answers; it rejects only when the caller's abort signal fires. */
const hangUntilAbort = (init: RequestInit) =>
  new Promise<Response>((_resolve, reject) => {
    init.signal?.addEventListener('abort', () => reject(new Error('aborted')));
  });

type Handler = (init: RequestInit) => Response | Promise<Response>;
/** A stub keyed by URL. Records every URL called. An unknown URL rejects like a network error. */
function fetchStub(handlers: Record<string, Handler>) {
  const calls: string[] = [];
  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push(url);
    const handler = handlers[url];
    if (!handler) throw new Error(`unexpected url ${url}`);
    return handler(init ?? {});
  }) as unknown as typeof fetch;
  return { fetchImpl, calls, count: (url: string) => calls.filter((c) => c === url).length };
}
const authOf = (init: RequestInit) => (init.headers as Record<string, string>).authorization;

/** Every string passed to console.log, joined, so a test can assert no key or URL was logged. */
let logged: string[] = [];
function spyLog() {
  logged = [];
  vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
    logged.push(args.map(String).join(' '));
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('chatCompletion with a fallback endpoint', () => {
  it('a: primary 503 → the fallback is called once and its answer is returned, with a "served by fallback" log line', async () => {
    spyLog();
    const { fetchImpl, count } = fetchStub({
      [PRIMARY_URL]: () => status(503),
      [FALLBACK_URL]: (init) => (authOf(init) === `Bearer ${KEY_F}` ? okReply(ANSWER) : status(401)),
    });
    const out = await chatCompletion({ cfg: cfgWithFallback, messages: MESSAGES, temperature: 0, fetchImpl });
    expect(out).toBe(ANSWER);
    expect(count(PRIMARY_URL)).toBe(1);
    expect(count(FALLBACK_URL)).toBe(1);
    expect(logged).toEqual(['chat: primary failed (model call failed: HTTP 503), served by fallback']);
  });

  it('b: primary network error (fetch rejects) → the fallback serves', async () => {
    spyLog();
    const { fetchImpl, count } = fetchStub({
      [PRIMARY_URL]: () => {
        throw new Error('ECONNRESET at https://primary.test');
      },
      [FALLBACK_URL]: () => okReply(ANSWER),
    });
    const out = await chatCompletion({ cfg: cfgWithFallback, messages: MESSAGES, temperature: 0, fetchImpl });
    expect(out).toBe(ANSWER);
    expect(count(PRIMARY_URL)).toBe(1);
    expect(count(FALLBACK_URL)).toBe(1);
    expect(logged.join('\n')).toContain('served by fallback');
  });

  it('c: primary timeout → the fallback serves', async () => {
    spyLog();
    const { fetchImpl, count } = fetchStub({
      [PRIMARY_URL]: hangUntilAbort,
      [FALLBACK_URL]: () => okReply(ANSWER),
    });
    const out = await chatCompletion({
      cfg: cfgWithFallback,
      messages: MESSAGES,
      temperature: 0,
      fetchImpl,
      limits: { timeoutMs: 10 },
    });
    expect(out).toBe(ANSWER);
    expect(count(PRIMARY_URL)).toBe(1);
    expect(count(FALLBACK_URL)).toBe(1);
    expect(logged.join('\n')).toContain('primary failed (model call failed: network error or timeout), served by fallback');
  });

  it('d: primary ok → the fallback is never called and the primary is called exactly once', async () => {
    spyLog();
    const { fetchImpl, count, calls } = fetchStub({
      [PRIMARY_URL]: () => okReply(ANSWER),
      [FALLBACK_URL]: () => okReply('should not be used'),
    });
    const out = await chatCompletion({ cfg: cfgWithFallback, messages: MESSAGES, temperature: 0, fetchImpl });
    expect(out).toBe(ANSWER);
    expect(calls).toEqual([PRIMARY_URL]);
    expect(count(PRIMARY_URL)).toBe(1);
    expect(logged).toEqual([]);
  });

  it('e: both fail → the call throws, and neither the error nor the log carries a key or a URL', async () => {
    spyLog();
    const { fetchImpl } = fetchStub({
      [PRIMARY_URL]: () => status(503),
      [FALLBACK_URL]: () => status(500),
    });
    const err = await chatCompletion({ cfg: cfgWithFallback, messages: MESSAGES, temperature: 0, fetchImpl }).then(
      () => null,
      (e: unknown) => e as Error,
    );
    expect(err).toBeInstanceOf(Error);
    expect(err!.message).toBe('model call failed: HTTP 500');
    const everything = [err!.message, ...logged].join('\n');
    for (const secret of [KEY_P, KEY_F, PRIMARY, FALLBACK, 'primary.test', 'fallback.test', 'upstream body']) {
      expect(everything).not.toContain(secret);
    }
  });

  it('f: no fallback configured → the primary gets 2 attempts on 503 as before, and no fallback call', async () => {
    spyLog();
    const { fetchImpl, count, calls } = fetchStub({
      [PRIMARY_URL]: () => status(503),
    });
    await expect(chatCompletion({ cfg: cfgNoFallback, messages: MESSAGES, temperature: 0, fetchImpl })).rejects.toThrow(
      'model call failed: HTTP 503',
    );
    expect(count(PRIMARY_URL)).toBe(2);
    expect(calls.some((c) => c.startsWith(FALLBACK))).toBe(false);
    expect(logged).toEqual([]);
  });
});

const baseEnv: Env = {
  MODEL_PROVIDER: 'gemma',
  GEMMA_BASE_URL: PRIMARY,
  GEMMA_API_KEY: KEY_P,
  GEMMA_MODEL: 'm-primary',
  GEMINI_API_KEY: 'gemini-key-not-real',
};
const fallbackEnv: Env = { GEMMA_FALLBACK_BASE_URL: FALLBACK, GEMMA_FALLBACK_API_KEY: KEY_F, GEMMA_FALLBACK_MODEL: 'm-fallback' };

describe('makePort with GEMMA_FALLBACK_*', () => {

  it('g: only some GEMMA_FALLBACK_* set → throws, naming the three variables', () => {
    for (const partial of [
      { GEMMA_FALLBACK_BASE_URL: FALLBACK },
      { GEMMA_FALLBACK_API_KEY: KEY_F },
      { GEMMA_FALLBACK_BASE_URL: FALLBACK, GEMMA_FALLBACK_MODEL: 'm-fallback' },
    ]) {
      expect(() => makePort({ ...baseEnv, ...partial }, undefined, vi.fn() as unknown as typeof fetch)).toThrow(
        'GEMMA_FALLBACK_BASE_URL, GEMMA_FALLBACK_API_KEY and GEMMA_FALLBACK_MODEL must all be set, or none',
      );
    }
  });

  it('all three set, or none: makePort builds without throwing', () => {
    expect(() => makePort({ ...baseEnv, ...fallbackEnv }, undefined, vi.fn() as unknown as typeof fetch)).not.toThrow();
    expect(() => makePort(baseEnv, undefined, vi.fn() as unknown as typeof fetch)).not.toThrow();
  });
});

describe('modal-lora chain with a gemma fallback', () => {
  const LORA_URL = 'https://lora.test/v1/chat/completions';
  const VALID_FIELDS = JSON.stringify({ fields: { mainSymptom: 'cough', haemoptysis: false }, evidence: { mainSymptom: 'Cough for 4 weeks.' } });
  const specs: FieldSpec[] = [
    { key: 'mainSymptom', type: 'string', required: true, minLength: 1 },
    { key: 'haemoptysis', type: 'boolean', required: true },
  ];
  const patient = {
    id: 'SYN-001',
    age: 60,
    sex: 'male',
    smokingStatus: 'former',
    visits: [{ id: 'v1', date: '2026-01-01', reason: 'cough', symptom: 'cough', note: 'Cough for 4 weeks.' }],
  } as unknown as FillInput['patient'];
  const fillInput: FillInput = { cancer: 'lung', patient, facts: emptyFacts(), specs, matchedIds: [], riskScore: 0 };

  it('h: LoRA fails and the Featherless primary fails → the fill is served by the gemma fallback endpoint (servedBy gemma)', async () => {
    spyLog();
    const { fetchImpl, count } = fetchStub({
      [LORA_URL]: () => status(503),
      [PRIMARY_URL]: () => status(503),
      [FALLBACK_URL]: (init) => (authOf(init) === `Bearer ${KEY_F}` ? okReply(VALID_FIELDS) : status(401)),
    });
    const port = makePort(
      {
        ...baseEnv,
        ...fallbackEnv,
        MODEL_PROVIDER: 'modal-lora',
        LORA_BASE_URL: 'https://lora.test/v1',
        LORA_API_KEY: 'k-lora',
        LORA_MODEL: 'vitruvian-lora',
      },
      undefined,
      fetchImpl,
    );
    const out = await port.fill(fillInput);
    expect(out.servedBy).toBe('gemma');
    expect(out.values.mainSymptom).toBe('cough');
    expect(count(LORA_URL)).toBe(1);
    expect(count(PRIMARY_URL)).toBe(1);
    expect(count(FALLBACK_URL)).toBe(1);
    const everything = logged.join('\n');
    expect(everything).toContain('fill: modal-lora failed');
    expect(everything).toContain('served by fallback');
    for (const secret of [KEY_P, KEY_F, 'k-lora']) expect(everything).not.toContain(secret);
  });
});
