import { publicImageUrl } from '@/lib/storage'
import { vehicleHref } from '@/lib/tenant-path'
import { VehicleListingCard } from '@/components/vehicle-listing-card'
import { formatMileage, formatPrice, vehicleSubtitle } from './format'
import type { VehicleListItem } from '../_lib/queries'

export function VehicleCard({
  vehicle,
  priority,
}: {
  vehicle: VehicleListItem
  priority?: boolean
}) {
  const subtitle = vehicleSubtitle(vehicle)
  const mileage = formatMileage(vehicle.mileage)
  const meta = [vehicle.body_type, vehicle.fuel].filter(Boolean).join(' · ')

  return (
    <VehicleListingCard
      href={vehicleHref(vehicle.id)}
      title={vehicle.title}
      subtitle={subtitle}
      price={formatPrice(vehicle.price_cents)}
      priceClassName="text-[color:var(--tenant-accent)]"
      imageUrl={vehicle.primary_image ? publicImageUrl(vehicle.primary_image) : null}
      imageAlt={vehicle.title}
      mileage={mileage}
      meta={meta || null}
      priority={priority}
    />
  )
}
