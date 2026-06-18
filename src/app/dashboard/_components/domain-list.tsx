'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import type { DomainState } from '../_actions/domains'
import type { DnsRecord } from '@/lib/domains/types'

export type DomainRow = {
  id: string
  hostname: string
  status: 'pending' | 'verifying' | 'active' | 'failed'
  verified_at: string | null
  dns_records: DnsRecord[] | null
}

const STATUS_LABEL: Record<DomainRow['status'], string> = {
  pending: 'Pending DNS',
  verifying: 'Verifying',
  active: 'Active',
  failed: 'Failed',
}

const STATUS_CLASS: Record<DomainRow['status'], string> = {
  pending: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  verifying: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
  active: 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200',
  failed: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200',
}

type Props = {
  domains: DomainRow[]
  verifyAction: (state: DomainState, formData: FormData) => Promise<DomainState>
  removeAction: (state: DomainState, formData: FormData) => Promise<DomainState>
}

function DnsRecordsTable({ records }: { records: DnsRecord[] }) {
  if (!records.length) return null

  return (
    <div className="mt-3 overflow-x-auto rounded border text-sm">
      <table className="w-full min-w-[28rem]">
        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900">
          <tr>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={`${r.type}-${r.name}-${i}`} className="border-t">
              <td className="px-3 py-2 font-mono text-xs">{r.type}</td>
              <td className="px-3 py-2 font-mono text-xs break-all">{r.name}</td>
              <td className="px-3 py-2 font-mono text-xs break-all">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DomainActions({
  domain,
  verifyAction,
  removeAction,
}: {
  domain: DomainRow
  verifyAction: Props['verifyAction']
  removeAction: Props['removeAction']
}) {
  const [verifyState, verifyFormAction, verifyPending] = useActionState(verifyAction, {})
  const [removeState, removeFormAction, removePending] = useActionState(removeAction, {})

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {domain.status !== 'active' && (
        <form action={verifyFormAction}>
          <input type="hidden" name="domainId" value={domain.id} />
          <Button type="submit" variant="outline" size="sm" disabled={verifyPending}>
            {verifyPending ? 'Checking…' : 'Re-check DNS'}
          </Button>
        </form>
      )}
      <form action={removeFormAction}>
        <input type="hidden" name="domainId" value={domain.id} />
        <Button type="submit" variant="outline" size="sm" disabled={removePending}>
          {removePending ? 'Removing…' : 'Remove'}
        </Button>
      </form>
      {(verifyState.error || removeState.error) && (
        <p role="alert" className="w-full text-sm text-destructive">
          {verifyState.error ?? removeState.error}
        </p>
      )}
      {(verifyState.success || removeState.success) && (
        <p role="status" className="w-full text-sm text-green-700 dark:text-green-400">
          {verifyState.success ?? removeState.success}
        </p>
      )}
    </div>
  )
}

export function DomainList({ domains, verifyAction, removeAction }: Props) {
  if (domains.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-neutral-500">
        No custom domains yet. Add one above to serve your showroom on your own hostname.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {domains.map((domain) => (
        <article key={domain.id} className="rounded-lg border bg-white p-5 dark:bg-neutral-900">
          <header className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <h3 className="font-medium">{domain.hostname}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[domain.status]}`}
              >
                {STATUS_LABEL[domain.status]}
              </span>
            </div>
            {domain.status === 'active' && (
              <a
                href={`https://${domain.hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-500 hover:underline"
              >
                Visit storefront →
              </a>
            )}
          </header>

          {domain.status !== 'active' && domain.dns_records && (
            <>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                Add these DNS records at your registrar, then click Re-check DNS.
              </p>
              <DnsRecordsTable records={domain.dns_records} />
            </>
          )}

          <DomainActions domain={domain} verifyAction={verifyAction} removeAction={removeAction} />
        </article>
      ))}
    </div>
  )
}
