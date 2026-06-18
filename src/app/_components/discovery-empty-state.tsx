import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import {
  discoveryFiltersToSearchParams,
  type DiscoveryFilters,
} from '@/app/_lib/discovery/search-params'
import { cn } from '@/lib/utils'

export function DiscoveryEmptyState({
  filtered,
  filters,
}: {
  filtered: boolean
  filters: DiscoveryFilters
}) {
  if (!filtered) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">Be the first dealer on Showroom</p>
        <p className="mt-2 text-sm text-muted-foreground">
          When vendors publish vehicles, they will appear here for buyers to discover.
        </p>
        <Link href="/signup" className={cn(buttonVariants(), 'mt-6 inline-flex')}>
          List your inventory
        </Link>
      </div>
    )
  }

  const makeOnlyParams = filters.make
    ? discoveryFiltersToSearchParams({ make: filters.make, page: 1 }).toString()
    : null

  return (
    <div className="rounded-xl border border-border bg-muted/30 px-6 py-16 text-center">
      <p className="text-base font-medium text-foreground">No vehicles match your search</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Try clearing price or mileage filters, or browse a wider selection.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          Clear all filters
        </Link>
        {makeOnlyParams && (
          <Link
            href={`/?${makeOnlyParams}`}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Browse all {filters.make}
          </Link>
        )}
      </div>
    </div>
  )
}
