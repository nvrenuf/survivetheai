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
    name: "AI Job Displacement",
    slug: "job-displacement",
    color: "#e53e3e",
    icon: "briefcase",
    description: "Losing jobs to automation and AI systems."
  },
  {
    name: "Gig Collapse",
    slug: "gig-collapse",
    color: "#3182ce",
    icon: "car",
    description: "Instability in gig and freelance work due to AI."
  },
  {
    name: "Cognitive Erosion",
    slug: "cognitive-erosion",
    color: "#805ad5",
    icon: "brain",
    description: "Decline in human skills and thinking from AI reliance."
  },
  {
    name: "Soft Extinction",
    slug: "soft-extinction",
    color: "#718096",
    icon: "ghost",
    description: "Gradual loss of human relevance and agency."
  },
  {
    name: "AI Companionship",
    slug: "ai-companionship",
    color: "#f6ad55",
    icon: "robot",
    description: "Replacing human relationships with AI."
  },
  // Add more categories as needed
];
