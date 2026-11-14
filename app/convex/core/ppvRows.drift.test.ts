// Drift check: the generated ppvRows.ts must match docs/build/risk-ppv.json row for row.
// The JSON is imported (no Node builtin needed), so this runs in the edge-runtime test env like the rest.
// Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it } from 'vitest';
import riskPpvJson from '../../../docs/build/risk-ppv.json';
import { PPV_ROWS } from './ppvRows';

type JsonRow = { id: string; cancer?: string; symptoms: string[]; ppvPct: number; question: string; ageMin: number | null; ageMax: number | null; sex: string | null; source: { url: string } };
const cancers = (riskPpvJson as { cancers: Record<string, JsonRow[]> }).cancers;
const flattened = Object.entries(cancers).flatMap(([cancer, rows]) => rows.map((r) => ({ ...r, cancer })));
const byId = new Map(flattened.map((r) => [r.id, r]));

describe('ppvRows.ts matches docs/build/risk-ppv.json', () => {
  it('has the same row ids, with no extra or missing rows', () => {
    expect(PPV_ROWS.map((r) => r.id).sort()).toEqual(flattened.map((r) => r.id).sort());
  });

  it('has the same key fields for every row', () => {
    for (const row of PPV_ROWS) {
      const src = byId.get(row.id);
      expect(src, row.id).toBeDefined();
      expect({ cancer: row.cancer, symptoms: row.symptoms, ppvPct: row.ppvPct, question: row.question, ageMin: row.ageMin, ageMax: row.ageMax, sex: row.sex, sourceUrl: row.source.url }, row.id).toEqual({
        cancer: src!.cancer,
        symptoms: src!.symptoms,
        ppvPct: src!.ppvPct,
        question: src!.question,
        ageMin: src!.ageMin,
        ageMax: src!.ageMax,
        sex: src!.sex,
        sourceUrl: src!.source.url,
      });
    }
  });

  it('has the same full row for every id (no field silently dropped or changed)', () => {
    for (const row of PPV_ROWS) {
      expect(row, row.id).toEqual(byId.get(row.id));
    }
  });
});
