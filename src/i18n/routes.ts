// Mapa de rutas.
//
// Es la unica fuente de verdad de los paths del sitio: de aca salen los
// enlaces internos. Va indexado por idioma aunque hoy solo exista el espaniol,
// para que sumar el ingles despues no obligue a tocar cada enlace.
import type { Lang } from "./index.ts";

export const PATHS = {
  home: { es: "/" },
  /** La lista de canciones de la radio. */
  radio: { es: "/radio" },
  /** Base de los perfiles de proyecto (no hay listado: lo hace la biblioteca). */
  projects: { es: "/proyectos" },
  /** Base de los perfiles de experimento. */
  experiments: { es: "/experimentos" },
} as const;

/** Rutas fijas. */
export type StaticRoute = keyof typeof PATHS;

/** `project` y `experiment` son las rutas dinamicas: necesitan su slug. */
export type Route = StaticRoute | "experiment" | "project";

/** Path de una ruta. Para `project` y `experiment` hace falta el slug. */
export function pathFor(route: Route, lang: Lang, slug?: string): string {
  if (route === "experiment" || route === "project") {
    if (slug === undefined) {
      throw new Error(`pathFor('${route}') necesita el slug`);
    }
    const base = route === "experiment" ? "experiments" : "projects";
    return `${PATHS[base][lang]}/${slug}`;
  }

  return PATHS[route][lang];
}
