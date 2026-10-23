# La correduría de Doble — implementación

Fecha: 23/10/2026. Rama de trabajo: `codex/doble-contracts`.
Extensión de la mesa de Vera; conserva Babylon.js, el teatro de tinta y la tipografía
Arial/Helvetica/sans-serif. Publicación de este corte registrada al final de este documento.

## Alcance entregado

- Doble se habilita al completar Vera; los sellos anteriores se conservan al practicar.
- Presentación de tres pasos con demostración preparada, personaje SVG original y mesa con
  dados 3D. Las ofertas S/C/J se eligen sobre el paño; teclado y ajustes compartidos continúan.
- Cuatro rondas, dos decisiones por ronda: firmar y tirar una vez; después planificar otro
  encargo hipotético sin nueva tirada, coste ni pago. Objetivos y feedback acompañan cada paso.
- Sello independiente con 6/8; si no alcanza, exactamente dos microescenarios guiados
  EV→garantía y umbral 4→rango. Las acciones incorrectas mantienen el paso guiado hasta corregir.
- Repetición conserva sellos y usa umbral 20 en la transferencia, en lugar de 10. El método
  independiente/con ayuda queda guardado; practicar no degrada un sello independiente existente.
- Cuadrícula opcional de 36 pares, netos, promedio exacto y rango. Comparación voluntaria de
  1/100 tiradas con semilla visible y RNG separado: no consume azar ni altera campaña.
- Ada y el final siguen pendientes. El sello registra decisiones, no dominio ni aprendizaje probado.

## Reglas y separación entre decisión y suerte

La fuente normativa sigue siendo [diseño educativo, sección 2](educational-design.md).
S deja +2 siempre; C cuesta 1 y paga 6 si suma 6/7/8; J cuesta 1 y paga 24 si suma 7.
Los 36 pares distinguibles son equiprobables; las once sumas no lo son.

| Comparación | S | C | J | Mejor elección |
| --- | --- | --- | --- | --- |
| Promedio neto | 2 | 5/3 | 3 | J |
| P(neto ≥ 4) | 0/36 | 16/36 | 6/36 | C |
| Garantía de al menos 1 | Sí | No | No | S |
| Rango | 0 | 6 | 24 | S |

El cálculo compara enteros equivalentes sobre los 36 resultados, sin decidir a partir de
porcentajes redondeados. El saldo admite negativos y nunca bloquea acceso. Una elección óptima
de J que pierde 1 conserva su mérito. Los contrafactuales de una tirada son retrospectivos.
Doble usa la política `public-objective-v1`: recibe el objetivo público, no el RNG ni el futuro.

## Código y persistencia

- `src/core/math/dice.ts`: pares, pagos, umbrales, rango y acciones óptimas.
- `src/core/tables/contracts.ts`: reducer, cuatro rondas, ayuda, comandos y replay.
- `src/core/math/simulation.ts`: comparación independiente con los mismos pares para S/C/J.
- `src/ui/contracts.ts` y `contracts.css`: tutorial, ofertas, cuadrícula, experimento y cierre.
- `src/main.ts`: sala, gates, confirmaciones, foco, atajos, sello y guardado antes de presentar.
- `src/presentation/scene.ts`: dados y rotulación 3D; `public/art/doble.svg`: personaje original
  dibujado como SVG en código, sin imagen de terceros ni generación raster nueva.

Los comandos contienen revisión esperada e identificador; confirmaciones repetidas o atrasadas
no vuelven a tirar ni recompensan. La validación reconstruye el estado de Doble reproduciendo
sus comandos aceptados y compara fases, historial, RNG y puntuación.
El adaptador compartido usa esquema 2 (`urns-contracts-v2`) y acepta el guardado legado de
urnas esquema 1; conserva el mismo slot con pending/current/backup. No hay un guardado paralelo.

## Evidencia y límites de esta entrega

Validación manual inicial comunicada por el implementador:

| Recorrido observado | Resultado |
| --- | --- |
| Vera completa | 8/8; habilita Doble |
| Doble independiente | 8/8; cierre y sello |
| Repetición con errores | 2/8; completa los dos escenarios guiados |
| J óptimo con pérdida | Neto −1; conserva 1 mérito |
| Recarga después de tirada | Conserva 5+1, suma 6; no vuelve a tirar |
| Simulación semilla 314159, 100 tiradas | S=200, C=194, J=260; campaña sin cambios |

Captura del cierre: [complete.png](evidence/doble/complete.png).
La revisión de código y compilación/typecheck del corte pasaron según el implementador.
La confirmación visual final después de los últimos ajustes se registra al cerrar la entrega;
esta tabla no sustituye esa confirmación ni una prueba automatizada.

No se añadieron ni ejecutaron suites de tests en este trabajo: T007/T008 permanecen pendientes.
No hay medición nueva de aprendizaje, diversión, rendimiento o accesibilidad completa, ni piloto
con estudiantes. La aceptación manual cubre los recorridos indicados, no todos los pares mediante
ejecución de pruebas del runtime. Build exitosa y coherencia de las reglas son evidencias distintas.

