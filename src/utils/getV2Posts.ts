import { getCollection } from 'astro:content';
import type { PostEntry } from '../content/config';

/**
 * Retrieve all V2 posts sorted from newest to oldest.
 * Keeping this logic centralized ensures any future filtering (e.g., publishing states)
 * stays consistent across list and detail routes.
 */
export async function getV2Posts(): Promise<PostEntry[]> {
  const posts = await getCollection('posts');
  return posts
    .filter((post) => post.data.version === 2)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
