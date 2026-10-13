# Plan de implementación — Portafolio abelitolll.com

Fuente de verdad: `SPEC.md`. Deploy confirmado: **Vercel** (sitio estático, sin backend/DB) — por eso la estructura es un solo proyecto Astro en la raíz, sin monorepo ni carpetas backend/frontend separadas.

Cada feature es vertical (deja algo corriendo y verificable), no toca más de 8 archivos, y no incluye trabajo de features posteriores. Se ejecutan en este orden por dependencias.

## Estado

- [x] F1 — Scaffold mínimo que corre
- [x] F2 — Tailwind + layout base + dark mode
- [x] F3 — Header/Footer estáticos
- [x] F4 — Content Collections de blog + schema
- [x] F5 — Listado de blog
- [x] F6 — Página de post individual + syntax highlighting
- [x] F7 — Tech badges + selección de texto con accent
- [x] F8 — Hero estático + Wordmark (sin animación)
- [x] F9 — TerminalHero animado (isla React + Framer Motion)
- [x] F10 — Wordmark con tratamiento animado
- [x] F11 — Sección de proyectos (placeholder "en construcción")
- [x] F11b — TechMarquee: carrusel infinito de logos de stack
- [x] F12 — Sección de contacto + ScrollReveal
- [x] F13 — SEO + Analytics
- [x] F14 — Smoke tests E2E (Playwright)
- [x] F15 — Deploy a Vercel + dominio
- [x] F16 — Página "Sobre mí" + Hero/Terminal actualizados
- [x] F17 — Rediseño de la imagen OG + descripciones
- [x] F20 — Búsqueda, filtro por tag y paginación en el listado de blog
- [x] F21 — Capa de ambiente global (starfield, HUD de altitud, tipografía display)
- [x] F22 — Composición de la home (terminal con comandos, hero y secciones)
- [x] F23 — La terminal se comporta como una conversación con Claude

---

## F1 — Scaffold mínimo que corre

**Incluye:** `npm create astro` mínimo, `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` con un "Hola" estático, `.gitignore`.
**Excluye:** Tailwind, React, contenido, estilos, deploy.
**Verificación:** `npm run dev` sirve la página; `npm run build` compila sin errores.

## F2 — Tailwind + layout base + dark mode

**Incluye:** integración Tailwind, `tailwind.config.mjs`, `src/styles/global.css` (variable de color `accent`), `src/layouts/BaseLayout.astro` (head/meta mínimos, sin OG todavía), aplicar layout a `index.astro`.
**Excluye:** Header/Footer definitivos, SEO completo, OG image.
**Verificación:** `npm run build`; dark mode + accent aplicados visualmente.

## F3 — Header/Footer estáticos

**Incluye:** `src/components/layout/Header.astro`, `Footer.astro`, navegación mínima (Inicio/Blog), integrados en `BaseLayout.astro`.
**Excluye:** animaciones, menú mobile avanzado.
**Verificación:** `npm run build`; header/footer visibles en index y responsive básico en 375px.

## F4 — Content Collections de blog + schema

**Incluye:** `src/content/config.ts` (schema zod: título, fecha, tags, resumen opcional, `draft`), un post seed en `src/content/blog/` marcado `draft: true`.
**Excluye:** página de listado, página de post individual, syntax highlighting.
**Verificación:** `astro check` sin errores de schema.

## F5 — Listado de blog

**Incluye:** `src/pages/blog/index.astro`, `src/components/astro/BlogPostCard.astro` (básico, sin tech badges todavía).
**Excluye:** página de post individual, tech badges, syntax highlighting.
**Verificación:** `/blog` lista el post seed; el link apunta a la ruta del slug.

## F6 — Página de post individual + syntax highlighting

**Incluye:** `src/pages/blog/[slug].astro`, `src/layouts/BlogPostLayout.astro`, tema Shiki dark a medida.
**Excluye:** tech badges con logos, selección de texto coloreada.
**Verificación:** `astro check`; el post seed muestra fecha, contenido y código con highlighting.

## F7 — Tech badges + selección de texto con accent

