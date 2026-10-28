# Campaña completa — implementación 2026-10-26

Pedido vigente: completar las specs pendientes, integrar la última mesa, conservar la dirección de tinta y subir avances por commits. La autorización amplía el foco anterior limitado a urnas. Rama `codex/complete-campaign`.

## Integración de trabajo existente

Se integró `origin/codex/doble-contracts` (f1e9aab) con `codex/urn-feedback` (8bf9f04). Se conservaron cartas ocultas, selección sincronizada, comparación previa al sorteo y corrección verde/roja de las urnas. Se incorporaron Doble, su arte, contratos, simulador independiente y progreso de dos sellos. Primer commit integrado: 4b18e56.

## Reglas implementadas

Ada (`src/core/tables/records.ts`) conserva índices, fuente y bloques completos. R1 cambia álbum por archivo preparado; R2 añade cuatro ensayos independientes; R3 distingue garantía de igualdad de medias; R4 comienza con cuatro ceros. La regla fuente completa y n≥8 permite un informe descriptivo, nunca una certeza. El error inicial lleva al estado canónico rotulado; no bloquea ni repuntúa. No hay tercer bloque ni deuda. Las ayudas son dos escenarios preparados de dos acciones.

El anfitrión (`src/core/tables/finale.ts`) usa dos extracciones sin reposición, C para umbral de cuatro y J para promedio, y archivo completo seguido de descripción. Son seis decisiones, 4/6 abre la salida. Menos activa cuatro acciones guiadas. Fichas y saldo no condicionan libertad. El epílogo y la libertad persisten al practicar. La transferencia final es opcional y no puntúa.

Los comandos incluyen identificador y revisión; se rechazan duplicados y revisiones antiguas sin consumir RNG. Los validadores reconstruyen sesiones desde sus comandos y seed, incluyendo puntos, resultados y recursos. Matemática y render siguen separados.

## Persistencia e interfaz

`GameState` sigue siendo la única raíz. `src/core/campaign/progression.ts` centraliza requisitos y conserva el mejor método de cada sello. El envelope v3 acepta v1 de urnas y v2 de contratos; escribe la campaña con backup y pending. No degrada versiones futuras. Un cambio en otra pestaña conserva el nuevo guardado y deja la sesión actual en memoria con aviso.

Interfaz con papel, tinta, ciruela y latón existentes; tipografía sin serifa. Archivo con valores indexados, histograma y tabla equivalente. Corrección textual y símbolos además de color. Teclado nativo, pausa, texto al 200 %, silencio y reducción de movimiento. No se incorporaron dependencias.

## Verificación y límites

Primer corte: 24 pruebas unitarias aprobadas; incluyen 32 semillas de Ada y 64 del final en rutas normales y asistidas, 4/6 y 6/6, comandos repetidos, distribución de dados y recuperación existente. Las tres regresiones de cartas y picking real de urnas aprobaron tras integrar Doble. Build y typecheck aprobados. La evidencia posterior de navegador y publicación se añade al cerrar cada bloque.

Esto comprueba reglas y recorridos. No demuestra duración de 30–45 minutos, aprendizaje, diversión, accesibilidad certificada ni rendimiento de una GPU física. La validación con personas sigue siendo trabajo real pendiente.

## Skills aplicadas

Se verificaron 92 archivos de skills sin cambios. Se leyeron y aplicaron speckit-implement (checklists aprobadas y tareas), game-designer (reglas y límites de evidencia), save-systems (versiones, backup y checkpoints), game-ui-ux y frontend-design (interfaz de la misma familia), webapp-testing (regresiones de navegador sobre Playwright TypeScript ya instalado). Cámara, input y diálogos se revisan para el siguiente bloque. Los ejemplos de otros motores no se usan como API de Babylon.

La suite nueva de navegador cubrió la ruta Ada→anfitrión→calle, recarga con resultado confirmado, conservación de libertad al practicar, ayuda en ambas mesas, requisitos, teclado en silencio, 390 px con texto al 200 % y conflicto de otra pestaña. Capturas en `docs/evidence/campaign/`. Se corrigió el desborde del encabezado en la combinación de texto grande y ventana angosta. El ensayo opcional exige abrir su desplegable; la prueba lo reproduce como lo haría el jugador.

Retrato nuevo: `public/art/ada-v1.png`, generado con herramienta integrada usando Vera como referencia, con transparencia comprobada y sin modificar assets anteriores. Prompt y procedencia en [manifiesto](../public/ada-art-v1.json); [prompt exacto y archivo final](ada-generation-prompt.md). Se conserva la familia de tinta, papel y colores.

## Apertura, diálogos y controles

