'use client'

import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'specs', label: 'Specs' },
  { id: 'dealer', label: 'Dealer' },
] as const

export function VdpSectionNav() {
  return (
    <nav
      aria-label="Page sections"
      className="sticky top-16 z-20 -mx-6 mb-8 border-b border-border bg-background/95 px-6 backdrop-blur-sm"
    >
      <ul className="flex gap-1 overflow-x-auto py-2">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cn(
                'inline-flex cursor-pointer whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground',
                'transition-colors hover:bg-muted hover:text-foreground',
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
