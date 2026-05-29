import { test, expect } from '@playwright/test'

test.describe('Marketing smoke', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('demo dashboard is public', async ({ page }) => {
    await page.goto('/demo')
    await expect(page.getByText(/Good morning|Demo mode/i)).toBeVisible()
    await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible()
  })

  test('demo analytics and team pages load', async ({ page }) => {
    await page.goto('/demo/analytics')
    await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible()
    await page.goto('/demo/team')
    await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible()
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(
      page.getByRole('heading', { name: /Welcome back/i })
    ).toBeVisible()
  })
})
