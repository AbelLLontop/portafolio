// URLs de los contenidos incrustados. Puro, para poder testearlo: lo que se
// arma aca termina en el `src` de un iframe, asi que un error es un video roto.

/** Miniatura de un video de YouTube, sin cargar el reproductor. */
export function youtubeThumbUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * El iframe usa el dominio `-nocookie`: no deja cookies de YouTube hasta que la
 * persona reproduce, y recien ahi se carga (ver EmbedFacade.astro).
 */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** Reproductor de SoundCloud para un perfil o una pista. */
export function soundcloudEmbedUrl(url: string): string {
  const params = new URLSearchParams({
    url,
    auto_play: "true",
    hide_related: "true",
    show_comments: "false",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}
