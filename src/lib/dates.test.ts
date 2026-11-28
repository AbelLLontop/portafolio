import { describe, expect, it } from "vitest";

import { formatDate } from "./dates.ts";

// El frontmatter trae `date: 2026-10-12`, que se parsea como medianoche UTC.
// Formatear en la zona local lo corre al dia anterior en Peru (UTC-5): la
// fecha publicada deja de coincidir con la escrita. Esto ya paso una vez.
const MEDIANOCHE_UTC = new Date("2026-10-12");

describe("formatDate", () => {
  it("mantiene el dia escrito en el frontmatter, sin corrimiento por zona", () => {
    expect(formatDate(MEDIANOCHE_UTC)).toBe("12 de octubre de 2026");
  });

  it("el 1 del mes no se corre al mes anterior", () => {
    expect(formatDate(new Date("2026-10-01"))).toBe("1 de octubre de 2026");
  });
});
