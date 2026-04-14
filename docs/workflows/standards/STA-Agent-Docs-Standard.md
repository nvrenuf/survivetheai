Title: STA Agent Execution Standard (Source of Truth)

Objective

SurviveTheAI (STA) needs a repeatable, low-risk operating standard for coding agents and automation working in the repo. The goal is not just to generate content or code, but to execute issue-driven work cleanly, preserve factual integrity, and keep GitHub Issues, `ISSUE_ORDER.md`, and the repo state synchronized.

Markdown docs in the repo are the operating system for humans + coding agents. The assistant must treat them as control surfaces, not decoration.

## Source-of-Truth Order

When working in this repo, follow this priority order:

1. The assigned GitHub issue
2. `ISSUE_ORDER.md`
3. Relevant repo standards and workflow docs
4. The current codebase and content state
5. Prior closed historical work only as reference, never as active scope

If any of these conflict, do not guess. Report the conflict and proceed using the highest-priority available source of truth.

## Non-Negotiables

- No third-party remote “skills,” heartbeat auto-updates, or unattended instruction pulling from the internet.
- No publishing without citations for factual claims.
- If sources are weak, downgrade claims or label uncertainty clearly.
- No hallucinated stats. If a number appears, it must have a source.
- No destructive commands or destructive repo actions unless explicitly requested and clearly justified.
- No auto-merging, auto-publishing, or auto-deploying without explicit instruction.
- No medical, legal, or financial advice framing. Use disclaimers when topics touch those domains.
- Preserve the STA editorial model: fear is allowed, misinformation is not.

## Required Working Style

- Plan → inspect → diff → apply
- Make the smallest correct change set
- Prefer repo-ready markdown and explicit, reviewable edits
- Keep fixes scoped to the active issue
- Do not widen into adjacent cleanup unless it is required to satisfy acceptance criteria
- Do not silently redesign, rename, or restructure beyond issue scope
- Be explicit about assumptions and blockers

## Issue-Driven Execution Contract

When executing work from GitHub Issues:

1. Read the assigned GitHub issue in full
2. Read `ISSUE_ORDER.md`
3. Confirm dependencies are satisfied
4. Inspect only the parts of the repo needed for the current issue
5. Execute only the current issue unless explicitly authorized to batch tightly related work

### Scope Discipline

- Do not implement future issues while working the current one
- Do not do “while I’m here” cleanup that belongs to later issues
- Small adjacent fixes are allowed only if they are necessary to complete the current issue cleanly
- If the current issue is underspecified, stay conservative and document assumptions

### Tracker Discipline

For completed issue work, the assistant must:

- update `ISSUE_ORDER.md` status if the issue is completed
- add a GitHub issue comment summarizing what changed and what was verified
- close the GitHub issue only if acceptance criteria are actually met
- keep the issue queue and repo state aligned

If issue tracking cannot be updated due to permissions or tooling limits, report that explicitly.

## Required Closeout Format

Every issue execution should end with a control summary containing:

- outcome
- status
- branch
- files changed
- tests/checks run
- issue tracking updates made
- acceptance criteria status
- blockers
- assumptions

Do not claim success without evidence.

## STA Content and Editorial Guardrails

All content-related work must preserve STA’s core operating rules:

- Every post must explain what is happening, why it matters, and what to do now
- Fear framing is allowed, but it must be tied to real stakes and defensible mechanisms
- Uncertainty must be labeled
- Claims must be supportable
- Do not invent sources, expertise, or methodology
- Do not present decorative systems as real frameworks without explaining them
- Do not use AI fluency to hide weak sourcing

## Content Quality Rules

When writing or editing content, prefer:

- mechanism over metaphor
- household stakes over abstract trends
- specific consequences over vague alarm
- direct language over hype
- citations over tone-based authority

Avoid:

- generic “AI will change everything” filler
- unsupported timelines
- fake certainty
- empty SEO padding
- fake social proof
- arbitrary scores without method

## Repo Docs Expectations

The repo should maintain a compact but useful documentation set. At minimum, agents should understand and preserve the role of:

- `README.md` — repo/project overview and local/deploy basics
- `AGENT.md` — top-level pointer and immediate guardrails
- `ISSUE_ORDER.md` — active execution queue
- editorial/workflow docs — intake, research, drafting, publishing, and compliance behavior
- disclosure/runbook docs where applicable

If a referenced doc is missing, outdated, or moved, report it immediately and continue with the best available source of truth.

## Automation Direction

n8n is the orchestration spine for pipeline work:
ingest → dedupe → score → queue → research → draft → human gate (optional) → publish → distribute

The LLM/agent is the cognitive worker. It should be invoked with strict inputs and expected outputs, not open-ended autonomy.

Preferred structured outputs include:

- topic scorecard
- research brief
- draft with citations
- distribution snippets
- issue closeout/control summary

Automation should make the system more reliable, not less reviewable.

## Branch and PR Discipline

Unless explicitly told otherwise:

- use one issue or one tightly related issue batch per branch
- keep commit scope aligned with the issue
- reference the issue in branch/PR context
- do not claim PR readiness without checks actually run
- do not hide incomplete work behind broad summaries

## New-Site Rule

If asked to create a new site “based on STA,” treat STA as the operational template, not a content clone.

Reuse:
- issue discipline
- docs structure
- execution standards
- pipeline logic

Then create site-specific source-of-truth docs such as:
- `SITE_BRIEF.md`
- `TOPIC_MAP.md`

## Deliverable Standard

When asked to create repo docs, workflow docs, issue docs, or execution plans:

- default to repo-ready markdown
- keep structure tight and operational
- optimize for maintainability, not performative documentation
- prefer concise clarity over bloated agent text

The standard is successful when a coding agent can enter the repo, execute the correct issue in order, avoid drift, and leave both the codebase and trackers cleaner than it found them.