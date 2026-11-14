// @vitest-environment node
// The MedGemma triage (the first risk step) through makePort with a mocked fetch. No network, fake keys.
// Covers: the chain (MedGemma, then the E4B triage, then the prompted risk), each failure handing on with one log line and no
// body, URL or key, partial MEDGEMMA_* env throwing, and the cache (only the top of the chain is stored).
// Research prototype. Not a medical device. Not for clinical use.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildTriageMessages } from '../../model/triagePrompt';
import { withCache, type Store } from '../cached';
import type { ModelPort, RiskInput } from '../port';
import { makePort, type Env } from './index';

const MEDGEMMA_URL = 'https://medgemma.test/v1/chat/completions';
const LORA_URL = 'https://lora.test/v1/chat/completions';
const GEMMA_URL = 'https://featherless.test/v1/chat/completions';
const MED_KEY = 'medgemma-key-not-real';
const LORA_KEY = 'lora-key-not-real';
const GEMMA_KEY = 'gemma-key-not-real';

const env: Env = {
  MODEL_PROVIDER: 'modal-lora',
  GEMMA_BASE_URL: 'https://featherless.test/v1',
  GEMMA_API_KEY: GEMMA_KEY,
  GEMMA_MODEL: 'gemma-model-not-real',
  GEMINI_API_KEY: 'gemini-key-not-real',
  LORA_BASE_URL: 'https://lora.test/v1',
  LORA_API_KEY: LORA_KEY,
  LORA_MODEL: 'vitruvian-lora',
  LORA_TRIAGE_MODEL: 'vitruvian-triage',
  MEDGEMMA_TRIAGE_BASE_URL: 'https://medgemma.test/v1',
  MEDGEMMA_TRIAGE_API_KEY: MED_KEY,
  MEDGEMMA_TRIAGE_MODEL: 'vitruvian-medgemma',
};

const chatBody = (content: string) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
const MED_REPLY = {
  suspectedCancer: 'colorectal',
  riskGradient: 6,
  scores: { lung: 3, colorectal: 6, ovarian: 1 },
  riskReason: 'MedGemma reason.',
  evidence: ['medgemma phrase'],
};
const E4B_REPLY = {
  suspectedCancer: 'lung',
  riskGradient: 4,
  scores: { lung: 4, colorectal: 2, ovarian: 2 },
  riskReason: 'E4B reason.',
  evidence: ['e4b phrase'],
};
const PROMPTED = { score: 2, reason: 'prompted reason' };

const input: RiskInput = {
  cancer: 'lung',
  matched: [{ id: 'LUNG-02', because: 'coughed up blood' }],
  history: {
    visitCount: 2,
    repeatVisit: false,
    lasting: 1,
    age: 64,
    sex: 'male',
    visits: [
      { date: '2026-05-02', reason: 'cough' },
      { date: '2026-09-03', reason: 'fatigue' },
    ],
  },
  noRuleMatched: false,
  notes: { today: 'Potilas: yskä 6 viikkoa.', earlier: [{ date: '2026-05-02', note: 'Yskä 4 viikkoa.' }] },
};

type Answer = () => Response | Promise<Response>;
const HTTP_503: Answer = () => new Response('secret-body-text', { status: 503 });
const NETWORK: Answer = () => Promise.reject(new TypeError('socket hang up'));
const NOT_JSON: Answer = () => new Response('<html>secret-body-text</html>', { status: 200 });

