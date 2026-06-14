'use client'

import { useActionState, useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { submitInquiry, type InquiryState } from '../_actions/inquiries'

export function InquiryDialog({
  showroomId,
  vehicleId,
  vehicleTitle,
}: {
  showroomId: string
  vehicleId: string
  vehicleTitle: string
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<InquiryState, FormData>(
    submitInquiry,
    {},
  )

  // Auto-close on success after a brief moment so the user sees the confirmation.
  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => setOpen(false), 1500)
      return () => clearTimeout(t)
    }
  }, [state.success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="w-full rounded-xl bg-[color:var(--tenant-accent)] px-4 py-3 text-sm font-medium text-[color:var(--tenant-accent-ink)] opacity-90 transition-opacity hover:opacity-100"
      >
        Inquire about this vehicle
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inquire about {vehicleTitle}</DialogTitle>
          <DialogDescription>
            We’ll forward your message to the dealer. They typically respond within a day.
          </DialogDescription>
        </DialogHeader>

        {state.success ? (
          <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
            Sent. The dealer will get back to you shortly.
          </div>
        ) : (
          <form action={formAction}>
            <input type="hidden" name="showroomId" value={showroomId} />
            <input type="hidden" name="vehicleId" value={vehicleId} />

            <FieldGroup>
              <Field data-invalid={!!state.fieldErrors?.name}>
                <FieldLabel htmlFor="inq-name">Name</FieldLabel>
                <Input id="inq-name" name="name" required maxLength={80} />
                <FieldError>{state.fieldErrors?.name}</FieldError>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={!!state.fieldErrors?.email}>
                  <FieldLabel htmlFor="inq-email">Email</FieldLabel>
                  <Input id="inq-email" name="email" type="email" required />
                  <FieldError>{state.fieldErrors?.email}</FieldError>
                </Field>
                <Field data-invalid={!!state.fieldErrors?.phone}>
                  <FieldLabel htmlFor="inq-phone">
                    Phone <span className="text-neutral-400">(optional)</span>
                  </FieldLabel>
                  <Input id="inq-phone" name="phone" type="tel" maxLength={40} />
                  <FieldError>{state.fieldErrors?.phone}</FieldError>
                </Field>
              </div>

              <Field data-invalid={!!state.fieldErrors?.message}>
                <FieldLabel htmlFor="inq-message">Message</FieldLabel>
                <Textarea
                  id="inq-message"
                  name="message"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={2000}
                  defaultValue={`I'm interested in the ${vehicleTitle}. Is it still available?`}
                />
                <FieldError>{state.fieldErrors?.message}</FieldError>
              </Field>

              {state.error && (
                <p role="alert" className="text-sm text-destructive">
                  {state.error}
                </p>
              )}
            </FieldGroup>

            <DialogFooter className="mt-6">
              <DialogClose
                type="button"
                className="rounded-lg px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                Cancel
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? 'Sending…' : 'Send inquiry'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
