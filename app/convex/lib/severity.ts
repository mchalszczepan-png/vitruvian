// Severity figure choice (docs/SPEC.md "Aid pipeline" step 7). Pure, unit-tested.
// Research prototype. Not a medical device. Not for clinical use.
import type { Severity } from '../../src/data/types';

/**
 * Headline stays the all-ages figure (for ovarian Finland that is 49.1%, the figure the demo cites).
 * The age-band figure that matches the patient's sex and age is kept in ageBands, so the UI can show it next to the headline.
 * If no band matches, ageBands is the sex's bands with nothing matched (empty array).
 */
export function severityForPatient(sev: Severity, age: number, sex: 'male' | 'female'): Severity {
  const bands = sev.ageBands ?? [];
  const band = bands.find((b) => b.sex === sex && age >= b.min && age <= b.max);
  return { ...sev, ageBands: band ? [band] : [] };
}
