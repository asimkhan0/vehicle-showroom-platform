import Image from 'next/image'
import Link from 'next/link'
import { Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'

export type VehicleListingCardProps = {
  href: string
  title: string
  subtitle?: string | null
  price: string
  imageUrl?: string | null
  imageAlt: string
  mileage?: string | null
  meta?: string | null
  badge?: string | null
  priceClassName?: string
  priority?: boolean
}

export function VehicleListingCard({
  href,
  title,
  subtitle,
  price,
  imageUrl,
  imageAlt,
  mileage,
  meta,
  badge,
  priceClassName,
  priority,
}: VehicleListingCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card',
        'shadow-sm transition-[box-shadow,border-color] duration-200',
        'hover:border-border/80 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            No photo
          </div>
        )}
        {badge && (
          <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-card-foreground">{title}</h3>
          <span
            className={cn(
              'shrink-0 text-base font-semibold tabular-nums text-foreground',
              priceClassName,
            )}
          >
            {price}
          </span>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {(mileage || meta) && (
          <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {mileage && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-medium">
                <Gauge className="size-3" aria-hidden />
                {mileage}
              </span>
            )}
            {meta && <span className="uppercase tracking-wider">{meta}</span>}
          </div>
        )}
      </div>
    </Link>
  )
}
