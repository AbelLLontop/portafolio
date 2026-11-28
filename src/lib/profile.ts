// Fuente única del perfil: el stack por áreas, los años de experiencia y los
// contactos. Los usa el bloque "yo" del inicio.

// El stack por áreas. El título de cada grupo vive en el diccionario
// (`stack.group.<clave>`).
export type StackGroupKey = "backend" | "frontend" | "data" | "infra" | "ai";

export const STACK_GROUPS: Record<StackGroupKey, string[]> = {
  backend: [
    "Node.js",
    "NestJS",
    "Express",
    "Java",
    "Spring Boot",
    "Go",
    "Python",
    ".NET",
  ],
  frontend: ["TypeScript", "React", "Angular", "Astro", "Tailwind"],
  data: ["PostgreSQL", "SQL Server", "MongoDB"],
  infra: ["Docker", "Nginx", "Git", "AWS"],
  ai: ["Claude"],
};

export const YEARS_OF_EXPERIENCE = 3;

export interface Contact {
  key: "github" | "linkedin";
  label: string;
  href: string;
  external: boolean;
}

export const CONTACTS: Contact[] = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/AbelLLontop",
    external: true,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abelllontopmeza/",
    external: true,
  },
];
