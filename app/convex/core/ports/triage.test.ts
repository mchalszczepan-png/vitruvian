// @vitest-environment node
// The triage LoRA risk (ml/TRIAGE-CONTRACT.md) through makePort with a mocked fetch. No network.
// Covers: the triage answer (scores by the Rules' cancer, or riskGradient with no Rule), the parse rules, every failure falling
// back to the prompted risk with one log line, no triage model meaning no call, and the cache keys.
// Research prototype. Not a medical device. Not for clinical use.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildTriageMessages } from '../../model/triagePrompt';
import { withCache, type Store } from '../cached';
import type { RiskInput } from '../port';
import { llmPort } from './llm';
import { makePort, type Env } from './index';

const LORA_URL = 'https://lora.test/v1/chat/completions';
const GEMMA_URL = 'https://featherless.test/v1/chat/completions';
const LORA_KEY = 'lora-key-not-real';
const GEMMA_KEY = 'gemma-key-not-real';
const GEMINI = 'gemini-key-not-real';

const env: Env = {
  MODEL_PROVIDER: 'modal-lora',
  GEMMA_BASE_URL: 'https://featherless.test/v1',
  GEMMA_API_KEY: GEMMA_KEY,
  GEMMA_MODEL: 'gemma-model-not-real',
  GEMINI_API_KEY: GEMINI,
  LORA_BASE_URL: 'https://lora.test/v1',
  LORA_API_KEY: LORA_KEY,
  LORA_MODEL: 'vitruvian-lora',
  LORA_TRIAGE_MODEL: 'vitruvian-triage',
};

const chatBody = (content: string) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
const TRIAGE_REPLY = {
  suspectedCancer: 'lung',
  riskGradient: 4,
  scores: { lung: 4, colorectal: 2, ovarian: 2 },
  riskReason: 'Persistent fatigue and cough in a smoker.',
  evidence: ['Yskä 6 viikkoa', 'smoker'],
};
const PROMPTED = { score: 3, reason: 'prompted reason' };

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
  notes: { today: 'Potilas: yskä 6 viikkoa, äänet ö/ä.', earlier: [{ date: '2026-05-02', note: 'Yskä 4 viikkoa. Ei verta.' }] },
};

