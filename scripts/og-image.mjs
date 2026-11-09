// Genera las imagenes que se ven al compartir el sitio (Open Graph / Twitter):
// public/og-image.png (es) y public/og-image-en.png (en), de 1200x630.
//
// Se dibujan en HTML con los mismos tokens del sitio (acento, fondo, rejilla,
// consola, wordmark) y se rasterizan con Edge/Chrome headless. Asi, si el
// diseno del sitio cambia, se corrige aqui y se regenera:
//
//   node scripts/og-image.mjs
//
// Si el navegador no esta en la ruta por defecto: BROWSER=ruta/al/exe
// Necesita red: las fuentes (Saira, JetBrains Mono) vienen de Google Fonts,
// igual que en el sitio.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = join(root, "node_modules", ".cache", "og-image");
mkdirSync(tmp, { recursive: true });

const ACCENT = "#fb6161";

// La mascota original es cian; el sitio tiene un solo acento, asi que se le
// cambia el cian por el acento (solo en esta copia, el SVG publico no se toca).
const rocket = readFileSync(
  join(root, "public/images/abelitolll-rocket.svg"),
  "utf8",
)
  .replaceAll("#2ED8FF", ACCENT)
  .replace(/<title>.*?<\/title>/, "")
  .replace(/<!--.*?-->/g, "")
  .replace(/ width="512" height="512"/, "")
  .replace("<svg ", '<svg class="rocket" ');

const copy = {
  es: {
    lang: "es",
    eyebrow: "Desarrollador de software",
    tagline: "Página personal de Abel Llontop.",
    console: "Abel Llontop · consola",
    lines: [
      ["whoami", "Abel Llontop"],
      ["rol", "Desarrollador de software"],
    ],
    out: "og-image.png",
  },
  en: {
    lang: "en",
    eyebrow: "Software developer",
    tagline: "Personal site of Abel Llontop.",
    console: "Abel Llontop · console",
    lines: [
      ["whoami", "Abel Llontop"],
      ["role", "Software developer"],
    ],
    out: "og-image-en.png",
  },
};

function html(c) {
  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Saira:wght@600;700&family=JetBrains+Mono:wght@400;500;700;800&display=swap" rel="stylesheet" />
<style>
  :root {
    --accent: ${ACCENT};
    --bg: #09090b;
    --hull: #0d1117;
    --line: #1f2430;
    --dim: #a0aabb;
    --faint: #7d889a;
    --go: #5ee6a8;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative;
    background:
      radial-gradient(ellipse 80% 55% at 12% 0%, color-mix(in srgb, var(--accent) 17%, transparent), transparent),
      radial-gradient(ellipse 55% 50% at 100% 100%, color-mix(in srgb, var(--accent) 12%, transparent), transparent),
      linear-gradient(180deg, #0c0c10 0%, var(--bg) 45%, #0a0a0d 100%);
    font-family: "JetBrains Mono", monospace;
    color: #f4f4f5;
  }
  /* rejilla tenue, la misma capa fija del sitio */
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgb(255 255 255 / 0.035) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(255 255 255 / 0.035) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 90% at 50% 45%, #000 35%, transparent 100%);
  }
  .star { position: absolute; border-radius: 50%; background: #fff; }

  .left { position: absolute; left: 72px; top: 0; bottom: 0; width: 640px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-size: 17px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--faint); }
  .word { margin-top: 22px; font-size: 100px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; white-space: nowrap; }
  .word b { color: var(--accent); font-weight: 800; text-shadow: 0 0 38px color-mix(in srgb, var(--accent) 45%, transparent); }
  .tagline { margin-top: 30px; font-family: "Saira", system-ui, sans-serif; font-weight: 600; font-size: 28px; line-height: 1.32; color: #d4d4d8; max-width: 610px; }
  .chips { margin-top: 38px; display: flex; gap: 12px; }
  .chip { font-size: 16px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--dim); border: 1px solid var(--line); border-radius: 999px; padding: 9px 18px; background: rgb(255 255 255 / 0.02); }
  .chip:first-child { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 45%, transparent); background: color-mix(in srgb, var(--accent) 9%, transparent); }

  .panel {
    position: absolute; left: 738px; top: 200px; width: 400px; height: 260px;
    border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--line));
    border-radius: 14px; background: rgb(8 12 19 / 0.9);
    box-shadow: 0 30px 80px -30px rgb(0 0 0 / 0.95), 0 0 90px -30px color-mix(in srgb, var(--accent) 55%, transparent), inset 0 1px 0 rgb(255 255 255 / 0.05);
    overflow: hidden;
  }
  .bar { display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 18px; border-bottom: 1px solid var(--line); }
  .dot { width: 11px; height: 11px; border-radius: 50%; background: #262c38; }
  .dot.go { background: var(--go); box-shadow: 0 0 10px var(--go); }
  .bar span { margin-left: 8px; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--faint); }
  .body { padding: 22px 24px; font-size: 17px; line-height: 1.35; }
  .cmd { color: #f4f4f5; font-weight: 700; }
  .cmd i { font-style: normal; color: var(--accent); margin-right: 10px; }
  .res { color: var(--dim); margin: 5px 0 20px 26px; font-size: 15px; }
  .caret { display: inline-block; width: 10px; height: 20px; background: #f4f4f5; vertical-align: -3px; margin-left: 2px; }

  .rocket { position: absolute; left: 1004px; top: 12px; width: 172px; height: 172px; transform: rotate(6deg); filter: drop-shadow(0 18px 30px rgb(0 0 0 / 0.55)); }
  .url { position: absolute; right: 62px; bottom: 36px; font-size: 18px; letter-spacing: 0.1em; color: var(--faint); }
  .url b { color: var(--accent); font-weight: 700; }
  .rule { position: absolute; left: 0; right: 0; bottom: 0; height: 5px; background: linear-gradient(90deg, var(--accent), transparent 70%); }
</style>
</head>
<body>
  <div class="grid"></div>
  ${[
    [92, 70, 2],
    [210, 540, 2],
    [560, 60, 1.5],
    [660, 580, 2],
    [700, 120, 1.5],
    [1150, 330, 2],
    [1100, 590, 1.5],
    [330, 30, 1.5],
    [40, 330, 1.5],
    [900, 40, 1.5],
  ]
    .map(
      ([x, y, s]) =>
        `<i class="star" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;opacity:.55"></i>`,
    )
    .join("")}

  <div class="left">
    <div class="eyebrow">${c.eyebrow}</div>
    <div class="word">abe<b>l</b>ito<b>lll</b></div>
    <div class="tagline">${c.tagline}</div>
  </div>

  <div class="panel">
    <div class="bar"><i class="dot go"></i><i class="dot"></i><i class="dot"></i><span>${c.console}</span></div>
    <div class="body">
      ${c.lines.map(([cmd, res]) => `<div class="cmd"><i>&gt;</i>${cmd}</div><div class="res">${res}</div>`).join("")}
      <div class="cmd"><i>&gt;</i><span class="caret"></span></div>
    </div>
  </div>

  ${rocket}
  <div class="url">abelitolll<b>.</b>com</div>
  <div class="rule"></div>
</body>
</html>`;
}

const candidates = [
  process.env.BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error("No encontre Edge ni Chrome. Define BROWSER=ruta/al/exe");
  process.exit(1);
}

for (const c of Object.values(copy)) {
  const file = join(tmp, `${c.lang}.html`);
  const out = join(root, "public", c.out);
  writeFileSync(file, html(c));
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=15000",
    `--screenshot=${out}`,
    `file:///${file.replaceAll("\\", "/")}`,
  ]);
  console.log("ok", out);
}
