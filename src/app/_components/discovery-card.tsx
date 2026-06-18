import {
  formatMileage,
  formatPrice,
  vehicleSubtitle,
} from '@/app/(storefront)/[slug]/_components/format'
import type { DiscoveryListing } from '@/app/_lib/discovery/queries'
import { VehicleListingCard } from '@/components/vehicle-listing-card'
import { publicImageUrl } from '@/lib/storage'

export function DiscoveryCard({
  listing,
  priority,
}: {
  listing: DiscoveryListing
  priority?: boolean
}) {
  const subtitle = vehicleSubtitle(listing)
  const mileage = formatMileage(listing.mileage)
  const href = `/${listing.showroom_slug}/v/${listing.id}`

  return (
    <VehicleListingCard
      href={href}
      title={listing.title}
      subtitle={subtitle}
      price={formatPrice(listing.price_cents)}
      imageUrl={listing.primary_image ? publicImageUrl(listing.primary_image) : null}
      imageAlt={listing.title}
      mileage={mileage}
      badge={listing.showroom_name}
      priority={priority}
    />
  )
}
