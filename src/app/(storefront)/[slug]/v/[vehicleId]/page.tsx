import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DealerTrustCard } from '../../_components/dealer-trust-card'
import { Gallery } from '../../_components/gallery'
import { InquiryDialog } from '../../_components/inquiry-dialog'
import { SimilarVehicles } from '../../_components/similar-vehicles'
import { SpecGrid } from '../../_components/spec-grid'
import { VdpSectionNav } from '../../_components/vdp-section-nav'
import { formatMileage, formatPrice, vehicleSubtitle } from '../../_components/format'
import {
  getPublishedVehicle,
  getPublishedVehicles,
  getShowroomBySlug,
  getSimilarVehicles,
} from '../../_lib/queries'
import { vehicleJsonLd } from '../../_lib/json-ld'
import { platformUrl } from '@/lib/platform-url'
import { publicImageUrl } from '@/lib/storage'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; vehicleId: string }>
}): Promise<Metadata> {
  const { slug, vehicleId } = await params
  const showroom = await getShowroomBySlug(slug)
  if (!showroom) return { title: 'Not found' }
  const vehicle = await getPublishedVehicle(showroom.id, vehicleId)
  if (!vehicle) return { title: 'Not found' }

  const title = `${vehicle.title} — ${showroom.name}`
  const description =
    vehicle.description ??
    `${vehicleSubtitle(vehicle) || vehicle.title} at ${showroom.name}.`

  const canonical = platformUrl(`/${slug}/v/${vehicleId}`)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: vehicle.primary_image ? [{ url: publicImageUrl(vehicle.primary_image) }] : undefined,
    },
  }
}

export default async function TenantVehicleDetail({
  params,
}: {
  params: Promise<{ slug: string; vehicleId: string }>
}) {
  const { slug, vehicleId } = await params
  const showroom = await getShowroomBySlug(slug)
  if (!showroom) notFound()

  const [vehicle, allVehicles] = await Promise.all([
    getPublishedVehicle(showroom.id, vehicleId),
    getPublishedVehicles(showroom.id),
  ])

  if (!vehicle) notFound()

  const similarVehicles = await getSimilarVehicles(vehicle.make, vehicle.id)
  const subtitle = vehicleSubtitle(vehicle)
  const jsonLd = vehicleJsonLd({ vehicle, showroom })

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 pb-28 md:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href=".."
        className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-[color:var(--tenant-accent)]"
      >
        ← All inventory
      </Link>

      <VdpSectionNav />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div id="overview" className="scroll-mt-24 space-y-10">
          <Gallery images={vehicle.images} alt={vehicle.title} />

          {vehicle.description && (
            <section className="max-w-3xl">
              <h2 className="text-overline text-muted-foreground">Description</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-foreground/90">
                {vehicle.description}
              </p>
            </section>
          )}
        </div>

        <aside id="specs" className="scroll-mt-24 lg:sticky lg:top-24">
          <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-1">
              {subtitle && (
                <p className="text-overline text-[color:var(--tenant-accent)]">{subtitle}</p>
              )}
              <h1 className="text-2xl font-semibold tracking-tight">{vehicle.title}</h1>
              <p className="text-price-lg pt-2 text-[color:var(--tenant-accent)]">
                {formatPrice(vehicle.price_cents)}
              </p>
            </div>

            <SpecGrid
              specs={[
                { label: 'Mileage', value: formatMileage(vehicle.mileage) },
                { label: 'Body', value: vehicle.body_type },
                { label: 'Transmission', value: vehicle.transmission },
                { label: 'Fuel', value: vehicle.fuel },
                { label: 'VIN', value: vehicle.vin },
              ]}
            />

            <InquiryDialog
              showroomId={showroom.id}
              vehicleId={vehicle.id}
              vehicleTitle={vehicle.title}
              dealerName={showroom.name}
            />

            <div id="dealer" className="scroll-mt-24">
              <DealerTrustCard
                showroom={showroom}
                vehicleCount={allVehicles.length}
                slug={slug}
              />
            </div>
          </div>
        </aside>
      </div>

      <SimilarVehicles vehicles={similarVehicles} />
    </div>
  )
}
