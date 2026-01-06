import { TOPIC_CATEGORIES } from './categories';

export type SurvivalHub = {
  key: 'work-money' | 'kids-school' | 'love-connection' | 'mind-attention' | 'system-shock';
  name: string;
  shortName: string;
  slug: string;
  tagline: string;
  intro: string;
  whatsHappening: string;
  actionSteps: string[];
  color: string;
  order: number;
};

const categoryLookup = new Map(TOPIC_CATEGORIES.map((category) => [category.key, category]));

export const SURVIVAL_HUBS: SurvivalHub[] = [
  {
    key: 'work-money',
    name: 'Work & Money – AI Job Displacement',
    shortName: 'Work & Money',
    slug: '/survival-areas/work-money',
    tagline: 'Stay employable when automation pressure hits every role, not just tech.',
    intro: 'Automation is moving faster than hiring plans. This hub keeps you ahead of layoffs, deskilling, and income volatility so you can keep earning through the AI reset.',
    whatsHappening:
      'Open models and on-device AI are erasing the friction that once slowed automation. Output jumps without headcount growth, and backfill requests quietly disappear long before a layoff memo drops.',
    actionSteps: [
      'Audit your weekly tasks: what can AI already do, and how do you stay the human in the loop?',
      'Ship visible work every week that uses AI to multiply impact, not just shave minutes.',
      'Build a personal portfolio that shows outcomes, not prompts—evidence you’re indispensable.',
      'Diversify income streams early: advisory gigs, micro-products, or project-based work.',
    ],
    color: categoryLookup.get('work-money')?.color ?? '#e63b2e',
    order: categoryLookup.get('work-money')?.order ?? 1,
  },
  {
    key: 'kids-school',
    name: 'Kids & School – AI vs Your Children’s Future',
    shortName: 'Kids & School',
    slug: '/survival-areas/kids-school',
    tagline: 'Protect curiosity and rigor while AI homework helpers and study bots flood every classroom.',
    intro: 'Parents and teachers are fighting two battles at once: keeping kids honest about their own learning while equipping them with modern tools. This hub keeps the focus on durable skills.',
    whatsHappening:
      'Cheap AI study platforms and essay mills make shortcuts tempting. Colleges are recalibrating admissions, while K–12 policies lag behind. Families need a plan to keep kids learning, not outsourcing.',
    actionSteps: [
      'Set a household AI code: what’s allowed for brainstorming vs. what must stay human.',
      'Pair every AI-generated answer with a “teach it back” drill to confirm real understanding.',
      'Track which universities and districts are updating policies so your student isn’t caught off guard.',
      'Focus on projects that require original evidence, not generic prompts, to build real thinking.',
    ],
    color: categoryLookup.get('kids-school')?.color ?? '#f59e0b',
    order: categoryLookup.get('kids-school')?.order ?? 2,
  },
  {
    key: 'love-connection',
    name: 'Love, Sex & Connection – AI Relationships & Synthetic Intimacy',
    shortName: 'Love, Sex & Connection',
    slug: '/survival-areas/love-connection',
    tagline: 'Understand how synthetic companionship is reshaping intimacy, loneliness, and trust.',
    intro: 'AI companions promise warmth without risk. This hub explores how to protect real connection, avoid exploitation, and talk honestly with partners and teens about synthetic intimacy.',
    whatsHappening:
      'Companion apps are moving from novelty to habit. They learn preferences fast, and their economics reward engagement, not wellbeing. Expect blurred boundaries between “assistant,” “friend,” and “partner.”',
    actionSteps: [
      'Name the tradeoffs: where do bots help with loneliness vs. where do they erode real attachment?',
      'Discuss privacy and data trails with anyone using companion tools—assume recordings are forever.',
      'Set time-boxed experiments: try tools deliberately, then reflect on mood and habits after.',
    ],
    color: categoryLookup.get('love-connection')?.color ?? '#ec4899',
    order: categoryLookup.get('love-connection')?.order ?? 3,
  },
  {
    key: 'mind-attention',
    name: 'Mind & Attention – Cognitive Erosion & Offloading',
    shortName: 'Mind & Attention',
    slug: '/survival-areas/mind-attention',
    tagline: 'Defend your focus when every app offers to think for you.',
    intro: 'Cognitive offloading is now the default. This hub helps you keep deep work, memory, and judgment intact while using AI intentionally instead of passively.',
    whatsHappening:
      'Constant micro-assists dull recall and decision-making. Teams expect instant answers, and “second brain” tools quietly become the first. Without guardrails, thinking atrophies.',
    actionSteps: [
      'Run attention sprints: 60–90 minutes daily with no AI suggestions, then review the quality difference.',
      'Keep a manual notebook of decisions and their outcomes to resist outsourcing judgment.',
      'Schedule deliberate AI time blocks instead of ambient usage to avoid constant context switching.',
      'Pick one domain to stay fully human (writing, math, negotiation) to preserve a sharp edge.',
    ],
    color: categoryLookup.get('mind-attention')?.color ?? '#6366f1',
    order: categoryLookup.get('mind-attention')?.order ?? 4,
  },
  {
    key: 'system-shock',
    name: 'System Shock – Soft Extinction & Collapse',
    shortName: 'System Shock',
    slug: '/survival-areas/system-shock',
    tagline: 'Track macro risk without spiraling—practical resilience over doomscrolling.',
    intro: 'AI is entangling with supply chains, finance, and geopolitics. This hub keeps signal over noise so you can plan for shocks without freezing.',
    whatsHappening:
      'Deepfakes, weaponized misinformation, and automated exploitation are now cheap. Critical infrastructure increasingly depends on opaque models. Households need resilient defaults before crises hit.',
    actionSteps: [
      'Build a simple family contingency playbook: comms, cash buffer, offline copies of essentials.',
      'Audit information sources; favor primary data and outlets with transparent corrections.',
      'Practice “calm drills”: short routines to follow when an alarming headline drops to avoid panic moves.',
    ],
    color: categoryLookup.get('system-shock')?.color ?? '#0ea5e9',
    order: categoryLookup.get('system-shock')?.order ?? 5,
  },
];

export const SURVIVAL_HUB_MAP = new Map(SURVIVAL_HUBS.map((area) => [area.key, area]));

export function getHubByKey(key?: string) {
  return key ? SURVIVAL_HUB_MAP.get(key) : undefined;
}
