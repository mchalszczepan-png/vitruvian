# 07 – Verification of three open items

Date: 2026-11-14. Scope: the three open items in `00-synthesis.md` section 6 (items 1, 2 and 4). Digest tags: **D01** = `01-access-deadlines.md`, **D02** = `02-county-structure.md`, **D03** = `03-data-ai.md`, **D04** = `04-screening-detection.md`, **D05** = `05-medicines-trials.md`, **D06** = `06-workforce-strategy.md`.

Tool note: Context `web-scrape` hit its rate limit (10 requests/min), then timed out on PDFs. Switched to WebFetch and WebSearch as instructed. Context worked once, for the Finlex highlights. Source pass 2026-11-14: sources added for the unsourced figures; the Ohjaus PDF and the statute text are still not readable.

Verification levels: **Read** = I opened the page or saw the text. **Search summary** = only the search-result summary was seen, and I did not open the link. **Not verified** = no readable source.

## Summary

| Item | Verdict |
| --- | --- |
| 1. THL Ohjaus 21/2016 stage target days | **Not verified.** Document identified (series "Ohjaus 2016_021", i.e. 21/2016) and its measurement points confirmed. The full PDF was not readable. One search snippet of the guide gives a 6-week limit; see section 1. |
| 2. Terveydenhuoltolaki §50–53 (in force) | **Verified** from the Finlex consolidated text. Three digest claims need correcting (see section 2). |
| 4. County-level cancer waiting-time dataset | **Not found.** Non-cancer specialist waits by wellbeing area exist (THL, page read for national figures). Screening participation by region exists. No cancer waiting-time series found. |

---

## 1. THL Ohjaus 21/2016 (cancer care access target times)

