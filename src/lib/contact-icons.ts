import githubIconRaw from "simple-icons/icons/github.svg?raw";
import linkedinIconRaw from "./icons/linkedin.svg?raw";
import type { Contact } from "./profile.ts";

const withCurrentColor = (svg: string) => svg.replace("<svg ", '<svg fill="currentColor" ');

const mailIcon = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6.75A1.5 1.5 0 0 1 4.5 5.25h15a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V6.75Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 7 7.386 5.166a1.5 1.5 0 0 0 1.728 0L20.25 7"/></svg>`;

// Compartido por la seccion de contacto y por la consola del hero, que antes
// habrian terminado con dos copias del mismo markup.
export const CONTACT_ICONS: Record<Contact["key"], string> = {
  email: mailIcon,
  github: withCurrentColor(githubIconRaw),
  linkedin: withCurrentColor(linkedinIconRaw),
};
