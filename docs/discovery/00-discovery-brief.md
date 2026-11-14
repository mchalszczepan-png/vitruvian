# Discovery brief

Method: product-discovery-skills (`discover-product` router). Started 2026-11-14. Status: research only, nothing being built.

## Opportunity and context

- **Opportunity (human choice, by entering the track):** equal and effective cancer care in Finland, AstraZeneca track, Junction 2026. Brief: [../tracks/astrazeneca-cancer-care.md](../tracks/astrazeneca-cancer-care.md).
- **Constraints:** 36-hour hackathon [source needed: not in the event rules; submission closes Sun 15 Nov 10:00 per [event rules](../tracks/02-event-rules.md)], judging Sun 14:00 ([track brief, Mentors](../tracks/astrazeneca-cancer-care.md#mentors)). Must cite sources, hit a Goal 3 indicator, give actionable recommendations, show a working demo ([track brief, Minimum requirements](../tracks/astrazeneca-cancer-care.md#minimum-requirements)). Judging: actionability 30%, insight 25%, data quality 20%, execution 15%, clarity 10% ([track brief, Judging criteria](../tracks/astrazeneca-cancer-care.md#judging-criteria)).
- **Team skills/assets:** Kotlin Android, Gemini (incl. Decisions API), Gemma, sponsor credits ([../sponsors.md](../sponsors.md)).

## Decision we need to make

Which customer situation and problem to build for. Two directions are open (not a human choice yet):
- **A – law and care pathway** (county/system side). Research: [../research/law/00-synthesis.md](../research/law/00-synthesis.md).
- **B – smart-glasses risk coach** (prevention, patient side). Research: [../research/glasses/](../research/glasses/).

## Existing sources (by type)

| Source | Type | Covers |
| --- | --- | --- |
| Insights deck, Kuitunen 13.11.2026 ([notes](../tracks/astrazeneca-insights-deck.md), [PDF](../tracks/astrazeneca-insights-deck-2026-11-13.pdf)) | Expert presentation citing independent research | Where inequality arises; public vs private delay (DLBCL); SES gaps in treatment and mortality |
| [Law research 01–07](../research/law/) | Desk research (statute, strategy) | Legal clocks, county structure, data access, screening, medicines |
| [Glasses research 02–08](../research/glasses/) | Desk research | Decisions API, risk evidence, Goal 3 link (weak), privacy, build |
| Customer testimony | **None, and none planned** (secondary sources only) | – |

## Provisional customer groups (hypotheses)

1. Adults with possible cancer symptoms who use public primary care (lower SES, no occupational healthcare) – the slow route on deck p. 11 ([deck notes](../tracks/astrazeneca-insights-deck.md)).
2. Primary care doctors/nurses who must recognise and refer suspected cancer.
3. County service managers responsible for pathway timeliness and equity.
4. People with high lifestyle risk in lower-SES groups (Direction B).

## Open questions

- Where in the 8-step pathway ([deck notes p. 10](../tracks/astrazeneca-insights-deck.md)) is the biggest **fixable** delay for public-route patients: patient delay, getting a GP appointment, or GP → referral?
- Who would actually use and who would buy/approve a tool: patient, GP, county?
- Is Direction B reachable for lower-SES groups, or does it widen the gap?
- Do public county-level waiting data exist? ([law07 §3](../research/law/07-verification.md): no cancer waiting-time data found; only proxies.)

## Next activity and reason

**Update 2026-11-14: no interviews will happen** (team decision). The interview guide is kept for reference only. Customer evidence must come from published secondary sources (qualitative studies, patient-organisation surveys, patient stories, GP surveys), each labelled as secondary and cited. No invented testimony.

1. ~~**learn-from-customer-interviews (prepare):**~~ (dropped, no interviews) we have zero testimony. Mentors are at the event today (Kaisa Kaitila, Medical Affairs, Sat; [track brief, Mentors](../tracks/astrazeneca-cancer-care.md#mentors)) plus any clinicians/patients the team can reach. Guide: [01-interview-guide.md](01-interview-guide.md).
2. **map-customer-problems (desk draft):** organise deck + research into a hypothesis problem map, clearly labelled as not yet customer-backed: [02-problem-map.md](02-problem-map.md).
3. **Secondary customer evidence:** [03-secondary-evidence.md](03-secondary-evidence.md).
4. Then: update map with secondary evidence → **explore-solution-directions** → human picks A or B and scope (**choose-mvp-scope**).
