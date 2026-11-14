// Contract tests for the data seam (SPEC "Testing Decisions", seam 1).
// One suite runs against the mock (api.ts mock path) and against the Convex functions
// (convex-test, in memory, MODEL_PROVIDER=stub, seeded by seed:run).
// Only external behaviour through api.ts is checked. A silent fallback to the mock fails the Convex suite.
// Research prototype. Not a medical device. Not for clinical use.
import { makeFunctionReference } from 'convex/server';
import { convexTest, type TestConvex } from 'convex-test';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import schema from '../../convex/schema';
import type { ConvexLike } from './convexBackend';
import type { AidResult, FieldValue, FieldValues, Referral } from './types';

type Api = typeof import('./api');
type Adapter = typeof import('./convexBackend');

// convex-test needs the _generated files too, so the glob takes .js as well as .ts (declaration files are skipped).
const convexModules = import.meta.glob(['../../convex/**/*.ts', '../../convex/**/*.js', '!../../convex/**/*.d.ts']);
const seedRun = makeFunctionReference<'mutation'>('seed:run');

/** The mock keeps legacy Rule ids (app/src/data/mock/rules.ts). Convex uses docs ids (docs/build/rules.md). The tests compare docs ids. */
const DOCS_ID: Record<string, string> = {
  'lung-cxr': 'LUNG-01',
  'lung-haemoptysis': 'LUNG-02',
  'lung-two-symptoms': 'LUNG-03',
  'lung-smoker-symptom': 'LUNG-04',
  'lung-infection': 'LUNG-05',
  'lung-clubbing': 'LUNG-06',
  'lung-nodes': 'LUNG-07',
  'lung-platelets': 'LUNG-08',
  'lung-chest-signs': 'LUNG-09',
  'crc-fit': 'COLO-01',
  'crc-abdo-mass': 'COLO-02',
  'crc-rectal-mass': 'COLO-03',
  'crc-bowel-habit': 'COLO-04',
  'crc-ida': 'COLO-05',
  'crc-anaemia-60': 'COLO-06',
  'crc-weight-pain': 'COLO-07',
  'crc-bleeding-50': 'COLO-08',
  'crc-bleeding-under-50': 'COLO-09',
};

const docsId = (id: string) => DOCS_ID[id] ?? id;
const ruleIds = (aid: AidResult) => aid.matchedRules.map((m) => docsId(m.rule.id));
const datesOf = (aid: AidResult, ruleId: string) =>
  aid.matchedRules.find((m) => docsId(m.rule.id) === ruleId)?.visits.map((v) => v.date) ?? [];
const isFilled = (v: FieldValue | undefined) => v !== undefined && v.origin !== 'empty' && v.value.trim() !== '';

const BACKENDS = ['mock', 'convex'] as const;

