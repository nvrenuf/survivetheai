# STA-30: UI/UX follow-up regression and closeout

## Status
Planned.

## Objective
Run a final regression sweep after STA-25 through STA-29 and close the pass with tracker synchronization.

## Scope
- Validate all follow-up UI/UX issues meet their acceptance criteria.
- Execute targeted manual checks and automated Playwright coverage.
- Update issue docs and `ISSUE_ORDER.md` with final status and completion notes.

## Acceptance Criteria
- No open regressions across homepage, key navigation, newsletter capture, and long-form reading surfaces.
- Issue tracker state matches repo state.
- Pass closeout notes include what changed and what was verified.

## Implementation Notes
- No new feature work should be added in this issue.
- If regressions are found, open tightly scoped fix issues instead of broad patching.

## Likely Files / Components Involved
- `ISSUE_ORDER.md`
- `tests/homepage.spec.ts`
- `tests/posts.spec.ts`
- `tests/subscribe.spec.ts`
- pass documentation files in `docs/issues/sta-ui-ux-followup-pass/`
