# STA-13 Editorial Standards Enforcement In Content Workflow

Reviewed on `2026-04-02` for the active `STA Operations, Capture, and Editorial Enforcement Pass`.

## Audit Summary

### Existing enforcement already present

- Public article pages already render the shared byline layer through [`src/layouts/PostLayout.astro`](C:\Users\lee\Documents\survivetheai\src\layouts\PostLayout.astro).
- Public article pages already render the shared Impact Score methodology link through [`src/layouts/PostLayout.astro`](C:\Users\lee\Documents\survivetheai\src\layouts\PostLayout.astro).
- Claims & Verification coverage already existed as a build-time runtime guard through [`src/data/claimsVerification.ts`](C:\Users\lee\Documents\survivetheai\src\data\claimsVerification.ts).

### Drift risks found

- The content schema allowed any free-form `author` string, which meant future public posts could silently bypass the named byline system.
- Public legacy posts still used the alias `Admin`, which rendered correctly only because of fallback alias handling rather than explicit canonical byline data.
- The canonical workflow doc did not clearly state that live posts must use the shared byline and Claims & Verification system, even though the repo already relied on it.

## Enforcement Added

- `src/content/config.ts` now constrains `author` to known repo-owned author names and aliases.
- `src/utils/livePostStandards.ts` now fails the build when a public post:
  - uses a non-canonical author byline
  - lacks a Claims & Verification entry
  - hand-writes a `## Claims & Verification` section instead of using the shared layout
- `src/pages/posts/[slug].astro` now runs that validator across all public posts during build.
- Public legacy `Admin` bylines were normalized to `SurviveTheAI Editorial Team` so the public surface matches the intended source of truth.

## Workflow Docs Updated

- [`docs/workflows/blog-creation.md`](C:\Users\lee\Documents\survivetheai\docs\workflows\blog-creation.md) now states the required live-post standards and points to `npm run build` as the enforcement gate.
- [`src/content/README.md`](C:\Users\lee\Documents\survivetheai\src\content\README.md) now documents the byline, Claims & Verification, and methodology expectations in one place.

## Scope Boundary

- This issue does **not** rebuild the CMS or editorial platform.
- This issue does **not** rewrite archive content beyond the minimum metadata normalization needed for public byline enforcement.
- This issue does **not** add a large workflow engine; it keeps enforcement lightweight and repo-native.
