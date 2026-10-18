export const SITE_NAME = "abelitolll";
export const SITE_URL = "https://abelitolll.com";
export const SITE_DESCRIPTION =
  "abelitolll — página personal de Abel Llontop, desarrollador de software peruano. Backend, aplicaciones web y notas técnicas.";
export const SITE_OG_IMAGE = "/og-image.png";
export const SITE_LOCALE = "es_ES";

export interface SeoMeta {
  title: string;
  description: string;
  image: string;
  url: string;
}

// `image`/`url` deben ser absolutas para Open Graph/Twitter; `Astro.url` ya
// viene resuelta sobre `site` (astro.config.mjs) en build estático.
export function buildSeoMeta(params: {
  title: string;
  url: URL;
  description?: string;
  image?: string;
}): SeoMeta {
  return {
    title: params.title,
    description: params.description ?? SITE_DESCRIPTION,
    image: new URL(params.image ?? SITE_OG_IMAGE, params.url).toString(),
    url: params.url.toString(),
  };
}
