import { expect, test } from '@playwright/test';

test.describe('Homepage layout', () => {
  test('renders the board-led homepage shell and core conversion surfaces', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('navbar')).toHaveCount(1);
    await expect(page.getByTestId('homepage-hero')).toBeVisible();
    await expect(page.getByTestId('pressure-room-section')).toBeVisible();
    await expect(page.getByTestId('start-here-section')).toBeVisible();
    await expect(page.getByTestId('survival-areas-section')).toBeVisible();
    await expect(page.getByTestId('homepage-playbook-offer')).toBeVisible();
    await expect(page.getByTestId('homepage-subscribe')).toBeVisible();
    await expect(page.getByTestId('credibility-panel')).toBeVisible();
    await expect(page.getByTestId('library-cta-section')).toBeVisible();

    await expect(page.getByTestId('pressure-room-live-modules').locator('article')).toHaveCount(4);
    await expect(page.getByTestId('pressure-room-threat-card')).toHaveCount(5);
    await expect(page.getByTestId('pressure-room-macro-gauges').locator('article')).toHaveCount(3);
    await expect(page.getByTestId('pressure-room-impact-item')).toHaveCount(5);
    await expect(page.getByTestId('pressure-room-vote')).toContainText('Local browser vote for now.');

    await expect(page.getByTestId('pressure-room-lead-story')).toContainText("AI Agents Aren't Tools. They're Headcount Compression.");
    await expect(page.getByTestId('pressure-room-lead-story').getByRole('link', { name: /Impact Score/i })).toHaveAttribute(
      'href',
      '/impact-score-methodology',
    );

    await expect(page.locator('[data-testid="start-here-section"] [data-testid="post-card"]')).toHaveCount(3);

    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText).not.toMatch(/ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ|ÃƒÆ’Ã†â€™/);
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
      'pressure-room-section',
      'start-here-section',
      'survival-areas-section',
      'homepage-playbook-offer',
      'homepage-subscribe',
      'credibility-panel',
      'library-cta-section',
    ]);
  });

  test('pressure room keeps its honest data separation and routes back into reporting', async ({ page }) => {
    await page.goto('/');

    const pressureRoom = page.getByTestId('pressure-room-section');
    await expect(pressureRoom).toContainText('Near-live modules summarize fresh STA coverage.');
    await expect(pressureRoom).toContainText('Threat cards and macro gauges are explicit editorial judgments.');
    await expect(pressureRoom).toContainText('Board timestamp:');

    const impactItems = page.getByTestId('pressure-room-impact-item');
    const hrefs = await impactItems.evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean));
    expect(hrefs.length).toBe(5);
    expect(hrefs.every((href) => href?.startsWith('/posts/'))).toBe(true);

    await expect(page.getByTestId('pressure-room-threat-cards').getByRole('link', { name: 'Open Work & Money' })).toHaveAttribute(
      'href',
      '/survival-areas/work-money/',
    );
    await expect(pressureRoom.getByRole('link', { name: 'Open the hub' })).toHaveCount(0);
  });

  test('fear areas section links to the five hubs', async ({ page }) => {
    await page.goto('/');

    const survivalCards = page.getByTestId('survival-areas-section').getByTestId('survival-area-tile');
    await expect(survivalCards).toHaveCount(5);

    const hrefs = await survivalCards.evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')).filter(Boolean));
    expect(new Set(hrefs).size).toBe(5);
    await expect(survivalCards.first()).toContainText('Fear area');
  });

  test('homepage and hub surfaced post cards use the shared metadata and spacing treatment', async ({ page }) => {
    await page.goto('/');

    const startHereCards = page.locator('[data-testid="start-here-section"] [data-testid="post-card"]');
    await expect(startHereCards.locator('[data-testid="post-card-meta"]')).toHaveCount(3);
    await expect(startHereCards.locator('[data-testid="post-card-impact"]')).toHaveCount(3);

    await page.goto('/survival-areas/work-money/');

    const hubCards = page.locator('[data-testid="hub-page"] [data-testid="post-card"]');
    const hubCount = await hubCards.count();
    expect(hubCount).toBeGreaterThan(0);
    await expect(hubCards.locator('[data-testid="post-card-meta"]')).toHaveCount(hubCount);
    await expect(hubCards.locator('[data-testid="post-card-impact"]')).toHaveCount(hubCount);
  });

  test('reviewed hub page copy renders without mojibake', async ({ page }) => {
    await page.goto('/survival-areas/kids-school/');

    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText).not.toMatch(/ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ|ÃƒÆ’Ã†â€™/);
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

  test('start here page gives new readers a guided path into trust and content surfaces', async ({ page }) => {
    await page.goto('/start-here/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('A guided first path through SurviveTheAI');
    await expect(page.getByTestId('start-here-step')).toHaveCount(3);
    await expect(page.getByTestId('start-here-featured-link')).toHaveAttribute('href', '/posts/ai-agents-arent-tools/');
    await expect(page.getByTestId('start-here-featured-link')).toHaveAttribute('data-analytics-event', 'start_here_content_click');
    await expect(page.getByTestId('start-here-steps').getByRole('link', { name: 'How we research' })).toHaveAttribute('href', '/how-we-research');
    await expect(page.getByTestId('start-here-steps').getByRole('link', { name: 'Impact Score methodology' })).toHaveAttribute(
      'href',
      '/impact-score-methodology',
    );
    await expect(page.getByTestId('start-here-editor-picks').getByTestId('post-card')).toHaveCount(3);
    await expect(page.getByTestId('start-here-playbook-offer')).toBeVisible();
    await expect(page.getByTestId('start-here-playbook-offer').getByRole('link', { name: 'Get the free playbook' })).toHaveAttribute(
      'data-analytics-event',
      'playbook_cta_click',
    );
  });

  test('impact score methodology page explains how to interpret the score', async ({ page }) => {
    await page.goto('/impact-score-methodology/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Impact Score methodology');
    await expect(page.getByText('Four editorial inputs')).toBeVisible();
    await expect(page.getByText('Interpretation bands')).toBeVisible();
    await expect(page.getByText('40-59: meaningful, but narrower')).toBeVisible();
    await expect(page.getByText('75+: urgent and broadly consequential')).toBeVisible();
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

    await expect(page.getByTestId('homepage-playbook-offer')).toContainText('Get the free Survival Playbook');
    await expect(page.getByTestId('homepage-playbook-offer').getByRole('link', { name: 'Get the free playbook' })).toHaveAttribute(
      'href',
      '/playbook',
    );
    await expect(page.getByTestId('homepage-playbook-offer').getByRole('link', { name: 'Get the free playbook' })).toHaveAttribute(
      'data-analytics-event',
      'playbook_cta_click',
    );
    await expect(page.getByTestId('start-here-guided-link')).toHaveAttribute('data-analytics-event', 'start_here_entry_click');
    await expect(page.getByTestId('homepage-subscribe')).toContainText('Get the weekly briefing');
    await expect(page.getByTestId('homepage-subscribe')).toContainText(
      'One concise weekly email with the newest signal, what it means, and where to act next.',
    );
    await expect(page.getByTestId('homepage-subscribe')).toContainText('Free. No spam. Unsubscribe anytime.');
  });
});
