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
