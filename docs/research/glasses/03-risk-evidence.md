# 03 – Visually detectable cancer risk factors: ranked, with evidence

Research date: 2026-11-14. Purpose: decide which behaviours the glasses coach may detect in one camera frame, and what one-line nudge the evidence supports.

Read this first:
- **IARC Group 1** = "carcinogenic to humans" (strength of evidence that it causes cancer). It is **not** a ranking of how large the risk is. **Group 2A** = "probably carcinogenic to humans". Meaning of groups: Table 1 in a 2023 review that reproduces the IARC table, Cani et al., https://pmc.ncbi.nlm.nih.gov/articles/PMC10216822 (Table 1, Group 1 reads "Enough evidence for a proven association with human cancer").
- **Single-frame detectability** = can one still image from the wearer's view show it? Ratings are our judgement (not sourced) unless marked.
- **Nudge** = the one-line spoken text the evidence supports. Keep it non-shaming (product rule).
- Items marked **UNVERIFIED** were not confirmed in a primary source during this session. Items marked **[source needed]** have no source yet.
- Sources re-checked on 2026-11-14 (fetch or search snippet, as marked). Where a claim changed after the check, it is marked "(corrected)".

## Ranked list

Ranking = evidence strength × single-frame detectability × a nudge the wearer can act on. Ties are broken by false-positive risk (lower is better).

