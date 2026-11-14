// Builds the Staging report the Specialist starts from (story 32), from a Referral and its patient.
// Pure: type imports only, so the mock path (api.ts) and the Convex functions (convex/staging.ts) both use it.
// Only facts that really exist in the patient record or the Referral are copied, and only into keys the template has.
// Stage data (T, N, M, histology, dates of diagnosis) is never invented here: the Specialist enters it.
// Research prototype. Not a medical device. Not for clinical use.
import type { Patient, Referral, StagingTemplate } from './types';
import type { StagingReport } from './types';

/** Each prefill maps one template key to a fact that exists on the patient or the Referral. */
const PREFILL: { key: string; from: (referral: Referral, patient: Patient) => string | undefined }[] = [
  // The pseudonymous patient reference: the made-up demo ID, never a national identity number.
  { key: 'patientRef', from: (_referral, patient) => patient.id },
];

export function buildStagingDraft(referral: Referral, patient: Patient, template: StagingTemplate): StagingReport {
  const keys = new Set(template.fields.map((field) => field.key));
  const values: Record<string, string> = {};
  for (const { key, from } of PREFILL) {
    const value = keys.has(key) ? from(referral, patient) : undefined;
    if (value !== undefined && value.trim() !== '') values[key] = value;
  }
  return {
    cancer: referral.cancer,
    patientLabel: `${patient.name}, ${patient.id}, ${patient.age} (made-up)`,
    values,
    referralId: referral.id,
    patientId: patient.id,
    prefilled: Object.keys(values),
  };
}
