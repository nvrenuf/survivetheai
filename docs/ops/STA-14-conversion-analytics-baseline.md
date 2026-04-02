# STA-14 Conversion Analytics And Attribution Baseline

Reviewed on `2026-04-02` for the active `STA Operations, Capture, and Editorial Enforcement Pass`.

## Current Conversion Surfaces

- Homepage guided entry:
  - `/` -> `Open the guided path` -> `/start-here`
- Homepage playbook entry:
  - `/` -> homepage playbook offer -> `/playbook`
- Start Here playbook entry:
  - `/start-here` -> playbook offer -> `/playbook`
- Playbook conversion:
  - `/playbook` -> subscribe form -> `/api/subscribe` -> Supabase `public.subscribers`
- Start Here newsletter conversion:
  - `/start-here` -> subscribe form -> `/api/subscribe`

## Baseline Implemented

- GA4 loading now respects `PUBLIC_GA_MEASUREMENT_ID` instead of a hardcoded tag.
- The site now emits lightweight funnel events for:
  - `start_here_entry_click`
  - `playbook_cta_click`
  - `start_here_content_click`
  - existing `newsletter_submit`, `newsletter_success`, `newsletter_error`
- Subscribe requests now capture basic attribution data:
  - `source_page`
  - `page_path`
  - `referrer`
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
- Subscriber storage now has matching columns via `supabase/migrations/0002_subscriber_attribution.sql`.

## Measurement Path

1. Reader clicks a tracked Start Here or playbook CTA.
2. Base layout emits a lightweight event through `gtag` when GA4 is configured, or to the debug console when analytics debug is enabled without GA.
3. Reader submits a subscribe form.
4. `SubscribeInline` emits `newsletter_submit`, then `newsletter_success` or `newsletter_error`.
5. `/api/subscribe` stores the minimal attribution fields alongside the subscriber row in Supabase.

## Scope Boundary

- This baseline does **not** add a new analytics platform.
- This baseline does **not** implement marketing automation or campaign logic.
- This baseline does **not** expand into unrelated product telemetry.
