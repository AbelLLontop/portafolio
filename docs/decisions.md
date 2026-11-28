# Decisiones clave

Registro corto de las decisiones que condicionan el proyecto y su porqué. Solo
entran las que una persona o un agente podría deshacer sin saber que eran
decisiones. Si cambiás una, actualizá la entrada en el mismo PR.

## Producto

- **El sitio es un sello discográfico.** El autor es el productor; cada
  proyecto y cada experimento es un "artista" con su propio perfil, y sus piezas
  concretas (canciones, videos, versiones) son sus lanzamientos. La versión
  anterior tenía la estructura típica de un portafolio (hero, secciones con
  scroll, decoración) y se sentía genérica: la decoración (estrellas, cohete,
  terminal) no decía nada del autor. El sello sí, porque el experimento central
  es una banda.
- **El sitio es 100% estático, sin backend ni CMS.** El contenido son archivos
  del repo. Todo lo que parezca necesitar servidor (búsqueda, filtros) se
  resuelve en el navegador.
- **No hay blog.** Se escribió poco y no se leía; las notas, las páginas y su
  código se borraron y sus URLs dan 404 a propósito, sin redirecciones. Si
  vuelve, será otro proyecto, no una sección de este.
- **Solo español, por ahora.** El contenido va a cambiar mucho y traducir cada
  corrección no tenía sentido. La estructura por idioma (`src/i18n/`, `Lang`,
  `pathFor`) se conservó para sumar el inglés al final, cuando el contenido se
  estabilice.
- **No se menciona el origen ni la ubicación del autor.** Ni país ni ciudad,
  en ningún lado (perfil, proyectos, experimentos, letras, imagen para
  compartir). Pedido explícito del autor.
- **El correo no se publica.** Es un dato personal; el contacto es GitHub y
  LinkedIn. Tampoco van foto personal ni timeline de empleos.
- **Los proyectos no se inventan.** Solo entra software real. El catálogo
  escala a muchos elementos (la biblioteca tiene buscador y filtros), pero nunca
  se rellena con demos presentados como reales.
- **El copy va en primera persona y sin tono de marca personal.** Nada de
  frases de influencer. Esto se rechazó explícitamente una vez.

## Diseño

- **Una ventana, no una página.** El sitio es una app de reproductor: biblioteca
  a la izquierda, vista en el centro y barra de reproducción abajo. La página
  nunca hace scroll entera; cada panel tiene su propio scroll. El scroll largo
  con secciones apiladas era justo lo que hacía sentir el sitio plantilla.
- **El inicio es un tablero que entra en una pantalla.** El bloque crema es todo
  lo del autor (nombre, "Quién soy" cantándose, bio, stack); alrededor, en
  oscuro, el catálogo: Proyectos y Experimentos abajo, y el último lanzamiento a
  la derecha. Se probó poner "Sobre mí" como un bloque oscuro más y se leía como
  parte del último lanzamiento: lo del autor va solo en el bloque crema.
- **La tarjeta del último lanzamiento es imagen con texto encima**, fundida con
  un degradado, y lo que dice es de ESE lanzamiento: descripción, hitos y
  herramientas. Sin botones ni tablas: se probaron y se rechazaron. Los hitos
  son genéricos (no "canciones populares") porque no todo experimento es música.
  Por defecto es el más nuevo del catálogo; `featured: true` en el frontmatter
  fija otro.
- **El logo de Los Vecinos (la cuadrícula 5×5) es solo arte.** Se probó usarlo
  como navegación (cada cuadro un proyecto) y como titular que cambia al pasar el
  mouse: confundía y no escala a muchos elementos. Ahora no se toca; el cuadro
  rojo late con lo que suena.
- **Cada perfil va en pestañas, armado con secciones.** Inicio, Cómo se hizo,
  Videos, Escuchar, Prompts, Galería, Flujo con Claude, Repositorio. Una sección
  sin datos no se muestra, así cada proyecto o experimento elige las suyas sin
  tocar el diseño. Se probaron un desplegable por capítulos (demasiado simple),
  un pliego horizontal (incómodo de leer) y una columna con índice (no gustó).
- **Cada perfil tiene su paleta.** Los experimentos van de noche (ámbar), los
  proyectos en tinta. Igual que cada video de la banda tiene la suya.
- **Un solo tema, sin claro/oscuro.** El diseño usa paletas fijas por panel
  (papel, tinta, noche); una versión clara habría obligado a rediseñar cada una.
- **Tipografía: Archivo (con eje de ancho) e IBM Plex Mono.** Archivo hace los
  titulares gigantes, condensados con `font-variation-settings: "wdth"`; la mono,
  etiquetas y datos. El texto largo va en la sans del sistema.
- **Un solo acento: el rojo del cuadro que no encaja** (`--red`). El ámbar es el
  acento de la paleta de noche, no un segundo color de marca.
- **Los videos y reproductores de terceros van con fachada** (`EmbedFacade`):
  una imagen con botón, y el iframe recién se monta al dar play. Al montarse,
  pausa la radio del sitio para que no suenen dos cosas.

## La radio

- **La radio es independiente de las páginas.** Tiene su propia colección
  (`src/content/radio/`) y no lee la página de ningún experimento. Un perfil solo
  puede pedirle "toca esta pista" (con `data-radio-row` y `data-track-id`).
- **Cada canción lleva a Spotify.** El objetivo de la radio es que la gente
  vaya a escuchar a Spotify: junto a cada canción (lista, perfil, barra, vista
  de letra) hay un botón con su enlace, y la cabecera de la radio lleva al
  perfil del artista. Se enlaza al artista y no al álbum, porque los álbumes
  van a cambiar.
