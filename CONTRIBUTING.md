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

## Agregar un post al blog

1. Creá `src/content/blog/<slug>.mdx`.
2. Frontmatter completo. `summary` **no es opcional**: se usa como meta
   description y como descripción de Open Graph. Si falta, el post cae a la
   descripción genérica del sitio.
3. El número `#N` se calcula solo, por fecha, entre los posts no-draft: no hay
   que agregar nada.
4. Los posts son independientes entre sí. Si una nota retoma código o contexto de
   otra, se explica en la prosa, no con un campo de relación.
5. Si estás adaptando un `.md` propio (notas de VPS, tutoriales), **revisá que no
   queden datos reales**: IPs, contraseñas, claves, tokens o usuarios de
   servicios con acceso de escritura. Van placeholders consistentes (`TU_IP`,
   `TU_CLAVE_AQUI`, `TU-USUARIO`), incluso si el borrador mezcla partes reales y
   partes de ejemplo. El dominio del sitio y el usuario Unix `abel` no son
   secretos. Ante la duda, preguntá antes de publicar.

## Agregar una página

1. Agregá la ruta a `src/i18n/routes.ts` (y a `NAV_ROUTES` si va en el nav). De
   ese mapa salen la navegación, el botón ES/EN y los `hreflang`: una ruta que no
   esté ahí queda sin traducir y sin alternates.
2. El cuerpo va en `src/components/pages/<Nombre>Body.astro`, con `lang` como
   prop.
3. Creá las dos versiones: `src/pages/<slug>.astro` y
   `src/pages/en/<slug>.astro`, como envoltorios finos.
4. El copy va en `src/i18n/ui.ts`, en **los dos idiomas**.

## Tocar textos de la interfaz

Siempre en `src/i18n/ui.ts`, nunca en el `.astro` ni en el `.tsx`. El inglés
está tipado contra las claves del español: una traducción faltante rompe
`npm run check`. Para partes variables, marcador `{asi}` e `interpolate()` —
nunca concatenar, porque el orden de las palabras cambia entre idiomas.

## Tests

Vitest sobre la lógica pura de `src/lib/` (numeración de notas, fechas, SEO,
diccionario). No hay E2E: la interfaz se revisa a ojo. Si vas a agregar lógica,
que viva en `src/lib/` y con su test — las páginas solo pintan.
