import { test, expect } from '@playwright/test'
import { createConfirmedUser, deleteTestArtifacts, type TestUser } from './utils/admin'
import { pngFixture } from './utils/fixtures'
import {
  PLATFORM_HOST,
  createShowroom,
  createVehicle,
  selectStatus,
  signIn,
  storefrontOrigin,
  uniqueSlug,
} from './utils/helpers'

// Vendor flow: sign-in → showroom → vehicle → image → publish → storefront →
// inquiry → vendor inbox. User is provisioned pre-confirmed via admin API.
// Resend email forward is best-effort and not asserted here.

test.describe('Phase 1 — vendor happy path', () => {
  let user: TestUser
  let slug: string

  test.beforeAll(async () => {
    user = await createConfirmedUser()
    slug = uniqueSlug()
  })

  test.afterAll(async () => {
    if (user?.id) await deleteTestArtifacts(user.id)
  })

  test('vendor sign-in to inquiry flow', async ({ page }) => {
    const showroomName = `E2E Motors ${slug}`
    const vehicleTitle = `Test Coupe ${slug}`
    const buyerName = 'Pat Buyer'
    const buyerEmail = 'pat.buyer@example.com'

    await signIn(page, user)
    const showroomId = await createShowroom(page, {
      name: showroomName,
      slug,
      bio: 'Automated end-to-end test showroom.',
    })

    const vehicleId = await createVehicle(page, { title: vehicleTitle })

    await page.locator('input[type="file"]').setInputFiles(pngFixture)
    await expect(page.getByText('Primary')).toBeVisible({ timeout: 30_000 })

    await selectStatus(page, 'Published')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled()

    const origin = storefrontOrigin(slug)
    await expect(async () => {
      await page.goto(`${origin}/`)
      await expect(page.getByRole('heading', { name: showroomName })).toBeVisible()
      await expect(page.getByText(vehicleTitle)).toBeVisible()
    }).toPass({ timeout: 30_000 })

    await page.getByText(vehicleTitle).first().click()
    await page.waitForURL(new RegExp(`/v/${vehicleId}`))
    await expect(page.getByRole('heading', { name: vehicleTitle })).toBeVisible()

    await page.getByRole('button', { name: 'Inquire about this vehicle' }).click()
    await page.getByLabel('Name').fill(buyerName)
    await page.getByLabel('Email').fill(buyerEmail)
    await page.getByRole('button', { name: 'Send inquiry' }).click()
    await expect(page.getByText('Sent.', { exact: false })).toBeVisible()

    await page.goto(`http://${PLATFORM_HOST}/dashboard/${showroomId}/inquiries`)
    await expect(page.getByText(buyerName)).toBeVisible()
    await expect(page.getByText(buyerEmail)).toBeVisible()
    await expect(page.getByRole('link', { name: vehicleTitle })).toBeVisible()
  })
})
