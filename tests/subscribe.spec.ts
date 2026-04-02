import { expect, test } from '@playwright/test';

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
