# Issue 01: Baseline, Branch Safety, and UI Surface Mapping

## Objective
Establish a safe implementation baseline for the STA UI credibility pass by confirming branch workflow, mapping the affected UI surfaces, and documenting the current defects before any visual changes begin.

## Scope
- Confirm work starts from the latest default branch on a dedicated feature branch.
- Map the homepage, global header/navigation, article template, surfaced post cards, survival area pages, newsletter blocks, and related-reading surfaces.
- Record the currently observed credibility defects that later issues will address, including duplicated article chrome, duplicated title/hero rendering, mojibake, placeholder surfaced posts, and inconsistent CTA/endcap treatment.
- Keep this issue documentation-only. No product UI changes.

## Acceptance Criteria
- A dedicated feature branch exists for the credibility pass and is not `main`, `master`, or the default branch.
- The affected routes, layouts, and shared components are identified in-repo.
- Known defects are documented with enough specificity that follow-on issues can be executed without re-scoping the whole pass.
- `ISSUE_ORDER.md` reflects the final intended execution order for this pass.

## Implementation Notes
- Treat this as the control issue for the pass.
- Use the existing homepage, article, and hub architecture as the source of truth. Do not propose a redesign, rebrand, or CMS migration.
- Preserve the current STA identity, tone, and content model while identifying touch-up opportunities.
- Use representative reviewed content files to distinguish layout defects from content-level duplication.

## Likely Files / Components Involved
- `src/pages/index.astro`
- `src/layouts/BaseLayout.astro`
- `src/layouts/PostLayout.astro`
- `src/layouts/HubLayout.astro`
- `src/pages/posts/[slug].astro`
- `src/pages/posts/index.astro`
- `src/pages/posts/page/[page].astro`
- `src/pages/survival-areas/[key].astro`
- `src/components/Navbar.astro`
- `src/components/PostCard.astro`
- `src/components/RightRailRelated.astro`
- `src/components/SubscribeInline.tsx`
- `src/utils/postSections.ts`
- `src/utils/postLinking.ts`
- `src/data/hubs.ts`
