import { test, expect } from '@playwright/test'

const pages = [
  '/contact',
  '/recherche',
  '/plan-du-site',
]

test.describe('SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  for (const p of pages) {
    test.describe(`Page ${p}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(p)
      })

      test('meta description is present', async ({ page }) => {
        const meta = page.locator('meta[name="description"]')
        await expect(meta).toHaveAttribute('content', /.+/)
      })
    })
  }
})

