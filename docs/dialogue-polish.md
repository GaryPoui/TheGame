# Carteles y diálogo — 2026-10-28

Pedido: mejorar el historial «Lo que dijeron», el diálogo de Vera y sus botones.

Se conserva tinta/ciruela, papel y latón con tipografía sans-serif. La cabecera del diálogo separa personaje e intervención; el texto tiene interlineado amplio. La acción principal ocupa una fila completa y los controles secundarios otra, apilándose cuando falta espacio. El historial presenta intervenciones separadas, nombre, inicial decorativa y orden de lectura. Los modales comparten cabecera oscura, cuerpo claro desplazable y cierre visible; el diálogo nativo tiene nombre accesible con aria-labelledby. En pantallas muy angostas el cierre muestra ×, conservando su nombre accesible «Cerrar».

No se cambian líneas narrativas, reglas, guardados, azar ni personajes. Se mantienen Escape, foco nativo y vuelta al control anterior. La reducción de movimiento existente sigue aplicándose. Skills frontend-design y game-ui-ux leídas/aplicadas para jerarquía, controles y distribución responsive; se usa el Playwright del proyecto para revisión visual, sin paquetes ni assets nuevos.

Validación local: build y 40 unitarias aprobadas; ocho recorridos existentes de introducción, historial, ajustes, teclado y confirmaciones aprobados. Capturas a 801 px y a 390 px con texto 200 % en docs/evidence/dialogue-polish/. A 390 px, modal de 362 px, cuerpo desplazable y cierre por Escape comprobados. No se presenta como certificación de accesibilidad. La tarea humana 010/T011 sigue abierta.

La publicación y su comprobación HTTPS se registran al cierre.
