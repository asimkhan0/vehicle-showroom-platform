import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Gallery } from '../../_components/gallery'
import { InquiryDialog } from '../../_components/inquiry-dialog'
import { SpecGrid } from '../../_components/spec-grid'
import { formatMileage, formatPrice, vehicleSubtitle } from '../../_components/format'
import { getPublishedVehicle, getShowroomBySlug } from '../../_lib/queries'
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

  const vehicle = await getPublishedVehicle(showroom.id, vehicleId)
  if (!vehicle) notFound()

  const subtitle = vehicleSubtitle(vehicle)
  const jsonLd = vehicleJsonLd({ vehicle, showroom })

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
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

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div>
          <Gallery images={vehicle.images} alt={vehicle.title} />
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-1">
              {subtitle && (
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--tenant-accent)]">
                  {subtitle}
                </p>
              )}
              <h1 className="text-2xl font-semibold tracking-tight">{vehicle.title}</h1>
              <p className="pt-2 text-3xl font-semibold tabular-nums text-[color:var(--tenant-accent)]">
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
            />
          </div>
        </aside>
      </div>

      {vehicle.description && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Description
          </h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-foreground/90">
            {vehicle.description}
          </p>
        </section>
      )}
    </div>
  )
}