type Route = (url: string, body: Record<string, unknown>) => Response | Promise<Response>;
function mockFetch(route: Route) {
  const calls: { url: string; init: RequestInit; body: Record<string, unknown> }[] = [];
  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;
    calls.push({ url, init: init ?? {}, body });
    return route(url, body);
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

/** Triage answers with `triage`; the gemma endpoint answers the facts ({}) and the prompted risk. */
const routeWith =
  (triage: () => Response | Promise<Response>): Route =>
  (url, body) => {
    if (url === LORA_URL) return triage();
    return body.model === 'gemma-model-not-real' && JSON.stringify(body.messages).includes('AI risk gradient') ? chatBody(JSON.stringify(PROMPTED)) : chatBody('{}');
  };

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

const bodyOf = (init: RequestInit) => JSON.parse(String(init.body)) as Record<string, unknown>;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('triage risk: the answer', () => {
  it('scores by the Rules cancer and returns the pointer, reason and evidence, with the triage request as the contract sets it', async () => {
    const { fetchImpl, calls } = mockFetch(routeWith(() => chatBody(JSON.stringify(TRIAGE_REPLY))));
    const out = await makePort(env, undefined, fetchImpl).risk(input);

    expect(out).toEqual({
      score: 4,
      reason: 'Persistent fatigue and cough in a smoker.',
      pointer: 'lung',
      evidence: ['Yskä 6 viikkoa', 'smoker'],
      servedBy: 'modal-lora',
    });
    const triageCalls = calls.filter((c) => c.url === LORA_URL);
    expect(triageCalls).toHaveLength(1);
    expect((triageCalls[0].init.headers as Record<string, string>).authorization).toBe(`Bearer ${LORA_KEY}`);
    expect(triageCalls[0].body).toMatchObject({ model: 'vitruvian-triage', temperature: 0, max_tokens: 1024 });
    expect(triageCalls[0].body.messages).toEqual(buildTriageMessages(input.notes.today, input.notes.earlier, { age: 64, sex: 'male' }));
  });

  it('with no Rule matched the score is the riskGradient, not a cancer score', async () => {
    const { fetchImpl } = mockFetch(routeWith(() => chatBody(JSON.stringify({ ...TRIAGE_REPLY, riskGradient: 7, suspectedCancer: 'none' }))));
    const out = await makePort(env, undefined, fetchImpl).risk({ ...input, matched: [], noRuleMatched: true });
    expect(out.score).toBe(7);
    expect(out.pointer).toBe('none');
  });

  it('a fenced reply is parsed; scores are clamped to 0-10 and rounded; evidence keeps 4 strings at most', async () => {
    const reply = `\`\`\`json\n${JSON.stringify({
      suspectedCancer: 'pancreas',
      riskGradient: 12.6,
      scores: { lung: 14, colorectal: -3, ovarian: 2.4 },
      riskReason: '  First line.\nSecond line.  ',
      evidence: ['a', 3, 'b', '  ', 'c', 'd', 'e'],
    })}\n\`\`\``;
    const { fetchImpl } = mockFetch(routeWith(() => chatBody(reply)));
    const out = await llmPort({
      name: 'modal-lora',
      chat: { baseUrl: 'https://featherless.test/v1', apiKey: GEMMA_KEY, model: 'gemma-model-not-real' },
      lora: { baseUrl: 'https://lora.test/v1', apiKey: LORA_KEY, model: 'vitruvian-lora' },
      triage: { baseUrl: 'https://lora.test/v1', apiKey: LORA_KEY, model: 'vitruvian-triage' },
      geminiKey: GEMINI,
      fetchImpl,
    }).risk(input);

    expect(out.score).toBe(10); // lung 14 clamped
    expect(out.pointer).toBeUndefined(); // 'pancreas' is not a triage answer
    expect(out.reason).toBe('First line.');
    expect(out.evidence).toEqual(['a', 'b', 'c', 'd']);
    expect(out.servedBy).toBe('modal-lora');
  });

  it('a riskGradient that is missing takes the highest score when no Rule matched', async () => {
    const reply = { suspectedCancer: 'none', scores: { lung: 2, colorectal: 6, ovarian: 1 }, riskReason: 'Vague picture.' };
    const { fetchImpl } = mockFetch(routeWith(() => chatBody(JSON.stringify(reply))));
    const out = await makePort(env, undefined, fetchImpl).risk({ ...input, matched: [], noRuleMatched: true });
    expect(out.score).toBe(6);
  });
});

describe('triage risk: every failure falls back to the prompted risk', () => {
  const cases: [string, () => Response | Promise<Response>, string][] = [
    ['an HTTP 503', () => new Response('secret-body-text', { status: 503 }), 'model call failed: HTTP 503'],
    ['a network error', () => Promise.reject(new TypeError('socket hang up')), 'model call failed: network error or timeout'],
    ['a reply that is not JSON', () => new Response('<html>secret-body-text</html>', { status: 200 }), 'model call failed: reply was not JSON'],
    ['a reply with no JSON object', () => chatBody('no braces here'), 'triage reply was not a JSON object'],
    ['missing scores', () => chatBody(JSON.stringify({ suspectedCancer: 'lung', riskGradient: 4 })), 'triage reply had no numeric scores'],
    ['an empty riskReason', () => chatBody(JSON.stringify({ ...TRIAGE_REPLY, riskReason: '   ' })), 'triage reply had no riskReason'],
  ];

  it.each(cases)('%s: prompted risk, servedBy gemma, one log line with no body, URL or key', async (_, triage, reason) => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { fetchImpl, calls } = mockFetch(routeWith(triage));
    const out = await makePort(env, undefined, fetchImpl).risk(input);

    expect(out).toEqual({ ...PROMPTED, servedBy: 'gemma' });
    expect(calls.filter((c) => c.url === LORA_URL)).toHaveLength(1); // LORA_LIMITS: no retry
    expect(calls.filter((c) => c.url === GEMMA_URL)).toHaveLength(1);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(`risk: triage failed (${reason}), fell back to gemma`);
    const logged = JSON.stringify(log.mock.calls);
    for (const secret of [LORA_KEY, GEMMA_KEY, 'secret-body-text', LORA_URL]) expect(logged).not.toContain(secret);
  });
});

