import { useTranslations, type Lang } from "../i18n/index.ts";
import { CONTACTS } from "./profile.ts";

export const SITE_NAME = "abelitolll";
export const SITE_URL = "https://abelitolll.com";
// La imagen lleva el texto dibujado: se genera con `node scripts/og-image.mjs`.
// 1200x630 es la proporcion 1.91:1 que piden Facebook, LinkedIn, WhatsApp y X
// para la tarjeta grande.
export const SITE_OG_IMAGES: Record<Lang, string> = {
  es: "/og-image.png",
};
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// Open Graph pide el locale completo, no el codigo corto del <html lang>.
export const SITE_LOCALES: Record<Lang, string> = {
  es: "es_ES",
};

export interface SeoMeta {
  title: string;
  description: string;
  image: string;
  /** Texto alternativo de la imagen (og:image:alt / twitter:image:alt). */
  imageAlt: string;
  /** Tamaño y tipo de la imagen; se omiten si no se conocen. */
  imageSize?: { width: number; height: number };
  imageType?: string;
  /** `article` para los perfiles, `website` para el resto. */
  type: "website" | "article";
  url: string;
  locale: string;
}

/**
 * Sufijo del titulo. Estaba repetido a mano en tres paginas, asi que si se
 * cambiaba la marca habia que acordarse de los tres.
 */
export function pageTitle(title: string): string {
  // "abelitolll.com — abelitolll" repite la marca: si ya la trae, va sola.
  if (title.toLowerCase().includes(SITE_NAME)) return title;
  return `${title} — ${SITE_NAME}`;
}

/**
 * La URL pública de una página. Con `build.format: "file"` el build ve
 * `/radio.html` (y `/index.html` en el inicio), pero Vercel la sirve como
 * `/radio` (`cleanUrls`): el canonical tiene que ser esa, sin `.html` ni barra
 * final.
 */
export function canonicalUrl(url: URL): string {
  const clean = new URL(url);
  clean.search = "";
  clean.hash = "";
  clean.pathname = clean.pathname
    .replace(/(^|\/)index\.html$/, "$1")
    .replace(/\.html$/, "")
    .replace(/(.)\/+$/, "$1");
  return clean.toString();
}

// `image`/`url` deben ser absolutas para Open Graph/Twitter; `Astro.url` ya
// viene resuelta sobre `site` (astro.config.mjs) en build estático.
export function buildSeoMeta(params: {
  title: string;
  url: URL;
  lang: Lang;
  description?: string;
  image?: string;
  imageAlt?: string;
  imageSize?: { width: number; height: number };
  imageType?: string;
  type?: SeoMeta["type"];
}): SeoMeta {
  const { lang } = params;
  const t = useTranslations(lang);
  const isDefaultImage = params.image === undefined;

  return {
    title: params.title,
    description: params.description ?? t("seo.description"),
    image: new URL(params.image ?? SITE_OG_IMAGES[lang], params.url).toString(),
    imageAlt:
      params.imageAlt ?? (isDefaultImage ? t("seo.imageAlt") : params.title),
    imageSize: isDefaultImage ? OG_IMAGE_SIZE : params.imageSize,
    imageType: isDefaultImage ? "image/png" : params.imageType,
    type: params.type ?? "website",
    url: canonicalUrl(params.url),
    locale: SITE_LOCALES[lang],
  };
}

/**
 * Datos estructurados del inicio (schema.org): quién es el autor y cuál es el
 * sitio. Le dicen a Google que "Abel Llontop" y abelitolll.com son lo mismo, y
 * `sameAs` enlaza sus perfiles. Sin ubicación a propósito (AGENTS.md, regla 8).
 */
export function buildHomeJsonLd(lang: Lang): Record<string, unknown> {
  const t = useTranslations(lang);
  const home = new URL("/", SITE_URL).toString();
  const personId = `${home}#autor`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: t("seo.person.name"),
        alternateName: SITE_NAME,
        jobTitle: t("seo.person.jobTitle"),
        url: home,
        sameAs: CONTACTS.map((contact) => contact.href),
      },
      {
        "@type": "WebSite",
        "@id": `${home}#sitio`,
        name: SITE_NAME,
        url: home,
        inLanguage: lang,
        description: t("seo.description"),
        author: { "@id": personId },
      },
    ],
  };
}

/**
 * JSON listo para un `<script type="application/ld+json">`. Se escapa `<` para
 * que un texto con `</script>` no pueda cerrar la etiqueta antes de tiempo.
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
