import Link from 'next/link'
import { DiscoveryCard } from '@/app/_components/discovery-card'
import type { DiscoveryListing } from '@/app/_lib/discovery/queries'

export function FeaturedListingsRail({ listings }: { listings: DiscoveryListing[] }) {
  if (listings.length === 0) return null

  return (
    <section aria-labelledby="recently-listed-heading" className="mb-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id="recently-listed-heading" className="text-lg font-semibold text-foreground">
          Recently listed
        </h2>
        <Link
          href="/?page=1"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-thin">
        {listings.map((listing, i) => (
          <div key={listing.id} className="w-72 shrink-0 snap-start sm:w-80">
            <DiscoveryCard listing={listing} priority={i < 2} />
          </div>
        ))}
      </div>
    </section>
  )
}
