import { isEdgeConfigWriteConfigured } from '@/lib/vercel/edge-config'
import { isVercelConfigured } from '@/lib/vercel/domains'

export function isCustomDomainsConfigured(): boolean {
  return isVercelConfigured() && isEdgeConfigWriteConfigured()
}

export const CUSTOM_DOMAINS_DISABLED_MESSAGE =
  'Custom domains require VERCEL_TOKEN, VERCEL_PROJECT_ID, and EDGE_CONFIG_ID on this deployment.'
