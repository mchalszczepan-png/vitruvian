# 06 · Workforce law and national cancer strategy (policy)

Researcher: legal sub-agent 6 · Date: 2026-11-13 · Scope: (a) workforce and care-delivery law; (b) the national cancer strategy 2026–2035 and its roadmap as policy.

Source pass 2026-11-14: a source link was added next to each figure, quote and law claim. Strategy and roadmap page numbers were not re-read in this pass; they rest on the earlier read noted below.

**Method and gaps (read first)**
- Strategy PDF and roadmap PDF: read with context.dev `web-scrape` (PDF parser). One rate-limit (429) hit; retry after 60 s worked. WebFetch could not decode either PDF.
- Strategy pages read: 1–6, 32–43 (all of Goal 3). Roadmap pages read: 1–8, and highlights of pp. 54–76 (Goal 3 measures 3.1, 3.2, 3.3, 3.4, 3.5 partly). **Not read:** strategy Goals 1, 2, 4; roadmap Goals 1, 2, 4; roadmap pp. 9–53 and 77–111 (cost annex, owners).
- Finlex and Valvira pages: a Haiku subagent used WebFetch/WebSearch. Finlex pages came back as navigation only, so **no statute section numbers below are verified** unless marked VERIFIED. Treat all legal-section claims as UNVERIFIED until someone reads the full text.
- Link collection PDF: context.dev highlights (pp. 1–6) gave the list of data sources (verified). Its URLs were not opened.

