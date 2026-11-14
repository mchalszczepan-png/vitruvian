import { useEffect, useState } from 'react';
import { getCountyGap } from '../data/api';
import { S } from '../data/mock/sources';
import type { CancerType, CountyGap, Patient, Source as Src } from '../data/types';
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
    source: { label: 'Cancer Registry lung cancer report, 2019–2023', short: 'Lung report', url: 'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html' },
  },
];

/* Real county numbers, checked 14 Nov 2026: docs/research/data/county-cancer-data.md. Wellbeing services counties only. */
type Gap = { title: string; bars: { area: string; value: number; tone?: 'hi' | 'lo' }[]; note: string; source: Src };
const COUNTY_GAPS: Gap[] = [
  {
    title: 'Lung cancer: treated with curative intent, 2019–2023',
    bars: [
      { area: 'Lappi', value: 18.5, tone: 'hi' },
      { area: 'Vantaa-Kerava', value: 35.6, tone: 'lo' },
      { area: 'Finland', value: 27.0 },
    ],
    note: 'Share of new lung cancer patients whose recorded first-year treatment aimed to cure. Lappi 131 of 710, Vantaa-Kerava 212 of 595, Finland 4,009 of 14,873. Recorded, not received: some areas under-report treatment. Stage and fitness differ by county.',
    source: { label: 'Cancer Registry lung cancer report, Table 11, diagnoses 2019–2023', short: 'Lung report, 2019–2023', url: 'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html' },
  },
  {
    title: 'Bowel screening: colonoscopy after a positive test, 2024',
    bars: [
      { area: 'Kymenlaakso', value: 62.1, tone: 'hi' },
      { area: 'Etelä-Pohjanmaa', value: 81.8, tone: 'lo' },
      { area: 'Finland', value: 72.7 },
    ],
    note: 'Share of people with a positive home stool test (FIT) who had a colonoscopy, as recorded. Same programme rules in every county.',
    source: { label: 'Cancer Registry screening statistics, bowel programme, 2024', short: 'Screening stats, 2024', url: 'https://stats.cancerregistry.fi/joukkistilastot/suolisto.html' },
  },
  {
    title: 'Bowel cancer: 5-year survival, 2024',
    bars: [
      { area: 'Päijät-Häme', value: 63, tone: 'hi' },
      { area: 'Keski-Uusimaa', value: 74, tone: 'lo' },
      { area: 'Finland', value: 68 },
    ],
    note: 'Relative survival. Not age-standardised: age, stage and case mix differ by county, so this is not a ranking of care quality.',
    source: { label: 'Sotkanet indicator 3627, five-year relative survival of bowel cancer patients, 2024', short: 'Sotkanet 3627, 2024', url: 'https://sotkanet.fi/rest/1.1/json?indicator=3627&years=2024&genders=total' },
  },
];
const ovarianSource: Src = { label: 'Cancer Registry, cancer in Finland 2024, Tables 15.1, 15.3, 5.1', short: 'Cancer Registry 2024', url: 'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html' };

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

/** Everything behind the headline: national figures, other county gaps, Goal 3 list, data sources. */
function Method({ gap }: { gap: CountyGap }) {
  const fig = (id: string) => gap.headline.find((f) => f.id === id)!;
  const route = fig('route-gap-lymphoma');

  return (
    <div className="county-method">

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

      <section className="panel county-gaps">
        <h2>County gaps (hyvinvointialueet)</h2>
        <div className="three">
          {COUNTY_GAPS.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              <div className="bars">
                {c.bars.map((b) => (
                  <Bar key={b.area} label={b.area} value={b.value} max={100} display={`${b.value.toFixed(c.bars.some((x) => x.value % 1) ? 1 : 0)}%`} tone={b.tone} />
                ))}
              </div>
              <More className="evidence">{c.note}</More>
              <Source source={c.source} short />
            </div>
          ))}
        </div>
        <p className="county-ovarian">
          Ovarian cancer: no public county data. Finland only: 610 new cases in 2024, 48% 5-year survival.
          <SourceIcon source={ovarianSource} />
        </p>
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

/* Every wellbeing services county, checked 14 Nov 2026: docs/research/data/county-cancer-data.md. */
const LUNG_CURATIVE: Record<string, number> = {
  Helsinki: 33.0, 'Vantaa-Kerava': 35.6, 'Länsi-Uusimaa': 31.9, 'Keski-Uusimaa': 33.7, 'Itä-Uusimaa': 28.3, 'Varsinais-Suomi': 24.3,
  Satakunta: 24.5, 'Kanta-Häme': 23.4, Pirkanmaa: 31.9, 'Päijät-Häme': 29.6, Kymenlaakso: 19.3, 'Etelä-Karjala': 18.9, 'Etelä-Savo': 23.4,
  'Pohjois-Savo': 24.5, 'Pohjois-Karjala': 21.4, 'Keski-Suomi': 27.2, 'Etelä-Pohjanmaa': 30.6, Pohjanmaa: 27.8, 'Keski-Pohjanmaa': 22.3,
  'Pohjois-Pohjanmaa': 23.6, Kainuu: 20.8, Lappi: 18.5,
};
const COLONOSCOPY: Record<string, number> = {
  Helsinki: 67.8, 'Vantaa-Kerava': 73.0, 'Länsi-Uusimaa': 74.5, 'Keski-Uusimaa': 70.2, 'Itä-Uusimaa': 65.5, 'Varsinais-Suomi': 78.1,
  Satakunta: 72.0, 'Kanta-Häme': 74.6, Pirkanmaa: 70.2, 'Päijät-Häme': 71.2, Kymenlaakso: 62.1, 'Etelä-Karjala': 75.7, 'Etelä-Savo': 76.9,
  'Pohjois-Savo': 69.4, 'Pohjois-Karjala': 79.5, 'Keski-Suomi': 75.6, 'Etelä-Pohjanmaa': 81.8, Pohjanmaa: 73.7, 'Keski-Pohjanmaa': 74.4,
  'Pohjois-Pohjanmaa': 73.6, Kainuu: 65.0, Lappi: 72.7,
};
type Measure = { what: string; table: Record<string, number>; finland: number; source: Src };
const MEASURE: Partial<Record<CancerType, Measure>> = {
  lung: { what: 'Lung cancer patients treated with curative intent, 2019–2023', table: LUNG_CURATIVE, finland: 27.0, source: COUNTY_GAPS[0].source },
  colorectal: { what: 'Colonoscopy after a positive bowel screening test, 2024', table: COLONOSCOPY, finland: 72.7, source: COUNTY_GAPS[1].source },
};

