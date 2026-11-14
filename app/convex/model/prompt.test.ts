// @vitest-environment node
// Parity of the TypeScript prompt with ml/prompt.py. The golden file was produced by running build_messages from
// ml/prompt.py with python3 -I (one-off script, outside the repo). The schema byte-copy check lives in app/scripts/schemas.test.ts.
// Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it } from 'vitest';
import { buildMessages, pyDumps, type CancerName } from './prompt';
import golden from './testdata/prompt.golden.json';

describe('prompt parity with ml/prompt.py', () => {
  for (const c of golden) {
    it(`matches the Python golden: ${c.name}`, () => {
      const i = c.input;
      const messages = buildMessages(i.cancer as CancerName, i.todayNote, i.earlierNotes, i.recordFacts);
      expect(messages[0].role).toBe('system');
      expect(messages[1].role).toBe('user');
      expect(messages[0].content).toBe(c.messages[0].content);
      expect(messages[1].content).toBe(c.messages[1].content);
      expect(messages).toEqual(c.messages);
    });
  }

  it('dumps the schema with ensure_ascii (non-ASCII as \\uXXXX) and compact separators', () => {
    expect(pyDumps({ a: 'ä' }, true, { item: ',', kv: ':' })).toBe('{"a":"\\u00e4"}');
    expect(pyDumps({ a: 'ä' }, false, { item: ',', kv: ':' })).toBe('{"a":"ä"}');
  });

  it('dumps the user message with Python default separators (", " and ": ")', () => {
    expect(pyDumps({ a: [1, 'x'], b: {} }, false, { item: ', ', kv: ': ' })).toBe('{"a": [1, "x"], "b": {}}');
  });
});
