# STA-29: Long-form reading progress affordance

## Status
Planned.

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
