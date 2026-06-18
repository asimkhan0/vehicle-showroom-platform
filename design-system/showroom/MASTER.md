# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/showroom/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Showroom
**Style:** Swiss Modernism 2.0 + Premium Minimal
**Category:** Multi-vendor vehicle marketplace

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Brand (slate) | `#1E293B` | `--brand` |
| Secondary | `#334155` | `--secondary-foreground` |
| CTA / Primary | `#DC2626` | `--primary` |
| Background | `#F8FAFC` | `--background` |
| Text | `#0F172A` | `--foreground` |

**Notes:** Premium slate surfaces + action red for primary CTAs. Tenant storefronts use `--tenant-accent` per showroom.

### Typography

- **Font:** DM Sans (via `next/font/google`)
- **Mono:** Geist Mono
- **Mood:** premium, modern, clean, sophisticated

### Layout

- Max content width: `max-w-6xl` (marketplace/storefront), `max-w-7xl` (dashboard)
- Grid: 12-column mental model, 8px spacing base
- Radius: `0.5rem` (`--radius`)
- Floating navbars with edge padding (`top-4`, contained card style)

### Interaction

- Hover: color/shadow transitions `150–300ms` — **no layout-shifting scale**
- Image cards: brightness lift on hover (`brightness-105`), shadow on card — no scale transform
- `cursor-pointer` on all interactive elements
- Visible focus rings (`ring-2 ring-ring ring-offset-2`)
- `prefers-reduced-motion` respected globally

### Typography utilities (Direction B)

| Class | Use |
|-------|-----|
| `text-display` | Platform hero headline (one per page) |
| `text-title-lg` | Storefront dealer name |
| `text-price-lg` | VDP price |
| `text-overline` | Section labels, uppercase tracking |

### Icons

- Lucide SVG only — never emoji as icons

---

## Component Specs

### Vehicle listing card

- **16:9** image (`aspect-video`), rounded-xl border, shadow on hover
- Layout: **price → title → meta → dealer link** (price is strongest text after photo)
- Price: `text-xl font-semibold tabular-nums`
- Mileage with Gauge icon; dealer name as subordinate text link (not on image)
- Temporal badge only on image ("Just listed") — not dealer name
- Missing photo: branded gradient placeholder (`VehicleImagePlaceholder`)

### Buttons

- Primary: `bg-primary` (action red), white text
- Outline/Ghost: slate borders and muted hover

### Dashboard

- Left sidebar nav on showroom routes (Vehicles, Inquiries, Domains, Settings)
- KPI stat cards on dashboard home
- Card-wrapped tables

---

## Page Overrides

| Page | File | Key deviation |
|------|------|---------------|
| Storefront | `pages/storefront.md` | Per-tenant `--tenant-accent` for price, CTA, header stripe |
| Dashboard | `pages/dashboard.md` | Data-dense tables, sidebar shell, stat cards |

---

## Anti-Patterns (Do NOT Use)

- ❌ 3D / WebGL / hyperrealism (poor perf, a11y)
- ❌ Emojis as icons
- ❌ Layout-shifting hover scale on cards
- ❌ Low-contrast muted body text (use `text-muted-foreground` minimum)
- ❌ Hardcoded `neutral-*` — use semantic tokens

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from Lucide
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
