import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getSubscribeConfig } from '../../utils/env.server';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const BAD_REQUEST = (message: string) =>
  new Response(JSON.stringify({ ok: false, message, error: 'bad_request' }), {
    status: 400,
    headers: JSON_HEADERS,
  });

const SERVICE_UNAVAILABLE = (message: string, code = 'disabled') =>
  new Response(JSON.stringify({ ok: false, message, error: code }), {
    status: 503,
    headers: JSON_HEADERS,
  });

export const GET: APIRoute = () => {
  const config = getSubscribeConfig();
  return new Response(JSON.stringify({ status: 'ready', mode: config.mode, enabled: config.enabled, hasCredentials: config.hasCredentials }), {
    status: 200,
    headers: JSON_HEADERS,
  });
};

export const POST: APIRoute = async ({ request }) => {
  const config = getSubscribeConfig();
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return BAD_REQUEST('Invalid request.');
  }

  const { email, source_page, source, company } = (await request.json().catch(() => ({}))) as {
    email?: string;
    source_page?: string;
    source?: string;
    company?: string;
  };

  if (company) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
  }

  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@') || normalizedEmail.length > 254) {
    return BAD_REQUEST('Add a valid email to subscribe.');
  }

  if (!config.enabled) {
    return SERVICE_UNAVAILABLE("Newsletter signup isn't enabled yet.", 'disabled');
  }

  if (config.mode === 'log-only') {
    console.info(`[newsletter][log-only] ${normalizedEmail}`, { source_page: source_page ?? source ?? 'inline' });
    return new Response(JSON.stringify({ ok: true, mode: 'log-only' }), { status: 200, headers: JSON_HEADERS });
  }

  try {
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.SUPABASE_ANON_KEY;
    const resendKey = import.meta.env.RESEND_API_KEY;
    const resendFrom = import.meta.env.RESEND_FROM;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[newsletter] Supabase credentials missing.');
      return new Response(JSON.stringify({ ok: false, message: 'Signup temporarily unavailable. Please try again later.' }), {
        status: 500,
        headers: JSON_HEADERS,
      });
    }

    if (!resendKey || !resendFrom) {
      console.error('[newsletter] Resend credentials missing.');
      return new Response(JSON.stringify({ ok: false, message: 'Signup temporarily unavailable. Please try again later.' }), {
        status: 500,
        headers: JSON_HEADERS,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from('subscribers').upsert(
      {
        email: normalizedEmail,
        source_page: source_page ?? source ?? null,
      },
      { onConflict: 'email' },
    );

    if (error) {
      console.error('[newsletter] Supabase upsert failed', error);
      return new Response(JSON.stringify({ ok: false, message: 'Unable to subscribe right now. Please try again later.' }), {
        status: 500,
        headers: JSON_HEADERS,
      });
    }

    const resend = new Resend(resendKey);
    const origin = new URL('/', request.url).origin;
    const subject = import.meta.env.RESEND_WELCOME_SUBJECT ?? 'Welcome to Survive the AI';
    const text = `You're in.\n\nExpect weekly survival intel—practical moves to protect your work, family, and focus.\n\nVisit: ${origin}\n\nUnsubscribe anytime via your email provider.`;
    const { error: resendError } = await resend.emails.send({
      from: resendFrom,
      to: normalizedEmail,
      subject,
      text,
    });

    if (resendError) {
      console.error('[newsletter] Resend error', resendError);
      return new Response(JSON.stringify({ ok: false, message: 'Unable to subscribe right now. Please try again later.' }), {
        status: 500,
        headers: JSON_HEADERS,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
  } catch (error) {
    console.error('[newsletter] unexpected error', error);
    return new Response(JSON.stringify({ ok: false, message: 'Something went wrong. Try again in a bit.', error: 'unexpected_error' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
