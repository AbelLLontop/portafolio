import { useEffect, useMemo, useRef, useState } from "react";
import { interpolate } from "../../i18n/interpolate.ts";

export interface BlogListPost {
  slug: string;
  title: string;
  summary?: string;
  tags: string[];
  /** Día y mes abreviado ("12 oct"), para filas ya agrupadas por mes. */
  shortDate: string;
  /** Clave del mes ("2026-10") y su rótulo ("octubre de 2026"). */
  monthKey: string;
  monthLabel: string;
  number: number;
}

/**
 * Copy del listado, ya traducido. Llega por props y no importando el
 * diccionario: así el bundle del cliente lleva solo el idioma de la página.
 */
export interface BlogListStrings {
  "blog.searchLabel": string;
  "blog.searchPlaceholder": string;
  /** Lleva el marcador {total}. */
  "blog.count": string;
  /** Lleva los marcadores {shown} y {total}. */
  "blog.countFiltered": string;
  /** Lleva los marcadores {current} y {total}. */
  "blog.pageInfo": string;
  "blog.noResults": string;
  "blog.noResultsHint": string;
  "blog.prev": string;
  "blog.next": string;
  "blog.latest": string;
}

interface BlogListProps {
  posts: BlogListPost[];
  /** Base de los enlaces: `/blog` en español, `/en/blog` en inglés. */
  blogPath: string;
  strings: BlogListStrings;
}

const POSTS_PER_PAGE = 10;

const CONTROL_STYLE = {
  borderColor: "var(--line)",
  background: "rgb(255 255 255 / 0.02)",
};

