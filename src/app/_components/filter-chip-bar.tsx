'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  discoveryFiltersToSearchParams,
  type DiscoveryFilters,
} from '@/app/_lib/discovery/search-params'

function formatDollars(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

type Chip = { key: keyof DiscoveryFilters; label: string }

function chipsFromFilters(filters: DiscoveryFilters): Chip[] {
  const chips: Chip[] = []
  if (filters.make) chips.push({ key: 'make', label: filters.make })
  if (filters.model) chips.push({ key: 'model', label: filters.model })
  if (filters.year != null) chips.push({ key: 'year', label: String(filters.year) })
  if (filters.priceMin != null)
    chips.push({ key: 'priceMin', label: `From ${formatDollars(filters.priceMin)}` })
  if (filters.priceMax != null)
    chips.push({ key: 'priceMax', label: `Under ${formatDollars(filters.priceMax)}` })
  if (filters.mileageMin != null)
    chips.push({ key: 'mileageMin', label: `${filters.mileageMin.toLocaleString()}+ mi` })
  if (filters.mileageMax != null)
    chips.push({ key: 'mileageMax', label: `Under ${filters.mileageMax.toLocaleString()} mi` })
  return chips
}

export function FilterChipBar({ filters }: { filters: DiscoveryFilters }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const chips = chipsFromFilters(filters)

  if (chips.length === 0) return null

  function remove(key: keyof DiscoveryFilters) {
    const next: DiscoveryFilters = { ...filters, page: 1 }
    if (key === 'make') next.make = undefined
    else if (key === 'model') next.model = undefined
    else if (key === 'year') next.year = undefined
    else if (key === 'priceMin') next.priceMin = undefined
    else if (key === 'priceMax') next.priceMax = undefined
    else if (key === 'mileageMin') next.mileageMin = undefined
    else if (key === 'mileageMax') next.mileageMax = undefined

    const qs = discoveryFiltersToSearchParams(next).toString()
    startTransition(() => router.push(qs ? `/?${qs}` : '/'))
  }

  function clearAll() {
    startTransition(() => router.push('/'))
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Active:
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          disabled={pending}
          onClick={() => remove(chip.key)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          {chip.label}
          <X className="size-3" aria-hidden />
          <span className="sr-only">Remove {chip.label} filter</span>
        </button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        disabled={pending}
        onClick={clearAll}
        className="cursor-pointer text-muted-foreground"
      >
        Clear all
      </Button>
    </div>
  )
}
