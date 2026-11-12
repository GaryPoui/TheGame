# Revisión de la lista de mejoras — 12 de noviembre de 2026

Se actualizó `codex/complete-campaign` mediante `git pull --ff-only`, desde
`e5bcd0b` hasta `90dd4d8`. Se conservó el cambio entrante de botones, ajustes,
navegación de la introducción y tutorial de Vera.

| Pedido | Encontrado al actualizar | Trabajo de esta revisión |
| --- | --- | --- |
| Quitar puntos de títulos | Seguían en introducción, resultados y cierres | Tratamiento común para títulos de pantallas y ventanas, conservando sus elementos y estilos |
| Ver opciones sin scroll | Composición de escritorio ya implementada | Revisión de tutoriales y acciones a 1024 × 640, 1280 × 720 y 1440 × 900; retirada de objetivo duplicado en dados |
| Mejorar ajustes | Dos pestañas, interruptor, volumen con porcentaje y etiquetas accesibles incorporados en `90dd4d8` | Conservación y pruebas de uso, persistencia y restauración |
| Una o dos tipografías | Una familia sin serifa en interfaz, cartas y rótulos 3D | Conservación de Arial/Helvetica como alternativas de la misma familia de interfaz |
| Patas de mesas | Cuatro patas y pies en la mesa compartida | Comprobación de cuatro patas activas y captura de la escena real |
| Textos fáciles | Vera ya tenía nuevas cuentas paso a paso | Pagos de dados expresados como ganancia o pérdida final, explicación del coste y del promedio; tutorial de cartas con ejemplos breves |
| Tutorial antes de jugar | Vera interactiva; Doble con presentación; Ada con resumen corto | Tutorial de Ada en tres pasos y explicación adicional del promedio de dados, antes de comenzar |
| Arreglar juego 2 | Matemática y tirada única implementadas | Claridad entre premio y resultado, segunda decisión imaginaria sin otro cobro ni tirada y más espacio para la mesa |
| Juego 3 de cartas | Ada ya usa `cards-v1`, con guardado compatible | Conservación del juego y nuevo tutorial de colores, proporciones y extracción sin reposición |

## Enfoque y límites

Se mantiene el teatro de tinta, el motor y las reglas. El ejemplo de Ada retira una
roja de una copia del tablero: pasar las páginas no modifica cartas reales, puntos,
historial ni estado aleatorio. Se puede volver al paso anterior o saltar el tutorial.
Las partidas antiguas conservan la posibilidad de cambiar a cartas sin perder sellos.

Se aplicaron `game-ui-ux`, `frontend-design` y `webapp-testing` según el router local,
con las excepciones de `.createapp/POLICY.md`: una sola sesión, pruebas existentes,
sin dependencias nuevas ni cambios de identidad. Se inspeccionaron las capturas del
canvas y los límites de los botones; comprobar sólo el DOM no acredita la escena 3D.

## Evidencia

La build y las 46 pruebas unitarias aprobaron; las 70 verificaciones matemáticas
también. La primera comprobación de tres resoluciones pasó con Chrome de escritorio
en un perfil independiente. Un intento previo con SwiftShader se detuvo al recargar
la escena; no se presenta como aprobado. Estas pruebas no miden eficacia educativa,
diversión ni rendimiento de GPU.

Cierre local: 24 casos de navegador comprobados en dos bloques: los primeros 18
completaron sus comprobaciones; el caso largo de lecturas agotó su presupuesto
original de 60 segundos. Se amplió a 180 segundos porque recorre todas las páginas
y captura ambas vistas de los cuatro pasos, sin quitar ninguna aserción. Los seis
casos paginados aprobaron al repetirse, a 1440 × 900, 1366 × 768 y 390 × 844, con
texto al 100 % y 200 %. Chrome 157.0.8103.52 headless, Windows, perfil de prueba.

Resultados: [bloque inicial](evidence/requirements-review/initial-browser.txt) y
[lecturas completas](evidence/requirements-review/tutorial-browser.txt).
La nueva cobertura está en `tests/browser/requirements-review.spec.ts` y comprueba
opciones visibles, títulos, ajustes, cuatro patas y progreso intacto durante el
tutorial. Capturas revisadas: [dados](evidence/requirements-review/dice-1024.png) y
[cartas](evidence/requirements-review/cards-tutorial-1024.png).

La fuente y la publicación se conservan en la rama de campaña y `gh-pages`, sin
fusionar el PR. El registro público se completa después de comprobar la nueva build.
