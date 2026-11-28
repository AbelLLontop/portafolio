// Genera la imagen que se ve al compartir el sitio (Open Graph / Twitter):
// public/og-image.png, de 1200x630.
//
// Se dibuja en HTML con los mismos tokens del sitio (el papel, la tinta, el
// cuadro rojo, Archivo e IBM Plex Mono) y se rasteriza con Edge/Chrome
// headless. Si el diseño del sitio cambia, se corrige aquí y se regenera:
//
//   node scripts/og-image.mjs
//
// Si el navegador no está en la ruta por defecto: BROWSER=ruta/al/exe
// Necesita red: las fuentes vienen de Google Fonts, igual que en el sitio.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = join(root, "node_modules", ".cache", "og-image");
mkdirSync(tmp, { recursive: true });

const squares = Array.from(
  { length: 25 },
  (_, i) => `<i${i === 12 ? ' class="me"' : ""}></i>`,
).join("");

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #0c0c0e; font-family: Archivo, sans-serif;
    display: grid; grid-template-columns: 1fr 380px; gap: 16px; padding: 16px; }
  .paper { position: relative; background: #ebe6db; color: #18171a; border-radius: 18px; padding: 52px 56px; display: flex; flex-direction: column; }
  .kicker { font-family: "IBM Plex Mono", monospace; font-size: 17px; letter-spacing: .12em; text-transform: uppercase; color: #6f6b63; }
  h1 { margin-top: 26px; font-size: 150px; font-weight: 850; line-height: .84; letter-spacing: -.045em; text-transform: uppercase; font-variation-settings: "wdth" 62; }
  h1 span { color: #d8382a; }
  .lyr { margin-top: auto; font-size: 34px; font-weight: 800; letter-spacing: -.025em; line-height: 1.2; }
  .lyr .past { color: rgba(24,23,26,.45); }
  .lyr .now { color: #18171a; }
  .lyr .now b { color: #d8382a; font-weight: 800; }
  .art { position: absolute; right: 56px; top: 52px; width: 120px; height: 120px; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); gap: 9%; }
  .art i { background: rgba(24,23,26,.42); }
  .art i.me { background: #d8382a; transform: rotate(-9deg) scale(1.08); }
  .night { border-radius: 18px; background: #110d18; color: #f3ead7; padding: 34px 30px; display: flex; flex-direction: column; }
  .night .kicker { color: #ffb347; font-size: 14px; }
  .night h2 { margin-top: 14px; font-size: 44px; font-weight: 850; line-height: .95; letter-spacing: -.035em; font-variation-settings: "wdth" 72; text-transform: uppercase; }
  .tracks { margin-top: 24px; border-top: 1px solid rgba(255,255,255,.12); }
  .tracks div { display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.08); font-size: 18px; }
  .tracks div.on { color: #ffb347; }
  .tracks small { font-family: "IBM Plex Mono", monospace; font-size: 14px; color: rgba(255,255,255,.45); }
  .bar { margin-top: auto; display: flex; align-items: flex-end; gap: 4px; height: 34px; }
  .bar i { flex: 1; background: #2a2a30; border-radius: 1px; }
  .bar i.on { background: #f3ead7; }
  .site { margin-top: 16px; font-family: "IBM Plex Mono", monospace; font-size: 16px; color: rgba(255,255,255,.6); }
</style>
</head>
<body>
  <section class="paper">
    <p class="kicker">abelitolll · desarrollador de software</p>
    <h1>Abel<br /><span>Llontop</span></h1>
    <div class="art">${squares}</div>
    <p class="lyr">
      <span class="past">Soy desarrollador de software.</span><br />
      <span class="now">Trabajo junto a <b>Claude</b>.</span>
    </p>
  </section>
  <section class="night">
    <p class="kicker">Radio abelitolll</p>
    <h2>Proyectos y experimentos</h2>
    <div class="tracks">
      <div class="on">Quién soy <small>intro</small></div>
      <div>abelitolll.com <small>proyecto</small></div>
      <div>Los Vecinos de Enfrente <small>experimento</small></div>
    </div>
    <div class="bar">${Array.from(
      { length: 30 },
      (_, i) =>
        `<i class="${i < 11 ? "on" : ""}" style="height:${(28 + Math.abs(Math.sin(i * 1.9)) * 72).toFixed(1)}%"></i>`,
    ).join("")}</div>
    <p class="site">abelitolll.com</p>
  </section>
</body>
</html>`;

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

const file = join(tmp, "og.html");
const out = join(root, "public", "og-image.png");
writeFileSync(file, html);
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
