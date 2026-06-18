import Image from 'next/image'
import Link from 'next/link'
import type { Showroom } from '../_lib/queries'

export function DealerTrustCard({
  showroom,
  vehicleCount,
  slug,
}: {
  showroom: Pick<Showroom, 'name' | 'bio' | 'logo_url' | 'created_at'>
  vehicleCount: number
  slug: string
}) {
  const memberSince = showroom.created_at
    ? new Date(showroom.created_at).getFullYear()
    : null
  const bioExcerpt = showroom.bio?.split(/(?<=[.!?])\s/)[0] ?? null

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-overline mb-3 text-muted-foreground">Dealer</p>
      <div className="flex items-start gap-3">
        {showroom.logo_url && (
          <Image
            src={showroom.logo_url}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-border"
          />
        )}
        <div className="min-w-0 space-y-1">
          <p className="font-semibold text-foreground">{showroom.name}</p>
          {bioExcerpt && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{bioExcerpt}</p>
          )}
          {memberSince && (
            <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
          )}
        </div>
      </div>
      <Link
        href={`/${slug}`}
        className="mt-3 inline-block text-sm font-medium text-[color:var(--tenant-accent)] underline-offset-4 hover:underline"
      >
        View all {vehicleCount} vehicle{vehicleCount === 1 ? '' : 's'} from this dealer →
      </Link>
    </div>
  )
}
