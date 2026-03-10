import { test, expect } from '@playwright/test'

test.describe('Basic accessibility', () => {
  test('images have alt attributes', async ({ page }) => {
    await page.goto('/')
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).not.toBeNull()
    }
  })

  test('heading hierarchy starts with h1', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('tab focus visible on interactive elements', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })
})