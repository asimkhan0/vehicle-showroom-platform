'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'
import { VEHICLE_IMAGES_BUCKET } from '@/lib/storage'

// Called after the browser has already uploaded the file to Supabase Storage.
// We record the storage path in vehicle_images so the public site can render it.
export async function recordVehicleImage(input: {
  showroomId: string
  vehicleId: string
  storagePath: string
}) {
  const { supabase } = await requireUser()

  // Find current count for sort_order; first upload becomes primary.
  const { data: existing } = await supabase
    .from('vehicle_images')
    .select('id', { count: 'exact', head: false })
    .eq('vehicle_id', input.vehicleId)

  const sortOrder = existing?.length ?? 0
  const isPrimary = sortOrder === 0

  const { error } = await supabase.from('vehicle_images').insert({
    vehicle_id: input.vehicleId,
    storage_path: input.storagePath,
    sort_order: sortOrder,
    is_primary: isPrimary,
  })

  if (error) {
    // Clean up the orphaned object — caller already uploaded it.
    await supabase.storage.from(VEHICLE_IMAGES_BUCKET).remove([input.storagePath])
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/${input.showroomId}/vehicles/${input.vehicleId}`)
}

export async function setPrimaryImage(formData: FormData) {
  const showroomId = String(formData.get('showroomId') ?? '')
  const vehicleId = String(formData.get('vehicleId') ?? '')
  const imageId = String(formData.get('imageId') ?? '')
  if (!showroomId || !vehicleId || !imageId) return

  const { supabase } = await requireUser()

  // Clear current primary, then set the new one. RLS keeps this scoped.
  await supabase.from('vehicle_images').update({ is_primary: false }).eq('vehicle_id', vehicleId)
  await supabase.from('vehicle_images').update({ is_primary: true }).eq('id', imageId)

  revalidatePath(`/dashboard/${showroomId}/vehicles/${vehicleId}`)
}

export async function deleteVehicleImage(formData: FormData) {
  const showroomId = String(formData.get('showroomId') ?? '')
  const vehicleId = String(formData.get('vehicleId') ?? '')
  const imageId = String(formData.get('imageId') ?? '')
  if (!showroomId || !vehicleId || !imageId) return

  const { supabase } = await requireUser()

  const { data: img } = await supabase
    .from('vehicle_images')
    .select('storage_path, is_primary')
    .eq('id', imageId)
    .maybeSingle()

  if (!img) return

  await supabase.storage.from(VEHICLE_IMAGES_BUCKET).remove([img.storage_path])
  await supabase.from('vehicle_images').delete().eq('id', imageId)

  // If we removed the primary, promote the next one (lowest sort_order).
  if (img.is_primary) {
    const { data: next } = await supabase
      .from('vehicle_images')
      .select('id')
      .eq('vehicle_id', vehicleId)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (next) {
      await supabase.from('vehicle_images').update({ is_primary: true }).eq('id', next.id)
    }
  }

  revalidatePath(`/dashboard/${showroomId}/vehicles/${vehicleId}`)
}
