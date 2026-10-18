// Mapa de rutas por idioma.
//
// Es la unica fuente de verdad de los paths del sitio y sirve para tres cosas
// a la vez: armar la navegacion, mandar el boton ES/EN a *la misma* pagina en
// el otro idioma (no al inicio), y emitir los <link rel="alternate" hreflang>.
//
// El espaniol va sin prefijo para no mover ninguna URL ya publicada; el ingles
// vive bajo /en/. Los slugs se traducen (`/sobre-mi` ↔ `/en/about`), que es lo
// que espera un lector en cada idioma.
import type { Lang } from "./index.ts";

export const PATHS = {
  home: { es: "/", en: "/en/" },
  about: { es: "/sobre-mi", en: "/en/about" },
  blog: { es: "/blog", en: "/en/blog" },
} as const;

/** Rutas fijas, las que aparecen en la navegacion. */
export type StaticRoute = keyof typeof PATHS;

/** `post` es la unica ruta dinamica: necesita el slug de la nota. */
export type Route = StaticRoute | "post";

/** Las entradas de la navegacion, en orden. El label sale del diccionario. */
export const NAV_ROUTES = [
  "home",
  "about",
  "blog",
] as const satisfies readonly StaticRoute[];

/** Las entradas del pie, mas cortas que las del header. */
export const FOOTER_ROUTES = [
  "home",
  "blog",
] as const satisfies readonly StaticRoute[];

/**
 * Path de una ruta en un idioma. Para `post` hace falta el slug; el slug es el
 * mismo en los dos idiomas porque los .mdx no se traducen.
 */
export function pathFor(route: Route, lang: Lang, slug?: string): string {
  if (route === "post") {
    if (slug === undefined) {
      throw new Error("pathFor('post') necesita el slug de la nota");
    }
    return `${PATHS.blog[lang]}/${slug}`;
  }

  return PATHS[route][lang];
}
