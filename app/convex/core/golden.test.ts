// @vitest-environment node
/// <reference types="vite/client" />
// Golden baseline (DESIGN.md build order step 1): aid:get and fill:fromNote in stub mode, for every seed patient, no network.
// Snapshots: testdata/golden-aid.json and testdata/golden-fill.json. Vitest writes them when missing; refresh a deliberate change with `npx vitest run convex/core -u`.
// Research prototype. Not a medical device. Not for clinical use.
import { convexTest } from 'convex-test';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import schema from '../schema';
import { api } from '../_generated/api';
import seedPatients from '../seed/patients.json';

// convex-test needs every function module, so the glob starts one folder up (convex/).
const modules = import.meta.glob(['../**/*.ts', '../**/*.js', '!../**/*.d.ts', '!../**/*.test.ts']);

const ids: string[] = (seedPatients as { id: string }[]).map((p) => p.id);

describe('golden baseline: aid:get and fill:fromNote, stub mode', () => {
  const aid: Record<string, unknown> = {};
  const fill: Record<string, unknown> = {};

  beforeAll(async () => {
    vi.stubEnv('MODEL_PROVIDER', 'stub');
    const t = convexTest(schema, modules);
    await t.mutation(api.seed.run, {});
    for (const id of ids) {
      const result = await t.action(api.aid.get, { patientId: id });
      aid[id] = result;
      // Fill gets the suspected cancer and the matched Rules from the Aid result.
      fill[id] = {
        cancer: result.suspectedCancer,
        matched: result.matchedRules,
        fields: await t.action(api.fill.fromNote, { patientId: id, cancer: result.suspectedCancer, matched: result.matchedRules }),
      };
    }
  }, 300_000);

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('covers every seed patient', () => {
    expect(Object.keys(aid).sort()).toEqual([...ids].sort());
    expect(Object.keys(fill).sort()).toEqual([...ids].sort());
  });

  it('aid:get matches the golden snapshot', async () => {
    await expect(JSON.stringify(aid, null, 2) + '\n').toMatchFileSnapshot('./testdata/golden-aid.json');
  });

  it('fill:fromNote matches the golden snapshot', async () => {
    await expect(JSON.stringify(fill, null, 2) + '\n').toMatchFileSnapshot('./testdata/golden-fill.json');
  });
});
