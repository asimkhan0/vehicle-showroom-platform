import { config } from 'dotenv'

// Single source of truth: .env.local holds dev creds (NEXT_PUBLIC_*) and e2e creds
// (E2E_*). Next.js ignores E2E_* during normal `pnpm dev`. Playwright maps
// E2E_* → NEXT_PUBLIC_* for the test process and the spawned dev server.
config({ path: '.env.local', override: false })

export function hasE2eConfigured(): boolean {
  return !!(
    process.env.E2E_SUPABASE_URL &&
    process.env.E2E_SUPABASE_ANON_KEY &&
    process.env.E2E_SUPABASE_SERVICE_ROLE_KEY
  )
}

/** Map E2E_* vars onto the names Next.js / Supabase clients expect. */
export function applyE2eSupabaseEnv(): void {
  if (!hasE2eConfigured()) {
    throw new Error(
      'E2E_SUPABASE_URL, E2E_SUPABASE_ANON_KEY, and E2E_SUPABASE_SERVICE_ROLE_KEY ' +
        'must be set in .env.local (or injected via CI secrets).',
    )
  }
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.E2E_SUPABASE_URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.E2E_SUPABASE_ANON_KEY
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.E2E_SUPABASE_SERVICE_ROLE_KEY
}

applyE2eSupabaseEnv()
