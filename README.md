# nelson-salgado.pt

Landing page do personal trainer Nelson Salgado. É um site estático feito com **Astro 7** e **Tailwind CSS 4**, alojado no **Cloudflare Pages**.

- Todo o conteúdo vem no HTML (ótimo para SEO). Não há framework JS: o único JavaScript é um script inline de ~2 KB (diálogo do WhatsApp e setas dos carrosséis).
- As imagens saem em AVIF/WebP responsivo, geradas no build.
- O CSS vai inline, por isso não há pedidos bloqueantes.
- Lighthouse (local): desktop 100/100/100/100; mobile 95–100 em performance e 100 nas restantes. Peso total ≈ 85 KB.

## Comandos

| Comando           | O que faz                                       |
| ----------------- | ----------------------------------------------- |
| `npm install`     | Instala as dependências                         |
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
public/                # robots.txt, _headers, ícones, og-image.jpg
```

## Deploy no Cloudflare Pages

1. Pôr o repositório no GitHub/GitLab.
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** e escolher o repositório.
3. Configuração do build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variável de ambiente: `NODE_VERSION = 22`
4. **Custom domains**: adicionar `nelson-salgado.pt` e `www.nelson-salgado.pt`.
5. **Redirect `www` → apex** (domínio canónico): *Rules → Redirect Rules → Create*
   - Quando: `Hostname equals www.nelson-salgado.pt`
   - Então: Dynamic redirect `concat("https://nelson-salgado.pt", http.request.uri.path)`, código **301**, manter a query string.
6. Em *Speed → Optimization*, deixar o **Rocket Loader desligado**: injeta JS e não traz benefício aqui.

Os headers de cache e de segurança estão em `public/_headers`. Os ficheiros com hash em `/_astro/*` ficam em cache para sempre e o HTML revalida em cada deploy.

## Depois de publicar (SEO)

- [ ] Retirar o site antigo do Vercel, ou pôr `nelson-salgado.vercel.app` a fazer redirect 301 para `https://nelson-salgado.pt`, para evitar conteúdo duplicado.
- [ ] Desligar o *Attack Challenge Mode* / bot protection do Vercel enquanto o domínio lá estiver: devolve 429 a crawlers e a pré-visualizações de partilha.
- [ ] Google Search Console: verificar o domínio e submeter `https://nelson-salgado.pt/sitemap-index.xml`.
- [ ] Bing Webmaster Tools: importar a partir do Search Console.
- [ ] Validar os dados estruturados em <https://search.google.com/test/rich-results> e <https://validator.schema.org>.
- [ ] Testar a pré-visualização de partilha (WhatsApp/Facebook) com o Sharing Debugger do Facebook.
- [ ] Medir no PageSpeed Insights com o URL de produção.
