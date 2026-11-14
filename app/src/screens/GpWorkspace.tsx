import { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_NOTICE, fillTemplateFromNote, getAid, getReferralTemplate, repeatVisit, sendReferral } from '../data/api';
import type { AidResult, TechUsed, FieldValues, GpDecision, Patient, Referral, ReferralTemplate } from '../data/types';
import { FieldInput } from '../components/FieldInput';
import { Icon, Mark } from '../components/Icon';
import { More } from '../components/More';
import { Source } from '../components/Source';
import { cancerName, fmtDate } from '../components/labels';

const techStep: Record<TechUsed['step'], string> = { facts: 'Facts', decisions: 'Decisions', risk: 'Risk', repeat: 'Repeat visit', fill: 'Fill' };
const techProvider: Record<TechUsed['provider'], string> = {
  gemma: 'Gemma',
  'modal-lora': 'Gemma on Modal',
  gemini: 'Gemini',
  'convex-vector': 'Vector search',
  'symptom-match': 'Symptom match',
  stub: 'No model',
  mock: 'No model',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;

type Urgency = 'urgent' | 'routine';

/** Per-patient state. The note is the GP's; the Aid runs only when the GP clicks Check note. */
interface Draft {
  note: string;
  checking: boolean;
  aid?: AidResult;
  template?: ReferralTemplate;
  fields?: FieldValues;
  filling: boolean;
  sheet?: Urgency;
  decision?: GpDecision;
  sent?: Referral;
}

interface Props {
  patients: Patient[];
  patientId: string;
  onPatient: (id: string) => void;
}

/* Note-first GP screen (Michal, 14 Nov): the note is the main thing; Vitruvian is one small pointer card. */
export function GpWorkspace({ patients, patientId, onPatient }: Props) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const patient = patients.find((p) => p.id === patientId) ?? patients[0];
  const today = patient.visits.at(-1)!;
  const draft: Draft = drafts[patient.id] ?? { note: today.note, checking: false, filling: false };
  const update = (id: string, d: Partial<Draft>) =>
    setDrafts((all) => {
      const p = patients.find((x) => x.id === id)!;
      return { ...all, [id]: { ...(all[id] ?? { note: p.visits.at(-1)!.note, checking: false, filling: false }), ...d } };
    });
  // Visits lit in the history while the GP points at a matched Rule.
  const [lit, setLit] = useState<string[]>([]);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    noteRef.current?.focus();
    setLit([]);
  }, [patient.id]);

  async function check() {
    const id = patient.id;
    update(id, { checking: true });
    const aid = await getAid(id);
    const template = await getReferralTemplate(aid.suspectedCancer);
    update(id, { aid, template, checking: false });
  }

  async function startReferral(urgency: Urgency) {
    const id = patient.id;
    update(id, { sheet: urgency });
    if (draft.fields || !draft.aid) return;
    update(id, { filling: true });
    const fields = { ...(await fillTemplateFromNote(id, draft.aid.suspectedCancer, draft.aid.matchedRules)) };
    // Nothing in the notes about other illnesses: suggest "None known" so the GP can send in one click. Still editable.
    if (!fields.otherIllnesses?.value) fields.otherIllnesses = { value: 'None known', origin: 'gemma' };
    update(id, { fields, filling: false });
  }

  async function send() {
    const aid = draft.aid!;
    const urgency = draft.sheet ?? 'urgent';
    const r = await sendReferral({
      id: `REF-${patient.id}`,
      patientId: patient.id,
      cancer: aid.suspectedCancer,
      urgency,
      decidedBy: 'GP',
      decidedAt: new Date().toISOString(),
      fields: draft.fields ?? {},
      matchedRules: aid.matchedRules,
      riskGradient: aid.riskGradient,
      severity: aid.severity,
      repeatVisit: repeatVisit(patient),
    });
    update(patient.id, { sent: r, decision: urgency === 'urgent' ? 'refer-urgent' : 'refer-routine', sheet: undefined });
  }

  const earlier = [...patient.visits].slice(0, -1).reverse();

  return (
    <div className="nf">
      <nav className="nf-list" aria-label="Today's patients">
        {patients.map((p) => (
          <button key={p.id} aria-current={p.id === patient.id} onClick={() => onPatient(p.id)}>
            <span>{p.name}</span>
            <small>{p.visits.at(-1)?.reason}</small>
          </button>
        ))}
      </nav>

      <section className="nf-main" aria-label="Today's visit">
        <p className="nf-who">
          <b>{patient.name}</b>
          <span>
            {patient.id} · {patient.age} · {patient.sex === 'female' ? 'Female' : 'Male'} · {fmtDate(today.date)}
          </span>
        </p>
        <form
          className="nf-note"
          onSubmit={(e) => {
            e.preventDefault();
            check();
          }}
        >
          <label htmlFor="nf-note-text">Today's note</label>
          <textarea
            id="nf-note-text"
            ref={noteRef}
            className="input"
            placeholder="Symptoms, findings, plan"
            value={draft.note}
            onChange={(e) => update(patient.id, { note: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                check();
              }
            }}
          />
          <div className="nf-note-foot">
            <small>Ctrl + Enter to check</small>
            <button className="btn primary" type="submit" disabled={draft.checking || !draft.note.trim()}>
              <Mark size={14} /> {draft.checking ? 'Checking…' : 'Check note'}
            </button>
          </div>
        </form>
        <section className="nf-hist" aria-labelledby="nf-hist-h">
          <h2 id="nf-hist-h">Earlier visits</h2>
          {earlier.length === 0 && <p className="muted">No earlier visits.</p>}
          <ol>
            {earlier.map((v) => (
              <li key={v.id} id={`visit-${v.id}`} className={lit.includes(v.id) ? 'lit' : undefined}>
                <More key={`${patient.id}-${v.id}`} extra={<p className="nf-hist-note">{v.note}</p>}>
                  <time className="num">{fmtDate(v.date)}</time> {v.reason}
                </More>
              </li>
            ))}
          </ol>
        </section>
      </section>

      <Pointer
        patient={patient}
        draft={draft}
        onLight={setLit}
        onStart={startReferral}
        onDecide={(decision) => update(patient.id, { decision })}
      />

      {draft.sheet && draft.aid && (
        <ReferralSheet
          draft={draft}
          urgency={draft.sheet}
          onUrgency={(u) => update(patient.id, { sheet: u })}
          onChange={(key, value) => update(patient.id, { fields: { ...draft.fields, [key]: { ...draft.fields?.[key], value, origin: 'gp' } } })}
          onClose={() => update(patient.id, { sheet: undefined })}
          onSend={send}
        />
      )}
    </div>
  );
}

