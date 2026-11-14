# County gap screen: data, indicators and actions

Written 2026-11-14. Feeds the County gap screen. Terms follow `GLOSSARY.md`. Plain English. Every number has a source link. `[unverified]` = we could not check it against the source.

## 0. Corrections (read first)

- **Stage: "41.9% of cancers have no stage" is wrong.** The registry factsheet says spread data (TNM, stage or free text) was recorded for **41.9%** of solid cancers nationally in 2024 (13,285 of 31,731). Missing: **58.1%** in its table (18,446). Its text says **59.1%**, which does not add up, so use 58.1%. Stage alone is 5.4%, and the three parts add to 40.8%, not 41.9%. Source: https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html
- **The public-route figure is not a route comparison.** "41 of 155 days in primary care" is a split of one lung-cancer delay. It has no public vs occupational comparison. The only route comparison we have is the lymphoma study (F18), which is national, not regional.
- **Pirkanmaa stage share is 71.9%** (factsheet). The "72%" in news reports is the same number, rounded.
- **Sisä-Suomi is a cooperation area, 60.4%** (factsheet). News reports call it "Central Finland". Use the factsheet.
- Lung figures (13.5 and 46 days) are **verified in the report text**. Both areas are cooperation areas, not counties.

## 1. Area levels

We never mix levels on one map. Each figure carries its level.

- **Wellbeing services county (WSC)**: one of the Finnish wellbeing services counties (hyvinvointialue).
- **Cooperation area**: a group of hospital districts used by the Cancer Registry (yhteistyöalue).
- **Hospital district / hospital unit**: a hospital's own area or unit.
- **Study sites**: the cities where one study recruited patients. Not a region.
- **National**: all of Finland, or a national study sample. Comparator only.
- **Unclear**: the source does not name the area level. Do not map these.

## 2. Figures the screen can show

Values are as published. `verified` = checked against the source text on 2026-11-14. Others are from our research files and are marked `[unverified]` or `[weak]`.

### A. Wellbeing services county

