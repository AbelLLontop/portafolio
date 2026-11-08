/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: "var(--color-accent)",
        line: "var(--line)",
        hull: "var(--hull)",
        dim: "var(--dim)",
        faint: "var(--faint)",
        go: "var(--go)",
      },
      // Escala tipográfica del sitio. Antes había nueve tamaños y nueve
      // espaciados de letra casi iguales (0.6, 0.63, 0.68, 0.7, 0.72, 0.78,
      // 0.8, 0.84rem…): se distinguían por décimas de píxel y daban sensación de
      // desorden. Ahora cada rol tiene UN valor con nombre.
      //
      //   Tamaños mono:  text-micro  etiquetas, chips, metadatos (0.68rem)
      //                  text-ui     navegación, botones, pie (0.8rem)
      //   Espaciado:     tracking-eyebrow  etiqueta de sección y antetítulo
      //                  tracking-label    resto de etiquetas en mayúsculas
      //                  tracking-ui       mono en minúsculas (UI, fechas)
      //
      // Los párrafos usan la escala de Tailwind (sm/base/lg) y los titulares
      // Saira 2xl-5xl; no se inventan tamaños sueltos entre medias.
      fontSize: {
        micro: "0.68rem",
        ui: "0.8rem",
      },
      letterSpacing: {
        eyebrow: "0.3em",
        label: "0.18em",
        ui: "0.06em",
      },
      fontFamily: {
        display: ["Saira", "system-ui", "sans-serif"],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
    },
  },
};
