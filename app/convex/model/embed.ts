// The one embedding module: visit notes (embedDocs) and the Repeat query (embedQuery). Two providers, never mixed in one index:
// - embeddinggemma: google/embeddinggemma-300m, self-hosted, OpenAI-compatible POST {EMBED_BASE_URL}/embeddings. Task prefixes
//   from the model card are added here: stored notes "title: none | text: ", queries "task: search result | query: ".
// - gemini: gemini-embedding-001 at 768 dims, no prefixes. The fallback when the EMBED_* env is not set.
// embedderFrom(env) is the only reader of the embedding env. Errors name the HTTP status only, never the body, URL or key.
// Vectors are 768 dims (EMBEDDING_DIMS in schema.ts), checked here. Research prototype. Not a medical device. Not for clinical use.
import { EMBEDDING_DIMS } from '../schema';
import { fetchRetry } from './openai';

export type EmbedProvider = 'embeddinggemma' | 'gemini';

export interface Embedder {
  provider: EmbedProvider;
  /** One vector per note, in input order. The task prefix for stored notes is added here. */
  embedDocs(texts: string[]): Promise<number[][]>;
  /** The Repeat query text. The task prefix for queries is added here. */
  embedQuery(text: string): Promise<number[]>;
}

export type EmbedEnv = Record<string, string | undefined>;

export const EMBED_TIMEOUT_MS = 15_000;
/** Notes per embeddinggemma request. */
export const EMBED_BATCH = 32;

const DOC_PREFIX = 'title: none | text: ';
const QUERY_PREFIX = 'task: search result | query: ';
const GEMINI_EMBED_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

function checkDims(vec: unknown): number[] {
  if (!Array.isArray(vec) || !vec.every((x) => typeof x === 'number')) throw new Error('embedding is not a number array');
  if (vec.length !== EMBEDDING_DIMS) throw new Error(`embedding has ${vec.length} dims, expected ${EMBEDDING_DIMS}`);
  return vec;
}

/** fetchRetry with the embedding timeout. The network error text is replaced: it could carry a URL. */
async function post(url: string, init: RequestInit, doFetch: typeof fetch, label: string): Promise<Response> {
  try {
    return await fetchRetry(url, init, doFetch, EMBED_TIMEOUT_MS);
  } catch {
    throw new Error(`${label} failed: network error or timeout`);
  }
}

function embeddingGemma(cfg: { baseUrl: string; apiKey: string; model: string }, doFetch: typeof fetch): Embedder {
  const label = 'EmbeddingGemma embeddings';

  /** One request. Sorted by index so the order matches the input, whatever order the server answers in. */
  async function embedInputs(input: string[]): Promise<number[][]> {
    const res = await post(
      `${cfg.baseUrl}/embeddings`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.apiKey}` },
        body: JSON.stringify({ model: cfg.model, input }),
      },
      doFetch,
      label,
    );
    if (!res.ok) throw new Error(`${label} failed with HTTP ${res.status}`);
    const json = (await res.json().catch(() => {
      throw new Error(`${label} returned no JSON`);
    })) as { data?: { index?: number; embedding?: unknown }[] };
    const rows = json.data;
    if (!Array.isArray(rows) || rows.length !== input.length) throw new Error(`${label} returned ${rows?.length ?? 0} vectors, expected ${input.length}`);
    const sorted = [...rows].sort((a, b) => (a.index ?? -1) - (b.index ?? -1));
    if (sorted.some((r, i) => r.index !== i)) throw new Error(`${label} returned bad indexes`);
    return sorted.map((r) => checkDims(r.embedding));
  }

  return {
    provider: 'embeddinggemma',
    async embedDocs(texts) {
      const out: number[][] = [];
      for (let i = 0; i < texts.length; i += EMBED_BATCH) {
        out.push(...(await embedInputs(texts.slice(i, i + EMBED_BATCH).map((t) => DOC_PREFIX + t))));
      }
      return out;
    },
    async embedQuery(text) {
      const [vec] = await embedInputs([QUERY_PREFIX + text]);
      return vec;
    },
  };
}

function gemini(apiKey: string, doFetch: typeof fetch): Embedder {
  const embedContent = async (text: string): Promise<number[]> => {
    const res = await post(
      GEMINI_EMBED_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ content: { parts: [{ text }] }, outputDimensionality: EMBEDDING_DIMS }),
      },
      doFetch,
      'Gemini embedContent',
    );
    if (!res.ok) throw new Error(`Gemini embedContent failed with HTTP ${res.status}`);
    const json = (await res.json().catch(() => {
      throw new Error('Gemini embedContent returned no JSON');
    })) as { embedding?: { values?: unknown } };
    if (!json.embedding?.values) throw new Error('Gemini embedContent returned no values');
    return checkDims(json.embedding.values);
  };
  return {
    provider: 'gemini',
    async embedDocs(texts) {
      const out: number[][] = [];
      for (const t of texts) out.push(await embedContent(t));
      return out;
    },
    embedQuery: embedContent,
  };
}

/**
 * EmbeddingGemma when EMBED_BASE_URL, EMBED_API_KEY and EMBED_MODEL are all set; else Gemini when GEMINI_API_KEY is set;
 * else undefined (no embedding: callers skip, and Repeat falls back to the symptom field).
 */
export function embedderFrom(env: EmbedEnv, doFetch: typeof fetch = fetch): Embedder | undefined {
  const baseUrl = env.EMBED_BASE_URL?.trim();
  const apiKey = env.EMBED_API_KEY;
  const model = env.EMBED_MODEL?.trim();
  if (baseUrl && apiKey && model) return embeddingGemma({ baseUrl: baseUrl.replace(/\/+$/, ''), apiKey, model }, doFetch);
  const geminiKey = env.GEMINI_API_KEY;
  if (geminiKey) return gemini(geminiKey, doFetch);
  return undefined;
}
