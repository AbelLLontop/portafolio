// Fuente única del perfil. STACK lo consumen los tres lugares donde aparecen
// las tecnologías: el carrusel del inicio (logos), Sobre mí (badges) y la
// respuesta del comando `stack` en la consola. Antes el carrusel tenía su
// propia lista y las dos se fueron separando.
export interface Tech {
  name: string;
  iconKey?: string;
}

// simple-icons no trae logo de SQL Server ni de AWS (los retiró por marca):
// esas dos se muestran como texto donde el resto muestra su logo.
export const STACK: Tech[] = [
  { name: "Node.js", iconKey: "node" },
  { name: "NestJS", iconKey: "nestjs" },
  { name: "Express", iconKey: "express" },
  { name: "Java", iconKey: "java" },
  { name: "Spring Boot", iconKey: "springboot" },
  { name: "Go", iconKey: "go" },
  { name: "Python", iconKey: "python" },
  { name: ".NET", iconKey: "dotnet" },
  { name: "TypeScript", iconKey: "typescript" },
  { name: "React", iconKey: "react" },
  { name: "Angular", iconKey: "angular" },
  { name: "Astro", iconKey: "astro" },
  { name: "Tailwind", iconKey: "tailwind" },
  { name: "PostgreSQL", iconKey: "postgresql" },
  { name: "SQL Server" },
  { name: "MongoDB", iconKey: "mongodb" },
  { name: "Docker", iconKey: "docker" },
  { name: "Nginx", iconKey: "nginx" },
  { name: "Git", iconKey: "git" },
  { name: "AWS" },
  { name: "Claude", iconKey: "claude" },
];

export const YEARS_OF_EXPERIENCE = 3;

/** Lo usa el dialogo de apertura de la consola del hero. */
export const WORK_APPROACH: [string, string][] = [
  ["metodología", "ágil"],
  ["foco", "sistemas robustos y mantenibles"],
  ["escribo", "también lo que se rompió"],
];

export interface Contact {
  key: "github" | "linkedin";
  label: string;
  /** Como se muestra en la consola, donde el link es el destino y no un boton. */
  display: string;
  href: string;
  external: boolean;
}

export const CONTACTS: Contact[] = [
  {
    key: "github",
    label: "GitHub",
    display: "github.com/AbelLLontop",
    href: "https://github.com/AbelLLontop",
    external: true,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    display: "in/abelllontopmeza",
    href: "https://www.linkedin.com/in/abelllontopmeza/",
    external: true,
  },
];
