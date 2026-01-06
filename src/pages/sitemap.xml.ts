import { getCollection } from 'astro:content';
import { buildSections, sortPosts, SURVIVAL_LIBRARY_PAGE_SIZE } from '../utils/postSections';
import { TOPIC_CATEGORIES } from '../data/categories';

export const prerender = true;

export async function GET({ site }: { site: URL | undefined }) {
  const base = (site ?? new URL('https://survivetheai.com')).toString().replace(/\/$/, '');
  const allPosts = await getCollection('posts');
  const { remaining } = buildSections(allPosts);
  const libraryPosts = sortPosts(remaining);
  const publishedPosts = sortPosts(allPosts).filter((post) => !post.data.draft);
  const totalPages = Math.max(1, Math.ceil(libraryPosts.length / SURVIVAL_LIBRARY_PAGE_SIZE));

  const urls: string[] = [];
  const staticPaths = ['/', '/posts/', '/quiz/', '/blog/'];
  for (const path of staticPaths) {
    urls.push(renderUrl(base, path));
  }

  for (const category of TOPIC_CATEGORIES) {
    urls.push(renderUrl(base, `/category/${category.key}/`));
  }

  for (let page = 2; page <= totalPages; page += 1) {
    urls.push(renderUrl(base, `/posts/page/${page}/`));
  }

  for (const post of publishedPosts) {
    urls.push(renderUrl(base, `/posts/${post.slug}/`, post.data.date));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

function renderUrl(base: string, path: string, lastmod?: Date) {
  const url = new URL(path, base).toString();
  return `<url><loc>${url}</loc>${lastmod ? `<lastmod>${lastmod.toISOString()}` : ''}${lastmod ? '</lastmod>' : ''}</url>`;
}
