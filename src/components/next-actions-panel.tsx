import Link from 'next/link'
import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NextAction = {
  id: string
  icon: ReactNode
  title: string
  /** Why it matters. A row that only informs does not belong here. */
  detail: string
  actionLabel: string
  href: string
  tone?: 'attention' | 'accent' | 'neutral'
}

const iconToneClass: Record<NonNullable<NextAction['tone']>, string> = {
  attention: 'bg-attention-soft text-attention',
  accent: 'bg-primary-soft text-accent-foreground',
  neutral: 'bg-secondary text-text-2',
}

/**
 * The most important panel on the dashboard — dashboard.md §3.4.
 *
 * A dealer opens the dashboard to answer one question: what needs my attention
 * right now? This answers it, so it sits directly below the KPI cards and above
 * every table.
 *
 * Capped at four rows on purpose: a list of twelve is not a priority list.
 */
export function NextActionsPanel({
  actions,
  className,
}: {
  actions: NextAction[]
  className?: string
}) {
  const visible = actions.slice(0, 4)

  return (
    <section
      className={cn('flex min-w-0 flex-col rounded-xl border border-border bg-card', className)}
      aria-label="Next actions"
    >
      <h2 className="text-title border-b border-border px-4 py-3">Next actions</h2>

      {visible.length === 0 ? (
        // When there is nothing to do, say so. Never an empty panel.
        <div className="flex items-center gap-3 px-4 py-6">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-positive-soft" aria-hidden>
            <CheckCircle2 className="size-4 text-positive" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">You are all caught up</p>
            <p className="text-sm text-text-2">
              Every inquiry has been answered and nothing is waiting to be published.
            </p>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {visible.map((action) => (
            <li
              key={action.id}
              className="flex min-w-0 flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap"
            >
              <span
                aria-hidden
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-full',
                  iconToneClass[action.tone ?? 'neutral'],
                )}
              >
                {action.icon}
              </span>

              <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                <p className="text-sm font-medium text-foreground">{action.title}</p>
                <p className="text-sm text-text-2">{action.detail}</p>
              </div>

              {/* Below 680px the button drops under the text at the icon's indent. */}
              <Link
                href={action.href}
                className={cn(
                  'ml-12 inline-flex min-h-9 shrink-0 items-center rounded-lg border border-border-strong px-3',
                  'text-sm font-medium transition-colors hover:bg-secondary sm:ml-0',
                )}
              >
                {action.actionLabel}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
