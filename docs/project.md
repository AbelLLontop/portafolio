# El proyecto

## Propósito

Portafolio personal de un desarrollador de software peruano. El objetivo no es
listar proyectos de forma exhaustiva: es que un dev o un reclutador que abra el
link piense "esto no es un portafolio genérico".

La pieza central es el **blog técnico**: notas propias, escritas para uno mismo,
con un tratamiento visual cuidado. Los proyectos acompañan (pocos y bien
presentados) y la decoración —campo de estrellas, HUD de altitud, terminal del
hero— existe para que el sitio se sienta hecho a medida.

## Público

- **Reclutadores**, que casi siempre abren el link desde LinkedIn en el celular:
  móvil es el caso de uso más probable de fallar si no se cuida.
- **Otros devs**, que son los que notan el detalle de interacción.
- **Uno mismo**, que es el lector real del blog.

## Qué ofrece el sitio

- **Inicio**: hero con wordmark animado y una terminal que acepta comandos
  reales (`whoami`, `stack`, `blog`, `contacto`, `help`). Las respuestas se
  derivan de los mismos datos que renderiza el sitio, no de texto duplicado.
- **Sobre mí**: resumen profesional breve. Sin foto personal y sin timeline de
  empleos.
- **Blog**: listado con búsqueda (por texto, o por número de nota si se escriben
  solo dígitos) y paginación, todo en el navegador. Cada nota lleva su número
  `#N`, fecha, código con syntax highlighting e índice.
- **Contacto**: GitHub y LinkedIn. El correo no se publica.

## Límites

- **Nunca**: foto personal, correo, timeline de empleos, ni proyectos inventados
  presentados como reales.
- **Preguntar antes**: agregar una dependencia nueva, cambiar el dominio o el
  hosting, o publicar cualquier dato personal además de GitHub y LinkedIn.
- **Siempre**: dark mode como base, un solo color de acento, y el contenido del
  blog pasando por el schema de la colección.

## Roadmap

- **Proyectos reales.** Hoy la sección está en construcción con un placeholder de
  la misma calidad visual que el resto. La estructura
  (`src/content/projects/`, `ProjectCard.astro`) ya existe para recibir
  contenido sin refactor.
- **Más notas.** El blog es la pieza que crece; el listado ya está preparado para
  escalar en cantidad.
- **Sin RSS por ahora.** No hay audiencia externa suscribiéndose; se puede
  agregar sin fricción si eso cambia.
