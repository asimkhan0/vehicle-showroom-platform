import Image from 'next/image'
import { notFound } from 'next/navigation'
import { VehicleCard } from './_components/vehicle-card'
import { getPublishedVehicles, getShowroomBySlug } from './_lib/queries'

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const showroom = await getShowroomBySlug(slug)
  if (!showroom) notFound()

  const vehicles = await getPublishedVehicles(showroom.id)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="flex flex-col items-start gap-6">
            {showroom.logo_url && (
              <Image
                src={showroom.logo_url}
                alt=""
                width={64}
                height={64}
                className="rounded-xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
              />
            )}
            <div className="space-y-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                {showroom.name}
              </h1>
              {showroom.bio && (
                <p className="max-w-2xl text-pretty text-lg text-neutral-600 dark:text-neutral-400">
                  {showroom.bio}
                </p>
              )}
            </div>
            <p className="text-sm uppercase tracking-wider text-neutral-500">
              {vehicles.length === 0
                ? 'No vehicles available'
                : `${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'} available`}
            </p>
          </div>
        </div>
      </section>

      {/* Inventory */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {vehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-20 text-center text-sm text-neutral-500 dark:border-neutral-700">
            New listings will appear here soon. Check back shortly.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} priority={i < 4} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
