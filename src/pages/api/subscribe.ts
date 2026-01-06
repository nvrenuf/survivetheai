import type { APIRoute } from 'astro';
export const prerender = true;

const BUTTONDOWN_API_KEY = import.meta.env.BUTTONDOWN_API_KEY;
const BUTTONDOWN_PUBLICATION_ID = import.meta.env.BUTTONDOWN_PUBLICATION_ID;

const BAD_REQUEST = (message: string) =>
  new Response(JSON.stringify({ message }), { status: 400, headers: { 'Content-Type': 'application/json' } });

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ status: 'ready', mode: BUTTONDOWN_API_KEY ? 'provider' : 'log-only' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return BAD_REQUEST('Invalid request.');
  }

  const { email, source } = (await request.json().catch(() => ({}))) as { email?: string; source?: string };
  if (!email || !email.includes('@')) {
    return BAD_REQUEST('Add a valid email to subscribe.');
  }

  // Default: log-only mode to avoid losing submissions while credentials are not configured.
  if (!BUTTONDOWN_API_KEY) {
    console.info(`[newsletter][log-only] ${email}`, { source: source ?? 'inline' });
    return new Response(
      JSON.stringify({
        status: 'pending',
        message: 'Newsletter coming soon. You are on the early-access list.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        notes: `Source: ${source ?? 'inline'}`,
        publication_id: BUTTONDOWN_PUBLICATION_ID || undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[newsletter][buttondown] error`, errorText);
      return BAD_REQUEST('Unable to subscribe right now. Please try again later.');
    }

    return new Response(
      JSON.stringify({
        status: 'subscribed',
        message: 'Welcome to SurviveTheAI. Watch your inbox for the next drop.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('[newsletter] unexpected error', error);
    return new Response(
      JSON.stringify({ message: 'Something went wrong. Try again in a bit.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
