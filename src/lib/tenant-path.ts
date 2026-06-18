import { resolveTenant } from '@/lib/tenant'

// Relative vehicle link — resolves correctly on both subdomain (/) and
// platform path (/{slug}) storefront URLs.
export function vehicleHref(vehicleId: string): string {
  return `v/${vehicleId}`
}

// Inventory home link — subdomain visitors see / in the browser; platform
// path visitors need the slug prefix.
export async function inventoryHref(slug: string, host: string | null): Promise<string> {
  const tenant = await resolveTenant(host)
  // Subdomain and custom-domain visitors see / in the browser; only platform
  // path access (localhost:3000/{slug}) needs the slug prefix.
  if (tenant.kind === 'tenant') return '/'
  return `/${slug}`
}
