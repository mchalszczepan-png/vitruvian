import { useEffect, useState } from 'react';
import { getReferralTemplate, getReferrals, setReferralStatus } from '../data/api';
import type { Patient, ReferralStatus, ReferralTemplate, ReferralView } from '../data/types';
import { Icon } from '../components/Icon';
import { ReferralSummary } from '../components/ReferralSummary';
import { STATUS_REASON_MAX } from '../data/referralSummary';
import { Source } from '../components/Source';
import { cancerName, fmtDate, optionLabel, originLabel } from '../components/labels';

const statusLabel: Record<ReferralStatus, string> = { sent: 'New', accepted: 'Accepted', returned: 'Returned to the GP' };

export function ReferralDesk({ patients, focusId, patientId, onGoGp }: { patients: Patient[]; focusId?: string; patientId?: string; onGoGp: () => void }) {
  const [refs, setRefs] = useState<ReferralView[] | null>(null);
  const [openId, setOpenId] = useState<string | undefined>(focusId);
  const [template, setTemplate] = useState<ReferralTemplate>();
  const [returning, setReturning] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getReferrals().then((r) => {
      setRefs(r);
      setOpenId((id) => id ?? r.find((x) => x.patientId === patientId)?.id ?? r[0]?.id);
    });
  }, []);
  const open = refs?.find((r) => r.id === openId);
  useEffect(() => {
    if (open) getReferralTemplate(open.cancer).then(setTemplate);
  }, [open]);

  if (refs === null) return <div className="loading" aria-busy><i /><i /><i /></div>;
  if (refs.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="doc" size={28} />
        <h2>No Referrals yet</h2>
        <button className="btn primary" onClick={onGoGp}>
          Go to the GP view
        </button>
      </div>
    );
  }

  const patient = patients.find((p) => p.id === open?.patientId);
  const q = query.trim().toLowerCase();
  const shown = refs.filter((r) => !q || [patients.find((x) => x.id === r.patientId)?.name ?? '', r.patientId].some((t) => t.toLowerCase().includes(q)));
  const decide = async (next: 'accepted' | 'returned') => {
    if (!open) return;
    setBusy(true);
    setError('');
    try {
      const updated = await setReferralStatus(open.id, next, next === 'returned' ? reason : undefined);
      setRefs((rs) => rs?.map((r) => (r.id === updated.id ? updated : r)) ?? null);
      setReturning(false);
      setReason('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the decision.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="split">
      <nav className="inbox" aria-label="Received Referrals">
        <h2>Referral desk</h2>
        <input
          type="search"
          className="input inbox-search"
          placeholder="Search patients"
          aria-label="Search patients by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {shown.length === 0 && <p className="inbox-empty">No patients match “{query}”.</p>}
        {shown.map((r) => {
          const p = patients.find((x) => x.id === r.patientId);
          return (
            <button key={r.id} aria-current={r.id === openId} onClick={() => { setOpenId(r.id); setReturning(false); setReason(''); setError(''); }}>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <b style={{ fontWeight: 600 }}>{p?.name}</b>
                {r.urgency === 'urgent' && <span className="tag urgent">Urgent</span>}
              </span>
              <small>
                {cancerName[r.cancer]} · {fmtDate(r.decidedAt)} · {statusLabel[r.status ?? 'sent']}
              </small>
            </button>
          );
        })}
      </nav>
      {open && patient && (
        <article className="doc" aria-label="Referral">
          <header className="doc-head">
            <h1>
              {open.urgency === 'urgent' ? 'Urgent' : 'Routine'} {cancerName[open.cancer].toLowerCase()} Referral
            </h1>
            {open.repeatVisit && (
              <div className="meta">
                <span className="tag gp">Repeat visit: {open.repeatVisit.count} visits</span>
              </div>
            )}
          </header>

          <div className="summary-strip">
            <div>
              <span className="l">Suspected cancer type</span>
              <span className="v">{cancerName[open.cancer]}</span>
            </div>
            <div>
              <span className="l">Severity</span>
              <span className="v">{open.severity.fiveYearSurvivalPct === null ? 'Pending' : `${open.severity.fiveYearSurvivalPct}%`}</span>
              <Source source={open.severity.source} short />
            </div>
            <div className="desk-actions">
              {(open.status ?? 'sent') === 'sent' ? (
                !returning && (
                  <>
                    <button className="btn primary" disabled={busy} onClick={() => decide('accepted')}>
                      <Icon name="check" /> Accept
                    </button>
                    <button className="btn" disabled={busy} onClick={() => setReturning(true)}>
                      Return to the GP
                    </button>
                  </>
                )
              ) : (
                <span className={`tag ${open.status === 'accepted' ? 'gemma' : 'warn'}`}>
                  {statusLabel[open.status]}
                  {open.statusAt && ` · ${fmtDate(open.statusAt)}`}
                </span>
              )}
            </div>
          </div>

          {returning && (open.status ?? 'sent') === 'sent' && (
            <form
              className="return-box"
              onSubmit={(e) => {
                e.preventDefault();
                decide('returned');
              }}
            >
              <label htmlFor="return-reason">Reason for the GP</label>
              <textarea
                id="return-reason"
                rows={3}
                maxLength={STATUS_REASON_MAX}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                autoFocus
              />
              <div className="return-actions">
                <button className="btn primary" type="submit" disabled={busy || !reason.trim()}>
                  Return
                </button>
                <button className="btn" type="button" onClick={() => setReturning(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
          {open.status === 'returned' && open.statusReason && (
            <p className="return-reason">
              <b>Reason:</b> {open.statusReason}
            </p>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <ReferralSummary referral={open} patient={patient} />

          <section>
            <h2>Referral template</h2>
            {template && (
              <dl className="kv">
                {template.fields.filter((f) => f.key !== 'riskGradientAiEstimate').map((f) => {
                  const v = open.fields[f.key];
                  const val = v?.value ? (f.kind === 'choice' || f.kind === 'yesno' ? v.value.split(', ').map(optionLabel).join(', ') : v.value) : '—';
                  return (
                    <div key={f.key} style={{ display: 'contents' }}>
                      <dt>
                        {f.label}
                        {f.required && <span className="req"> *</span>}
                      </dt>
                      <dd>
                        {val}
                        {f.unit && v?.value ? ` ${f.unit}` : ''}
                      </dd>
                      <dd className="o">
                        <span className={`tag ${v?.value ? v.origin : 'empty'}`}>{originLabel[v?.value ? v.origin : 'empty']}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </section>
        </article>
      )}
    </div>
  );
}
