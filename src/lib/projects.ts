import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/**
 * Proyectos publicados, del mas nuevo al mas viejo: el orden del listado.
 * Los borradores no generan pagina ni salen en ningun lado.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  const items = await getCollection("projects", ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
