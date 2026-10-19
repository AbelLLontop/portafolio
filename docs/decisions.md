# Decisiones clave

Registro corto de las decisiones que condicionan el proyecto y su porqué. Solo
entran las que una persona o un agente podría deshacer sin saber que eran
decisiones. Si cambiás una, actualizá la entrada en el mismo PR.

## Producto

- **El sitio es 100% estático, sin backend ni CMS.** El contenido son archivos
  del repo. Todo lo que parezca necesitar servidor (búsqueda, filtros, idioma) se
  resuelve en el navegador. Agregar backend significa cambiar hosting y asumir
  mantenimiento que hoy no aporta nada.
- **El correo no se publica.** Es un dato personal; el contacto es GitHub y
  LinkedIn. Tampoco van foto personal ni timeline de empleos.
- **Los proyectos no se inventan.** Mientras no haya proyectos reales listos, la
  sección queda "en construcción" con un placeholder de la misma calidad visual.
  Un demo de relleno presentado como real es peor que una sección vacía.
- **El copy va en primera persona y sin tono de marca personal.** Nada de
  frases de influencer ni de "construyo experiencias digitales que transforman".
  Es la voz del autor, no la de una agencia. Esto se rechazó explícitamente una
  vez; si el copy nuevo suena a marca, está mal.
- **El stack que muestra el sitio no se deduce de los posts.** Las notas
  documentan cosas que el autor probó o configuró (pm2, certbot, Java, Spring
  Boot) y eso no significa que sean parte de su stack. Antes de tocar `STACK` hay
  que preguntar.

## Contenido

- **Los posts son siempre independientes entre sí**, sin ningún indicio de
  jerarquía ni de "este depende de otro", ni en el listado ni dentro del post. Si
  una nota retoma código o contexto de otra, se explica en la prosa. Agregar un
  campo de relación en el frontmatter obligaría a mantener un grafo de
  dependencias que no aporta al lector real (el autor).
- **El número `#N` se calcula por fecha, no es frontmatter.** Se ordena
  ascendente entre los posts no-draft (el más viejo es `#1`) en
  `src/pages/blog/index.astro` y `[slug].astro`. Así crear un post nuevo no
  obliga a tocar nada más, y no hay dos notas con el mismo número. El costo es
  que los números se corren si se publica una nota con fecha vieja.
- **`summary` es obligatorio en el frontmatter.** Alimenta la meta description y
  el Open Graph del post (`src/lib/seo.ts`). Si falta, el post cae a la
  descripción genérica del sitio, que es peor que no tener nada específico.
- **La búsqueda del listado nunca recorre el cuerpo de los posts.** Al navegador
  solo viajan título, resumen, tags, fecha y número, así que el peso del listado
  no crece con lo que se escribe. Buscar dentro del texto exigiría enviar los
  posts completos o un backend.
- **No hay filtro por tag.** La lista de tags crece con cada nota y termina
  pesando más en pantalla que los propios posts. Los tags se siguen mostrando
  como metadata.

## Técnicas

- **El diccionario `src/i18n/ui.ts` es la única fuente del copy**, y el inglés
  está tipado contra las claves del español: una traducción faltante rompe
  `npm run check` en vez de dejar un hueco en producción. Por eso el texto no va
  suelto en los `.astro` ni en los `.tsx`, y las partes variables usan
  `{marcador}` con `interpolate()`: concatenar rompe el orden de las palabras en
  el otro idioma.
- **Español sin prefijo, inglés en `/en/`, y los posts no se traducen.** Mover el
  español a `/es/` cambiaría todas las URLs ya publicadas. Los `.mdx` quedan en
  español y la versión inglesa lo avisa con una línea sobria: traducirlos
  duplicaría el trabajo de escribir cada nota.
- **`src/i18n/routes.ts` es la única fuente de los paths.** De ahí salen la
  navegación, el botón ES/EN y los `hreflang`. Una ruta que no esté en ese mapa
  queda sin traducir y sin alternates.
- **Las islas React se hidratan con `client:visible`.** La única excepción es la
  terminal del hero (`client:load`), que es above-the-fold y arranca sola.
- **El HUD de altitud se muestra solo en los posts individuales.** En el resto
  del sitio competía con el contenido sin aportar orientación.
- **El acento se usa siempre desde el token**, nunca como hex suelto en un
  componente, para poder cambiarlo en un solo lugar.

## Flujo

- **`main` protegida con ruleset.** PR obligatorio, checks en verde, solo squash,
  y la rama se borra al fusionar. Vale también para los agentes de IA: es lo que
  evita que un cambio entre sin pasar por revisión. El historial queda lineal, a
  cambio de no poder commitear directo nunca.
- **Un agente no commitea por su cuenta.** Escribe los archivos, muestra el
  cambio y espera. Cuando se le pide el commit, primero crea la rama. Nunca hace
  push por iniciativa propia. Se aprendió por las malas: un agente con permiso
  implícito abrió un PR sobre trabajo que todavía no estaba revisado.
- **Conventional Commits sin ámbitos cerrados.** Hubo una lista fija de 21
  ámbitos validada por un hook propio: se desincronizaba con `src/` cada vez que
  algo se movía y obligaba a memorizarla. El estándar no define ámbitos, así que
  el ámbito es libre y opcional. Lo valida `commitlint` en CI, no un script
  propio.
- **La validación de commits corre en CI, no en local.** Sin husky ni hooks: un
  hook que tarda se termina salteando con `--no-verify`, y el gate real es el PR.
- **Sin tests E2E.** Hubo 23 con Playwright: para un sitio de este tamaño el
  costo de mantenerlos no se justificaba, porque en frontend el detalle visual
  cambia todo el tiempo y cada cambio los rompía. Los tests son unitarios
  (Vitest) sobre la lógica pura de `src/lib/`, y la interfaz se revisa a ojo en
  escritorio y móvil. El costo asumido: una regresión visual (título pegado,
  índice, menú móvil) no la detecta nadie automáticamente.
- **La prosa queda fuera de Prettier** (`*.md`, `*.mdx`). Si el formateador
  reescribe los docs, cada edición de documentación pelea con el gate de lint, y
  un `.mdx` publicado puede cambiar de renderizado.
- **Los commits y los PR no llevan atribución de IA.** Ni co-autoría, ni firmas,
  ni emojis.
- **`SPEC.md` y `PLAN.md` se eliminaron.** Eran el diario de construcción del
  sitio: crecían sin parar, duplicaban comandos y estructura con `AGENTS.md`, y
  un agente los leía como si fueran vigentes. Lo vivo se repartió entre
  `AGENTS.md`, `docs/project.md` y este archivo. Siguen en el historial de git si
  hace falta consultarlos.
