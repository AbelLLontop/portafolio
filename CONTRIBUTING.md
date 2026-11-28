# Cómo trabajar en este repo

La fuente de verdad del proyecto es [`AGENTS.md`](./AGENTS.md). Este archivo es
el paso a paso.

## Preparar el entorno

Node >= 22.12.

```sh
npm install
npm run dev        # http://localhost:4321
```

## Flujo de trabajo

**Nunca hagas push directo a `main`** (está protegida, también para los agentes
de IA): todo cambio va en una rama y entra por Pull Request.

```sh
git switch main && git pull
git switch -c fix/descripcion-corta
# ... cambios ...
npm run lint && npm run test && npm run build
git commit -m "fix: corrige el indice de posts tras la paginacion"
git push -u origin HEAD
gh pr create
```

Prefijos de rama: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `perf/`,
`test/`, `ci/`.

El PR se fusiona con **squash**: el título del PR se convierte en el mensaje del
commit, y la rama se borra sola al fusionar.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):
`tipo: descripción`, con ámbito opcional. Los detalles y los tipos válidos están
en [`AGENTS.md`](./AGENTS.md#6-convención-de-commits). El prefijo va en inglés;
la descripción, en español, en imperativo y en minúscula.

```
feat: agrega buscador por numero de nota en el listado
fix(seo): usa el summary del post como meta description
```

No lleva líneas de co-autoría, ni firmas, ni emojis.

## Verificación

```sh
npm run check   # astro check: tipos y frontmatter contra el schema
npm run lint    # eslint + prettier --check
npm run test    # vitest: logica pura de src/lib
npm run build   # build de produccion
```

Los tres últimos son los que corre CI en cada PR. No hace falta correrlos en
cada cambio intermedio: la puerta es el PR.

Si el cambio toca interfaz, miralo en el navegador en escritorio y en móvil
(375px). Si algo no pudiste comprobar, decilo en el PR.

## Agregar un experimento o un proyecto

1. Poné las imágenes en `src/assets/experiments/<slug>/` (o `projects/`) y
   creá `src/content/experiments/<slug>.mdx` (o `projects/`).
2. El frontmatter lo valida `content.config.ts`. El cuerpo es el "Acerca de";
   el resto va en el frontmatter y arma las pestañas del perfil:
   - `steps`: el cómo se hizo, cada paso con su texto, sus herramientas y,
     opcional, una cita, un prompt, una imagen o un video al costado.
   - `milestones`: los hitos (el logo sale del dominio de la URL).
   - `prompts`, `videos` (solo el id de YouTube), `gallery`, `links`.
   - En proyectos, `flow` (cómo se trabaja en el repo) y `versions`.
   - En experimentos, `tracks`: los ids de sus pistas en la radio.
   Una sección sin datos no aparece.
3. `tagline` es la línea corta de la biblioteca y del inicio.
4. `featured: true` lo fija como "último lanzamiento" del inicio.
5. Si usa IA, `ai: true`, y decilo en el texto.
6. Nada se carga de terceros al abrir la página: los reproductores son
   `EmbedFacade` y recién se montan al dar play.

## Agregar una canción a la radio

1. El audio en `public/audio/<slug>.mp3`, comprimido (128-192 kbps).
2. Creá `src/content/radio/NN-<slug>.md` con `title`, `cover`, `coverAlt`,
   `order` y `audio: /audio/<slug>.mp3`.
3. El cuerpo es la letra en formato LRC: `[mm:ss.xx] una línea`. Lo que va
   entre asteriscos se pinta en el acento. Sin letra, la canción suena igual y
   la vista de letra lo avisa.
4. Sin `audio`, la pista aparece bloqueada ("pronto").

## Agregar una página

1. Agregá la ruta a `src/i18n/routes.ts`.
2. El cuerpo va en `src/components/pages/<Nombre>Body.astro`, con `lang` como
   prop, y `src/pages/<slug>.astro` es un envoltorio fino.
3. El copy va en `src/i18n/ui.ts`.

## Tocar textos de la interfaz

Siempre en `src/i18n/ui.ts`, nunca en el `.astro` ni en el `.tsx`. Para partes
variables, marcador `{asi}` e `interpolate()`: nunca concatenar, porque el
orden de las palabras cambia entre idiomas y el inglés se suma después.

## Tests

Vitest sobre la lógica pura de `src/lib/` (letra LRC, reproductor, SEO,
embeds, diccionario). No hay E2E: la interfaz se revisa a ojo. Si vas a agregar lógica,
que viva en `src/lib/` y con su test — las páginas solo pintan.
