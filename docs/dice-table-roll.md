# Doble: mesa visible y tirada de dados — 2026-10-29

Pedido: conservar las combinaciones de las ofertas, mostrar la mesa y ver cómo se tiran los dados y qué números salen.

La mesa original de madera y paño tiene una ventana propia encima de las ofertas. El único canvas de Babylon se mueve a esa ventana durante Doble y vuelve a la sala al salir, sin recrear el motor. Antes de reemplazar el HTML se conserva el canvas. La cámara encuadra mesa y rival detrás del borde; el personaje mantiene cuerpo completo sólo en el diálogo independiente. Las tres ofertas y sus combinaciones se conservan. En celular se compactan encabezados y etiquetas repetidas para reservar lugar a la mesa.

Al firmar una oferta, el núcleo resuelve y guarda una sola tirada. La presentación anima esos dos dados durante 850 ms con desplazamiento, giro y pequeños rebotes que se amortiguan. Los puntos de las seis caras son hijos de cada dado, con coordenadas locales; al detenerse, la cara superior coincide con el resultado guardado. La interfaz termina de revelar el resultado a los 900 ms, muestra ambos números y la suma y habilita continuar. La segunda orden hipotética no vuelve a tirar. Las repeticiones de comandos no consumen azar adicional. Volver a la sala cancela la presentación, y recargar recupera el resultado ya guardado.

La animación es una trayectoria visual, no una simulación física ni un generador de azar. No cambia probabilidades, premios, méritos ni formato de guardado. Reducir movimiento, incluido el ajuste del sistema, omite la animación y muestra directamente los números. Sin WebGL, queda una mesa HTML con las caras y la misma lectura numérica. Ajustes y salida siguen disponibles durante la presentación.

La revisión visual detectó que la extrusión del contorno tapaba los puntos y parte del paño en el encuadre cercano. Se separan las superficies y los puntos del contorno; el paño y la tinta de las caras usan material de color constante sólo en Doble. Al salir se restaura la presentación de Vera. No se descargan assets ni se agregan dependencias o licencias.

Se aplicaron game-ui-ux, game-feel y webapp-testing. La implementación usa Babylon.js 9.32.0 y Playwright TypeScript existentes. Se consultaron las declaraciones de tipos del paquete instalado y la documentación oficial de [padres y coordenadas locales](https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/parent_pivot/parent/); los puntos acompañan el giro del cuerpo por esa relación. Se revisó también [optimización de escena](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene/), sin introducir congelación de matrices ni cambiar decisiones de arquitectura.

Aceptación: mesa y dados visibles; una animación por tirada real; números iguales al guardado; segunda orden sin relanzamiento; opciones completas en los cinco tamaños anteriores con texto normal; texto ampliado sin desborde horizontal; modo sin movimiento; alternativa sin WebGL y regreso a las urnas con el mismo canvas.

Validación local terminada: build/TypeScript, 41 pruebas unitarias y los 31 recorridos completos de navegador aprobados, sin fallos ni inestables. Incluye los cinco tamaños de la comparación, texto al 200 %, animación y resultado guardado, segunda orden sin relanzar, canvas conservado, modo sin movimiento, alternativa sin WebGL y regresiones de urnas/Ada/final. Las capturas seleccionadas y el informe están en docs/evidence/dice-table-roll/. Se comprobaron documentación, 70 referencias matemáticas y 92 archivos de skills; diff y patrones habituales de secretos sin hallazgos. No se modifican dependencias ni licencias.

Las mediciones del canvas son muestras puntuales de Chromium con ANGLE SwiftShader en Windows, sin afirmaciones de rendimiento con GPU física ni aprendizaje. La validación externa sigue abierta en 010/T011.

## Publicación comprobada

Versión visible-dice-table-v12, fuente `afc296333ab422f026e2ae9ba91f8efe31de6308`, deployment `db5f217943fbdf672f5087db5eaefd178dea7ac8`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge. Once recorridos HTTPS aprobados, sin fallos, inestables ni omitidos; 146/146 archivos públicos coincidentes por SHA-256. Informe y comprobación en docs/evidence/dice-table-roll/public-browser-results.json y public-integrity.json; captura pública public-result.png en la misma carpeta.

La [CI completa de la fuente](https://github.com/GaryPoui/TheGame/actions/runs/40811032444) estaba ejecutándose al registrar el cierre; no se cuenta como aprobada. Sí finalizaron los 31 recorridos locales y los 11 públicos indicados. El commit posterior de registro no cambia la build pública.
