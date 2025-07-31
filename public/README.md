# /public
Static assets (images, fonts, etc.) go here.

## How to Add Images and Create Posts with Images

### 1. Add Your Image
- Place your image file in the `public/images/` directory. For example: `public/images/myphoto.jpg`.

### 2. Create a New Markdown Post
- In `src/content/posts/`, create a new `.md` file (e.g., `my-new-post.md`).

### 3. Add Frontmatter to the Markdown File
At the top of your markdown file, include YAML frontmatter with the necessary metadata. For a post with an image, you might use:

```markdown
---
title: "My New Post"
date: 2025-07-30
author: "Your Name"
image: "/images/myphoto.jpg"   # Path relative to the public folder
description: "A short summary of the post."
tags: ["example", "image"]
---
```

- `title`: The title of your post.
- `date`: The publication date.
- `author`: Your name or handle.
- `image`: The path to your image, starting with `/images/`.
- `description`: (Optional) A short summary for previews.
- `tags`: (Optional) List of tags for the post.

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
