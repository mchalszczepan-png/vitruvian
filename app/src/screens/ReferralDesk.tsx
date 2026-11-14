import { useEffect, useState } from 'react';
import { getReferralTemplate, getReferrals } from '../data/api';
import type { Patient, ReferralTemplate, ReferralView } from '../data/types';
import { Icon } from '../components/Icon';
import { ReferralSummary } from '../components/ReferralSummary';
import { Source } from '../components/Source';
import { cancerName, fmtDate, optionLabel, originLabel } from '../components/labels';

type Status = 'new' | 'accepted' | 'returned';

export function ReferralDesk({ patients, focusId, onGoGp }: { patients: Patient[]; focusId?: string; onGoGp: () => void }) {
  const [refs, setRefs] = useState<ReferralView[] | null>(null);
  const [openId, setOpenId] = useState<string | undefined>(focusId);
  const [template, setTemplate] = useState<ReferralTemplate>();
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [query, setQuery] = useState('');

  useEffect(() => {
    getReferrals().then((r) => {
      setRefs(r);
      setOpenId((id) => id ?? r[0]?.id);
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
  const st = open ? (status[open.id] ?? 'new') : 'new';
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
            <button key={r.id} aria-current={r.id === openId} onClick={() => setOpenId(r.id)}>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <b style={{ fontWeight: 600 }}>{p?.name}</b>
                {r.urgency === 'urgent' && <span className="tag urgent">Urgent</span>}
              </span>
              <small>
                {cancerName[r.cancer]} · {fmtDate(r.decidedAt)} · {status[r.id] ?? 'new'}
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
            <div style={{ marginLeft: 'auto', alignSelf: 'center', display: 'flex', gap: 10 }}>
              {st === 'new' ? (
                <>
                  <button className="btn primary" onClick={() => setStatus({ ...status, [open.id]: 'accepted' })}>
                    <Icon name="check" /> Accept and book
                  </button>
                  <button className="btn" onClick={() => setStatus({ ...status, [open.id]: 'returned' })}>
                    Ask the GP for more
                  </button>
                </>
              ) : (
                <span className="tag gemma">{st === 'accepted' ? 'Accepted, booking sent' : 'Returned to the GP'}</span>
              )}
            </div>
          </div>

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
