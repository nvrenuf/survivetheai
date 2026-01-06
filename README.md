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
- Inline forms post to `/api/subscribe`, which routes to Buttondown when enabled.
- Modes:
  - **Disabled:** default when `PUBLIC_ENABLE_SUBSCRIBE_API` is not `true`. Forms show “not enabled.”
  - **Log-only:** set `PUBLIC_ENABLE_SUBSCRIBE_API=true` and `SUBSCRIBE_LOG_ONLY=true`; requests log to the server console, no provider calls.
  - **Provider:** set `PUBLIC_ENABLE_SUBSCRIBE_API=true` with `BUTTONDOWN_API_KEY` (and optional `BUTTONDOWN_PUBLICATION_ID`); live Buttondown API calls return “Check your inbox.”
- Required environment variables:
  - `PUBLIC_ENABLE_SUBSCRIBE_API` (string `true`/`false`)
  - `SUBSCRIBE_LOG_ONLY` (string `true`/`false`, optional)
  - `BUTTONDOWN_API_KEY` (server-only, required for provider mode)
  - `BUTTONDOWN_PUBLICATION_ID` (server-only, optional for multi-publication setups)
- Safe enable checklist:
  - In a preview, set `PUBLIC_ENABLE_SUBSCRIBE_API=true` and `SUBSCRIBE_LOG_ONLY=true` to validate UI flow without Buttondown.
  - Add `BUTTONDOWN_API_KEY` (and optional publication ID) to the Preview environment, flip `SUBSCRIBE_LOG_ONLY=false`, and confirm successful subscriptions.
  - Promote the same secrets to Production, keep `PUBLIC_ENABLE_SUBSCRIBE_API=true`, and verify `/api/subscribe` GET reports `mode: "provider"` with `hasCredentials: true`.

## Analytics (minimal)
- Events:
  - `newsletter_submit`, `newsletter_success`, `newsletter_error` (emitted from subscribe flows with location + mode metadata).
  - `scroll_depth` at 25/50/75/90 thresholds on post pages.
- Enable GA4 by setting `PUBLIC_GA_MEASUREMENT_ID`; analytics uses `gtag` when present.
- Debug behavior:
  - If GA is absent and `PUBLIC_ANALYTICS_DEBUG=true` (or running in dev), events log to the console instead of sending to GA.
  - `warnIfAnalyticsMissing()` emits a console warning during server render when GA is not configured.

## Operator checklist
- Domains + SSL: set primary domain in Vercel (apex or `www`) and enforce redirects between apex and `www` to avoid duplicate origins; ensure TLS is active on both.
- Required env vars in Vercel:
  - Public: `PUBLIC_ENABLE_SUBSCRIBE_API`, `PUBLIC_ANALYTICS_DEBUG` (optional), `PUBLIC_GA_MEASUREMENT_ID` (optional).
  - Server-only: `BUTTONDOWN_API_KEY`, `BUTTONDOWN_PUBLICATION_ID` (optional), `SUBSCRIBE_LOG_ONLY` for preview safety.
- Healthy deployment verification:
  - `npm run build` succeeds locally or in CI.
  - `/api/subscribe` GET responds with the expected mode (`provider` with credentials, `log-only`, or disabled).
  - Page loads show GA script when `PUBLIC_GA_MEASUREMENT_ID` is set; in debug mode, console logs appear when GA is absent.
- Common failure modes:
  - Missing Vercel adapter → API routes omitted or 404 in production.
  - `PUBLIC_ENABLE_SUBSCRIBE_API=true` without `BUTTONDOWN_API_KEY` and `SUBSCRIBE_LOG_ONLY=true` → server errors on subscribe.
  - Setting `output` to `hybrid` in Astro v5 → build failure. Keep `output: "static"` and mark server routes with `prerender = false`.
Adding a line to force deploy