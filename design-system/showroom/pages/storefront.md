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

- Full-bleed **21:9** hero (`StorefrontHero`) — cover image with dark gradient, or tenant-accent gradient fallback with dot texture
- Accent stripe at hero bottom; floating header with matching accent rule
- Dealer name at display scale (4xl–6xl); bio and inventory count pill over hero
- Auto **Recently added** row (3 cards) when 4+ vehicles and no dealer-picked featured set

## Chrome

- Floating contained header (matches platform nav pattern) with initial avatar fallback when no logo
- Footer with dealer bio snippet, marketplace link, accent bottom stripe
