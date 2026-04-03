# STA-23 Supabase Production Migration Runbook For Subscriber Schema

Reviewed on `2026-04-02` as a follow-up operational safeguard after a live subscriber-schema drift incident.

## Why This Exists

Recent production signup failed because Vercel logs showed `PGRST204` and production Supabase was missing `interest_area` on `public.subscribers`.

The code in [`src/pages/api/subscribe.ts`](C:\Users\lee\Documents\survivetheai\src\pages\api\subscribe.ts) was already writing later lifecycle and attribution fields, but the live database had not received the later subscriber migrations.

This runbook is the repo-specific process for keeping subscriber schema changes in sync with production before or immediately after deploy.

## Source Of Truth

- Base table definition: [`supabase/schema.sql`](C:\Users\lee\Documents\survivetheai\supabase\schema.sql)
- Subscriber follow-up migrations:
  - [`supabase/migrations/0001_newsletter_tokens.sql`](C:\Users\lee\Documents\survivetheai\supabase\migrations\0001_newsletter_tokens.sql)
  - [`supabase/migrations/0002_subscriber_attribution.sql`](C:\Users\lee\Documents\survivetheai\supabase\migrations\0002_subscriber_attribution.sql)
  - [`supabase/migrations/0003_subscriber_lifecycle_baseline.sql`](C:\Users\lee\Documents\survivetheai\supabase\migrations\0003_subscriber_lifecycle_baseline.sql)

Right now, those four files together define the subscriber columns the production handlers expect.

## Subscriber Migration Order

Apply in this order:

1. `supabase/schema.sql`
2. `supabase/migrations/0001_newsletter_tokens.sql`
3. `supabase/migrations/0002_subscriber_attribution.sql`
4. `supabase/migrations/0003_subscriber_lifecycle_baseline.sql`

Why this order:

- `schema.sql` creates the base `public.subscribers` table.
- `0001` adds lifecycle/token columns used by subscribe, confirm, and unsubscribe.
- `0002` adds attribution columns used by subscribe and reporting.
- `0003` adds segmentation columns and backfills values from `source_page`.

## Safe Production Apply Process

Before deploy when subscriber fields changed:

1. Check the PR for edits under `supabase/schema.sql`, `supabase/migrations/`, or subscriber writes in `src/pages/api/subscribe.ts`, `src/pages/api/confirm.ts`, or `src/pages/api/unsubscribe.ts`.
2. If subscriber schema changed, apply the needed SQL to production Supabase before enabling or relying on the new code path.
3. Prefer additive, idempotent SQL such as `add column if not exists` and `create index if not exists`.
4. If the change adds derived subscriber fields, include the matching backfill step from the migration so old rows are not left partially blank.
5. Only after the production table is aligned should the deployment be treated as complete.

If deploy already happened and signup is failing:

1. Inspect Vercel function logs for `/api/subscribe`, `/api/confirm`, or `/api/unsubscribe`.
2. Look for Supabase errors such as `PGRST204` naming a missing column.
3. Compare the missing column against the current migration chain in `supabase/`.
4. Apply the missing migration SQL to production Supabase SQL editor in the same order above.
5. Retest signup immediately after apply.

## Live DB Alignment Check

Use the Supabase SQL editor against production and verify the expected subscriber columns exist:

```sql
select
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'subscribers'
order by ordinal_position;
```

Minimum columns the current code path expects on `public.subscribers`:

- `email`
- `source_page`
- `signup_intent`
- `lead_segment`
- `interest_area`
- `page_path`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `status`
- `confirmed_at`
- `unsubscribed_at`
- `confirm_token_hash`
- `unsubscribe_token_hash`
- `last_ip`
- `last_user_agent`
- `created_at`

Also verify:

- `email` remains unique, because subscribe uses `upsert(..., { onConflict: "email" })`
- `subscribers_status_idx` exists after `0001`, because the migration chain creates it

Quick index check:

```sql
select
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'subscribers'
order by indexname;
```

## Retest After Apply

Run this production retest in order:

1. Submit a real signup through a live form.
2. Confirm a new or updated row appears in `public.subscribers`.
3. Verify subscribe wrote:
   - `status = 'pending'`
   - `confirm_token_hash`
   - `unsubscribe_token_hash`
   - attribution fields if present
   - lifecycle fields including `signup_intent`, `lead_segment`, and `interest_area` when applicable
4. Open the confirmation link and verify the row changes to:
   - `status = 'active'`
   - `confirmed_at` populated
   - `confirm_token_hash` cleared
5. Open the unsubscribe link and verify the row changes to:
   - `status = 'unsubscribed'`
   - `unsubscribed_at` populated
   - token hashes cleared

If the form still fails, go back to logs before making code changes.

## What To Check In Vercel Logs

For `/api/subscribe` failures, check for:

- `supabase_upsert_failed`
- `code`
- `message`
- `details`
- `hint`

The recent drift incident showed:

- Supabase error code `PGRST204`
- message naming missing column `interest_area`

For `/api/confirm` and `/api/unsubscribe`, check for:

- `[newsletter] Supabase confirm lookup error`
- `[newsletter] Supabase confirm update error`
- `[newsletter] Supabase unsubscribe lookup error`
- `[newsletter] Supabase unsubscribe update error`

If the error names a missing subscriber column, treat that as schema drift first, not an application bug first.

## Operator Rule

Do not assume production Supabase automatically matches repo migrations. For subscriber changes, treat migration apply plus live retest as part of deployment completion.
