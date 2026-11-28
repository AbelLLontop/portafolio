// Diccionario de la UI. Es la unica fuente de verdad del copy del sitio: los
// .astro y .tsx no llevan texto suelto.
//
// Hoy solo existe `es`, y de el sale el tipo de claves. Cuando se sume el
// ingles, se declara como `Record<UIKey, string>`: si falta una traduccion,
// `astro check` falla en vez de que la pagina quede con un hueco.
//
// Los textos con partes variables usan marcadores {asi}, no funciones: tienen
// que poder viajar serializados como props a las islas React. Ver
// `interpolate` en ./index.ts.

const es = {
  // ---- SEO ---------------------------------------------------------------
  "seo.description":
    "Página personal de Abel Llontop, desarrollador de software.",
  "seo.home.title": "abelitolll — Desarrollador de software",
  "seo.notFound.title": "404 — Página no encontrada",
  "seo.notFound.description":
    "La página que buscas no existe o cambió de lugar.",
  "seo.imageAlt":
    "abelitolll, página personal de Abel Llontop, desarrollador de software.",

  // ---- Página no encontrada (404) -----------------------------------------
  "notFound.label": "Error 404",
  "notFound.title": "Esta ruta no existe",
  "notFound.text":
    "La dirección que abriste no existe o la moví de lugar. Desde aquí puedes volver a cualquier sección del sitio.",
  "notFound.ctaHome": "Volver al inicio",

  // ---- Sobre mi ----------------------------------------------------------
  "stack.group.backend": "Backend",
  "stack.group.frontend": "Frontend",
  "stack.group.data": "Datos",
  "stack.group.infra": "Infra",
  "stack.group.ai": "IA",

  // ---- Experimentos ------------------------------------------------------
  "experiment.play": "Reproducir {title}",
  "experiment.playSpotify": "Cargar el reproductor de Spotify",
  "experiment.playSoundcloud": "Cargar el reproductor de SoundCloud",
  "experiment.embedNotice":
    "El contenido se carga desde {service} solo cuando le das play.",

  // ---- Biblioteca (columna izquierda) ------------------------------------
  "lib.label": "Sello",
  "lib.open": "Abrir la biblioteca",
  "lib.search": "Buscar en el sello",
  "lib.filter": "Filtrar la biblioteca",
  "lib.all": "Todo",
  "lib.projects": "Proyectos",
  "lib.experiments": "Experimentos",
  "lib.project": "Proyecto",
  "lib.experiment": "Experimento",
  "lib.empty": "Sin resultados.",
  "lib.count": "{count} en el catálogo",

  // ---- Reproductor -------------------------------------------------------
  "player.play": "Reproducir",
  "player.pause": "Pausar",
  "player.prev": "Anterior",
  "player.next": "Siguiente",
  "player.lyrics": "Letra",
  "player.list": "Lista de canciones",
  "player.back": "Volver",
  "player.mute": "Silenciar",
  "player.unmute": "Activar el sonido",
  "player.volume": "Volumen",
  "player.seek": "Ir a un punto de la canción",
  "player.intro": "intro del sitio",
  "player.noLyrics": "Letra no disponible por ahora.",

  // ---- Radio (la lista de canciones) -------------------------------------
  "seo.radio.title": "Radio",
  "seo.radio.description":
    "Las canciones de Los Vecinos de Enfrente, para escuchar mientras recorres el sitio.",
  "radio.title": "Radio abelitolll",
  "radio.count": "{count} canciones",
  "radio.colTitle": "Título",
  "radio.locked": "pronto",
  "radio.lockedHint": "Todavía sin audio.",

  // ---- Inicio (el tablero) -----------------------------------------------
  "home.kicker": "Productor · desarrollador de software",
  "home.playIntro": "Reproducir Quién soy",
  "home.bio":
    "Desarrollador de software, {years} años construyendo aplicaciones y automatizando procesos. Bachiller en Ingeniería de Sistemas; hoy trabajo junto a Claude.",
  "home.projects": "Proyectos",
  "home.experiments": "Experimentos",
  "home.viewAll": "ver todo",
  "home.latest": "Último lanzamiento",
  "home.madeWith": "hecho con",
  "home.milestones": "Hitos",
  "home.openProfile": "Ver el perfil",
  "home.empty": "El primero está en el estudio.",

  // ---- Estados -----------------------------------------------------------
  "status.live": "en vivo",
  "status.building": "en construcción",
  "status.ai": "IA",
  "status.aiLong": "hecho con IA",

  // ---- Perfil (proyecto o experimento) -----------------------------------
  "profile.project": "Proyecto",
  "profile.experiment": "Experimento",
  "profile.tabs": "Secciones del perfil",
  "profile.tab.home": "Inicio",
  "profile.tab.process": "Cómo se hizo",
  "profile.tab.build": "Cómo está hecho",
  "profile.tab.videos": "Videos",
  "profile.tab.listen": "Escuchar",
  "profile.tab.prompts": "Prompts",
  "profile.tab.gallery": "Galería",
  "profile.tab.flow": "Flujo con Claude",
  "profile.tab.repo": "Repositorio",
  "profile.about": "Acerca de",
  "profile.songs": "Canciones",
  "profile.songsHint": "suenan en el reproductor del sitio",
  "profile.versions": "Versiones",
  "profile.milestones": "Hitos",
  "profile.live": "Ver en vivo",
  "profile.code": "Código",
  "profile.listenOut": "Escuchar fuera del sitio",
  "profile.videosHint": "se cargan recién al darles play",
  "profile.copy": "copiar",
  "profile.copied": "copiado",
  "profile.stack": "Stack",
  "profile.repoText":
    "El código completo, con su historial y sus Pull Requests.",
  "profile.playFirst": "Escuchar",
  "profile.stepCount": "{count} pasos",
} as const;

/** Toda clave de copy del sitio. Sale del diccionario espaniol. */
export type UIKey = keyof typeof es;

export const ui = { es } as const;
