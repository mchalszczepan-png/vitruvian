// @vitest-environment node
// Parity of the TypeScript triage prompt with ml/triage_prompt.py. The golden files were produced by running build_triage_messages
// from ml/triage_prompt.py with python3 -I (one-off scripts, outside the repo). Byte equality, not just structure.
// Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it } from 'vitest';
import { buildTriageMessages, TRIAGE_SYSTEM, TRIAGE_SYSTEM_PPV, triageSystemFor } from './triagePrompt';
import golden from './testdata/triage-golden.json';
import goldenPpv from './testdata/triage-ppv-golden.json';

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

describe('triage prompt parity with ml/triage_prompt.py SYSTEM_PPV', () => {
  for (const c of goldenPpv) {
    it(`matches the Python PPV golden: ${c.name}`, () => {
      const i = c.input;
      const messages = buildTriageMessages(i.todayNote, i.earlierNotes, i.patient, TRIAGE_SYSTEM_PPV);
      expect(messages[0].content).toBe(c.messages[0].content);
      expect(messages[1].content).toBe(c.messages[1].content);
      expect(messages).toEqual(c.messages);
    });
  }
});

describe('triageSystemFor', () => {
  it('picks the PPV prompt for a -ppv model id, the rubric prompt otherwise', () => {
    expect(triageSystemFor('vitruvian-triage-ppv')).toBe(TRIAGE_SYSTEM_PPV);
    expect(triageSystemFor('vitruvian-triage')).toBe(TRIAGE_SYSTEM);
    expect(triageSystemFor('vitruvian-triage-ppv-old')).toBe(TRIAGE_SYSTEM);
  });
});
