import type { APIRoute } from 'astro';
import { getSubscribeConfig } from '../../utils/env.server';

export const prerender = false;

const BAD_REQUEST = (message: string) =>
  new Response(JSON.stringify({ message, error: 'bad_request' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });

const SERVICE_UNAVAILABLE = (message: string, code = 'disabled') =>
  new Response(JSON.stringify({ message, error: code }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });

export const GET: APIRoute = () => {
  const config = getSubscribeConfig();
  return new Response(JSON.stringify({ status: 'ready', mode: config.mode, enabled: config.enabled, hasCredentials: config.hasCredentials }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const config = getSubscribeConfig();
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return BAD_REQUEST('Invalid request.');
  }

  const { email, source, honeypot } = (await request.json().catch(() => ({}))) as {
    email?: string;
    source?: string;
    honeypot?: string;
  };

  if (honeypot) {
    return new Response(JSON.stringify({ status: 'ignored' }), { status: 200 });
  }

  if (!email || !email.includes('@') || email.length > 150) {
    return BAD_REQUEST('Add a valid email to subscribe.');
  }

  if (!config.enabled) {
    return SERVICE_UNAVAILABLE("Newsletter signup isn't enabled yet.", 'disabled');
  }

  if (config.mode === 'log-only') {
    console.info(`[newsletter][log-only] ${email}`, { source: source ?? 'inline' });
    return new Response(
      JSON.stringify({
        status: 'pending',
        message: 'Saved (dev mode). Newsletter will go live soon.',
        mode: 'log-only',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!config.hasCredentials || !config.buttondownKey) {
    console.error('[newsletter] BUTTONDOWN_API_KEY missing while PUBLIC_ENABLE_SUBSCRIBE_API=true');
    return new Response(JSON.stringify({ message: 'Signup temporarily unavailable. Please try again later.', error: 'missing_credentials' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${config.buttondownKey}`,
      },
      body: JSON.stringify({
        email,
        notes: `Source: ${source ?? 'inline'}`,
        publication_id: config.publicationId || undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[newsletter][buttondown] error`, errorText);
      return new Response(
        JSON.stringify({ message: 'Unable to subscribe right now. Please try again later.', error: 'provider_error' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        status: 'subscribed',
        message: 'Check your inbox to confirm your subscription.',
        mode: 'provider',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('[newsletter] unexpected error', error);
    return new Response(
      JSON.stringify({ message: 'Something went wrong. Try again in a bit.', error: 'unexpected_error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
