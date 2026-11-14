import { useEffect, useState } from 'react';
import { getCountyGap } from '../data/api';
import { S } from '../data/mock/sources';
import type { CountyGap, Source as Src } from '../data/types';
import { More } from '../components/More';
import { Source, SourceIcon } from '../components/Source';

/* Brief audit 14 Nov (docs/tracks/03-brief-audit.md, B1–B3): roadmap ties, target times, county data sources. */
const ROADMAP_URL = 'https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf';
const roadmap = (pages: string): Src => ({ label: `Cancer strategy implementation roadmap 2026–2031, p. ${pages}`, short: `Roadmap p. ${pages}`, url: ROADMAP_URL });
const ohjaus: Src = {
  label: 'THL Ohjaus 21/2016, access to cancer care, figures 2–5 and section 4.1 (marked outdated)',
  short: 'THL Ohjaus 21/2016',
  url: 'https://www.julkari.fi/server/api/core/bitstreams/de33d584-bdce-40a1-b100-df48c4906a49/content',
};

/** The national roadmap action each county step fits: action, owner, years, cost. */
const ROADMAP: Record<string, { action: string; owner: string; years: string; cost: string; source: Src }[]> = {
  A1: [
    { action: '2.5.2 Standard referral criteria', owner: 'FICAN', years: '5 cancers by 2028', cost: 'in 3.1.1', source: roadmap('52–53') },
    { action: '3.4.2 Functional data in referrals', owner: 'Counties', years: '2026–31', cost: '1.0 M€', source: roadmap('68–70') },
  ],
  A2: [{ action: '3.2.1 Quality register', owner: 'STM, THL, FICAN', years: '90% automated by 2030', cost: '2.5 M€', source: roadmap('59–60') }],
  A3: [
    { action: '3.1.2 Target times per cancer', owner: 'FICAN', years: '5 cancers 2026–28', cost: 'in 3.1.1', source: roadmap('56–57') },
    { action: '4.1.3 Real-time access views', owner: 'Counties, THL', years: 'pilots 2026–28', cost: '2 M€', source: roadmap('80') },
  ],
  A4: [{ action: '3.2.2 Regional benchmarking', owner: 'FICAN, THL', years: 'public 2029–31', cost: '0.3 M€', source: roadmap('60–61') }],
};

const COUNTY_DATA: { what: string; level: string; source: Src }[] = [
  {
    what: 'Stage notifications',
    level: 'Wellbeing services county',
    source: { label: 'Cancer Registry, clinical notifications statistics', short: 'Cancer Registry', url: 'https://syoparekisteri.fi/tilastot/kliinisten-ilmoitusten-tilasto/' },
  },
  {
    what: 'Screening participation, 2024',
    level: 'Wellbeing services county',
    source: { label: 'Cancer Registry screening release, 30 Jun 2026 (STT)', short: 'Screening release', url: 'https://www.sttinfo.fi/tiedote/72173590/kolme-aluetta-erottuu-edukseen-syopaseulonnoissa-helsingissa-osallistuminen-jaa-selvasti-jalkeen?lang=fi' },
  },
  {
    what: 'Lung cancer report 2019–2023',
    level: 'Wellbeing services county',
    source: { label: 'Cancer Registry lung cancer report (not yet opened)', short: 'Lung report', url: 'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html', placeholder: true },
  },
];

/** One horizontal bar on a 0–100 or 0–max scale, with an optional target line. */
function Bar({ label, value, max, display, tone, target }: { label: string; value: number; max: number; display: string; tone?: 'hi' | 'lo'; target?: { at: number; label: string } }) {
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar-track">
        <div className={`bar-fill ${tone ?? ''}`} style={{ width: `${(value / max) * 100}%` }}>
          <span className="bar-num">{display}</span>
        </div>
        {target && (
          <div className="bar-target" style={{ left: `${(target.at / max) * 100}%` }}>
            <span>{target.label}</span>
          </div>
        )}
      </div>
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
        <h1>Finland Cancer Statistics</h1>
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
                    <b className="study">
                      {f.label}
                      <SourceIcon source={f.source} />
                    </b>
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
        <header className="next-head">
          <h2>What a county does next</h2>
          <span>
            Goal 3 is 49.73 M€ of the 139.1 M€ roadmap
            <SourceIcon source={roadmap('106, 109')} />
          </span>
        </header>
        {gap.nextActions.map((a) => {
          const fixedSource = a.id === 'A3' && a.source?.url.includes('selv_2010_6') ? ohjaus : a.source;
          return (
            <div className="action" key={a.id}>
              <span className="k">{a.id}</span>
              <div>
                <b>{a.title}</b>
                <More>{a.detail}</More>
                {a.id === 'A3' && (
                  <More className="target-times">
                    Target times: colorectal 3 weeks, breast 4, prostate 4–6. None for lung or ovarian. The guide is marked outdated.
                  </More>
                )}
                <small>Owner: {a.owner}</small>
                <ul className="roadmap-ties">
                  {(ROADMAP[a.id] ?? []).map((r) => (
                    <li key={r.action}>
                      <b>Roadmap {r.action}</b>
                      <span>
                        {r.owner} · {r.years} · {r.cost}
                      </span>
                      <SourceIcon source={r.source} />
                    </li>
                  ))}
                </ul>
                <div>{fixedSource && <Source source={fixedSource} />}</div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="panel county-data">
        <h2>Where county data lives</h2>
        <p className="county-data-gap">No public county cancer wait data exists.</p>
        <ul>
          {COUNTY_DATA.map((d) => (
            <li key={d.what}>
              <b>{d.what}</b>
              <span>{d.level}</span>
              <Source source={d.source} short />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
