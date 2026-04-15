# STA-26: Homepage CTA hierarchy normalization

## Status
Completed on 2026-04-15.

## Objective
Reduce CTA competition on the homepage by enforcing one primary action per major section.

## Scope
- Define and apply a single primary CTA for hero, mid-page editorial section, and lower conversion section.
- Demote secondary actions to text links where appropriate.
- Preserve existing destination URLs unless a breakage is found.

## Acceptance Criteria
- Every major homepage section has at most one visually primary CTA.
- Secondary actions remain available but visually subordinate.
- Mobile and desktop maintain consistent CTA priority.

## Implementation Notes
- Focus on hierarchy and interaction clarity, not a visual redesign.
- Keep button styles and component usage consistent with current design system.

## Likely Files / Components Involved
- `src/pages/index.astro`
- `src/components/homepage/*`
- `src/styles/*`
- `tests/homepage.spec.ts`

## Completion Notes
- Kept one primary filled CTA in hero/start-here/library sections and demoted secondary actions to text-link treatment.
- Preserved existing destinations while reducing equal-weight button competition.
- Updated homepage regression expectations where section structure and hierarchy changed.
