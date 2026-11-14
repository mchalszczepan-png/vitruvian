// Staging report templates and made-up demo values.
// Source: docs/build/staging-and-severity.md, Part 1 (TNM and registry). Research prototype, not for clinical use.
// stageGroup() implements the lung and colorectal T/N/M grids from the doc. Ovarian uses FIGO 2014: the stage (I–IV) comes from the substage.
import type { CancerType, StagingField, StagingReport, StagingTemplate } from '../types';
import { S } from './sources';

const basis = [
  'Clinical',
  'Surgery',
  'Imaging',
  'Cytology',
  'Histology of primary tumour',
  'Histology of metastasis',
  'Autopsy (microscopic)',
  'Autopsy (macroscopic)',
  'Tumour markers',
  'Unknown',
];

const spreading = ['0', '1', '2', '3', '9'];

const diagnosisDate: StagingField = {
  key: 'diagnosisDate',
  label: 'Date of diagnosis',
  kind: 'date',
  required: true,
  group: 'diagnosis',
  source: S.registryNotification,
};

const basisOfDiagnosis: StagingField = {
  key: 'basisOfDiagnosis',
  label: 'Basis of diagnosis',
  kind: 'choice',
  required: true,
  group: 'diagnosis',
  options: basis,
  hint: 'Paraphrase of an older registry code list. Not checked against v1.1.',
  source: S.registryOldBasisCodes,
};

const spreadingField: StagingField = {
  key: 'spreading',
  label: 'Spreading at diagnosis (registry code)',
  kind: 'choice',
  required: true,
  group: 'registry',
  options: spreading,
  hint: 'Stage is asked when this is 2 or 3. Code meanings not verified.',
  source: S.registryDraftFields,
};

const patientRef: StagingField = {
  key: 'patientRef',
  label: 'Patient reference (pseudonymous)',
  kind: 'text',
  required: true,
  group: 'registry',
  hint: 'Prototype ID only. Never a national identity number.',
  source: S.registryNotification,
};

const reporter: StagingField = {
  key: 'reporter',
  label: 'Reporting Specialist',
  kind: 'text',
  required: true,
  group: 'registry',
};

const tnmT = (options: string[]): StagingField => ({
  key: 'clinicalT',
  label: 'Clinical T (primary tumour)',
  kind: 'choice',
  required: true,
  group: 'tnm',
  options,
});
const tnmN = (options: string[]): StagingField => ({
  key: 'clinicalN',
  label: 'Clinical N (regional nodes)',
  kind: 'choice',
  required: true,
  group: 'tnm',
  options,
});
const tnmM = (): StagingField => ({
  key: 'clinicalM',
  label: 'Clinical M (distant metastasis)',
  kind: 'choice',
  required: true,
  group: 'tnm',
  options: ['MX', 'M0', 'M1a', 'M1b', 'M1c'],
});

