import { resolveTenant } from '@/lib/tenant'

// Relative vehicle link — resolves correctly on both subdomain (/) and
// platform path (/{slug}) storefront URLs.
export function vehicleHref(vehicleId: string): string {
  return `v/${vehicleId}`
}

// Inventory home link — subdomain visitors see / in the browser; platform
// path visitors need the slug prefix.
export function inventoryHref(slug: string, host: string | null): string {
  const tenant = resolveTenant(host)
  if (tenant.kind === 'tenant' && tenant.via === 'subdomain') return '/'
  return `/${slug}`
}
