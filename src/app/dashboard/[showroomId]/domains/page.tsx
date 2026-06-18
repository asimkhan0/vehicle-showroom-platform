import { requireUser } from '@/lib/auth'
import {
  CUSTOM_DOMAINS_DISABLED_MESSAGE,
  isCustomDomainsConfigured,
} from '@/lib/domains/config'
import type { DnsRecord } from '@/lib/domains/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddDomainForm } from '../../_components/add-domain-form'
import { DomainList, type DomainRow } from '../../_components/domain-list'
import {
  addDomain,
  removeDomain,
  verifyDomainAction,
  verifyPendingDomains,
} from '../../_actions/domains'

export default async function DomainsPage({
  params,
}: {
  params: Promise<{ showroomId: string }>
}) {
  const { showroomId } = await params
  const { supabase } = await requireUser()

  if (isCustomDomainsConfigured()) {
    await verifyPendingDomains(showroomId)
  }

  const { data } = await supabase
    .from('domains')
    .select('id, hostname, status, verified_at, dns_records')
    .eq('showroom_id', showroomId)
    .order('created_at', { ascending: false })

  const domains: DomainRow[] = (data ?? []).map((d) => ({
    id: d.id,
    hostname: d.hostname,
    status: d.status,
    verified_at: d.verified_at,
    dns_records: (d.dns_records as DnsRecord[] | null) ?? null,
  }))

  return (
    <div className="space-y-6">
      {!isCustomDomainsConfigured() && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          {CUSTOM_DOMAINS_DISABLED_MESSAGE}
        </div>
      )}

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Add custom domain</CardTitle>
        </CardHeader>
        <CardContent>
          <AddDomainForm action={addDomain} showroomId={showroomId} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-medium">Your domains</h2>
        <DomainList
          domains={domains}
          verifyAction={verifyDomainAction}
          removeAction={removeDomain}
        />
      </div>
    </div>
  )
}
