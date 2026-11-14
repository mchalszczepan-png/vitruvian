# Vitruvian: design

What the code does, taken from `src/index.css` and the screens. Light theme only (`color-scheme: light`). No dark-mode rules exist.

## Colour tokens (on `:root`)

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | #f8f1ee | Page background, field hover, rule cards |
| `--paper-2` | #f2e8e4 | Default button and tag fill, inbox hover |
| `--card` | #fffcfa | Panels, dock, document sheets, tiles |
| `--lilac` | #e0b7de | Gemma and AI tags, selection, bar "lo" |
| `--lilac-soft` | #f1dcef | Done tabs, meter off-state, loading shimmer, done note |
| `--slate` | #3a414c | Secondary text, bar fill, tile headings |
| `--ink` | #182521 | Text, selected tab, primary button, Staging result, Next panel |
| `--amber` | #f3ba2c | Accent: target marker, "warn" tag, Next panel action numbers |
| `--amber-soft` | #fbe7b3 | Repeat visit flag, GP origin tag, gate, repeat rule |
| `--wine` | #690c3e | Focus outline, links, urgent button, missing fields, meter "on" |
| `--wine-soft` | #f3dde6 | Missing field fill, empty tag, unfilled progress |
| `--muted` | #5a606a | Secondary text (5.9:1 on paper, per the code comment) |

Hard-coded colours also appear. The record-system greys (#eceae8, #d9d6d3, #f4f3f2 and others) are fixed on purpose. Some text colours (#7a4f00, #6b4b00, #4a3a0c) are fixed too.

## Type

- `--serif`: Source Serif 4. Used for headings (h1 to h3), wordmark, big numbers (`.big`, `.v`), section titles, and Goal 3 names.
- `--sans`: Inter. Used for the body and all UI. Both load from Google Fonts in `index.html`.
- Scale: `--step--1` 0.8125rem, `--step-0` 0.9375rem, `--step-1` 1.0625rem, `--step-2` 1.375rem, `--step-3` 1.875rem, `--step-4` 2.75rem.
- Base size 16px, line height 1.5. `.num` and big numbers use tabular figures.

## Shape and motion

- Radius: `--r-sm` 8px (buttons, inputs), `--r` 14px (fields, rules, tiles), `--r-lg` 22px (panels, dock, doc sheet).
- Shadow: `--shadow`, a 1px line plus a soft 24px drop, tinted with ink.
- Easing: `--ease` cubic-bezier(0.16, 1, 0.3, 1), used on 160 to 600ms transitions.
- `prefers-reduced-motion` turns off all transitions and animations.

## The skew

- `--skew: -10deg`. It sets the parallelogram look.
- Applied with `transform: skewX(var(--skew))` on a `::before` pseudo-element: tabs (`.ptab`), buttons (`.btn`), tags (`.tag`), progress cells, meter cells, bar fills, timeline marks.
- The Staging result uses its own fixed `skewX(-6deg)`.
- Text stays unskewed. Only the background shape skews.

## Gradients

- `.aid-tiles::before`: a lilac radial glow, `rgb(224 183 222 / 0.55)`, behind the three Aid tiles.
- `.next::before`: an amber radial glow at the top right (0.22 alpha) over the ink panel.

## Layout patterns

- Shell: a fixed-height grid (`100dvh`) with a disclaimer bar, a top bar, then the main area. The disclaimer shows on every view.
- Views are chosen with four parallelogram tabs: GP, Referral desk, Specialist, County.
- **GP view:** a grid of `1fr` and a docked `600px` Vitruvian panel (`.gp-layout`), beside the record system (`.ehr`).
- **Focus tiles:** `.aid-tiles` in three columns, `1fr 1.15fr 1fr`. Tiles: Suspected cancer type, Risk gradient, Severity. The middle tile is widest.
- **Document views:** a 320px inbox beside a document sheet (`.split`, `.doc`). The County screen uses `.two` and `.three` grids.

## Field origin tags

Each template field can carry one origin tag (`.tag` class, label in `labels.ts`):

| Class | Label | Look |
| --- | --- | --- |
| `.record` | Record system | Grey fill |
| `.gemma` | Gemma | Lilac fill |
| `.gp` | Edited by GP | Amber-soft fill |
| `.empty` | Empty | Wine text, wine-soft fill |

## Components (class names)

- **Shell:** `.shell`, `.disclaimer`, `.topbar`, `.wordmark`, `.who`, `.main`.
- **Tabs:** `.ptabs`, `.ptab` (`.done`, `[aria-selected]`).
- **Buttons:** `.btn` with `.primary`, `.urgent`, `.small`, `[aria-pressed]`. `.linkbtn` for inline text actions.
- **Tags and sources:** `.tag` (`.ai`, `.gemma`, `.gp`, `.record`, `.empty`, `.warn`, `.urgent`), `.req`, `.src` (with `.ph` for placeholder sources).
- **Record system:** `.ehr`, `.ehr-bar`, `.ehr-body`, `.ehr-list`, `.ehr-chart`, `.ehr-meta`, `.ehr-visit` (`.today`).
- **Dock:** `.dock`, `.dock-head`, `.following`, `.dock-tabs`, `.dock-body`, `.section-title`, `.lede`.
- **Repeat visit:** `.flag`, `.timeline`, `.tl-item` (`.same`, `.today`), `.tl-mark`.
- **Template:** `.fill-status`, `.progress` (`i.on`), `.fields`, `.field` (`.missing`), `.field-top`, `.input`, `.evidence`, `.chips`, `.unit-row`, `.toolbar`.
- **Aid:** `.aid-tiles`, `.tile`, `.big`, `.meter` (`i.on`), `.rules`, `.rule` (`.repeat`), `.rule-top`, `.rule-id`, `.gate`.
- **Decision:** `.decide`, `.row`, `.done-note`, `.notice`.
- **States:** `.loading` (shimmer rows), `.empty-state`.
- **Documents:** `.split`, `.inbox`, `.doc`, `.doc-head`, `.meta`, `.kv`, `.summary-strip`, `.stage-result`, `.form-grid`, `.tnm`.
- **County:** `.county`, `.county-head`, `.facts`, `.fact`, `.panel`, `.bars`, `.bar-row`, `.bar-track`, `.bar-fill` (`.hi`, `.lo`), `.bar-target`, `.goal`, `.next`, `.action`.
- **Icons:** `components/Icon.tsx`, one 20-unit stroke set, 1.75 stroke, 16px default. `Mark` is the logo: a wine shape with an amber inner shape.

## Rules the code follows

- **Source under every number.** Every figure has a `Source` component (`.src`) that links to its URL. The label starts with "Source" or "Staging grid" and is shown in small muted text. Placeholder sources carry a visible "Placeholder source" tag.
- **AI estimate label.** Each Risk gradient has a `.tag.ai` reading "AI estimate". The meter's aria label says the same.
- **Disclaimer on every view.** The `.disclaimer` bar sits above the top bar in `App.tsx`.
- **Focus is always visible.** `:focus-visible` gets a 2px wine outline.
- **No vendor imitation.** The record system uses the system font and its own grey palette. The code comment says it is "deliberately plain, system font, not Vitruvian styled".
- **Gemma is labelled.** Mock notices sit under the Gemma step and the Risk gradient tile ("Gemma is mocked in this prototype").
- **Nothing is sent until the GP decides.** The GP step says so under the Gemma notice.
