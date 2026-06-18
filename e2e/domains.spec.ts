import { test, expect } from '@playwright/test'
import { createConfirmedUser, deleteTestArtifacts, type TestUser } from './utils/admin'
import { createShowroom, signIn, uniqueSlug } from './utils/helpers'

test.describe('Domains validation', () => {
  let user: TestUser
  let showroomId: string

  test.beforeAll(async () => {
    user = await createConfirmedUser()
  })

  test.afterAll(async () => {
    if (user?.id) await deleteTestArtifacts(user.id)
  })

  test.beforeEach(async ({ page }) => {
    const slug = uniqueSlug()
    await signIn(page, user)
    showroomId = await createShowroom(page, {
      name: `Domain Test ${slug}`,
      slug,
    })
    await page.goto(`/dashboard/${showroomId}/domains`)
  })

  test('shows errors for invalid hostnames', async ({ page }) => {
    await page.evaluate(() => {
      const form = document.querySelector('form')
      if (!form) return
      form.noValidate = true
    })

    await page.getByLabel('Custom domain').fill('not a domain')
    await page.getByRole('button', { name: 'Add domain' }).click()

    await expect(page.getByText(/Enter a valid domain name/)).toBeVisible()
  })

  test('blocks platform subdomain as custom domain', async ({ page }) => {
    await page.evaluate(() => {
      const form = document.querySelector('form')
      if (!form) return
      form.noValidate = true
    })

    const platformHost = process.env.NEXT_PUBLIC_PLATFORM_HOST ?? 'localhost:3000'
    const base = platformHost.split(':')[0]

    await page.getByLabel('Custom domain').fill(`shop.${base}`)
    await page.getByRole('button', { name: 'Add domain' }).click()

    await expect(page.getByText('Cannot use the platform domain')).toBeVisible()
  })
})
