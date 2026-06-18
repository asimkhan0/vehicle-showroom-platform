import {
  formatMileage,
  formatPrice,
  vehicleSubtitle,
} from '@/app/(storefront)/[slug]/_components/format'
import type { SimilarVehicle } from '@/app/(storefront)/[slug]/_lib/queries'
import { VehicleListingCard } from '@/components/vehicle-listing-card'
import { publicImageUrl } from '@/lib/storage'

export function SimilarVehicles({ vehicles }: { vehicles: SimilarVehicle[] }) {
  if (vehicles.length === 0) return null

  return (
    <section aria-labelledby="similar-vehicles-heading" className="mt-16">
      <h2 id="similar-vehicles-heading" className="mb-6 text-lg font-semibold text-foreground">
        Similar vehicles
      </h2>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory">
        {vehicles.map((v) => {
          const subtitle = vehicleSubtitle(v)
          const mileage = formatMileage(v.mileage)
          return (
            <div key={v.id} className="w-72 shrink-0 snap-start sm:w-80">
              <VehicleListingCard
                href={`/${v.showroom_slug}/v/${v.id}`}
                title={v.title}
                subtitle={subtitle}
                price={formatPrice(v.price_cents)}
                imageUrl={v.primary_image ? publicImageUrl(v.primary_image) : null}
                imageAlt={v.title}
                mileage={mileage}
                dealerName={v.showroom_name}
                dealerHref={`/${v.showroom_slug}`}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
