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
