import { expect, test } from '@playwright/test';

test.describe('Homepage layout', () => {
  test('renders one global header and the locked homepage sections without repeating the featured post in latest', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('navbar')).toHaveCount(1);
    await expect(page.getByTestId('homepage-hero')).toBeVisible();
    await expect(page.getByTestId('featured-story-section')).toBeVisible();
    await expect(page.getByTestId('latest-intelligence-section')).toBeVisible();
    await expect(page.getByTestId('survival-areas-section')).toBeVisible();
    await expect(page.getByTestId('fear-area-representatives-section')).toBeVisible();
    await expect(page.getByTestId('start-here-section')).toBeVisible();
    await expect(page.getByTestId('homepage-subscribe')).toBeVisible();
    await expect(page.getByTestId('credibility-panel')).toBeVisible();
    await expect(page.getByTestId('library-cta-section')).toBeVisible();

    const featuredHref = await page.getByTestId('featured-story-section').locator('a[href^="/posts/"]').first().getAttribute('href');
    const featuredSlug = featuredHref?.replace(/\/posts\/|\/$/g, '');

    const latestCards = page.getByTestId('latest-intelligence-section').getByTestId('post-card');
    await expect(latestCards).toHaveCount(3);

    const latestSlugs = await latestCards.evaluateAll((links) =>
      links
        .map((link) => (link.getAttribute('href') ?? '').replace(/\/posts\/|\/$/g, ''))
        .filter(Boolean),
    );
    expect(latestSlugs).not.toContain(featuredSlug);

    const latestAreas = await page
      .getByTestId('latest-intelligence-section')
      .locator('[data-testid="post-card-meta"]')
      .evaluateAll((meta) =>
        meta
          .map((node) => node.textContent?.trim() ?? '')
          .map((text) => text.split('•')[0]?.trim() || text)
          .filter(Boolean),
      );
    expect(new Set(latestAreas).size).toBe(3);

    await expect(page.getByTestId('featured-story-section').getByRole('heading', { level: 3 })).toHaveText(
      "AI Agents Aren't Tools. They're Headcount Compression.",
    );

    const fearAreaSection = page.getByTestId('fear-area-representatives-section');
    await expect(fearAreaSection.getByTestId('fear-area-representative')).toHaveCount(5);
    await expect(fearAreaSection.getByTestId('post-card')).toHaveCount(5);
    await expect(fearAreaSection.getByTestId('fear-area-fallback')).toHaveCount(0);

    await expect(page.getByTestId('start-here-section').getByTestId('post-card')).toHaveCount(3);

    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText).not.toMatch(/Ã¢â‚¬â„¢|Ã¢â‚¬Å“|Ã¢â‚¬|Ã¢â‚¬â€œ|Ãƒ/);
    await expect(page.locator('a[href="/posts/pro-template-demo/"]')).toHaveCount(0);
    await expect(page.locator('a[href="/posts/ai-companionship/"]')).toHaveCount(0);
    await expect(page.locator('a[href="/posts/cognitive-erosion/"]')).toHaveCount(0);
    await expect(page.locator('a[href="/posts/soft-extinction/"]')).toHaveCount(0);
  });

  test('homepage section order stays locked and intentional', async ({ page }) => {
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
      'fear-area-representatives-section',
      'start-here-section',
      'homepage-subscribe',
      'credibility-panel',
      'library-cta-section',
    ]);
  });

  test('fear areas section links to the five hubs and the representative section gives one post per area', async ({ page }) => {
    await page.goto('/');

    const survivalCards = page.getByTestId('survival-areas-section').getByTestId('survival-area-tile');
    await expect(survivalCards).toHaveCount(5);

    const hrefs = await survivalCards.evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean));
    expect(new Set(hrefs).size).toBe(5);
    await expect(survivalCards.first()).toContainText('Fear area');

    const representativeHeadings = await page
      .getByTestId('fear-area-representatives-section')
      .getByTestId('fear-area-representative-label')
      .evaluateAll((headings) => headings.map((heading) => heading.textContent?.trim()).filter(Boolean));
    expect(new Set(representativeHeadings).size).toBe(5);
  });

  test('homepage and hub surfaced post cards use the shared metadata and spacing treatment', async ({ page }) => {
    await page.goto('/');

    const latestCards = page.getByTestId('latest-intelligence-section').getByTestId('post-card');
    await expect(latestCards.locator('[data-testid="post-card-meta"]')).toHaveCount(3);
    await expect(latestCards.locator('[data-testid="post-card-impact"]')).toHaveCount(3);

    const startHereCards = page.getByTestId('start-here-section').getByTestId('post-card');
    await expect(startHereCards.locator('[data-testid="post-card-meta"]')).toHaveCount(3);
    await expect(startHereCards.locator('[data-testid="post-card-impact"]')).toHaveCount(3);

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
    expect(bodyText).not.toMatch(/Ã¢â‚¬â„¢|Ã¢â‚¬Å“|Ã¢â‚¬|Ã¢â‚¬â€œ|Ãƒ/);
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

  test('featured story stays distinct from latest intelligence and editor picks', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('featured-story-section')).toContainText('Featured analysis');
    await expect(page.getByTestId('featured-story-section').getByTestId('post-card')).toHaveCount(0);
    await expect(page.getByTestId('featured-story-section')).toContainText('By Lee Cuevas');
    await expect(page.getByTestId('latest-intelligence-section')).toContainText('Newest signals across the fear areas');
    await expect(page.getByTestId('start-here-section')).toContainText('Start here');
  });

  test('homepage trust layer exposes publisher ownership and standards links', async ({ page }) => {
    await page.goto('/');

    const trustPanel = page.getByTestId('credibility-panel');
    await expect(trustPanel).toContainText('Named reporting, visible standards, clear ownership');
    await expect(trustPanel.getByRole('link', { name: 'Meet the team' })).toHaveAttribute('href', '/about');
    await expect(trustPanel.getByRole('link', { name: 'Read our standards' })).toHaveAttribute('href', '/how-we-research');
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
