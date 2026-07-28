# Page spec — Tenant storefront (`/{slug}`)

> **Revised:** 2026-07-28. Supersedes the previous `storefront.md`.
> Reads only from the token spine in `showroom/MASTER.md`. No hard-coded colours.

---

## 1. Purpose

A storefront must make an independent showroom look credible on its own domain, while remaining recognisably part of the Showroom platform. Two audiences, one page: a buyer who arrived from marketplace search, and a buyer who arrived from the dealer's own link.

**The vehicle still leads.** Tenant branding is the frame, not the subject.

---

## 2. Tenant theming

The tenant supplies **one** value — an accent — from `theme_json.accent`. Three tokens are derived and scoped to the storefront:

```css
.tenant-scope{
  --tenant-accent: <theme_json.accent>;   /* default #1F55E0 */
  --tenant-accent-ink: #FFFFFF;           /* must reach 4.5:1 on the accent */
  --tenant-accent-soft: <10% tint>;
}
```

**Permitted uses:** cover accent stripe, price, primary inquiry CTA, active gallery thumbnail, link hover, and the focus ring inside the tenant scope.

**Forbidden:** destructive actions, status colours, and anything in the dealer dashboard.

**Validation:** if the supplied accent cannot reach 4.5:1 against white, darken it programmatically until it does. Never render failing text. Never override a tenant accent with a platform colour.

The reference implementation uses a copper tenant (`#A85F2C`, measured 4.84:1 on white) to prove the same components re-skin without modification.

---

## 3. Structure

### 3.1 Cover — full-bleed, 21:9

- Cover image, `object-fit:cover`, `max-height:420px`.
- Dark gradient veil top-to-bottom (`rgba(10,12,15,.25)` → `.9`) so text is legible over any photograph.
- **Fallback when no cover image exists:** an accent gradient with a subtle dot texture. Never an empty grey band.
- A `3px` left stripe in `--tenant-accent` anchors the content block.
- Contents, in order: overline (dealer type and location) → dealer name at display scale → one-line bio (max 52ch) → pill row.
- **Pill row:** inventory count, rating with review count, verification with "since" year. Glass pills (`rgba(255,255,255,.13)` + 1px border + blur).
- **Below 680px:** ratio relaxes to 3:2 so the name and pills do not crush.

### 3.2 Header — contained, light, floating

- Sits below the cover, `max-width:1320px`.
- Logo, or an initial-avatar fallback derived from the dealer name.
- Nav links; a "Powered by Showroom" chip; a primary inquiry CTA in the tenant accent.
- **Below 900px:** nav is hidden, the header wraps to two rows, and the "Powered by" chip plus CTA occupy the second row. Below 430px the CTA goes full-width. *(This was a real overflow failure at 390px — the header pushed the page to 839px wide before it was fixed. Any change here must be re-tested at 390px.)*

### 3.3 Featured row

- Heading "Featured this week", with a one-line explanation that the dealer chose these.
- **Auto-populates with up to three vehicles when the dealer has 4 or more listings.** Hidden entirely below that threshold — a one-car "featured" row reads as an empty shop.
- Horizontal rail: fixed 306px children (268px narrow), `scroll-snap`, `overflow-x:auto`, `min-width:0` on the rail and its ancestors.
- Cards carry an "Inspected" badge and the price in the tenant accent.

### 3.4 Inventory

- Results bar: overline "Inventory", human-language count, sort control.
- Card grid, `repeat(auto-fill, minmax(300px, 1fr))`, gap `--card-gap`.
- Identical `VehicleCard` component as the marketplace — only the accent differs.
- **Empty state:** if the showroom has no live listings, say so plainly and link to the marketplace. Never render an empty grid.

### 3.5 Footer

- Bio snippet, contact details, opening hours, accent stripe.
- "Powered by Showroom" is always present and always legible — it is a platform requirement, not a courtesy.

---

## 4. Card rules (unchanged from the platform spec)

16:9 fixed photo well → price (tenant accent, tabular, full figures with separators) → title with trim → meta row → dealer row. Missing photography uses the branded "Photos coming soon" placeholder.

---

## 5. Accessibility

- Focus ring inside the storefront uses `--tenant-accent`, 2px with 2px offset.
- Cover text must clear 4.5:1 against the gradient at its lightest point — the veil exists for this reason, so do not weaken it to show more of the photograph.
- Gallery and rail children are keyboard reachable; rails are arrow-key navigable.
- Targets ≥44×44px.

---

## 6. Verification

Screenshot at 1440px and 390px. Confirm no horizontal overflow. Test with: no cover image, no logo, a very long dealer name, a single listing, and zero listings.