**Incluye:** paquete `simple-icons`, `src/components/astro/TechBadge.astro`, aplicado en `BlogPostCard.astro` y `BlogPostLayout.astro`, CSS de `::selection` con color accent en `global.css`.
**Excluye:** proyectos, terminal, wordmark.
**Verificación:** build; badges con logos reales visibles; seleccionar texto resalta con accent.

## F8 — Hero estático + Wordmark (sin animación)

**Incluye:** sección hero en `index.astro`, `Wordmark` (versión estática, sin glitch), tipografía con personalidad definida.
**Excluye:** animación glitch, terminal.
**Verificación:** build; hero visible y legible en desktop y mobile.

## F9 — TerminalHero animado (isla React + Framer Motion)

**Incluye:** `src/components/react/TerminalHero.tsx` (typewriter loop, `motion` package), integración `@astrojs/react`, `client:load` (justificado: above-the-fold), reemplaza el placeholder de F8.
**Excluye:** interactividad real de comandos.
**Verificación:** manual/Playwright: la terminal termina su secuencia sin errores de consola.

## F10 — Wordmark con tratamiento animado

**Incluye:** efecto glitch/ruptura en las "L" de `Wordmark.tsx`, sutil y legible.
**Excluye:** cualquier otro cambio de hero.
**Verificación:** visual; legibilidad del nombre no se ve afectada.

## F11 — Sección de proyectos (placeholder "en construcción")

**Incluye:** `src/content/projects/` + actualización de schema en `config.ts`, `src/components/astro/ProjectCard.astro`, sección de proyectos en `index.astro` con placeholder de alta calidad visual y copy personal/casual.
**Excluye:** proyectos reales (no existen hoy).
**Verificación:** build; sección visible, no se siente "coming soon" plano.

## F11b — TechMarquee: carrusel infinito de logos de stack

**Incluye:** `src/lib/tech-icons.ts` (mapa de iconos simple-icons compartido, extraído de `TechBadge.astro`), `src/components/astro/TechMarquee.astro` (marquee CSS puro, sin JS, con loop infinito por `@keyframes`/`translateX`, pausa en hover, `prefers-reduced-motion`), insertado en `index.astro` entre `Hero` y `ProjectsSection`. Logos: Node.js, Go, Java, Python, .NET, Claude, React, Astro, Angular, Tailwind.
**Excluye:** AWS (sin logo de marca disponible en simple-icons), animación con JS/React.
**Verificación:** `astro check`; `npm run build`; visual en desktop y 375px sin overflow horizontal; loop sin salto visible; animación se detiene con `prefers-reduced-motion: reduce`.

## F12 — Sección de contacto + ScrollReveal

**Incluye:** sección de contacto (email/GitHub/LinkedIn) en `index.astro`, `src/components/react/ScrollReveal.tsx` (wrapper reutilizable), aplicado a proyectos/contacto.
**Excluye:** formulario de contacto.
**Verificación:** build; reveals on-scroll funcionan; links de contacto correctos.

## F13 — SEO + Analytics

**Incluye:** `src/lib/seo.ts`, meta tags/OG en `BaseLayout.astro`, `public/og-image.png`, sitemap, `@vercel/analytics`.
**Excluye:** RSS.
**Verificación:** build; preview de OG correcta; Lighthouse manual SEO ≥90.

## F14 — Smoke tests E2E (Playwright)

**Incluye:** setup mínimo de Playwright, 3 tests: home carga + terminal termina sin errores de consola, listado de blog sin 404, mobile viewport no rompe el header.
**Excluye:** tests unitarios de componentes visuales.
**Verificación:** `npx playwright test` pasa.

## F15 — Deploy a Vercel + dominio

**Incluye:** configuración de proyecto en Vercel, conexión DNS de `abelitolll.com`.
**Excluye:** CI formal.
**Verificación:** el sitio responde en `abelitolll.com`; Lighthouse manual en producción (Performance/Accessibility/SEO ≥90).

## F16 — Página "Sobre mí" + Hero/Terminal actualizados

