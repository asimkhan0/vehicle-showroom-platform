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
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { submitInquiry, type InquiryState } from '../_actions/inquiries'

const SUGGESTED_QUESTIONS = [
  'Is this vehicle still available?',
  'Can I schedule a test drive?',
  'Do you accept trade-ins?',
  'Is the price negotiable?',
]

export function InquiryCTA({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex w-full cursor-pointer items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold',
        'bg-[color:var(--tenant-accent)] text-[color:var(--tenant-accent-ink)]',
        'transition-opacity duration-200 hover:opacity-90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--tenant-accent)] focus-visible:ring-offset-2',
        className,
      )}
    >
      {label}
    </span>
  )
}

export function InquiryDialog({
  showroomId,
  vehicleId,
  vehicleTitle,
  dealerName,
  showMobileBar = true,
}: {
  showroomId: string
  vehicleId: string
  vehicleTitle: string
  dealerName: string
  showMobileBar?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(
    `I'm interested in the ${vehicleTitle}. Is it still available?`,
  )
  const [state, formAction, pending] = useActionState<InquiryState, FormData>(
    submitInquiry,
    {},
  )

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => setOpen(false), 1500)
      return () => clearTimeout(t)
    }
  }, [state.success])

  const triggerLabel = `Message ${dealerName}`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hidden w-full md:block">
        <InquiryCTA label={triggerLabel} />
      </DialogTrigger>

      {showMobileBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-sm md:hidden">
          <DialogTrigger className="w-full">
            <InquiryCTA label={triggerLabel} />
          </DialogTrigger>
        </div>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inquire about {vehicleTitle}</DialogTitle>
          <DialogDescription>
            We&apos;ll forward your message to {dealerName}. They typically respond within a
            day.
          </DialogDescription>
        </DialogHeader>

        {state.success ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
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
                    Phone <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Input id="inq-phone" name="phone" type="tel" maxLength={40} />
                  <FieldError>{state.fieldErrors?.phone}</FieldError>
                </Field>
              </div>

              <Field data-invalid={!!state.fieldErrors?.message}>
                <FieldLabel htmlFor="inq-message">Message</FieldLabel>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setMessage(q)}
                      className="cursor-pointer rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <Textarea
                  id="inq-message"
                  name="message"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'cursor-pointer',
                )}
              >
                Cancel
              </DialogClose>
              <Button type="submit" disabled={pending} className="cursor-pointer">
                {pending ? 'Sending…' : 'Send inquiry'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
