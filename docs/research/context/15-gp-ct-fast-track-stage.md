# GP CT, fast tracks, stage in referral, Kuittinen split, hospital contacts

Researched 2026-11-14 (Sat afternoon) with the context.dev MCP (web-search, web-scrape, web-answers, get-news-search) via five parallel Haiku agents, one per question. The main session merged the results. AfterQuery was not available (no tool), so it was not used. "Opened" = page text fetched. "Snippet" = search result only, not opened. Anything unsourced is marked **[source needed]**. Absence of a finding is not proof of absence.

Builds on: `docs/discovery/09-expert-interview-2026-11-14.md`, `14-kuittinen-delay-study.md`.

## Short answers

| # | Question | Short answer | Confidence |
| --- | --- | --- | --- |
| 1 | Can a GP order CT for suspected cancer? | **Too strong to say "no".** No legal ban (Lääkärilehti: "no legal obstacles", but not the practice). County guidance mostly makes CT a specialist-requested test. **Satakunta is the exception for lung cancer** (GP can send for lung CT directly if 20+ pack-years plus symptoms; news report, conflicts with Satakunta's own pages). No county found that names colorectal or head-and-neck CT as GP-direct. | M |
| 2 | Any county fast track / syöpäpolku from primary care? | **Only Satakunta lung** (pilot 2022, standard from 2024). No branded fast track in Tays, HUS or the others checked. Nationally only proposals (Syöpäjärjestöt wants Denmark's "punalappumalli", the red-flag model). Closest national rule: urgent GP suspected-cancer referral should see a specialist within 2 weeks (monitoring definition, snippet only). | M for Satakunta, L for "none elsewhere" |
| 3 | Which county requires stage in the GP referral? | **None found that asks for stage as a form field.** Closest: **PSHVA / KYS Syöpäkeskus**, whose referral is possible only after "cancer diagnosis and spread are confirmed". That is a precondition for the oncology clinic, not a GP stage field, and is probably what the expert meant. Pirkanmaa's checklist asks for test results, not stage. | M |
| 4 | Newer Kuittinen sources and the exact split | **Published 12 Oct 2026** (not 2025; the "2025" in the URL slug is an ID). Split in Finnish and English: 155 total, patient "yli 50", primary care 41, specialised care 58. **No exact patient figure is published.** No UEF release, abstract, preprint or trial entry found. New: the Finnish article says Kuittinen wants GPs to order CT directly, and her main ask is a "pikakaista" (fast lane) for suspected cancer. | H for date and split |
| 5 | Phone routes at 2 hospitals | **Only TAYS switchboard 03 311 611 is open on weekends (daily 7-23).** KYS cancer clinic line is weekdays only. Realistic call day: **Mon 16 Nov**. Table below. | H for numbers opened |

## What this means for us (one line each)

- The "GP can't order CT" pain point is real as common practice, but it is **a rule choice, not a law**. That makes a GP-triggered CT in the fast lane a policy change, not a legal one. Use "mostly specialist-requested", not "impossible".
- Kuittinen herself backs GP-ordered CT and a fast lane. That is a citable academic voice for package A.
- Satakunta lung is a **live local precedent**: say "Satakunta already does this for lung; we generalise it".
- "Stage in referral": do not claim a county requires it. Say "referral content varies; KYS wants spread confirmed before oncology referral".

## 1. GP ordering CT (evidence)

| County | GP direct CT? | Quote (FI / EN) | Source | Conf. |
| --- | --- | --- | --- | --- |
| National (lung CT criteria, Palveluvalikoimaneuvosto 2022) | Not a GP rule | "Keuhkosyöpäepäilyn takia potilas lähetetään erikoissairaanhoitoon keuhkoklinikalle… Levinneisyystutkimuksena potilaalle tehdään TT." / Suspected lung cancer goes to the specialist lung clinic; staging CT is done there. | [PDF](https://palveluvalikoima.fi/documents/1237350/100534609/Keuhko+TT-kriteerit+150222.pdf/39286909-e231-4473-c52e-4a1fb2b87fd3/Keuhko+TT-kriteerit+150222.pdf?t=1645013502397) | H |
| Varha (Varsinais-Suomi) | Mostly no; radiologist advice is the exception | "TT on pääsääntöisesti erikoissairaanhoidosta pyydettävä tutkimus, mutta radiologin suosituksesta…" / CT is mainly requested from specialist care, but on radiologist advice a symptom can be investigated with CT. Organ-specific lists were not readable. | [hoito-ohjeet.fi](https://hoito-ohjeet.fi/fi/Ohjepankki/VSSHP/Aikuispotilaiden%20kuvantamissuositus%20perusterveydenhuollon%20avovastaanotolle.pdf) | M |
| Satakunta, guide (2/2026) | Mostly no | "TT on pääsääntöisesti erikoissairaanhoidosta pyydettävä tutkimus… Jatkokuvantamisen pyytäjä määräytyy sen perusteella, kuuluuko epäillyn taudin diagnostiikka perusterveydenhuoltoon vai erikoissairaanhoitoon." / Who requests follow-up imaging depends on whether diagnosis belongs to primary or specialist care. | [guide](https://hoito-ohjeet.fi/fi/Ohjepankki/SATSHP/Aikuispotilaiden%20kuvantamissuositus%20perusterveydenhuollon%20avovastaanotoille%20Satakunnan%20hyvinvointialueella) | M |
| Satakunta, CT service page | No | "TT-tutkimukseen tarvitaan aina erikoislääkärin lähete." / A CT always needs a specialist's referral. | [page](https://satakunnanhyvinvointialue.fi/palvelut/sairaala/kuvantaminen/tietokonetomografiatutkimus/) | M |
| **Satakunta, lung pathway (news)** | **Yes, lung** | "keuhkosyöpää epäiltäessä potilas voidaan lähettää keuhkojen TT-kuvaukseen suoraan perusterveydenhuollosta. Aiemmin… on yleensä edellyttänyt erikoissairaanhoidon arviota." / Suspected lung cancer: patient can go to lung CT directly from primary care. Criteria: 20+ pack-years plus symptoms. Pilot 2022, standard 2024, about 170 patients. | [Satakunnan Kansa, 2026-11-11](https://www.satakunnankansa.fi/satakunta/art-2000012403607.html) (opened; newspaper; conflicts with the two official Satakunta pages above) | M |
| Pirkanmaa (Tays) | Not found | "Tutkimukseen pääsemiseksi tarvitset lääkärin lähetteen." / You need a physician's referral. Lung work-up is specialist-led. | [suomi.fi](https://www.suomi.fi/palvelut/tietokonetomografia-pirkanmaan-hyvinvointialue/ca56f234-c34f-4a6d-8c10-219a98128175), [Pirha lung path](https://www.pirha.fi/fi/asiakkaalle/hoito-ja-palvelupolut/keuhkosyopapotilaan-hoitopolku) | L |
| Pohde (OYS) | **[source needed]** | "Tarvitset aina lähetteen kuvantamistutkimuksiin." / A referral is always needed (no GP vs specialist rule). | [suomi.fi](https://www.suomi.fi/palvelut/palvelupiste/oys-b-kuvantaminen-pohjois-pohjanmaan-hyvinvointialue/a4fcc3a8-e169-4610-bbb8-611c7c8bcebf) | L |
| PSHVA (KYS) | **[source needed]** | Lung: suspected on X-ray and symptoms, patient is sent to the KYS lung clinic. | [KYS lung pathway PDF](https://syovanhoitokeskus.pshyvinvointialue.fi/documents/268336/269724/KYS+Keuhkosy%C3%B6p%C3%A4potilaan+hoitoketju.pdf/547c35a2-5382-68b4-5bac-afcff530959d?t=1646069320177) (snippet) | L |
| Keski-Suomi | Not found | GP refers to lung clinic after X-ray; staging CT is a pre-visit test; who orders it is not stated. | [Hyvaks](https://www.hyvaks.fi/asiakkaana/hoitopolut/keuhkosyopapotilaan-hoitopolku) | M (pathway), L (CT orderer) |
| HUS | Not found | "Kaikkiin kuvantamistutkimuksiin tulee olla lääkärin tekemään arvioon perustuva lähete." / Any imaging needs a physician's referral. No GP vs specialist rule. | [HUS Diagnostiikkakeskus PDF](https://diagnostiikka.hus.fi/documents/20117/40213/diagnostiikkakeskuksen_kuvantamistutkimuksiin_lahettaminen.pdf/b637c704-ccfd-d964-261b-392fe207b7d1?version=1.0&t=1725273202175&download=false) | L |

Other evidence:
- Lääkärilehti, Mattson: "Tämä ei ole toimintatapa, mutta siihen ei ole juridisia esteitä." / This is not the practice, but there are no legal obstacles. Also: "Perusterveydenhuollossa voidaan tehdä lähete, mutta päätöksen kuvantamisesta tekee radiologi." / In primary care a referral can be made, but the radiologist decides. [Article](https://www.laakarilehti.fi/terveydenhuolto/hoitoviive-heikentaa-syopien-ennustetta/) (snippet, date not confirmed). M.
- Syöpäjärjestöt (J. P. Turunen) on Yle Kotimaa: "Perusterveydenhuollossa ei voi tehdä tietokonetomografiakuvaa." / In primary care you cannot do a CT scan. [Yle](https://yle.fi/a/74-20250979) (opened). This is a lobby group's statement, not a rule text. M.
- Kuittinen (journalist paraphrase, Finnish Yle): GPs should be able to order CT directly "sen sijaan, että potilas joutuu siirtymään erikoissairaanhoidon puolelle jonottamaan kuvauksia". [Yle](https://yle.fi/a/74-20242733) (opened). M.

Gaps: Pirkanmaa, HUS, Pohde and PSHVA full referral guides were not opened. Varha organ lists (lung, colorectal, head and neck) were truncated; the Varha CT professional guide ("Tietokonetomografiatutkimuksen ammattilaisohje") was not opened. Satakunta's conflict needs a written rule from the county.

## 2. Fast tracks from primary care

| Org | Pathway | Cancers | GP entry? | Start | Source | Conf. |
| --- | --- | --- | --- | --- | --- | --- |
| **Satakunta** | "uusi hoitopolku keuhkosyövän löytämiseksi" (new pathway to find lung cancer) | Lung only | Yes: direct lung CT, 20+ pack-years plus symptoms | Pilot 2022; standard 2024 | [Satakunnan Kansa](https://www.satakunnankansa.fi/satakunta/art-2000012403607.html) (opened, newspaper). County's own page not found. | M |
| Tays (Pirkanmaa) | No branded pathway. "Syövän hoitoon tai syöpäepäilyyn liittyvät lähetteet luokitellaan kiireelliseksi", handled in 1-2 working days. | All suspected cancer | Referral needed | [source needed] | [Pirha](https://www.pirha.fi/palvelut/sairaalat-tays/syopa/syopaepaily-ja-diagnoosi) (opened) | H |
| HUS | 17 "syövän hoitopolkua"; each starts in primary care and runs to the referral. Not a fast track. | Not verified | No fast entry found | Published 2024-02-07 | [Lääkärilehti](https://www.laakarilehti.fi/terveydenhuolto/tietoa-syopien-hoitopoluista-husin-verkkosivuilla/) (opened) | M / L |
| Varha, Pohde, PSHVA, Keusote | None found | | | | Varha [TYKS page](https://www.tyks.fi/potilaille-ja-laheisille/hoidot-ja-tutkimukset/syopa/syopapotilaiden-hoitoonpaasy-tyksissa) (snippet: first treatment at latest 4-6 weeks after referral), Pohde [OYS lung referral](https://oys.fi/keuhkosyovan-hoitopolku/lahete/) (snippet, page returned 404) | L |
| Other counties (Kanta-Häme, Päijät-Häme, Etelä-Savo, Lappi, Kainuu, others) | None found | | | | not opened | L |
| National | Strategy 2026-2035 and roadmap 2026-2031 exist; no GP-started fast track in force | All | n/a | Roadmap 2026-09-23 | [STM](https://stm.fi/-/tuore-tiekartta-kertoo-kuinka-kansallista-syopastrategiaa-toteutetaan-vuosina-2026-2031) (opened) | H |
| Syöpäjärjestöt | **Proposal:** "punalappumalli" (red-flag model from Denmark). "Suomi voisi ottaa oppia Tanskasta" | Lung and others | Not in force | Proposed 2026-10-12 | [Yle](https://yle.fi/a/74-20250979) (opened). Lung wait: Denmark 67 days, Finland 155 | H (proposal only) |
| National rule (monitoring) | "yleislääkärin kiireellisen, syöpäepäilyn vuoksi tehdyn lähetteen jälkeen saa kulua korkeintaan kaksi viikkoa ensimmäiseen erikois-…" / At most two weeks from a GP's urgent suspected-cancer referral to first specialist visit. | All | A target, not a pathway | unknown | [Julkari PDF](https://www.julkari.fi/server/api/core/bitstreams/f99e6277-82c4-4ef7-9313-588e4b9f0f4f/content) (snippet; scrape returned 404) | M-L |

Not found in Finnish sources: the term "pakkeforløb" and any Käypä hoito, Cancer Registry or THL fast-track page (not checked in depth). **[source needed]**

## 3. Stage in the GP referral

| County | Asks for stage? | What the referral must include | Source | Conf. |
| --- | --- | --- | --- | --- |
| **PSHVA (KYS Syöpäkeskus)** | **Indirect.** Referral only after spread is confirmed. No stage field. | Diagnosis, reason, symptoms, status; earlier tests and treatments; lab and imaging results; other diseases and medication; imaging to KYS PACS. | [KYS referral PDF, 17.12.2024](https://pshyvinvointialue.fi/documents/594193/718131/L%C3%A4hete+KYSin+Sy%C3%B6p%C3%A4keskuksen+poliklinikalle+(1).pdf/3208c138-2eab-83fe-8aec-73e06a5194ec?t=1734444214409) (opened) | M |
| Pirkanmaa | No stage field | Checklist: problem; "tehtyjen diagnostisten ja muiden tutkimusten tulokset"; patient status; whether the patient knows of the suspicion. Staging is planned by the specialist after referral. | [Pirha referral guide](https://www.pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/syopatautien-laheteohjeet-ja-konsultaatiot), [syöpäepäily](https://www.pirha.fi/palvelut/sairaalat-tays/syopa/syopaepaily-ja-diagnoosi) (opened) | H |
| Keski-Suomi (lung) | No | "Lähetteen tietojen perusteella määritetään tarvittavat jatkotutkimukset…" / Follow-up tests are set from the referral. | [Hyvaks](https://www.hyvaks.fi/asiakkaana/hoitopolut/keuhkosyopapotilaan-hoitopolku) (opened) | M |
| National lung guideline (Duodecim) | Stage is a specialist-care step | "Levinneisyystutkimukset… keuhkojen ja ylävatsan TT" under tests done in specialist care. Primary care may do labs while preparing the referral. | [Duodecim](https://www.duodecimlehti.fi/duo92223) (opened) | M |
| HUS, Varha, Pohde, Keusote, Kanta-Häme, Satakunta, Päijät-Häme | **[source needed]** | Only patient-facing pages or 404s; no referral checklist opened | | L |

Key KYS quote: "Lähete Syöpäkeskuksen poliklinikalle on mahdollista tehdä sen jälkeen, kun syöpädiagnoosi ja syövän levinneisyys on varmistettu (levinneisyystutkimukset eivät ole välttämättömiä lymfoomien ja kivessyövän osalta)." / A referral to the Cancer Centre clinic can be made after the diagnosis and spread are confirmed (spread studies are not needed for lymphoma and testicular cancer).

Not opened: the Pirha lung PDF (timed out), and colorectal, breast, prostate, melanoma and head-and-neck checklists. **Open question for the expert:** did they mean this KYS rule? It is the only stage-related requirement found, and it is a precondition, not a form field.

## 4. Kuittinen delay study

| Item | Value | Source |
| --- | --- | --- |
| Published | **2026-10-12** (Finnish 05:30, English 14:08, Kotimaa 16:55); MOT broadcast 2026-10-11 | [FI](https://yle.fi/a/74-20242733), [EN](https://yle.fi/a/74-20251023), [Kotimaa](https://yle.fi/a/74-20250979), [Areena](https://areena.yle.fi/1-76546997) (all opened) |
| Total | 155 days, symptom onset to treatment | EN, Kotimaa |
| Patient | "yli 50" (more than 50). **No exact number published.** | FI: "potilaasta itsestään johtuva viive on yli 50 päivää" |
| Primary care | 41 days | FI: "perusterveydenhuollossa kuluu 41 päivää" |
| Specialised care | 58 days | FI: "erikoissairaanhoidossa 58 päivää" |
| Compare | Sweden 107, Denmark 67 | EN, FI |
| Status | Unpublished; FI: "Alustavien tulosten mukaan… Vielä julkaisematon tutkimus" (preliminary) | [FI short](https://yle.fi/uutiset/lyhyesti/74-20242733) |

- **Arithmetic:** 50 + 41 + 58 = 149. If the three stages sum exactly to 155 and 41 and 58 are exact, the patient share is 56 days. That is **our derivation (L)**, not a published figure. Do not put "56" on a slide as her number; say "over 50".
- **Correction to earlier notes:** `14-kuittinen-delay-study.md` and `RESEARCH-SUMMARY.md` read the URL slug "74-20251023" as a 2025 date. It is an ID; the article is from **12 Oct 2026**.
- **Specialised-care wording (FI):** the wait is for "kuvaukseen, kuvauslausuntoon ja näytteenottoon" (imaging, imaging report, sampling). So the expert's "GP runs tests" third is the specialised-care imaging wait in Yle's version.
- **Primary-care causes (MOT's wording, not attributed to Kuittinen):** patient cannot see a doctor fast enough; a nurse may not see urgency; GP diagnostic errors.
- **What Kuittinen says would help (FI):** "Tärkein olisi kuitenkin pikakaista syöpäepäilyssä" (the most important would be a fast lane for suspected cancer); GPs should be able to order CT directly (journalist paraphrase); train primary-care doctors to recognise symptoms.
- **Patient reasons:** Yle's Finnish text cites a Syöpäjärjestöt survey (financial reasons, fear), not the Kuittinen study: "Syitä ei ole tutkittu". [STT release](https://www.sttinfo.fi/tiedote/71158929/moni-valttelee-laakariin-menoa-mahdollisten-syopaoireiden-vuoksi?publisherId=69820264&lang=fi) (snippet). So the expert's list (trust, background, knowledge) is not in Yle.
- **The 400,000 euro figure:** two different uses in the Finnish article: the budget cut for the cancer quality registry, and Kuittinen's lymphoma treatment cost remark. Do not mix them.
- **Newer sources:** none beyond the Yle set. No UEF release, conference abstract, preprint, trial registry entry, HS, Savon Sanomat, Mediuutiset or Lääkärilehti article found. A Kymen Sanomat reader letter (2026-10-15) repeats "about five months" only. [Link](https://www.kymensanomat.fi/paakirjoitus-mielipide/9873304). Absence is not proof; **[source needed]** for any peer-reviewed version.
- Tool note: context.dev `web-answers` wrongly said the patient days were "not stated". Do not trust it for that field.

## 5. Contact routes (official unit lines only)

Today is Saturday. Only one route is documented as open on weekends.

| Hospital | Unit | Phone | Hours | For | Source | Conf. |
| --- | --- | --- | --- | --- | --- | --- |
| **TAYS (Pirkanmaa)** | Hospital switchboard, ask for oncology consultation | 03 311 611 | **Daily 7-23** | Professionals (page says call if needed; asks for written or electronic consultation first) | [Pirha](https://www.pirha.fi/ammattilaiselle/ohjeet-ja-toimintamallit/hoitoon-ohjaaminen-laheteohjeet-ja-konsultaatiot/syopatautien-laheteohjeet-ja-konsultaatiot) (opened) | H |
| TAYS | Syöpätautien poliklinikka (callback) | 03 311 63136 | weekday hours **[source needed]** | General | [suomi.fi](https://www.suomi.fi/palvelut/puhelinasiointi/syopatautien-poliklinikka-tays-keskussairaala-pirkanmaan-hyvinvointialue/a04d939c-d78a-43ce-b218-8947bf4d6ee4) (opened) | H number, L hours |
| TAYS | Referral fax | 03 311 63019 | n/a | Referrals | same Pirha page | H |
| **KYS (Pohjois-Savo)** | Syöpätautien poliklinikka (callback) | 017 273 6022 | **Mon-Fri 8-12**; callback next working day | General | [suomi.fi](https://www.suomi.fi/palvelut/puhelinasiointi/syopatautien-poliklinikka-pohjois-savon-hyvinvointialue/e44d8c2c-ff6b-41f9-83b8-26378d0d5649), [PSHVA](https://pshyvinvointialue.fi/syopatautien-ja-sadehoidon-palvelut) (both opened) | H |
| KYS | Palliative consultation team | 044 717 9384 | not checked | Professionals, **palliative only** | PSHVA page above | M |
| KYS | GP-office central phone service, Keskinen area (routing, not cancer-specific) | 017 273 4700 (option 2 for referrals) | Mon-Thu 8-16, Fri 8-15.30 | GP offices | [PSHVA](https://pshyvinvointialue.fi/laakari-ja-hoitavastaanottojen-keskitetyn-puhelinpalvelun-ohjeet) | M |
| OYS (Pohde) | Syöpä- ja veritautien poliklinikka | 08 315 3207 | 8.15-14.15 | Patients/family per page | [OYS](https://oys.fi/palvelut/syopa-ja-veritautien-hoito-sairaalassa/?area=oulu) | M |
| TYKS (Varha) | Syöpäpoliklinikka (callback) | 02 313 1820 and 02 313 0377 | Weekdays 8-14 | Follow-up patients | [TYKS](https://www.tyks.fi/potilaille-ja-laheisille/sairaalat-ja-toimipisteet/tyks-t-sairaala/syopapoliklinikka) (opened) | H |
| HUS | Syöpäkeskus phone service | 09 471 74900 | Mon-Fri 7.30-16 | General | [HUS](https://www.hus.fi/potilaalle/sairaalat-ja-toimipisteet/syopakeskus) (opened) | H number, M audience |

- Do **not** use KYS 017 172 941 (old number in the 2024 referral PDF).
- Professional cancer consultation lines for OYS, HUS and TYKS: **[source needed]**.
- Ask for "lähete" (referral) and "konsultaatio" routes separately; patient lines may not take GP questions. KYS and TAYS are the two hospitals asked about; Monday 16 Nov is the realistic call day for KYS.

## Overall confidence and what to check next

| Claim we may use | Safe wording |
| --- | --- |
| GP CT | "In most counties CT is requested by specialists; Satakunta lets GPs send suspected-lung-cancer patients directly (since 2024). Not a legal ban." |
| Fast track | "No national or branded GP fast track found; Satakunta lung is the one precedent we found; Denmark's red-flag model is proposed by Syöpäjärjestöt." |
| Stage | "No county found that requires stage in the GP referral; KYS oncology wants spread confirmed first." |
| Delay | "155 days: over 50 patient, 41 primary care, 58 specialised (Yle MOT, 12 Oct 2026, unpublished preliminary study)." |

Check next (30 min): (1) ask the AZ expert which county requires stage; (2) call TAYS 03 311 611 tonight, ask whether GPs can order lung CT and what the referral must contain; (3) find Satakunta's written lung-CT rule; (4) open the Varha CT professional guide and the Pirha lung PDF.
