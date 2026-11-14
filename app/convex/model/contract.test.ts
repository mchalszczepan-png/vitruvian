// @vitest-environment node
// Contract path with a mocked fetch: fenced JSON, invalid then valid on the one retry, still invalid -> origin empty.
// No network. Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it, vi } from 'vitest';
import { fillFromNote, modelFieldValues, parseReply, stripFence } from './contract';
import { specFor } from './referralSchema';

const CHAT = { baseUrl: 'https://example.test/v1/', apiKey: 'test-key-not-real', model: 'test-model' };
const RECORD = { patientId: 'SYN-001', age: 62, sex: 'male', referralDate: '2026-11-14', referringGpId: 'GP-DEMO-01' };

/** A valid lung reply; tests change one field at a time. */
const validFields = (over: Record<string, unknown> = {}) => ({
  patientId: 'SYN-999', // a model that echoes record keys must not change them
  smokingStatus: 'former',
  mainSymptom: 'cough',
  symptomDurationWeeks: 4,
  symptomVisitCount: 2,
  examFindings: 'Chest clear',
  generalCondition: 'Well',
  testsDone: [],
  currentMedicines: [],
  otherIllnesses: [],
  suspectedDiagnosis: 'Possible lung cancer',
  suspectedCancerType: 'lung',
  gpQuestion: 'Please see urgently',
  urgency: 'urgent',
  lungSymptoms: ['cough'],
  haemoptysis: false,
  chestXrayResult: 'not_done',
  ...over,
});

const replyText = (fields: Record<string, unknown>, evidence: Record<string, string> = { mainSymptom: 'cough for 4 weeks' }) =>
  JSON.stringify({ fields, evidence });

