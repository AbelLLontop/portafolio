import { describe, expect, it } from "vitest";

import {
  soundcloudEmbedUrl,
  youtubeEmbedUrl,
  youtubeThumbUrl,
  youtubeWatchUrl,
} from "./embeds.ts";

describe("youtube", () => {
  it("el iframe usa el dominio sin cookies y arranca solo", () => {
    const url = new URL(youtubeEmbedUrl("kQfKMalX8Ko"));

    expect(url.hostname).toBe("www.youtube-nocookie.com");
    expect(url.pathname).toBe("/embed/kQfKMalX8Ko");
    expect(url.searchParams.get("autoplay")).toBe("1");
  });

  it("la miniatura y el enlace salen del mismo id", () => {
    expect(youtubeThumbUrl("abc")).toBe(
      "https://i.ytimg.com/vi/abc/hqdefault.jpg",
    );
    expect(youtubeWatchUrl("abc")).toBe("https://www.youtube.com/watch?v=abc");
  });
});

describe("soundcloud", () => {
  it("manda la URL original codificada como parametro", () => {
    const url = new URL(
      soundcloudEmbedUrl("https://soundcloud.com/los-vecinos-de-enfrente"),
    );

    expect(url.hostname).toBe("w.soundcloud.com");
    expect(url.searchParams.get("url")).toBe(
      "https://soundcloud.com/los-vecinos-de-enfrente",
    );
    expect(url.searchParams.get("auto_play")).toBe("true");
  });
});