**Incluye:** `src/pages/sobre-mi.astro` (resumen profesional breve: desarrollador de software, 3 años de experiencia, stack, apoyo en IA, arquitectura limpia/ágil, con el SVG de marca a la derecha del texto), nav actualizado en `Header.astro` (Inicio → Sobre mí → Blog), párrafo del Hero reescrito (`Hero.astro`), `TerminalHero.tsx` con nuevas preguntas ("¿quién eres?", "¿cómo trabajas?"), color tipo CLI por línea de respuesta (clave/valor/árbol) y pausas extendidas en las respuestas largas.
**Excluye:** foto personal, timeline de empleos (empresa/cargo/fechas), cálculo dinámico de años de experiencia.
**Verificación:** `npm run check`; `npm run build`; visual consistente en ancho (`max-w-3xl`) con el resto de páginas; `npx playwright test` pasa.

## F17 — Rediseño de la imagen OG + descripciones

**Incluye:** `scripts/generate-og-image.mjs` reescrito (wordmark con corrimiento cromático estático eco del glitch de `Wordmark.tsx`, subtítulo "Desarrollador de software" / "Blog personal y portafolio", SVG del cohete embebido, textura de puntos sutil, sin la barra de acento gruesa), `public/og-image.png` regenerado, `SITE_DESCRIPTION` en `src/lib/seo.ts` y el `title`/`description` de la home actualizados para reflejar el perfil real.
**Excluye:** `og:image:width/height/alt`, `twitter:site/creator`, uso del logo "head" (se usó el rocket).
**Verificación:** `npm run check`; `npm run build`; `npx playwright test`; revisión visual de `public/og-image.png`.

## F20 — Búsqueda, filtro por tag y paginación en el listado de blog

**Incluye:** `src/components/react/BlogList.tsx` (isla React `client:visible`: input de búsqueda por título/summary, pills de filtro por tag, paginación de 10 posts por página), `src/pages/blog/index.astro` actualizado para pasarle los posts ya serializados (slug/title/summary/tags/number/formattedDate). También se eliminó `src/components/astro/BlogPostCard.astro` (quedó sin uso) y la feature `dependsOn`/"Se basó en estos posts" (`src/content.config.ts`, `BlogPostLayout.astro`, `[slug].astro`, frontmatter de los posts de las series VPS/Docker) por generar relaciones contradictorias entre posts de técnicas distintas — cada post vuelve a ser independiente. Se agregó además un badge `#N` (numeración cronológica ascendente, calculada por fecha, no manual) al final del título de cada post, en `/blog` y en la página individual.
**Excluye:** búsqueda/filtro por fecha, orden configurable, backend o índice de búsqueda externo (todo es client-side sobre el array ya cargado).
**Verificación:** `npm run check`; `npm run build` (confirma que el listado completo sigue renderizado en el HTML estático para SEO/no-JS, con la búsqueda hidratando encima); revisión visual de búsqueda, filtro por tag y paginación en `/blog`.

## F21 — Capa de ambiente global (starfield, HUD de altitud, tipografía display)

**Incluye:** `src/components/react/decor/Starfield.tsx` (nuevo, reemplaza a `FloatingParticles.tsx`, que se elimina): estrellas con profundidad `z`, paralaje por puntero y por scroll, titileo, estrellas fugaces y trazos de *warp* cuando el scroll acelera, con pausa por `visibilitychange` y modo estático con `prefers-reduced-motion`. `src/components/astro/AscentHud.astro` (nuevo, Astro y no React porque el markup es estático): escalera con pip que sigue el % de scroll, altitud en km, nombre de fase y reloj; es el único dueño del progreso de scroll y lo publica como la custom property `--ascent`, que el `.veil` consume en CSS puro. `src/styles/global.css`: tokens de casco (`--line`, `--hull`, `--hull-2`, `--dim`, `--faint`, `--go`), `.veil`, `.section-label` (con la regla fina del `::after`), `.hull-grid`/`.hull-cell`/`.hull-panel`. `tailwind.config.mjs` + `BaseLayout.astro`: familia display Saira junto a JetBrains Mono. `Header.astro`/`Footer.astro` pasan a cristal para no tapar el starfield.
**Excluye:** composición interna de `/blog`, `/blog/[slug]` y `/sobre-mi` (solo heredan la capa global y la tipografía display en sus títulos); segundo color de marca (el acento sigue siendo uno, `--go` es solo estado).
**Verificación:** `npm run check`; `npm run build`; `npx playwright test`; capturas reales a 375/1280/1440/1920px — el HUD aparece desde 1280px y se oculta por debajo, sin overflow horizontal, `--ascent` llega a 1 y el veil baja a 0.15 de opacidad al final de la página, sin errores de consola.

