// Resolves an incoming request's host to a tenant slug.
//
// Subdomain routing: {slug}.platform-host → slug.
// Custom domains: hostname → slug via Vercel Edge Config.

import { RESERVED_SLUGS } from '@/lib/reserved-slugs'
import { lookupCustomDomainSlug } from '@/lib/vercel/edge-config'

const PLATFORM_HOST = (process.env.NEXT_PUBLIC_PLATFORM_HOST ?? 'localhost:3000')
  .split(':')[0]
  .toLowerCase()

export type TenantResolution =
  | { kind: 'platform' }
  | { kind: 'tenant'; slug: string; via: 'subdomain' | 'custom-domain' }

function hostnameFromHost(host: string): string {
  return host.toLowerCase().split(':')[0] ?? host.toLowerCase()
}

export async function resolveTenant(host: string | null): Promise<TenantResolution> {
  if (!host) return { kind: 'platform' }

  const hostname = hostnameFromHost(host)

  if (hostname === PLATFORM_HOST || hostname === `www.${PLATFORM_HOST}`) {
    return { kind: 'platform' }
  }

  if (hostname.endsWith(`.${PLATFORM_HOST}`)) {
    const sub = hostname.slice(0, -1 - PLATFORM_HOST.length)
    if (RESERVED_SLUGS.has(sub) || sub.includes('.')) return { kind: 'platform' }
    return { kind: 'tenant', slug: sub, via: 'subdomain' }
  }

  try {
    const slug = await lookupCustomDomainSlug(hostname)
    if (slug) return { kind: 'tenant', slug, via: 'custom-domain' }
  } catch {
    // Edge Config unavailable — fall through to platform routes.
  }

  return { kind: 'platform' }
}
