import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { DiscoveryCard } from '@/app/_components/discovery-card'
import { DiscoveryEmptyState } from '@/app/_components/discovery-empty-state'
import { DiscoveryFilters } from '@/app/_components/discovery-filters'
import { DiscoveryHeroSearch } from '@/app/_components/discovery-hero-search'
import { DiscoveryPagination } from '@/app/_components/discovery-pagination'
import { DiscoveryResultsTitle } from '@/app/_components/discovery-results-title'
import { FeaturedListingsRail } from '@/app/_components/featured-listings-rail'
import { FilterChipBar } from '@/app/_components/filter-chip-bar'
import { PlatformFooter } from '@/app/_components/platform-footer'
import { PlatformHeader } from '@/app/_components/platform-header'
import { TrustStrip } from '@/app/_components/trust-strip'
import {
  getPlatformStats,
  getRecentlyListed,
  searchPublishedListings,
} from '@/app/_lib/discovery/queries'
import {
  discoveryFiltersToSearchParams,
  hasActiveFilters,
  parseDiscoverySearchParams,
} from '@/app/_lib/discovery/search-params'
import { buttonVariants } from '@/components/ui/button'
import { VehicleGridSkeleton } from '@/components/vehicle-card-skeleton'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Browse vehicles — Showroom',
  description:
    'Search published vehicles across independent showrooms. Filter by make, model, year, price, and mileage.',
  openGraph: {
    title: 'Browse vehicles — Showroom',
    description:
      'Search published vehicles across independent showrooms. Filter by make, model, year, price, and mileage.',
  },
}

export default async function DiscoveryHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await searchParams
  const filters = parseDiscoverySearchParams(resolved)
  const [result, stats, recent] = await Promise.all([
    searchPublishedListings(filters),
    getPlatformStats(),
    getRecentlyListed(8),
  ])
  const filtered = hasActiveFilters(filters)

  if (
    !result.error &&
    result.totalPages > 0 &&
    filters.page > result.totalPages
  ) {
    const params = discoveryFiltersToSearchParams({
      ...filters,
      page: result.totalPages,
    })
    redirect(`/?${params.toString()}`)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PlatformHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <section className="mb-12">
          <p className="text-overline text-primary">Vehicle marketplace</p>
          <h1 className="text-display mt-2 text-balance tracking-tight text-foreground">
            Find your next car
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            Browse published inventory from showrooms on the platform. Dealers run their own
            storefronts — you search them all in one place.
          </p>
          <div className="mt-8">
            <DiscoveryHeroSearch stats={stats} />
          </div>
        </section>

        <Suspense fallback={<VehicleGridSkeleton count={4} />}>
          <DiscoveryFilters filters={filters} />
        </Suspense>

        <FilterChipBar filters={filters} />

        {!filtered && stats.vehicleCount > 4 && (
          <FeaturedListingsRail listings={recent} />
        )}

        <section className="mt-10">
          {result.error ? (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              Could not load listings. Please try again in a moment.
            </div>
          ) : (
            <DiscoveryResultsTitle filters={filters} total={result.total} />
          )}

          {result.listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {result.listings.map((listing, i) => (
                <DiscoveryCard key={listing.id} listing={listing} priority={i < 4} />
              ))}
            </div>
          ) : !result.error ? (
            <DiscoveryEmptyState filtered={filtered} filters={filters} />
          ) : null}

          <DiscoveryPagination
            filters={filters}
            page={result.page}
            totalPages={result.totalPages}
          />
        </section>

        <section className="mt-16 space-y-8">
          <TrustStrip stats={stats} />
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-lg font-semibold text-foreground">Ready to sell?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Publish your inventory and reach buyers searching across Showroom.
              </p>
            </div>
            <Link href="/signup" className={cn(buttonVariants({ size: 'lg' }), 'shrink-0')}>
              List your inventory
            </Link>
          </div>
        </section>
      </main>

      <PlatformFooter />
    </div>
  )
}
