'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { ShowroomState } from '../_actions/showrooms'

type Props = {
  action: (state: ShowroomState, formData: FormData) => Promise<ShowroomState>
  initial?: { name: string; slug: string; bio: string | null }
  showroomId?: string
  submitLabel: string
}

export function ShowroomForm({ action, initial, showroomId, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<ShowroomState, FormData>(action, {})

  return (
    <form action={formAction}>
      {showroomId && <input type="hidden" name="showroomId" value={showroomId} />}
      <FieldGroup>
        <Field data-invalid={!!state.fieldErrors?.name}>
          <FieldLabel htmlFor="name">Showroom name</FieldLabel>
          <Input id="name" name="name" required maxLength={80} defaultValue={initial?.name} />
          <FieldError>{state.fieldErrors?.name}</FieldError>
        </Field>

        <Field data-invalid={!!state.fieldErrors?.slug}>
          <FieldLabel htmlFor="slug">URL slug</FieldLabel>
          <Input
            id="slug"
            name="slug"
            required
            minLength={3}
            maxLength={40}
            pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            placeholder="bobs-motors"
            defaultValue={initial?.slug}
          />
          <FieldDescription>
            Used in your URL: <code>{`{slug}.yourdomain.com`}</code>
          </FieldDescription>
          <FieldError>{state.fieldErrors?.slug}</FieldError>
        </Field>

        <Field data-invalid={!!state.fieldErrors?.bio}>
          <FieldLabel htmlFor="bio">About</FieldLabel>
          <Textarea id="bio" name="bio" rows={4} maxLength={2000} defaultValue={initial?.bio ?? ''} />
          <FieldError>{state.fieldErrors?.bio}</FieldError>
        </Field>

        {state.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}