**Confirmed**
- Title and status: "Hoitoonpääsyn seuranta syövän hoidossa: Määrittelyt ja ohjeistus", valid from 1.1.2017, Ohjaus 21/2016 (series "Ohjaus 2016_021"), produced by THL with the Finnish Cancer Society. Source: [julkari item page](https://www.julkari.fi/items/0424a55a-f159-406f-8883-5dfdad4d6772), read with WebFetch 2026-11-14. First applied to 16 cancers, which cover almost three quarters of new cases. **Search summary** citing https://core.ac.uk/download/78470017.pdf (PDF not opened: WebFetch returned 403, Context timed out).
- Measurement points: referral arrival at specialist care; first visit (or a substitute, such as a phone consultation); placement on the treatment waiting list; first treatment. The waiting list-to-treatment interval is tracked separately. First treatment includes surgery, drug therapy, radiotherapy, other local treatment, active monitoring and palliative care. **Search summary**, same core.ac.uk link.
- Section 4.3 is titled "Hoitoonpääsyn seurannan periaatteet syövän hoidossa". This is where the target values should be. **Search summary** only.

**Not verified**
- **Stage target days** (suspicion or referral → specialist; → diagnosis; → treatment start). Still unverified. A search snippet of the guide PDF (https://www.julkari.fi/server/api/core/bitstreams/f99e6277-82c4-4ef7-9313-588e4b9f0f4f/content) says the maximum from referral arrival to first treatment (surgery, drug or radiotherapy) in suspected cancer is **6 weeks**. Scraping that URL returned 404, and the other julkari download link returns a login page, so the snippet is unconfirmed. This corrects the earlier line that no source gave any numbers. Do not put any day count on a slide from this file until the PDF is read.
- **Name conflict: resolved.** The julkari item page gives the series as "Ohjaus 2016_021", so the guide is Ohjaus 21/2016. The "THL Directions 4/2017" label in one search summary is wrong.
- **Not the document.** https://www.julkari.fi/items/ad4ac72e-c06a-45a4-b30d-27bec37b2759 (ISBN 978-952-302-185-3, read via WebFetch) is THL's 2014 *National Cancer Plan, part II* (cancer prevention, early detection, rehabilitation 2014–2025). It has no access target times. The matching PDF at https://www.iccp-portal.org/system/files/plans/URN_ISBN_978-952-302-185-3.pdf is compressed and unreadable.
- The 6-week figure was earlier labelled as coming from a 2010 STM report and to be discarded. That label is not supported, because the Ohjaus snippet above also gives 6 weeks. Whether the 2010 STM report (https://julkaisut.valtioneuvosto.fi/bitstream/handle/10024/72793/selv_2010_6_syovan_hoito_verkko.pdf?sequence=1&isAllowed=y, search result, not opened) states 6 weeks is not checked.
- The strategy's Goal 3 indicator wording (strategy pp. 5, 33) and its link to Ohjaus 21/2016 were **not re-checked** in this session.

**Next step to close:** find an open copy of the Ohjaus PDF (the julkari download links return 404 or a login page), read section 4.3 and its tables. Alternatively ask THL or the mentors (Kaitila/Toivola; synthesis §5 Q1).

---

## 2. Terveydenhuoltolaki 1326/2010, §50–53 (as in force)

Corrected 2026-11-14 after reading the full §52 text.

**Source read:** https://www.finlex.fi/fi/lainsaadanto/2010/1326 (Finlex consolidated text "Ajantasaistettu lainsäädäntö"; read via Context highlights, 2026-11-14). The as-of date is not displayed on the page. The amendment list in the page's table of contents runs to 16.10.2026/913. The highlights are excerpts with "…" in between, so the elided parts of §51a were not read in full.

| § | Latest amendment (Finlex TOC) | Time rule (Finnish, verbatim excerpt) | Plain meaning | Digest claim vs. text |
| --- | --- | --- | --- | --- |
| **50** Kiireellinen hoito | 30.12.2024/1081 | "…potilas saa kaikkina vuorokaudenaikoina välittömästi terveydenhuollon ammattihenkilön arvion ja hoidon" | Urgent care = acute deterioration; immediate assessment and treatment, day and night. **No day count.** | D03 calls §50 "hoitotakuu" (guarantee). **Wrong:** §50 has no time limit. |
| **51** Yhteyden saaminen perusterveydenhuollon yksikköön | 19.1.2023/116 | "…arkipäivisin virka-aikana saman päivän aikana yhteyden…" | Same-day contact in office hours, then an individual assessment of need and urgency. | D01/D02 say assessment starts "within 3 weeks". That clock is in **§52** (specialist referrals), not §51. See the §52 row. |
| **51a** para. 1 (adults, 23+) | 19.12.2024/848 | "…kuitenkin arviointia seuraavien kolmen kuukauden aikana" | First treatment or rehab event within a reasonable time, and at most 3 months after the assessment. | Matches D01 "3 months". |
| **51a** para. 2 (under 23, general medicine) | 19.12.2024/848 | "…kuitenkin 51 §:n mukaista arviointia seuraavien 14 vuorokauden aikana" | Under-23 with a general-medicine need: 14 days after assessment. | Matches D02/D04 "14 days under 23". |
| **51a** para. 2, second sentence | 19.12.2024/848 | "…pääsy lääkärin vastaanotolle on järjestettävä ammattihenkilön vastaanottoa seuraavien seitsemän vuorokauden aikana" | **7 days** only for a patient sent from a non-doctor professional to a doctor. | D02 says "7 days for primary care from 1.11.2024". **Not supported** as a general rule. |
| **51b** dental | 19.12.2024/848 | Children and under-23s: within 3 months of assessment. Dentist: within 4 weeks of identifying the need, or 3 months from assessment. | Dental-specific clocks. | Not in digests. |
| **51c** specialist care linked to primary care | 19.1.2023/116 | "…kuitenkin kolmessa kuukaudessa siitä, kun hoidon tarve on arvioitu." Extension of up to 3 more months for justified medical or other reasons. | **3 months** from need assessed, +3 months if justified. | Synthesis row 2 gives "3 months" for specialist review and cites §52. That review limit is in §52. The §51c 3 months applies to primary-care-linked specialist care. |
| **52** Erikoissairaanhoitoon pääsy | none shown | "…kuitenkin kuuden kuukauden kuluessa siitä, kun hoidon tarve on todettu." | **Assessment** of a specialist referral starts within **3 weeks** of arrival; if specialist review or tests are needed, it ends within **3 months**. **Treatment** starts within **6 months** of the need being established. | Synthesis TL;DR gives "3 weeks / 3 months / 6 months (§52)". **Correct.** The earlier note that §52 gives only 6 months was wrong. |
| 53 | 30.12.2024/1107 | Child and youth mental health special rules. | Not read in text. | Not used. |

**Changes in 2026 that the digests do not mention (not read):**
- §14 Seulonnat (screening): amended **22.5.2026/375**. D04 relies on §14 ("county must run only the national programme"). Re-read §14 before citing it.
- Other 2026 amendments in the TOC: 9.6.2026/486 (§72a), 16.6.2026/524 (section not shown), 9.7.2026/702 (§73, ambulance transport), 16.10.2026/913 (section not shown).

**Cross-check with a government release:** STM guidance, published 25.3.2025: https://valtioneuvosto.fi/-/1271139/miten-hoitotakuuta-koskevia-saannoksia-sovelletaan-stm-julkaisi-ohjeet-hyvinvointialueille (**Read**). Limits changed on 1.1.2025. Under-23s: 14 days ("Alle 23-vuotiaiden on päästävä hoitoon viimeistään 14 vuorokaudessa"). Adults 23+: 3 months. Adult dental: 6 months. Under-23 dental: 3 months. The release mentions **no 7-day limit**. This matches the Finlex text.

**Conflicts between digests, resolved**
- **7-day primary-care deadline (D02, from 1.11.2024).** Not in force. The 2023 plan to tighten the 14-day limit to 7 days was cancelled before it took effect, through Act 1139/2023 (amendments adopted in autumn 2023). Source: [Edilex 20240134](https://www.edilex.fi/he/20240134), read with WebFetch on 2026-11-14. The page gives no exact decision day. The only 7-day rule in §51a is the non-doctor → doctor step.
- **"3 weeks" to assessment (D01/D02).** Correct, but the clock is in **§52** (specialist referrals), not §51. Confirmed by the Finlex text and law/03.
- **"Amended 1.10.2025" (synthesis §6 item 2).** Not in the Finlex amendment list. Drop it.
- **§50 as guarantee (D03).** Wrong: §50 is urgent care with no day limit.

**Not verified:** the elided text of §51a; §53 text; §14 after the 2026 amendment; the Finlex as-of date.

---

## 3. Public county-level cancer waiting-time data

**Result: none confirmed.** No dataset gives cancer waiting or treatment times by wellbeing area. The candidates checked:

| Dataset / source | URL | What it covers | Granularity | Latest year | Cancer-specific waiting data? | Status |
| --- | --- | --- | --- | --- | --- | --- |
| **Sotkanet** indicator catalogue (THL) | https://sotkanet.fi/rest/1.1/indicators?lang=fi | About 2.48 million characters. Read only the first ~200,000 (ids 4–707). Found: id 13, "referrals for specialised health care processed within 3 days" (all referrals, not cancer); ids 245/246, cancer index (to 2019). | Wellbeing area (hyvinvointialue) | 2019 (cancer index); others not shown | **No** | **Partial.** Ids above 707 not read. |
| **THL non-urgent specialist-care waiting** (kiireettömän erikoissairaanhoidon hoitoon pääsy) | [THL access-to-services page](https://thl.fi/en/data-and-statistics/access-to-treatment/access-to-services-in-specialised-health-care), read with WebFetch 2026-11-14. Has a "Table" tab; no direct download link found. The earlier guessed thl.fi URL returned 404. | Patients waiting; share waiting over 180 days (national). Reported by wellbeing area, and by specialty in news. | Wellbeing area; specialty (per news) | September 2026 chart (national share over 180 days: 6.0%); end-2025 share: 12.7%. | **No** (all specialist care, not cancer) | **Partly read.** National figures from the THL page. The page says its data "has not yet been fully verified", and its "Updated" date (25.6.2026) predates the September 2026 chart. Regional figures from news search results only: end-April 2024 over 162,000 waiting, with North Savo over 27% and North Ostrobothnia 25% waiting over 6 months (https://www.verkkouutiset.fi/a/erikoissairaanhoidon-jonot-kasvoivat-edelleen-huhtikuussa/, not opened). End-August 2024 166,000 waiting, about 31,000 (18%) over 6 months: [source needed]. |
| **Syöpärekisteri screening statistics by wellbeing region** | https://syoparekisteri.fi/tilastot/seulontatilastot/ | Screening participation, not waiting. | Wellbeing region | 2024 (preliminary, per D04) | No (screening) | Cited via D04. Not opened this session. |
| **Syöpärekisteri regional outcome data** | News: [Verkkouutiset](https://www.verkkouutiset.fi/a/syopatiedoissa-isot-alueelliset-erot-yksi-seutu-erottuu/) and [Syöpäjärjestöt summary](https://www.syopajarjestot.fi/uutinen/syovan-levinneisyystiedoissa-suuria-alueellisia-eroja-suomessa/). The repo's file 09 notes a conflict between the 72% and 60% figures. | Stage/spread recorded in 42% of cases nationally; Pirkanmaa 72%, Sisä-Suomi 60%. | Region | 2024 (per news) | No (outcomes) | News summary only. Registry report not read. |
| **Quality register pilot (lung cancer)** | [Verkkouutiset](https://www.verkkouutiset.fi/a/keuhkosyovan-hoidossa-on-suuria-alueellisia-eroja/), search summary | Pilot to show regional differences in treatment and outcomes. | Region | — | Partly | Pilot, not a public dataset. |
| **MOT 2025 investigation** | [Yle MOT article](https://yle.fi/a/74-20251023), search result description (not opened) | Says Finland lacks a national registry of cancer treatment outcomes. | — | 2025 | — | Supports synthesis row 2. Not opened. |
| HUS access-to-treatment pages | https://www.hus.fi/en/patient/patient-guide/your-rights-patient/access-treatment-specialist-medical-care | Patient guide, hospital-district level. | Hospital district | — | — | Not a dataset. Not opened. |
| Helsinki waiting times | https://hel.fi/en/health-and-social-services/data-and-the-rights-of-the-client/waiting-times-and-client-satisfaction | City-level page. Helsinki is one city, not a wellbeing area. | City | — | — | Not opened. |
| FICAN | https://www.fican.fi/ | Not searched in this session. | — | — | — | Not verified. |

**Implications for the synthesis**
- A proxy exists: non-cancer specialist waiting by wellbeing area (THL). The THL page is read for national figures; the regional split comes from news. It can be shown with a clear label as a proxy, not as a cancer measure. The table download format and licence still need confirming.
- Screening participation by region is the only cancer-related public aggregate confirmed. It supports Concept 1.
- Concept 2 (legal clock simulator) still depends on data that does not exist publicly.

---

## Could not verify

1. THL Ohjaus 21/2016 stage target days. The snippet says 6 weeks for suspicion to first treatment; the PDF is unreadable. The name is settled as 21/2016.
2. THL table download, format and licence for non-cancer specialist waiting by area (the THL page is read; no download link found).
3. Elided text of §51a; §53; §14 after 22.5.2026/375; the Finlex as-of date.
4. Resolved: the 3-week assessment clock is in §52 (Finlex text, read 2026-11-14).
5. Sotkanet ids above 707.
6. Resolved: the 2023 Edilex reversal of the 7-day plan was read on 2026-11-14 (Act 1139/2023).
7. Syöpärekisteri screening PDFs and the Verkkouutiset/STT articles (search summaries only). End-August 2024 waiting total (no source found).

---

## Changes needed in 00-synthesis.md

1. **§1 TL;DR bullet 1 and row 1:** replace "3 weeks / 3 months / 6 months (§52)" with: §51 same-day contact in office hours; §51a adults 3 months after assessment, under-23 general medicine 14 days; §51c specialist care 3 months (+3 if justified); §52 assessment within 3 weeks of referral arrival, specialist review or tests within 3 months, treatment within 6 months of need established. Keep the 3-week clock and cite §52.
2. **Row 6:** replace the "7 days" wording. Resolved: 14 days for under-23; 7 days only for non-doctor → doctor. The D02 "7 days from 1.11.2024" claim is not in force. Remove the open conflict note.
3. **Row 2:** keep "3 months if specialist review or imaging" under **§52**. (An earlier version of this advice said to move it to §51c; that was wrong.)
4. **Row 5 and Concept 1 legal basis:** §14 was amended 22.5.2026/375. Re-read §14 before citing "county must run only the national programme".
5. **§6 item 2:** replace with the verified text above. Delete the "1.10.2025" reference. Note D03's §50 error.
6. **§6 item 1:** update: stage points confirmed (Ohjaus, core.ac.uk); day values still unverified (search snippet says 6 weeks for suspicion to first treatment; PDF unreadable); the name is Ohjaus 21/2016 (the "Directions 4/2017" label is wrong).
7. **§6 item 4, §3 rank 1, Concept 2:** no public county cancer waiting dataset found. Proxy = THL non-cancer specialist waiting by wellbeing area (THL page read for national figures; regional split from news; table licence unconfirmed). Rank 1 feasibility: "Medium-low, proxy only".
