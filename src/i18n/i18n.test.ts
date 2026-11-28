import { describe, expect, it } from "vitest";

import { interpolate } from "./interpolate.ts";
import { isLang, LANGS, pickStrings, useTranslations } from "./index.ts";
import { PATHS, pathFor } from "./routes.ts";
import { ui } from "./ui.ts";

describe("diccionario", () => {
  it("ninguna clave queda vacia", () => {
    for (const lang of LANGS) {
      for (const [key, value] of Object.entries(ui[lang])) {
        expect(value.trim(), `${lang}.${key} esta vacia`).not.toBe("");
      }
    }
  });
});

describe("useTranslations", () => {
  it("traduce en el idioma pedido", () => {
    const t = useTranslations("es");

    expect(t("seo.description")).toBe(ui.es["seo.description"]);
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
    expect(isLang("pt")).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });
});

describe("rutas", () => {
  it("arma el path de un perfil con su slug", () => {
    expect(pathFor("experiment", "es", "una-prueba")).toBe(
      "/experimentos/una-prueba",
    );
    expect(pathFor("project", "es", "un-proyecto")).toBe(
      "/proyectos/un-proyecto",
    );
  });

  it("falla en vez de emitir una URL rota si falta el slug", () => {
    expect(() => pathFor("project", "es")).toThrow();
  });

  it("toda ruta fija existe en el mapa", () => {
    for (const route of Object.keys(PATHS) as (keyof typeof PATHS)[]) {
      expect(pathFor(route, "es")).toBe(PATHS[route].es);
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
