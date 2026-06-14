'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'

const numericString = z
  .union([z.string(), z.number()])
  .transform((v) => (v === '' || v === null || v === undefined ? null : Number(v)))
  .pipe(z.number().nullable())

const vehicleSchema = z.object({
  title: z.string().min(2).max(120),
  make: z.string().max(60).optional().or(z.literal('').transform(() => undefined)),
  model: z.string().max(60).optional().or(z.literal('').transform(() => undefined)),
  year: numericString.refine((v) => v === null || (v >= 1900 && v <= 2100), 'Invalid year'),
  price_cents: numericString.refine((v) => v === null || v >= 0, 'Invalid price'),
  mileage: numericString.refine((v) => v === null || v >= 0, 'Invalid mileage'),
  body_type: z.string().max(40).optional().or(z.literal('').transform(() => undefined)),
  transmission: z.string().max(40).optional().or(z.literal('').transform(() => undefined)),
  fuel: z.string().max(40).optional().or(z.literal('').transform(() => undefined)),
  vin: z.string().max(40).optional().or(z.literal('').transform(() => undefined)),
  description: z.string().max(8000).optional().or(z.literal('').transform(() => undefined)),
  status: z.enum(['draft', 'published', 'sold']),
})

export type VehicleState = {
  error?: string
  fieldErrors?: Record<string, string>
}

function readForm(formData: FormData) {
  // Convert price from dollars in the UI to cents in the DB.
  const priceStr = String(formData.get('price') ?? '').trim()
  const price_cents = priceStr === '' ? '' : Math.round(Number(priceStr) * 100)

  return {
    title: formData.get('title') ?? '',
    make: formData.get('make') ?? '',
    model: formData.get('model') ?? '',
    year: formData.get('year') ?? '',
    price_cents,
    mileage: formData.get('mileage') ?? '',
    body_type: formData.get('body_type') ?? '',
    transmission: formData.get('transmission') ?? '',
    fuel: formData.get('fuel') ?? '',
    vin: formData.get('vin') ?? '',
    description: formData.get('description') ?? '',
    status: formData.get('status') ?? 'draft',
  }
}

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {}
  for (const issue of error.issues) out[String(issue.path[0])] = issue.message
  return out
}

export async function createVehicle(
  _: VehicleState,
  formData: FormData,
): Promise<VehicleState> {
  const showroomId = String(formData.get('showroomId') ?? '')
  if (!showroomId) return { error: 'Missing showroom id' }

  const parsed = vehicleSchema.safeParse(readForm(formData))
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) }

  const { supabase } = await requireUser()

  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      showroom_id: showroomId,
      ...parsed.data,
      published_at: parsed.data.status === 'published' ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${showroomId}/vehicles`)
  redirect(`/dashboard/${showroomId}/vehicles/${data.id}`)
}

export async function updateVehicle(
  _: VehicleState,
  formData: FormData,
): Promise<VehicleState> {
  const showroomId = String(formData.get('showroomId') ?? '')
  const vehicleId = String(formData.get('vehicleId') ?? '')
  if (!showroomId || !vehicleId) return { error: 'Missing identifiers' }

  const parsed = vehicleSchema.safeParse(readForm(formData))
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) }

  const { supabase } = await requireUser()

  // Fetch current to decide if we should set published_at.
  const { data: existing } = await supabase
    .from('vehicles')
    .select('status, published_at')
    .eq('id', vehicleId)
    .maybeSingle()

  const published_at =
    parsed.data.status === 'published' && existing?.status !== 'published'
      ? new Date().toISOString()
      : existing?.published_at ?? null

  const { error } = await supabase
    .from('vehicles')
    .update({ ...parsed.data, published_at })
    .eq('id', vehicleId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${showroomId}/vehicles`)
  revalidatePath(`/dashboard/${showroomId}/vehicles/${vehicleId}`)
  return {}
}

export async function deleteVehicle(formData: FormData) {
  const showroomId = String(formData.get('showroomId') ?? '')
  const vehicleId = String(formData.get('vehicleId') ?? '')
  if (!showroomId || !vehicleId) return

  const { supabase } = await requireUser()
  await supabase.from('vehicles').delete().eq('id', vehicleId)

  revalidatePath(`/dashboard/${showroomId}/vehicles`)
  redirect(`/dashboard/${showroomId}/vehicles`)
}
