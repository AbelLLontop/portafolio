import { useTranslations, type Lang } from "../i18n/index.ts";

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
  /** Solo se conoce en la imagen por defecto; en las demas se omite. */
  imageSize?: { width: number; height: number };
  url: string;
  locale: string;
}

/**
 * Sufijo del titulo. Estaba repetido a mano en tres paginas, asi que si se
 * cambiaba la marca habia que acordarse de los tres.
 */
export function pageTitle(title: string): string {
  return `${title} — ${SITE_NAME}`;
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
    imageSize: isDefaultImage ? OG_IMAGE_SIZE : undefined,
    url: params.url.toString(),
    locale: SITE_LOCALES[lang],
  };
}
