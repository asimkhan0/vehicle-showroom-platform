import Link from 'next/link'
import { cn } from '@/lib/utils'

export type IntentChip = {
  label: string
  href: string
  active?: boolean
}

/**
 * Intent chips sit directly under the hero search. DESIGN_RESEARCH §2: buyers
 * arrive with an intent ("family SUV", "under 5 million", "low mileage") long
 * before they have a make and model in mind, and an empty search field asks
 * them to already know the answer.
 */
export function IntentChips({
  chips,
  className,
}: {
  chips: IntentChip[]
  className?: string
}) {
  if (chips.length === 0) return null

  return (
    <nav aria-label="Browse by intent" className={cn('min-w-0', className)}>
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip.href}>
            <Link
              href={chip.href}
              aria-current={chip.active ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium',
                'transition-colors',
                chip.active
                  ? 'border-primary bg-primary-soft text-accent-foreground'
                  : 'border-border-strong bg-card text-foreground hover:bg-secondary',
              )}
            >
              {chip.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
