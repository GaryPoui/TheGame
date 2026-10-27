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

Retrato nuevo: `public/art/ada-v1.png`, generado con herramienta integrada usando Vera como referencia, con transparencia comprobada y sin modificar assets anteriores. Prompt y procedencia en [manifiesto](../public/ada-art-v1.json). Se conserva la familia de tinta, papel y colores.
