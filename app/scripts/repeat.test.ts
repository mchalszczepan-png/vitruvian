// Unit tests for the pure Repeat visit rule. Run: node --test app/scripts/repeat.test.ts (Node 24 strips types).
// Research prototype. Not a medical device. All patients are made up.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { repeatFlag, REPEAT_RULE } from '../convex/lib/repeat.ts';

const v = (id: string, date: string, symptom = 'cough') => ({ id, date, symptom });

test('three cough visits inside 6 months, today included, gives a flag', () => {
  const flag = repeatFlag([v('a', '2026-03-01'), v('b', '2026-06-01'), v('c', '2026-09-01')]);
  assert.deepEqual(flag, { symptom: 'cough', count: 3, windowMonths: 6, visitIds: ['a', 'b', 'c'] });
});

test('an old visit outside the 6-month window is not counted', () => {
  assert.equal(repeatFlag([v('a', '2026-01-01'), v('b', '2026-06-01'), v('c', '2026-09-01')]), null);
  const flag = repeatFlag([v('a', '2026-01-01'), v('b', '2026-06-01'), v('c', '2026-09-01'), v('d', '2026-09-10')]);
  assert.equal(flag?.count, 3);
  assert.deepEqual(flag?.visitIds, ['b', 'c', 'd']);
});

test('other symptoms do not count toward today symptom', () => {
  const visits = [v('a', '2026-03-01', 'reflux'), v('b', '2026-06-01'), v('c', '2026-09-01')];
  assert.equal(repeatFlag(visits), null);
});

test('only today and two earlier visits: below minimum, no flag', () => {
  assert.equal(repeatFlag([v('a', '2026-08-01'), v('b', '2026-09-01')]), null);
  assert.equal(repeatFlag([]), null);
});

test('window and minimum are constants that default to 3 visits in 6 months', () => {
  assert.deepEqual(REPEAT_RULE, { minVisits: 3, windowMonths: 6 });
  const visits = [v('a', '2026-05-01'), v('b', '2026-08-01'), v('c', '2026-09-01')];
  // A 3-month window from 2026-09-01 starts 2026-06-01: only two visits fall inside it, below the minimum.
  assert.equal(repeatFlag(visits, { windowMonths: 3 }), null);
});

test('vector path counts only the similar visits plus today', () => {
  const visits = [v('a', '2026-03-01', 'reflux'), v('b', '2026-06-01', 'reflux'), v('c', '2026-09-01')];
  const flag = repeatFlag(visits, { similarIds: new Set(['a', 'b']) });
  assert.deepEqual(flag?.visitIds, ['a', 'b', 'c']);
  assert.equal(repeatFlag(visits, { similarIds: new Set<string>() }), null);
});
