import type { CancerType, FieldOrigin } from '../data/types';
import { getLang, tr } from './lang';

/** Reads the English word list through the current language. App re-renders the whole tree on a language change. */
const translated = <K extends string>(o: Record<K, string>): Record<K, string> =>
  new Proxy(o, { get: (t, k) => (typeof k === 'string' && k in t ? tr(t[k as K], getLang()) : undefined) });

export const cancerName = translated<CancerType>({ lung: 'Lung', colorectal: 'Colorectal', ovarian: 'Ovarian' });

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
  if (optionNames[v]) return tr(optionNames[v], getLang());
  const s = v.replace(/_/g, ' ');
  return tr(s.charAt(0).toUpperCase() + s.slice(1), getLang());
}

export const originLabel = translated<FieldOrigin>({
  record: 'Record',
  gemma: 'AI',
  gp: 'Edited by GP',
  empty: 'Empty',
});

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(getLang() === 'fi' ? 'fi-FI' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
