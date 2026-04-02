# STA-12 Contact The Editor And Trust-Surface Audit

Reviewed on `2026-04-02` for the active `STA Operations, Capture, and Editorial Enforcement Pass`.

## Verified Trust And Contact Surfaces

- [`src/pages/contact.astro`](C:\Users\lee\Documents\survivetheai\src\pages\contact.astro) is the public contact route.
- [`src/pages/about.astro`](C:\Users\lee\Documents\survivetheai\src\pages\about.astro) is the public masthead and ownership page.
- [`src/pages/how-we-research.astro`](C:\Users\lee\Documents\survivetheai\src\pages\how-we-research.astro) is the public standards and corrections page.
- [`src/pages/impact-score-methodology.astro`](C:\Users\lee\Documents\survivetheai\src\pages\impact-score-methodology.astro) is the public methodology page.
- [`src/components/CredibilityPanel.astro`](C:\Users\lee\Documents\survivetheai\src\components\CredibilityPanel.astro) and [`src/components/Footer.astro`](C:\Users\lee\Documents\survivetheai\src\components\Footer.astro) are the shared trust surfaces repeated across the site.
- [`src/data/authors.ts`](C:\Users\lee\Documents\survivetheai\src\data\authors.ts) is the source of truth for publisher and contact metadata used by the trust layer.

## Verified Current Contact Path

1. Public trust surfaces point readers to `mailto:editor@survivetheai.com`.
2. The footer also links to [`/contact`](C:\Users\lee\Documents\survivetheai\src\pages\contact.astro), which now matches the same editor inbox.
3. There is no live contact form or backend contact handler in the current repo. The real contact path is email only.

## Findings

### Fixed in scope

- The public contact path had split inboxes:
  - `hello@survivetheai.com` on `/contact`
  - `editor@survivetheai.com` everywhere else
- `/contact` now uses the same `editor@survivetheai.com` inbox as the rest of the trust layer.
- The contact page previously promised a response window of "within two business days" without any supporting operational guarantee elsewhere in the repo. That promise was removed.
- Visible mojibake on trust surfaces was corrected on:
  - [`src/pages/contact.astro`](C:\Users\lee\Documents\survivetheai\src\pages\contact.astro)
  - [`src/pages/about.astro`](C:\Users\lee\Documents\survivetheai\src\pages\about.astro)
  - [`src/components/Footer.astro`](C:\Users\lee\Documents\survivetheai\src\components\Footer.astro)

### Verified as already acceptable

- About, standards, methodology, and shared trust components are internally aligned around:
  - named contributors
  - SurviveTheAI Editorial Team for team-maintained work
  - visible standards and correction paths
  - a public methodology page
- The current author and masthead language does not claim credentials or staffing levels beyond what is shown in the repo-owned author profiles.
- "Contact the editor" is accurate as a mailto path as long as it is presented as email, not as a live form or staffed desk.

## Scope Boundary

- This audit does **not** add a contact form, help desk workflow, staffing claims, or broad brand rewrite.
- This audit does **not** redesign trust pages or expand into editorial model changes.
