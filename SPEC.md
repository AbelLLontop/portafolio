# Spec: Portafolio personal (abelitolll.com)

## Objetivo

Landing page de portafolio personal para un desarrollador de software peruano (bachiller en Ingeniería de Sistemas, developer en ejercicio). El objetivo NO es listar proyectos exhaustivamente — es que un dev o reclutador que llegue al link piense "wow, esto no es un portafolio genérico". La pieza central es el **blog técnico personal** (notas propias, no pensadas para audiencia externa, pero con un diseño/tratamiento visual excepcional), acompañado de una sección de proyectos reales (pocos, pero bien presentados) y decoraciones/interactividad sutil con temática dev (JS, React, Go, Python).

Es el primer proyecto del usuario construido con Claude Code, y una motivación explícita es demostrar el nivel de calidad que Claude puede producir — por eso se prioriza pulido visual y detalles de interacción sobre cantidad de contenido.

**Criterios de éxito del producto:**

- Un visitante entiende en <5s qué hace esta persona y qué stack domina.
- El blog se siente como una pieza de diseño, no una lista de `<div>` con texto plano.
- Nada se siente "plantilla gratis de internet": tipografía, micro-interacciones y la terminal del hero deben sentirse hechas a medida.
- Funciona perfecto en mobile (el usuario no lo mencionó explícitamente, pero un reclutador abriendo el link desde LinkedIn en el celular es el caso de uso más probable de fallar si no se cuida).

## Decisiones ya tomadas por el usuario

- **Stack:** Astro + islas de React para la interactividad (terminal animada, animaciones on-scroll).
- **Proyectos:** el usuario actualmente no tiene proyectos reales listos para mostrar. La sección de proyectos se construye como **"en construcción"**: un placeholder con la misma calidad visual que el resto del sitio (no un simple texto "coming soon"), diseñado para ser reemplazado fácilmente por tarjetas reales cuando existan. No se inventan proyectos falsos ni demos de relleno presentados como reales.
- **Blog:** contenido en Markdown/MDX dentro del repo (Astro Content Collections), sin CMS externo ni backend.
- **Nivel de interactividad:** la capa de ambiente (campo de estrellas reactivo, HUD de altitud, cohete que sigue al cursor) es ambiciosa y responde al visitante; la capa de contenido se mantiene legible y sin ruido. El criterio es “hecho a medida”, no “discreto”.
- **Idioma:** español únicamente por ahora (usuario está aprendiendo inglés; no bilingüe todavía, pero no cerrar la puerta a i18n futuro).
- **Contacto:** solo email + GitHub + LinkedIn, sin foto adicional de perfil, sin formulario.
- **Sobre mí:** página dedicada (`/sobre-mi`, enlazada en el nav entre "Inicio" y "Blog") con un resumen profesional breve: enfoque como desarrollador de software, años de experiencia (texto fijo, no calculado), stack principal, y mención de apoyo en herramientas de IA. Usa el mismo SVG de marca (cabeza + cohete) que el Hero, no una foto personal. Sin timeline de empleos (empresa/cargo/fechas).
- **Tema visual:** dark mode por defecto, estética terminal/dev, un solo color de acento (azul tipo React o celeste tipo Go — decisión final del acento abierta, ver Open Questions), sin exagerar en estética "hacker" (el usuario es más frontend, nunca trabajó estética hacker/neón).
- **Terminal del hero:** arranca sola con un diálogo escrito a máquina (el visitante ve una conversación con Claude sobre el autor) y después **acepta comandos reales**: `whoami`, `stack`, `proyectos`, `blog`, `contacto`, `help`, `clear`. Se opera por teclado o por pills de atajo, que cubren el caso mobile sin depender del teclado virtual. Un comando desconocido responde con una línea de aviso que sugiere `help`, nunca con un error crudo. Las respuestas se derivan de los mismos datos que ya renderiza el sitio (stack, colección de blog), no de un texto duplicado.
- **Blog — propósito real:** son notas personales del propio usuario, no para lectores externos. Por lo tanto tiempo de lectura y SEO de posts individuales NO son prioridad funcional — sí lo es que cada post se vea visualmente excepcional (metadata con fecha/autor, badges de tecnología con logos, syntax highlighting, selección de texto coloreada con el color de acento). La **navegabilidad del propio listado sí es prioridad** a medida que la cantidad de posts crece: el listado (`/blog`) tiene búsqueda por texto, filtro por tags y paginación, todo client-side (sin backend), para que encontrar un post viejo no dependa de hacer scroll infinito.
- **Iconos de tecnología:** librería SVG de iconos reales (Simple Icons o Devicon), no iconografía abstracta.
- **SEO/Analytics:** nivel básico — meta tags, Open Graph (para que se vea bien al compartir en LinkedIn), sitemap, analytics liviano (Vercel Analytics). Accesibilidad básica (contraste, navegación por teclado), no WCAG AA completo.
- **Tarjetas de proyecto:** nombre + descripción corta + stack con logos + links (GitHub / demo si existe). Sin screenshots por ahora.
- **Dominio:** `abelitolll.com`, ya comprado.
- **Branding:** el usuario pidió explícitamente que el wordmark del sitio no sea "texto grande y ya" — quiere tipografía con personalidad, con la posibilidad de que las "L" de "abelitolll" tengan un tratamiento visual/animado distintivo (glitch, ruptura, aparición animada). Esto se trata como una pieza de diseño propia, no un logo convencional.
- **Deploy:** decisión delegada a Claude (ver sección Deploy más abajo).
- **Librería de animación:** decisión delegada a Claude (ver Tech Stack).

