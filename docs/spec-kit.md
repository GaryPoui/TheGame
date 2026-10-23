# Spec Kit: instalación real y flujo aplicado

Se verificó la documentación actual y release oficial. Specify CLI **1.2.3**, Python **3.11.9**,
Windows AMD64. Origen PyPI oficial; tag fuente `v1.2.3`, ref
`8ac9e8103319d98099cfc274a2517bb2b621626c`. Se conserva [licencia MIT](../third-party/spec-kit/LICENSE).

## Ejecución comprobada

Se comprobó que uv 0.12.23 ya estaba instalado como módulo Python. `uv tool install` detectó una
instalación anterior de specify 1.1.2 y la actualizó a la versión fijada. uv no estaba en PATH;
se lo invocó como módulo. Ejecutado:

```powershell
python -m uv tool install specify-cli==1.2.3
& "$env:USERPROFILE/.local/bin/specify.exe" version
& "$env:USERPROFILE/.local/bin/specify.exe" init --help
& "$env:USERPROFILE/.local/bin/specify.exe" init --here --force --non-interactive --integration codex --script ps --ignore-agent-tools
& "$env:USERPROFILE/.local/bin/specify.exe" integration status
```

`--force` se usó sólo después de verificar que no había .specify ni .agents preexistentes; el README
del usuario se preservó hasta su actualización solicitada. `--ignore-agent-tools` evita comprobar
un ejecutable CLI no necesario para leer skills desde este agente de escritorio; no cambia la
integración elegida. No se instaló una integración ficticia ni se invocó un agente externo.

Evidencias: [init](evidence/specify-init.txt), [versión](evidence/specify-version.txt),
[integración](evidence/specify-integration.txt), [workflow por spec](evidence/spec-workflow.json).
Archivos reales: `.specify/scripts/powershell`, templates, workflows, init-options, integration y
`.agents/skills/speckit-*`. No se modificaron comandos generados. Se preservan sus bytes originales
mediante .gitattributes, incluso espacios finales upstream y CRLF de metadatos; la revisión de
espaciado de documentos propios los excluye deliberadamente. Constitución de proyecto v1.0.0,
primera ratificación, sin placeholders ni excepciones. Se resolvió el template antes de redactarla.

## Qué significa aplicar el flujo

Las skills son instrucciones para el agente, **no ejecutables CLI que redacten documentos solos**.
Se leyeron constitution, specify, clarify, plan, tasks y analyze, se resolvieron templates y se
ejecutaron los scripts auxiliares por cada una de las diez features. Se autoró una feature por
paso, fijando `.specify/feature.json`; no se crearon diez ramas de implementación.

1. Constitution: principios derivados del prompt, sólo gobernanza; después se pasó a otras tareas.
2. Specify: dos historias por feature, requisitos/criterios/casos límite y checklist.
3. Clarify: script PathsOnly y revisión de ambigüedades; cero preguntas críticas necesarias,
   cero respuestas inventadas. Supuestos reversibles registrados, público/equipo final pendientes.
4. Plan: `setup-plan.ps1 -Json` creó template; agente completó plan, research, datos, contrato y guía.
5. Tasks: `setup-tasks.ps1 -Json`, tareas por historia y dependencias; todas sin ejecutar.
6. Analyze: `check-prerequisites.ps1 -Json -RequireSpec -RequireTasks -IncludeTasks`, lectura cruzada
   y revisión independiente. Resultado conservado fuera del análisis de sólo lectura en
   [informe de consistencia](consistency-analysis.md).

No existen extensiones/hooks personalizados. No se ejecutó implement, converge ni taskstoissues.
La constitución y el análisis no se usaron como permiso para generar código del juego.

## Continuar en otra sesión

Los archivos generados ya están versionados: no hace falta volver a ejecutar init ni pisarlos.
Instalar CLI fijado sólo si se necesitan sus herramientas. Actualizar `.specify/feature.json` para
la feature a trabajar; cambiar rama no selecciona spec. Abrir Codex en la raíz y leer AGENTS.md.
Las invocaciones nativas son `$speckit-specify`, `$speckit-clarify`, `$speckit-plan`, `$speckit-tasks`,
`$speckit-analyze`; pueden aparecer tras un turno nuevo o al reabrir sesión. Leer el SKILL.md local
es alternativa explícita para aplicar el procedimiento sin afirmar recarga automática del catálogo.

Para una revisión de 001:

```powershell
./.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireSpec -RequireTasks -IncludeTasks
```

No ejecutar setup-plan sobre un plan completado para regenerar todo: revisarlo incrementalmente.
Ante una nueva versión de Spec Kit verificar instrucciones y comparar cambios en una rama.
Fuentes: [instalación](https://github.github.io/spec-kit/installation.html),
[Codex](https://github.github.io/spec-kit/integrations/codex.html),
[SDD](https://github.github.io/spec-kit/quickstart.html), consultadas 2026-10-22.
