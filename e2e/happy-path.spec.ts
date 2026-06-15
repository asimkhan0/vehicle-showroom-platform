import { test, expect, type Page } from '@playwright/test'
import { createConfirmedUser, deleteUser, type TestUser } from './utils/admin'
import { pngFixture } from './utils/fixtures'

// End-to-end coverage of the Phase 1 happy path (PLAN.md §8 row "1. MVP"):
//   login → create showroom → add vehicle → upload image → publish →
//   public storefront on the tenant subdomain → inquiry → vendor inbox.
//
// The user is provisioned pre-confirmed via the service-role admin API so we can
// skip email confirmation, then driven entirely through the UI. Everything the
// test creates is cleaned up by deleting the auth user (FK cascade).

const PLATFORM_HOST = process.env.NEXT_PUBLIC_PLATFORM_HOST ?? 'localhost:3000'

function storefrontOrigin(slug: string) {
  return `http://${slug}.${PLATFORM_HOST}`
}

async function selectStatus(page: Page, label: string) {
  await page.locator('#status').click()
  await page.getByRole('option', { name: label, exact: true }).click()
}

test.describe('Phase 1 — vendor happy path', () => {
  let user: TestUser
  let slug: string

  test.beforeAll(async () => {
    user = await createConfirmedUser()
    slug = `e2e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  })

  test.afterAll(async () => {
    if (user?.id) await deleteUser(user.id)
  })

  test('signup-to-inquiry flow', async ({ page }) => {
    const showroomName = `E2E Motors ${slug}`
    const vehicleTitle = `Test Coupe ${slug}`
    const buyerName = 'Pat Buyer'
    const buyerEmail = 'pat.buyer@example.com'

    // --- 1. Log in ---------------------------------------------------------
    await page.goto('/login')
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Password').fill(user.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    // No showroom yet → dashboard bounces to onboarding.
    await page.waitForURL('**/dashboard/**')

    // --- 2. Create the showroom -------------------------------------------
    if (!page.url().includes('/onboarding')) {
      await page.goto('/dashboard/onboarding')
    }
    await page.getByLabel('Showroom name').fill(showroomName)
    await page.getByLabel('URL slug').fill(slug)
    await page.getByLabel('About').fill('Automated end-to-end test showroom.')
    await page.getByRole('button', { name: 'Create showroom' }).click()

    await page.waitForURL('**/dashboard/*/vehicles')
    const showroomId = page.url().match(/dashboard\/([^/]+)\/vehicles/)?.[1]
    expect(showroomId, 'showroom id in URL').toBeTruthy()

    // --- 3. Add a vehicle (created as draft) ------------------------------
    await page.getByRole('link', { name: 'Add vehicle' }).click()
    await page.waitForURL('**/vehicles/new')

    await page.getByLabel('Title').fill(vehicleTitle)
    await page.getByLabel('Make').fill('Toyota')
    await page.getByLabel('Model').fill('Supra')
    await page.getByLabel('Year').fill('2021')
    await page.getByLabel('Price').fill('45999')
    await page.getByLabel('Mileage').fill('12000')
    await page.getByRole('button', { name: 'Create listing' }).click()

    // Redirects to the edit page, which hosts the image manager.
    await page.waitForURL(/\/vehicles\/[0-9a-f-]+$/)
    const vehicleId = page.url().split('/vehicles/')[1].split(/[/?#]/)[0]
    expect(vehicleId, 'vehicle id in URL').toBeTruthy()

    // --- 4. Upload an image (direct browser → Supabase Storage) -----------
    await page.locator('input[type="file"]').setInputFiles(pngFixture)
    // First upload becomes primary; the badge appears after the record + refresh.
    await expect(page.getByText('Primary')).toBeVisible({ timeout: 30_000 })

    // --- 5. Publish --------------------------------------------------------
    await selectStatus(page, 'Published')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled()

    // --- 6. Public storefront on the tenant subdomain ---------------------
    const origin = storefrontOrigin(slug)
    await expect(async () => {
      await page.goto(`${origin}/`)
      await expect(page.getByRole('heading', { name: showroomName })).toBeVisible()
      await expect(page.getByText(vehicleTitle)).toBeVisible()
    }).toPass({ timeout: 30_000 })

    // Open the listing detail.
    await page.getByText(vehicleTitle).first().click()
    await page.waitForURL(new RegExp(`/v/${vehicleId}`))
    await expect(page.getByRole('heading', { name: vehicleTitle })).toBeVisible()

    // --- 7. Submit an inquiry ---------------------------------------------
    await page.getByRole('button', { name: 'Inquire about this vehicle' }).click()
    await page.getByLabel('Name').fill(buyerName)
    await page.getByLabel('Email').fill(buyerEmail)
    // Message has a sensible default; leave it as-is.
    await page.getByRole('button', { name: 'Send inquiry' }).click()
    await expect(page.getByText('Sent.', { exact: false })).toBeVisible()

    // --- 8. Vendor sees the lead in the dashboard inbox -------------------
    await page.goto(`http://${PLATFORM_HOST}/dashboard/${showroomId}/inquiries`)
    await expect(page.getByText(buyerName)).toBeVisible()
    await expect(page.getByText(buyerEmail)).toBeVisible()
    // The lead is tagged with the vehicle it's about (a "Re:" link to the listing).
    await expect(page.getByRole('link', { name: vehicleTitle })).toBeVisible()
  })
})
