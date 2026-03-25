import { expect, test } from '@playwright/test';
import { SURVIVAL_HUBS } from '../src/data/hubs';

test('desktop navigation links to the Survival Library and shows Survival Areas dropdown', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 768, 'Desktop navigation is hidden on mobile viewports.');
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Drops' })).toHaveCount(0);

  const navbar = page.getByTestId('navbar');
  await expect(navbar).toBeVisible();
  await expect(page.getByTestId('nav-home')).toHaveClass(/text-neutral-95/);

  await page.getByTestId('nav-library').click();
  await expect(page).toHaveURL(/\/posts\/?$/);

  await page.goto('/');
  const dropdownTrigger = page.getByRole('button', { name: 'Survival Areas' });
  await dropdownTrigger.click();

  for (const hub of SURVIVAL_HUBS) {
    await expect(page.getByTestId(`survival-area-${hub.key}`)).toBeVisible();
  }
});

test('desktop Survival Areas dropdown stays in front of article content when open', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 768, 'Desktop navigation is hidden on mobile viewports.');
  await page.goto('/posts/ai-agents-arent-tools/');

  const dropdownTrigger = page.getByTestId('survival-areas-desktop').getByRole('button', { name: 'Survival Areas' });
  await dropdownTrigger.click();

  const firstMenuItem = page.getByTestId(`survival-area-${SURVIVAL_HUBS[0].key}`);
  await expect(firstMenuItem).toBeVisible();

  const menuIsOnTop = await firstMenuItem.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const topElement = document.elementFromPoint(x, y);
    return topElement === element || Boolean(topElement?.closest('[data-dropdown-menu]'));
  });

  expect(menuIsOnTop).toBe(true);
});

test('mobile navigation toggles Survival Library and Survival Areas', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByTestId('mobile-menu-toggle').click();
  await expect(page.getByTestId('nav-library-mobile')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Drops' })).toHaveCount(0);

  const mobileDropdown = page.getByTestId('survival-areas-mobile').getByRole('button', { name: 'Survival Areas' });
  await mobileDropdown.press('Enter');

  const firstHub = SURVIVAL_HUBS[0];
  await page.getByTestId(`survival-area-${firstHub.key}-mobile`).click();

  await expect(page).toHaveURL(new RegExp(`/survival-areas/${firstHub.key}/`));
  await expect(page.getByRole('heading', { level: 1 })).toContainText(firstHub.shortName);
});
