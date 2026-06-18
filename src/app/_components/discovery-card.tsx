import {
  formatMileage,
  formatPrice,
  vehicleSubtitle,
} from '@/app/(storefront)/[slug]/_components/format'
import type { DiscoveryListing } from '@/app/_lib/discovery/queries'
import { VehicleListingCard } from '@/components/vehicle-listing-card'
import { publicImageUrl } from '@/lib/storage'

function isJustListed(publishedAt: string | null): boolean {
  if (!publishedAt) return false
  const days = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24)
  return days < 7
}

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
      dealerName={listing.showroom_name}
      dealerHref={`/${listing.showroom_slug}`}
      badge={isJustListed(listing.published_at) ? 'Just listed' : null}
      priority={priority}
    />
  )
}
