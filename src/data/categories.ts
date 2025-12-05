// src/data/categories.ts
// Single source of truth for all Fear Index categories

export interface Category {
  name: string;
  slug: string;
  color: string;
  icon: string;
  description?: string;
}

export const categories: Category[] = [
  {
    name: "Work & Money – AI Job Displacement",
    slug: "work-and-money-ai-job-displacement",
    color: "#e63b2e",
    icon: "briefcase",
    description: "Jobs, layoffs, side hustles, and income under AI pressure."
  },
  {
    name: "Kids & School – AI vs Your Children’s Future",
    slug: "kids-and-school-ai-vs-your-childrens-future",
    color: "#f59e0b",
    icon: "school",
    description: "Parenting, K–12, college ROI, and how students use AI."
  },
  {
    name: "Love, Sex & Connection – AI Relationships & Synthetic Intimacy",
    slug: "love-sex-and-connection-ai-relationships-synthetic-intimacy",
    color: "#ec4899",
    icon: "heart",
    description: "AI companions, synthetic intimacy, parasocial bots, and loneliness."
  },
  {
    name: "Mind & Attention – Cognitive Erosion & Offloading",
    slug: "mind-and-attention-cognitive-erosion-offloading",
    color: "#6366f1",
    icon: "brain",
    description: "Attention, thinking skills, cognitive offloading, and mental habits."
  },
  {
    name: "System Shock – Soft Extinction & Collapse",
    slug: "system-shock-soft-extinction-and-collapse",
    color: "#0ea5e9",
    icon: "alert",
    description: "Collapse scenarios, macro risk, surveillance, and existential drift."
  },
];