export const stagingTemplates: Record<CancerType, StagingTemplate> = {
  lung: {
    cancer: 'lung',
    title: 'Lung Staging report',
    tnmEdition: 'TNM 8th edition (UICC/AJCC)',
    source: S.nciLungTnm,
    fields: [
      {
        key: 'histology',
        label: 'Histology',
        kind: 'choice',
        required: true,
        group: 'tumour',
        options: ['Adenocarcinoma', 'Squamous cell', 'Other non-small cell', 'Small cell', 'Unknown'],
      },
      { key: 'tumourSizeMm', label: 'Tumour size', kind: 'number', required: false, group: 'tumour', unit: 'mm' },
      tnmT(['TX', 'Tis', 'T1mi', 'T1a', 'T1b', 'T1c', 'T2a', 'T2b', 'T3', 'T4']),
      tnmN(['NX', 'N0', 'N1', 'N2', 'N3']),
      tnmM(),
      { ...stageGroupField(['IA1', 'IA2', 'IA3', 'IB', 'IIA', 'IIB', 'IIIA', 'IIIB', 'IIIC', 'IVA', 'IVB', 'unknown']) },
      diagnosisDate,
      basisOfDiagnosis,
      spreadingField,
      patientRef,
      reporter,
    ],
  },
  colorectal: {
    cancer: 'colorectal',
    title: 'Colorectal Staging report',
    tnmEdition: 'TNM 8th edition (UICC/AJCC)',
    source: S.nciColonTnm,
    fields: [
      { key: 'site', label: 'Site', kind: 'choice', required: true, group: 'tumour', options: ['Colon', 'Rectum'], hint: 'Rectum-specific staging rules not verified.' },
      { key: 'histology', label: 'Histology', kind: 'choice', required: true, group: 'tumour', options: ['Adenocarcinoma', 'Other', 'Unknown'] },
      {
        key: 'tumourDepositsPresent',
        label: 'Tumour deposits present',
        kind: 'yesno',
        required: false,
        group: 'tumour',
        hint: 'Noted separately in TNM. Registry handling not verified.',
      },
      tnmT(['TX', 'Tis', 'T1', 'T2', 'T3', 'T4a', 'T4b']),
      tnmN(['NX', 'N0', 'N1', 'N1c', 'N2a', 'N2b']),
      tnmM(),
      { ...stageGroupField(['0', 'I', 'IIA', 'IIB', 'IIC', 'IIIA', 'IIIB', 'IIIC', 'IVA', 'IVB', 'IVC', 'unknown']) },
      diagnosisDate,
      basisOfDiagnosis,
      spreadingField,
      patientRef,
      reporter,
    ],
  },
  ovarian: {
    // docs/build/staging-and-severity.md, ovarian FIGO 2014. TNM equivalent not verified, so no T, N or M here.
    cancer: 'ovarian',
    title: 'Ovarian Staging report',
    tnmEdition: 'FIGO 2014',
    source: S.figo2014,
    fields: [
      { key: 'histology', label: 'Histology', kind: 'choice', required: true, group: 'tumour', options: ['high_grade_serous', 'low_grade_serous', 'endometrioid', 'clear_cell', 'mucinous', 'other', 'unknown'], hint: 'WHO types, 5th edition [unverified list].' },
      { key: 'histologicalGrade', label: 'Histological grade', kind: 'choice', required: false, group: 'tumour', options: ['low', 'high', 'unknown'] },
      { key: 'figoSubstage', label: 'FIGO substage', kind: 'choice', required: false, group: 'tnm', options: ['IA', 'IB', 'IC1', 'IC2', 'IC3', 'IIA', 'IIB', 'IIIA1', 'IIIA2', 'IIIB', 'IIIC', 'IVA', 'IVB', 'unknown'], source: S.figo2014 },
      { key: 'figoStage', label: 'FIGO stage', kind: 'choice', required: true, group: 'tnm', options: ['I', 'II', 'III', 'IV', 'unknown'], source: S.figo2014 },
      diagnosisDate,
      basisOfDiagnosis,
      spreadingField,
      patientRef,
      reporter,
    ],
  },
};

function stageGroupField(options: string[]): StagingField {
  return { key: 'stageGroup', label: 'Stage group', kind: 'choice', required: true, group: 'tnm', options };
}

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

/** Demo values so the video shows a filled report. Made up, and internally consistent with the doc's summary stage groups. */
export const demoStaging: Record<CancerType, StagingReport> = {
  lung: {
    cancer: 'lung',
    patientLabel: 'Matti Esimerkki, 62 (made-up)',
    values: {
      histology: 'Adenocarcinoma',
      tumourSizeMm: '35',
      clinicalT: 'T2a',
      clinicalN: 'N1',
      clinicalM: 'M0',
      stageGroup: 'IIB',
      diagnosisDate: '2026-10-20',
      basisOfDiagnosis: 'Histology of primary tumour',
      spreading: '2',
      patientRef: 'SYN-001',
      reporter: 'Specialist (made-up)',
    },
  },
  colorectal: {
    cancer: 'colorectal',
    patientLabel: 'Anneli (made-up)',
    values: {
      site: 'Colon',
      histology: 'Adenocarcinoma',
      tumourDepositsPresent: 'no',
      clinicalT: 'T3',
      clinicalN: 'N0',
      clinicalM: 'M0',
      stageGroup: 'IIA',
      diagnosisDate: '2026-10-27',
      basisOfDiagnosis: 'Histology of primary tumour',
      spreading: '2',
      patientRef: 'SYN-002',
      reporter: 'Specialist (made-up)',
    },
  },
  ovarian: {
    cancer: 'ovarian',
    patientLabel: 'Sirpa Luonnos, SYN-003, 57 (made-up)',
    values: {
      histology: 'high_grade_serous',
      histologicalGrade: 'high',
      figoSubstage: 'IIIC',
      figoStage: 'III',
      diagnosisDate: '2026-11-03',
      basisOfDiagnosis: 'Histology of primary tumour',
      spreading: '3',
      patientRef: 'SYN-003',
      reporter: 'Specialist (made-up)',
    },
  },
};
