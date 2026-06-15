// Resolves an incoming request's host to a tenant slug.
//
// Day 1: subdomain routing only ({slug}.platform-host → slug).
// Phase 2: custom-domain lookup against an edge cache (Edge Config / Upstash)
// keyed by hostname.

import { RESERVED_SLUGS } from '@/lib/reserved-slugs'

const PLATFORM_HOST = process.env.NEXT_PUBLIC_PLATFORM_HOST ?? 'localhost:3000'

export type TenantResolution =
  | { kind: 'platform' }
  | { kind: 'tenant'; slug: string; via: 'subdomain' | 'custom-domain' }

export function resolveTenant(host: string | null): TenantResolution {
  if (!host) return { kind: 'platform' }

  // Strip port for comparison; keep it in PLATFORM_HOST for local dev.
  const platformHost = PLATFORM_HOST.toLowerCase()
  const hostLower = host.toLowerCase()

  if (hostLower === platformHost || hostLower === `www.${platformHost}`) {
    return { kind: 'platform' }
  }

  if (hostLower.endsWith(`.${platformHost}`)) {
    const sub = hostLower.slice(0, -1 - platformHost.length)
    if (RESERVED_SLUGS.has(sub) || sub.includes('.')) return { kind: 'platform' }
    return { kind: 'tenant', slug: sub, via: 'subdomain' }
  }

  // Custom-domain branch — Phase 2 wires the actual lookup.
  // For now, treat unknown hosts as platform so the marketing site renders.
  return { kind: 'platform' }
}
