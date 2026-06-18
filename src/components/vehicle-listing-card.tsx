import Image from 'next/image'
import Link from 'next/link'
import { Gauge } from 'lucide-react'
import { VehicleImagePlaceholder } from '@/components/vehicle-image-placeholder'
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
  dealerName?: string | null
  dealerHref?: string | null
  priceClassName?: string
  aspect?: 'video' | '4/3'
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
  dealerName,
  dealerHref,
  priceClassName,
  aspect = 'video',
  priority,
}: VehicleListingCardProps) {
  const aspectClass = aspect === 'video' ? 'aspect-video' : 'aspect-[4/3]'

  return (
    <article className="group flex flex-col">
      <Link
        href={href}
        className={cn(
          'flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card',
          'shadow-sm transition-[box-shadow,border-color] duration-200',
          'hover:border-border/80 hover:shadow-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      >
        <div className={cn('relative overflow-hidden bg-muted', aspectClass)}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-[filter] duration-300 motion-reduce:transition-none group-hover:brightness-105 motion-reduce:group-hover:brightness-100"
            />
          ) : (
            <VehicleImagePlaceholder />
          )}
          {badge && (
            <span className="absolute left-3 top-3 rounded-md bg-emerald-600/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <p
            className={cn(
              'text-xl font-semibold tabular-nums text-foreground',
              priceClassName,
            )}
          >
            {price}
          </p>
          <h3 className="line-clamp-1 text-base font-medium text-card-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {(mileage || meta) && (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {mileage && (
                <span className="inline-flex items-center gap-1">
                  <Gauge className="size-3.5 shrink-0" aria-hidden />
                  {mileage}
                </span>
              )}
              {mileage && meta && <span aria-hidden>·</span>}
              {meta && <span>{meta}</span>}
            </div>
          )}
        </div>
      </Link>

      {dealerName && dealerHref && (
        <Link
          href={dealerHref}
          className="mt-1.5 px-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {dealerName}
        </Link>
      )}
    </article>
  )
}
