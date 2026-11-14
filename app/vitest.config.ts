// Test runner config. Separate from vite.config.ts so the app build is unchanged.
// Research prototype. Not a medical device. Not for clinical use.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'edge-runtime',
    // convex/model tests and scripts/schemas.test.ts run in node (per-file docblock): fetch mocks, golden file, ml/ copy check.
    include: ['src/**/*.contract.test.ts', 'convex/model/**/*.test.ts', 'convex/core/**/*.test.ts', 'convex/staging.test.ts', 'scripts/schemas.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
