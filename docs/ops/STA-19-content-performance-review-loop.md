# STA-19 Content Performance Review Loop

Reviewed on `2026-04-02` for the active `STA Subscriber Experience, Reporting, and Offer Architecture Pass`.

## Goal

Give STA one lightweight, repeatable way to decide whether a live post should be:

- updated
- expanded
- repromoted
- demoted
- left alone

This is a review loop, not an editorial calendar or rewrite campaign.

## Review Cadence

Run the review loop on this rhythm:

- weekly:
  - review newly published or newly promoted posts from the last 14 days
  - check whether any live post has an active trust problem or visible mismatch with current standards
- monthly:
  - review the top 10-20 traffic or conversion-driving posts using the current attribution/reporting path
  - review homepage featured, editor-pick, and hub-spotlight posts for freshness and continued fit
- quarterly:
  - review older archive-visible posts for trust drag, weak framing, or stale surface value

## Signals To Watch

Use only lightweight signals the repo already has or can be reviewed without a new platform build.

### Performance Signals

- homepage or featured placement status
- editor-pick or hub-spotlight placement status
- lead-source review from `npm run report:lead-sources -- --limit=50`
- whether a post still supports current conversion paths such as `/playbook` or `/start-here`
- recency relative to the pressure area it covers

### Trust Signals

- claims that now feel too broad, weak, or under-supported
- missing nuance where uncertainty should be labeled more clearly
- article quality relative to the current byline / Claims & Verification / methodology standard
- visible archive drag signals already used in STA-09:
  - generic framing
  - forecast-heavy copy
  - weak AI linkage
  - anonymous or soft sourcing doing too much work
- whether the post still deserves archive discovery or should be `archiveHidden` / `noindex`

### Content-Fit Signals

- whether the post still maps cleanly to the active fear-area package
- whether the post is strong enough to justify featured or editor-pick placement
- whether the post should be widened into a more complete package rather than left as a thin standalone item

## Decision Rules

### Update

Choose `update` when:

- the post is directionally strong but has stale framing, small sourcing gaps, or clearer caveats now needed
- the mechanism is still good, but the explanation can be tightened
- trust risk is moderate but fixable without changing the core piece

Expected output:

- targeted revision to the existing post
- refreshed Claims & Verification entry if needed

### Expand

Choose `expand` when:

- the post has strong signal and clear reader interest, but the current piece is too thin for the stakes
- the topic now needs more examples, more mechanism, or a stronger “what to do now” layer
- the post could support a broader fear-area package if given more depth

Expected output:

- fuller rewrite or structured expansion
- possible visual/supporting asset additions if later work justifies it

### Repromote

Choose `repromote` when:

- the post still meets the current trust standard
- the topic has regained urgency
- the piece is still one of the clearest readers’ starting points for that pressure area

Expected output:

- homepage, Start Here, or hub placement decision
- optional renewed CTA or linking pass without rewriting the piece

### Demote

Choose `demote` when:

- the piece is still worth keeping live but should stop acting like flagship reporting
- it weakens hub, homepage, archive, or related-reading surfaces
- it belongs in the archive as historical context, not active discovery

Expected output:

- remove from discovery surfaces
- consider `archiveHidden` and/or `noindex`
- document the reason, following the STA-09 triage pattern

### Leave Alone

Choose `leave alone` when:

- the piece still meets the current trust standard
- it is not creating archive drag
- there is no meaningful signal that updating or promoting it would change outcomes right now

Expected output:

- no repo change
- optional note in the review log that no action is needed

## Lightweight Review Sequence

For each post under review:

1. Identify current role:
   - featured
   - editor pick
   - hub spotlight
   - archive-visible only
   - archive-hidden historical item
2. Check trust fit:
   - byline
   - Claims & Verification
   - Impact Score interpretation fit
   - mechanism and sourcing quality
3. Check business/editorial fit:
   - supports reader journey
   - supports fear-area coverage
   - supports subscriber or conversion path where appropriate
4. Assign one action:
   - update
   - expand
   - repromote
   - demote
   - leave alone
5. Record one sentence explaining why

## Minimal Review Log Format

Use this format when needed in future issue work or operator notes:

```md
- `post-slug` — action: `update`
  reason: strong mechanism, but framing and sourcing caveats need refresh before continued homepage or hub use
```

Keep one action per post. Do not turn the review loop into a backlog dump.

## Scope Boundary

STA-19 does **not** create:

- a full editorial planning system
- an archive rewrite program
- a new analytics platform
- a ranking model that pretends to be more precise than the available signals

It only defines the operational loop for making consistent post-level decisions.
