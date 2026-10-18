import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/**
 * Notas publicadas, de la mas nueva a la mas vieja: el orden del listado.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * El numero `#N` de cada nota, por id.
 *
 * Se calcula en orden cronologico ASCENDENTE sobre las no-draft: la mas
 * antigua es la #1, asi que publicar una nota nueva no renumera las anteriores
 * y el numero no es un campo del frontmatter.
 *
 * Vive aca y no en cada pagina porque lo consumen cuatro rutas (el listado y
 * el detalle, en los dos idiomas) mas la consola del hero: si cada una lo
 * recalculara, un cambio de criterio tendria que replicarse a mano y los
 * numeros podrian divergir entre idiomas.
 */
export async function getPostNumbers(): Promise<Map<string, number>> {
  const published = await getCollection("blog", ({ data }) => !data.draft);
  const chronological = published.sort(
    (a, b) => a.data.date.valueOf() - b.data.date.valueOf(),
  );
  return new Map(chronological.map((post, index) => [post.id, index + 1]));
}