export default function BlogList({ posts, blogPath, strings }: BlogListProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" lleva el foco al buscador, como en una consola o en un repositorio. Se
  // ignora si ya se está escribiendo en otro campo o si hay una tecla
  // modificadora, para no pisar atajos del navegador.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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

  // Las notas llegan de la más nueva a la más vieja, así que las de un mismo mes
  // son consecutivas: basta con abrir un grupo nuevo cuando cambia la clave.
  const groups: { key: string; label: string; items: BlogListPost[] }[] = [];
  for (const post of paged) {
    const last = groups[groups.length - 1];
    if (last && last.key === post.monthKey) last.items.push(post);
    else
      groups.push({
        key: post.monthKey,
        label: post.monthLabel,
        items: [post],
      });
  }

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
      {/* text-base en mobile: por debajo de 16px iOS hace zoom al enfocar. El
          buscador lleva el ">" de la consola del inicio y una tecla "/" que lo
          enfoca; el campo tiene fondo y borde propios para que se note. */}
      <label
        className="group/search flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors focus-within:border-accent"
        style={{
          borderColor: "color-mix(in srgb, var(--faint) 45%, var(--line))",
          background: "rgb(255 255 255 / 0.03)",
        }}
      >
        <span
          aria-hidden="true"
          className="font-mono text-base text-accent sm:text-sm"
        >
          &gt;
        </span>
        <input
          ref={searchRef}
          type="search"
          aria-label={strings["blog.searchLabel"]}
          aria-keyshortcuts="/"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          placeholder={strings["blog.searchPlaceholder"]}
          className="w-full bg-transparent font-mono text-base text-zinc-100 caret-accent outline-none placeholder:text-dim sm:text-sm"
        />
        <kbd
          aria-hidden="true"
          className="hidden shrink-0 rounded border px-1.5 py-0.5 font-mono text-micro transition-opacity duration-150 group-focus-within/search:opacity-0 sm:inline-block"
          style={{ borderColor: "var(--line)", color: "var(--faint)" }}
        >
          /
        </kbd>
      </label>

      {/* aria-live aqui y no en un bloque aparte: asi tambien se anuncia la
          busqueda sin resultados, no solo cuando quedan notas. */}
      <p
        aria-live="polite"
        className="mt-5 font-mono text-micro uppercase tracking-label"
        style={{ color: "var(--faint)" }}
      >
        {filtered.length === posts.length
          ? interpolate(strings["blog.count"], { total: posts.length })
          : interpolate(strings["blog.countFiltered"], {
              shown: filtered.length,
              total: posts.length,
            })}
        {totalPages > 1 &&
          ` · ${interpolate(strings["blog.pageInfo"], {
            current: currentPage,
            total: totalPages,
          })}`}
      </p>

      {filtered.length === 0 ? (
        <div
          className="mt-6 rounded-xl border border-dashed p-8 text-center"
          style={{ borderColor: "var(--line)" }}
        >
          <p className="text-zinc-300">{strings["blog.noResults"]}</p>
          <p className="mt-2 text-sm" style={{ color: "var(--faint)" }}>
            {strings["blog.noResultsHint"]}
          </p>
        </div>
      ) : (
        // La bitácora: un riel vertical con un punto por nota, agrupadas por mes.
        // Es el mismo lenguaje del índice de las notas y del HUD de altitud, y
        // la nota de más arriba es la más reciente.
        <div className="relative mt-2 before:absolute before:bottom-0 before:left-[7px] before:top-0 before:w-px before:bg-[var(--line)]">
          {groups.map((group, groupIndex) => (
            <section key={group.key} aria-label={group.label}>
              <h2 className="relative pb-1 pl-10 pt-8 font-mono text-micro uppercase tracking-label text-dim before:absolute before:left-[7px] before:top-[2.35rem] before:h-px before:w-6 before:bg-[var(--faint)]">
                {group.label}
              </h2>

              {group.items.map((post, index) => {
                // Solo en la primera página y sin búsqueda: con un filtro activo
                // la primera fila ya no es "la última nota".
                const isLatest =
                  groupIndex === 0 &&
                  index === 0 &&
                  currentPage === 1 &&
                  query === "";

                return (
                  // Nada cambia de tamaño ni de posición al pasar el cursor: solo
                  // color, brillo y fondo. La última nota se distingue en
                  // reposo por otra vía (tamaño, etiqueta y un punto que
                  // pulsa) y NO por el fondo ni el color del título, que son
                  // justo lo que cambia el hover: así los dos estados se leen
                  // distinto. Las filas no llevan filete: el riel y el aire ya
                  // las separan.
                  <a
                    key={post.slug}
                    href={`${blogPath}/${post.slug}`}
                    className="group relative grid grid-cols-[3.75rem_minmax(0,1fr)] gap-x-3 rounded-lg py-4 pl-10 pr-3 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-accent)_4%,transparent)] sm:grid-cols-[4.5rem_minmax(0,1fr)]"
                  >
                    {/* Punto sobre el riel, a la altura de la fecha. Hueco en
                        reposo; en hover se llena de acento con brillo. El de la
                        última nota va siempre lleno y con un anillo que pulsa,
                        como el punto de "abierto a oportunidades". */}
                    {isLatest && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[3px] top-[1.3rem] h-[9px] w-[9px] animate-ping rounded-full bg-accent opacity-50 motion-reduce:animate-none"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={`absolute left-[3px] top-[1.3rem] h-[9px] w-[9px] rounded-full border transition-all duration-200 group-hover:border-accent group-hover:bg-accent group-hover:shadow-[0_0_12px_var(--color-accent)] ${
                        isLatest
                          ? "border-accent bg-accent shadow-[0_0_12px_var(--color-accent)]"
                          : "bg-[var(--hull)]"
                      }`}
                      style={
                        isLatest ? undefined : { borderColor: "var(--faint)" }
                      }
                    />

                    {/* Marca de tiempo de la bitácora: día y número de nota. */}
                    <span
                      className="font-mono text-micro uppercase leading-5 tracking-label"
                      style={{ color: "var(--faint)" }}
                    >
                      <span className="block text-zinc-300 transition-colors duration-200 group-hover:text-accent">
                        {post.shortDate}
                      </span>
                      <span className="block">#{post.number}</span>
                    </span>

                    <span className="min-w-0">
                      {isLatest && (
                        <span className="mb-1.5 block font-mono text-micro uppercase leading-5 tracking-label text-accent">
                          {strings["blog.latest"]}
                        </span>
                      )}

                      {/* El mismo nombre lo lleva el <h1> del post (ver
                          BlogPostLayout.astro), así que el navegador lleva este
                          título hasta el otro al entrar a la nota. Va como estilo
                          y no con `transition:name` porque esto es una isla
                          React: la directiva es de Astro. El slug ya es único
                          por nota. */}
                      <span
                        style={{ viewTransitionName: `post-${post.slug}` }}
                        className={`block font-display font-semibold leading-tight tracking-[-0.01em] text-zinc-100 transition-colors duration-200 group-hover:text-accent ${
                          isLatest
                            ? "text-2xl md:text-3xl"
                            : "text-lg md:text-xl"
                        }`}
                      >
                        {post.title}
                      </span>

                      {post.summary && (
                        <span
                          className={`mt-2 block text-sm leading-relaxed ${
                            isLatest
                              ? "max-w-[75ch]"
                              : "line-clamp-2 md:line-clamp-1"
                          }`}
                          style={{ color: "var(--dim)" }}
                        >
                          {post.summary}
                        </span>
                      )}

                      {/* Las etiquetas solo en la última nota: en cada fila
                          sumaban una línea más de ruido. Siguen en la nota. */}
                      {isLatest && post.tags.length > 0 && (
                        <span
                          className="mt-2 block font-mono text-micro"
                          style={{ color: "var(--faint)" }}
                        >
                          {post.tags.join(" · ")}
                        </span>
                      )}
                    </span>
                  </a>
                );
              })}
            </section>
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
            className="rounded-lg border px-3.5 py-2 font-mono text-ui tracking-ui text-zinc-300 transition-colors disabled:opacity-35 enabled:hover:border-accent enabled:hover:text-accent"
          >
            {strings["blog.prev"]}
          </button>
          <button
            type="button"
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={CONTROL_STYLE}
            className="rounded-lg border px-3.5 py-2 font-mono text-ui tracking-ui text-zinc-300 transition-colors disabled:opacity-35 enabled:hover:border-accent enabled:hover:text-accent"
          >
            {strings["blog.next"]}
          </button>
        </div>
      )}
    </div>
  );
}
