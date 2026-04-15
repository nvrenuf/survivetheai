# STA-25: Homepage intent routing block

## Status
Completed on 2026-04-15.

## Objective
Add a tightly scoped "choose your path" module near the top of the homepage so first-time readers can self-select into the most relevant journey.

## Scope
- Add one intent-routing block directly below the homepage hero.
- Include exactly three intent options tied to existing STA paths (work/career, family/school, weekly signals).
- Route each option to an existing destination or a minimal dedicated destination page if no current page fits.

## Acceptance Criteria
- The intent module renders below the hero on desktop and mobile.
- All three options are accessible links with clear labels and descriptions.
- Analytics events are emitted on option click for path attribution.

## Implementation Notes
- Do not redesign the hero or other homepage modules in this issue.
- Reuse existing component primitives and spacing tokens.
- Keep copy concise and editorial (not marketing-heavy).

## Likely Files / Components Involved
- `src/pages/index.astro`
- `src/components/homepage/*`
- `tests/homepage.spec.ts`

## Completion Notes
- Added a new homepage intent-routing module with three path cards directly below the hero.
- Wired analytics attributes for click attribution (`intent_path_click`) and location/label metadata.
- Added regression assertions for presence, card count, and analytics attribute checks.
