# Personajes en las mesas y tutorial integrado — 2026-10-28

El usuario aclara que el cuerpo completo corresponde sólo a diálogos. Durante las partidas los personajes deben estar detrás/apoyados en la mesa, sin un duplicado a la derecha.

Vera y Doble vuelven a las ilustraciones originales de torso en la escena Babylon, con el mismo anclaje junto al paño. Se eliminan las ilustraciones completas de los cuadernos de partida. Ada y el anfitrión se presentan detrás de un tablero con encuadre de torso; los diálogos independientes conservan sus imágenes completas. No se crean ni editan assets raster.

El tutorial de Vera usa table-layout, las mismas cartas urn-option y objetivo/régimen de la partida normal. urnChoice comparte presentación y acepta un contexto de demostración sin alterar GameState. El mouse sobre las urnas, las cartas, los controles reasignados y el brillo apuntan a la misma selección de demostración. Las cartas empiezan plegadas como en la partida normal.

Cuatro momentos: elegir U (3/5 frente a 1/2), confirmar una roja preparada sin reposición, volver a elegir entre 2/4 y 1/2, y observar una azul preparada de la urna elegida. La corrección usa cantidades anteriores a sacar; en la segunda elección ambas cartas son correctas. La escena muestra el inventario restante. Vera acompaña con texto breve. No hay puntos, consumo del RNG real ni modificación de progreso; se puede saltar o repetir.

Se aplica game-ui-ux a la coherencia de controles y flujo. Prueba nueva: selección de canvas y teclado, bloqueo de confirmación antes de elegir, feedback, empate, arranque de la partida real y comparación exacta del guardado antes/después. Se conservan las pruebas existentes de campaña. Build y 40 unitarias aprobadas; siete recorridos locales aprobados y dos comprobaciones finales de tutorial y texto al 200 %. Evidencia en docs/evidence/table-tutorial/. La validación de aprendizaje con personas sigue en 010/T011.

La publicación se registra al verificar HTTPS.


## Publicación comprobada

