import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const prerender = false;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const getEnv = () => {
  const enabled = (import.meta.env.PUBLIC_ENABLE_SUBSCRIBE_API ?? "").toLowerCase() === "true";

  const supabaseUrl = import.meta.env.SUPABASE_URL as string | undefined;
  const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

  const resendApiKey = import.meta.env.RESEND_API_KEY as string | undefined;
  const resendFrom = import.meta.env.RESEND_FROM as string | undefined;

  const hasSupabase = Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey));
  const hasResend = Boolean(resendApiKey && resendFrom);

  return {
    enabled,
    supabaseUrl,
    supabaseKey: supabaseServiceRoleKey || supabaseAnonKey,
    supabaseKeyType: supabaseServiceRoleKey ? "service_role" : supabaseAnonKey ? "anon" : "missing",
    resendApiKey,
    resendFrom,
    hasCredentials: hasSupabase && hasResend,
    hasSupabase,
    hasResend,
  };
};

export const GET: APIRoute = () => {
  const env = getEnv();
  return json(200, {
    status: "ready",
    enabled: env.enabled,
    hasCredentials: env.hasCredentials,
    provider: "supabase+resend",
    supabaseKeyType: env.supabaseKeyType,
    hasSupabase: env.hasSupabase,
    hasResend: env.hasResend,
  });
};

export const POST: APIRoute = async ({ request }) => {
  const env = getEnv();

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json(400, { ok: false, message: "Invalid request.", error: "bad_request" });
  }

  // Accept both old and new field names to avoid breaking clients
  const payload = (await request.json().catch(() => ({}))) as {
    email?: string;
    source?: string;
    source_page?: string;
    honeypot?: string;
    company?: string; // optional honeypot field name
  };

  // Honeypot: if present, pretend success (anti-bot)
  if (payload.honeypot || payload.company) {
    return json(200, { ok: true, status: "ignored" });
  }

  const rawEmail = (payload.email ?? "").trim();
  const email = rawEmail.toLowerCase();

  // Basic validation (kept intentionally simple)
  if (!email || !email.includes("@") || email.length > 254) {
    return json(400, { ok: false, message: "Add a valid email to subscribe.", error: "bad_request" });
  }

  if (!env.enabled) {
    return json(503, {
      ok: false,
      message: "Newsletter signup isn't enabled yet.",
      error: "disabled",
    });
  }

  if (!env.supabaseUrl || !env.supabaseKey) {
    console.error("[newsletter] Missing Supabase credentials");
    return json(500, {
      ok: false,
      message: "Signup temporarily unavailable. Please try again later.",
      error: "missing_supabase_credentials",
    });
  }

  if (!env.resendApiKey || !env.resendFrom) {
    console.error("[newsletter] Missing Resend credentials");
    return json(500, {
      ok: false,
      message: "Signup temporarily unavailable. Please try again later.",
      error: "missing_resend_credentials",
    });
  }

  const sourcePage = (payload.source_page ?? payload.source ?? "inline").toString().slice(0, 200);

  try {
    // Supabase insert/upsert (do not reveal if they already exist)
    const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false },
    });

    const { error: upsertError } = await supabase
      .from("subscribers")
      .upsert({ email, source_page: sourcePage }, { onConflict: "email" });

    if (upsertError) {
      console.error("[newsletter] Supabase upsert error", upsertError);
      return json(500, {
        ok: false,
        message: "Signup temporarily unavailable. Please try again later.",
        error: "db_error",
      });
    }

    // Resend welcome email
    const resend = new Resend(env.resendApiKey);

    const subject = "You're on the Survive the AI list";
    const text =
      `You’re subscribed.\n\n` +
      `What you’ll get: weekly survival intel—early signals, what it means, and what to do next.\n\n` +
      `Start here: https://www.survivetheai.com\n`;

    const sendResult = await resend.emails.send({
      from: env.resendFrom,
      to: [email],
      subject,
      text,
    });

    // Resend SDK returns { data, error } patterns depending on version
    // Defensive handling:
    // @ts-expect-error - tolerate SDK shape differences
    if (sendResult?.error) {
      // @ts-expect-error
      console.error("[newsletter] Resend send error", sendResult.error);
      // Don’t fail signup if email send fails; DB already has them.
      return json(200, {
        ok: true,
        status: "subscribed",
        message: "Subscribed. (Welcome email may be delayed.)",
        emailSent: false,
      });
    }

    return json(200, {
      ok: true,
      status: "subscribed",
      message: "Check your inbox.",
      emailSent: true,
    });
  } catch (err) {
    console.error("[newsletter] unexpected error", err);
    return json(500, {
      ok: false,
      message: "Something went wrong. Try again in a bit.",
      error: "unexpected_error",
    });
  }
};
