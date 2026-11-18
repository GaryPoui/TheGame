# LEER ANTES DE SEGUIR — contexto temporal para la próxima IA

Última actualización: 2026-10-29. Proyecto: **TheGame / La Casa del Azar**, en `C:\Users\TomyG\Downloads\TheGame`. El usuario se tiene que ir y pidió guardar y subir todo el avance actual. No seguir retocando el diseño por iniciativa propia durante este cierre.

## Primero

Leer `AGENTS.md`, `README.md`, `docs/memoria-del-chat.md`, `docs/continuity.md`, `docs/original-prompt.md` y `.specify/memory/constitution.md`. Consultar `delivery.json` para los hashes, la versión pública y la evidencia más recientes: este archivo puede pertenecer a un commit anterior al registro final de publicación.

El proyecto vigente NO es JuegoFiore. Usar la rama `codex/complete-campaign`, PR abierto https://github.com/GaryPoui/TheGame/pull/7. La web pública es https://garypoui.github.io/TheGame/ y se sirve desde `gh-pages`. No forzar Git, no perder archivos ni hacer merge automático del PR. Inspeccionar primero el estado local y los cambios ajenos.

## Qué está implementado y qué pidió el usuario

- Campaña jugable: urnas de Vera, dados/contratos de Doble, fotos tramposas de Ada y desafío final con epílogo. Guardado local v5 compatible con versiones anteriores, ayuda finita y práctica que conserva sellos/libertad.
- Estética actual: ilustración de tinta y acuarela de los años treinta, moderadamente tétrica. Todos los textos sin serifa. Mantenerla.
- Personajes de cuerpo completo sólo en diálogos independientes. En partidas se ven desde la cintura, detrás/apoyados en la mesa, sin duplicarlos en el panel derecho.
- Doble: mesa protagonista, crupier proporcionado, cintura y sombrero completos. No volver a miniaturizarlo para que entre en el cuadro. La cámara menos elevada y el espacio vertical acomodan personaje y mesa juntos. Las cartas son compactas, pero sus combinaciones tienen caras dibujadas de al menos 20 px. Los dados se animan y muestran sus números y suma; animación y azar están separados.
- El usuario rechazó la antigua presentación de Ada por verse desconectada de las demás. El último avance integra Ada a la misma mesa 3D, con fotos sobre el paño, retrato completo de torso, panel compacto y botones consistentes. Ganadas/perdidas llevan símbolo y texto. El diagnóstico inicial sigue siendo sin puntos, con respuesta No bajo las condiciones explícitas de moneda equilibrada y lanzamientos independientes. La dificultad avanzada de proporciones y dos victorias seguidas se conserva.
- El usuario autorizó implementar, subir al repositorio y hostear. Última prioridad: subir el estado actual sin más retoques. Este archivo fue pedido para facilitar la continuidad.

## Último avance de Ada

Commit de implementación: `30558630b8b25ed51c1b8b5157302eee76f1a8a0` (ya enviado a `origin/codex/complete-campaign`). Los commits posteriores añaden este contexto y registran la publicación. Ver `delivery.json` para el estado público definitivo.

Archivos principales:

- `src/ui/ada-table.ts` y `src/ui/ada-table.css`: composición de la mesa, fotos, panel, comparación de álbumes, adaptación a celular y alternativa HTML.
- `src/ui/photo-records.ts`: diagnóstico y juego de fotos; textos iniciales simplificados sin cambiar condiciones matemáticas.
- `src/presentation/scene.ts`: el canvas compartido elige anfitrión `doble` o `ada`; Ada usa su textura existente y no muestra dados. Recalcula el campo visual al redimensionar.
- `src/main.ts`: mueve y conserva el único canvas entre las vistas; activa el render de Ada. Revisar los cambios de mesa si se toca esta lógica.
- `tests/browser/ada-layout.spec.ts`: tres casos nuevos de diseño adaptable, comparación avanzada y ausencia de WebGL.
- `docs/ada-table-redesign.md` y `docs/evidence/ada-table-redesign/`: descripción, capturas y resultados.

La vista de registros anterior a las fotos conserva su ruta de compatibilidad. No forzar una migración ni reiniciar partidas para cambiar sólo la presentación.

## Verificación y límites

En el último avance se aprobaron build/TypeScript, **41 pruebas unitarias**, los **34 recorridos completos locales de navegador**, **70 comprobaciones matemáticas**, documentación y **92 archivos de skills**. La suite terminó con 34 aprobados, sin fallos, inestables ni omitidos. Las capturas de escritorio, celular y comparación fueron revisadas. La verificación pública final y la CI deben consultarse en `delivery.json`; no asumir que una CI pendiente pasó.

Esto no prueba aprendizaje, diversión, duración, accesibilidad integral ni rendimiento con GPU física. La tarea externa `010/T011` sigue pendiente. El navegador de pruebas utiliza Chromium con ANGLE SwiftShader en Windows.

Las reglas viven en TypeScript puro; RNG inyectable, decisiones y suerte separadas. No alterar probabilidades, méritos, independencia, límites de ayuda ni formatos de guardado al mejorar el diseño. La spec activa se consulta en `.specify/feature.json`; no se infiere de la rama.

## Cómo continuar de forma segura

Consultar las fuentes de verdad indicadas en `AGENTS.md` y leer sólo las skills pertinentes de `.agents/skills`. Para UI: `game-ui-ux` y `frontend-design`; para encuadre: `camera-systems`; para navegador: `webapp-testing`, usando el Playwright TypeScript instalado. Verificar skills con `python scripts/skills.py verify`. No agregar motores, frameworks, servicios, assets ni dependencias por ejemplos de una skill. Consultar las APIs oficiales de Babylon.js o sus declaraciones del paquete instalado.

Verificar el resultado real del canvas, no sólo el DOM. Mantener pruebas de diagnóstico sin puntos, fotos faltantes, comparación de proporciones, texto ampliado, teclado, guardado y cambios entre Vera/Doble/Ada. Si aparece un fallo, reproducirlo antes de ampliar pruebas o cambiar reglas.

Comandos habituales desde la raíz:

```powershell
npm test
npm run build
python scripts/verify-docs.py
python scripts/verify-math.py
python scripts/skills.py verify
npm run test:browser
```

Para publicar una build revisada, usar `scripts/publish-pages.ps1` con una versión nueva; registrar antes el inventario con `scripts/build-report.mjs` y después verificar HTTPS y hashes con `scripts/verify-pages.mjs`. No publicar un `dist` viejo ni afirmar una publicación sólo por hacer push de la rama de código. No hace falta volver a publicar por un commit que sólo registra evidencia.

## Borrar este archivo al finalizar la reanudación

**Este archivo es temporal. La próxima IA debe leerlo, contrastarlo con el repositorio y, al terminar la primera tarea que retome, actualizar la documentación permanente y eliminar `LEER-ANTES-DE-SEGUIR.md`. Subir también ese borrado con el trabajo terminado.** No eliminarlo ahora antes de que sirva de contexto, ni borrar `AGENTS.md`, la memoria, la continuidad o la evidencia permanente.
