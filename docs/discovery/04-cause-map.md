# Cause map: why cancer care outcomes differ in Finland (desk research)

Date: 2026-11-14. **Desk research only.** No interviews, no customer testimony, no product or fix ideas here. Causes are interpretations unless marked *measured*. Builds on [02-problem-map.md](02-problem-map.md).

**Labels in this file.** C1–C14 = cause labels made here. A1–A2, B, C, D = the four outcome gaps. **Strength:** high = several independent sources or official statistics agree; med = one good study, or consistent indirect sources; low = one snippet, indirect, or expert opinion. **Read** = full text opened; **abstract** = abstract only; **snippet** = search result only.

## Sources used

- **[K26]** Kuitunen et al., *Cancer Medicine* 2026;15:e71920. DLBCL (lymphoma), 160 patients, 7 Finnish hospitals, enrolled Oct 2014–Mar 2020. Incyte-funded. Read full text. https://doi.org/10.1002/cam4.71920
- **[T25]** Tokola et al., *Cancer Medicine* 2025;14(22). DLBCL, 160 patients, 7 Finnish hospitals, enrolled Oct 2016–Mar 2020. **Kuitunen is a co-author.** Read full text. https://pmc.ncbi.nlm.nih.gov/articles/PMC12640614/
- **[Z25]** Zai et al., *BMJ Public Health* 2025;3:e002829. Finland, 469,522 newly diagnosed cancer cases, 2000–2019. Final paper read via Europe PMC full text. https://pmc.ncbi.nlm.nih.gov/articles/PMC12551501/ . Working paper WP-2025-016 (June 2025, https://www.demogr.mpg.de/papers/working/wp-2025-016.pdf) also used for detail; it has different numbers. Its PDF text was not extractable ([context/07](../research/context/07-stage-data-practice.md)), so WP numbers rest on a snippet.
- **[N22]** Ammitzbøll et al., *Acta Oncologica* 2022;61(11):1317–1331. Nordic review, 98 studies. **Abstract only** (full text blocked). https://doi.org/10.1080/0284186X.2022.2143278
- **[R10]** Pokhrel et al., *Br J Cancer* 2010. Finnish registry, 1996–2005 diagnoses, cause-specific survival by education. Read. https://pmc.ncbi.nlm.nih.gov/articles/PMC2965870
- **[THL23]** THL waiting data, spring 2023, via press release (read). https://www.sttinfo.fi/tiedote/69981865/terveysasemien-kiireettomista-laakarikaynneista-vain-puolet-toteutui-viikossa-kevaalla-2023?publisherId=69817778
- **[SCR24]** Screening participation 2024, press release (read; dated 30 Jun 2026 in the search result). https://www.sttinfo.fi/tiedote/72173590/kolme-aluetta-erottuu-edukseen-syopaseulonnoissa-helsingissa-osallistuminen-jaa-selvasti-jalkeen?lang=fi
- **[OHC]** Work Institute 2024 (read): https://www.sttinfo.fi/tiedote/70422153/enemmisto-tyoterveyshuollon-palveluista-kohdistuu-matalasti-koulutetuille?lang=fi . Kela occupational-care coverage 2024 (snippet): https://www.sttinfo.fi/tiedote/72260112/tyoterveyshuollon-kustannukset-olivat-vuonna-2024-noin-600-euroa-tyontekijaa-kohti?lang=fi
- **[FS]** FinSote 2018 and 2020, unmet need (snippet): https://www.epistemonikos.org/en/documents/f2ebc6e1bb763f1f88c22abec11668fe4410bc74
- **[KELA]** Kela private-visit reimbursement change, 2026 (snippet): https://www.kela.fi/ajankohtaista/yksityislaakarikayntien-kela-korvaukset-pienenevat-1.1.2026
- **[V]** Vaasa rural lung cancer cohort (read): https://medicaljournalssweden.se/actaoncologica/article/view/27507
- **[E21]** Elovainio 2021, living alone and cancer case-fatality, Finland (snippet): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8219898/
- **[H14 / Ea09 / Kr13 / Njor23 / TH25]** Hvidberg 2014 (DK, BMC Cancer, read; was labelled 2016 and H16): https://pmc.ncbi.nlm.nih.gov/articles/PMC4138385/ . Eaker 2009 (SE, breast survival; record seen in search, link [source needed], not read). Kravdal 2013 (NO, Soc Sci Med; abstract not opened): https://pubmed.ncbi.nlm.nih.gov/23422059 . Njor 2023 (mammography, DK/FI/IS/NO; was labelled DK/SE; abstract not opened; link [source needed]). Tampere thesis 2025 on breast survival by region: https://trepo.tuni.fi/handle/10024/229065 . Snippets only, except Hvidberg.
- **[DECK]** [docs/tracks/astrazeneca-insights-deck-2026-11-13.pdf](../tracks/astrazeneca-insights-deck-2026-11-13.pdf) (PDF page cited).
- **[LAW]** [law/00 synthesis](../research/law/00-synthesis.md) (legal clocks). Not evidence of effect; only of rules.

