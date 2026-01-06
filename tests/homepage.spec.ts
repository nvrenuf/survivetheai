import { expect, test } from '@playwright/test';

test.describe('Homepage layout', () => {
  test('shows featured, evergreen, and latest posts without duplicates', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByTestId('evergreen-section')).toBeVisible();
    await expect(page.getByTestId('latest-section')).toBeVisible();

    const evergreenCards = page.getByTestId('evergreen-section').locator('a[href^="/posts/"]');
    const latestCards = page.getByTestId('latest-section').locator('a[href^="/posts/"]');

    await expect(evergreenCards).toHaveCount(4);
    await expect(latestCards).toHaveCount(5);

    const slugs = await page.locator('[data-testid$="-section"] a[href^="/posts/"]').evaluateAll((links) =>
      links
        .map((link) => (link.getAttribute('href') ?? '').replace(/\/posts\/|\/$/g, ''))
        .filter(Boolean),
    );

    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  test('latest posts exclude featured and evergreen content', async ({ page }) => {
    await page.goto('/');

    const heroSlug = await page.getByTestId('hero-section').locator('a[href^="/posts/"]').first().getAttribute('href');
    const evergreenSlugs = await page
      .getByTestId('evergreen-section')
      .locator('a[href^="/posts/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));

    const latestSlugs = await page
      .getByTestId('latest-section')
      .locator('a[href^="/posts/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));

    const normalizedHero = heroSlug?.replace(/\/posts\/|\/$/g, '');
    const normalizedEvergreen = evergreenSlugs.map((href) => (href ?? '').replace(/\/posts\/|\/$/g, ''));
    const normalizedLatest = latestSlugs.map((href) => (href ?? '').replace(/\/posts\/|\/$/g, ''));

    expect(normalizedLatest).not.toContain(normalizedHero);
    normalizedEvergreen.forEach((slug) => expect(normalizedLatest).not.toContain(slug));
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
