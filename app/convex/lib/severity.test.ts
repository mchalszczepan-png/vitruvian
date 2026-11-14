import { describe, expect, it } from 'vitest';
import type { Severity } from '../../src/data/types';
import { severityForPatient } from './severity';

const src = { label: 'test', url: 'https://example.org' };
const ovarian: Severity = {
  cancer: 'ovarian',
  fiveYearSurvivalPct: 49.1,
  population: 'Finland, women, all ages, 2017–2021',
  ageBands: [
    { sex: 'female', min: 0, max: 49, pct: 77.7, period: '2017–2021', source: src },
    { sex: 'female', min: 50, max: 59, pct: 65.6, period: '2017–2021', source: src },
  ],
  source: src,
};

describe('severityForPatient', () => {
  it('keeps the all-ages headline and returns the matching band (Sirpa, 57)', () => {
    const s = severityForPatient(ovarian, 57, 'female');
    expect(s.fiveYearSurvivalPct).toBe(49.1);
    expect(s.ageBands?.map((b) => b.min)).toEqual([50]);
  });

  it('no band for the age: no ageBands entry, headline still all ages', () => {
    const s = severityForPatient(ovarian, 85, 'female');
    expect(s.fiveYearSurvivalPct).toBe(49.1);
    expect(s.ageBands).toEqual([]);
  });

  it('wrong sex: no band', () => {
    expect(severityForPatient(ovarian, 57, 'male').ageBands).toEqual([]);
  });
});
