# Dashboard Page Overrides

> Overrides `MASTER.md` for `/dashboard/*` routes

## Layout

- Sticky top header with brand wordmark, showroom switcher (when multiple), user email, sign out
- Left sidebar on `/dashboard/[showroomId]/*` with mobile Sheet menu
- Main content: `max-w-7xl`

## Data density

- KPI stat cards: Published, Drafts, Unread inquiries (dashboard home)
- Tables wrapped in `Card` with row hover
- Page headers via shared `PageHeader` (title + description + action)

## Navigation items

1. Vehicles
2. Inquiries
3. Domains
4. Settings

## Auth pages

- Centered card on `bg-background`
- Showroom wordmark link above form
- Full-width red primary submit button

## Colors

- Use platform tokens (`primary` = action red, `brand` = slate wordmark)
- Do not use per-tenant accent in dashboard
