# Showroom — Design Research & Direction

**Date:** 2026-06-18  
**Status:** Research complete — ready for direction selection + implementation  
**Audience:** Product, engineering, and future design work in Cursor  

> This document is the output of competitive UX research, gap analysis against the current codebase, and three concrete design directions. It supersedes generic token swaps as the source of “what good looks like.” Implementation tokens remain in [`showroom/MASTER.md`](./showroom/MASTER.md).

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Design brief (one page)](#2-design-brief-one-page)
3. [Competitive audit](#3-competitive-audit)
4. [Category trends (2024–2026)](#4-category-trends-20242026)
5. [Gap analysis: Showroom today](#5-gap-analysis-showroom-today)
6. [Three design directions](#6-three-design-directions)
7. [Recommended direction](#7-recommended-direction)
8. [Signature screen blueprints](#8-signature-screen-blueprints)
9. [Typography & visual hierarchy](#9-typography--visual-hierarchy)
10. [Component upgrade spec](#10-component-upgrade-spec)
11. [Trust & content strategy](#11-trust--content-strategy)
12. [Implementation roadmap](#12-implementation-roadmap)
13. [Anti-patterns & avoid list](#13-anti-patterns--avoid-list)
14. [Sources](#14-sources)

---

## 1. Executive summary

### The problem

Showroom’s recent design pass applied **consistent tokens** (slate + red, DM Sans, unified cards) but not **designed product UX**. The result feels like a well-themed admin template, not a vehicle marketplace buyers trust or dealers are proud to send customers to.

### What category leaders actually optimize for

| Priority | Pattern | Who does it well |
|----------|---------|------------------|
| **Scan speed** | Large photos, price + year/mileage above the fold on cards | AutoTrader, Cars.com |
| **Deal confidence** | Price-position or value badges | CarGurus, Cars.com |
| **Search intent** | Lifestyle chips + faceted filters + (emerging) NL search | AutoTrader, CarGurus |
| **Conversion** | Sticky inquiry CTA, gallery-first VDP | Dealer.com, BaT |
| **Dealer identity** | Strong on VDP + storefront; **subtle** on discovery grid | AutoTrader, Carwow |
| **Trust** | Platform stats, dealer ratings, transparent contact | Carwow, Hemmings |

### Recommendation in one sentence

**Adopt Direction B (“Confident Marketplace”)** — AutoTrader/Cars.com scan-speed for discovery, Carwow trust spacing for dealer blocks, BaT-quality VDP structure — while keeping Showroom’s multi-tenant `--tenant-accent` for storefront branding.

### Highest-impact next builds (in order)

1. Marketplace home as a **full landing** (hero → intent chips → featured → results → trust → dealer CTA) — not hero + filter form + grid only  
2. **Redesigned listing card** (16:9 image, price-led hierarchy, showroom as secondary line)  
3. **VDP upgrade** (sticky mobile CTA bar, section nav, dealer trust panel, similar vehicles)  
4. **Storefront hero** with optional cover image + featured row  
5. **Dashboard “next action”** panel (unread inquiries, drafts to publish)

---

## 2. Design brief (one page)

### Product shape (reminder)

- **Buyers** search across showrooms at platform host `/`
- **Dealers** manage inventory at `/dashboard`, publish to `/{slug}` or subdomain/custom domain
- **Storefront** is the dealer’s brand moment; **marketplace** is vehicle-first

### Buyer emotional goal

> “I can find the right car quickly and trust who I’m contacting.”

### Dealer emotional goal

> “My lot looks professional online and leads come to me without learning complicated software.”

### Visual thesis (recommended — Direction B)

**Confident marketplace utility with premium spacing** — photos dominate, typography creates clear price/title/spec hierarchy, red CTAs only for primary actions, dealer identity appears as a calm secondary layer until the buyer is on the VDP or storefront.

### Content order — platform home (`/`)

Per marketplace landing best practice and competitor patterns:

```
1. Hero + search (make/model + optional location later)
2. Intent chips (“Family”, “Under $20k”, “Low mileage”, “Electric”)
3. Featured / recently listed rail (6–8 cards)
4. Faceted filters + results grid
5. Trust strip (listing count, showrooms, inquiry flow)
6. “List your inventory” dealer CTA
7. Footer
```

### Interaction plan

1. **Card hover:** image brightness lift + shadow (no layout shift); optional 2nd photo on hover (desktop)  
2. **Filter apply:** URL updates + results skeleton pulse (never blank freeze)  
3. **VDP mobile:** sticky bottom bar — Call / Inquire (inquire opens dialog)

### What we are NOT building (yet)

- Auction/bid UX (BaT/Hemmings auction mode)  
- IMV / full market pricing algorithm (CarGurus) — start with simple “price vs segment” later  
- Natural-language search (CarGurus Discover) — Phase 2  
- Shop-by-payment / finance calculator — Phase 4 monetization

---

## 3. Competitive audit

### Summary matrix

| Reference | URL | Audience | Hero pattern | Card density | Signature idea |
|-----------|-----|----------|--------------|--------------|----------------|
| **AutoTrader UK** | autotrader.co.uk | Buyer | Search + lifestyle categories | Medium grid, image carousel | Defer dealer branding to VDP |
| **Cars.com** | cars.com | Buyer | Search + condition toggle | Dense, deal badges | Monthly payment + deal rating on card |
| **CarGurus** | cargurus.com | Buyer | Search + AI Discover | Medium, deal badge hero | Color-coded deal rating = click driver |
| **Bring a Trailer** | bringatrailer.com | Enthusiast | Editorial + ending soon | Low, story cards | Sticky section nav on long VDP |
| **Hemmings** | hemmings.com | Collector | Editorial + format badges | Medium | Listing format badges (auction/offer/classified) |
| **Facebook Marketplace** | facebook.com/marketplace | Casual P2P | Infinite social feed | Very low structure | AI listing insights on VDP |
| **Carwow** | carwow.co.uk | New-car buyer | Tri-mode browse/buy/sell | Spacious, fintech feel | Buyer-controlled contact, dealer comparison |
| **Dealer.com** | dealer.com | Dealer B2B → shopper | Inventory widgets + search | Dealer SRP standard | Spotlight listings, similar vehicles, sticky mobile CTA |

---

### 3.1 AutoTrader UK

**URL:** https://www.autotrader.co.uk  

| Dimension | Pattern |
|-----------|---------|
| Hero | Search-first: make/model/postcode. “I’m looking for…” **lifestyle categories** (Family, Big boot, Cheaper to run) combinable with price/age |
| Cards | Desktop **grid** after eye-tracking tests. ~16:9 carousel (up to 4 photos in-card). Price + year/mileage prominent; **dealer name de-emphasized** on search results |
| Filters | Modal sheet (shared mobile/desktop): make → model → price → distance |
| VDP | Redesigned 2025: structured sections, flexible contact (Message / Call / Deal Builder) |
| Trust | Dealer reviews, verified retailer, platform scale (“423k+ listings”) |
| Mood | Utilitarian, blue accent, scan-optimized — not luxury |

**Steal for Showroom**
1. Lifestyle intent chips derived from listing attributes (no dealer setup)  
2. In-card image carousel on desktop grid  
3. Vehicle-first discovery; showroom chrome on VDP only  

**Avoid:** Infinite scroll without URL state; dealer logo billboards on every card  

---

### 3.2 Cars.com

**URL:** https://www.cars.com  

| Dimension | Pattern |
|-----------|---------|
| Hero | Search with New / Used / CPO toggle |
| Cards | Year Make Model Trim title, price, **monthly estimate**, deal badge + $ vs market, dealer stars below |
| Filters | Dense left-rail facets (30+); “shop by payment” as first-class mode |
| VDP | Long scroll, horizontal gallery, similar vehicles |
| Trust | Deal ratings (Great/Good/Fair/High), price-drop badges, history affordances |

**Steal for Showroom**
1. Dual price line: cash + estimated monthly (even rough)  
2. Simple deal/position badge (“Below average for segment”)  
3. Human-readable results title: “Used 2019 Honda Civic under $15k”  

**Avoid:** Exposing 30+ filters at once; ad-heavy VDP  

---

### 3.3 CarGurus

**URL:** https://www.cargurus.com  

| Dimension | Pattern |
|-----------|---------|
| Hero | Classic search + **CarGurus Discover** conversational AI overlay |
| Cards | **Deal Rating badge** is the most prominent non-photo element (green → red) |
| Filters | Left-rail instant update; mobile bottom sheet |
| VDP | IMV chart, deal explanation, dealer form |
| Trust | Proprietary IMV, “unbiased” positioning, save-search alerts |

**Steal for Showroom**
1. Cross-showroom price positioning badge (start simple)  
2. Saved search + email alerts (retention)  
3. Conversational search → filter mapping (later)  

**Avoid:** Opaque algorithm with no “why” explanation  

---

### 3.4 Bring a Trailer

**URL:** https://bringatrailer.com  

| Dimension | Pattern |
|-----------|---------|
| Hero | Editorial: featured carousel, “Ending soon,” latest listings feed |
| Cards | Wide ~3:2 image, title as headline, bid/time/comments — **low density** |
| VDP | Long page, horizontal gallery + lightbox, **sticky section nav**, sticky bottom bid bar |
| Trust | Community (1.1M users), public Q&A in comments, transparent copy |
| Mood | **Editorial serif headlines** + clean sans — magazine, not classifieds |

**Steal for Showroom**
1. Sticky section nav on VDP (Overview / Gallery / Specs / Contact)  
2. “Just listed” / “Recently added” temporal browse rails  
3. Public Q&A on listing (future — even for fixed price)  

**Avoid:** Auction UI unless auctions are in scope  

---

### 3.5 Hemmings

**URL:** https://hemmings.com  

| Dimension | Pattern |
|-----------|---------|
| Hero | Editorial + marketplace; auction / make offer / classified formats |
| Cards | Large photo, **format badge**, price or bid |
| Trust | 70-year brand, listing specialists, sold-listings research |

**Steal for Showroom**
1. “Just listed” / format badges if multi-format later  
2. Sold listings filter for market research (far future)  

**Avoid:** Print-era hierarchy on mobile  

---

### 3.6 Facebook Marketplace (Vehicles)

**URL:** facebook.com/marketplace/category/vehicles  

| Dimension | Pattern |
|-----------|---------|
| Feed | Infinite social feed, not search-first |
| VDP | **AI vehicle insights** panel (engine, safety, price comparison) |
| Trust | Seller profile, mutual friends — social, not automotive |

**Steal for Showroom**
1. AI-generated spec summary on VDP from VIN/data (you have VIN + NHTSA in plan)  
2. “Suggested questions to ask” in inquiry flow  

**Avoid:** Unreliable filter state; unstructured infinite feed  

---

### 3.7 Carwow

**URL:** https://carwow.co.uk  

| Dimension | Pattern |
|-----------|---------|
| Hero | Browse / Buy / Sell tri-mode; model configurator for new cars |
| Mood | **Fintech-adjacent** — bold headlines, generous whitespace |
| Trust | “Partners we trust,” ratings from platform transactions, **buyer controls contact** |

**Steal for Showroom**
1. Compare same make/model across showrooms (table or cards)  
2. Dealer rating from platform inquiries, not self-reported  
3. Dealer block on VDP: logo, bio snippet, link to storefront  

**Avoid:** Async email-only offer flow for a browse-first product  

---

### 3.8 Dealer.com (dealer website builder)

**URL:** https://dealer.com  

| Dimension | Pattern |
|-----------|---------|
| Homepage | Spotlight listings, search widget, promos |
| VDP | 15–20 photo gallery, **sticky mobile CTA** (Call / Enquire), finance inline |
| Merchandising | Featured / spotlight per dealer, similar vehicles cross-sell |

**Steal for Showroom**
1. **Spotlight listings** per showroom (dealer picks 3 featured)  
2. Similar vehicles on VDP  
3. Sticky mobile inquiry bar  

**Avoid:** Single-dealer assumptions — always show which showroom on marketplace VDP  

---

## 4. Category trends (2024–2026)

### Rising

- **AI + filters hybrid** — NL search layers on facets (CarGurus, AutoTrader, Meta, SPOTICAR)  
- **Intent categories** — lifestyle chips beat spec-only for early funnel  
- **Image-first grid** on desktop (AutoTrader eye-tracking)  
- **Deal/price badges** on cards (CarGurus, Cars.com)  
- **Sticky mobile CTA** on VDP (dealer sites standard)  
- **VDP section anchors** for long listings (BaT)  
- **Speed = conversion** — image optimization, skeleton states, no layout shift  

### Declining

- Pagination-only list views as primary mode (still OK for MVP with URL state)  
- Dealer-logo-heavy discovery cards  
- Filter-only search with no intent shortcuts  
- Haggle-first online flows for mass market  

### Showroom opportunity (multi-vendor niche)

Aggregators optimize for **scale and deal algorithms**. Showroom can win on:

- **Independent dealer identity** without cluttering discovery  
- **Direct inquiry** to the actual showroom (not lead resale)  
- **Custom domains** — dealer’s brand, platform’s search  
- **Simplicity** — small dealers don’t need Cars.com’s 30 filters  

---

## 5. Gap analysis: Showroom today

Current implementation (post design-system pass) vs category bar:

| Area | Today | Gap | Priority |
|------|-------|-----|----------|
| **Platform home** | Hero text + search + filter form + grid | Missing: intent chips, featured rail, trust strip, results title | P0 |
| **Listing card** | 4:3 image, title/price row, showroom badge | Price not dominant; no 16:9; no 2nd image; badge competes with vehicle | P0 |
| **Filters** | Full form always visible | No progressive disclosure; no active filter chips above grid | P1 |
| **VDP** | Gallery + sticky sidebar panel | No mobile sticky CTA; no section nav; no dealer trust block; no similar vehicles | P0 |
| **Storefront hero** | Logo + name + bio | No cover image; no featured row; weak brand moment | P1 |
| **Trust** | Footer links only | No platform stats, no “how inquiries work” | P1 |
| **Dashboard** | Sidebar + stat cards | No “next actions”; vehicle table is utilitarian | P2 |
| **Empty states** | Dashed border boxes | No illustration, no suggested actions | P2 |
| **Typography** | Single scale (~text-3xl hero) | Weak hierarchy — price should feel larger than title on cards | P1 |
| **Photography** | `object-cover` only | No lightbox; no carousel on cards | P1 |

### What’s already good (keep)

- Per-tenant `--tenant-accent` on storefront  
- URL-driven discovery filters (shareable, SEO-friendly)  
- Unified `VehicleListingCard` primitive  
- Sticky desktop spec panel on VDP  
- JSON-LD on vehicle detail  
- Design tokens + `design-system/showroom/` hierarchy  

---

## 6. Three design directions

Explore these as **mocks before coding**. Each is a coherent product personality.

---

### Direction A — **Editorial Showroom**

*Reference mix: Bring a Trailer + Hemmings + luxury dealer sites*

| Attribute | Spec |
|-----------|------|
| **Mood** | Magazine, collector, spacious, story-led |
| **Typography** | Display serif for headings (e.g. Playfair Display or Fraunces) + DM Sans body |
| **Color** | Warm neutrals, tenant accent only on storefront; platform uses charcoal + cream, red sparingly |
| **Home** | Large editorial hero, “Recently listed” story cards (3:2 images), light filter bar |
| **Cards** | Low density (2–3 per row max), big title, price secondary |
| **VDP** | Long scroll, sticky section nav, prose description prominent |
| **Best for** | Enthusiast/collectible dealers, low volume, high ASP |
| **Risk** | Feels wrong for mass-market volume search; slower scan |

**Signature moment:** Opening the storefront feels like arriving at a boutique lot, not a database.

---

### Direction B — **Confident Marketplace** ⭐ Recommended

*Reference mix: AutoTrader + Cars.com scan speed + Carwow spacing + Dealer.com VDP CTAs*

| Attribute | Spec |
|-----------|------|
| **Mood** | Professional, fast, trustworthy utility with breathing room |
| **Typography** | DM Sans only; aggressive scale steps (display 48px hero, 24px price on cards) |
| **Color** | Current slate + red tokens; add semantic green for “good deal” badge later |
| **Home** | Full landing structure (§2); search hero; intent chips; featured rail |
| **Cards** | 16:9 image, **price top-right or below image large**, title, year/mileage line, showroom name small |
| **VDP** | Gallery left, sticky panel right; **mobile bottom CTA**; dealer card below specs |
| **Best for** | Showroom’s actual product — multi-dealer search + independent storefronts |
| **Risk** | Can still feel generic if photography and hierarchy aren’t executed sharply |

**Signature moment:** Platform home feels like “I can find cars now”; VDP feels like “I trust this dealer enough to inquire.”

---

### Direction C — **Dense Deal Hunter**

*Reference mix: CarGurus + Cars.com faceted SRP*

| Attribute | Spec |
|-----------|------|
| **Mood** | Data-forward, comparison-shopping, badge-heavy |
| **Typography** | DM Sans, smaller base, tighter line heights |
| **Color** | Green/amber/red deal badges dominant; UI chrome recedes |
| **Home** | Search collapses to results quickly; left-rail filters on desktop |
| **Cards** | Compact rows on mobile; deal badge largest text after price |
| **VDP** | IMV-style chart placeholder, comparison table vs similar listings |
| **Best for** | US mass market, high inventory, deal-obsessed buyers |
| **Risk** | Needs pricing data you don’t have yet; cluttered for small inventory |

**Signature moment:** Every card answers “is this a good deal?” before you click.

---

### Direction comparison

| Criterion | A Editorial | B Confident ⭐ | C Dense |
|-----------|-------------|---------------|---------|
| Multi-vendor search | Medium | **High** | High |
| Small dealer friendly | High | **High** | Medium |
| Build cost (MVP) | High | **Medium** | High (data) |
| Distinctiveness | High | Medium | Low (looks like CarGurus) |
| Matches current stack | Medium | **High** | Medium |

---

## 7. Recommended direction

### Choose **Direction B — Confident Marketplace**

**Why**

1. Matches Showroom’s **two-sided model** (search + branded storefront) without requiring auction or IMV infrastructure.  
2. Extends current tokens and components — **evolution, not rewrite**.  
3. Competitors validate every major pattern (search hero, vehicle-first cards, VDP sticky CTA, deferred dealer branding).  
4. Direction A can be applied **per tenant** later via storefront theme presets without changing marketplace UX.  
5. Direction C requires deal intelligence you don’t have on day one.

### Non-negotiables for B

- Vehicle photo is always the largest element on a card  
- Price is the strongest typographic element after the photo  
- Showroom name is visible but **subordinate** on discovery  
- Red = primary action only (inquire, get started, search)  
- Mobile VDP has sticky inquire bar  

---

## 8. Signature screen blueprints

Wireframe descriptions for implementation. ASCII layout for clarity.

### 8.1 Platform home `/`

```
┌─────────────────────────────────────────────────────────────┐
│ [Showroom logo]                    Sign in | Get started    │  ← floating header (exists)
├─────────────────────────────────────────────────────────────┤
│  VEHICLE MARKETPLACE                                          │
│  Find your next car                                           │  ← display 40–48px
│  Search {423} vehicles from {12} independent showrooms        │  ← dynamic trust line
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🔍 Make          │ Model        │ [Search vehicles]  │    │  ← hero search (exists, enlarge)
│  └─────────────────────────────────────────────────────┘    │
│  Popular: Toyota  Honda  BMW  Under $20k  Low mileage       │  ← intent chips (partial)
├─────────────────────────────────────────────────────────────┤
│  Recently listed                              View all →    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                               │  ← NEW: horizontal rail
│  │card│ │card│ │card│ │card│                               │
├─────────────────────────────────────────────────────────────┤
│  Refine search (collapsible on mobile)                        │  ← filters: collapse default
│  Active: [Toyota ×] [Under $30k ×]  Clear all               │  ← NEW: filter chips
├─────────────────────────────────────────────────────────────┤
│  24 vehicles · Used Toyota near you                          │  ← human-readable title
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                               │
│  │card│ │card│ │card│ │card│                               │  ← 16:9 cards, price-led
├─────────────────────────────────────────────────────────────┤
│  ✓ Direct to dealer  ✓ Published inventory only  ✓ Free...   │  ← NEW: trust strip
│  Ready to sell?  [List your inventory]                       │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                       │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Listing card (discovery)

```
┌──────────────────────────┐
│ ┌──────────────────────┐ │
│ │      16:9 image      │ │  ← optional dots if carousel
│ │  [Just listed]       │ │  ← temporal badge, top-left
│ └──────────────────────┘ │
│  $24,500                 │  ← text-xl font-semibold tabular-nums
│  2019 Toyota Supra       │  ← text-base font-medium
│  42,000 mi · Automatic   │  ← text-sm muted
│  Bob's Motors            │  ← text-xs muted, link to /{slug}
└──────────────────────────┘
```

**Change from today:** Price moves **above** title; showroom badge moves to **bottom** as text link.

### 8.3 Vehicle detail `/{slug}/v/{id}`

```
Desktop:
┌────────────────────┬──────────────────┐
│ Gallery (16:9 main)  │ 2019 · Toyota    │
│ [thumb][thumb]...  │ Supra            │
│                    │ $24,500          │
│                    │ [spec grid]      │
│                    │ [Inquire]        │
│                    │ ─────────────    │
│                    │ Dealer card:     │  ← NEW
│                    │ logo, name, bio  │
│                    │ View storefront →│
├────────────────────┴──────────────────┤
│ Nav: Overview | Gallery | Specs | Dealer│  ← sticky section nav
│ Description...                          │
│ Similar vehicles →                        │  ← NEW row
└───────────────────────────────────────────┘

Mobile: sticky bottom [ Inquire about this vehicle ]
```

### 8.4 Tenant storefront `/{slug}`

```
┌─────────────────────────────────────────────────────────────┐
│ [logo] Dealer Name                        Inventory          │
│ ═══════════════════ accent stripe ═══════════════════════ │
├─────────────────────────────────────────────────────────────┤
│  [optional full-width cover image, 21:9, dark gradient]      │
│  Dealer Name (display)                                        │
│  Bio paragraph                                                │
│  12 vehicles available                                        │
├─────────────────────────────────────────────────────────────┤
│  Featured                                                     │  ← NEW: dealer spotlight (3)
│  ┌────┐ ┌────┐ ┌────┐                                       │
├─────────────────────────────────────────────────────────────┤
│  All inventory (grid)                                         │
└─────────────────────────────────────────────────────────────┘
```

### 8.5 Dashboard home

```
┌─────────────────────────────────────────────────────────────┐
│  Your showrooms                          [New showroom]      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                        │
│  │Published│ │ Drafts  │ │ Inquiries│  ← exists             │
│  │   12    │ │    3    │ │    2    │                        │
├─────────────────────────────────────────────────────────────┤
│  Next actions                                    ← NEW       │
│  • 2 unread inquiries at Bob's Motors →                      │
│  • 3 drafts ready to publish →                               │
├─────────────────────────────────────────────────────────────┤
│  Showroom cards...                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Typography & visual hierarchy

### Scale (Direction B)

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `display` | 2.5–3rem (40–48px) | 600 | Platform hero only |
| `title-lg` | 1.5rem (24px) | 600 | Storefront dealer name |
| `price-lg` | 1.25–1.5rem | 600 | Card price, VDP price |
| `title` | 1rem (16px) | 600 | Card vehicle name |
| `body` | 0.875–1rem | 400 | Descriptions |
| `caption` | 0.75rem | 500 | Mileage, showroom name, badges |
| `overline` | 0.6875rem | 600 | Section labels, uppercase tracking |

### Rules

- **One display size per page** — don’t use `text-4xl` everywhere  
- **Price always tabular-nums** (`font-variant-numeric: tabular-nums`)  
- **Max line length** 65ch for bio/description  
- Storefront can optionally add a **serif display** later as tenant theme — not on marketplace  

### Color usage (refine tokens)

| Role | Current | Refinement |
|------|---------|------------|
| Primary red | CTA buttons | Keep — max 1 red button per viewport |
| Brand slate | Wordmark | Keep |
| Success green | — | Add for “Just listed” / future deal badge |
| Muted text | `muted-foreground` | Use for showroom name on cards only |

---

## 10. Component upgrade spec

### `VehicleListingCard` v2

| Prop / behavior | Change |
|-----------------|--------|
| `aspect` | `16/9` default (configurable `4/3` for legacy) |
| Layout | Price → title → meta → dealer link |
| `dealerHref` | Link showroom name to `/{slug}` |
| `badge` | Temporal: “Just listed” (<7 days), not dealer name on image |
| `imageCount` | Dot indicators if multiple images (carousel phase 2) |
| Hover | Shadow + image brightness 105%, no card scale |

### `DiscoveryHeroSearch` v2

- Full-width on large screens (`max-w-3xl` → `max-w-4xl`)  
- Add optional **condition** chips: All | Used (New when you have new cars)  
- Intent chips row below (not just makes): Under $20k, Low mileage, SUV, Electric  

### `DiscoveryFilters` v2

- **Collapsed by default** on mobile; “Filters (3)” button opens sheet  
- Desktop: horizontal chip bar for active filters above grid  
- Sticky below header when scrolling results  

### `Gallery` v2

- Lightbox on main image click (dialog fullscreen)  
- Keyboard arrow navigation between images  
- Thumbnail strip: increase to 6 visible, scroll horizontal  

### `InquiryDialog` + mobile bar

- Extract trigger into `InquiryCTA` shared component  
- Mobile VDP: fixed bottom bar, same action  
- Add “Suggested questions” chips in dialog (from Facebook pattern)  

### New components

| Component | Purpose |
|-----------|---------|
| `TrustStrip` | 3–4 icons + short claims on `/` |
| `FeaturedListingsRail` | Horizontal scroll, server-fetched “recent” |
| `DealerTrustCard` | Logo, name, bio, link — VDP sidebar |
| `SimilarVehicles` | Same make or showroom, 4 cards |
| `FilterChipBar` | Active URL filters as dismissible chips |
| `NextActionsPanel` | Dashboard prioritized tasks |

---

## 11. Trust & content strategy

### Platform trust strip (copy examples)

- “Inquiries go **directly to the dealer** — we don’t sell your lead”  
- “**{n}** published vehicles from independent showrooms”  
- “Every listing from a **verified dealer account**”  
- “Search by make, model, price, and mileage”  

### Dealer trust card (VDP)

- Showroom logo + name  
- Bio first sentence  
- “View all {n} vehicles from this dealer” → `/{slug}`  
- Optional: “Member since {year}” from `showrooms.created_at`  

### Empty states (replace dashed boxes)

| Context | Message + action |
|---------|------------------|
| No search results | “No Toyota Supra under $30k. Try clearing price or browse all Toyota.” + chips |
| No platform inventory | “Be the first dealer on Showroom” + signup CTA |
| Storefront empty | “This showroom is stocking up. Browse all vehicles on the marketplace.” + link `/` |

### Microcopy upgrades

| Today | Better |
|-------|--------|
| “24 vehicles found” | “24 vehicles · 3 showrooms” |
| “Inquire about this vehicle” | “Message {DealerName}” |
| “No photo” | Branded silhouette illustration or blurred gradient placeholder |

---

## 12. Implementation roadmap

### Phase D1 — Marketplace feels designed (1–2 weeks)

- [ ] Platform home section structure (featured rail, trust strip, collapsible filters)  
- [ ] Listing card v2 (price-led, 16:9, dealer link)  
- [ ] Filter chip bar + human-readable results title  
- [ ] Trust strip component  
- [ ] Empty state copy + actions  

### Phase D2 — VDP converts (1 week)

- [ ] Mobile sticky inquire bar  
- [ ] DealerTrustCard on VDP  
- [ ] Gallery lightbox  
- [ ] Similar vehicles row (query: same make, exclude current)  
- [ ] Section nav (scroll spy optional)  

### Phase D3 — Storefront brand moment (3–5 days)

- [ ] Optional cover image in `theme_json` or showroom settings  
- [ ] Featured/spotlight vehicles (dealer picks up to 3)  
- [ ] Storefront hero typography scale-up  

### Phase D4 — Dashboard clarity (3–5 days)

- [ ] NextActionsPanel  
- [ ] Vehicle table: thumbnail column, status pills  
- [ ] Onboarding visual polish (progress steps)  

### Phase D5 — Delight & data (later)

- [ ] In-card image carousel  
- [ ] “Just listed” badge from `published_at`  
- [ ] Saved search / email alerts  
- [ ] Simple price percentile badge (needs aggregate data)  
- [ ] NL search → filters  
- [ ] Monthly payment estimate  

### Verification loop

After each phase:

1. `pnpm dev` → screenshot `/`, `/{slug}`, `/{slug}/v/{id}`, `/dashboard` at 375px and 1440px  
2. Run `ce-design-iterator` or manual compare against §8 blueprints  
3. Check pre-delivery checklist in `MASTER.md`  

---

## 13. Anti-patterns & avoid list

From competitors + Showroom constraints:

| Avoid | Why |
|-------|-----|
| Dealer logo on every discovery card | AutoTrader: hurts scan speed |
| Red used for prices | Reserves red for CTAs; price uses foreground or tenant accent on storefront |
| Infinite scroll without URL | Bad SEO, back button, sharing |
| 30+ filters visible at once | Overwhelms small inventory |
| Auction UI | Not in product scope |
| IMV badge without data | Erodes trust |
| Generic dashed empty states | Screams “unfinished” |
| Same visual weight for hero, filters, and grid | No hierarchy — feels like a form app |
| 3D / WebGL / parallax | Skill anti-pattern; poor a11y |

---

## 14. Sources

### Competitor & industry

| Source | Topic |
|--------|-------|
| [AutoTrader grid view insight](https://www.autotraderinsight-blog.co.uk/auto-trader-insight-blog/rolling-out-grid-view-for-desktop-search) | Desktop grid + eye-tracking |
| [AutoTrader VDP redesign](https://www.autotraderinsight-blog.co.uk/auto-trader-insight-blog/redesigning-the-product-page) | Product page 2025 |
| [AutoTrader search categories](https://www.autotraderinsight-blog.co.uk/auto-trader-insight-blog/introducing-new-search-categories) | Lifestyle intent |
| [CarGurus AI campaign](https://investors.cargurus.com/news-releases/news-release-details/cargurus-expands-big-deal-brand-campaign-introducing-ai-powered) | Discover + Dealership Mode |
| [BaT UX case study](https://www.alyssajohnes.com/bring-a-trailer) | Sticky nav, gallery |
| [Facebook Marketplace 2025](https://about.fb.com/news/2025/11/facebook-marketplace-gets-a-glow-up/) | AI insights |
| [Dealer.com NADA 2025](https://www.dealer.com/resources/nada-2025-a-sneak-peek-into-new-enhancements/) | VDP/SRP 2025 |
| [Carwow](https://www.carwow.co.uk) | Buyer-controlled dealer model |
| [UK marketplace comparison (2026)](https://www.thecarexpert.co.uk/best-websites-buying-a-car/) | Landscape |

### Internal

| File | Role |
|------|------|
| [`design-system/showroom/MASTER.md`](./showroom/MASTER.md) | Tokens + component rules |
| [`design-system/showroom/pages/storefront.md`](./showroom/pages/storefront.md) | Tenant accent overrides |
| [`design-system/showroom/pages/dashboard.md`](./showroom/pages/dashboard.md) | Admin density overrides |
| [`PLAN.md`](../../PLAN.md) | Product architecture |
| [`PROGRESS.md`](../../PROGRESS.md) | Build status |

---

## Next step

**Pick Direction B** (recommended) or A/C, then implement **Phase D1** starting with:

1. `VehicleListingCard` v2 (price-led layout)  
2. Platform home sections (featured rail + trust strip)  
3. Filter chip bar  

Say which direction you want and whether to start D1 implementation — the research doc is the spec.
