import type { PostEntry } from '../content/config';
import { getHubByKey } from '../data/hubs';
import { sortPosts } from './postSections';

const PILLAR_KEYS = ['work-money', 'kids-school', 'love-connection', 'mind-attention', 'system-shock'] as const;
export type PillarKey = (typeof PILLAR_KEYS)[number];

export function getPillarFromPost(post: PostEntry): PillarKey | undefined {
  const pillar = post.data.pillar ?? post.data.topics?.[0];
  return PILLAR_KEYS.includes(pillar as PillarKey) ? (pillar as PillarKey) : undefined;
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
  const sorted = sortPosts(allPosts).filter((entry) => !entry.data.draft);
  const pillar = getPillarFromPost(post);
  const hub = getHubByKey(pillar);

  const explicitRelatedSlugs = new Set(post.data.related ?? []);
  const explicitRelated = sorted.filter((entry) => explicitRelatedSlugs.has(entry.slug));

  const pillarPool = sorted.filter(
    (entry) => entry.slug !== post.slug && getPillarFromPost(entry) === pillar && !explicitRelatedSlugs.has(entry.slug),
  );
  const fallbackPool = sorted.filter((entry) => entry.slug !== post.slug && !explicitRelatedSlugs.has(entry.slug));

  const related = uniquePosts([...explicitRelated, ...pillarPool, ...fallbackPool]).slice(0, 3);

  let nextUp: PostEntry | undefined;
  if (pillar) {
    const pillarSorted = sorted.filter((entry) => getPillarFromPost(entry) === pillar);
    const index = pillarSorted.findIndex((entry) => entry.slug === post.slug);
    if (index >= 0 && index + 1 < pillarSorted.length) {
      nextUp = pillarSorted[index + 1];
    }
  }
  if (!nextUp) {
    nextUp = sorted.find((entry) => entry.slug !== post.slug);
  }

  const sidebarBase = uniquePosts([...related, ...pillarPool]);
  const sidebar =
    (sidebarBase.length ? sidebarBase : fallbackPool).filter((entry) => entry.slug !== nextUp?.slug).slice(0, 5);

  return { pillar, hub, related, nextUp, sidebar };
}
