// Helpers de i18n. Todo puro y sin dependencias de Astro, asi que tambien se
// pueden importar desde las islas React.
import { ui, type UIKey } from "./ui.ts";

export type { UIKey };

// Se reexporta para que el lado servidor tenga todo en un solo import; las
// islas lo toman de "./interpolate.ts" directo, para no arrastrar el
// diccionario al bundle del cliente.
export { interpolate } from "./interpolate.ts";

export type Lang = keyof typeof ui;

/** El espaniol es el idioma por defecto y va sin prefijo de ruta. */
export const DEFAULT_LANG: Lang = "es";

export const LANGS = Object.keys(ui) as Lang[];

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in ui;
}

/** El otro idioma, para el boton ES/EN. Con dos idiomas no hay ambiguedad. */
export function otherLang(lang: Lang): Lang {
  return lang === "es" ? "en" : "es";
}

/**
 * Traductor del idioma pedido. Si faltara una clave cae al espaniol en vez de
 * renderizar `undefined`; con el tipado de `ui.ts` eso no deberia pasar, pero
 * el fallback evita que un hueco se vea en produccion.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[DEFAULT_LANG][key];
  };
}

/**
 * Subconjunto serializable del diccionario, para pasarlo como prop a una isla.
 *
 * Las islas no importan `ui.ts`: eso mandaria los dos idiomas completos en el
 * bundle del cliente. Asi cada pagina manda solo las claves que su isla usa.
 */
export function pickStrings<K extends UIKey>(
  lang: Lang,
  keys: readonly K[],
): Record<K, string> {
  const t = useTranslations(lang);
  return Object.fromEntries(keys.map((key) => [key, t(key)])) as Record<
    K,
    string
  >;
}
