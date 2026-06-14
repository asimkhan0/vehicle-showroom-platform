import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service-role client. Bypasses RLS. SERVER ONLY — never import from a client component.
// Use sparingly for privileged operations (e.g. looking up the owner's email
// when forwarding a public inquiry).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing SUPABASE service role configuration')
  }
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
