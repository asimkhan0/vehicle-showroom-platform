// Spawns `next dev` with E2E_* creds mapped into process.env BEFORE Next boots,
// so .env.local dev keys cannot win over the dedicated e2e Supabase project.
import { spawn } from 'node:child_process'
import { config } from 'dotenv'

config({ path: '.env.local', override: false })

const required = [
  'E2E_SUPABASE_URL',
  'E2E_SUPABASE_ANON_KEY',
  'E2E_SUPABASE_SERVICE_ROLE_KEY',
]
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[e2e] Missing ${key} in .env.local`)
    process.exit(1)
  }
}

process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.E2E_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.E2E_SUPABASE_ANON_KEY
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.E2E_SUPABASE_SERVICE_ROLE_KEY

const child = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => process.exit(code ?? 1))
