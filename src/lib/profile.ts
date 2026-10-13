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
