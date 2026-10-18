/**
 * Reemplaza los marcadores {asi} de un texto del diccionario.
 *
 * Vive en su propio módulo, sin importar `ui.ts`, porque también lo usan las
 * islas React: si lo tomaran de `./index.ts` se arrastraría el diccionario
 * completo (los dos idiomas) al bundle del cliente.
 *
 * Existe porque las islas reciben el copy como props serializadas —strings,
 * no funciones—, así que la interpolación tiene que pasar del lado del
 * cliente.
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
