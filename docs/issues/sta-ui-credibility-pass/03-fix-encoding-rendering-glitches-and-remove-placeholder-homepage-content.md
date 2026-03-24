# Issue 03: Fix Encoding/Rendering Glitches and Remove Placeholder Content from Surfaced Homepage Areas

## Status
Closed on 2026-03-24.

## Objective
Remove visible credibility damage caused by encoding glitches, malformed punctuation, and placeholder content that is currently being surfaced on high-traffic homepage sections.

## Scope
- Fix visible mojibake and malformed punctuation in reviewed UI copy and reviewed surfaced content.
- Prevent placeholder or "coming soon" posts from appearing in homepage surfaced sections.
- Review homepage, article, hub, and newsletter surfaces for user-visible rendering glitches.
- Keep the pass limited to reviewed, user-facing defects. Do not rewrite unrelated article content.

## Acceptance Criteria
- Visible encoding glitches are fixed in reviewed pages and shared UI surfaces.
- Placeholder posts are not surfaced on the homepage hero, supporting grid, or other curated surfaced areas.
- Surfaced homepage content uses real published editorial content only.
- Reviewed pages no longer show obvious malformed punctuation such as mojibake apostrophes, dashes, ellipses, or title separators.

## Implementation Notes
- Current examples include mojibake in homepage copy, article layout titles, hub copy, newsletter button state text, and hub data strings.
- Placeholder posts currently exist in `src/content/posts/` and should be filtered out from surfaced homepage areas without changing the content model.
- Prefer a small explicit filter or content heuristic over broad content rewrites.
- Review whether placeholder-hero-only content should also be excluded from surfaced homepage sections.

## Likely Files / Components Involved
- `src/pages/index.astro`
- `src/layouts/PostLayout.astro`
- `src/layouts/HubLayout.astro`
- `src/components/SubscribeInline.tsx`
- `src/data/hubs.ts`
- `src/utils/postSections.ts`
- `src/content/posts/ai-companionship.md`
- `src/content/posts/cognitive-erosion.md`
- `src/content/posts/soft-extinction.md`
- Other reviewed surfaced posts with visible encoding defects

## Completion Notes
- Fixed active mojibake at the source in reviewed homepage, layout, newsletter, and surfaced article content.
- Added homepage selection filtering so placeholder and "coming soon" posts no longer surface in featured or supporting homepage sections.
- Added regression coverage for homepage, hub, and article rendering to catch mojibake and placeholder surfacing failures.
