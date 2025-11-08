import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import remarkGfm from 'remark-gfm';
import { rehypeSlug, rehypeAutolinkHeadings } from './src/lib/rehype/slugAutolink.mjs';

export default defineConfig({
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    }),
    react(),
  ],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
    ],
  },
});
