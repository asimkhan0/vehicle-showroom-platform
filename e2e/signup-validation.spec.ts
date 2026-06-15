import { test, expect } from '@playwright/test'

// Validates signup form client/server validation without creating an account.
// Full signup e2e requires email confirmation to be disabled on the test project.

test.describe('Signup validation', () => {
  test('shows errors for invalid credentials', async ({ page }) => {
    await page.goto('/signup')

    // Bypass native constraint validation so the server-side zod schema is exercised.
    await page.evaluate(() => {
      const form = document.querySelector('form')
      if (!form) return
      form.noValidate = true
    })

    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Password').fill('short')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Enter a valid email')).toBeVisible()
    await expect(page.getByText('At least 8 characters')).toBeVisible()
  })
})
