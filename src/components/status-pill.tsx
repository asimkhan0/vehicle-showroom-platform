import { cn } from '@/lib/utils'

export type StatusTone = 'positive' | 'attention' | 'destructive' | 'neutral'

const toneClass: Record<StatusTone, { wrap: string; dot: string }> = {
  positive: { wrap: 'bg-positive-soft text-positive', dot: 'bg-positive' },
  attention: { wrap: 'bg-attention-soft text-attention', dot: 'bg-attention' },
  destructive: { wrap: 'bg-destructive-soft text-destructive', dot: 'bg-destructive' },
  neutral: { wrap: 'bg-secondary text-text-2', dot: 'bg-text-3' },
}

/**
 * MASTER §12: status is NEVER colour alone. The dot carries the colour, the
 * label carries the meaning, and the label is not optional.
 */
export function StatusPill({
  label,
  tone = 'neutral',
  className,
}: {
  label: string
  tone?: StatusTone
  className?: string
}) {
  const t = toneClass[tone]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1',
        'text-xs font-medium',
        t.wrap,
        className,
      )}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', t.dot)} aria-hidden />
      {label}
    </span>
  )
}
