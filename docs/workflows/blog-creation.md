# SurviveTheAI - Canonical Blog Post Creation Workflow

This document is the single source of truth for how SurviveTheAI posts move from signal intake to repo-ready publication.

## Goals

- Maintain analytical authority instead of hype.
- Preserve STA's fear -> mechanism -> survival framing.
- Keep the workflow automation-ready without losing reviewability.
- Prevent editorial drift and weak trust signals from reaching live posts.

This workflow is manual-first and automation-ready.

## Required Live-Post Standards

Before a post remains public, it must satisfy the repo-enforced standards below:

- use a canonical author byline from `src/data/authors.ts`
- keep a Claims & Verification entry in `src/data/claimsVerification.ts`
- rely on the shared article layout for byline and Impact Score methodology treatment
- avoid hand-written replacement sections that bypass those shared trust surfaces

`npm run build` is the enforcement gate for these live-post standards.

## Phase 0 - Topic Intake

Primary owner: Human

Inputs:
- YouTube videos
- Articles or research papers
- Social threads
- Earnings calls, layoffs news, policy documents

Output:
- topic packet with links and a short rationale for why the signal matters

Rules:
- do not summarize yet
- do not form conclusions yet
- this phase is signal detection, not writing

## Phase 1 - Source Ingest And Grounding

Owner: NotebookLM

Purpose:
- establish a source-locked factual base

Outputs:
- key claims
- mechanisms
- assumptions
- what is supported vs speculative
- terminology list

Rules:
- no prose drafting
- no new facts
- treat sources as canonical

## Phase 2 - Research Expansion And Validation

Owner: Perplexity, prompted by ChatGPT

Purpose:
- add citations and credibility ballast

Outputs:
- 5-10 high-quality citations
- supporting evidence for key claims
- counterpoints and uncertainties

Rules:
- prefer primary sources
- research informs the thesis; it does not invent one

## Phase 3 - Narrative Blueprint

Owner: ChatGPT

Purpose:
- decide framing before drafting

Outputs:
- final SEO title
- one-paragraph thesis
- H2/H3 outline
- fear angles
- survival principles
- infographic markers
- video placement notes

Rules:
- no long prose
- this phase is structural, not stylistic

## Phase 4 - First Draft

Owner: Claude

Purpose:
- produce coherent long-form narrative

Outputs:
- full draft
- conservative claims
- visual placeholders

Rules:
- follow the blueprint
- do not invent facts

## Phase 5 - Finalization For Publish

Owner: ChatGPT

Purpose:
- convert the draft into publish-ready Markdown

Outputs:
- final `.md` or `.mdx` file
- valid schema-compliant frontmatter
- clean headings
- encoding cleanup

Rules:
- preserve meaning
- improve clarity, not argument
- use a canonical author name from `src/data/authors.ts`
- do not hand-write a `## Claims & Verification` section for a live post
- add the matching entry in `src/data/claimsVerification.ts` before publish

## Phase 6 - Visual Production

Owners:
- ChatGPT + DALL-E for hero image
- NotebookLM for infographics and source-faithful companion video

Rules:
- visuals must not introduce new claims
- the blog remains canonical; video is supportive

## Phase 7 - Repo Integration

Owner: Human or Codex

Structure:
- posts: `src/content/posts/`
- images: `public/images/`
- videos: YouTube-hosted by default

Rules:
- use web-root image paths
- do not self-host video unless explicitly required

## Phase 8 - QA And Pre-Deploy Checks

Owner: Human + Codex

Checklist:
- `npm run build` passes
- public posts pass the shared live-post standards gate
- no encoding artifacts remain
- hero renders once
- images resolve
- embedded video plays
- canonical URL is correct
- mobile layout sanity check

## Phase 9 - Deploy And Observe

Owner: Human

Outputs:
- Vercel preview
- production deploy when ready
- notes for iteration

## Tool Ownership Summary

- NotebookLM: grounding, infographics, video
- Perplexity: research validation
- Claude: first draft
- ChatGPT: blueprint, final Markdown, SEO, hero image
- Codex: repo integration, enforcement, cleanup, and verification

## Internal Guidance

- authority over virality
- mechanisms over headlines
- fear without false certainty
- survival means positioning, not promises
- visuals must never introduce new claims

This workflow is canonical. Deviations require intent.
