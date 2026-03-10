import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 828, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

for (const vp of viewports) {
  test.describe(`Layout ${vp.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
    })

    test(`no horizontal scroll on ${vp.name}`, async ({ page }) => {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })
  })
}