describe.each(BACKENDS)('data API contract: %s backend', (backend) => {
  let api: Api;
  let adapter: Adapter;
  let convexTestInstance: TestConvex<typeof schema> | undefined;
  let warn: ReturnType<typeof vi.spyOn>;

  beforeAll(async () => {
    vi.stubEnv('VITE_BACKEND', backend);
    vi.stubEnv('MODEL_PROVIDER', 'stub');
    vi.resetModules();
    api = await import('./api');
    adapter = await import('./convexBackend');
    if (backend === 'convex') {
      convexTestInstance = convexTest(schema, convexModules);
      await convexTestInstance.mutation(seedRun, {});
      adapter.setConvexClient(convexTestInstance as unknown as ConvexLike);
    }
  });

  afterAll(() => {
    adapter.setConvexClient(undefined);
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Any fallback to the mock logs a warning. The Convex suite must never take that path.
    expect(warn).not.toHaveBeenCalled();
    expect(api.activeBackend()).toBe(backend);
    vi.restoreAllMocks();
  });

  it('Matti (SYN-001): Repeat visit flag for cough with 3 visits', async () => {
    const flag = await api.getRepeatVisit('SYN-001');
    expect(flag?.symptom).toBe('cough');
    expect(flag?.count).toBe(3);
    expect(flag?.visitIds).toHaveLength(3);
  });

  it('Matti (SYN-001): suspected lung, LUNG-02, 03, 04 and 09 matched, each with backing visits', async () => {
    const aid = await api.getAid('SYN-001');
    expect(aid.suspectedCancer).toBe('lung');
    expect(ruleIds(aid)).toEqual(expect.arrayContaining(['LUNG-02', 'LUNG-03', 'LUNG-04', 'LUNG-09']));
    for (const m of aid.matchedRules) {
      expect(m.visits.length, docsId(m.rule.id)).toBeGreaterThan(0);
      for (const v of m.visits) {
        expect(v.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(v.snippet.length).toBeGreaterThan(0);
      }
    }
    // Coughed-up blood is in the 14 Nov note only.
    expect(datesOf(aid, 'LUNG-02')).toContain('2026-11-14');
  });

  it('Matti (SYN-001): Risk gradient is an integer 0-10 and severity is cited', async () => {
    const aid = await api.getAid('SYN-001');
    expect(Number.isInteger(aid.riskGradient)).toBe(true);
    expect(aid.riskGradient).toBeGreaterThanOrEqual(0);
    expect(aid.riskGradient).toBeLessThanOrEqual(10);
    expect(aid.severity.source.label).not.toBe('');
    expect(aid.severity.source.url).toMatch(/^https?:\/\//);
  });

  it('Anneli (SYN-002): suspected colorectal, FIT 186 passes the gate, COLO Rules match', async () => {
    const aid = await api.getAid('SYN-002');
    expect(aid.suspectedCancer).toBe('colorectal');
    expect(aid.testNeeded).toBeUndefined();
    expect(ruleIds(aid)).toEqual(expect.arrayContaining(['COLO-01', 'COLO-04', 'COLO-05']));
    expect(ruleIds(aid).every((id) => id.startsWith('COLO-'))).toBe(true);
    expect(datesOf(aid, 'COLO-01')).toContain('2026-10-27');
  });

  it('Sirpa (SYN-003): suspected ovarian, OVAR-02, 03, 04 and 06 matched across the visits', async () => {
    const aid = await api.getAid('SYN-003');
    expect(aid.suspectedCancer).toBe('ovarian');
    expect(ruleIds(aid)).toEqual(expect.arrayContaining(['OVAR-02', 'OVAR-03', 'OVAR-04', 'OVAR-06']));
    for (const id of ['OVAR-02', 'OVAR-03']) {
      expect(datesOf(aid, id), id).toEqual(expect.arrayContaining(['2026-09-18', '2026-10-23', '2026-11-14']));
    }
    expect(datesOf(aid, 'OVAR-04')).toEqual(expect.arrayContaining(['2026-10-23', '2026-11-14']));
    // CA-125 180 IU/mL is in the 14 Nov note; the age 57 threshold is lower.
    expect(datesOf(aid, 'OVAR-06')).toEqual(['2026-11-14']);
    const ca125 = aid.matchedRules.find((m) => docsId(m.rule.id) === 'OVAR-06');
    expect(ca125?.because).toMatch(/180/);
  });

  it('Sirpa (SYN-003): severity is 49.1% for Finland, with the 50-59 band if one is shown', async () => {
    const aid = await api.getAid('SYN-003');
    expect(aid.severity.fiveYearSurvivalPct).toBe(49.1);
    expect(aid.severity.population).toMatch(/Finland/);
    const band = aid.severity.ageBands?.find((b) => b.sex === 'female' && 57 >= b.min && 57 <= b.max);
    if (band) {
      expect(band.min).toBe(50);
      expect(band.max).toBe(59);
    }
  });

  it('control (SYN-014, no red flags): no matched Rules and a low Risk gradient', async () => {
    const aid = await api.getAid('SYN-014');
    expect(aid.matchedRules).toEqual([]);
    expect(aid.riskGradient).toBeLessThanOrEqual(3);
    expect(aid.testNeeded).toBeUndefined();
    expect(await api.getRepeatVisit('SYN-014')).toBeUndefined();
  });

  it('fill template from note: record fields have origin record, missing required fields are reported', async () => {
    const aid = await api.getAid('SYN-001');
    const template = await api.getReferralTemplate('lung');
    const values: FieldValues = await api.fillTemplateFromNote('SYN-001', 'lung', aid.matchedRules);

    for (const key of ['patientId', 'age', 'sex', 'referralDate']) {
      expect(values[key]?.origin, key).toBe('record');
    }

    const required = template.fields.filter((f) => f.required).map((f) => f.key);
    const missing = required.filter((k) => !isFilled(values[k]));
    // No note mentions other illnesses, so the GP must fill it: it is reported as missing.
    expect(missing).toContain('otherIllnesses');
    for (const key of required.filter((k) => isFilled(values[k]))) {
      expect(['record', 'gemma', 'gp']).toContain(values[key].origin);
    }
  });

  it('send Referral, then list Referrals: the sent Referral comes back complete', async () => {
    const aid = await api.getAid('SYN-001');
    const fields = await api.fillTemplateFromNote('SYN-001', 'lung', aid.matchedRules);
    const referral: Referral = {
      id: `REF-CONTRACT-${backend}-1`,
      patientId: 'SYN-001',
      cancer: 'lung',
      urgency: 'urgent',
      decidedBy: 'GP',
      decidedAt: '2026-11-14T10:00:00.000Z',
      fields,
      matchedRules: aid.matchedRules,
      riskGradient: aid.riskGradient,
      severity: aid.severity,
    };
    await api.sendReferral(referral);
    const listed = await api.getReferrals();
    expect(listed[0]?.id).toBe(referral.id);
    const { riskGradient: _riskGradient, matchedRules: _matchedRules, ...referralWithoutRisk } = referral;
    const { riskGradientAiEstimate: _aiEstimate, ...fieldsWithoutAiEstimate } = referral.fields;
    expect(listed.find((r) => r.id === referral.id)).toEqual({
      ...referralWithoutRisk,
      fields: fieldsWithoutAiEstimate,
      summary: expect.any(Object),
      status: 'sent',
    });
  });

  it('Referral desk view: the list carries no Risk gradient, and the summary lists every visit and the GP decision (decision 16)', async () => {
    const aid = await api.getAid('SYN-001');
    const patient = await api.getPatient('SYN-001');
    const fields = await api.fillTemplateFromNote('SYN-001', 'lung', aid.matchedRules);
    const referral: Referral = {
      id: `REF-CONTRACT-${backend}-GRADIENT`,
      patientId: 'SYN-001',
      cancer: 'lung',
      urgency: 'urgent',
      decidedBy: 'GP',
      decidedAt: '2026-11-14T11:00:00.000Z',
      fields: { ...fields, riskGradientAiEstimate: { value: '7', origin: 'gemma', evidence: 'Aid' } },
      matchedRules: aid.matchedRules,
      riskGradient: 7,
      severity: aid.severity,
    };
    await api.sendReferral(referral);
    const views = await api.getReferrals();
    expect(JSON.stringify(views)).not.toContain('riskGradient');
    expect(JSON.stringify(views)).not.toContain('riskGradientAiEstimate');
    const view = views.find((r) => r.id === referral.id);
    expect(view?.summary.gpDecision).toBe('refer-urgent');
    expect(view?.summary.timeline).toHaveLength(patient!.visits.length);
    if (convexTestInstance) {
      // The GP's Referral keeps the Risk gradient in the table (audit). Only the desk view drops it.
      const stored = await convexTestInstance.run((ctx) =>
        ctx.db
          .query('referrals')
          .withIndex('by_referral_id', (q) => q.eq('id', referral.id))
          .unique(),
      );
      expect(stored?.riskGradient).toBe(7);
    }
  });

  it('no-Rule patients (SYN-008, SYN-009, SYN-014): noRuleMatched is true and no Rule matched; SYN-001 has Rules so the flag is falsy', async () => {
    for (const id of ['SYN-008', 'SYN-009', 'SYN-014']) {
      const aid = await api.getAid(id);
      expect(aid.noRuleMatched, id).toBe(true);
      expect(aid.matchedRules, id).toEqual([]);
    }
    const matti = await api.getAid('SYN-001');
    expect(matti.noRuleMatched).toBeFalsy();
  });

  it('techUsed lists all five steps (story 40); mock reports mock, Convex reports the stub port and symptom-match for repeat', async () => {
    const aid = await api.getAid('SYN-001');
    expect(aid.techUsed?.map((t) => t.step).sort()).toEqual(['decisions', 'facts', 'fill', 'repeat', 'risk']);
    const byStep = Object.fromEntries((aid.techUsed ?? []).map((t) => [t.step, t.provider]));
    if (backend === 'mock') {
      expect(byStep).toEqual({ facts: 'mock', decisions: 'mock', risk: 'mock', repeat: 'mock', fill: 'mock' });
    } else {
      expect(byStep).toEqual({ facts: 'stub', decisions: 'stub', risk: 'stub', repeat: 'symptom-match', fill: 'stub' });
    }
  });

  it('setReferralStatus: accepted clears the reason, returned keeps it, a returned Referral without a reason is rejected, the view has no Risk gradient', async () => {
    const aid = await api.getAid('SYN-001');
    const fields = await api.fillTemplateFromNote('SYN-001', 'lung', aid.matchedRules);
    const id = `REF-CONTRACT-${backend}-STATUS`;
    const referral: Referral = {
      id,
      patientId: 'SYN-001',
      cancer: 'lung',
      urgency: 'urgent',
      decidedBy: 'GP',
      decidedAt: '2026-11-14T12:00:00.000Z',
      fields,
      matchedRules: aid.matchedRules,
      riskGradient: aid.riskGradient,
      severity: aid.severity,
    };
    await api.sendReferral(referral);

    const accepted = await api.setReferralStatus(id, 'accepted');
    expect(accepted.status).toBe('accepted');
    expect(accepted.statusReason).toBeUndefined();

    const returned = await api.setReferralStatus(id, 'returned', 'Needs CT chest first');
    expect(returned.status).toBe('returned');
    expect(returned.statusReason).toBe('Needs CT chest first');
    expect(JSON.stringify(returned)).not.toContain('riskGradient');

    await expect(api.setReferralStatus(id, 'returned')).rejects.toThrow();
    await expect(api.setReferralStatus(id, 'returned', '   ')).rejects.toThrow();

    const listed = (await api.getReferrals()).find((r) => r.id === id);
    expect(listed?.status).toBe('returned');
    expect(listed?.statusReason).toBe('Needs CT chest first');
  });
});
