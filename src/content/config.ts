import { defineCollection, z, type CollectionEntry } from 'astro:content';

export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  author: z.string(),
  category: z.string(),
  tags: z.array(z.string()).min(1),
  fear_index_score: z.number().min(0).max(100),
  heroImage: z.string(),
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
