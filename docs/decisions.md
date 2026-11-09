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
- **"Sobre mí" no es una página propia, vive dentro de Inicio.** Era muy corta
  para justificar una ruta separada y un clic extra. `/sobre-mi` y `/en/about`
  se eliminaron; el contenido (incluido el listado de stack con `TechBadge`)
  quedó intacto como sección de `HomeBody.astro` (`AboutSection.astro`). El
  carrusel de tecnologías (`TechMarquee`) es un adorno propio de Inicio, no
  parte de Sobre mí, así que los dos conviven sin que uno reemplace al otro.
- **Los proyectos no se inventan.** Solo entra software real. El primero es este
  mismo repositorio; mientras no haya más, el listado cierra con un "próximamente"
  y, si no hubiera ninguno, la sección vuelve al placeholder "en construcción".
  Un demo de relleno presentado como real es peor que una sección vacía.
- **La página de un proyecto no copia la de un experimento.** Sin barra lateral:
  el enlace al código es lo principal de un proyecto y va junto al título; la
  ficha es una tira horizontal. Se hizo así para que las dos secciones se lean
  como cosas distintas aunque compartan el mismo sistema visual.
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
  como metadata, pero en el listado solo en la última nota: en cada fila
  sumaban una línea de ruido que hacía sentir el listado saturado.
- **El listado del blog es una bitácora.** Las notas se agrupan por mes (el mes
  se calcula en UTC, ver `src/lib/dates.ts`: en zona local Perú movería una nota
  del 1 de octubre a septiembre), con la fecha como marca de tiempo a la izquierda
  y un riel con un punto por nota. La última nota se distingue en reposo por
  tamaño, etiqueta y un punto que pulsa, y **no** por el color del título ni el
  fondo, que es justo lo que cambia el hover: con el mismo estilo los dos estados
  eran indistinguibles. El hover nunca mueve nada (antes corría la fila).
- **Desde una nota se vuelve al listado por tres sitios:** la fila de la etiqueta
  de arriba, la barra pegajosa del título (solo mientras está pegada, y con área
  táctil ampliada) y el enlace del final. Estando a la mitad de una nota larga el
  de abajo queda lejos, y esa es la situación en la que más falta hace.

## Diseño

- **Una sola unidad de espaciado vertical (`--section-y`).** Cada sección ponía
  su propio `py-*` y los huecos salían de 96 a 224 px sin criterio: el carrusel
  quedaba a 100 px por un lado y 160 por el otro. Ahora el hueco entre secciones
  es siempre 2 × `--section-y` y los subbloques usan 1 ×. Si el aire se ve mal,
  se cambia esa variable, no cada componente.
- **El marco con borde es solo de Proyectos y de la consola.** Se probó ponerlo
  en Sobre mí, el stack y Contacto y el sitio pasó a parecer una plantilla con
  tarjetas en todos lados: quitaba lo especial que tenía en un solo sitio. El
  resto usa filetes y rótulos mono.
- **Tipografía con escala nombrada.** Había 10 tamaños pequeños, 9 espaciados de
  letra y 7 grises que se distinguían por décimas de píxel y daban sensación de
  desorden. Ahora hay `text-micro` y `text-ui`, tres roles de espaciado y cuatro
  niveles de gris (ver AGENTS.md). Cada valor suelto es una oportunidad de volver
  a abrir la deriva; se elige el rol más cercano.
- **La rejilla de fondo es fija, quieta y sin luz de cursor.** Primero vivía
  dentro del hero y su luz se cortaba en el borde de la sección; al pasarla a una
  capa fija de toda la página era demasiado brusca, y suavizada seguía compitiendo
  con el cohete y las estrellas, que ya son la firma del cursor. Se quitó la luz
  en vez de apilar un tercer efecto (tampoco partículas).
