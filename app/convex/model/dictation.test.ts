// @vitest-environment node
// model/dictation.ts with a stubbed fetch: the Gemini request shape (inline audio, store:false, the prompt per mode),
// the bad-JSON fallback, and the MedGemma medicine check (flags parsed; bad JSON, HTTP error or timeout: no flags).
// No network, no real keys. Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it } from 'vitest';
import {
  checkTerms,
  DICTATE_SYSTEM,
  DICTATION_ENDPOINT,
  MEDICINE_CHECK_TIMEOUT_MS,
  parseDictation,
  parseFlags,
  systemFor,
  transcribe,
  VISIT_SYSTEM,
} from './dictation';

interface Call {
  url: string;
  init: RequestInit;
}
const geminiReply = (text: string) => ({
  status: 'completed',
  steps: [{ type: 'thought' }, { type: 'model_output', content: [{ type: 'text', text }] }],
});
function stub(reply: unknown, status = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(typeof reply === 'string' ? reply : JSON.stringify(reply), { status });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

describe('transcribe (Gemini)', () => {
  it('sends the audio inline with store:false, the key in a header and the dictate prompt', async () => {
    const s = stub(geminiReply(JSON.stringify({ language: 'fi', note: 'Yskä 6 viikkoa.', english: 'Cough for 6 weeks.' })));
    const d = await transcribe({ audioBase64: 'QUJD', mimeType: 'audio/webm', mode: 'dictate', apiKey: 'test-key', fetchImpl: s.fetchImpl });
    expect(d).toEqual({ language: 'fi', note: 'Yskä 6 viikkoa.', english: 'Cough for 6 weeks.' });
    expect(s.calls).toHaveLength(1);
    expect(s.calls[0].url).toBe(DICTATION_ENDPOINT);
    expect((s.calls[0].init.headers as Record<string, string>)['x-goog-api-key']).toBe('test-key');
    const body = JSON.parse(s.calls[0].init.body as string);
    expect(body.store).toBe(false);
    expect(body.stream).toBeUndefined();
    expect(body.system_instruction).toBe(DICTATE_SYSTEM);
    expect(body.input[1]).toEqual({ type: 'audio', data: 'QUJD', mime_type: 'audio/webm' });
    expect(body.response_format.schema.required).toEqual(['language', 'note', 'english']);
    expect(s.calls[0].url).not.toContain('test-key');
  });

  it('visit mode sends the visit prompt', async () => {
    const s = stub(geminiReply(JSON.stringify({ language: 'en', note: 'Reason for visit: cough.', english: 'Reason for visit: cough.' })));
    await transcribe({ audioBase64: 'QUJD', mimeType: 'audio/webm', mode: 'visit', apiKey: 'k', fetchImpl: s.fetchImpl });
    expect(JSON.parse(s.calls[0].init.body as string).system_instruction).toBe(VISIT_SYSTEM);
  });

  it('a reply that is not JSON becomes the note, with no translation', async () => {
    const s = stub(geminiReply('Yskä jatkunut kuusi viikkoa, ei kuumetta.'));
    const d = await transcribe({ audioBase64: 'QUJD', mimeType: 'audio/webm', mode: 'dictate', apiKey: 'k', fetchImpl: s.fetchImpl });
    expect(d).toEqual({ language: 'fi', note: 'Yskä jatkunut kuusi viikkoa, ei kuumetta.', english: '' });
  });

  it('an HTTP error names the status only', async () => {
    const s = stub('secret body', 500);
    await expect(transcribe({ audioBase64: 'QUJD', mimeType: 'audio/webm', mode: 'dictate', apiKey: 'k', fetchImpl: s.fetchImpl })).rejects.toThrow(
      'Dictation failed: HTTP 500',
    );
  });
});

describe('prompts', () => {
  it('each mode has its own prompt, both keep numbers and negations and never add findings', () => {
    expect(systemFor('dictate')).toBe(DICTATE_SYSTEM);
    expect(systemFor('visit')).toBe(VISIT_SYSTEM);
    for (const p of [DICTATE_SYSTEM, VISIT_SYSTEM]) {
      expect(p).toMatch(/number, dose, duration and negation/);
      expect(p).toMatch(/\[unclear\]/);
      expect(p).toMatch(/Never add/);
    }
    expect(VISIT_SYSTEM).toMatch(/Reason for visit.*History.*Findings.*Plan/s);
  });

  it('parseDictation strips a code fence', () => {
    expect(parseDictation('```json\n{"language":"en","note":"Cough.","english":"Cough."}\n```').note).toBe('Cough.');
  });
});

describe('medicine check (MedGemma)', () => {
  const cfg = { baseUrl: 'https://medgemma.example/v1', apiKey: 'test-mg-key', model: 'google/medgemma-27b-text-it' };
  const note = 'Aloitetaan metfromiini 500 mg kahdesti ja ramipriili 5 mg.';
  const chat = (content: string) => ({ choices: [{ message: { content } }] });

  it('parses flags that are exact spans and drops the rest', async () => {
    const s = stub(
      chat(
        JSON.stringify([
          { text: 'metfromiini', suggestion: 'metformiini', reason: 'misspelled' },
          { text: 'not in note', suggestion: 'x', reason: '' },
          { text: 'ramipriili', suggestion: 'ramipriili', reason: 'same' },
        ]),
      ),
    );
    expect(await checkTerms(note, cfg, s.fetchImpl)).toEqual([{ text: 'metfromiini', suggestion: 'metformiini', reason: 'misspelled' }]);
    const body = JSON.parse(s.calls[0].init.body as string);
    expect(body.model).toBe('google/medgemma-27b-text-it');
    expect(body.messages[1].content).toBe(note);
    expect(s.calls[0].init.redirect).toBe('manual');
  });

  it('bad JSON gives no flags', async () => {
    expect(await checkTerms(note, cfg, stub(chat('Looks fine to me.')).fetchImpl)).toEqual([]);
    expect(parseFlags('{"text":"x"}', note)).toEqual([]);
  });

  it('a cold start (303) or HTTP error gives no flags', async () => {
    expect(await checkTerms(note, cfg, stub('', 303).fetchImpl)).toEqual([]);
    expect(await checkTerms(note, cfg, stub('', 500).fetchImpl)).toEqual([]);
  });

  it('a timeout gives no flags, and does not wait past the limit', async () => {
    const hang = ((_u: string, init: RequestInit) =>
      new Promise((_res, rej) => init.signal?.addEventListener('abort', () => rej(new Error('aborted'))))) as unknown as typeof fetch;
    const t0 = Date.now();
    expect(await checkTerms(note, cfg, hang)).toEqual([]);
    expect(Date.now() - t0).toBeLessThan(MEDICINE_CHECK_TIMEOUT_MS + 2000);
  }, 15_000);
});
