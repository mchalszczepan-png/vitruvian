// Staging checks shared by the mock path (api.ts) and the Convex functions (convex/staging.ts).
// Pure: type imports only, so both sides can use it. Grids from docs/build/staging-and-severity.md (TNM 8th edition).
// Research prototype. Not a medical device. Not for clinical use.
import type { CancerType, StagingTemplate } from './types';
import type { StagingCheck } from './types';

// Grids from docs/build/staging-and-severity.md (TNM 8th edition, secondary sources; AJCC text not read).
// Outer key = T (colorectal) or N (lung); inner key = the other one. M0 only; M1 is handled in stageGroup().
type Grid = Record<string, Record<string, string>>;

const LUNG_M0: Grid = {
  N0: { T1mi: 'IA1', T1a: 'IA1', T1b: 'IA2', T1c: 'IA3', T2a: 'IB', T2b: 'IIA', T3: 'IIB', T4: 'IIIA' },
  N1: { T1mi: 'IIB', T1a: 'IIB', T1b: 'IIB', T1c: 'IIB', T2a: 'IIB', T2b: 'IIB', T3: 'IIIA', T4: 'IIIA' },
  N2: { T1mi: 'IIIA', T1a: 'IIIA', T1b: 'IIIA', T1c: 'IIIA', T2a: 'IIIA', T2b: 'IIIA', T3: 'IIIB', T4: 'IIIB' },
  N3: { T1mi: 'IIIB', T1a: 'IIIB', T1b: 'IIIB', T1c: 'IIIB', T2a: 'IIIB', T2b: 'IIIB', T3: 'IIIC', T4: 'IIIC' },
};

const LUNG_M1: Record<string, string> = { M1a: 'IVA', M1b: 'IVA', M1c: 'IVB' };

const COLORECTAL_M0: Grid = {
  Tis: { N0: '0' },
  T1: { N0: 'I', N1: 'IIIA', N1c: 'IIIA', N2a: 'IIIA', N2b: 'IIIB' },
  T2: { N0: 'I', N1: 'IIIA', N1c: 'IIIA', N2a: 'IIIB', N2b: 'IIIB' },
  T3: { N0: 'IIA', N1: 'IIIB', N1c: 'IIIB', N2a: 'IIIB', N2b: 'IIIC' },
  T4a: { N0: 'IIB', N1: 'IIIB', N1c: 'IIIB', N2a: 'IIIC', N2b: 'IIIC' },
  T4b: { N0: 'IIC', N1: 'IIIC', N1c: 'IIIC', N2a: 'IIIC', N2b: 'IIIC' },
};

const COLORECTAL_M1: Record<string, string> = { M1a: 'IVA', M1b: 'IVB', M1c: 'IVC' };

/**
 * Stage group from the clinical T, N and M values, using the doc's grid.
 * Returns null when a value is missing or the combination is not in the grid
 * (e.g. TX, NX, MX, bare N2 for colorectal, Tis for lung). Ovarian returns the FIGO stage (I–IV)
 * that the FIGO substage belongs to.
 */
export function stageGroup(cancer: CancerType, values: Record<string, string>): string | null {
  if (cancer === 'ovarian') {
    const sub = values.figoSubstage;
    return sub && sub !== 'unknown' ? sub.match(/^(IV|III|II|I)/)![1] : null;
  }
  const t = values.clinicalT;
  const n = values.clinicalN;
  const m = values.clinicalM;
  if (!t || !n || !m) return null;

  if (cancer === 'lung') {
    const m0 = LUNG_M0[n]?.[t];
    if (m === 'M0') return m0 ?? null;
    // M1a/M1b/M1c apply to any T and N in the grid
    if (m0 !== undefined && LUNG_M1[m]) return LUNG_M1[m];
    return null;
  }

  if (cancer === 'colorectal') {
    const cell = COLORECTAL_M0[t]?.[n];
    if (m === 'M0') return cell ?? null;
    // M1 only with a T1–T4b tumour (Tis is not covered)
    if (t !== 'Tis' && cell !== undefined && COLORECTAL_M1[m]) return COLORECTAL_M1[m];
    return null;
  }

  return null;
}

/**
 * Story 31–33: the Staging report check. Missing = required fields with no value after trim.
 * The stage the Specialist reported (stageGroup, or figoStage for ovarian) is compared with the one worked out from T, N and M (or the FIGO substage).
 * readyForRegistry is true only when nothing is missing and the stage does not mismatch.
 */
export function checkStaging(template: StagingTemplate, values: Record<string, string>): StagingCheck {
  const missingFields = template.fields
    .filter((field) => field.required && (values[field.key] ?? '').trim() === '')
    .map((field) => ({ key: field.key, label: field.label }));
  const stageKey = template.cancer === 'ovarian' ? 'figoStage' : 'stageGroup';
  const computedStage = stageGroup(template.cancer, values);
  const reported = (values[stageKey] ?? '').trim();
  const stageMismatch = computedStage !== null && reported !== '' && computedStage !== reported ? { computed: computedStage, reported } : undefined;
  return {
    readyForRegistry: missingFields.length === 0 && stageMismatch === undefined,
    missingFields,
    computedStage,
    ...(stageMismatch ? { stageMismatch } : {}),
  };
}
