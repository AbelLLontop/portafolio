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

- **Inicio**: un banner con el hero (wordmark animado, cifras reales del sitio y
  una terminal que acepta comandos reales: `whoami`, `stack`, `blog`, `proyectos`,
  `contacto`, `help`) y, pegado a él, el carrusel de tecnologías. Las respuestas
  de la terminal se derivan de los mismos datos que renderiza el sitio, no de
  texto duplicado. Sigue un resumen profesional breve ("sobre mí", con una ficha
  de datos y el stack por áreas), sin foto personal y sin timeline de empleos.
- **Blog**: una bitácora de notas agrupada por mes, con búsqueda (por texto, o por
  número de nota si se escriben solo dígitos; la tecla `/` la enfoca) y
  paginación, todo en el navegador. Cada nota lleva su número `#N`, fecha, código
  con syntax highlighting, índice, y un enlace para volver al listado arriba, en
  la barra pegajosa del título y al final.
- **Experimentos**: pruebas creativas que no son un producto ni una nota
  técnica. Un listado de tarjetas y, por cada una, su propia página con portada,
  texto, reproductores incrustados bajo demanda, galería de diseño y enlaces. El
  primero es Los Vecinos de Enfrente, un grupo ficticio con música generada con
  IA. Si algo está hecho con IA, la página lo dice.
- **Contacto**: GitHub y LinkedIn. El correo no se publica.

## Límites

- **Nunca**: foto personal, correo, timeline de empleos, ni proyectos inventados
  presentados como reales.
- **Preguntar antes**: agregar una dependencia nueva, cambiar el dominio o el
  hosting, o publicar cualquier dato personal además de GitHub y LinkedIn.
- **Siempre**: dark mode como base, un solo color de acento, y el contenido del
  blog pasando por el schema de la colección.

## Roadmap

- **Más proyectos.** La sección ya existe y tiene el primero, este mismo repo.
  Agregar otro es crear un `.mdx` en `src/content/projects/` con sus capturas en
  `src/assets/projects/`, sin tocar código.
- **Más notas.** El blog es la pieza que crece; el listado ya está preparado para
  escalar en cantidad.
- **Sin RSS por ahora.** No hay audiencia externa suscribiéndose; se puede
  agregar sin fricción si eso cambia.
