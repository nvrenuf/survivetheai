# Issue 09: Improve Article Body Rhythm, CTA Section, and Related Reading

## Status
Closed on 2026-03-24.

Implemented shared article-body rhythm and endcap refinements in `PostLayout.astro`, replaced the stub `CTA.jsx` with a real reusable article CTA surface, tightened `buildPostLinking()` so `next up` does not duplicate a related card, and added Playwright coverage for article body/endcap structure on reviewed posts.

## Objective
Make article reading flow feel more deliberate by improving body typography rhythm, replacing obvious placeholder CTA behavior, and tightening the related-reading/endcap section.

## Scope
- Refine article body spacing and prose rhythm.
- Improve the inline CTA / end-of-article CTA treatment so it feels intentional and useful.
- Tighten the related reading and next-up area at the end of posts.
- Keep this work bounded to article-body and endcap polish after earlier top-block and callout work is stable.

## Acceptance Criteria
- Article body rhythm feels more deliberate and readable on reviewed posts.
- CTA treatment is no longer obviously placeholder or accidental.
- Related reading and end-of-article areas feel consistent and editorially intentional.
- The endcap does not duplicate content unnecessarily or fight the article body for attention.

## Implementation Notes
- `CTA.jsx` is currently a stub and should either be replaced with a real reusable CTA surface or removed from the plan if unnecessary.
- `PostLayout.astro`, `SubscribeInline.tsx`, `PostCard.astro`, and `RightRailRelated.astro` together define most of the article endcap experience.
- Review whether `buildPostLinking()` needs small adjustments to support stronger related-reading curation.

## Likely Files / Components Involved
- `src/layouts/PostLayout.astro`
- `src/components/CTA.jsx`
- `src/components/SubscribeInline.tsx`
- `src/components/PostCard.astro`
- `src/components/RightRailRelated.astro`
- `src/utils/postLinking.ts`
- `src/styles/global.css`
