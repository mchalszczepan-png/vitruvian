import type { GpDecision, Patient, ReferralView } from '../data/types';
import { More } from './More';
import { Source, SourceIcon } from './Source';
import { fmtDate, optionLabel } from './labels';

/**
 * Referral summary for the Referral desk (decision 16, docs/SPEC.md "Who sees the Risk gradient").
 * Renders `ReferralView.summary` from the API; the Risk gradient never reaches this screen.
 */

const decisionLabel: Record<GpDecision, string> = {
  'refer-urgent': 'Refer, urgent',
  'refer-routine': 'Refer, routine',
  'order-test': 'Order a test first',
  'not-now': 'Not now',
};

const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const plain = (label: string) => label.replace(/\s*\(.*\)\s*$/, '');

export function ReferralSummary({ referral: ref, patient }: { referral: ReferralView; patient: Patient }) {
  const s = ref.summary;
  const uniq = (xs: string[]) => [...new Map(xs.map((x) => [plain(x).toLowerCase(), x])).values()];
  const present = uniq(s.redFlags.present);
  const ruledOut = uniq(s.redFlags.ruledOut);

  // Group the visit timeline by symptom, e.g. "Bloating: 18 Sept, 23 Oct, 14 Nov".
  const symptomOf = new Map(patient.visits.map((v) => [v.id, v.symptom]));
  const groups = new Map<string, string[]>();
  for (const v of s.timeline) {
    const key = symptomOf.get(v.visitId) || v.reason;
    groups.set(key, [...(groups.get(key) ?? []), v.date]);
  }
  const timeline = [...groups].sort((a, b) => b[1].length - a[1].length);

  return (
    <section className="rsum" aria-labelledby="rsum-h">
      <header className="rsum-head">
        <h2 id="rsum-h">Referral summary</h2>
        <span className={`tag ${s.urgency === 'urgent' ? 'urgent' : 'gp'}`}>{s.urgency === 'urgent' ? 'Urgent' : 'Routine'}</span>
        <span className="rsum-who">
          GP decision: {decisionLabel[s.gpDecision]} · {fmtDate(ref.decidedAt)}
        </span>
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
        {s.tests.length ? (
          <table className="rsum-tests">
            <thead>
              <tr>
                <th scope="col">Test</th>
                <th scope="col">Value</th>
                <th scope="col">Threshold</th>
                <th scope="col">
                  <span className="rsum-sr">Result</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {s.tests.map((t) => (
                <tr key={t.test}>
                  <th scope="row">
                    {t.test}
                    <SourceIcon source={t.source} />
                  </th>
                  <td className="num">{t.value === null ? 'Not done' : `${t.value} ${t.unit}`}</td>
                  <td>{t.threshold}</td>
                  <td>
                    {t.meetsThreshold === null ? (
                      <span className="rsum-muted">—</span>
                    ) : (
                      <span className={`tag ${t.meetsThreshold ? 'urgent' : 'record'}`}>{t.meetsThreshold ? 'Above' : 'Below'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span className="rsum-muted">No gate test for this cancer type.</span>
        )}
      </div>

      <div className="rsum-row">
        <h3>Red flags</h3>
        <div className="rsum-flags">
          <div>
            <span className="rsum-l">Present</span>
            {present.length ? (
              present.map((f) => (
                <span key={f} className="chip on">
                  {plain(f)}
                </span>
              ))
            ) : (
              <span className="rsum-muted">None</span>
            )}
          </div>
          <div>
            <span className="rsum-l">Ruled out</span>
            {ruledOut.length ? (
              ruledOut.map((f) => (
                <span key={f} className="chip">
                  {plain(f)}
                </span>
              ))
            ) : (
              <span className="rsum-muted">None</span>
            )}
          </div>
        </div>
      </div>

      <div className="rsum-row">
        <h3>Missing fields</h3>
        {s.missingFields.length ? (
          <div className="rsum-flags">
            <div>
              {s.missingFields.map((f) => (
                <span key={f.key} className="chip miss">
                  {plain(f.label)}
                </span>
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
          {s.matchedRules.map((m) => (
            <div className="desk-rule" key={m.ruleId}>
              <div className="rule">
                <div className="rule-top">
                  <b>{m.text}</b>
                  <span className="rule-id">{m.ruleId}</span>
                </div>
                <More>
                  Reason: {m.because}
                  {m.visitDates.length > 0 && ` Visits: ${m.visitDates.map(shortDate).join(', ')}.`}
                </More>
              </div>
              <Source source={m.source} />
            </div>
          ))}
          {s.matchedRules.length === 0 && <span className="rsum-muted">No Rule matched.</span>}
        </div>
      </div>
    </section>
  );
}
