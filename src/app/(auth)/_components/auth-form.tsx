'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { AuthState } from '../actions'

type Props = {
  mode: 'sign-in' | 'sign-up'
  action: (state: AuthState, formData: FormData) => Promise<AuthState>
}

const COPY = {
  'sign-in': {
    title: 'Sign in',
    description: 'Welcome back to your dealer dashboard.',
    submit: 'Sign in',
    altText: 'No account?',
    altLink: '/signup',
    altLabel: 'Create one',
  },
  'sign-up': {
    title: 'Create an account',
    description: 'Start your showroom in minutes.',
    submit: 'Create account',
    altText: 'Already have an account?',
    altLink: '/login',
    altLabel: 'Sign in',
  },
} as const

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {})
  const copy = COPY[mode]

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field data-invalid={!!state.fieldErrors?.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
              <FieldError>{state.fieldErrors?.email}</FieldError>
            </Field>
            <Field data-invalid={!!state.fieldErrors?.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                required
                minLength={8}
              />
              <FieldError>{state.fieldErrors?.password}</FieldError>
            </Field>

            {state.error && (
              <p role="alert" className="text-sm text-destructive">
                {state.error}
              </p>
            )}
            {state.success && (
              <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">
                {state.success}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full cursor-pointer">
              {pending ? 'Working…' : copy.submit}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {copy.altText}{' '}
              <Link
                href={copy.altLink}
                className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
              >
                {copy.altLabel}
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
