import { getCollection, type CollectionEntry } from "astro:content";

export type Experiment = CollectionEntry<"experiments">;

/**
 * Experimentos publicados, del mas nuevo al mas viejo: el orden del listado.
 * Los borradores no generan pagina ni salen en ningun lado.
 */
export async function getPublishedExperiments(): Promise<Experiment[]> {
  const items = await getCollection("experiments", ({ data }) => !data.draft);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
