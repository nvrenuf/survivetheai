# STA-27: Post-card metadata pattern lock

## Status
Completed on 2026-04-15.

## Objective
Standardize the post-card information order so cards are faster to scan across homepage, hubs, and listing surfaces.

## Scope
- Enforce one metadata sequence across post cards: category, title, dek, metadata row.
- Normalize impact/date styling and spacing.
- Apply the pattern to all surfaces already using shared post-card components.

## Acceptance Criteria
- Shared post-card components render the same metadata order everywhere.
- Card text clamping and spacing remain stable on mobile.
- Regression tests confirm metadata element presence and ordering.

## Implementation Notes
- Do not alter ranking logic or post selection behavior in this issue.
- Keep changes component-level to avoid page-specific drift.

## Likely Files / Components Involved
- `src/components/PostCard.astro`
- `src/components/homepage/*`
- `src/pages/survival-areas/[key].astro`
- `src/pages/posts/index.astro`
- `tests/homepage.spec.ts`

## Completion Notes
- Updated `PostCard` so card hierarchy is now category chip → title → dek → bottom metadata row.
- Consolidated bottom metadata row to date + impact score and removed duplicated meta rows.
- Kept shared `post-card-meta` and `post-card-impact` test IDs to preserve existing regression coverage.
