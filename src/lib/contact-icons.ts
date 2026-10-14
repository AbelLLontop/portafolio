import githubIconRaw from "simple-icons/icons/github.svg?raw";
import linkedinIconRaw from "./icons/linkedin.svg?raw";
import type { Contact } from "./profile.ts";

const withCurrentColor = (svg: string) => svg.replace("<svg ", '<svg fill="currentColor" ');


// Compartido por la seccion de contacto y por la consola del hero, que antes
// habrian terminado con dos copias del mismo markup.
export const CONTACT_ICONS: Record<Contact["key"], string> = {
  github: withCurrentColor(githubIconRaw),
  linkedin: withCurrentColor(linkedinIconRaw),
};