Sub-agents produced most digests. I checked the final Zai paper, Tokola's subgroup analysis and Kuitunen's figure and text myself.

---

## 1. Cause trees, one per outcome gap

### Gap A: later stage at diagnosis (lower education)

```
A  Later stage at diagnosis                       [Z25 adj. OR ~1.1; N22 abstract: high for direction]
├─ A1 Cancer found after more growth (late diagnosis)
│   ├─ C1 Patient delay: symptoms put down to other causes     low   [T25: 40% of DLBCL pts; no Finnish education study]
│   └─ C2 Slow first GP contact and visit, public primary care  high (national) / low (cancer link)
│        [THL23: 49% of non-urgent doctor visits within 1 wk, spring 2023; 60% in autumn 2022; regions 37–57%]
│        └─ C3 Parallel routes: faster access by job, pay, age  med
│             [K26: primary-care route median 127 vs 76 days, p=0.027; route choice by age/income/occupation p<0.001]
├─ A2 Fewer cancers caught by screening
│   └─ C6 Lower screening uptake (lower education, some migrants)  med (direction) / low (size)
│        [SCR24: 2024 colorectal 73.5%, cervical 73.5%, breast 81.6%; regional spread 7–14 pts; DECK p.9]
│        └─ C4 Fees, travel, unmet need                       med   [FS; KELA]
└─ Bias risk: stage is missing for ~30% of Zai cases           [DECK p.15 table: 30.0%; WP: 36.6%]
```

### Gap B: longer delay (symptom to treatment start)

```
B  Longer symptom-to-treatment interval            [K26 one cohort, n=87 by route: med]
├─ B1 Long wait for first doctor visit (primary care)     C2 → C3   (see A1)
│    Step 3→4 gap in K26 figure: 22 days public vs 1 day private (figure; statistic unclear)
├─ B2 Patient-side wait before first contact              C1  low
│    T25: 54 of 146 days (37%) came before first healthcare contact; T25 concludes most delay (92 of 146) sits in health services
├─ B3 Wait after referral (specialist step)               C5  low
│    K26 figure: specialist step 57 vs 41 days (figure only; no cause tested)
└─ B4 Legal clocks split, no cancer-specific clock         C5  high (text) / low (effect)  [LAW; law07 §51c, §52]
     Adults: 3 months after assessment; specialist 3 months (+3); treatment 6 months from need established.
```

### Gap C: less active treatment (surgery, radiotherapy, chemotherapy)

```
C  Less surgery, radiotherapy, chemo for lower education   [Z25 crude shares: med; not adjusted]
├─ C9 Later stage (mediator): fewer curative options          med   [N22 abstract: stage explains part of gap]
├─ C10 Age and comorbidity                                    low   [Z25 did not adjust for comorbidity; Denmark/Norway snippets: little explained]
├─ C8 Living alone, not married                                low–med [Kr13 snippet: never-married men OR 1.56 cancer death]
├─ C11 Treatment choice and county capacity                   low   [no Finnish study adjusts the education gap for stage and comorbidity]
└─ C12 Distance to specialist centre                          low   [V: rural >50 km, lung, HR 12-month death 1.47; one hospital; no education split]
```

### Gap D: worse survival (lower education)

