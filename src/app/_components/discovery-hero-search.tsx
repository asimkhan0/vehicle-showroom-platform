'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { POPULAR_MAKES } from '@/app/_components/platform-footer'
import { discoveryFiltersToSearchParams } from '@/app/_lib/discovery/search-params'

export function DiscoveryHeroSearch() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const make = String(fd.get('make') ?? '').trim()
    const model = String(fd.get('model') ?? '').trim()
    const params = discoveryFiltersToSearchParams({
      make: make || undefined,
      model: model || undefined,
      page: 1,
    })
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `/?${qs}` : '/')
    })
  }

  function searchMake(make: string) {
    const params = discoveryFiltersToSearchParams({ make, page: 1 })
    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-4">
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
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Popular:
        </span>
        {POPULAR_MAKES.map((make) => (
          <button
            key={make}
            type="button"
            onClick={() => searchMake(make)}
            disabled={pending}
            className="cursor-pointer rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-muted disabled:opacity-50"
          >
            {make}
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
