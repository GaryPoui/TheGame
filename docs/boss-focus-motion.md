# Encuadre, zoom y fluidez del duelo final

Pedido del 16 de noviembre de 2026: mejorar interfaz y zooms, explicar la pelea final, dar mayor presencia al jefe, agrandar su personaje y hacer más fluidos los menús. Rama `codex/boss-focus-motion`, basada en la entrega `346d6e4`.

## Trabajo

- Revisar encuadres 3D y composición al cambiar tamaño, densidad y texto; cubrir espacios CSS equivalentes a zooms de escritorio del 125 al 200 % y distinguirlos de una prueba real del zoom de Chrome.
- Aumentar moderadamente al anfitrión sin cortar su cabeza ni tapar urnas/cartas. Conservar el personaje, mesa y arte existentes.
- Explicar decisión, defensas, carga y golpe de póker con ayuda contextual y desglose de resultado; conservar reglas y azar.
- Conservar el escenario al elegir, evitar regeneraciones y reajustes sin cambios; transiciones cortas sólo cuando ayudan a entender un cambio de pantalla o ventana. Respetar movimiento reducido y no retrasar acciones.
- Verificar menús, las cuatro mesas, ventanas, reanudación y salida; publicar la versión comprobada en Pages.

## Validación

Usar el runner existente y evidencia en `docs/evidence/boss-focus/`. Para fallos reproducidos, conservar caso que falla antes de la corrección. Medir estabilidad de los nodos y cambios del escenario; no deducir FPS ni comprensión de jugadores a partir de capturas o pruebas automáticas. Aplicación de game-ui-ux, frontend-design, camera-systems, animate y webapp-testing dentro del proceso local de coordinador único. Sin nuevas dependencias ni recursos gráficos externos.

## Implementación y hallazgos

- El anfitrión pasa de escala 1,3 a 1,5, con posición ajustada para mantener la cabeza en cuadro. Se refuerzan título y resistencia; se quita una leyenda de ataque que repetía la mecánica visible.
- Defensas y combo son botones de ayuda contextual. La preparación explica tres acciones: elegir bien, cargar y descargar. El resultado separa daño de decisión, mano y combo, y explica la defensa gastada. Los componentes suman el daño real guardado, también en la salida guiada.
- El encuadre se conserva al cambiar el tamaño del texto: `setSettings` sobrescribía el campo de visión de las mesas con 65 grados. Ahora se vuelve a calcular su encuadre según el espacio disponible.
- Se conserva el mismo viewport y canvas entre selecciones. Sólo se redimensiona si cambian tamaño o densidad; sólo se regeneran fichas si cambia el contenido o la ficha revelada. El muestreo registra cero reajustes y cero reconstrucciones adicionales al cambiar dos veces de urna. No es una medición de FPS.
- Las vistas apaisadas cortas reservan espacio para decisiones y acciones. Doble distribuye el espacio restante a la mesa, conserva el tamaño de la tarjeta seleccionada y abre combinaciones en una ventana. Se corrigieron mínimos intrínsecos de las retículas y reglas de estilos que empujaban botones fuera de cuadro.
- En el espacio más pequeño, el póker del jefe usa dos filas para mantener propias, comunitarias y ocultas visibles. Las comparaciones largas se abren en una ventana. Las opciones guiadas llevan una indicación textual; la pantalla de victoria mantiene accesible la salida.
- Ventanas: entrada de 200 milisegundos con opacidad y escala de 0,98 a 1. Pestañas de ajustes y respuesta de pulsación: 120 milisegundos. No se demora ninguna acción. Se respeta movimiento reducido del sistema y de Ajustes; los efectos de pulsación se limitan a punteros precisos con hover.

## Evidencia y límites

Build y TypeScript aprobados; 63 pruebas unitarias, incluidas las sumas del desglose de daño, y 70 verificaciones matemáticas aprobadas. Se cubrieron 54 casos locales en varias pasadas, con los fallos corregidos y revalidados. Se conservan RNG, premios, guardado v8 y salida con ayuda. Sigue la advertencia existente del paquete de escena mayor a 900 kB.

Recorridos en [regresión](evidence/boss-focus/regression.txt), [revisión del jefe](evidence/boss-focus/review.txt), [campaña y zoom](evidence/boss-focus/final.txt), [Doble y guía](evidence/boss-focus/approved.txt), [revalidación de encuadres](evidence/boss-focus/release.txt), [correcciones finales](evidence/boss-focus/release-final.txt) y [comprobación final](evidence/boss-focus/final-check.txt). Se conservan los fallos encontrados y las posteriores revalidaciones; una pasada inicial con fallos no se presenta como aprobada. La campaña nueva hasta salida y reanudación pasó. También se verifican modo guiado, las cuatro mesas, menús, texto al 200 %, recursos sin WebGL y controles de dados.

Espacios CSS cubiertos: 1280 × 720, 1024 × 640, 1024 × 576, 960 × 540, 853 × 480, 640 × 360 y 512 × 320; además de la ventana vertical 390 × 844. Los espacios reducidos reproducen ampliaciones de escritorio hasta el 200 %, con mínimo comprobado de 512 × 320. La prueba de densidad cambia ancho, alto y `devicePixelRatio` en el mismo contexto mediante [emulación del protocolo de Chrome](https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setDeviceMetricsOverride), conserva el progreso y restaura el tamaño. El atajo de zoom no cambió las métricas de Chrome headless; no se cuenta como una prueba manual de la barra de zoom del navegador.

La inspección y la automatización no acreditan diversión, comprensión por jugadores, conformidad integral de accesibilidad ni mejora de FPS. La validación humana de las specs continúa pendiente. No se activaron nuevos servicios, coordinadores o dependencias.

Capturas del [jefe](evidence/boss-focus/release-final/urns-1280.png), [póker en escritorio](evidence/boss-focus/release-final/poker-1280.png) y [póker en el espacio de zoom más pequeño](evidence/boss-focus/release-final/poker-512.png). La [última verificación](evidence/boss-focus/final-check.txt) comprueba la salida guiada y el reajuste de densidad después de las correcciones de la pantalla de victoria.
