import { expect, test } from '@playwright/test';

test('Survival Library stays within 12 post cards per page and exposes pagination when needed', async ({ page }) => {
  await page.goto('/posts/');
  await expect(page).toHaveTitle(/Survival Library/);

  const cards = page.locator('[data-testid="blog-list"] > div a[href^="/posts/"]');
  await expect(cards).toHaveCount(12);

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
  await page.goto('/posts/normal-photo-child-ai-risk/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('article h1')).toHaveCount(0);
  await expect(page.locator('img[src*="deepfake-kids-hero-abstract.png"]')).toHaveCount(1);

  await page.goto('/posts/ai-chatfishing-ai-wingmen-dating-apps/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('article h1')).toHaveCount(0);
});
