# 07 — Stage data practice in Finland (research note)

Scope: is cancer stage (levinneisyystieto, "spread data") missing from Finnish cancer data, why, and what fixes it. Research only.

Tags used:
- **[fetched]** I read the page or PDF text myself.
- **[news]** Only a news article or press release says it. Not checked against the primary report.
- **[snippet]** Only a search-result summary. Full text not read.
- **[unverified]** Claim I could not confirm.

Terms: TNM = tumour/node/metastasis stage system. cTNM = clinical stage, pTNM = pathology stage. NORDCAN = shared Nordic cancer database. FICAN = Finnish Comprehensive Cancer Centre (national cancer centre).

---

## 1. Bottom line

- The 42% national figure and the regional figures are real in the news. Pass 2 read the registry factsheet, which confirms 41.9% overall and the regional figures (see Pass 2). [news, fetched]
- The "~30% missing in Zai et al." claim is **not confirmed**. The paper's missing-stage handling was not readable. [unverified] (paper: https://doi.org/10.1136/bmjph-2025-002829)
- The news does not say whether the gap is "not written in the chart" or "written but not sent to the registry". No source settles it. [news]
- I found no named downstream fix that is funded and in place. The strategy goals 3.2b/3.2d could not be confirmed. [fetched, unverified]

## 2. Claim check: the numbers

