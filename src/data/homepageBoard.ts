import type { PostEntry } from '../content/config';
import { formatDate } from '../utils/format';
import { getPillarFromPost, type PillarKey } from '../utils/postLinking';
import { isArchiveVisiblePost, isPlaceholderPost, sortPosts } from '../utils/postSections';
import { buildHomepagePlacement } from './homepage';
import { SURVIVAL_HUBS, type SurvivalHub } from './hubs';

type LiveModuleTone = 'high' | 'medium' | 'low';

export type HomepageLiveModule = {
  title: string;
  value: string;
  summary: string;
  detail: string;
  sourceLabel: string;
  tone: LiveModuleTone;
  items?: string[];
  href?: string;
  hrefLabel?: string;
};

export type HomepageThreatCard = {
  hub: SurvivalHub;
  score: number;
  delta: number;
  stance: string;
  summary: string;
  latestPost?: PostEntry;
};

export type HomepageMacroGauge = {
  title: string;
  value: number;
  summary: string;
  detail: string;
  href: string;
  hrefLabel: string;
};

export type HomepageVoteOption = {
  id: string;
  label: string;
  description: string;
};

export type HomepageBoardModel = {
  anchorDateLabel: string;
  leadPost?: PostEntry;
  liveModules: HomepageLiveModule[];
  threatCards: HomepageThreatCard[];
  macroGauges: HomepageMacroGauge[];
  impactItems: PostEntry[];
  votePrompt: string;
  voteOptions: HomepageVoteOption[];
};

const EDITORIAL_THREAT_MODEL: Record<
  PillarKey,
  {
    score: number;
    delta: number;
    stance: string;
    summary: string;
  }
> = {
  'work-money': {
    score: 86,
    delta: 6,
    stance: 'Hiring freezes and invisible automation are moving faster than public layoff headlines.',
    summary: 'Board editorial score. Work pressure is broad, quiet, and compounding.',
  },
  'kids-school': {
    score: 74,
    delta: 4,
    stance: 'Schools still lag the tooling shift, so family policy is becoming the real first line of defense.',
    summary: 'Board editorial score. Student integrity and durable skill-building are under steady pressure.',
  },
  'love-connection': {
    score: 69,
    delta: 5,
    stance: 'Synthetic intimacy is normalizing faster than public literacy about manipulation, privacy, and habit loops.',
    summary: 'Board editorial score. Emotional substitution risk is rising before norms catch up.',
  },
  'mind-attention': {
    score: 78,
    delta: 3,
    stance: 'Cognitive offloading is becoming ambient infrastructure, not an opt-in productivity hack.',
    summary: 'Board editorial score. Focus erosion is gradual, measurable, and easy to underestimate.',
  },
  'system-shock': {
    score: 64,
    delta: 2,
    stance: 'Macro risk is still episodic, but resilience gaps remain larger than most households assume.',
    summary: 'Board editorial score. Systemic shocks remain lower-frequency but high-consequence.',
  },
};

const EDITORIAL_MACRO_GAUGES: HomepageMacroGauge[] = [
  {
    title: 'Household shock exposure',
    value: 77,
    summary: 'Editorial gauge of how directly ordinary households are feeling AI pressure right now.',
    detail: 'Jobs, school routines, and attention systems are carrying the most immediate load.',
    href: '/start-here',
    hrefLabel: 'Open Start Here',
  },
  {
    title: 'Institutional readiness',
    value: 42,
    summary: 'Editorial gauge of whether schools, employers, and policy systems look prepared.',
    detail: 'Most institutions are still reacting piecemeal instead of designing around the new baseline.',
    href: '/how-we-research',
    hrefLabel: 'See the standards',
  },
  {
    title: 'Synthetic trust distortion',
    value: 71,
    summary: 'Editorial gauge of how much AI is muddying what people can trust across media and relationships.',
    detail: 'The deception layer is improving faster than household defenses and social norms.',
    href: '/impact-score-methodology',
    hrefLabel: 'Read the methodology',
  },
];

const VOTE_OPTIONS: HomepageVoteOption[] = [
  {
    id: 'work-money',
    label: 'Work & Money',
    description: 'Job security, deskilling, layoffs, and income volatility feel closest to home.',
  },
  {
    id: 'kids-school',
    label: 'Kids & School',
    description: 'Learning, honesty, and future-readiness for children feel most exposed.',
  },
  {
    id: 'mind-attention',
    label: 'Mind & Attention',
    description: 'Focus, judgment, and independent thinking are taking the sharpest hit.',
  },
  {
    id: 'love-connection',
    label: 'Love & Connection',
    description: 'Trust, intimacy, and loneliness feel most destabilized.',
  },
  {
    id: 'system-shock',
    label: 'System Shock',
    description: 'Macro instability, deception, and institutional fragility feel hardest to ignore.',
  },
];

const LIVE_SOURCE_LABEL = 'Near-live input. Derived from recently published STA coverage, not external live feeds.';

