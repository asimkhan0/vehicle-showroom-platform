import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

export type EscapeRoute = {
  label: string
  href: string
}

/**
 * No results. MASTER §13 — the single most common abandonment point in the
 * category, so it is specified rather than improvised.
 *
 * Three obligations:
 *   1. restate what was searched, so the buyer knows we understood them
 *   2. NAME the filter excluding the most results — not "try adjusting filters"
 *   3. offer at least three one-tap routes out, plus a way to save the search
 */
export function StateEmpty({
  query,
  excludingFilter,
  routes,
  saveSearchHref,
  className,
}: {
  query: string
  excludingFilter?: string | null
  routes: EscapeRoute[]
  saveSearchHref?: string | null
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-12 text-center',
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-full bg-secondary" aria-hidden>
        <SearchX className="size-5 text-text-2" strokeWidth={1.5} />
      </span>

      <div className="flex max-w-prose flex-col gap-1.5">
        <h2 className="text-title">No vehicles match {query}</h2>
        {excludingFilter ? (
          <p className="text-sm text-text-2">
            Your <span className="font-medium text-foreground">{excludingFilter}</span> filter is
            excluding the most results. Widening it is usually the fastest fix.
          </p>
        ) : (
          <p className="text-sm text-text-2">
            Nothing live matches this combination right now. New stock is listed daily.
          </p>
        )}
      </div>

      {routes.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-2">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-lg border border-border-strong px-4',
                  'text-sm font-medium transition-colors hover:bg-secondary',
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {saveSearchHref && (
        <Link
          href={saveSearchHref}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Save this search and get told when something matches
        </Link>
      )}
    </div>
  )
}