/** MedGemma answers with `medgemma`, the E4B triage with `lora`; the Featherless endpoint answers facts ({}) and the prompted risk. */
function mockFetch(medgemma: Answer, lora: Answer = () => chatBody(JSON.stringify(E4B_REPLY))) {
  const calls: { url: string; init: RequestInit; body: Record<string, unknown> }[] = [];
  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;
    calls.push({ url, init: init ?? {}, body });
    if (url === MEDGEMMA_URL) return medgemma();
    if (url === LORA_URL) return lora();
    if (url.startsWith('https://generativelanguage.googleapis.com/')) return new Response(JSON.stringify({ answers: {} }), { status: 200 });
    return JSON.stringify(body.messages).includes('AI risk gradient') ? chatBody(JSON.stringify(PROMPTED)) : chatBody('{}');
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
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

const riskWrites = (writes: string[]) => writes.filter((k) => k.startsWith('risk:'));
const withoutMedgemma = (e: Env): Env => {
  const { MEDGEMMA_TRIAGE_BASE_URL: _a, MEDGEMMA_TRIAGE_API_KEY: _b, MEDGEMMA_TRIAGE_MODEL: _c, ...rest } = e;
  return rest;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('MedGemma triage: the answer', () => {
  it('answers first with the triage contract: MedGemma URL and model, temperature 0, 1024 tokens, the same messages', async () => {
    const { fetchImpl, calls } = mockFetch(() => chatBody(JSON.stringify(MED_REPLY)));
    const out = await makePort(env, undefined, fetchImpl).risk(input);

    expect(out).toEqual({
      score: 3,
      reason: 'MedGemma reason.',
      pointer: 'colorectal',
      evidence: ['medgemma phrase'],
      servedBy: 'medgemma',
      servedModel: 'vitruvian-medgemma',
    });
    const medCalls = calls.filter((c) => c.url === MEDGEMMA_URL);
    expect(medCalls).toHaveLength(1);
    expect((medCalls[0].init.headers as Record<string, string>).authorization).toBe(`Bearer ${MED_KEY}`);
    expect(medCalls[0].body).toMatchObject({ model: 'vitruvian-medgemma', temperature: 0, max_tokens: 1024 });
    expect(medCalls[0].body.messages).toEqual(buildTriageMessages(input.notes.today, input.notes.earlier, { age: 64, sex: 'male' }));
    expect(calls.some((c) => c.url === LORA_URL)).toBe(false);
  });

  it('MedGemma without LORA_TRIAGE_MODEL still answers: no E4B call, servedBy medgemma', async () => {
    const { fetchImpl, calls } = mockFetch(() => chatBody(JSON.stringify(MED_REPLY)));
    const out = await makePort({ ...env, LORA_TRIAGE_MODEL: undefined }, undefined, fetchImpl).risk(input);
    expect(out.servedBy).toBe('medgemma');
    expect(calls.some((c) => c.url === LORA_URL)).toBe(false);
  });
});

describe('MedGemma triage: each failure hands on', () => {
  const cases: [string, Answer, string][] = [
    ['an HTTP 503', HTTP_503, 'model call failed: HTTP 503'],
    ['a network error', NETWORK, 'model call failed: network error or timeout'],
    ['a reply that is not JSON', NOT_JSON, 'model call failed: reply was not JSON'],
  ];

  it.each(cases)('%s: the E4B triage answers, one log line, MedGemma called once (no retry), no body, URL or key logged', async (_, medAnswer, reason) => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { fetchImpl, calls } = mockFetch(medAnswer);
    const out = await makePort(env, undefined, fetchImpl).risk(input);

    expect(out).toEqual({ score: 4, reason: 'E4B reason.', pointer: 'lung', evidence: ['e4b phrase'], servedBy: 'modal-lora', servedModel: 'vitruvian-triage' });
    expect(calls.filter((c) => c.url === MEDGEMMA_URL)).toHaveLength(1);
    expect(calls.filter((c) => c.url === LORA_URL)).toHaveLength(1);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(`risk: medgemma failed (${reason}), trying the E4B triage`);
    const logged = JSON.stringify(log.mock.calls);
    for (const secret of [MED_KEY, LORA_KEY, GEMMA_KEY, 'secret-body-text', MEDGEMMA_URL, LORA_URL]) expect(logged).not.toContain(secret);
  });

  it('MedGemma and the E4B both fail: the prompted risk, servedBy gemma, two log lines', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { fetchImpl, calls } = mockFetch(HTTP_503, HTTP_503);
    const out = await makePort(env, undefined, fetchImpl).risk(input);

    expect(out).toEqual({ ...PROMPTED, servedBy: 'gemma' });
    expect(calls.filter((c) => c.url === GEMMA_URL && JSON.stringify(c.body.messages).includes('AI risk gradient'))).toHaveLength(1);
    expect(log.mock.calls.map((c) => c[0])).toEqual([
      'risk: medgemma failed (model call failed: HTTP 503), trying the E4B triage',
      'risk: triage failed (model call failed: HTTP 503), fell back to gemma',
    ]);
    const logged = JSON.stringify(log.mock.calls);
    for (const secret of [MED_KEY, LORA_KEY, GEMMA_KEY, 'secret-body-text']) expect(logged).not.toContain(secret);
  });

  it('MedGemma set without LORA_TRIAGE_MODEL and MedGemma fails: the prompted risk at once, LoRA never called', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { LORA_TRIAGE_MODEL: _unused, ...noTriage } = env;
    const { fetchImpl, calls } = mockFetch(HTTP_503);
    const out = await makePort(noTriage, undefined, fetchImpl).risk(input);

    expect(out).toEqual({ ...PROMPTED, servedBy: 'gemma' });
    expect(calls.some((c) => c.url === LORA_URL)).toBe(false);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith('risk: medgemma failed (model call failed: HTTP 503), fell back to gemma');
  });
});

