import { test, expect } from '@playwright/test'
import { createConfirmedUser, deleteTestArtifacts, type TestUser } from './utils/admin'
import { pngFixture } from './utils/fixtures'
import {
  createShowroom,
  createVehicle,
  platformOrigin,
  selectStatus,
  signIn,
  uniqueSlug,
} from './utils/helpers'

test.describe('Platform discovery', () => {
  let user: TestUser
  let slug: string

  test.beforeAll(async () => {
    user = await createConfirmedUser()
    slug = uniqueSlug()
  })

  test.afterAll(async () => {
    if (user?.id) await deleteTestArtifacts(user.id)
  })

  test('published vehicle appears on discovery and links to tenant detail', async ({
    page,
  }) => {
    const showroomName = `E2E Discovery ${slug}`
    const vehicleTitle = `Discovery Coupe ${slug}`

    await signIn(page, user)
    await createShowroom(page, { name: showroomName, slug })
    await createVehicle(page, { title: vehicleTitle })
    const editUrl = page.url()

    const platform = platformOrigin()

    // Draft must not appear on platform discovery.
    await page.goto(`${platform}/`)
    await expect(page.getByRole('heading', { name: 'Find your next vehicle' })).toBeVisible()
    await expect(page.getByText(vehicleTitle)).not.toBeVisible()

    await page.goto(editUrl)
    await page.locator('input[type="file"]').setInputFiles(pngFixture)
    await expect(page.getByText('Primary')).toBeVisible({ timeout: 30_000 })

    await selectStatus(page, 'Published')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled()

    await page.goto(`${platform}/`)
    const card = page.getByRole('link', { name: new RegExp(vehicleTitle) })
    await expect(card).toBeVisible()
    await expect(page.getByText(showroomName)).toBeVisible()

    await card.click()
    await page.waitForURL(new RegExp(`/${slug}/v/[0-9a-f-]+$`))
    await expect(page.getByRole('heading', { name: vehicleTitle })).toBeVisible()
    await expect(page.getByRole('img', { name: vehicleTitle })).toBeVisible()
  })
})
