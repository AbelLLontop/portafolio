import { describe, expect, it } from "vitest";

import { formatPostDate, formatPostDateShort } from "./dates.ts";

// El frontmatter trae `date: 2026-10-12`, que se parsea como medianoche UTC.
// Formatear en la zona local lo corre al dia anterior en Peru (UTC-5): la
// fecha publicada deja de coincidir con la escrita. Esto ya paso una vez.
const MEDIANOCHE_UTC = new Date("2026-10-12");

describe("formatPostDate", () => {
  it("mantiene el dia escrito en el frontmatter, sin corrimiento por zona", () => {
    expect(formatPostDate(MEDIANOCHE_UTC)).toContain("12");
    expect(formatPostDate(MEDIANOCHE_UTC, "en")).toContain("12");
  });

  it("usa el formato de cada idioma", () => {
    expect(formatPostDate(MEDIANOCHE_UTC, "es")).toBe("12 de octubre de 2026");
    expect(formatPostDate(MEDIANOCHE_UTC, "en")).toBe("October 12, 2026");
  });

  it("formatea en espaniol cuando no se pasa idioma", () => {
    expect(formatPostDate(MEDIANOCHE_UTC)).toBe(
      formatPostDate(MEDIANOCHE_UTC, "es"),
    );
  });
});

describe("formatPostDateShort", () => {
  it("abrevia el mes y no deja el punto del locale", () => {
    const es = formatPostDateShort(MEDIANOCHE_UTC, "es");

    expect(es).toBe("12 oct 2026");
    expect(es).not.toContain(".");
  });

  it("tambien abrevia en ingles", () => {
    expect(formatPostDateShort(MEDIANOCHE_UTC, "en")).toBe("Oct 12, 2026");
  });

  it("no corre el dia por zona horaria", () => {
    expect(formatPostDateShort(MEDIANOCHE_UTC, "es")).toContain("12");
  });
});
