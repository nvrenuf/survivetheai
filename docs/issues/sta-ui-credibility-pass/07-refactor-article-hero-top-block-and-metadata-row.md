# Issue 07: Refactor Article Hero/Top Block and Metadata Row

## Status
Closed on 2026-03-24.

## Objective
Tighten the article top block so posts open with a cleaner, more authoritative editorial presentation and a more coherent metadata row.

## Scope
- Refine the hero, category label, title block, deck/description, byline, and metadata ordering.
- Improve the relationship between the article lead, share entry point, hub link box, and first body paragraph.
- Keep the work focused on the article top block only. Full body rhythm and end-of-article treatment belong to later issues.

## Acceptance Criteria
- Article top blocks feel cleaner and more authoritative.
- The metadata row is consistent, readable, and clearly subordinate to the title/deck.
- The transition from hero/top block into the body feels deliberate rather than stacked from disconnected modules.
- The result preserves existing structured data, canonical tags, and post metadata behavior.

## Implementation Notes
- `PostLayout.astro` currently owns most of the top-block composition.
- Revisit the current split between the small uppercase topic/impact row, the title/deck block, the byline component, and the hub card.
- Avoid a redesign; this should be a refinement pass on spacing, order, and clarity.

## Likely Files / Components Involved
- `src/layouts/PostLayout.astro`
- `src/components/HeroImage.astro`
- `src/components/Byline.tsx`
- `src/components/ShareBar.tsx`
- `src/utils/format.ts`
- `src/data/categories.ts`
- `src/data/hubs.ts`

## Completion Notes
- Re-composed the shared article top area so the hero leads into a cleaner editorial top block rather than a stack of disconnected modules.
- Added a clearer breadcrumb/pillar line, consolidated the metadata into one deliberate row, and tightened the hub box transition into the body.
- Fixed date rendering at the formatter layer so frontmatter dates display consistently without local-timezone day shifts.
