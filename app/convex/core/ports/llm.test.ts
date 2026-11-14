// @vitest-environment node
// The live port against a fetch mock: the chat client posts to {baseUrl}/chat/completions with the model id and key,
// the Decisions API gets one POST with every question, and a bad reply throws with the HTTP status only. No network.
// Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it, vi } from 'vitest';
import { emptyFacts } from '../facts';
import { withCache, type Store } from '../cached';
import { llmPort } from './llm';

const KEY = 'test-key-not-real';
const GEMINI = 'gemini-key-not-real';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

function setup(reply: (url: string, body: Record<string, unknown>) => Response) {
  const calls: { url: string; headers: Record<string, string>; body: Record<string, unknown> }[] = [];
  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body));
    calls.push({ url, headers: init?.headers as Record<string, string>, body });
    return reply(url, body);
  }) as unknown as typeof fetch;
  const port = llmPort({ name: 'gemma', chat: { baseUrl: 'https://example.test/v1/', apiKey: KEY, model: 'test-model' }, geminiKey: GEMINI, fetchImpl });
  return { port, calls };
}
const chat = (content: string) => json({ choices: [{ message: { content } }] });

describe('llmPort', () => {
  it('extractFacts posts to {baseUrl}/chat/completions at temperature 0 and keeps only typed fact keys', async () => {
    const { port, calls } = setup(() => chat('```json\n{"coughWeeks": 4, "haemoptysis": "yes", "tired": true, "invented": 1}\n```'));
    const facts = await port.extractFacts('Cough for 4 weeks. Tired.');
    expect(facts).toEqual({ coughWeeks: 4, tired: true });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://example.test/v1/chat/completions');
    expect(calls[0].headers.authorization).toBe(`Bearer ${KEY}`);
    expect(calls[0].body).toMatchObject({ model: 'test-model', temperature: 0 });
  });

  it('decide sends one Decisions request for all questions; p >= 0.5 is yes', async () => {
    const { port, calls } = setup(() => json({ answers: { 'LUNG-02': { noul: 0.9 }, 'LUNG-03': { noul: 0.2 } } }));
    const out = await port.decide({
      facts: emptyFacts(),
      who: { age: 60, sex: 'male', smokingStatus: 'former' },
      questions: [{ id: 'LUNG-02', question: 'Coughed up blood?' }, { id: 'LUNG-03', question: 'Two symptoms?' }],
    });
    expect(out).toEqual({ 'LUNG-02': { yes: true }, 'LUNG-03': { yes: false } });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://generativelanguage.googleapis.com/v1beta/decisions');
    expect(calls[0].headers['x-goog-api-key']).toBe(GEMINI);
    expect(calls[0].body.model).toBe('gemini-decision-1');
  });

  it('a risk reply without a number throws, and a failing call names the HTTP status only (one retry on 5xx)', async () => {
    const bad = setup(() => chat('{"reason": "no score"}'));
    await expect(bad.port.risk({ cancer: 'lung', matched: [], history: { visitCount: 1, repeatVisit: false, lasting: 0, age: 60, sex: 'male', visits: [] } })).rejects.toThrow('no numeric score');

    const down = setup(() => new Response('secret-looking-body', { status: 503 }));
    const err = await down.port.extractFacts('note').catch((e: Error) => e);
    expect((err as Error).message).toBe('model call failed: HTTP 503');
    expect(down.calls).toHaveLength(2);
  });

  it('the cache decorator replays decide and risk from the store: the second run makes no model call', async () => {
    const { port, calls } = setup((url) => (url.includes('decisions') ? json({ answers: { 'LUNG-02': { noul: 0.8 } } }) : chat('{"score": 6, "reason": "ok"}')));
    const rows = new Map<string, string>();
    const store: Store = {
      getMany: async (keys) => Object.fromEntries(keys.filter((k) => rows.has(k)).map((k) => [k, rows.get(k)!])),
      setMany: async (entries) => entries.forEach((e) => rows.set(e.key, e.value)),
    };
    const cached = withCache(port, store, 'test-model');
    const args = { facts: emptyFacts(), who: { age: 60, sex: 'male', smokingStatus: 'former' } as const, questions: [{ id: 'LUNG-02', question: 'Coughed up blood?' }] };
    const risk = { cancer: 'lung' as const, matched: [], history: { visitCount: 1, repeatVisit: false, lasting: 0, age: 60, sex: 'male', visits: [] } };
    const first = [await cached.decide(args), await cached.risk(risk)];
    const second = [await cached.decide(args), await cached.risk(risk)];
    expect(second).toEqual(first);
    expect(calls).toHaveLength(2); // one decisions call and one risk call, not four
  });
});
