// Script de autor, no forma parte de `npm run build`. Regenerar con
// `node scripts/generate-og-image.mjs` si cambia el wordmark o el acento.
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const ACCENT = "#61dafb";
const BG = "#09090b";

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}" />
  <rect x="0" y="600" width="1200" height="30" fill="${ACCENT}" />
  <text x="600" y="330" font-family="JetBrains Mono, monospace" font-size="96"
        fill="#f4f4f5" text-anchor="middle" font-weight="700">abelitolll</text>
  <text x="600" y="400" font-family="JetBrains Mono, monospace" font-size="32"
        fill="${ACCENT}" text-anchor="middle">Software Engineer</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(fileURLToPath(new URL("../public/og-image.png", import.meta.url)));

console.log("og-image.png generado en public/");
