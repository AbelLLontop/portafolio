import { useMemo, useState } from "react";

export interface BlogListPost {
  slug: string;
  title: string;
  summary?: string;
  tags: string[];
  formattedDate: string;
  number: number;
}

interface BlogListProps {
  posts: BlogListPost[];
}

const POSTS_PER_PAGE = 10;

export default function BlogList({ posts }: BlogListProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) set.add(tag);
    }
    return [...set].sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        (post.summary?.toLowerCase().includes(normalizedQuery) ?? false);
      const matchesTag = activeTag === null || post.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [posts, query, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function toggleTag(tag: string) {
    setActiveTag((current) => (current === tag ? null : tag));
    setPage(1);
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="Buscar posts..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-accent"
        />
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isActive = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    isActive
                      ? "border-accent/40 text-accent"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-800 p-8 text-center">
          <p className="text-zinc-300">No se encontraron posts con esos filtros.</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-zinc-800">
          {paged.map((post) => (
            <div key={post.slug} className="py-6 first:pt-0">
              <a href={`/blog/${post.slug}`} className="group block">
                <h2 className="text-lg font-semibold text-zinc-100 transition-colors group-hover:text-accent">
                  {post.title}{" "}
                  <span className="font-mono text-accent">#{post.number}</span>
                </h2>
                <p className="mt-1 text-sm text-zinc-500">{post.formattedDate}</p>
                {post.summary && (
                  <p className="mt-2 text-sm text-zinc-400">{post.summary}</p>
                )}
              </a>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700 disabled:opacity-40 disabled:hover:border-zinc-800"
          >
            ← Anterior
          </button>
          <p className="text-sm text-zinc-500">
            Página {currentPage} de {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700 disabled:opacity-40 disabled:hover:border-zinc-800"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
