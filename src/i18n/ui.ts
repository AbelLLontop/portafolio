// Diccionario de la UI. Es la unica fuente de verdad del copy del sitio: los
// .astro y .tsx no llevan texto suelto.
//
// `es` se declara primero y de el sale el tipo de claves, asi que `en` tiene
// que traducir exactamente las mismas: si se agrega una clave en espaniol y se
// olvida la inglesa, `astro check` falla en vez de que la pagina en ingles
// quede con un hueco.
//
// Los textos con partes variables usan marcadores {asi}, no funciones: tienen
// que poder viajar serializados como props a las islas React. Ver
// `interpolate` en ./index.ts.

const es = {
  // ---- Navegacion --------------------------------------------------------
  "nav.home": "Inicio",
  "nav.blog": "Blog",
  "nav.experiments": "Experimentos",
  "nav.openMenu": "Abrir el menú",
  "nav.closeMenu": "Cerrar el menú",
  "nav.language": "Idioma",
  "nav.theme": "Cambiar entre tema claro y oscuro",
  // El nombre del idioma SIEMPRE en ese idioma, no traducido al de la página:
  // es lo que recomienda el W3C para un selector de idioma (quien busca la
  // versión inglesa reconoce "English", no "Inglés"). Por eso el enlace lo
  // toma del diccionario del idioma destino y lleva su propio `lang`.
  "nav.langName": "Español",

  // ---- SEO ---------------------------------------------------------------
  "seo.description":
    "abelitolll — página personal de Abel Llontop, desarrollador de software peruano. Backend, aplicaciones web y notas técnicas.",
  "seo.home.title": "abelitolll — Desarrollador de software",
  "seo.blog.title": "Blog",
  "seo.blog.description": "Artículos y notas técnicas de abelitolll.",
  "seo.experiments.title": "Experimentos",
  "seo.experiments.description":
    "Pruebas creativas con IA y código: música, videos y personajes que no existen.",

  // ---- Hero --------------------------------------------------------------
  "hero.eyebrow": "Lima · Perú · desarrollador de software",
  "hero.tagline":
    "Construyo con apoyo de herramientas de IA y dejo notas técnicas en el camino — cada paso, incluyendo lo que se rompió.",
  "hero.status": "Abierto a nuevas oportunidades",
  "hero.ctaBlog": "Leer el blog",
  "hero.ctaContact": "Contacto",
  "hero.statNotes": "notas publicadas",
  "hero.statYears": "años de experiencia",
  "hero.statStack": "tecnologías",

  // ---- Consola: nombres de los comandos ----------------------------------
  // Son lo que el visitante teclea, asi que se traducen igual que el resto.
  "cmd.whoami": "whoami",
  "cmd.stack": "stack",
  "cmd.projects": "proyectos",
  "cmd.blog": "blog",
  "cmd.contact": "contacto",

  // ---- Consola: chrome y mensajes ----------------------------------------
  "console.title": "abel llontop · consola",
  "console.busy": "escribiendo…",
  "console.idle": "en espera",
  "console.thinking": "pensando",
  "console.inputLabel": "Consola",
  "console.placeholder": "escribe un comando…",
  "console.hint":
    "la consola acepta comandos — escribe help o toca uno de los botones.",
  "console.cleared": "consola limpia · escribe help para ver los comandos",
  "console.unknown":
    "No conozco el comando «{command}». Escribe help para ver la lista.",
  "console.helpIntro": "Estos son los comandos que entiende esta consola:",
  "console.help.whoami": "quién soy, en corto",
  "console.help.stack": "las tecnologías que uso",
  "console.help.projects": "en qué estoy trabajando",
  "console.help.blog": "mis últimas notas publicadas",
  "console.help.contact": "dónde encontrarme",
  "console.help.clear": "limpia la consola",

  // ---- Consola: dialogo de apertura --------------------------------------
  "intro.prompt": "¿quién eres?",
  "intro.prose":
    "Soy Abel Llontop, desarrollador de software peruano. Me dedico a construir sistemas, aprender y divertirme en el camino.",

  // ---- Consola: respuestas -----------------------------------------------
  "answer.whoami.intro":
    "Soy Abel Llontop, desarrollador de software peruano. Llevo {years} años construyendo aplicaciones escalables, automatizando procesos y optimizando sistemas críticos de negocio.",
  "answer.whoami.doKey": "hago",
  "answer.whoami.doValue": "aplicaciones, soluciones y sistemas",
  "answer.whoami.outro":
    "Me divierte investigar, encontrar los problemas y resolverlos. Y me gusta anotar lo que aprendo y compartirlo — por eso existe esta página.",
  "answer.stack.intro": "Esto es lo que uso en el día a día:",
  "answer.stack.key": "día a día",
  "answer.projects.intro":
    "Todavía no tengo proyectos publicados. Estoy construyendo cosas y pronto las vas a ver en la sección de proyectos; mientras tanto, el blog tiene notas reales de lo que voy aprendiendo.",
  "answer.projects.publishedKey": "publicados",
  "answer.projects.statusKey": "estado",
  "answer.projects.statusValue": "en construcción",
  "answer.blog.intro": "Tengo {count} notas publicadas. Las últimas:",
  "answer.blog.allKey": "todas",
  "answer.blog.allValue": "ver el blog completo →",
  "answer.contact.intro":
    "Por acá me encuentras — los dos van directo desde esta consola:",

  // ---- Carrusel de tecnologias -------------------------------------------
  "marquee.label": "Tecnologías",

  // ---- Seccion proyectos -------------------------------------------------
  "projects.label": "Lo que estoy construyendo",
  "projects.title": "Proyectos",
  "projects.badge": "en construcción",
  "projects.placeholder":
    "Todavía no hay nada que enseñar por aquí — estoy construyendo cosas interesantes y pronto las vas a ver en esta sección.",
  "projects.meanwhileBefore": "Mientras tanto, el",
  "projects.meanwhileLink": "blog",
  "projects.meanwhileAfter": "tiene notas reales de lo que voy aprendiendo.",

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
  "experiments.spanishNotice": "Los experimentos están escritos en español.",
  "experiments.aiChip": "hecho con IA",
  "experiments.open": "ver experimento",
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
  "experiment.playSoundcloud": "Cargar el reproductor de SoundCloud",
  "experiment.embedNotice":
    "El contenido se carga desde {service} solo cuando le das play.",
  "experiment.watchOn": "ver en {service}",

  // ---- Listado del blog --------------------------------------------------
  "blog.label": "Notas técnicas",
  "blog.title": "Blog",
  "blog.intro":
    "Acá anoto lo que voy aprendiendo mientras programo, más que nada para no olvidarlo después.",
  "blog.emptyTitle": "Todavía no hay notas publicadas.",
  "blog.emptyHint": "Estoy escribiendo las primeras — vuelve pronto.",
  "blog.searchLabel": "Buscar notas por título o número",
  "blog.searchPlaceholder": "buscar por título o número…",
  "blog.count": "{total} notas",
  "blog.countFiltered": "{shown} de {total} notas",
  "blog.pageInfo": "página {current} de {total}",
  "blog.noResults": "No se encontraron notas con esa búsqueda.",
  "blog.noResultsHint": "Prueba con otras palabras.",
  "blog.prev": "← anterior",
  "blog.next": "siguiente →",
  "blog.latest": "Última nota",
  // Solo se muestra en la version inglesa (los posts no se traducen), pero la
  // clave existe en los dos idiomas para que el diccionario quede parejo.
  "blog.spanishNotice": "Las notas están escritas en español.",

  // ---- Post --------------------------------------------------------------
  "toc.label": "Índice del post",
  "toc.title": "En este post",
  "post.chip": "Nota #{number}",
  "post.back": "volver a las notas",
  "post.spanishNotice": "Esta nota está escrita en español.",
  "post.copy": "Copiar",
  "post.copied": "Copiado",
  "post.copyError": "No se pudo copiar",
  "post.copyAria": "Copiar el código {language}",
  "post.plaintext": "texto",
  "post.headingAnchor": "Enlace a la sección {heading}",

  // ---- HUD de ascenso (decorativo, aria-hidden) --------------------------
  "hud.phase.platform": "en plataforma",
  "hud.phase.troposphere": "troposfera",
  "hud.phase.stratosphere": "estratosfera",
  "hud.phase.mesosphere": "mesosfera",
  "hud.phase.karman": "línea de Kármán",
  "hud.phase.lowOrbit": "órbita baja",
  "hud.phase.deepSpace": "espacio profundo",
  "hud.systems": "sistemas",
  "hud.nominal": "nominal",
  "hud.link": "enlace",
  "hud.stable": "estable",
} as const;

