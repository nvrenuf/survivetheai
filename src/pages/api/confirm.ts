import type { APIRoute } from "astro";
import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const prerender = false;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const getEnv = () => {
  const enabled = (import.meta.env.PUBLIC_ENABLE_SUBSCRIBE_API ?? "").toLowerCase() === "true";
  const siteUrl = import.meta.env.SITE_URL as string | undefined;

  const supabaseUrl = import.meta.env.SUPABASE_URL as string | undefined;
  const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

  const resendApiKey = import.meta.env.RESEND_API_KEY as string | undefined;
  const resendFrom = import.meta.env.RESEND_FROM as string | undefined;

  return {
    enabled,
    siteUrl,
    supabaseUrl,
    supabaseKey: supabaseServiceRoleKey || supabaseAnonKey,
    resendApiKey,
    resendFrom,
  };
};

const redirectTo = (request: Request, path: string, siteUrl?: string) => {
  const base = siteUrl ?? new URL(request.url).origin;
  return Response.redirect(new URL(path, base).toString(), 302);
};

export const GET: APIRoute = async ({ request }) => {
  const env = getEnv();

  if (!env.enabled) {
    return new Response(JSON.stringify({ ok: false, message: "Newsletter signup isn't enabled yet.", error: "disabled" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!env.supabaseUrl || !env.supabaseKey) {
    console.error("[newsletter] Missing Supabase credentials");
    return new Response("Signup temporarily unavailable.", { status: 500 });
  }

  if (!env.resendApiKey || !env.resendFrom) {
    console.error("[newsletter] Missing Resend credentials");
    return new Response("Signup temporarily unavailable.", { status: 500 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirectTo(request, "/newsletter/confirmed", env.siteUrl);
  }

  const tokenHash = hashToken(token);

  try {
    const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: subscriber, error: lookupError } = await supabase
      .from("subscribers")
      .select("id,status,email")
      .eq("confirm_token_hash", tokenHash)
      .maybeSingle();

    if (lookupError) {
      console.error("[newsletter] Supabase confirm lookup error", lookupError);
      return redirectTo(request, "/newsletter/confirmed", env.siteUrl);
    }

    if (!subscriber) {
      return redirectTo(request, "/newsletter/confirmed", env.siteUrl);
    }

    if (subscriber.status === "unsubscribed") {
      return redirectTo(request, "/newsletter/unsubscribed", env.siteUrl);
    }

    const unsubscribeToken = randomBytes(32).toString("hex");
    const unsubscribeTokenHash = hashToken(unsubscribeToken);

    const { error: updateError } = await supabase
      .from("subscribers")
      .update({
        status: "active",
        confirmed_at: new Date().toISOString(),
        confirm_token_hash: null,
        unsubscribe_token_hash: unsubscribeTokenHash,
      })
      .eq("id", subscriber.id);

    if (updateError) {
      console.error("[newsletter] Supabase confirm update error", updateError);
      return redirectTo(request, "/newsletter/confirmed", env.siteUrl);
    }

    const base = (env.siteUrl ?? new URL(request.url).origin).replace(/\\/$/, "");
    const unsubscribeUrl = `${base}/api/unsubscribe?token=${unsubscribeToken}`;
    const resend = new Resend(env.resendApiKey);
    const sendResult = await resend.emails.send({
      from: env.resendFrom,
      to: [subscriber.email],
      subject: "Welcome to Survive the AI",
      text:
        "Welcome to Survive the AI.\n\n" +
        "What you'll receive: weekly survival intel - early signals, what they mean, and what to do next.\n\n" +
        `Home: ${base}\n\n` +
        `Unsubscribe: ${unsubscribeUrl}`,
    });

    // @ts-expect-error - tolerate SDK shape differences
    if (sendResult?.error) {
      // @ts-expect-error
      console.error("[newsletter] Resend send error", sendResult.error);
    }

    return redirectTo(request, "/newsletter/confirmed", env.siteUrl);
  } catch (err) {
    console.error("[newsletter] unexpected confirm error", err);
    return redirectTo(request, "/newsletter/confirmed", env.siteUrl);
  }
};
