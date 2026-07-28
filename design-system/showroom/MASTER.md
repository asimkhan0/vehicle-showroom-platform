# Showroom Design System — MASTER

> **Status:** Active. Supersedes the previous `MASTER.md` ("Swiss Modernism 2.0 + Premium Minimal").
> **Revised:** 2026-07-28
> **Direction name:** **Concours** — precision-futurist, derived from Direction B ("Confident Marketplace") in `DESIGN_RESEARCH.md`.
> **Reference implementation:** the interactive mockup covering Discover, Vehicle, Storefront, Dashboard, States and System.

---

## 1. Why this document was rewritten

The previous MASTER specified a slate-and-red palette, a single radius, and a card order that put the dealer above the price. Three problems made it unusable as a spine:

1. **`--primary` and `--destructive` were the same colour.** A design system cannot say "this is the action" and "this is the danger" with one token.
2. **`--accent`, `--secondary` and `--muted` were also identical**, so there was no way to express emphasis without inventing one-off values.
3. **`--tenant-accent` was documented but never defined**, so tenant theming had no contract.

This revision fixes the token spine first, then everything above it. It also records what was **measured** rather than asserted — see §5 and §12.

---

## 2. Positioning

Showroom is a **multi-vendor vehicle marketplace**, not a boutique. Buyers arrive to compare vehicles across showrooms; dealers arrive to move inventory. The design serves that order of priority.

**Three principles, in precedence order:**

1. **The vehicle is the hero.** The photograph is the largest element on any card. Chrome never competes with it.
2. **Price is the second reading.** Price is the strongest type in the card body — above the title, always tabular.
3. **The showroom is context, not the headline.** Dealer identity is a small, trusted footer row. It builds confidence; it does not lead.

**Trustworthy, futurist, elegant** is achieved through restraint: dark cinematic chrome, generous negative space, one accent, precise numerals — not gradients, glows, or novelty.

---

## 3. Token spine (three layers)

Every value belongs to exactly one layer. Components may only read Layer 2 and Layer 3.

### Layer 1 — primitives (never used directly in components)

```css
--ink-900:#0A0C0F; --ink-800:#101318; --ink-700:#171B22; --ink-600:#20252E;
--ink-500:#2C333E; --ink-400:#5A6270; --ink-300:#8A919C; --ink-200:#C7CBD1;

--paper:#FAFAF8;  --card:#FFFFFF;
--line:#E7E6E2;   --line-strong:#D5D4CF;
--text:#14171C;   --text-2:#5C6371;  --text-3:#6D727B;

--accent:#1F55E0; --accent-hover:#1746BC; --accent-soft:#EEF3FE; --accent-on-dark:#8AAEFF;

--pos:#257A54;  --pos-soft:#E8F2EC;
--warn:#97601E; --warn-soft:#FBEEDD;
--dang:#BA4138; --dang-soft:#FBE9E7;

--r-xs:4px; --r-sm:6px; --r-md:8px; --r-lg:12px; --r-xl:16px;
--e1:0 1px 2px rgba(10,12,15,.05), 0 4px 12px rgba(10,12,15,.04);
--e2:0 1px 2px rgba(10,12,15,.06), 0 10px 28px rgba(10,12,15,.07);
--sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-6:24px; --sp-8:32px; --sp-12:48px; --sp-16:64px;
```

### Layer 2 — semantic / context tokens

```css
--tenant-accent:#1F55E0;        /* overridden per tenant */
--tenant-accent-ink:#FFFFFF;    /* text that sits on the tenant accent */
--tenant-accent-soft:#EEF3FE;   /* tinted surface derived from it */

--row-h:46px; --cell-pad:14px 16px; --card-gap:24px;
```

### Layer 3 — component/density overrides

```css
[data-density="compact"]{ --row-h:34px; --cell-pad:7px 12px; --card-gap:16px; }
```

### Hard rules

- **`--accent` is the only action colour.** Buttons, links, active states, focus rings.
- **`--dang` is destructive only.** Delete, failure, irreversible. It never appears on a price, a CTA, or a badge.
- **`--pos` / `--warn` are status only.** Never actions.
- **No component may hard-code a hex value.** If a value is needed, it becomes a token.

