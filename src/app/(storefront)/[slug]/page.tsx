import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StorefrontHero } from './_components/storefront-hero'
import { VehicleCard } from './_components/vehicle-card'
import {
  getFeaturedVehicles,
  getPublishedVehicles,
  getShowroomBySlug,
} from './_lib/queries'
import { buttonVariants } from '@/components/ui/button'
import { platformUrl } from '@/lib/platform-url'
import { cn } from '@/lib/utils'
import type { VehicleListItem } from './_lib/queries'

function resolveHighlights(
  vehicles: VehicleListItem[],
  featuredIds: string[],
  explicitFeatured: VehicleListItem[],
): { highlights: VehicleListItem[]; label: string; explicit: boolean } {
  if (explicitFeatured.length > 0) {
    return { highlights: explicitFeatured, label: 'Featured', explicit: true }
  }
  if (vehicles.length >= 4) {
    return { highlights: vehicles.slice(0, 3), label: 'Recently added', explicit: false }
  }
  return { highlights: [], label: '', explicit: false }
}

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const showroom = await getShowroomBySlug(slug)
  if (!showroom) notFound()

  const vehicles = await getPublishedVehicles(showroom.id)
  const featuredIds = showroom.theme_json?.featured ?? []
  const explicitFeatured = await getFeaturedVehicles(showroom.id, featuredIds)
  const coverPath = showroom.theme_json?.coverImagePath

  const { highlights, label, explicit } = resolveHighlights(
    vehicles,
    featuredIds,
    explicitFeatured,
  )

  const highlightIds = new Set(highlights.map((v) => v.id))
  const inventoryVehicles =
    highlights.length > 0
      ? vehicles.filter((v) => !highlightIds.has(v.id))
      : vehicles

  return (
    <>
      <StorefrontHero
        showroom={showroom}
        coverPath={coverPath}
        vehicleCount={vehicles.length}
      />

      {highlights.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <div>
              <p className="text-overline text-[color:var(--tenant-accent)]">{label}</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                {explicit ? 'Spotlight listings' : 'Fresh on the lot'}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {inventoryVehicles.length > 0 && highlights.length > 0 && (
          <div className="mb-6">
            <p className="text-overline text-muted-foreground">Browse</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">All inventory</h2>
          </div>
        )}
        {vehicles.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 px-6 py-16 text-center">
            <p className="text-base font-medium text-foreground">
              This showroom is stocking up
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse all vehicles on the marketplace while new listings arrive.
            </p>
            <Link
              href={platformUrl('/')}
              className={cn(buttonVariants({ variant: 'outline' }), 'mt-6 inline-flex')}
            >
              Browse marketplace
            </Link>
          </div>
        ) : inventoryVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {inventoryVehicles.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} priority={i < 4} />
            ))}
          </div>
        ) : null}
      </section>
    </>
  )
}
