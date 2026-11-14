import { useEffect, useState } from 'react';
import { getCountyGap } from '../data/api';
import { S } from '../data/mock/sources';
import type { CountyGap } from '../data/types';
import { More } from '../components/More';
import { Source } from '../components/Source';

/** One horizontal bar on a 0–100 or 0–max scale, with an optional target line. */
function Bar({ label, value, max, display, tone, target }: { label: string; value: number; max: number; display: string; tone?: 'hi' | 'lo'; target?: { at: number; label: string } }) {
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar-track">
        <div className={`bar-fill ${tone ?? ''}`} style={{ width: `${(value / max) * 100}%` }} />
        {target && (
          <div className="bar-target" style={{ left: `${(target.at / max) * 100}%` }}>
            <span>{target.label}</span>
          </div>
        )}
      </div>
      <span className="val">{display}</span>
    </div>
  );
}

export function County() {
  const [gap, setGap] = useState<CountyGap>();
  useEffect(() => {
    getCountyGap().then(setGap);
  }, []);
  if (!gap) return <div className="loading" aria-busy><i /><i /><i /></div>;
  const fig = (id: string) => gap.headline.find((f) => f.id === id)!;
  const route = fig('route-gap-lymphoma');
  const lung = gap.comparisons[0];

  return (
    <div className="county">
      <header className="county-head">
        <h1>Where the county loses days and data</h1>
      </header>

      <div className="two">
        <section className="panel">
          <h2>Days to treatment</h2>
          <div className="facts">
            {['lung-days-total', 'lung-days-primary-care', 'route-gap-lymphoma'].map((id) => {
              const f = fig(id);
              return (
                <div className="fact" key={f.id} style={{ gridTemplateColumns: '170px minmax(0,1fr)' }}>
                  <span className="v">{f.value}</span>
                  <div>
                    <b>{f.label}</b>
                    <More>{f.detail}</More>
                    <Source source={f.source} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bars" style={{ marginTop: 8 }}>
            <Bar label="Primary healthcare route" value={127} max={140} display="127 days" tone="hi" />
            <Bar label="Private or occupational route" value={76} max={140} display="76 days" tone="lo" />
          </div>
          <Source source={route.source} prefix="Route gap, national lymphoma cohort" />
        </section>

        <section className="panel">
          <h2>Stage data at diagnosis</h2>
          <div className="bars">
            <Bar label="Pirkanmaa, clinical notifications, 2022" value={42} max={100} display="42%" tone="lo" target={{ at: 90, label: '90% target' }} />
            <Bar label="Pirkanmaa, clinical notifications, 2024" value={80} max={100} display="80%" tone="hi" />
          </div>
          <Source source={fig('notifications-pirkanmaa').source} prefix="Pirkanmaa, wellbeing services county" />
          <div className="bars" style={{ marginTop: 32 }}>
            <Bar label="Finland, spread data recorded, solid cancers, 2024" value={41.9} max={100} display="41.9%" target={{ at: 90, label: '90% coverage target' }} />
          </div>
          <More className="evidence">{fig('stage-recorded-national').detail}</More>
          <Source source={fig('stage-recorded-national').source} prefix="National" />
          <Source source={{ ...S.strategy, label: `${S.strategy.label}, p. 36 (90% targets)` }} prefix="Targets" />
        </section>
      </div>

      <div className="two">
        <section className="panel">
          <h2>{lung.title}</h2>
          <div className="bars" style={{ marginTop: 8 }}>
            {lung.bars.map((b) => (
              <Bar key={b.area} label={b.area} value={b.value} max={50} display={b.display} tone={b.value > 20 ? 'hi' : 'lo'} />
            ))}
          </div>
          <More className="evidence">{lung.note}</More>
          <Source source={lung.source} />
        </section>

        <section className="panel">
          <h2>Goal 3 indicators (Tavoite 3)</h2>
          <div>
            {gap.goal3.map((g) => (
              <div className="goal" key={g.id}>
                <More className="fi" extra={<p>{g.howVitruvianMoves}</p>}>
                  <span lang="fi">{g.name}</span>
                </More>
                <Source source={g.source} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="next">
        <h2>What a county does next</h2>
        {gap.nextActions.map((a) => (
          <div className="action" key={a.id}>
            <span className="k">{a.id}</span>
            <div>
              <b>{a.title}</b>
              <More>{a.detail}</More>
              <small>Owner: {a.owner}</small>
              <div>{a.source && <Source source={a.source} />}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
