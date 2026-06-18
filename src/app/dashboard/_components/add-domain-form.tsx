'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { DomainState } from '../_actions/domains'

type Props = {
  action: (state: DomainState, formData: FormData) => Promise<DomainState>
  showroomId: string
}

export function AddDomainForm({ action, showroomId }: Props) {
  const [state, formAction, pending] = useActionState<DomainState, FormData>(action, {})

  return (
    <form action={formAction}>
      <input type="hidden" name="showroomId" value={showroomId} />
      <FieldGroup>
        <Field data-invalid={!!state.fieldErrors?.hostname}>
          <FieldLabel htmlFor="hostname">Custom domain</FieldLabel>
          <Input
            id="hostname"
            name="hostname"
            required
            placeholder="bobsmotors.com"
            autoComplete="off"
          />
          <FieldDescription>
            Add both <code>example.com</code> and <code>www.example.com</code> if you want both to
            work.
          </FieldDescription>
          <FieldError>{state.fieldErrors?.hostname}</FieldError>
        </Field>

        {state.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="text-sm text-green-700 dark:text-green-400">
            {state.success}
          </p>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? 'Adding…' : 'Add domain'}
        </Button>
      </FieldGroup>
    </form>
  )
}
