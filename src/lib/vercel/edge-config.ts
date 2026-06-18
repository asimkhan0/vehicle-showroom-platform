import 'server-only'

import { get as edgeGet } from '@vercel/edge-config'

import { normalizeHostname } from '@/lib/validation'
import { vercelFetch } from '@/lib/vercel/config'

const TENANT_PREFIX = 'tenant:'

export function tenantEdgeKey(hostname: string): string {
  return `${TENANT_PREFIX}${normalizeHostname(hostname)}`
}

export function stripTenantEdgeKey(key: string): string | null {
  if (!key.startsWith(TENANT_PREFIX)) return null
  return key.slice(TENANT_PREFIX.length)
}

export async function lookupCustomDomainSlug(host: string | null): Promise<string | null> {
  if (!host || !process.env.EDGE_CONFIG) return null

  const hostname = normalizeHostname(host)
  try {
    const slug = await edgeGet<string>(tenantEdgeKey(hostname))
    return typeof slug === 'string' && slug.length > 0 ? slug : null
  } catch {
    return null
  }
}

function requireEdgeConfigId(): string {
  const edgeConfigId = process.env.EDGE_CONFIG_ID
  if (!edgeConfigId) {
    throw new Error('EDGE_CONFIG_ID must be set to sync custom domain routing')
  }
  return edgeConfigId
}

async function patchEdgeConfigItems(
  items: Array<
    | { operation: 'upsert'; key: string; value: string }
    | { operation: 'delete'; key: string }
  >,
) {
  const edgeConfigId = requireEdgeConfigId()
  await vercelFetch(`/v1/edge-config/${edgeConfigId}/items`, {
    method: 'PATCH',
    body: JSON.stringify({ items }),
  })
}

export async function syncTenantHostname(hostname: string, slug: string) {
  await patchEdgeConfigItems([
    { operation: 'upsert', key: tenantEdgeKey(hostname), value: slug },
  ])
}

export async function removeTenantHostname(hostname: string) {
  await patchEdgeConfigItems([{ operation: 'delete', key: tenantEdgeKey(hostname) }])
}

export function isEdgeConfigWriteConfigured(): boolean {
  return Boolean(process.env.VERCEL_TOKEN && process.env.EDGE_CONFIG_ID)
}
