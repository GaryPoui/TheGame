# Crupier proporcionado con la mesa — 2026-10-29

Pedido: el crupier quedó demasiado pequeño; debe guardar proporción con la mesa y conservar la vista desde la cintura y el sombrero completo.

Doble usa escala 0,9 y altura 2,8. La cámara adopta un ángulo menos elevado para repartir el encuadre entre torso y paño. El campo visual se adapta al espacio disponible y se recalcula al redimensionar. El tamaño geométrico de la mesa se conserva. El personaje se muestra aproximadamente al doble del ancho de la revisión anterior.

En escritorio se aprovecha el espacio de la pregunta duplicada encima de la mesa: la pregunta sigue visible en el cuaderno lateral y el canvas gana 72 px de alto. En celular se conserva la pregunta encima; el título repetido queda disponible para lectores de pantalla y los contadores comparten una fila. El canvas gana 40 px. Las tres cartas y sus combinaciones siguen entrando sin desplazar en los seis tamaños probados. Las alturas nuevas del canvas son 470, 492, 415, 250, 250 y 230 px respectivamente en 1837×823, 1440×900, 1366×768, 530×850, 390×844 y 360×740.

La comprobación de encuadre proyecta puntos del retrato y de la mesa: borde superior del sombrero dentro del cuadro, cintura próxima al borde trasero del paño y ancho del retrato de al menos el 22 % del ancho proyectado de la mesa. Esto evita que mostrar el sombrero se resuelva miniaturizando el personaje. Se inspeccionan además capturas reales de escritorio y celular; las posiciones por sí solas no prueban composición visual.

Se aplicaron camera-systems y game-ui-ux. Se revisaron las declaraciones oficiales de Babylon.js 9.32.0 instaladas: fovMode es vertical fijo por defecto; el cálculo del campo visual compensa la altura añadida. Vector3.Project y las matrices del retrato se usan también en la evidencia de encuadre. Se conservan motor, ilustración, mesa, dados, reglas y guardado; no hay assets ni dependencias nuevas. Vera recupera su encuadre original al salir de Doble.

Build/TypeScript, 41 pruebas unitarias y cinco recorridos locales aprobados, incluyendo seis tamaños, texto al 200 %, tirada, movimiento reducido y alternativa HTML. Documentación, 70 comprobaciones matemáticas y 92 archivos de skills correctos. Evidencia seleccionada en docs/evidence/doble-proportions/. Se revisan diff, secretos y licencias. La validación externa sigue pendiente en 010/T011.

## Publicación comprobada

Versión doble-proportions-v16, fuente `4be1ea911f7badb6dbcc1b8b5a5ea3f30b828f6f`, deployment `d68dc3570aa5c07fde080028e2f774567c9b5d1d`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge. Cinco recorridos HTTPS aprobados, sin fallos, inestables ni omitidos; 146/146 archivos coincidentes por SHA-256. Informes, integridad y captura pública en docs/evidence/doble-proportions/.

Las capturas y medidas corresponden a Chromium con ANGLE SwiftShader en Windows, sin afirmaciones sobre GPU física. La [CI completa de la fuente](https://github.com/GaryPoui/TheGame/actions/runs/40856004439) estaba ejecutándose al registrar el cierre y no se cuenta como aprobada. El commit posterior de registro no modifica la build publicada.
