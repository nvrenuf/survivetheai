import { expect, test } from '@playwright/test';

test('Survival Library stays within 12 post cards per page and exposes pagination when needed', async ({ page }) => {
  await page.goto('/posts/');
  await expect(page).toHaveTitle(/Survival Library/);
  await expect(page.getByTestId('archive-browse-panel')).toBeVisible();
  await expect(page.getByTestId('archive-browse-panel')).toContainText('Choose the pressure map you want');
  await expect(page.getByTestId('archive-hub-link')).toHaveCount(5);
  await expect(page.getByTestId('archive-page-context')).toContainText('Total posts');

  const cards = page.locator('[data-testid="blog-list"] [data-testid="post-card"]');
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
  await expect(page.locator('article')).not.toContainText(/ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ|ÃƒÆ’Ã†â€™/);
  await expect(page).toHaveTitle(/AI Agents Aren't Tools\. They're Headcount Compression\. - Survive the AI/);
  await expect(page.getByTestId('article-top-block')).toContainText('Survival Area');
  await expect(page.getByTestId('article-top-block')).toContainText('Work & Money');
  await expect(page.getByTestId('article-meta-row')).toContainText('Impact Score 78');
  await expect(page.getByTestId('article-impact-score-link')).toHaveAttribute('href', '/impact-score-methodology');
  await expect(page.getByTestId('article-meta-row')).toContainText('By Lee Cuevas');
  await expect(page.getByTestId('article-meta-row')).toContainText('Published February 6, 2026');
  await expect(page.getByTestId('article-meta-row')).toContainText('6 min read');
  await expect(page.getByTestId('article-hub-box')).toContainText('Part of this Survival Area');
  await expect(page.getByTestId('author-card')).toContainText('About the author');
  await expect(page.getByTestId('author-card')).toContainText('Lee Cuevas');
  await expect(page.getByTestId('article-playbook-offer')).toContainText('Get the free playbook');
  await expect(page.getByTestId('article-playbook-offer').getByRole('link', { name: 'Get the free playbook' })).toHaveAttribute('href', '/playbook');
  await expect(page.getByTestId('article-body')).toBeVisible();
  await expect(page.getByTestId('article-claims-verification')).toContainText('Claims & Verification');
  await expect(page.getByTestId('article-claims-verification')).toContainText('Well-supported');
  await expect(page.getByTestId('article-claims-verification')).toContainText('Still uncertain');
  await expect(page.getByTestId('article-endcap')).toBeVisible();
  await expect(page.getByTestId('article-cta')).toContainText('Continue the signal');
  await expect(page.getByTestId('article-cta')).toContainText('Browse Work & Money');
  await expect(page.getByTestId('article-related-reading')).toContainText('Continue from here without losing the thread');
  await expect(page.getByTestId('article-next-up')).toBeVisible();

  const compactCards = page.locator('[data-testid="related-rail"] [data-testid="compact-post-card"]');
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
  await expect(page.getByTestId('article-claims-verification')).toContainText('What we can defend, what remains uncertain');
  await expect(page.getByTestId('article-related-reading')).toBeVisible();

  await page.goto('/posts/ai-chatfishing-ai-wingmen-dating-apps/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('article h1')).toHaveCount(0);
});

test('internal and placeholder posts stay out of public routes and public reader-facing feeds', async ({ page }) => {
  await page.goto('/posts/pro-template-demo/');
  await expect(page).toHaveTitle(/404|Not Found/i);

  await page.goto('/posts/');
  await expect(page.locator('a[href="/posts/pro-template-demo/"]')).toHaveCount(0);
  await expect(page.locator('a[href="/posts/ai-companionship/"]')).toHaveCount(0);
  await expect(page.locator('a[href="/posts/cognitive-erosion/"]')).toHaveCount(0);
  await expect(page.locator('a[href="/posts/soft-extinction/"]')).toHaveCount(0);

  await page.goto('/');
  await expect(page.locator('a[href="/posts/pro-template-demo/"]')).toHaveCount(0);
  await expect(page.locator('a[href="/posts/ai-companionship/"]')).toHaveCount(0);
  await expect(page.locator('a[href="/posts/cognitive-erosion/"]')).toHaveCount(0);
  await expect(page.locator('a[href="/posts/soft-extinction/"]')).toHaveCount(0);

  await page.goto('/survival-areas/work-money/');
  await expect(page.locator('a[href="/posts/pro-template-demo/"]')).toHaveCount(0);

  await page.goto('/survival-areas/love-connection/');
  await expect(page.locator('a[href="/posts/ai-companionship/"]')).toHaveCount(0);

  await page.goto('/survival-areas/mind-attention/');
  await expect(page.locator('a[href="/posts/cognitive-erosion/"]')).toHaveCount(0);

  await page.goto('/survival-areas/system-shock/');
  await expect(page.locator('a[href="/posts/soft-extinction/"]')).toHaveCount(0);

  await page.goto('/posts/ai-agents-arent-tools/');
  await expect(page.locator('[data-testid="related-rail"] a[href="/posts/pro-template-demo/"]')).toHaveCount(0);

  await page.goto('/posts/ai-companionship/');
  await expect(page).toHaveTitle(/404|Not Found/i);

  await page.goto('/posts/cognitive-erosion/');
  await expect(page).toHaveTitle(/404|Not Found/i);

  await page.goto('/posts/soft-extinction/');
  await expect(page).toHaveTitle(/404|Not Found/i);
});

test('triaged weak archive posts are removed from discovery surfaces and marked noindex', async ({ page }) => {
  const triagedSlugs = ['/posts/aifears/', '/posts/byebyedevs/', '/posts/riseofgigeconomy/'];

  await page.goto('/posts/');
  for (const slug of triagedSlugs) {
    await expect(page.locator(`a[href="${slug}"]`)).toHaveCount(0);
  }

  await page.goto('/survival-areas/work-money/');
  await expect(page.locator('a[href="/posts/byebyedevs/"]')).toHaveCount(0);
  await expect(page.locator('a[href="/posts/riseofgigeconomy/"]')).toHaveCount(0);

  await page.goto('/survival-areas/system-shock/');
  await expect(page.locator('a[href="/posts/aifears/"]')).toHaveCount(0);

  await page.goto('/posts/entry-level-is-dead/');
  await expect(page.locator('[data-testid="article-related-reading"] a[href="/posts/byebyedevs/"]')).toHaveCount(0);

  await page.goto('/posts/aifears/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');

  await page.goto('/sitemap.xml');
  const sitemapBody = await page.locator('body').textContent();
  expect(sitemapBody).not.toContain('/posts/aifears/');
  expect(sitemapBody).not.toContain('/posts/byebyedevs/');
  expect(sitemapBody).not.toContain('/posts/riseofgigeconomy/');
});

test('mind and attention hub exposes multiple live paths instead of a one-post dead end', async ({ page }) => {
  await page.goto('/survival-areas/mind-attention/');

  const hubCards = page.locator('[data-testid="hub-page"] [data-testid="post-card"]');
  await expect(hubCards).toHaveCount(3);
  await expect(page.getByText('We are drafting this playbook now.')).toHaveCount(0);
  await expect(page.getByTestId('hub-playbook-offer')).toContainText('Get the free playbook');
  await expect(page.locator('a[href="/posts/rapidchange/"]')).toHaveCount(1);
  await expect(page.locator('a[href="/posts/collapse-of-thinking-skills-ai-education/"]')).toHaveCount(1);
  await expect(page.locator('a[href="/posts/ai-divide-classrooms/"]')).toHaveCount(1);
});

test('playbook page acts as a clean conversion landing page', async ({ page }) => {
  await page.goto('/playbook/');

  await expect(page.getByTestId('playbook-page')).toContainText('Get the free Survival Playbook');
  await expect(page.getByTestId('playbook-page')).toContainText('No spammy bait-and-switch');
  await expect(page.getByTestId('playbook-page')).toContainText('Send me the weekly briefing and the playbook');
});
