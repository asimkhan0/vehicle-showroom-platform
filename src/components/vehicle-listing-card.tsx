import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Gauge, MapPin } from 'lucide-react'
import { VehicleImagePlaceholder } from '@/components/vehicle-image-placeholder'
import { cn } from '@/lib/utils'

/**
 * The most important component in the system. Order is fixed — see
 * design-system/showroom/MASTER.md §10.
 *
 *   1. Photograph, 16:9, dark ground, FIXED ratio
 *   2. Price   — strongest text in the body
 *   3. Title   — with trim in --text-2
 *   4. Meta    — mileage, year, fuel, transmission
 *   5. Dealer  — smallest row. Context, not the headline.
 *
 * The photograph is deliberately not load-bearing: real dealer photos are shot
 * on forecourts in bad light at careless crops, so hierarchy is carried by the
 * price and dealer rows and the well is bordered to stop blown-out shots
 * bleeding into the page. Any change here must be re-tested against
 * underexposed, blown-out, badly cropped and entirely missing photos.
 */
export type VehicleListingCardProps = {
  href: string
  title: string
  subtitle?: string | null
  price: string
  /** Optional finance figure, e.g. "PKR 84,000/mo". Rendered muted, never as the primary read. */
  monthly?: string | null
  imageUrl?: string | null
  imageAlt: string
  mileage?: string | null
  meta?: string | null
  badge?: string | null
  dealerName?: string | null
  dealerHref?: string | null
  dealerCity?: string | null
  dealerVerified?: boolean
  priceClassName?: string
  /**
   * @deprecated Cards are always 16:9. The ratio is fixed on purpose: a
   * variable ratio lets careless dealer photography change card height and
   * break the grid. Accepted only so existing call sites keep type-checking.
   */
  aspect?: 'video' | '4/3'
  priority?: boolean
}

function dealerInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export function VehicleListingCard({
  href,
  title,
  subtitle,
  price,
  monthly,
  imageUrl,
  imageAlt,
  mileage,
  meta,
  badge,
  dealerName,
  dealerHref,
  dealerCity,
  dealerVerified,
  priceClassName,
  priority,
}: VehicleListingCardProps) {
  return (
    <article className="group flex min-w-0 flex-col">
      <Link
        href={href}
        className={cn(
          'flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl',
          // Borders before shadows: the border defines the surface, the shadow
          // only hints that it lifts on hover.
          'border border-border bg-card',
          'transition-[box-shadow,border-color] duration-200 motion-reduce:transition-none',
          'hover:border-border-strong hover:shadow-e1',
        )}
      >
        <div className="media-16x9 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover"
            />
          ) : (
            <VehicleImagePlaceholder />
          )}
          {badge && (
            <span className="text-overline absolute left-3 top-3 rounded-full bg-positive-soft px-2.5 py-1 text-positive">
              {badge}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 p-4">
          {/* Price is the second reading after the photograph, and always the
              strongest type in the card body. */}
          <div className="flex min-w-0 items-baseline justify-between gap-3">
            <p className={cn('text-price-lg text-foreground', priceClassName)}>{price}</p>
            {monthly && (
              <p className="text-caption tabular shrink-0">{monthly}</p>
            )}
          </div>

          <h3 className="line-clamp-1 text-base font-medium text-card-foreground">{title}</h3>
          {subtitle && <p className="line-clamp-1 text-sm text-text-2">{subtitle}</p>}

          {(mileage || meta) && (
            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-2">
              {mileage && (
                <span className="inline-flex items-center gap-1 tabular">
                  <Gauge className="size-3.5 shrink-0" aria-hidden />
                  {mileage}
                </span>
              )}
              {mileage && meta && <span aria-hidden>·</span>}
              {meta && <span className="min-w-0">{meta}</span>}
            </div>
          )}
        </div>
      </Link>

      {/* The showroom is context, not the headline: smallest row, outside the
          card link so it can be its own navigation target. */}
      {dealerName && dealerHref && (
        <Link
          href={dealerHref}
          className="mt-2 flex min-w-0 items-center gap-2 px-1 text-xs text-text-2 transition-colors hover:text-foreground"
        >
          <span
            aria-hidden
            className="grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-[0.625rem] font-semibold text-text-2"
          >
            {dealerInitials(dealerName)}
          </span>
          <span className="truncate font-medium">{dealerName}</span>
          {dealerVerified && (
            <BadgeCheck className="size-3.5 shrink-0 text-positive" aria-label="Verified showroom" />
          )}
          {dealerCity && (
            <span className="inline-flex min-w-0 items-center gap-0.5">
              <MapPin className="size-3 shrink-0" aria-hidden />
              <span className="truncate">{dealerCity}</span>
            </span>
          )}
        </Link>
      )}
    </article>
  )
}
