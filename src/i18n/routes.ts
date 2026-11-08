// Mapa de rutas por idioma.
//
// Es la unica fuente de verdad de los paths del sitio y sirve para tres cosas
// a la vez: armar la navegacion, mandar el boton ES/EN a *la misma* pagina en
// el otro idioma (no al inicio), y emitir los <link rel="alternate" hreflang>.
//
// El espaniol va sin prefijo para no mover ninguna URL ya publicada; el ingles
// vive bajo /en/. Los slugs se traducen, que es lo que espera un lector en
// cada idioma.
import type { Lang } from "./index.ts";

export const PATHS = {
  home: { es: "/", en: "/en/" },
  blog: { es: "/blog", en: "/en/blog" },
  experiments: { es: "/experimentos", en: "/en/experiments" },
} as const;

/** Rutas fijas, las que aparecen en la navegacion. */
export type StaticRoute = keyof typeof PATHS;

/** `post` y `experiment` son las rutas dinamicas: necesitan su slug. */
export type Route = StaticRoute | "post" | "experiment";

/** Las entradas de la navegacion, en orden. El label sale del diccionario. */
export const NAV_ROUTES = [
  "home",
  "blog",
  "experiments",
] as const satisfies readonly StaticRoute[];

/** Las entradas del pie, mas cortas que las del header. */
export const FOOTER_ROUTES = [
  "home",
  "blog",
  "experiments",
] as const satisfies readonly StaticRoute[];

/**
 * Path de una ruta en un idioma. Para `post` y `experiment` hace falta el
 * slug; es el mismo en los dos idiomas porque los .mdx no se traducen.
 */
export function pathFor(route: Route, lang: Lang, slug?: string): string {
  if (route === "post") {
    if (slug === undefined) {
      throw new Error("pathFor('post') necesita el slug de la nota");
    }
    return `${PATHS.blog[lang]}/${slug}`;
  }

  if (route === "experiment") {
    if (slug === undefined) {
      throw new Error("pathFor('experiment') necesita el slug del experimento");
    }
    return `${PATHS.experiments[lang]}/${slug}`;
  }

  return PATHS[route][lang];
}
