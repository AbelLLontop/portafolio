import { describe, expect, it } from "vitest";

import { platformHost, platformIcon } from "./platform-icons.ts";

describe("platformHost", () => {
  it("se queda con el dominio sin www ni subdominios", () => {
    expect(platformHost("https://www.youtube.com/@canal")).toBe("youtube.com");
    expect(platformHost("https://open.spotify.com/artist/abc")).toBe(
      "spotify.com",
    );
  });
});

describe("platformIcon", () => {
  it("devuelve el logo de las plataformas conocidas", () => {
    for (const url of [
      "https://www.youtube.com/@canal",
      "https://soundcloud.com/grupo",
      "https://open.spotify.com/artist/abc",
      "https://www.tiktok.com/@grupo",
    ]) {
      expect(platformIcon(url)).toContain("<svg");
    }
  });

  it("devuelve null si no hay logo", () => {
    expect(platformIcon("https://ejemplo.com/algo")).toBeNull();
  });
});