La apertura a oscuras conserva la instrucción visual del usuario. La calle se ofrece como recuerdo opcional desde la primera línea, con ocho pasos acotados, sonido sintetizado y regreso al apagón; no se antepone al despertar. Es un blockout de siluetas hecho en CSS, no una calle fotorrealista ni un modelo GLB. Esta adaptación se registró en FR-003-01 para respetar la dirección posterior. La sala conserva el escenario pintado y ofrece un plano navegable opcional con posiciones acotadas y cercanía a cada mesa, además de la lista directa. No se afirma locomoción FPS libre por una sala modelada.

`INTRO` define IDs, emisores y tabla de textos. El runner valida destinos y cierres, no ejecuta expresiones y deduplica efectos. Omitir y terminar dejan `released` una sola vez. Se guarda la línea actual; releer conversación no da puntos ni consume azar. Las ayudas de urnas se registran por escenario; el tutorial muestra predecir, decidir, observar, explicar y aplicar.

Los cuatro modos lógicos deshabilitan movimiento fuera de la sala. Posición y foco se conservan al volver. Reasignación de las cinco acciones detecta conflictos y actualiza indicaciones. Los requisitos se pueden inspeccionar por teclado incluso en mesas bloqueadas. Se corrigió Escape: abrir pausa ahora cancela su cierre nativo en esa misma pulsación.