| Claim | Status | Source |
|---|---|---|
| National spread data in 42% of 2024 cases | News, consistent across 2 articles. Report not read. | [verkkouutiset stage article](https://www.verkkouutiset.fi/a/syopatiedoissa-isot-alueelliset-erot-yksi-seutu-erottuu/) [news] |
| Pirkanmaa 72% (highest) | News. Sentence quoted: "Pirkanmaan hyvinvointialueella levinneisyystieto saatiin 72 prosentista syöpätapauksia." | same [news] |
| Sisä-Suomi 60% (best cooperation area) | News | same [news] |
| Other areas 33–42% | News. Individual regions not named. | same [news] |
| Target: at least 70% "in coming years" | News, quote from registry director Janne Pitkäniemi | same [news] |
| Report year and date | Syöpä 2024 report. Date conflicts: 17 June 2026 [snippet, source needed], 10 July 2026 [snippet, source needed], "June 2026" [news]. The factsheet says the official 2024 statistics came out on 24 April (year not stated on the page). Unresolved. | [fetched, https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html] |
| Zai et al. ~30% missing stage | **Not confirmed.** BMJ page, PMC and Europe PMC all blocked (403 / browser check). | [unverified] |
| Lung: spread data missing for "almost half" | From a Syöpäjärjestöt report covering **2019–2023**, not Syöpä 2024. Article does not attribute it to the registry. | [verkkouutiset lung article](https://www.verkkouutiset.fi/a/keuhkosyopa-todetaan-usein-liian-myohaan-vain-joka-neljas-saa-parantavaa-hoitoa/) [news] |

Notes on the numbers:
- **Do not mix the lung figure with the 42%.** Different dataset, different years.
- **Zai (2000–2019) and the 2024 report are different years.** Even if Zai had ~30% missing, it would not be a like-for-like check of the 42%.
- The registry's own site (syoparekisteri.fi) returned HTTP 403. The Syöpä 2024 report and its regional tables were not read. [unverified]

Zai et al. facts I could confirm (search summaries only):
- Paper: Zai et al., BMJ Public Health 2025, DOI 10.1136/bmjph-2025-002829, published 22 Oct 2025. [snippet] (https://doi.org/10.1136/bmjph-2025-002829)
- Population: 4,536,724 residents aged 30+, diagnoses 2000–2019. [snippet]
- Working paper WP-2025-016 (MPIDR, June 2025, "WP" = working paper number) covers 2000–2020 and 377,986 residents. Different numbers from the journal version. [snippet] PDF text was not extractable. [https://www.demogr.mpg.de/papers/working/wp-2025-016.pdf]

## 3. Chart gap or registry gap? (the key question)

**Answer: unknown from sources.** Evidence leans toward "recording practice varies" but does not separate the two.

What the sources say:
- The registry's inputs are: clinical cancer notifications and treatment notifications from care providers, plus pathology and haematology lab notifications. [snippet, Aalto master's thesis, https://aaltodoc.aalto.fi/server/api/core/bitstreams/acad2ccb-7e39-4285-94aa-adaa52ed5dff/content]
- Pitkäniemi named weak coverage of **clinical** spread data as the development need. [news, lung article](https://www.verkkouutiset.fi/a/keuhkosyopa-todetaan-usein-liian-myohaan-vain-joka-neljas-saa-parantavaa-hoitoa/)
- The registry said recording practices "need to be unified" so cancer care can be judged nationwide. [news, stage article](https://www.verkkouutiset.fi/a/syopatiedoissa-isot-alueelliset-erot-yksi-seutu-erottuu/), quote: "Tietojen kirjaamista pitää yhtenäistää"]
- THL's Jonna Salonen said the whole data chain needs work: data definers, IT vendors, regional IT administrators, and the staff who record the data. [news, lung article](https://www.verkkouutiset.fi/a/keuhkosyopa-todetaan-usein-liian-myohaan-vain-joka-neljas-saa-parantavaa-hoitoa/) This covers both recording and transmission.
- Finnish clinical form: a localized / regional / metastatic field, plus free-text TNM. cTNM preferred since 2015, "missing in most notifications". [snippet, Engholm et al. 2024, https://medicaljournalssweden.se/actaoncologica/article/view/35232] Full text did not show this; it is from a search summary. [snippet]
- Pathology reports are the main source of notifications, with no standard format. [snippet, Engholm et al. 2024, https://medicaljournalssweden.se/actaoncologica/article/view/35232]

Reading that would settle it (not found): a breakdown of the 58% gap by source type (clinical notification vs pathology vs none). The registry report might have it. [unverified]

## 4. Why it varies by region (Pirkanmaa vs others)

**No source found that explains the Pirkanmaa or Sisä-Suomi gap.** Hypotheses only; none sourced. [unverified]

Closest material:
- A Kainuu wellbeing services county document says diagnosis-recording guidance, IT system effects on errors, and data linkage need clearer description, and that the national recording guides must be harmonised. [snippet, https://kainuunhyvinvointialue.cloudnc.fi/download/noname/%7B826daab4-a6bd-4f4a-8638-8e30ea991608%7D/211724]
- THL/registry study (Järvelin 2019, 2014 cases): Hilmo (national care-notification system) and registry diagnoses largely match, but data quality was "hard to verify". [snippet, https://www.laakarilehti.fi/tieteessa/alkuperaistutkimukset/kohti-luotettavaa-syovan-hoitoon-paasyn-seurantaa-hilmon-ja-syoparekisterin-diagnoositietojen-vertailu/en]
- TAYS (Pirkanmaa) holds the OECI Cancer Centre accreditation (middle tier, renewed 2025). It did not reach the top "Comprehensive Cancer Centre" tier because its clinical study count was below the threshold (corrected: earlier note said "European CCC designation"). Nothing links that to registry recording. [snippet, https://www.sttinfo.fi/tiedote/72368140/kansainvalinen-tunnustus-kertoo-laadukkaasta-syovan-hoidosta-ja-tutkimuksesta-taysissa?lang=fi; https://www.tuni.fi/en/news/tays-cancer-centre-meets-rigorous-european-quality-standards]

## 5. What fixes it later

| Route | Status | Source |
|---|---|---|
| Registry follow-up queries to hospitals | **Not found** in any source. | [news, stage article: no mention] |
| Pathology lab linkage (Fimlab etc.) | Labs already send notifications. No automated stage feed found. | [snippet, thesis, https://aaltodoc.aalto.fi/server/api/core/bitstreams/acad2ccb-7e39-4285-94aa-adaa52ed5dff/content] |
| Kanta / automated reporting | **Not found.** | — |
| Hilmo-based care-pathway tracking | THL tracks care access for 16 cancers (~3/4 of new cases) from Hilmo. Stage not part of it, as far as found. | [snippet, THL 2017 guidance, https://core.ac.uk/download/145056318.pdf] |
| National cancer quality register (Syöpäjärjestöt + THL + FICAN) | Funded project. Budget +€400,000 this year. "No such appropriation for next year is in the budget proposal." No earmarked funding for strategy measures. Calls to make it permanent. | [fetched, STT Info press release 24.8.2026](https://www.sttinfo.fi/tiedote/72255408/puutteita-syovanhoidossa-ei-voida-korjata-ilman-rahoitusta?lang=fi) |
| Cancer strategy 2026–2035 | Published 10 Nov 2025. Roadmap due in 2026. FICAN proposed €139M for 2027–2031 (proposal, not decided). | [fetched, valtioneuvosto.fi press release](https://valtioneuvosto.fi/-/1271139/yhteinen-suunta-ihmislahtoiseen-ja-vaikuttavaan-syovan-ehkaisyyn-ja-hoitoon-kansallinen-syopastrategia-on-julkaistu) [snippet for €139M, https://www.verkkouutiset.fi/a/syovan-hoidon-kulut-kasvamassa-800-miljoonalla-eurolla-naita-toimia-ehdotetaan/] |
| Strategy goals 3.2b / 3.2d | **Not confirmed.** The English PDF has no readable numbered goals. Section 3.2 is about screening programmes. The 70% target is not confirmed as a strategy goal. | [fetched, ICCP-portal PDF](https://www.iccp-portal.org/sites/default/files/2026-02/National_Cancer_Strategy_2026-2035_Finland.pdf) [unverified] |
| Nordic benchmark | Denmark, Sweden, Iceland: TNM available for 75–95% of cases. Norway lower. Finland: no TNM data in the Nordic dataset. | [fetched, Engholm et al. 2024, Acta Oncol 63:303–312, DOI 10.2340/1651-226X.2024.35232](https://medicaljournalssweden.se/actaoncologica/article/view/35232) |
| Nordic: TNM reporting rules | Denmark and Sweden made TNM mandatory in 2004; Norway voluntary. | [snippet, Engholm et al. 2024, https://medicaljournalssweden.se/actaoncologica/article/view/35232] |
| Nordic: trend | Sweden's TNM share rose over time; Denmark's fell. | [fetched, Engholm et al. 2024, https://medicaljournalssweden.se/actaoncologica/article/view/35232] |

Note on the Nordic comparison: the 75–95% is TNM availability, not "stage known" for all cancers. It is not directly the same measure as the Finnish 42% (spread data). [unverified equivalence]

## 6. What cannot be measured without stage

Each item sourced.

1. **Equity by education.** Lower education: higher odds of stage IV diagnosis (men OR 1.10, 95% CI 1.08–1.12; women OR 1.15, 95% CI 1.13–1.17). Zai et al. conclude low-SES people are disadvantaged across the cancer journey. [snippet, Zai et al. 2025 abstract, https://doi.org/10.1136/bmjph-2025-002829] The working-paper version says high-education people have 10–16% higher odds of early-stage diagnosis. [snippet, WP-2025-016, https://www.demogr.mpg.de/papers/working/wp-2025-016.pdf]
   - **Inference (mine):** if stage is missing for 58% of 2024 cases, and missingness varies by region or patient type, the equity estimates could be biased. Not tested in any source. [unverified]
2. **Regional survival comparisons.** A Cancer Registry study found regional survival variation fell 18% between 1997–2006 and 2007–2016 across 11 common cancers. It names earlier stage detection as a possible explanation. Without stage, you cannot tell stage shift from treatment effect. [fetched, MTV Uutiset, https://www.mtvuutiset.fi/artikkeli/syoparekisterin-tutkimus-suomen-alueelliset-erot-syovasta-selviytymisessa-ovat-kavenneet/7854820]
3. **Survival by stage across Nordic countries.** Engholm et al. found one-year relative survival differed far more between TNM stages than between countries. This suggests similar stage recording across the countries with TNM data. Finland was not in that dataset. [snippet, Engholm et al. 2024, https://medicaljournalssweden.se/actaoncologica/article/view/35232]
4. **Early detection and screening impact.** A 2026 IHE dashboard says Finnish staging is insufficient to evaluate performance, and early detection is hard to assess. [snippet, https://ihe.se/app/uploads/2026/04/IHE-Cancer-Dashboard-Finland_.pdf] I found no Finnish study measuring stage shift after screening. [unverified absence]
5. **Lung cancer treatment pathway.** Stage missing for nearly half of patients. About 27% of lung cancer patients were directed to curative treatment. The stage gap limits judging when cancer was found and whether treatment matched. [news, lung article; Syöpäjärjestöt 2019–2023](https://www.verkkouutiset.fi/a/keuhkosyopa-todetaan-usein-liian-myohaan-vain-joka-neljas-saa-parantavaa-hoitoa/)
6. **Clinical meaning.** Pitkäniemi: spread data shows how far cancer had progressed at diagnosis, and it shapes treatment choice and prognosis. [news, stage article](https://www.verkkouutiset.fi/a/syopatiedoissa-isot-alueelliset-erot-yksi-seutu-erottuu/)

## 7. Open items for the next step

- Get the full Syöpä 2024 report (syoparekisteri.fi returned 403; try the registry's PDF or a library copy).
- Get the Zai et al. methods section (PMC12551501 and BMJ both blocked). Check how unknown stage was coded or excluded.
- Find the strategy PDF (Finnish: Kansallinen_syopastrategia_2026_2035.pdf) and check goals 3.2b/3.2d.
- Ask the registry or THL directly: what share of the 58% gap is "not recorded" vs "not transmitted".

## 8. Sources

- [verkkouutiset: stage article](https://www.verkkouutiset.fi/a/syopatiedoissa-isot-alueelliset-erot-yksi-seutu-erottuu/) — fetched
- [verkkouutiset: lung article](https://www.verkkouutiset.fi/a/keuhkosyopa-todetaan-usein-liian-myohaan-vain-joka-neljas-saa-parantavaa-hoitoa/) — fetched
- [STT Info: Syöpäjärjestöt press release, 24.8.2026](https://www.sttinfo.fi/tiedote/72255408/puutteita-syovanhoidossa-ei-voida-korjata-ilman-rahoitusta?lang=fi) — fetched
- [Engholm et al. 2024, Acta Oncologica](https://medicaljournalssweden.se/actaoncologica/article/view/35232) — fetched (view page); DOI 10.2340/1651-226X.2024.35232
- [Pettersson et al. 2023, Acta Oncologica](https://medicaljournalssweden.se/actaoncologica/article/view/34912) — fetched; no Finland data
- [MTV Uutiset: regional survival](https://www.mtvuutiset.fi/artikkeli/syoparekisterin-tutkimus-suomen-alueelliset-erot-syovasta-selviytymisessa-ovat-kavenneet/7854820) — fetched
- [valtioneuvosto.fi: strategy press release](https://valtioneuvosto.fi/-/1271139/yhteinen-suunta-ihmislahtoiseen-ja-vaikuttavaan-syovan-ehkaisyyn-ja-hoitoon-kansallinen-syopastrategia-on-julkaistu) — fetched
- [ICCP-portal: English strategy PDF](https://www.iccp-portal.org/sites/default/files/2026-02/National_Cancer_Strategy_2026-2035_Finland.pdf) — fetched; no readable goals
- [Zai et al. 2025, BMJ Public Health](https://doi.org/10.1136/bmjph-2025-002829) — search summary only
- [MPIDR WP-2025-016](https://www.demogr.mpg.de/papers/working/wp-2025-016.pdf) — PDF not readable
- [Järvelin 2019, Lääkärilehti](https://www.laakarilehti.fi/tieteessa/alkuperaistutkimukset/kohti-luotettavaa-syovan-hoitoon-paasyn-seurantaa-hilmon-ja-syoparekisterin-diagnoositietojen-vertailu/en) — search summary only
- [IHE Cancer Dashboard Finland 2026](https://ihe.se/app/uploads/2026/04/IHE-Cancer-Dashboard-Finland_.pdf) — search summary only; PDF not readable
- [Aalto master's thesis, lung/myeloma coverage](https://aaltodoc.aalto.fi/server/api/core/bitstreams/acad2ccb-7e39-4285-94aa-adaa52ed5dff/content) — search summary only
- Not reachable: syoparekisteri.fi (403), PMC12551501 / Europe PMC (403 or browser check), BMJ Public Health page (403), core.ac.uk 270319454 (403).

Written by: research sub-agent (Haiku 5.5). Path: /home/michal/.t3/projects/vitruvian/docs/research/context/07-stage-data-practice.md

## Pass 2 (conclusive check)

Checked 2026-11-14. Five gaps from the brief. IDs: PMID = PubMed ID, PMC = PubMed Central free-text ID, DOI = publisher ID, Wayback = Internet Archive copy.

### Gap 1: the registry's own report numbers

- Syöpä 2024 factsheet, national spread-data coverage: **41.9%** (TNM 31.1%, Stage 5.4%, free text 4.3%). **58.1%** had none. The three parts add to 40.8%, not 41.9%. Unexplained. [fetched: https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html]
- Regions: Sisä-Suomi cooperation area **60.4%** (best area). Pirkanmaa wellbeing area **71.9%** (highest). Other areas 33–42% (news only). Per-cancer table 5.1 exists in the factsheet; I did not extract all of it. [fetched, same URL; partial]
- Target: "lyhyen aikavälin tavoitteena" is to reach spread data for **at least 70%** of new cases, which the report says mirrors the new national strategy. The 70% number is in the registry report, not confirmed in the strategy text. [fetched, same URL]
- Clinical notifications: "vain noin 40 %" of new cases in recent years. [fetched, Syöpä 2023 PDF section 4.4, https://web.archive.org/web/2025/https://syoparekisteri.fi/assets/files/2025/06/Syopa_2023_fi.pdf. Direct registry URL returned HTTP 403.]
- Clinical notifications in the 2024 factsheet: "vain noin puolessa" of new cases; "matala kattavuus näkyy suoraan" in spread-data coverage. [fetched, factsheet 2024 section 4.4]
- Trend: 2004 >90% of cases had a clinical notification; for almost ten years it has been under 50%. Pirkanmaa followed that pattern. [fetched, https://syoparekisteri.fi/tietoa-syoparekisterista/tietotilinpaatos-2025/]
- Automation: automatic case-building since 2018 for 13 common cancers; the rest is manual. [fetched, Syöpä 2023 PDF section 4.5, https://web.archive.org/web/2025/https://syoparekisteri.fi/assets/files/2025/06/Syopa_2023_fi.pdf]

### Gap 2: chart gap or registry gap?

**Answer: mostly a notification/transmission gap, as the registry describes it. Whether stage is written in the chart is still not shown.**

- The registry says spread data comes from pathology and clinical notifications. Its stated cause: clinical notifications arrive for only about half of new cases. [fetched, factsheet 2024 section 4.4]
- Pirkanmaa raised clinical notifications from 42% (2022) to 80% (2024) by changing the recording workflow and IT system, not by new data collection. [fetched, https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/] Inference: the stage data was already being captured in care but was not sent. [unverified]
- Iltalehti caption (18.6.2026): "Osa tiedoista jää kirjaamatta tai ei siirry kansallisiin tietojärjestelmiin" ("some data is not recorded or does not transfer to national systems"). Both cases appear, with no split. [source needed: the Iltalehti article was not found by search]
- Engholm et al. 2024 (Discussion): "In Finland, TNM information is reported, but not registered systematically." [fetched, https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511/] This matches the registry view.
- Still missing: a split of the 59% gap into "not recorded" vs "not sent". Ask the registry or THL. [unverified]

### Gap 3: why Pirkanmaa is high

- Pirkanmaa's clinical-notification rate went from 42% (2022) to 80% (2024). The registry credits an integrated diagnosis-recording system (built with CGI and Pirha, named in the registry article) plus recording inside multidisciplinary team (MDT) meetings. Breast cancer reached 97%. [fetched, https://syoparekisteri.fi/2025/06/26/yhteistyo-toi-parannusta-syoparekisteri-ilmoituksiin/]
- Tietotilinpäätös 2025 confirms 80% in 2024, "yhteistyössä" with the registry, one IT vendor and a few other wellbeing areas. [fetched, https://syoparekisteri.fi/tietoa-syoparekisterista/tietotilinpaatos-2025/]
- The registry names process and IT as the cause. It does not name patient mix or staffing. Pirkanmaa is one case, not a test of cause. [unverified inference]

### Gap 4: downstream fixes, budget, strategy goals

| Item | Status | Source |
|---|---|---|
| Clinical notifications, 2025 channel mix | About 87% from hospital IS extracts; about 12% via web service; 248 by post. Web-service use down about 52% since 2020. | [fetched, https://syoparekisteri.fi/tietoa-syoparekisterista/tietotilinpaatos-2025/] |
| 2026 replication service from THL database | Planned. Richer data transfer to the registry. | [fetched, https://syoparekisteri.fi/tietoa-syoparekisterista/tietotilinpaatos-2025/] |
| Cancer quality register (Syöpäjärjestöt + THL + FICAN) | Funded project, +€400,000 this year. No appropriation for next year in the budget proposal. Needs to be made permanent. | [fetched in Pass 1, STT press release 24.8.2026](https://www.sttinfo.fi/tiedote/72255408/puutteita-syovanhoidossa-ei-voida-korjata-ilman-rahoitusta?lang=fi); permanence [snippet] |
| 2026 social and health ministry budget | €14.8bn proposal (Sept 2025; later parliamentary documents use €14.9bn). No registry line found. | [snippet, https://valtioneuvosto.fi/-/1271139/sosiaali-ja-terveysministerion-hallinnonalan-talousarvioehdotus-vuodelle-2026] |
| 2027 budget line for registry | Not found. | [unverified] |
| FICAN funding ask for strategy | €139M for 2027–2031. Proposal, not decided. | [snippet, https://www.verkkouutiset.fi/a/syovan-hoidon-kulut-kasvamassa-800-miljoonalla-eurolla-naita-toimia-ehdotetaan/] |
| Strategy 2026–2035 | Published 10.11.2025. Contains "konkreettiset mittarit" (concrete measures). Roadmap with timetables and owners due 2026. | [fetched, https://valtioneuvosto.fi/-/1271139/yhteinen-suunta-ihmislahtoiseen-ja-vaikuttavaan-syovan-ehkaisyyn-ja-hoitoon-kansallinen-syopastrategia-on-julkaistu, partial highlights] |
| Goal 3.2b: 90% quality-register coverage | **Not verified.** Strategy PDF not reached (stm.fi PDF link not returned by the scraper). ICCP-portal copy from Pass 1 has no readable goals. | [unverified] |
| Goal 3.2d: 90% automated notifications by 2030 | **Not verified.** Same reason. | [unverified] |

### Gap 5: Nordic stage completeness

Source: Engholm et al. 2024, Acta Oncologica, PMID 38716485, PMC11332511 (https://pmc.ncbi.nlm.nih.gov/articles/PMC11332511/). [fetched] Measure: TNM available (with the "N0M0 for NXMX" assumption, which counts missing N and M as N0M0). Finland is not in the dataset. Table 1, lung cancer, 2014–2016:

- **Denmark 96%** (TNM mandatory since 2004)
- **Norway 78%** (TNM voluntary)
- **Sweden 96%** (TNM mandatory since 2004)

Broader result: Denmark, Sweden and Iceland 75–95% for most cancers; Norway lower. [fetched, same article]

Caveats: TNM only, not Finland's "spread data" (which also counts Stage and free text). The N0M0 assumption raises availability. The Nordic numbers cannot be compared directly with Finland's 41.9%. [unverified equivalence]

### Conclusion

1. The registry's own 2024 report confirms 41.9% national spread-data coverage (58.1% had none, [factsheet](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html)), Pirkanmaa 71.9%, and a 70% short-term target.
2. The gap tracks clinical notifications (about 40–50%) and transmission, so it is mainly a notification gap; whether charts hold stage is still unproven.
3. Strategy goals 3.2b and 3.2d, the 2027 budget line and the 90% targets remain unverified; Nordic peers reach 75–96% TNM availability.
