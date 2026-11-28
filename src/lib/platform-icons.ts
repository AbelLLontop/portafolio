import githubIconRaw from "simple-icons/icons/github.svg?raw";
import soundcloudIconRaw from "simple-icons/icons/soundcloud.svg?raw";
import spotifyIconRaw from "simple-icons/icons/spotify.svg?raw";
import tiktokIconRaw from "simple-icons/icons/tiktok.svg?raw";
import youtubeIconRaw from "simple-icons/icons/youtube.svg?raw";

const withCurrentColor = (svg: string) =>
  svg.replace("<svg ", '<svg fill="currentColor" ');

// Mapa estático por dominio (los iconos de simple-icons se importan de forma
// explícita, igual que en tech-icons.ts). Se busca por el dominio de la URL y
// no por la etiqueta, que es texto libre del frontmatter.
const PLATFORM_ICONS: Record<string, string> = {
  "youtube.com": withCurrentColor(youtubeIconRaw),
  "soundcloud.com": withCurrentColor(soundcloudIconRaw),
  "spotify.com": withCurrentColor(spotifyIconRaw),
  "tiktok.com": withCurrentColor(tiktokIconRaw),
  "github.com": withCurrentColor(githubIconRaw),
};

// Color de marca de cada plataforma. Es la excepción a "un solo acento": el
// logo de un tercero se reconoce por su color, y solo se usa en el logo y en
// el hover de su propia tarjeta.
const PLATFORM_COLORS: Record<string, string> = {
  "youtube.com": "#ff0033",
  "soundcloud.com": "#ff5500",
  "spotify.com": "#1ed760",
  "tiktok.com": "#25f4ee",
  "github.com": "#e8e4da",
};

/** Color de marca de la plataforma de un enlace, o `null` si no se conoce. */
export function platformColor(url: string): string | null {
  return PLATFORM_COLORS[platformHost(url)] ?? null;
}

/** Dominio sin `www.` ni subdominios de un solo nivel como `open.`. */
export function platformHost(url: string): string {
  const parts = new URL(url).hostname.split(".");
  return parts.slice(-2).join(".");
}

/** SVG de la plataforma de un enlace, o `null` si no hay logo para ella. */
export function platformIcon(url: string): string | null {
  return PLATFORM_ICONS[platformHost(url)] ?? null;
}
