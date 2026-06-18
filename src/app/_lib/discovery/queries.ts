import { createClient } from '@/lib/supabase/server'
import type { DiscoveryFilters } from './search-params'
import { DISCOVERY_PAGE_SIZE } from './search-params'

export type DiscoveryListing = {
  id: string
  title: string
  make: string | null
  model: string | null
  year: number | null
  price_cents: number | null
  mileage: number | null
  primary_image: string | null
  showroom_slug: string
  showroom_name: string
}

export type DiscoveryResult = {
  listings: DiscoveryListing[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  error?: string
}

function ilikeContains(value: string): string {
  const escaped = value.replace(/[%_\\]/g, '\\$&')
  return `%${escaped}%`
}

type VehicleRow = {
  id: string
  title: string
  make: string | null
  model: string | null
  year: number | null
  price_cents: number | null
  mileage: number | null
  showrooms: { slug: string; name: string; status: string } | { slug: string; name: string; status: string }[]
  vehicle_images: Array<{
    storage_path: string
    is_primary: boolean
    sort_order: number
  }> | null
}

function primaryImageFromRow(
  imgs: VehicleRow['vehicle_images'],
): string | null {
  if (!imgs?.length) return null
  const primary =
    imgs.find((i) => i.is_primary) ??
    imgs.slice().sort((a, b) => a.sort_order - b.sort_order)[0]
  return primary?.storage_path ?? null
}

function mapRow(row: VehicleRow): DiscoveryListing | null {
  const showroom = Array.isArray(row.showrooms) ? row.showrooms[0] : row.showrooms
  if (!showroom || showroom.status !== 'active') return null

  return {
    id: row.id,
    title: row.title,
    make: row.make,
    model: row.model,
    year: row.year,
    price_cents: row.price_cents,
    mileage: row.mileage,
    primary_image: primaryImageFromRow(row.vehicle_images),
    showroom_slug: showroom.slug,
    showroom_name: showroom.name,
  }
}

export async function searchPublishedListings(
  filters: DiscoveryFilters,
): Promise<DiscoveryResult> {
  const supabase = await createClient()
  const page = filters.page
  const from = (page - 1) * DISCOVERY_PAGE_SIZE
  const to = from + DISCOVERY_PAGE_SIZE - 1

  let query = supabase
    .from('vehicles')
    .select(
      `
      id, title, make, model, year, price_cents, mileage,
      showrooms!inner(slug, name, status),
      vehicle_images(storage_path, is_primary, sort_order)
    `,
      { count: 'exact' },
    )
    .eq('status', 'published')
    .eq('showrooms.status', 'active')
    .order('published_at', { ascending: false })

  if (filters.make) {
    query = query.ilike('make', ilikeContains(filters.make))
  }
  if (filters.model) {
    query = query.ilike('model', ilikeContains(filters.model))
  }
  if (filters.year != null) {
    query = query.eq('year', filters.year)
  }
  if (filters.priceMin != null) {
    query = query.gte('price_cents', filters.priceMin)
  }
  if (filters.priceMax != null) {
    query = query.lte('price_cents', filters.priceMax)
  }
  if (filters.mileageMin != null) {
    query = query.gte('mileage', filters.mileageMin)
  }
  if (filters.mileageMax != null) {
    query = query.lte('mileage', filters.mileageMax)
  }

  const { data, count, error } = await query.range(from, to)

  if (error) {
    console.error('discovery search failed', error)
    return {
      listings: [],
      total: 0,
      page,
      pageSize: DISCOVERY_PAGE_SIZE,
      totalPages: 0,
      error: error.message,
    }
  }

  const listings = (data ?? [])
    .map((row) => mapRow(row as VehicleRow))
    .filter((row): row is DiscoveryListing => row != null)

  const total = count ?? 0
  const totalPages = total === 0 ? 0 : Math.ceil(total / DISCOVERY_PAGE_SIZE)

  return {
    listings,
    total,
    page,
    pageSize: DISCOVERY_PAGE_SIZE,
    totalPages,
  }
}

export type SitemapShowroom = { slug: string; updated_at: string }
export type SitemapVehicle = {
  id: string
  showroom_slug: string
  updated_at: string
}

export async function getSitemapShowrooms(): Promise<SitemapShowroom[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('showrooms')
    .select('slug, updated_at')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })

  return (data ?? []).map((s) => ({
    slug: s.slug,
    updated_at: s.updated_at,
  }))
}

export async function getSitemapPublishedVehicles(): Promise<SitemapVehicle[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vehicles')
    .select('id, updated_at, showrooms!inner(slug, status)')
    .eq('status', 'published')
    .eq('showrooms.status', 'active')
    .order('updated_at', { ascending: false })

  return (data ?? [])
    .map((row) => {
      const showroom = Array.isArray(row.showrooms) ? row.showrooms[0] : row.showrooms
      if (!showroom?.slug) return null
      return {
        id: row.id,
        showroom_slug: showroom.slug,
        updated_at: row.updated_at,
      }
    })
    .filter((row): row is SitemapVehicle => row != null)
}
