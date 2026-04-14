import type { APIRoute } from "astro";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { deriveSubscriberLifecycleProfile } from "../../utils/subscriberLifecycle";

export const prerender = false;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getEmailDomain = (email: string) => {
  const [, domain = ""] = email.split("@");
  return domain.slice(0, 120) || "unknown";
};

const logSubscribe = (level: "info" | "warn" | "error", event: string, details: Record<string, unknown>) => {
  console[level]("[newsletter][subscribe]", JSON.stringify({ event, ...details }));
};

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
  const mode = env.enabled ? "provider" : "disabled";
  return json(200, {
    status,
    mode,
    enabled: env.enabled,
    hasCredentials: env.hasCredentials,
    provider: "supabase+resend",
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const env = getEnv();
  const requestId = randomUUID();
  const requestUrl = new URL(request.url);

  const contentType = request.headers.get("content-type") ?? "";
  logSubscribe("info", "request_received", {
    requestId,
    path: requestUrl.pathname,
    contentType,
    enabled: env.enabled,
    hasSiteUrl: Boolean(env.siteUrl),
    hasSupabase: Boolean(env.supabaseUrl && env.supabaseKey),
    hasResend: Boolean(env.resendApiKey && env.resendFrom),
  });

  if (!contentType.includes("application/json")) {
    logSubscribe("warn", "validation_failed", {
      requestId,
      reason: "bad_content_type",
      contentType,
    });
    return json(400, { ok: false, message: "Invalid request.", error: "bad_request" });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    email?: string;
    source?: string;
    source_page?: string;
    page_path?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    honeypot?: string;
    company?: string;
  };

  if (payload.honeypot || payload.company) {
    logSubscribe("info", "validation_ignored_honeypot", {
      requestId,
      sourcePage: (payload.source_page ?? payload.source ?? "").toString().slice(0, 80) || null,
    });
    return json(200, { ok: true, status: "ignored" });
  }

  const normalizedEmail = payload.email ? normalizeEmail(payload.email) : "";
  if (!normalizedEmail || !normalizedEmail.includes("@") || normalizedEmail.length > 254) {
    logSubscribe("warn", "validation_failed", {
      requestId,
      reason: "invalid_email",
      hasEmail: Boolean(payload.email),
      emailLength: normalizedEmail.length || 0,
    });
    return json(400, { ok: false, message: "Add a valid email to subscribe.", error: "bad_request" });
  }

  logSubscribe("info", "validation_passed", {
    requestId,
    emailDomain: getEmailDomain(normalizedEmail),
    sourcePage: (payload.source_page ?? payload.source ?? "").toString().slice(0, 80) || null,
    pagePath: (payload.page_path ?? "").toString().slice(0, 120) || null,
    hasReferrer: Boolean(payload.referrer),
    hasUtmSource: Boolean(payload.utm_source),
    hasUtmMedium: Boolean(payload.utm_medium),
    hasUtmCampaign: Boolean(payload.utm_campaign),
  });

  if (!env.enabled) {
    logSubscribe("warn", "request_rejected", {
      requestId,
      reason: "disabled",
    });
    return json(503, {
      ok: false,
      message: "Newsletter signup isn't enabled yet.",
      error: "disabled",
    });
  }

  if (!env.supabaseUrl || !env.supabaseKey) {
    logSubscribe("error", "request_rejected", {
      requestId,
      reason: "missing_supabase_credentials",
    });
    return json(500, {
      ok: false,
      message: "Signup storage is temporarily unavailable. Please try again later.",
      error: "missing_supabase_credentials",
    });
  }

  if (!env.resendApiKey || !env.resendFrom) {
    logSubscribe("error", "request_rejected", {
      requestId,
      reason: "missing_resend_credentials",
    });
    return json(500, {
      ok: false,
      message: "Confirmation email is temporarily unavailable. Please try again later.",
      error: "missing_resend_credentials",
    });
  }

  const sourceValue = (payload.source_page ?? payload.source ?? "").toString().slice(0, 200);
  const lifecycleProfile = deriveSubscriberLifecycleProfile(sourceValue);
  const pagePathValue = (payload.page_path ?? "").toString().slice(0, 200);
  const referrerValue = (payload.referrer ?? "").toString().slice(0, 200);
  const utmSourceValue = (payload.utm_source ?? "").toString().slice(0, 120);
  const utmMediumValue = (payload.utm_medium ?? "").toString().slice(0, 120);
  const utmCampaignValue = (payload.utm_campaign ?? "").toString().slice(0, 120);

  try {
    const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false },
    });

    logSubscribe("info", "supabase_lookup_started", {
      requestId,
      emailDomain: getEmailDomain(normalizedEmail),
    });
    const { data: existingSubscriber, error: lookupError } = await supabase
      .from("subscribers")
      .select("status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      logSubscribe("error", "supabase_lookup_failed", {
        requestId,
        code: "code" in lookupError ? lookupError.code : null,
        message: lookupError.message,
        details: lookupError.details ?? null,
        hint: lookupError.hint ?? null,
      });
      return json(500, {
        ok: false,
        message: "Signup storage is temporarily unavailable. Please try again later.",
        error: "db_error",
      });
    }

    logSubscribe("info", "supabase_lookup_completed", {
      requestId,
      existingStatus: existingSubscriber?.status ?? null,
    });

    if (existingSubscriber?.status === "unsubscribed") {
      logSubscribe("info", "request_completed", {
        requestId,
        outcome: "ignored_unsubscribed",
      });
      return json(200, { ok: true, status: "ok" });
    }

    const confirmToken = randomBytes(32).toString("hex");
    const unsubscribeToken = randomBytes(32).toString("hex");
    const lastIp = getClientIp(request, clientAddress);
    const lastUserAgent = request.headers.get("user-agent");

    logSubscribe("info", "supabase_upsert_started", {
      requestId,
      sourcePage: sourceValue || null,
      signupIntent: lifecycleProfile.signupIntent,
      leadSegment: lifecycleProfile.leadSegment,
      interestArea: lifecycleProfile.interestArea,
      hasIp: Boolean(lastIp),
      hasUserAgent: Boolean(lastUserAgent),
    });
    const { error: upsertError } = await supabase
      .from("subscribers")
      .upsert(
        {
          email: normalizedEmail,
          source_page: sourceValue || null,
          signup_intent: lifecycleProfile.signupIntent,
          lead_segment: lifecycleProfile.leadSegment,
          interest_area: lifecycleProfile.interestArea,
          page_path: pagePathValue || null,
          referrer: referrerValue || null,
          utm_source: utmSourceValue || null,
          utm_medium: utmMediumValue || null,
          utm_campaign: utmCampaignValue || null,
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
      logSubscribe("error", "supabase_upsert_failed", {
        requestId,
        code: "code" in upsertError ? upsertError.code : null,
        message: upsertError.message,
        details: upsertError.details ?? null,
        hint: upsertError.hint ?? null,
      });
      return json(500, {
        ok: false,
        message: "Signup storage is temporarily unavailable. Please try again later.",
        error: "db_error",
      });
    }

    logSubscribe("info", "supabase_upsert_completed", {
      requestId,
      status: "pending",
    });

    const resend = new Resend(env.resendApiKey);
    const base = (env.siteUrl ?? new URL(request.url).origin).replace(/\/$/, "");
    const confirmUrl = `${base}/api/confirm?token=${confirmToken}`;

    logSubscribe("info", "resend_send_started", {
      requestId,
      emailDomain: getEmailDomain(normalizedEmail),
      hasSiteUrl: Boolean(env.siteUrl),
      baseOrigin: new URL(base).origin,
    });
    const sendResult = await resend.emails.send({
      from: env.resendFrom,
      to: [normalizedEmail],
      subject: "Confirm your Survive the AI subscription",
      text: `Confirm your subscription to Survive the AI:\n\n${confirmUrl}\n\nIf you didn't request this, you can ignore this email.`,
    });

    const resendError =
      typeof sendResult === "object" && sendResult && "error" in sendResult
        ? (sendResult as { error?: unknown }).error
        : undefined;

    if (resendError) {
      logSubscribe("error", "resend_send_failed", {
        requestId,
        error: resendError,
      });
      return json(502, {
        ok: false,
        message: "Confirmation email could not be sent right now. Please try again later.",
        error: "email_error",
      });
    }

    logSubscribe("info", "resend_send_completed", {
      requestId,
      status: "pending",
    });
    logSubscribe("info", "request_completed", {
      requestId,
      outcome: "pending_confirmation",
    });
    return json(200, { ok: true, status: "pending", message: "Check your inbox to confirm." });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logSubscribe("error", "request_failed_unexpected", {
      requestId,
      errorMessage,
    });
    return json(500, {
      ok: false,
      message: "Something went wrong. Try again in a bit.",
      error: "unexpected_error",
    });
  }
};
