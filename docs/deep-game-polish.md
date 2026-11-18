# Pulido integral del juego

Pedido del 16 de noviembre de 2026: revisar y corregir presentación, comprensión y tutoriales de toda la campaña. Se conserva la identidad de tinta, los personajes, el motor y las reglas matemáticas. Rama: `codex/deep-game-polish`.

## Alcance

- Recorrer inicio, opciones, sala, tutoriales, elección, resultados y salida.
- Sustituir ayudas obsoletas; explicar las manos de póker con cartas y una práctica preparada, sin tocar el azar ni el progreso.
- Aclarar objetivos, puntos, daño y diferencia entre una buena decisión y un resultado favorable.
- Revisar jerarquía, contraste, encuadre y opciones visibles en escritorio; comprobar texto ampliado y pantallas estrechas.
- Mantener las explicaciones secundarias en ventanas centrales cerrables, con páginas cuando haga falta.
- Ejecutar controles documentales, matemáticos, de guardado y de navegador. Registrar observaciones, correcciones y límites de la evidencia.

## Criterios

La acción siguiente y el objetivo deben ser visibles. Los tutoriales deben corresponder al juego actual. Los ejemplos no consumen cartas, fichas, puntos ni azar de campaña. El escritorio no debe requerir desplazamiento para elegir. No se añaden dependencias ni recursos externos.

## Evidencia y límites

### Hallazgos corregidos

| Hallazgo | Corrección | Comprobación |
| --- | --- | --- |
| Los dados eran cubos lisos antes de firmar; el contorno podía tapar puntos pegados a las caras | Seis caras numeradas, opuestos que suman siete, perspectiva lateral y muestras identificadas antes de tirar; se retira el contorno que ocultaba las marcas | Fallo reproducido, puntos visibles en capturas y caras superiores iguales al par guardado |
| Las preferencias del inicio se perdían al recargar | Preferencias locales de pantalla/sonido separadas del progreso, con validación y tolerancia a almacenamiento bloqueado | Fallo reproducido; dos pruebas unitarias y regresión en navegador |
| El póker suponía conocimiento previo | Mano de práctica con elección y revelación, nueve categorías ilustradas en orden, explicación de letras, palos y mejores cinco cartas | Práctica y todas las páginas comprobadas; guardado idéntico antes y después |
| Porcentajes de categoría podían confundirse con victoria | Aviso breve al elegir; reglas distinguen categoría exacta, duelo y conservación de puntos | Predicción, revelación y reanudación verificadas |
| Combo, defensas y criterio de elección del jefe poco explícitos | Guía de cuatro pasos con ejemplo numérico; objetivo de dados explicado en el turno; repaso dentro de reglas | Tres mecánicas, ayuda finita y final independiente comprobados |
| Ventanas largas podían ocultar la navegación con texto al 200 % | Encabezado compacto, páginas medidas con márgenes, división de párrafos conservando énfasis, reajuste al cambiar tamaño y regreso del foco | Póker, cuentas de dados, ventana anidada y cambio de tamaño comprobados |
| Ayudas y frases heredadas de versiones anteriores | Repaso actual de póker, ayuda histórica conservada para guardados antiguos, lenguaje sencillo en Doble y objetivo de veinte fichas | Lectura de interfaz y recorrido de campaña |

### Validación local

- Build y TypeScript aprobados; se conserva la advertencia existente del paquete de escena mayor a 900 kB. No se midió rendimiento.
- 62 pruebas unitarias y 70 verificaciones matemáticas aprobadas. No cambian premios, RNG ni esquema de campaña v8.
- Casos de navegador en [evidencia](evidence/deep-polish/browser.txt), [segunda pasada](evidence/deep-polish/browser-final.txt) y [revalidación](evidence/deep-polish/browser-review.txt). Los fallos iniciales quedan registrados: un acceso a métricas antes de estar listo, un panel demasiado alto, una expectativa de título de Ada obsoleta y el dorado distinto del tutorial se corrigieron y revalidaron.
- Recorrido nuevo desde introducción, tutorial de urnas, sellos de Vera/Doble/Ada y jefe hasta salida y reanudación, sin errores JavaScript. Escritorio 1280 × 720, escritorio compacto 1024 × 640 y ventana estrecha 390 × 844; guías y opciones también al 200 %. Tutorial de Vera recorrido al 200 % en 1366 × 768.
- Capturas comparativas en `docs/evidence/deep-polish/before/` y `after/`; ejemplos finales: [dados](evidence/deep-polish/dice-ready.png), [práctica de Ada](evidence/deep-polish/poker-guide-1280.png) y [salida](evidence/deep-polish/ending.png).
- Se usan game-ui-ux, frontend-design y webapp-testing para presentación y recorridos; game-designer para revisar decisiones y separar evidencia de hipótesis; ca-web-review y ca-security para revisión final y preferencias. Un coordinador, sin dependencias ni recursos externos nuevos. La spec activa no se infirió de la rama: `.specify/feature.json` no existe en este checkout.

La inspección y las pruebas automáticas no acreditan diversión, aprendizaje ni comprensión por jugadores. Sigue pendiente una sesión con personas que no conozcan el juego: pedir que expliquen el objetivo de cada mesa, el neto, la categoría exacta y el combo sin ayuda del facilitador; registrar dudas y decisiones antes de sacar conclusiones. Continúa pendiente la validación humana histórica de las specs; no se marca como completada.

## Publicación verificada

Versión `deep-polish-2026-11-16` publicada en [el juego público](https://garypoui.github.io/TheGame/). Fuente `1028bcc`, rama `codex/deep-game-polish`; despliegue `2f78fe1` en `gh-pages`, [publicación completada](https://github.com/GaryPoui/TheGame/actions/runs/43891187880).

Los 146 archivos públicos coinciden por SHA-256 con la build local. Tres casos HTTPS aprobados: dados 3D con puntos antes/después de tirar y caras iguales al par guardado; práctica de Ada y las nueve categorías; preferencias previas a una campaña conservadas al recargar. Evidencia en [comprobación pública](evidence/deep-polish/public-browser.txt), [integridad](evidence/deep-polish/public-integrity.json) y [datos de entrega](evidence/deep-polish/publication.json).

La rama fuente está subida. El conector de GitHub volvió a rechazar crear el PR con `403 Resource not accessible by integration`; se conserva la [comparación preparada](https://github.com/GaryPoui/TheGame/compare/codex%2Fboss-finale...codex%2Fdeep-game-polish), sin merge. Esto no bloquea la versión pública comprobada.
