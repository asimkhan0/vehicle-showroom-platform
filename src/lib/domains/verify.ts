import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Json } from '@/lib/supabase/database.types'
import type { DnsRecord } from '@/lib/domains/types'
import { getDomainConfig, getProjectDomain } from '@/lib/vercel/domains'
import { syncTenantHostname } from '@/lib/vercel/edge-config'

function dnsRecordsToJson(records: DnsRecord[]): Json {
  return records as unknown as Json
}

export type VerifyDomainResult = {
  verified: boolean
  showroomId: string
  message: string
}

export async function runDomainVerification(
  supabase: SupabaseClient<Database>,
  domainId: string,
): Promise<VerifyDomainResult> {
  const { data: domain } = await supabase
    .from('domains')
    .select('id, hostname, showroom_id')
    .eq('id', domainId)
    .maybeSingle()

  if (!domain) throw new Error('Domain not found')

  const { data: showroom } = await supabase
    .from('showrooms')
    .select('slug')
    .eq('id', domain.showroom_id)
    .maybeSingle()

  if (!showroom) throw new Error('Showroom not found')

  const config = await getDomainConfig(domain.hostname)
  const projectDomain = await getProjectDomain(domain.hostname)
  const dnsRecords = projectDomain?.dnsRecords ?? []

  if (config.verified) {
    try {
      await syncTenantHostname(domain.hostname, showroom.slug)
    } catch (error) {
      await supabase
        .from('domains')
        .update({
          status: 'verifying',
          dns_records: dnsRecords.length ? dnsRecordsToJson(dnsRecords) : undefined,
        })
        .eq('id', domainId)

      const detail = error instanceof Error ? error.message : 'routing sync failed'
      throw new Error(`DNS is verified but routing could not be updated: ${detail}`)
    }

    await supabase
      .from('domains')
      .update({
        status: 'active',
        verified_at: new Date().toISOString(),
        dns_records: dnsRecords.length ? dnsRecordsToJson(dnsRecords) : undefined,
      })
      .eq('id', domainId)

    return {
      verified: true,
      showroomId: domain.showroom_id,
      message: 'Domain verified',
    }
  }

  await supabase
    .from('domains')
    .update({
      status: 'verifying',
      dns_records: dnsRecords.length ? dnsRecordsToJson(dnsRecords) : undefined,
    })
    .eq('id', domainId)

  return {
    verified: false,
    showroomId: domain.showroom_id,
    message: 'DNS is not configured yet',
  }
}
