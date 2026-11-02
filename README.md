# nelson-salgado.pt

Landing page do personal trainer Nelson Salgado. É um site estático feito com **Astro 7** e **Tailwind CSS 4**, preparado para alojamento na **Vercel**.

- Todo o conteúdo vem no HTML (ótimo para SEO), incluindo os detalhes dos programas, que abrem num `<dialog>` nativo. Não há framework JS: só ~3 KB de scripts inline (diálogo do WhatsApp, header e carrossel).
- A fonte é a **Plus Jakarta Sans** variável, self-hosted (1 ficheiro de 27 KB com preload). O Astro gera um fallback com métricas ajustadas.
- Testemunhos em movimento automático e infinito, repetindo os cartões sem saltos e sem botão. Esta secção mantém a animação mesmo com "reduzir movimento" ativo.
- As imagens saem em AVIF/WebP responsivo, geradas no build. O CSS vai inline, por isso não há pedidos bloqueantes.
- Lighthouse (local): desktop 100/100/100/100; mobile 92–100 em performance (mediana ~99) e 100 nas restantes. Peso total ≈ 120 KB.

## Comandos

| Comando           | O que faz                                       |
| ----------------- | ----------------------------------------------- |
| `npm ci`          | Instala as versões do lockfile (Node.js 22)      |
| `npm run dev`     | Servidor de desenvolvimento em `localhost:4321` |
| `npm run build`   | Gera o site em `dist/`                          |
| `npm run preview` | Serve o `dist/` localmente                      |
| `npm run check`   | Valida os tipos e os schemas dos conteúdos      |
| `npm run assets`  | Gera de novo os ícones PNG e o `og-image.jpg`   |

## Editar conteúdos

Os conteúdos estão em `src/content/`. O build é validado por schema (`src/content.config.ts`), por isso um campo em falta ou com o tipo errado faz o build falhar com uma mensagem clara.

| Ficheiro            | Conteúdo                                                        |
| ------------------- | --------------------------------------------------------------- |
| `site.json`         | Título/descrição SEO, WhatsApp, Instagram, textos do hero, stats |
| `plans.json`        | Planos e preços (`popular: true` destaca o plano)               |
| `programs.json`     | Programas: metadados, descrição, imagem e o que inclui          |
| `testimonials.json` | Testemunhos (foto em `src/assets/testimonials/`)                |
| `faq.json`          | Perguntas frequentes (também geram o JSON-LD `FAQPage`)         |

As imagens ficam em `src/assets/` e o caminho é relativo ao JSON (ex.: `"../assets/programs/programa-forca.jpeg"`). Não é preciso otimizá-las à mão, o build trata disso.

## Estrutura

```
src/
├─ content/            # conteúdos (JSON)
├─ content.config.ts   # schemas das collections
├─ assets/             # imagens originais (processadas no build)
├─ components/         # secções da página + SEO/JSON-LD
├─ layouts/Base.astro  # <head>, meta tags, JSON-LD
├─ lib/whatsapp.ts     # mensagens/links do WhatsApp
├─ styles/global.css   # Tailwind + tokens da marca
└─ pages/              # index.astro e 404.astro
public/                # robots.txt, ícones, og-image.jpg
vercel.json            # build e headers de cache/segurança na Vercel
```

## Deploy na Vercel

O site é publicado como ficheiros estáticos a partir de `dist/`. Não precisa de adaptador `@astrojs/vercel`, funções de servidor ou variáveis de ambiente. Ver a [documentação de Astro na Vercel](https://vercel.com/docs/frameworks/frontend/astro).

### Deploy automático via Git

1. Na Vercel, escolher **Add New → Project** e importar `jribeiroDev/nelson-salgado-v2`.
2. Confirmar os valores abaixo e publicar com **Deploy**. O `vercel.json` define o preset, os comandos de instalação/build e a pasta de saída; o `package.json` fixa o Node.js 22.
3. Em **Settings → Git**, confirmar `master` como branch de produção. Depois de ligado, cada push para essa branch publica em produção; outras branches e pull requests geram previews.

| Campo | Valor |
| --- | --- |
| Branch de produção | `master` |
| Root Directory | raiz do repositório (`./`) |
| Framework Preset | `Astro` |
| Install Command | `npm ci` |
| Build command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | `22.x` |

O `vercel.json` preserva os headers de segurança e cache do site. Os ficheiros com hash em `/_astro/*` ficam em cache durante um ano; o HTML revalida. `cleanUrls` remove a extensão `.html` dos endereços. O `dist/404.html`, gerado pelo Astro, é a página para endereços inexistentes (status 404).

Para validar localmente: `npm run check`, `npm run build` e `npm run preview`. O preview do Astro serve o site, mas os headers definidos em `vercel.json` devem ser confirmados num deployment da Vercel.

### Deploy manual (alternativa)

```bash
npx vercel
```

```bash
npx vercel --prod
```

No primeiro comando, iniciar sessão e ligar ao projeto da Vercel. `npx vercel` cria um preview; `npx vercel --prod` publica em produção.

### Domínio

1. Em **Settings → Domains**, adicionar `nelson-salgado.pt` e `www.nelson-salgado.pt`.
2. Configurar `www.nelson-salgado.pt` para redirecionar permanentemente para `https://nelson-salgado.pt`, mantendo o caminho e a query string.
3. No fornecedor de DNS, aplicar os registos indicados pela Vercel. Se o DNS continuar na Cloudflare, remover as rotas/custom domains do Worker antigo que intercetem estes endereços e usar os registos indicados pela Vercel com proxy desligado (**DNS only**).
4. Confirmar HTTPS, a página inicial e um endereço inexistente antes de desativar o alojamento antigo. Desligar também o build automático do Worker para evitar novos deploys na Cloudflare.

O domínio canónico continua definido como `https://nelson-salgado.pt` em `astro.config.mjs` (SEO, partilhas e sitemap).

## Depois de publicar (SEO)

- [ ] Confirmar o redirecionamento de `www` para o domínio principal e o status 404 para endereços inexistentes.
- [ ] Confirmar que as definições de proteção da Vercel permitem o acesso público à produção e aos crawlers/pré-visualizações de partilha.
- [ ] Google Search Console: verificar o domínio e submeter `https://nelson-salgado.pt/sitemap-index.xml`.
- [ ] Bing Webmaster Tools: importar a partir do Search Console.
- [ ] Validar os dados estruturados em <https://search.google.com/test/rich-results> e <https://validator.schema.org>.
- [ ] Testar a pré-visualização de partilha (WhatsApp/Facebook) com o Sharing Debugger do Facebook.
- [ ] Medir no PageSpeed Insights com o URL de produção.
