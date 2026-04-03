# STA-20 Playbook Offer Ladder And Next-Offer Architecture

Reviewed on `2026-04-02` for the active `STA Subscriber Experience, Reporting, and Offer Architecture Pass`.

## Current State

What already exists in the repo:

- a free playbook path at [`/playbook`](C:\Users\lee\Documents\survivetheai\src\pages\playbook.astro)
- a confirmation and welcome step that points subscribers into:
  - `/playbook`
  - `/start-here`
  - `/posts`
- baseline subscriber segmentation:
  - `signup_intent`
  - `lead_segment`
  - `interest_area`
- operator-visible lead-source review from STA-18

What does **not** exist yet:

- a defined next-offer path after the free playbook
- a segmented offer architecture by fear area
- any checkout, payment, or premium-product implementation

## Offer Ladder Goal

The free playbook should not be the end of the ladder. It should be the trust-safe entry point into a tighter set of next-step offers that stay aligned with STA's editorial model.

The ladder should:

- start with public reporting and the free playbook
- move readers toward more specific problem framing
- use fear-area segmentation rather than one generic upsell
- stay compatible with a publication, not turn STA into a spam funnel

## Recommended Ladder

### Tier 0 - Public Trust Layer

Reader surfaces:

- homepage
- Start Here
- survival area hubs
- public posts
- About / How We Research / methodology pages

Purpose:

- establish trust
- clarify what STA covers
- let readers inspect the editorial model before they subscribe

### Tier 1 - Free Entry Offer

Offer:

- weekly briefing + playbook path

Current repo state:

- already live

Purpose:

- convert anonymous readers into known subscribers
- identify broad intent and interest area

### Tier 2 - Segmented Starter Offer

Offer type:

- fear-area-specific starter pack

Recommended examples by pillar:

- `work-money`
  - job-risk early warning kit
  - proof-of-work repositioning pack
- `kids-school`
  - family AI boundaries pack
  - school policy / parent-response checklist
- `love-connection`
  - verification and boundary playbook
  - intimacy-risk red-flag pack
- `mind-attention`
  - attention defense protocol
  - offloading reset workbook
- `system-shock`
  - resilience planning pack
  - family contingency checklist

Purpose:

- move from broad briefing into a clearly scoped problem pack
- give the subscriber one stronger reason to stay engaged

Status:

- architecture only
- not implemented in this issue

### Tier 3 - Deeper Guided Offer

Offer type:

- premium or higher-commitment deep-dive package

Recommended shapes:

- intensive field guide
- pillar-specific scenario workbook
- operator/family planning template set
- premium briefing bundle

Purpose:

- provide a next step for readers who want more structure than the free playbook
- keep the offer aligned with practical action, not hype

Status:

- architecture only
- no payment, checkout, or fulfillment work in this issue

## Recommended Next-Offer Path

After the free playbook signup, the next-offer path should work like this:

1. Subscriber enters through the free playbook path.
2. STA identifies likely interest using:
   - `signup_intent`
   - `lead_segment`
   - `interest_area`
   - recent lead-source context where useful
3. STA keeps the first welcome step trust-heavy and product-light.
4. The first real next-offer should be a segmented starter offer, not a generic premium pitch.
5. Only after the subscriber has shown continued interest should STA introduce a deeper guided offer.

This means the next offer after the free playbook is **not** "buy a product immediately." It is:

- "choose the pack that matches your pressure area"

## Segment Mapping

### `playbook` / `action-seeker`

Best next offer:

- segmented starter offer immediately after the free playbook path

Reason:

- these readers already signaled willingness to take action

### `new-reader`

Best next offer:

- keep them on the trust path first
- then offer a fear-area starter pack once the map is clearer

Reason:

- they need orientation before escalation

### `article-deep-dive`

Best next offer:

- offer the pack that matches the article's pillar

Reason:

- they came in with a focused topic interest, not broad publication loyalty

### `hub-specific`

Best next offer:

- offer the starter pack for that exact `interest_area`

Reason:

- this is the strongest existing segment signal in the repo

### `general-briefing`

Best next offer:

- no immediate tier jump
- keep them on the weekly briefing until a stronger signal appears

Reason:

- weak segmentation should not trigger aggressive offer escalation

## Operator Rules

- Do not introduce a premium offer before the free path is coherent for the matching segment.
- Do not use one generic next-offer for every reader.
- Do not hide public reporting behind the offer ladder.
- Use fear-area relevance before revenue ambition.
- If a segment signal is weak, default to the briefing rather than force a ladder jump.

## Small Repo-Native Follow-On Work This Architecture Enables

These would be valid later issues, not part of STA-20:

- one operator-facing map of segment -> next offer
- one repo-owned placeholder page per segmented starter offer
- one lightweight handoff block in the welcome flow after the free path proves stable

## Scope Boundary

STA-20 does **not** add:

- payment rails
- checkout
- premium-product buildout
- ecommerce UX
- campaign automation

It only defines the ladder and the next-offer logic so later work can execute without ambiguity.
