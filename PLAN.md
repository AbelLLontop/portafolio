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
- [x] F24 — Las respuestas de la consola llevan links reales
- [x] F25 — Entradas de blog en la consola, voz en primera persona y fechas en UTC
- [x] F26 — Tarjetas de contacto con logo y respuesta de proyectos enfocada
- [x] F27 — Rediseño del listado de notas
- [x] F28 — Rediseño de la página de post (tags, bloques de código e índice)
- [x] F29 — Rediseño de Sobre mí
- [x] F30 — Fuera el titular de la home y decoración orbital en Sobre mí
- [x] F31 — Fuera el filtro por tags del listado y los badges de los posts
- [x] F32 — Fuera el post seed y búsqueda por número de nota
- [x] F33 — Tratamiento tipográfico del post: bloques de código, tablas y progreso de lectura
- [x] F34 — Un solo progreso de lectura: fuera la barra superior y el índice deja de contradecirse
- [x] F35 — Menú de hamburguesa en mobile
- [x] F36 — Fuera el email de los canales de contacto
- [x] F37 — Copy en primera persona, sin tono de marca personal
- [x] F38 — Arreglo del índice del post y de los tests que quedaron huérfanos
- [x] F39 — Sitio bilingüe ES/EN (interfaz)

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

## F24 — Las respuestas de la consola llevan links reales

**Incluye:** el valor de una fila deja de ser solo texto y pasa a ser `RowValue` (`string` o `{ text, href, external }`), renderizado como un ancla de verdad en `TerminalHero.tsx`. Con eso, `contacto` entrega los tres destinos clickeables en vez de mandar a hacer scroll, `blog` convierte cada nota en un link a su post y suma una fila al listado completo, y `proyectos` ofrece el blog como siguiente paso. Los datos de contacto se mueven a `CONTACTS` en `src/lib/profile.ts`, de donde ahora leen tanto la consola como `ContactSection.astro` — antes las URLs estaban escritas dos veces.
**Excluye:** links dentro de los bloques de prosa, y comandos que naveguen solos sin que el visitante haga click.
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (3/3). En el navegador: lanzar `contacto`, `proyectos` y `blog` y volcar los 9 anclas con su `href` (mailto, GitHub, LinkedIn, cuatro posts y dos al listado), y hacer click en el primer post para confirmar que navega a su página real, con 0 errores de consola.

## F25 — Entradas de blog en la consola, voz en primera persona y fechas en UTC

**Incluye:** un bloque `entries` nuevo en `TerminalHero.tsx`: el comando `blog` deja de devolver títulos linkeados sueltos y pasa a mostrar entradas con número en acento, título, resumen recortado a dos líneas (`line-clamp-2`, porque los `summary` reales miden ~200 caracteres) y fecha, con toda la fila clickeable y un hover que enciende el borde izquierdo. El diálogo automático y las respuestas pasan a **primera persona**: la pregunta estaba en segunda ("¿quién eres?") y la respuesta en tercera ("Es Abel… Lleva 3 años"), y ese choque era lo que hacía ambiguo quién hablaba; el rótulo de la barra superior pasa de "claude · sesión con abelitolll" a "abel llontop · consola" para que sea coherente. Además `src/lib/dates.ts` (nuevo) centraliza el formato de fechas.
**Corrige:** **todas las fechas del sitio se mostraban un día antes.** El frontmatter (`date: 2026-10-12`) se parsea como medianoche UTC y `toLocaleDateString` lo renderizaba en la zona local; en Perú (UTC-5) caía al día anterior. Afectaba a `/blog`, a cada página de post y a la consola. `formatPostDate` y `formatPostDateShort` fijan `timeZone: "UTC"` y los tres lugares pasan a usarlas.
**Excluye:** tags dentro de las entradas de la consola, y cambiar el orden o la numeración de los posts (el `#N` cronológico no se toca; depende de `valueOf()`, que la zona horaria no alteraba).
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (3/3). En el navegador: volcado del diálogo de apertura confirmando la primera persona, las tres entradas del comando `blog` con su resumen y fecha, y el contraste antes/después de la fecha del post #13 (`2026-10-12` renderizaba "11 oct", ahora "12 oct 2026" en la consola y "12 de octubre de 2026" en la página del post).

## F26 — Tarjetas de contacto con logo y respuesta de proyectos enfocada

