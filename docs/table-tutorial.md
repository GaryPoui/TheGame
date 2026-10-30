# Personajes en las mesas y tutorial integrado — 2026-10-28

El usuario aclara que el cuerpo completo corresponde sólo a diálogos. Durante las partidas los personajes deben estar detrás/apoyados en la mesa, sin un duplicado a la derecha.

Vera y Doble vuelven a las ilustraciones originales de torso en la escena Babylon, con el mismo anclaje junto al paño. Se eliminan las ilustraciones completas de los cuadernos de partida. Ada y el anfitrión se presentan detrás de un tablero con encuadre de torso; los diálogos independientes conservan sus imágenes completas. No se crean ni editan assets raster.

El tutorial de Vera usa table-layout, las mismas cartas urn-option y objetivo/régimen de la partida normal. urnChoice comparte presentación y acepta un contexto de demostración sin alterar GameState. El mouse sobre las urnas, las cartas, los controles reasignados y el brillo apuntan a la misma selección de demostración. Las cartas empiezan plegadas como en la partida normal.

Cuatro momentos: elegir U (3/5 frente a 1/2), confirmar una roja preparada sin reposición, volver a elegir entre 2/4 y 1/2, y observar una azul preparada de la urna elegida. La corrección usa cantidades anteriores a sacar; en la segunda elección ambas cartas son correctas. La escena muestra el inventario restante. Vera acompaña con texto breve. No hay puntos, consumo del RNG real ni modificación de progreso; se puede saltar o repetir.

Se aplica game-ui-ux a la coherencia de controles y flujo. Prueba nueva: selección de canvas y teclado, bloqueo de confirmación antes de elegir, feedback, empate, arranque de la partida real y comparación exacta del guardado antes/después. Se conservan las pruebas existentes de campaña. Build y 40 unitarias aprobadas; siete recorridos locales aprobados y dos comprobaciones finales de tutorial y texto al 200 %. Evidencia en docs/evidence/table-tutorial/. La validación de aprendizaje con personas sigue en 010/T011.

La publicación se registra al verificar HTTPS.


## Publicación comprobada

Versión table-tutorial-v10, fuente `c1eae52eb0a71e59809973ec3c39a99e4d018e14`, deployment `cdda0855aa8ff5b273cf5d9689ca2a920db98c1c`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge. Verificación HTTPS: 7/7 recorridos de tutorial y campaña, sin fallos/inestables/omitidos, y 146/146 archivos coincidentes por SHA-256. [CI de la fuente](https://github.com/GaryPoui/TheGame/actions/runs/40800532863) aprobada, incluyendo las 40 unitarias y los 27 recorridos completos de navegador. Capturas públicas de Vera, Ada y anfitrión en docs/evidence/table-tutorial/public/. El registro posterior no modifica la build publicada.
