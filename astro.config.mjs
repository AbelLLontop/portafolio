// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { customDarkTheme } from "./src/lib/shiki-theme.ts";

export default defineConfig({
  site: "https://abelitolll.com",

  // `prefixDefaultLocale: false` deja el espaniol en la raiz (/, /blog) y el
  // ingles bajo /en/. Asi ninguna URL ya publicada cambia: no hacen falta
  // redirects ni se pierde lo indexado.
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    mdx(),
    react(),
    // Con `i18n`, el sitemap agrega los <xhtml:link rel="alternate"> entre las
    // dos versiones de cada pagina, ademas de los hreflang del <head>.
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-PE", en: "en-US" },
      },
    }),
  ],

  vite: { plugins: [tailwindcss()] },
  markdown: { shikiConfig: { theme: customDarkTheme } },
});
