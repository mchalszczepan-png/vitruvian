// Research prototype. Not a medical device. Not for clinical use.
import { describe, expect, it } from 'vitest';
import { coerceFacts } from './facts';

describe('coerceFacts hb units', () => {
  it('reads a g/dL haemoglobin as g/L and leaves g/L as it is', () => {
    expect(coerceFacts({ hb: 9.8 }).hb).toBe(98);
    expect(coerceFacts({ hb: 98 }).hb).toBe(98);
    expect(coerceFacts({ hb: 0 }).hb).toBe(0);
  });
});
