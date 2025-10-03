import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://nexuseng.org",
  // base: "/SUBFOLDER", // Set this for deploying to a subfolder
  integrations: [mdx(), sitemap()],
});