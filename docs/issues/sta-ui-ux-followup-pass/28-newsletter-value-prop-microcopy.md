# STA-28: Newsletter value-proposition microcopy

## Status
Completed on 2026-04-15.

## Objective
Improve signup intent quality by clarifying exactly what subscribers receive each week.

## Scope
- Add a concise "what you get" microcopy block to the primary newsletter capture surface.
- Keep the signup form fields and submission mechanics unchanged.
- Ensure copy is visible and legible on mobile without increasing perceived friction.

## Acceptance Criteria
- Newsletter section includes three concrete value bullets.
- Existing submit flow continues to work without schema changes.
- Copy remains aligned with STA editorial tone and no-overpromise policy.

## Implementation Notes
- This issue is copy + layout only; no backend or automation changes.
- Reuse current analytics events for newsletter conversion unless broken.

## Likely Files / Components Involved
- `src/components/SubscribeInline.tsx`
- `src/pages/index.astro`
- `src/pages/start-here.astro`
- `tests/subscribe.spec.ts`

## Completion Notes
- Extended `SubscribeInline` with optional value bullets rendering and preserved existing signup behavior.
- Added three value bullets to the homepage newsletter surface to clarify expected weekly output.
- Added homepage regression checks to verify microcopy bullets remain visible.
