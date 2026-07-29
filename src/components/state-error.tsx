import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * MASTER §13. This is the one place --destructive appears on a buyer surface.
 *
 * Plain language, no error codes shouted at the buyer, and it explicitly says
 * the filters are preserved — the fear on a failed search is having to rebuild
 * the whole query.
 *
 * `action` is a ReactNode so the retry control can be supplied by whichever
 * client component owns the retry, keeping this presentational.
 */
export function StateError({
  title = 'We could not load these results',
  detail = 'Something went wrong on our side, not yours. Your filters have been kept, so retrying will pick up exactly where you left off.',
  action,
  className,
}: {
  title?: string
  detail?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-3 rounded-xl border border-destructive/25 bg-destructive-soft p-5',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <TriangleAlert className="size-4 shrink-0 text-destructive" aria-hidden />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <p className="max-w-prose text-sm text-text-2">{detail}</p>
      {action}
    </div>
  )
}
