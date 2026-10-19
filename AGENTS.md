# AGENTS.md: abelitolll.com, fuente de verdad del repo

Portafolio personal con blog técnico. Esta es la versión corta y vigente: lo
primero que lee cualquier persona o agente antes de tocar el repo. El detalle
vive en los documentos de la sección 8.

## 1. Qué es el sitio

Landing de portafolio de un desarrollador peruano, con el **blog técnico como
pieza central**: notas propias, no pensadas para audiencia externa, pero con un
tratamiento visual cuidado. Acompañan una sección de proyectos (hoy en
construcción, sin proyectos inventados) y una página "Sobre mí".

El criterio de calidad es "hecho a medida": nada debe sentirse plantilla. El
propósito y el roadmap están en [`docs/project.md`](./docs/project.md).

## 2. Stack

- **Astro 7** (SSG, estricto). Sitio 100% estático: sin backend, sin CMS, sin base de datos.
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
| `/` | `/en/` | Hero con terminal interactiva, proyectos, contacto |
| `/sobre-mi` | `/en/about` | Resumen profesional breve |
| `/blog` | `/en/blog` | Listado de notas con búsqueda y paginación |
| `/blog/<slug>` | `/en/blog/<slug>` | Nota individual |

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
- **Posts**: `summary` es obligatorio en el frontmatter — se usa como meta
  description y como descripción de Open Graph. El número `#N` de cada nota se
  calcula por fecha entre los posts no-draft, no es un campo del frontmatter.
  Los posts son siempre independientes entre sí, sin jerarquía ni relación.
- **Color de acento**: un solo acento, siempre desde el token, nunca un hex
  suelto en un componente.
- **SEO**: `src/lib/seo.ts` genera canonical, Open Graph y Twitter Cards. Cada
  página pasa su `title` y `description`.

## 5. Reglas de trabajo (personas y agentes)

1. **`main` está protegida: nunca se hace push directo**, tampoco un agente.
   Todo va en una rama (`feat/…`, `fix/…`, `docs/…`, `chore/…`) creada desde
   `main` actualizada y entra por Pull Request. El merge lo hace una persona.
2. **No commitear sin que la persona lo pida.** Un agente escribe los archivos,
   muestra el cambio y espera. Cuando se le pide el commit: primero la rama,
   después el commit. Nunca `git push` por iniciativa propia; si se pide el PR,
   ahí recién se sube la rama.
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
