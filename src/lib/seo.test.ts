import { describe, expect, it } from "vitest";

import { buildSeoMeta, pageTitle, SITE_NAME, SITE_URL } from "./seo.ts";
import { ui } from "../i18n/ui.ts";

const url = new URL("/proyectos/un-proyecto/", SITE_URL);

describe("pageTitle", () => {
  it("agrega el sufijo de marca una sola vez", () => {
    expect(pageTitle("Proyectos")).toBe(`Proyectos — ${SITE_NAME}`);
  });
});

describe("buildSeoMeta", () => {
  it("usa la description que se pasa", () => {
    const meta = buildSeoMeta({
      title: "x",
      url,
      lang: "es",
      description: "El resumen del proyecto",
    });

    expect(meta.description).toBe("El resumen del proyecto");
  });

  it("cae a la description del diccionario cuando no se pasa ninguna", () => {
    const meta = buildSeoMeta({ title: "x", url, lang: "es" });

    expect(meta.description).toBe(ui.es["seo.description"]);
  });

  it("devuelve la imagen por defecto absoluta, con su tamaño y alt", () => {
    const meta = buildSeoMeta({ title: "x", url, lang: "es" });

    expect(meta.image).toBe(`${SITE_URL}/og-image.png`);
    expect(meta.imageSize).toEqual({ width: 1200, height: 630 });
    expect(meta.imageAlt).toBe(ui.es["seo.imageAlt"]);
  });

  it("con imagen propia no inventa el tamaño y usa su alt (o el titulo)", () => {
    const withAlt = buildSeoMeta({
      title: "x",
      url,
      lang: "es",
      image: "/_astro/cover.jpg",
      imageAlt: "Captura del proyecto",
    });
    const noAlt = buildSeoMeta({
      title: "Mi proyecto",
      url,
      lang: "es",
      image: "/_astro/cover.jpg",
    });

    expect(withAlt.imageSize).toBeUndefined();
    expect(withAlt.imageAlt).toBe("Captura del proyecto");
    expect(noAlt.imageAlt).toBe("Mi proyecto");
  });

  it("usa el locale completo, no el codigo corto", () => {
    expect(buildSeoMeta({ title: "x", url, lang: "es" }).locale).toBe("es_ES");
  });
});
