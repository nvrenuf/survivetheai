# STA-11 Lead Capture And Signup Path Audit

Reviewed on `2026-04-02` for the active `STA Operations, Capture, and Editorial Enforcement Pass`.

## Verified Current Path

### Reader-facing entry points

- Homepage newsletter block via [`src/components/SubscribeInline.tsx`](C:\Users\lee\Documents\survivetheai\src\components\SubscribeInline.tsx) with `location="home"`
- Start Here newsletter block via [`src/components/SubscribeInline.tsx`](C:\Users\lee\Documents\survivetheai\src\components\SubscribeInline.tsx) with `location="start-here"`
- Playbook landing page signup via [`src/pages/playbook.astro`](C:\Users\lee\Documents\survivetheai\src\pages\playbook.astro) with `location="playbook"`
- Hub and article newsletter surfaces also reuse the same inline component with different `location` values

### Form to handler path

1. [`src/components/SubscribeInline.tsx`](C:\Users\lee\Documents\survivetheai\src\components\SubscribeInline.tsx) collects `email` plus a hidden `company` honeypot field.
2. The client posts JSON to [`src/pages/api/subscribe.ts`](C:\Users\lee\Documents\survivetheai\src\pages\api\subscribe.ts) with:
   - `email`
   - `source_page` = UI location string such as `home`, `playbook`, `post`, `hub-work-money`
   - `company` = honeypot
3. [`src/pages/api/subscribe.ts`](C:\Users\lee\Documents\survivetheai\src\pages\api\subscribe.ts) normalizes the email, rejects obvious invalid input, ignores honeypot hits, checks env readiness, and upserts into Supabase.
4. Storage writes go to `public.subscribers` defined by [`supabase/schema.sql`](C:\Users\lee\Documents\survivetheai\supabase\schema.sql) plus [`supabase/migrations/0001_newsletter_tokens.sql`](C:\Users\lee\Documents\survivetheai\supabase\migrations\0001_newsletter_tokens.sql).
5. The subscribe handler sends a confirmation email through Resend containing a `/api/confirm?token=...` link.
6. [`src/pages/api/confirm.ts`](C:\Users\lee\Documents\survivetheai\src\pages\api\confirm.ts) resolves the confirm token, flips the row to `status = "active"`, clears the confirm token hash, sets a fresh unsubscribe token hash, and sends the welcome email.
7. [`src/pages/api/unsubscribe.ts`](C:\Users\lee\Documents\survivetheai\src\pages\api\unsubscribe.ts) resolves the unsubscribe token, flips the row to `status = "unsubscribed"`, stamps `unsubscribed_at`, and clears token hashes.

## Storage Verdict

- Newsletter and playbook signups are captured through **Supabase**, not Buttondown.
- The real storage path is:
  - form
  - `/api/subscribe`
  - `public.subscribers` in Supabase
  - Resend confirmation email
  - `/api/confirm`
  - active subscriber state in Supabase

## Required Environment / Vercel Assumptions

- `PUBLIC_ENABLE_SUBSCRIBE_API=true`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` preferred, with `SUPABASE_ANON_KEY` only as code fallback
- `RESEND_API_KEY`
- `RESEND_FROM`
- `SITE_URL` preferred for generated confirm/unsubscribe links, though request origin is used as a runtime fallback
- Astro must stay on the Vercel adapter with `prerender = false` on the API routes

## Verified Gaps And Risks

### Failure handling

- If Supabase credentials are missing, subscribe/confirm/unsubscribe fail server-side.
- If Resend credentials are missing, subscribe cannot complete and confirm cannot send the welcome email.
- The issue was that subscribe preflight readiness did not accurately expose provider mode to the client; that was corrected in this issue so the frontend can distinguish disabled from enabled-but-misconfigured.

### Validation gaps

- Email validation is minimal: presence of `@` plus max-length guard. There is no stronger format validation.
- There is no explicit rate limiting or abuse throttling at the API layer.

### Dedupe behavior

- Dedupe is email-based only via Supabase `upsert(..., { onConflict: "email" })`.
- Existing `unsubscribed` rows return success from subscribe without reactivation or new confirmation flow. That prevents duplicate records, but it also means re-subscribe intent is not recovered automatically.

### Attribution gaps

- Attribution is limited to the coarse `source_page` location string supplied by the UI.
- No UTM capture, referrer capture, campaign ID, or first-touch/last-touch attribution is stored in the current signup path.

### Operational/documentation gaps found

- Repo docs and env examples still referenced the retired Buttondown/log-only flow before this audit.
- Typed env declarations also still referenced Buttondown variables before this audit.

## Scope Boundary

- This audit does **not** implement email automation, segmentation, campaign logic, redesign, or broader monetization strategy.
- Those belong to later operations-pass issues.
