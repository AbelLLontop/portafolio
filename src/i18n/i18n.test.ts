import { describe, expect, it } from "vitest";

import { interpolate } from "./interpolate.ts";
import {
  isLang,
  LANGS,
  otherLang,
  pickStrings,
  useTranslations,
} from "./index.ts";
import { NAV_ROUTES, PATHS, pathFor } from "./routes.ts";
import { ui } from "./ui.ts";

describe("diccionario", () => {
  it("el ingles tiene exactamente las mismas claves que el espaniol", () => {
    expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.es).sort());
  });

  it("ninguna clave queda vacia en ningun idioma", () => {
    for (const lang of LANGS) {
      for (const [key, value] of Object.entries(ui[lang])) {
        expect(value.trim(), `${lang}.${key} esta vacia`).not.toBe("");
      }
    }
  });

  it("los marcadores {asi} de una clave son los mismos en los dos idiomas", () => {
    const markers = (text: string) => (text.match(/\{(\w+)\}/g) ?? []).sort();

    for (const key of Object.keys(ui.es) as (keyof typeof ui.es)[]) {
      expect(
        markers(ui.en[key]),
        `los marcadores de "${key}" no coinciden`,
      ).toEqual(markers(ui.es[key]));
    }
  });
});

describe("useTranslations", () => {
  it("traduce en el idioma pedido", () => {
    const t = useTranslations("en");

    expect(t("seo.description")).toBe(ui.en["seo.description"]);
  });
});

describe("pickStrings", () => {
  it("devuelve solo las claves pedidas, para no mandar el diccionario al cliente", () => {
    const strings = pickStrings("es", ["seo.description"]);

    expect(Object.keys(strings)).toEqual(["seo.description"]);
  });
});

describe("idiomas", () => {
  it("reconoce los idiomas validos y descarta el resto", () => {
    expect(isLang("es")).toBe(true);
    expect(isLang("en")).toBe(true);
    expect(isLang("pt")).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });

  it("otherLang devuelve el otro idioma", () => {
    expect(otherLang("es")).toBe("en");
    expect(otherLang("en")).toBe("es");
  });
});

describe("rutas", () => {
  it("el espaniol va sin prefijo y el ingles bajo /en/", () => {
    expect(pathFor("blog", "es")).toBe("/blog");
    expect(pathFor("blog", "en")).toBe("/en/blog");
  });

  it("traduce el slug de las paginas fijas", () => {
    expect(pathFor("about", "es")).toBe("/sobre-mi");
    expect(pathFor("about", "en")).toBe("/en/about");
  });

  it("una nota usa el mismo slug en los dos idiomas", () => {
    expect(pathFor("post", "es", "una-nota")).toBe("/blog/una-nota");
    expect(pathFor("post", "en", "una-nota")).toBe("/en/blog/una-nota");
  });

  it("falla en vez de emitir una URL rota si falta el slug de la nota", () => {
    expect(() => pathFor("post", "es")).toThrow();
  });

  it("toda ruta del nav existe en el mapa, en los dos idiomas", () => {
    for (const route of NAV_ROUTES) {
      expect(PATHS[route].es).toBeTruthy();
      expect(PATHS[route].en).toBeTruthy();
    }
  });
});

describe("interpolate", () => {
  it("reemplaza los marcadores por sus valores", () => {
    expect(interpolate("nota {n} de {total}", { n: 3, total: 12 })).toBe(
      "nota 3 de 12",
    );
  });

  it("deja el marcador intacto si no hay valor, para que el hueco se vea", () => {
    expect(interpolate("nota {n}", {})).toBe("nota {n}");
  });

  it("no toca un texto sin marcadores", () => {
    expect(interpolate("sin marcadores", { n: 1 })).toBe("sin marcadores");
  });
});
