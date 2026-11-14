import { useEffect, useState } from 'react';
import { checkStaging, getDemoStaging, getReferrals, getSavedStagingReports, getStagingDraft, getStagingTemplate, saveStagingReport } from '../data/api';
import type { CancerType, Patient, ReferralView, SavedStagingReport, StagingField, StagingReport, StagingTemplate } from '../data/types';
import { FieldInput } from '../components/FieldInput';
import { Icon } from '../components/Icon';
import { Source } from '../components/Source';
import { cancerName, fmtDate } from '../components/labels';
import { getLang, tr, useT } from '../components/lang';

const ORDER: CancerType[] = ['lung', 'colorectal', 'ovarian'];
const GROUPS: { key: StagingField['group']; title: string }[] = [
  { key: 'tumour', title: 'Tumour' },
  { key: 'diagnosis', title: 'Diagnosis' },
  { key: 'registry', title: 'Cancer Registry' },
];

/** Stories 31–33: Staging report. Opens a draft from a Referral (story 32), checks it, saves it as "ready for registry" (story 33). */
export function Specialist({ patients }: { patients: Patient[] }) {
  const [cancer, setCancer] = useState<CancerType>('lung');
  const [referralId, setReferralId] = useState<string>();
  const [refs, setRefs] = useState<ReferralView[]>([]);
  const [tpl, setTpl] = useState<StagingTemplate>();
  const [report, setReport] = useState<StagingReport>();
  const [saved, setSaved] = useState<SavedStagingReport[]>([]);
  const [last, setLast] = useState<SavedStagingReport>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const t = useT();

  useEffect(() => {
    getReferrals().then(setRefs).catch(() => setRefs([]));
    getSavedStagingReports().then(setSaved).catch(() => setSaved([]));
  }, []);

  useEffect(() => {
    setLast(undefined);
    setError('');
    const draft = referralId ? getStagingDraft(referralId) : getDemoStaging(cancer);
    Promise.all([getStagingTemplate(cancer), draft])
      .then(([t, r]) => {
        setTpl(t);
        setReport(r);
      })
      // getLang, not t: t is rebuilt every render, so listing it here would refetch the draft on each render.
      .catch((e) => setError(e instanceof Error ? e.message : tr('Could not open the draft.', getLang())));
  }, [cancer, referralId]);

  const pickCancer = (c: CancerType) => {
    setReferralId(undefined);
    setCancer(c);
  };
  const pickReferral = (id: string) => {
    const r = refs.find((x) => x.id === id);
    if (!r) return setReferralId(undefined);
    setCancer(r.cancer);
    setReferralId(r.id);
  };

  if (!tpl || !report || tpl.cancer !== cancer || report.cancer !== cancer) {
    return error ? <p className="form-error" role="alert">{error}</p> : <div className="loading" aria-busy><i /><i /><i /></div>;
  }
  const prefilled = new Set(report.prefilled ?? []);
  const set = (key: string, value: string) => {
    setLast(undefined);
    setReport({ ...report, values: { ...report.values, [key]: value }, prefilled: report.prefilled?.filter((k) => k !== key) });
  };
  const field = (f: StagingField) => (
    <FieldInput
      key={f.key}
      field={f}
      value={{ value: report.values[f.key] ?? '', origin: prefilled.has(f.key) ? 'record' : 'gp' }}
      showOrigin={prefilled.has(f.key)}
      onChange={(v) => set(f.key, v)}
    />
  );

  const figo = cancer === 'ovarian';
  const stageKey = figo ? 'figoStage' : 'stageGroup';
  const check = checkStaging(tpl, report.values);
  const calc = check.computedStage;
  const mismatch = check.stageMismatch;
  const tnmFields = tpl.fields.filter((f) => f.group === 'tnm');
  const name = (r: { patientId?: string }) => patients.find((p) => p.id === r.patientId)?.name;
  const mine = refs.filter((r) => r.cancer === cancer);

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      const s = await saveStagingReport(report);
      setLast(s);
      setSaved((xs) => [s, ...xs.filter((x) => x.id !== s.id)]);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('Could not save the Staging report.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="doc" style={{ height: '100%' }}>
      <header className="doc-head">
        <div className="ptabs" role="tablist" aria-label={t('Cancer type')} style={{ marginBottom: 12 }}>
          {ORDER.map((c) => (
            <button key={c} role="tab" className="ptab" aria-selected={c === cancer} onClick={() => pickCancer(c)}>
              {cancerName[c]}
            </button>
          ))}
        </div>
        <h1>{tpl.title}</h1>
        <div className="meta stg-meta">
          <label>
            <span>{t('Referral')}</span>
            <select value={referralId ?? ''} onChange={(e) => pickReferral(e.target.value)}>
              <option value="">{t('Demo patient')}</option>
              {mine.map((r) => (
                <option key={r.id} value={r.id}>
                  {name(r) ?? r.patientId} · {fmtDate(r.decidedAt)}
                </option>
              ))}
            </select>
          </label>
          {prefilled.size > 0 && (
            <span className="tag record">
              {prefilled.size === 1
                ? t('{n} field copied from the record', { n: prefilled.size })
                : t('{n} fields copied from the record', { n: prefilled.size })}
            </span>
          )}
          <Source source={tpl.source} short />
        </div>
      </header>

      <section>
        <h2>{figo ? t('FIGO stage') : t('TNM and stage group')}</h2>
        <div className="tnm">
          {tnmFields.filter((f) => f.key !== stageKey).map(field)}
          <div className="stage-result" aria-live="polite">
            <small>{figo ? t('FIGO stage') : t('Stage group')}</small>
            <span className="v">{calc ?? '—'}</span>
            <small>
              {calc
                ? mismatch
                  ? t('Report says {reported}. Check before saving.', { reported: mismatch.reported })
                  : t('Matches the report.')
                : figo
                  ? t('No substage. Pick the stage by hand.')
                  : t('Not in the grid. Pick the stage by hand.')}
            </small>
          </div>
        </div>
        {calc && report.values[stageKey] !== calc && (
          <button className="linkbtn" style={{ marginTop: 10 }} onClick={() => set(stageKey, calc)}>
            {figo ? t('Use {calc} as the FIGO stage', { calc }) : t('Use {calc} as the stage group', { calc })}
          </button>
        )}
      </section>

      <div className="two groups">
        {GROUPS.map((g) => (
          <section key={g.key}>
            <h2>{t(g.title)}</h2>
            <div className="fields">{tpl.fields.filter((f) => f.group === g.key).map(field)}</div>
          </section>
        ))}
      </div>

      <div className="toolbar">
        <button className="btn primary" disabled={busy} onClick={save}>
          <Icon name="send" /> {t('Save Staging report')}
        </button>
        {last ? (
          <span className={`tag ${last.status === 'ready-for-registry' ? 'gemma' : 'warn'}`}>
            {last.status === 'ready-for-registry' ? (
              <>
                <Icon name="check" size={12} /> {t('Ready for registry')}
              </>
            ) : (
              t('Saved as draft')
            )}
          </span>
        ) : (
          <>
            {check.readyForRegistry && <span className="tag gemma">{t('Ready for registry when saved')}</span>}
            {check.missingFields.length > 0 && <span className="notice">{t('{n} required fields empty.', { n: check.missingFields.length })}</span>}
            {mismatch && <span className="notice">{figo ? t('FIGO stage does not match the substage.') : t('Stage group does not match T, N and M.')}</span>}
          </>
        )}
        {error && (
          <span className="form-error" role="alert">
            {error}
          </span>
        )}
      </div>

      {saved.length > 0 && (
        <section className="stg-saved">
          <h2>{t('Saved Staging reports')}</h2>
          <ul>
            {saved.map((s) => (
              <li key={s.id}>
                <b>{name(s) ?? s.patientLabel}</b>
                <span>{cancerName[s.cancer]}</span>
                <span>{t('Stage {stage}', { stage: s.values[s.cancer === 'ovarian' ? 'figoStage' : 'stageGroup'] || '—' })}</span>
                <span className={`tag ${s.status === 'ready-for-registry' ? 'gemma' : 'warn'}`}>{s.status === 'ready-for-registry' ? t('Ready for registry') : t('Draft')}</span>
                <small>{fmtDate(s.savedAt)}</small>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
