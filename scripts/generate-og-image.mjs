// Script de autor, no forma parte de `npm run build`. Regenerar con
// `node scripts/generate-og-image.mjs` si cambia el wordmark, el acento o el logo.
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ACCENT = "#61dafb";
const GLITCH_MAGENTA = "#ff3b6b";
const BG = "#09090b";

const rocketSvgPath = fileURLToPath(
  new URL("../public/images/abelitolll-rocket.svg", import.meta.url),
);
const rocketPaths = readFileSync(rocketSvgPath, "utf-8")
  .split("\n")
  .filter((line) => line.trim().startsWith("<path"))
  .join("\n");

const WORDMARK = "abelitolll";
const WORDMARK_X = 80;
const WORDMARK_Y = 300;

function wordmarkSpans(color, accentColor) {
  return [...WORDMARK]
    .map(
      (char) =>
        `<tspan fill="${char === "l" ? accentColor : color}">${char}</tspan>`,
    )
    .join("");
}

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}" />
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.4" fill="#ffffff" opacity="0.05" />
  </pattern>
  <rect width="1200" height="630" fill="url(#dots)" />

  <text x="${WORDMARK_X - 2}" y="${WORDMARK_Y - 2}" font-family="JetBrains Mono, monospace"
        font-size="96" font-weight="700" opacity="0.5">${wordmarkSpans(GLITCH_MAGENTA, GLITCH_MAGENTA)}</text>
  <text x="${WORDMARK_X + 2}" y="${WORDMARK_Y + 2}" font-family="JetBrains Mono, monospace"
        font-size="96" font-weight="700" opacity="0.5">${wordmarkSpans(ACCENT, ACCENT)}</text>
  <text x="${WORDMARK_X}" y="${WORDMARK_Y}" font-family="JetBrains Mono, monospace"
        font-size="96" font-weight="700">${wordmarkSpans("#f4f4f5", ACCENT)}</text>

  <text x="${WORDMARK_X}" y="${WORDMARK_Y + 60}" font-family="JetBrains Mono, monospace"
        font-size="30" fill="${ACCENT}">Desarrollador de software</text>
  <text x="${WORDMARK_X}" y="${WORDMARK_Y + 100}" font-family="JetBrains Mono, monospace"
        font-size="24" fill="#a1a1aa">Blog personal y portafolio</text>

  <svg x="770" y="115" width="400" height="400" viewBox="165 -1 1379 1379">
    ${rocketPaths}
  </svg>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(fileURLToPath(new URL("../public/og-image.png", import.meta.url)));

console.log("og-image.png generado en public/");
