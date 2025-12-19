# SurviveTheAI — Canonical Blog Post Creation Workflow

This document defines the **single source of truth** for how SurviveTheAI blog posts are created.

**Goals**
- Maintain analytical authority (not hype)
- Preserve fear → mechanism → survival framing
- Enable future automation without quality loss
- Prevent tool drift and content corruption

This workflow is **manual-first, automation-ready**.

---

## Phase 0 — Topic Intake (Signal Collection)
**Primary owner:** Human

**Inputs**
- YouTube videos (preferred)
- Articles / research papers
- Social media threads (X, LinkedIn, Reddit)
- Earnings calls, layoffs news, policy documents

**Output**
- Topic packet (links + 1–2 sentence rationale: *why this explains something people feel but can’t articulate*)

**Rules**
- Do not summarize yet
- Do not form conclusions yet
- This phase is about **signal detection**, not writing

---

## Phase 1 — Source Ingest & Grounding
**Owner:** NotebookLM

**Purpose**
Establish a source-locked factual base.

**Inputs**
- Transcripts
- Articles / PDFs
- Copied social content (as text)

**Outputs**
- Key claims (verbatim or tight paraphrase)
- Mechanisms (how it works)
- Assumptions
- What is supported vs speculative
- Terminology list

**Rules**
- No prose drafting
- No new facts
- Treat sources as canonical

**Internal note**
This becomes the **Source Ingest Agent** during automation.

---

## Phase 2 — Research Expansion & Validation
**Owner:** Perplexity (prompted by ChatGPT)

**Purpose**
Add credibility ballast and citations.

**Inputs**
- NotebookLM grounding
- Topic packet

**Outputs**
- 5–10 high-quality citations
- Supporting evidence for key claims
- Counterpoints / uncertainties

**Rules**
- Perplexity informs; it does not steer the thesis
- Prefer primary sources

---

## Phase 3 — Narrative Blueprint (Fear → Mechanism → Survival)
**Owner:** ChatGPT

**Purpose**
Decide framing *before* drafting.

**Inputs**
- Grounded sources
- Validated research

**Outputs**
- Final SEO title
- One-paragraph thesis
- H2/H3 outline
- 3–5 fear angles
- 3–7 survival principles (no false promises)
- Infographic markers
- Video placement notes

**Rules**
- No long prose
- This phase is structural, not stylistic

**Internal note**
If the blueprint is weak, drafting will fail.

---

## Phase 4 — First Draft
**Owner:** Claude

**Purpose**
Produce coherent long-form narrative.

**Inputs**
- Blueprint
- Source notes
- Citations

**Outputs**
- Full draft (≈1,200–2,000 words)
- Conservative claims
- Visual placeholders

**Rules**
- Follow blueprint strictly
- No invented facts

---

## Phase 5 — Finalization for Publish
**Owner:** ChatGPT

**Purpose**
Convert the draft into publish-ready Markdown.

**Inputs**
- Claude draft
- Citations
- Site conventions

**Outputs**
- Final `.md` file
- Valid frontmatter (schema-compliant)
- TL;DR section
- Clean H2/H3 hierarchy
- INFOGRAPHIC MARKERS
- VIDEO PLACEHOLDER
- Encoding cleanup

**Rules**
- Preserve meaning
- Improve clarity, not argument

**Internal note**
This is the last point where text is edited.

---

## Phase 6 — Visual Production (Visual Agent)

### 6A — Hero Image
**Owner:** ChatGPT + DALL·E

**Purpose**
Set emotional and tonal framing.

**Output**
- One hero image (PNG/JPG)

**Rules**
- Editorial, non-hype
- Duotone preferred

---

### 6B — Infographics
**Owner:** NotebookLM

**Purpose**
Convert mechanisms into glanceable understanding.

**Inputs**
- Locked article
- Explicit INFOGRAPHIC MARKERS

**Outputs**
- Infographic briefs
- Infographic images (PNG)

**Rules**
- No new claims
- Wording must match the article exactly

---

### 6C — Video
**Owner:** NotebookLM

**Purpose**
Provide a companion explanation (alternate intake path).

**Inputs**
- Locked article
- Strict “do not change source” instructions

**Outputs**
- 4–8 minute narration script
- Optional MP4
- Optional captions (.vtt)

**Rules**
- Companion, not replacement
- No new facts or reframing

---

## Phase 7 — Repo Integration
**Owner:** Human or Codex

**Structure**
- Posts: `src/content/posts/`
- Images: `public/images/`
- Videos: `public/videos/`

**Rules**
- Use web-root paths (`/images/...`, `/videos/...`)
- Do not use relative `./images` paths for public assets

---

## Phase 8 — QA & Pre-Deploy Checks
**Owner:** Human + Codex

**Checklist**
- `npm run build` passes
- No encoding artifacts (`â`, `Â`, etc.)
- Hero renders once
- All images resolve
- Video plays
- Canonical URL correct
- Mobile layout sanity check

---

## Phase 9 — Deploy & Observe
**Owner:** Human

**Outputs**
- Vercel preview
- Production deploy when ready
- Notes for iteration

---

## Tool Ownership Summary

- **NotebookLM:** Source grounding, infographics, video
- **Perplexity:** Research validation
- **Claude:** First draft
- **ChatGPT:** Blueprint, final Markdown, SEO, hero image
- **Codex:** Mechanical repo tasks (cleanup, insertion, commits)

---

## Internal Guidance (for ChatGPT and future agents)

- Authority > virality
- Mechanisms > headlines
- Fear without false certainty
- Survival = positioning, not safety
- Visuals must never introduce new claims

**This workflow is canonical. Deviations require intent.**
