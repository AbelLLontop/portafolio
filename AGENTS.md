# AGENTS.md: abelitolll.com, fuente de verdad del repo

Portafolio personal con blog técnico. Esta es la versión corta y vigente: lo
primero que lee cualquier persona o agente antes de tocar el repo. El detalle
vive en los documentos de la sección 8.

## 1. Qué es el sitio

Landing de portafolio de un desarrollador peruano, con el **blog técnico como
pieza central**: notas propias, no pensadas para audiencia externa, pero con un
tratamiento visual cuidado. Acompañan una sección de proyectos (solo
proyectos reales, el primero es este mismo repositorio), una sección de experimentos (pruebas
creativas con su propia página) y una sección "Sobre mí" dentro de Inicio.

El criterio de calidad es "hecho a medida": nada debe sentirse plantilla. El
propósito y el roadmap están en [`docs/project.md`](./docs/project.md).

## 2. Stack

- **Astro 7** (SSG, estricto). Sitio 100% estático: sin backend, sin CMS, sin base de datos.
- **Navegación** con el `<ClientRouter />` de Astro: entre páginas no se recarga
  el documento, se reemplaza el `<body>`. Sigue siendo un sitio estático; esto
  es solo la capa de cliente.
- **React 19** en islas (`@astrojs/react`), solo donde hace falta estado o animación real.
- **Tailwind CSS 4** con tokens en `src/styles/global.css`; CSS propio solo para efectos puntuales.
- **Motion** (`motion/react`) dentro de las islas; micro-interacciones con CSS nativo.
- **Contenido** en Content Collections: `src/content/blog/*.mdx`, validado con zod en `content.config.ts`.
- **Shiki** para el código de los posts, **simple-icons** para los logos de tecnología.
- **Node >= 22.12**. Deploy en **Vercel**, dominio `abelitolll.com`.

Responsabilidades por carpeta: `src/pages/` solo envuelve (elige idioma y
layout), `src/components/pages/*Body.astro` tiene el cuerpo, `src/lib/` la
lógica pura (y es lo único que se testea), `src/i18n/` el copy y las rutas.

## 3. Rutas

Español sin prefijo, inglés bajo `/en/`. Los slugs de las páginas fijas se
traducen; los de los posts no, porque los `.mdx` no se traducen.

| Español | Inglés | Qué es |
| :-- | :-- | :-- |
| `/` | `/en/` | Banner (hero con terminal interactiva y carrusel de tecnologías), sobre mí, proyectos, contacto |
| `/blog` | `/en/blog` | Bitácora de notas agrupada por mes, con búsqueda y paginación |
| `/blog/<slug>` | `/en/blog/<slug>` | Nota individual |
| `/proyectos` | `/en/projects` | Listado de proyectos: una fila por proyecto, con su captura |
| `/proyectos/<slug>` | `/en/projects/<slug>` | Página de un proyecto (título, enlaces al código y al sitio, captura, ficha, texto, stack, galería) |
| `/experimentos` | `/en/experiments` | Listado de experimentos: pruebas creativas, cada una con su página |
| `/experimentos/<slug>` | `/en/experiments/<slug>` | Página de un experimento (portada, texto, reproductores, galería, enlaces) |
| cualquier otra | cualquier otra | 404 (`src/pages/404.astro`): un solo `404.html` para los dos idiomas; el script de `NotFoundBody.astro` elige el idioma por el prefijo `/en/`. Va con `noindex` y sin canonical ni hreflang |

`src/i18n/routes.ts` es la única fuente de los paths: de ahí salen la
navegación, el botón ES/EN y los `hreflang`.

## 4. Convenciones técnicas

- **Copy**: todo texto visible vive en `src/i18n/ui.ts`, nunca en el `.astro` ni
  en el `.tsx`. Hay que escribir **los dos idiomas**: el inglés está tipado
  contra las claves del español, así que una traducción faltante rompe
  `npm run check`. Si el texto lleva una parte variable, marcador `{asi}` e
  `interpolate()`; nunca concatenar, porque el orden de las palabras cambia
  entre idiomas. El copy que vive dentro de un `<script>` de cliente se pasa por
  atributos `data-*` (ver `Header.astro`, `AscentHud.astro`): esos scripts se
  empaquetan aparte y no ven las props de Astro.
- **Islas React**: `client:visible` por defecto. `client:load` solo con
  justificación above-the-fold (hoy la excepción es la terminal del hero).
  `transition:persist` solo para la decoración que no debe reiniciarse al
  navegar (el campo de estrellas y el cohete).
- **Scripts de cliente**: con el router, un `<script>` de Astro corre **una
  sola vez** en toda la sesión, no en cada página. Lo que dependa del DOM de la
  página va dentro de `astro:page-load` (que también corre en la carga
  inicial); lo que se suscriba a `window` o `document` se cuelga una sola vez
  afuera, porque rehacerlo por página acumula listeners. Ver `AscentHud.astro`.
