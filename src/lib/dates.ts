// El frontmatter trae `date: 2026-10-12`, que se parsea como medianoche UTC.
// Sin fijar la zona, toLocaleDateString lo renderiza en la zona local y en
// Perú (UTC-5) cae al día anterior: la fecha publicada no coincide con la
// escrita. Por eso todo el sitio formatea en UTC.
const TIME_ZONE = "UTC";
const LOCALE = "es-PE";

export function formatPostDate(date: Date): string {
  return date.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** Versión compacta, para espacios angostos como la consola del hero. */
export function formatPostDateShort(date: Date): string {
  return date
    .toLocaleDateString(LOCALE, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: TIME_ZONE,
    })
    .replace(".", "");
}