- **El hero y el carrusel son un solo grupo, centrado, con tope de alto.** Un
  banner de `100svh` dejaba más de 240 px de aire en pantallas altas y el carrusel
  clavado al fondo se leía separado del hero. El grupo se centra en
  `min(100svh − header, 50rem)`: el aire no crece sin límite y en pantallas bajas
  o móvil el alto lo manda el contenido (es un mínimo, no un alto fijo).
- **El stack son filas con filete dentro de Sobre mí.** No es una sección aparte
  (una tabla en su propia sección se sentía suelta) ni una nube de chips con
  filtros por área: se probó y se rechazó, parecía un diseño ajeno pegado sin
  criterio. La frase "sigo aprendiendo" es la última fila de la misma tabla.
- **Hover sin desplazamiento y estados distintos.** Un hover que cambia padding o
  tamaño hace que el contenido se mueva bajo el cursor; solo cambian color, brillo
  y fondo. Los controles que cambian de aspecto al enfocarse (el buscador del
  blog) no pueden cambiar de tamaño: se oculta con opacidad, no con `display`.
- **Los experimentos son una sección aparte, no parte de Proyectos.** Proyectos
  es software real y la regla es no inventar ninguno; un grupo musical ficticio
  hecho con IA es una prueba creativa, no un proyecto. Mezclarlos habría obligado
  a elegir entre desdibujar qué es cada cosa o dejar el experimento sin lugar.
  Cada experimento tiene su propia página en vez de una tarjeta con enlaces,
  porque lo que lo hace interesante (cómo se hizo, los videos, el diseño) no cabe
  en una tarjeta.
- **Los videos y el audio se incrustan con una fachada, no con el iframe
  directo.** Seis iframes de YouTube al abrir la página descargan sus scripts y
  les avisan a sus servidores aunque nadie les dé play, y en el celular pesa.
  `EmbedFacade` muestra una imagen con un botón y monta el iframe (en
  `youtube-nocookie.com`) solo al reproducir. El costo: un clic más para ver un
  video. TikTok queda como enlace: su embed es pesado e inestable.

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
- **La navegación va por el `<ClientRouter />` de Astro.** El sitio sigue siendo
  estático: el router es solo cliente, y sin JS los enlaces funcionan como
  enlaces normales. Se gana que cambiar de página no recargue el documento (sin
  parpadeo, sin loader en la pestaña, la decoración de fondo no se reinicia) y
  que un elemento pueda animarse de una página a la otra. El costo está en los
  `<script>`: corren una sola vez por sesión, así que lo que toca el DOM de la
  página tiene que ir en `astro:page-load`. Quitar el router obliga a desarmar
  eso en cinco archivos.
- **Una carga del documento anima; una navegación del router, no del todo.** Dos
  clases en `<html>` (`src/lib/nav-flags.ts`) distinguen los casos:
  `nav-swap` (llegué por el router) hace que la terminal del hero aparezca con
  su diálogo puesto en vez de retipear un diálogo ya visto — en un swap es
  instantáneo, así que se vería vacía tecleando sola; `nav-instant` (cambio de
  idioma) además apaga los reveals, porque ahí solo cambian las palabras. Las
  demás navegaciones **sí** vuelven a revelar: son medio segundo y son lo que
  hace que el cambio de página se lea como un cambio de página. Antes del router
  esto era un `sessionStorage` leído por un script inline del `<head>` antes del
  primer pintado; sin documento nuevo, basta con `astro:after-swap`.
- **El morph entre páginas es uno solo: el título del post.** El mismo
  `transition:name` lo llevan la fila del listado y el `<h1>` de la nota, así que
  al entrar el navegador lleva uno hasta el otro. Un segundo elemento animado
  compite con ese y el cambio de página se vuelve ruidoso.
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
  implícito abrió un PR sobre trabajo que todavía no estaba revisado. Y al
  revés, su trabajo termina al abrir el PR: vigilar los checks, esperar el CI o
  fusionar es trabajo del flujo y de la persona, no del agente.
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
