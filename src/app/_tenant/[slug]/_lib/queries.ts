import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type Showroom = {
  id: string
  slug: string
  name: string
  bio: string | null
  logo_url: string | null
  theme_json: { accent?: string } | null
  status: 'active' | 'suspended'
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
    .select('id, slug, name, bio, logo_url, theme_json, status')
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
