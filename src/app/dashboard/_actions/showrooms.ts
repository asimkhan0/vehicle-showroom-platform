'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { RESERVED_SLUGS, slugSchema } from '@/lib/validation'
import { syncActiveDomainsForShowroom } from './domains'

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

  const { data: previous } = await supabase
    .from('showrooms')
    .select('slug')
    .eq('id', showroomId)
    .maybeSingle()

  if (previous?.slug !== parsed.data.slug) {
    try {
      await syncActiveDomainsForShowroom(showroomId, parsed.data.slug)
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? `Could not update custom domain routing: ${error.message}`
            : 'Could not update custom domain routing',
      }
    }
  }

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

const brandingSchema = z.object({
  showroomId: z.string().uuid(),
  coverImagePath: z.string().max(500).optional().or(z.literal('').transform(() => undefined)),
  featured: z
    .string()
    .optional()
    .transform((v) => {
      if (!v?.trim()) return [] as string[]
      return v.split(',').map((s) => s.trim()).filter(Boolean)
    })
    .pipe(z.array(z.string().uuid()).max(3)),
})

export type BrandingState = {
  error?: string
  success?: boolean
}

export async function updateShowroomBranding(
  _: BrandingState,
  formData: FormData,
): Promise<BrandingState> {
  const showroomId = String(formData.get('showroomId') ?? '')
  const parsed = brandingSchema.safeParse({
    showroomId,
    coverImagePath: formData.get('coverImagePath'),
    featured: formData.get('featured'),
  })

  if (!parsed.success) {
    return { error: 'Invalid branding settings' }
  }

  const { supabase } = await requireUser()

  const { data: existing } = await supabase
    .from('showrooms')
    .select('theme_json')
    .eq('id', parsed.data.showroomId)
    .maybeSingle()

  const theme = (existing?.theme_json ?? {}) as Record<string, unknown>
  const nextTheme = {
    ...theme,
    coverImagePath: parsed.data.coverImagePath,
    featured: parsed.data.featured,
  }

  const { error } = await supabase
    .from('showrooms')
    .update({ theme_json: nextTheme })
    .eq('id', parsed.data.showroomId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${parsed.data.showroomId}/settings`)
  const { data: slugRow } = await supabase
    .from('showrooms')
    .select('slug')
    .eq('id', parsed.data.showroomId)
    .maybeSingle()
  if (slugRow?.slug) {
    revalidatePath(`/${slugRow.slug}`)
  }
  return { success: true }
}
