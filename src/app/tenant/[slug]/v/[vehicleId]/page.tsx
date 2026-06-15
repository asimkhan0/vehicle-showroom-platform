import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Gallery } from '../../_components/gallery'
import { InquiryDialog } from '../../_components/inquiry-dialog'
import { SpecGrid } from '../../_components/spec-grid'
import { formatMileage, formatPrice, vehicleSubtitle } from '../../_components/format'
import { getPublishedVehicle, getShowroomBySlug } from '../../_lib/queries'
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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ← All inventory
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Gallery */}
        <div>
          <Gallery images={vehicle.images} alt={vehicle.title} />
        </div>

        {/* Details panel — sticky on desktop */}
        <aside className="lg:sticky lg:top-24">
          <div className="space-y-6 rounded-2xl bg-white p-6 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
            <div className="space-y-1">
              {subtitle && (
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
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
          <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-500">
            Description
          </h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            {vehicle.description}
          </p>
        </section>
      )}
    </div>
  )
}
