import { useEffect, useState } from 'react';
import { getDemoStaging, getStagingTemplate } from '../data/api';
import { stageGroup } from '../data/mock/staging';
import type { CancerType, StagingField, StagingReport, StagingTemplate } from '../data/types';
import { FieldInput } from '../components/FieldInput';
import { Icon } from '../components/Icon';
import { Source } from '../components/Source';
import { cancerName } from '../components/labels';

const ORDER: CancerType[] = ['lung', 'colorectal', 'ovarian'];
const GROUPS: { key: StagingField['group']; title: string }[] = [
  { key: 'tumour', title: 'Tumour' },
  { key: 'diagnosis', title: 'Diagnosis' },
  { key: 'registry', title: 'Cancer Registry' },
];

export function Specialist() {
  const [cancer, setCancer] = useState<CancerType>('lung');
  const [tpl, setTpl] = useState<StagingTemplate>();
  const [report, setReport] = useState<StagingReport>();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(false);
    Promise.all([getStagingTemplate(cancer), getDemoStaging(cancer)]).then(([t, r]) => {
      setTpl(t);
      setReport(r);
    });
  }, [cancer]);

  if (!tpl || !report || tpl.cancer !== cancer) return <div className="loading" aria-busy><i /><i /><i /></div>;
  const set = (key: string, value: string) => setReport({ ...report, values: { ...report.values, [key]: value } });
  const figo = cancer === 'ovarian';
  const stageKey = figo ? 'figoStage' : 'stageGroup';
  const calc = stageGroup(cancer, report.values);
  const chosen = report.values[stageKey];
  const mismatch = calc && chosen && calc !== chosen;
  const tnmFields = tpl.fields.filter((f) => f.group === 'tnm');
  const missing = tpl.fields.filter((f) => f.required && !report.values[f.key]).length;

  return (
    <div className="doc" style={{ height: '100%' }}>
      <header className="doc-head">
        <div className="ptabs" role="tablist" aria-label="Cancer type" style={{ marginBottom: 12 }}>
          {ORDER.map((c) => (
            <button key={c} role="tab" className="ptab" aria-selected={c === cancer} onClick={() => setCancer(c)}>
              {cancerName[c]}
            </button>
          ))}
        </div>
        <h1>{tpl.title}</h1>
        <div className="meta">
          <span>{report.patientLabel}</span>
          <span>{tpl.tnmEdition}</span>
          <Source source={tpl.source} prefix="Staging grid" />
        </div>
      </header>

      <section>
        <h2>{figo ? 'FIGO stage' : 'TNM and stage group'}</h2>
        <div className="tnm">
          {tnmFields
            .filter((f) => f.key !== stageKey)
            .map((f) => (
              <FieldInput key={f.key} field={f} value={{ value: report.values[f.key] ?? '', origin: 'gp' }} showOrigin={false} onChange={(v) => set(f.key, v)} />
            ))}
          <div className="stage-result" aria-live="polite">
            <small>{figo ? 'FIGO stage, from the substage' : 'Stage group, calculated from T, N and M'}</small>
            <span className="v">{calc ?? '—'}</span>
            <small>{calc ? (mismatch ? `Report says ${chosen}. Check before sending.` : 'Matches the report.') : figo ? 'No substage. Pick the stage by hand.' : 'Not in the grid. Pick the stage by hand.'}</small>
          </div>
        </div>
        {calc && chosen !== calc && (
          <button className="linkbtn" style={{ marginTop: 10 }} onClick={() => set(stageKey, calc)}>
            Use {calc} as the {figo ? 'FIGO stage' : 'stage group'}
          </button>
        )}
      </section>

      <div className="two" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {GROUPS.map((g) => (
          <section key={g.key}>
            <h2>{g.title}</h2>
            <div className="fields">
              {tpl.fields
                .filter((f) => f.group === g.key)
                .map((f) => (
                  <FieldInput key={f.key} field={f} value={{ value: report.values[f.key] ?? '', origin: 'gp' }} showOrigin={false} onChange={(v) => set(f.key, v)} />
                ))}
            </div>
          </section>
        ))}
      </div>

      <div className="toolbar">
        {sent ? (
          <span className="tag gemma">
            <Icon name="check" size={12} /> Staging report sent to the Cancer Registry (mock)
          </span>
        ) : (
          <button className="btn primary" disabled={missing > 0 || !!mismatch} onClick={() => setSent(true)}>
            <Icon name="send" /> Send to the Cancer Registry
          </button>
        )}
        {missing > 0 && <span className="notice">{missing} required fields empty.</span>}
        {mismatch && <span className="notice">{figo ? 'FIGO stage does not match the substage.' : 'Stage group does not match T, N and M.'}</span>}
      </div>
    </div>
  );
}
