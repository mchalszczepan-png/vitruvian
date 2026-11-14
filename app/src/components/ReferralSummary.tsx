import type { GpDecision, Patient, ReferralView } from '../data/types';
import { More } from './More';
import { Source, SourceIcon } from './Source';
import { fmtDate, optionLabel } from './labels';
import { getLang, useBi } from './lang';

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

const shortDate = (iso: string) => getLang() === 'fi' ? `${Number(iso.slice(8, 10))}.${Number(iso.slice(5, 7))}.` : new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const plain = (label: string) => label.replace(/\s*\(.*\)\s*$/, '');

export function ReferralSummary({ referral: ref, patient }: { referral: ReferralView; patient: Patient }) {
  const t = useBi();
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
        <h2 id="rsum-h">{t('Referral summary')}</h2>
        <span className={`tag ${s.urgency === 'urgent' ? 'urgent' : 'gp'}`}>{t(s.urgency === 'urgent' ? 'Urgent' : 'Routine')}</span>
        <span className="rsum-who">
          {t('GP decision: {decision} · {date}', { decision: t(decisionLabel[s.gpDecision]), date: fmtDate(ref.decidedAt) })}
        </span>
      </header>

      <div className="rsum-row">
        <h3>{t('Symptom timeline')}</h3>
        <ul className="rsum-tl">
          {timeline.map(([sym, dates]) => (
            <li key={sym}>
              <b>{optionLabel(sym)}:</b> {dates.map(shortDate).join(', ')}
            </li>
          ))}
        </ul>
      </div>

      <div className="rsum-row">
        <h3>{t('Key tests')}</h3>
        {s.tests.length ? (
          <table className="rsum-tests">
            <thead>
              <tr>
                <th scope="col">{t('Test')}</th>
                <th scope="col">{t('Value')}</th>
                <th scope="col">{t('Threshold')}</th>
                <th scope="col">
                  <span className="rsum-sr">{t('Result')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {s.tests.map((row) => (
                <tr key={row.test}>
                  <th scope="row">
                    {row.test}
                    <SourceIcon source={row.source} />
                  </th>
                  <td className="num">{row.value === null ? t('Not done') : `${row.value} ${row.unit}`}</td>
                  <td>{row.threshold}</td>
                  <td>
                    {row.meetsThreshold === null ? (
                      <span className="rsum-muted">—</span>
                    ) : (
                      <span className={`tag ${row.meetsThreshold ? 'urgent' : 'record'}`}>{t(row.meetsThreshold ? 'Above' : 'Below')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span className="rsum-muted">{t('No gate test for this cancer type.')}</span>
        )}
      </div>

      <div className="rsum-row">
        <h3>{t('Red flags')}</h3>
        <div className="rsum-flags">
          <div>
            <span className="rsum-l">{t('Present')}</span>
            {present.length ? (
              present.map((f) => (
                <span key={f} className="chip on">
                  {t(f)}
                </span>
              ))
            ) : (
              <span className="rsum-muted">{t('None')}</span>
            )}
          </div>
          <div>
            <span className="rsum-l">{t('Ruled out')}</span>
            {ruledOut.length ? (
              ruledOut.map((f) => (
                <span key={f} className="chip">
                  {t(f)}
                </span>
              ))
            ) : (
              <span className="rsum-muted">{t('None')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="rsum-row">
        <h3>{t('Missing fields')}</h3>
        {s.missingFields.length ? (
          <div className="rsum-flags">
            <div>
              {s.missingFields.map((f) => (
                <span key={f.key} className="chip miss">
                  {t(f.label)}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <span className="rsum-muted">{t('None. Every required field is filled.')}</span>
        )}
      </div>

      <div className="rsum-row">
        <h3>{t('Matched Rules')}</h3>
        <div className="rules">
          {s.matchedRules.map((m) => (
            <div className="desk-rule" key={m.ruleId}>
              <div className="rule">
                <div className="rule-top">
                  <b>{m.text}</b>
                  <span className="rule-id">{m.ruleId}</span>
                </div>
                <More>
                  {t('Reason: {because}', { because: m.because })}
                  {m.visitDates.length > 0 && ` ${t('Visits: {dates}.', { dates: m.visitDates.map(shortDate).join(', ') })}`}
                </More>
              </div>
              <Source source={m.source} />
            </div>
          ))}
          {s.matchedRules.length === 0 && <span className="rsum-muted">{t('No Rule matched.')}</span>}
        </div>
      </div>
    </section>
  );
}
