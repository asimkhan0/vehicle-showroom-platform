import type { Page } from '@playwright/test'
import type { TestUser } from './admin'

export const PLATFORM_HOST = process.env.NEXT_PUBLIC_PLATFORM_HOST ?? 'localhost:3000'

export function uniqueSlug() {
  return `e2e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function storefrontOrigin(slug: string) {
  return `http://${slug}.${PLATFORM_HOST}`
}

export function platformOrigin() {
  return `http://${PLATFORM_HOST}`
}

export async function signIn(page: Page, user: TestUser) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(user.email)
  await page.getByLabel('Password').fill(user.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL(/\/dashboard(\/.*)?$/)
}

export async function selectStatus(page: Page, label: string) {
  await page.locator('#status').click()
  await page.getByRole('option', { name: label, exact: true }).click()
}

export async function createShowroom(
  page: Page,
  opts: { name: string; slug: string; bio?: string },
): Promise<string> {
  if (!page.url().includes('/onboarding')) {
    await page.goto('/dashboard/onboarding')
  }
  await page.getByLabel('Showroom name').fill(opts.name)
  await page.getByLabel('URL slug').fill(opts.slug)
  await page.getByLabel('About').fill(opts.bio ?? 'E2e test showroom.')
  await page.getByRole('button', { name: 'Create showroom' }).click()
  await page.waitForURL('**/dashboard/*/vehicles')
  const showroomId = page.url().match(/dashboard\/([^/]+)\/vehicles/)?.[1]
  if (!showroomId) throw new Error('showroom id not found in URL after create')
  return showroomId
}

export async function createVehicle(
  page: Page,
  opts: { title: string; publish?: boolean },
): Promise<string> {
  await page.getByRole('link', { name: 'Add vehicle' }).click()
  await page.waitForURL('**/vehicles/new')
  await page.getByLabel('Title').fill(opts.title)
  await page.getByLabel('Make').fill('Toyota')
  await page.getByLabel('Model').fill('Supra')
  await page.getByLabel('Year').fill('2021')
  await page.getByLabel('Price').fill('45999')
  await page.getByLabel('Mileage').fill('12000')
  if (opts.publish) {
    await selectStatus(page, 'Published')
  }
  await page.getByRole('button', { name: 'Create listing' }).click()
  await page.waitForURL(/\/vehicles\/[0-9a-f-]+$/)
  const vehicleId = page.url().split('/vehicles/')[1].split(/[/?#]/)[0]
  if (!vehicleId) throw new Error('vehicle id not found in URL after create')
  return vehicleId
}