**Incluye:** un bloque `channels` nuevo en `TerminalHero.tsx`: `contacto` deja de devolver URLs linkeadas y pasa a mostrar tres tarjetas con el logo de marca, el nombre del canal y el handle debajo, con borde que se enciende en acento al pasar el mouse (una columna en mobile, tres desde `sm`). Los SVG se mueven a `src/lib/contact-icons.ts`, de donde ahora leen tanto la consola como `ContactSection.astro` — si no, el markup de los iconos quedaba escrito dos veces. La respuesta de `proyectos` deja de terminar derivando al blog: si preguntan por proyectos, se responde por proyectos, así que la prosa describe el vehiculo en construcción y las filas quedan en publicados / en construcción / estado.
**Excluye:** iconos de marca en otros bloques de la consola, y agregar canales de contacto nuevos (siguen siendo email, GitHub y LinkedIn, como fija `SPEC.md`).
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (3/3). En el navegador: lanzar `proyectos` y `contacto`, confirmar que la respuesta de proyectos ya no menciona el blog y que se renderizan los 3 SVG dentro de las tarjetas, con 0 errores de consola. A 375px las tarjetas se apilan sin overflow de página ni del cuerpo de la terminal.

## F27 — Rediseño del listado de notas

**Incluye:** `src/components/react/BlogList.tsx` conserva toda su lógica (filtro por texto y tag, paginación de 10) y cambia la presentación: buscador y pills con la misma forma que la consola del hero, cada post como una **entrada** (`#N` en acento, título en display, resumen a dos líneas, fecha y tags en mono) con el mismo gesto de hover que el bloque `entries` de la terminal — borde izquierdo encendido, tinte y corrimiento —, un contador de resultados que antes no existía, y paginación con botones de casco. `src/pages/blog/index.astro` suma `.section-label` y un lede.
**Excluye:** orden configurable, filtros por fecha, y cualquier indicio de relación entre notas.
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (4/4). En el navegador: buscar "docker" deja 4 entradas, filtrar por el tag `certbot` deja 1, y la paginación avanza a la página 2 de 2.

## F28 — Rediseño de la página de post (tags, bloques de código e índice)

**Incluye:** `src/layouts/BlogPostLayout.astro` gana la etiqueta `Nota #N`, **los badges de tecnología que faltaban** (hueco real contra Success Criteria de `SPEC.md`: pedía badges con logos en cada post y nunca se habían agregado) y un cierre con un único link `← volver a las notas`, sin anterior/siguiente ni notas relacionadas, respetando la regla de `CLAUDE.md` de que los posts son independientes. Un script envuelve cada `pre.astro-code` en un `.code-block` con barra superior: el lenguaje sale de `data-language` (que Shiki ya emite) y un botón **copiar** usa `navigator.clipboard`. `src/styles/global.css` adapta `.prose-post-body` a la paleta (h2/h3 en display, `pre`, `blockquote`, `hr`, links) y el índice lateral. `TechBadge.astro` gana una variante de tamaño.
**Corrige:** el índice lateral se quedaba pegado en un heading durante miles de píxeles. El `IntersectionObserver` con `rootMargin: "-120px 0px -70% 0px"` deja zonas muertas: en secciones largas ningún heading cae en la banda y el activo nunca se actualizaba. Se reemplaza por el cálculo directo del último heading por encima del borde inferior del header sticky, con guard de `requestAnimationFrame`. El scroll suave al hacer click no se toca.
**Excluye:** el contenido de los `.mdx`, el schema de `content.config.ts` y el tema de Shiki.
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (4/4, con una aserción nueva en `blog.spec.ts` para los tags del post). En el navegador: los 4 tags aparecen en la cabecera, las barras de código muestran el lenguaje correcto (`JS`, `DOCKERFILE`, `YAML`…), el botón deja el código en el portapapeles (leído de vuelta con permiso `clipboard-read`) y el índice sigue el heading correcto a lo largo de siete posiciones de scroll.

## F29 — Rediseño de Sobre mí

**Incluye:** `src/pages/sobre-mi.astro` pasa a etiquetas de sección, suma un panel **"Cómo trabajo"** en `.hull-grid` y muestra el stack en badges con logo (variante `md`). Los datos de "cómo trabajo" estaban escritos a mano dentro de `DEFAULT_EXCHANGES` en `TerminalHero.tsx`; se mueven a `WORK_APPROACH` en `src/lib/profile.ts`, de donde ahora leen la página y la consola — mismo patrón que `STACK`, `CONTACTS` y `CONTACT_ICONS`.
**Excluye:** foto personal y timeline de empleos, que `SPEC.md` prohíbe explícitamente.
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (4/4); capturas a 1440px y 375px de las tres páginas, sin overflow horizontal y con el HUD lateral oculto en mobile.

## F30 — Fuera el titular de la home y decoración orbital en Sobre mí

**Incluye:** se elimina el titular display de `Hero.astro` ("Software que aguanta producción / Y las notas de cómo llegó ahí"): decía lo mismo que el párrafo de abajo y que la primera respuesta de la consola, y su registro era el de una propuesta de valor, que no corresponde a una página personal que no ofrece un servicio. El párrafo se mantiene tal cual. **El `<h1>` pasa a ser el wordmark**, que era el único encabezado que quedaba y además es lo semánticamente correcto en una página personal. Con eso la consola sube y entra completa en un viewport de 950px (de `y 375` a `y 935`), cuando antes empezaba recién cerca de los 600px.