## Tech Stack

- **Framework:** Astro 7.x (SSG) — contenido estático, SEO, performance. (Actualizado desde 4.x: la versión 4.x ya no se distribuye como instalación nueva al momento de scaffolding del proyecto.)
- **Islas interactivas:** React 18 (`@astrojs/react`) solo para componentes con estado/animación real: terminal del hero, reveals on-scroll complejos, selección de texto con color de acento si requiere JS.
- **Estilos:** Tailwind CSS — permite iterar rápido en un diseño consistente de dark-mode/acentos sin escribir CSS a mano repetitivamente; se complementa con CSS custom puntual para efectos muy específicos (glitch del wordmark, grid de fondo, etc.).
- **Animación:** **Framer Motion (`motion` package)** dentro de las islas React — maneja bien scroll-triggered reveals y la secuencia de typewriter de la terminal sin reinventar timing a mano. Para micro-interacciones puramente CSS (hover de tarjetas, selección de texto) se usa CSS transitions nativo, sin cargar la librería donde no aporta.
- **Contenido del blog:** Astro Content Collections (`src/content/blog/*.mdx`) con frontmatter tipado vía `zod` schema (`src/content/config.ts`): título, fecha, stack/tags (array de tecnologías para los logos), opcionalmente resumen.
- **Iconos de tecnología:** paquete `simple-icons` (o `devicon` si se requieren variantes más ilustrativas) importados como SVG.
- **Syntax highlighting del blog:** Shiki (integrado nativamente en Astro Markdown/MDX), con un tema dark a medida que combine con la paleta del sitio.
- **Analytics:** `@vercel/analytics` (si se despliega en Vercel) — liviano, sin cookies de terceros.

## Deploy

**Confirmado: Vercel** (free tier), apuntando al dominio `abelitolll.com` vía DNS. Razones:

- Astro + islas React tiene soporte de primera clase en Vercel, zero-config.
- Preview deployments automáticos por cada push — valioso mientras se itera el diseño.
- Al ser un sitio 100% estático (sin backend, sin DB), un VPS no aporta ninguna ventaja real hoy — solo más superficie de mantenimiento (actualizaciones de OS, Nginx, certificados TLS manuales) sin beneficio funcional.
- Si en el futuro el usuario agrega backend real (API propia, DB para comentarios, etc.), ahí sí un VPS o un servicio como Railway/Fly.io se vuelve relevante — se puede migrar entonces sin perder el trabajo de frontend.

## Commands

```
Instalar dependencias:  npm install
Dev server:             npm run dev
Build de producción:    npm run build
Preview del build:      npm run preview
Type-check (Astro):     npm run check        # astro check
Lint:                   npm run lint          # eslint .
Format:                 npm run format       # prettier --write .
```

## Project Structure

