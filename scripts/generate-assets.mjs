// Gera os ícones PNG e a imagem Open Graph (1200×630) em /public.
// Uso: node scripts/generate-assets.mjs
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const pub = new URL('../public/', import.meta.url);
const heroDir = new URL('../src/assets/hero/', import.meta.url);

// Ícones a partir do favicon.svg
const svg = await readFile(new URL('favicon.svg', pub));
for (const [file, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await sharp(svg, { density: 600 }).resize(size, size).png().toFile(fileURLToPath(new URL(file, pub)));
}

// Imagem OG: colagem das 4 fotos do hero + overlay + texto
const W = 1200;
const H = 630;
const tiles = await Promise.all(
  ['hero-1.jpeg', 'hero-2.jpeg', 'hero-3.jpeg', 'hero-4.jpeg'].map((f, i) =>
    sharp(fileURLToPath(new URL(f, heroDir)))
      .resize(W / 4, H, { fit: 'cover', position: 'attention' })
      .toBuffer()
      .then((input) => ({ input, left: (W / 4) * i, top: 0 })),
  ),
);

const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#1f2f3f" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
    <text x="600" y="250" font-size="30" font-weight="700" letter-spacing="6" fill="#c9a44d">PERSONAL TRAINER</text>
    <text x="600" y="345" font-size="96" font-weight="800" fill="#ffffff">Nelson Salgado</text>
    <text x="600" y="420" font-size="34" fill="#f7f3ed">Programas de treino personalizados · Resultados em 90 dias</text>
    <text x="600" y="540" font-size="26" font-weight="700" fill="#c9a44d">nelson-salgado.pt</text>
  </g>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 3, background: '#1f2f3f' } })
  .composite([...tiles, { input: overlay, left: 0, top: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(fileURLToPath(new URL('og-image.jpg', pub)));

console.log('Ícones e og-image.jpg gerados.');