El tratamiento display se reubica en `src/pages/sobre-mi.astro`, donde una declaración personal sí corresponde: titular a ancho completo ("Escribo lo que construyo. / Y también lo que se rompe.") y, al lado de la bio, una **decoración orbital** — dos anillos girando en sentidos opuestos (el interior punteado) con un cuerpo luminoso cada uno, un resplandor que respira detrás del SVG de marca y el propio SVG flotando. Todo CSS, sin assets nuevos ni JavaScript, y anulado bajo `prefers-reduced-motion`.
**Excluye:** tocar el texto de la consola, el starfield, el HUD y el cohete del cursor.
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (4/4). En el navegador: el `h1` de la home es `abelitolll`, la consola entra completa en 950px de alto, y Sobre mí se revisa a 1440px y 375px sin overflow horizontal ni errores de consola.

## F31 — Fuera el filtro por tags del listado y los badges de los posts

**Incluye:** `BlogList.tsx` pierde las pills de tag y todo su estado (`activeTag`, `allTags`, `toggleTag`): con 21 tags ya ocupaban dos filas bajo el buscador y crecían con cada post publicado. Queda el buscador por título y resumen, el contador y la paginación. `BlogPostLayout.astro` pierde los badges de tecnología de la cabecera y su import de `TechBadge` (que sigue usándose en `/sobre-mi`). Los `tags` del frontmatter se siguen mostrando como metadata en las filas del listado, que pasa a ser su único uso visible.
**SPEC.md:** las dos cosas estaban escritas en el spec, así que se reescribieron con aprobación explícita — la línea 27 y los dos Success Criteria que prometían "filtro por tag" y "badges de tecnología con logos", más la descripción de `BlogList.tsx` en Project Structure. Se eliminó también el test que verificaba los badges, agregado en F28.
**Excluye:** quitar los `tags` del schema de `content.config.ts` o del frontmatter de los posts.
**Verificación:** `npm run check`; `npm run build`; `npm run lint`; `npx playwright test` (3/3). En el navegador: en `/blog` no queda ninguna pill de tag, buscar "droplet" deja 2 de 13 notas y una búsqueda sin resultados muestra el estado vacío; en un post no hay badges y los 20 bloques de código con su barra siguen intactos, con 0 errores de consola.

## F32 — Fuera el post seed y búsqueda por número de nota

**Incluye:** se elimina `src/content/blog/post-seed.mdx`, que seguía con `draft: false` y por tanto publicado: aparecía en el listado, tenía URL propia, estaba en el sitemap y contaba como nota (13 en vez de 12, también en la consola del hero). Su propio cuerpo decía ser contenido de prueba. El `#N` se recalcula solo por fecha, así que no hubo que tocar código. `BlogList.tsx`: si la consulta son solo dígitos (con o sin el `#` que se ve en la fila) se busca la nota con ese número exacto en vez de pasar por el filtro de texto — escribir `2` devolvía antes todo lo que menciona PM2 en el título; el placeholder pasa a "buscar por título o número…" para que el número se note. Los botones de paginar vuelven al inicio del listado (`scrollIntoView` con `scroll-mt-24` por el header sticky, y `behavior: "auto"` con `prefers-reduced-motion`): antes se quedaba el scroll abajo y la página nueva aparecía fuera de vista. El input gana `aria-label` (antes solo tenía `placeholder`) y el `aria-live` se mueve al contador, que ya existía: así también se anuncia la búsqueda sin resultados, que el bloque `sr-only` anterior se perdía por estar condicionado a tener notas. `tests/e2e/blog.spec.ts` suma un test del buscador.
**SPEC.md:** se reescribieron con aprobación explícita la línea 27 (la búsqueda es por texto sobre título y resumen, o por número; y se deja escrito que nunca recorre el cuerpo de los posts, para que el peso del listado no dependa de la longitud de lo que se escribe), el Success Criteria del listado (busca por número y vuelve al inicio al paginar), la descripción de `BlogList.tsx` en Project Structure y la decisión del post seed, que ya se cumplió.
**Excluye:** que el buscador mire los `tags` (se evaluó y se descartó: los tags del frontmatter no son el vocabulario con el que el autor recuerda sus notas); subir `POSTS_PER_PAGE` (se evaluó y se descartó: 10 es un límite razonable y el número mayor era igual de arbitrario); nada más del listado: el orden descendente se mantiene (agrupar las series chocaría con que los posts son independientes).
**Verificación:** `npm run check`; `npm run lint`; `npm run build` (15 páginas, una menos: se fue `/blog/post-seed/`, ya no está en el sitemap); `npx playwright test` (4/4). En el navegador, contra la página real: `7` → solo `#7`; `#3` → solo `#3`; `2` → solo `#2`, no las notas que dicen PM2; `99` y `0` → estado vacío; `docker` → 4 de 12; `pg_dump` → la nota `#6`, que lo tiene en el resumen y no en el título.

