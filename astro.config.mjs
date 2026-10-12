// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nelson-salgado.pt',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    // Página única: CSS pequeno inline = zero pedidos bloqueantes.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