## Aplicación de skills

- `game-ui-ux`: pasos explícitos, selección y confirmación, foco y acceso por teclado.
- `frontend-design`: extensión de paleta, materiales y tipografía existentes; no redefine el sistema.
- `save-systems`: esquema versionado, legado, snapshot de resultado y conservación de sellos.
- `game-ai`: consejo determinista basado únicamente en el objetivo público.
- `dialogue-systems`: presentación contextual de Doble y enlace narrativo hacia Ada.

Las guías de otros motores se usaron como conceptos. El implementador consultó las fuentes
primarias de Babylon.js para [cajas](https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/box/)
y [texturas dinámicas](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/dynamicTexture/).
La documentación apoya la elección de API; no certifica el resultado visual ni el rendimiento
de esta escena. No se incorporan dependencias, servicios pagos ni motor físico.

## Confirmación final del corte

Compilación de producción y TypeScript: aprobadas. Detector sobre interfaz nueva: sin hallazgos.
La revisión independiente confirmó las correcciones de objetivos guiados, variante de repetición,
garantía y conservación del método del sello; disposición final: **ship para el alcance revisado**.
Revisó código y capturas; no ejecutó suites ni certificó accesibilidad integral o aprendizaje.

- [Mesa de escritorio](evidence/doble/table-desktop.png).
- [Ancho de 390 px](evidence/doble/table-mobile.png): sin desborde horizontal.
- [Texto al 200 %](evidence/doble/table-200.png): fuente raíz 32 px; control de firma disponible y sin desborde horizontal a 1536 px.
- Consola local sin errores capturados durante la revisión.
- Tras los ajustes finales se repitió Vera hasta habilitar Doble, se abrió la mesa y se
  revisaron sus tres contratos; la tabla anterior conserva el alcance de la partida inicial.

La ilustración SVG de Doble se registra en `public/asset-manifest.json`, con SHA-256 y origen
propio. Los PNG de esta carpeta son capturas de evidencia, no arte del juego nuevo.

## Publicación verificada de Doble — 23/10/2026

- Fuente: `0c039791eb9e07840cf57584ed803239db0d71c7`, rama `codex/doble-contracts`.
- Revisión abierta: https://github.com/GaryPoui/TheGame/pull/5, base `codex/ink-theatre`, sin merge automático.
- Build estática: `a5a1977f5125f0e213aaf6a43dc28620735497b1`, rama `gh-pages`, versión `urns-contracts-v1`.
- GitHub Pages terminó con éxito: https://github.com/GaryPoui/TheGame/actions/runs/39951468045.
- Juego: https://garypoui.github.io/TheGame/.

Comprobación pública: el guardado anterior abrió Vera completada con 8/8 y 5 fichas; el botón
«Llevar el sello a Doble» habilitó presentación y primera mesa. Contratos S/C/J, dados y personaje
cargaron, sin aviso de guardado y sin errores de consola capturados. No se reinició Vera ni se
confirmó una tirada nueva en el perfil público. Fuentes computadas Arial/Helvetica/sans-serif.
Captura: `docs/evidence/doble/public-table.png`. La partida completa y la ayuda se recorrieron
localmente; esta comprobación pública cubre migración, acceso y carga, no todo el recorrido.

La rama de fuente vigente para continuar esta entrega es `codex/doble-contracts`; la rama
`codex/ink-theatre` conserva la versión previa. El sitio sigue publicando sólo desde `gh-pages`.

## Retrato de Doble, revisión v2 — 23/10/2026

El usuario pidió que el crupier coincidiera con los demás personajes. Se sustituyó el SVG activo
por `public/art/doble-v2.png`, generado con imagegen usando Vera como referencia principal de
estilo, el anfitrión como referencia secundaria de acabado/paleta y una captura del Doble previo
para conservar identidad. Tinta de grosor variable, textura pictórica, ojos expresivos, traje
ciruela, solapas desiguales y sombrero. El encuadre hasta la cadera permite leer cara y manos
sobre la mesa. La imagen se comparte entre presentación HTML y plano de Babylon.

PNG 1024×1536 RGBA, 2.236.166 bytes, alfa 0..254 y esquinas transparentes. Copia byte a byte de
la salida de imagegen, sin edición de píxeles; el SVG anterior permanece histórico. Prompt exacto,
referencias, hash, herramienta y derechos en `public/doble-art-v2.json` y `docs/doble-art-v2.json`.
La generación no implica animación nueva. Reglas, puntuación y guardado siguen iguales.

Compilación/typecheck aprobadas; inspección del retrato y de la mesa en escritorio, sin errores
de consola capturados. Captura en `docs/evidence/doble-art-v2/table-desktop.png`. No se ejecutaron
suites de tests ni se repitió el recorrido de juego para esta sustitución de arte.
