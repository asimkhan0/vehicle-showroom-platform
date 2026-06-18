'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  countActiveFilters,
  discoveryFiltersToSearchParams,
  hasActiveFilters,
  type DiscoveryFilters,
} from '@/app/_lib/discovery/search-params'
import { cn } from '@/lib/utils'

function DiscoveryFiltersForm({
  filters,
  pending,
  onClear,
  idPrefix = '',
}: {
  filters: DiscoveryFilters
  pending: boolean
  onClear: () => void
  idPrefix?: string
}) {
  const active = hasActiveFilters(filters)
  const priceMinDisplay =
    filters.priceMin != null ? String(filters.priceMin / 100) : ''
  const priceMaxDisplay =
    filters.priceMax != null ? String(filters.priceMax / 100) : ''

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Refine search</h2>
        {active && (
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={onClear}
            className="cursor-pointer text-muted-foreground"
          >
            <X className="size-3.5" aria-hidden />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}make`}>Make</Label>
          <Input
            id={`${idPrefix}make`}
            name="make"
            defaultValue={filters.make ?? ''}
            placeholder="Toyota"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}model`}>Model</Label>
          <Input
            id={`${idPrefix}model`}
            name="model"
            defaultValue={filters.model ?? ''}
            placeholder="Supra"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}year`}>Year</Label>
          <Input
            id={`${idPrefix}year`}
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
          <Label htmlFor={`${idPrefix}mileageMax`}>Max mileage</Label>
          <Input
            id={`${idPrefix}mileageMax`}
            name="mileageMax"
            type="number"
            inputMode="numeric"
            defaultValue={filters.mileageMax ?? ''}
            placeholder="50000"
            min={0}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}priceMin`}>Min price ($)</Label>
          <Input
            id={`${idPrefix}priceMin`}
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
          <Label htmlFor={`${idPrefix}priceMax`}>Max price ($)</Label>
          <Input
            id={`${idPrefix}priceMax`}
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
          <Label htmlFor={`${idPrefix}mileageMin`}>Min mileage</Label>
          <Input
            id={`${idPrefix}mileageMin`}
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
        {active && <p className="text-xs text-muted-foreground">Filters active</p>}
      </div>
    </>
  )
}

export function DiscoveryFilters({ filters }: { filters: DiscoveryFilters }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [sheetOpen, setSheetOpen] = useState(false)
  const activeCount = countActiveFilters(filters)

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
      setSheetOpen(false)
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
    startTransition(() => {
      router.push('/')
      setSheetOpen(false)
    })
  }

  const formKey = searchParams.toString()

  return (
    <section aria-label="Search filters">
      <div className="mb-4 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            className={cn(
              'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-sm',
            )}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Refine search</SheetTitle>
            </SheetHeader>
            <form key={`mobile-${formKey}`} onSubmit={onSubmit} className="mt-4 px-1">
              <DiscoveryFiltersForm
                filters={filters}
                pending={pending}
                onClear={clearFilters}
                idPrefix="mobile-"
              />
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <form
        key={formKey}
        onSubmit={onSubmit}
        className={cn(
          'hidden rounded-xl border border-border bg-card p-4 shadow-sm lg:block',
          'lg:sticky lg:top-24 z-10',
        )}
      >
        <DiscoveryFiltersForm
          filters={filters}
          pending={pending}
          onClear={clearFilters}
        />
      </form>
    </section>
  )
}