| ID | What it measures | Value | Area | Year | Source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| F01 | Stage (spread) data recorded, share of cancers | 71.9% | Pirkanmaa WSC | 2024 | [Cancer Registry factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html) | verified |
| F02 | Clinical cancer notifications to the registry, share of cancers | 42% (2022) to 80% (2024) | Pirkanmaa WSC | 2022–2024 | [Registry article, 26 Jun 2025](https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/) | verified |
| F03 | Screening participation, lowest areas (all programmes) | below 68% | Vantaa–Kerava, Länsi-Uusimaa, Helsinki (Helsinki is a city, not a WSC) | 2024 | [STT press release](https://www.sttinfo.fi/tiedote/72173590/kolme-aluetta-erottuu-edukseen-syopaseulonnoissa-helsingissa-osallistuminen-jaa-selvasti-jalkeen?lang=fi) | `[unverified]` exact number; gap of 7–14 points also from this release |
| F04 | Screening participation, range across all 23 WSCs, 2024 (colorectal 69.6–76.9%; breast 74.3–85.6%; cervical 68.0–82.3%) | ranges as listed | all WSCs (range) | 2024 | [Sotkanet, indicators 6103 and others](https://sotkanet.fi/rest/1.1/json?indicator=6103&genders=total&years=2024&regions=) | `[unverified]` (from research file) |
| F05 | Breast 5-year relative survival, range across WSCs | 84–94 | all WSCs (range) | 2024 | [Sotkanet, indicator 3625](https://sotkanet.fi/rest/1.1/json?indicator=3625&genders=total&years=2024&regions=) | `[unverified]` |
| F06 | Primary-care visit within legal time (adults) | 44% Vantaa–Kerava; over 90% Pohjois-Karjala | Vantaa–Kerava; Pohjois-Karjala | about 2024 | [Seura news](https://seura.fi/asiat/ajankohtaista/hoitotakuu-laakariin-paasy-nayttaa-hidastuneen/?shared=2112956-15018099-1) | `[weak]` news only; THL report not opened |

### B. Cooperation area

| ID | What it measures | Value | Area | Year | Source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| F07 | Stage (spread) data recorded, share of cancers | 60.4% | Sisä-Suomi cooperation area | 2024 | [Cancer Registry factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html) | verified |
| F08 | Median days from diagnosis to lung surgery (interquartile range 0.0–44.0) | 13.5 | North (Pohjois-Suomi) cooperation area | 2024 report, diagnosis years `[unverified]` | [Lung cancer report, Dec 2024 (PDF)](https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf) | verified |
| F09 | Median days from diagnosis to lung surgery (interquartile range 33.0–63.0) | 46.0 | South (Etelä-Suomi) cooperation area | 2024 report, diagnosis years `[unverified]` | [Lung cancer report, Dec 2024 (PDF)](https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf) | verified |

### C. Hospital district or hospital unit

| ID | What it measures | Value | Area | Year | Source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| F11 | Share of breast cancer patients with a clinical registry notification | 97% | TAYS (Tampere University Hospital), hospital unit in Pirkanmaa | 2025 article | [Registry article, 26 Jun 2025](https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/) | verified |
| F12 | Colorectal cancer, average surgery access time by stage (three values; stage order not given) | 19, 32 and 24 days | TYKS (Turku), hospital district | 2025 | [TYKS page](https://www.tyks.fi/potilaille-ja-laheisille/hoidot-ja-tutkimukset/syopa/suolistosyovan-hoitoonpaasyajat) | `[unverified]` page not opened |
| F13 | Colorectal cancer, radiotherapy access time (measure not defined in source) | 69 days | TYKS (Turku), hospital district | first half 2025 | [TYKS page](https://www.tyks.fi/potilaille-ja-laheisille/hoidot-ja-tutkimukset/syopa/suolistosyovan-hoitoonpaasyajat) | `[unverified]` |
| F14 | Cancer patients on the HUS waiting list (September 2025: 264, median 8 days; April 2026: 235, median 8 days) | 264 / 235 | HUS, hospital district | 2025–2026 | [HUS list, Sept 2025 (PDF)](https://www.hus.fi/sites/default/files/2025-10/hoitoa-odottavat-potilaat-erikoisaloittain-2025-syyskuu.pdf) | `[unverified]` snippet only |
| F15 | Share of new drug use in cancer care, by hospital | HYKS/TYKS 91%; KYS 81% | HYKS/TYKS and KYS, hospital units | 2024 | [Dosis 2024 (PDF)](https://dosis.fi/wp-content/uploads/2024/09/240_Dosis_324_Huttu.pdf) | `[weak]` search excerpt only |

### D. Study sites and national comparators (not regional)

| ID | What it measures | Value | Area | Year | Source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| F16 | **Lung cancer delay, split by setting (no route comparison).** Average time from symptoms to treatment, with split: over 50 days patient side; 41 days primary care; 58 days specialised care | 155 total; 41 primary care | 4 study cities (Kuopio, Tampere, Turku, Rovaniemi). Study sites, not regions | article 2025; study year `[unverified]` | [Yle MOT](https://yle.fi/a/74-20251023) (unpublished study by Outi Kuittinen, University of Eastern Finland) | verified in article text; **unpublished** |
| F17 | **Public vs occupational/private route, lymphoma.** Time from symptoms to treatment. Figure 1 of the paper; the paper's test gives medians 127 vs 76 days (p = 0.027) | 207 public vs 123 occupational/private days | Finland, one study sample (n = 160) | 2026 | [Kuitunen 2026, DOI](https://doi.org/10.1002/cam4.71920) | `[unverified]` from research file |
| F18 | Lymphoma: days before first contact with health care, out of total (same patients as F17) | 54 of 146 | Finland, one study sample | 2025 | [Tokola 2025, DOI](https://doi.org/10.1002/cam4.71409) | `[unverified]` |
| F19 | Share of solid cancers with spread data (TNM, stage or free text) recorded, national. Table says 58.1% missing; text says 59.1% | 41.9% | Finland | 2024 | [Cancer Registry factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html) | verified |
| F20 | Lung cancer, national waits: 14 days to a health-centre visit; 2–4 weeks to a specialist; 4 weeks to diagnosis | as listed | Finland | 2026 (IHE dashboard) | no URL in file | `[unverified]` |
| F21 | Lung cancer, symptoms to treatment, comparators | Finland 155; Sweden 107; Denmark 67 days | Finland, Sweden, Denmark | not given | [Yle MOT](https://yle.fi/a/74-20251023) for Finland; Sweden and Denmark no URL in file | `[unverified]` |
| F22 | Breast cancer screening participation, national | 81.6% (preliminary) | Finland | 2024 | [STT press release](https://www.sttinfo.fi/tiedote/72173590/kolme-aluetta-erottuu-edukseen-syopaseulonnoissa-helsingissa-osallistuminen-jaa-selvasti-jalkeen?lang=fi) | `[unverified]` |
| F23 | Non-urgent doctor visits within 1 week, national (regions: 37–57%, regions not named) | 49% | Finland | spring 2023 | [THL via STT](https://www.sttinfo.fi/tiedote/69981865/terveysasemien-kiireettomista-laakarikaynneista-vain-puolet-toteutui-viikossa-kevaalla-2023?publisherId=69817778) | `[unverified]`; regional range has **unclear** area level, do not map |
| F24 | Head and neck cancer, no referral and no follow-up at first visit (1996 cohort, 221 patients); 3-year death risk HR 1.89 (95% CI 1.03–3.45) | 20% (45 of 221); HR 1.89 | Oulu and Kuopio, study sites | 1996 cohort, published 2006 | [Alho et al., CMAJ 2006](https://www.cmaj.ca/content/174/6/779) | `[weak]` snippet, old data |

## 3. Goal 3 indicators

Names are the strategy's own text. Source: *Kansallinen syöpästrategia 2026–2035* (`https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf`). The extracted PDF text has no printed codes, so the labels G3-1 to G3-5 are ours.

| ID | Indicator (Finnish, exact) | English | Page | Ties to figures | What the figures show |
| --- | --- | --- | --- | --- | --- |
| G3-1 | "Potilaat pääsevät hoitoon tavoiteaikojen puitteissa" | Patients get treatment within target times | 5 (headline), 33 (measure) | F12, F13, F14, F16, F20 | No county cancer wait is published against the 6-week guidance. These are proxies. |
| G3-2 | "Alueelliset ja sosioekonomiset erot syövän ilmaantuvuudessa, hoidossa ja syöpäkuolleisuudessa ovat käytettävissä palvelutoiminnassa ja niillä ohjataan toimintaa" | Regional and socioeconomic differences in incidence, treatment and cancer death are used to steer services | 5 (Yhdenvertaisuus) | F08, F09, F07, F01, F02 | Lung surgery is 13.5 days in the North and 46 in the South. |
| G3-3 | "Saatavilla on luotettavaa tietoa syövän diagnostiikka- ja hoitokäytäntöjen alueellisista eroista, minkä avulla voidaan kaventaa eroja hoitotuloksissa" | Reliable data on regional differences in diagnosis and treatment, to narrow outcome gaps | 36 (3.2) | F08, F09, F07, F19 | Our figures show the gap. The strategy asks for this data. |
| G3-4 | "Kliinisten syöpäilmoitusten määrä (tavoitteena 90 % tapauksista automatisoidusti vuoteen 2030 mennessä)" | Clinical cancer notifications: target 90% automated by 2030 | 36 (3.2) | F02, F01, F07, F11, F19 | Pirkanmaa rose from 42% to 80%. The national spread-data share is 41.9%. |
| G3-5 | "Laaturekisterin tietopohja (ml. levinneisyystieto) … (tietopohjan kattavuus 90 %)" | Registry data, including spread data, with 90% coverage | 36 (3.2) | F01, F07, F19 | Spread data recorded for 41.9% nationally. |

Not Goal 3: the Goal 2 bullet "Vähintään 70 % syövistä diagnosoidaan levinneisyysluokissa I–II" (at least 70% of cancers diagnosed at stage I–II, p. 5) is prevention and early detection. Do not cite it as Goal 3.

Targets are not measured values. They are shown in the indicator text only, never as a figure.

## 4. What a county does next

Each action names the county's own lever. Where the lever is a cooperation area, say so.

| ID | Action | Figure it answers | Source |
| --- | --- | --- | --- |
| A1 | **Structured lung referral template** with required stage and spread fields and a route field (public, occupational, private). Track primary-care days by route. | F16: 41 of 155 days in primary care. F17: route comparison, lymphoma (one national study). | [Yle MOT](https://yle.fi/a/74-20251023); route gap [Kuitunen 2026](https://doi.org/10.1002/cam4.71920) `[unverified]`; referral template evidence from Leeds, [PMC5697536](https://pmc.ncbi.nlm.nih.gov/articles/PMC5697536) `[unverified here]` |
| A2 | **Stage recording at diagnosis entry**, using Pirkanmaa's workflow (built with the registry). Set the county target at 90% automated notification by 2030. | F02: Pirkanmaa 42% to 80%. F19: national spread data recorded 41.9%. | [Registry article, 26 Jun 2025](https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/); strategy p. 36 (G3-4) |
| A3 | **Set a county cancer wait clock** against the 6-week guidance and publish it monthly. Put the target in county agreements. | F12, F13, F14, F16 (proxies only; no published county waits). | Strategy p. 33 (G3-1); STM 2010:6 guidance and THL Ohjaus 21/2016 `[unverified]`, [STM 2010:6](https://www.iccp-portal.org/system/files/plans/selv_2010_6_syovan_hoito_verkko.pdf) |
| A4 | **Review lung surgery scheduling in the South** (Etelä-Suomi cooperation area), using the North (Pohjois-Suomi) as comparator. Check patient mix first. | F08 (13.5 days) and F09 (46 days). Cooperation areas, not counties. | [Lung cancer report](https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf) |

## 5. JSON for the screen

```json
{
  "figures": [
    {"id":"F01","label":"Stage (spread) data recorded","value":"71.9","unit":"%","area":"Pirkanmaa","areaLevel":"wellbeing services county","year":"2024","source":{"label":"Cancer Registry factsheet 2024","url":"https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html"}},
    {"id":"F02","label":"Clinical cancer notifications to the registry","value":"42 to 80","unit":"%","area":"Pirkanmaa","areaLevel":"wellbeing services county","year":"2022-2024","source":{"label":"Cancer Registry article, 26 Jun 2025","url":"https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/"}},
    {"id":"F03","label":"Screening participation, lowest areas [unverified number]","value":"below 68","unit":"%","area":"Vantaa-Kerava, Lansi-Uusimaa, Helsinki (city)","areaLevel":"wellbeing services county","year":"2024","source":{"label":"STT press release on screening","url":"https://www.sttinfo.fi/tiedote/72173590/kolme-aluetta-erottuu-edukseen-syopaseulonnoissa-helsingissa-osallistuminen-jaa-selvasti-jalkeen?lang=fi"}},
    {"id":"F04","label":"Screening participation, range across WSCs [unverified]","value":"colorectal 69.6-76.9; breast 74.3-85.6; cervical 68.0-82.3","unit":"%","area":"all WSCs (range)","areaLevel":"wellbeing services county","year":"2024","source":{"label":"Sotkanet (THL)","url":"https://sotkanet.fi/rest/1.1/json?indicator=6103&genders=total&years=2024&regions="}},
    {"id":"F05","label":"Breast 5-year relative survival, range [unverified]","value":"84-94","unit":"%","area":"all WSCs (range)","areaLevel":"wellbeing services county","year":"2024","source":{"label":"Sotkanet indicator 3625 (THL)","url":"https://sotkanet.fi/rest/1.1/json?indicator=3625&genders=total&years=2024&regions="}},
    {"id":"F06","label":"Primary-care visit within legal time [weak, news]","value":"44 Vantaa-Kerava; over 90 Pohjois-Karjala","unit":"%","area":"Vantaa-Kerava; Pohjois-Karjala","areaLevel":"wellbeing services county","year":"about 2024","source":{"label":"Seura news","url":"https://seura.fi/asiat/ajankohtaista/hoitotakuu-laakariin-paasy-nayttaa-hidastuneen/?shared=2112956-15018099-1"}},
    {"id":"F07","label":"Stage (spread) data recorded","value":"60.4","unit":"%","area":"Sisa-Suomi","areaLevel":"cooperation area","year":"2024","source":{"label":"Cancer Registry factsheet 2024","url":"https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html"}},
    {"id":"F08","label":"Median days, diagnosis to lung surgery (IQR 0.0-44.0)","value":"13.5","unit":"days","area":"North (Pohjois-Suomi)","areaLevel":"cooperation area","year":"2024 report","source":{"label":"Lung cancer report, Dec 2024","url":"https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf"}},
    {"id":"F09","label":"Median days, diagnosis to lung surgery (IQR 33.0-63.0)","value":"46.0","unit":"days","area":"South (Etela-Suomi)","areaLevel":"cooperation area","year":"2024 report","source":{"label":"Lung cancer report, Dec 2024","url":"https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf"}},
    {"id":"F11","label":"Breast cancer patients with clinical notification","value":"97","unit":"%","area":"TAYS (Tampere University Hospital)","areaLevel":"hospital district","year":"2025 article","source":{"label":"Cancer Registry article, 26 Jun 2025","url":"https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/"}},
    {"id":"F12","label":"Colorectal surgery access time by stage [unverified]","value":"19, 32, 24","unit":"days","area":"TYKS (Turku)","areaLevel":"hospital district","year":"2025","source":{"label":"TYKS colorectal access times","url":"https://www.tyks.fi/potilaille-ja-laheisille/hoidot-ja-tutkimukset/syopa/suolistosyovan-hoitoonpaasyajat"}},
    {"id":"F13","label":"Colorectal radiotherapy access time [unverified]","value":"69","unit":"days","area":"TYKS (Turku)","areaLevel":"hospital district","year":"first half 2025","source":{"label":"TYKS colorectal access times","url":"https://www.tyks.fi/potilaille-ja-laheisille/hoidot-ja-tutkimukset/syopa/suolistosyovan-hoitoonpaasyajat"}},
    {"id":"F14","label":"Cancer patients on waiting list [unverified]","value":"264 (Sep 2025, median 8 days); 235 (Apr 2026, median 8 days)","unit":"patients","area":"HUS","areaLevel":"hospital district","year":"2025-2026","source":{"label":"HUS waiting list, Sep 2025","url":"https://www.hus.fi/sites/default/files/2025-10/hoitoa-odottavat-potilaat-erikoisaloittain-2025-syyskuu.pdf"}},
    {"id":"F15","label":"Share of new cancer drug use [weak]","value":"HYKS/TYKS 91; KYS 81","unit":"%","area":"HYKS/TYKS; KYS","areaLevel":"hospital district","year":"2024","source":{"label":"Dosis 2024","url":"https://dosis.fi/wp-content/uploads/2024/09/240_Dosis_324_Huttu.pdf"}},
    {"id":"F16","label":"Lung delay by setting: symptom to treatment (unpublished study)","value":"155 total; 41 primary care; 58 specialised; over 50 patient side","unit":"days","area":"Kuopio, Tampere, Turku, Rovaniemi (study cities)","areaLevel":"study sites","year":"2025 (article)","source":{"label":"Yle MOT","url":"https://yle.fi/a/74-20251023"}},
    {"id":"F17","label":"Public vs occupational/private route, lymphoma [unverified]","value":"207 public vs 123 occupational/private","unit":"days","area":"Finland, one study sample (n=160)","areaLevel":"national","year":"2026","source":{"label":"Kuitunen 2026","url":"https://doi.org/10.1002/cam4.71920"}},
    {"id":"F18","label":"Lymphoma, days before first contact [unverified]","value":"54 of 146","unit":"days","area":"Finland, one study sample","areaLevel":"national","year":"2025","source":{"label":"Tokola 2025","url":"https://doi.org/10.1002/cam4.71409"}},
    {"id":"F19","label":"Stage (spread) data recorded, national","value":"41.9","unit":"%","area":"Finland","areaLevel":"national","year":"2024","source":{"label":"Cancer Registry factsheet 2024","url":"https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html"}},
    {"id":"F20","label":"Lung waits, national: GP visit 14 days; specialist 2-4 weeks; diagnosis 4 weeks [unverified]","value":"14 days; 2-4 weeks; 4 weeks","unit":"time","area":"Finland","areaLevel":"national","year":"2026","source":{"label":"IHE dashboard (no URL in file)","url":""}},
    {"id":"F21","label":"Lung symptom to treatment, country comparison [unverified]","value":"Finland 155; Sweden 107; Denmark 67","unit":"days","area":"Finland, Sweden, Denmark","areaLevel":"national","year":"unclear","source":{"label":"Yle MOT (Finland only)","url":"https://yle.fi/a/74-20251023"}},
    {"id":"F22","label":"Breast screening participation [unverified]","value":"81.6","unit":"%","area":"Finland","areaLevel":"national","year":"2024","source":{"label":"STT press release on screening","url":"https://www.sttinfo.fi/tiedote/72173590/kolme-aluetta-erottuu-edukseen-syopaseulonnoissa-helsingissa-osallistuminen-jaa-selvasti-jalkeen?lang=fi"}},
    {"id":"F23","label":"Non-urgent doctor visit within 1 week [unverified; regions unnamed]","value":"49 (regions 37-57)","unit":"%","area":"Finland","areaLevel":"national","year":"spring 2023","source":{"label":"THL via STT","url":"https://www.sttinfo.fi/tiedote/69981865/terveysasemien-kiireettomista-laakarikaynneista-vain-puolet-toteutui-viikossa-kevaalla-2023?publisherId=69817778"}},
    {"id":"F24","label":"Head and neck, no referral at first visit [weak, 1996 cohort]","value":"20 (45 of 221); HR 1.89 death risk at 3 years","unit":"%","area":"Oulu and Kuopio (study sites)","areaLevel":"study sites","year":"1996 cohort, published 2006","source":{"label":"Alho et al., CMAJ 2006","url":"https://www.cmaj.ca/content/174/6/779"}}
  ],
  "indicators": [
    {"id":"G3-1","name":"Potilaat pääsevät hoitoon tavoiteaikojen puitteissa","english":"Patients get treatment within target times","goal":3,"strategyPage":"5, 33","figureIds":["F12","F13","F14","F16","F20"],"note":"No county cancer wait is published against the 6-week guidance. Figures are proxies."},
    {"id":"G3-2","name":"Alueelliset ja sosioekonomiset erot syövän ilmaantuvuudessa, hoidossa ja syöpäkuolleisuudessa ovat käytettävissä palvelutoiminnassa ja niillä ohjataan toimintaa","english":"Regional and socioeconomic differences in incidence, treatment and cancer death are used to steer services","goal":3,"strategyPage":"5","figureIds":["F01","F02","F07","F08","F09"],"note":""},
    {"id":"G3-3","name":"Saatavilla on luotettavaa tietoa syövän diagnostiikka- ja hoitokäytäntöjen alueellisista eroista, minkä avulla voidaan kaventaa eroja hoitotuloksissa","english":"Reliable data on regional differences in diagnosis and treatment, to narrow outcome gaps","goal":3,"strategyPage":"36","figureIds":["F07","F08","F09","F19"],"note":""},
    {"id":"G3-4","name":"Kliinisten syöpäilmoitusten määrä (tavoitteena 90 % tapauksista automatisoidusti vuoteen 2030 mennessä)","english":"Clinical cancer notifications, target 90% automated by 2030","goal":3,"strategyPage":"36","figureIds":["F01","F02","F07","F11","F19"],"note":"Target, not a measured value."},
    {"id":"G3-5","name":"Laaturekisterin tietopohja (ml. levinneisyystieto), kattavuus 90 %","english":"Registry data incl. spread data, 90% coverage","goal":3,"strategyPage":"36","figureIds":["F01","F07","F19"],"note":"Target, not a measured value."}
  ],
  "actions": [
    {"id":"A1","action":"Structured lung referral template with required stage and spread fields and a route field (public, occupational, private). Track primary-care days by route.","figureIds":["F16","F17"],"areaLevel":"wellbeing services county","source":{"label":"Yle MOT","url":"https://yle.fi/a/74-20251023"}},
    {"id":"A2","action":"Stage recording at diagnosis entry, using the Pirkanmaa workflow. County target: 90% automated notification by 2030.","figureIds":["F02","F19"],"areaLevel":"wellbeing services county","source":{"label":"Cancer Registry article, 26 Jun 2025","url":"https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/"}},
    {"id":"A3","action":"Set a county cancer wait clock against the 6-week guidance and publish it monthly. Put the target in county agreements.","figureIds":["F12","F13","F14","F16"],"areaLevel":"wellbeing services county","source":{"label":"Strategy 2026-2035, p. 33","url":"https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf"}},
    {"id":"A4","action":"Review lung surgery scheduling in the South (Etela-Suomi). Use the North as comparator. Check patient mix first.","figureIds":["F08","F09"],"areaLevel":"cooperation area","source":{"label":"Lung cancer report, Dec 2024","url":"https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf"}}
  ]
}
```

## 6. Gaps we could not fill

- County-level cancer waiting times (referral to treatment): none published. Proxies only.
- Stage by county beyond Pirkanmaa and Sisä-Suomi. The factsheet covers only those two areas in our notes.
- Lung report diagnosis years: the PDF text does not state them. Our research file says 2019–2023 `[unverified]`.
- Registry factsheet and lung PDF: WebFetch returns 403, but curl downloads them. Text checked with pdftotext and grep.
- The 1996 head and neck figures are old and from one city pair. Use only as a note.
- The route gap is national and in one lymphoma study (F17). No county route data exists.
- The IHE lung-wait dashboard and the Sweden and Denmark comparators have no link in our files.
- The Goal 3 numbering (G3-1 to G3-5) is ours. The strategy text has no printed codes in the extracted PDF.
