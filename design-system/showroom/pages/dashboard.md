# Page spec — Dealer dashboard (`/dashboard`)

> **Revised:** 2026-07-28. Supersedes the previous `dashboard.md`.
> Reads only from the token spine in `showroom/MASTER.md`.

---

## 1. Purpose

The dashboard is a **work surface**, not a marketing surface. A dealer opens it to answer one question: *what needs my attention right now?* Everything else is secondary.

It therefore runs in **compact density** and uses the **platform accent, never the tenant accent**. A dealer managing three showrooms must not have the interface change colour depending on which one is selected.

---

## 2. Density

`[data-density="compact"]` is applied to the dashboard shell:

```css
--row-h:34px; --cell-pad:7px 12px; --card-gap:16px;
```

Density changes **spacing only**. Type sizes, colours and radii are identical to the rest of the platform. A density toggle is exposed so dealers with fewer listings can choose comfortable spacing.

---

## 3. Structure

### 3.1 Top bar (sticky)

Wordmark → showroom switcher → spacer → notifications → user email → sign out.

**Below 900px** the bar becomes static and its contents wrap onto a second row with `min-width:0`. *(This overflowed the viewport by 11px at 390px before it was fixed. Re-test at 390px after any change.)*

### 3.2 Sidebar

Nav order is fixed: **Vehicles, Inquiries, Domains, Settings**.

**Below 900px** the sidebar becomes a horizontal scroller pinned under the top bar (`overflow-x:auto`, `min-width:0` on the nav and its groups), with section labels and the footer block hidden. The full-height sidebar layout at narrow widths was the cause of a 577px-wide page; the horizontal scroller replaces it.

### 3.3 KPI cards

Four cards: **published listings, unread inquiries, listing views, average days to sell.**

- Value at display scale, tabular numerals.
- Delta against the previous period with a direction arrow, coloured `--pos` or `--warn`.
- **A delta must state its direction in words as well as colour** — "3 days slower", not just a red arrow. An increase is not automatically good: days-to-sell rising is bad, views rising is good, and colour alone cannot express that.
- Grid: 4 columns → 2 columns below 900px → 1 column below 430px.

### 3.4 Next actions — the most important panel

This is the answer to "what needs my attention". It sits **directly below the KPI cards**, above every table.

Each row: an icon in a soft token surface, a bold one-line statement, a supporting line explaining *why it matters*, and a single outline action button.

Priority order:

1. **Unread inquiries** — names the waiting buyers. Uses `--warn-soft`. Highest priority: a missed inquiry is lost revenue.
2. **Listings needing photos** — states the impact ("listings with six or more photos receive about three times more inquiries").
3. **Drafts ready to publish** — states the consequence ("drafts do not appear on your storefront or in marketplace search").

Rules:

- Never show more than four actions. A list of twelve is not a priority list.
- **When there is nothing to do, say so.** A calm confirmation state, not an empty panel.
- Every row must be actionable in one click. No row that only informs.
- **Below 680px** rows wrap and the button aligns under the text at the icon's indent.

### 3.5 Tables

Inquiries and listings, each wrapped in a card.

- Sticky header row; `--row-h` and `--cell-pad` from tokens.
- **Vehicle cells carry a 44×26px thumbnail** with the vehicle name. A dealer recognises their stock by sight faster than by trim string.
- Person cells use an initial avatar with name over email.
- **Status is a dot plus a label** — New, Awaiting reply, Sold, Lost — never colour alone.
- Numerals and timestamps right-aligned, tabular.
- Row hover uses a subtle paper tint, not the accent.
- **Below 900px the table scrolls horizontally inside its card** (`min-width:640px` on the table, `overflow-x:auto` on the wrapper). The page itself never widens.
- **Empty states:** "No inquiries yet" with a line on what drives inquiries; "No listings yet" with a primary action to add the first vehicle.

### 3.6 Auth screens

Centred card, `max-width:400px`, full-width primary submit in the **platform accent**. Errors inline above the field, `--dang` on `--dang-soft`, in plain language. No tenant accent anywhere in auth.

---

## 4. Colour discipline

- Primary actions: `--accent`.
- Delete listing, remove domain: `--dang`, and always behind a confirmation.
- Status: `--pos` / `--warn` / `--text-3`, always paired with a label.
- **No tenant accent on this page.**

---

## 5. Accessibility

- Tables use real `<th>` elements with scope; sortable headers are buttons with `aria-sort`.
- Focus ring: 2px `--accent`, 2px offset, on every interactive element.
- Status colour is never the only signal.
- Targets ≥44×44px at comfortable density; ≥32px at compact, which is a pointer-first surface.
- All KPI deltas readable without colour.

---

## 6. Verification

Screenshot at 1440px and 390px. Confirm no horizontal overflow, both densities. Test with: zero listings, zero inquiries, nothing in Next actions, 40+ rows, and a very long vehicle title.
