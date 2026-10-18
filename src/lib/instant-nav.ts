// Cambiar de idioma recarga el documento (el sitio es estático, sin router de
// cliente), y en una carga normal todo vuelve a animarse: las secciones se
// revelan de nuevo y la consola retipea su diálogo de apertura. Para el
// cambio de idioma eso no se quiere — el texto tiene que aparecer ya puesto,
// como si solo se hubieran reemplazado las palabras.
//
// Cómo funciona: el enlace de idioma deja una marca en sessionStorage; un
// script inline en el <head> (ver BaseLayout.astro) la lee ANTES del primer
// pintado y le pone una clase al <html>. Desde ahí, el CSS deja las secciones
// en su estado final y la consola se salta el tecleo.
//
// Va por una clase en el documento y no leyendo sessionStorage desde cada
// isla: así la decisión la toma un único script síncrono antes de pintar, y
// las islas no corren riesgo de desincronizarse con el HTML que llegó del
// servidor (sessionStorage no existe al renderizar, así que leerlo durante el
// render daría un valor distinto en cliente y en servidor).

export const INSTANT_NAV_KEY = "abelitolll:instant-nav";
export const INSTANT_NAV_CLASS = "instant-nav";

/** Marca la próxima carga para que llegue sin animaciones de entrada. */
export function markInstantNav(): void {
  try {
    sessionStorage.setItem(INSTANT_NAV_KEY, "1");
  } catch {
    // Modo privado o cookies bloqueadas: se pierde el "sin animación", que
    // es una mejora, no un requisito. La navegación funciona igual.
  }
}

/** ¿Esta carga viene de un cambio de idioma? Solo tiene sentido en cliente. */
export function isInstantNav(): boolean {
  return document.documentElement.classList.contains(INSTANT_NAV_CLASS);
}
