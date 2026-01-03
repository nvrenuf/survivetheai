// src/data/categories.ts
// Single source of truth for all topic categories

export interface Category {
  key: string;
  label: string;
  slug: string;
  order: number;
  color: string;
  icon: string;
  description?: string;
}

export const TOPIC_CATEGORIES: Category[] = [
  {
    key: "work-money",
    label: "Work & Money – AI Job Displacement",
    slug: "work-money-ai-job-displacement",
    order: 1,
    color: "#e63b2e",
    icon: "briefcase",
    description: "Jobs, layoffs, side hustles, and income under AI pressure."
  },
  {
    key: "kids-school",
    label: "Kids & School – AI vs Your Children’s Future",
    slug: "kids-school-ai-vs-your-childrens-future",
    order: 2,
    color: "#f59e0b",
    icon: "school",
    description: "Parenting, K–12, college ROI, and how students use AI."
  },
  {
    key: "love-connection",
    label: "Love, Sex & Connection – AI Relationships & Synthetic Intimacy",
    slug: "love-sex-connection-ai-relationships-synthetic-intimacy",
    order: 3,
    color: "#ec4899",
    icon: "heart",
    description: "AI companions, synthetic intimacy, parasocial bots, and loneliness."
  },
  {
    key: "mind-attention",
    label: "Mind & Attention – Cognitive Erosion & Offloading",
    slug: "mind-attention-cognitive-erosion-offloading",
    order: 4,
    color: "#6366f1",
    icon: "brain",
    description: "Attention, thinking skills, cognitive offloading, and mental habits."
  },
  {
    key: "system-shock",
    label: "System Shock – Soft Extinction & Collapse",
    slug: "system-shock-soft-extinction-collapse",
    order: 5,
    color: "#0ea5e9",
    icon: "alert",
    description: "Collapse scenarios, macro risk, surveillance, and existential drift."
  },
];
