// @vitest-environment node
// Fails when the Convex copy of the referral schemas differs from ml/schemas/*.json (run scripts/sync-schemas.sh to fix).
// Research prototype. Not a medical device. Not for clinical use.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

for (const cancer of ['lung', 'colorectal', 'ovarian']) {
  describe(`schema copy: ${cancer}`, () => {
    it(`app/convex/model/schemas/${cancer}.json is byte-identical to ml/schemas/${cancer}.json`, () => {
      const copy = readFileSync(new URL(`../convex/model/schemas/${cancer}.json`, import.meta.url), 'utf8');
      const source = readFileSync(new URL(`../../ml/schemas/${cancer}.json`, import.meta.url), 'utf8');
      expect(copy).toBe(source);
    });
  });
}
