# 01 Pathway wait-time tracking and patient-flow analytics (tech scan)

Date: 2026-11-14. Scope: current tools for cancer pathway waits, Nordic and UK systems, process mining.
Tags: [READ] = page opened. [SNIPPET] = search result text only. [UNVERIFIED] = memory, not checked.
Note: context.dev search hit rate limits; WebSearch was used as fallback. Only one page was read in full (S1).

## Summary

1. Denmark, Norway, Sweden and England each measure cancer waits against a national clock and publish it [S13, S14, S15, S16]. Finland has no published total-wait clock. Its 2016 THL framework exists, but no routine public report was found [S20].
2. The big EHR vendors (Epic Beacon, Oracle Health) hold the data and can report it [S3, S4, S7]. None was found to ship a Finnish, route-split wait view. Apotti reporting for cancer waits was not found.
3. Point tools (Kaiku, Buddy) track symptoms or care coordination [S11, S12]. They do not measure the total wait, and nobody has shown they split waits by entry route.

## Solutions table

Sources are listed at the bottom (S-numbers).

| solution | what it does | where used | evidence | why it does not solve P1 in Finland | gap left |
| --- | --- | --- | --- | --- | --- |
| Epic Beacon (oncology module) + Epic reporting | Treatment plans, staging, orders, registry reporting; data quality depends on structured fields [S3, S5] | US cancer centers [S4]; Apotti is Epic-based [SNIPPET, https://optimumhit.com/insights/press/apotti-project/ (title: Epic consultants for Apotti)] | Vendor/blog text only [S3, S5] | Beacon is a clinical record, not a national clock. Finnish Beacon use is [UNVERIFIED]. No route split. Data stays inside each hospital. | A national cancer clock over Apotti data |
| Epic Cosmos | Cross-customer dataset; 150+ orgs live per Epic [S6] | US and global | Vendor claim [S6] | No cancer time-to-treatment metric found. Data-sharing terms for Finnish regions unknown. | Cancer wait metric inside Cosmos |
| Oracle Health / Cerner oncology | Oncology EHR announced Sept 2026 with pathway guidance and analytics; many items are future plans [S7] | US | Press release, not product docs [S7] | No wait-time feature confirmed. Finnish Oracle oncology footprint [UNVERIFIED]. | Wait-time clock in any Oracle oncology product |
| Navigating Cancer | Not found in search [source needed] | UK (per name, [UNVERIFIED]) | None | Could not check. Do not cite until verified. | Verify first |
| Kaiku Health (now Elekta) | Patient-reported symptom app; alerts care team on symptom change; 25+ cancer modules, 40+ clinics [S11] | Helsinki-based firm; clinics in Europe; Finnish and German immunotherapy use with Roche [S11] | Company and deal text [S11]; no outcome study read | Measures symptoms, not waits. Gives no referral-to-treatment time. Opt-in patient use, so no population view. Owner changed in 2020 (sources disagree on seller) [S11]. | Symptom data linked to wait clocks |
| Buddy Healthcare (BuddyCare) | Care coordination and patient app; treatment plans, reminders, forms [S12] | Tays (TaysPolku) [S12]; HUS and Oulu deployments per 2017 document [source needed]; Portugal oncology pilot [S12] | Company claim: 90% pathway compliance (own data) [S12]. No independent cancer evaluation found. | Mostly surgical and cardiac use. Cancer claims are general. No national wait output. Finnish-language app [UNVERIFIED]. | Independent wait outcome data |
| Denmark pakkeforløb monitoring (Sundhedsdatastyrelsen, Sundhedsstyrelsen) | Quarterly and yearly reports: share of pathways done within standard times, by region and cancer type, since 2012 [S13] | All Danish regions | Quarterly reports, latest Q1 2025 seen [S13]. 2023 review: small subgroups unreliable; covers about 80-85% of new cancers [S13] | Clock uses registered referral-to-pathway-start date from LPR (national patient register) [S13]. Early symptom-to-referral time is not in the clock. Route split not seen. Danish monitoring model PDF was not readable [READ attempt failed]. | Pre-referral delay, and route split |
| Norway pakkeforløp (Helsedirektoratet indicators, FHI statistics) | 26 pathways. Clock runs from clinical decision on confirmed cancer to treatment start. Target: 70% of cancers in a pathway [S14] | Norway, data from Norsk pasientregister, monthly hospital reporting [S14] | Indicator pages; no current figures found [S14] | Clock starts after diagnosis. Diagnostic pathway has a separate clock ("maksimal anbefalt forløpstid"). Symptom-to-referral time is outside the clock. Route split not seen. | Total symptom-to-treatment time |
| Sweden SVF (standardiserade vårdförlopp), RCC, Väntetidsdatabasen (Signe) | About 30 SVFs. Targets: 70% inclusion, 80% of patients finish within the lead-time limit. Interactive stats per year [S15]. 2019: about 119,000 patients in SVF, about 35% start cancer treatment [S15] | All Swedish regions; national waiting-time database since 2015 [S15] | Official reports and stats [S15] | Lead-time clocks are per SVF, not one total clock. National ledtid data collection was still being prepared in 2025 [S15]. Crowding-out of other care noted in a 2020 analysis [S15]. | Single total clock; route split |
| England Cancer Waiting Times (CWT): 28-day FDS, 62-day, patient tracking lists | Monthly provider and commissioner statistics. Three standards: 28-day FDS, 62-day, and others. Tracking lists give near real-time milestones [S16] | All NHS trusts | Monthly releases [S16]. FDS target differs by source (77% vs 80% for 2025-26); check NHS England [S16] [source needed for the 77% figure]. Tracking lists: up to 4 days less wait in some specialties [S16]. | The 62-day clock starts at referral, not suspicion. Public-to-private route split is not published as far as seen. | Route split, pre-referral time |
| Cancer Pathway Simulator (UCLB, UK) | Analyst tool; outputs waits at each pathway stage [S17] | UK trusts and academics [S17] | Vendor page [SNIPPET] | Model, not live data. Licensed to trusts. | Live national feed |
| Process mining: Fluxicon Disco, Celonis (general) | Rebuilds real patient paths from event logs. Finds variants and bottlenecks [S18, S19] | Academic oncology studies (Disco) [S18, S19]; 2018 Fluxicon award case on cancer fast-path [S18] | 2018 case: only 20% of patients used the fast path; admin rules too rigid [S18]. Breast study: 145 variants in 688 patients [S19]. | Needs event logs from Apotti/Lifecare. Usually single hospital. Not a national clock. Celonis not checked [UNVERIFIED]. | National, repeatable process view |
| Finland THL framework (Ohjaus 21/2016) and Hilmo register | Defines cancer access measures: referral to first visit, referral to treatment, queue to treatment. 16 cancers, about 3/4 of new cases. Uses THL Hilmo data [S20] | THL; 2018-2022 lung report showed regional differences [S20] | 2016 framework [S20]; Hilmo vs Cancer Registry check [S20] | Framework is not a routine public dashboard [S20]. Starts at referral, not symptom. No route split. | A routine public total-wait report |
| HUS waiting-list tables (monthly PDF by specialty) | Count of patients waiting per specialty and median wait [S21] | HUS | Sept 2025: 264 cancer patients waiting, median 8 days. Apr 2026: 235, median 8 days [S21] | Measures time on the waiting list only. Not symptom or referral to treatment. Not split by route. | Pathway-level clock |
| Yle/MOT lung study (unpublished, UEF) | Lung cancer, symptom to treatment: about 155 days in Finland vs 107 Sweden, 67 Denmark. Split: 50+ days patient, 41 primary care, 58 specialist care [S1] | Kuopio, Tampere, Turku, Rovaniemi [S1] | Read [READ]. Sample size not given. | Shows the gap is real, but it is one cancer, four hospitals, and not a monitoring tool. | Repeatable national tracking |

## Notes per Nordic system

- Finland (Apotti, Lifecare, Omni360, Kanta). Yle reports Finland has no national cancer quality registry, unlike other Nordic countries. A EUR 400,000 budget cut was said to remove funding for building one [S1 READ]. HUS notes that Apotti-era patient portals (Maisa) carry invitations and imaging results [SNIPPET, S22]. No Lifecare or Omni360 cancer dashboard was found [UNVERIFIED].
- Finland, policy. The care guarantee window reportedly moved from two weeks to three months. A clinician warned this could delay suspected cancers [SNIPPET, S23]. This is a P1-relevant change, but I did not verify the rule text.
- Denmark. Our reading: the best Nordic model for national reporting by region and cancer type [S13]. Clock starts at pathway start, not symptom [S13]. Route split not seen.
- Norway. Clock starts later than Denmark (confirmed cancer) [S14]. Diagnostic clock is separate. Data comes from national patient register [S14].
- Sweden. Our reading: most detailed by SVF step and region [S15]. National lead-time data collection was still being prepared in 2025 [S15].
- England. Our reading: the most mature public clock (CWT) [S16]. Route split (NHS vs private) not seen in publications.

## White space (nobody does this, from what was found)

1. A total symptom-to-first-treatment clock for Finland, published by region.
2. Any published split by entry route (public GP vs occupational or private).
3. Using Apotti or Lifecare event logs for a national cancer clock. No Finnish example found.
4. Linking symptom apps (Kaiku-type) to wait clocks.
5. Process mining run on Finnish cancer data as a repeatable national service (only one-off studies found).
6. A Finnish-language public dashboard on cancer waits (Finnish and Swedish needed for Helsinki and regional use).
7. Equity cut by income or language in any Nordic cancer wait report (not seen in sources).

## Sources

- S1 https://yle.fi/a/74-20251023 [READ]. MOT/Yle lung-cancer delay study; no national registry.
- S2 https://europesays.com/3305793 [SNIPPET]. Same study, English summary.
- S3 https://www.healthcareitleaders.com/blog/what-is-epic-beacon/ [SNIPPET]
- S4 https://www.epic.com/software/standalone-specialties/ [SNIPPET]
- S5 https://digitalhealth.folio3.com/blog/what-is-epic-beacon-comprehensive-guide/ [SNIPPET]
- S6 https://www.beckershospitalreview.com/ehrs/epic-s-cosmos-has-data-from-millions-of-patients-so-physicians-can-better-treat-the-ones-in-front-of-them.html [SNIPPET]
- S7 https://www.oracle.com/news/announcement/oracle-to-advance-cancer-care-with-new-oncology-ehr-2026-09-23/ [SNIPPET]
- S8 https://www.oracle.com/health/clinical-operations/systems-operations/ [SNIPPET]
- S9 https://www.healthcatalyst.com/products/carevive-by-health-catalyst-oncology-suite [SNIPPET]
- S10 Navigating Cancer: no source found.
- S11 https://nordiclifescience.org/elekta-acquires-kaiku-health/ and https://www.debiopharm.com/?p=7046 [SNIPPET]
- S12 https://www.sttinfo.fi/tiedote/69913347/tampere-university-hospitalbuddy-healthcare-collaboration-bears-fruit-introducing-tayspolku [SNIPPET]; https://fhir.fi/en/demo2025/buddy/ [SNIPPET]; https://www.mobihealthnews.com/news/emea/finnish-buddy-healthcare-receives-eu2m-funding-internationalisation [SNIPPET]
- S13 https://ism.dk/Media/637533794637331197/Monitorering af forløbstider på kræftområdet.pdf [SNIPPET]; https://ft.dk/samling/20241/almdel/SUU/bilag/88/2946349.pdf [SNIPPET]; https://cdn1.gopublic.dk/sundhedsdatastyrelsen/media/16381/Monitoreringsmodel Diagnostisk kraeft.pdf [READ attempt: binary, unreadable]
- S14 https://www.helsedirektoratet.no/statistikk/kvalitetsindikatorer/kreft-behandling-og-overlevelse/gjennomf%C3%B8ring-av-diagnostisk-pakkeforl%C3%B8p-innen-maksimal-anbefalt-forl%C3%B8pstid [SNIPPET]; https://fhi.no/contentassets/3eca84fba90d4f46a9d934adb99859ef/om-statistikken-pakkeforlop-for-kreft.pdf [SNIPPET]
- S15 https://cancercentrum.se/diagnosbehandling/vardforloppsvf.11933.html [SNIPPET]; https://www.socialstyrelsen.se/statistik-och-data/register/vantetidsdatabasen/historik-om-vantetidsdatabasen/ [SNIPPET]; https://www.socialstyrelsen.se/contentassets/237fb7a8a96c4bf4a33e2e2862e1fff3/2025-6-9682.pdf [SNIPPET]; https://cancercentrum.se/download/18.7df1d5341961de0462c34eb/1744380904160/kortare-vantetider-i-cancervarden-slutrapport-2019.pdf [SNIPPET]; https://www.folkhalsoguiden.se/globalassets/verksamheter/forskning-och-utveckling/centrum-for-epidemiologi-och-samhallsmedicin/folkhalsoguiden/rapporter-och-faktablad/faktablad-2020.1-standardiserade-vardforlopp-inom-cancervarden--analys-av-undantrangningseffekter.pdf [SNIPPET]
- S16 https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/09/Cancer-Waiting-Times-Statistical-Release-July-2026-Provider-based-Provisional.pdf [SNIPPET]; https://www.england.nhs.uk/long-read/technology-helps-cancer-patients-to-be-seen-sooner/ [SNIPPET]
- S17 https://xip.uclb.com/product/cancer-pathway-simulator [SNIPPET]
- S18 https://fluxicon.com/pmoty/2018/ [SNIPPET]; https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0339788 [SNIPPET]
- S19 https://doi.org/10.3390/informatics13020028 [SNIPPET]; https://www.researchsquare.com/article/rs-9549473/v1 [SNIPPET]
- S20 https://core.ac.uk/download/78470017.pdf [SNIPPET]; https://core.ac.uk/download/270319454.pdf [SNIPPET]; https://www.verkkouutiset.fi/a/keuhkosyovan-hoidossa-on-suuria-alueellisia-eroja/ [SNIPPET]
- S21 https://www.hus.fi/sites/default/files/2026-05/hoitoa-odottavat-potilaat-erikoisaloittain-2026-huhtikuu.pdf [SNIPPET]; https://www.hus.fi/sites/default/files/2025-10/hoitoa-odottavat-potilaat-erikoisaloittain-2025-syyskuu.pdf [SNIPPET]
- S22 https://www.hus.fi/en/node/8359.md (gynecological cancer pathway) [SNIPPET]
- S23 https://archyde.com/finland-lacks-cancer-treatment-data-and-lags-nordics-mot-says [SNIPPET]
- Patient survey: https://www.sttinfo.fi/tiedote/70972938/kyselyselvitys-joka-kolmas-syopapotilas-kokee-diagnoosin-viivastyneen [SNIPPET]. Survey of 684 patients: one in three felt diagnosis was delayed; about one in five had trouble getting into treatment.