/** A fetch mock that answers with the given message contents in order, and records each request body. */
function mockChat(contents: string[], status = 200) {
  const bodies: Record<string, unknown>[] = [];
  let i = 0;
  const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
    bodies.push(JSON.parse(String(init?.body)));
    if (status !== 200) return new Response('secret-looking-body', { status });
    const content = contents[Math.min(i, contents.length - 1)];
    i += 1;
    return new Response(JSON.stringify({ choices: [{ message: { role: 'assistant', content } }] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { fetchImpl, bodies, calls: () => (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.length };
}

const fill = (fetchImpl: typeof fetch, cancer: 'lung' | 'colorectal' | 'ovarian' = 'lung') =>
  fillFromNote({
    cancer,
    todayNote: 'Cough for 4 weeks. Not coughing blood.',
    earlierNotes: [{ date: '2026-10-01', note: 'Cough 2 weeks.' }],
    recordFacts: RECORD,
    specs: specFor(cancer),
    chat: CHAT,
    fetchImpl,
  });

describe('reply parsing', () => {
  it('strips a ```json fence and a bare fence', () => {
    expect(stripFence('```json\n{"a":1}\n```')).toBe('{"a":1}');
    expect(stripFence('```\n{"a":1}\n```')).toBe('{"a":1}');
    expect(stripFence('{"a":1}')).toBe('{"a":1}');
  });

  it('keeps only string evidence and rejects a reply without fields', () => {
    expect(parseReply(replyText({ a: 1 }, { a: 'x', b: 3 as unknown as string }))).toEqual({ fields: { a: 1 }, evidence: { a: 'x' } });
    expect(parseReply('{"evidence":{}}')).toBeNull();
    expect(parseReply('not json')).toBeNull();
  });
});

describe('contract request', () => {
  it('sends temperature 0, max_tokens 2048 and the two prompt messages to {baseUrl}/chat/completions', async () => {
    const mock = mockChat([replyText(validFields())]);
    await fill(mock.fetchImpl);
    expect(mock.calls()).toBe(1);
    const body = mock.bodies[0];
    expect(body.model).toBe('test-model');
    expect(body.temperature).toBe(0);
    expect(body.max_tokens).toBe(2048);
    const messages = body.messages as { role: string; content: string }[];
    expect(messages.map((m) => m.role)).toEqual(['system', 'user']);
    expect(messages[0].content.startsWith('You fill a GP Referral template')).toBe(true);
    const user = JSON.parse(messages[1].content);
    expect(Object.keys(user)).toEqual(['cancer', 'todayNote', 'earlierNotes', 'recordFacts']);
    expect(user.recordFacts).toEqual(RECORD);
  });

  it('does not put the key in an error message when the HTTP call fails', async () => {
    const mock = mockChat([], 500);
    await expect(fill(mock.fetchImpl)).rejects.toThrow('model call failed: HTTP 500');
    expect(mock.calls()).toBe(2); // one retry on a 5xx
    await expect(fill(mock.fetchImpl)).rejects.not.toThrow(/test-key-not-real/);
  });
});

describe('fenced JSON', () => {
  it('reads a reply wrapped in a json fence and keeps its evidence', async () => {
    const mock = mockChat(['```json\n' + replyText(validFields()) + '\n```']);
    const out = await fill(mock.fetchImpl);
    expect(mock.calls()).toBe(1);
    const values = modelFieldValues(specFor('lung'), out, 'lung');
    expect(values.smokingStatus).toEqual({ value: 'former', origin: 'gemma', evidence: undefined });
    expect(values.mainSymptom).toEqual({ value: 'cough', origin: 'gemma', evidence: 'cough for 4 weeks' });
    expect(values.haemoptysis).toEqual({ value: 'no', origin: 'gemma', evidence: undefined });
  });

  it('never takes record fields from the model', async () => {
    const mock = mockChat([replyText(validFields())]);
    const values = modelFieldValues(specFor('lung'), await fill(mock.fetchImpl), 'lung');
    expect(values.patientId).toBeUndefined();
    expect(values.referralDate).toBeUndefined();
  });
});

describe('invalid output', () => {
  it('invalid JSON, then valid on the retry: one retry, values from the retry', async () => {
    const mock = mockChat(['Sorry, here it is: {bad', replyText(validFields())]);
    const values = modelFieldValues(specFor('lung'), await fill(mock.fetchImpl), 'lung');
    expect(mock.calls()).toBe(2);
    expect(values.mainSymptom).toEqual({ value: 'cough', origin: 'gemma', evidence: 'cough for 4 weeks' });
  });

  it('still invalid after the retry: no third call, failing required field origin empty', async () => {
    const mock = mockChat([replyText(validFields({ urgency: 'soon' })), replyText(validFields({ urgency: 'soon' }))]);
    const values = modelFieldValues(specFor('lung'), await fill(mock.fetchImpl), 'lung');
    expect(mock.calls()).toBe(2);
    expect(values.urgency).toEqual({ value: '', origin: 'empty' });
    expect(values.smokingStatus.origin).toBe('gemma');
  });

  it('a required field left out of the reply is origin empty; an invalid optional one is left out', async () => {
    const fields = validFields({ packYears: 'lots', gpQuestion: undefined });
    const mock = mockChat([replyText(fields), replyText(fields)]);
    const values = modelFieldValues(specFor('lung'), await fill(mock.fetchImpl), 'lung');
    expect(values.gpQuestion).toEqual({ value: '', origin: 'empty' });
    expect(values.packYears).toBeUndefined();
  });

  it('null for a required field is unknown: origin empty, and no retry', async () => {
    const mock = mockChat([replyText(validFields({ examFindings: null }))]);
    const values = modelFieldValues(specFor('lung'), await fill(mock.fetchImpl), 'lung');
    expect(mock.calls()).toBe(1);
    expect(values.examFindings).toEqual({ value: '', origin: 'empty' });
  });

  it('never valid JSON: every required field origin empty, optional fields left out', async () => {
    const mock = mockChat(['no json here', 'still none']);
    const values = modelFieldValues(specFor('lung'), await fill(mock.fetchImpl), 'lung');
    expect(mock.calls()).toBe(2);
    expect(values.mainSymptom).toEqual({ value: '', origin: 'empty' });
    expect(values.packYears).toBeUndefined();
  });
});