Versión table-tutorial-v10, fuente `c1eae52eb0a71e59809973ec3c39a99e4d018e14`, deployment `cdda0855aa8ff5b273cf5d9689ca2a920db98c1c`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge. Verificación HTTPS: 7/7 recorridos de tutorial y campaña, sin fallos/inestables/omitidos, y 146/146 archivos coincidentes por SHA-256. [CI de la fuente](https://github.com/GaryPoui/TheGame/actions/runs/40800532863) aprobada, incluyendo las 40 unitarias y los 27 recorridos completos de navegador. Capturas públicas de Vera, Ada y anfitrión en docs/evidence/table-tutorial/public/. El registro posterior no modifica la build publicada.

## Cuentas y ayudas del tutorial — 2026-11-02

Pedido: explicar por qué conviene cada opción con cálculos sencillos, identificar claramente el tutorial, sacar su botón de salto de la tarjeta y aprovechar el margen izquierdo para ayudas.

La cabecera ahora dice **Tutorial · Vera te acompaña** y aclara que es una demostración preparada, sin puntos ni cambios en la partida. El paso actual y **Saltar tutorial y jugar** están fuera de la tarjeta de decisión y disponibles en los cuatro momentos, incluidos los resultados.

En escritorio, el margen izquierdo contiene cuentas de ambas urnas con fichas, cantidades y porcentajes. La columna no tapa las urnas 3D. En móvil las ayudas se reordenan en el flujo de la página; al ampliar el texto se conserva desplazamiento y no se recortan las acciones.

- Primera elección: 3 rojas + 2 azules = 5 fichas; 3 ÷ 5 × 100 = 60 %. La otra urna ofrece 1 ÷ 2 × 100 = 50 %. Vera explica por qué conviene la primera y recuerda que aún existe 40 % de sacar azul.
- Primera extracción: se retira una roja preparada. (3 − 1) ÷ (5 − 1) = 2 ÷ 4 = 50 %. Cambian tanto las rojas como el total.
- Segunda elección: 2 ÷ 4 = 50 % y 1 ÷ 2 = 50 %. Ambas opciones son buenas; tener más fichas no implica una proporción mayor.
- Segunda extracción: sale una azul preparada de la urna elegida. La decisión seguía siendo buena porque antes había 50 % de cada color. Se distinguen las cuentas anteriores de las cantidades restantes: 2 ÷ 3 × 100 ≈ 66,7 % o 1 ÷ 1 × 100 = 100 %, según la elección. El símbolo ≈ identifica el redondeo.

Las cuentas se generan desde los inventarios del tutorial usando la función de probabilidad existente. No se modifican reglas, RNG, puntuación, esquema de guardado ni inventarios de la partida real. Se mantienen tarjetas plegables y selección directa en el canvas; el salto inicia la partida normal sin otorgar puntos.

Skills aplicadas: **game-designer** para las razones de cada decisión y separación de decisión/azar; **game-ui-ux** y **frontend-design** para jerarquía, margen lateral y adaptación; **webapp-testing** con el Playwright TypeScript existente. Sin recursos ni dependencias nuevas.

Validación local: build y **46 unitarias** aprobadas; **70 comprobaciones matemáticas** aprobadas. **Once casos de navegador** cubren el tutorial y sus dos elecciones empatadas, la extracción mediante canvas, cuentas antes/después, salto externo, guardado idéntico antes/después, entrada al juego normal y las seis combinaciones 1440 × 900, 1366 × 768 y 390 × 844 con texto al 100 % y 200 %. Se revisaron capturas y se comprobaron desbordes horizontales, acceso a las acciones y símbolos contenidos en las fichas. Capturas locales en `/tmp/thegame-tutorial-help`; no se sobrescribe la evidencia pública anterior. Sigue pendiente evaluar comprensión con personas: estas pruebas no demuestran aprendizaje. Permanece la advertencia previa de Vite sobre un chunk mayor de 900 kB. Servidor local en `http://127.0.0.1:5174/`; sin publicación ni commits.

## Tutorial sin desplazamiento — 2026-11-02

Este ajuste sustituye el comportamiento con scroll de la sección anterior por pedido explícito del usuario. La cabecera principal dice **Tutorial** en tamaño grande. **Saltar tutorial** queda en el pie inferior derecho, fuera de la tarjeta y con la clase primaria dorada de **Tomar asiento**.

Las ayudas muestran una página breve por vez, con flechas anterior/siguiente y contador. Se conservan las cuentas de ambas urnas, la comparación de posibilidades, las explicaciones de Vera, la extracción sin reposición y la distinción entre inventario anterior y restante. En móvil se alterna entre **Elegir** y **Las cuentas**, sin apilar ambas vistas. Las tarjetas muestran proporción y porcentaje; durante la revisión el resultado sustituye al objetivo ya completado. No se reducen las preferencias de tamaño de texto ni se recortan explicaciones para ocultar el scroll.

Skills aplicadas: **game-ui-ux**, **frontend-design**, **ca-ux** y **webapp-testing**, manteniendo la identidad existente y sin dependencias nuevas. No se cambian reglas, RNG ni guardado.

Validación local de este ajuste: compilación aprobada y **12 casos de navegador** aprobados, incluidos diez del tutorial y dos recorridos existentes. Se comprueban los cuatro pasos y todas las páginas de ayuda a 1440 × 900, 1366 × 768 y 390 × 844, con texto al 100 % y 200 %. Las pruebas ya no desplazan la página para acceder a las acciones: miden desbordes verticales y horizontales, controles dentro del viewport, ausencia de solapamiento con el pie, navegación por teclado y foco en los extremos de la paginación. Se mantienen selección mediante canvas, ambas elecciones empatadas y guardado idéntico antes/después. Capturas revisadas en `/tmp/thegame-no-scroll`. Sigue pendiente validar comprensión con personas. Permanece la advertencia previa de Vite sobre un chunk mayor de 900 kB. Servidor local en `http://127.0.0.1:5174/`; sin commits ni publicación.