/* ---------- The Vitruvian pointer card ---------- */

function Pointer({
  patient,
  draft,
  onLight,
  onStart,
  onDecide,
}: {
  patient: Patient;
  draft: Draft;
  onLight: (ids: string[]) => void;
  onStart: (u: Urgency) => void;
  onDecide: (d: GpDecision) => void;
}) {
  const [why, setWhy] = useState(false);
  useEffect(() => setWhy(false), [patient.id]);
  const aid = draft.aid;

  return (
    <aside className="nf-ptr" aria-label="Vitruvian" aria-live="polite">
      <header>
        <Mark size={16} /> <span className="wordmark">Vitruvian</span>
      </header>
      {!aid ? (
        <p className="muted">{draft.checking ? 'Reading the note and earlier visits…' : 'Write the note, then click Check note.'}</p>
      ) : (
        <>
          <span className="nf-ptr-label">Points to</span>
          <b className="nf-ptr-cancer">{aid.noRuleMatched ? 'No cancer Rule matched' : cancerName[aid.suspectedCancer]}</b>
          <div className="nf-ptr-risk">
            <div className="meter" aria-label={`Risk gradient ${aid.riskGradient} of 10, AI estimate, not validated`}>
              {Array.from({ length: 10 }, (_, i) => (
                <i key={i} className={i < aid.riskGradient ? 'on' : ''} />
              ))}
            </div>
            <span className="num">
              <b>{aid.riskGradient}</b> / 10
            </span>
            <span className="tag ai">AI estimate, not validated</span>
          </div>
          <More>{aid.riskReason}</More>

          {aid.testNeeded && !draft.sent && (
            <p className="nf-ptr-gate">
              <Icon name="alert" /> {aid.testNeeded.test} needed before a Referral
            </p>
          )}

          {draft.sent ? (
            <p className="nf-ptr-done" role="status">
              <Icon name="check" /> {draft.sent.urgency === 'urgent' ? 'Urgent' : 'Routine'} Referral sent to the Referral desk
            </p>
          ) : (
            <div className="nf-ptr-decide" role="group" aria-label="GP decides">
              <button className="btn urgent" onClick={() => onStart('urgent')}>
                <Icon name="send" /> Start urgent referral
              </button>
              <div className="row">
                <button className="btn small" onClick={() => onStart('routine')}>
                  Routine
                </button>
                {aid.testNeeded && (
                  <button className="btn small" aria-pressed={draft.decision === 'order-test'} onClick={() => onDecide('order-test')}>
                    Order {aid.testNeeded.test.replace(/^Urgent u/, 'u')} first
                  </button>
                )}
                <button className="btn small" aria-pressed={draft.decision === 'not-now'} onClick={() => onDecide('not-now')}>
                  Not now
                </button>
              </div>
              {draft.decision === 'order-test' && <p className="muted">Noted. Vitruvian checks again when the result is in.</p>}
              {draft.decision === 'not-now' && <p className="muted">Noted. No Referral sent.</p>}
            </div>
          )}

          <button className="linkbtn nf-why-btn" aria-expanded={why} onClick={() => setWhy(!why)}>
            Why? <Icon name={why ? 'up' : 'down'} size={14} />
          </button>
          {why && <Why patient={patient} aid={aid} onLight={onLight} />}
        </>
      )}
    </aside>
  );
}