---

## 4. Deliberate deviation from the research: accent is blue, not red

`DESIGN_RESEARCH.md` and the old MASTER both specified red (`#DC2626`) as the primary CTA. **This revision rejects that**, for one reason: the defect being fixed was that primary and destructive were the same colour. Restoring red as the primary action recreates the exact ambiguity — a red "Message dealer" next to a red "Delete listing" is not resolvable by size or position alone.

`--accent:#1F55E0` is used instead. It reads as trustworthy and futurist rather than urgent, and it leaves red free to mean one thing only. **Red is reserved strictly for destructive.**

If the brand requires red, it belongs in the wordmark and marketing surfaces, not in the interaction layer.

---

## 5. Typeface — and an honest limitation

**Specified:** DM Sans (UI and display) + Geist Mono (numerals in tables where alignment matters).

**Limitation:** the reference mockup does **not** render DM Sans. The build environment has no DM Sans installed and no network access to Google Fonts, so the mockup falls back to the system sans stack. Every proportion in the mockup was tuned against that fallback. **Expect to re-tune tracking and the display sizes once DM Sans is actually loaded** — DM Sans is slightly narrower and rounder, so display headings will read smaller and will likely need a tighter `letter-spacing` than the fallback required.

Do not treat the mockup's letter-spacing values as final.

**Numerals:** all prices, mileage, years, ratios and counts use `font-variant-numeric: tabular-nums`. This is non-negotiable — it is what makes a column of prices scannable.

---

## 6. Type scale

| Role | Size | Weight | Notes |
|---|---|---|---|
| Display | `clamp(2rem, 4.4vw, 3.25rem)` | 600 | Hero and storefront name. `letter-spacing:-.02em` |
| H1 | 2rem | 600 | Page titles |
| H2 | 1.5rem | 600 | Section headings |
| H3 | 1.125rem | 600 | Card and panel headings |
| Price (large) | `clamp(1.75rem, 2.5vw, 2.125rem)` | 600 | VDP price. Tabular |
| Price (card) | 1.25rem | 600 | Tabular |
| Body | 1rem / 1.55 | 400 | Max 65–70ch |
| Small | .875rem | 400 | Meta, secondary |
| Caption | .75rem | 400 | `--text-3` |
| Overline | .6875rem | 550 | `letter-spacing:.08em`, uppercase |

**Floor:** no interface text below .75rem. Body copy never below .875rem.

---

## 7. Layout

- **Container:** `max-width:1320px`, `padding:0 24px` (16px below 680px).
- **Spacing:** only `4, 8, 12, 16, 24, 32, 48, 64`.
- **Breakpoints:** `1080 / 900 / 680 / 430`.
- **Grid:** cards are `repeat(auto-fill, minmax(300px, 1fr))`.
- **`min-width:0` is mandatory** on every flex and grid child that contains text or a scroller. The default `min-width:auto` causes content to force the page wider than the viewport — this was the single largest source of mobile layout failure in QA.

---

## 8. Shape and elevation

- Radius: `8px` default, `12px` for cards and panels, `16px` for sheets and modals, `999px` for pills.
- **Borders before shadows.** A `1px solid var(--line)` border defines every surface. Elevation (`--e1`, `--e2`) is only for things that genuinely float: dropdowns, sheets, sticky bars.
- Never both a heavy shadow and a strong border.

---

## 9. Density model

One spine, two densities, controlled by `--row-h`, `--cell-pad`, `--card-gap`.

- **Comfortable** (default): all buyer-facing surfaces.
- **Compact** (`[data-density="compact"]`): the dealer dashboard, where scanning 40 rows matters more than air.

Density changes spacing tokens only. It never changes type size, colour, or radius.

---

## 10. Component rules

### Vehicle card (the most important component)

Order is fixed:

