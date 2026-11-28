import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// ---- Piezas compartidas por los perfiles (proyectos y experimentos) ---------
// Cada perfil se arma con secciones; una sección sin datos no se muestra. Así
// un proyecto puede tener "Flujo con Claude" y un experimento "Prompts" sin
// que el diseño cambie para cada uno.

/** Un paso del "cómo se hizo", con su apoyo opcional al costado. */
const step = (image: SchemaContext["image"]) =>
  z.object({
    title: z.string(),
    /** Uno o más párrafos. */
    text: z.array(z.string()).min(1),
    tools: z.array(z.string()).default([]),
    /** Lo que va al lado: una cita, un prompt, una imagen o un video. */
    quote: z.string().optional(),
    prompt: z.string().optional(),
    video: z
      .string()
      .regex(/^[\w-]{11}$/)
      .optional(),
    image: image().optional(),
    imageAlt: z.string().optional(),
  });

/** Un hito del lanzamiento: qué se logró y dónde (el logo sale de la URL). */
const milestone = z.object({
  title: z.string(),
  text: z.string(),
  url: z.url().optional(),
});

/** Un prompt real usado en el proceso. */
const prompt = z.object({
  title: z.string(),
  text: z.string(),
});

/** Línea corta para las listas (biblioteca, inicio). */
const tagline = z.string().max(70);

// Un proyecto es algo que construyo y se puede usar o leer el codigo (no una
// prueba creativa ni una nota). Como los experimentos, el cuerpo del .mdx es el
// texto de la pagina y lo demas va en el frontmatter para compartir diseno.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      /** "live" ya esta en uso; "building" sigue en construccion. */
      status: z.enum(["live", "building"]),
      /** Nombres tal cual los entiende TechBadge (react, astro, ...). */
      stack: z.array(z.string()),
      draft: z.boolean().default(false),
      cover: image(),
      coverAlt: z.string(),
      /** Ficha lateral: pares etiqueta/valor. */
      facts: z.array(z.object({ label: z.string(), value: z.string() })),
      repoUrl: z.url().optional(),
      liveUrl: z.url().optional(),
      tagline,
      /** Lo fija como "último lanzamiento" del inicio aunque haya otro más nuevo. */
      featured: z.boolean().default(false),
      /** Imagen ancha de la cabecera del perfil; sin ella, una tipográfica. */
      banner: image().optional(),
      bannerAlt: z.string().optional(),
      /** Portada cuadrada; sin ella se dibuja una con el nombre. */
      avatar: image().optional(),
      avatarAlt: z.string().optional(),
      /** Datos sueltos de la cabecera del perfil ("en producción", "Vercel"). */
      meta: z.array(z.string()).default([]),
      milestones: z.array(milestone).default([]),
      /** Cómo está hecho. */
      steps: z.array(step(image)).default([]),
      /** Cómo se trabaja en el repo (con Claude, ramas, CI). */
      flow: z.array(step(image)).default([]),
      prompts: z.array(prompt).default([]),
      /** Sus lanzamientos: versiones del proyecto. */
      versions: z
        .array(
          z.object({
            name: z.string(),
            date: z.string(),
            image: image().optional(),
            tag: z.string().optional(),
          }),
        )
        .default([]),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string(),
            wide: z.boolean().default(false),
          }),
        )
        .default([]),
    }),
});

// Un experimento es una prueba creativa con su propia pagina (no un producto
// ni una nota tecnica). El cuerpo del .mdx es el texto de la pagina; lo que
// lleva media (portada, videos, reproductor, enlaces) va en el frontmatter para
// que el diseno de la pagina sea el mismo en todos los experimentos.
const experiments = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/experiments" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()),
      /** Muestra el sello "hecho con IA" en la tarjeta y en la pagina. */
      ai: z.boolean().default(false),
      draft: z.boolean().default(false),
      banner: image(),
      avatar: image(),
      bannerAlt: z.string(),
      avatarAlt: z.string(),
      /** Ficha lateral: pares etiqueta/valor. */
      facts: z.array(z.object({ label: z.string(), value: z.string() })),
      links: z.array(z.object({ label: z.string(), url: z.url() })),
      tagline,
      /** Lo fija como "último lanzamiento" del inicio aunque haya otro más nuevo. */
      featured: z.boolean().default(false),
      meta: z.array(z.string()).default([]),
      /** Herramientas, para la línea "hecho con". */
      tools: z.array(z.string()).default([]),
      milestones: z.array(milestone).default([]),
      steps: z.array(step(image)).default([]),
      prompts: z.array(prompt).default([]),
      /** Canciones de la radio que pertenecen a este experimento (sus ids). */
      tracks: z.array(z.string()).default([]),
      /** Artista, disco, pista o lista de Spotify; se incrusta con un reproductor. */
      spotify: z
        .url()
        .refine(
          (url) => {
            const { hostname, pathname } = new URL(url);
            return (
              hostname === "open.spotify.com" &&
              /^\/(intl-[a-z]+\/)?(artist|album|track|playlist|show|episode)\/[\w]+/.test(
                pathname,
              )
            );
          },
          {
            message:
              "Tiene que ser una URL de open.spotify.com (artist, album, track…)",
          },
        )
        .optional(),
      /** Perfil o pista de SoundCloud; se incrusta con un reproductor. */
      soundcloud: z
        .url()
        .refine((url) => new URL(url).hostname === "soundcloud.com", {
          message: "Tiene que ser una URL de soundcloud.com",
        })
        .optional(),
      /** Videos de YouTube; solo el id de 11 caracteres. */
      videos: z
        .array(
          z.object({
            id: z.string().regex(/^[\w-]{11}$/),
            title: z.string(),
          }),
        )
        .default([]),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string(),
            /** Ocupa las dos columnas de la galeria. */
            wide: z.boolean().default(false),
          }),
        )
        .default([]),
    }),
});

// La radio del sitio: una lista propia, independiente de las páginas. Cada
// pista es un .md: el frontmatter trae los datos y el cuerpo es la letra en
// formato LRC ("[01:02.30] una línea"). Una pista sin audio queda bloqueada,
// salvo la intro, que suena en silencio con su letra.
const radio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/radio" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      artist: z.string().default("Los Vecinos de Enfrente"),
      /** Sin portada, la pista usa el cuadro rojo (la intro). */
      cover: image().optional(),
      coverAlt: z.string().default(""),
      /** Ruta del audio dentro de public/ ("/audio/dime-por-que.mp3"). */
      audio: z
        .string()
        .regex(/^\/audio\/[\w-]+\.(mp3|m4a|ogg|opus)$/)
        .optional(),
      /** La canción en Spotify: el sitio manda ahí para escucharla entera. */
      spotify: z
        .url()
        .regex(/^https:\/\/open\.spotify\.com\/track\/\w+$/)
        .optional(),
      /** Duración en segundos; con audio la mide el navegador. */
      duration: z.number().positive().optional(),
      /** Posición en la lista. */
      order: z.number(),
      /** La pista de bienvenida ("Quién soy"): suena sola al entrar. */
      intro: z.boolean().default(false),
    }),
});

export const collections = { projects, experiments, radio };
