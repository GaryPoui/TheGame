# Jugabilidad práctica de Vera y Doble

Fecha: 2026-10-23. Corte local sobre `codex/doble-contracts`.
Durante la implementación el usuario indicó **no hacer push** y el corte quedó local.
Después autorizó expresamente subir todo y actualizar Pages. Esta revisión se prepara para publicación.

## Cambios implementados

- Vera presenta dos inventarios físicos con todas sus fichas contables. Una marca distingue
  las favorables; también se conservan forma, color, cantidades y fracción textual.
- El tutorial permite elegir U o V, recibir una explicación, observar una roja preparada y
  volver a elegir cuando 2/4 y 1/2 son equivalentes. Es opcional y no consume azar de campaña.
- El comentario de Vera usa el inventario seleccionado. Después de extraer se comparan
  la fracción anterior y la actual, con tratamiento de urna vacía.
- El botón de continuación integra el cierre intermedio de ronda mediante dos transiciones
  legales del núcleo. No se eliminan extracciones, mérito ni práctica guiada.
- Practicar Vera de nuevo entra directamente a la mesa, conservando los sellos previos.
- Doble muestra cuántos de los 36 pares dejan ganancia en cada contrato. Al seleccionar,
  presenta el cálculo pertinente al encargo: promedio, umbral, garantía o rango.
- El ensayo manual deja cambiar ambos dados entre 1 y 6 y comparar los tres pagos netos.
  No es una predicción: no usa el RNG ni modifica saldo, historia, sellos o guardado.
- El recibo sobre el paño compara los pagos del mismo par y señala el contrato de la primera
  orden, aunque la segunda orden haya elegido otro. Esta comparación no concede mérito.
- Ambas mesas muestran una secuencia de decisiones. En celular el objetivo de Doble aparece
  antes de los contratos y la acción principal permanece visible.
- La revelación tiene feedback visual breve, sin espera obligatoria, respetando reducción
  de movimiento del sistema y del juego. No se aplica a las acciones iniciadas por teclado.

## Archivos

- [Orquestación e interfaz Vera](../src/main.ts).
- [Interfaz Doble](../src/ui/contracts.ts).
- [Representaciones y ensayo](../src/ui/table-experience.ts).
- [Presentación de las mesas](../src/ui/table-experience.css).

Se reutilizan los assets existentes; no se requieren assets nuevos para este corte.
Se aplicaron game-designer, game-ui-ux, frontend-design, game-feel, Impeccable y animate.
El núcleo matemático, las reglas, el esquema de guardado y los contratos originales no se editaron.

## Alcance de la revisión

Compilación y comprobación de tipos completadas. El detector de diseño no produjo hallazgos
en su pasada mecánica. Inspección visual de escritorio y celular; observación del comentario
al seleccionar U y del ensayo al pasar de 2+2 a 3+2, manteniendo saldo y mérito visibles en 0.
No se ejecutaron ni añadieron suites de pruebas. No se midió diversión, aprendizaje o
accesibilidad con usuarios; esos resultados siguen pendientes de evaluación.

Capturas locales: [Vera escritorio](evidence/playability/vera-desktop.png),
[Vera celular](evidence/playability/vera-mobile.png) y
[Doble escritorio](evidence/playability/doble-desktop.png).

La compilación mantiene el aviso previo de tamaño del módulo 3D. La versión pública sigue
siendo el despliegue anterior: este corte se puede abrir en la vista local.