Short links used below: [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) · [roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf) · [link collection PDF](https://files.hackjunction.app/resources/Sy%C3%B6p%C3%A4strategiat%20ja%20sy%C3%B6p%C3%A4data_linkkikokoelma.pdf)

---

## 1. Key laws and policy documents

| Name (number) | Where | One line | URL | Status |
|---|---|---|---|---|
| Kansallinen syöpästrategia 2026–2035, "Yhdessä syöpää vastaan" | Strategy PDF p. 1–5 | Four main goals, equality as cross-cutting theme; mandate "varmistettava säädösmuutoksin" (p. 4) | https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf | VERIFIED |
| Toimeenpanon tiekartta 2026–2031 | Roadmap PDF p. 2–8 | Actions, owners, timelines, 140 M€ extra investment; says many actions need "lisäresursseja ja säädösmuutoksia" (p. 2) | https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf | VERIFIED |
| Linkkikokoelma (strategy and data links) | Link PDF p. 1–6 | Lists Syöpärekisteri stats, THL/Sotkanet, Findata, Statistics Finland, Kela, FICAN | https://files.hackjunction.app/resources/Sy%C3%B6p%C3%A4strategiat%20ja%20sy%C3%B6p%C3%A4data_linkkikokoelma.pdf | VERIFIED (list only) |
| Laki terveydenhuollon ammattihenkilöistä 559/1994 | Finlex | Licensing and professional duties of health professionals (sections not verified). Whether nurses may order imaging without a doctor's referral: [source needed] | https://www.finlex.fi/fi/laki/ajantasa/1994/19940559 | Title/number VERIFIED; sections UNVERIFIED |
| Terveydenhuoltolaki 1326/2010 | Finlex | Hoitotakuu (care guarantee) and referral duties (sections not verified; strategy cites [THL Ohjaus 21/2016](https://www.julkari.fi/items/0424a55a-f159-406f-8883-5dfdad4d6772) for treatment-access monitoring) | https://www.finlex.fi/fi/laki/ajantasa/2010/20101326 | Title/number VERIFIED; sections UNVERIFIED |
| Laki potilaan asemasta ja oikeuksista 785/1992 | Finlex | Patient rights, including care within time limits and second opinions (sections not verified) | https://www.finlex.fi/fi/lainsaadanto/1992/785 | Title/number VERIFIED; sections UNVERIFIED |
| Laki sosiaali- ja terveydenhuollon asiakastietojen käsittelystä 703/2023 | Finlex | Patient-record rules; relevant to remote care documentation | https://www.finlex.fi/fi/laki/ajantasa/2023/20230703 | Title/number VERIFIED; remote-care section UNVERIFIED |
| Valtioneuvoston asetus erikoissairaanhoidon työnjaosta ja eräiden tehtävien keskittämisestä 582/2017 ("keskittämisasetus") | Finlex | Division of labour in specialised care; strategy says it gives the National Cancer Centre (FICAN) a monitoring task for access and equality (strategy p. 33) | https://www.finlex.fi/fi/lainsaadanto/2017/582 | Title/number VERIFIED; FICAN role in the decree text UNVERIFIED |
| STM press release on remote services (etäpalvelut) | stm.fi, 10.11.2015 | Remote services generally equal to in-person visits if suitable; no comprehensive legal rules then. Dated, probably superseded | https://stm.fi/-/uusi-linjaus-terveydenhuollon-etapalvelut-rinnastetaan-perinteisiin-vastaanottokaynteihin | VERIFIED as 2015 source only |
| Valvira / LVV remote services page | lvv.fi (Valvira's pages moved to lvv.fi; Lupa- ja valvontavirasto began 1.1.2026, per [STT press release title](https://www.sttinfo.fi/tiedote/71700931/suomen-suurimpiin-virastoihin-kuuluva-uusi-lupa-ja-valvontavirasto-aloittaa-112026?lang=fi), search result, not opened) | Current guidance on etäpalvelut | https://lvv.fi/sosiaali-ja-terveydenhuolto/etapalvelut | Page found; content and date UNVERIFIED |
| Hahmotelma kansallisen syöpästrategian rungoksi (2024) | hyvaks.fi | Earlier draft of the strategy | https://hyvaks.fi/sites/default/files/2024-01/Hahmotelma-kansallisen-syopastrategian-rungoksi_FINAL41.pdf | Not opened, UNVERIFIED |

---

## 2. Strategy goals summary

Four main goals ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf), p. 3 and p. 5). Equality is a cross-cutting theme. Values: reducing inequality, quality of life, effectiveness, research.

1. **Vahvistetaan osallisuutta ja kehitetään ihmislähtöisiä palveluita** (strengthen participation, develop human-centred services)
2. **Vähennetään syöpätaakkaa ehkäisyn ja varhaisen toteamisen avulla** (reduce cancer burden through prevention and early detection)
3. **Varmistetaan yhdenvertainen ja vaikuttava syövänhoito** (ensure equal and effective cancer treatment)
4. **Aallonharjalla muuttuvassa toimintaympäristössä** (on the crest of a wave in a changing operating environment)

### Goal 3 — verbatim Finnish (strategy pp. 32–42) with English translation (mine)

Source for all quotes below: [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf).

**Goal 3 heading (p. 32):** "Varmistetaan yhdenvertainen ja vaikuttava syövänhoito"
*Translation: "Ensure equal and effective cancer treatment."*

**Sub-goals (p. 32):**
- 3.1 Kansalliset hoitosuositukset ja hoitoketjut ohjaavat yhdenvertaista, viiveetöntä ja vaikuttavaa hoitoa
  *National treatment recommendations and care pathways guide equal, timely and effective treatment.*
- 3.2 Kansallinen syövänhoidon laaturekisteri, systemaattinen tulosten tarkastelu ja vertaisarviointi tukevat vaikuttavan hoidon kehittämistä
  *A national cancer-treatment quality register, systematic outcome review and peer review support development of effective treatment.*
- 3.3 Kuntoutus, psykososiaalinen tuki, terveyssosiaalityö ja palliatiivinen hoito ovat vakiintunut osa syöpäpotilaan hoitoketjua ja yhdenvertaisesti saatavilla
  *Rehabilitation, psychosocial support, health social work and palliative care are an established part of the cancer care pathway and equally available.*
- 3.4 Toimintakykytieto ohjaa ikääntyneiden syöpäpotilaiden diagnostiikkaa ja hoitoa
  *Functional-ability information guides diagnostics and treatment for older cancer patients.*
- 3.5 Riittävä ja osaava henkilöstö varmistaa vaikuttavan ja ihmislähtöisen syövän hoidon
  *Sufficient, skilled staff ensure effective, human-centred cancer care.*

**Problem statement (p. 32, summarised in Finnish text):** survival figures are comparable internationally, but treatment organisation still has major gaps; regional differences in resources, services and support weaken equality; treatment costs are rising fast with new drugs.

**Target state (p. 32):** "Suomessa on yhtenäiset ja vaikuttavat hoitoketjut sekä riittävä ja osaava henkilöstö, jotka yhdessä takaavat yhdenvertaiset ja laadukkaat hoito- ja tukipalvelut kaikille potilaille asuinpaikasta riippumatta."
*Translation: "Finland has uniform and effective care pathways and sufficient, skilled staff that together guarantee equal, high-quality treatment and support services for all patients regardless of where they live."*

### Goal 3 headline indicators (strategy p. 5, "Varmistetaan yhdenvertainen ja vaikuttava syövänhoito")

- "Huonoennusteisten syöpien 5 vuoden elossaololuvut saavuttavat pohjoismaisen tason" — 5-year survival for poor-prognosis cancers reaches the Nordic level. (Footnote: lung +14 pp, pancreas +6 pp, liver +14 pp over the 2023 Nordcan level; Nordic = Sweden/Norway average. Nordcan dataset: https://nordcan.iarc.fr/en/dataset.)
- "Syöpäkuolleisuus pienenee 10 % (nykyisin 13 300 henkilöä vuodessa)" — cancer mortality falls 10 % (currently 13,300 people per year).
- "Potilaat pääsevät hoitoon tavoiteaikojen puitteissa" — patients get treatment within target times. (Footnote *** cites [THL Ohjaus 21/2016](https://www.julkari.fi/items/0424a55a-f159-406f-8883-5dfdad4d6772), "Hoitoonpääsyn seuranta syövän hoidossa".)

### Goal 3 measures ("Tavoitteen toteutumista mitataan seuraavasti") — verbatim Finnish with translation

Sub-goal 3.1 (p. 33, [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)):
- "Ajantasaisten kansallisten hoitosuositusten ja hoitoketjujen saatavuudessa ollaan pohjoismaisella tasolla (hoitosuositusten osuus suhteessa pohjoismaisiin verrokkeihin, %)." — *Availability of up-to-date national treatment recommendations and pathways is at Nordic level (share of recommendations vs Nordic comparators, %).*
- "Potilaat pääsevät hoitoon tavoiteaikojen puitteissa." — *Patients get treatment within target times.*
- "Kansalliset ja yhtenäiset tavoitteet ja keskeisimmät vaikuttavuuden seurantamittarit määritetty sovittuihin syöpiin." — *National uniform goals and key outcome monitoring measures defined for agreed cancers.*

Sub-goal 3.2 (p. 36, [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)):
- "Syöpäkohtaisten tietojen kirjaaminen laaturekisteriin, vertaiskehittämistoiminta käytössä (syöpätyyppien lukumäärä, joista tieto käytettävissä laaturekistereissä)." — *Cancer-specific data entered in quality registers, peer development in use (number of cancer types with data available in quality registers).*
- "Laaturekisterin tietopohja (ml. levinneisyystieto) mahdollistaa laadun ja vaikuttavuuden luotettavan arvioinnin ja vertailun (tietopohjan kattavuus 90 %)." — *Quality-register data base (incl. spread/stage data) allows reliable assessment and comparison of quality and effectiveness (coverage 90 %).*
- "Saatavilla on luotettavaa tietoa syövän diagnostiikka ja hoitokäytäntöjen alueellisista eroista, minkä avulla voidaan kaventaa eroja hoitotuloksissa." — *Reliable data on regional differences in diagnostics and treatment practice is available, to narrow differences in outcomes.*
- "Kliinisten syöpäilmoitusten määrä (tavoitteena 90 % tapauksista automatisoidusti vuoteen 2030 mennessä)." — *Clinical cancer notifications (target: 90 % of cases automated by 2030).*

Sub-goal 3.3 (p. 38, [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)):
- "Syöpäpotilaiden osuus, joiden oire, elämänlaatu ja toimintakykytieto on saatavilla (%)." — *Share of cancer patients with symptom, quality-of-life and functional data available (%).*
- "Yksiköiden osuus, joissa saatavilla psykososiaalisia, sosiaalisia, henkisiä/hengellisiä ja kuntoutuspalveluita (%)." — *Share of units offering psychosocial, social, spiritual and rehabilitation services (%).*
- "Syöpäpotilaiden osuus, joille laadittu yksilöllinen suunnitelma kuntoutumisen tueksi (%)." — *Share of patients with an individual rehabilitation plan (%).*
- "Levinnyttä syöpää sairastavien potilaiden osuus, joille laadittu elämän loppuvaiheen ennakoiva hoitosuunnitelma (%)." — *Share of metastatic-cancer patients with an advance end-of-life plan (%).*
- "Levinnyttä syöpää sairastavien potilaiden osuus, joilla palliatiivinen hoito aloitettu jo sairauden hoidon rinnalla (%)." — *Share of metastatic-cancer patients started on palliative care alongside disease treatment (%).*
- "Palliatiivisten hoitolinjauksien määrät syöpään kuolleista potilaista (%) sekä palliatiivisten hoitolinjauksien ajankohta suhteessa kuolemaan (vrk)." — *Share of cancer deaths with palliative care decisions, and their timing relative to death (days).*
- "Syöpäpotilaiden osuus, jotka saivat syöpään kohdistuvaa hoitoa viimeisen elinkuukauden aikana (%)." — *Share of cancer patients who received cancer-directed treatment in the last month of life (%).*

Sub-goal 3.4 (p. 39, [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)):
- "Niiden hyvinvointialueiden osuus, jossa kaikille soveltuville ikääntyneille syöpäpotilaille tehdään geriatrisonkologinen arviointi (%)." — *Share of wellbeing counties where all suitable older cancer patients get a geriatric-oncology assessment (%).*
- "Niiden hyvinvointialueiden osuus, joissa perusterveydenhuollolla on mahdollisuus konsultoida geriatrisen onkologian tiimiä jo syövän diagnostiikkavaiheessa (%)." — *Share of wellbeing counties where primary care can consult a geriatric-oncology team already during diagnostics (%).*
- "Niiden syöpää hoitavien yksiköiden määrä Suomessa, joissa toteutetaan iäkkäiden potilaiden geriatrista seulontaa ja arviointia (%)." — *Share of cancer units in Finland doing geriatric screening and assessment of older patients (%).*
- "G8 seulan hyödyntäminen ja/tai geriatrin läsnäolo moniammatillisissa hoitotiimeissä, G8 seulan käytön seuranta syövänhoidon eri aloilla." — *Use of the G8 screen and/or a geriatrician in multidisciplinary teams; monitoring G8 use across cancer specialties.*

Sub-goal 3.5 (p. 42, [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)):
- "Ammattilaisten alueellinen jakautuminen, sairauspoissaolot ja työtyytyväisyyskyselyt." — *Regional distribution of professionals, sick leave, and job-satisfaction surveys.*
- "Valmistuneiden ja erikoistumiskoulutuksen suorittaneiden määrä vuosittain." — *Number of graduates and specialist-training completions per year.*
- "Geriatrisen onkologian sisältyminen geriatrian erikoislääkärikoulutukseen." — *Geriatric oncology included in geriatric specialist training.*
- "Perustettu palliatiivisen lääketieteen erikoislääkärikoulutus." — *Palliative-medicine specialist training established.*
- "Digitaalisten hoitopolkujen käyttöaste syöpää hoitavissa yksiköissä." — *Use rate of digital care pathways in cancer units.*

### Goal 3 actions and owners (strategy pp. 34, 36, 38, 40, 42; [roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf) extracts)

| Action | What it says | Owner (strategy) | Timeline (roadmap) | Law change? |
|---|---|---|---|---|
| 3.1.1 National mechanism and permanent funding for cancer treatment recommendations | Nordic-style national coordinated mechanism; 5 M€/yr (25 M€ over 5 yrs) incl. 2.5.2, 3.1.2–3.1.4, 4.3.2 | FICAN; Duodecim; Palko; national cancer multidisciplinary groups; STM | 2026–2028: groups named, contract base, handbook, first recommendation; 2029–2031: first 10 groups finished | Permanent funding to be written into state funding steering as part of keskittämisasetus task ([roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf) p. 54–58, UNVERIFIED on exact legal form) |
| 3.1.2 Cancer care pathways (hoitoketjut) per cancer, plus regional adaptation | Define steps from suspicion to diagnosis, treatment start, treatment, follow-up; agree who does what | FICAN with regional bodies | Not extracted | Not stated |
| 3.1.3 National guidance on costs and societal impact in treatment choices | Use Palko service-range principles in recommendations | FICAN, STM (via Palko project) | 2029–2031 aligned | Not stated |
| 3.1.4 National quality and outcome targets + monitoring indicators | Cancer-specific targets; prioritise largest cancers | FICAN and national groups | Not extracted | Not stated |
| 3.2.1 Legal basis for a national cancer-treatment quality register at THL's Cancer Registry | Start with 5 cancers; permanent model from start of 2028 | STM (**asetusmuutos**, decree change); THL/Syöpärekisteri; FICAN | Permanent model 2028 | **YES — roadmap names "asetusmuutos" (STM)** ([roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf)) |
| 3.3.1 National practices and measures for symptoms, QoL, function, support needs (PROMs) | Integrate PROM data into patient-record systems and OmaKanta | National expert group; THL; regions | Not extracted | Not stated (data integration via systems) |
| 3.3.2 National support-service range and staffing recommendations | Includes third-sector services | Not extracted | Not extracted | Not stated |
| 3.3.4 Social-security reform: cancer patients' income difficulties; loans and insurance; "Oikeus tulla unohdetuksi" legislation | Study special income challenges and required law changes | Working group; social security reform | Not extracted | **YES — "säädösmuutostarpeet" ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 38)** |
| 3.4.1 G8 screen in all cancer units; geriatric assessment for those who screen positive | Normal result → oncologist directly; abnormal → nurse + geriatrician | Wellbeing counties; HUS; Helsinki | Not extracted | Not stated |
| 3.4.3 Geriatric-oncology assessment across care pathway; geriatrician in MDT | Recommended in MDT for surgery planning | Not extracted | Not extracted | Not stated |
| 3.5 Staffing: sustainable staffing strategies; specialist training; palliative-medicine specialist training; digital care pathways | Use Hyvän työn ohjelma; set national job titles | Specialist-training coordination board; universities; wellbeing counties; FICAN | 2026–2029 coordination board | Not stated; national job titles may need rules (UNVERIFIED) |

Strategy p. 40, action 3 (verbatim, Finnish): "Toimintakykytietoa kerätään jo perusterveydenhuollossa ja se kirjataan lähetteeseen." — *Functional-ability information is collected already in primary care and recorded on the referral.* Owner: wellbeing counties, Helsinki, HUS. ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 40.)

### Responsibilities and timelines — summary
- Owners named across Goal 3: FICAN (most actions), STM (decree changes), THL/Syöpärekisteri (registers), wellbeing counties (services and staffing), HUS, Helsinki, universities, third sector.
- Timelines: national recommendation mechanism 2026–2028 setup, 2029–2031 output; quality register permanent from 2028; cancer notifications 90 % automated by 2030; roadmap reviewed in 2030 for second five-year period ([roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf)).
- Cost: whole strategy about 140 M€ additional investment over 2026–2031 ([roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf) p. 2). Goal 3 registry and recommendations are part of the 5 M€/yr line above.

### Data sources named for indicators (strategy and roadmap, plus link collection)
- Syöpärekisteri (Finnish Cancer Registry): annual survival and mortality nationally and by region ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 35). Statistics: https://syoparekisteri.fi/tilastot/. Link collection ([link collection PDF](https://files.hackjunction.app/resources/Sy%C3%B6p%C3%A4strategiat%20ja%20sy%C3%B6p%C3%A4data_linkkikokoelma.pdf)): "Syöpärekisteri, tilastot: syöpätilastosovellus, seulontatilastot" (open statistics app and screening stats).
- THL: "Data ja tilastot" and Sotkanet indicator bank ([link collection PDF](https://files.hackjunction.app/resources/Sy%C3%B6p%C3%A4strategiat%20ja%20sy%C3%B6p%C3%A4data_linkkikokoelma.pdf)). THL Ohjaus 21/2016 for treatment-access monitoring (strategy p. 5, footnote ***): https://www.julkari.fi/items/0424a55a-f159-406f-8883-5dfdad4d6772.
- Statistics Finland: cause-of-death statistics ([link collection PDF](https://files.hackjunction.app/resources/Sy%C3%B6p%C3%A4strategiat%20ja%20sy%C3%B6p%C3%A4data_linkkikokoelma.pdf)).
- Kela and Fimea: drug statistics and special reimbursement ([link collection PDF](https://files.hackjunction.app/resources/Sy%C3%B6p%C3%A4strategiat%20ja%20sy%C3%B6p%C3%A4data_linkkikokoelma.pdf)).
- Findata: data-permit authority for health and social data (https://findata.fi/en/permits/). **Note:** individual-level data needs a Findata permit; the brief bans patient-level data, so use only aggregates.
- Nordcan: Nordic survival comparison (strategy p. 5 footnote; dataset page https://nordcan.iarc.fr/en/dataset, seen in search, not opened).
- Quality registers and national cancer clinical notifications: not yet national ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 35, "Syövän hoidon laaturekisteriä ei ole Suomessa vielä perustettu").

---

## 3. Inefficiencies in the law (and the policy) that slow or unequalise cancer care

Each entry: the rule or gap, why it hurts, pathway stage, evidence, confidence. Law sections are UNVERIFIED where noted.

**3.1 No legal basis for a national cancer-treatment quality register** — *Treatment start / outcomes* — **High** (for the strategy's own statement; law text UNVERIFIED)
- Rule/gap: "Luodaan lainsäädännöllinen pohja THL:n Syöpärekisterin yhteyteen perustettavalle syövän hoidon laaturekisterille" ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 36, action 3.2.1). Roadmap names an "asetusmuutos" by STM ([roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf)).
- Why it hurts: without it, treatment delays and outcomes by region cannot be measured reliably. Strategy: regional comparison is "satunnaista" and based on "karkeisiin ja hajanaisiin mittareihin" (p. 35).
- Source: [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 35–36; [roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf) p. 59–62 (3.2.1).

**3.2 Keskittämisasetus gives FICAN a monitoring task but no money** — *Treatment start* — **High** (strategy claim; decree text UNVERIFIED)
- Rule/gap: the strategy says the National Cancer Centre's task under the centralisation decree is to monitor access and equality, but "toistaiseksi tämän tehtävän toteuttamiseen ei kuitenkaan ole kohdistettu riittäviä resursseja tai rahoitusta" ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 33).
- Why it hurts: the body meant to see waiting-time gaps is not funded to do so.
- Source: strategy PDF p. 33; decree 582/2017 (https://www.finlex.fi/fi/lainsaadanto/2017/582). The decree text itself was not checked.

**3.3 Recommendations and pathways are not coordinated nationally; permanent funding not in law** — *Diagnosis → treatment start* — **High** (strategy); **Med** on legal form
- Rule/gap: "Suomessa ei ole yhtenäistä kansallista järjestelmää, joka ohjaisi syöpäkohtaisten hoitosuositusten laatimista sekä niihin perustuvien hoitoketjujen toteutusta ja seurantaa." Recommendations and pathways "eivät koordinoidu kansallisella tasolla" and this "ylläpitää alueellista eriarvoisuutta" ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 33).
- Why it hurts: each region runs its own pathway, so target times differ. Roadmap says permanent funding must go into state funding steering as part of the keskittämisasetus role (roadmap, action 3.1.1).
- Source: [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 33; [roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf) action 3.1.1.

**3.4 Strategy itself says long-term mandate needs statute changes** — *All stages* — **High** (quoted); **Low** on which statute
- Rule/gap: "Syöpästrategian pitkäjänteiseen toteutukseen tarvittava ja riittävä mandaatti tulee varmistaa säädösmuutoksin" ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 4). Roadmap: "useiden toimenpiteiden osalta toimeenpano edellyttää lisäresursseja ja säädösmuutoksia" ([roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf) p. 2).
- Why it hurts: without statutory mandate, the coordination body (FICAN) depends on annual budget decisions.
- Source: strategy p. 4; roadmap p. 2.

**3.5 Missing statutory link between pathway data and the cancer notification system** — *Detection / diagnosis* — **Med**
- Rule/gap: clinical cancer notifications are not yet automated; target is 90 % automated by 2030 ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 36).
- Why it hurts: late or incomplete notifications delay staging data and make early-detection gains invisible.
- Source: strategy p. 36. Law behind notifications not checked (UNVERIFIED).

**3.6 Referral content does not yet include function status** — *Referral* — **Med** (policy gap; law basis UNVERIFIED)
- Rule/gap: elderly patients' functional status is not standard in referrals. The strategy wants this (action 3.4.1 / strategy p. 40: "Toimintakykytietoa kerätään jo perusterveydenhuollossa ja se kirjataan lähetteeseen").
- Why it hurts: specialists may delay or repeat assessments. Older patients are under-represented in trials (strategy p. 39).
- Source: [strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 39–40.

**3.7 Social-security and loan/insurance rules are not adapted for cancer survivors** — *Treatment start (cost / access) and rehab* — **Med** (flagged for legal review; scope beyond pathway)
- Rule/gap: the strategy says special income problems and loan/insurance access for cancer patients need statute review, including a "Oikeus tulla unohdetuksi" law ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 38, action 3.3.4).
- Why it hurts: financial barriers can delay or stop treatment and return to work; the strategy notes a third of cancer patients are working-age ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 6).
- Source: strategy p. 6, p. 38; roadmap action 3.3.4.

**3.8 Remote care has no comprehensive statute (dated 2015 position; current law unverified)** — *Referral / follow-up* — **Low** (current status UNVERIFIED)
- Rule/gap: STM (10.11.2015) said that remote services "rinnastetaan" to in-person visits if suitable, and that no comprehensive legal rules existed then. The strategy now lists "etävastaanotot" as a key digital solution ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 41).
- Why it hurts: if the legal basis is unclear, providers avoid remote follow-up, which adds travel for rural patients.
- Source: https://stm.fi/-/uusi-linjaus-terveydenhuollon-etapalvelut-rinnastetaan-perinteisiin-vastaanottokaynteihin (2015). Current Valvira/LVV guidance: https://lvv.fi/sosiaali-ja-terveydenhuolto/etapalvelut (UNVERIFIED).

**3.9 Prescribing, referral and imaging-order rights (Laki 559/1994, Terveydenhuoltolaki 1326/2010)** — *Referral / diagnosis* — **Low** (question to check, not a verified inefficiency)
- Rule: who may prescribe, refer, or order imaging [source needed]. Subagent could not read operative sections. A later search found no statement on whether nurses or other licensed professionals may order imaging without a doctor's referral; the law text ([Finlex 559/1994](https://www.finlex.fi/fi/laki/ajantasa/1994/19940559)) was not read for this point.
- The strategy says work-sharing ("työnjaon kehittäminen") and digital tools need to change ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 41), without naming the rules.
- Why it matters: if only doctors may order imaging or refer to specialist care, nurse-led navigation adds steps.
- Source: strategy p. 41 (general statement only). Statute sections: UNVERIFIED.

**3.10 Regional staffing rules and specialist shortages** — *Treatment start* — **Med** (strategy); **Low** (legal link)
- Rule/gap: "Henkilöstön saatavuudessa on alueellisia eroja, ja vaikein tilanne on harvaan asutuilla alueilla" ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 41). Strategy calls for national job titles and education paths (action 3.5.2).
- Why it hurts: uneven staffing makes time to treatment regional.
- Source: strategy p. 41–42. No official cancer-specific shortage figure found (UNVERIFIED).

---

## 4. Ways to work with the current law better than Finnish systems do today

Each is a practical step; the legal basis is given as far as it could be checked. Where basis is missing, it is flagged.

1. **Use the existing THL waiting-time monitoring (Ohjaus 21/2016) for the "treatment within target times" indicator.** Legal basis: strategy names it as the reference for treatment-access monitoring ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 5, footnote ***). It is already in national guidance ([julkari item page](https://www.julkari.fi/items/0424a55a-f159-406f-8883-5dfdad4d6772)); no law change needed. Confidence: med. Pathway: treatment start.
2. **Use Syöpärekisteri aggregate statistics (survival, mortality, screening by region) as the public comparison base.** Basis: Syöpärekisteri publishes annual survival and mortality by region ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 35; statistics at https://syoparekisteri.fi/tilastot/). Aggregate open data, no patient-level data — fits the brief. Confidence: high (data availability); coverage per cancer type UNVERIFIED. Pathway: detection, outcomes.
3. **Standardise geriatric screening with the G8 screen at the referral step (no statute change needed if done as recommended practice).** Basis: strategy action 3.4.1 and strategy p. 40, action 3 (record functional status on referral) ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)). Legal basis for adding it to referral templates: UNVERIFIED (check 559/1994 and record-keeping law). Pathway: referral, diagnosis.
4. **Push the existing "Hoitoonpääsy" target into regional scorecards now.** Basis: strategy target "Potilaat pääsevät hoitoon tavoiteaikojen puitteissa" ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf) p. 5, p. 33). Uses existing monitoring, no new statute. Confidence: med.
5. **Use remote follow-up where the 2015 STM principle applies (suitability-based, equal to in-person) while checking the current Valvira/LVV guidance.** Basis: [STM 10.11.2015 position](https://stm.fi/-/uusi-linjaus-terveydenhuollon-etapalvelut-rinnastetaan-perinteisiin-vastaanottokaynteihin); strategy p. 41 lists etävastaanotot as digital solution ([strategy PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf)). Current legal basis UNVERIFIED. Pathway: referral / follow-up.
6. **Plan for permanent funding of cancer recommendations through the state steering mechanism that the roadmap already describes.** Basis: roadmap action 3.1.1 (5 M€/yr; permanent funding via state funding steering under keskittämisasetus) ([roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf)). Confidence: med. Pathway: treatment start (through national pathways).
7. **Ask FICAN and THL which cancers will be in the first five quality-register cancers and when they will go live.** Basis: roadmap action 3.2.1 (five cancers first; permanent model 2028) ([roadmap PDF](https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf)). Pathway: outcomes and regional comparison.

---

## 5. Open questions for AstraZeneca mentors

1. Which cancers and which stage of the pathway does AstraZeneca see as the biggest waiting-time gap in Finland, and do they have data on referral-to-treatment time by region?
2. Are AstraZeneca's national-access or market-access teams already in contact with FICAN for the national treatment-recommendation mechanism (roadmap action 3.1.1)? Who speaks for industry in that group?
3. Do the medicines reimbursement rules (Kela special reimbursement) delay treatment start in practice? Is there data we can use (Kela, Fimea drug statistics are listed in the link collection)?
4. Which legal change matters most to you: the cancer quality-register decree (3.2.1), permanent funding (3.1.1), or the social-security and loan/insurance changes (3.3.4)?
5. Can nurses or other non-physicians start diagnostic imaging or refer in Finland under current rules? Which section of Laki 559/1994 or Terveydenhuoltolaki 1326/2010 applies? (Our team could not verify this.)
6. Does Valvira/LVV's current remote-care guidance allow remote follow-up after a cancer diagnosis without a prior in-person visit?
7. What is the realistic 2030 target for automated clinical cancer notifications (90 %) in your view, and what is the current baseline?
8. Is there an AstraZeneca-held or partner dataset (aggregate) on time from suspicion to diagnosis, or on geriatric assessment, that we could use without patient-level data?

---

*Confidence key: high = directly quoted from the source page; med = supported by one source but not cross-checked; low = unverified or inferred. VERIFIED/UNVERIFIED marks show whether the source text was actually opened.*
