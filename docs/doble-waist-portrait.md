# Doble desde la cintura hasta el sombrero — 2026-10-29

Pedido: que el rival deje de verse apretado detrás de la mesa y se vea desde la cintura, con el sombrero completo.

Se ajustan únicamente la escala y la altura del retrato de Doble en la escena: escala 0,4 y centro vertical 2,48. El cuerpo sube respecto del borde del paño y dispone de espacio sobre el sombrero. La ilustración existente aporta el torso y las manos; la mesa tapa la parte inferior a la altura de la cintura. Se revisan capturas de escritorio y celular.

La cámara, la mesa grande, las caras de las combinaciones, los dados, su animación y las reglas se conservan. Al volver a Vera se restauran su escala y altura originales. Los diálogos siguen usando sus ilustraciones de cuerpo completo. No se generan imágenes ni se agregan assets, dependencias o licencias.

Se aplican camera-systems al encuadre del sujeto y game-ui-ux a la conservación del área de juego. Se reutilizan las pruebas de comparación, tamaño de mesa, tirada y movimiento reducido, junto con la alternativa HTML y el texto al 200 %. No se agregan pruebas unitarias para dos valores de presentación.

Build/TypeScript y cinco recorridos locales aprobados: seis tamaños con la mesa conservada, texto al 200 %, tirada con resultado guardado, movimiento reducido y alternativa HTML. Capturas de escritorio y celular revisadas; documentación y 70 comprobaciones matemáticas aprobadas. Evidencia seleccionada en docs/evidence/doble-waist-portrait/. Diff y licencias revisados; no hay recursos nuevos. La validación externa de aprendizaje y hardware sigue pendiente en 010/T011.

## Publicación comprobada

Versión doble-waist-portrait-v15, fuente `93300416cf9bb11f3fb6a61c1aac8977eeeaf675`, deployment `de35ee79984f6dadd25c1e6fe321a2a8d2b6ffd6`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge. 41 unitarias, cinco recorridos locales y cinco públicos aprobados, sin fallos ni inestables. Documentación, 70 comprobaciones matemáticas y 92 archivos de skills correctos; 146/146 archivos públicos coinciden por SHA-256. Informes y captura pública en docs/evidence/doble-waist-portrait/.

La [CI completa de la fuente](https://github.com/GaryPoui/TheGame/actions/runs/40836018521) estaba ejecutándose al registrar el cierre y no se cuenta como aprobada. El commit posterior de registro no modifica la build publicada.