1. **Photograph, 16:9**, on a dark ground (`--ink-800`), fixed aspect ratio.
2. **Price** — largest text in the body. Optional `/mo` finance figure right-aligned, muted.
3. **Title** — make plus model, with trim in `--text-2`.
4. **Meta row** — year, mileage, fuel, transmission, each with a 14px icon.
5. **Dealer row** — initial avatar, showroom name, verified tick, city. Smallest row.

**Why 16:9 and not 4:3:** it is the category standard, it gives the widest scan target per row, and — critically — a **fixed** ratio means careless dealer photography cannot change card height and break the grid.

### The photography reality

The mockup uses clean studio renders. **Real dealer photos are shot on forecourts, in bad light, at careless crops.** The card is therefore built so the photograph is not load-bearing: a dark image well, a 1px border to stop blown-out shots bleeding into the page, and hierarchy carried by the price and dealer rows. The States screen stress-tests underexposed, blown-out, badly cropped and entirely missing photos. **Any change to the card must be re-tested against those four cases, not against studio renders.**

### Buttons

- Primary: `--accent` fill, `--accent-ink` text, radius 8px, height 44px (36px compact, 32px `.btn-sm`).
- Outline: 1px `--line-strong`, `--text` label.
- Destructive: `--dang`, and only for destructive actions.
- **Minimum target 44×44px** on touch surfaces.

### Horizontal rails

Used for "Just listed", storefront "Featured", and "Similar vehicles". Fixed-width children (306px desktop, 268px narrow), `overflow-x:auto`, `scroll-snap-type:x mandatory`, and `min-width:0` on the rail and its ancestors.

### Filters

- **Desktop:** sticky left rail.
- **≤900px:** the rail becomes a **bottom sheet** — `position:fixed`, `transform:translateY(101%)` when closed, opened by a "Filters (n)" bar, dismissed by scrim, close button, or `Escape`. Body scroll locks while open.
- Active filters always appear as removable chips above results, and the result count is stated in **human language** ("1,284 hybrid sedans in Karachi"), not as a bare number.

### Tables

Card-wrapped, sticky header, `--row-h` / `--cell-pad` from tokens, status as **dot plus label** (never colour alone), numerals tabular and right-aligned. Below 900px the table scrolls horizontally inside its card rather than widening the page.

---

## 11. Tenant theming contract

A tenant supplies **one** value: an accent. The system derives three tokens:

```css
.tenant-scope{
  --tenant-accent:#A85F2C;      /* from theme_json.accent; default #1F55E0 */
  --tenant-accent-ink:#FFFFFF;  /* must reach 4.5:1 against the accent */
  --tenant-accent-soft:#F9EFE6;
}
```

**Where the tenant accent may appear:** header stripe, price, primary inquiry CTA, active gallery thumbnail, link hover, focus ring inside the tenant scope.

**Where it may never appear:** the dealer dashboard (which always uses the platform accent), destructive actions, and status colours.

**Validation:** if a supplied accent cannot reach 4.5:1 against white, the platform darkens it until it does rather than rendering failing text.

---

## 12. Accessibility — measured, not asserted

Every pairing below was **computed** (WCAG 2.1 relative luminance) against the actual tokens in the stylesheet. An earlier pass asserted these ratios by eye and was wrong about four of them; two tokens (`--text-3`, `--warn`) were darkened as a direct result.

| Role | Pair | Ratio | AA normal |
|---|---|---|---|
| Body text | `#14171C` on `#FAFAF8` | 17.19:1 | Pass |
| Secondary text | `#5C6371` on `#FAFAF8` | 5.78:1 | Pass |
| Tertiary / captions | `#6D727B` on `#FAFAF8` | 4.63:1 | Pass |
| Body on card | `#14171C` on `#FFFFFF` | 17.96:1 | Pass |
| Secondary on card | `#5C6371` on `#FFFFFF` | 6.04:1 | Pass |
| Accent link on paper | `#1F55E0` on `#FAFAF8` | 5.85:1 | Pass |
| Ink on accent button | `#FFFFFF` on `#1F55E0` | 6.12:1 | Pass |
| Positive on soft | `#257A54` on `#E8F2EC` | 4.60:1 | Pass |
| Attention on soft | `#97601E` on `#FBEEDD` | 4.59:1 | Pass |
| Destructive on soft | `#BA4138` on `#FBE9E7` | 4.59:1 | Pass |
| Accent on dark chrome | `#8AAEFF` on `#0A0C0F` | 8.93:1 | Pass |
| Muted on dark chrome | `#C7CBD1` on `#0A0C0F` | 12.02:1 | Pass |
| Tenant accent on card | `#A85F2C` on `#FFFFFF` | 4.84:1 | Pass |

