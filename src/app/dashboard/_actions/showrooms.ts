'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { RESERVED_SLUGS, slugSchema } from '@/lib/validation'

const showroomSchema = z.object({
  name: z.string().min(2, 'At least 2 characters').max(80),
  slug: slugSchema,
  bio: z.string().max(2000).optional().or(z.literal('').transform(() => undefined)),
})

export type ShowroomState = {
  error?: string
  fieldErrors?: Record<string, string>
}

export async function createShowroom(
  _: ShowroomState,
  formData: FormData,
): Promise<ShowroomState> {
  const parsed = showroomSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    bio: formData.get('bio'),
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message
    }
    return { fieldErrors }
  }

  if (RESERVED_SLUGS.has(parsed.data.slug)) {
    return { fieldErrors: { slug: 'That slug is reserved' } }
  }

  const { supabase, user } = await requireUser()

  const { data, error } = await supabase
    .from('showrooms')
    .insert({
      owner_user_id: user.id,
      name: parsed.data.name,
      slug: parsed.data.slug,
      bio: parsed.data.bio ?? null,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { fieldErrors: { slug: 'That slug is already taken' } }
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect(`/dashboard/${data.id}/vehicles`)
}

export async function updateShowroom(
  _: ShowroomState,
  formData: FormData,
): Promise<ShowroomState> {
  const showroomId = String(formData.get('showroomId') ?? '')
  if (!showroomId) return { error: 'Missing showroom id' }

  const parsed = showroomSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    bio: formData.get('bio'),
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message
    }
    return { fieldErrors }
  }

  if (RESERVED_SLUGS.has(parsed.data.slug)) {
    return { fieldErrors: { slug: 'That slug is reserved' } }
  }

  const { supabase } = await requireUser()

  const { error } = await supabase
    .from('showrooms')
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      bio: parsed.data.bio ?? null,
    })
    .eq('id', showroomId)

  if (error) {
    if (error.code === '23505') return { fieldErrors: { slug: 'That slug is already taken' } }
    return { error: error.message }
  }

  revalidatePath(`/dashboard/${showroomId}/settings`)
  return {}
}
