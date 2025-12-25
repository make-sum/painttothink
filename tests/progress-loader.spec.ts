import { test, expect } from '@playwright/test'

test.describe('ProgressLoader Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display progress loader in hero section', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check if the progress loader is visible
    const progressLoader = page.locator('[data-testid="progress-loader"]').first()
    await expect(progressLoader).toBeVisible()
    
    // Verify the logo is displayed
    const logo = progressLoader.locator('svg').first()
    await expect(logo).toBeVisible()
    
    // Check if progress percentage is shown
    const progressText = progressLoader.locator('text=/\\d+%/').first()
    await expect(progressText).toBeVisible()
  })

  test('should animate progress from 0 to 100', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    
    // Wait for initial progress to be visible
    await page.waitForSelector('text=/0%/')
    
    // Wait for progress to reach 100%
    await page.waitForSelector('text=/100%/', { timeout: 10000 })
    
    // Verify the loader disappears after completion
    await page.waitForTimeout(600) // Wait for auto-hide delay
    const progressLoader = page.locator('[data-testid="progress-loader"]').first()
    await expect(progressLoader).not.toBeVisible()
  })

  test('should maintain proper logo dimensions', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    
    const progressLoader = page.locator('[data-testid="progress-loader"]').first()
    const logo = progressLoader.locator('svg').first()
    
    // Check logo dimensions (72px width, ~35px height based on aspect ratio)
    const logoBox = await logo.boundingBox()
    expect(logoBox?.width).toBeCloseTo(72, 1)
    expect(logoBox?.height).toBeCloseTo(35, 1)
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForLoadState('networkidle')
    
    let progressLoader = page.locator('[data-testid="progress-loader"]').first()
    await expect(progressLoader).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForLoadState('networkidle')
    
    progressLoader = page.locator('[data-testid="progress-loader"]').first()
    await expect(progressLoader).toBeVisible()
  })
})
