// @vitest-environment node
// Dictation UI logic: the result goes into the note field, mode picks the prompt's mode, the consent gate blocks a visit
// recording, Accept replaces only the flagged span, Ignore leaves the text. Rendered with react-dom/server (no DOM).
// Research prototype. Not a medical device. Not for clinical use.
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { appendNote, applyFlag, canRecord, insertDictation, loadMode, openFlags, pickMimeType, saveMode } from '../data/dictation';
import type { DictationMode } from '../data/types';
import { Dictation } from './Dictation';

describe('Dictation inserts the note', () => {
  it('adds Gemini’s note after what is typed, reading the field when the reply lands', async () => {
    let field = 'Kontrolli.';
    const seen: DictationMode[] = [];
    const d = await insertDictation({
      audioBase64: 'QUJD',
      mimeType: 'audio/webm',
      mode: 'visit',
      transcribe: async (_a, _m, mode) => {
        seen.push(mode);
        field = 'Kontrolli. Typed while waiting.';
        return { language: 'fi', note: 'Yskä 6 viikkoa.', english: 'Cough for 6 weeks.' };
      },
      getText: () => field,
      onText: (t) => (field = t),
    });
    expect(seen).toEqual(['visit']);
    expect(field).toBe('Kontrolli. Typed while waiting.\n\nYskä 6 viikkoa.');
    expect(d.english).toBe('Cough for 6 weeks.');
  });

  it('a failed call leaves the field as it was', async () => {
    let field = 'Typed.';
    await expect(
      insertDictation({
        audioBase64: 'QUJD',
        mimeType: 'audio/webm',
        mode: 'dictate',
        transcribe: async () => {
          throw new Error('HTTP 500');
        },
        getText: () => field,
        onText: (t) => (field = t),
      }),
    ).rejects.toThrow();
    expect(field).toBe('Typed.');
  });

  it('appendNote into an empty field has no leading blank line', () => {
    expect(appendNote('', ' Cough. ')).toBe('Cough.');
    expect(appendNote('A', '')).toBe('A');
  });
});

describe('modes and consent', () => {
  it('dictate needs no consent; a visit recording does', () => {
    expect(canRecord('dictate', false)).toBe(true);
    expect(canRecord('visit', false)).toBe(false);
    expect(canRecord('visit', true)).toBe(true);
  });

  it('visit mode renders the consent box and a disabled Record button with the visit label', () => {
    const html = renderToStaticMarkup(<Dictation text="" onText={() => {}} initialMode="visit" />);
    expect(html).toContain('Patient agreed to recording');
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>.*Record the visit<\/button>/);
    expect(html).toContain('Visit note drafted by Gemini from the recording. Check before saving.');
  });

  it('dictate mode renders an enabled mic and the Gemini label, no consent box', () => {
    const html = renderToStaticMarkup(<Dictation text="" onText={() => {}} initialMode="dictate" />);
    expect(html).not.toContain('Patient agreed to recording');
    expect(html).toMatch(/<button type="button" class="btn small dict-mic">/);
    expect(html).toContain('Dictation by Gemini. Check before saving.');
  });

  it('the mode is remembered per browser, and blocked storage falls back to dictate', () => {
    const store = new Map<string, string>();
    const s = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
    expect(loadMode(s)).toBe('dictate');
    saveMode(s, 'visit');
    expect(loadMode(s)).toBe('visit');
    expect(loadMode({ getItem: () => { throw new Error('blocked'); } })).toBe('dictate');
  });

  it('records Opus in WebM when the browser can', () => {
    expect(pickMimeType(() => true)).toBe('audio/webm;codecs=opus');
    expect(pickMimeType((t) => t === 'audio/mp4')).toBe('audio/mp4');
    expect(pickMimeType(() => false)).toBe('');
  });
});

describe('medicine check flags', () => {
  const flag = { text: 'metfromiini', suggestion: 'metformiini', reason: 'misspelled' };
  const note = 'Metfromiini? metfromiini 500 mg kahdesti, ramipriili 5 mg.';

  it('Accept replaces the flagged span only', () => {
    expect(applyFlag(note, flag)).toBe('Metfromiini? metformiini 500 mg kahdesti, ramipriili 5 mg.');
  });

  it('Ignore leaves the text and hides the flag; an edited-away span hides it too', () => {
    expect(openFlags(note, [flag], [flag.text])).toEqual([]);
    expect(openFlags(note, [flag], [])).toEqual([flag]);
    expect(openFlags('metformiini 500 mg', [flag], [])).toEqual([]);
    expect(applyFlag('no such span', flag)).toBe('no such span');
  });
});
