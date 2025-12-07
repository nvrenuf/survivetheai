
# Admin Note: Topic Tags and Categories

Great question — and it's important we keep our language consistent.

### ✅ **Topics vs. Categories — How They Work Together**

In this project, **topics and categories refer to the same set of key themes**, but we use them in slightly different contexts:

---

#### 1. **Topics** = Editorial Lens

* Think of topics as our **storytelling angle**.
* They shape landing page messaging, quizzes, and overall brand voice.
* When designing new experiences, align them to a topic so content feels cohesive.

---

#### 2. **Categories** = Content Taxonomy

* Categories are **technical tags or labels** assigned to content.
* Used in:
  * Markdown frontmatter
  * Filters and search tools
  * Sidebar navigation
  * AI recommendation logic

> Example: A blog post about AI tutors would be labeled:

```yaml
category: "Parenting & Education"
```

---

### ✅ TL;DR:

They represent the same topics, but **topics** guide narrative framing while **categories** keep content organized for developers and tooling.

# /public
Static assets (images, fonts, etc.) go here.

## How to Add Images and Create Posts with Images

### 1. Add Your Image
- Place your image file in the `public/images/` directory. For example: `public/images/myphoto.jpg`.

### 2. Create a New Markdown Post
- In `src/content/posts/`, create a new `.md` file (e.g., `my-new-post.md`).

### 3. Add Frontmatter to the Markdown File
At the top of your markdown file, include YAML frontmatter with the necessary metadata. For a post with an image, you might use:

title: "My New Post"
date: 2025-07-30
author: "Your Name"
image: "/images/myphoto.jpg"   # Path relative to the public folder
description: "A short summary of the post."
tags: ["example", "image"]
```markdown
---
filename: "my-new-post.md"
title: "My New Post"
pubDate: 2025-07-30
author: "Your Name"
description: "A short summary of the post."
excerpt: "A short excerpt for previews."
image: "/images/myphoto.jpg"   # Path relative to the public folder
tags: ["example", "image"]
category: "Your Category Name"
---
```

- `filename`: The markdown filename (for reference).
- `title`: The title of your post.
- `pubDate`: The publication date.
- `author`: Your name or handle.
- `description`: A short summary for previews.
- `excerpt`: A short excerpt for previews.
- `image`: The path to your image, starting with `/images/`.
- `tags`: List of tags for the post.
- `category`: The category name (must match one from the categories list).

### 4. Write Your Post Content
Below the frontmatter, write your post in standard Markdown. You can also embed images anywhere in the content:

```markdown
![Alt text for image](/images/myphoto.jpg)
```

### 5. Update the Site
- Save your new markdown file in `src/content/posts/`.
- The site should automatically pick up new posts if it’s set up to read from this directory.
- If you’re running a local dev server, refresh the page to see your new post.

### 6. Commit and Push
- Add, commit, and push your changes to your branch:
  ```bash
  git add .
  git commit -m "Add new post: My New Post"
  git push
  ```

### 7. (Optional) Create a Pull Request
- If you’re working on a feature branch, open a pull request to merge your changes into the main branch.

---

If you need to update navigation, tags, or other site-wide settings, check for configuration files in `src/content/config.ts` or similar.