```
/
├── public/
│   ├── favicon.svg
│   ├── favicon.ico                → fallback para navegadores sin soporte de favicon SVG
│   ├── og-image.png              → imagen para Open Graph/social preview
│   └── images/
│       ├── abelitolll-head.svg    → logo de marca (cabeza), usado en el navbar
│       └── abelitolll-rocket.svg  → cabeza + cohete, usado junto al wordmark en el hero
├── src/
│   ├── components/
│   │   ├── react/                → islas interactivas
│   │   │   ├── TerminalHero.tsx  → terminal del hero: diálogo typewriter + intérprete de comandos
│   │   │   ├── ScrollReveal.tsx  → wrapper de animación on-scroll reutilizable
│   │   │   ├── Wordmark.tsx      → tratamiento animado de "abelitolll"
│   │   │   ├── BlogList.tsx      → listado de blog con búsqueda, filtro por tag y paginación
│   │   │   └── decor/
│   │   │       ├── Starfield.tsx     → campo de estrellas en canvas con paralaje y warp por scroll
│   │   │       └── CursorRocket.tsx  → cohete que persigue al cursor con física de vuelo
│   │   ├── astro/                → componentes estáticos .astro
│   │   │   ├── ProjectCard.astro
│   │   │   ├── AscentHud.astro   → HUD fijo de altitud/fase por scroll (desktop)
│   │   │   ├── StatsPanel.astro  → panel de instrumentos con datos reales del perfil
│   │   │   └── TechBadge.astro   → logo + nombre de tecnología
│   │   └── layout/
│   │       ├── Header.astro
│   │       └── Footer.astro
│   ├── content/
│   │   ├── config.ts             → schema zod de blog y proyectos
│   │   ├── blog/                 → posts .mdx
│   │   └── projects/             → entradas de proyectos (.md o .json, ver Open Questions)
│   ├── layouts/
│   │   ├── BaseLayout.astro       → head, meta tags, OG, fonts
│   │   └── BlogPostLayout.astro
│   ├── pages/
│   │   ├── index.astro            → hero + proyectos + contacto
│   │   ├── sobre-mi.astro         → resumen profesional breve, enlazado en el nav
│   │   ├── blog/
│   │   │   ├── index.astro        → listado de posts
│   │   │   └── [slug].astro       → post individual
│   │   └── rss.xml.js             → opcional, ver Open Questions
│   ├── styles/
│   │   └── global.css             → tema Tailwind, variables de color de acento
│   └── lib/
│       └── seo.ts                  → helpers de meta tags/OG
├── astro.config.mjs
├── tailwind.config.mjs
└── SPEC.md
```

## Code Style

**Componentes Astro (estáticos):**

```astro
---
interface Props {
  title: string;
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
}

const { title, stack, githubUrl, liveUrl } = Astro.props;
---

<article class="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-accent/50">
  <h3 class="text-lg font-semibold text-zinc-100">{title}</h3>
  <div class="mt-3 flex gap-2">
    {stack.map((tech) => (
      <TechBadge name={tech} />
    ))}
  </div>
</article>
```

**Islas React (interactividad):**

```tsx
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface TerminalLine {
  command: string;
  output: string[];
}

export default function TerminalHero({ lines }: { lines: TerminalLine[] }) {
  const [visibleLines, setVisibleLines] = useState(0);
  // lógica de secuencia typewriter...

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md bg-zinc-950 p-4 font-mono text-sm"
    >
      {/* ... */}
    </motion.div>
  );
}
```

**Convenciones:**

- Componentes Astro para todo lo estático/sin interacción de estado — minimiza JS enviado al cliente.
- Componentes React solo con `client:visible` (hidratación perezosa cuando entra al viewport), nunca `client:load` salvo que sea above-the-fold crítico (la terminal del hero sí puede justificar `client:load`).
- Nombres de archivo: `PascalCase.astro` / `PascalCase.tsx` para componentes, `kebab-case.ts` para utilidades.
- Un solo color de acento definido como variable CSS/Tailwind (`accent`), nunca hardcodeado en hex dentro de componentes. **Color confirmado: azul estilo React** (tono de referencia `#61DAFB`/azul vibrante, ajustar tono exacto en implementación para buen contraste AA sobre fondo oscuro).
- Sin comentarios explicando qué hace el código — solo donde haya una razón no obvia (ej. por qué se usa `client:visible` vs `client:load` en un componente específico).

## Testing Strategy

Dado que es un sitio estático personal sin lógica de negocio compleja, la estrategia se mantiene deliberadamente ligera:

- **Type-checking:** `astro check` en cada cambio — detecta errores de props/tipos en componentes y frontmatter de contenido mal formado contra el schema de `content/config.ts`.
- **Smoke tests E2E (Playwright):** un set mínimo de pruebas que verifican que el sitio no está roto, no que el diseño sea pixel-perfect:
  - La home carga y la terminal del hero termina su animación sin errores de consola.
  - El listado de blog muestra al menos los posts existentes y cada link lleva a un post real (sin 404).
  - Navegación mobile (viewport pequeño) no rompe el layout del header.
- **Lighthouse manual** antes de cada deploy a producción (performance, accesibilidad básica, SEO) — no automatizado en CI por ahora, es un proyecto personal sin pipeline de CI formal todavía.
- No se escriben tests unitarios para componentes puramente visuales sin lógica (ej. `TechBadge`) — el costo no se justifica para un portafolio personal.

## Boundaries

- **Siempre:**
  - Mantener dark mode como estética base y un único color de acento consistente en todo el sitio.
  - Cualquier componente React debe usar hidratación perezosa (`client:visible`) salvo justificación explícita para `client:load`.
  - Todo contenido de blog pasa por el schema de Content Collections (no se agregan posts "sueltos" sin frontmatter válido).
  - Verificar el sitio en mobile antes de considerar una sección "terminada".
