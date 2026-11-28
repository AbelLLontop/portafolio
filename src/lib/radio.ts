import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import { parseLrc, type LyricLine } from "./lrc.ts";

/** El perfil de Los Vecinos en Spotify: adonde manda la radio. */
export const SPOTIFY_ARTIST =
  "https://open.spotify.com/artist/3rWmYBExk8Zsb7bDE3Tcpm";

/** Una pista tal como la recibe el reproductor (serializable). */
export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  /** URL de la portada ya optimizada, o null para el cuadro rojo. */
  cover: string | null;
  audio: string | null;
  /** La canción en Spotify, o null. */
  spotify: string | null;
  /** Segundos; con audio se reemplaza por lo que mide el navegador. */
  duration: number | null;
  intro: boolean;
  lines: LyricLine[];
}

/**
 * La lista de la radio, en orden. Se arma en el build: la letra llega ya
 * parseada y la portada ya reducida, así el cliente no hace nada de eso.
 */
export async function getRadioTracks(): Promise<RadioTrack[]> {
  const entries = await getCollection("radio");
  entries.sort((a, b) => a.data.order - b.data.order);

  return Promise.all(
    entries.map(async (entry) => {
      const { data } = entry;
      const cover = data.cover
        ? (await getImage({ src: data.cover, width: 160, format: "webp" })).src
        : null;

      return {
        id: entry.id,
        title: data.title,
        artist: data.artist,
        cover,
        audio: data.audio ?? null,
        spotify: data.spotify ?? null,
        duration: data.duration ?? null,
        intro: data.intro,
        lines: parseLrc(entry.body ?? ""),
      };
    }),
  );
}
