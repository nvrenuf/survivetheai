import { expect, test } from '@playwright/test';

test('desktop navigation routes to posts', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'All Posts' }).click();
  await expect(page).toHaveURL(/\/posts\/$/);
});

test('mobile navigation toggles and routes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByTestId('mobile-menu-toggle').click();
  const allPostsLink = page.getByRole('link', { name: 'All Posts' });
  await expect(allPostsLink).toBeVisible();
  await allPostsLink.click();

  await expect(page).toHaveURL(/\/posts\/$/);
});
