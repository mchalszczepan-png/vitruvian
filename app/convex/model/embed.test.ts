// @vitest-environment node
// model/embed.ts with a stubbed fetch: provider choice from env, request URL, body and prefixes, sorting, batching, dims,
// and errors that name the HTTP status only. No network, no real keys. Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it } from 'vitest';
import { embedderFrom, EMBED_BATCH, type EmbedEnv } from './embed';

const DIMS = 768;
const vec = (seed: number) => Array.from({ length: DIMS }, (_, i) => (i === 0 ? seed : 0));
const EMBED_ENV: EmbedEnv = { EMBED_BASE_URL: 'https://embed.example/v1/', EMBED_API_KEY: 'test-embed-key', EMBED_MODEL: 'google/embeddinggemma-300m' };
const GEMINI_ENV: EmbedEnv = { GEMINI_API_KEY: 'test-gemini-key' };

interface Call {
  url: string;
  init: RequestInit;
  body: { model?: string; input?: string[]; content?: { parts: { text: string }[] } };
}

/** A fetch stub that records calls and answers each with the given body (or status). */
function stubFetch(answer: (call: Call) => { status?: number; json?: unknown }) {
  const calls: Call[] = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    const call: Call = { url: String(url), init, body: JSON.parse(String(init.body)) };
    calls.push(call);
    const { status = 200, json = {} } = answer(call);
    return new Response(JSON.stringify(json), { status, headers: { 'content-type': 'application/json' } });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

/** The embeddinggemma reply for one request: data sorted by index, one vector per input (`seed` marks the input). */
const embedReply = (input: string[], reverse = false) => {
  const data = input.map((t, index) => ({ index, embedding: vec(index + 1 + t.length / 1000) }));
  return { data: reverse ? data.reverse() : data };
};

describe('embedderFrom: which provider', () => {
  it('EMBED_BASE_URL, EMBED_API_KEY and EMBED_MODEL all set: embeddinggemma', () => {
    expect(embedderFrom(EMBED_ENV, stubFetch(() => ({})).fetchImpl)?.provider).toBe('embeddinggemma');
  });

  it('EMBED_* incomplete (no model): gemini when GEMINI_API_KEY is set', () => {
    const { EMBED_MODEL: _unused, ...partial } = EMBED_ENV;
    expect(embedderFrom({ ...partial, ...GEMINI_ENV })?.provider).toBe('gemini');
  });

  it('no EMBED_* gives gemini', () => {
    expect(embedderFrom(GEMINI_ENV)?.provider).toBe('gemini');
  });

  it('nothing set gives undefined', () => {
    expect(embedderFrom({})).toBeUndefined();
    expect(embedderFrom({ EMBED_BASE_URL: '  ', EMBED_API_KEY: 'k', EMBED_MODEL: 'm' })).toBeUndefined();
  });
});

describe('embeddinggemma: requests', () => {
  it('posts to {base}/embeddings with the Bearer key and the model, base URL without a trailing slash', async () => {
    const { calls, fetchImpl } = stubFetch((c) => ({ json: embedReply(c.body.input!) }));
    await embedderFrom(EMBED_ENV, fetchImpl)!.embedDocs(['cough for three weeks']);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://embed.example/v1/embeddings');
    expect(calls[0].init.method).toBe('POST');
    expect((calls[0].init.headers as Record<string, string>).authorization).toBe('Bearer test-embed-key');
    expect(calls[0].body.model).toBe('google/embeddinggemma-300m');
  });

  it('stored notes get the document prefix', async () => {
    const { calls, fetchImpl } = stubFetch((c) => ({ json: embedReply(c.body.input!) }));
    await embedderFrom(EMBED_ENV, fetchImpl)!.embedDocs(['a note', 'another']);
    expect(calls[0].body.input).toEqual(['title: none | text: a note', 'title: none | text: another']);
  });

  it('the query gets the search prefix', async () => {
    const { calls, fetchImpl } = stubFetch((c) => ({ json: embedReply(c.body.input!) }));
    const out = await embedderFrom(EMBED_ENV, fetchImpl)!.embedQuery('today cough');
    expect(calls[0].body.input).toEqual(['task: search result | query: today cough']);
    expect(out).toHaveLength(DIMS);
  });

  it('sorts the vectors by index, so they match the input order', async () => {
    const { fetchImpl } = stubFetch((c) => ({ json: embedReply(c.body.input!, true) }));
    const texts = ['x', 'yy', 'zzz'];
    const out = await embedderFrom(EMBED_ENV, fetchImpl)!.embedDocs(texts);
    expect(out.map((v) => v[0])).toEqual(texts.map((t, i) => i + 1 + ('title: none | text: ' + t).length / 1000));
  });

  it('batches notes in chunks of 32', async () => {
    const { calls, fetchImpl } = stubFetch((c) => ({ json: embedReply(c.body.input!) }));
    const texts = Array.from({ length: 40 }, (_, i) => `note ${i}`);
    const out = await embedderFrom(EMBED_ENV, fetchImpl)!.embedDocs(texts);
    expect(EMBED_BATCH).toBe(32);
    expect(calls.map((c) => c.body.input!.length)).toEqual([32, 8]);
    expect(out).toHaveLength(40);
  });

  it('a vector with the wrong dims throws', async () => {
    const { fetchImpl } = stubFetch(() => ({ json: { data: [{ index: 0, embedding: vec(1).slice(1) }] } }));
    await expect(embedderFrom(EMBED_ENV, fetchImpl)!.embedDocs(['a'])).rejects.toThrow('767 dims, expected 768');
  });

  it('a reply with the wrong number of vectors throws', async () => {
    const { fetchImpl } = stubFetch(() => ({ json: { data: [] } }));
    await expect(embedderFrom(EMBED_ENV, fetchImpl)!.embedQuery('a')).rejects.toThrow('expected 1');
  });

  it('HTTP 500 throws with the status only: no key, body or URL in the message', async () => {
    const { fetchImpl } = stubFetch(() => ({ status: 500, json: { error: 'secret body test-embed-key' } }));
    const err = await embedderFrom(EMBED_ENV, fetchImpl)!.embedDocs(['a']).catch((e: Error) => e);
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toBe('EmbeddingGemma embeddings failed with HTTP 500');
    expect((err as Error).message).not.toContain('test-embed-key');
    expect((err as Error).message).not.toContain('embed.example');
  });
});

describe('gemini: requests (unchanged, no prefixes)', () => {
  it('posts the raw note to embedContent with 768 output dims', async () => {
    const { calls, fetchImpl } = stubFetch(() => ({ json: { embedding: { values: vec(1) } } }));
    const out = await embedderFrom(GEMINI_ENV, fetchImpl)!.embedDocs(['plain note']);
    expect(calls[0].url).toContain('gemini-embedding-001:embedContent');
    expect(calls[0].body).toEqual({ content: { parts: [{ text: 'plain note' }] }, outputDimensionality: 768 });
    expect(out).toHaveLength(1);
  });

  it('HTTP error throws with the status only', async () => {
    const { fetchImpl } = stubFetch(() => ({ status: 400, json: { error: 'test-gemini-key' } }));
    const err = (await embedderFrom(GEMINI_ENV, fetchImpl)!.embedQuery('q').catch((e: Error) => e)) as Error;
    expect(err.message).toBe('Gemini embedContent failed with HTTP 400');
    expect(err.message).not.toContain('test-gemini-key');
  });
});
