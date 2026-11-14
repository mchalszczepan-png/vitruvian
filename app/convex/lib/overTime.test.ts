import { describe, expect, it } from 'vitest';
import { daysBetween, overTimeMatch, type Hit } from './overTime';

const h = (id: string, date: string): Hit => ({ visitId: id, date });

describe('overTimeMatch', () => {
  it('single: one hit matches and is its own backing', () => {
    const r = overTimeMatch({ pattern: 'single', minVisits: 1, windowDays: null, minDurationDays: null }, [h('a', '2026-09-03')]);
    expect(r.matches).toBe(true);
    expect(r.backing.map((x) => x.visitId)).toEqual(['a']);
  });

  it('single: no hit does not match', () => {
    expect(overTimeMatch({ pattern: 'single', minVisits: 1, windowDays: null, minDurationDays: null }, []).matches).toBe(false);
  });

  it('persistent: needs minVisits and first-to-last span >= minDurationDays', () => {
    const ot = { pattern: 'persistent' as const, minVisits: 2, windowDays: null, minDurationDays: 28 };
    expect(overTimeMatch(ot, [h('a', '2026-10-01'), h('b', '2026-11-14')]).matches).toBe(true);
    // 20 days apart: too short
    expect(overTimeMatch(ot, [h('a', '2026-10-01'), h('b', '2026-10-21')]).matches).toBe(false);
    // one hit only
    expect(overTimeMatch(ot, [h('a', '2026-10-01')]).matches).toBe(false);
  });

  it('persistent: sorts hits before measuring the span', () => {
    const ot = { pattern: 'persistent' as const, minVisits: 2, windowDays: null, minDurationDays: 28 };
    const r = overTimeMatch(ot, [h('late', '2026-11-14'), h('early', '2026-09-03')]);
    expect(r.matches).toBe(true);
    expect(r.backing.map((x) => x.visitId)).toEqual(['early', 'late']);
  });

  it('recurrent: minVisits inside one window; hits outside the window do not count', () => {
    const ot = { pattern: 'recurrent' as const, minVisits: 3, windowDays: 120, minDurationDays: null };
    expect(overTimeMatch(ot, [h('a', '2026-01-01'), h('b', '2026-03-01'), h('c', '2026-04-01')]).matches).toBe(true);
    // 3 hits spread over 200 days: no window holds 3
    const spread = overTimeMatch(ot, [h('a', '2026-01-01'), h('b', '2026-04-01'), h('c', '2026-07-20')]);
    expect(spread.matches).toBe(false);
  });

  it('recurrent: backing is the hits in the first qualifying window only', () => {
    const ot = { pattern: 'recurrent' as const, minVisits: 2, windowDays: 30, minDurationDays: null };
    const r = overTimeMatch(ot, [h('a', '2026-01-01'), h('b', '2026-01-10'), h('c', '2026-06-01'), h('d', '2026-06-05')]);
    expect(r.backing.map((x) => x.visitId)).toEqual(['a', 'b']);
  });

  it('worsening is not used by any Rule and never matches', () => {
    expect(overTimeMatch({ pattern: 'worsening', minVisits: 1, windowDays: null, minDurationDays: null }, [h('a', '2026-01-01')]).matches).toBe(false);
  });

  it('daysBetween counts whole days', () => {
    expect(daysBetween('2026-10-01', '2026-11-14')).toBe(44);
  });
});
