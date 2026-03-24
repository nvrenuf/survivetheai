import { expect, test } from '@playwright/test';

test.describe('Homepage layout', () => {
  test('renders one global header and the primary homepage sections without repeating the featured post in the curated grid', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('navbar')).toHaveCount(1);
    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByTestId('curated-grid-section')).toBeVisible();
    await expect(page.getByTestId('survival-areas-section')).toBeVisible();
    await expect(page.getByTestId('homepage-subscribe')).toBeVisible();

    const heroSlug = await page.getByTestId('hero-section').locator('a[href^="/posts/"]').first().getAttribute('href');
    const gridCards = page.getByTestId('curated-grid-section').locator('a[href^="/posts/"]');

    await expect(gridCards).toHaveCount(6);

    const normalizedHero = heroSlug?.replace(/\/posts\/|\/$/g, '');
    const gridSlugs = await gridCards.evaluateAll((links) =>
      links
        .map((link) => (link.getAttribute('href') ?? '').replace(/\/posts\/|\/$/g, ''))
        .filter(Boolean),
    );
    expect(gridSlugs).not.toContain(normalizedHero);

    await expect(page.getByTestId('hero-section').getByRole('heading', { level: 2 })).toHaveText(
      "AI Agents Aren't Tools. They're Headcount Compression.",
    );
    await expect(page.getByTestId('hero-section')).toContainText(
      'AI agents take ownership of workflows-flattening org charts, shrinking entry-level paths, and quietly compressing headcount.',
    );

    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText).not.toMatch(/â€™|â€œ|â€|â€“|Ã/);
    await expect(page.locator('a[href="/posts/ai-companionship/"]')).toHaveCount(0);
    await expect(page.locator('a[href="/posts/cognitive-erosion/"]')).toHaveCount(0);
    await expect(page.locator('a[href="/posts/soft-extinction/"]')).toHaveCount(0);
  });

  test('survival areas section links to the five survival hubs', async ({ page }) => {
    await page.goto('/');

    const survivalCards = page.getByTestId('survival-areas-section').locator('a[href^="/survival-areas/"]');
    await expect(survivalCards).toHaveCount(5);

    const hrefs = await survivalCards.evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean));
    expect(new Set(hrefs).size).toBe(5);
  });

  test('reviewed hub page copy renders without mojibake', async ({ page }) => {
    await page.goto('/survival-areas/kids-school/');

    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText).not.toMatch(/â€™|â€œ|â€|â€“|Ã/);
    await expect(page.getByText("What's happening")).toBeVisible();
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
