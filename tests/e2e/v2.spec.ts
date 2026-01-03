import { test, expect, devices } from '@playwright/test';

test.describe('SurviveTheAI V2 experience', () => {
  test('homepage renders hero, evergreen, latest, and version switcher', async ({ page }) => {
    await page.goto('/v2');

    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByTestId('evergreen-section')).toBeVisible();
    await expect(page.getByTestId('latest-section')).toBeVisible();
    await expect(page.getByTestId('version-switcher')).toBeVisible();
    await expect(page.getByTestId('start-here-link').first()).toBeVisible();
  });

  test('post navigation loads the correct V2 slug', async ({ page }) => {
    await page.goto('/v2');
    await page.getByRole('link', { name: /Read the playbook/i }).click();

    await expect(page).toHaveURL(/\/v2\/posts\/v2-featured-survival-playbook\/?/);
    await expect(page.getByRole('heading', { level: 1, name: /AI Survival Playbook 2025/i })).toBeVisible();
  });

  test('blog pagination works from the listing page', async ({ page }) => {
    await page.goto('/v2/blog');
    await page.getByRole('link', { name: '2' }).click();

    await expect(page).toHaveURL(/\/v2\/blog\/page\/2\/?/);
    await expect(page.getByTestId('version-switcher')).toBeVisible();
  });

  test('version switcher navigates to v1', async ({ page }) => {
    await page.goto('/v2');
    await page.getByTestId('version-switcher').getByRole('link', { name: /^v1$/ }).click();

    await expect(page).toHaveURL(/\/v1\/?$/);
  });

  test.describe('mobile TOC', () => {
    test.use({
      viewport: devices['Pixel 5'].viewport,
      userAgent: devices['Pixel 5'].userAgent,
    });

    test('TOC toggles open on mobile', async ({ page }) => {
      await page.goto('/v2/posts/v2-featured-survival-playbook/');

      const tocToggle = page.getByTestId('toc-toggle');
      const tocList = page.locator('[aria-label="Table of contents"] ul');

      await expect(tocToggle).toBeVisible();
      await expect(tocList).toBeHidden();

      await tocToggle.click();
      await expect(tocList).toBeVisible();
    });
  });
});
