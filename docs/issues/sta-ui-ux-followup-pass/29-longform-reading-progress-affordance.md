# STA-29: Long-form reading progress affordance

## Status
Completed on 2026-04-15.

## Objective
Improve completion on longer article pages by adding a subtle progress indicator and optional intra-article jump links.

## Scope
- Add a lightweight reading-progress indicator on post pages.
- Optionally add "next section" jump links where headings are present.
- Ensure behavior is performant and non-intrusive on mobile.

## Acceptance Criteria
- Progress indicator updates accurately during scroll on long posts.
- Feature does not obstruct core reading layout or CTA visibility.
- Works without JavaScript errors across supported breakpoints.

## Implementation Notes
- Keep visual treatment minimal and consistent with STA typography.
- Do not introduce third-party UI libraries for this issue.

## Likely Files / Components Involved
- `src/layouts/PostLayout.astro`
- `src/components/*` (new minimal progress component if needed)
- `tests/posts.spec.ts`

## Completion Notes
- Added a slim fixed reading-progress track and fill bar on article pages.
- Wired progress updates into the existing article scroll analytics loop to avoid duplicate listeners.
- Added regression checks to verify the progress bar renders and updates after deep scroll.
