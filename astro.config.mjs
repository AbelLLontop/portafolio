// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { customDarkTheme } from "./src/lib/shiki-theme.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://abelitolll.com",
  integrations: [mdx(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: customDarkTheme,
    },
  },
});
