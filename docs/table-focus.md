# Mesas como centro de la partida — 2026-10-28

## Restauración solicitada — 2026-10-28

El usuario pidió volver la mesa a su diseño anterior. Se restauró exactamente la presentación de 2adb98e (campaña v5.2), conservando reglas, progreso y guardado. La revisión de mesas protagonistas queda como antecedente descartado.

Pedido: dar protagonismo a las mesas, hacer legible lo que se juega y agregar objetos propios de cada desafío. Se conserva el teatro de tinta, la paleta y toda la campaña.

## Composición y objetos

La superficie de juego ocupa la columna principal; el cuaderno de consignas y confirmación queda a la derecha. Los personajes acompañan desde el borde posterior, sin ocupar el tablero. En pantallas angostas el cuaderno sigue debajo y la consigna también aparece sobre el paño. No hay confirmación flotante encima de objetos.

Paleta reutilizada: paño verde `#1e3b32`, ciruela `#37283d`, madera `#90603e`, latón `#ad9160`, papel `#f0e2c4` y tinta `#30252c`. Arial/Helvetica/sans-serif en texto y etiquetas 3D. Las opciones tienen prioridad sobre los adornos, con foco de teclado y símbolos además de color.

| Mesa | Material de juego | Objetos del puesto |
| --- | --- | --- |
| Vera | Urnas U/V grandes, fichas contables y cartas plegables sobre el paño | Bandeja para la extracción, pala de latón, inventario y lápiz |
| Doble | Dados en bandeja, lectura del par resuelto y tres contratos | Bordes de la bandeja, contratos sin firmar, lapicera y fichas de utilería |
| Ada | Fuente identificada, ensayos numerados, histograma, estadísticas y opciones en el escritorio | Carpetas, tintero, pluma y sello |
| Anfitrión | Urnas, luego dados/contratos y finalmente el archivo correspondiente a cada ronda | Baraja y sello junto al paño |

Las urnas del final también se pueden seleccionar en el canvas. Las opciones HTML mantienen su equivalente de teclado. Las cartas de Vera siguen ocultas al comenzar y el brillo sigue compartido. La corrección conserva verde/rojo y símbolos, calculados con el inventario anterior a extraer.

## Implementación y procedencia

`src/ui/tabletop.ts` y `tabletop.css` comparten marco, paño, personajes y utilería dibujada con código. `src/presentation/scene.ts` añade meshes originales para bandejas, inventario, pala, contratos y fichas. No se incorporan imágenes ajenas, paquetes ni servicios. Procedencia registrada en `public/asset-manifest.json`; las ilustraciones de personajes conservan sus manifests originales.

Se reutiliza **un solo canvas y un solo contexto WebGL**: se separa antes de actualizar el HTML y se vuelve a colocar en el espacio de mesa. `ResizeObserver` ajusta la resolución al espacio real, sin recrear el motor. El encuadre centra las dos urnas y muestra el paño desde más arriba; la cámara conserva suavizado y reducción de movimiento. Los puntos de los dados usan tinta sin iluminación para conservar contraste bajo la luz del tablero.

La API de encuadre se contrastó con la [documentación oficial de UniversalCamera](https://doc.babylonjs.com/typedoc/classes/BABYLON.UniversalCamera), en particular `fovMode` y `FOVMODE_HORIZONTAL_FIXED`, y los tipos del paquete Babylon.js 9.32.0 instalado. Es una decisión de presentación; no cambia RNG, reglas, guardado ni puntos.

## Skills aplicadas

Se leyeron las versiones portables de `game-ui-ux`, `frontend-design`, `create-game-assets`, `camera-systems` y `webapp-testing`. Aplicación: jerarquía de tablero/consigna, paleta existente, objetos originales coherentes, encuadre y revisión de capturas reales. Playwright TypeScript existente se conserva por instrucción del proyecto; no se instala otro entorno. El manifiesto de skills no se modifica.

## Validación

La evidencia de esta revisión se guarda en `docs/evidence/table-focus/`. Las capturas anteriores de campaña documentan su versión histórica.

Se añaden cuatro recorridos para comprobar: canvas sin superposición con el cuaderno, selección real de urnas sin consumir azar ni recrear canvas, contratos y par resuelto en la misma superficie, archivo y opciones sobre el escritorio a 200 % de texto, y las tres etapas visuales del final. Se conserva la suite previa de campaña, ayuda, recuperación, teclado y feedback.

Validación local de producción: build y 32/32 pruebas unitarias aprobadas; 28/28 recorridos de navegador aprobados, sin fallos, omitidos ni casos inestables. Se verificaron 64 referencias matemáticas y los 92 archivos de skills. Las nueve capturas seleccionadas en `approved-local/` y el informe `local-browser-results.json` documentan esta pasada. Los resultados de publicación se añaden al cerrar la comprobación HTTPS. Las capturas no acreditan aprendizaje ni rendimiento en GPU física. La tarea externa 010/T011 sigue pendiente.


## Entrega pública

Versión `table-focus-v6`, fuente `d9c4f8205145da38c8bd3767073bddb250ef1338`, deployment `b264adc2ebf3ba41f0f6a8316d600da6a308547b`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), abierto sin merge. Pages confirmó estado `built` y HTTPS obligatorio.

Comprobación pública: 143/143 archivos coinciden por SHA-256, y 7/7 pruebas públicas aprobaron sin fallos, omitidos ni casos inestables: las cuatro nuevas de composición y tres regresiones de urnas. La campaña completa se verificó localmente con 28/28 casos. Informes: `public-integrity.json`, `public-browser-results.json` y `local-browser-results.json` en `docs/evidence/table-focus/`. Capturas de la versión pública en `approved-public/`.

El commit posterior de documentación registra la entrega y no cambia el contenido publicado.

CI de la fuente publicada: [40756316610](https://github.com/GaryPoui/TheGame/actions/runs/40756316610), aprobada con instalación limpia, documentos, skills, matemática, 32 unitarias, build y 28 recorridos de navegador.
