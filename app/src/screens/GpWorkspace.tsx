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
  embeddinggemma: 'EmbeddingGemma',
  'symptom-match': 'Symptom match',
  stub: 'No model',
  mock: 'No model',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;

type Urgency = 'urgent' | 'routine';

/** Per-patient state. The note is the GP's; Save stores it and Vitruvian checks it in the background (Michal, 15 Nov). */
interface Draft {
  note: string;
  /** the note text as last saved */
  saved?: string;
  checking: boolean;
  /** GP reopened a saved note */
  editing?: boolean;
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
  const [query, setQuery] = useState('');
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    noteRef.current?.focus();
    setLit([]);
  }, [patient.id]);
  useEffect(() => {
    if (draft.editing) noteRef.current?.focus();
  }, [draft.editing]);

  // Small pop-up after a background check, only when a Rule matched.
  const [toast, setToast] = useState<{ id: string; text: string }>();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(undefined), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  async function save() {
    const id = patient.id;
    const name = patient.name;
    if (!draft.note.trim() || draft.checking) return;
    update(id, { saved: draft.note, checking: true, editing: false });
    const aid = await getAid(id);
    const template = await getReferralTemplate(aid.suspectedCancer);
    update(id, { aid, template, checking: false });
    if (!aid.noRuleMatched) setToast({ id, text: `${name}: ${cancerName[aid.suspectedCancer]} Rule matched. See the Vitruvian card.` });
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
  const q = query.trim().toLowerCase();
  const shown = q ? patients.filter((p) => `${p.name} ${p.id} ${p.visits.at(-1)?.reason ?? ''}`.toLowerCase().includes(q)) : patients;
  // After Save the note folds into a read-only box; the analysis shows on the right (Michal, 15 Nov).
  const collapsed = draft.saved !== undefined && draft.saved === draft.note && !draft.editing;
  const status = draft.checking
    ? 'Saved. Vitruvian is checking…'
    : draft.saved === undefined
      ? 'Ctrl + Enter to save'
      : draft.saved === draft.note
        ? 'Saved'
        : 'Not saved yet';

  return (
    <div className="nf">
      <nav className="nf-list" aria-label="Today's patients">
        <input
          type="search"
          className="nf-search"
          placeholder="Search patients"
          aria-label="Search patients"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {shown.length === 0 && <p className="nf-list-none">No patient matches.</p>}
        {shown.map((p) => (
          <button key={p.id} aria-current={p.id === patient.id} onClick={() => onPatient(p.id)}>
            <span>{p.name}</span>
            <small>{p.visits.at(-1)?.reason}</small>
          </button>
        ))}
      </nav>

      <section className="nf-main" aria-label="Today's visit">
        <table className="nf-who">
          <thead>
            <tr>
              <th scope="col">Patient</th>
              <th scope="col">ID</th>
              <th scope="col">Age</th>
              <th scope="col">Sex</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>{patient.name}</b>
              </td>
              <td className="num">{patient.id}</td>
              <td className="num">{patient.age}</td>
              <td>{patient.sex === 'female' ? 'Female' : 'Male'}</td>
            </tr>
          </tbody>
        </table>

        <ol className="nf-tl" aria-label="Visits, newest first">
          <li className="nf-tl-today">
            {collapsed ? (
              <div className="nf-note nf-note-saved">
                <p className="nf-note-label">
                  Today <span className="num">· {fmtDate(today.date)}</span>
                </p>
                <p className="nf-note-text">{draft.note}</p>
                <div className="nf-note-foot">
                  <small role="status">{status}</small>
                  <button className="btn small" type="button" onClick={() => update(patient.id, { editing: true })}>
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="nf-note"
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
              >
                <label htmlFor="nf-note-text">
                  Today <span className="num">· {fmtDate(today.date)}</span>
                </label>
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
                      save();
                    }
                  }}
                />
                <div className="nf-note-foot">
                  <small role="status">{status}</small>
                  <button className="btn primary" type="submit" disabled={draft.checking || !draft.note.trim() || draft.saved === draft.note}>
                    Save
                  </button>
                </div>
              </form>
            )}
          </li>
          {earlier.map((v) => (
            <li key={v.id} id={`visit-${v.id}`} className={lit.includes(v.id) ? 'lit' : undefined}>
              <More key={`${patient.id}-${v.id}`} extra={<p className="nf-hist-note">{v.note}</p>}>
                <time className="num">{fmtDate(v.date)}</time> {v.reason}
              </More>
            </li>
          ))}
        </ol>
      </section>

      <Pointer
        patient={patient}
        draft={draft}
        onLight={setLit}
        onStart={startReferral}
        onDecide={(decision) => update(patient.id, { decision })}
      />

      {toast && !draft.sheet && (
        <button
          className="nf-toast"
          role="status"
          onClick={() => {
            onPatient(toast.id);
            setToast(undefined);
          }}
        >
          <Mark size={16} /> {toast.text}
        </button>
      )}

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
    <aside className={`nf-ptr${draft.checking ? ' checking' : ''}`} aria-label="Vitruvian" aria-live="polite">
      <header>
        <Mark size={22} /> <span className="wordmark">Vitruvian</span>
      </header>
      {!aid ? (
        draft.checking ? (
          <div className="nf-ptr-wait">
            <p className="muted">Checking the note and earlier visits…</p>
            <i />
            <i />
            <i />
          </div>
        ) : (
          <p className="muted">Save the note. Vitruvian checks it in the background.</p>
        )
      ) : (
        <>
          <p className="nf-ptr-head">
            <b className="nf-ptr-cancer">{aid.noRuleMatched ? 'No cancer Rule matched' : cancerName[aid.suspectedCancer]}</b>
            {!aid.noRuleMatched && <span className="nf-ptr-label">Suspected cancer type</span>}
          </p>
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
          <p className="nf-ptr-reason">{aid.riskReason}</p>
          {aid.publishedRisk && (
            <div className="nf-ptr-ppv">
              <p className="nf-ppv-row">
                <span className="muted">Published risk</span>
                <b className="num">
                  {Math.round(aid.publishedRisk.pct * 10) / 10}%{aid.publishedRisk.isLowerBound ? ' or more' : ''}
                </b>
              </p>
              <p className="nf-ppv-row">
                {aid.publishedRisk.aboveNg12Threshold && <span className="tag">Above NG12 3%</span>}
                <Source
                  short
                  source={{ label: aid.publishedRisk.sourceLabel, short: aid.publishedRisk.sourceLabel.split(',')[0], url: aid.publishedRisk.sourceUrl }}
                />
              </p>
              <p className="muted nf-ppv-note">UK primary-care aggregate figure, not a personal probability. Matched by AI.</p>
            </div>
          )}

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
      {aid.riskEvidence && aid.riskEvidence.length > 0 && (
        <div className="nf-why-item">
          <p>Risk gradient read these words in the notes:</p>
          <ul className="nf-evidence">
            {aid.riskEvidence.map((e) => (
              <li key={e}>
                <mark>{e}</mark>
              </li>
            ))}
          </ul>
        </div>
      )}
      {aid.publishedRisk && (
        <div className="nf-why-item">
          <p>Published risk: {aid.publishedRisk.because}</p>
          {(aid.publishedRisk.studyPopulation || aid.publishedRisk.quote) && (
            <p className="muted">
              {aid.publishedRisk.studyPopulation}
              {aid.publishedRisk.quote && <> “{aid.publishedRisk.quote}”</>}
            </p>
          )}
        </div>
      )}
      {aid.riskModelPointer && (
        <p className="nf-why-item muted">
          The risk model guessed {aid.riskModelPointer === 'none' ? 'no cancer' : cancerName[aid.riskModelPointer]}. A note only: the Rules decide.
        </p>
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
              {techStep[t.step]}: {t.detail ? "AI" : techProvider[t.provider]}
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
