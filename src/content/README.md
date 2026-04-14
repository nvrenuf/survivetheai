# /src/content
Markdown content (Fear Papers, product kits) goes here.

## Article Callouts
Use `src/components/Callout.astro` in MDX articles for the shared STA editorial callout system.

Supported variants:
- `kind="tldr"`
- `kind="defend"`
- `kind="next"`
- `kind="warning"`
- `kind="checklist"`
- `kind="claims"`

Example:

```mdx
import Callout from '../../components/Callout.astro';

<Callout kind="tldr">
  <p>State the key takeaway in one or two tight paragraphs.</p>
</Callout>
```

## Claims & Verification Standard
Every live post must have a Claims & Verification entry in `src/data/claimsVerification.ts`.

Rules:
- Do not hand-write a custom `## Claims & Verification` section inside the article body for live posts.
- Add concise bullets for `supported` and `uncertain`.
- Keep claims narrow enough to defend with the sourcing already used in the article.
- If a claim is weak, move it into `uncertain` or cut it.

The article layout renders this section automatically and the build should fail if a public post is missing coverage.

## Live Post Standards
Public posts are expected to pass the shared live-post standards gate during `npm run build`.

Rules:
- Use a canonical author name from `src/data/authors.ts` for every public post.
- Keep `impact_score` in frontmatter; the shared article layout automatically links that score to `/impact-score-methodology`.
- Do not bypass the shared byline, Claims & Verification, or methodology treatment with ad hoc replacements in individual posts.
- Internal or draft posts can remain in progress, but public posts should be ready to survive the same build-time checks.
