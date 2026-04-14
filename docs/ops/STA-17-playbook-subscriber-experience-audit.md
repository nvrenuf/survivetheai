# STA-17 Playbook and Subscriber Experience Audit

## Current Experience

Current first-subscriber flow:

1. A reader lands on [`/playbook`](C:\Users\lee\Documents\survivetheai\src\pages\playbook.astro) or another newsletter surface.
2. The inline form posts to [`/api/subscribe`](C:\Users\lee\Documents\survivetheai\src\pages\api\subscribe.ts).
3. The backend writes a pending row to `public.subscribers` and sends a confirmation email.
4. The reader confirms through [`/api/confirm`](C:\Users\lee\Documents\survivetheai\src\pages\api\confirm.ts).
5. The backend activates the subscriber and sends one welcome email based on the lifecycle profile.
6. The browser is redirected to [`/newsletter/confirmed`](C:\Users\lee\Documents\survivetheai\src\pages\newsletter\confirmed.astro).

## Audit Result

The path is real, but before this issue it was weaker than the site promise in two ways:

- The playbook promise read like a distinct delivered asset, but the repo does not contain a separate downloadable playbook file or gated document.
- The confirmation page was a bare generic success page, so the first subscriber impression did not clearly explain what to do next or how the playbook path actually works.

## Small In-Scope Fixes Applied

- [`/playbook`](C:\Users\lee\Documents\survivetheai\src\pages\playbook.astro) now describes the offer as a guided starter path rather than implying a hidden downloadable asset.
- [`/newsletter/confirmed`](C:\Users\lee\Documents\survivetheai\src\pages\newsletter\confirmed.astro) now gives a clear next-step path into:
  - the playbook
  - Start Here
  - the public reporting archive
- [`buildWelcomeEmailText`](C:\Users\lee\Documents\survivetheai\src\utils\subscriberLifecycle.ts) now uses the same "playbook path" framing for playbook-origin signups.

## What Is Already Correct

- Signup capture is real and verified through Supabase plus Resend.
- Confirmation and unsubscribe flows are real routes, not placeholder theater.
- The welcome email already branches by the baseline lifecycle profile introduced in STA-15.
- The archive remains public, which matches the stated trust position against locking core reporting behind a gate.

## Remaining Weak Points For Later Passes

- The offer is coherent now, but still light. The playbook path is not yet a richer productized asset.
- The first welcome experience is still one email and one confirmation page, not a fuller subscriber onboarding sequence.
- The next-offer logic after the free playbook belongs to STA-20, not this issue.

## Scope Boundary

STA-17 does not rewrite the full playbook, redesign the email sequence, or build a broader offer ladder. It only documents the current experience and fixes the most direct accuracy/coherence gap in the first subscriber impression.
