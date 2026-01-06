import type { PostEntry } from '../content/config';

type Sections = {
  featured?: PostEntry;
  evergreen: PostEntry[];
  latest: PostEntry[];
  remaining: PostEntry[];
};

export function sortPosts(posts: PostEntry[]): PostEntry[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function buildSections(allPosts: PostEntry[]): Sections {
  const posts = sortPosts(allPosts).filter((post) => !post.data.draft);
  const used = new Set<string>();

  let featured = posts.find((post) => post.data.featured);
  if (!featured && posts.length > 0) {
    featured = posts[0];
  }
  if (featured) {
    used.add(featured.slug);
  }

  const evergreen: PostEntry[] = [];
  for (const post of posts) {
    if (used.has(post.slug)) continue;
    if (post.data.evergreen) {
      evergreen.push(post);
      used.add(post.slug);
    }
    if (evergreen.length === 4) break;
  }

  if (evergreen.length < 4) {
    for (const post of posts) {
      if (used.has(post.slug)) continue;
      evergreen.push(post);
      used.add(post.slug);
      if (evergreen.length === 4) break;
    }
  }

  const latest: PostEntry[] = [];
  for (const post of posts) {
    if (used.has(post.slug)) continue;
    latest.push(post);
    used.add(post.slug);
    if (latest.length === 6) break;
  }

  const remaining = posts.filter((post) => !used.has(post.slug));

  return { featured, evergreen, latest, remaining };
}

export function paginatePosts(posts: PostEntry[], pageSize: number) {
  const sorted = sortPosts(posts).filter((post) => !post.data.draft);
  const pages: PostEntry[][] = [];

  for (let i = 0; i < sorted.length; i += pageSize) {
    pages.push(sorted.slice(i, i + pageSize));
  }

  return { pages, totalPages: pages.length || 1 };
}
