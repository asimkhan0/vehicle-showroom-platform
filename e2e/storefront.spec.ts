import { test, expect } from '@playwright/test'
import { createConfirmedUser, deleteTestArtifacts, type TestUser } from './utils/admin'
import { pngFixture } from './utils/fixtures'
import {
  createShowroom,
  createVehicle,
  platformOrigin,
  selectStatus,
  signIn,
  storefrontOrigin,
  uniqueSlug,
} from './utils/helpers'

test.describe('Storefront visibility', () => {
  let user: TestUser
  let slug: string

  test.beforeAll(async () => {
    user = await createConfirmedUser()
    slug = uniqueSlug()
  })

  test.afterAll(async () => {
    if (user?.id) await deleteTestArtifacts(user.id)
  })

  test('draft hidden, image visible after publish, platform path works', async ({ page }) => {
    const showroomName = `E2E Storefront ${slug}`
    const vehicleTitle = `Draft Coupe ${slug}`

    await signIn(page, user)
    await createShowroom(page, { name: showroomName, slug })
    await createVehicle(page, { title: vehicleTitle })
    const editUrl = page.url()

    const subdomain = storefrontOrigin(slug)
    const platform = platformOrigin()

    // Draft vehicle must not appear on subdomain or platform path.
    await page.goto(`${subdomain}/`)
    await expect(page.getByRole('heading', { name: showroomName })).toBeVisible()
    await expect(page.getByText(vehicleTitle)).not.toBeVisible()

    await page.goto(`${platform}/${slug}`)
    await expect(page.getByRole('heading', { name: showroomName })).toBeVisible()
    await expect(page.getByText(vehicleTitle)).not.toBeVisible()

    await page.goto(editUrl)
    await page.locator('input[type="file"]').setInputFiles(pngFixture)
    await expect(page.getByText('Primary')).toBeVisible({ timeout: 30_000 })

    await selectStatus(page, 'Published')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled()

    await page.goto(`${subdomain}/`)
    await expect(page.getByText(vehicleTitle)).toBeVisible()
    await expect(page.getByRole('img', { name: vehicleTitle })).toBeVisible()

    await page.goto(`${platform}/${slug}`)
    await expect(page.getByRole('heading', { name: showroomName })).toBeVisible()
    await expect(page.getByText(vehicleTitle)).toBeVisible()
    await expect(page.getByRole('img', { name: vehicleTitle })).toBeVisible()
  })
})
