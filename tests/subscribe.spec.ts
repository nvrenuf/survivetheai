import { expect, test } from '@playwright/test';
import { buildWelcomeEmailText, deriveSubscriberLifecycleProfile } from '../src/utils/subscriberLifecycle';

test('subscribe API reports disabled mode by default without capture credentials', async ({ request }) => {
  const response = await request.get('/api/subscribe');
  expect(response.ok()).toBeTruthy();

  const data = (await response.json()) as {
    status?: string;
    mode?: string;
    enabled?: boolean;
    hasCredentials?: boolean;
    provider?: string;
  };

  expect(data).toMatchObject({
    status: 'needs_config',
    mode: 'disabled',
    enabled: false,
    hasCredentials: false,
    provider: 'supabase+resend',
  });
});

test('subscriber lifecycle profile maps source pages into baseline segments', async () => {
  expect(deriveSubscriberLifecycleProfile('playbook')).toEqual({
    signupIntent: 'playbook',
    leadSegment: 'action-seeker',
    interestArea: null,
  });

  expect(deriveSubscriberLifecycleProfile('start-here')).toEqual({
    signupIntent: 'briefing',
    leadSegment: 'new-reader',
    interestArea: null,
  });

  expect(deriveSubscriberLifecycleProfile('hub-work-money')).toEqual({
    signupIntent: 'briefing',
    leadSegment: 'hub-specific',
    interestArea: 'work-money',
  });
});

test('welcome email baseline points readers to the next-step path for their segment', async () => {
  const playbookText = buildWelcomeEmailText(
    { signupIntent: 'playbook', leadSegment: 'action-seeker', interestArea: null },
    'https://survivetheai.com',
    'https://survivetheai.com/api/unsubscribe?token=abc',
  );
  expect(playbookText).toContain('Open the playbook path: https://survivetheai.com/playbook');

  const hubText = buildWelcomeEmailText(
    { signupIntent: 'briefing', leadSegment: 'hub-specific', interestArea: 'mind-attention' },
    'https://survivetheai.com',
    'https://survivetheai.com/api/unsubscribe?token=abc',
  );
  expect(hubText).toContain('Return to your pressure area: https://survivetheai.com/survival-areas/mind-attention');
});

test('confirmed page gives subscribers a clear next-step path', async ({ page }) => {
  await page.goto('/newsletter/confirmed/');

  await expect(page.getByTestId('newsletter-confirmed-page')).toContainText('Subscription confirmed');
  await expect(page.getByRole('link', { name: 'Go to the playbook' })).toHaveAttribute('href', '/playbook');
  await expect(page.getByRole('link', { name: 'Open Start Here' })).toHaveAttribute('href', '/start-here');
  await expect(page.getByRole('link', { name: 'Browse the library' })).toHaveAttribute('href', '/posts');
});
