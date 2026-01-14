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
  const status = config.enabled && config.hasCredentials ? 'ready' : 'needs_config';
  return new Response(JSON.stringify({ status, enabled: config.enabled, hasCredentials: config.hasCredentials }), {
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
    return new Response(JSON.stringify({ status: 'ignored' }), { status: 200, headers: JSON_HEADERS });
  }

  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@') || normalizedEmail.length > 254) {
    return BAD_REQUEST('Add a valid email to subscribe.');
  }

  if (!config.enabled) {
    return SERVICE_UNAVAILABLE("Newsletter signup isn't enabled yet.", 'disabled');
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
    const subject = "You're on the Survive the AI list";
    const text = `Welcome to the Survive the AI list.\n\nEach week you'll get practical, no-fluff guidance on navigating AI at work and in life.\n\nRead more: https://www.survivetheai.com`;
    const { error: resendError } = await resend.emails.send({
      from: resendFrom,
      to: normalizedEmail,
      subject,
      text,
    });

    if (resendError) {
      console.error('[newsletter] Resend error', resendError);
      return new Response(JSON.stringify({ ok: false, message: 'Unable to subscribe right now. Please try again later.' }), {
        status: 502,
        headers: JSON_HEADERS,
      });
    }

    return new Response(JSON.stringify({ ok: true, status: 'subscribed' }), { status: 200, headers: JSON_HEADERS });
  } catch (error) {
    console.error('[newsletter] unexpected error', error);
    return new Response(JSON.stringify({ ok: false, message: 'Something went wrong. Try again in a bit.', error: 'unexpected_error' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
