import { useEffect, useMemo, useState } from 'react';
import { MOCK_NOTICE, fillTemplateFromNote, getAid, getReferralTemplate, repeatVisit, sendReferral } from '../data/api';
import type { AidResult, FieldValues, GpDecision, Patient, Referral, ReferralTemplate } from '../data/types';
import { FieldInput } from '../components/FieldInput';
import { Icon, Mark } from '../components/Icon';
import { More } from '../components/More';
import { Source } from '../components/Source';
import { cancerName, fmtDate } from '../components/labels';

type Step = 'patient' | 'template' | 'aid';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;

interface Draft {
  step: Step;
  aid?: AidResult;
  template?: ReferralTemplate;
  fields?: FieldValues;
  filling: boolean;
  decision?: GpDecision;
  sent?: Referral;
}

interface Props {
  patients: Patient[];
  patientId: string;
  onPatient: (id: string) => void;
  onOpenDesk: (referralId: string) => void;
}

export function GpWorkspace({ patients, patientId, onPatient, onOpenDesk }: Props) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const patient = patients.find((p) => p.id === patientId) ?? patients[0];
  const draft: Draft = drafts[patient.id] ?? { step: 'patient', filling: false };
  // Visits lit up in the record system while the GP points at a matched Rule.
  const [lit, setLit] = useState<string[]>([]);
  // On the Aid step, each visit shows which matched Rules it fed (BUILD-PLAN decision 15).
  const fed = useMemo(() => {
    const m = new Map<string, string[]>();
    if (draft.step !== 'aid') return m;
    for (const r of draft.aid?.matchedRules ?? []) for (const v of r.visits) m.set(v.visitId, [...(m.get(v.visitId) ?? []), r.rule.id]);
    return m;
  }, [draft.step, draft.aid]);
  const update = (id: string, d: Partial<Draft>) => setDrafts((all) => ({ ...all, [id]: { ...(all[id] ?? { step: 'patient', filling: false }), ...d } }));

  // The Aid runs as soon as the record system opens a patient, so the panel is ready when the GP looks.
  useEffect(() => {
    if (drafts[patient.id]?.aid) return;
    let live = true;
    getAid(patient.id).then(async (aid) => {
      const template = await getReferralTemplate(aid.suspectedCancer);
      if (live) update(patient.id, { aid, template });
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.id]);

  async function fill() {
    if (!draft.aid) return;
    update(patient.id, { filling: true, step: 'template' });
    const fields = await fillTemplateFromNote(patient.id, draft.aid.suspectedCancer, draft.aid.matchedRules);
    update(patient.id, { fields, filling: false });
  }

  return (
    <div className="gp-layout">
      <RecordSystem patients={patients} patient={patient} onPatient={onPatient} lit={lit} fed={fed} />
      <section className="dock" aria-label="Vitruvian panel">
        <header className="dock-head">
          <Mark size={20} />
          <span className="wordmark">Vitruvian</span>
          <span className="following" title="Following the open record">
            <Icon name="plug" size={14} />
            {patient.id}
          </span>
        </header>
        <nav className="dock-tabs ptabs" role="tablist" aria-label="Steps">
          <StepTab n={1} label="Patient" id="patient" draft={draft} onGo={(s) => update(patient.id, { step: s })} done={draft.step !== 'patient'} />
          <StepTab n={2} label="Referral template" id="template" draft={draft} onGo={(s) => update(patient.id, { step: s })} disabled={!draft.fields && !draft.filling} done={draft.step === 'aid'} />
          <StepTab n={3} label="Aid" id="aid" draft={draft} onGo={(s) => update(patient.id, { step: s })} disabled={!draft.fields} done={!!draft.sent} />
        </nav>
        <div className="dock-body">
          {draft.step === 'patient' && <PatientStep patient={patient} aid={draft.aid} onFill={fill} filled={!!draft.fields} onNext={() => update(patient.id, { step: 'template' })} />}
          {draft.step === 'template' && (
            <TemplateStep
              draft={draft}
              onChange={(key, value) => update(patient.id, { fields: { ...draft.fields, [key]: { ...draft.fields?.[key], value, origin: 'gp' } } })}
              onNext={() => update(patient.id, { step: 'aid' })}
            />
          )}
          {draft.step === 'aid' && draft.aid && (
            <AidStep
              patient={patient}
              draft={draft}
              onLight={setLit}
              onFixFields={() => update(patient.id, { step: 'template' })}
              onDecide={async (decision) => {
                update(patient.id, { decision });
                if (decision === 'refer-urgent' || decision === 'refer-routine') {
                  const r = await sendReferral({
                    id: `REF-${patient.id}`,
                    patientId: patient.id,
                    cancer: draft.aid!.suspectedCancer,
                    urgency: decision === 'refer-urgent' ? 'urgent' : 'routine',
                    decidedBy: 'GP',
                    decidedAt: new Date().toISOString(),
                    fields: draft.fields ?? {},
                    matchedRules: draft.aid!.matchedRules,
                    riskGradient: draft.aid!.riskGradient,
                    severity: draft.aid!.severity,
                    repeatVisit: repeatVisit(patient),
                  });
                  update(patient.id, { sent: r, decision });
                }
              }}
              onOpenDesk={onOpenDesk}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function StepTab({ n, label, id, draft, onGo, disabled, done }: { n: number; label: string; id: Step; draft: Draft; onGo: (s: Step) => void; disabled?: boolean; done?: boolean }) {
  const on = draft.step === id;
  return (
    <button role="tab" aria-selected={on} className={`ptab${done && !on ? ' done' : ''}`} disabled={disabled} onClick={() => onGo(id)}>
      {done && !on ? <Icon name="check" size={14} /> : <span className="n">{n}</span>}
      {label}
    </button>
  );
}

/* ---------- The record system the GP already uses (generic, unbranded) ---------- */

function RecordSystem({
  patients,
  patient,
  onPatient,
  lit,
  fed,
}: {
  patients: Patient[];
  patient: Patient;
  onPatient: (id: string) => void;
  lit: string[];
  fed: Map<string, string[]>;
}) {
  const visits = [...patient.visits].reverse();
  const [query, setQuery] = useState('');
  useEffect(() => setQuery(''), [patient.id]);
  const q = query.trim().toLowerCase();
  const shown = visits
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => !q || [fmtDate(v.date), v.date, v.reason, v.note].some((t) => t.toLowerCase().includes(q)));
  return (
    <section className="ehr" aria-label="Your existing record system (example)">
      <div className="ehr-bar">
        <b>Patient record system</b>
        <span className="grey">Today 14 Nov 2026</span>
      </div>
      <div className="ehr-body">
        <nav className="ehr-list" aria-label="Today's patients">
          {patients.map((p) => (
            <button key={p.id} aria-current={p.id === patient.id} onClick={() => onPatient(p.id)}>
              <span>{p.name}</span>
              <small>
                {p.id} · {p.age} · {p.visits.at(-1)?.reason}
              </small>
            </button>
          ))}
        </nav>
        <div className="ehr-chart">
          <section className="ehr-info" aria-labelledby="ehr-info-h">
            <h2 id="ehr-info-h">Patient Information</h2>
            <table>
              <tbody>
                <tr><th scope="row">Name</th><td>{patient.name}</td></tr>
                <tr><th scope="row">Patient ID</th><td>{patient.id}</td></tr>
                <tr><th scope="row">Age</th><td>{patient.age}</td></tr>
                <tr><th scope="row">Sex</th><td>{patient.sex === 'female' ? 'Female' : 'Male'}</td></tr>
              </tbody>
            </table>
          </section>
          <section className="ehr-history" aria-labelledby="ehr-history-h">
            <div className="ehr-history-head">
              <h2 id="ehr-history-h">Visit history</h2>
              <input
                type="search"
                className="input ehr-search"
                placeholder="Search date or keyword"
                aria-label="Search visits by date or keyword"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="ehr-tl-box">
              {shown.length === 0 ? (
                <p className="ehr-empty">No visits match “{query}”.</p>
              ) : (
                <ol className="ehr-tl">
                  {shown.map(({ v, i }) => (
                    <li key={v.id} className={i === 0 ? 'today' : undefined}>
                      <article id={`visit-${v.id}`} className={`ehr-visit${i === 0 ? ' today' : ''}${lit.includes(v.id) ? ' lit' : ''}`}>
                        <header>
                          {fmtDate(v.date)}
                          <span>{i === 0 ? 'Open visit' : 'Visit'}</span>
                          <span>{v.reason}</span>
                        </header>
                        {fed.has(v.id) && (
                          <span className="fed">
                            <Mark size={12} /> Read by Vitruvian: {fed.get(v.id)!.join(', ')}
                          </span>
                        )}
                        <More key={`${patient.id}-${v.id}`} defaultOpen={i === 0}>{v.note}</More>
                      </article>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

/* ---------- Step 1: patient view with the Repeat visit flag ---------- */

function PatientStep({ patient, aid, onFill, filled, onNext }: { patient: Patient; aid?: AidResult; onFill: () => void; filled: boolean; onNext: () => void }) {
  const flag = repeatVisit(patient);
  const today = patient.visits.at(-1)!;
  const ids = new Set(flag?.visitIds);
  return (
    <>
      <div className="section-title">
        <h2>
          {patient.name}, {patient.age}
        </h2>
      </div>
      {flag ? (
        <div className="flag" role="status">
          <h3>
            <Icon name="repeat" />
            Repeat visit: visit {flag.count} for {flag.symptom}
          </h3>
          <More>
            {flag.count} visits for the same symptom in {flag.windowMonths} months. Vitruvian flags 3 or more. The flag is a prompt to look again, not a
            finding.
          </More>
        </div>
      ) : (
        <p className="lede">No Repeat visit: fewer than 3 visits for “{today.symptom}” in 6 months.</p>
      )}
      <div>
        <h3 className="section-title" style={{ fontSize: 'var(--fs-1)', marginBottom: 8 }}>
          Visit history
        </h3>
        <ol className="timeline" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[...patient.visits].reverse().map((v) => (
            <li key={v.id} className={`tl-item${v.id === today.id ? ' today' : ids.has(v.id) ? ' same' : ''}`}>
              <time className="num">{fmtDate(v.date)}</time>
              <i className="tl-mark" aria-hidden />
              <span>{v.reason}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="toolbar">
        {filled ? (
          <button className="btn primary" onClick={onNext}>
            Open the Referral template <Icon name="arrow" />
          </button>
        ) : (
          <button className="btn primary" onClick={onFill} disabled={!aid}>
            <Icon name="doc" />
            {aid ? `Fill the ${cancerName[aid.suspectedCancer]} Referral template` : 'Reading the record…'}
          </button>
        )}
      </div>
      <More className="notice">
        {MOCK_NOTICE.gemma} Nothing is sent until the GP decides.
      </More>
    </>
  );
}

/* ---------- Step 2: Notes to Referral template ---------- */

function TemplateStep({ draft, onChange, onNext }: { draft: Draft; onChange: (key: string, value: string) => void; onNext: () => void }) {
  const t = draft.template;
  const [onlyOpen, setOnlyOpen] = useState(false);
  const stats = useMemo(() => {
    if (!t || !draft.fields) return { req: 0, done: 0, missing: [] as string[] };
    const req = t.fields.filter((f) => f.required);
    const missing = req.filter((f) => !draft.fields?.[f.key]?.value).map((f) => f.key);
    return { req: req.length, done: req.length - missing.length, missing };
  }, [t, draft.fields]);

  if (draft.filling || !t || !draft.fields) {
    return (
      <>
        <div className="section-title">
          <h2>Gemma is reading the notes</h2>
        </div>
        <div className="loading" aria-busy>
          <i />
          <i />
          <i />
        </div>
      </>
    );
  }
  const shown = onlyOpen ? t.fields.filter((f) => stats.missing.includes(f.key)) : t.fields;
  return (
    <>
      <div className="section-title">
        <h2>{t.title}</h2>
      </div>
      <div className="fill-status">
        <span className="progress" aria-hidden>
          {Array.from({ length: stats.req }, (_, i) => (
            <i key={i} className={i < stats.done ? 'on' : ''} />
          ))}
        </span>
        <span className="num" style={{ fontSize: 'var(--fs-1)', fontWeight: 600 }}>
          {stats.done} of {stats.req} required fields filled
        </span>
        {stats.missing.length > 0 && (
          <button className="linkbtn" onClick={() => setOnlyOpen(!onlyOpen)}>
            {onlyOpen ? 'Show all fields' : `Show the ${stats.missing.length} that need you`}
          </button>
        )}
      </div>
      <Source source={t.source} prefix="Template based on" />
      <div className="fields">
        {shown.map((f) => (
          <FieldInput key={f.key} field={f} value={draft.fields?.[f.key]} onChange={(v) => onChange(f.key, v)} />
        ))}
      </div>
      <div className="toolbar">
        <button className="btn primary" onClick={onNext}>
          Check with the Aid <Icon name="arrow" />
        </button>
      </div>
    </>
  );
}

/* ---------- Step 3: Aid and GP decision ---------- */

function AidStep({
  patient,
  draft,
  onDecide,
  onFixFields,
  onOpenDesk,
  onLight,
}: {
  patient: Patient;
  draft: Draft;
  onLight: (visitIds: string[]) => void;
  onDecide: (d: GpDecision) => void;
  onFixFields: () => void;
  onOpenDesk: (id: string) => void;
}) {
  const aid = draft.aid!;
  const sev = aid.severity;
  const band = sev.ageBands?.find((b) => b.sex === patient.sex && patient.age >= b.min && patient.age <= b.max);
  const flag = repeatVisit(patient);
  const missing = draft.template?.fields.filter((f) => f.required && !draft.fields?.[f.key]?.value) ?? [];
  const canRefer = missing.length === 0;
  return (
    <>
      <div className="aid-tiles">
        <div className="tile">
          <h3>Suspected cancer type</h3>
          <div className="big">{cancerName[aid.suspectedCancer]}</div>
        </div>
        <div className="tile">
          <h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Risk gradient <span className="tag ai">AI estimate</span>
          </h3>
          <div className="big">
            {aid.riskGradient}
            <small> / 10</small>
          </div>
          <div className="meter" aria-label={`Risk gradient ${aid.riskGradient} of 10, AI estimate`}>
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} className={i < aid.riskGradient ? 'on' : ''} />
            ))}
          </div>
          <More>
            {aid.riskReason} {MOCK_NOTICE.gradient}
          </More>
        </div>
        <div className="tile">
          <h3>Severity</h3>
          <div className="big">
            {sev.fiveYearSurvivalPct === null ? 'Pending' : `${sev.fiveYearSurvivalPct}%`}
          </div>
          <More
            extra={
              band && (
                <p className="band">
                  <strong>
                    Age {band.min === 0 ? `under ${band.max + 1}` : `${band.min}–${band.max}`}: {band.pct}%
                  </strong>{' '}
                  {band.sex === 'female' ? 'women' : 'men'}, {band.period}.{' '}
                  {band.source !== sev.source && <Source source={band.source} short />}
                </p>
              )
            }
          >
            5-year survival. {sev.population.split('.')[0]}.
          </More>
          <Source source={sev.source} short />
        </div>
      </div>

      {aid.testNeeded && (
        <div className="gate" role="status">
          <b style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icon name="alert" /> {aid.testNeeded.test} needed before a Referral
          </b>
          <More>
            {aid.testNeeded.why}{aid.testNeeded.threshold && ` Threshold ${aid.testNeeded.threshold}.`}
          </More>
          <Source source={aid.testNeeded.source} />
        </div>
      )}

      <div>
        <h2 className="section-title" style={{ marginBottom: 16 }}>
          Matched Rules <span className="num" style={{ fontSize: 'var(--fs-1)', color: 'var(--muted)' }}>{aid.matchedRules.length}</span>
        </h2>
        <div className="rules">
          {flag && (
            <div className="rule repeat">
              <div className="rule-top">
                <b>Repeat visit</b>
                <span className="rule-id">Vitruvian flag</span>
              </div>
              <p>
                Visit {flag.count} for {flag.symptom} in {flag.windowMonths} months.
              </p>
            </div>
          )}
          {aid.matchedRules.map((m) => (
            <div
              className="rule"
              key={m.rule.id}
              onMouseEnter={() => onLight(m.visits.map((v) => v.visitId))}
              onMouseLeave={() => onLight([])}
            >
              <div className="rule-top">
                <b>{m.rule.text}</b>
                <span className="rule-id">{m.rule.id}</span>
              </div>
              <More
                extra={
                  <ul className="rule-snippets">
                    {m.visits.map((v) => (
                      <li key={v.visitId}>
                        <b>{shortDate(v.date)}</b> “{v.snippet}”
                      </li>
                    ))}
                  </ul>
                }
              >
                Because: {m.because}
              </More>
              <ul className="rule-visits" aria-label={`Visits that back ${m.rule.id}`}>
                {m.visits.map((v) => (
                  <li key={v.visitId}>
                    <button
                      type="button"
                      title={v.snippet}
                      onFocus={() => onLight([v.visitId])}
                      onBlur={() => onLight([])}
                      onClick={() => document.getElementById(`visit-${v.visitId}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
                    >
                      {shortDate(v.date)}
                    </button>
                  </li>
                ))}
              </ul>
              <Source source={m.rule.source} />
            </div>
          ))}
          {aid.matchedRules.length === 0 && <p className="lede">No Rule matched the notes. The GP can still refer.</p>}
        </div>
      </div>

      {draft.sent ? (
        <div className="done-note" role="status">
          <b style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icon name="check" /> {draft.sent.urgency === 'urgent' ? 'Urgent' : 'Routine'} Referral sent to the Referral desk
          </b>
          <div>
            <button className="btn primary small" onClick={() => onOpenDesk(draft.sent!.id)}>
              See it as the Referral desk sees it <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="decide">
          <h3>GP decides</h3>
          {!canRefer && (
            <p style={{ fontSize: 'var(--fs-1)' }}>
              {missing.length} required field{missing.length === 1 ? '' : 's'} still empty.{' '}
              <button className="linkbtn" onClick={onFixFields}>
                Fill {missing.length === 1 ? 'it' : 'them'} in the Referral template
              </button>
            </p>
          )}
          <div className="row">
            <button className="btn urgent" disabled={!canRefer} onClick={() => onDecide('refer-urgent')}>
              <Icon name="send" /> Refer urgently
            </button>
            {aid.testNeeded && (
              <button className="btn" aria-pressed={draft.decision === 'order-test'} onClick={() => onDecide('order-test')}>
                Order {aid.testNeeded.test.replace(/^Urgent u/, 'urgent u')} first
              </button>
            )}
            <button className="btn" disabled={!canRefer} onClick={() => onDecide('refer-routine')}>
              Refer routine
            </button>
            <button className="btn" aria-pressed={draft.decision === 'not-now'} onClick={() => onDecide('not-now')}>
              Not now
            </button>
          </div>
          {draft.decision === 'order-test' && <p style={{ fontSize: 'var(--fs-1)' }}>Noted. Order {aid.testNeeded?.test.replace(/^Urgent u/, 'urgent u')} in the record system; Vitruvian checks again when the result is in.</p>}
          {draft.decision === 'not-now' && <p style={{ fontSize: 'var(--fs-1)' }}>Noted. No Referral sent. The Repeat visit flag stays on the record.</p>}
        </div>
      )}
    </>
  );
}
