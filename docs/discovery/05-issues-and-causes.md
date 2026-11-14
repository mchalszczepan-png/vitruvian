# Issues and causes – synthesis

Date: 2026-11-14. Research only: problems and causes, **no solutions**. Built from the files linked in each row. No interviews; all customer evidence is secondary. Evidence strength: H high, M medium, L low.

## One-paragraph picture

People with less education or money in Finland are diagnosed later, get less curative treatment and die more often from cancer. Most of the measurable gap opens **early**: getting to a doctor and getting referred, mainly for people who must use slow public primary care because they have no occupational or private route. Waiting time is legal at each step ([law/00](../research/law/00-synthesis.md)), but nobody owns or measures the **total** wait, and the national data needed to see the gap (time to diagnosis, stage) is missing or incomplete. The [strategy](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=33) itself says equity monitoring has no funding.

## Outcome gaps (what is wrong)

| Gap | Size | Strength | Source |
| --- | --- | --- | --- |
| Treatment by education (higher vs lower) | Surgery 51% vs 36%, radiotherapy 25% vs 14%, chemo 24% vs 15% | H (deck figures; paper text not fully read) | [deck](../tracks/astrazeneca-insights-deck-2026-11-13.pdf) p.14–15 |
| Cancer death by education | HR 1.13 (men) / 1.14 (women); stage IV odds 1.10 / 1.15 | H | [Zai 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12551501/), [context/03](../research/context/03-what-others-tried.md) |
| Time to treatment, public vs private/occupational route (lymphoma) | Median 127 vs 76 days (n=48 vs 39). The deck's 207 vs 123 days are the paper's Figure 1 figures; the medians in its test are 127 vs 76 (corrected 2026-11-14, see law/08 line 45). Income/education did not predict delay; route did | M (one small, industry-funded cohort) | [Kuitunen 2026](https://doi.org/10.1002/cam4.71920), [04-cause-map](04-cause-map.md) |
| Severe mental illness | Cancer death HR ~1.42–1.47, not explained by stage | H | [context/05 section 8](../research/context/05-vulnerable-groups.md) (paper link there) |
| Screening | African-born women cervical 46% vs 73% Finnish-born (corrected; link [source needed]); Somali-born 19% vs 67% (invited 2008–12, small study, [Idehen 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7663516)); Helsinki, Vantaa–Kerava, Länsi-Uusimaa named as lowest ([Espoo Sanomat](https://www.espoonsanomat.fi/2026/06/30/lansi-uusimaa-jai-syopaseulonnoissa-matalimpien-osallistumisalueiden-joukkoon/)), the <68% figure [source needed] | M | [context/05](../research/context/05-vulnerable-groups.md), [context/04](../research/context/04-regional-structure.md) |
| Regional speed | Lung surgery median 13.5 days after diagnosis (North) vs 46 days (South) | M | [context/02](../research/context/02-data-landscape.md) (checked in the PDF text, Table 4.1) |

## Issues and their causes

| # | Issue | Cause chain (rule or structure → behaviour → effect) | Pathway step (deck p.10) | Strength | Sources |
| --- | --- | --- | --- | --- | --- |
| 1 | **Two-speed entry into care** | Occupational care covers employees; Kela private reimbursement cut to €8/visit (2026) → low-income, unemployed and retired people use public primary care → slower first contact and referral | 3–5 | M | [Kela](https://www.kela.fi/ajankohtaista/yksityislaakarikayntien-kela-korvaukset-pienenevat-1.1.2026), [law/08](../research/law/08-inefficiencies.md) I-12, [04-cause-map](04-cause-map.md) C3 |
| 2 | **Slow public GP access** | GP shortage, county finances; legal limit for adults is 3 months (§51a) → only ~49–59% seen within 1–2 weeks; Vantaa–Kerava 44% within legal time vs >90% Pohjois-Karjala | 3–4 | H nationally, L for cancer link | [Finlex 1326/2010](https://www.finlex.fi/fi/lainsaadanto/2010/1326) (§51a), [04-cause-map](04-cause-map.md) C2, [context/04](../research/context/04-regional-structure.md) (44% figure: THL report, link [source needed]) |
| 3 | **Symptoms not taken seriously, repeated visits** | No cancer fast lane in primary care; "urgent" means acute deterioration ([§50](https://www.finlex.fi/fi/lainsaadanto/2010/1326)) → over half felt symptoms were not taken seriously, the cause was missed, or another cause was suspected (corrected); a third needed 3+ contacts | 4–5 | M (patient survey) | [S1](https://www.sttinfo.fi/tiedote/70972938/kyselyselvitys-joka-kolmas-syopapotilas-kokee-diagnoosin-viivastyneen?publisherId=69820264), [03-secondary-evidence](03-secondary-evidence.md) S1, [law/00](../research/law/00-synthesis.md) row 6 |
| 4 | **Most delay is inside the system, not the patient** | Lymphoma: 54 of 146 days before first contact, rest after → service steps dominate | 3–8 | M (one cohort) | Tokola 2025 (link [source needed]) via [04-cause-map](04-cause-map.md) |
| 5 | **Nobody owns or sees the total wait** | Separate legal clocks per step, no cancer-specific deadline, target days not in law; monitoring "has no adequate resources or funding" (strategy p.33); no time-to-diagnosis indicator | 3–8 | H (text) | [strategy p.33](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=33), [law/08](../research/law/08-inefficiencies.md) I-01/03/05, [context/01](../research/context/01-strategy-deep-read.md) |
| 6 | **Stage data mostly missing** | Reporting is a binding THL duty ([THL act §5 c](https://www.finlex.fi/fi/lainsaadanto/2008/668) + [THL decision 2023](https://syoparekisteri.fi/2024/04/16/thl-on-tehnyt-paatoksen-syoparekisteriin-toimitettavista-tiedoista/)), but stage completeness is only ~42% nationally (Pirkanmaa 72%, others 33–42%); no confirmed downstream fix; quality register has no 2027 money [source needed] → stage shift and equity in stage cannot be tracked by region | 6 | M (news-reported numbers; annex unread) | [Syöpäjärjestöt](https://www.syopajarjestot.fi/uutinen/syovan-levinneisyystiedoissa-suuria-alueellisia-eroja-suomessa/), [Syöpä 2024 factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html), [law/09](../research/law/09-stage-recording-law.md), [context/07](../research/context/07-stage-data-practice.md) |
| 7 | **Cost deters care** | Client fees, discretionary waivers, debt collection (asiakasmaksulaki) → 23% avoided care, 4 in 5 of them due to cost | 2–3 | M (patient survey) | [S2](https://www.verkkouutiset.fi/a/en-halua-tietaa-moni-pelkaa-etta-oireiden-taustalla-on-syopa/), [03-secondary-evidence](03-secondary-evidence.md) S2, [law/08](../research/law/08-inefficiencies.md) I-09 |
| 8 | **Uneven screening and no outreach duty** | County extras optional, no statutory outreach; language barriers → low uptake among migrants and some urban areas | Prevention / screening | M | [law/08](../research/law/08-inefficiencies.md) I-07/08 |
| 9 | **Medicines and treatment selection differ by county** | Each county decides on new hospital medicines; national recommendations not binding; Kela change 1.7.2026 on county-given drugs [source needed] | 7–8 | M | [law/00](../research/law/00-synthesis.md) row 4, [context/06](../research/context/06-stakeholders.md) |
| 10 | **Distance in the north and east** | Radiotherapy centralised (OYS only northern unit) → travel burden | 7–8 | M | [Kaleva 2022](https://www.kaleva.fi/oulun-yliopistollisen-sairaalan-sadehoidon-yksikko/5016745), [context/04](../research/context/04-regional-structure.md) |

## What others learned (so we don't repeat it)

- Fast-track pathways cut the first wait (Denmark −17 days) but leave treatment start slow; in Sweden they crowded out vulnerable patients ([context/03](../research/context/03-what-others-tried.md)).
- Navigation narrows but doesn't close gaps (US: 108 → 97 days vs 65; [context/03](../research/context/03-what-others-tried.md)).
- Almost no programme measures delay, stage and SES together. Source: [context/03](../research/context/03-what-others-tried.md).

## Direction B check

Glasses and free phone app both: **weak fit**. Prevention is Goal 2, not Goal 3; uptake and retention skew to the educated; no proof of behaviour change; outcomes take decades. Source: [glasses/09](../research/glasses/09-track-fit.md).

## Biggest unknowns

1. Total time from first symptom to treatment by county and income: no public data.
2. Whether missing stage is "not in chart" or "not sent to registry".
3. How much of the education survival gap remains after stage and treatment are adjusted for.
4. Cancer target days in THL Ohjaus 21/2016 (unreadable so far; PDF tried: [core.ac.uk](https://core.ac.uk/download/78470017.pdf)).
5. No Finnish study of GP referral decisions, patient delay reasons, or migrant delays.
