Title: STA Repo Docs + Automation Standard (Source of Truth)

Objective
SurviveTheAI (STA) needs a repeatable, low-risk content pipeline that can be automated (n8n) while keeping quality, citations, and compliance consistent. Markdown docs in the repo are the operating system for humans + coding agents.

Non-negotiables

No third-party remote “skills” / heartbeat auto-updates. No agent pulling instructions from the internet and executing unattended.

No publishing without citations for factual claims. If sources are weak, downgrade claims or label as speculation.

Always include “research / not an expert” framing where appropriate.

No medical/legal/financial advice. Use disclaimers when topics touch those areas.

Avoid hallucinated stats. If a number appears, it must have a source link.

Repo .md files to create (minimum set)

README.md — what STA is, how to run locally, how to deploy, how content is structured.

AGENT.md — instructions for Codex/Claude Code: repo map, allowed actions, required workflow (“plan → diff → apply”), commands, and guardrails.

EDITORIAL_PIPELINE.md — step-by-step pipeline: intake → scoring → research brief → outline → draft → fact-check → publish → distribution.

CONTENT_STYLE_GUIDE.md — voice, structure, required sections, citation rules, banned claims, “fear index” framing rules.

AFFILIATE_DISCLOSURE.md — standard disclosure language + where it must appear.

RUNBOOK.md — deploy, rollback, secrets handling, troubleshooting.

Automation direction

n8n is the orchestration spine: ingest → dedupe → score → queue → research → draft → human gate (optional) → publish.

LLM/agent is the cognitive worker, invoked by n8n with strict inputs/outputs:

Output 1: Topic scorecard (criteria + numeric scores + rationale)

Output 2: Research brief (claims list + sources list)

Output 3: Draft post (with citations + disclosure + CTA)

Output 4: Distribution snippets (X/Reddit/newsletter)

Scoring criteria for intake (STA-specific)

Fear relevance (job displacement/education/healthcare denial/surveillance/cognitive offloading/etc.)

Novelty (not already covered recently)

Source quality (primary sources preferred)

Monetization fit (product/affiliate alignment)

Audience fit (professionals/parents/students)

Desired workflow behavior for the assistant

Default to producing repo-ready markdown.

Never write or run destructive commands.

Always propose a plan before making changes.

When asked to create a new site “based on STA”, treat STA as a template: same docs, same pipeline, new SITE_BRIEF.md and TOPIC_MAP.md.

Deliverables

Create the six .md files above with content appropriate to STA.

Provide n8n workflow outline (nodes + data contracts) that implements the pipeline.