```
D  Higher cancer death share, lower education               [Z25: med]
├─ Crude: 27% (high education) vs 47% (low) died of cancer during follow-up  [Z25 crude share]
├─ Adjusted: HR 1.13 (1.10–1.16) men; 1.14 (1.11–1.17) women, cancer death, low vs high
│    Model adjusts for stage and treatment, so these HRs are what is left after those two causes.
├─ Partly explained by C9 (stage) and C11 (treatment)         med   [N22 abstract]
├─ Residual, unexplained: comorbidity, lifestyle, care quality, social support   unknown
│    [Z25 limits: no lifestyle, environment or comorbidity data]
└─ Varies by cancer type: cervix largest gap [R10, 1996–2005, cause-specific]   low (old data)
     cervix 78.5 / 69.0 / 63.3%; breast 89.4 / 87.1 / 84.9%; colon 60.1 / 61.1 / 55.8% (not a clean slope)
     (5-yr survival, high / secondary / basic education)
```

---

## 2. Cause table

| ID | Cause | Step (1–8) | Groups most affected | How big | How sure | Source |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Patient delay: symptoms put down to other causes; low health literacy | 1–2 | People who think symptoms are minor; lower education (not measured in Finland) | 40% of DLBCL pts; 54 of 146 days before first contact (37%; one cohort) | low | T25; H14 / Ea09 (snippet); DECK p.10 |
| C2 | Slow first GP contact and visit in public primary care | 3–4 | Public-route users; lower income (K26: lower income concentrated in public primary care) | 49% of non-urgent doctor visits within 1 wk (spring 2023), down from 60%; regions 37–57%; nurse visits 90% | high (national); low (cancer link, not measured) | THL23; K26 |
| C3 | Parallel routes: faster access via job, private pay, age | 3–5 | Employed / higher income; public users aged 51–70 | Median 127 vs 76 days, p=0.027 (n=48 public vs 39 private/occupational) | med (one small cohort) | K26 |
| C4 | Fees, travel, unmet need | 2–5 | Income-support recipients, young, women, poor health | Health-centre visit fee 30.20 € in 2026 ([Kela](https://www.kela.fi/ajankohtaista/sosiaaliturvamuutokset-potilastyossa); corrected from "fee cap"); a 36.20 € figure from another source [source needed]; client-fee annual ceiling 815 € ([Oikeuspalveluvirasto](https://www.oikeuspalveluvirasto.fi/en/financial-and-debt-counselling/managing-your-finances/plan-your-finances/medical-expenses/); corrected from "Kela cap"); unmet need highest in these groups | med (unmet need); low (cancer timing) | FS; KELA |
| C5 | Clocks not cancer-specific; referral and treatment timestamps not required | 5–8 | All patients | No cancer deadline in law; specialist 57 vs 41 days (figure only) | high (law text); low (effect on timing) | LAW; K26 figure |
| C6 | Lower screening uptake | 1 (detection) | Lower education (Finnish split not verified), men (colorectal), non-Western immigrants (mammography aRR 0.81) | 2024: colorectal 73.5%, cervical 73.5%, breast 81.6%; regional spread 7–14 pts | med (direction); low (size, education split) | SCR24; Njor23 (abstract not opened; countries corrected to DK/FI/IS/NO); DECK p.9 |
| C7 | Language and migrant barriers | 1–3 | Non-Western immigrants; African-origin women | Qualitative: language and lack of information named (cervical screening) | low | Idehen 2020, qualitative, 8 focus groups, n=30 ([PMC7602139](https://pmc.ncbi.nlm.nih.gov/articles/PMC7602139/), abstract read) |
| C8 | Living alone, not married | 2, 7–8 | Living alone; never-married men | Living alone +11–80% case-fatality (Finland, snippet); never-married men OR 1.56 cancer death (Norway, snippet; OR not checked in the abstract) | med (Finland); low (treatment link) | E21; Kr13 |
| C9 | Later stage (mediator) | 6 | Lower education | Adjusted OR early stage 1.14 men, 1.11 women (WP); stage IV OR 1.10 men, 1.15 women (final, secondary); stage missing ~30% | med–high (direction) | Z25; N22 |
| C10 | Age and comorbidity | 4–8 | Older, sicker patients | Little explained in Nordic snippets; not adjusted in Z25 | low | H14, Kr13 (snippet); Z25 limits |
| C11 | Treatment choice and county capacity | 7–8 | Unknown; possibly lower education and rural | No adjusted Finnish estimate; county drug adoption varies (LAW, strategy p.52) | low | N22 (mediation only); LAW |
| C12 | Distance to specialist centre | 5–8 | Rural residents | Rural lung cancer 12-month death HR 1.47 (1.07–2.01), 321 pts, one hospital | low | V |
| C13 | Regional differences in screening and survival | 1–8 | Residents of some counties | Screening spread 7–14 pts; breast survival: no major regional gap (thesis) | low; contested | SCR24; TH25 (snippet) |
| C14 | Route choice by income, occupation, marital status (see C3) | 3 | Income groups | Route effects p<0.001 (age, income, occupation); education p=0.133 | med | K26 |

---

## 3. Where causes are contested or unknown

1. **Patient or system delay?** Not separated anywhere. T25 finds 37% of delay before first contact and calls most delay system-side; K26 cannot split the steps. This is the biggest open question.
2. **Does SES drive delay, or only route?** K26 tested the interval itself: education p=0.244, income p=0.121, occupation p=0.288 (none significant). Route is significant (p=0.027). So the deck's "lower SES → longer time" (p.11) is not what K26 tested.
3. **Occupational care: who uses it vs who gets fast access?** OHC [OHC]: 62% of service events went to lower-educated people (event counts, no waits). K26: the fast route went to higher-income patients. These measure different things. Contested.
4. **Treatment gap after adjustment.** Z25's treatment shares are crude (not adjusted). A sub-agent digest reports an adjusted surgery OR 1.18 (high vs low education) in the [June 2025 working paper](https://www.demogr.mpg.de/papers/working/wp-2025-016.pdf); I did not check this against the paper, and its treatment models reportedly do not adjust for stage. No study found adjusts for both stage and comorbidity.
5. **Survival residual.** After stage and treatment, HR 1.13–1.14 remains. Z25 has no lifestyle or comorbidity data, so the residual is unexplained.
6. **DLBCL is one cancer, one group.** T25 and K26 are the same group, same design, n=160 each, overlapping enrolment and a co-author. Treat them as **one** source. Only 87 patients are in the route comparison. Incyte funded K26. Search snippets (not read in full): a Dutch DLBCL cohort found no SES gap under free access ([PubMed](https://pubmed.ncbi.nlm.nih.gov/28463808/)); a Californian registry study found SES disparities (ASH abstract 3553; link [source needed]).
7. **Regional vs socioeconomic gaps.** Screening varies by region (7–14 pts); breast survival shows no major regional gap (thesis, snippet). These are different axes; do not merge them.
8. **Trend 2024–2025.** Sources disagree on whether waits improved. One digest mentions a later correction to Helsinki data; not checked.
9. **Fee numbers conflict** (30.20 € vs 36.20 €, 2026).
10. **Stage data are missing** for ~30% (Z25 table) to ~37% (WP) of cases. Stage-based conclusions rest on about 70% of cases.

---

## 4. Deck numbers checked against the papers

| Deck page | Claim on slide | Verdict | What the source says | Correction for a slide |
| --- | --- | --- | --- | --- |
| p.6 | Survival same by sex, differs by education (Registry 2024 app) | **Not verified.** App not opened. | R10 (1996–2005) shows education gaps, not uniform. My reading of the deck chart: lines overlap, roughly 64–80% at 5 yrs; legend colours repeat for men and women (approximate). | Cite the registry app with its date. No numbers until opened. |
| p.8 | ~Half of cancers preventable; tobacco >2000 cases | **Not checked.** No source on slide. | — | Find the source before use. |
| p.9 | Screening lower in low-SES | **Direction plausible; education numbers not found.** | 2024 national: colorectal 73.5%, cervical 73.5%, breast 81.6%. Desk-note figures (men 69%, women 78%, basic education 62%, highly educated 79%) **not found**. Sources say "just under 70%" (men, colorectal) and "nearly 80%" (women, colorectal), with no education figures. | Use 73.5 / 73.5 / 81.6 with source. Drop the education split until sourced. |
| p.10 | 8-step delay model | **No source.** A framework. | — | Label as framework, not finding. |
| p.11 left | DLBCL cumulative times 72/42, 94/43, 147/77, 204/118, 207/123 | **Figure labels correct;** statistic not stated. Text: median 127 vs 76 days (p=0.027); mean 201 vs 126. The 207/123 values are Figure 1 labels, not medians or means. | Figure is not labelled median or mean. Route groups n=48 and 39. | Use the text: median 127 vs 76 days, primary care vs private/occupational, n=48 vs 39. Retitle: the paper shows route, not SES. Note Incyte funding. |
| p.11 right | Symptom-to-diagnosis >7 wks linked to worse PFS | **Overstated.** | T25: 7-week cut-off from ROC, no day count given. HR 5.89 (1.95–17.77) only for high Ki-67 (>70%) subgroup, unadjusted. Whole cohort: 2-yr PFS 89% vs 74% (p=0.012), no HR. Slide's "Subgroup B/C" labels not explained. | "In a DLBCL cohort (n=160), longer symptom-to-biopsy time was linked to worse PFS, most clearly in high-proliferation tumours (unadjusted)." |
| p.12–13 | Nordic review: 98 studies; lower SES → later stage, less treatment, worse survival | **Direction confirmed** (abstract). Effect sizes not read. | 3,629 records screened, 98 included. Forest plots show mostly Sweden and Denmark; Finland's share unknown. | Cite direction only. No effect sizes until full text. |
| p.14 | n = 469,522 "patients" | **Confirmed as cases** (newly diagnosed cancers, 240,746 men, 228,776 women). | Z25. | Say "cases". |
| p.14 | Surgery 51 vs 36%; radiotherapy 25 vs 14%; chemo 24 vs 15% | **Confirmed, crude (unadjusted).** | Z25 final text. Hormone 24 vs 18%; other 5 vs 4%. | Label "crude share". |
| p.15 | "Cancer mortality 27% vs 47%" | **Confirmed as a crude share** of patients who died of cancer, not a rate. Adjusted HR is the better headline. | Z25: adjusted HR cancer death, low vs high: 1.13 (1.10–1.16) men; 1.14 (1.11–1.17) women. Follow-up up to 10 yrs; end date stated as 2021 in methods, 2020 in a table footnote. | Show HR with CI as headline; label 27/47 as crude. |
| p.15 | Lower education → later stage | **Direction confirmed.** | Adjusted OR ~1.1 (WP). Stage missing ~30%. | Add missing-stage caveat. |
| p.16 | Costs €1.5bn → €2.6bn; need for consistent criteria | **Not checked.** | — | — |

## 5. Corrections to the desk map (02-problem-map.md)

- **P9 education numbers** (62% vs 79%) and **men 69% / women 78%**: not found in any source. Replace.
- **"27% vs 47%" is now defined:** a crude share of cancer deaths. The desk note said "metric not defined"; resolved.
- **"One lymphoma paper" (deck p.11 warning):** there are **two** papers from the same group on the same 160-patient design. Count as one.
- **P1 / deck p.11 "DLBCL example":** the figure numbers are right; the statistic and the SES framing are not (see table).
- **Tokola:** the PFS link is for one unadjusted subgroup, not all patients.

## 6. What would settle the biggest open questions

- Patient vs system delay: a Finnish cohort with dated symptom onset, first contact, and first GP visit for several cancers, split by route and education. None found.
- Treatment gap after adjustment: Finnish registry analysis adjusted for stage and comorbidity together. None found.
- Full text of N22 and the final Z25 supplement tables (education-specific stage and treatment by cancer type).
- Registry 2024 report (education-specific survival). Blocked (HTTP 403).

**Sources blocked or not opened:** BMJ and Wiley pages (403; Z25 and K26 read via other copies), registry 2024 report and factsheet (403), Sotkanet cancer waiting-time indicator (no hit in snippet search).
