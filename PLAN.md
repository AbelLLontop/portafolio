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
- [ ] F14 — Smoke tests E2E (Playwright)
- [ ] F15 — Deploy a Vercel + dominio

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
