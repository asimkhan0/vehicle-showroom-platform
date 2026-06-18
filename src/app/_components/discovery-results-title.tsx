import type { DiscoveryFilters } from '@/app/_lib/discovery/search-params'

function formatDollars(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function buildTitle(filters: DiscoveryFilters, total: number): string {
  const parts: string[] = [`${total} vehicle${total === 1 ? '' : 's'}`]

  const descriptors: string[] = []
  if (filters.make) descriptors.push(filters.make)
  if (filters.model) descriptors.push(filters.model)
  if (filters.year != null) descriptors.unshift(String(filters.year))
  if (filters.priceMax != null) descriptors.push(`under ${formatDollars(filters.priceMax)}`)
  if (filters.priceMin != null && filters.priceMax == null)
    descriptors.push(`from ${formatDollars(filters.priceMin)}`)
  if (filters.mileageMax != null)
    descriptors.push(`under ${filters.mileageMax.toLocaleString()} mi`)

  if (descriptors.length > 0) {
    parts.push(`· ${descriptors.join(' ')}`)
  }

  return parts.join(' ')
}

export function DiscoveryResultsTitle({
  filters,
  total,
}: {
  filters: DiscoveryFilters
  total: number
}) {
  if (total === 0) return null

  return (
    <h2 className="mb-6 text-base font-medium text-foreground">
      {buildTitle(filters, total)}
    </h2>
  )
}
