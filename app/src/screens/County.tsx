import { useEffect, useState } from 'react';
import { getCountyGap } from '../data/api';
import { S } from '../data/mock/sources';
import type { CountyGap, Source as Src } from '../data/types';
import { More } from '../components/More';
import { Source, SourceIcon } from '../components/Source';
import { useT } from '../components/lang';

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

export function County() {
  const t = useT();
  const [gap, setGap] = useState<CountyGap>();
  useEffect(() => {
    getCountyGap().then(setGap);
  }, []);
  if (!gap) return <div className="loading" aria-busy><i /><i /><i /></div>;
  const fig = (id: string) => gap.headline.find((f) => f.id === id)!;
  const route = fig('route-gap-lymphoma');

  return (
    <div className="county">
      <header className="county-head">
        <h1>{t('Finland Cancer Statistics')}</h1>
      </header>

      <div className="two">
        <section className="panel">
          <h2>{t('Days to treatment')}</h2>
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
            <Bar label={t('Primary healthcare route')} value={127} max={140} display={t('{n} days', { n: 127 })} tone="hi" />
            <Bar label={t('Private or occupational route')} value={76} max={140} display={t('{n} days', { n: 76 })} tone="lo" />
          </div>
          <Source source={route.source} prefix={t('Route gap, national lymphoma cohort')} />
        </section>

        <section className="panel">
          <h2>{t('Stage data at diagnosis')}</h2>
          <div className="bars">
            <Bar label={t('Pirkanmaa, clinical notifications, 2022')} value={42} max={100} display="42%" tone="lo" target={{ at: 90, label: t('90% target') }} />
            <Bar label={t('Pirkanmaa, clinical notifications, 2024')} value={80} max={100} display="80%" tone="hi" />
          </div>
          <Source source={fig('notifications-pirkanmaa').source} prefix={t('Pirkanmaa, wellbeing services county')} />
          <div className="bars" style={{ marginTop: 32 }}>
            <Bar label={t('Finland, spread data recorded, solid cancers, 2024')} value={41.9} max={100} display="41.9%" target={{ at: 90, label: t('90% coverage target') }} />
          </div>
          <More className="evidence">{fig('stage-recorded-national').detail}</More>
          <Source source={fig('stage-recorded-national').source} prefix="National" />
          <Source source={{ ...S.strategy, label: `${S.strategy.label}, p. 36 (90% targets)` }} prefix={t('Targets')} />
        </section>
      </div>

      <section className="panel county-gaps">
        <h2>{t('County gaps (hyvinvointialueet)')}</h2>
        <div className="three">
          {COUNTY_GAPS.map((c) => (
            <div key={c.title}>
              <h3>{t(c.title)}</h3>
              <div className="bars">
                {c.bars.map((b) => (
                  <Bar key={b.area} label={b.area} value={b.value} max={100} display={`${b.value.toFixed(c.bars.some((x) => x.value % 1) ? 1 : 0)}%`} tone={b.tone} />
                ))}
              </div>
              <More className="evidence">{t(c.note)}</More>
              <Source source={c.source} short />
            </div>
          ))}
        </div>
        <p className="county-ovarian">
          {t('Ovarian cancer: no public county data. Finland only: 610 new cases in 2024, 48% 5-year survival.')}
          <SourceIcon source={ovarianSource} />
        </p>
      </section>

      <section className="panel">
        <h2>{t('Goal 3 indicators (Tavoite 3)')}</h2>
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

      <section className="next">
        <header className="next-head">
          <h2>{t('What a county does next')}</h2>
          <span>
            {t('Goal 3 is 49.73 M€ of the 139.1 M€ roadmap')}
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
                    {t('Target times: colorectal 3 weeks, breast 4, prostate 4–6. None for lung or ovarian. The guide is marked outdated.')}
                  </More>
                )}
                <small>{t('Owner: {owner}', { owner: a.owner })}</small>
                <ul className="roadmap-ties">
                  {(ROADMAP[a.id] ?? []).map((r) => (
                    <li key={r.action}>
                      <b>{t('Roadmap {action}', { action: r.action })}</b>
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
        <h2>{t('Where county data lives')}</h2>
        <p className="county-data-gap">{t('No public county cancer wait data exists.')}</p>
        <ul>
          {COUNTY_DATA.map((d) => (
            <li key={d.what}>
              <b>{t(d.what)}</b>
              <span>{t(d.level)}</span>
              <Source source={d.source} short />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
