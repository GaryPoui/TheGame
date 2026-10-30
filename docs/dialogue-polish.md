# Carteles y diálogo — 2026-10-28

Pedido: mejorar el historial «Lo que dijeron», el diálogo de Vera y sus botones.

Se conserva tinta/ciruela, papel y latón con tipografía sans-serif. La cabecera del diálogo separa personaje e intervención; el texto tiene interlineado amplio. La acción principal ocupa una fila completa y los controles secundarios otra, apilándose cuando falta espacio. El historial presenta intervenciones separadas, nombre, inicial decorativa y orden de lectura. Los modales comparten cabecera oscura, cuerpo claro desplazable y cierre visible; el diálogo nativo tiene nombre accesible con aria-labelledby. En pantallas muy angostas el cierre muestra ×, conservando su nombre accesible «Cerrar».

No se cambian líneas narrativas, reglas, guardados, azar ni personajes. Se mantienen Escape, foco nativo y vuelta al control anterior. La reducción de movimiento existente sigue aplicándose. Skills frontend-design y game-ui-ux leídas/aplicadas para jerarquía, controles y distribución responsive; se usa el Playwright del proyecto para revisión visual, sin paquetes ni assets nuevos.

Validación local: build y 40 unitarias aprobadas; ocho recorridos existentes de introducción, historial, ajustes, teclado y confirmaciones aprobados. Capturas a 801 px y a 390 px con texto 200 % en docs/evidence/dialogue-polish/. A 390 px, modal de 362 px, cuerpo desplazable y cierre por Escape comprobados. No se presenta como certificación de accesibilidad. La tarea humana 010/T011 sigue abierta.

La publicación y su comprobación HTTPS se registran al cierre.


## Publicación verificada

dialogue-polish-v9, fuente `31b2252983157f00e01ede9cc2bbe41c450e1cb3`, deployment `4921c4c171f10da99b05d22fc406cc42f4e6f63b`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge. Ocho recorridos públicos aprobaron, sin fallos, omitidos ni casos inestables; 146/146 archivos coinciden por SHA-256. Capturas reales por HTTPS en docs/evidence/dialogue-polish/public/. La comprobación a 390 px y 200 % conserva modal de 362 px, texto desplazable y cierre accesible. El commit posterior de registro no modifica la build.