## F33 — Tratamiento tipográfico del post: bloques de código, tablas y progreso de lectura

**Incluye:** `global.css` reescribe el cuerpo del post, que era el mínimo para que el contenido se leyera y nada más. El bloque de código deja de ser un recuadro con la palabra "copiar": la barra superior lleva un punto de color por lenguaje y la etiqueta, y el botón pasa a ser solo icono (portapapeles → check, con el texto en un globo `data-tip` y `aria-label`), medio transparente hasta que el puntero entra al bloque y siempre visible donde no hay hover. El `<pre>` ya trae desde el CSS el marco, el degradado, el hueco de la barra y la barra de scroll fina, así que el bloque no cambia de alto cuando el script lo envuelve — antes el alto lo ponía el wrapper y los 20 bloques saltaban al cargar. Las tablas, que no tenían **ninguna** regla y salían con el estilo por defecto del navegador, pasan a un marco con cabecera mono en versalitas, hover de fila y scroll propio (`.table-wrap`). Además: barra de progreso de lectura y espinazo del índice alimentados por el `--ascent` que ya escribe `AscentHud` (cero JS nuevo), pip en el ítem activo del índice, ancla `#` por heading sobre los ids que ya genera Astro, `scroll-margin-top` para que el header sticky no tape el destino, `h2` con regla y marca de acento, primer párrafo más claro (no más grande), viñetas en rombo de acento, `blockquote` como panel y código en línea con borde teñido. La cabecera cambia el eyebrow por un chip "Nota #N". `tests/e2e/blog.spec.ts` suma un test de la barra, el botón de icono y el marco de las tablas.
**Escala tipográfica:** el post se mantiene en la del resto del sitio y no inventa tamaños. Un primer intento agrandó la prosa a 17px y bajó el código a 12.8px, así que la nota quedó con una escala propia, más grande que `/`, `/sobre-mi` y `/blog` en el cuerpo y más chica que todas en el código. Corregido: cuerpo en `text-base` (16px, igual que las otras páginas), código, tablas e índice en `text-sm` (14px, igual que el resumen de cada fila del listado) y micro-etiquetas mono en `text-[0.68rem]`, el tamaño que ya usaba `.section-label`. El índice deja de tener dos tamaños propios: la profundidad la marca la sangría. De paso se arregló que el código en línea, medido en `em`, también se aplicaba dentro del `<pre>` y encogía cada bloque a 12px.
**Excluye:** mover el armado de los bloques a un plugin rehype en build (Astro 7 deprecó `markdown.rehypePlugins` y pedía instalar `@astrojs/markdown-remark` y cambiar el procesador: desproporcionado, y el salto de alto ya se resolvió desde el CSS); navegación anterior/siguiente entre notas (chocaría con que los posts son independientes, sin indicios de serie); tocar el tema de Shiki, el `.mdx` de los posts o el listado.
**Verificación:** `npm run check` (0 errores); `npm run lint`; `npm run build` (15 páginas); `npx playwright test` (5/5). Contra la página real servida: 20 bloques envueltos con su lenguaje, el botón sin texto y con `aria-label`, la única tabla dentro de `.table-wrap`, y a 375px el post no genera scroll horizontal.

## F34 — Un solo progreso de lectura: fuera la barra superior y el índice deja de contradecirse

**Incluye:** F33 dejó el progreso de scroll dicho tres veces a la vez — la barra fija de 2px arriba de todo, el riel de altitud del HUD y el espinazo del índice — con la misma animación en los tres. Se elimina la barra superior (`.post-progress`, su markup en `BlogPostLayout.astro` y sus dos reglas en `global.css`: no queda código muerto). Y el espinazo del índice medía el scroll de la página (`--ascent`) mientras el pip marcaba la sección activa: dos cosas distintas dibujadas sobre la misma línea de 1px, que se separaban entre −33px y +53px según lo desparejas que fueran las secciones, y se leía como si una de las dos fallara. Ahora `TableOfContents.astro` escribe `--toc-fill` con el centro del ítem activo y el espinazo crece hasta ahí: miden lo mismo y el desfase es 0px en todo el recorrido. Se recalcula en `resize`, porque los títulos largos pasan de una a dos líneas al cambiar el ancho. El título del índice pierde el `-ml-3`, que anulaba el `pl-3` del contenedor y lo dejaba pegado encima de la línea; con `pl-0.5` arranca en la misma vertical que los ítems (15px). Y se arregla un fallo que venía de F28 y que el pip volvió visible: con la página al fondo, el último heading sigue por debajo del umbral (abajo no queda una pantalla entera de contenido), así que **la última sección no se marcaba nunca en ningún post** — comprobado en `docker-01` ("2.2. Levanta todo") y en `vps-03` ("2.6. Arranca"); si el scroll llegó al fondo, ahora el último heading pasa a activo. `tests/e2e/blog.spec.ts` suma un test de las dos cosas del índice.
**Excluye:** tocar el riel de altitud del HUD, que es el único indicador de progreso de scroll que queda y es global al sitio; quitar el espinazo del índice (se evaluó: midiendo el ítem activo queda consistente sin perder la guía visual); el cálculo del heading activo fuera del caso del fondo de página.
**Verificación:** `npm run check` (0 errores); `npm run lint`; `npm run build` (15 páginas); `npx playwright test` (6/6). Medido contra la página servida: `.post-progress` no existe en el DOM ni en el build; desfase punta/pip de 0px a 10, 25, 40, 55, 70, 85 y 100% del scroll (antes −33px a +53px); al fondo queda activa la última sección en los dos posts donde se comprobó el fallo; y el título del índice arranca a 15px de la línea, igual que los ítems (antes 0px, encima de ella).

