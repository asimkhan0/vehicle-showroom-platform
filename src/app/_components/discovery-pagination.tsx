import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  discoveryFiltersToSearchParams,
  type DiscoveryFilters,
} from '@/app/_lib/discovery/search-params'

export function DiscoveryPagination({
  filters,
  page,
  totalPages,
}: {
  filters: DiscoveryFilters
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const prevFilters = { ...filters, page: page - 1 }
  const nextFilters = { ...filters, page: page + 1 }
  const prevQs = discoveryFiltersToSearchParams(prevFilters).toString()
  const nextQs = discoveryFiltersToSearchParams(nextFilters).toString()

  return (
    <nav
      className="flex items-center justify-center gap-3 pt-8"
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link
          href={prevQs ? `/?${prevQs}` : '/'}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Previous
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'pointer-events-none opacity-40',
          )}
        >
          Previous
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={`/?${nextQs}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Next
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'pointer-events-none opacity-40',
          )}
        >
          Next
        </span>
      )}
    </nav>
  )
}
