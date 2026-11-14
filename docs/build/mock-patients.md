# Mock patients for the demo

All data in `mock-patients.json` is made up. No record describes a real person, and no note is copied from a real chart. Every record has `"synthetic": true`.

Names are Finnish words that mean things like "example", "test" or "drawing", so they are obviously fictional. Counties are real wellbeing services counties, used only as labels.

## What each patient is for

| ID | Patient | Use in the demo |
| --- | --- | --- |
| SYN-001 | Matti Esimerkki, 62, former smoker | **Hero, lung.** Three cough visits in 10 weeks. Repeat-visit flag fires. Today's visit (14 Nov 2026) is the one the GP types into. |
| SYN-002 | Anneli Harjoitus, 58, never smoker | **Hero, colorectal.** Bowel change, then falling haemoglobin over three visits. Shows the referral filling in from scattered notes. |
| SYN-003 | Sirpa Luonnos, 57, never smoker | **Hero, ovarian.** Bloating and early fullness for about 8 weeks, first put down to IBS. Pelvic pain on visit 2. CA-125 180 IU/mL on visit 3 (14 Nov 2026), so an urgent ultrasound is booked. |
| SYN-004 | Eeva Testinen, 34 | Background. Asthma, three visits. Repeat visits that are not cancer. |
| SYN-005 | Jari Oletettu, 45 | Background. Reflux, three visits. Repeat visits that are not cancer. |
| SYN-006 | Sanna Vaihtoehto, 51 | Background. Back pain, two visits. Repeat visits that are not cancer. |
| SYN-007 | Tuomas Piirtäjä, 39 | Background. One-off earache. |
| SYN-008 | Helena Kuvaaja, 72 | Background. One-off urine infection. |
| SYN-009 | Kalle Nimetön, 31 | Background. One red flag (rectal bleeding), low concern, haemoglobin normal. |
| SYN-010 | Riitta Vertailu, 44, current smoker | Background. One red flag (one blood streak with cough), low concern, post-viral. |
| SYN-011 | Ahti Kaavio, 61 | Background. One-off shoulder pain. |
| SYN-012 | Mirjam Lukema, 47 | Background. One-off migraine. |
| SYN-013 | Veikko Taulukko, 70, former smoker | Background. One red flag (weight loss), low concern, explained by diet change. |
| SYN-014 | Ilona Koeajo, 26 | Background. One-off eczema. |
| SYN-015 | Oskari Piirros, 52, current smoker | Background. One-off knee pain. |

Counties spread across 12 areas: Lappi (2), Kymenlaakso (2), Uusimaa (2), Pirkanmaa, Varsinais-Suomi, Pohjois-Pohjanmaa, Keski-Suomi, Satakunta, Pohjois-Savo, Kanta-Häme, Etelä-Pohjanmaa, Päijät-Häme.
Hero counties match the County view story (docs/research/data/county-cancer-data.md): SYN-001 Lappi (lung curative-treatment share 18.5% vs Finland 27.0%), SYN-002 Kymenlaakso (colonoscopy after a positive FIT 62.1% vs Finland 72.7%), SYN-003 Pohjois-Pohjanmaa (no public county ovarian data, shown as a gap).

## Red flags in the hero notes

Rule ids are from [rules.md](rules.md).

- **SYN-001 (lung):** cough over 3 weeks, coughed-up blood, weight loss of about 4 kg, former smoker with about 30 pack-years. Rules: LUNG-02 (coughed-up blood), LUNG-03 (cough, tiredness, weight loss, appetite loss), LUNG-04 (ever smoked, one symptom), LUNG-09 (reduced air entry right lower zone).
- **SYN-002 (colorectal):** change in bowel habit over 6 weeks or more, rectal bleeding, low haemoglobin (109 → 98 g/L), low ferritin, FIT positive (186 µg Hb/g), weight loss of about 3 kg. Rules: COLO-01 (FIT at or above 10), COLO-04 (bowel habit change), COLO-05 (iron-deficiency anaemia), COLO-08 (rectal bleeding or weight loss, age 50+).
- **SYN-003 (ovarian):** bloating and early fullness for about 8 weeks, lower pelvic pain from visit 2, CA-125 180 IU/mL on visit 3 (age 57, so above the 31 IU/mL band for 50–59). Rules: OVAR-02 (persistent bloating), OVAR-03 (persistent early fullness or appetite loss), OVAR-04 (persistent pelvic pain), OVAR-06 (CA-125 above the age band). Visit 3 has no palpable mass and no ascites, so OVAR-01 does not match.

**Overlap check (2026-11-14).** No background patient strongly matches an OVAR Rule. SYN-006 (51F, back pain, "no bladder or bowel change") and SYN-008 (72F, two days of dysuria and a UTI) are negative or short. SYN-002 (colorectal hero, 58F) mentions "bloating after meals" at visit 1 only. OVAR-02 needs persistence (2 visits at least 28 days apart, see rules.md "Over time"), so that single line does not match.

**Archived.** Pekka Kuvitelma (old SYN-003, prostate) moved to `archive/prostate-patient.json` on 2026-11-14.

## Over-time backing for the hero patients

Each row is a Rule whose `overTime` condition is met (see [rules.md](rules.md), "Over time"). "Single" means one visit is enough. "Persistent" means 2 or more matching visits at least 28 days apart. Dates are visit dates.

| Patient | Rule | Pattern | Backing visit dates |
| --- | --- | --- | --- |
| SYN-001 Matti (lung) | LUNG-02 (coughed-up blood) | single | 2026-11-14 |
| SYN-001 Matti | LUNG-03 (2+ chest symptoms) | persistent | 2026-10-01, 2026-11-14 |
| SYN-001 Matti | LUNG-04 (one symptom, ever smoked) | persistent | 2026-09-03, 2026-10-01, 2026-11-14 |
| SYN-001 Matti | LUNG-09 (chest signs) | single | 2026-11-14 |
| SYN-002 Anneli (colorectal) | COLO-01 (FIT at or above 10) | single | 2026-10-27 |
| SYN-002 Anneli | COLO-04 (bowel habit change) | persistent | 2026-08-18, 2026-09-22, 2026-10-27 |
| SYN-002 Anneli | COLO-05 (iron-deficiency anaemia) | single | 2026-10-27 |
| SYN-002 Anneli | COLO-08 (rectal bleeding, age 50+) | persistent | 2026-09-22, 2026-10-27 |
| SYN-003 Sirpa (ovarian) | OVAR-02 (bloating) | persistent | 2026-09-18, 2026-10-23, 2026-11-14 |
| SYN-003 Sirpa | OVAR-03 (early fullness or appetite loss) | persistent | 2026-09-18, 2026-10-23, 2026-11-14 |
| SYN-003 Sirpa | OVAR-06 (CA-125 above age band) | single | 2026-11-14 |

Not matched, on purpose: SYN-003 pelvic pain (OVAR-04) is on 2 visits 22 days apart, so it misses the 28-day gap. SYN-002 bloating (visit 1 only) does not reach 2 visits.

**Data check, not changed.** SYN-003 visit 1 (2026-09-18) says bloating "for about 3 months", but visit 3 (2026-11-14) says "now about 8 weeks". Both may be right if the 8 weeks counts the constant phase only, but a GP may read it as a contradiction. Left as written; decide before the demo.

These are plain-language paraphrases, not copied guideline text. Check the red flag wording against the team's own rule list before the demo.