## F35 — Menú de hamburguesa en mobile

**Incluye:** `Header.astro` era `flex-wrap`, así que en pantallas chicas los tres links se iban a una segunda fila y el header pasaba de 64px a ~110px. Como es `sticky`, ese alto extra tapaba el contenido de la nota y el post se volvía difícil de leer. Ahora, por debajo de 640px, la navegación vive detrás de un botón de hamburguesa y el panel se abre en `position: absolute` bajo la barra: la barra se queda siempre en una fila de 64px y el panel se superpone en vez de empujar. El panel se cierra al tocar fuera y con `Escape`, el botón lleva `aria-expanded`/`aria-controls` y su `aria-label` alterna abrir/cerrar, y las tres barritas se convierten en una X. La visibilidad del botón y del panel se resuelve con media queries dentro del `<style>` con scope y no con `sm:hidden`: el estilo con scope de Astro agrega una clase más y le gana en especificidad a la utilidad de Tailwind, que es por qué el botón y los links se veían a la vez a 640px. `tests/e2e/mobile.spec.ts` comprueba el alto del header con el menú abierto y cerrado, y el cierre con `Escape`.

**Excluye:** el header sticky del post, que se queda tal como lo dejó F34. Se probaron dos alternativas al salto de contenido que da al encogerse y las dos se descartaron por cómo quedaban: reservar el hueco con altos medidos y `margin-bottom` compensatorio (el cuerpo no se movía, pero quedaba un hueco vacío entre el header encogido y el texto, muy visible con scroll lento) y reemplazarlo por una barra fija aparte que aparece al perder de vista el header. También quedan fuera el breakpoint del resto del sitio y el índice lateral, que sigue oculto bajo `lg`.

**Verificación:** `npm run check` (0 errores); `npm run lint`; `npm run build` (15 páginas); `npx playwright test`. Medido contra la página servida a 375px: el header mide 64px con el menú cerrado y con el menú abierto, `Escape` lo cierra y no queda scroll horizontal.

## F36 — Fuera el email de los canales de contacto

**Incluye:** el correo electrónico deja de publicarse en el sitio por privacidad. Se elimina la entrada `email` de `CONTACTS` en `src/lib/profile.ts` — el único lugar donde vivía el valor real, como `display` y como `href: mailto:` — y con ella sale de `Contact["key"]`, de `mailIcon` en `src/lib/contact-icons.ts` (que existía solo para ese canal) y por tanto de los dos consumidores sin tocarlos: `ContactSection.astro` y las tarjetas de `channels` de la consola, que iteran la lista. En `Hero.astro` la prosa de `contacto` decía "los tres van directo desde esta consola" y pasa a "los dos". Quedan GitHub y LinkedIn, ambos `external`.
**SPEC.md:** se reescribieron con aprobación explícita la línea 23 (contacto es solo GitHub + LinkedIn, y queda escrito que el correo no se publica por privacidad), la línea de "Preguntar primero" y la de "Nunca" sobre datos personales (el correo pasa de dato acordado a dato excluido) y el Success Criteria de la home.
**Excluye:** formulario de contacto u otro canal nuevo en reemplazo del correo; ofuscar el correo en JS en vez de quitarlo (se evaluó y se descartó: un scraper que ejecute JS lo lee igual, así que no es privacidad real); reescribir las entradas históricas F12, F24 y F26 de este plan, que describen lo que se construyó entonces.
**Verificación:** `npm run check`; `npm run lint`; `npm run build`; `npx playwright test`. Contra el build: ni `mailto:` ni la dirección aparecen en ningún archivo de `dist/`, y la sección de contacto y el comando `contacto` renderizan dos canales.

## F37 — Copy en primera persona, sin tono de marca personal

