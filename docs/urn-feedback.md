# Las urnas: selección y respuestas más claras

Fecha: 2026-10-26. Alcance solicitado por el usuario: mejorar el primer juego antes de
avanzar a otra spec. Se mantiene activa 005-urn-table y no se integran contratos ni campaña.
Se incorporó por fast-forward la actualización tipográfica de bula393 antes de editar.
Se conservan Arial/Helvetica/sans-serif, ilustraciones, matemáticas, RNG y guardados.

## Experiencia

El primer minijuego pasa de «El inventario» a «Las urnas» / «Las urnas de Vera» en mesa,
tutorial, directorio, título del navegador y créditos. La Casa del Azar sigue como nombre
de la campaña. Las cartas se interpretan como las dos tarjetas de información de U y V.

Al empezar cada decisión, las cartas están ocultas. «Mostrar cartas de las urnas» permite
verlas; «Ocultar cartas» las oculta sin borrar la selección. Se puede elegir con tarjeta,
urna 3D o atajo. Elegir la urna también descubre las cartas para que se vea el vínculo.
Hay una sola selección: brillo dorado estable en la urna y en su tarjeta, con «Elegida»
y aria-pressed. Al cambiar de opción se apaga el resaltado anterior. Sin destellos ni pulsos.

«Comprobar y sacar» confirma la elección y realiza la extracción existente. Entonces se
muestran ambas cartas: verde y ✓ Correcta para opciones óptimas, rojo y ✕ Menos posibilidades
para las otras. «Tu elección» distingue la opción elegida. Las cartas quedan de lectura hasta
continuar; el texto de resultado usa verde/rojo según la calidad de la decisión.

Si hay empate de probabilidades, las dos cartas quedan verdes. Una elección óptima sigue
verde aunque salga el otro color. La evaluación usa state.last.optimal, calculado justo
antes de extraer; no se recalcula con las fichas que quedan después. Las tarjetas de revisión
muestran los conteos previos rotulados «Antes de sacar». La escena muestra el estado actual.
Al retomar un guardado revelado se reconstruye ese conteo sumando la ficha extraída cuando
no se devuelve; no se cambia el formato del guardado ni se consume RNG por abrir cartas.

## Explicaciones

Lenguaje cotidiano: «3 de 5», «la ficha vuelve», «la ficha queda afuera», «más posibilidades».
Tutorial más breve, consignas por acción y feedback que separa elección de suerte. La ayuda
explica qué contar con un ejemplo. Las fracciones se presentan como cantidades equivalentes;
se conserva la transferencia final sin porcentaje automático salvo ayuda.

## Implementación y fuentes

src/main.ts centraliza selección, visibilidad y revisión; src/presentation/scene.ts consume
la selección. HighlightLayer de Babylon 9.32.0 resalta base, borde y laterales estables;
anillo luminoso complementario. Se cargó explícitamente Culling/ray: sin ese registro,
el picking modular de las urnas no funcionaba aunque las tarjetas sí lo hicieran.

Referencia oficial: [HighlightLayer en Babylon](https://doc.babylonjs.com/typedoc/classes/BABYLON.HighlightLayer),
y las implementaciones/tipos fijados en node_modules/@babylonjs/core/Layers y Culling/ray.
Consulta: 2026-10-26. No se agregó motor, paquete, arte o recurso externo nuevo.

Skills aplicadas: game-ui-ux (estado compartido, foco, información redundante al color),
frontend-design (mantener el teatro de tinta y tipografía existente), webapp-testing
(recorridos reales y revisión de canvas/capturas mediante Playwright TypeScript existente).

## Verificación

Build/tipos aprobados. 15 pruebas unitarias, 64 comprobaciones matemáticas y 92 archivos
de skills aprobados. Tres regresiones específicas iniciales pasaron: cartas/selección en
canvas, empate y buena decisión con resultado desfavorable. Una primera prueba de canvas
falló y permitió detectar/corregir el registro de ray; luego pasó el clic real sobre V.

Evidencia nueva: docs/evidence/urn-feedback. No se sobrescribe la evidencia histórica.
La suite completa, las capturas finales y la publicación se registran al terminar.
La simplificación del lenguaje todavía requiere evaluación con personas; no se afirma que
estas pruebas demuestren comprensión universal, aprendizaje ni rendimiento en GPU real.

Primera suite completa local: 14/14 aprobadas, con las ocho regresiones de la mesa y
las de introducción. Se revisaron capturas de selección y evaluación verde/roja; cambios
finales de redacción y protección del rótulo U/V frente al halo preceden la build pública.

## Entrega publicada

Fuente de build `29c4148d179cd8d2f799ffcf92cd04f0cf222f87`; deployment
`1e6bfd4ffcadec61979ba4999123dfa1b791999a`, versión `urns-mvp-feedback-v4`.
Pages built y 138/138 archivos comprobados por SHA-256. Sitio:
https://garypoui.github.io/TheGame/. PR https://github.com/GaryPoui/TheGame/pull/6.
Los commits posteriores de documentación no cambian la fuente desplegada.
Los auxiliares de captura admiten EVIDENCE_DIR y muestran las cartas antes de interactuar.

Suite pública final: 14/14 aprobadas contra GitHub Pages, incluida selección real por clic
en canvas, ocultar/mostrar sin perder selección, evaluación antes de la extracción, empate,
resultado desfavorable con elección correcta y revisión tras recargar. Reporte:
[pruebas públicas](evidence/urn-feedback/public-browser.json).
