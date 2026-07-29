import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export type KpiDelta = {
  /**
   * MUST state the direction in words, e.g. "3 days slower" or "18.2% more
   * views". dashboard.md §3.3: an increase is not automatically good —
   * days-to-sell rising is bad, views rising is good, and colour alone cannot
   * express that. Screen readers and colour-blind users get the same meaning.
   */
  label: string
  direction: 'up' | 'down'
  tone: 'positive' | 'attention' | 'neutral'
}

const deltaToneClass: Record<KpiDelta['tone'], string> = {
  positive: 'text-positive',
  attention: 'text-attention',
  neutral: 'text-text-2',
}

export function KpiCard({
  label,
  value,
  delta,
  className,
}: {
  label: string
  value: string | number
  delta?: KpiDelta | null
  className?: string
}) {
  const Arrow = delta?.direction === 'down' ? TrendingDown : TrendingUp

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-xl border border-border bg-card p-4',
        className,
      )}
    >
      <p className="text-overline text-text-3">{label}</p>
      <p className="text-price-xl text-foreground">{value}</p>
      {delta && (
        <p className={cn('flex items-center gap-1 text-xs font-medium', deltaToneClass[delta.tone])}>
          <Arrow className="size-3.5 shrink-0" aria-hidden />
          {delta.label}
        </p>
      )}
    </div>
  )
}
