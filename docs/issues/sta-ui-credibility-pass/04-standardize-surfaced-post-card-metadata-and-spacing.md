# Issue 04: Standardize Surfaced Post Card Metadata and Spacing

## Status
Closed on 2026-03-24.

## Objective
Make surfaced post cards feel consistent, deliberate, and editorially trustworthy by standardizing metadata treatment, spacing rhythm, and card-level hierarchy across homepage, hub, archive, and related-reading surfaces.

## Scope
- Standardize metadata order, labels, and spacing on primary surfaced cards.
- Align card padding, heading rhythm, description clamp behavior, and footer metadata treatment.
- Review card variants used on homepage, hub pages, archive pages, and related reading.
- Keep the card pass incremental and compatible with existing component structure.

## Acceptance Criteria
- Surfaced cards show consistent metadata treatment and spacing across reviewed surfaces.
- Category/topic, date, and impact-score presentation follow one clear pattern for primary post cards.
- Card headings, descriptions, and card footers align cleanly without awkward jumps between surfaces.
- Any intentionally different compact variant is explicit and visually coherent rather than accidental.

## Implementation Notes
- `PostCard.astro` is the primary card component and should remain the system anchor.
- `RightRailRelated.astro` is a separate compact variant and may need a defined compact-card convention rather than ad hoc styling.
- Confirm that archive and hub grids use the same default card treatment.
- Avoid overdesign; this is a spacing and metadata consistency pass.

## Likely Files / Components Involved
- `src/components/PostCard.astro`
- `src/components/RightRailRelated.astro`
- `src/components/BlogList.astro`
- `src/layouts/HubLayout.astro`
- `src/layouts/PostLayout.astro`
- `src/pages/index.astro`
- `src/styles/global.css`

## Completion Notes
- Standardized surfaced grid-card metadata into a shared component so homepage, hub, archive, and related-reading grid cards follow one category/date header and one impact-score footer pattern.
- Defined an explicit compact-card convention for the right rail so related reading keeps the same metadata hierarchy with tighter spacing.
- Added regression coverage for homepage, hub, library, and article related-card surfaces.
