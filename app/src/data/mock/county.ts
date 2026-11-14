// County gap screen mock data. Figures from docs/build/county-gap-data.md (2026-11-14).
// Area levels are never mixed in one comparison. Unverified figures are left out or marked placeholder.
import type { CountyGap, Source } from '../types';
import { S } from './sources';

const strategyPage = (page: string): Source => ({ ...S.strategy, label: `${S.strategy.label}, p. ${page}` });

export const countyGap: CountyGap = {
  headline: [
    {
      id: 'lung-days-total',
      label: 'Lung cancer, symptoms to treatment (national study)',
      value: '155 days',
      detail:
        'Average in an unpublished study of four study cities (Kuopio, Tampere, Turku, Rovaniemi). Study sites, not regions.',
      source: S.yleKuittinen,
    },
    {
      id: 'lung-days-primary-care',
      label: 'Of those days, in primary care (national study)',
      value: '41 of 155 days',
      detail: 'Same study. The primary-care share of the delay, not a route comparison. Over 50 days are on the patient side and 58 in specialised care.',
      source: S.yleKuittinen,
    },
    {
      id: 'stage-recorded-national',
      label: 'Spread data recorded, solid cancers, Finland',
      value: '41.9%',
      detail:
        'Spread data (TNM, stage or free text) recorded for 41.9% of solid cancers in 2024; 58.1% had none. Stage alone was 5.4%. Clinical notifications reach only about half of new cases.',
      source: S.registry2024,
    },
    {
      id: 'route-gap-lymphoma',
      label: 'Route gap, lymphoma (national, one study)',
      value: '127 vs 76 days',
      detail:
        'Median days, symptoms to treatment: primary healthcare vs private or occupational care. One national lymphoma cohort (n = 160). No county-level route data exists.',
      source: S.kuitunen2026,
    },
    {
      id: 'notifications-pirkanmaa',
      label: 'Clinical notifications, Pirkanmaa',
      value: '42% to 80%',
      detail: 'Share of cancers notified to the registry by clinical staff, 2022 to 2024. Wellbeing services county.',
      source: S.registryNotifications,
    },
  ],

  comparisons: [
    {
      id: 'lung-surgery-days',
      title: 'Lung cancer: median days from diagnosis to surgery',
      unit: 'days',
      note: 'Cooperation areas, not counties. Interquartile ranges: North 0.0 to 44.0; South 33.0 to 63.0. Diagnosis years are not stated in the PDF text.',
      higherIsBetter: false,
      bars: [
        { area: 'North (Pohjois-Suomi) cooperation area', value: 13.5, display: '13.5 days' },
        { area: 'South (Etelä-Suomi) cooperation area', value: 46, display: '46.0 days' },
      ],
      source: S.registryLung,
    },
  ],

  goal3: [
    {
      id: 'G3-1',
      name: 'Potilaat pääsevät hoitoon tavoiteaikojen puitteissa',
      howVitruvianMoves:
        'No county cancer wait is published against target times yet, so Vitruvian shows proxy waits (route days and access times) for the county to track.',
      source: strategyPage('5, 33'),
    },
    {
      id: 'G3-2',
      name: 'Alueelliset ja sosioekonomiset erot syövän ilmaantuvuudessa, hoidossa ja syöpäkuolleisuudessa ovat käytettävissä palvelutoiminnassa ja niillä ohjataan toimintaa',
      howVitruvianMoves:
        'Vitruvian puts regional gaps side by side, such as lung surgery days North and South, so services can steer by them.',
      source: strategyPage('5'),
    },
    {
      id: 'G3-3',
      name: 'Saatavilla on luotettavaa tietoa syövän diagnostiikka- ja hoitokäytäntöjen alueellisista eroista, minkä avulla voidaan kaventaa eroja hoitotuloksissa',
      howVitruvianMoves:
        'Vitruvian shows where the regional data is missing or thin, such as stage recording, so a county can see the gap it must close.',
      source: strategyPage('36'),
    },
    {
      id: 'G3-4',
      name: 'Kliinisten syöpäilmoitusten määrä (tavoitteena 90 % tapauksista automatisoidusti vuoteen 2030 mennessä)',
      howVitruvianMoves:
        'Vitruvian tracks the county notification share against the 90% automated target, starting from Pirkanmaa at 80% in 2024.',
      source: strategyPage('36'),
    },
    {
      id: 'G3-5',
      name: 'Laaturekisterin tietopohja (ml. levinneisyystieto) … (tietopohjan kattavuus 90 %)',
      howVitruvianMoves:
        'Vitruvian shows how much of each county record includes stage (spread) data, against the 90% coverage target.',
      source: strategyPage('36'),
    },
  ],

  nextActions: [
    {
      id: 'A1',
      title: 'Add a structured lung referral template',
      detail:
        'Required stage and spread fields, plus a route field (public, occupational, private). Track primary-care days by route. The route gap is national (one lymphoma study); no county route data exists yet.',
      owner: 'Wellbeing services county',
      source: S.yleKuittinen,
    },
    {
      id: 'A2',
      title: 'Record stage at diagnosis entry',
      detail:
        'Use the Pirkanmaa workflow, built with the registry, which took notifications from 42% to 80%. Set a county target of 90% automated notification by 2030.',
      owner: 'Wellbeing services county',
      source: S.registryNotifications,
    },
    {
      id: 'A3',
      title: 'Set a county cancer wait clock',
      detail:
        'Measure against the 6-week guidance and publish it monthly. Put the target in county agreements. No county cancer wait is published today, so start with proxy waits.',
      owner: 'Wellbeing services county',
      source: S.stm2010,
    },
    {
      id: 'A4',
      title: 'Review lung surgery scheduling in the South',
      detail:
        'Median is 46 days in the South against 13.5 in the North. Use the North as comparator and check patient mix first. These are cooperation areas, not counties.',
      owner: 'Etelä-Suomi cooperation area',
      source: S.registryLung,
    },
  ],
};