**Incluye:** reescritura del copy que vendía una imagen en vez de describir lo que hay. En la consola (`src/components/react/TerminalHero.tsx`) el diálogo de apertura queda en un solo intercambio: "¿quién eres?" responde con la frase que dio el autor ("Me dedico a construir sistemas, aprender y divertirme en el camino") y una fila `stack` con `node · go · python · react · aws`; se eliminan la fila `experiencia · 3 años` y el intercambio "¿cómo trabajas?" completo, y con él `WORK_APPROACH` en `src/lib/profile.ts`, que era su único consumidor. En el comando `whoami` (`src/components/astro/Hero.astro`) la fila `hago` pasa a "aplicaciones, soluciones y sistemas", salen las filas `se me da bien` y `escribo`, y en su lugar va un párrafo sobre investigar, resolver y compartir lo que aprende. El comando `stack` pierde las filas `además` (`pm2 · certbot · ufw · docker compose`) y `despliegue` (`vercel · digitalocean`), que se habían deducido de los posts y no son del autor. La bajada del listado de notas (`src/pages/blog/index.astro`) deja de hablar de "lo que se rompió". En Sobre mí (`src/pages/sobre-mi.astro`) el titular pasa de "Escribo lo que construyo / Y también lo que se rompe" a presentarse por nombre, y el cuerpo queda en dos párrafos: la curiosidad por aprender, y la trayectoria sin cifra de años — con el grado de bachiller en Ingeniería de Sistemas e Informática y la IA planteada como velocidad, no como capacidad. Por eso `YEARS_OF_EXPERIENCE` sale del import de esa página; la constante sigue viva porque la usa el `whoami`.
**SPEC.md:** sin cambios. El spec no fija ninguno de estos textos; solo pide tono personal/casual para el copy (línea 232), que es justo lo que este cambio refuerza.
**Excluye:** el párrafo bajo el wordmark de la home ("Construyo con apoyo de herramientas de IA y dejo notas técnicas en el camino — cada paso, incluyendo lo que se rompió"), que se probó reescrito y se volvió al original a pedido explícito; el copy de "en construcción" y el de contacto, que ya están en ese tono y los confirma el spec; la poda de `STACK` (Java, Spring Boot, .NET y Angular siguen listados, pendientes de revisión del autor); la cifra de años en la prosa del `whoami`; la descripción del sitio, que sigue en revisión; y los posts del blog, cuyo texto es del autor.
**Verificación:** `npm run check` (0 errores); `npm run lint` (sin findings); `npm run build` (15 páginas); `npx playwright test --workers=1` → 7 pasan y falla `blog.spec.ts:107` ("la barra compacta del post aparece sin mover el contenido"), que ya fallaba igual en `main` antes de este cambio y no toca copy.

## F38 — Arreglo del índice del post y de los tests que quedaron huérfanos

**Incluye:** `83b365f` (título sticky) reemplazó `.post-bar` / `.post-bar-panel` por `.post-title` + `.is-stuck`, pero solo tocó `src/layouts/BlogPostLayout.astro` y dejó dos referencias atrás. En `src/components/astro/TableOfContents.astro` el `querySelector(".post-bar")` devolvía `null`, así que `topOffset()` siempre caía en `NAV_HEIGHT = 64` y, con el título pegado (que mide más que eso), un clic en el índice dejaba el heading destino tapado detrás de la banda; ahora mide `.post-title` cuando tiene `is-stuck`. En `tests/e2e/blog.spec.ts` el test de la barra apuntaba a un selector inexistente y fallaba como "element not found", lo que tapaba el bug real: se reapunta a `.post-title` / `.is-stuck` y se agrega un assert de que el número de nota solo aparece encogido. El test del buscador tenía una carrera de hidratación —`input.fill()` corría antes de que hidratara la isla `client:visible`, React montaba con su estado vacío y pisaba lo tipeado, así que el filtro nunca se aplicaba—; ahora espera a que Astro le quite el atributo `ssr` a la isla, que es el instante exacto en que termina de hidratar. Se agrega un test del índice con el título ya pegado, que es el caso que cubre la corrección.

**SPEC.md:** sin cambios. El spec no describe el mecanismo del título sticky a este nivel.

**Excluye:** el corrimiento del contenido. El título es `position: sticky`, así que sigue ocupando su lugar en el flujo y al encogerse (81 px → 45.3 px, medido en Chromium a 1440×1000) arrastra todo lo que viene después 35.7 px hacia arriba — contra la intención explícita de `de015bc`. Se decidió dejarlo y documentarlo: los dos tests lo afirman como relación (`corrimiento ≈ encogido`) en vez de un número fijo, con un comentario `DEUDA CONOCIDA`, para que sigan sirviendo si cambia el tamaño de la banda. Por lo mismo, saltar desde arriba con un link del índice todavía deja el heading tapado: el offset se calcula al hacer clic, cuando el título aún mide grande. El arreglo pendiente es reservar el hueco del `<h1>` para que el encogido no refluya.

**Verificación:** `npx playwright test` → 9 pasan (el baseline antes de este cambio era 6 pasan / 2 fallan); `npm run check` (0 errores); `npm run lint` (sin findings).