function Why({ patient, aid, onLight }: { patient: Patient; aid: AidResult; onLight: (ids: string[]) => void }) {
  const sev = aid.severity;
  const band = sev.ageBands?.find((b) => b.sex === patient.sex && patient.age >= b.min && patient.age <= b.max);
  const flag = repeatVisit(patient);
  return (
    <div className="nf-why">
      {flag && (
        <p className="nf-why-flag">
          <Icon name="repeat" /> Repeat visit: visit {flag.count} for {flag.symptom} in {flag.windowMonths} months.
        </p>
      )}
      {aid.testNeeded && (
        <div className="nf-why-item">
          <More>
            {aid.testNeeded.why}
            {aid.testNeeded.threshold && ` Threshold ${aid.testNeeded.threshold}.`}
          </More>
          <Source source={aid.testNeeded.source} />
        </div>
      )}
      <h3>Matched Rules · {aid.matchedRules.length}</h3>
      {aid.matchedRules.length === 0 && <p className="muted">No Rule matched the notes. The GP can still refer.</p>}
      {aid.matchedRules.map((m) => (
        <div className="nf-why-item" key={m.rule.id} onMouseEnter={() => onLight(m.visits.map((v) => v.visitId))} onMouseLeave={() => onLight([])}>
          <p>
            <b>{m.rule.text}</b> <span className="rule-id">{m.rule.id}</span>
          </p>
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
          <Source source={m.rule.source} />
        </div>
      ))}
      <h3>Severity</h3>
      <div className="nf-why-item">
        <p>
          <b>{sev.fiveYearSurvivalPct === null ? 'Pending' : `${sev.fiveYearSurvivalPct}%`}</b> 5-year survival. {sev.population.split('.')[0]}.
        </p>
        {band && (
          <p>
            Age {band.min === 0 ? `under ${band.max + 1}` : `${band.min}–${band.max}`}: {band.pct}% {band.sex === 'female' ? 'women' : 'men'}, {band.period}.{' '}
            {band.source !== sev.source && <Source source={band.source} short />}
          </p>
        )}
        <Source source={sev.source} short />
      </div>
      {aid.techUsed && aid.techUsed.length > 0 && (
        <ul className="tech-used" aria-label="Tech used">
          {aid.techUsed.map((t) => (
            <li key={t.step} className={`tag ${t.provider === 'stub' || t.provider === 'mock' ? 'record' : 'gemma'}`}>
              {techStep[t.step]}: {techProvider[t.provider]}
            </li>
          ))}
        </ul>
      )}
      <More className="notice">
        {MOCK_NOTICE.gemma} {MOCK_NOTICE.gradient} Nothing is sent until the GP decides.
      </More>
    </div>
  );
}