describe('MedGemma triage: config', () => {
  it.each(['MEDGEMMA_TRIAGE_BASE_URL', 'MEDGEMMA_TRIAGE_API_KEY', 'MEDGEMMA_TRIAGE_MODEL'] as const)(
    'only %s set: throws a config error that names the three variables, never a key',
    (missing) => {
      const partial = { ...env, [missing]: undefined };
      expect(() => makePort(partial)).toThrow('MEDGEMMA_TRIAGE_BASE_URL, MEDGEMMA_TRIAGE_API_KEY and MEDGEMMA_TRIAGE_MODEL must all be set, or none');
    },
  );

  it('MEDGEMMA_* is read only for modal-lora: a gemma port with a partial MedGemma set never calls MedGemma', async () => {
    const { fetchImpl, calls } = mockFetch(() => chatBody(JSON.stringify(MED_REPLY)));
    const gemma = makePort({ ...env, MODEL_PROVIDER: 'gemma', MEDGEMMA_TRIAGE_API_KEY: undefined, MEDGEMMA_TRIAGE_MODEL: undefined }, undefined, fetchImpl);
    const out = await gemma.risk(input);
    expect(out).toEqual(PROMPTED);
    expect(calls.some((c) => c.url === MEDGEMMA_URL)).toBe(false);
  });
});

describe('MedGemma triage: the cache', () => {
  it('a MedGemma answer is stored under the risk key with both triage ids, and replayed', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const { store, writes } = memoryStore();
    const { fetchImpl, calls } = mockFetch(() => chatBody(JSON.stringify(MED_REPLY)));
    const port = makePort(env, store, fetchImpl);

    const first = await port.risk(input);
    expect(first.servedBy).toBe('medgemma');
    expect(riskWrites(writes)).toEqual([
      expect.stringMatching(/^risk:v2:modal-lora:gemma-model-not-real\+vitruvian-lora\+vitruvian-medgemma\+vitruvian-triage:[0-9a-f]{64}$/),
    ]);
    expect(await port.risk(input)).toEqual(first);
    expect(calls.filter((c) => c.url === MEDGEMMA_URL)).toHaveLength(1);
  });

  it('an E4B fallback is not stored while MedGemma is configured, so MedGemma is asked again next time', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const { store, writes } = memoryStore();
    let medUp = false;
    const { fetchImpl, calls } = mockFetch(() => (medUp ? chatBody(JSON.stringify(MED_REPLY)) : new Response('', { status: 503 })));
    const port = makePort(env, store, fetchImpl);

    const fellBack = await port.risk(input);
    expect(fellBack.servedBy).toBe('modal-lora');
    expect(riskWrites(writes)).toEqual([]);

    medUp = true;
    const next = await port.risk(input);
    expect(next.servedBy).toBe('medgemma');
    expect(calls.filter((c) => c.url === MEDGEMMA_URL)).toHaveLength(2);
    expect(riskWrites(writes)).toHaveLength(1);
  });

  it('a prompted (gemma) fallback is never stored', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const { store, writes } = memoryStore();
    const { fetchImpl } = mockFetch(HTTP_503, HTTP_503);
    const out = await makePort(env, store, fetchImpl).risk(input);
    expect(out.servedBy).toBe('gemma');
    expect(riskWrites(writes)).toEqual([]);
  });

  it('the risk key changes when MEDGEMMA_TRIAGE_MODEL is set; facts, decision and fill keys keep their shape', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const { store, writes } = memoryStore();
    const { fetchImpl } = mockFetch(() => chatBody(JSON.stringify(MED_REPLY)));
    await makePort(withoutMedgemma(env), store, fetchImpl).risk(input);
    await makePort(env, store, fetchImpl).risk(input);
    const [withoutKey, withKey] = riskWrites(writes);
    expect(withoutKey).toMatch(/^risk:v2:modal-lora:gemma-model-not-real\+vitruvian-lora\+vitruvian-triage:/);
    expect(withKey).toMatch(/^risk:v2:modal-lora:gemma-model-not-real\+vitruvian-lora\+vitruvian-medgemma\+vitruvian-triage:/);
    expect(withKey).not.toBe(withoutKey);

    // The triage ids are not in the other keys: a stub port shows the prefix each cached call writes under.
    const stub = {
      name: 'modal-lora',
      extractFacts: async () => ({}),
      decide: async () => ({ q1: { yes: true } }),
      risk: async () => ({ ...PROMPTED, servedBy: 'medgemma' as const }),
      fill: async () => ({ values: { a: 1 } }),
    } as unknown as ModelPort;
    const other = memoryStore();
    const cached = withCache(stub, other.store, 'm+l', 'vitruvian-medgemma+vitruvian-triage', 'medgemma');
    await cached.extractFacts('note');
    await cached.decide({ facts: {} as never, who: {} as never, questions: [{ id: 'q1', question: 'Q?' }] });
    await cached.fill({} as never);
    expect(other.writes.map((k) => k.split(':').slice(0, 4).join(':'))).toEqual([
      'facts:v1:modal-lora:m+l',
      'decision:v2:modal-lora:m+l',
      'fill:v1:modal-lora:m+l',
    ]);
  });
});