## F39 — Sitio bilingüe ES/EN (interfaz)

**Incluye:** el sitio pasa a ser bilingüe con **i18n nativo de Astro** para el ruteo y un diccionario propio para la interfaz. `astro.config.mjs` gana el bloque `i18n` (`locales: ["es","en"]`, `defaultLocale: "es"`, `prefixDefaultLocale: false`) y `sitemap()` su opción `i18n`, que emite los `xhtml:link` entre versiones. El español no se mueve (`/`, `/blog`, `/blog/<slug>` quedan igual: sin redirects, sin perder lo indexado) y el inglés vive en `src/pages/en/` con slugs traducidos (`/sobre-mi` ↔ `/en/about`).

Todo el copy de la interfaz se concentra en `src/i18n/ui.ts`: los `.astro` y `.tsx` ya no llevan texto suelto. El diccionario inglés se declara como `Record<UIKey, string>` sobre las claves del español, así que olvidar una traducción rompe `astro check` en vez de dejar un hueco en producción. `src/i18n/routes.ts` es el mapa de rutas por idioma y alimenta tres cosas a la vez: la navegación, el botón ES/EN y los `hreflang`. `src/i18n/interpolate.ts` queda aparte de `index.ts` a propósito: lo usan las islas React, y tomarlo de `index.ts` arrastraría el diccionario completo (los dos idiomas) al bundle del cliente.

El cuerpo de cada página se extrae a `src/components/pages/*Body.astro` con `lang` como prop, y los archivos de `src/pages/**` quedan como envoltorios de ~10 líneas, así que las dos versiones comparten el markup. El botón ES/EN del nav lleva a *la misma* página en el otro idioma —desde `/blog/mi-post` cae en `/en/blog/mi-post`, no en el inicio— y nombra cada idioma en su propio idioma ("English", "Español") con `lang` y `hreflang` en el enlace, que es la convención del W3C para un selector de idioma. El `<html lang>` y el `og:locale` dejan de estar fijos, y se agregan los `hreflang` (es, en, x-default) que antes faltaban. Las islas (`TerminalHero`, `BlogList`) reciben su copy por props vía `pickStrings`, no importando el diccionario. El copy que vive dentro de `<script>` de cliente (etiquetas del menú, fases del HUD, botón de copiar, anclas de heading) viaja por atributos `data-*`, no con `define:vars`, para que esos scripts sigan empaquetados y tipados.

Los comandos de la consola se traducen: en `/en` se teclea `projects` y `contact` (`whoami`, `stack`, `help` y `clear` ya eran inglés). Los posts `.mdx` **no** se traducen y el esquema de la colección no cambia; en la versión inglesa se avisa con una línea sobria en el listado y bajo la fecha del post. De paso se eliminan tres duplicaciones que con i18n se habrían vuelto cuádruples: la numeración `#N` (estaba copiada en `blog/index.astro` y en el `getStaticPaths` de `[slug].astro`, ahora sale de `src/lib/posts.ts` y por eso no puede divergir entre idiomas), la lista de nav (Header y Footer, ahora desde `routes.ts`) y el sufijo `— abelitolll` del título (tres páginas, ahora `pageTitle()` en `src/lib/seo.ts`).

**SPEC.md:** reescritos los dos lugares que esto desactualiza —la línea de *Idioma* en Boundaries y la Open Question 5, que decían "español únicamente" y "sin preparar estructura de carpetas/rutas para inglés"—, más `src/i18n/`, `src/components/pages/`, `src/pages/en/`, `lib/posts.ts` y `lib/dates.ts` en Project Structure. Aprobado antes de implementar.

**Excluye:** traducir los posts (sería `src/content/blog/{es,en}/` más un campo de idioma en el esquema, y cambiaría la numeración `#N` y cómo se crea un post); la detección automática del idioma del navegador, que necesita SSR porque `Astro.preferredLocale` no existe en páginas prerenderizadas, mientras el sitio es estático por decisión del spec; y el `og:type`, que sigue siendo `"website"` incluso en los posts (debería ser `"article"`) — bug previo, ajeno a i18n.

**Verificación:** `npm run check` (0 errores, 51 archivos); `npm run lint` (sin findings); `npm run build` (30 páginas, el doble de 15: existen `dist/en/index.html`, `dist/en/about/`, `dist/en/blog/` y un `dist/en/blog/<slug>/` por post). Sobre el build se verificó que el `hreflang` autorreferente coincide **exacto** con el canonical, barra final incluida, en las dos versiones de cada página —si no, Google puede descartar el grupo de alternates completo—; eso obligó a normalizar la barra en `buildSeoMeta`, porque el canonical sale de `Astro.url` (que en el build la lleva) y los paths del mapa de rutas no. `npx playwright test` → **20 pasan**: las 9 españolas sin tocar (la red de seguridad de que el español no se movió) más 11 nuevas en `tests/e2e/i18n.spec.ts`, que cubren el `<html lang>` por idioma, el nav y el pie en inglés, el botón de idioma ida y vuelta desde una nota, el idioma activo marcado y no linkeado, los alternates de las dos versiones, el buscador inglés con su contador `N of M notes`, el aviso de posts en español presente en `/en/blog` y ausente en `/blog`, el mismo `#N` en los dos idiomas, el chrome del post traducido, la consola aceptando `projects` y rechazando `proyectos`, y el menú hamburguesa inglés con el cambio de idioma dentro.

