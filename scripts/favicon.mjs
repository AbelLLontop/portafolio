// Genera los íconos del sitio a partir de la marca: el cuadro rojo inclinado
// (el mismo de `.mt-brand i`) sobre el fondo oscuro de la ventana.
//
//   node scripts/favicon.mjs
//
// Escribe public/favicon.svg, public/favicon.ico (16, 32 y 48 px) y
// public/apple-touch-icon.png (180 px). El logo 5×5 no se usa acá: a 16 px los
// 25 cuadros se ven como una mancha gris; el cuadro rojo solo se reconoce.

import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");

// Los tokens del sitio: --red y el fondo de la ventana (theme-color).
const RED = "#d8382a";
const BG = "#0c0c0e";

/** El ícono en un lienzo de 64×64. `rounded` redondea el fondo (pestañas). */
function svg({ rounded }) {
  const radius = rounded ? 14 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <title>abelitolll</title>
  <rect width="64" height="64" rx="${radius}" fill="${BG}"/>
  <rect x="17" y="17" width="30" height="30" fill="${RED}" transform="rotate(-9 32 32)"/>
</svg>
`;
}

/** Un .ico con PNG adentro (lo aceptan todos los navegadores actuales). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const png = (source, size) =>
  sharp(Buffer.from(source), { density: (72 * size) / 64 })
    .resize(size, size)
    .png()
    .toBuffer();

const tab = svg({ rounded: true });
writeFileSync(join(pub, "favicon.svg"), tab);

const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map(async (size) => ({ size, data: await png(tab, size) })),
);
writeFileSync(join(pub, "favicon.ico"), ico(images));

// iOS redondea las esquinas por su cuenta: el fondo va entero.
writeFileSync(
  join(pub, "apple-touch-icon.png"),
  await png(svg({ rounded: false }), 180),
);

console.log("Íconos generados en public/");
