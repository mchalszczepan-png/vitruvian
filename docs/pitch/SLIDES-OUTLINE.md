# Pitch video outline (2 min)

Junction 2026, AstraZeneca track. We write the slides and script; this only says what each part covers. The three cancers are lung, colorectal and ovarian.

## Running order (116 s)

**0:00 Problem (12 s).** Confirmed wording: "In an unpublished lung cancer study reported by Yle, 41 of 155 days were in primary healthcare" (https://yle.fi/a/74-20251023). If you want a route gap, there is one source only: "In one lymphoma cohort (n=160), median time to treatment was 127 days via primary healthcare vs 76 days via private or occupational care (p=0.027)" (Kuitunen et al. 2026, https://doi.org/10.1002/cam4.71920, Incyte-supported). Both are national figures.

**0:12 Where the gap opens (12 s).** Patients come back to the GP several times, and referral quality varies (our expert interview, `docs/discovery/09-expert-interview-2026-11-14.md`). Confirmed wording: "Spread data (TNM, stage or free text) was recorded for 41.9% of solid cancers in Finland in 2024; 58.1% had none" (Cancer Registry 2024 report, https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html). Stage alone was 5.4%. The registry says the cause is that clinical notifications arrive for only about half of new cases. Don't frame it as GPs failing.

**0:24 What Vitruvian is (6 s).** One sentence: a GP aid that flags repeat visits, fills the referral and shows a county where its gaps are.

**0:30 Demo (67 s).**
- Matti's history with the repeat-visit flag (8 s).
- GP types notes, Gemma fills the referral template, missing fields show in red (10 s).
- The aid: AI estimate (say 8/10) next to the cited rules (NICE NG12, Käypä hoito) and severity, then the GP refers (13 s). Matti's severity is 16.7% five-year survival, NORDCAN Finland 2017–2021, men 60–69 (Johansson et al. 2024, Table 2, https://pmc.ncbi.nlm.nih.gov/articles/PMC11332520/). Same table, men 60–69: colorectal 68.1%. Ovarian: "about half of Finnish women with ovarian cancer survive 5 years" (49.1%, Finland 2017–2021, age-standardised, NORDCAN data in Hemminki et al., Cancers 2024, Supplementary Table S3, https://pmc.ncbi.nlm.nih.gov/articles/PMC11201377). For the "catch it early" point only, use US data, labelled US: localised 91.9% vs distant 31.5% (SEER 2016–2022, https://seer.cancer.gov/statfacts/html/ovary.html). Your line idea fits here: hard to spot in one visit, easier across three, we connect the visits and suggest CA-125. Keep it clear the GP decides on the test. For an all-ages lung figure, use 16.4% men, 25.5% women (2016–2020, Clin Epidemiol 2023). All checked in `docs/build/staging-and-severity.md`.
- The finished referral (6 s).
- Staging reports (10 s). Cut colorectal and ovarian first if time is short. If someone asks why ovarian: its vague symptoms bring repeat GP visits, and NICE NG12 lets the GP order CA-125. Details in `docs/build/cancer-choice.md`.
- County gap screen (20 s). This is the part that wins Actionability. Show Pirkanmaa at 71.9% with spread data recorded against Sisä-Suomi at 60.4%, and lung surgery wait of 13.5 days in the North against 46 in the South. Then say what a county does next and tie it to the Goal 3 indicator "Potilaat pääsevät hoitoon tavoiteaikojen puitteissa" (cancer strategy p. 33). Figures and sources are in `docs/build/county-gap-data.md`.

**1:37 How it works (9 s).** Gemma for the template, the Gemini Decisions API asking one yes/no question per rule (paid key, GDPR compliant), Convex vector search for repeat visits.

**1:46 Fit with Finland (6 s).** Omaolo could feed the tool. In many places GPs can't order a CT directly.

**1:52 Ask and team (4 s).** One county pilot, then one referral template across counties. One builder running coding agents, one person on slides and voice.

## Criteria

Problem and gap slides carry Impact. The demo carries Technical and Design. The county screen and the ask carry Actionability and the Goal 3 link.

## Don't say

- "Fine-tuned" (unless the LoRA run finished), "validated", or that the score is a probability. The rules don't set the score.
- That the AI diagnoses or decides, or that it has regulatory clearance, uses real patients, runs fully local, or connects live to registries or Apotti.
- "A third", or 41/155 as a public vs occupational comparison, or 155 as published.
- "Hospitals don't send reports". Use the registry's cause: clinical notifications arrive for only about half of new cases.
- 41.9% as "stage recorded" (it's spread data; stage alone is 5.4%).
- The lymphoma route gap as a county figure, or as true for all cancers.
- "By county" for the lung surgery figures (they're cooperation areas). Don't mix area levels.
- That Pirkanmaa's rise from 42% to 80% notifications came from this workflow (a national order landed at the same time).
- That it cuts days or returned referrals, or that Omaolo already feeds it.
- "No fast track" (say "no national one"), or that GPs can't order CT anywhere.
- A number for the target times. The strategy doesn't give one.
- OECD fines.
- "Colon 73%" (that was the cervix figure). If you need colon survival, use 68%, both sexes, 2024, age-standardised (Sotkanet 3627).
- Survival by stage for Finland. No Finnish figures exist from 2010 onward.
- Ovarian 89% stage I vs 20% stage IV. It's unverified, so use the SEER figures instead.
- The SEER ovarian figures as Finnish. Always say "US data". Use 49.1% for Finland, not SEER's 52.0%.

## Open questions

None.
