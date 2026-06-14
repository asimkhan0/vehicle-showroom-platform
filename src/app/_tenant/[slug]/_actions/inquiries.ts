'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInquiryEmail } from '@/lib/email'

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  message: z.string().trim().min(10, 'Tell the dealer a bit more').max(2000),
  showroomId: z.string().uuid(),
  vehicleId: z.string().uuid(),
})

export type InquiryState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

export async function submitInquiry(
  _: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
    showroomId: formData.get('showroomId'),
    vehicleId: formData.get('vehicleId'),
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message
    }
    return { fieldErrors }
  }

  // Insert via the anon/server client — relies on the
  // inquiries_anyone_insert RLS policy.
  const supabase = await createClient()
  const { error: insertErr } = await supabase.from('inquiries').insert({
    showroom_id: parsed.data.showroomId,
    vehicle_id: parsed.data.vehicleId,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    message: parsed.data.message,
  })

  if (insertErr) return { error: insertErr.message }

  // Best-effort email forward to the showroom owner.
  // Owner email lives behind RLS, so use the service role client.
  try {
    const admin = createAdminClient()
    const { data: showroom } = await admin
      .from('showrooms')
      .select('name, owner_user_id')
      .eq('id', parsed.data.showroomId)
      .maybeSingle()

    const { data: vehicle } = await admin
      .from('vehicles')
      .select('title')
      .eq('id', parsed.data.vehicleId)
      .maybeSingle()

    const { data: owner } = showroom
      ? await admin
          .from('users')
          .select('email')
          .eq('id', showroom.owner_user_id)
          .maybeSingle()
      : { data: null }

    if (showroom && vehicle && owner?.email) {
      const host = (await headers()).get('host') ?? ''
      const proto = host.startsWith('localhost') ? 'http' : 'https'
      const vehicleUrl = `${proto}://${host}/v/${parsed.data.vehicleId}`

      await sendInquiryEmail({
        to: owner.email,
        showroomName: showroom.name,
        vehicleTitle: vehicle.title,
        vehicleUrl,
        inquirer: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone ?? null,
          message: parsed.data.message,
        },
      })
    }
  } catch (err) {
    // Don't fail the user-facing submission if email fails.
    console.error('[inquiry] email forward failed:', err)
  }

  return { success: true }
}
