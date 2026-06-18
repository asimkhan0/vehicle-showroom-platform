'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import type { Json } from '@/lib/supabase/database.types'
import { hostnameSchema } from '@/lib/validation'
import {
  CUSTOM_DOMAINS_DISABLED_MESSAGE,
  isCustomDomainsConfigured,
} from '@/lib/domains/config'
import {
  addProjectDomain,
  removeProjectDomain,
} from '@/lib/vercel/domains'
import type { DnsRecord } from '@/lib/domains/types'
import { runDomainVerification } from '@/lib/domains/verify'
import { removeTenantHostname, syncTenantHostname } from '@/lib/vercel/edge-config'

export type DomainState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: string
}

async function requireOwnedShowroom(showroomId: string) {
  const { supabase, user } = await requireUser()
  const { data: showroom } = await supabase
    .from('showrooms')
    .select('id, slug, owner_user_id')
    .eq('id', showroomId)
    .maybeSingle()

  if (!showroom || showroom.owner_user_id !== user.id) {
    throw new Error('Showroom not found')
  }

  return { supabase, showroom }
}

async function requireOwnedDomain(domainId: string) {
  const { supabase, user } = await requireUser()
  const { data: domain } = await supabase
    .from('domains')
    .select('id, hostname, showroom_id, status')
    .eq('id', domainId)
    .maybeSingle()

  if (!domain) throw new Error('Domain not found')

  const { data: showroom } = await supabase
    .from('showrooms')
    .select('slug, owner_user_id')
    .eq('id', domain.showroom_id)
    .maybeSingle()

  if (!showroom || showroom.owner_user_id !== user.id) {
    throw new Error('Domain not found')
  }

  return { supabase, domain: { ...domain, slug: showroom.slug } }
}

function dnsRecordsToJson(records: DnsRecord[]): Json {
  return records as unknown as Json
}

export async function addDomain(_: DomainState, formData: FormData): Promise<DomainState> {
  const showroomId = String(formData.get('showroomId') ?? '')
  if (!showroomId) return { error: 'Missing showroom id' }

  const parsed = hostnameSchema.safeParse(formData.get('hostname'))
  if (!parsed.success) {
    return { fieldErrors: { hostname: parsed.error.issues[0]?.message ?? 'Invalid domain' } }
  }

  if (!isCustomDomainsConfigured()) {
    return { error: CUSTOM_DOMAINS_DISABLED_MESSAGE }
  }

  try {
    const { supabase, showroom } = await requireOwnedShowroom(showroomId)

    const vercel = await addProjectDomain(parsed.data)
    let status: 'pending' | 'verifying' | 'active' = vercel.verified ? 'active' : 'pending'
    let verifiedAt: string | null = null

    if (vercel.verified) {
      try {
        await syncTenantHostname(vercel.hostname, showroom.slug)
        verifiedAt = new Date().toISOString()
      } catch (error) {
        status = 'verifying'
        const detail = error instanceof Error ? error.message : 'routing sync failed'
        const { error: insertError } = await supabase.from('domains').insert({
          showroom_id: showroomId,
          hostname: vercel.hostname,
          status,
          verified_at: null,
          vercel_domain_id: vercel.hostname,
          dns_records: dnsRecordsToJson(vercel.dnsRecords),
        })

        if (insertError) {
          if (insertError.code === '23505') {
            return { fieldErrors: { hostname: 'That domain is already connected to a showroom' } }
          }
          return { error: insertError.message }
        }

        revalidatePath(`/dashboard/${showroomId}/domains`)
        return {
          error: `Domain added on Vercel but routing sync failed: ${detail}. Use Re-check DNS.`,
        }
      }
    }

    const { error } = await supabase.from('domains').insert({
      showroom_id: showroomId,
      hostname: vercel.hostname,
      status,
      verified_at: verifiedAt,
      vercel_domain_id: vercel.hostname,
      dns_records: dnsRecordsToJson(vercel.dnsRecords),
    })

    if (error) {
      if (error.code === '23505') {
        return { fieldErrors: { hostname: 'That domain is already connected to a showroom' } }
      }
      return { error: error.message }
    }

    revalidatePath(`/dashboard/${showroomId}/domains`)
    return {
      success:
        status === 'active' ? 'Domain connected' : 'Domain added — configure DNS below',
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to add domain' }
  }
}

export async function verifyDomain(domainId: string): Promise<DomainState> {
  if (!isCustomDomainsConfigured()) {
    return { error: CUSTOM_DOMAINS_DISABLED_MESSAGE }
  }

  try {
    const { supabase } = await requireOwnedDomain(domainId)
    const result = await runDomainVerification(supabase, domainId)
    revalidatePath(`/dashboard/${result.showroomId}/domains`)
    if (result.verified) return { success: result.message }
    return { error: `${result.message} — check the records below` }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Verification failed' }
  }
}

export async function verifyPendingDomains(showroomId: string) {
  if (!isCustomDomainsConfigured()) return

  const { supabase } = await requireOwnedShowroom(showroomId)
  const { data: pending } = await supabase
    .from('domains')
    .select('id')
    .eq('showroom_id', showroomId)
    .in('status', ['pending', 'verifying'])

  for (const row of pending ?? []) {
    await verifyDomain(row.id)
  }
}

export async function removeDomain(_: DomainState, formData: FormData): Promise<DomainState> {
  const domainId = String(formData.get('domainId') ?? '')
  if (!domainId) return { error: 'Missing domain id' }

  try {
    const { supabase, domain } = await requireOwnedDomain(domainId)

    if (isCustomDomainsConfigured()) {
      await removeProjectDomain(domain.hostname).catch(() => undefined)
      await removeTenantHostname(domain.hostname).catch(() => undefined)
    }

    const { error } = await supabase.from('domains').delete().eq('id', domainId)
    if (error) return { error: error.message }

    revalidatePath(`/dashboard/${domain.showroom_id}/domains`)
    return { success: 'Domain removed' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to remove domain' }
  }
}

export async function syncActiveDomainsForShowroom(showroomId: string, slug: string) {
  if (!isCustomDomainsConfigured()) return

  const { supabase } = await requireUser()
  const { data: domains } = await supabase
    .from('domains')
    .select('hostname')
    .eq('showroom_id', showroomId)
    .eq('status', 'active')

  for (const d of domains ?? []) {
    await syncTenantHostname(d.hostname, slug)
  }
}

const verifyFormSchema = z.object({
  domainId: z.string().uuid(),
})

export async function verifyDomainAction(_: DomainState, formData: FormData): Promise<DomainState> {
  const parsed = verifyFormSchema.safeParse({ domainId: formData.get('domainId') })
  if (!parsed.success) return { error: 'Invalid domain' }
  return verifyDomain(parsed.data.domainId)
}