### F39 — ajuste: switch de idioma y cambio sin reanimar

**Incluye:** el selector de idioma pasa de dos enlaces con una barra al medio a un **switch segmentado** (`src/components/layout/LanguageSwitch.astro`): una píldora con los dos códigos, el activo relleno con el color de acento. Se extrae a su propio componente porque va en el header y en el panel mobile, donde ahora ocupa una fila "Idioma / Language" en vez de un enlace suelto. Quedaba desalineado contra los enlaces del nav: usaba `0.68rem` con `line-height: 1` mientras el nav usa `0.8rem` con interlineado normal, así que el texto caía 2.4 px más arriba aunque las dos cajas estuvieran centradas; ahora comparte tamaño e interlineado con el nav y las líneas base coinciden.

El cambio de idioma recargaba el documento y con él se reanimaba todo: cada sección volvía a revelarse desde `opacity: 0` y la consola retipeaba su diálogo de apertura. Ahora el enlace de idioma deja una marca en `sessionStorage` (`src/lib/instant-nav.ts`) y un script **inline** del `<head>` la lee antes del primer pintado y le pone una clase al `<html>`; desde ahí el CSS deja las secciones en su estado final y la consola se salta el tecleo, igual que ya hacía con `prefers-reduced-motion`. Se le da `background-color` al `<html>` —solo lo tenía `body`—, que era lo que hacía ver el lienzo del navegador entre documentos. La decisión la toma un único script síncrono y las islas solo leen la clase: leer `sessionStorage` durante el render daría valores distintos en servidor y cliente.

**SPEC.md:** sin cambios. El spec no fija el tratamiento visual del selector ni el comportamiento de las animaciones entre páginas.

**Excluye:** un router de cliente (`ClientRouter` / view transitions), que eliminaría la recarga en *toda* navegación pero obligaría a migrar los `<script>` del sitio a `astro:page-load` — más alcance y más riesgo del que pide el problema. Tampoco se conserva la posición de scroll al cambiar de idioma: si estás a media nota, volvés arriba. La clase dura toda esa vista de la página, así que después de un cambio de idioma no hay revelados al scrollear hasta la siguiente navegación.

**Verificación:** `npm run check` (0 errores, 53 archivos); `npm run lint` (sin findings); `npm run build` (30 páginas, con el script inline y el fondo del `<html>` presentes en la salida). `npx playwright test` → **22 pasan**, con dos tests nuevos: uno comprueba que al cambiar de idioma el `<html>` lleva la marca, la consola llega con `data-cycle-count="1"` sin tecleo y la primera sección bajo el pliegue está en `opacity: 1` (en una carga normal seguiría en 0); el otro, que una navegación normal **no** lleva la marca, o sea que el resto del sitio conserva sus animaciones. Medido en el navegador: alineación del texto del switch contra el nav, y un único switch visible por breakpoint.

### F39 — corrección: el fondo del `<html>` tapaba el campo de estrellas

**Incluye:** darle `background-color` al `<html>` para matar el parpadeo entre documentos cortó la **propagación de fondo** del `<body>` al lienzo raíz, y con eso desapareció toda la decoración de fondo. El campo de estrellas (`-z-10`) y el veil (`-z-5`) están en z-index negativo: en el orden de pintado van después del fondo del elemento raíz pero **antes** del fondo de un `<body>` normal. Mientras `<html>` no declaraba fondo, el navegador propagaba el del `<body>` al lienzo y las capas quedaban debajo de las estrellas; al declararlo, el `<body>` pasó a pintar su propio fondo —cuyo `linear-gradient` final es opaco— por encima de ellas. El fondo completo (color y degradados) se mueve a `<html>` y el `<body>` queda transparente: así las dos cosas funcionan a propósito y no por accidente.

**Verificación:** confirmado en el navegador que las estrellas vuelven a verse en `/` y en `/en/`. Test nuevo en `tests/e2e/home.spec.ts`: el canvas está en z-index negativo, `<html>` tiene color y degradado, y el `<body>` queda sin fondo propio. Fija la regla, porque esto se rompió sin ningún error que lo delatara: la página seguía viéndose "bien", solo que sin estrellas. `npx playwright test` → **23 pasan**; `npm run check` (0 errores); `npm run lint` (sin findings); `npm run build` (30 páginas).
