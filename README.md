# SurviveTheAI

Operator notes for the SurviveTheAI site built with Astro and deployed to Vercel.

## Deployment architecture
- Astro v5 site deployed on Vercel.
- Uses the official `@astrojs/vercel` adapter (`adapter: vercel()` in `astro.config.mjs`) so server endpoints and on‑demand rendering are packaged as Vercel functions. Without the adapter, API routes like `/api/subscribe` will fail or be excluded from the build.
- Primary rendering mode is static; Vercel serves static assets from the edge CDN and routes API traffic to serverless functions.

## Astro build configuration
- `output: "static"` is set in `astro.config.mjs` for Astro v5. Static builds keep page rendering fast and cacheable.
- Vercel adapter must remain enabled; removing it breaks server routes and Vercel deploys.
- Any server route that should not be prerendered must export `export const prerender = false;` (see `src/pages/api/subscribe.ts`) so Astro ships it as a function.
- `output: "hybrid"` is invalid in Astro v5—do not set it. Use `output: "static"` with selective `prerender = false` for server needs.

## Newsletter / Subscribe system
- Inline forms on newsletter and playbook surfaces post to `/api/subscribe`.
- Modes:
  - **Disabled:** default when `PUBLIC_ENABLE_SUBSCRIBE_API` is not `true`. Forms disable submit and show that signup is not enabled yet.
  - **Provider:** set `PUBLIC_ENABLE_SUBSCRIBE_API=true` with Supabase + Resend credentials. `/api/subscribe` creates or updates a row in `public.subscribers`, stores a hashed confirm token plus basic request metadata, and sends a confirmation email through Resend.
- Required environment variables:
  - `PUBLIC_ENABLE_SUBSCRIBE_API` (string `true`/`false`)
  - `SITE_URL` (used for confirmation/unsubscribe links; request origin is the fallback)
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (preferred) or `SUPABASE_ANON_KEY` (fallback)
  - `RESEND_API_KEY`
  - `RESEND_FROM`
- Safe enable checklist:
  - In Preview or Production, set `PUBLIC_ENABLE_SUBSCRIBE_API=true` only after Supabase + Resend credentials are present.
  - Apply `supabase/schema.sql` plus `supabase/migrations/0001_newsletter_tokens.sql` and `supabase/migrations/0002_subscriber_attribution.sql` so the `subscribers` table includes status, token, request-metadata, and attribution columns used by the handlers.
  - Verify `/api/subscribe` GET reports `mode: "provider"` and `hasCredentials: true`.
  - Submit a test signup, confirm a pending row is written to `public.subscribers`, complete `/api/confirm`, and verify the row transitions to `status = "active"`.
  - Verify `/api/unsubscribe` clears the active subscription state and sends the user to `/newsletter/unsubscribed`.

## Analytics (minimal)
- Events:
  - `newsletter_submit`, `newsletter_success`, `newsletter_error` (emitted from subscribe flows with location + mode metadata).
  - `start_here_entry_click` for the guided-path entry points.
  - `playbook_cta_click` for primary playbook conversion CTAs.
  - `start_here_content_click` for the featured-story jump on `/start-here`.
  - `scroll_depth` at 25/50/75/90 thresholds on post pages.
- Attribution baseline on subscribe:
  - `source_page` from the CTA/form location
  - `page_path`
  - `referrer`
  - `utm_source`, `utm_medium`, `utm_campaign`
- Enable GA4 by setting `PUBLIC_GA_MEASUREMENT_ID`; analytics uses `gtag` when present.
- Debug behavior:
  - If GA is absent and `PUBLIC_ANALYTICS_DEBUG=true` (or running in dev), events log to the console instead of sending to GA.
  - `warnIfAnalyticsMissing()` emits a console warning during server render when GA is not configured.

## Operator checklist
- Domains + SSL: set primary domain in Vercel (apex or `www`) and enforce redirects between apex and `www` to avoid duplicate origins; ensure TLS is active on both.
- Required env vars in Vercel:
  - Public: `PUBLIC_ENABLE_SUBSCRIBE_API`, `PUBLIC_ANALYTICS_DEBUG` (optional), `PUBLIC_GA_MEASUREMENT_ID` (optional).
  - Server-only: `SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (preferred) or `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `RESEND_FROM`.
- Healthy deployment verification:
  - `npm run build` succeeds locally or in CI.
  - `/api/subscribe` GET responds with the expected mode (`provider` or `disabled`) and truthful `hasCredentials`.
  - Supabase captures pending subscribers in `public.subscribers`, keyed by unique email.
  - Confirmation email links resolve through `/api/confirm` and unsubscribe links through `/api/unsubscribe`.
  - Page loads show GA script when `PUBLIC_GA_MEASUREMENT_ID` is set; in debug mode, console logs appear when GA is absent.
- Common failure modes:
  - Missing Vercel adapter → API routes omitted or 404 in production.
  - `PUBLIC_ENABLE_SUBSCRIBE_API=true` without Supabase or Resend credentials → `/api/subscribe` returns a temporary-unavailable error.
  - Supabase table schema not migrated → database lookup/upsert failures during subscribe/confirm/unsubscribe.
  - Setting `output` to `hybrid` in Astro v5 → build failure. Keep `output: "static"` and mark server routes with `prerender = false`.
## Control surfaces
- Active issue queue: `ISSUE_ORDER.md`
- Agent entrypoint: `AGENT.md`
- Execution standard: `docs/workflows/standards/STA-Agent-Docs-Standard.md`
- Historical issue docs: `docs/issues/README.md`
