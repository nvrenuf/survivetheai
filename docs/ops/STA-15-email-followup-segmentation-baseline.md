# STA-15 Email Follow-Up And Lead Segmentation Baseline

Reviewed on `2026-04-02` for the active `STA Operations, Capture, and Editorial Enforcement Pass`.

## Verified Current Lifecycle

Before this issue, the repo already had:

1. `/api/subscribe` writing a pending subscriber row and sending the confirmation email.
2. `/api/confirm` activating the subscriber and sending one generic welcome email.
3. `/api/unsubscribe` marking the subscriber unsubscribed.

That meant the lifecycle existed, but the next-step logic and segmentation model were implicit rather than defined.

## Baseline Lifecycle Defined

- `pending`
  - created at signup
  - sends confirmation email
- `active`
  - set on confirm
  - sends one welcome email that points the subscriber to the right next-step path
- `unsubscribed`
  - set on unsubscribe
  - no further follow-up is implied by this baseline

This issue keeps the lifecycle to one confirmation step and one welcome step. It does not add campaigns or automation sequences.

## Baseline Segmentation Fields

Stored on `public.subscribers`:

- `signup_intent`
  - `briefing`
  - `playbook`
- `lead_segment`
  - `general-briefing`
  - `new-reader`
  - `action-seeker`
  - `article-deep-dive`
  - `hub-specific`
- `interest_area`
  - nullable
  - populated from `hub-*` signup sources such as `hub-work-money`

## Mapping Logic

- `playbook` source -> `signup_intent = playbook`, `lead_segment = action-seeker`
- `start-here` source -> `signup_intent = briefing`, `lead_segment = new-reader`
- `post` source -> `signup_intent = briefing`, `lead_segment = article-deep-dive`
- `hub-*` source -> `signup_intent = briefing`, `lead_segment = hub-specific`, `interest_area = *`
- everything else -> `signup_intent = briefing`, `lead_segment = general-briefing`

## Welcome-Step Baseline

The welcome email now branches lightly from the stored lifecycle profile:

- playbook signups are pointed back to `/playbook` first, then `/start-here`
- hub-specific signups are pointed back to their survival area, then the library
- other signups are pointed to `/start-here` and `/posts`

This is still one welcome email, not a campaign.

## Known Non-Goals

- No CRM build
- No drip sequence automation
- No long-term lifecycle architecture
- No re-subscribe reactivation redesign beyond the already documented STA-11 limitation
