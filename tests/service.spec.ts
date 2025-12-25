import { test, expect } from '@playwright/test';

test.describe('Services grid', () => {
  test.beforeAll(async ({}) => {
    // no-op
  });

  test('renders Commercial Maintenaince Services card and opens details', async ({ page }) => {
    await page.goto('/');

    // Wait for services grid by locating one known service
    await expect(page.getByRole('heading', { name: 'Framing' })).toBeVisible();

    // New service card appears
    const newServiceHeading = page.getByRole('heading', { name: 'Commercial Maintenaince Services' });
    await expect(newServiceHeading).toBeVisible();

    // Click the card (clicking heading is sufficient, card is clickable)
    await newServiceHeading.click();

    // BottomSheet opens with title (h2)
    await expect(page.getByRole('heading', { level: 2, name: 'Commercial Maintenaince Services' })).toBeVisible();
  });
});

