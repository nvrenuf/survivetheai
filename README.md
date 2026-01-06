# SurviveTheAI

Welcome to SurviveTheAI – your essential guide to thriving in the age of artificial intelligence!

## ðŸš€ What is SurviveTheAI?
SurviveTheAI is a modern, content-driven web application designed to empower individuals, families, and professionals to navigate the rapidly changing world shaped by AI. Our mission is to demystify artificial intelligence, address real fears, and provide actionable insights so you can future-proof your life and career.

## ðŸŒŸ Key Features
- **Fear Index:** Explore the most common concerns about AI and discover practical ways to overcome them.
- **Expert Insights:** Read blog posts and guides from thought leaders, educators, and technologists.
- **Interactive Quizzes:** Test your knowledge and learn how to adapt to the AI revolution.
- **Newsletter:** Stay ahead with curated news, tips, and resources delivered straight to your inbox.
- **Community:** Join a growing movement of people committed to learning, adapting, and thriving together.

## ðŸ§­ Why SurviveTheAI?
AI is transforming every aspect of our lives—from the workplace to the classroom, from healthcare to entertainment. SurviveTheAI is your trusted companion, helping you:
- Understand the opportunities and risks of AI
- Build resilience and adaptability
- Equip your family and children for the future
- Make informed decisions in a world of rapid change

## ðŸ› ï¸ Tech Stack
- **Astro** for blazing-fast static site generation
- **Tailwind CSS** for beautiful, responsive design
- **Markdown** for easy content creation
- **Modern JavaScript/TypeScript** for interactivity

## 📨 Newsletter + Analytics
- Inline subscribe forms post to `/api/subscribe` and forward to Buttondown when `PUBLIC_ENABLE_SUBSCRIBE_API=true` and `BUTTONDOWN_API_KEY` are set. Without keys, submissions can run in log-only mode (`SUBSCRIBE_LOG_ONLY=true`) for previews; otherwise the endpoint returns a clear “not enabled” or “temporarily unavailable” response surfaced in the UI.
- Buttondown setup: generate a personal API token in Buttondown → Settings → API and add it as `BUTTONDOWN_API_KEY`; optionally set `BUTTONDOWN_PUBLICATION_ID` if you manage multiple publications.
- UX states are explicit: idle → loading (button disabled) → success (“Check your inbox”) or friendly error. Invalid requests never show false success.
- GA4 hooks are available via `PUBLIC_GA_MEASUREMENT_ID` (with optional `PUBLIC_ANALYTICS_DEBUG=true` to mirror events in the console). Newsletter submit/success/error and scroll depth (25/50/75/90) events are emitted once per interaction; debug logs only appear when GA is missing or debug is enabled.

### Deployment checklist
- Set environment variables in Vercel → Project Settings → Environment Variables:
  - Public: `PUBLIC_GA_MEASUREMENT_ID` (optional), `PUBLIC_ANALYTICS_DEBUG` (optional), `PUBLIC_ENABLE_SUBSCRIBE_API` (set to `true` only when ready).
  - Server-only: `BUTTONDOWN_API_KEY`, `BUTTONDOWN_PUBLICATION_ID` (optional), `SUBSCRIBE_LOG_ONLY` (set to `true` for previews without Buttondown).
- Keep `PUBLIC_ENABLE_SUBSCRIBE_API=false` until credentials are present or log-only mode is enabled.
- Verify subscribe flows:
  - Disabled flag shows “Newsletter signup isn’t enabled yet.”
  - Enabled without creds shows “Signup temporarily unavailable. Please try again later.”
  - Enabled with creds delivers “Check your inbox…” on success.
- Verify analytics:
  - Scroll depth events fire once per threshold on post pages only.
  - Newsletter submit/success/error events include the page path.
- Confirm hero imagery: posts with explicit heroes keep them; posts without heroes fall back to `/images/placeholder-hero.svg` for OG and on-page rendering without replacing real images.

## ðŸ“‚ How to Contribute
We welcome contributions! Check out the `/src/content/posts/` directory to add new articles, or see `/public/README.md` for instructions on adding images and creating posts.

### Working without the VS Code CLI
This containerized environment cannot download or run Microsoft's official
`code` binary, which previously caused a `command not found` error when trying
to launch Visual Studio Code from the terminal. To surface more helpful
guidance we now ship a small shim at `bin/code` that explains alternatives for
opening the project in VS Code.

To use it, add the repository's `bin` directory to your `PATH` in the current
shell session:

```bash
export PATH="$(pwd)/bin:$PATH"
```

Running `code` (or `code --help`) afterwards will display a message detailing
options such as using [vscode.dev](https://vscode.dev), connecting through VS
Code Remote Tunnels, or cloning the repository locally where the real CLI is
available.

---
## Content Workflow  
This project uses a strict, source-first blog creation process. See the canonical workflow: [`/docs/workflows/blog-creation.md`](/docs/workflows/blog-creation.md).



SurviveTheAI: Because the best way to predict the future is to create it. ðŸŒðŸ¤–
