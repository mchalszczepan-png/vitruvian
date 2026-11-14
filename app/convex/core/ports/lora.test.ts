// @vitest-environment node
// modal-lora: the fill goes to the LoRA first and falls back to gemma (Featherless) on any failure. Mocked fetch, no network.
// Covers the LoRA success, the 303 / 500 / timeout / invalid-output fallbacks, the cache skip for a fallback, makePort's env check,
// and that the gemma provider never calls the LoRA. Research prototype. Not a medical device. Not for clinical use.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyFacts } from '../facts';
import { withCache, type Store } from '../cached';
import type { FillInput } from '../port';
import type { FieldSpec } from '../../model/referralSchema';
import { llmPort } from './llm';
import { makePort, type Env } from './index';

const LORA = { baseUrl: 'https://lora.test/v1/', apiKey: 'lora-key-not-real', model: 'vitruvian-lora' };
const GEMMA = { baseUrl: 'https://featherless.test/v1', apiKey: 'gemma-key-not-real', model: 'gemma-model-not-real' };
const LORA_URL = 'https://lora.test/v1/chat/completions';
const GEMMA_URL = 'https://featherless.test/v1/chat/completions';
const GEMINI = 'gemini-key-not-real';

/** A fill reply that passes the two specs below. */
const VALID_FIELDS = JSON.stringify({ fields: { mainSymptom: 'cough', haemoptysis: false }, evidence: { mainSymptom: 'Cough for 4 weeks.' } });
const chatBody = (content: string) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
const gemmaOk = () => chatBody(VALID_FIELDS);

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

type Route = (url: string, init: RequestInit) => Response | Promise<Response>;
function mockFetch(route: Route) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init: init ?? {} });
    return route(url, init ?? {});
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}
/** LoRA answers with `lora`; the gemma endpoint always answers a valid fill. */
const routeWith = (lora: (init: RequestInit) => Response | Promise<Response>): Route => (url, init) => (url === LORA_URL ? lora(init) : gemmaOk());
const bodyOf = (init: RequestInit) => JSON.parse(String(init.body)) as Record<string, unknown>;

function loraPort(fetchImpl: typeof fetch) {
  return llmPort({ name: 'modal-lora', chat: GEMMA, lora: LORA, geminiKey: GEMINI, fetchImpl });
}

function memoryStore() {
  const rows = new Map<string, string>();
  const writes: string[] = [];
  const store: Store = {
    getMany: async (keys) => Object.fromEntries(keys.flatMap((k) => (rows.has(k) ? [[k, rows.get(k)!]] : []))),
    setMany: async (entries) => {
      for (const e of entries) {
        rows.set(e.key, e.value);
        writes.push(e.key);
      }
    },
  };
  return { store, writes };
}

const fullEnv: Env = {
  MODEL_PROVIDER: 'modal-lora',
  GEMMA_BASE_URL: GEMMA.baseUrl,
  GEMMA_API_KEY: GEMMA.apiKey,
  GEMMA_MODEL: GEMMA.model,
  GEMINI_API_KEY: GEMINI,
  LORA_BASE_URL: LORA.baseUrl,
  LORA_API_KEY: LORA.apiKey,
  LORA_MODEL: LORA.model,
};

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('modal-lora fill', () => {
  it('LoRA success: posts to the LORA base URL with the LORA model, follows no redirect, and says modal-lora served it', async () => {
    const { fetchImpl, calls } = mockFetch(routeWith(() => chatBody(VALID_FIELDS)));
    const out = await loraPort(fetchImpl).fill(fillInput);

    expect(out.servedBy).toBe('modal-lora');
    expect(out.values).toEqual({ mainSymptom: 'cough', haemoptysis: false });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(LORA_URL);
    expect(calls[0].init.redirect).toBe('manual');
    expect((calls[0].init.headers as Record<string, string>).authorization).toBe(`Bearer ${LORA.apiKey}`);
    expect(bodyOf(calls[0].init)).toMatchObject({ model: 'vitruvian-lora', temperature: 0, max_tokens: 2048 });
  });

  it.each([
    ['a 303 cold-start answer', () => new Response(null, { status: 303, headers: { location: 'https://modal.test/starting' } }), 'model call failed: HTTP 303'],
    ['a 500', () => new Response('internal body that must not be logged', { status: 500 }), 'model call failed: HTTP 500'],
  ])('%s falls back to the gemma endpoint, with no retry on the LoRA', async (_, lora, reason) => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { fetchImpl, calls } = mockFetch(routeWith(lora));
    const out = await loraPort(fetchImpl).fill(fillInput);

    expect(out.servedBy).toBe('gemma');
    expect(calls.map((c) => c.url)).toEqual([LORA_URL, GEMMA_URL]);
    expect(bodyOf(calls[1].init)).toMatchObject({ model: 'gemma-model-not-real' });
    expect(log).toHaveBeenCalledWith(`fill: modal-lora failed (${reason}), fell back to gemma`);
  });

  it('a timeout after 25 s falls back to the gemma endpoint without waiting for the cold start', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const hangUntilAborted = (init: RequestInit) =>
      new Promise<Response>((_, reject) => init.signal?.addEventListener('abort', () => reject(new Error('aborted'))));
    const { fetchImpl, calls } = mockFetch(routeWith(hangUntilAborted));

    const pending = loraPort(fetchImpl).fill(fillInput);
    await vi.advanceTimersByTimeAsync(25_000);
    const out = await pending;

    expect(out.servedBy).toBe('gemma');
    expect(calls.map((c) => c.url)).toEqual([LORA_URL, GEMMA_URL]);
    expect(log).toHaveBeenCalledWith('fill: modal-lora failed (model call failed: network error or timeout), fell back to gemma');
  });

  it('a LoRA reply the contract rejects (no fields) falls back to the gemma endpoint', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { fetchImpl, calls } = mockFetch(routeWith(() => chatBody('{"fields": {}, "evidence": {}}')));
    const out = await loraPort(fetchImpl).fill(fillInput);

    expect(out.servedBy).toBe('gemma');
    expect(calls.map((c) => c.url)).toEqual([LORA_URL, GEMMA_URL]);
    expect(log).toHaveBeenCalledWith('fill: modal-lora failed (LoRA reply was not valid fill output), fell back to gemma');
  });

  it('a LoRA reply that is not JSON falls back, and the logged reason never carries the body', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { fetchImpl } = mockFetch(routeWith(() => new Response('<html>secret-page-body</html>', { status: 200 })));
    const out = await loraPort(fetchImpl).fill(fillInput);

    expect(out.servedBy).toBe('gemma');
    const line = String(log.mock.calls[0][0]);
    expect(line).toContain('fell back to gemma');
    expect(line).not.toContain('secret-page-body');
  });

  it('gemma never calls the LoRA URL and its fill result carries no servedBy', async () => {
    const { fetchImpl, calls } = mockFetch(() => gemmaOk());
    const port = llmPort({ name: 'gemma', chat: GEMMA, geminiKey: GEMINI, fetchImpl });
    const out = await port.fill(fillInput);
    await port.extractFacts('Cough for 4 weeks.').catch(() => undefined);

    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every((c) => c.url !== LORA_URL && c.url.startsWith(GEMMA.baseUrl))).toBe(true);
    expect(calls.every((c) => c.init.redirect === 'follow')).toBe(true);
    expect(out).not.toHaveProperty('servedBy');
  });
});

