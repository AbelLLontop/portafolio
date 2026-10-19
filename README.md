# abelitolll.com

Portafolio personal con blog técnico. Sitio estático hecho con Astro y islas de
React, desplegado en Vercel.

- **Sitio**: [abelitolll.com](https://abelitolll.com)
- **Stack**: Astro 7 (SSG) · React 19 · Tailwind CSS 4 · MDX · Vercel
- **Idiomas**: español (sin prefijo) e inglés (`/en/`)

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
│   ├── astro/     componentes estáticos
│   ├── layout/    Header, Footer, BaseLayout
│   ├── pages/     el cuerpo de cada página, con `lang` como prop
│   └── react/     islas interactivas (terminal, listado, decoración)
├── content/blog/  las notas, en .mdx
├── i18n/          diccionario de copy y mapa de rutas
├── layouts/       BaseLayout y BlogPostLayout
├── lib/           lógica pura (es lo único que se testea)
├── pages/         envoltorios de ruta: eligen idioma y layout
└── styles/        tokens y estilos globales
```

## Documentación

| Documento | Contenido |
| :-- | :-- |
| [AGENTS.md](./AGENTS.md) | Fuente de verdad: stack, convenciones y reglas de trabajo |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Ramas, commits, PR y cómo agregar contenido |
| [docs/project.md](./docs/project.md) | Propósito, público y roadmap |
| [docs/decisions.md](./docs/decisions.md) | Decisiones clave y su porqué |
