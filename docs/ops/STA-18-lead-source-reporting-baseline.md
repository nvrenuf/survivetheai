# STA-18 Lead-Source Reporting And Operator Dashboard Baseline

Reviewed on `2026-04-02` for the active `STA Subscriber Experience, Reporting, and Offer Architecture Pass`.

## Existing Attribution Data

Subscriber records already store the minimal attribution baseline introduced earlier:

- `source_page`
- `page_path`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `signup_intent`
- `lead_segment`

Storage source of truth:

- [`supabase/schema.sql`](C:\Users\lee\Documents\survivetheai\supabase\schema.sql)
- [`supabase/migrations/0002_subscriber_attribution.sql`](C:\Users\lee\Documents\survivetheai\supabase\migrations\0002_subscriber_attribution.sql)
- [`supabase/migrations/0003_subscriber_lifecycle_baseline.sql`](C:\Users\lee\Documents\survivetheai\supabase\migrations\0003_subscriber_lifecycle_baseline.sql)

## Gap Before This Issue

The data existed, but the operator path did not. Reviewing lead sources required digging through raw Supabase rows manually, which was too fragile for a baseline operational workflow.

## Baseline Implemented

This issue adds one lightweight repo-native reporting path:

- [`scripts/report-lead-sources.mjs`](C:\Users\lee\Documents\survivetheai\scripts\report-lead-sources.mjs)
- npm entrypoint:
  - `npm run report:lead-sources -- --limit=50`

The script:

- reads recent subscriber rows from Supabase
- optionally filters by status
- prints grouped counts for:
  - `source_page`
  - `page_path`
  - `referrer`
  - UTM combinations
- prints a recent-row table so an operator can inspect actual attribution patterns without raw SQL

## Operator Usage

Run:

```bash
npm run report:lead-sources -- --limit=50
```

Optional status filter:

```bash
npm run report:lead-sources -- --status=active --limit=100
```

Required environment:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` preferred
- `SUPABASE_ANON_KEY` only as fallback

## Scope Boundary

STA-18 does **not** add:

- a hosted analytics dashboard
- a BI layer
- a marketing automation product
- heavy attribution modeling

It only makes the existing lead-source data reviewable in an operator-usable way from the repo itself.
