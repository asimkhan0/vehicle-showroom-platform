import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Minimal .env loader so the Playwright process (and the admin client it uses)
// can read Supabase credentials without pulling in a dotenv dependency.
// Next.js loads .env.local on its own for the dev server; this is only for the
// test harness running outside of Next.
export function loadLocalEnv(file = '.env.local') {
  try {
    const raw = readFileSync(resolve(process.cwd(), file), 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let val = trimmed.slice(eq + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      // Don't clobber values already provided by the real environment (CI).
      if (!(key in process.env)) process.env[key] = val
    }
  } catch {
    // .env.local is optional — in CI the vars come from the environment.
  }
}
