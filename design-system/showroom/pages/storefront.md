# Storefront Page Overrides

> Overrides `MASTER.md` for tenant storefront routes `/(storefront)/[slug]/*`

## Tenant branding

- Each showroom sets `--tenant-accent` and `--tenant-accent-ink` in layout from `theme_json.accent`
- Default accent: `#1e293b` (slate-800) if unset
- **Never** override tenant accent with platform brand red

## Use tenant accent for

- Header bottom stripe
- Vehicle price on cards and detail panel
- Inquiry CTA button
- Active gallery thumbnail border
- Hover links ("← All inventory", nav)

## Inherit from master

- DM Sans typography
- Card border/radius/shadow patterns
- Vehicle listing card structure (via shared `VehicleListingCard`)
- Spacing and max-width (`max-w-6xl`)

## Hero

- Subtle accent gradient wash behind hero content
- Logo with accent-tinted ring
- Inventory count as pill badge