/** Toda clave de copy del sitio. Sale del diccionario espaniol. */
export type UIKey = keyof typeof es;

const en: Record<UIKey, string> = {
  // ---- Navegacion --------------------------------------------------------
  "nav.home": "Home",
  "nav.blog": "Blog",
  "nav.experiments": "Experiments",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.language": "Language",
  "nav.theme": "Switch between light and dark theme",
  "nav.langName": "English",

  // ---- SEO ---------------------------------------------------------------
  "seo.description":
    "abelitolll — personal site of Abel Llontop, a Peruvian software developer. Backend, web apps and technical notes.",
  "seo.home.title": "abelitolll — Software developer",
  "seo.blog.title": "Blog",
  "seo.blog.description": "Articles and technical notes by abelitolll.",
  "seo.experiments.title": "Experiments",
  "seo.experiments.description":
    "Creative tests with AI and code: music, videos and characters that do not exist.",

  // ---- Hero --------------------------------------------------------------
  "hero.eyebrow": "Lima · Peru · software developer",
  "hero.tagline":
    "I build with AI tools alongside me and leave technical notes on the way — every step, including whatever broke.",
  "hero.status": "Open to new opportunities",
  "hero.ctaBlog": "Read the blog",
  "hero.ctaContact": "Contact",
  "hero.statNotes": "published notes",
  "hero.statYears": "years of experience",
  "hero.statStack": "technologies",

  // ---- Consola: nombres de los comandos ----------------------------------
  "cmd.whoami": "whoami",
  "cmd.stack": "stack",
  "cmd.projects": "projects",
  "cmd.blog": "blog",
  "cmd.contact": "contact",

  // ---- Consola: chrome y mensajes ----------------------------------------
  "console.title": "abel llontop · console",
  "console.busy": "typing…",
  "console.idle": "idle",
  "console.thinking": "thinking",
  "console.inputLabel": "Console",
  "console.placeholder": "type a command…",
  "console.hint":
    "the console takes commands — type help or tap one of the buttons.",
  "console.cleared": "console cleared · type help to see the commands",
  "console.unknown":
    "I don’t know the command «{command}». Type help to see the list.",
  "console.helpIntro": "These are the commands this console understands:",
  "console.help.whoami": "who I am, in short",
  "console.help.stack": "the tech I use",
  "console.help.projects": "what I am working on",
  "console.help.blog": "my latest published notes",
  "console.help.contact": "where to find me",
  "console.help.clear": "clears the console",

  // ---- Consola: dialogo de apertura --------------------------------------
  "intro.prompt": "who are you?",
  "intro.prose":
    "I am Abel Llontop, a Peruvian software developer. I build systems, learn, and have fun along the way.",

  // ---- Consola: respuestas -----------------------------------------------
  "answer.whoami.intro":
    "I am Abel Llontop, a Peruvian software developer. For {years} years I have been building scalable applications, automating processes and tuning business-critical systems.",
  "answer.whoami.doKey": "i build",
  "answer.whoami.doValue": "applications, solutions and systems",
  "answer.whoami.outro":
    "I enjoy digging in, finding the problems and solving them. And I like writing down what I learn and sharing it — that is why this site exists.",
  "answer.stack.intro": "This is what I use day to day:",
  "answer.stack.key": "day to day",
  "answer.projects.intro":
    "I have no published projects yet. I am building things and you will see them in the projects section soon; meanwhile, the blog has real notes on what I am learning.",
  "answer.projects.publishedKey": "published",
  "answer.projects.statusKey": "status",
  "answer.projects.statusValue": "in progress",
  "answer.blog.intro": "I have {count} notes published. The latest ones:",
  "answer.blog.allKey": "all",
  "answer.blog.allValue": "see the whole blog →",
  "answer.contact.intro":
    "Here is where to find me — both go straight from this console:",

  // ---- Carrusel de tecnologias -------------------------------------------
  "marquee.label": "Technologies",

  // ---- Seccion proyectos -------------------------------------------------
  "projects.label": "What I am building",
  "projects.title": "Projects",
  "projects.badge": "in progress",
  "projects.placeholder":
    "Nothing to show here yet — I am building interesting things and you will see them in this section soon.",
  "projects.meanwhileBefore": "Meanwhile, the",
  "projects.meanwhileLink": "blog",
  "projects.meanwhileAfter": "has real notes on what I am learning.",

  // ---- Seccion contacto --------------------------------------------------
  "contact.label": "Where to find me",
  "contact.title": "Contact",
  "contact.intro":
    "If you want to talk about something I am building, pitch me a project or just say hello, this is where to find me.",

  // ---- Sobre mi ----------------------------------------------------------
  "about.label": "About",
  "about.headlineName": "I am Abel Llontop.",
  "about.headlineRole": "Software developer.",
  "about.intro":
    "Learning and building is what I enjoy most. Every new thing that shows up makes me curious to understand how it works.",
  "about.body":
    "I have spent a few years working as a developer across different areas, so I know a bit of everything: applications, process automation and business systems, with a bachelor's degree in Systems and Computer Engineering behind it. These days I lean on AI tools to take the repetitive work off my hands and move at a speed that was not possible before. I like talking about technology and whatever is coming out, and above all having fun learning.",
  "about.nowLabel": "Now",
  "stack.group.backend": "Backend",
  "stack.group.frontend": "Frontend",
  "stack.group.data": "Data",
  "stack.group.infra": "Infrastructure",
  "stack.group.ai": "AI",
  "about.fact.locationLabel": "Location",
  "about.fact.locationValue": "Lima, Peru",
  "about.fact.studiesLabel": "Education",
  "about.fact.studiesValue":
    "Bachelor's degree in Systems and Computer Engineering",
  "about.fact.experienceLabel": "Experience",
  "about.fact.experienceValue": "{years} years as a developer",
  "about.fact.focusLabel": "Focus",
  "about.fact.focusValue": "Applications, automation and business systems",
  "about.fact.toolsLabel": "Tools",
  "about.fact.toolsValue": "AI as a day-to-day helper",
  "about.stackLabel": "Main stack",
  "about.stackTitle": "The tech I use day to day",
  "about.closing":
    "That is still what I am doing: learning on my own, building my own things and open to new opportunities.",
  "about.badge": "building new things",

  // ---- Experiments -------------------------------------------------------
  "experiments.label": "Things I try",
  "experiments.title": "Experiments",
  "experiments.intro":
    "Ideas that are neither a product nor a technical note: creative tests with new tools, to see how far they go. Each one has its own page.",
  "experiments.spanishNotice": "The experiments are written in Spanish.",
  "experiments.aiChip": "made with AI",
  "experiments.open": "see experiment",
  "experiments.soonLabel": "coming soon",
  "experiments.soon": "The next experiment goes here.",
  "experiment.back": "back to the experiments",
  "experiment.about": "What it is about",
  "experiment.facts": "Details",
  "experiment.links": "On other platforms",
  "experiment.listen": "Listen",
  "experiment.videos": "Videos",
  "experiment.design": "Design",
  "experiment.play": "Play {title}",
  "experiment.playSoundcloud": "Load the SoundCloud player",
  "experiment.embedNotice":
    "The content loads from {service} only when you press play.",
  "experiment.watchOn": "watch on {service}",

  // ---- Listado del blog --------------------------------------------------
  "blog.label": "Technical notes",
  "blog.title": "Blog",
  "blog.intro":
    "I write down what I learn while I code, mostly so I do not forget it later.",
  "blog.emptyTitle": "No notes published yet.",
  "blog.emptyHint": "I am writing the first ones — come back soon.",
  "blog.searchLabel": "Search notes by title or number",
  "blog.searchPlaceholder": "search by title or number…",
  "blog.count": "{total} notes",
  "blog.countFiltered": "{shown} of {total} notes",
  "blog.pageInfo": "page {current} of {total}",
  "blog.noResults": "No notes matched that search.",
  "blog.noResultsHint": "Try other words.",
  "blog.prev": "← previous",
  "blog.next": "next →",
  "blog.latest": "Latest note",
  "blog.spanishNotice": "The notes are written in Spanish.",

  // ---- Post --------------------------------------------------------------
  "toc.label": "Post contents",
  "toc.title": "In this post",
  "post.chip": "Note #{number}",
  "post.back": "back to the notes",
  "post.spanishNotice": "This note is written in Spanish.",
  "post.copy": "Copy",
  "post.copied": "Copied",
  "post.copyError": "Could not copy",
  "post.copyAria": "Copy the {language} code",
  "post.plaintext": "text",
  "post.headingAnchor": "Link to the {heading} section",

  // ---- HUD de ascenso (decorativo, aria-hidden) --------------------------
  "hud.phase.platform": "on the pad",
  "hud.phase.troposphere": "troposphere",
  "hud.phase.stratosphere": "stratosphere",
  "hud.phase.mesosphere": "mesosphere",
  "hud.phase.karman": "kármán line",
  "hud.phase.lowOrbit": "low orbit",
  "hud.phase.deepSpace": "deep space",
  "hud.systems": "systems",
  "hud.nominal": "nominal",
  "hud.link": "link",
  "hud.stable": "stable",
};

export const ui = { es, en } as const;
