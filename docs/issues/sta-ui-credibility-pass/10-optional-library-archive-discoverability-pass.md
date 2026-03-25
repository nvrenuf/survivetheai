# Issue 10: Optional Library/Archive Discoverability Pass

## Objective
Optionally improve archive and library discoverability after the primary credibility issues are stable and verified.

## Scope
- Review archive labeling, pagination clarity, and navigation cues into the library.
- Improve discoverability only if earlier credibility-pass work has settled without regressions.
- Defer broader IA changes, search, filtering systems, or content-model changes.

## Acceptance Criteria
- Library/discoverability work is deferred unless earlier items are stable.
- If executed, the library/archive entry points feel clearer without introducing new complexity.
- Pagination and archive navigation remain simple and reliable.
- No redesign, rebrand, or CMS migration is introduced.

## Implementation Notes
- Treat this issue as explicitly optional.
- Confirm the homepage and article credibility issues are complete before starting.
- Keep improvements additive and low risk.

## Likely Files / Components Involved
- `src/pages/posts/index.astro`
- `src/pages/posts/page/[page].astro`
- `src/components/BlogList.astro`
- `src/components/Navbar.astro`
- `src/pages/index.astro`
