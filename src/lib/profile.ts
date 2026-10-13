// Fuente única del perfil: lo consumen el Hero (respuestas de la consola),
// StatsPanel y la página Sobre mí, para que no haya dos listas que mantener.
export interface Tech {
  name: string;
  iconKey?: string;
}

export const STACK: Tech[] = [
  { name: "Node.js", iconKey: "node" },
  { name: "NestJS", iconKey: "nestjs" },
  { name: "Java", iconKey: "java" },
  { name: "Spring Boot", iconKey: "springboot" },
  { name: "SQL Server" },
  { name: "AWS" },
  { name: "Angular", iconKey: "angular" },
  { name: "React", iconKey: "react" },
];

export const YEARS_OF_EXPERIENCE = 3;

/** Lo leen la consola del hero y la pagina Sobre mi, para no mantener dos listas. */
export const WORK_APPROACH: [string, string][] = [
  ["metodología", "ágil"],
  ["foco", "sistemas robustos y mantenibles"],
  ["escribo", "también lo que se rompió"],
];

export interface Contact {
  key: "email" | "github" | "linkedin";
  label: string;
  /** Como se muestra en la consola, donde el link es el destino y no un boton. */
  display: string;
  href: string;
  external: boolean;
}

export const CONTACTS: Contact[] = [
  {
    key: "email",
    label: "Email",
    display: "a.llontopmeza@gmail.com",
    href: "mailto:a.llontopmeza@gmail.com",
    external: false,
  },
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