function getHomepageEligiblePosts(posts: PostEntry[]) {
  return sortPosts(posts).filter((post) => isArchiveVisiblePost(post) && !post.data.homepageHidden && !isPlaceholderPost(post));
}

function getPostsInWindow(posts: PostEntry[], anchorDate: Date, days: number) {
  const millis = days * 24 * 60 * 60 * 1000;
  return posts.filter((post) => anchorDate.getTime() - post.data.date.getTime() <= millis);
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildTrendingAnxieties(posts: PostEntry[]) {
  const counts = new Map<PillarKey, number>();

  for (const post of posts) {
    const pillar = getPillarFromPost(post);
    if (!pillar) continue;
    counts.set(pillar, (counts.get(pillar) ?? 0) + 1);
  }

  return [...SURVIVAL_HUBS]
    .map((hub) => ({ hub, count: counts.get(hub.key) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.hub.order - b.hub.order)
    .filter((item) => item.count > 0)
    .slice(0, 3)
    .map((item) => `${item.hub.shortName} (${item.count})`);
}

export function buildHomepageBoard(allPosts: PostEntry[]): HomepageBoardModel {
  const eligiblePosts = getHomepageEligiblePosts(allPosts);
  const placement = buildHomepagePlacement(allPosts);
  const anchorDate = eligiblePosts[0]?.data.date ?? new Date();
  const trailing14 = getPostsInWindow(eligiblePosts, anchorDate, 14);
  const trailing30 = getPostsInWindow(eligiblePosts, anchorDate, 30);
  const trailing45 = getPostsInWindow(eligiblePosts, anchorDate, 45);
  const workMoney45 = trailing45.filter((post) => getPillarFromPost(post) === 'work-money');
  const trendingAnxieties = buildTrendingAnxieties(trailing30);
  const leadWorkMoney = workMoney45[0];
  const fearHeat = clampScore(average(trailing30.map((post) => post.data.impact_score)));

  const liveModules: HomepageLiveModule[] = [
    {
      title: 'AI fear heat / news volume',
      value: `${fearHeat}/100`,
      summary: 'Recent coverage intensity across the board.',
      detail: `${trailing30.length} published signals in the trailing 30-day window ending ${formatDate(anchorDate)}.`,
      sourceLabel: LIVE_SOURCE_LABEL,
      tone: fearHeat >= 75 ? 'high' : fearHeat >= 55 ? 'medium' : 'low',
      href: '/posts',
      hrefLabel: 'View latest posts',
    },
    {
      title: 'Trending AI anxieties',
      value: trendingAnxieties.length ? `Top ${trendingAnxieties.length}` : 'Watching',
      summary: 'Fear areas with the heaviest recent signal density.',
      detail: 'Ranked from recent STA publishing activity by fear area.',
      sourceLabel: LIVE_SOURCE_LABEL,
      tone: 'medium',
      items: trendingAnxieties.length ? trendingAnxieties : ['No recent concentration yet'],
      href: '/survival-areas/work-money',
      hrefLabel: 'Browse fear areas',
    },
    {
      title: 'New AI incidents added',
      value: `${trailing14.length}`,
      summary: 'New editorially logged pressure items in the last 14 days of coverage.',
      detail: 'This includes new analyses and incident-driven dispatches published by STA.',
      sourceLabel: LIVE_SOURCE_LABEL,
      tone: trailing14.length >= 4 ? 'high' : trailing14.length >= 2 ? 'medium' : 'low',
      href: '/posts',
      hrefLabel: 'Open the archive',
    },
    {
      title: 'Tech layoff watch',
      value: `${workMoney45.length}`,
      summary: 'Work & Money dispatches in the last 45 days.',
      detail: leadWorkMoney
        ? `Latest signal: ${leadWorkMoney.data.title}`
        : 'Waiting for the next work-and-money dispatch.',
      sourceLabel: LIVE_SOURCE_LABEL,
      tone: workMoney45.length >= 3 ? 'high' : workMoney45.length >= 1 ? 'medium' : 'low',
      href: '/survival-areas/work-money',
      hrefLabel: 'Open Work & Money',
    },
  ];

  const threatCards: HomepageThreatCard[] = [...SURVIVAL_HUBS]
    .sort((a, b) => a.order - b.order)
    .map((hub) => ({
      hub,
      ...EDITORIAL_THREAT_MODEL[hub.key],
      latestPost: eligiblePosts.find((post) => getPillarFromPost(post) === hub.key),
    }));

  return {
    anchorDateLabel: formatDate(anchorDate),
    leadPost: placement.featured,
    liveModules,
    threatCards,
    macroGauges: EDITORIAL_MACRO_GAUGES,
    impactItems: eligiblePosts.slice(0, 5),
    votePrompt: 'Which fear area feels most personally urgent right now?',
    voteOptions: VOTE_OPTIONS,
  };
}
