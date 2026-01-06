import { expect, test } from '@playwright/test';

test.describe('Homepage layout', () => {
  test('shows hero, evergreen, latest, and all posts without duplicate slugs', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByTestId('evergreen-section')).toBeVisible();
    await expect(page.getByTestId('latest-section')).toBeVisible();
    await expect(page.getByTestId('all-posts-section')).toBeVisible();

    const slugs = await page.locator('[data-testid$="-section"] a[href^="/posts/"]').evaluateAll((links) =>
      links
        .map((link) => (link.getAttribute('href') ?? '').replace(/\/posts\/|\/$/g, ''))
        .filter(Boolean),
    );

    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  test('hides newsletter and version switchers', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[type="email"], form[action*="newsletter"]')).toHaveCount(0);
    expect(await page.getByText(/version/i).count()).toBe(0);
  });

  test('mobile layout stays stacked without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);

    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 2);

    await page.getByTestId('mobile-menu-toggle').click();
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
  });
});
