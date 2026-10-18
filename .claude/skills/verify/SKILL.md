---
name: verify
description: Corre la suite de verificación completa del repo (type-check, build, e2e) en el orden correcto y reporta un veredicto claro. Usar antes de marcar cualquier feature o fix como terminado, o cuando el usuario pida "verificar" o "correr los tests".
allowed-tools: Bash(npm run check:*), Bash(npm run build:*), Bash(npx playwright test:*)
---

# Verify

Corre, en este orden exacto, deteniéndose en el primer fallo bloqueante:

1. `npm run check`
2. `npm run build`
3. `npx playwright test --workers=1`

El flag `--workers=1` es obligatorio en este repo: en paralelo los tests E2E son inestables. No lo quites ni lo cambies aunque la corrida parezca más lenta.

## Reglas duras

- **Prohibido hacer pasar un test tocando el test.** No usar `.skip`, `.only`, inflar timeouts, ni debilitar aserciones (cambiar un `toBe` estricto por un `toContain` laxo, por ejemplo) para que algo rojo se vea verde. Si un test falla, el fallo se reporta, no se maquilla.
- **Preexistente vs. regresión.** Antes de reportar un fallo como "ya estaba roto" o como "nuevo", hay que poder sustentarlo. Si no es evidente por el mensaje de error o el historial reciente, no asumir: correr la misma suite contra el estado anterior (por ejemplo `git stash` + correr, o la rama/commit base) y comparar los resultados punto a punto. Nunca adivinar cuál fallo es preexistente.
- **Nunca marcar algo como terminado con el bloque de veredicto en rojo.** Si `check`, `build` o `e2e` no pasan, el trabajo sigue abierto, sin excepción.

## Al detenerse en un fallo

Si un paso falla de forma bloqueante, no se sigue con el siguiente paso. Se reporta el error real (salida del comando, no un resumen inventado) y se aplica la regla de preexistente-vs-regresión antes de concluir nada.

## Bloque de veredicto final

Siempre, haya pasado todo o no, terminar con exactamente estas 3 líneas:

```
check: <PASA/FALLA>
build: <PASA/FALLA> (<N> páginas)
e2e: <X>/<Y>
```

Donde `<N>` es el número de páginas que reportó el build, y `<X>/<Y>` son los tests E2E que pasaron sobre el total corrido.
