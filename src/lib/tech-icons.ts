import astroIcon from "simple-icons/icons/astro.svg?raw";
import typescriptIcon from "simple-icons/icons/typescript.svg?raw";
import tailwindcssIcon from "simple-icons/icons/tailwindcss.svg?raw";
import nodejsIcon from "simple-icons/icons/nodedotjs.svg?raw";
import goIcon from "simple-icons/icons/go.svg?raw";
import javaIcon from "simple-icons/icons/openjdk.svg?raw";
import pythonIcon from "simple-icons/icons/python.svg?raw";
import dotnetIcon from "simple-icons/icons/dotnet.svg?raw";
import claudeIcon from "simple-icons/icons/claude.svg?raw";
import reactIcon from "simple-icons/icons/react.svg?raw";
import angularIcon from "simple-icons/icons/angular.svg?raw";
import nestjsIcon from "simple-icons/icons/nestjs.svg?raw";
import springbootIcon from "simple-icons/icons/springboot.svg?raw";
import expressIcon from "simple-icons/icons/express.svg?raw";
import dockerIcon from "simple-icons/icons/docker.svg?raw";
import postgresqlIcon from "simple-icons/icons/postgresql.svg?raw";
import mongodbIcon from "simple-icons/icons/mongodb.svg?raw";
import nginxIcon from "simple-icons/icons/nginx.svg?raw";
import gitIcon from "simple-icons/icons/git.svg?raw";

// Mapa estático: los iconos de simple-icons se importan explícitamente (sin
// import() dinámico, que Vite no puede resolver de forma fiable en build SSG).
// Agregar una línea aquí al introducir un nuevo logo. Compartido entre
// TechBadge y TechMarquee para evitar mapas divergentes.
export const TECH_ICONS: Record<string, string> = {
  astro: astroIcon,
  typescript: typescriptIcon,
  tailwind: tailwindcssIcon,
  node: nodejsIcon,
  go: goIcon,
  java: javaIcon,
  python: pythonIcon,
  dotnet: dotnetIcon,
  claude: claudeIcon,
  react: reactIcon,
  angular: angularIcon,
  nestjs: nestjsIcon,
  springboot: springbootIcon,
  express: expressIcon,
  docker: dockerIcon,
  postgresql: postgresqlIcon,
  mongodb: mongodbIcon,
  nginx: nginxIcon,
  git: gitIcon,
};

export function monoIcon(name: string): string | undefined {
  return TECH_ICONS[name.toLowerCase()]?.replace(
    "<svg ",
    '<svg fill="currentColor" ',
  );
}
