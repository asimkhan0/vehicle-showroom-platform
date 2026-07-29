import { cn } from '@/lib/utils'

/**
 * Loading state. MASTER §13: skeletons must mirror the real card geometry so
 * nothing shifts when the content arrives. The 16:9 well, the price line, the
 * title and the dealer row are all in the same places as VehicleListingCard.
 */
export function VehicleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-w-0 flex-col', className)} aria-hidden>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="media-16x9 animate-pulse bg-muted" />
        <div className="flex flex-col gap-2 p-4">
          {/* price */}
          <div className="h-6 w-32 animate-pulse rounded-sm bg-muted" />
          {/* title */}
          <div className="h-4 w-3/4 animate-pulse rounded-sm bg-muted" />
          {/* trim */}
          <div className="h-3.5 w-1/2 animate-pulse rounded-sm bg-muted" />
          {/* meta row */}
          <div className="mt-1 h-3.5 w-2/3 animate-pulse rounded-sm bg-muted" />
        </div>
      </div>
      {/* dealer row, outside the card just like the real thing */}
      <div className="mt-2 flex items-center gap-2 px-1">
        <div className="size-5 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-28 animate-pulse rounded-sm bg-muted" />
      </div>
    </div>
  )
}

export function VehicleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="card-grid" role="status" aria-label="Loading vehicles">
      {Array.from({ length: count }, (_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  )
}
