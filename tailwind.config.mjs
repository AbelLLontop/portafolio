/** @type {import('tailwindcss').Config} */
// Casi todo el diseño vive en clases propias de global.css (el sitio es una
// ventana con piezas a medida, no una página de utilidades). Tailwind queda
// para lo puntual, con las mismas familias y tokens que el CSS.
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "var(--red)",
        ink: "var(--ink)",
        dim: "var(--dim)",
        faint: "var(--faint)",
      },
      fontFamily: {
        display: ["Archivo", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
};
