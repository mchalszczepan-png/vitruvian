// Cache decorator for a ModelPort. Wraps extractFacts, decide, risk and fill (all run at temperature 0, so a replay is correct).
// Keys: facts by (port, model id, sha(note)); decision by (rule, sha(question + facts)); risk by sha(input); fill by sha(input).
// Fill is keyed by its whole input (patient visits, facts, specs, matched Rules, risk), so a changed note or Rule misses the cache.
// The Store is the decisionCache key/value table (lib/store.ts), with batched reads and writes.
// Research prototype. Not a medical device. Not for clinical use.
import type { FillOutput } from '../model/contract';
import { factsJson } from './facts';
import type { Decision, ModelPort, RiskOutput } from './port';

export interface Store {
  getMany(keys: string[]): Promise<Record<string, string>>;
  setMany(entries: { key: string; value: string }[]): Promise<void>;
}

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function parse<T>(raw: string | undefined): T | undefined {
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined; // a damaged row counts as a miss
  }
}

export function withCache(port: ModelPort, store: Store, modelId: string): ModelPort {
  const prefix = `${port.name}:${modelId}`;
  return {
    name: port.name,

    async extractFacts(note) {
      const key = `facts:v1:${prefix}:${await sha256Hex(note)}`;
      const hit = parse<Record<string, unknown>>((await store.getMany([key]))[key]);
      if (hit) return hit;
      const facts = await port.extractFacts(note);
      await store.setMany([{ key, value: JSON.stringify(facts) }]);
      return facts;
    },

    async decide({ facts, who, questions }) {
      const json = factsJson(facts);
      const keys = await Promise.all(questions.map(async (q) => `decision:v2:${prefix}:${q.id}:${await sha256Hex(`${q.question}\n${json}`)}`));
      const cached = await store.getMany(keys);
      const out: Record<string, Decision> = {};
      const misses: { index: number; id: string }[] = [];
      questions.forEach((q, i) => {
        const hit = parse<Decision>(cached[keys[i]]);
        if (hit) out[q.id] = hit;
        else misses.push({ index: i, id: q.id });
      });
      if (misses.length === 0) return out;
      const fresh = await port.decide({ facts, who, questions: misses.map((m) => questions[m.index]) });
      const entries: { key: string; value: string }[] = [];
      for (const m of misses) {
        const d = fresh[m.id] ?? { yes: false };
        out[m.id] = d;
        entries.push({ key: keys[m.index], value: JSON.stringify(d) });
      }
      await store.setMany(entries);
      return out;
    },

    async risk(input) {
      const key = `risk:v1:${prefix}:${await sha256Hex(JSON.stringify(input))}`;
      const hit = parse<RiskOutput>((await store.getMany([key]))[key]);
      if (hit && typeof hit.score === 'number') return hit;
      const out = await port.risk(input);
      await store.setMany([{ key, value: JSON.stringify(out) }]);
      return out;
    },

    async fill(input) {
      const key = `fill:v1:${prefix}:${await sha256Hex(JSON.stringify(input))}`;
      const hit = parse<FillOutput>((await store.getMany([key]))[key]);
      if (hit && typeof hit.values === 'object' && hit.values !== null) return hit;
      const out = await port.fill(input);
      await store.setMany([{ key, value: JSON.stringify(out) }]);
      return out;
    },
  };
}
