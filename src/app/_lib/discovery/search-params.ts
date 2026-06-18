import { z } from 'zod'

export const DISCOVERY_PAGE_SIZE = 24

const optionalNonNegInt = z.preprocess(
  (v) => (v === '' || v == null ? undefined : Number(v)),
  z.number().int().min(0).optional(),
)

export const discoveryFiltersSchema = z.object({
  make: z.string().trim().max(80).optional(),
  model: z.string().trim().max(80).optional(),
  priceMin: optionalNonNegInt,
  priceMax: optionalNonNegInt,
  year: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().int().min(1900).max(2100).optional(),
  ),
  mileageMin: optionalNonNegInt,
  mileageMax: optionalNonNegInt,
  page: z.preprocess(
    (v) => (v === '' || v == null ? 1 : Number(v)),
    z.number().int().min(1).default(1),
  ),
})

export type DiscoveryFilters = z.infer<typeof discoveryFiltersSchema>

function firstParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = searchParams[key]
  return Array.isArray(v) ? v[0] : v
}

function parseOptionalString(value: string | undefined, max = 80): string | undefined {
  const result = z.string().trim().max(max).optional().safeParse(value || undefined)
  return result.success ? result.data : undefined
}

function parseOptionalNonNegInt(value: string | undefined): number | undefined {
  if (!value) return undefined
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return undefined
  return n
}

function parseYear(value: string | undefined): number | undefined {
  if (!value) return undefined
  const n = Number(value)
  if (!Number.isFinite(n) || n < 1900 || n > 2100 || !Number.isInteger(n)) return undefined
  return n
}

function parsePage(value: string | undefined): number {
  if (!value) return 1
  const n = Number(value)
  if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) return 1
  return n
}

export function parseDiscoverySearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): DiscoveryFilters {
  const filters: DiscoveryFilters = {
    make: parseOptionalString(firstParam(searchParams, 'make')),
    model: parseOptionalString(firstParam(searchParams, 'model')),
    priceMin: parseOptionalNonNegInt(firstParam(searchParams, 'priceMin')),
    priceMax: parseOptionalNonNegInt(firstParam(searchParams, 'priceMax')),
    year: parseYear(firstParam(searchParams, 'year')),
    mileageMin: parseOptionalNonNegInt(firstParam(searchParams, 'mileageMin')),
    mileageMax: parseOptionalNonNegInt(firstParam(searchParams, 'mileageMax')),
    page: parsePage(firstParam(searchParams, 'page')),
  }
  if (
    filters.priceMin != null &&
    filters.priceMax != null &&
    filters.priceMin > filters.priceMax
  ) {
    const { priceMin, priceMax } = filters
    filters.priceMin = priceMax
    filters.priceMax = priceMin
  }
  if (
    filters.mileageMin != null &&
    filters.mileageMax != null &&
    filters.mileageMin > filters.mileageMax
  ) {
    const { mileageMin, mileageMax } = filters
    filters.mileageMin = mileageMax
    filters.mileageMax = mileageMin
  }
  return filters
}

export function discoveryFiltersToSearchParams(filters: DiscoveryFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.make) params.set('make', filters.make)
  if (filters.model) params.set('model', filters.model)
  if (filters.priceMin != null) params.set('priceMin', String(filters.priceMin))
  if (filters.priceMax != null) params.set('priceMax', String(filters.priceMax))
  if (filters.year != null) params.set('year', String(filters.year))
  if (filters.mileageMin != null) params.set('mileageMin', String(filters.mileageMin))
  if (filters.mileageMax != null) params.set('mileageMax', String(filters.mileageMax))
  if (filters.page > 1) params.set('page', String(filters.page))
  return params
}

export function hasActiveFilters(filters: DiscoveryFilters): boolean {
  return Boolean(
    filters.make ||
      filters.model ||
      filters.priceMin != null ||
      filters.priceMax != null ||
      filters.year != null ||
      filters.mileageMin != null ||
      filters.mileageMax != null,
  )
}