| Rank | Factor (wearer or bystander) | Authority | Single-frame detectability | False-positive risk | Nudge the evidence supports |
| --- | --- | --- | --- | --- | --- |
| 1 | **Cigarette, cigar or pipe** (wearer smoking) | IARC Group 1 (tobacco smoking) [PMC11962547](https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547); ECAC5 rec. 1 "Smoking" [ECAC5](https://cancer-code-europe.iarc.who.int/) | **High**: cigarette in hand or mouth, visible smoke | **Medium**: pens, chopsticks, candy or prop cigarettes, lollipops | "Smoking causes many cancers. Stopping at any age lowers your risk." ("Many cancers": [PMC11962547](https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547), smoking sites listed. "Any age": [CDC, search snippet](https://cdc.gov/tobacco/about/benefits-of-quitting.html).) |
| 2 | **Other people's smoke** (passive) | IARC Group 1 (passive smoking, lung) [PMC11962547](https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547); ECAC5 rec. 2 "Exposure to other people's tobacco smoke" [ECAC5](https://cancer-code-europe.iarc.who.int/) | **Medium**: someone smoking within a few metres | **Medium**: vapour, steam, fog, barbecue smoke | "Smoke from others also raises your risk. Step away from it when you can." |
| 3 | **Sunbed or UV tanning lamp** | IARC Group 1 (tanning devices / UV) [IARC, 29 July 2009](https://www.iarc.who.int/news-events/sunbeds-and-uv-radiation/); tanning devices and melanoma [PMC11962547](https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547); ECAC5 rec. 8 "Never use sunbeds" [ECAC5](https://cancer-code-europe.iarc.who.int/) | **High** when present (booth or lamp panel); rare in frame | **Low–medium**: nail UV lamps, curing lamps | "Sunbeds raise your skin-cancer risk. Skip them, and use shade instead." |
| 4 | **Processed meat** (bacon, ham, sausage, hot dog, salami, cold cuts) | IARC Group 1 (processed meat) [PMC13171354](https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354); ECAC5 rec. 5 "avoid processed meat" [ECAC5](https://cancer-code-europe.iarc.who.int/) | **High** for hot dog, bacon, ham slices; **medium** for salami or deli; **low** when mixed into dishes | **Medium**: cured fish; plant-based "sausages" (**UNVERIFIED** whether IARC's definition covers them) | "Bacon, ham and sausages are linked to bowel cancer. Choose them less often." (Bowel = colorectal: [PMC13171354](https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354).) |
| 5 | **Alcoholic drink** (beer, wine, spirits, cocktail) | IARC Group 1 (alcoholic beverages) [PMC10216822](https://pmc.ncbi.nlm.nih.gov/articles/PMC10216822); ECAC5 rec. 6 "Avoid alcoholic drinks" [ECAC5](https://cancer-code-europe.iarc.who.int/) | **High** for the container; **none** for amount or strength | **High**: alcohol-free beer, juice in a wine glass, water | "Alcohol is a known cause of several cancers. Having less, or none, lowers your risk." ("Several cancers": [source needed]; the Group 1 part is from PMC10216822.) |
| 6 | **Strong sun on bare skin** (no shade, hat or sunscreen) | IARC Group 1 (solar radiation, skin melanoma) [PMC11962547](https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547); ECAC5 rec. 8 "Avoid too much sun exposure... Use sun protection" [ECAC5](https://cancer-code-europe.iarc.who.int/) | **Low–medium**: bright light and bare skin are visible; dose is not | **High**: overcast light, shade, sunglasses, sunny but brief exposure | "Strong sun on bare skin raises skin-cancer risk. Try shade, a hat or sunscreen." (Do not target children; see 04 `child_visible`.) |
| 7 | **Charred or blackened food** (grill, pan, fire) | IARC Group 2A (high-temperature frying) [PMC10216822](https://pmc.ncbi.nlm.nih.gov/articles/PMC10216822); PAH and HCA form when grilling, smoking and frying [PMC13171354](https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354) (no IARC group given for grilling there) | **Medium**: blackened surfaces, flames, grill in view | **High**: grilling is normal, a burnt crust is harmless | "Avoid burning food. Cook gently and skip the blackened bits." (Charring advice is our inference from the mechanism, **UNVERIFIED** as a formal recommendation.) |
| 8 | **Red meat**, unprocessed (beef, pork, lamb) | IARC Group 2A (red meat) [PMC13171354](https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354), also [PMC10216822](https://pmc.ncbi.nlm.nih.gov/articles/PMC10216822); ECAC5 rec. 5 "Limit red meat" [ECAC5](https://cancer-code-europe.iarc.who.int/) | **Medium**: meat visible, cut type often unclear | **Medium–high**: pork vs chicken, lamb, plant burgers | "Red meat is linked to bowel cancer. Limit it and fill half your plate with vegetables." ("Half the plate": the Finnish plate model is **UNVERIFIED**; no source read says it. [source needed]) |
| 9 | **Very hot drink** (above 65 °C) | IARC Group 2A (drinking very hot beverages) [IARC, 15 June 2016](https://www.iarc.who.int/featured-news/media-centre-iarc-news-mono116/); "very hot" = above 65 °C per [PAHO, footnote 2](https://www.paho.org/es/node/11069). The IARC page gives no temperature; the 65 °C figure comes from PAHO. | **Very low**: temperature is not visible; steam is only a weak proxy | **Very high**: any warm drink steams | "Let very hot drinks cool a little before sipping. They are linked to cancer of the gullet." (Oesophagus: [PAHO](https://www.paho.org/es/node/11069).) Recommend **off by default** until tested on frames. |
| 10 | **Sugary drinks / excess weight** | ECAC5 rec. 3 "Overweight and obesity" [ECAC5](https://cancer-code-europe.iarc.who.int/) (sugary-drink wording in ECAC5: **[source needed]**) | **Low–medium**: a soft drink can be seen; body weight cannot | **High** | "Water or unsweetened drinks are a better everyday choice." Low priority; not a cancer claim we can make from one frame. |

### Not single-frame (log only, do not nudge)

| Factor | Authority | Why not |
| --- | --- | --- |
| Air pollution (outdoor), radon, occupational carcinogens | ECAC5 recs. 9, 10, 11 [ECAC5](https://cancer-code-europe.iarc.who.int/) (headings verified) | Not visible in one frame. |
| Infections, HPV, hormone replacement therapy, screening | ECAC5 recs. 12, 13, 14 [ECAC5](https://cancer-code-europe.iarc.who.int/) (headings verified) | Not visible; medical context. |
| Physical activity, breastfeeding | ECAC5 recs. 4, 7 [ECAC5](https://cancer-code-europe.iarc.who.int/) (headings verified) | Cannot judge from one frame. |

## Evidence per source

### IARC group classifications (and secondary reproductions)
- **Tobacco smoking and alcoholic beverages = Group 1; high-temperature frying and red meat = Group 2A.** Table 1 of Cani et al. 2023, *Cancers* (a review that reproduces the IARC table): https://pmc.ncbi.nlm.nih.gov/articles/PMC10216822. (Corrected: an earlier version cited this table for solar radiation, tanning, passive smoking and processed meat. It does not list those.)
- **Solar radiation = Group 1 (skin melanoma); tanning devices = Group 1 (cutaneous and ocular melanoma); passive smoking = Group 1 (lung); smoking = Group 1.** Table 1 of "Environmental pollution and cancer," *J Pediatr (Rio J)*, 2024, adapted from IARC monographs: https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547. Not the IARC site itself. The same article gives nitrate or nitrite under endogenous nitrosation as Group 2A (not visual; not used here).
- **Sunbeds / UV tanning devices = Group 1 ("carcinogenic to humans").** IARC page, dated 29 July 2009, fetched 2026-11-14: https://www.iarc.who.int/news-events/sunbeds-and-uv-radiation/.
- **Processed meat = Group 1; red meat = Group 2A.** Secondary article, *Frontiers in Oncology* 2026, which quotes the IARC groups and links red and processed meat to colorectal cancer: https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354. Its topic is meat processing in Africa, so it is a secondary source. The IARC press release (https://www.iarc.who.int/featured-news/media-centre-iarc-news-redmeat/, 26 Oct 2015) and the Volume 114 news page (https://monographs.iarc.who.int/news-events/volume-114-news/, 26 Oct 2015) were fetched, but their text does not state the groups, so they are not cited for the groups. No quantitative risk per gram is used here.
- **Very hot beverages = Group 2A; coffee = Group 3.** IARC page, dated 15 June 2016, fetched 2026-11-14: https://www.iarc.who.int/featured-news/media-centre-iarc-news-mono116/. It gives no temperature threshold.
- **"Very hot" = above 65 °C.** PAHO page reporting the IARC evaluation, footnote 2, English text, fetched 2026-11-14: https://www.paho.org/es/node/11069. It also gives the oesophagus as the cancer site ("probably causes cancer of the oesophagus"). The NCBI book NBK543943 (search snippet) was blocked by a reCAPTCHA on fetch, so it is not used.

### European Code Against Cancer, 5th edition (ECAC5)
Primary list fetched from https://cancer-code-europe.iarc.who.int/ (re-checked 2026-11-14):
1. Smoking
2. Exposure to other people's tobacco smoke
3. Overweight and obesity
4. Physical activity
5. Diet — "Limit red meat, and avoid processed meat."
6. Alcohol — "Avoid alcoholic drinks."
7. Breastfeeding
8. Sun exposure — "Avoid too much sun exposure, especially for children. Use sun protection. Never use sunbeds."
9. Cancer-causing factors at work
10. Indoor radon gas
11. Air pollution
12. Cancer-causing infections
13. Hormone replacement therapy
14. Organised cancer screening programmes

- ECAC5 has **no individual hot-drink recommendation**. Its only hot-drink item is a policy line for vending machines: "Make the sugar-free option the default option for hot beverages in vending machines." Source: same page.
- ECAC5 article: https://pmc.ncbi.nlm.nih.gov/articles/PMC12861153 (fetch blocked by a reCAPTCHA page; the list above comes from the official site). Also https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(26)00004-9/fulltext (search result).

### Finland: THL and Cancer Society of Finland (Syöpäjärjestöt)
- **THL (official):** No THL recommendation on red meat, processed meat, alcohol or UV was found in search. thl.fi was not checked directly. **UNVERIFIED / gap.**
- **Syöpäjärjestöt awareness report** (PDF, reproduces ECAC5): https://www.syopajarjestot.fi/wp-content/uploads/2026/02/Syopariskitietoisuusraportti_2024_2.pdf. Fetched again 2026-11-14: the tool returned compressed PDF data, so **its exact wording and year are UNVERIFIED** (file name says 2024; the earlier note said 2025).
- **Finnish summary of the European code:** https://www.ilmansyopaa.fi/eurooppalainen-syovantorjuntaohjeisto/ (fetched 2026-11-14, no date shown). Verbatim Finnish with our gloss:
  - "Älä tupakoi." (Do not smoke.)
  - "Jos käytät alkoholia, rajoita kulutustasi." (If you drink alcohol, limit your intake. Corrected: the earlier note quoted "rajoita alkoholin kulutusta".)
  - "Vältä lihajalosteita. Rajoita punaisen lihan ja runsassuolaisten ruokien syöntiä." (Avoid processed meat. Limit red meat and salty foods.)
  - Caveat: the page has 12 numbered points, which do not follow the 14 ECAC5 headings, and it does not say which edition it summarises. Use it as a Finnish summary, not as ECAC5 wording.
- **Secondary Finnish media (UNVERIFIED, do not use as recommendations):**
  - MTV Uutiset, 13 March 2021: https://www.mtvuutiset.fi/artikkeli/7-tarkeinta-tapaa-joilla-pienennat-riskiasi-sairastua-syopaan/8079396. It says red and processed meat together should be eaten at most 50 g per day ("korkeintaan 50 grammaa päivässä"). It gives no separate weekly red-meat figure and names no source for the 50 g. (Corrected: the earlier note said "red meat up to 500 g per week" conflicts with "processed meat up to 50 g per day". Neither the 500 g figure nor a processed-only 50 g figure appears in the articles read.)
  - Verkkouutiset, 26 Oct 2025: https://www.verkkouutiset.fi/a/riskia-vakavaan-sairauteen-voi-vahentaa-omilla-valinnoilla/. It gives no gram figures. It says avoiding processed meat and sugary drinks reduces the risk, citing The Washington Post.
  - "Up to 95 % of melanoma could be prevented by sun protection": **not in the MTV article** (it says UV and sunburn are the most important single cause of skin cancer, with no percentage). **[source needed]**
  - Plate model and at least 30 minutes of brisk activity most days: **not in the MTV article**. **[source needed]**
- **Alcohol:** no specific Finnish limit was found. Use ECAC5 rec. 6 ("Avoid alcoholic drinks") only. The Finnish summary above says to limit intake.
- **UV for Finland:** no Finnish primary text found. The shade, clothing and SPF advice is from HealthLinkBC, a British Columbia (Canada) provincial health site, fetched 2026-11-14: https://www.healthlinkbc.ca/healthwise/lifestyle-changes-may-help-prevent-cancer. Verbatim: "Seek shade from 11 a.m. to 3 p.m." / "Cover up outdoors with a wide-brimmed hat and tightly-woven clothing." / "Use SPF 30 or higher." It is **not Finnish**, so do not quote it as Finnish guidance.

### Recent study on very hot drinks (not used for a claim)
- CNN, 10 Sept 2026: https://www.cnn.com/2026/09/10/health/hot-beverages-cancer-study-scli-intl. Fetch returned HTTP 451 on 2026-11-14. Study details are **UNVERIFIED**.

## Things the evidence does NOT support (avoid in copy)

- Any claim that one frame reveals a person's cancer risk or exposure dose.
- Dose or frequency claims ("one hot dog a week is X %") unless taken from a primary IARC or ECAC text. None were verified here.
- Claims that a hot drink is dangerous at a given temperature, unless the user states the temperature. Frames cannot show it.
- Any claim about children and sunburn beyond ECAC5 rec. 8 ("especially for children"). Do not nudge a parent about a child in view.

## Sources

- https://cancer-code-europe.iarc.who.int/ (ECAC5 list, fetched 2026-11-14)
- https://www.iarc.who.int/featured-news/media-centre-iarc-news-mono116/ (hot beverages, Group 2A, no temperature; fetched 2026-11-14)
- https://www.paho.org/es/node/11069 (65 °C footnote and oesophagus; fetched 2026-11-14)
- https://www.iarc.who.int/news-events/sunbeds-and-uv-radiation/ (sunbeds Group 1, 29 July 2009; fetched 2026-11-14)
- https://www.iarc.who.int/featured-news/media-centre-iarc-news-redmeat/ (26 Oct 2015; fetched, no group text)
- https://monographs.iarc.who.int/news-events/volume-114-news/ (26 Oct 2015; fetched, no group text)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10216822 (Cani et al. 2023 Table 1; fetched)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11962547 (J Pediatr 2024 Table 1; fetched)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13171354 (processed and red meat groups, colorectal; fetched)
- https://www.ncbi.nlm.nih.gov/books/NBK543943/ (blocked by reCAPTCHA; not used)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12861153 (ECAC5 article, fetch blocked)
- https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(26)00004-9/fulltext (ECAC5, search result)
- https://www.syopajarjestot.fi/wp-content/uploads/2026/02/Syopariskitietoisuusraportti_2024_2.pdf (not readable)
- https://www.ilmansyopaa.fi/eurooppalainen-syovantorjuntaohjeisto/ (Finnish summary; fetched)
- https://www.mtvuutiset.fi/artikkeli/7-tarkeinta-tapaa-joilla-pienennat-riskiasi-sairastua-syopaan/8079396 (secondary, 2021; fetched)
- https://www.verkkouutiset.fi/a/riskia-vakavaan-sairauteen-voi-vahentaa-omilla-valinnoilla/ (secondary, 2025; fetched)
- https://www.healthlinkbc.ca/healthwise/lifestyle-changes-may-help-prevent-cancer (British Columbia, Canada; fetched)
- https://cdc.gov/tobacco/about/benefits-of-quitting.html (search snippet; "quitting is beneficial at any age")
- https://www.cnn.com/2026/09/10/health/hot-beverages-cancer-study-scli-intl (HTTP 451 on fetch; details UNVERIFIED)
