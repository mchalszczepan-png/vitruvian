// @vitest-environment node
/// <reference types="vite/client" />
// Staging functions in memory (convex-test): staging:draft, staging:save and staging:saved (stories 32, 33).
// Setup follows convex/core/golden.test.ts: seed:run first, then the public functions. No network.
// Research prototype. Not a medical device. Not for clinical use. All patients are made up.
import { convexTest } from 'convex-test';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import schema from './schema';
import { api } from './_generated/api';

// convex-test needs every function module, so the glob starts at convex/.
const modules = import.meta.glob(['./**/*.ts', './**/*.js', '!./**/*.d.ts', '!./**/*.test.ts']);

const REF_ID = 'REF-STAGING-CONVEX-1';

describe('staging functions: draft, save, saved (stories 32, 33)', () => {
  let t: ReturnType<typeof convexTest>;

  beforeAll(async () => {
    vi.stubEnv('MODEL_PROVIDER', 'stub');
    t = convexTest(schema, modules);
    await t.mutation(api.seed.run, {});
    await t.mutation(api.referrals.send, {
      referral: {
        id: REF_ID,
        patientId: 'SYN-001',
        cancer: 'lung',
        urgency: 'urgent',
        decidedBy: 'GP',
        decidedAt: '2026-11-14T13:00:00.000Z',
        fields: { patientId: { value: 'SYN-001', origin: 'record' } },
        matchedRules: [],
        riskGradient: 5,
        severity: {
          cancer: 'lung',
          fiveYearSurvivalPct: null,
          population: 'Finland, both sexes, 2019–2023',
          source: { label: 'Test source', url: 'https://example.org/', placeholder: true },
        },
      },
    });
  }, 300_000);

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('draft: the referral, its patient and the staging template are read; only patientRef is prefilled', async () => {
    const draft = await t.query(api.staging.draft, { referralId: REF_ID });
    expect(draft).toMatchObject({ cancer: 'lung', referralId: REF_ID, patientId: 'SYN-001', prefilled: ['patientRef'], values: { patientRef: 'SYN-001' } });
    expect(draft.patientLabel).toMatch(/, SYN-001, \d+ \(made-up\)$/);
    for (const key of ['clinicalT', 'clinicalN', 'clinicalM', 'stageGroup', 'diagnosisDate']) expect(draft.values).not.toHaveProperty(key);
  });

  it('draft: an unknown Referral is a clear error', async () => {
    await expect(t.query(api.staging.draft, { referralId: 'REF-NOPE' })).rejects.toThrow(/Unknown Referral REF-NOPE/);
  });

  it('save: full demo values are ready-for-registry, and the saved report has no Convex system fields', async () => {
    const demo = await t.query(api.staging.demo, { cancer: 'lung' });
    const saved = await t.mutation(api.staging.save, { report: { ...demo, referralId: REF_ID, patientId: 'SYN-001' } });
    expect(saved.status).toBe('ready-for-registry');
    expect(saved.check).toMatchObject({ readyForRegistry: true, missingFields: [], computedStage: 'IIB' });
    expect(saved.id).toMatch(/^STG-/);
    expect(saved).not.toHaveProperty('_id');
    expect(saved).not.toHaveProperty('_creationTime');
  });

  it('save: a missing required field is draft, and a second save with the same referralId keeps the same id', async () => {
    const demo = await t.query(api.staging.demo, { cancer: 'lung' });
    const first = await t.mutation(api.staging.save, { report: { ...demo, referralId: REF_ID, patientId: 'SYN-001' } });
    const { reporter: _reporter, ...values } = demo.values;
    const second = await t.mutation(api.staging.save, { report: { ...demo, values, referralId: REF_ID, patientId: 'SYN-001' } });
    expect(second.status).toBe('draft');
    expect(second.check.missingFields).toEqual([{ key: 'reporter', label: 'Reporting Specialist' }]);
    expect(second.id).toBe(first.id);
  });

  it('save: a stage group that does not match T, N and M is draft, with stageMismatch set', async () => {
    const demo = await t.query(api.staging.demo, { cancer: 'lung' });
    const saved = await t.mutation(api.staging.save, { report: { ...demo, values: { ...demo.values, stageGroup: 'IA1' } } });
    expect(saved.status).toBe('draft');
    expect(saved.check.stageMismatch).toEqual({ computed: 'IIB', reported: 'IA1' });
    expect(saved.check.readyForRegistry).toBe(false);
  });

  it('save: a client-sent status is rejected by the argument validator, never stored', async () => {
    const demo = await t.query(api.staging.demo, { cancer: 'lung' });
    await expect(t.mutation(api.staging.save, { report: { ...demo, status: 'ready-for-registry' } as never })).rejects.toThrow();
  });

  it('save: without a referral, reports upsert by patientId and cancer', async () => {
    const demo = await t.query(api.staging.demo, { cancer: 'colorectal' });
    const first = await t.mutation(api.staging.save, { report: { ...demo, patientId: 'SYN-002' } });
    const second = await t.mutation(api.staging.save, { report: { ...demo, patientId: 'SYN-002', values: { ...demo.values, reporter: '' } } });
    expect(first.status).toBe('ready-for-registry');
    expect(second.status).toBe('draft');
    expect(second.id).toBe(first.id);
  });

  it('save: an unknown Referral is a clear error', async () => {
    const demo = await t.query(api.staging.demo, { cancer: 'lung' });
    await expect(t.mutation(api.staging.save, { report: { ...demo, referralId: 'REF-NOPE' } })).rejects.toThrow(/Unknown Referral REF-NOPE/);
  });

  it('saved: one row per Referral (upsert), newest first by savedAt', async () => {
    const list = await t.query(api.staging.saved, {});
    expect(list.filter((r) => r.referralId === REF_ID)).toHaveLength(1);
    expect(list.length).toBeGreaterThan(1);
    for (let i = 1; i < list.length; i++) expect(list[i - 1].savedAt >= list[i].savedAt).toBe(true);
  });
});
