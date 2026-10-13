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

const CONTROL_STYLE = {
  borderColor: "var(--line)",
  background: "rgb(255 255 255 / 0.02)",
};

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

  const isFiltered = query.trim().length > 0 || activeTag !== null;

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
        {/* text-base en mobile: por debajo de 16px iOS hace zoom al enfocar */}
        <input
          type="search"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder="buscar en las notas…"
          style={CONTROL_STYLE}
          className="w-full rounded-lg border px-4 py-2.5 font-mono text-base text-zinc-100 caret-accent outline-none transition-colors placeholder:text-zinc-600 focus:border-accent sm:text-sm"
        />
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => {
              const isActive = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  style={CONTROL_STYLE}
                  className={`rounded-full border px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.06em] transition-colors ${
                    isActive
                      ? "!border-accent text-accent"
                      : "hover:border-accent hover:text-accent"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p
        className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.16em]"
        style={{ color: "var(--faint)" }}
      >
        {filtered.length === posts.length
          ? `${posts.length} notas`
          : `${filtered.length} de ${posts.length} notas`}
        {totalPages > 1 && ` · página ${currentPage} de ${totalPages}`}
      </p>

      {filtered.length === 0 ? (
        <div
          className="mt-6 rounded-xl border border-dashed p-8 text-center"
          style={{ borderColor: "var(--line)" }}
        >
          <p className="text-zinc-300">No se encontraron notas con esos filtros.</p>
          <p className="mt-2 text-sm" style={{ color: "var(--faint)" }}>
            Prueba con otro texto o quita el tag.
          </p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col">
          {paged.map((post) => (
            // Misma gramatica que las entradas de la consola del hero: el
            // numero manda, el borde izquierdo se enciende y la fila se corre.
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group -ml-3 grid grid-cols-[3.4rem_1fr] gap-x-3 rounded-lg border-l-2 border-transparent py-5 pl-3 transition-all hover:border-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)] hover:pl-4 sm:grid-cols-[4.2rem_1fr]"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <span
                className="pt-1 font-mono text-sm transition-colors group-hover:text-accent"
                style={{ color: "var(--faint)" }}
              >
                #{post.number}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl font-semibold leading-tight tracking-[-0.01em] text-zinc-100 transition-colors group-hover:text-accent">
                  {post.title}
                </span>
                {post.summary && (
                  <span
                    className="mt-2 line-clamp-2 block text-sm leading-relaxed"
                    style={{ color: "var(--dim)" }}
                  >
                    {post.summary}
                  </span>
                )}
                <span
                  className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.68rem]"
                  style={{ color: "var(--faint)" }}
                >
                  <span>{post.formattedDate}</span>
                  {post.tags.length > 0 && <span aria-hidden="true">·</span>}
                  <span>{post.tags.join(" · ")}</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={CONTROL_STYLE}
            className="rounded-lg border px-3.5 py-2 font-mono text-xs tracking-[0.06em] text-zinc-300 transition-colors disabled:opacity-35 enabled:hover:border-accent enabled:hover:text-accent"
          >
            ← anterior
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={CONTROL_STYLE}
            className="rounded-lg border px-3.5 py-2 font-mono text-xs tracking-[0.06em] text-zinc-300 transition-colors disabled:opacity-35 enabled:hover:border-accent enabled:hover:text-accent"
          >
            siguiente →
          </button>
        </div>
      )}

      {isFiltered && filtered.length > 0 && (
        <p className="sr-only" aria-live="polite">
          {filtered.length} notas encontradas
        </p>
      )}
    </div>
  );
}
