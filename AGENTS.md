# Instrucciones del proyecto

Leer README, docs/memoria-del-chat.md, docs/continuity.md, docs/original-prompt.md y la constitución antes de trabajar.
El contexto vigente es TheGame / La Casa del Azar, no el proyecto anterior JuegoFiore.
La fuente vigente está en codex/ink-theatre; la build pública se sirve desde gh-pages.
Pedido vigente del 2026-10-23: todos los textos sin serifa, incluidos créditos y etiquetas 3D.
El prompt explícito del usuario tiene prioridad. La fase documental está completada; el 2026-10-23
el usuario autorizó continuar hasta un MVP y hostearlo. Ver docs/mvp-scope.md y mvp-validation.md.
No perder archivos existentes ni forzar Git.

## Fuentes de verdad

- Experiencia: docs/vision.md y docs/game-design.md.
- Reglas, puntos, reintentos y transferencia: docs/educational-design.md.
- Arquitectura y propiedad transversal: docs/architecture.md y specs/README.md.
- Spec activa: .specify/feature.json; no inferirla de la rama Git.
- Trabajo pendiente: tareas sin marcar en specs. Checkbox documental aprobado no implica gameplay hecho.

## Skills portables y enrutamiento

Revisar docs/skills.md y skills-manifest.json. Leer sólo skills pertinentes antes de aplicarlas;
registrar aplicación en evidencia. Reinstalar/verificar con python scripts/skills.py.
El router upstream se descartó porque no reconoce Babylon.js. No cambiar motor por su ausencia.

| Trabajo | Skills locales |
| --- | --- |
| Diseño y validación con jugadores | game-designer, prototype-fast |
| Arte y props | create-game-assets; blender-image-to-3d opcional con dependencias verificadas |
| Interfaz educativa | game-ui-ux + frontend-design |
| Cámara y controles | camera-systems + input-systems |
| Narrativa | dialogue-systems |
| RNG, rivales, progreso, guardado | game-ai + save-systems |
| Ambiente y acabado | audio-design + game-feel; shader-programming sólo si PBR no alcanza |
| Sala y presupuestos | level-design + performance-optimization |
| Navegador | webapp-testing; no equiparar DOM con canvas válido |
| Especificaciones | speckit-constitution/specify/clarify/plan/tasks/analyze |

Las disciplinas contienen ejemplos Godot/Unity/GLSL; sirven como conceptos, nunca autoridad de API.
Consultar documentación Babylon.js oficial para implementación. No instalar motores, frameworks,
servicios, assets o dependencias por ejemplo de skill. Auditar scripts antes de ejecutar.
Preferencias de autores u otros clientes no son requisitos de este proyecto.

## Validación y publicación

Núcleo matemático puro, RNG inyectable, decisiones y suerte separadas, progreso finito con ayuda.
No afirmar diversión, aprendizaje, rendimiento o accesibilidad sin medición y evidencia apropiada.
Antes de push ejecutar validaciones documentales y matemáticas, revisar secretos/licencias/diff.
Crear PR sin merge automático. No añadir secretos a carpetas de agentes.
