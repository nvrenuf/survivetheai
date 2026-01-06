import { defineCollection, z, type CollectionEntry } from 'astro:content';

export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  author: z.string(),
  draft: z.boolean().optional(),
  featured: z.boolean().optional(),
  evergreen: z.boolean().optional(),
  category: z.string().optional(),
  topics: z.array(
    z.enum([
      'work-money',
      'kids-school',
      'love-connection',
      'mind-attention',
      'system-shock',
    ]),
  ),
  pillar: z
    .enum([
      'work-money',
      'kids-school',
      'love-connection',
      'mind-attention',
      'system-shock',
    ])
    .optional(),
  related: z.array(z.string()).optional(),
  tags: z.array(z.string()).min(1),
  impact_score: z.number().min(0).max(100),
  heroImage: z.string(),
  heroImageThumb: z.string().optional(),
  heroImageAlt: z.string().optional(),
  affiliate_offer: z.object({
    label: z.string(),
    url: z.string().url(),
    description: z.string().optional(),
  }),
  canonicalUrl: z.string().url(),
});

const postsCollection = defineCollection({
  type: 'content',
  schema: postSchema,
});

export type PostFrontmatter = z.infer<typeof postSchema>;
export type PostEntry = CollectionEntry<'posts'>;

export const collections = {
  posts: postsCollection,
};
