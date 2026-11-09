import { describe, expect, it } from "vitest";

import { buildSeoMeta, pageTitle, SITE_NAME, SITE_URL } from "./seo.ts";
import { ui } from "../i18n/ui.ts";

const url = new URL("/blog/una-nota/", SITE_URL);

describe("pageTitle", () => {
  it("agrega el sufijo de marca una sola vez", () => {
    expect(pageTitle("Blog")).toBe(`Blog — ${SITE_NAME}`);
  });
});

describe("buildSeoMeta", () => {
  it("emite un alternate por idioma, los dos con barra final", () => {
    const meta = buildSeoMeta({ title: "x", url, lang: "es", route: "blog" });

    expect(meta.alternates.map((a) => a.href)).toEqual([
      `${SITE_URL}/blog/`,
      `${SITE_URL}/en/blog/`,
    ]);
  });

  it("el hreflang por defecto apunta al espaniol", () => {
    const meta = buildSeoMeta({ title: "x", url, lang: "en", route: "blog" });

    expect(meta.defaultHref).toBe(`${SITE_URL}/blog/`);
  });

  it("incluye el slug en los alternates de una nota", () => {
    const meta = buildSeoMeta({
      title: "x",
      url,
      lang: "es",
      route: "post",
      slug: "una-nota",
    });

    expect(meta.alternates.map((a) => a.href)).toEqual([
      `${SITE_URL}/blog/una-nota/`,
      `${SITE_URL}/en/blog/una-nota/`,
    ]);
  });

  it("usa el summary del post como description cuando se pasa", () => {
    const meta = buildSeoMeta({
      title: "x",
      url,
      lang: "es",
      route: "post",
      slug: "una-nota",
      description: "El resumen de la nota",
    });

    expect(meta.description).toBe("El resumen de la nota");
  });

  it("cae a la description del diccionario cuando el post no trae summary", () => {
    const meta = buildSeoMeta({ title: "x", url, lang: "es", route: "blog" });

    expect(meta.description).toBe(ui.es["seo.description"]);
  });

  it("devuelve la imagen absoluta, que es lo que exige Open Graph", () => {
    const meta = buildSeoMeta({ title: "x", url, lang: "es", route: "home" });

    expect(meta.image.startsWith("https://")).toBe(true);
  });

  it("elige la imagen de cada idioma y declara su tamaño y alt", () => {
    const es = buildSeoMeta({ title: "x", url, lang: "es", route: "home" });
    const en = buildSeoMeta({ title: "x", url, lang: "en", route: "home" });

    expect(es.image).toBe(`${SITE_URL}/og-image.png`);
    expect(en.image).toBe(`${SITE_URL}/og-image-en.png`);
    expect(es.imageSize).toEqual({ width: 1200, height: 630 });
    expect(es.imageAlt).toBe(ui.es["seo.imageAlt"]);
    expect(en.imageAlt).toBe(ui.en["seo.imageAlt"]);
  });

  it("con imagen propia no inventa el tamaño y usa su alt (o el titulo)", () => {
    const withAlt = buildSeoMeta({
      title: "x",
      url,
      lang: "es",
      route: "project",
      slug: "p",
      image: "/_astro/cover.jpg",
      imageAlt: "Captura del proyecto",
    });
    const noAlt = buildSeoMeta({
      title: "Mi proyecto",
      url,
      lang: "es",
      route: "project",
      slug: "p",
      image: "/_astro/cover.jpg",
    });

    expect(withAlt.imageSize).toBeUndefined();
    expect(withAlt.imageAlt).toBe("Captura del proyecto");
    expect(noAlt.imageAlt).toBe("Mi proyecto");
  });

  it("marca las notas como article y el resto como website", () => {
    const post = buildSeoMeta({
      title: "x",
      url,
      lang: "es",
      route: "post",
      slug: "una-nota",
    });
    const blog = buildSeoMeta({ title: "x", url, lang: "es", route: "blog" });

    expect(post.type).toBe("article");
    expect(blog.type).toBe("website");
  });

  it("usa el locale completo de cada idioma, no el codigo corto", () => {
    expect(
      buildSeoMeta({ title: "x", url, lang: "es", route: "home" }).locale,
    ).toBe("es_ES");
    expect(
      buildSeoMeta({ title: "x", url, lang: "en", route: "home" }).locale,
    ).toBe("en_US");
  });
});
