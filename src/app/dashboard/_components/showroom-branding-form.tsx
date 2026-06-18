'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { extFromMime, publicImageUrl, showroomCoverPath, VEHICLE_IMAGES_BUCKET } from '@/lib/storage'
import { createClient } from '@/lib/supabase/client'
import type { BrandingState } from '../_actions/showrooms'

type VehicleOption = { id: string; title: string }

type Props = {
  action: (state: BrandingState, formData: FormData) => Promise<BrandingState>
  showroomId: string
  initialCoverPath?: string | null
  initialFeatured?: string[]
  publishedVehicles: VehicleOption[]
}

export function ShowroomBrandingForm({
  action,
  showroomId,
  initialCoverPath,
  initialFeatured = [],
  publishedVehicles,
}: Props) {
  const [state, formAction, pending] = useActionState<BrandingState, FormData>(action, {})
  const [coverPath, setCoverPath] = useState(initialCoverPath ?? '')
  const [featuredIds, setFeaturedIds] = useState<string[]>(initialFeatured)

  async function onCoverSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const supabase = createClient()
    const path = showroomCoverPath({
      showroomId,
      ext: extFromMime(file.type),
    })
    const { error } = await supabase.storage.from(VEHICLE_IMAGES_BUCKET).upload(path, file, {
      upsert: false,
    })
    if (error) {
      alert(error.message)
      return
    }
    setCoverPath(path)
  }

  function toggleFeatured(id: string, checked: boolean) {
    setFeaturedIds((current) => {
      if (checked) return [...current, id].slice(0, 3)
      return current.filter((x) => x !== id)
    })
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="showroomId" value={showroomId} />
      <input type="hidden" name="coverImagePath" value={coverPath} />
      <input type="hidden" name="featured" value={featuredIds.join(',')} />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="cover-upload">Cover image</FieldLabel>
          <FieldDescription>
            Optional wide banner for your storefront (21:9 recommended).
          </FieldDescription>
          {coverPath && (
            <div className="relative mb-3 aspect-[21/9] overflow-hidden rounded-lg border border-border">
              <Image
                src={publicImageUrl(coverPath)}
                alt=""
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
          )}
          <input
            id="cover-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onCoverSelected}
            className="text-sm"
          />
        </Field>

        {publishedVehicles.length > 0 && (
          <Field>
            <FieldLabel>Featured vehicles</FieldLabel>
            <FieldDescription>Pick up to 3 spotlight listings for your storefront.</FieldDescription>
            <ul className="mt-2 space-y-2">
              {publishedVehicles.map((v) => (
                <li key={v.id}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={featuredIds.includes(v.id)}
                      onChange={(e) => toggleFeatured(v.id, e.target.checked)}
                      className="size-4 rounded border-border"
                    />
                    {v.title}
                  </label>
                </li>
              ))}
            </ul>
          </Field>
        )}

        {state.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="text-sm text-emerald-700 dark:text-emerald-400">Branding saved.</p>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save branding'}
        </Button>
      </FieldGroup>
    </form>
  )
}
