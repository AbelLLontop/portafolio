// Mapa de rutas.
//
// Es la unica fuente de verdad de los paths del sitio: de aca salen la
// navegacion y los enlaces internos. Va indexado por idioma aunque hoy solo
// exista el espaniol, para que sumar el ingles despues no obligue a tocar cada
// enlace.
import type { Lang } from "./index.ts";

export const PATHS = {
  home: { es: "/" },
  projects: { es: "/proyectos" },
  experiments: { es: "/experimentos" },
} as const;

/** Rutas fijas, las que aparecen en la navegacion. */
export type StaticRoute = keyof typeof PATHS;

/** `project` y `experiment` son las rutas dinamicas: necesitan su slug. */
export type Route = StaticRoute | "experiment" | "project" | "notFound";

/** Las entradas de la navegacion, en orden. El label sale del diccionario. */
export const NAV_ROUTES = [
  "home",
  "projects",
  "experiments",
] as const satisfies readonly StaticRoute[];

/** Las entradas del pie, mas cortas que las del header. */
export const FOOTER_ROUTES = NAV_ROUTES;

/** Path de una ruta. Para `project` y `experiment` hace falta el slug. */
export function pathFor(route: Route, lang: Lang, slug?: string): string {
  if (route === "experiment" || route === "project") {
    if (slug === undefined) {
      throw new Error(`pathFor('${route}') necesita el slug`);
    }
    const base = route === "experiment" ? "experiments" : "projects";
    return `${PATHS[base][lang]}/${slug}`;
  }

  // El 404 no tiene URL propia.
  if (route === "notFound") return PATHS.home[lang];

  return PATHS[route][lang];
}
