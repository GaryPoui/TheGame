# Doble: opciones compactas y pares de dados — 2026-10-28

Pedido: ver las tres opciones sin desplazarse y entender visualmente qué combinaciones hacen pagar a cada oferta.

Las ofertas conservan el papel y la tinta de la mesa actual. En escritorio se comparan en tres columnas; en celular son tres filas compactas, con nombre y saldo a la izquierda y combinaciones a la derecha. La pregunta va primero y las ofertas aparecen antes del resultado de los dados y los laboratorios opcionales. La elección conserva su indicador y los botones nativos.

Cada grupo muestra caras de dados y su suma. Centro paga con 6, 7 u 8; Justo siete, con 7; Seguro, con cualquier par. Los pares diferentes también cuentan al revés: 2+5 y 5+2 son dos resultados. Los dobles cuentan una vez. El gráfico agrupa esos órdenes sin confundirlos con resultados equiprobables agrupados: los totales siguen siendo 36/36, 16/36 y 6/36. Las combinaciones se derivan de grossPayout, la misma regla del núcleo, y tienen nombres accesibles en números. El gráfico describe cuándo paga una oferta; el objetivo de cada pregunta sigue determinando qué elección conviene.

Las cifras grandes son el saldo después del coste: +2 siempre, +5 o −1, +23 o −1. No se cambia el núcleo matemático, el azar, las reglas de mérito, el guardado ni las otras mesas. No hay assets ni dependencias nuevos.

Se aplicaron game-ui-ux (flujo adaptable y controles), frontend-design (comparación y jerarquía dentro del estilo existente) y webapp-testing (capturas y recorridos). Se usa el Playwright TypeScript ya instalado. La prueba unitaria expande todos los pares gráficos y compara exactamente su conjunto con los pares que pagan en el núcleo, sin duplicados.

El caso de navegador comprueba las tres ofertas completas dentro del viewport, sin desplazarse, a tamaño de texto normal en 1440×900, 1366×768, 530×850, 390×844 y 360×740. Con texto ampliado, el diseño permite crecer verticalmente para preservar lectura y controles; se comprueba que no haya desborde horizontal al 200 %. Esto no demuestra legibilidad en todos los equipos ni aprendizaje con personas; esa validación sigue pendiente en 010/T011.

Validación local aprobada: build/TypeScript, 41 pruebas unitarias, 7 recorridos de navegador (campaña y nuevo caso de cinco tamaños), 70 comprobaciones matemáticas, documentación y 92 archivos de skills. Revisión visual de escritorio, celular de 360 px y texto al 200 %. La primera revisión detectó un desborde al ampliar texto; quedó corregido y la regresión completa pasó después del ajuste. Informe en docs/evidence/dice-combinations/local-browser-results.json. No se agregaron licencias ni dependencias; diff y patrones habituales de secretos revisados.

## Publicación comprobada

Versión compact-dice-v11, fuente `c3eb34e851d3d39234d3b5598403ff27e8219c65`, deployment `520ab440bb77ff858b0de355ee25e640da6d11fa`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge. Siete recorridos HTTPS aprobados, sin fallos, inestables ni omitidos, y 146/146 archivos coincidentes por SHA-256. Informes en docs/evidence/dice-combinations/public-browser-results.json y public-integrity.json. Capturas seleccionadas: desktop.png, mobile.png, text-200.png y public-mobile.png en la misma carpeta.

La CI completa de la fuente estaba ejecutándose al registrar esta publicación; no se cuenta como aprobada: [ejecución](https://github.com/GaryPoui/TheGame/actions/runs/40807050790). Las comprobaciones locales y públicas indicadas arriba sí terminaron. El commit posterior de registro no cambia los archivos del juego publicado.
