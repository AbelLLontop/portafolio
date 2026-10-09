import type { ThemeRegistrationRaw } from "shiki";

// Tema Shiki dark a medida, reusando la paleta zinc/accent del sitio.
export const customDarkTheme: ThemeRegistrationRaw = {
  name: "sistemas-dark",
  type: "dark",
  colors: {
    "editor.background": "#09090b", // zinc-950
    "editor.foreground": "#f4f4f5", // zinc-100
  },
  settings: [
    {
      settings: {
        background: "#09090b", // zinc-950
        foreground: "#f4f4f5", // zinc-100
      },
    },
    {
      scope: ["comment"],
      settings: { foreground: "#71717a" }, // zinc-500
    },
    {
      scope: ["string", "string.quoted"],
      settings: { foreground: "#61dafb" }, // accent
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: "#fbbf24" }, // amber-400
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: "#c084fc" }, // purple-400
    },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: "#61dafb" }, // accent
    },
    {
      scope: ["entity.name.type", "entity.name.class", "support.type"],
      settings: { foreground: "#a1a1aa" }, // zinc-400
    },
    {
      scope: ["variable", "variable.parameter"],
      settings: { foreground: "#f4f4f5" }, // zinc-100
    },
    {
      scope: ["punctuation"],
      settings: { foreground: "#a1a1aa" }, // zinc-400
    },
  ],
};
