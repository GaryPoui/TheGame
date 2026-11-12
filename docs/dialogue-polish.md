# Carteles y diálogo — 2026-10-28

Pedido: mejorar el historial «Lo que dijeron», el diálogo de Vera y sus botones.

Se conserva tinta/ciruela, papel y latón con tipografía sans-serif. La cabecera del diálogo separa personaje e intervención; el texto tiene interlineado amplio. La acción principal ocupa una fila completa y los controles secundarios otra, apilándose cuando falta espacio. El historial presenta intervenciones separadas, nombre, inicial decorativa y orden de lectura. Los modales comparten cabecera oscura, cuerpo claro desplazable y cierre visible; el diálogo nativo tiene nombre accesible con aria-labelledby. En pantallas muy angostas el cierre muestra ×, conservando su nombre accesible «Cerrar».

No se cambian líneas narrativas, reglas, guardados, azar ni personajes. Se mantienen Escape, foco nativo y vuelta al control anterior. La reducción de movimiento existente sigue aplicándose. Skills frontend-design y game-ui-ux leídas/aplicadas para jerarquía, controles y distribución responsive; se usa el Playwright del proyecto para revisión visual, sin paquetes ni assets nuevos.

Validación local: build y 40 unitarias aprobadas; ocho recorridos existentes de introducción, historial, ajustes, teclado y confirmaciones aprobados. Capturas a 801 px y a 390 px con texto 200 % en docs/evidence/dialogue-polish/. A 390 px, modal de 362 px, cuerpo desplazable y cierre por Escape comprobados. No se presenta como certificación de accesibilidad. La tarea humana 010/T011 sigue abierta.

La publicación y su comprobación HTTPS se registran al cierre.


## Publicación verificada

dialogue-polish-v9, fuente `31b2252983157f00e01ede9cc2bbe41c450e1cb3`, deployment `4921c4c171f10da99b05d22fc406cc42f4e6f63b`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge. Ocho recorridos públicos aprobaron, sin fallos, omitidos ni casos inestables; 146/146 archivos coinciden por SHA-256. Capturas reales por HTTPS en docs/evidence/dialogue-polish/public/. La comprobación a 390 px y 200 % conserva modal de 362 px, texto desplazable y cierre accesible. El commit posterior de registro no modifica la build.

## Navegación de la historia — 2026-11-02

Pedido: corregir la interfaz usando las skills y reemplazar los controles de nueva partida por dos botones. Esta revisión local sustituye la distribución de acciones de la introducción descrita arriba; las publicaciones anteriores quedan como historia.

- La introducción presenta exactamente dos controles: **Atrás** y **Continuar**. En la última intervención, la acción siguiente se llama **Entrar a la sala**.
- Atrás relee la intervención anterior; desde la primera vuelve al menú y cancela los temporizadores de la apertura. Reanudar conserva el último paso alcanzado.
- Se retiran del panel Saltar introducción, Volver a leer y el acceso adicional al recuerdo de la calle. La historia y sus personajes se conservan.
- Releer no reejecuta comandos, no duplica la liberación de los grilletes ni agrega entradas al guardado. Se conserva el formato de guardado y la reanudación tras recargar.
- Se conserva la estética existente, sin serifa. El panel tiene esquinas de 8 px, texto con interlineado amplio, espacio de lectura estable y desplazamiento cuando hace falta. Los controles tienen foco visible y al menos 48 px de alto. En móvil con texto ampliado se apilan para evitar cortes.

Skills leídas y aplicadas: **game-ui-ux** para foco, navegación y tamaño de controles; **frontend-design** para jerarquía y continuidad visual; **dialogue-systems** para separar relectura y efectos; **webapp-testing** para validar con el Playwright TypeScript existente. Sin paquetes ni recursos nuevos.

Validación local realizada: TypeScript y build aprobados, **46 pruebas unitarias** y **19 casos de navegador** aprobados. Incluyen 20 relecturas consecutivas sin modificar el guardado, reanudación, navegación con teclado, cancelación de temporizadores, introducción y extracción 3D, pérdida de WebGL, tutorial completo, entrada a la partida y conflicto de guardado entre pestañas. Se comprobaron los tres pasos a **1440 × 900**, **1366 × 768** y **390 × 844**, con texto al **100 % y 200 %**, sin desbordes horizontales y con controles accesibles dentro de la pantalla. Las capturas locales están en `/tmp/thegame-story-navigation`; se revisaron las de escritorio, móvil y móvil al 200 %. No se presentan estas pruebas como evaluación humana ni certificación de accesibilidad. La advertencia previa de Vite sobre un chunk mayor de 900 kB sigue presente; no bloquea la build.

Servidor local en `http://127.0.0.1:5174/`. Sin publicación ni commits en este corte.

## Entrada suave del anfitrión — 2026-11-02

El anfitrión parte de opacidad 0 en la oscuridad y aparece con un fundido de **1,2 segundos**, con desaceleración suave, antes de encenderse la sala. Se mantienen los tiempos de la historia y los dos controles de navegación. La opción de movimiento reducido del juego y la preferencia del sistema desactivan el fundido.

Skill **game-feel** leída y aplicada para la transición visual sin modificar la simulación; **webapp-testing** aplicada mediante el Playwright existente. La regresión reprodujo primero el defecto (opacidad inicial 1 en vez de 0). Tras la corrección pasaron **seis casos de navegador**: fundido con opacidades intermedias en escritorio y móvil, introducción y extracción, movimiento reducido del juego, preferencia del sistema y cancelación al regresar al menú. Se revisaron las capturas intermedias de 1440 × 900 y 390 × 844 en `/tmp/thegame-captor-fade`. TypeScript y build aprobados, sin errores nuevos del editor; la advertencia previa del tamaño de chunk permanece. Sin paquetes nuevos, publicación ni commits.
