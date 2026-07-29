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
import { MobileFilterSheet } from '@/components/mobile-filter-sheet'
import { StateError } from '@/components/state-error'
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

      <main className="shell flex-1 py-10">
        {/* Hero. One job: get the buyer into a search. */}
        <section className="mb-10 flex max-w-3xl flex-col">
          <p className="text-overline text-primary">Vehicle marketplace</p>
          <h1 className="text-display mt-2 text-balance text-foreground">Find your next car</h1>
          <p className="mt-3 text-pretty text-text-2">
            Browse published inventory from showrooms on the platform. Dealers run their own
            storefronts — you search them all in one place.
          </p>
          <div className="mt-8">
            <DiscoveryHeroSearch stats={stats} />
          </div>
        </section>

        {/* Rails belong above the fold only when the buyer has not searched yet. */}
        {!filtered && stats.vehicleCount > 4 && (
          <div className="mb-12">
            <FeaturedListingsRail listings={recent} />
          </div>
        )}

        {/*
          Filters move out of the content column and into a sticky rail. The old
          full-width filter block pushed the first result below the fold, which
          is the failure DESIGN_RESEARCH §2 flags as the category's worst habit.
        */}
        <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[272px_minmax(0,1fr)]">
          <aside className="sticky top-24 hidden lg:block">
            <Suspense fallback={null}>
              <DiscoveryFilters filters={filters} />
            </Suspense>
          </aside>

          <div className="flex min-w-0 flex-col gap-6">
            <MobileFilterSheet>
              <Suspense fallback={null}>
                <DiscoveryFilters filters={filters} />
              </Suspense>
            </MobileFilterSheet>

            <FilterChipBar filters={filters} />

            {result.error ? (
              <StateError />
            ) : (
              <DiscoveryResultsTitle filters={filters} total={result.total} />
            )}

            {result.listings.length > 0 ? (
              <div className="card-grid">
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
          </div>
        </div>

        <section className="mt-16 flex flex-col gap-8">
          <TrustStrip stats={stats} />
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-title">Ready to sell?</p>
              <p className="mt-1 text-sm text-text-2">
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