/* ---------- The Referral sheet: opens only on Start referral ---------- */

function ReferralSheet({
  draft,
  urgency,
  onUrgency,
  onChange,
  onClose,
  onSend,
}: {
  draft: Draft;
  urgency: Urgency;
  onUrgency: (u: Urgency) => void;
  onChange: (key: string, value: string) => void;
  onClose: () => void;
  onSend: () => void;
}) {
  const t = draft.template;
  const missing = useMemo(() => t?.fields.filter((f) => f.required && !draft.fields?.[f.key]?.value) ?? [], [t, draft.fields]);
  const req = t?.fields.filter((f) => f.required).length ?? 0;
  const ready = !draft.filling && !!draft.fields && missing.length === 0;
  // Empty required fields go first, in the order they had when the fill landed, so a field does not jump once the GP fills it.
  const filled = !!draft.fields;
  const order = useMemo(() => {
    if (!t) return [];
    const empty = new Set(t.fields.filter((f) => f.required && !draft.fields?.[f.key]?.value).map((f) => f.key));
    return [...t.fields.filter((f) => empty.has(f.key)), ...t.fields.filter((f) => !empty.has(f.key))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, filled]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="nf-sheet-wrap" onClick={onClose}>
      <section className="nf-sheet" role="dialog" aria-modal="true" aria-labelledby="nf-sheet-h" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2 id="nf-sheet-h">{t?.title ?? 'Referral template'}</h2>
          <button className="btn small" onClick={onClose} aria-label="Close the Referral">
            Close
          </button>
        </header>
        {draft.filling || !draft.fields || !t ? (
          <div className="loading" aria-busy>
            <i />
            <i />
            <i />
          </div>
        ) : (
          <div className="nf-sheet-body">
            <p className="nf-sheet-status">
              <span className="num">
                {req - missing.length} of {req}
              </span>{' '}
              required fields filled from the notes.{missing.length > 0 && <b> {missing.length} still empty.</b>}
            </p>
            <Source source={t.source} prefix="Template based on" />
            <div className="fields">
              {order.map((f) => (
                <FieldInput key={f.key} field={f} value={draft.fields?.[f.key]} onChange={(v) => onChange(f.key, v)} />
              ))}
            </div>
          </div>
        )}
        <footer>
          <div className="row" role="radiogroup" aria-label="Urgency">
            {(['urgent', 'routine'] as const).map((u) => (
              <button key={u} role="radio" aria-checked={urgency === u} aria-pressed={urgency === u} className="btn small" onClick={() => onUrgency(u)}>
                {u === 'urgent' ? 'Urgent' : 'Routine'}
              </button>
            ))}
          </div>
          <button className={`btn ${urgency === 'urgent' ? 'urgent' : 'primary'}`} disabled={!ready} onClick={onSend}>
            <Icon name="send" /> Send {urgency} Referral
          </button>
        </footer>
      </section>
    </div>
  );
}
