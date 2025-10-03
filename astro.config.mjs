import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nexuseng.org',
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
});
