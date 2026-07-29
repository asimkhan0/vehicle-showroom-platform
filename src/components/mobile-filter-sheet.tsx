'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Filters on mobile. MASTER §10.
 *
 * Desktop keeps the sticky left rail; below 900px the rail becomes a bottom
 * sheet. Built on plain React state and CSS transforms rather than a dialog
 * library so it has no dependency surface beyond this file.
 *
 * Behaviour that is part of the spec, not decoration:
 *   - closed at translateY(101%), so it never paints a sliver on screen
 *   - dismissed by the scrim, the close button, or Escape
 *   - body scroll locks while open, otherwise the page scrolls behind the sheet
 *   - the trigger states the active filter count, so it is useful when closed
 */
export function MobileFilterSheet({
  activeCount = 0,
  title = 'Filters',
  children,
  className,
}: {
  activeCount?: number
  title?: string
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className={cn('lg:hidden', className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg',
          'border border-border-strong bg-card px-4 text-sm font-medium',
          'transition-colors hover:bg-secondary',
        )}
      >
        <SlidersHorizontal className="size-4 shrink-0" aria-hidden />
        {title}
        {activeCount > 0 && (
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-accent-foreground tabular">
            {activeCount}
          </span>
        )}
      </button>

      {/* Scrim. Sits below the sheet, above everything else. */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-50 bg-chrome/50 transition-opacity duration-200 motion-reduce:transition-none',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        role="dialog"
        aria-modal={open}
        aria-label={title}
        aria-hidden={!open}
        className={cn(
          'fixed inset-x-0 bottom-0 z-60 flex max-h-[88vh] flex-col',
          'rounded-t-2xl border border-border bg-card shadow-e2',
          'transition-transform duration-300 ease-out motion-reduce:transition-none',
          open ? 'translate-y-0' : 'translate-y-[101%]',
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-title">{title}</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-11 place-items-center rounded-lg transition-colors hover:bg-secondary"
            aria-label="Close filters"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>

        <div className="shrink-0 border-t border-border p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cn(
              'inline-flex min-h-11 w-full items-center justify-center rounded-lg',
              'bg-primary px-4 text-sm font-medium text-primary-foreground',
              'transition-colors hover:bg-primary-hover',
            )}
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  )
}
