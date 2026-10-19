// Conventional Commits, sin agregados propios: el ambito es libre y opcional.
// Lo corre CI sobre los commits de la rama y sobre el titulo del PR
// (.github/workflows/pr-checks.yml). No hay hook local a proposito: un hook
// lento se termina salteando con --no-verify y la puerta real es el PR.
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // El cuerpo y el pie de los commits de este repo se escriben a mano y a
    // veces incluyen rutas largas o salidas de comandos que no se pueden
    // partir sin perder sentido.
    "body-max-line-length": [0, "always"],
    "footer-max-line-length": [0, "always"],
  },
};