La cámara Babylon pasa a UniversalCamera conservando encuadres y suavizado existentes. Se verificaron la [API oficial](https://doc.babylonjs.com/typedoc/classes/BABYLON.UniversalCamera) y los [controles](https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs/), además de los tipos del paquete fijado; las entradas permanecen centralizadas en la aplicación.

Audio propio con buses de interfaz y ambiente, ganancia en dB y margen en el master. Silencio no elimina información. Se revisó la estructura y su comportamiento en navegador, sin afirmar una evaluación auditiva en parlantes/auriculares.

## Validación continua

Workflow `.github/workflows/validate.yml`: instalación desde lockfile, skills, documentos, matemática, unitarias, build y navegador. Sólo lee el repo y conserva resultados; no hace merge ni despliega. La publicación sigue el procedimiento existente de Pages. Versiones exactas consultadas en fuentes oficiales el 2026-10-26: [checkout 7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), [setup-node 7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0), [setup-python 7.1.0](https://github.com/actions/setup-python/releases/tag/v7.1.0), [upload-artifact 7.0.2](https://github.com/actions/upload-artifact/releases/tag/v7.0.2). No requiere credenciales nuevas ni secretos de publicación.

## Medición reproducible

Se ejecutaron tres corridas de 60 segundos sobre la mesa real, tras cinco segundos de calentamiento, antes y después de una corrección acotada. Equipo: Windows 10.0.19045 x64, Ryzen 7 3700X, 16 hilos, aproximadamente 16 GiB RAM; Chromium headless con ANGLE SwiftShader (software), 1440×900. Informes: `docs/evidence/campaign/runtime-profile.json` y `runtime-profile-after.json`; se reproduce con `node scripts/measure-runtime.mjs RUTA`.

Antes: 115 llamadas de dibujo; mediana de presentación 83,3 ms, p95 116,7–150 ms. Después: 97 llamadas, mediana 83,2–83,3 ms, p95 83,4–133,3 ms. Se quitaron contornos redundantes del pedestal, paño y puntos decorativos, conservando siluetas de urnas, fichas y dados. No se afirma mejora de FPS: la mediana de software casi no cambió. El presupuesto de 100 llamadas se alcanza en esta vista; 16,7/33,3 ms no se alcanza con este renderer de software.

Escena: 36.372 triángulos, heap observado ~19,3 MB, estimación de texturas ~17,2 MB; heap y estimación de texturas se reportan separados. Los contadores de CPU de Babylon no representan tiempo GPU. El tiempo local hasta controles no es una carga fría a 20 Mbps/100 ms. Falta medir con GPU física, red controlada y jugadores.

El render 3D deja de dibujarse cuando la pantalla usa sólo ilustraciones/HTML. Las vistas de mesa conservan render y picking. Se añade recuperación visible de contexto WebGL; los controles HTML y el estado matemático siguen disponibles.

## Cierre funcional y trabajo externo

La suite unitaria completa alcanza 32 pruebas. Los checklists documentales de las diez specs estaban aprobados antes de implementar. La suite de navegador amplía el corte a 24 casos: campaña independiente y guiada, actualización de probabilidades y feedback previo al sorteo, pérdida óptima en dados, simulador independiente, compatibilidad de saves, diálogos/relectura, pausa y remapeo, calle opcional, pérdida/restauración real de contexto mediante WEBGL_lose_context y pantallas con texto al 200 % en 390 px. La ejecución final y pública se registra al publicar.

Durante la revisión visual se corrigieron encabezados de altura fija que superponían Ajustes, cartas apretadas, confirmación flotante que tapaba contratos y etiquetas del archivo demasiado angostas. Las capturas funcionales finales están en `docs/evidence/campaign/release-local/`; las anteriores conservan trazabilidad, sin usarse como imagen de la versión final. Las muestras alternativas de repetición siguen el pool documentado: urnas 4R/2A frente a 2R/2A y Ada [4,0,4,4].

La tarea externa T011 de 010 queda abierta: pruebas con personas, lector de pantalla, GPU física y red controlada. No se sustituye con checks automáticos. No se cambia la meta temporal a una duración inventada ni se afirma aprendizaje por tener sellos.

## Validación local final — 2026-10-27

32/32 pruebas unitarias y 24/24 pruebas de navegador aprobaron en Windows/Chromium SwiftShader. Después se ajustaron únicamente dos detalles de composición móvil (columnas de ensayos y ancho del directorio) y se repitió su caso de 200 %. Las correcciones no cambian reglas, puntos ni azar. Validaciones: 64 referencias matemáticas, 92 archivos de skills y enlaces documentales sin errores. La publicación y su comprobación HTTPS se registran a continuación al completarse.

Epílogo final: se reutiliza el escenario de calle al amanecer, con las mismas siluetas y paleta. Se recorrió Ada→anfitrión→salida nuevamente sobre build de producción. Se conserva libertad y posición al volver a practicar.

La primera comprobación pública verificó 143/143 archivos y los 24 casos funcionales. Un error de trazas al cerrar un contexto se debió a dos ejecuciones locales que compartieron output; la repetición aislada del caso aprobó. La pasada final usa carpeta de resultados independiente para evitar esa interferencia.

La revisión de recuperación detectó y corrigió dos bordes adicionales: después de borrar explícitamente un guardado en conflicto, se habilita otra vez el guardado de la nueva partida; retomar el checkpoint posterior a la liberación vuelve a la sala. Se añadieron esas comprobaciones a los casos existentes de multiventana y diálogo, sin cambiar el número de casos ni las reglas educativas.

Un diagnóstico adicional de Chromium sin forzar SwiftShader también devolvió renderer de software en este entorno. Por eso la prueba con GPU física permanece abierta; no se identifica el renderer de software como GPU del usuario.

Publicación v5.1 comprobada: source 7c74ded, deployment 69610f7, 143/143 archivos por hash y 24/24 casos en HTTPS sin errores ni casos inestables. Informe automático: `docs/evidence/campaign/public-browser-v5.1.json`. La corrección posterior de dos checkpoints aprobó sus dos casos locales; la entrega final conserva estos registros y añade su comprobación propia.

## Entrega pública final — 2026-10-27

Versión `campaign-complete-v5.2`, fuente `93c7e429d716b891bdccd0e8e874b10001f612f9`, deployment `8ea900381a026c521d4b08f62c22e1f966483c9e`. [Jugar](https://garypoui.github.io/TheGame/), [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge automático. GitHub Pages confirmó build lista y HTTPS obligatorio.

Validación final sobre esa URL: 143/143 archivos coinciden con los hashes de `build-report-final.json`; 24/24 casos públicos aprobaron, cero errores, omitidos o casos inestables. Resultado de navegador en `public-browser-results.json` e integridad en `public-integrity-final.json`, dentro de `docs/evidence/campaign/`. La suite unitaria sigue en 32/32 y el diseño matemático en 64 comprobaciones.

Hay 95 tareas originales completadas y una tarea adicional externa abierta (010/T011). El puntero local de Spec Kit está en 010; en otro clon debe seleccionarse explícitamente, sin inferirlo de la rama. Las capturas intermedias quedaron locales, conservadas y excluidas del versionado; el [índice de capturas](evidence/campaign/capture-index.md) identifica la evidencia final.

`delivery.json` identifica la fuente que produjo la build; el commit de este registro es posterior para evitar autorreferencia. Los commits de avance están en la rama y el PR.

CI de la fuente publicada 93c7e42: aprobada en GitHub, incluyendo instalación limpia, skills, documentos, matemática, unitarias, build y 24 casos de navegador. [Ejecución 40443839814](https://github.com/GaryPoui/TheGame/actions/runs/40443839814). El cierre siguiente sólo agrega documentos y capturas; no cambia la build publicada.


## Revisión de las mesas — 2026-10-28

La entrega posterior `table-focus-v6` hace protagonistas a los tableros, coloca cartas/contratos/registros sobre el paño y añade utilería propia de cada puesto. El final muestra objetos de sus tres pruebas. Se mantienen reglas y guardado. Fuente d9c4f82, deployment b264adc, PR #7. Validación: 32 unitarias, 28 recorridos locales y CI, 7 pruebas públicas y 143 hashes verificados. Detalle y capturas en [mesas](table-focus.md). La evidencia v5.2 de las secciones anteriores conserva su alcance histórico.


## Vuelta al diseño anterior de mesa — 2026-10-28

El usuario pidió volver la mesa a su diseño anterior. Se restauró exactamente la presentación de 2adb98e (campaña v5.2), conservando reglas, progreso y guardado. La revisión de mesas protagonistas queda como antecedente descartado.
