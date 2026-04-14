import type { PostEntry } from '../content/config';
import { SURVIVAL_HUBS, type SurvivalHub } from './hubs';
import { getPillarFromPost } from '../utils/postLinking';
import { isArchiveVisiblePost, isPlaceholderPost, sortPosts } from '../utils/postSections';

type HomepageConfig = {
  featuredSlug: string;
  editorPickSlugs: string[];
  fearAreaSpotlightSlugs: Record<SurvivalHub['key'], string>;
};

type FearAreaSpotlight = {
  hub: SurvivalHub;
  post?: PostEntry;
  fallbackHref?: string;
  fallbackLabel?: string;
};

type HomepagePlacement = {
  featured?: PostEntry;
  latestIntelligence: PostEntry[];
  editorPicks: PostEntry[];
  fearAreaSpotlights: FearAreaSpotlight[];
  remaining: PostEntry[];
};

const LATEST_INTELLIGENCE_SIZE = 3;

export const homepageConfig: HomepageConfig = {
  featuredSlug: 'ai-agents-arent-tools',
  editorPickSlugs: ['aiproofyourkid', 'replacing-human-intimacy', 'credentialism'],
  fearAreaSpotlightSlugs: {
    'work-money': 'ai-is-leaving-the-cloud',
    'kids-school': 'ai-study-platforms-2025',
    'love-connection': 'alone-together',
    'mind-attention': 'rapidchange',
    'system-shock': 'aifears',
  },
};

function isHomepageEligible(post: PostEntry): boolean {
  return isArchiveVisiblePost(post) && !post.data.homepageHidden && !isPlaceholderPost(post);
}

function findEligiblePostBySlug(posts: PostEntry[], slug?: string, used?: Set<string>) {
  if (!slug) return undefined;
  return posts.find((post) => post.slug === slug && !used?.has(post.slug));
}

function buildFearAreaFallback(hub: SurvivalHub): FearAreaSpotlight {
  return {
    hub,
    fallbackHref: `${hub.slug}/`,
    fallbackLabel: `Browse ${hub.shortName}`,
  };
}

function buildLatestIntelligence(posts: PostEntry[], used: Set<string>) {
  const areaCandidates = [...SURVIVAL_HUBS]
    .map((hub) => {
      const post = posts.find((entry) => getPillarFromPost(entry) === hub.key && !used.has(entry.slug));
      return post ? { hub, post } : undefined;
    })
    .filter((entry): entry is { hub: SurvivalHub; post: PostEntry } => Boolean(entry))
    .sort((a, b) => b.post.data.date.getTime() - a.post.data.date.getTime());

  const picked = areaCandidates.slice(0, LATEST_INTELLIGENCE_SIZE).map((entry) => entry.post);
  picked.forEach((post) => used.add(post.slug));

  if (picked.length === LATEST_INTELLIGENCE_SIZE) {
    return picked;
  }

  for (const post of posts) {
    if (used.has(post.slug)) continue;
    picked.push(post);
    used.add(post.slug);
    if (picked.length === LATEST_INTELLIGENCE_SIZE) break;
  }

  return picked;
}

export function buildHomepagePlacement(allPosts: PostEntry[]): HomepagePlacement {
  const eligiblePosts = sortPosts(allPosts).filter(isHomepageEligible);
  const used = new Set<string>();

  const featured =
    findEligiblePostBySlug(eligiblePosts, homepageConfig.featuredSlug) ??
    eligiblePosts.find((post) => post.data.featured) ??
    eligiblePosts[0];

  if (featured) used.add(featured.slug);

  const latestIntelligence = buildLatestIntelligence(eligiblePosts, used);

  const fearAreaSpotlights = [...SURVIVAL_HUBS]
    .sort((a, b) => a.order - b.order)
    .map((hub) => {
      const configured = findEligiblePostBySlug(eligiblePosts, homepageConfig.fearAreaSpotlightSlugs[hub.key], used);
      const fallback = eligiblePosts.find((post) => getPillarFromPost(post) === hub.key && !used.has(post.slug));
      const post = configured ?? fallback;

      if (post) {
        used.add(post.slug);
        return { hub, post };
      }

      return buildFearAreaFallback(hub);
    });

  const editorPicks = homepageConfig.editorPickSlugs
    .map((slug) => findEligiblePostBySlug(eligiblePosts, slug, used))
    .filter((post): post is PostEntry => Boolean(post))
    .slice(0, 3);

  editorPicks.forEach((post) => used.add(post.slug));

  const remaining = eligiblePosts.filter((post) => !used.has(post.slug));

  return {
    featured,
    latestIntelligence,
    editorPicks,
    fearAreaSpotlights,
    remaining,
  };
}
