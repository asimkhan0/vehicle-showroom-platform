'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  discoveryFiltersToSearchParams,
  hasActiveFilters,
  type DiscoveryFilters,
} from '@/app/_lib/discovery/search-params'
import { cn } from '@/lib/utils'

export function DiscoveryFilters({ filters }: { filters: DiscoveryFilters }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const active = hasActiveFilters(filters)

  function apply(next: Partial<DiscoveryFilters>) {
    const merged: DiscoveryFilters = {
      ...filters,
      ...next,
      page: next.page ?? 1,
    }
    const params = discoveryFiltersToSearchParams(merged)
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `/?${qs}` : '/')
    })
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const dollarsToCents = (key: string) => {
      const raw = String(fd.get(key) ?? '').trim()
      if (!raw) return undefined
      const dollars = Number(raw)
      if (!Number.isFinite(dollars) || dollars < 0) return undefined
      return Math.round(dollars * 100)
    }
    const optionalInt = (key: string) => {
      const raw = String(fd.get(key) ?? '').trim()
      if (!raw) return undefined
      const n = Number(raw)
      return Number.isFinite(n) ? Math.trunc(n) : undefined
    }

    apply({
      make: String(fd.get('make') ?? '').trim() || undefined,
      model: String(fd.get('model') ?? '').trim() || undefined,
      priceMin: dollarsToCents('priceMin'),
      priceMax: dollarsToCents('priceMax'),
      year: optionalInt('year'),
      mileageMin: optionalInt('mileageMin'),
      mileageMax: optionalInt('mileageMax'),
      page: 1,
    })
  }

  function clearFilters() {
    startTransition(() => router.push('/'))
  }

  const priceMinDisplay =
    filters.priceMin != null ? String(filters.priceMin / 100) : ''
  const priceMaxDisplay =
    filters.priceMax != null ? String(filters.priceMax / 100) : ''

  const formKey = searchParams.toString()

  return (
    <form
      key={formKey}
      onSubmit={onSubmit}
      className={cn(
        'rounded-xl border border-border bg-card p-4 shadow-sm',
        'lg:sticky lg:top-24 z-10',
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Refine search</h2>
        {active && (
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={clearFilters}
            className="cursor-pointer text-muted-foreground"
          >
            <X className="size-3.5" aria-hidden />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            name="make"
            defaultValue={filters.make ?? ''}
            placeholder="Toyota"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            defaultValue={filters.model ?? ''}
            placeholder="Supra"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            inputMode="numeric"
            defaultValue={filters.year ?? ''}
            placeholder="2021"
            min={1900}
            max={2100}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mileageMax">Max mileage</Label>
          <Input
            id="mileageMax"
            name="mileageMax"
            type="number"
            inputMode="numeric"
            defaultValue={filters.mileageMax ?? ''}
            placeholder="50000"
            min={0}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceMin">Min price ($)</Label>
          <Input
            id="priceMin"
            name="priceMin"
            type="number"
            inputMode="decimal"
            defaultValue={priceMinDisplay}
            placeholder="10000"
            min={0}
            step="1"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceMax">Max price ($)</Label>
          <Input
            id="priceMax"
            name="priceMax"
            type="number"
            inputMode="decimal"
            defaultValue={priceMaxDisplay}
            placeholder="75000"
            min={0}
            step="1"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mileageMin">Min mileage</Label>
          <Input
            id="mileageMin"
            name="mileageMin"
            type="number"
            inputMode="numeric"
            defaultValue={filters.mileageMin ?? ''}
            placeholder="0"
            min={0}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={pending} className="cursor-pointer">
          {pending ? 'Searching…' : 'Apply filters'}
        </Button>
        {active && (
          <p className="text-xs text-muted-foreground">Filters active</p>
        )}
      </div>
    </form>
  )
}
