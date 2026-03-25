# Issue 06: Refine Survival Area Tiles, Newsletter Block, and Add Start Here / Editor's Picks

## Status
Closed on 2026-03-24.

## Objective
Make the supporting homepage modules more intentional by tightening survival-area tile credibility, improving the newsletter block, and adding curated "Start Here" / "Editor's Picks" entry points using the current content model.

## Scope
- Refine the survival-area tile presentation for clearer editorial usefulness.
- Improve the homepage newsletter block so it feels more deliberate and publication-grade.
- Add a focused "Start Here" / "Editor's Picks" section or equivalent editorial entry block using existing post-selection logic.
- Keep all additions lightweight and compatible with existing homepage architecture.

## Acceptance Criteria
- Survival area tiles feel cleaner and more authoritative without changing STA's identity.
- The newsletter block feels intentional and aligned with the surrounding editorial surfaces.
- A "Start Here" / "Editor's Picks" entry point exists and uses real site content.
- The additions do not create duplicate homepage sections or muddy the featured-story hierarchy.

## Implementation Notes
- Reuse current post buckets where possible, especially `evergreen`, `latest`, and `featured`.
- Keep editorial labels and supporting copy concise.
- Avoid adding a new content-management layer; selection logic should stay in code or frontmatter conventions already used by the repo.

## Likely Files / Components Involved
- `src/pages/index.astro`
- `src/components/SubscribeInline.tsx`
- `src/data/hubs.ts`
- `src/utils/postSections.ts`
- `src/components/PostCard.astro`

## Completion Notes
- Kept the stronger issue 05 homepage rhythm by integrating `Start here` / `Editor's picks` into the existing latest-intelligence section rather than adding another top-level homepage block.
- Tightened the homepage newsletter CTA copy so it reads more like an editorial briefing without changing the broader homepage layout.
- Refined the survival-area tiles in a lighter-touch way by clarifying the section label while avoiding the heavier tile treatment from the first issue 06 pass.
