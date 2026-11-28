# El proyecto

## Propósito

Portafolio personal de un desarrollador de software. El objetivo no es
listar proyectos de forma exhaustiva: es que un dev o un reclutador que abra el
link piense "esto no es un portafolio genérico".

El sitio es un **sello discográfico**: el autor es el productor, y cada
proyecto y cada experimento es un artista con su perfil. Una radio suena
mientras se recorre el sitio, con la letra cantándose al ritmo, y la primera
pista ("Quién soy") presenta al autor.

## Público

- **Reclutadores**, que casi siempre abren el link desde LinkedIn en el celular:
  móvil es el caso de uso más probable de fallar si no se cuida.
- **Otros devs**, que son los que notan el detalle de interacción.

## Qué ofrece el sitio

- **La ventana**: biblioteca a la izquierda (todo el catálogo, con buscador y
  filtros), la vista en el centro y la barra de reproducción abajo. En el celular
  la biblioteca es un cajón.
- **Inicio**: un tablero en una pantalla. El bloque del autor (nombre, "Quién
  soy" cantándose, bio, stack), Proyectos y Experimentos, y el último
  lanzamiento con su descripción, hitos y herramientas.
- **Perfiles**: cada proyecto y experimento tiene su página en pestañas
  (Inicio, Cómo se hizo, Videos, Escuchar, Prompts, Galería, Flujo con Claude,
  Repositorio), según los datos que tenga.
- **Radio**: la barra de abajo (play, anterior, siguiente, progreso, volumen),
  la vista de letra a pantalla completa (micrófono) y la lista de canciones
  (`/radio`, con el botón de lista).
- **Contacto**: GitHub y LinkedIn. El correo no se publica.

## Límites

- **Nunca**: foto personal, correo, timeline de empleos, ni proyectos inventados
  presentados como reales.
- **Preguntar antes**: agregar una dependencia nueva, cambiar el dominio o el
  hosting, o publicar cualquier dato personal además de GitHub y LinkedIn.
- **Siempre**: un solo acento (el rojo), y el contenido pasando por el schema de
  su colección.

## Roadmap

- **El audio de la radio.** Las canciones de Los Vecinos que están en Spotify,
  en MP3, con su letra sincronizada en LRC. Hoy la radio tiene los títulos y las
  pistas quedan bloqueadas hasta tener el audio.
- **La voz de "Quién soy"**, generada con Suno. Mientras no exista, la intro
  suena en silencio con su letra.
- **Prompts reales** en la sección Prompts de cada perfil.
- **Más proyectos y experimentos.** Agregar uno es crear un `.mdx` con sus
  imágenes, sin tocar código.
- **El inglés**, al final, cuando el contenido deje de cambiar.
