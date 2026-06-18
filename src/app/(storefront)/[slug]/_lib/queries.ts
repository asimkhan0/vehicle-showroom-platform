import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type ShowroomTheme = {
  accent?: string
  coverImagePath?: string
  featured?: string[]
}

export type Showroom = {
  id: string
  slug: string
  name: string
  bio: string | null
  logo_url: string | null
  theme_json: ShowroomTheme | null
  status: 'active' | 'suspended'
  created_at: string
}

export type VehicleListItem = {
  id: string
  title: string
  make: string | null
  model: string | null
  year: number | null
  price_cents: number | null
  mileage: number | null
  body_type: string | null
  fuel: string | null
  primary_image: string | null
}

export type VehicleDetail = VehicleListItem & {
  transmission: string | null
  vin: string | null
  description: string | null
  images: { id: string; storage_path: string; is_primary: boolean }[]
}

// Cached per request to dedupe layout + page fetches.
export const getShowroomBySlug = cache(async (slug: string): Promise<Showroom | null> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('showrooms')
    .select('id, slug, name, bio, logo_url, theme_json, status, created_at')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()
  return data as Showroom | null
})

export async function getPublishedVehicles(showroomId: string): Promise<VehicleListItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vehicles')
    .select(
      'id, title, make, model, year, price_cents, mileage, body_type, fuel, vehicle_images(storage_path, is_primary, sort_order)',
    )
    .eq('showroom_id', showroomId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (data ?? []).map((v) => {
    const imgs = (v.vehicle_images ?? []) as Array<{
      storage_path: string
      is_primary: boolean
      sort_order: number
    }>
    const primary =
      imgs.find((i) => i.is_primary) ??
      imgs.slice().sort((a, b) => a.sort_order - b.sort_order)[0]
    return {
      id: v.id,
      title: v.title,
      make: v.make,
      model: v.model,
      year: v.year,
      price_cents: v.price_cents,
      mileage: v.mileage,
      body_type: v.body_type,
      fuel: v.fuel,
      primary_image: primary?.storage_path ?? null,
    }
  })
}

export async function getPublishedVehicle(
  showroomId: string,
  vehicleId: string,
): Promise<VehicleDetail | null> {
  const supabase = await createClient()
  const { data: v } = await supabase
    .from('vehicles')
    .select(
      'id, title, make, model, year, price_cents, mileage, body_type, transmission, fuel, vin, description',
    )
    .eq('id', vehicleId)
    .eq('showroom_id', showroomId)
    .eq('status', 'published')
    .maybeSingle()

  if (!v) return null

  const { data: imgs } = await supabase
    .from('vehicle_images')
    .select('id, storage_path, is_primary, sort_order')
    .eq('vehicle_id', vehicleId)
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true })

  const images = (imgs ?? []).map((i) => ({
    id: i.id,
    storage_path: i.storage_path,
    is_primary: i.is_primary,
  }))

  const primary = images[0]

  return {
    id: v.id,
    title: v.title,
    make: v.make,
    model: v.model,
    year: v.year,
    price_cents: v.price_cents,
    mileage: v.mileage,
    body_type: v.body_type,
    transmission: v.transmission,
    fuel: v.fuel,
    vin: v.vin,
    description: v.description,
    primary_image: primary?.storage_path ?? null,
    images,
  }
}

export type SimilarVehicle = VehicleListItem & {
  showroom_slug: string
  showroom_name: string
}

type SimilarRow = {
  id: string
  title: string
  make: string | null
  model: string | null
  year: number | null
  price_cents: number | null
  mileage: number | null
  body_type: string | null
  fuel: string | null
  showrooms: { slug: string; name: string; status: string } | { slug: string; name: string; status: string }[]
  vehicle_images: Array<{
    storage_path: string
    is_primary: boolean
    sort_order: number
  }> | null
}

export async function getSimilarVehicles(
  make: string | null,
  excludeId: string,
  limit = 4,
): Promise<SimilarVehicle[]> {
  if (!make) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from('vehicles')
    .select(
      `id, title, make, model, year, price_cents, mileage, body_type, fuel,
      showrooms!inner(slug, name, status),
      vehicle_images(storage_path, is_primary, sort_order)`,
    )
    .eq('status', 'published')
    .eq('showrooms.status', 'active')
    .ilike('make', make)
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(limit)

  return (data ?? [])
    .map((row) => {
      const r = row as SimilarRow
      const showroom = Array.isArray(r.showrooms) ? r.showrooms[0] : r.showrooms
      if (!showroom) return null
      const imgs = r.vehicle_images ?? []
      const primary =
        imgs.find((i) => i.is_primary) ??
        imgs.slice().sort((a, b) => a.sort_order - b.sort_order)[0]
      const item: SimilarVehicle = {
        id: r.id,
        title: r.title,
        make: r.make,
        model: r.model,
        year: r.year,
        price_cents: r.price_cents,
        mileage: r.mileage,
        body_type: r.body_type,
        fuel: r.fuel,
        primary_image: primary?.storage_path ?? null,
        showroom_slug: showroom.slug,
        showroom_name: showroom.name,
      }
      return item
    })
    .filter((v): v is SimilarVehicle => v != null)
}

export async function getFeaturedVehicles(
  showroomId: string,
  featuredIds: string[],
): Promise<VehicleListItem[]> {
  if (featuredIds.length === 0) return []

  const all = await getPublishedVehicles(showroomId)
  const byId = new Map(all.map((v) => [v.id, v]))
  return featuredIds
    .map((id) => byId.get(id))
    .filter((v): v is VehicleListItem => v != null)
    .slice(0, 3)
}
