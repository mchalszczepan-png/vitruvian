// @vitest-environment node
// Parity of the TypeScript triage prompt with ml/triage_prompt.py. The golden file was produced by running build_triage_messages
// from ml/triage_prompt.py with python3 -I (one-off script, outside the repo). Byte equality, not just structure.
// Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it } from 'vitest';
import { buildTriageMessages } from './triagePrompt';
import golden from './testdata/triage-golden.json';

describe('triage prompt parity with ml/triage_prompt.py', () => {
  for (const c of golden) {
    it(`matches the Python golden: ${c.name}`, () => {
      const i = c.input;
      const messages = buildTriageMessages(i.todayNote, i.earlierNotes, i.patient);
      expect(messages[0].content).toBe(c.messages[0].content);
      expect(messages[1].content).toBe(c.messages[1].content);
      expect(messages).toEqual(c.messages);
    });
  }
});
