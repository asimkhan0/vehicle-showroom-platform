import 'server-only'

import { mapVercelError, requireVercelConfig, vercelFetch, VercelApiError } from '@/lib/vercel/config'
import { normalizeHostname } from '@/lib/validation'
import type { DnsRecord } from '@/lib/domains/types'

export type { DnsRecord } from '@/lib/domains/types'

type VercelVerification = {
  type: string
  domain: string
  value: string
  reason?: string
}

type AddDomainResponse = {
  name: string
  verified: boolean
  verification?: VercelVerification[]
}

type DomainConfigResponse = {
  misconfigured: boolean
  configuredBy?: string | null
}

type ProjectDomainResponse = {
  name: string
  verified: boolean
  verification?: VercelVerification[]
}

export function verificationToDnsRecords(verification: VercelVerification[] | undefined): DnsRecord[] {
  if (!verification?.length) return []
  return verification.map((v) => ({
    type: v.type,
    name: v.domain,
    value: v.value,
    reason: v.reason,
  }))
}

export async function addProjectDomain(rawHostname: string) {
  const hostname = normalizeHostname(rawHostname)
  const { projectId } = requireVercelConfig()

  try {
    const data = await vercelFetch<AddDomainResponse>(`/v9/projects/${projectId}/domains`, {
      method: 'POST',
      body: JSON.stringify({ name: hostname }),
    })

    return {
      hostname: data.name,
      verified: data.verified,
      dnsRecords: verificationToDnsRecords(data.verification),
    }
  } catch (error) {
    throw new Error(mapVercelError(error))
  }
}

export async function getDomainConfig(rawHostname: string) {
  const hostname = normalizeHostname(rawHostname)

  try {
    const data = await vercelFetch<DomainConfigResponse>(`/v6/domains/${encodeURIComponent(hostname)}/config`)
    return {
      hostname,
      misconfigured: data.misconfigured,
      configuredBy: data.configuredBy ?? null,
      verified: !data.misconfigured,
    }
  } catch (error) {
    throw new Error(mapVercelError(error))
  }
}

export async function getProjectDomain(rawHostname: string) {
  const hostname = normalizeHostname(rawHostname)
  const { projectId } = requireVercelConfig()

  try {
    const data = await vercelFetch<ProjectDomainResponse>(
      `/v9/projects/${projectId}/domains/${encodeURIComponent(hostname)}`,
    )
    return {
      hostname: data.name,
      verified: data.verified,
      dnsRecords: verificationToDnsRecords(data.verification),
    }
  } catch (error) {
    if (error instanceof VercelApiError && error.status === 404) return null
    throw new Error(mapVercelError(error))
  }
}

export async function removeProjectDomain(rawHostname: string) {
  const hostname = normalizeHostname(rawHostname)
  const { projectId } = requireVercelConfig()

  try {
    await vercelFetch(`/v9/projects/${projectId}/domains/${encodeURIComponent(hostname)}`, {
      method: 'DELETE',
    })
  } catch (error) {
    if (error instanceof VercelApiError && error.status === 404) return
    throw new Error(mapVercelError(error))
  }
}

export function isVercelConfigured(): boolean {
  return Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID)
}
