# Las cartas de Ada — 29 de octubre de 2026

El usuario pidió reemplazar la mesa de fotos por un juego de probabilidad con cartas de
póker. Las sesiones nuevas usan `cards-v1`; las sesiones anteriores conservan sus reglas,
progreso y reproducción de comandos. Desde la sala se puede empezar la versión de cartas
sin perder los sellos. El guardado nuevo es v6; acepta los formatos v1–5.

## Reglas implementadas

Ada presenta dos montones visibles, preparados con cartas distintas de una baraja estándar
de 52 cartas, sin comodines. No se afirma que los montones sean repartos aleatorios. Dentro
del montón elegido, cada carta sí tiene la misma probabilidad de ser extraída mediante el
RNG inyectable del juego. El jugador elige el montón con mayor proporción de cartas que
cumplen el objetivo, extrae una carta y vuelve a decidir sobre las cartas restantes.
La carta extraída queda afuera; los montones se renuevan al empezar otra ronda.

Hay cuatro rondas de dos decisiones. Los objetivos son sacar una carta roja, un corazón,
una figura y una carta roja o un rey. Las figuras son jota, reina y rey; el as no es figura.
La unión «roja o rey» incluye a los reyes rojos una sola vez.

Un punto por elegir una probabilidad máxima, incluso si la extracción no cumple el
objetivo. En un empate, cualquiera de los dos montones sirve. Se obtiene el sello con seis
de ocho decisiones acertadas. Si no alcanza, se añaden dos rondas guiadas de dos decisiones;
la ayuda sólo acepta una opción correcta. Sus extracciones usan las mismas probabilidades
y el mismo RNG que el resto de la mesa. Terminar esos cuatro pasos permite continuar sin depender de la suerte.
El resultado de las cartas no entrega ni quita méritos adicionales.

## Referencias matemáticas y ejemplo

En la baraja completa hay 26 rojas, 13 corazones, 12 figuras y 28 cartas que son rojas o
reyes: `26 + 4 − 2 = 28`. Cada montón inicial es un subconjunto, no una baraja completa.
Las probabilidades de cada elección se cuentan sobre el montón visible correspondiente.

Primera ronda: montón 1 con cuatro rojas entre seis cartas, montón 2 con dos entre seis.
Conviene el primero. Sacar una negra sigue siendo posible y no invalida la buena elección.
Si salió una roja del primero, la segunda elección compara `3/5` con `2/6`.

Segunda ronda: hay dos corazones de cuatro cartas en un montón y cuatro de ocho en el otro.
Ambos ofrecen `1/2`, aunque uno tenga más corazones en cantidad. Si se retira un corazón
del primero, las siguientes probabilidades son `1/3` y `4/8`; ahora conviene el segundo.
Si se retira una carta de otro palo del primero, ofrece `2/3` y pasa a ser el mejor.
La decisión se calcula antes de consumir el RNG; no se consulta la carta futura.

## Aplicación de skills y evidencia

Se aplicaron `game-designer` (decisión, información visible, puntos separados del azar y
recuperación finita) y `game-ui-ux` (objetivo único, dos elecciones visibles, explicación
breve posterior y reglas bajo demanda). Se conserva el escenario y la paleta existentes;
las cartas son HTML y símbolos de texto, sin assets nuevos ni dependencias.

`tests/unit/poker-records.test.ts` comprueba enumeración de 52 cartas distintas, unión sin
duplicados, comparación exacta de fracciones, empate entre tamaños diferentes, actualización
sin reposición, reproducción de cada checkpoint, final independiente y asistido en 24
semillas y las dos variantes, separación de mérito y resultado, rechazo de comandos
duplicados y estados alterados, guardado v6 y carga de sesiones v5. TypeScript y 46 pruebas
unitarias aprobados al integrar esta mesa. Las pruebas de navegador y publicación se
registran en la evidencia de la entrega general; esto no demuestra aprendizaje ni diversión.
