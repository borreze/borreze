import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('unknown page returns 404', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
  })
})