**Rule: any new colour pairing must be computed before it ships.** Do not eyeball it.

### Other requirements

- **Focus is always visible:** a 2px `--accent` outline with 2px offset on `:focus-visible`, re-coloured to `--tenant-accent` inside a tenant scope. Never `outline:none`.
- **Keyboard:** the screen tablist and the gallery thumbnails are arrow-key navigable with roving focus; `Escape` closes the filter sheet.
- **Status is never colour alone** — always a dot plus a text label.
- **Reduced motion** is respected: all transitions collapse under `prefers-reduced-motion:reduce`.
- Targets ≥44×44px on touch.

---

## 13. Required states

A marketplace is judged on its worst screen. These are **part of the component spec**, not an afterthought, and each is implemented in the mockup's States screen:

- **Empty / no results** — restate the query, **name the filter that is excluding the most results**, and offer at least three one-tap routes out (relax price, drop a filter, widen location), plus "save this search".
- **Loading** — skeletons that mirror the real card geometry so nothing shifts on arrival.
- **Error** — plain language, state that filters are preserved, offer retry. This is the one place `--dang` appears on a buyer surface.
- **Missing photography** — a branded gradient placeholder reading "Photos coming soon". Never a grey box with a broken-image glyph.
- **Bad photography** — see §10.

---

## 14. Dark mode

**Position: not in scope for this revision, and deliberately so.**

The chrome is already dark; the content surfaces are intentionally light paper because vehicle photography and price scanning read better on it. A true dark mode is a second full palette — a second set of measured contrast pairs, a second set of image wells, a second tenant-accent validation pass. Shipping a half-inverted theme would undo the token discipline this document exists to establish.

`next-themes` is already in the dependency list, so the hook is available. When dark mode is taken on, it must be a Layer 1 palette swap with its own measured contrast table — not a filter or an inversion.

---

## 15. Known gaps

Recorded so they are not mistaken for finished work:

1. **DM Sans is not rendered in the reference mockup** (§5). Proportions need re-tuning.
2. **Imagery in the mockup is AI-generated placeholder** and some frames resemble real marques. It must be replaced with real dealer photography before any external use.
3. **RTL and long-content stress** (Urdu labels, very long showroom names, 40-character trim strings) has not been tested.
4. **Dark mode** is unaddressed (§14).
5. **Nothing is implemented in the application yet.** This document describes the target; the codebase still carries the old `globals.css` defects.

---

## 16. Implementation sequence

Each step is independently reviewable and shippable.

1. **Token layer.** Replace the colour block in `globals.css` with the three-layer spine. Split `--primary` from `--destructive`; give `--accent`, `--secondary`, `--muted` distinct values; define the tenant tokens. No visual work.
2. **Primitives.** Button, badge, chip, avatar, status dot, skeleton, empty state, error state — driven only by tokens.
3. **Vehicle card.** 16:9 well, price-led order, dealer footer row, missing-photo placeholder. Stress-test against the four photography cases.
4. **Discovery.** Hero search, intent chips, "Just listed" rail, filter chip bar, human-language result count, mobile filter sheet, trust strip.
5. **Vehicle detail.** Gallery, sticky price/contact panel, section nav, similar-vehicles rail, mobile sticky inquire bar.
6. **Storefront.** 21:9 cover, tenant token scope, featured row, contained header, footer.
7. **Dashboard.** Compact density, KPI cards, next-actions panel, card-wrapped tables with row thumbnails.

**Verification loop for every step:** screenshot at **1440px and 390px**, confirm no horizontal overflow, no console errors, and re-run the contrast computation if any colour changed.
