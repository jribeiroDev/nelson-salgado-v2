// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
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
  fonts: [
    {
      // Fonte variável self-hosted (1 ficheiro latin, ~27 KB, todos os pesos).
      // O Astro gera um fallback com métricas ajustadas para evitar layout shift.
      provider: fontProviders.local(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            weight: '200 800',
            style: 'normal',
            src: ['@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2'],
          },
        ],
      },
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