- **Preguntar primero:**
  - Agregar cualquier dependencia nueva no mencionada en este spec (especialmente librerías de animación adicionales, CMS, backend, base de datos).
  - Cambiar el dominio, la configuración DNS, o el proveedor de hosting elegido.
  - Añadir cualquier dato personal además de email/GitHub/LinkedIn.
- **Nunca:**
  - Incluir foto personal, timeline de empleos (empresa/cargo/fechas) o datos personales más allá de lo acordado (email, GitHub, LinkedIn).
  - Inventar proyectos falsos o demos presentados como reales.
  - Usar iconografía/logos de marcas de forma que viole su licencia de uso (verificar licencia de Simple Icons/Devicon, que son MIT/libres para este uso).
  - Comprometer performance (ej. librerías de animación pesadas cargadas globalmente) en nombre de una decoración menor.

## Success Criteria

- `npm run build` compila sin errores y `astro check` no reporta errores de tipos.
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90 en la home.
- La home muestra: hero con wordmark de tratamiento distintivo + titular display + terminal que acepta comandos, panel de instrumentos con datos reales, sección de proyectos con tarjetas (nombre/descripción/stack/links), sección de contacto (email/GitHub/LinkedIn).
- El fondo es un campo de estrellas que reacciona al puntero y al scroll (paralaje por profundidad y trazos de warp al acelerar), y en desktop un HUD fijo muestra la altitud y la fase alcanzada según el avance del scroll.
- El nav incluye la página "Sobre mí" (Inicio → Sobre mí → Blog) con el resumen profesional breve.
- El blog lista posts desde `src/content/blog/*.mdx` y cada post individual muestra fecha, badges de tecnología con logos, y código con syntax highlighting; seleccionar texto en un post lo resalta con el color de acento.
- El listado de blog permite buscar por texto y filtrar por tag, y pagina los resultados — todo sin backend (client-side), para que siga siendo navegable a medida que se agregan posts nuevos.
- El sitio es completamente usable y visualmente correcto en viewport mobile (375px) y desktop.
- El sitio responde en el dominio `abelitolll.com` desplegado (Vercel por defecto, según recomendación).
- Open Graph image y meta tags generan una preview correcta al compartir el link en LinkedIn/Twitter.

## Decisiones cerradas en esta sesión (previamente abiertas)

- **Color de acento:** azul estilo React. Cerrado.
- **Deploy:** Vercel. Cerrado.
- **Proyectos:** no existen proyectos reales hoy → sección "en construcción" con placeholder de alta calidad visual (ver Boundaries y Project Structure). La estructura (`src/content/projects/`, `ProjectCard.astro`) se construye igual, lista para recibir contenido real sin refactor cuando existan proyectos. Cerrado.

## Open Questions — todas resueltas

1. **Primer contenido del blog:** ✅ el blog arranca vacío de contenido real. Se crea **un post "seed" de ejemplo** (con código, tags/stack, frontmatter completo) solo para validar visualmente el diseño del blog antes de escribir notas reales. Este post seed se marca claramente como contenido de prueba (ej. `draft: true` o similar en el frontmatter) para no confundirlo con una nota real, y se elimina o reemplaza cuando el usuario empiece a escribir de verdad.
2. **Tratamiento del wordmark "abelitolll":** ✅ libertad creativa total para Claude al momento de implementar (glitch, ensamblado, u otro efecto con las "L"), siempre dentro del límite de "sutil y elegante" ya acordado — no debe sentirse ruidoso ni afectar la legibilidad del nombre.
3. **Copy de la sección "en construcción":** ✅ tono **personal/casual** (ej. "Estoy construyendo cosas interesantes, pronto las verás aquí" o variación propia de Claude en ese tono), manteniendo la misma calidad visual del resto del sitio — no es un texto plano de disculpa, es una pieza de diseño más.
4. **RSS feed:** ✅ se omite. El blog es de uso personal, sin audiencia externa suscribiéndose. Se puede agregar en el futuro sin fricción si cambia el caso de uso.
5. **i18n futuro:** ✅ se construye 100% en español, sin preparar estructura de carpetas/rutas para inglés. Si en el futuro se necesita, se aborda como trabajo aparte en ese momento — no se sobre-ingenieriza ahora.

## Próximo paso

El spec está completo y cerrado — sin preguntas abiertas pendientes. El siguiente paso en el flujo de spec-driven development es la **fase de Plan** (`tasks/plan.md`): desglosar este spec en componentes, orden de implementación, y dependencias — seguido de la fase de Tasks y la implementación incremental. Ese trabajo puede arrancar en una sesión nueva usando este `SPEC.md` como única fuente de verdad.
