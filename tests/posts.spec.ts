import { expect, test } from '@playwright/test';

test('posts index paginates six posts per page', async ({ page }) => {
  await page.goto('/posts/');
  await expect(page).toHaveTitle(/All Posts/);

  await expect(page.locator('[data-testid="blog-list"] article')).toHaveCount(6);
  await expect(page.getByTestId('pagination')).toBeVisible();

  await page.getByRole('link', { name: '2' }).click();
  await expect(page).toHaveURL(/\/posts\/page\/2\//);
  await expect(page.locator('[data-testid="blog-list"] article')).toHaveCount(6);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/All Posts – Page 2/);
});

test('individual post pages render without signup forms', async ({ page }) => {
  await page.goto('/posts/');
  const firstPostLink = page.locator('[data-testid="blog-list"] article a[href^="/posts/"]').first();
  const href = await firstPostLink.getAttribute('href');
  expect(href).not.toBeNull();

  await page.goto(href!);
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('input[type="email"], form[action*="newsletter"]')).toHaveCount(0);
});
