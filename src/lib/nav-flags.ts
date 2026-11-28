// Cómo llegó esta vista: ¿por una carga del documento o por el router de
// cliente? El sitio navega con `<ClientRouter />` (ver
// BaseLayout.astro), así que entre páginas no hay documento nuevo: el <body>
// se reemplaza y las islas vuelven a montarse. Eso obliga a distinguir una
// carga de verdad de un swap, porque las animaciones de entrada no se piensan
// igual en los dos casos.
//
// La marca va como clase en <html>, las escribe el script de
// navegación de BaseLayout en `astro:after-swap` (con el DOM nuevo puesto y
// antes del primer pintado) y las consumen el CSS y las islas.
//
// Va por clases en el documento y no por un flag que cada isla lea por su
// cuenta: así la decisión la toma un único script antes de pintar, y las islas
// no pueden desincronizarse entre sí ni con el HTML que llegó del servidor
// (cada isla se empaqueta aparte, así que no comparten estado de módulo).

/**
 * La vista llegó por el router de cliente, no por una carga del documento.
 * Lo que ya se vio en esta sesión no se vuelve a representar.
 */
export const SWAP_CLASS = "nav-swap";

/** Solo tiene sentido en cliente. */
function hasFlag(flag: string): boolean {
  return document.documentElement.classList.contains(flag);
}

/** ¿Esta vista llegó por el router de cliente? */
export function isSwapNav(): boolean {
  return hasFlag(SWAP_CLASS);
}
