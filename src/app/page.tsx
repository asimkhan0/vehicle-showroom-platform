import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { DiscoveryCard } from '@/app/_components/discovery-card'
import { DiscoveryFilters } from '@/app/_components/discovery-filters'
import { DiscoveryPagination } from '@/app/_components/discovery-pagination'
import { PlatformHeader } from '@/app/_components/platform-header'
import { searchPublishedListings } from '@/app/_lib/discovery/queries'
import {
  discoveryFiltersToSearchParams,
  hasActiveFilters,
  parseDiscoverySearchParams,
} from '@/app/_lib/discovery/search-params'

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
  const result = await searchPublishedListings(filters)
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
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-neutral-950">
      <PlatformHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <section className="mb-10 max-w-3xl">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Find your next vehicle
          </h1>
          <p className="mt-3 text-pretty text-neutral-600 dark:text-neutral-400">
            Browse published inventory from showrooms on the platform. Dealers run their own
            storefronts — you search them all in one place.
          </p>
          <div className="mt-5">
            <Link href="/signup" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
              List your inventory
            </Link>
          </div>
        </section>

        <Suspense fallback={<div className="h-40 rounded-2xl bg-neutral-100 dark:bg-neutral-900" />}>
          <DiscoveryFilters filters={filters} />
        </Suspense>

        <section className="mt-10">
          {result.error ? (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              Could not load listings. Please try again in a moment.
            </div>
          ) : (
            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
              {result.total === 0
                ? filtered
                  ? 'No vehicles match your filters.'
                  : 'No published vehicles yet.'
                : `${result.total} vehicle${result.total === 1 ? '' : 's'} found`}
            </p>
          )}

          {result.listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {result.listings.map((listing, i) => (
                <DiscoveryCard key={listing.id} listing={listing} priority={i < 4} />
              ))}
            </div>
          ) : !result.error ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-20 text-center text-sm text-neutral-500 dark:border-neutral-700">
              {filtered
                ? 'Try adjusting your filters or clear them to see all listings.'
                : 'When vendors publish vehicles, they will appear here.'}
            </div>
          ) : null}

          <DiscoveryPagination
            filters={filters}
            page={result.page}
            totalPages={result.totalPages}
          />
        </section>
      </main>
    </div>
  )
}
