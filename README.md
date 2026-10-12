# nelson-salgado.pt

Landing page do personal trainer Nelson Salgado. É um site estático feito com **Astro 7** e **Tailwind CSS 4**, alojado na **Cloudflare** (Workers com static assets).

- Todo o conteúdo vem no HTML (ótimo para SEO), incluindo os detalhes dos programas, que abrem num `<dialog>` nativo. Não há framework JS: só ~3 KB de scripts inline (diálogo do WhatsApp, header e carrossel).
- A fonte é a **Plus Jakarta Sans** variável, self-hosted (1 ficheiro de 27 KB com preload). O Astro gera um fallback com métricas ajustadas.
- Testemunhos em marquee só com CSS: pausa ao passar o rato e, com "reduzir movimento" ativo, fica parado e deslizável.
- As imagens saem em AVIF/WebP responsivo, geradas no build. O CSS vai inline, por isso não há pedidos bloqueantes.
- Lighthouse (local): desktop 100/100/100/100; mobile 92–100 em performance (mediana ~99) e 100 nas restantes. Peso total ≈ 120 KB.

## Comandos

| Comando           | O que faz                                       |
| ----------------- | ----------------------------------------------- |
| `npm install`     | Instala as dependências                         |
| `npm run dev`     | Servidor de desenvolvimento em `localhost:4321` |
| `npm run build`   | Gera o site em `dist/`                          |
| `npm run preview` | Serve o `dist/` localmente                      |
| `npm run check`   | Valida os tipos e os schemas dos conteúdos      |
| `npm run assets`  | Gera de novo os ícones PNG e o `og-image.jpg`   |
| `npm run cf:dev`  | Serve o `dist/` com o runtime da Cloudflare (testa `_headers`, 404) em `127.0.0.1:8788` |
| `npm run cf:deploy` | Build + deploy manual para produção com Wrangler |
| `npm run cf:deploy:preview` | Build + upload de uma versão de pré-visualização (não afeta produção) |

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

## Deploy na Cloudflare (Workers com static assets)

O site é publicado como um **Worker só com ficheiros estáticos** (o modelo que a Cloudflare recomenda para sites novos, sucessor do Pages). Não há código de servidor: o Worker serve o conteúdo de `dist/`.

### Deploy automático via Git

O Worker está ligado ao repositório GitHub `jribeiroDev/nelson-salgado-v2` (Workers Builds): **cada push para `master` faz build e deploy em produção**.

| Campo (painel → Worker → Settings → Build) | Valor |
| --- | --- |
| Branch de produção | `master` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node | lido de `.node-version` (22) |

O `wrangler.jsonc` define o Worker:

- `name`: tem de ser **igual ao nome do Worker no painel** (`nelson-salgado-v2`)
- `assets.directory: ./dist`: a pasta gerada pelo build
- `not_found_handling: 404-page`: endereços inexistentes mostram `404.html` com status 404
- `public/_headers`: headers de cache e segurança, aplicados pela Cloudflare

Para testar localmente com o mesmo runtime: `npm run build && npm run cf:dev` (abre em `http://127.0.0.1:8788`).

### Deploy manual (alternativa)

```bash
npx wrangler login
```

```bash
npm run cf:deploy
```

`npm run cf:deploy:preview` publica uma versão de pré-visualização (URL próprio) sem mexer em produção.

### Domínio

1. No Worker → **Settings → Domains & Routes → Add → Custom domain**: adicionar `nelson-salgado.pt` e `www.nelson-salgado.pt` (o DNS do domínio tem de estar na Cloudflare, ou criar os CNAME indicados).
2. **Redirect `www` → domínio principal** (canónico): *Rules → Redirect Rules → Create*
   - Quando: `Hostname equals www.nelson-salgado.pt`
   - Então: Dynamic redirect `concat("https://nelson-salgado.pt", http.request.uri.path)`, código **301**, manter a query string.
3. Em *Speed → Optimization*, deixar o **Rocket Loader desligado**: injeta JS e não traz benefício aqui.

Os ficheiros com hash em `/_astro/*` (imagens, fonte) ficam em cache para sempre; o HTML revalida em cada deploy, por isso as alterações aparecem logo.

## Depois de publicar (SEO)

- [ ] Retirar o site antigo do Vercel, ou pôr `nelson-salgado.vercel.app` a fazer redirect 301 para `https://nelson-salgado.pt`, para evitar conteúdo duplicado.
- [ ] Desligar o *Attack Challenge Mode* / bot protection do Vercel enquanto o domínio lá estiver: devolve 429 a crawlers e a pré-visualizações de partilha.
- [ ] Google Search Console: verificar o domínio e submeter `https://nelson-salgado.pt/sitemap-index.xml`.
- [ ] Bing Webmaster Tools: importar a partir do Search Console.
- [ ] Validar os dados estruturados em <https://search.google.com/test/rich-results> e <https://validator.schema.org>.
- [ ] Testar a pré-visualização de partilha (WhatsApp/Facebook) com o Sharing Debugger do Facebook.
- [ ] Medir no PageSpeed Insights com o URL de produção.
