import type { CancerType, FieldOrigin } from '../data/types';

export const cancerName: Record<CancerType, string> = { lung: 'Lung', colorectal: 'Colorectal', ovarian: 'Ovarian' };

const optionNames: Record<string, string> = {
  urgent_2_week: 'Urgent, within 2 weeks',
  urgent: 'Urgent',
  not_done: 'Not done',
  suspicious_nodule: 'Suspicious nodule',
  chest_pain: 'Chest pain',
  weight_loss: 'Weight loss',
  appetite_loss: 'Appetite loss',
  finger_clubbing: 'Finger clubbing',
  lymph_node_enlargement: 'Enlarged lymph nodes',
  recurrent_pneumonia: 'Recurrent pneumonia',
  high_grade_serous: 'High-grade serous',
  low_grade_serous: 'Low-grade serous',
  pathogenic_variant: 'Pathogenic variant',
  no_pathogenic_variant: 'No pathogenic variant',
  yes: 'Yes',
  no: 'No',
};

export function optionLabel(v: string): string {
  if (optionNames[v]) return optionNames[v];
  const s = v.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const originLabel: Record<FieldOrigin, string> = {
  record: 'Record',
  gemma: 'AI',
  gp: 'Edited by GP',
  empty: 'Empty',
};

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
