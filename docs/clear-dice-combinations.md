# Combinaciones de dados más claras — 2026-10-29

Pedido: distinguir mejor los dados de las cartas sin achicar la mesa.

Se reemplazan los caracteres de dados por caras dibujadas con una grilla de puntos: cada cara tiene al menos 20×20 px a tamaño de texto normal, borde definido, fondo crema y puntos oscuros. Las sumas y el conteo de pares usan texto mayor. Las fichas reservan más ancho a las combinaciones y aprovechan el ancho disponible debajo de la mesa. Se comparte el patrón de puntos con las caras HTML existentes; se conservan los nombres accesibles de cada par y los órdenes inversos.

La altura de la mesa queda exactamente igual a la versión anterior: 398, 420, 343, 210, 210 y 190 px respectivamente en 1837×823, 1440×900, 1366×768, 530×850, 390×844 y 360×740. La prueba verifica esas alturas, el tamaño mínimo de las caras, que los puntos correspondan al valor, que cada par entre en su ficha y que las tres opciones entren completas sin desplazar con texto normal. Con texto ampliado se conserva el crecimiento vertical. Se revisan capturas reales del canvas y de las cartas.

Se aplicaron frontend-design y game-ui-ux a la legibilidad y distribución; se conserva Playwright TypeScript para verificar. No se cambian probabilidades, tirada, cámara, progreso, guardado ni mesa. No hay imágenes nuevas, licencias ni dependencias. Los símbolos de la leyenda textual se conservan como ejemplo complementario; las combinaciones de las cartas usan los nuevos dibujos.

Validación local aprobada: build/TypeScript, 41 pruebas unitarias, diez recorridos dirigidos de campaña/dados, texto al 200 %, 70 comprobaciones matemáticas, documentación y 92 archivos de skills. Se revisan capturas de escritorio y celular; diff, patrones habituales de secretos y licencias sin cambios de dependencia ni assets. Evidencia seleccionada en docs/evidence/clear-dice-combinations/. La validación externa con personas y hardware sigue pendiente en 010/T011.

La publicación se registra después de verificar HTTPS.
