# El póker de Ada

Pedido del 12 de noviembre de 2026. Sustituye la partida nueva de Ada por una
predicción de manos de póker. Se conserva Babylon.js, el teatro de tinta, las mesas,
las cartas HTML sin serifa y los menús existentes. Sin nuevas dependencias ni arte.
Las sesiones anteriores siguen siendo recuperables y ofrecen cambiar de juego;
cambiar reinicia solamente la sesión de Ada y conserva los sellos de campaña.

## Reglas

Cada mano reparte dos cartas al jugador, dos ocultas a Ada y cuatro comunitarias.
Se elige la categoría exacta de la mejor combinación de cinco entre las siete cartas
finales. Después de confirmar se extrae la quinta comunitaria y se muestran las de
Ada. Se cobra únicamente por acertar la categoría y superar la mano de Ada.
Los empates y las categorías diferentes, incluso superiores a la anunciada, pagan cero.
Ada elige antes de la revelación con sus dos cartas y las cuatro comunitarias;
su política maximiza probabilidad de categoría por premio, sin acceder a las cartas
del jugador, al RNG ni a la quinta carta. También debe acertar y ganar para sumar.
Su marcador es comparativo: la meta de 24 puntos corresponde al jugador.

| Mano | Puntos |
| --- | --- |
| Carta alta | 2 |
| Pareja | 4 |
| Doble pareja | 7 |
| Trío | 10 |
| Escalera | 14 |
| Color | 18 |
| Full house | 24 |
| Póker | 32 |
| Escalera de color, incluida real | 40 |

Cada mano comienza con una baraja estándar nueva. No hay apuestas de dinero ni
penalización por fallar. Las probabilidades visibles enumeran las 46 cartas desconocidas
para el jugador, incluidas las ocultas de Ada; expresan la categoría, no ganar la mano.
El reparto real extrae la quinta de las 44 cartas restantes, después de comprometer
la elección. No se manipulan repartos ni se consume RNG durante el tutorial.
Tras 24 manos se ofrece continuar la campaña con ayuda, sin inventar puntos ni
certificar una victoria independiente. Se puede seguir jugando por los 24 puntos.

Se compara categoría y valores de desempate; el as vale alto o bajo en la escalera.
Los palos no desempatan. Referencia de reglas:
[PokerStars, clasificación y comparación de manos](https://www.pokerstars.com/poker/games/rules/hand-rankings/).

## Implementación y comprobación

Lógica pura en `src/core/tables/holdem.ts`; adaptación versionada `holdem-v1` en el
reductor de Ada. Guardado v7, con lectura v1–6 y replay determinista de comandos.
Revisión y comandos duplicados no vuelven a extraer cartas. La calidad de predicción
queda en el historial; el marcador depende del resultado y se presenta como puntos,
sin llamarlo mérito educativo. Se mantiene la identidad y la distribución con
cartas en el paño y opciones al costado. Las reglas extensas usan el modal existente.

Guías aplicadas: game-designer, game-ui-ux, frontend-design, save-systems, game-ai y webapp-testing, bajo
el contrato local de una sesión. Pruebas Vitest y Playwright TypeScript existentes.

La calibración con 300 semillas y una política que sólo utiliza información disponible
dio 13 manos de mediana y 13,86 de media; percentiles 10–90: 5–24. El azar permite
terminar antes, incluso en una mano excepcional. Es una simulación de esa política,
no evidencia de diversión, aprendizaje ni duración de jugadores humanos.
Se enumeraron las 2.598.960 manos de cinco cartas contra los nueve totales estándar;
300 manos de siete cartas se contrastaron contra sus 21 subconjuntos de cinco.
Resultados de calibración en [balance](evidence/ada-holdem/balance.json).

Build y TypeScript aprobados; 53 unitarias con `--maxWorkers=1 --testTimeout=20000`,
70 verificaciones matemáticas y 92 archivos de skills. Las aserciones de versión de
guardado se actualizaron a v7; los fixtures históricos se fijaron a `cards-v1`.
El presupuesto unitario se amplió porque el replay histórico excedió cinco segundos.
La primera prueba de navegador no llegó al juego por restricciones de red local;
se repitió con servidor y navegador en el mismo entorno.

La vista normal pasó cuatro casos de navegador (1280 × 720, 1024 × 640,
390 × 844 y ayuda finita). Se verifican ocultación, revelación, recarga sin
volver a repartir, reglas en modal y controles/cartas dentro de la pantalla de PC.
En texto ampliado se detectó y corrigió un recorte: etiquetas de la mesa y
opciones usan tamaños acotados, mientras la lectura de reglas conserva la escala.

La corrección al 200 % se revalidó en 1280 × 720 y 1024 × 640;
el detalle de las comprobaciones está en [navegador](evidence/ada-holdem/browser.txt)
y [texto ampliado](evidence/ada-holdem/large-text-browser.txt).
