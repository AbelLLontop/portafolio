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
    const meta = buildSeoMeta({ title: "x", url, lang: "en", route: "about" });

    expect(meta.defaultHref).toBe(`${SITE_URL}/sobre-mi/`);
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

  it("usa el locale completo de cada idioma, no el codigo corto", () => {
    expect(
      buildSeoMeta({ title: "x", url, lang: "es", route: "home" }).locale,
    ).toBe("es_ES");
    expect(
      buildSeoMeta({ title: "x", url, lang: "en", route: "home" }).locale,
    ).toBe("en_US");
  });
});
