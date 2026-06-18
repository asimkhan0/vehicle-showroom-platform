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
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[color:var(--tenant-accent)]/5 via-transparent to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="flex flex-col items-start gap-6">
            {showroom.logo_url && (
              <Image
                src={showroom.logo_url}
                alt=""
                width={72}
                height={72}
                className="rounded-xl object-cover ring-2 ring-[color:var(--tenant-accent)]/20"
              />
            )}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--tenant-accent)]">
                Vehicle showroom
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {showroom.name}
              </h1>
              {showroom.bio && (
                <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
                  {showroom.bio}
                </p>
              )}
            </div>
            <p className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
              {vehicles.length === 0
                ? 'No vehicles available'
                : `${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'} available`}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {vehicles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center text-sm text-muted-foreground">
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
