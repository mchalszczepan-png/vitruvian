# Published risk (PPV) evidence

Research prototype. Not a medical device. Not for clinical use.

`risk-ppv.json` holds published positive predictive values (PPV) for suspected **lung**, **colorectal** and **ovarian** cancer. The app shows the highest applicable one as "Published risk: X% (source)", next to the AI Risk gradient. No patient-level data is used anywhere. Every number is an aggregate from a published study.

## What a PPV is here

The chance (%) that a patient who has the symptom or finding has that cancer, in the study population. Most rows are UK primary care, a **consulting** population. A GP in Finland sees a different population, so these are an aid for the doctor, not a Finnish prevalence figure.

## Rows

| Cancer | Rows | Main sources |
| --- | --- | --- |
| Lung | 22 | Jones 2007 BMJ (haemoptysis by age and sex, 3-year window); Hamilton 2005 Thorax values as tabulated by a 2026 systematic review (secondary); CAPER 2009 haemoptysis 2.4% (secondary) |
| Colorectal | 29 | Hamilton 2005 BJC (rectal bleeding, weight loss, abdominal pain, diarrhoea, anaemia, by age band); Hamilton 2008 BJC (iron-deficiency anaemia, men over 60: 13.3%, women: 7.7%); Jones 2007 BMJ (rectal bleeding by age and sex) |
| Ovarian | 10 | Hamilton 2009 BMJ (7 single symptoms, 1 pair, women 40+); NICE NG12 evidence review B (CA-125 at or above 35 U/mL, under 50: 2%, 50 or over: 12.5%) |

Each row has: `id`, `symptoms[]` (closed list, see `symptomKeys`), `ageBand`/`ageMin`/`ageMax`, `sex`, `ppvPct`, `ci`, `studyPopulation`, `year`, `tier`, `source{label,url}`, `quote` (verbatim, checked against the saved source text), `quoteLocation`, and `question` (one yes/no question about the whole visit history, answered by the Gemini Decisions API).

`tier` is `primary` (we read the number in the paper or the NICE document) or `secondary` (the number comes from a review that tabulates the paper; we could not read the paper itself).

## How to combine rows

1. The Decisions API answers each row's `question` for the suspected cancer: yes or no, with a reason.
2. Keep only the rows answered **yes**.
3. Within the same symptom group, keep the **narrowest** age band that applies (for example 70+ beats 40+; 65 to 74 beats all ages). Prefer a sex-specific row to a sex-neutral one.
4. The Published risk is the **highest** PPV among what is left. Show that row, its source and the reason.
5. **Never multiply or add PPVs.** They come from different studies and populations. A pair row (abdominal distension with loss of appetite, ovarian) is used only because a study measured that pair.
6. No row answered yes: show "no published evidence row applies". Do not show 0%.
7. A row with `ppvIsLowerBound: true` is shown as "5% or more".

## The 3% threshold

NICE NG12 uses a PPV of **3% or above** as the level at which a suspected-cancer pathway referral is justified.

> "The committee agreed to retain from the previous guideline a positive predictive value of 3% or above to make recommendations, this has been consistently used within this guideline as a threshold at which the advantages of a suspected cancer pathway referral in those adults with cancer outweighed the disadvantages" (NICE NG12 evidence review D, section 1.1.8.2, April 2026)

Source: https://www.nice.org.uk/guidance/ng12/evidence/d-unexplained-weight-loss-as-a-non-site-specific-symptom-in-adults-in-primary-care-pdf-15669144114

The app may show whether the Published risk is at or above 3%. It does not say "refer". The doctor decides (decision 16: GP only).

## Caveats

- **UK primary care, not Finnish.** Different referral habits, different baseline risk.
- **Aggregate, not personal.** A PPV describes a group. It is not this patient's probability.
- **Outcome differences.** Jones 2007 haemoptysis rows use "respiratory tract cancer" as the outcome (lung is most of it). Jones windows are 3 years after the first episode.
- **Case-control PPVs** (Hamilton) depend on the matched controls and are for one symptom at a time.
- **Age bands overlap** (40+, 40 to 69, 70+). The narrowest-band rule above handles it.
- **Old data.** Studies run from 2005 to 2025.
- **Facts gap.** The structured facts (`facts.ts`) have no field for chest pain, abdominal pain, diarrhoea or distension. Those rows can only be decided from the full visit notes, which the Decisions API reads. The deterministic stub covers only the mapped facts.
- **Cough rows** need a count of visits with a cough (2 or 3). Facts hold only `coughWeeks`, so the Decisions API decides them from the notes.
- **CA-125 rows** (`needsHumanCheck`): the NICE PDF table text is garbled. The numbers (2% and 12.5%, Arendse 2025 row) were matched by hand. Check the cells in the PDF before relying on them.
- **Ovarian pair row**: the authors set ">5%" because no control had both symptoms, so 5 is a lower bound.

## Left out, and why

- **QCancer** (risk algorithms): the licence is unclear (LGPL v3 in the papers, AGPL v3 in the code mirror headers, papers CC BY-NC, official source unreachable). Not used.
- **Hamilton 2005 Thorax and CAPER lung by symptom**: full text blocked or only in a figure image. Lung rows from there are secondary or missing.
- **Haemoptysis 17%**: a secondary, "recurrent" figure that conflicts with the primary rows.
- **Haemoptysis 2.9%**: a population with a negative chest X-ray, a different question.
- **Jones 6-month rows**: window differs from the 3-year rows. Not mixed.
- **Odds ratios and pooled estimates** (Jellema 2010, Astin 2011, Holtedahl 2021): not PPVs, or no verified pair PPV. Not used.
- **FIT (colorectal)**: no verified PPV found.
- **Anything unverifiable**: left out.

## Source index

- Jones R et al. BMJ 2007, alarm symptoms and cancer in primary care (GPRD): https://pmc.ncbi.nlm.nih.gov/articles/PMC1871798/
- Hamilton W et al. Br J Cancer 2005, colorectal cancer symptoms: https://pmc.ncbi.nlm.nih.gov/articles/PMC2361578/
- Hamilton W et al. Br J Cancer 2008, anaemia and iron deficiency: https://pmc.ncbi.nlm.nih.gov/articles/PMC2361444/
- Hamilton W et al. BMJ 2009, ovarian cancer symptoms: https://pmc.ncbi.nlm.nih.gov/articles/PMC2731836/
- Hamilton W et al. Br J Cancer 2009, CAPER studies overview: https://pmc.ncbi.nlm.nih.gov/articles/PMC2790706/
- Lancet Reg Health Eur 2026 systematic review (lung symptom PPV table): https://pmc.ncbi.nlm.nih.gov/articles/PMC12992075/
- NICE NG12 evidence review B (CA-125): https://www.nice.org.uk/guidance/ng12/evidence/b-dual-testing-with-serum-ca125-and-ultrasound-scan-compared-to-serum-ca125-alone-and-age-and-serum-pdf-15669144110
- NICE NG12 evidence review D (3% threshold): see above.
- NICE NG12 recommendations: https://www.nice.org.uk/guidance/ng12/chapter/Recommendations

## How this file was made

Rows were collected by research agents, then every quote was checked by script against the saved source text, and every PPV number was checked to appear in its quote. The builder asserts expected values per row. A test in `app/convex/core/ppvRisk.test.ts` checks that the generated `ppvRows.ts` matches this JSON.
