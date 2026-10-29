# Doble: la mesa como centro de la partida — 2026-10-29

Pedido: agrandar la mesa, darle más énfasis y reducir las tarjetas. Se ajusta sólo la presentación de Doble con game-ui-ux y frontend-design, dentro del estilo de tinta, paño verde y madera existente.

La ventana de la mesa ocupa la mayor parte del área de juego. Las ofertas pasan a una franja de fichas cortas debajo: nombre, saldo neto y coste a la izquierda; pares de dados a la derecha. Toda la ficha sigue siendo un botón, con foco de teclado, estado pulsado y contorno más una marca de selección. Se conserva la información de combinaciones, incluyendo órdenes inversos. Se retira el bloque repetido de «Elegir oferta» dentro de cada ficha.

El cuaderno lateral es más angosto en escritorio; en pantallas intermedias pasa debajo. En celular la mesa también crece y las tres fichas se apilan en un formato breve. Con texto ampliado se permite crecimiento vertical y reordenamiento para preservar lectura y controles. La tirada, sus números y la suma siguen en la mesa. No se cambian cámara, animación, reglas, guardado, assets ni dependencias.

La prueba de comparación ahora incluye 1837×823 (tamaño de la referencia), 1440×900, 1366×768, 530×850, 390×844 y 360×740. Comprueba que las tres fichas entren completas sin desplazar, que ningún par de dados se salga de su ficha y que la ventana de la mesa tenga más de una vez y media la altura de cada ficha. Se revisan capturas reales del canvas, además de límites HTML.

Validación local aprobada: build/TypeScript, 41 pruebas unitarias, diez recorridos dirigidos de campaña/mesa/animación, 70 comprobaciones matemáticas, documentación y 92 archivos de skills. Revisión visual de escritorio al tamaño de la referencia y de celular. La revisión encontró pares desbordados en fichas angostas; se ajustó el espacio y la prueba ahora comprueba cada par. También pasó la regresión de texto al 200 %, sin desborde horizontal. Evidencia seleccionada en docs/evidence/doble-table-focus/. Se revisaron diff, secretos y licencias; no se agregan assets ni dependencias. La validación externa de aprendizaje y hardware sigue pendiente en 010/T011.

La publicación se registra después de verificar HTTPS.