describe('triage risk: when it is not configured', () => {
  it('no LORA_TRIAGE_MODEL: the prompted risk alone, the triage endpoint is never called, no servedBy', async () => {
    const { LORA_TRIAGE_MODEL: _unused, ...withoutTriage } = env;
    const { fetchImpl, calls } = mockFetch(routeWith(() => chatBody(JSON.stringify(TRIAGE_REPLY))));
    const out = await makePort(withoutTriage, undefined, fetchImpl).risk(input);

    expect(out).toEqual(PROMPTED);
    expect(out).not.toHaveProperty('servedBy');
    expect(calls.some((c) => c.url === LORA_URL)).toBe(false);
  });

  it('gemma: the prompted risk alone, never the LoRA URL', async () => {
    const { fetchImpl, calls } = mockFetch(routeWith(() => chatBody(JSON.stringify(TRIAGE_REPLY))));
    const out = await makePort({ ...env, MODEL_PROVIDER: 'gemma' }, undefined, fetchImpl).risk(input);
    expect(out).toEqual(PROMPTED);
    expect(calls.every((c) => c.url !== LORA_URL)).toBe(true);
  });
});

describe('triage risk: the cache', () => {
  it('a triage answer is stored under the triage key and replayed; a fallback answer is not stored', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const { store, writes } = memoryStore();
    let triageUp = true;
    const { fetchImpl, calls } = mockFetch(routeWith(() => (triageUp ? chatBody(JSON.stringify(TRIAGE_REPLY)) : new Response('', { status: 503 }))));
    const port = makePort(env, store, fetchImpl);

    const first = await port.risk(input);
    expect(first.servedBy).toBe('modal-lora');
    const riskWrites = writes.filter((k) => k.startsWith('risk:'));
    expect(riskWrites).toEqual([expect.stringMatching(/^risk:v2:modal-lora:gemma-model-not-real\+vitruvian-lora\+vitruvian-triage:[0-9a-f]{64}$/)]);
    expect(await port.risk(input)).toEqual(first);
    expect(calls.filter((c) => c.url === LORA_URL)).toHaveLength(1);

    triageUp = false;
    const other = { ...input, notes: { ...input.notes, today: 'Another visit.' } };
    const before = writes.length;
    const fellBack = await port.risk(other);
    expect(fellBack.servedBy).toBe('gemma');
    expect(writes.slice(before).filter((k) => k.startsWith('risk:'))).toEqual([]);
  });

  it('the risk key carries the triage model id only when there is one; facts keys keep their old shape', async () => {
    const { store, writes } = memoryStore();
    const base = llmPort({
      name: 'gemma',
      chat: { baseUrl: 'https://featherless.test/v1', apiKey: GEMMA_KEY, model: 'm' },
      geminiKey: GEMINI,
      fetchImpl: mockFetch(routeWith(() => chatBody('{}'))).fetchImpl,
    });
    const stubRisk = { ...base, risk: async () => PROMPTED };
    await withCache(stubRisk, store, 'm').risk(input);
    await withCache(stubRisk, store, 'm', 't').risk(input);
    expect(writes).toEqual([expect.stringMatching(/^risk:v2:gemma:m:/), expect.stringMatching(/^risk:v2:gemma:m\+t:/)]);

    const facts = makePort(env, store, mockFetch(routeWith(() => chatBody('{}'))).fetchImpl);
    await facts.extractFacts('Cough for 4 weeks.');
    expect(writes.at(-1)).toMatch(/^facts:v1:modal-lora:gemma-model-not-real\+vitruvian-lora:[0-9a-f]{64}$/);
  });
});
