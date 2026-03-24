# Issue 05: Refactor Homepage into Clearer Editorial Sections

## Status
Closed on 2026-03-24.

## Objective
Reorganize the homepage into clearer editorial sections so the page reads like a deliberate publication front page rather than a loose stack of modules.

## Scope
- Refine the homepage section hierarchy and naming while preserving the existing STA identity and content model.
- Clarify the relationship between the mission block, featured story, supporting story stack, survival areas, newsletter, and library CTA.
- Improve section intros, transitions, and editorial framing without introducing a redesign or new CMS requirements.
- Keep the homepage architecture grounded in existing featured, evergreen, latest, and remaining section logic.

## Acceptance Criteria
- Homepage sections feel editorial and clearly structured.
- The featured story remains the primary focal point.
- Supporting sections have distinct editorial roles rather than reading as interchangeable modules.
- The page structure remains compatible with the current content selection model.

## Implementation Notes
- The current homepage already uses `featured`, `evergreen`, `latest`, and `remaining`; use those existing buckets rather than inventing a new publishing system.
- Section naming should sound authoritative and editorial, not marketing-heavy.
- Avoid turning this into a large visual redesign. Focus on hierarchy, grouping, and copy discipline.

## Likely Files / Components Involved
- `src/pages/index.astro`
- `src/utils/postSections.ts`
- `src/components/PostCard.astro`
- `src/components/SubscribeInline.tsx`

## Completion Notes
- Reorganized the homepage into a clearer editorial sequence: homepage hero, featured story, latest intelligence, survival areas, newsletter CTA, and library/archive path.
- Split supporting homepage content into explicit editorial roles using the existing `evergreen` and `latest` buckets rather than a single undifferentiated card dump.
- Added regression coverage for homepage section order and for keeping the featured story visually and structurally distinct from the latest-intelligence cards.
