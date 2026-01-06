import type { PostEntry } from '../content/config';

type Sections = {
  featured?: PostEntry;
  evergreen: PostEntry[];
  latest: PostEntry[];
  remaining: PostEntry[];
};

export const EVERGREEN_SECTION_MAX = 4;
export const LATEST_SECTION_SIZE = 5;
export const SURVIVAL_LIBRARY_PAGE_SIZE = 12;

export function sortPosts(posts: PostEntry[]): PostEntry[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function buildSections(allPosts: PostEntry[]): Sections {
  const posts = sortPosts(allPosts).filter((post) => !post.data.draft);
  const used = new Set<string>();

  const featured = posts.find((post) => post.data.featured);
  if (featured) used.add(featured.slug);

  const evergreen = posts
    .filter((post) => !used.has(post.slug) && post.data.evergreen)
    .slice(0, EVERGREEN_SECTION_MAX);
  evergreen.forEach((post) => used.add(post.slug));

  const latest: PostEntry[] = [];
  for (const post of posts) {
    if (used.has(post.slug)) continue;
    latest.push(post);
    used.add(post.slug);
    if (latest.length === LATEST_SECTION_SIZE) break;
  }

  const remaining = posts.filter((post) => !used.has(post.slug));

  return { featured, evergreen, latest, remaining };
}

export function paginatePosts(posts: PostEntry[], pageSize = SURVIVAL_LIBRARY_PAGE_SIZE) {
  const sorted = sortPosts(posts).filter((post) => !post.data.draft);
  const pages: PostEntry[][] = [];

  for (let i = 0; i < sorted.length; i += pageSize) {
    pages.push(sorted.slice(i, i + pageSize));
  }

  return { pages, totalPages: pages.length || 1 };
}
