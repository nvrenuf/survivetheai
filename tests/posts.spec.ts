import { expect, test } from '@playwright/test';

test('Survival Library stays within 12 post cards per page and exposes pagination when needed', async ({ page }) => {
  await page.goto('/posts/');
  await expect(page).toHaveTitle(/Survival Library/);
  await expect(page.getByTestId('archive-browse-panel')).toBeVisible();
  await expect(page.getByTestId('archive-browse-panel')).toContainText('Choose the pressure map you want');
  await expect(page.getByTestId('archive-hub-link')).toHaveCount(5);
  await expect(page.getByTestId('archive-page-context')).toContainText('Total posts');

  const cards = page.getByTestId('blog-list').getByTestId('post-card');
  await expect(cards).toHaveCount(12);
  await expect(cards.locator('[data-testid="post-card-meta"]')).toHaveCount(12);
  await expect(cards.locator('[data-testid="post-card-impact"]')).toHaveCount(12);
  await expect(page.getByTestId('archive-grid-header')).toContainText('Page 1');
  await expect(page.getByTestId('archive-grid-header')).toContainText('Showing 12 posts');

  const libraryHrefs = await cards.evaluateAll((links) => links.map((link) => link.getAttribute('href')).filter(Boolean));
  expect(new Set(libraryHrefs).size).toBe(libraryHrefs.length);

  const totalPagesAttr = await page.getByTestId('blog-list').getAttribute('data-total-pages');
  const totalPages = Number(totalPagesAttr ?? '1');
  if (totalPages > 1) {
    await expect(page.getByTestId('pagination')).toBeVisible();
    await page.goto('/posts/page/2/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Survival Library - Page 2');
    await expect(page.getByTestId('archive-grid-header')).toContainText('Page 2');
  } else {
    await expect(page.getByTestId('pagination')).toHaveCount(0);
  }

  await page.goto('/posts/');
  await page.getByTestId('archive-hub-link').first().click();
  await expect(page).toHaveURL(/\/survival-areas\//);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('homepage and article pages render one global header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('navbar')).toHaveCount(1);

  await page.goto('/posts/normal-photo-child-ai-risk/');
  await expect(page.getByTestId('navbar')).toHaveCount(1);
});

test('article pages render one hero/title block on reviewed posts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('/posts/ai-agents-arent-tools/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText("AI Agents Aren't Tools. They're Headcount Compression.");
  await expect(page.locator('article')).not.toContainText(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢|ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ|ÃƒÂ¢Ã¢â€šÂ¬|ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“|ÃƒÆ’/);
  await expect(page).toHaveTitle(/AI Agents Aren't Tools\. They're Headcount Compression\. - Survive the AI/);
  await expect(page.getByTestId('article-top-block')).toContainText('Survival Area');
  await expect(page.getByTestId('article-top-block')).toContainText('Work & Money');
  await expect(page.getByTestId('article-meta-row')).toContainText('Impact Score 78');
  await expect(page.getByTestId('article-meta-row')).toContainText('By Lee Cuevas');
  await expect(page.getByTestId('article-meta-row')).toContainText('Published February 6, 2026');
  await expect(page.getByTestId('article-meta-row')).toContainText('6 min read');
  await expect(page.getByTestId('article-hub-box')).toContainText('Part of this Survival Area');
  await expect(page.getByTestId('author-card')).toContainText('About the author');
  await expect(page.getByTestId('author-card')).toContainText('Lee Cuevas');
  await expect(page.getByTestId('article-body')).toBeVisible();
  await expect(page.getByTestId('article-endcap')).toBeVisible();
  await expect(page.getByTestId('article-cta')).toContainText('Continue the signal');
  await expect(page.getByTestId('article-cta')).toContainText('Browse Work & Money');
  await expect(page.getByTestId('article-related-reading')).toContainText('Continue from here without losing the thread');
  await expect(page.getByTestId('article-next-up')).toBeVisible();

  const compactCards = page.getByTestId('related-rail').getByTestId('compact-post-card');
  const compactCount = await compactCards.count();
  expect(compactCount).toBeGreaterThan(0);
  await expect(compactCards.locator('[data-testid="compact-post-card-meta"]')).toHaveCount(compactCount);
  await expect(compactCards.locator('[data-testid="compact-post-card-impact"]')).toHaveCount(compactCount);

  const nextUpHref = await page.getByTestId('article-next-up').locator('a[href^="/posts/"]').getAttribute('href');
  const relatedHrefs = await page
    .getByTestId('article-related-reading')
    .locator('[data-testid="post-card"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')).filter(Boolean));
  expect(relatedHrefs).not.toContain(nextUpHref);

  await page.goto('/posts/normal-photo-child-ai-risk/');

  await expect(page.getByTestId('article-meta-row')).toContainText('Impact Score');
  await expect(page.getByTestId('article-meta-row')).toContainText('By Lee Cuevas');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('article h1')).toHaveCount(0);
  await expect(page.locator('img[src*="deepfake-kids-hero-abstract.png"]')).toHaveCount(1);
  await expect(page.getByTestId('article-cta')).toContainText('Continue the signal');
  await expect(page.getByTestId('article-endcap')).toContainText('Get the weekly STA briefing');
  await expect(page.getByTestId('article-related-reading')).toBeVisible();

  await page.goto('/posts/ai-chatfishing-ai-wingmen-dating-apps/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('article h1')).toHaveCount(0);
});

test('demo article renders the reusable STA callout system cleanly', async ({ page }) => {
  await page.goto('/posts/pro-template-demo/');

  const callouts = page.getByTestId('article-callout');
  await expect(callouts).toHaveCount(6);
  await expect(page.locator('[data-callout-kind="tldr"]')).toHaveCount(1);
  await expect(page.locator('[data-callout-kind="defend"]')).toHaveCount(1);
  await expect(page.locator('[data-callout-kind="next"]')).toHaveCount(1);
  await expect(page.locator('[data-callout-kind="warning"]')).toHaveCount(1);
  await expect(page.locator('[data-callout-kind="checklist"]')).toHaveCount(1);
  await expect(page.locator('[data-callout-kind="claims"]')).toHaveCount(1);
  await expect(page.locator('[data-callout-kind="checklist"] li')).toHaveCount(3);
  await expect(callouts.first()).toContainText('TL;DR');
  await expect(callouts.last()).toContainText('Claims & Verification');
});

test('demo article stays directly routable but out of public reader-facing post feeds', async ({ page }) => {
  await page.goto('/posts/pro-template-demo/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The 2026 Survival Blueprint for AI Acceleration');

  await page.goto('/posts/');
  await expect(page.locator('a[href="/posts/pro-template-demo/"]')).toHaveCount(0);

  await page.goto('/');
  await expect(page.locator('a[href="/posts/pro-template-demo/"]')).toHaveCount(0);

  await page.goto('/survival-areas/work-money/');
  await expect(page.locator('a[href="/posts/pro-template-demo/"]')).toHaveCount(0);

  await page.goto('/posts/ai-agents-arent-tools/');
  await expect(page.locator('[data-testid="related-rail"] a[href="/posts/pro-template-demo/"]')).toHaveCount(0);
});
