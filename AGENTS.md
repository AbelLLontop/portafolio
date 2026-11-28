# AGENTS.md: abelitolll.com, fuente de verdad del repo

Portafolio personal con forma de sello discográfico. Esta es la versión corta y vigente: lo
primero que lee cualquier persona o agente antes de tocar el repo. El detalle
vive en los documentos de la sección 8.

## 1. Qué es el sitio

Portafolio de un desarrollador de software que funciona como un **sello
discográfico**: el autor es el productor y cada proyecto y cada experimento es
un "artista" con su propio perfil. El sitio es una ventana de reproductor
(biblioteca, vista y barra de reproducción), con una radio que sigue sonando al
navegar y la letra cantándose al ritmo. No hay blog.

El criterio de calidad es "hecho a medida": nada debe sentirse plantilla. El
propósito y el roadmap están en [`docs/project.md`](./docs/project.md).

## 2. Stack

- **Astro 7** (SSG, estricto). Sitio 100% estático: sin backend, sin CMS, sin base de datos.
- **Navegación** con el `<ClientRouter />` de Astro: entre páginas no se recarga
  el documento, se reemplaza el `<body>`. El reproductor sobrevive con
  `transition:persist`.
- **React 19** en islas (`@astrojs/react`), solo donde hay estado: el reproductor
  y la letra.
- **Tailwind CSS 4** importado, pero el diseño vive en clases propias de
  `src/styles/global.css` y en el `<style>` de cada componente.
- **Contenido** en Content Collections validadas con zod en `content.config.ts`:
  `projects`, `experiments` (`.mdx`) y `radio` (`.md`, letra en LRC).
- **simple-icons** para los logos de plataformas.
- **Node >= 22.12**. Deploy en **Vercel**, dominio `abelitolll.com`.

Responsabilidades por carpeta: `src/pages/` solo envuelve (elige layout y
cuerpo), `src/components/pages/*Body.astro` tiene el cuerpo, `src/lib/` la
lógica pura (y es lo único que se testea) y la lectura de datos, `src/i18n/` el
copy y las rutas.

## 3. Rutas

Solo español, sin prefijo. La estructura por idioma se conserva para sumar el
inglés al final.

| Ruta | Qué es |
| :-- | :-- |
| `/` | El tablero: el bloque del autor, Proyectos, Experimentos y el último lanzamiento |
| `/proyectos/<slug>` | Perfil de un proyecto, en pestañas |
| `/experimentos/<slug>` | Perfil de un experimento, en pestañas |
| `/radio` | La lista de canciones de la radio. Se llega con el botón de lista de la barra |
| cualquier otra | 404 (`src/pages/404.astro`), dentro de la misma ventana, con `noindex` |

No hay páginas de listado: la biblioteca y el tablero las reemplazan.
`src/i18n/routes.ts` es la única fuente de los paths.

## 4. Convenciones técnicas

- **La ventana** (`BaseLayout.astro`): biblioteca (`Library.astro`), vista
  (`<main class="stage">`, con su propio scroll) y la barra (`Player.tsx`). La
  página nunca hace scroll entera. En el celular la biblioteca es un cajón.
- **Copy**: todo texto visible vive en `src/i18n/ui.ts`, nunca en el `.astro` ni
  en el `.tsx`. Si lleva una parte variable, marcador `{asi}` e `interpolate()`;
  nunca concatenar. Las islas reciben su copy por props (`pickStrings`); los
  `<script>` de cliente, por atributos `data-*`.
- **Scripts de cliente**: con el router, un `<script>` de Astro corre **una
  sola vez** en toda la sesión. Lo que dependa del DOM de la página va en
  `astro:page-load`; los listeners se cuelgan de `document` una sola vez.
- **La radio**: colección `radio` (`src/content/radio/*.md`). Frontmatter con
  título, portada, orden y `audio` (ruta en `public/audio/`); el cuerpo es la
  letra en LRC (`[mm:ss.xx] línea`, lo que va entre asteriscos va en el acento).
  Sin `audio` la pista queda bloqueada. La intro (`intro: true`) arranca sola
  y silenciada, y el sonido se activa con la primera interacción. Sin letra,
  el botón del micrófono queda bloqueado. La radio no depende de ninguna página: una
  página le pide tocar una pista con un botón `data-radio-row` +
  `data-track-id`, y el click lo escucha el layout una sola vez. El estado vive
  en `window` (`react/radio/bus.ts`) y los pedidos son eventos `radio:play` y
  `radio:pause`. El reproductor marca la pista que suena con `aria-current` en
  las filas y `data-playing` en `<html>`.
- **Perfiles**: `ProfileBody.astro` sirve para proyectos y experimentos. El
  cuerpo del `.mdx` es el "Acerca de"; las pestañas salen del frontmatter
  (`steps`, `videos`, `links`, `prompts`, `gallery`, `flow`, `repoUrl`,
  `versions`, `tracks`). Una sección sin datos no se muestra. La pestaña elegida
  queda en el hash de la URL.
- **Último lanzamiento** (inicio): el más nuevo del catálogo, o el que tenga
  `featured: true`. Muestra la imagen, la descripción, los `milestones` (el logo
  sale del dominio de la URL, `src/lib/platform-icons.ts`) y las herramientas.
- **Terceros**: videos y reproductores se incrustan con `EmbedFacade.astro`: una
  imagen con botón, y el iframe recién se monta al dar play (y pausa la radio).
  Las URLs salen de `src/lib/embeds.ts`. Si algo usa IA, `ai: true` lo declara.
- **Colores**: un acento, `--red` (el cuadro que no encaja). Cada panel elige su
  paleta con una clase: `theme-paper` (el bloque del autor), `theme-ink`
  (proyectos) y `theme-night` (experimentos, acento ámbar). Dentro de un panel
  se usan sus tokens (`--bg`, `--fg`, `--soft`, `--mute`, `--line`, `--acc`,
  `--card`), nunca un hex suelto. Sin tema claro.
- **Tipografía**: Archivo para titulares (el titular gigante `.giant` usa el eje
  de ancho con `--w`), IBM Plex Mono para etiquetas y datos (`.kicker`), y la
  sans del sistema para el texto largo (`.prose`).
- **El logo 5×5** (`.art5`) es solo arte: no navega ni cambia nada al pasar el
  mouse. El cuadro rojo late con `--beat`, que escribe el reproductor.
- **Hover**: nunca cambia el tamaño ni la posición del layout; solo color,
  brillo y fondo (la imagen del lanzamiento hace un zoom contenido en su caja).
- **SEO**: `src/lib/seo.ts` genera canonical, Open Graph y Twitter Cards. Cada
  página pasa su `title` y `description`. La imagen al compartir es
  `public/og-image.png` (1200x630), generada con `node scripts/og-image.mjs`: si
  cambia el diseño, se edita el script y se regenera. Los perfiles usan su
  propia imagen.

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
8. **Datos sensibles**: al adaptar un `.md` propio (notas, prompts) a
   un perfil, nunca copiar IPs, contraseñas, claves, tokens ni usuarios reales de
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
