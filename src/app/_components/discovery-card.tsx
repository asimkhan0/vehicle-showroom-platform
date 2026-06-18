import Image from 'next/image'
import Link from 'next/link'
import {
  formatMileage,
  formatPrice,
  vehicleSubtitle,
} from '@/app/(storefront)/[slug]/_components/format'
import type { DiscoveryListing } from '@/app/_lib/discovery/queries'
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
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition-shadow hover:shadow-xl dark:bg-neutral-900 dark:ring-neutral-800"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {listing.primary_image ? (
          <Image
            src={publicImageUrl(listing.primary_image)}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-wider text-neutral-400">
            No photo
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-neutral-900 dark:text-neutral-50">
            {listing.title}
          </h3>
          <span className="shrink-0 font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
            {formatPrice(listing.price_cents)}
          </span>
        </div>
        {subtitle && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        )}
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {listing.showroom_name}
        </p>
        {mileage && (
          <p className="mt-1 text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {mileage}
          </p>
        )}
      </div>
    </Link>
  )
}
