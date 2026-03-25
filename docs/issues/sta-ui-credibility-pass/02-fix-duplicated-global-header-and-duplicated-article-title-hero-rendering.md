# Issue 02: Fix Duplicated Global Header and Duplicated Article Title/Hero Rendering

## Status
Closed on 2026-03-24.

## Objective
Remove duplicated global chrome and duplicated article lead elements so post pages render once, cleanly, and with a more authoritative editorial hierarchy.

## Scope
- Eliminate any double-rendered global header/footer behavior across article pages.
- Remove duplicated article hero/title presentation caused by layout-level rendering plus body-level markdown content.
- Normalize article lead conventions so reviewed posts do not repeat the hero image, H1, or subtitle immediately inside the article body.
- Limit the pass to the duplicated rendering problem. Do not redesign the article page in this issue.

## Acceptance Criteria
- The global header appears once per reviewed article page.
- The article title and hero are rendered once per reviewed article page.
- Reviewed posts no longer repeat the hero image or top-level title inside the body when the layout already provides those elements.
- The fix is applied in a way that does not break article metadata, sharing, or structured data.

## Implementation Notes
- The current article shell appears to own its own `Navbar` and `Footer` instead of sharing `BaseLayout`, so resolve duplication at the layout boundary first.
- Several content files currently include leading `#` headings and hero images that duplicate the layout hero/top block; handle these editorally in the specific reviewed posts rather than introducing brittle runtime stripping.
- Keep the article content model intact: body content remains markdown/MDX, but lead presentation belongs to the layout.

## Likely Files / Components Involved
- `src/layouts/PostLayout.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/posts/[slug].astro`
- `src/components/HeroImage.astro`
- `src/content/posts/deepfake-kids.md`
- `src/content/posts/the-nationalization-of-ai.md`
- `src/content/posts/alone-together.md`
- `src/content/posts/Replacing Human Intimacy.md`
- `src/content/posts/Entry-Level Is Dead.md`
- Other surfaced article files with a leading hero image and H1 in the body

## Completion Notes
- Moved reviewed post pages onto the shared site shell so article pages render one global header at the layout boundary.
- Removed duplicated lead-content rendering in reviewed article files where the body repeated the layout-owned hero image or H1.
- Added regression coverage so reviewed article pages keep a single global header and a single article hero/title block.
