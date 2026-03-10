import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Borrèze/)
  })

  test('page returns 200', async ({ page }) => {
    const response = await page.request.get('/')
    expect(response.status()).toBe(200)
  })

  test('meta description is present', async ({ page }) => {
    const meta = page.locator('meta[name="description"]')
    await expect(meta).toHaveAttribute('content', /.+/)
  })
})