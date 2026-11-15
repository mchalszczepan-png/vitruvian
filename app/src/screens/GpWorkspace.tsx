import { useEffect, useMemo, useState } from 'react';
import { MOCK_NOTICE, fillTemplateFromNote, getAid, getReferralTemplate, repeatVisit, sendReferral } from '../data/api';
import type { AidResult, TechUsed, FieldValues, GpDecision, Patient, Referral, ReferralTemplate } from '../data/types';
import { FieldInput } from '../components/FieldInput';
import { Icon, Mark } from '../components/Icon';
import { More } from '../components/More';
import { FoldedNote, NoteText } from '../components/NoteText';
import { continueList } from '../components/noteList';
import { Source } from '../components/Source';
import { cancerName, fmtDate } from '../components/labels';
import { getLang, useT } from '../components/lang';

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
const shortDate = (iso: string) =>
  getLang() === 'fi' ? `${Number(iso.slice(8, 10))}.${Number(iso.slice(5, 7))}.` : `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;

type Urgency = 'urgent' | 'routine';

/** Per-patient state. The note is the GP's; Save stores it and Vitruvian checks it in the background (Michal, 15 Nov). */
/** One of today's notes. The GP can add more, each with its own text (Michal, 15 Nov). */
interface TodayNote {
  id: string;
  text: string;
  /** text before this edit: the prefilled note, or empty for an added one */
  orig?: string;
  /** the text as last saved */
  saved?: string;
  /** GP reopened a saved note */
  editing?: boolean;
  /** folded to one line */
  furled?: boolean;
}

interface Draft {
  /** today's notes, newest first */
  notes: TodayNote[];
  checking: boolean;
  /** the note whose save started the current check */
  checkingNote?: string;
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
  const t = useT();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const patient = patients.find((p) => p.id === patientId) ?? patients[0];
  const today = patient.visits.at(-1)!;
  const fresh = (p: Patient): Draft => ({ notes: [{ id: 'n1', text: p.visits.at(-1)!.note, orig: p.visits.at(-1)!.note }], checking: false, filling: false });
  const draft: Draft = drafts[patient.id] ?? fresh(patient);
  const update = (id: string, d: Partial<Draft> | ((cur: Draft) => Partial<Draft>)) =>
    setDrafts((all) => {
      const cur = all[id] ?? fresh(patients.find((x) => x.id === id)!);
      return { ...all, [id]: { ...cur, ...(typeof d === 'function' ? d(cur) : d) } };
    });
  const setNote = (noteId: string, d: Partial<TodayNote>, id = patient.id) =>
    update(id, (cur) => ({ notes: cur.notes.map((n) => (n.id === noteId ? { ...n, ...d } : n)) }));
  // Only one blank note at a time.
  const hasBlank = draft.notes.some((n) => !n.text.trim() && n.saved === undefined);
  function addNote() {
    update(patient.id, (cur) => ({ notes: [{ id: `n${Date.now()}`, text: '' }, ...cur.notes.map((n) => ({ ...n, furled: true }))] }));
  }
  // Delete asks once: the bin turns into a "Delete note?" button (Michal, 15 Nov).
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const removeNote = (noteId: string) => {
    setConfirmDel(null);
    update(patient.id, (cur) => {
      const notes = cur.notes.filter((n) => n.id !== noteId);
      // The last note left opens again.
      return { notes: notes.length === 1 ? [{ ...notes[0], furled: false }] : notes };
    });
  };
  // Cancel drops this edit: back to the saved text, or the note goes if it was a new blank one.
  const cancelNote = (n: TodayNote) => {
    const base = n.saved ?? n.orig ?? '';
    if (!base.trim() && draft.notes.length > 1) removeNote(n.id);
    else setNote(n.id, { text: base, editing: false });
  };
  const noteStatus = (n: TodayNote) =>
    t(
      draft.checking && draft.checkingNote === n.id
        ? 'Saved. Vitruvian is checking…'
        : n.saved === undefined
          ? 'Ctrl + Enter to save'
          : n.saved === n.text
            ? 'Saved'
            : 'Not saved yet',
    );
  // Visits lit in the history while the GP points at a matched Rule.
  const [lit, setLit] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => {
    document.querySelector<HTMLTextAreaElement>('.nf-tl-today textarea')?.focus();
    setLit([]);
  }, [patient.id]);

  // Small pop-up after a background check, only when a Rule matched.
  const [toast, setToast] = useState<{ id: string; text: string }>();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(undefined), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  async function save(noteId: string) {
    const id = patient.id;
    const name = patient.name;
    const n = draft.notes.find((x) => x.id === noteId);
    if (!n?.text.trim() || draft.checking) return;
    setNote(noteId, { saved: n.text, editing: false });
    update(id, { checking: true, checkingNote: noteId });
    const aid = await getAid(id);
    const template = await getReferralTemplate(aid.suspectedCancer);
    update(id, { aid, template, checking: false });
    if (!aid.noRuleMatched) setToast({ id, text: t('{name}: {cancer} Rule matched. See the Vitruvian card.', { name, cancer: cancerName[aid.suspectedCancer] }) });
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
  return (
    <div className="nf">
      <nav className="nf-list" aria-label={t("Today's patients")}>
        <div className="nf-search-wrap">
          <Icon name="search" size={16} />
          <input
            type="search"
            className="nf-search"
            placeholder={t('Search patients')}
            aria-label={t('Search patients')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {shown.length === 0 && <p className="nf-list-none">{t('No patient matches.')}</p>}
        {shown.map((p) => (
          <button key={p.id} aria-current={p.id === patient.id} onClick={() => onPatient(p.id)}>
            <span>{p.name}</span>
            <small>{p.visits.at(-1)?.reason}</small>
          </button>
        ))}
      </nav>

      <section className="nf-main" aria-label={t("Today's visit")}>
        <table className="nf-who">
          <thead>
            <tr>
              <th scope="col">{t('Patient')}</th>
              <th scope="col">{t('ID')}</th>
              <th scope="col">{t('Age')}</th>
              <th scope="col">{t('Sex')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>{patient.name}</b>
              </td>
              <td className="num">{patient.id}</td>
              <td className="num">{patient.age}</td>
              <td>{t(patient.sex === 'female' ? 'Female' : 'Male')}</td>
            </tr>
          </tbody>
        </table>

        <button className="btn small nf-add" type="button" disabled={hasBlank} onClick={addNote}>
          <Icon name="plus" size={16} /> {t('Add note')}
        </button>
        <ol className="nf-tl" aria-label={t('Visits, newest first')}>
          {draft.notes.map((n, i) => {
            const label = (
              <>
                {t('Today')} <span className="num">· {fmtDate(today.date)}</span>
                {draft.notes.length > 1 && <span className="num"> · {t('Note {n}', { n: draft.notes.length - i })}</span>}
              </>
            );
            const status = noteStatus(n);
            if (n.furled)
              return (
                <li key={n.id} className="nf-tl-today">
                  <button type="button" className="nf-note nf-note-furled" aria-expanded={false} onClick={() => setNote(n.id, { furled: false })}>
                    <span className="nf-note-label">{label}</span>
                    <span className="nf-note-peek">{n.text.trim() ? n.text.trim().split('\n')[0] : t('Empty note')}</span>
                    <small>{status}</small>
                    <Icon name="down" size={16} />
                  </button>
                </li>
              );
            const furl = (
              <span className="nf-note-tools">
                {draft.notes.length > 1 &&
                  (confirmDel === n.id ? (
                    // eslint-disable-next-line jsx-a11y/no-autofocus -- the confirm takes over the bin's focus
                    <button type="button" className="btn small danger" autoFocus onBlur={() => setConfirmDel(null)} onClick={() => removeNote(n.id)}>
                      {t('Delete note?')}
                    </button>
                  ) : (
                    <button type="button" className="icon-btn" aria-label={t('Delete note')} title={t('Delete note')} onClick={() => setConfirmDel(n.id)}>
                      <Icon name="trash" size={16} />
                    </button>
                  ))}
                <button type="button" className="icon-btn" aria-expanded aria-label={t('Fold note')} title={t('Fold note')} onClick={() => setNote(n.id, { furled: true })}>
                  <Icon name="up" size={16} />
                </button>
              </span>
            );
            return (
              <li key={n.id} className="nf-tl-today">
                {n.saved !== undefined && n.saved === n.text && !n.editing ? (
                  <div className="nf-note nf-note-saved">
                    <div className="nf-note-head">
                      <p className="nf-note-label">{label}</p>
                      {furl}
                    </div>
                    <FoldedNote key={`${patient.id}-${n.id}`} text={n.text} />
                    <div className="nf-note-foot">
                      <small role="status">{status}</small>
                      <button className="btn small" type="button" onClick={() => setNote(n.id, { editing: true })}>
                        {t('Edit')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    className="nf-note"
                    onSubmit={(e) => {
                      e.preventDefault();
                      save(n.id);
                    }}
                  >
                    <div className="nf-note-head">
                      <label htmlFor={`nf-note-${n.id}`}>{label}</label>
                      {furl}
                    </div>
                    <textarea
                      id={`nf-note-${n.id}`}
                      // eslint-disable-next-line jsx-a11y/no-autofocus -- opens straight into typing after Add note or Edit
                      autoFocus={n.editing || !n.text}
                      className="input"
                      placeholder={t('Symptoms, findings, plan')}
                      value={n.text}
                      onChange={(e) => setNote(n.id, { text: e.target.value })}
                      onKeyDown={(e) => {
                        if (continueList(e, (text) => setNote(n.id, { text }))) return;
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          save(n.id);
                        }
                      }}
                    />
                    <div className="nf-note-foot">
                      <button
                        className="btn"
                        type="button"
                        disabled={n.text === (n.saved ?? n.orig ?? '') && !n.editing && !(draft.notes.length > 1 && !n.text.trim())}
                        onClick={() => cancelNote(n)}
                      >
                        {t('Cancel')}
                      </button>
                      <div className="nf-note-save">
                        <button className="btn primary" type="submit" disabled={draft.checking || !n.text.trim() || n.saved === n.text}>
                          {t('Save')}
                        </button>
                        <small role="status">{status}</small>
                      </div>
                    </div>
                  </form>
                )}
              </li>
            );
          })}
          {earlier.map((v) => (
            <li key={v.id} id={`visit-${v.id}`} className={lit.includes(v.id) ? 'lit' : undefined}>
              <More key={`${patient.id}-${v.id}`} extra={<NoteText className="nf-hist-note" text={v.note} />}>
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
  const t = useT();
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
            <p className="muted">{t('Checking the note and earlier visits…')}</p>
            <i />
            <i />
            <i />
          </div>
        ) : (
          <p className="muted">{t('Save the note. Vitruvian checks it in the background.')}</p>
        )
      ) : (
        <>
          <p className="nf-ptr-head">
            <b className="nf-ptr-cancer">{aid.noRuleMatched ? t('No cancer Rule matched') : cancerName[aid.suspectedCancer]}</b>
            {!aid.noRuleMatched && <span className="nf-ptr-label">{t('Suspected cancer type')}</span>}
          </p>
          <div className="nf-ptr-risk">
            <div className="meter" aria-label={t('Risk gradient {n} of 10, AI estimate, not validated', { n: aid.riskGradient })}>
              {Array.from({ length: 10 }, (_, i) => (
                <i key={i} className={i < aid.riskGradient ? 'on' : ''} />
              ))}
            </div>
            <span className="num">
              <b>{aid.riskGradient}</b> / 10
            </span>
            <span className="tag ai">{t('AI estimate, not validated')}</span>
          </div>
          <p className="nf-ptr-reason">{aid.riskReason}</p>
          {aid.publishedRisk && (
            <details className="nf-ptr-ppv">
              <summary>
                {t('Published risk')} <Icon name="down" size={16} />
              </summary>
              <p className="nf-ppv-row">
                <b className="num">
                  {Math.round(aid.publishedRisk.pct * 10) / 10}%{aid.publishedRisk.isLowerBound ? t(' or more') : ''}
                </b>
                {aid.publishedRisk.aboveNg12Threshold && <span className="tag">{t('Above NG12 3%')}</span>}
              </p>
              <p className="muted">{t("Study figure, not this patient's risk.")}</p>
              <Source
                short
                source={{ label: aid.publishedRisk.sourceLabel, short: aid.publishedRisk.sourceLabel.split(',')[0], url: aid.publishedRisk.sourceUrl }}
              />
            </details>
          )}

          {aid.testNeeded && !draft.sent && (
            <p className="nf-ptr-gate">
              <Icon name="alert" /> {t('{test} needed before a Referral', { test: aid.testNeeded.test })}
            </p>
          )}

          {draft.sent ? (
            <p className="nf-ptr-done" role="status">
              <Icon name="check" /> {t(draft.sent.urgency === 'urgent' ? 'Urgent Referral sent to the Referral desk' : 'Routine Referral sent to the Referral desk')}
            </p>
          ) : (
            <div className="nf-ptr-decide" role="group" aria-label={t('GP decides')}>
              <button className="btn urgent" onClick={() => onStart('urgent')}>
                <Icon name="send" /> {t('Start urgent referral')}
              </button>
              <div className="row">
                <button className="btn small" onClick={() => onStart('routine')}>
                  {t('Routine')}
                </button>
                {aid.testNeeded && (
                  <button className="btn small" aria-pressed={draft.decision === 'order-test'} onClick={() => onDecide('order-test')}>
                    {t('Order {test} first', { test: aid.testNeeded.test.replace(/^Urgent u/, 'u') })}
                  </button>
                )}
                <button className="btn small" aria-pressed={draft.decision === 'not-now'} onClick={() => onDecide('not-now')}>
                  {t('Not now')}
                </button>
              </div>
              {draft.decision === 'order-test' && <p className="muted">{t('Noted. Vitruvian checks again when the result is in.')}</p>}
              {draft.decision === 'not-now' && <p className="muted">{t('Noted. No Referral sent.')}</p>}
            </div>
          )}

          <button className="linkbtn nf-why-btn" aria-expanded={why} onClick={() => setWhy(!why)}>
            {t('Why?')} <Icon name={why ? 'up' : 'down'} size={14} />
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
  const tt = useT();
  return (
    <div className="nf-why">
      {flag && (
        <p className="nf-why-flag">
          <Icon name="repeat" /> {tt('Repeat visit: visit {count} for {symptom} in {months} months.', { count: flag.count, symptom: flag.symptom, months: flag.windowMonths })}
        </p>
      )}
      {aid.testNeeded && (
        <div className="nf-why-item">
          <More>
            {aid.testNeeded.why}
            {aid.testNeeded.threshold && ` ${tt('Threshold {value}.', { value: aid.testNeeded.threshold })}`}
          </More>
          <Source source={aid.testNeeded.source} />
        </div>
      )}
      {aid.riskEvidence && aid.riskEvidence.length > 0 && (
        <div className="nf-why-item">
          <p>{tt('Risk gradient read these words in the notes:')}</p>
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
          <p>{tt('Published risk: {because}', { because: aid.publishedRisk.because })}</p>
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
          {tt('The risk model guessed {guess}. A note only: the Rules decide.', { guess: aid.riskModelPointer === 'none' ? tt('no cancer') : cancerName[aid.riskModelPointer] })}
        </p>
      )}
      <h3>{tt('Matched Rules · {n}', { n: aid.matchedRules.length })}</h3>
      {aid.matchedRules.length === 0 && <p className="muted">{tt('No Rule matched the notes. The GP can still refer.')}</p>}
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
            {tt('Because: {because}', { because: m.because })}
          </More>
          <Source source={m.rule.source} />
        </div>
      ))}
      <h3>{tt('Severity')}</h3>
      <div className="nf-why-item">
        <p>
          <b>{sev.fiveYearSurvivalPct === null ? tt('Pending') : `${sev.fiveYearSurvivalPct}%`}</b> {tt('5-year survival.')} {sev.population.split('.')[0]}.
        </p>
        {band && (
          <p>
            {tt('Age {range}: {pct}% {who}, {period}.', {
              range: band.min === 0 ? tt('under {n}', { n: band.max + 1 }) : `${band.min}–${band.max}`,
              pct: band.pct,
              who: tt(band.sex === 'female' ? 'women' : 'men'),
              period: band.period,
            })}{' '}
            {band.source !== sev.source && <Source source={band.source} short />}
          </p>
        )}
        <Source source={sev.source} short />
      </div>
      {aid.techUsed && aid.techUsed.length > 0 && (
        <ul className="tech-used" aria-label={tt('Tech used')}>
          {aid.techUsed.map((t) => (
            <li key={t.step} className={`tag ${t.provider === 'stub' || t.provider === 'mock' ? 'record' : 'gemma'}`}>
              {tt(techStep[t.step])}: {t.detail ? tt('AI') : techProvider[t.provider]}
            </li>
          ))}
        </ul>
      )}
      <More className="notice">
        {MOCK_NOTICE.gemma} {MOCK_NOTICE.gradient} {tt('Nothing is sent until the GP decides.')}
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
  const tt = useT();
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
          <h2 id="nf-sheet-h">{t?.title ?? tt('Referral template')}</h2>
          <button className="btn small" onClick={onClose} aria-label={tt('Close the Referral')}>
            {tt('Close')}
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
                {tt('{done} of {req}', { done: req - missing.length, req })}
              </span>{' '}
              {tt('required fields filled from the notes.')}
              {missing.length > 0 && <b> {tt('{n} still empty.', { n: missing.length })}</b>}
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
          <div className="row" role="radiogroup" aria-label={tt('Urgency')}>
            {(['urgent', 'routine'] as const).map((u) => (
              <button key={u} role="radio" aria-checked={urgency === u} aria-pressed={urgency === u} className="btn small" onClick={() => onUrgency(u)}>
                {tt(u === 'urgent' ? 'Urgent' : 'Routine')}
              </button>
            ))}
          </div>
          <button className={`btn ${urgency === 'urgent' ? 'urgent' : 'primary'}`} disabled={!ready} onClick={onSend}>
            <Icon name="send" /> {tt(urgency === 'urgent' ? 'Send urgent Referral' : 'Send routine Referral')}
          </button>
        </footer>
      </section>
    </div>
  );
}