## F22 — Composición de la home (terminal con comandos, hero y secciones)

**Incluye:** `src/components/react/TerminalHero.tsx` reescrito — conserva la máquina de estados del typewriter y el parseo de líneas de árbol, y añade chrome en cristal con sombra interior, cuerpo con scroll propio y autoscroll, tipos de línea coloreados (prompt/answer/system/ok/warn), input real y pills de atajo; `data-cycle-count` se mantiene como señal de "diálogo de apertura terminado" para el smoke test. `src/lib/profile.ts` (nuevo): `STACK` y `YEARS_OF_EXPERIENCE` como fuente única, ya consumida por `Hero.astro`, `StatsPanel.astro` y `sobre-mi.astro`. `Hero.astro`: eyebrow mono, wordmark intacto, titular display nuevo y las respuestas de los comandos derivadas del stack y de la colección de blog. `src/components/astro/StatsPanel.astro` (nuevo): rejilla de casco con datos reales del repo (experiencia, notas publicadas, series, tamaño del stack) y regla decorativa que crece en viewport — sin porcentajes de skill inventados. `TechMarquee`/`ProjectsSection`/`ContactSection`: etiquetas de sección, panel de cristal con anillo de órbita recortado y tarjetas de contacto con dot de estado. `index.astro`: inserta `StatsPanel` y el Hero deja de entrar con `ScrollReveal` (es above-the-fold).
**Excluye:** historial de comandos con flechas, autocompletado, comandos que naveguen o muten la página, y cualquier porcentaje de dominio por tecnología.
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (3/3); recorrido real de la consola en el navegador — `blog`, `stack`, un comando inválido, `help` y `clear` devuelven lo esperado con 0 errores de consola; capturas a 1440px y 375px sin overflow.

## F23 — La terminal se comporta como una conversación con Claude

**Incluye:** `src/components/react/TerminalHero.tsx` reescrito sobre una **única cola de trabajos**: el diálogo de apertura deja de ser un camino aparte y pasa a ser dos `Job` encolados, igual que un comando, de modo que todo atraviesa las mismas fases (`idle → typing-prompt → thinking → streaming → pausing`). De ahí salen las tres correcciones: los comandos también muestran `pensando…`; `busy` (fase distinta de `idle` o cola no vacía) deshabilita y atenúa input y pills, con lo que ya no es posible intercalar un comando encima del diálogo; y las respuestas dejan de ser `string[]` para volverse `Block[]` (`prose` que se escribe carácter a carácter con caret, `rows` clave/valor que aparecen fila a fila, `note` para avisos), renderizadas dentro de un bloque con regla lateral en acento. La alineación de las dos columnas la hace un grid `max-content 1fr`, no espacios dentro del texto: se eliminan `TREE_LINE_PATTERN` y `toAnswerLines()`. `src/components/astro/Hero.astro` arma los comandos como `Block[]` desde `src/lib/profile.ts` y la colección de blog (cada post es una fila `#N → título`). `tests/e2e/home.spec.ts` suma dos aserciones: input y pill `disabled` durante el intro y habilitados cuando `data-cycle-count` llega a `1`; su timeout sube a 30s.
**Excluye:** historial con flechas ↑/↓, autocompletado con Tab, comandos que naveguen o muten la página, y encolar comandos mientras la consola está ocupada (se bloquea, no se encola).
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (3/3). Recorrido real en el navegador: input y pills bloqueados durante el intro y liberados al terminar (10.6s, dentro del timeout), `pensando…` confirmado al lanzar un comando, y `blog`/`stack`/comando inválido/`clear` devolviendo lo esperado con 0 errores de consola. Capturas a 1440px y 375px: en mobile los valores largos envuelven dentro de su columna, sin overflow de página ni del cuerpo de la terminal.
