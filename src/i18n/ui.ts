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
  // ---- Navegacion --------------------------------------------------------
  "nav.home": "Inicio",
  "nav.projects": "Proyectos",
  "nav.experiments": "Experimentos",
  "nav.openMenu": "Abrir el menú",
  "nav.closeMenu": "Cerrar el menú",

  // ---- SEO ---------------------------------------------------------------
  "seo.description":
    "Página personal de Abel Llontop, desarrollador de software.",
  "seo.home.title": "abelitolll — Desarrollador de software",
  "seo.notFound.title": "404 — Página no encontrada",
  "seo.notFound.description":
    "La página que buscas no existe o cambió de lugar.",
  "seo.imageAlt":
    "abelitolll, página personal de Abel Llontop, desarrollador de software.",
  "seo.projects.title": "Proyectos",
  "seo.projects.description":
    "Proyectos de abelitolll: lo que construyo, con su stack, su código y cómo está hecho.",
  "seo.experiments.title": "Experimentos",
  "seo.experiments.description":
    "Pruebas creativas con IA y código: música, videos y personajes que no existen.",

  // ---- Página no encontrada (404) -----------------------------------------
  "notFound.label": "Error 404",
  "notFound.title": "Esta ruta no existe",
  "notFound.text":
    "La dirección que abriste no existe o la moví de lugar. Desde aquí puedes volver a cualquier sección del sitio.",
  "notFound.ctaHome": "Volver al inicio",
  "notFound.console": "abel llontop · consola",
  "notFound.noSuchDir": "No existe el archivo o el directorio",

  // ---- Seccion proyectos -------------------------------------------------
  "projects.label": "Lo que estoy construyendo",
  "projects.title": "Proyectos",
  "projects.badge": "en construcción",
  "projects.placeholder":
    "Todavía no hay nada que enseñar por aquí — estoy construyendo cosas interesantes y pronto las vas a ver en esta sección.",
  "projects.intro":
    "Lo que construyo y se puede abrir: con su stack, su código y cómo está hecho. Cada proyecto tiene su propia página.",
  "projects.viewAll": "ver todos los proyectos",
  "projects.statusLive": "en producción",
  "projects.statusBuilding": "en construcción",
  "projects.open": "ver proyecto",
  "projects.soonLabel": "próximamente",
  "projects.soon": "El siguiente proyecto va acá.",
  "project.back": "volver a los proyectos",
  "project.about": "De qué trata",
  "project.repo": "Código en GitHub",
  "project.live": "Ver en vivo",
  "project.stack": "Stack",
  "project.gallery": "Cómo se ve",

  // ---- Seccion contacto --------------------------------------------------
  "contact.label": "Dónde encontrarme",
  "contact.title": "Contacto",
  "contact.intro":
    "Si quieres hablar de algo que estoy construyendo, proponerme un proyecto o simplemente saludar, por aquí me encuentras.",

  // ---- Sobre mi ----------------------------------------------------------
  "about.label": "Sobre mí",
  "about.headlineName": "Soy Abel Llontop.",
  "about.headlineRole": "Desarrollador de software.",
  "about.intro":
    "Aprender y crear es lo que más me gusta. Cada cosa nueva que aparece me despierta la curiosidad y las ganas de entender cómo funciona.",
  "about.body":
    "Llevo algunos años trabajando como desarrollador en áreas distintas, así que sé un poco de todo: aplicaciones, automatización de procesos y sistemas de negocio, con el grado de bachiller en Ingeniería de Sistemas e Informática de base. Hoy me apoyo en herramientas de IA para sacarme de encima lo repetitivo y avanzar a una velocidad que antes no era posible. Me gusta conversar de tecnología y de lo que va saliendo, y sobre todo divertirme aprendiendo.",
  "about.nowLabel": "Ahora",
  "stack.group.backend": "Backend",
  "stack.group.frontend": "Frontend",
  "stack.group.data": "Datos",
  "stack.group.infra": "Infraestructura",
  "stack.group.ai": "IA",
  "about.fact.locationLabel": "Ubicación",
  "about.fact.locationValue": "Lima, Perú",
  "about.fact.studiesLabel": "Formación",
  "about.fact.studiesValue":
    "Bachiller en Ingeniería de Sistemas e Informática",
  "about.fact.experienceLabel": "Experiencia",
  "about.fact.experienceValue": "{years} años como desarrollador",
  "about.fact.focusLabel": "Enfoque",
  "about.fact.focusValue": "Aplicaciones, automatización y sistemas de negocio",
  "about.fact.toolsLabel": "Herramientas",
  "about.fact.toolsValue": "IA como apoyo del día a día",
  "about.stackLabel": "Stack principal",
  "about.stackTitle": "Las tecnologías que uso en el día a día",
  "about.closing":
    "Hoy sigo en eso: aprendiendo por mi cuenta, construyendo mis propias cosas y abierto a nuevas oportunidades.",
  "about.badge": "construyendo cosas nuevas",

  // ---- Experimentos ------------------------------------------------------
  "experiments.label": "Cosas que pruebo",
  "experiments.title": "Experimentos",
  "experiments.intro":
    "Ideas que no son un producto ni una nota técnica: pruebas creativas con herramientas nuevas, para ver hasta dónde llegan. Cada una tiene su propia página.",
  "experiments.aiChip": "hecho con IA",
  "experiments.soonLabel": "próximamente",
  "experiments.soon": "El siguiente experimento va acá.",
  "experiment.back": "volver a los experimentos",
  "experiment.about": "De qué trata",
  "experiment.facts": "Ficha",
  "experiment.links": "En otras plataformas",
  "experiment.listen": "Escuchar",
  "experiment.videos": "Videos",
  "experiment.design": "Diseño",
  "experiment.play": "Reproducir {title}",
  "experiment.playSpotify": "Cargar el reproductor de Spotify",
  "experiment.playSoundcloud": "Cargar el reproductor de SoundCloud",
  "experiment.embedNotice":
    "El contenido se carga desde {service} solo cuando le das play.",
} as const;

/** Toda clave de copy del sitio. Sale del diccionario espaniol. */
export type UIKey = keyof typeof es;

export const ui = { es } as const;
