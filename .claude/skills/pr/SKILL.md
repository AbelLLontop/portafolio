---
name: pr
description: Abre un pull request de la rama actual contra main con el alcance real de toda la rama, verificación corrida y una descripción con plantilla fija. Usar cuando el usuario pida "abrir un PR", "crear el pull request" o "mandar esto a revisión".
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git diff:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*)
---

# PR

## Precondiciones (verificar antes de hacer nada)

1. **No estar en `main`.** Correr `git branch --show-current`. Si devuelve `main`, detenerse ahí mismo y proponer crear una rama (`tipo/descripcion-corta`, según la convención de `CLAUDE.md`) en vez de abrir el PR. No seguir con el resto del procedimiento.
2. **Que la verificación haya pasado en esta sesión.** Si en esta conversación no se corrió ya el skill `verify` (o se corrió y quedó algo en rojo), invocar `/verify` primero y esperar su veredicto. No abrir el PR con `check`, `build` o `e2e` en rojo, ni asumir que "probablemente pasa" porque pasó una vez antes.

## Procedimiento

1. Ver el alcance real de **toda la rama**, no solo el último commit:
   - `git log main..HEAD --oneline`
   - `git diff main...HEAD --stat`
2. Si la rama no tiene upstream todavía, `git push -u origin HEAD`.
3. Abrir el PR con `gh pr create --title "..." --body "..."`, usando la plantilla de abajo.

## Título

Sigue la convención de commits de `CLAUDE.md`: `tipo(ámbito): descripción` (o `tipo: descripción` cuando el cambio no es de tooling). Si la rama mezcla varios tipos/ámbitos sin un commit que domine claramente, elegir el que mejor resuma el conjunto — nunca concatenar varios con "y".

## Plantilla del body

```markdown
## Qué cambia

- <bullet orientado a resultado visible, no a archivos tocados>
- <2 a 4 bullets en total>

## Por qué

<un párrafo con el problema que resuelve esta rama>

## Verificación

- [x] `npm run check` — PASA
- [x] `npm run build` — PASA (<N> páginas)
- [x] `npx playwright test --workers=1` — <X>/<Y>

## Riesgo

**<bajo/medio/alto>** — <qué mirar si algo sale mal>
```

Los resultados de "Verificación" son los reales de la corrida de `/verify` de esta sesión — nunca un checklist optimista sin haber corrido los comandos.

## Reglas duras

- **Nada de líneas de coautoría ni emojis**, ni en el título ni en el body — ni siquiera las líneas de atribución que Claude Code agrega por defecto a PRs.
- **No usar "Closes #N" / "Fixes #N"** a menos que el usuario lo pida explícitamente. No cerrar issues automáticamente por default.
- **Rama con muchos archivos e intenciones distintas:** si `git diff main...HEAD --stat` muestra cambios que no comparten una sola intención lógica (ej. una feature de UI mezclada con un refactor de infraestructura no relacionado), detenerse antes de abrir el PR y proponer partir la rama en commits/PRs separados. No abrir un PR mezclado solo porque ya está todo commiteado.
