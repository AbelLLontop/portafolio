# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains only `SPEC.md` and `PLAN.md`. No code has been scaffolded yet (see `PLAN.md`, Feature 1). Treat `SPEC.md` as the single source of truth for product requirements, and `PLAN.md` as the source of truth for implementation order and scope.

## Commands

Once the Astro project is scaffolded (Feature 1 of `PLAN.md`), these are the commands defined in `SPEC.md`:

```
npm install              # instalar dependencias
npm run dev               # dev server
npm run build              # build de producción
npm run preview             # preview del build
npm run check                # type-check (astro check)
npm run lint                  # eslint .
npm run format                 # prettier --write .
```

To run Playwright smoke tests once they exist (Feature 14): `npx playwright test`.

## Architecture

Static site built with **Astro 4.x (SSG)** plus **React 18 islands** (`@astrojs/react`) for stateful/animated components only (hero terminal, scroll reveals, wordmark). Styling is **Tailwind CSS** with CSS custom properties for one-off effects (glitch wordmark, background grid). Animation inside React islands uses **Framer Motion** (`motion` package); pure CSS transitions are used for micro-interactions that don't need the library.

Key structural rule: Astro components (`.astro`) for anything static; React components (`.tsx`) only when real client state/animation is needed, hydrated with `client:visible` unless the component is above-the-fold critical (the hero terminal is the one justified exception for `client:load`).

Blog content lives in Astro Content Collections (`src/content/blog/*.mdx`), validated against a zod schema in `src/content/config.ts`. Projects content follows the same collection pattern under `src/content/projects/`. There is no CMS and no backend — content changes are file changes in the repo.

Deploy target is **Vercel** (confirmed, static site, no VPS/monorepo structure). See the full planned directory layout in `SPEC.md` under "Project Structure".

## Working with this repo

- **At the start of a session:** read `PLAN.md` and state which feature is in progress.
- **When closing a feature:** mark it done in `PLAN.md`.
- No hagas commit nunca por tu cuenta. Cuando termines un cambio, muéstrame qué hiciste y espera. Solo commitea cuando yo te lo pida explícitamente.
- No feature is considered done without its tests passing.
- "Verify" means running the actual commands and showing their real output — never listing commands for the user to run themselves.
- Before any behavior change, check whether it contradicts `SPEC.md`. If it does, STOP and tell the user which part of the spec conflicts and what you propose. Do not update `SPEC.md` without their approval.
- `SPEC.md` is written in present tense: a requirement that changes is rewritten, not annotated as a correction.
- **Al crear o editar un post de blog:** completa el campo `summary` en el frontmatter. Se usa automáticamente como meta description y como descripción de Open Graph/Twitter card para ese post (ver `src/lib/seo.ts` y `src/layouts/BlogPostLayout.astro`, F13). Si se omite, el post cae a la descripción genérica del sitio en vez de una específica.
- **Los posts de blog son siempre independientes entre sí**, sin ningún indicio visual de jerarquía ni de "este post depende de otro" — ni en el listado (`/blog`) ni dentro del post individual. Si un post retoma código o contexto de uno anterior, eso se explica en la prosa del propio post, no con un campo de relación en el frontmatter.
- **Cada post de blog muestra un número `#N`** antes del título (en `/blog` y en la página individual), calculado en orden cronológico ascendente de `date` entre los posts no-draft (el más antiguo es `#1`). Se calcula en `src/pages/blog/index.astro` y `src/pages/blog/[slug].astro`, y se pasa como prop `number` a `BlogPostCard.astro` / `BlogPostLayout.astro`. No es un campo del frontmatter — no hay que agregar nada al crear un post nuevo, el número se recalcula solo según la fecha.
- **Al adaptar un `.md` propio (notas, tutoriales de VPS, etc.) a un post de blog publicado**: nunca copiar tal cual IPs reales, contraseñas, claves, tokens, nombres de usuario de servicios con acceso de escritura, u otras credenciales reales que aparezcan en el borrador original. Reemplazarlas por placeholders consistentes (`TU_IP`, `TU_CLAVE_AQUI`, `TU-USUARIO`, etc.), incluso si el borrador ya trae partes placeholder y partes reales mezcladas. El dominio propio del sitio (`abelitolll.com`) y nombres de usuario Unix de ejemplo (`abel`) no son secretos y no necesitan redactarse. Ante la duda sobre si un dato es sensible, preguntar antes de publicarlo.