- **Animaciones de entrada**: una carga de verdad anima; una navegación del
  router no vuelve a representar lo ya visto. Lo marcan dos clases en `<html>`
  (`src/lib/nav-flags.ts`), nunca se lee el estado de navegación desde una isla.
- **Proyectos**: colección `projects` (`src/content/projects/*.mdx`), validada
  en `content.config.ts`. El cuerpo del `.mdx` es el texto; la captura de
  portada, el stack, el estado (`live` o `building`), la ficha, `repoUrl`,
  `liveUrl` y la galería van en el frontmatter. A propósito la página no usa
  barra lateral, para no parecerse a la de experimentos: el enlace al código
  va bajo el título y la ficha en una tira horizontal. Las capturas se toman con
  el movimiento reducido (`--force-prefers-reduced-motion`), si no el texto
  animado sale borroso. El listado, la sección de Inicio y el comando
  `proyectos` de la consola salen de la misma colección.
- **Experimentos**: colección `experiments` (`src/content/experiments/*.mdx`),
  validada en `content.config.ts`. El cuerpo del `.mdx` es el texto; la portada,
  los videos de YouTube (solo el id), el reproductor de SoundCloud, la galería,
  la ficha y los enlaces van en el frontmatter, así todos comparten diseño. El
  contenido de terceros se incrusta con `EmbedFacade.astro`: una imagen con
  botón, y el iframe recién se monta al dar play (nada de YouTube ni SoundCloud
  se carga al abrir la página). Las URLs de los embeds salen de
  `src/lib/embeds.ts`. Si el experimento usa IA, `ai: true` lo declara en la
  tarjeta y en la página; nunca se presenta como obra humana.
- **Posts**: `summary` es obligatorio en el frontmatter — se usa como meta
  description y como descripción de Open Graph. El número `#N` de cada nota se
  calcula por fecha entre los posts no-draft, no es un campo del frontmatter.
  Los posts son siempre independientes entre sí, sin jerarquía ni relación.
- **Tema claro/oscuro**: el oscuro es el original (ausencia de atributo) y el
  claro se activa con `data-theme="light"` en `<html>`. Sin elección guardada
  se sigue el tema del sistema (y claro si no se puede leer); el botón del
  navbar guarda la elección en `localStorage`. `BaseLayout` lo fija antes del
  primer pintado y lo copia al
  documento nuevo en `astro:before-swap`). Los colores viven como tokens en
  `global.css` (`--bg`, `--surface`, `--tint`, `--panel`, `--on-accent`…, y los
  zinc se reasignan en el bloque claro): en un componente nunca un
  `rgb(255 255 255 / …)` ni un hex de fondo, sino el token. Los bloques de
  código y la consola del hero son paneles de terminal y siguen oscuros en
  ambos temas (`.code-block`, `data-keep-dark`).
- **Color de acento**: un solo acento, siempre desde el token, nunca un hex
  suelto en un componente.
- **Tipografía**: tres familias con un rol cada una — Saira (`font-display`) en
  titulares, JetBrains Mono (`font-mono`) en etiquetas, UI, fechas y código, y
  el sans del sistema en párrafos. Los tamaños y el espaciado de letra salen de
  una escala con nombre (definida en `tailwind.config.mjs`), nunca de un valor
  suelto: mono pequeño `text-micro` (etiquetas, chips, metadatos) y `text-ui`
  (navegación, botones, pie); espaciado `tracking-eyebrow` (etiqueta de
  sección), `tracking-label` (resto de mayúsculas) y `tracking-ui` (mono en
  minúsculas); párrafos y titulares, la escala de Tailwind. Si algo no encaja,
  se elige el rol más cercano en vez de inventar 0.72rem.
- **Colores de texto**: cuatro niveles — `text-zinc-100` (titulares y valores),
  `text-zinc-300` (cuerpo que se lee), `text-dim` (descripciones secundarias) y
  `text-faint` (metadatos y rótulos). Ningún otro gris.
- **Espaciado vertical**: una sola unidad, `--section-y` (en `global.css`), que
  es la mitad del hueco entre dos secciones. Cada sección de Inicio usa
  `section-y` y los subbloques de una sección se separan con `var(--section-y)`;
  nunca un `py-*` propio por componente, porque eso fue lo que dejó los huecos
  desparejos. Para cambiar el aire de todo el sitio se toca ese valor.
- **Marco y contenedores**: el panel con marco (`hull-panel`) es solo de
  Proyectos y de la consola del hero. El resto de Inicio se estructura con
  filetes finos, rótulos mono y, en el listado del blog, un riel con un punto
  por nota. Repetir el marco en todas las secciones hizo que el sitio pareciera
  plantilla.
- **Fondo y cursor**: la rejilla es una capa fija (`SiteGrid.astro`), quieta y
  tenue, en Inicio y en el listado del blog. El cohete y las estrellas ya son la
  firma del cursor: no se agregan luces ni partículas que lo sigan. Los anillos
  de acento de `data-spot` (chips y botones de contacto) los mueve `Spotlight`.