- **Solo canciones publicadas.** No hay concepto de "inédita": entran las que
  están en Spotify.
- **El audio va en el repo** (`public/audio/`), comprimido (MP3 de 128-192
  kbps). Son pocas canciones; un servicio aparte sumaba configuración sin
  necesidad. Si la lista crece mucho, se reconsidera.
- **La intro arranca en pausa.** "Quién soy" queda cargada en la barra y suena
  cuando la persona le da play. Antes arrancaba sola y silenciada (el navegador
  no deja sonar nada sin un clic) y el sonido se activaba con el primer clic en
  cualquier parte: la animación y la letra corrían mudas, y parecía que el audio
  estaba roto. No volver al autoplay silenciado. Una pista sin audio queda
  bloqueada (la intro sin audio correría sobre un reloj propio).
- **Sin letra, el micrófono se bloquea.** Como en Spotify: no se abre una vista
  vacía. Las letras sincronizadas de las canciones van en otro PR.
- **La letra va en formato LRC, en el cuerpo de cada `.md`.** Las palabras entre
  asteriscos van en el acento. El build la parsea (`src/lib/lrc.ts`) y el
  cliente solo pinta.
- **La lista de canciones es una página (`/radio`), no un desplegable.** Se
  llega solo con el botón de lista de la barra; volver a tocarlo regresa a donde
  se estaba. El desplegable tapaba la vista y no gustó.
- **La vista de letra se cierra con "Volver", Esc o el micrófono.** Sin salida
  visible no se entendía cómo volver.

## Técnicas

- **El reproductor sobrevive a la navegación** con `transition:persist` sobre el
  contenedor de la barra. Sin eso, cada cambio de página cortaba la música.
- **El estado de la radio vive en `window`** (`src/components/react/radio/bus.ts`),
  no en una variable de módulo: cada isla se empaqueta por su cuenta y así el
  estado es uno solo. Para pedirle algo al reproductor se usan eventos de
  `window` (`radio:play`, `radio:pause`), que puede disparar cualquier script.
- **El click de las filas de la radio se escucha una sola vez, en el layout.**
  Con el router los scripts corren una vez por sesión; si cada página trajera su
  listener, después de visitar dos páginas un click tocaría dos veces y la pista
  se pausaría sola.
- **La navegación va por el `<ClientRouter />` de Astro.** El sitio sigue siendo
  estático. El costo está en los `<script>`: corren una sola vez, así que lo que
  depende del DOM de la página va en `astro:page-load` y los listeners se cuelgan
  de `document`.
- **El diccionario `src/i18n/ui.ts` es la única fuente del copy.** Las partes
  variables usan `{marcador}` con `interpolate()`.
- **`src/i18n/routes.ts` es la única fuente de los paths.**
- **No hay páginas de listado** (`/proyectos`, `/experimentos`). La biblioteca y
  el tablero las reemplazan; "ver todo" filtra la biblioteca.
- **Las clases de un componente no pueden chocar con las del arte.** El bloque
  del inicio se llamaba `.me`, igual que el cuadro rojo del logo, y el estilo del
  bloque deformaba el logo. Ojo con nombres cortos en estilos con scope.

- **URLs sin barra final.** `/radio`, nunca `/radio/`. Astro arma `radio.html`
  (`build.format: "file"`, `trailingSlash: "never"`) y Vercel lo sirve como
  `/radio` (`cleanUrls`) y redirige `/radio/` y `/radio.html`. Antes las dos
  formas respondían 200 y el canonical no coincidía con los enlaces: Google veía
  cada página duplicada. Si se vuelve a `directory`, hay que cambiar las dos
  cosas juntas.
- **Las rutas viejas redirigen con 301.** `/en/projects/<slug>` y
  `/en/experiments/<slug>` van a su perfil en español; `/en`, `/proyectos` y
  `/experimentos` (los listados que ya no existen) van al inicio. El blog no
  redirige a propósito: queda en 404 para que salga del índice. Viven en
  `vercel.json`.
- **JSON-LD solo en el inicio.** Un `Person` y un `WebSite` (`buildHomeJsonLd`
  en `src/lib/seo.ts`), con los perfiles de `CONTACTS` en `sameAs` y sin
  ubicación. El sitemap no lleva `lastmod`: el contenido no tiene una fecha de
  actualización confiable, y una fecha inventada Google la ignora.

## Flujo

- **`main` protegida con ruleset.** PR obligatorio, checks en verde, solo squash,
  y la rama se borra al fusionar. Vale también para los agentes de IA.
- **Un agente no commitea por su cuenta.** Escribe los archivos, muestra el
  cambio y espera. Cuando se le pide el commit, primero crea la rama. Nunca hace
  push por iniciativa propia, y su trabajo termina al abrir el PR.
- **Conventional Commits sin ámbitos cerrados.** Lo valida `commitlint` en CI,
  no un hook local.
- **Sin tests E2E.** Los tests son unitarios (Vitest) sobre la lógica pura de
  `src/lib/` (letra, reproductor, SEO, embeds) y la interfaz se revisa a ojo en
  escritorio y móvil.
- **La prosa queda fuera de Prettier** (`*.md`, `*.mdx`).
- **Los commits y los PR no llevan atribución de IA.**
- **Los prototipos del rediseño no se suben.** Viven en `prototipos/`, fuera
  del repo, como referencia local.
