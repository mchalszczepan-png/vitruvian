# 02 – Data landscape: cancer care, equity and access in Finland

Date: 2026-11-14. Research only. Folder: `docs/research/context/`.
Method: two Haiku sweeps (Sotkanet/Statistics Finland/THL; registries/Findata/Kela/Junction), plus my own HTTP and API checks on the key URLs. Items marked **UNVERIFIED** were not opened or called by anyone. Items marked **[source needed]** have no source yet.

Strategy PDF used for quotes: https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf (page = PDF page).

Terms: **HV** = wellbeing county (hyvinvointialue). **Sotkanet id** = THL indicator number. **eshjono** = THL waiting-queue data cube. **PxWeb** = Statistics Finland / THL table API. **CC BY** = Creative Commons Attribution 4.0 (free reuse with credit).

---

## 1. Bottom line

- **The claim "no public county cancer waiting data" mostly holds.** No cancer-specific waiting or referral-time series by county was found. The Sotkanet catalogue was read in full (3,797 indicators, https://sotkanet.fi/rest/1.1/indicators). My title filter found 48 waiting or access indicators, not the 73 in the earlier note (not reproduced). None of them is cancer-titled.
- **The claim is too broad as written.** Open, machine-readable county data exists for cancer screening, survival, cancer incidence index, oncology visits, cancer-drug entitlements and cancer deaths (checked by me, see section 3a).
- **The closest pathway-timing evidence is a PDF.** The Syöpärekisteri lung report gives diagnosis-to-surgery medians by cooperation area: 13.5 days in the North vs 46 days in the South (checked in the PDF text, section 4.1 of the report, https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf).
- **Earlier notes are out of date.** 07-verification.md read only the first ~200,000 characters of Sotkanet (ids up to 707). Most cancer indicators sit above that cut-off. See section 6. [source needed: 07-verification.md is not in this folder; the file closest by name is 07-stage-data-practice.md.]

---

## 2. What was checked

| Check | Result |
| --- | --- |
| HTTP status, about 90 URLs | 200 for most. 404 for guessed THL, Sampo and Syöpärekisteri paths (listed in section 6) |
| Sotkanet API, indicators 5083, 2475, 5643, 3625, 6103 | 200, JSON, values returned (checked by me), e.g. https://sotkanet.fi/rest/1.1/json?indicator=6103&genders=total&years=2024&regions= |
| Sotkanet regions list (HV = HYVINVOINTIALUE) | 23 HVs, https://sotkanet.fi/rest/1.1/regions (checked by me) |
| THL eshjono queue JSON (`fact_eshjono_jonotilanne.json`) | 200, 39 KB (checked by me), https://sampo.thl.fi/pivot/prod/api/eshjono/jonotilanne/fact_eshjono_jonotilanne.json |
| Syöpärekisteri breast screening page (`stats.cancerregistry.fi/joukkistilastot/rinta.html`) | Page contains "Hyvinvointialue" and "Koulutus" dimensions and CSV export labels (checked by me) |
| Syöpärekisteri lung report PDF | Text contains the 13.5 / 46-day medians by cooperation area (checked by me via text extraction, https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf) |
| Kela reimbursement-rights dataset page on avoindata.fi | 200, licence CC BY 4.0 (checked by me), https://www.avoindata.fi/data/fi/dataset/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet |
| Eurostat `hlth_cd_asdr2` (cancer mortality, NUTS2) | 200, JSON-stat (checked by me) |
| Findata permit page | Data controllers have 15 working days to reply. Each extraction step can take up to 30 working days, up to 90 in total. Target delivery is 60 working days (checked by me, https://findata.fi/en/permits/) |
| Junction link pack PDF (`files.hackjunction.app/resources/Syöpästrategiat ja syöpädata_linkkikokoelma.pdf`) | 200 (https://files.hackjunction.app/resources/Syöpästrategiat%20ja%20syöpädata_linkkikokoelma.pdf). Lists sources but has no embedded hyperlinks in the PDF text |

---

## 3. Dataset table

Main columns as asked. "Verified" says what was checked: **me** = my own call or page read; **Haiku** = sweep result, not re-checked by me.

### 3a. Cancer-specific data

| # | Dataset | Owner | URL | What it contains | Granularity | Years | Format / API | Licence | Open / permit | Use for cancer-care inequity | Verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Screening participation: breast, cervical, colorectal (joukkistilastot) | Finnish Cancer Registry (Syöpärekisteri) | https://stats.cancerregistry.fi/joukkistilastot/rinta.html (also `kohtu.html`) | Participation by HV, cooperation area, municipality, education, age | HV, cooperation area, municipality | 2018–2024 (2024 preliminary) [source needed] | Interactive pages, CSV export on page | UNVERIFIED [source needed] | Open | **High.** Education gap by county. Target is 80% in every HV (strategy Goal 2, [p. 5](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=5) and [p. 29](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=29)) | me (page), Haiku (values) |
| 2 | Lung cancer report 2019–2023 (diagnosis-to-treatment times) | Syöpärekisteri, THL, FICAN | https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf (HTML factsheet: `keuhkosyoparaportti.html`) | Median days diagnosis to first treatment: surgery 13.5 days North vs 46 days South (section 4.1 of the report, p. 26). 6-month treatment mix by HV (Table 3.7) [source needed for Table 3.7] | Cooperation area (timing); HV (treatment mix) | 2019–2023 | PDF and HTML | UNVERIFIED for licence [source needed] | Open | **High.** Only verified pathway-timing gap by region. Not a machine-readable dataset | me |
| 3 | Myeloma quality report | Syöpärekisteri, THL, FICAN | https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html | Incidence, treatment and survival by HV and cooperation area. Page has Excel export labels | HV, cooperation area | Year [source needed] | HTML tables, Excel export | UNVERIFIED [source needed] | Open | Med–high. Explicit regional differences, one cancer type | me (200, 10 MB page), Haiku (content) |
| 4 | Cancer statistics app (incidence, survival, stage) | Syöpärekisteri | https://tilastot.syoparekisteri.fi/syovat/ | Incidence, survival, stage. Filters are client-side [source needed] | HV likely [source needed] | [source needed] | Shiny app | [source needed] | Open | Med, once checked in a browser | me (shell only, 24 KB) |
| 5 | Clinical notification completeness app | Syöpärekisteri | https://tilastot.syoparekisteri.fi/syopalaatu/ | Share of notifications by treating unit. Data completeness, not care quality [source needed] | HV, cooperation area | [source needed] | Shiny app | [source needed] | Open | Low | Haiku |
| 6 | Screening attendance: colorectal (6103), breast (3621), cervical (3620) | THL (Sotkanet) | https://sotkanet.fi/rest/1.1/json?indicator=6103&genders=total&years=2024&regions= (same pattern for 3621, 3620) | % attending screening | HV (22–23 units) | Colorectal 2022–24; breast 1992–2024; cervical 1991–2024 (Haiku) | JSON API | CC BY 4.0 (see licence note in section 6) | Open | **High.** Easy API. 2024 range: colorectal 69.6–76.9%, breast 74.3–85.6%, cervical 68.0–82.3% | me (6103 200 JSON), me (2024 ranges) |
| 7 | 5-year relative survival: breast (3625), cervix (3626), colon (3627) | THL (Sotkanet) | https://sotkanet.fi/rest/1.1/json?indicator=3625&genders=total&years=2024&regions= | Cancer survival by HV. The 2024 call returns all 23 HVs, values 84–94 (checked by me) | HV | 2019–2024 (Haiku) | JSON API | CC BY 4.0 (see licence note in section 6) | Open | **High** as outcome measure. Coverage open check closed for 2024 (earlier 2023 call returned only 1.9 KB) | me (200, 2024 complete), Haiku (years) |
| 8 | Cancer index, age-standardised (5643) | THL (Sotkanet) | https://sotkanet.fi/rest/1.1/json?indicator=5643&genders=total&years=2024&regions= | Cancer index. Meaning [source needed] (probably incidence vs national average = 100). 2024 values 79.4–116.7 across 23 HVs (checked by me) | HV (23); 292 municipalities in 2023 [source needed] | 2017–2024 | JSON API | CC BY 4.0 (see licence note in section 6) | Open | Med. Read the codebook first | me (200, 26 KB; 2024 range) |
| 9 | Specialised outpatient visits, oncology and radiotherapy (2475) | THL (Sotkanet) | https://sotkanet.fi/rest/1.1/json?indicator=2475&genders=total&years=2023&regions= | Visits per 1,000 or counts (unit [source needed]) | HV, municipality | 1994–2024 (Haiku) | JSON API | CC BY 4.0 (see licence note in section 6) | Open | **High** for cancer-care access (volume, not waiting) | me (200, 37 KB) |
| 10 | Share entitled to cancer special-reimbursement drugs (5395) | THL / Kela (Sotkanet) | Sotkanet indicator 5395 [source needed for URL] | % entitled | HV | 2017–2025 (Haiku) | JSON API | CC BY 4.0 [source needed] | Open | Med. Values 1.5–2.6% [source needed] | Haiku |
| 11 | Special-reimbursement rights: valid, new and ended (lääkekorvausoikeudet) | Kela (via avoindata.fi) | https://www.avoindata.fi/data/fi/dataset/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet | Counts by reimbursement code (e.g. 115 Rintasyöpä, 116 Eturauhassyöpä, targeted drugs [source needed for codes]), HV number, age group, sex. About 1.73 M rows (1,729,931 lines in the CSV checked by me), file about 181 MB (181,674,661 bytes, checked by me) | HV, age, sex | 1986–2025 (Haiku) | CSV | CC BY 4.0 (checked by me on the avoindata page) | Open | **High.** Access to cancer drugs by county. Counts of entitlements, not patients treated. Small-cell suppression [source needed] | me (page, licence, file size, line count) |
| 12 | Cancer deaths by cause and HV (table 13u5) | Statistics Finland (PxWeb) | POST https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px | Deaths by 65 causes [source needed] incl. all cancers, colon, rectum, lung, breast, cervix, uterus, prostate, lymphoid. Crude rates too | HV (23) and country | 1969–2025 (Haiku) | PxWeb JSON / CSV | CC BY 4.0 [source needed] | Open | **High.** Best county cancer-outcome table (mortality). Rate limit: 429 on bursts | Haiku (200, CSV pulled) |
| 13 | Causes of death, standardised rate, cancer C00–C97 (hlth_cd_asdr2) | Eurostat | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/hlth_cd_asdr2?geo=FI&sex=T&age=TOTAL&icd10=C00-C97&unit=RT&time=2021 | Standardised cancer mortality | NUTS2 (5 Finnish regions [source needed]) | 2011–2023 (Haiku) | JSON-stat API | Eurostat reuse [source needed] | Open | Med. Cross-country comparison, not county | me (200, JSON-stat) |

### 3b. Access, waiting and non-cancer proxies

| # | Dataset | Owner | URL | What it contains | Granularity | Years | Format / API | Licence | Open / permit | Use for inequity | Verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 14 | Waiting queue, all specialties (eshjono/jonotilanne) | THL (Sampo) | https://sampo.thl.fi/pivot/prod/api/eshjono/jonotilanne/fact_eshjono_jonotilanne.json | Patients awaiting treatment or needs assessment, monthly [source needed]. Total 121,790 at 30.09.2026 (all counties, 20 producers, checked by me). No cancer split in JSON | HV, HUS, Helsinki (about 20 producers) | 2007–2026 [source needed] (latest 30.09.2026) | JSON-stat | CC BY 4.0 [source needed] (page footer, Haiku) | Open | **High** as general waiting proxy. Check the HTML cube for an oncology queue group | me (200, 39 KB; 121,790 total), Haiku (series) |
| 15 | Referrals by specialty, queue groups, psychiatry (eshjono/lahete, jonoryhma, psykiatria) | THL (Sampo) | https://sampo.thl.fi/pivot/prod/api/eshjono/lahete.json; …/jonoryhma/fact_eshjono_jonoryhma.json | Referrals by specialty; queue groups | HV | 2008–2026 / 2016–2026 (Haiku) | JSON-stat | CC BY 4.0 [source needed] | Open | Med–high. Specialty split not in exported JSON | Haiku (200) |
| 16 | Median wait for specialised care, 31 Dec (5083) | THL (Sotkanet) | https://sotkanet.fi/rest/1.1/json?indicator=5083&genders=total&years=2022&regions= | Median wait, all specialties. Not cancer. Notes say not updated [source needed] | Hospital district (about 20) | 2017–2022 (Haiku) | JSON API | CC BY 4.0 [source needed] | Open | Med. Closest county wait measure, but stale and not cancer. Units probably days [source needed] | me (200), Haiku (metadata) |
| 17 | Access proxies: referrals within 3 days (13), non-urgent specialised periods (3057), GP wait over 3 months (6410), GP wait over 7 days (2497, 2676) | THL (Sotkanet) | Sotkanet ids as given (https://sotkanet.fi/rest/1.1/json?indicator=N&genders=total&years=Y&regions=) | Speed of referral and waits, all care | HV | Up to 2024–2025 [source needed] | JSON API | CC BY 4.0 [source needed] | Open | Proxy only. Not cancer | Haiku |
| 18 | Specialised outpatient and inpatient care volumes (1257–1261, 1560, 2465–2484) | THL (Sotkanet) | Sotkanet ids as given | Volumes by specialty, per 1,000 [source needed] | HV | Mostly 1994–2024 (Haiku) | JSON API | CC BY 4.0 [source needed] | Open | Med. Use for oncology visit volumes (see row 9) | Haiku (catalogue) |
| 19 | Socio-economic: education level (180), unemployment (181), child poverty (228) | THL (Sotkanet) | Sotkanet ids as given | Equity axes by HV. Education measure (180) definition [source needed] | HV | 1990–2025 / 1991–2025 / 1995–2024 (Haiku) | JSON API | CC BY 4.0 [source needed] | Open | **High** as the "why" axis, same geography as cancer data. Unemployment 5.2–14.7%; child poverty 9.7–16.8% [source needed] | Haiku |
| 20 | Education 15+ (12bs) | Statistics Finland (PxWeb) | POST https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/vkour/12bs.px | Education shares (e.g. without upper secondary) | Municipality (308), maakunta (19) [source needed]. No HV code | 2007–2025 (Haiku) | PxWeb | CC BY 4.0 (UNVERIFIED) [source needed] | Open | Med. Needs municipality-to-HV mapping | Haiku (200) |
| 21 | Income: median disposable income, Gini, poverty (14ww) | Statistics Finland (PxWeb) | POST https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/tjt/14ww.px | Income level and inequality | Municipality, seutukunta, maakunta. No HV code [source needed] | 1995–2024 (Haiku) | PxWeb | CC BY 4.0 (UNVERIFIED) [source needed] | Open | Med. Needs mapping | Haiku (200) |
| 22 | Pathway and access report, primary care (Hoitoonpääsytiedon tietotuotanto, final report) | Innokylä / THL | https://www.innokyla.fi/sites/default/files/2026-07/Hoitoonpääsytiedon%20tietotuotanto%20-projektin%20loppuraportti.pdf | Access data from Avohilmo, Kanta pilot. Primary care focus. Zero hits for "syöp" [source needed] | County (reporting) | 2024–2026 (Haiku) | PDF | UNVERIFIED [source needed] | Open | Med. Read its data list to find any waiting-time source | me (206 on range request), Haiku |

### 3c. Permit, governance and comparison sources

| # | Dataset / route | Owner | URL | What it contains | Granularity | Years | Format / API | Licence | Open / permit | Use for inequity | Verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 23 | Findata permit route (record-level and linked data: Kanta, THL, Syöpärekisteri, Kela) | Findata | https://findata.fi/en/permits/ | Permit process and timelines (see section 2). Fees: normal data permit EUR 1,600 and data request EUR 2,600 for EU/EEA applicants, per https://findata.fi/en/pricing/ and https://findata.fi/en/news/findatas-service-and-permit-fees-will-change-in-2026/. Non-EU permit EUR 3,000 is from the 2024 fee news (https://findata.fi/en/news/findatas-service-and-decision-fees-will-change-in-2024-cheaper-prices-for-researcher-driven-research/); 2026 non-EU fee [source needed] | Record-level | - | Permit | - | Permit | Needed for any linked or county-to-county record data. Not for this demo | me (timelines, fees from Findata pages), Haiku (non-EU fee) |
| 24 | Syöpärekisteri publication (survival and mortality, nationally and by region, yearly) | Syöpärekisteri | https://syoparekisteri.fi/tilastot/ | The strategy says the registry publishes survival and cancer mortality nationally and regionally every year ([p. 35](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=35)). The specific page was not found | National, region | - | HTML | UNVERIFIED [source needed] | Open | Med. Check where the regional survival tables sit | me (strategy text) |
| 25 | Nordic cancer comparison (NORDCAN) | IARC | https://nordcan.iarc.fr/en/dataset | Incidence, survival, mortality for Nordic countries. Strategy footnote uses 2023 NORDCAN level for lung (+14 points target) ([p. 5](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=5)) | National | UNVERIFIED [source needed] | JS app (API paths 404) | UNVERIFIED [source needed] | Open | Low for county. Good for a Nordic benchmark | me (200), Haiku |
| 26 | European and global estimates (ECIS, GCO) | JRC / IARC | https://ecis.jrc.ec.europa.eu/ ; https://gco.iarc.who.int/today/en/ | National estimates | National | UNVERIFIED [source needed] | JS explorers | UNVERIFIED [source needed] | Open | Low | me (200) |
| 27 | Lääketilasto 2025 (medicine statistics) | Fimea / Kela | https://www.julkari.fi/items/55de2a38-552a-4014-863f-5c54afdeef94 | National medicine use and reimbursement [source needed]. PDF not parsed | National (HV UNVERIFIED) | 2025 | PDF | UNVERIFIED [source needed] | Open | Low–med | Haiku (page 200) |
| 28 | Hila pricing statistics | Hila | https://www.hila.fi/toiminta-ja-organisaatio/tilastot/2024-2/ | Application counts, processing times [source needed] | National | 2024–2025 | PDF | UNVERIFIED [source needed] | Open | Low (no geography). Useful for the drug-path timing | me (200) |
| 29 | FICAN pages (lung, myeloma, screening, quality registry) | FICAN | https://www.fican.fi/en/ | Summaries of rows 2 and 3. No own dataset found | As rows 2–3 | 2018–2024 [source needed] | HTML | - | Open | Med. Pointer only | me (200), Haiku |
| 30 | Pohde interim report 2024 (Pohjois-Pohjanmaa) | Wellbeing county | https://pohde.fi/wp-content/uploads/2024/09/Pohde-Osavuosikatsaus-1-3_2024.pdf | General access claims. No cancer waiting data [source needed] | HV | 2024 | PDF | UNVERIFIED [source needed] | Open | Low | Haiku |
| 31 | HUS access-to-treatment guide | HUS | https://www.hus.fi/en/patient/patient-guide/your-rights-patient/access-treatment-specialist-medical-care | Patient rights text, no data | Hospital district | - | HTML | - | Open | Not a dataset | me (200) |

**Junction-provided sources:** The link pack (https://files.hackjunction.app/resources/Syöpästrategiat%20ja%20syöpädata_linkkikokoelma.pdf) names Syöpärekisteri statistics, the Syöpärekisteri home page, Findata, THL data and Sotkanet, Statistics Finland cause of death, Kela (avoindata, special reimbursement), Kela and Fimea medicine statistics 2025, FICAN, iCAN, FinRegistry, biobanks (permit only) and NORDCAN 2.0. The "Background pack" and "Source list" resources were not found as separate files on hackjunction.app (Haiku checked the homepage and several sub-pages).

**Strategy Goal 3 indicators (verified in the strategy PDF, https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf):**
- "Potilaat pääsevät hoitoon tavoiteaikojen puitteissa" (patients get treatment within target times), [p. 5](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=5) and [p. 33](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=33). Footnote on [p. 5](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=5) points to THL Ohjaus 21/2016 (guide record: https://www.julkari.fi/handle/10024/131630).
- "Alueelliset ja sosioekonomiset erot syövän ilmaantuvuudessa, hoidossa ja syöpäkuolleisuudessa ovat käytettävissä palvelutoiminnassa ja niillä ohjataan toimintaa" (regional and socio-economic differences in incidence, treatment and cancer mortality are available to guide services and are used to steer them), [p. 5](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=5). This is an equity target the data should meet, which is a useful framing. (Our reading.)
- Goal 2 screening target: "80 % participation in every HV" ([p. 5](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=5); "vähintään 80 % osallistumisaste eri ohjelmissa", [p. 29](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=29)). Per row 1 and 6.

---

## 4. Missing data (most important first)

1. **Cancer waiting and referral times by county.** THL Ohjaus 21/2016 (https://www.julkari.fi/handle/10024/131630, title and in-force date checked) defines the stages (referral arrival, first visit, placed on treatment list, first treatment) [source needed for stage list]. No by-county table was found. The target values are not read (core.ac.uk PDF returns 403).
2. **Diagnosis-to-treatment times for all cancers, by county.** Only the lung report exists, by cooperation area (5 areas), not HV.
3. **Suspicion-to-referral time in primary care.** No cancer-specific source. Sotkanet 13 covers all referrals.
4. **Stage at diagnosis by county.** The strategy says clinical notifications with spread data cover only about 40% of cases ([p. 30](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=30): "Kattavat vain noin 40 % kaikista syöpätapauksista"). County stage data is not confirmed (the Syöpärekisteri app is unverified).
5. **Quality register for cancer treatment.** Not yet founded ([strategy p. 35](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf#page=35); strategy 3.2). This is the root gap.
6. **Income by wellbeing county.** Statistics Finland income and education tables are municipal. Needs a municipality-to-HV mapping.
7. **Hospital-level cancer data.** None found.
8. **Newest county survival.** Sotkanet survival runs to 2024 (2019–2024 per Haiku). Unclear if 2025 is out.

---

## 5. Best 3 datasets to show a real equity gap by county

1. **Screening participation by county and education (Syöpärekisteri, row 1).** Real, open, and the only county × education cut found. Shows a gap that the strategy itself names (80% target in every HV). Caveat: 2024 is preliminary [source needed], and the licence needs checking [source needed].
2. **Lung cancer diagnosis-to-treatment times (Syöpärekisteri report, row 2).** The only verified pathway-timing gap by region: surgery median 13.5 days North vs 46 days South (https://syoparekisteri.fi/assets/files/2024/12/Keuhkosyopa_Suomessa.pdf). It shows where in the pathway the gap sits (diagnosis to treatment). Caveat: PDF, cooperation-area level, one cancer type. Numbers need manual entry with page references.
3. **Sotkanet cancer bundle by HV (rows 6, 7, 8, 9; JSON API, licence see section 6).** Survival, incidence index, oncology visits and screening in one API. Best for a working demo. Add the eshjono queue (row 14) as a labelled waiting proxy, not a cancer measure.

**Honourable mention:** Kela cancer-drug entitlements by county (row 11, CSV, 1986–2025, CC BY 4.0). Strong access-to-drugs measure, but it counts entitlements, not treatments.

---

## 6. Corrections to earlier notes, and failed URLs

**Corrections to the law digests:**
- 07-verification.md §3 says Sotkanet was checked only up to id 707 and that the cancer index runs to 2019. Both are wrong. The full catalogue has 13 cancer-titled indicators by my title filter (the earlier note said 14, not reproduced), most above id 707. Index 5643 runs to 2024 (checked by me: 2024 call returns 23 HVs). [source needed for the 2019 claim, which was not re-checked.]
- The "no county-level cancer data" statement in 00-synthesis.md needs narrowing to "no county cancer waiting data". Screening, survival, oncology visits and drug entitlements by HV all exist.
- The Syöpärekisteri county pages were listed as "not opened". They now exist and were checked.
- Concept 1 (screening plus outcomes, plus a pathway-timing proxy) is viable with public data. Concept 2 (clock simulator) still lacks cancer waiting data.
- Licence note (corrected): the Sotkanet licence page (https://sotkanet.fi/sotkanet/en/ohje/74) states CC BY 4.0 for THL data. Data from other producers on Sotkanet (for example Statistics Finland or Kela) may carry their own terms, so check each indicator's producer before reuse. This applies to every row marked "CC BY 4.0" in section 3.

**URLs that did not work (404 or unreachable):**
- syoparekisteri.fi/tilastot/syovien-ilmaantuvuus/ (404), syoparekisteri.fi/tilastot/elossaolo/ (404)
- thl.fi guessed statistics and open-data paths (404); sampo.thl.fi/pivot/prod/en/ and /fi/ (404). Working: /pivot/prod/en/index and /pivot/prod/fi/index
- sotkanet.fi/rest/1.1/ docs, /indicator/245 (404). The data endpoint needs repeated `years=` and `genders=`
- kela.fi/tilastot-kela, kela.fi/en/statistics, kela.fi/avoindata (404). Use avoindata.fi
- stat.fi/en/statistics/ (404)
- hackjunction.app subpages /resources, /data, /datasets (404)
- findata.fi/en/news-feed/ (404); innokyla.fi/hoitoonpaasy (404)
- fimea.fi laaketilasto guessed path (404)
- pxnet2.stat.fi and API.thl.fi (no connection); gco.iarc.fr (no connection)
- core.ac.uk/download/78470017.pdf (403, THL Ohjaus 21/2016 target values not readable)
- pxdata.stat.fi returns 429 on bursts. Throttle requests.

**Open checks:**
- Sotkanet 3625 coverage: closed. The 2024 call returns all 23 HVs (values 84–94).
- Syöpärekisteri app filters and licence text [source needed]
- Sampo HTML cube for an oncology queue group [source needed]
- Statistics Finland licence page (UNVERIFIED) [source needed]
- Findata non-EU fee for 2026 [source needed] (EU/EEA fees checked on findata.fi)

**Scratch files (not in repo, safe to delete):**
- `/tmp/claude-1000/-home-michal--t3-projects-vitruvian/546645a6-39d8-4d73-8e52-1688ffbdae47/scratchpad/sotka/` (indicator catalogue, eshjono JSON, 13u5 CSV)
- `/tmp/claude-1000/-home-michal--t3-projects-vitruvian/546645a6-39d8-4d73-8e52-1688ffbdae47/scratchpad/registry/dl/laakekorv.csv` (Kela, 181 MB)
- `/tmp/claude-1000/-home-michal--t3-projects-vitruvian/546645a6-39d8-4d73-8e52-1688ffbdae47/scratchpad/verify/lung.txt` (lung report text)
