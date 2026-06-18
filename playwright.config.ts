import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT ?? 3000)
const BASE_URL = `http://localhost:${PORT}`

/** Forward E2E creds into the spawned dev server (Playwright webServer child). */
function webServerEnv(): Record<string, string> {
  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) env[key] = value
  }
  env.NEXT_PUBLIC_PLATFORM_HOST = process.env.NEXT_PUBLIC_PLATFORM_HOST ?? 'localhost:3000'
  return env
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 120_000,
  expect: { timeout: 20_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 60_000,
    actionTimeout: 20_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node e2e/run-dev-server.mjs',
    url: BASE_URL,
    timeout: 180_000,
    env: webServerEnv(),
    // Never reuse a dev server on :3000 — it would still point at the dev Supabase project.
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
