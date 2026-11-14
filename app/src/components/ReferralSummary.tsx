import type { Patient, Referral, ReferralTemplate, Source as S } from '../data/types';
import { rules } from '../data/mock/rules';
import { More } from './More';
import { Source, SourceIcon } from './Source';
import { fmtDate, optionLabel } from './labels';

/**
 * Referral summary for the Referral desk (decision 16, docs/SPEC.md "Who sees the Risk gradient").
 * It never shows the Risk gradient: that AI estimate stays on the GP side.
 */

/** Template fields that are bookkeeping or GP-only, never shown here. */
const HIDDEN = new Set(['riskGradientAiEstimate', 'matchedRuleIds']);
/** Yes/no fields that record a test was done, not a red flag. */
const NOT_FLAGS = new Set(['fitDone', 'ca125Done']);

/** NG12 Table 1 (2026) CA-125 thresholds by age band, IU/mL; same table as the Aid (data/api.ts). Under 40 it is not used alone. */
function ca125Limit(age: number): number | undefined {
  if (age < 40) return undefined;
  if (age < 50) return 35;
  if (age < 60) return 31;
  if (age < 70) return 24;
  if (age < 80) return 25;
  return 31;
}

const gateSource = (test: string): S | undefined => rules.find((r) => r.gate?.test === test)?.gate?.source;
const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const plain = (label: string) => label.replace(/\s*\(.*\)\s*$/, '');

interface TestRow {
  name: string;
  value: string;
  threshold: string;
  above?: boolean;
  source?: S;
}

function keyTests(ref: Referral, patient: Patient): TestRow[] {
  const v = (k: string) => ref.fields[k]?.value?.trim() ?? '';
  const rows: TestRow[] = [];
  if (ref.cancer === 'colorectal') {
    const fit = Number(v('fitValueUgHbPerG'));
    const done = v('fitDone') !== 'no' && v('fitValueUgHbPerG') !== '';
    rows.push({
      name: 'FIT',
      value: done ? `${fit} µg Hb/g` : 'Not done',
      threshold: '≥ 10',
      above: done ? fit >= 10 : undefined,
      source: gateSource('FIT'),
    });
  }
  if (ref.cancer === 'ovarian') {
    const ca = Number(v('ca125ValueIuPerMl'));
    const done = v('ca125Done') !== 'no' && v('ca125ValueIuPerMl') !== '';
    const limit = ca125Limit(patient.age);
    rows.push({
      name: 'CA-125',
      value: done ? `${ca} IU/mL` : 'Not done',
      threshold: limit === undefined ? 'Not used alone under 40' : `≥ ${limit} at age ${patient.age}`,
      above: done && limit !== undefined ? ca >= limit : undefined,
      source: gateSource('CA-125'),
    });
  }
  if (ref.cancer === 'lung') {
    const cxr = v('chestXrayResult') === 'not_done' ? '' : v('chestXrayResult');
    rows.push({ name: 'Chest X-ray', value: cxr ? optionLabel(cxr) : 'Not done', threshold: 'Suggests lung cancer', above: cxr ? cxr !== 'normal' : undefined });
  }
  return rows;
}

export function ReferralSummary({ referral: ref, patient, template }: { referral: Referral; patient: Patient; template?: ReferralTemplate }) {
  // Symptom timeline: every symptom group in the visit history, in order of first visit.
  const groups = new Map<string, string[]>();
  for (const v of patient.visits) if (v.symptom) groups.set(v.symptom, [...(groups.get(v.symptom) ?? []), v.date]);
  const timeline = [...groups].sort((a, b) => b[1].length - a[1].length);

  const fields = template?.fields.filter((f) => !HIDDEN.has(f.key)) ?? [];
  const flags = fields.filter((f) => f.kind === 'yesno' && !NOT_FLAGS.has(f.key));
  const present = flags.filter((f) => ref.fields[f.key]?.value === 'yes');
  const ruledOut = flags.filter((f) => ref.fields[f.key]?.value === 'no');
  const missing = fields.filter((f) => f.required && !ref.fields[f.key]?.value?.trim());
  const tests = keyTests(ref, patient);

  return (
    <section className="rsum" aria-labelledby="rsum-h">
      <header className="rsum-head">
        <h2 id="rsum-h">Referral summary</h2>
        <span className={`tag ${ref.urgency === 'urgent' ? 'urgent' : 'gp'}`}>{ref.urgency === 'urgent' ? 'Urgent' : 'Routine'}</span>
        <span className="rsum-who">Referred by the GP · {fmtDate(ref.decidedAt)}</span>
      </header>

      <div className="rsum-row">
        <h3>Symptom timeline</h3>
        <ul className="rsum-tl">
          {timeline.map(([sym, dates]) => (
            <li key={sym}>
              <b>{optionLabel(sym)}:</b> {dates.map(shortDate).join(', ')}
            </li>
          ))}
        </ul>
      </div>

      <div className="rsum-row">
        <h3>Key tests</h3>
        <table className="rsum-tests">
          <thead>
            <tr>
              <th scope="col">Test</th>
              <th scope="col">Value</th>
              <th scope="col">Threshold</th>
              <th scope="col"><span className="rsum-sr">Result</span></th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.name}>
                <th scope="row">
                  {t.name}
                  {t.source && <SourceIcon source={t.source} />}
                </th>
                <td className="num">{t.value}</td>
                <td>{t.threshold}</td>
                <td>{t.above === undefined ? <span className="rsum-muted">—</span> : <span className={`tag ${t.above ? 'urgent' : 'record'}`}>{t.above ? 'Above' : 'Below'}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rsum-row">
        <h3>Red flags</h3>
        <div className="rsum-flags">
          <div>
            <span className="rsum-l">Present</span>
            {present.length ? present.map((f) => <span key={f.key} className="chip on">{plain(f.label)}</span>) : <span className="rsum-muted">None</span>}
          </div>
          <div>
            <span className="rsum-l">Ruled out</span>
            {ruledOut.length ? ruledOut.map((f) => <span key={f.key} className="chip">{plain(f.label)}</span>) : <span className="rsum-muted">None</span>}
          </div>
        </div>
      </div>

      <div className="rsum-row">
        <h3>Missing fields</h3>
        {missing.length ? (
          <div className="rsum-flags">
            <div>
              {missing.map((f) => (
                <span key={f.key} className="chip miss">{plain(f.label)}</span>
              ))}
            </div>
          </div>
        ) : (
          <span className="rsum-muted">None. Every required field is filled.</span>
        )}
      </div>

      <div className="rsum-row">
        <h3>Matched Rules</h3>
        <div className="rules">
          {ref.matchedRules.map((m) => (
            <div className="desk-rule" key={m.rule.id}>
              <div className="rule">
                <div className="rule-top">
                  <b>{m.rule.text}</b>
                  <span className="rule-id">{m.rule.id}</span>
                </div>
                <More>Reason: {m.because}</More>
              </div>
              <Source source={m.rule.source} />
            </div>
          ))}
          {ref.matchedRules.length === 0 && <span className="rsum-muted">No Rule matched.</span>}
        </div>
      </div>
    </section>
  );
}

export { HIDDEN as HIDDEN_DESK_FIELDS };
