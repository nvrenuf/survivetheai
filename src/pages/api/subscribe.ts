import type { APIRoute } from "astro";
import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const prerender = false;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getClientIp = (request: Request, clientAddress?: string) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const headerIp = forwardedFor?.split(",")[0]?.trim();
  return headerIp || clientAddress || null;
};

const getEnv = () => {
  const enabled = (import.meta.env.PUBLIC_ENABLE_SUBSCRIBE_API ?? "").toLowerCase() === "true";
  const siteUrl = import.meta.env.SITE_URL as string | undefined;

  const supabaseUrl = import.meta.env.SUPABASE_URL as string | undefined;
  const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

  const resendApiKey = import.meta.env.RESEND_API_KEY as string | undefined;
  const resendFrom = import.meta.env.RESEND_FROM as string | undefined;

  const hasSupabase = Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey));
  const hasResend = Boolean(resendApiKey && resendFrom);

  return {
    enabled,
    siteUrl,
    supabaseUrl,
    supabaseKey: supabaseServiceRoleKey || supabaseAnonKey,
    resendApiKey,
    resendFrom,
    hasCredentials: hasSupabase && hasResend && Boolean(siteUrl),
  };
};

export const GET: APIRoute = () => {
  const env = getEnv();
  const status = env.enabled && env.hasCredentials ? "ready" : "needs_config";
  return json(200, {
    status,
    enabled: env.enabled,
    hasCredentials: env.hasCredentials,
    provider: "supabase+resend",
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const env = getEnv();

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json(400, { ok: false, message: "Invalid request.", error: "bad_request" });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    email?: string;
    source?: string;
    source_page?: string;
    honeypot?: string;
    company?: string;
  };

  if (payload.honeypot || payload.company) {
    return json(200, { ok: true, status: "ignored" });
  }

  const normalizedEmail = payload.email ? normalizeEmail(payload.email) : "";
  if (!normalizedEmail || !normalizedEmail.includes("@") || normalizedEmail.length > 254) {
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

  if (!env.siteUrl) {
    console.error("[newsletter] Missing SITE_URL");
    return json(500, {
      ok: false,
      message: "Signup temporarily unavailable. Please try again later.",
      error: "missing_site_url",
    });
  }

  const sourceValue = (payload.source_page ?? payload.source ?? "").toString().slice(0, 200);

  try {
    const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: existingSubscriber, error: lookupError } = await supabase
      .from("subscribers")
      .select("status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.error("[newsletter] Supabase lookup error", lookupError);
      return json(500, {
        ok: false,
        message: "Unable to subscribe right now. Please try again later.",
        error: "db_error",
      });
    }

    if (existingSubscriber?.status === "unsubscribed") {
      return json(200, { ok: true, status: "ok" });
    }

    const confirmToken = randomBytes(32).toString("hex");
    const unsubscribeToken = randomBytes(32).toString("hex");
    const lastIp = getClientIp(request, clientAddress);
    const lastUserAgent = request.headers.get("user-agent");

    const { error: upsertError } = await supabase
      .from("subscribers")
      .upsert(
        {
          email: normalizedEmail,
          source_page: sourceValue || null,
          status: "pending",
          confirmed_at: null,
          unsubscribed_at: null,
          confirm_token_hash: hashToken(confirmToken),
          unsubscribe_token_hash: hashToken(unsubscribeToken),
          last_ip: lastIp,
          last_user_agent: lastUserAgent ?? null,
        },
        { onConflict: "email" },
      );

    if (upsertError) {
      console.error("[newsletter] Supabase upsert error", upsertError);
      return json(500, {
        ok: false,
        message: "Signup temporarily unavailable. Please try again later.",
        error: "db_error",
      });
    }

    const resend = new Resend(env.resendApiKey);
    const confirmUrl = `${env.siteUrl.replace(/\\/$/, "")}/api/confirm?token=${confirmToken}`;

    const sendResult = await resend.emails.send({
      from: env.resendFrom,
      to: [normalizedEmail],
      subject: "Confirm your Survive the AI subscription",
      text: `Confirm your subscription to Survive the AI:\n\n${confirmUrl}\n\nIf you didn't request this, you can ignore this email.`,
    });

    // @ts-expect-error - tolerate SDK shape differences
    if (sendResult?.error) {
      // @ts-expect-error
      console.error("[newsletter] Resend send error", sendResult.error);
      return json(502, {
        ok: false,
        message: "Unable to subscribe right now. Please try again later.",
        error: "email_error",
      });
    }

    return json(200, { ok: true, status: "pending", message: "Check your inbox to confirm." });
  } catch (err) {
    console.error("[newsletter] unexpected error", err);
    return json(500, {
      ok: false,
      message: "Something went wrong. Try again in a bit.",
      error: "unexpected_error",
    });
  }
};
