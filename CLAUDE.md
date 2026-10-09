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
- **When closing a feature:** mark it done in `PLAN.md` and commit.
- No feature is considered done without its tests passing.
- "Verify" means running the actual commands and showing their real output — never listing commands for the user to run themselves.
- Before any behavior change, check whether it contradicts `SPEC.md`. If it does, STOP and tell the user which part of the spec conflicts and what you propose. Do not update `SPEC.md` without their approval.
- `SPEC.md` is written in present tense: a requirement that changes is rewritten, not annotated as a correction.
