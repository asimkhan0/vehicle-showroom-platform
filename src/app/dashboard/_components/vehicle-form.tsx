'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { VehicleState } from '../_actions/vehicles'

export type VehicleInitial = {
  id?: string
  title: string
  make: string | null
  model: string | null
  year: number | null
  price_cents: number | null
  mileage: number | null
  body_type: string | null
  transmission: string | null
  fuel: string | null
  vin: string | null
  description: string | null
  status: 'draft' | 'published' | 'sold'
}

type Props = {
  action: (state: VehicleState, formData: FormData) => Promise<VehicleState>
  showroomId: string
  initial?: VehicleInitial
  submitLabel: string
}

const empty: VehicleInitial = {
  title: '',
  make: '',
  model: '',
  year: null,
  price_cents: null,
  mileage: null,
  body_type: '',
  transmission: '',
  fuel: '',
  vin: '',
  description: '',
  status: 'draft',
}

export function VehicleForm({ action, showroomId, initial = empty, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<VehicleState, FormData>(action, {})

  const priceDefault = initial.price_cents != null ? (initial.price_cents / 100).toFixed(2) : ''

  return (
    <form action={formAction}>
      <input type="hidden" name="showroomId" value={showroomId} />
      {initial.id && <input type="hidden" name="vehicleId" value={initial.id} />}

      <FieldGroup>
        <Field data-invalid={!!state.fieldErrors?.title}>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" name="title" required defaultValue={initial.title} />
          <FieldError>{state.fieldErrors?.title}</FieldError>
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="make">Make</FieldLabel>
            <Input id="make" name="make" defaultValue={initial.make ?? ''} />
          </Field>
          <Field>
            <FieldLabel htmlFor="model">Model</FieldLabel>
            <Input id="model" name="model" defaultValue={initial.model ?? ''} />
          </Field>
          <Field data-invalid={!!state.fieldErrors?.year}>
            <FieldLabel htmlFor="year">Year</FieldLabel>
            <Input
              id="year"
              name="year"
              type="number"
              min={1900}
              max={2100}
              defaultValue={initial.year ?? ''}
            />
            <FieldError>{state.fieldErrors?.year}</FieldError>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!state.fieldErrors?.price_cents}>
            <FieldLabel htmlFor="price">Price (USD)</FieldLabel>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step="0.01"
              defaultValue={priceDefault}
            />
            <FieldError>{state.fieldErrors?.price_cents}</FieldError>
          </Field>
          <Field data-invalid={!!state.fieldErrors?.mileage}>
            <FieldLabel htmlFor="mileage">Mileage</FieldLabel>
            <Input
              id="mileage"
              name="mileage"
              type="number"
              min={0}
              defaultValue={initial.mileage ?? ''}
            />
            <FieldError>{state.fieldErrors?.mileage}</FieldError>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="body_type">Body</FieldLabel>
            <Input id="body_type" name="body_type" defaultValue={initial.body_type ?? ''} />
          </Field>
          <Field>
            <FieldLabel htmlFor="transmission">Transmission</FieldLabel>
            <Input id="transmission" name="transmission" defaultValue={initial.transmission ?? ''} />
          </Field>
          <Field>
            <FieldLabel htmlFor="fuel">Fuel</FieldLabel>
            <Input id="fuel" name="fuel" defaultValue={initial.fuel ?? ''} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="vin">VIN</FieldLabel>
          <Input id="vin" name="vin" defaultValue={initial.vin ?? ''} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={initial.description ?? ''}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Select name="status" defaultValue={initial.status}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
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
