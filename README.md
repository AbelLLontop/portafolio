# abelitolll.com

Portafolio personal que funciona como un sello discográfico: cada proyecto y
experimento es un artista con su perfil, y una radio suena mientras se recorre
el sitio. Sitio estático hecho con Astro y islas de React, desplegado en Vercel.

- **Sitio**: [abelitolll.com](https://abelitolll.com)
- **Stack**: Astro 7 (SSG) · React 19 · Tailwind CSS 4 · MDX · Vercel
- **Idioma**: español (el inglés se suma al final)

## Puesta en marcha

Requiere Node >= 22.12.

```sh
npm install
npm run dev     # http://localhost:4321
```

## Comandos

| Comando | Qué hace |
| :-- | :-- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build |
| `npm run check` | Type-check de Astro y validación del frontmatter |
| `npm run lint` | ESLint + Prettier en modo verificación |
| `npm run lint:fix` | Arregla lo que se puede arreglar solo |
| `npm run test` | Tests unitarios (Vitest) |

## Estructura

```
src/
├── components/
│   ├── astro/     piezas estáticas (portada, reproductores incrustados)
│   ├── layout/    la biblioteca (columna izquierda)
│   ├── pages/     el cuerpo de cada página: tablero, perfil, radio, 404
│   └── react/radio/  el reproductor, la letra y el bus que los conecta
├── content/projects/     los proyectos, en .mdx
├── content/experiments/  los experimentos, en .mdx
├── content/radio/        las pistas de la radio, en .md (letra en LRC)
├── i18n/          diccionario de copy y mapa de rutas
├── layouts/       BaseLayout: la ventana (biblioteca, vista, barra)
├── lib/           lógica pura (es lo único que se testea) y lectura de datos
├── pages/         envoltorios de ruta: eligen layout y cuerpo
└── styles/        tokens y estilos globales
public/audio/      el audio de la radio
```

## Documentación

| Documento | Contenido |
| :-- | :-- |
| [AGENTS.md](./AGENTS.md) | Fuente de verdad: stack, convenciones y reglas de trabajo |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Ramas, commits, PR y cómo agregar contenido |
| [docs/project.md](./docs/project.md) | Propósito, público y roadmap |
| [docs/decisions.md](./docs/decisions.md) | Decisiones clave y su porqué |
