import { describe, expect, it } from "vitest";

import {
  buildHomeJsonLd,
  buildSeoMeta,
  canonicalUrl,
  pageTitle,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
} from "./seo.ts";
import { CONTACTS } from "./profile.ts";
import { ui } from "../i18n/ui.ts";

const url = new URL("/proyectos/un-proyecto", SITE_URL);

describe("pageTitle", () => {
  it("agrega el sufijo de marca una sola vez", () => {
    expect(pageTitle("Proyectos")).toBe(`Proyectos — ${SITE_NAME}`);
  });

  it("no repite la marca si el titulo ya la trae", () => {
    expect(pageTitle("abelitolll.com")).toBe("abelitolll.com");
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
    expect(withAlt.imageType).toBeUndefined();
    expect(withAlt.imageAlt).toBe("Captura del proyecto");
    expect(noAlt.imageAlt).toBe("Mi proyecto");
  });

  it("con imagen propia usa el tamaño y el tipo que se pasan", () => {
    const meta = buildSeoMeta({
      title: "x",
      url,
      lang: "es",
      image: "/_astro/cover.jpg",
      imageSize: { width: 1200, height: 675 },
      imageType: "image/jpeg",
      type: "article",
    });

    expect(meta.imageSize).toEqual({ width: 1200, height: 675 });
    expect(meta.imageType).toBe("image/jpeg");
    expect(meta.type).toBe("article");
  });

  it("es website si no se dice otra cosa", () => {
    expect(buildSeoMeta({ title: "x", url, lang: "es" }).type).toBe("website");
  });

  it("usa el locale completo, no el codigo corto", () => {
    expect(buildSeoMeta({ title: "x", url, lang: "es" }).locale).toBe("es_ES");
  });
});

describe("canonicalUrl", () => {
  const at = (path: string) => canonicalUrl(new URL(path, SITE_URL));

  it("saca el .html que deja el build", () => {
    expect(at("/radio.html")).toBe(`${SITE_URL}/radio`);
    expect(at("/proyectos/portafolio.html")).toBe(
      `${SITE_URL}/proyectos/portafolio`,
    );
  });

  it("deja el inicio como la raiz", () => {
    expect(at("/index.html")).toBe(`${SITE_URL}/`);
    expect(at("/")).toBe(`${SITE_URL}/`);
  });

  it("saca la barra final, la query y el hash", () => {
    expect(at("/radio/?a=1#letra")).toBe(`${SITE_URL}/radio`);
  });
});

describe("buildHomeJsonLd", () => {
  const graph = buildHomeJsonLd("es")["@graph"] as Record<string, unknown>[];
  const person = graph.find((node) => node["@type"] === "Person");
  const site = graph.find((node) => node["@type"] === "WebSite");

  it("declara al autor con sus perfiles en sameAs", () => {
    expect(person?.name).toBe(ui.es["seo.person.name"]);
    expect(person?.sameAs).toEqual(CONTACTS.map((contact) => contact.href));
  });

  it("enlaza el sitio con su autor", () => {
    expect(site?.url).toBe(`${SITE_URL}/`);
    expect(site?.author).toEqual({ "@id": person?.["@id"] });
  });
});

describe("serializeJsonLd", () => {
  it("escapa < para que nada cierre el <script>", () => {
    const json = serializeJsonLd({ name: "</script><b>" });

    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({ name: "</script><b>" });
  });
});
