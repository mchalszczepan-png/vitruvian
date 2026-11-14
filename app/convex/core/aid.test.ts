import { describe, expect, it } from 'vitest';
import { lastingCount, mapLimit, pickCancer, snippetOf, techUsedFor, withoutSafetyNet, type RepeatSource } from './aid';

describe('techUsedFor', () => {
  it('repeat step names the source: symptom field by default, convex-vector when the caller ran vector search', () => {
    const repeatOf = (src?: RepeatSource) => techUsedFor('stub', src).find((t) => t.step === 'repeat')?.provider;
    expect(repeatOf()).toBe('symptom-match');
    expect(repeatOf('symptom-match')).toBe('symptom-match');
    expect(repeatOf('convex-vector')).toBe('convex-vector');
  });

  it('keeps the other four steps unchanged whatever the repeat source', () => {
    const steps = (src: RepeatSource) => techUsedFor('stub', src).filter((t) => t.step !== 'repeat');
    expect(steps('convex-vector')).toEqual(steps('symptom-match'));
  });

  it('modal-lora: facts and risk on Featherless (gemma), decisions on Gemini, the fill on the LoRA', () => {
    expect(techUsedFor('modal-lora')).toEqual([
      { step: 'facts', provider: 'gemma' },
      { step: 'decisions', provider: 'gemini' },
      { step: 'risk', provider: 'gemma' },
      { step: 'repeat', provider: 'symptom-match' },
      { step: 'fill', provider: 'modal-lora' },
    ]);
  });
});

const cat = { lung: 9, colorectal: 9, ovarian: 8 };
const m = (cancer: 'lung' | 'colorectal' | 'ovarian', visits = 1) => ({ rule: { cancer }, visits: Array.from({ length: visits }, () => ({})) }) as never;

describe('pickCancer', () => {
  it('most matched Rules wins', () => {
    expect(pickCancer([m('lung'), m('lung'), m('colorectal')], cat, 'cough', 'male')).toBe('lung');
  });

  it('tie goes to the cancer with more Rules in the catalogue', () => {
    expect(pickCancer([m('ovarian'), m('lung')], { lung: 9, colorectal: 9, ovarian: 12 }, 'cough', 'female')).toBe('ovarian');
    expect(pickCancer([m('ovarian'), m('lung')], { lung: 12, colorectal: 9, ovarian: 8 }, 'cough', 'female')).toBe('lung');
  });

  it('no match: fallback from the last symptom and sex', () => {
    expect(pickCancer([], cat, 'bowel change', 'male')).toBe('colorectal');
    expect(pickCancer([], cat, 'bloating', 'female')).toBe('ovarian');
    expect(pickCancer([], cat, 'bloating', 'male')).toBe('lung');
    expect(pickCancer([], cat, 'cough', 'female')).toBe('lung');
  });
});

describe('lastingCount', () => {
  it('counts Rules with more than one backing visit', () => {
    expect(lastingCount([m('lung', 1), m('lung', 3), m('lung', 2)])).toBe(2);
  });
});

describe('withoutSafetyNet', () => {
  it('drops safety-net advice but keeps the findings', () => {
    const note = 'Blood in sputum today. Sooner if any blood in sputum.';
    expect(withoutSafetyNet(note)).toContain('Blood in sputum today.');
    expect(withoutSafetyNet(note)).not.toMatch(/sooner/i);
  });
});

describe('snippetOf', () => {
  it('picks the sentence with the cue, skipping a leading "no"', () => {
    const note = 'No blood seen before. Coughed up streaks of fresh blood on three mornings.';
    expect(snippetOf(note, 'reason', /blood/i)).toBe('Coughed up streaks of fresh blood on three mornings.');
  });

  it('falls back to the visit reason when no sentence has the cue', () => {
    expect(snippetOf('Looks well.', 'Dry cough, 3 weeks', /blood/i)).toBe('Dry cough, 3 weeks');
  });
});

describe('mapLimit', () => {
  it('keeps order and caps concurrency', async () => {
    let inFlight = 0;
    let peak = 0;
    const out = await mapLimit([1, 2, 3, 4, 5], 2, async (x) => {
      inFlight++;
      peak = Math.max(peak, inFlight);
      await new Promise((r) => setTimeout(r, 5));
      inFlight--;
      return x * 10;
    });
    expect(out).toEqual([10, 20, 30, 40, 50]);
    expect(peak).toBeLessThanOrEqual(2);
  });
});
