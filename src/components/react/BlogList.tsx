import { useMemo, useRef, useState } from "react";

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
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length === 0) return posts;

    // Solo digitos (con o sin el # que se ve en la fila): se busca la nota con
    // ese numero y nada mas. Si cayera al filtro de texto, "2" devolveria todo
    // lo que menciona PM2 en vez de la nota #2.
    const numericQuery = normalizedQuery.replace(/^#/, "");
    if (/^\d+$/.test(numericQuery)) {
      const wanted = Number(numericQuery);
      return posts.filter((post) => post.number === wanted);
    }

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(normalizedQuery) ||
        (post.summary?.toLowerCase().includes(normalizedQuery) ?? false),
    );
  }, [posts, query]);

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

  // Al cambiar de pagina el scroll se queda abajo y la pagina nueva aparece
  // fuera de vista, asi que se vuelve al inicio del listado.
  function goToPage(next: number) {
    setPage(next);
    topRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  return (
    // scroll-mt-24: el header es sticky, sin margen taparia la primera nota.
    <div ref={topRef} className="scroll-mt-24">
      {/* text-base en mobile: por debajo de 16px iOS hace zoom al enfocar */}
      <input
        type="search"
        aria-label="Buscar notas por título o número"
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
        placeholder="buscar por título o número…"
        style={CONTROL_STYLE}
        className="w-full rounded-lg border px-4 py-2.5 font-mono text-base text-zinc-100 caret-accent outline-none transition-colors placeholder:text-zinc-600 focus:border-accent sm:text-sm"
      />

      {/* aria-live aqui y no en un bloque aparte: asi tambien se anuncia la
          busqueda sin resultados, no solo cuando quedan notas. */}
      <p
        aria-live="polite"
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
          <p className="text-zinc-300">No se encontraron notas con esa búsqueda.</p>
          <p className="mt-2 text-sm" style={{ color: "var(--faint)" }}>
            Prueba con otras palabras.
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
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={CONTROL_STYLE}
            className="rounded-lg border px-3.5 py-2 font-mono text-xs tracking-[0.06em] text-zinc-300 transition-colors disabled:opacity-35 enabled:hover:border-accent enabled:hover:text-accent"
          >
            ← anterior
          </button>
          <button
            type="button"
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={CONTROL_STYLE}
            className="rounded-lg border px-3.5 py-2 font-mono text-xs tracking-[0.06em] text-zinc-300 transition-colors disabled:opacity-35 enabled:hover:border-accent enabled:hover:text-accent"
          >
            siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
