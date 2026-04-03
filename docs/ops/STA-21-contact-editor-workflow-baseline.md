# STA-21 Contact/Editor Workflow Baseline

Reviewed on `2026-04-02` for the active `STA Subscriber Experience, Reporting, and Offer Architecture Pass`.

## Current Public Path

The public trust/contact path is already defined in the repo:

- [`/contact`](C:\Users\lee\Documents\survivetheai\src\pages\contact.astro)
- [`/how-we-research`](C:\Users\lee\Documents\survivetheai\src\pages\how-we-research.astro)
- shared trust surfaces pointing to `mailto:editor@survivetheai.com`

The public path is email only. There is no live contact form, helpdesk queue, or ticketing system in the current repo.

## Goal Of This Baseline

Define what the operator should do when the editor inbox receives:

- reader questions
- correction notes
- reporting tips
- partnership or business inquiries
- abusive or irrelevant mail

This is an operator workflow baseline, not a staffing model.

## Inbox Categories

Use these lightweight categories:

- `correction`
  - claims an article is wrong, misleading, stale, or missing material context
- `reporting-note`
  - supplies a lead, source, firsthand note, or contextual update relevant to coverage
- `reader-question`
  - asks for clarification, navigation help, or follow-up context
- `business`
  - partnerships, sponsorship, syndication, collaboration, or similar non-editorial requests
- `ignore`
  - spam, abuse, irrelevant outreach, or low-signal solicitations

## Baseline Handling Rules

### Correction

Target handling:

- same-day review when practical
- next-business-day review at the latest when the claim looks plausible or specific

Required operator action:

1. verify the article URL and the exact disputed claim
2. check cited sources, article text, and Claims & Verification
3. decide one of:
   - fix now
   - add clarification/update note
   - leave unchanged with documented reason
4. if corrected, make the change without hedging and reflect it in the public article/update path

Response baseline:

- acknowledge receipt when the note is specific and credible
- do not promise a public correction before review is complete

### Reporting Note

Target handling:

- review within 2 business days when the note appears relevant

Required operator action:

1. determine whether it is:
   - a direct source lead
   - a contextual note for an existing post
   - a possible future issue/topic
2. if actionable, convert it into one of:
   - article update follow-up
   - topic note for later review
   - no action with reason

Response baseline:

- optional acknowledgement
- no promise of coverage

### Reader Question

Target handling:

- answer only when the question can be handled briefly and consistently with current published guidance

Required operator action:

1. point the reader to the relevant public page when possible:
   - `/start-here`
   - `/how-we-research`
   - `/impact-score-methodology`
   - the relevant article or survival area
2. avoid custom consulting or extended back-and-forth

Response baseline:

- brief reply or no reply if the answer is already obvious from the site and the message does not justify manual handling

### Business

Target handling:

- review as bandwidth allows

Required operator action:

1. determine whether the request fits STA's trust and disclosure standards
2. if not clearly aligned, do not advance it

Response baseline:

- optional acknowledgement
- no obligation to engage

### Ignore

Required operator action:

- do not engage
- archive, delete, or leave untouched based on normal inbox hygiene

## Correction/Review Expectations

When a correction note is credible, the operator should prefer:

- narrow correction over silence
- explicit clarification over vague stealth edits
- source review before public argument

When a note is weak or abusive, the operator does not owe a debate.

## Response-Policy Baseline

The repo should not promise a universal response-time SLA on the public site.

Operationally, use this baseline:

- urgent/specific correction claims: same day or next business day review
- clear reporting notes: within 2 business days when feasible
- reader questions and business messages: discretionary
- spam/abuse: no response

This is an internal handling baseline, not a public promise.

## Minimal Logging Expectation

Do not build a helpdesk system for this issue.

If a message leads to action, keep one lightweight note in the relevant work artifact, for example:

- issue comment
- ops doc update
- article update note

No separate ticketing system is required.

## Scope Boundary

STA-21 does **not** add:

- a contact form
- an inbox UI
- a helpdesk or ticket queue
- a staffing redesign
- a major trust-page rewrite

It only defines the operator baseline behind the already-public contact path.
