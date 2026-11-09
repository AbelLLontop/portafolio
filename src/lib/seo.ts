import { useTranslations, type Lang } from "../i18n/index.ts";
import { pathFor, type Route } from "../i18n/routes.ts";

export const SITE_NAME = "abelitolll";
export const SITE_URL = "https://abelitolll.com";
// Una imagen por idioma (el texto va dibujado): se generan con
// `node scripts/og-image.mjs`. 1200x630 es la proporcion 1.91:1 que piden
// Facebook, LinkedIn, WhatsApp y X para la tarjeta grande.
export const SITE_OG_IMAGES: Record<Lang, string> = {
  es: "/og-image.png",
  en: "/og-image-en.png",
};
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// Open Graph pide el locale completo, no el codigo corto del <html lang>.
export const SITE_LOCALES: Record<Lang, string> = {
  es: "es_ES",
  en: "en_US",
};

export interface SeoMeta {
  title: string;
  description: string;
  image: string;
  /** Texto alternativo de la imagen (og:image:alt / twitter:image:alt). */
  imageAlt: string;
  /** Solo se conoce en la imagen por defecto; en las demas se omite. */
  imageSize?: { width: number; height: number };
  /** `article` para las notas, `website` para el resto. */
  type: "website" | "article";
  url: string;
  locale: string;
  /** Un alternate por idioma, para que cada version se indexe en la suya. */
  alternates: { lang: Lang; hreflang: string; href: string }[];
  /** El que Google sirve cuando no matchea ningun idioma: el espaniol. */
  defaultHref: string;
}

/**
 * Sufijo del titulo. Estaba repetido a mano en tres paginas, asi que si se
 * cambiaba la marca habia que acordarse de los tres.
 */
export function pageTitle(title: string): string {
  return `${title} — ${SITE_NAME}`;
}

/**
 * El build estatico sirve cada pagina como `.../index.html`, asi que tanto el
 * canonical (que sale de `Astro.url`) como el sitemap llevan barra final.
 * Los hreflang tienen que coincidir EXACTO con el canonical: si el
 * autorreferente apunta a `/blog` y el canonical a `/blog/`, Google puede
 * descartar el grupo de alternates completo.
 */
function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

// `image`/`url` deben ser absolutas para Open Graph/Twitter; `Astro.url` ya
// viene resuelta sobre `site` (astro.config.mjs) en build estático.
export function buildSeoMeta(params: {
  title: string;
  url: URL;
  lang: Lang;
  route: Route;
  slug?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}): SeoMeta {
  const { lang, route, slug } = params;
  const t = useTranslations(lang);

  // Los alternates salen del mismo mapa de rutas que la navegacion, asi que
  // no pueden quedar apuntando a una URL que ya no existe.
  const alternates = (Object.keys(SITE_LOCALES) as Lang[]).map((target) => ({
    lang: target,
    hreflang: target,
    href: new URL(
      withTrailingSlash(pathFor(route, target, slug)),
      SITE_URL,
    ).toString(),
  }));

  const isDefaultImage = params.image === undefined;

  return {
    title: params.title,
    description: params.description ?? t("seo.description"),
    image: new URL(params.image ?? SITE_OG_IMAGES[lang], params.url).toString(),
    imageAlt:
      params.imageAlt ?? (isDefaultImage ? t("seo.imageAlt") : params.title),
    imageSize: isDefaultImage ? OG_IMAGE_SIZE : undefined,
    type: route === "post" ? "article" : "website",
    url: params.url.toString(),
    locale: SITE_LOCALES[lang],
    alternates,
    defaultHref: new URL(
      withTrailingSlash(pathFor(route, "es", slug)),
      SITE_URL,
    ).toString(),
  };
}
