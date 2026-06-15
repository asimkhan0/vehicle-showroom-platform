import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { loadLocalEnv } from './env'

loadLocalEnv()

// Service-role client. SERVER/TEST ONLY — bypasses RLS. Used to provision a
// pre-confirmed test user (so we skip the email-confirmation step) and to tear
// it down afterwards. Deleting the auth user cascades through public.users →
// showrooms → vehicles → images/inquiries (see init migration FKs), so a single
// delete cleans up everything the happy-path test creates.
function adminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
        'Set them in showroom-web/.env.local before running e2e tests.',
    )
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type TestUser = { id: string; email: string; password: string }

export async function createConfirmedUser(): Promise<TestUser> {
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  const email = `e2e-${unique}@example.com`
  const password = 'e2e-Password-123!'

  const { data, error } = await adminClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error || !data.user) {
    throw new Error(`Failed to create test user: ${error?.message ?? 'unknown error'}`)
  }

  return { id: data.user.id, email, password }
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await adminClient().auth.admin.deleteUser(id)
  // Cleanup failures shouldn't fail the suite, but surface them.
  if (error) console.warn(`Failed to delete test user ${id}: ${error.message}`)
}