describe('modal-lora cache', () => {
  it('a LoRA fill is cached under the modal-lora key; a fallback fill is not, so the next call tries the LoRA again', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { store, writes } = memoryStore();
    let loraUp = true;
    const { fetchImpl, calls } = mockFetch(routeWith(() => (loraUp ? chatBody(VALID_FIELDS) : new Response(null, { status: 303 }))));
    const port = makePort(fullEnv, store, fetchImpl);

    // LoRA answers: the fill is stored once and replayed from the cache.
    const served = await port.fill(fillInput);
    expect(served.servedBy).toBe('modal-lora');
    expect(writes.filter((k) => k.startsWith('fill:v1:modal-lora:'))).toHaveLength(1);
    await port.fill(fillInput);
    expect(calls.filter((c) => c.url === LORA_URL)).toHaveLength(1);

    // LoRA cold: the fallback answer is served but not stored.
    loraUp = false;
    const fallbackInput = { ...fillInput, riskScore: 7 };
    const before = writes.length;
    const fellBack = await port.fill(fallbackInput);
    expect(fellBack.servedBy).toBe('gemma');
    expect(writes.slice(before).filter((k) => k.startsWith('fill:'))).toEqual([]);

    // Not cached, so the next call goes to the LoRA again.
    loraUp = true;
    const again = await port.fill(fallbackInput);
    expect(again.servedBy).toBe('modal-lora');
    expect(calls.filter((c) => c.url === LORA_URL)).toHaveLength(3);
    expect(log).toHaveBeenCalledTimes(1);
  });

  it('withCache skips the write only for a modal-lora port whose fill came from gemma', async () => {
    const writes: string[] = [];
    const store: Store = { getMany: async () => ({}), setMany: async (entries) => void writes.push(...entries.map((e) => e.key)) };
    const fallbackFill = { values: { mainSymptom: 'cough' }, evidence: {}, servedBy: 'gemma' as const };
    const gemmaFill = { values: { mainSymptom: 'cough' }, evidence: {} };
    const asPort = (name: string, out: typeof fallbackFill | typeof gemmaFill) =>
      ({ name, fill: async () => out }) as unknown as Parameters<typeof withCache>[0];

    await withCache(asPort('modal-lora', fallbackFill), store, 'm').fill(fillInput);
    expect(writes).toEqual([]);
    await withCache(asPort('gemma', gemmaFill), store, 'm').fill(fillInput);
    expect(writes).toHaveLength(1);
  });
});

describe('makePort with modal-lora', () => {
  it('throws, naming the LORA variables, when any LORA_* is missing', () => {
    for (const key of ['LORA_BASE_URL', 'LORA_API_KEY', 'LORA_MODEL']) {
      expect(() => makePort({ ...fullEnv, [key]: undefined })).toThrow(/LORA_BASE_URL, LORA_API_KEY and LORA_MODEL must be set/);
    }
  });

  it('builds the modal-lora port when every variable is set', () => {
    expect(makePort(fullEnv).name).toBe('modal-lora');
  });
});
