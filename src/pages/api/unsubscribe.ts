import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const getEnv = () => {
  const siteUrl = import.meta.env.SITE_URL as string | undefined;

  const supabaseUrl = import.meta.env.SUPABASE_URL as string | undefined;
  const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

  return {
    siteUrl,
    supabaseUrl,
    supabaseKey: supabaseServiceRoleKey || supabaseAnonKey,
  };
};

const redirectTo = (request: Request, path: string, siteUrl?: string) => {
  const base = siteUrl ?? new URL(request.url).origin;
  return Response.redirect(new URL(path, base).toString(), 302);
};

export const GET: APIRoute = async ({ request }) => {
  const env = getEnv();

  if (!env.supabaseUrl || !env.supabaseKey) {
    console.error("[newsletter] Missing Supabase credentials");
    return new Response("Signup temporarily unavailable.", { status: 500 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return redirectTo(request, "/newsletter/unsubscribed", env.siteUrl);
  }

  try {
    const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: subscriber, error: lookupError } = await supabase
      .from("subscribers")
      .select("id")
      .eq("unsubscribe_token_hash", hashToken(token))
      .maybeSingle();

    if (lookupError) {
      console.error("[newsletter] Supabase unsubscribe lookup error", lookupError);
      return redirectTo(request, "/newsletter/unsubscribed", env.siteUrl);
    }

    if (subscriber) {
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({
          status: "unsubscribed",
          unsubscribed_at: new Date().toISOString(),
          confirm_token_hash: null,
          unsubscribe_token_hash: null,
        })
        .eq("id", subscriber.id);

      if (updateError) {
        console.error("[newsletter] Supabase unsubscribe update error", updateError);
      }
    }

    return redirectTo(request, "/newsletter/unsubscribed", env.siteUrl);
  } catch (err) {
    console.error("[newsletter] unexpected unsubscribe error", err);
    return redirectTo(request, "/newsletter/unsubscribed", env.siteUrl);
  }
};
