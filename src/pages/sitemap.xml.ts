import { getCollection } from 'astro:content';
import { sortPosts } from '../utils/postSections';

export const prerender = true;

const PAGE_SIZE = 6;

export async function GET({ site }: { site: URL | undefined }) {
  const base = (site ?? new URL('https://survivetheai.com')).toString().replace(/\/$/, '');
  const posts = sortPosts(await getCollection('posts')).filter((post) => !post.data.draft);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  const urls: string[] = [];
  const staticPaths = ['/', '/posts/', '/drops/', '/quiz/', '/blog/'];
  for (const path of staticPaths) {
    urls.push(renderUrl(base, path));
  }

  for (let page = 2; page <= totalPages; page += 1) {
    urls.push(renderUrl(base, `/posts/page/${page}/`));
  }

  for (const post of posts) {
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
