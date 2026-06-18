'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { POPULAR_MAKES } from '@/app/_components/platform-footer'
import {
  discoveryFiltersToSearchParams,
  type DiscoveryFilters,
} from '@/app/_lib/discovery/search-params'
import type { PlatformStats } from '@/app/_lib/discovery/queries'

type IntentChip = {
  label: string
  filters: Partial<DiscoveryFilters>
}

const INTENT_CHIPS: IntentChip[] = [
  { label: 'Under $20k', filters: { priceMax: 2_000_000 } },
  { label: 'Low mileage', filters: { mileageMax: 30_000 } },
  { label: 'Under $30k', filters: { priceMax: 3_000_000 } },
]

export function DiscoveryHeroSearch({ stats }: { stats?: PlatformStats }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function navigate(filters: Partial<DiscoveryFilters>) {
    const params = discoveryFiltersToSearchParams({
      page: 1,
      ...filters,
    })
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `/?${qs}` : '/')
    })
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const make = String(fd.get('make') ?? '').trim()
    const model = String(fd.get('model') ?? '').trim()
    navigate({
      make: make || undefined,
      model: model || undefined,
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {stats && stats.vehicleCount > 0 && (
        <p className="text-sm text-muted-foreground">
          Search{' '}
          <span className="font-medium text-foreground">
            {stats.vehicleCount.toLocaleString()}
          </span>{' '}
          vehicles from{' '}
          <span className="font-medium text-foreground">
            {stats.showroomCount.toLocaleString()}
          </span>{' '}
          independent showrooms
        </p>
      )}

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-2 shadow-sm sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="hero-make"
            name="make"
            placeholder="Make (e.g. Toyota)"
            autoComplete="off"
            className="border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />
        <div className="flex-1">
          <Input
            id="hero-model"
            name="model"
            placeholder="Model (e.g. Supra)"
            autoComplete="off"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? 'Searching…' : 'Search vehicles'}
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-overline text-muted-foreground">Popular:</span>
        {POPULAR_MAKES.map((make) => (
          <button
            key={make}
            type="button"
            onClick={() => navigate({ make })}
            disabled={pending}
            className="cursor-pointer rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-muted disabled:opacity-50"
          >
            {make}
          </button>
        ))}
        {INTENT_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => navigate(chip.filters)}
            disabled={pending}
            className="cursor-pointer rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-muted disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
        <Link
          href="/signup"
          className="ml-auto text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          List your inventory →
        </Link>
      </div>
    </div>
  )
}
