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

export { stageGroup } from '../stagingCheck';

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
