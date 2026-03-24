import { expect, test } from '@playwright/test';

test.describe('Homepage layout', () => {
  test('renders one global header and the primary homepage sections without repeating the featured post in the latest stack', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('navbar')).toHaveCount(1);
    await expect(page.getByTestId('homepage-hero')).toBeVisible();
    await expect(page.getByTestId('featured-story-section')).toBeVisible();
    await expect(page.getByTestId('latest-intelligence-section')).toBeVisible();
    await expect(page.getByTestId('survival-areas-section')).toBeVisible();
    await expect(page.getByTestId('homepage-subscribe')).toBeVisible();
    await expect(page.getByTestId('library-cta-section')).toBeVisible();

    const heroSlug = await page.getByTestId('featured-story-section').locator('a[href^="/posts/"]').first().getAttribute('href');
    const gridCards = page.getByTestId('latest-intelligence-section').locator('a[href^="/posts/"]');

    await expect(gridCards).toHaveCount(6);

    const normalizedHero = heroSlug?.replace(/\/posts\/|\/$/g, '');
    const gridSlugs = await gridCards.evaluateAll((links) =>
      links
        .map((link) => (link.getAttribute('href') ?? '').replace(/\/posts\/|\/$/g, ''))
        .filter(Boolean),
    );
    expect(gridSlugs).not.toContain(normalizedHero);

    await expect(page.getByTestId('featured-story-section').getByRole('heading', { level: 3 })).toHaveText(
      "AI Agents Aren't Tools. They're Headcount Compression.",
    );
    await expect(page.getByTestId('featured-story-section')).toContainText(
      'AI agents take ownership of workflows-flattening org charts, shrinking entry-level paths, and quietly compressing headcount.',
    );

    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText).not.toMatch(/â€™|â€œ|â€|â€“|Ã/);
    await expect(page.locator('a[href="/posts/ai-companionship/"]')).toHaveCount(0);
    await expect(page.locator('a[href="/posts/cognitive-erosion/"]')).toHaveCount(0);
    await expect(page.locator('a[href="/posts/soft-extinction/"]')).toHaveCount(0);
  });

  test('homepage section order stays editorial and intentional', async ({ page }) => {
    await page.goto('/');

    const sectionOrder = await page.locator('main > div').evaluate((container) =>
      Array.from(container.children)
        .map((node) => node.getAttribute('data-testid'))
        .filter(Boolean),
    );

    expect(sectionOrder).toEqual([
      'homepage-hero',
      'featured-story-section',
      'latest-intelligence-section',
      'survival-areas-section',
      'homepage-subscribe',
      'library-cta-section',
    ]);
  });

  test('latest intelligence keeps a restrained start here stack for onboarding', async ({ page }) => {
    await page.goto('/');

    const startHereCards = page.getByTestId('context-stack').getByTestId('post-card');
    await expect(startHereCards).toHaveCount(2);
    await expect(page.getByTestId('context-stack')).toContainText("Editor's picks for first-time readers");
  });

  test('survival areas section links to the five survival hubs', async ({ page }) => {
    await page.goto('/');

    const survivalCards = page.getByTestId('survival-areas-section').getByTestId('survival-area-tile');
    await expect(survivalCards).toHaveCount(5);

    const hrefs = await survivalCards.evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean));
    expect(new Set(hrefs).size).toBe(5);
    await expect(survivalCards.first()).toContainText('Survival area');
  });

  test('homepage and hub surfaced post cards use the shared metadata and spacing treatment', async ({ page }) => {
    await page.goto('/');

    const homepageCards = page.getByTestId('latest-intelligence-section').getByTestId('post-card');
    await expect(homepageCards).toHaveCount(6);
    await expect(homepageCards.locator('[data-testid="post-card-meta"]')).toHaveCount(6);
    await expect(homepageCards.locator('[data-testid="post-card-impact"]')).toHaveCount(6);

    await page.goto('/survival-areas/work-money/');

    const hubCards = page.getByTestId('hub-page').getByTestId('post-card');
    const hubCount = await hubCards.count();
    expect(hubCount).toBeGreaterThan(0);
    await expect(hubCards.locator('[data-testid="post-card-meta"]')).toHaveCount(hubCount);
    await expect(hubCards.locator('[data-testid="post-card-impact"]')).toHaveCount(hubCount);
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

  test('featured story stays distinct from latest intelligence cards', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('featured-story-section')).toContainText('Featured analysis');
    await expect(page.getByTestId('featured-story-section').getByTestId('post-card')).toHaveCount(0);
    await expect(page.getByTestId('context-stack')).toContainText('Start here');
    await expect(page.getByTestId('signal-stack')).toContainText('What moved most recently');
  });

  test('homepage newsletter CTA stays concise and intentional', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('homepage-subscribe')).toContainText('Get the weekly briefing');
    await expect(page.getByTestId('homepage-subscribe')).toContainText(
      'One concise weekly email with the newest signal, what it means, and where to act next.',
    );
    await expect(page.getByTestId('homepage-subscribe')).toContainText('Free. No spam. Unsubscribe anytime.');
  });
});
