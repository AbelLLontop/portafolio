// El frontmatter trae `date: 2026-10-12`, que se parsea como medianoche UTC.
// Sin fijar la zona, toLocaleDateString lo renderiza en la zona local y en
// Perú (UTC-5) cae al día anterior: la fecha publicada no coincide con la
// escrita. Por eso todo el sitio formatea en UTC.
import { DEFAULT_LANG, type Lang } from "../i18n/index.ts";

const TIME_ZONE = "UTC";

// Un locale real por idioma: no alcanza con "es"/"en" porque el orden y el
// nombre del mes cambian ("12 de octubre de 2026" vs "October 12, 2026").
const LOCALES: Record<Lang, string> = {
  es: "es-PE",
  en: "en-US",
};

export function formatPostDate(date: Date, lang: Lang = DEFAULT_LANG): string {
  return date.toLocaleDateString(LOCALES[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** Versión compacta, para espacios angostos como la consola del hero. */
export function formatPostDateShort(
  date: Date,
  lang: Lang = DEFAULT_LANG,
): string {
  return date
    .toLocaleDateString(LOCALES[lang], {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: TIME_ZONE,
    })
    .replace(".", "");
}