- **Hover**: nunca cambia el tamaño ni la posición de nada; solo color, brillo
  y fondo. Un estado en reposo que deba destacar (la última nota del listado) se
  distingue por otra vía, no por el mismo estilo que el hover.
- **SEO**: `src/lib/seo.ts` genera canonical, Open Graph y Twitter Cards. Cada
  página pasa su `title` y `description`.
  La imagen al compartir el enlace es `public/og-image.png` (es) y
  `og-image-en.png` (en), de 1200x630, y se generan con
  `node scripts/og-image.mjs` (HTML con los tokens del sitio, rasterizado con
  Edge/Chrome headless): si cambia el diseño o el copy, se edita el script y se
  regenera, no se retoca el PNG. Proyectos y experimentos usan su propia
  portada, con su texto alternativo.

## 5. Reglas de trabajo (personas y agentes)

1. **`main` está protegida: nunca se hace push directo**, tampoco un agente.
   Todo va en una rama (`feat/…`, `fix/…`, `docs/…`, `chore/…`) creada desde
   `main` actualizada y entra por Pull Request. El merge lo hace una persona.
2. **No commitear sin que la persona lo pida.** Un agente escribe los archivos,
   muestra el cambio y espera. Cuando se le pide el commit: primero la rama,
   después el commit. Nunca `git push` por iniciativa propia; si se pide el PR,
   ahí recién se sube la rama. **El trabajo del agente termina al abrir el PR**:
   devuelve el link y para. No vigila los checks, no espera el resultado del CI
   y no fusiona. Eso es trabajo del flujo y de la persona.
3. **Antes de abrir el PR**: `npm run lint`, `npm run test` y `npm run build`
   deben pasar. No hace falta correrlos en cada cambio intermedio: la puerta
   real es el PR.
4. **Conventional Commits**, sin ámbitos inventados (ver sección 6).
5. **Documentación viva**: una feature nueva actualiza este archivo y, si
   corresponde, `README.md` o `docs/`. Una decisión que otro podría deshacer sin
   saber se registra en [`docs/decisions.md`](./docs/decisions.md), en el mismo PR.
6. **Sin atribución de IA**: los commits y los PR no llevan líneas de co-autor,
   firmas ni emojis.
7. **Verificación visual**: un cambio de interfaz se revisa en el navegador en
   escritorio y en móvil. Si algo no se pudo comprobar, se dice en el PR.
8. **Datos sensibles**: al adaptar un `.md` propio (notas, tutoriales de VPS) a
   un post, nunca copiar IPs, contraseñas, claves, tokens ni usuarios reales de
   servicios con acceso de escritura; van placeholders (`TU_IP`,
   `TU_CLAVE_AQUI`). El dominio propio y el usuario Unix de ejemplo no son
   secretos. Ante la duda, preguntar antes de publicar.

## 6. Convención de commits

[Conventional Commits](https://www.conventionalcommits.org/): `tipo: descripción`,
con ámbito opcional y libre (`tipo(ámbito): descripción`). Tipos: `feat`, `fix`,
`perf`, `refactor`, `style`, `docs`, `test`, `build`, `ci`, `chore`, `revert`.

- El prefijo va en inglés (es parte del estándar); la descripción, en español.
- Imperativo presente ("agrega", "corrige", "quita"), sin punto final, máximo 72
  caracteres en el asunto.
- Un commit = un cambio lógico. Si la descripción necesita "y" para unir dos
  cosas no relacionadas, son dos commits.
- El cuerpo responde "por qué así", nunca "qué cambié", y es obligatorio cuando
  la causa del bug no se ve en el diff o cuando se eligió una solución sobre otra
  razonable.
- El título del PR también sigue la convención: es el mensaje del commit al
  hacer squash.

Lo valida `commitlint` con `@commitlint/config-conventional` en CI.

## 7. CI/CD

Cada PR contra `main` corre `PR Checks`: lint, test y build, más la validación
del título del PR y de los mensajes de commit de la rama. `main` está protegida
con un ruleset: PR obligatorio, checks en verde, solo squash, y la rama se borra
al fusionar. Vercel despliega `main` y genera un preview por cada PR.

Los tests son unitarios (Vitest) sobre la lógica pura de `src/lib/`. No hay
E2E: para un sitio de este tamaño el costo de mantenerlos no se justifica y la
interfaz se revisa a ojo (regla 7).

## 8. Documentos

| Documento | Contenido |
| :-- | :-- |
| [README.md](./README.md) | Presentación, requisitos y comandos |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Ramas, commits, PR y cómo agregar contenido |
| [docs/project.md](./docs/project.md) | Propósito, público y roadmap |
| [docs/decisions.md](./docs/decisions.md) | Decisiones clave y su porqué |
