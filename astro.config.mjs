// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { customDarkTheme } from "./src/lib/shiki-theme.ts";

export default defineConfig({
  site: "https://abelitolll.com",

  // Una sola URL por página, sin barra final: `/radio`, no `/radio/`. Los
  // enlaces internos ya salían así; el canonical y el sitemap tenían la barra
  // y Vercel servía las dos, así que Google veía cada página duplicada. Con
  // `format: "file"` sale `radio.html`, y `cleanUrls` en vercel.json la sirve
  // como `/radio` y redirige las otras formas.
  trailingSlash: "never",
  build: { format: "file" },

  integrations: [mdx(), react(), sitemap()],

  vite: { plugins: [tailwindcss()] },
  markdown: { shikiConfig: { theme: customDarkTheme } },
});
