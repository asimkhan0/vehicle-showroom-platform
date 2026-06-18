import { cn } from '@/lib/utils'

export function VehicleCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-border bg-card',
        className,
      )}
      aria-hidden
    >
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="flex justify-between gap-3">
          <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}

export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  )
}
