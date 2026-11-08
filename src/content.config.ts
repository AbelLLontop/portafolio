import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    githubUrl: z.url().optional(),
    liveUrl: z.url().optional(),
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

export const collections = { blog, projects, experiments };
