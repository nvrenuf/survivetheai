import type { PostEntry } from '../content/config';
import { getHubByKey } from '../data/hubs';
import { isPublicPost, sortPosts } from './postSections';

const PILLAR_KEYS = ['work-money', 'kids-school', 'love-connection', 'mind-attention', 'system-shock'] as const;
export type PillarKey = (typeof PILLAR_KEYS)[number];

export function getPillarFromPost(post: PostEntry): PillarKey | undefined {
  const pillar = post.data.pillar ?? post.data.topics?.[0];
  return PILLAR_KEYS.includes(pillar as PillarKey) ? (pillar as PillarKey) : undefined;
}

export function getHubKeysForPost(post: PostEntry): PillarKey[] {
  const keys = new Set<PillarKey>();
  const pillar = getPillarFromPost(post);
  if (pillar) {
    keys.add(pillar);
  }

  for (const topic of post.data.topics ?? []) {
    if (PILLAR_KEYS.includes(topic as PillarKey)) {
      keys.add(topic as PillarKey);
    }
  }

  return [...keys];
}

export function postBelongsToHub(post: PostEntry, hubKey?: PillarKey): boolean {
  if (!hubKey) return false;
  return getHubKeysForPost(post).includes(hubKey);
}

function uniquePosts(entries: PostEntry[]): PostEntry[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.slug)) return false;
    seen.add(entry.slug);
    return true;
  });
}

export function buildPostLinking(post: PostEntry, allPosts: PostEntry[]) {
  const sorted = sortPosts(allPosts).filter(isPublicPost);
  const pillar = getPillarFromPost(post);
  const hub = getHubByKey(pillar);

  if (import.meta.env.DEV && !pillar) {
    console.warn(`[linking] Missing pillar for post ${post.slug}. Hub link will be hidden.`);
  }

  const explicitRelatedSlugs = new Set(post.data.related ?? []);
  const explicitRelated = sorted.filter((entry) => explicitRelatedSlugs.has(entry.slug));

  const pillarPool = sorted.filter((entry) => entry.slug !== post.slug && postBelongsToHub(entry, pillar) && !explicitRelatedSlugs.has(entry.slug));
  const fallbackPool = sorted.filter((entry) => entry.slug !== post.slug && !explicitRelatedSlugs.has(entry.slug));

  let nextUp: PostEntry | undefined;
  if (pillar) {
    const pillarSorted = sorted.filter((entry) => postBelongsToHub(entry, pillar));
    const index = pillarSorted.findIndex((entry) => entry.slug === post.slug);
    if (index >= 0 && index + 1 < pillarSorted.length) {
      nextUp = pillarSorted[index + 1];
    }
  }
  if (!nextUp) {
    nextUp = sorted.find((entry) => entry.slug !== post.slug);
  }

  const related = uniquePosts([...explicitRelated, ...pillarPool, ...fallbackPool])
    .filter((entry) => entry.slug !== nextUp?.slug)
    .slice(0, 3);

  const sidebarBase = uniquePosts([...related, ...pillarPool]);
  const sidebar =
    (sidebarBase.length ? sidebarBase : fallbackPool).filter((entry) => entry.slug !== nextUp?.slug).slice(0, 5);

  return { pillar, hub, related, nextUp, sidebar };
}
