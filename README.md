# nelson-salgado.pt

Landing page do personal trainer Nelson Salgado. É um site estático feito com **Astro 7** e **Tailwind CSS 4**, alojado no **Cloudflare Pages**.

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
| `npm run cf:dev`  | Serve o `dist/` com o runtime do Cloudflare (testa `_headers`, 404) em `127.0.0.1:8788` |
| `npm run cf:deploy` | Build + deploy manual com Wrangler (só se não usares a integração Git) |
| `npm run cf:deploy:preview` | Igual, mas para o URL de pré-visualização `preview.nelson-salgado.pages.dev` |

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

### Deploy automático via Git (recomendado)

O projeto do Pages está ligado ao repositório GitHub `jribeiroDev/nelson-salgado-v2`: **cada push faz build e deploy automaticamente**.

- push para `master` → **produção**
- push para outro branch / pull request → URL de pré-visualização (`<branch>.nelson-salgado.pages.dev`)

Configuração (feita uma vez em *Workers & Pages → Create → Pages → Connect to Git*):

| Campo | Valor |
| --- | --- |
| Production branch | `master` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node | lido de `.node-version` (22) |

O `wrangler.jsonc` define o nome do projeto e a pasta de output; os headers de cache e segurança estão em `public/_headers` (podes validá-los localmente com `npm run cf:dev`).

### Deploy manual com Wrangler (alternativa)

Só para projetos **sem** ligação ao Git (Direct Upload). Atenção: um projeto criado assim não pode depois ser ligado ao Git no painel.

```bash
npx wrangler login
```

```bash
npm run cf:deploy
```

### Domínio

1. No projeto do Pages → **Custom domains**: adicionar `nelson-salgado.pt` e `www.nelson-salgado.pt` (o DNS do domínio tem de estar na Cloudflare, ou criar os CNAME indicados).
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
