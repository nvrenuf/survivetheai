import { expect, test } from '@playwright/test';

test('Survival Library stays within 12 post cards per page and exposes pagination when needed', async ({ page }) => {
  await page.goto('/posts/');
  await expect(page).toHaveTitle(/Survival Library/);

  const cards = page.getByTestId('blog-list').getByTestId('post-card');
  await expect(cards).toHaveCount(12);
  await expect(cards.locator('[data-testid="post-card-meta"]')).toHaveCount(12);
  await expect(cards.locator('[data-testid="post-card-impact"]')).toHaveCount(12);

  const libraryHrefs = await cards.evaluateAll((links) => links.map((link) => link.getAttribute('href')).filter(Boolean));
  expect(new Set(libraryHrefs).size).toBe(libraryHrefs.length);

  const totalPagesAttr = await page.getByTestId('blog-list').getAttribute('data-total-pages');
  const totalPages = Number(totalPagesAttr ?? '1');
  if (totalPages > 1) {
    await expect(page.getByTestId('pagination')).toBeVisible();
  } else {
    await expect(page.getByTestId('pagination')).toHaveCount(0);
  }
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
  await expect(page.getByTestId('article-meta-row')).toContainText('Published February 6, 2026');
  await expect(page.getByTestId('article-meta-row')).toContainText('6 min read');
  await expect(page.getByTestId('article-hub-box')).toContainText('Part of this Survival Area');

  const compactCards = page.getByTestId('related-rail').getByTestId('compact-post-card');
  const compactCount = await compactCards.count();
  expect(compactCount).toBeGreaterThan(0);
  await expect(compactCards.locator('[data-testid="compact-post-card-meta"]')).toHaveCount(compactCount);
  await expect(compactCards.locator('[data-testid="compact-post-card-impact"]')).toHaveCount(compactCount);

  await page.goto('/posts/normal-photo-child-ai-risk/');

  await expect(page.getByTestId('article-meta-row')).toContainText('Impact Score');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('article h1')).toHaveCount(0);
  await expect(page.locator('img[src*="deepfake-kids-hero-abstract.png"]')).toHaveCount(1);

  await page.goto('/posts/ai-chatfishing-ai-wingmen-dating-apps/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('article h1')).toHaveCount(0);
});
