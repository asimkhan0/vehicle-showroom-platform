import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Horizontal rail section — "Just listed", storefront "Featured this week",
 * and "Similar vehicles". MASTER §10.
 *
 * The .rail utility owns the scroll behaviour, the fixed child width and the
 * min-width:0 that stops the rail forcing the page wider than the viewport.
 * Every mobile overflow failure in QA came from omitting that.
 */
export function RailSection({
  title,
  description,
  href,
  linkLabel = 'View all',
  children,
  className,
}: {
  title: string
  description?: string | null
  href?: string | null
  linkLabel?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex min-w-0 flex-col gap-4', className)}>
      <div className="flex min-w-0 flex-wrap items-end justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-title-lg">{title}</h2>
          {description && <p className="text-sm text-text-2">{description}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      <div className="rail">{children}</div>
    </section>
  )
}
