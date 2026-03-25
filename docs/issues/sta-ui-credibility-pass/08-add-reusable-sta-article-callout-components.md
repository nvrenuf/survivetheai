# Issue 08: Add Reusable STA Article Callout Components

## Status
Closed on 2026-03-24.

Implemented a constrained reusable callout system by extending the shared `Callout.astro` component with STA-specific variants for TL;DR, What We Can Defend, What Could Happen Next, Warning, Checklist, and Claims & Verification. Added MDX support so callouts render through the existing post pipeline, documented the authoring API in `src/content/README.md`, and validated the pattern in `src/content/posts/pro-template-demo.mdx` with Playwright coverage.

## Objective
Provide a reusable set of STA-native article callout blocks that can be used to reinforce key arguments and improve article credibility without changing the underlying content model.

## Scope
- Add reusable callout components or a small callout system for:
  - TL;DR
  - What We Can Defend
  - What Could Happen Next
  - Checklist
  - Warning
  - Claims & Verification
- Ensure the components work cleanly in markdown/MDX article workflows.
- Keep the component system simple, editorial, and aligned with STA's tone.

## Acceptance Criteria
- Reusable STA callout blocks exist for article use.
- The component API is clear enough for future article authors to use consistently.
- At least one reviewed template or demo article shows the intended usage pattern.
- The callouts feel like an editorial system, not generic marketing boxes.

## Implementation Notes
- There is already a basic `Callout.astro`; extend or replace it thoughtfully instead of creating a parallel system without reason.
- Preserve markdown-first authoring.
- Favor a constrained set of variants over unlimited ad hoc styles.

## Likely Files / Components Involved
- `src/components/Callout.astro`
- Additional article-callout components under `src/components/`
- `src/content/posts/pro-template-demo.mdx`
- `src/content/README.md`