/** Three county moves, each tied to a national roadmap action. Text fixed per brief audit B1–B2. */
const MOVES = (cancer: string) => [
  { id: 'A1', title: `Use one structured ${cancer} Referral template`, detail: 'Required stage, spread and route fields, so Referrals stop bouncing back.' },
  { id: 'A3', title: 'Start a county cancer wait clock', detail: 'Measure days from first visit to treatment and publish them monthly. No county cancer wait is published today.' },
  { id: 'A2', title: 'Record stage at diagnosis entry', detail: 'Pirkanmaa took clinical notifications from 42% to 80% this way. The national target is 90% automated by 2030.' },
];
const lower: Record<CancerType, string> = { lung: 'lung', colorectal: 'colorectal', ovarian: 'ovarian' };

export function County({ patient, cancer }: { patient: Patient; cancer?: CancerType }) {
  const [gap, setGap] = useState<CountyGap>();
  useEffect(() => {
    getCountyGap().then(setGap);
  }, []);
  if (!gap) return <div className="loading" aria-busy><i /><i /><i /></div>;

  const county = patient.county;
  const m = cancer ? MEASURE[cancer] : undefined;
  const value = m?.table[county];
  const behind = value !== undefined && m ? value < m.finland : false;
  const first = patient.visits[0]?.date;
  const day = (iso: string) => (first ? Math.round((Date.parse(iso) - Date.parse(first)) / 86_400_000) : 0);
  const g3 = gap.goal3.find((g) => g.id === 'G3-1') ?? gap.goal3[0];

  return (
    <div className="county">
      <header className="county-head">
        <h1>{county}: your gap</h1>
      </header>

      <section className="panel county-headline">
        {m && value !== undefined ? (
          <>
            <h2>{m.what}</h2>
            <div className="county-vs">
              <span className={`v ${behind ? 'behind' : ''}`}>{value.toFixed(1)}%</span>
              <span className="vs">
                {county}, against Finland {m.finland.toFixed(1)}%
              </span>
            </div>
            <div className="bars">
              <Bar label={county} value={value} max={100} display={`${value.toFixed(1)}%`} tone={behind ? 'hi' : 'lo'} />
              <Bar label="Finland" value={m.finland} max={100} display={`${m.finland.toFixed(1)}%`} />
            </div>
            <Source source={m.source} short />
          </>
        ) : cancer === 'ovarian' ? (
          <>
            <h2>Ovarian cancer</h2>
            <div className="county-vs">
              <span className="v behind">No public county data</span>
            </div>
            <p className="county-ovarian">That is the gap: {county} cannot compare itself. Finland only: 610 new cases in 2024, 48% 5-year survival.</p>
            <Source source={ovarianSource} short />
          </>
        ) : (
          <p className="county-ovarian">No county figure for this patient yet. See Sources and method below.</p>
        )}
      </section>

      <section className="panel">
        <h2>{patient.name.split(' ')[0]}: Day 0 to Day {patient.visits.length ? day(patient.visits[patient.visits.length - 1].date) : 0}</h2>
        <ol className="timeline">
          {patient.visits.map((v) => (
            <li key={v.id}>
              <span className="d">Day {day(v.date)}</span>
              <span>{v.reason}</span>
            </li>
          ))}
        </ol>
        <p className="county-ovarian">Made-up patient. Visit dates from the patient record.</p>
      </section>

      <section className="next">
        <header className="next-head">
          <h2>What {county} does next</h2>
          <span>
            Goal 3 is 49.73 M€ of the 139.1 M€ roadmap
            <SourceIcon source={roadmap('106, 109')} />
          </span>
        </header>
        {MOVES(cancer ? lower[cancer] : 'cancer').map((a, i) => (
          <div className="action" key={a.id}>
            <span className="k">{i + 1}</span>
            <div>
              <b>{a.title}</b>
              <More>{a.detail}</More>
              {a.id === 'A3' && (
                <More className="target-times">
                  Target times: colorectal 3 weeks, breast 4, prostate 4–6. None for lung or ovarian. The guide is marked outdated.
                  <SourceIcon source={ohjaus} />
                </More>
              )}
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
            </div>
          </div>
        ))}
      </section>

      {g3 && (
        <p className="goal3-line">
          <b>Goal 3 indicator (Tavoite 3):</b> <span lang="fi">{g3.name}</span>
          <SourceIcon source={g3.source} />
        </p>
      )}

      <details className="method">
        <summary>Sources and method</summary>
        <Method gap={gap} />
      </details>
    </div>
  );
}

