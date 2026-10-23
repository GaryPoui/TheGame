# Teatro de tinta — revisión visual v3

Fecha: 2026-10-23. Pedido del usuario: una estética similar a Cuphead, más tranquila,
con comienzo tétrico, luces apagadas y aparición del captor; adaptación provisional de
Gambito de Marvel a partir de tres referencias adjuntas. Esta instrucción sustituye la
orientación fotorrealista anterior. La mecánica educativa y el alcance de una mesa continúan.

## Dirección elegida

Animación de los años treinta: contorno de tinta cálida, fondos de acuarela, ojos con
recorte, siluetas curvas y materiales pintados. Paleta: marfil, ocre, nogal, ciruela y verde
salvia. Violeta reservado para la carta del anfitrión; rojo/triángulo y azul/círculo conservan
su significado en el juego. El tono busca misterio contenido, no terror gráfico.

El captor usa abrigo largo, solapas grandes, cabello levantado, guantes sin dedos y una
carta violeta. Es una adaptación solicitada de Gambito, no un personaje de derechos
íntegramente originales. No se distribuyeron las fotos ni ilustraciones de referencia.
Vera conserva su función de inventarista, ahora ilustrada con chaleco ciruela y cabello
ondulado. Los personajes son ilustraciones estáticas con movimiento leve de composición;
no se afirma tener animación tradicional dibujada cuadro a cuadro ni lip sync.

## Encuadre e implementación

Babylon.js y TypeScript existentes, sin motor o dependencia nueva. Fondo pintado responsive
con recorte cover; captor en capa HTML con transparencia. Mesa, urnas y fichas siguen en 3D
interactivo con contornos de tinta, superficies mates y color simplificado. Vera es un plano
con textura y alpha dentro de Babylon para quedar detrás de las urnas y la mesa. Cámara
controlada estable y panel educativo HTML. Objetivo de revisión: 1440 × 900, escritorio.
También revisar 1280 × 720 al 200 % de texto y ancho 390 para ausencia de bloqueos.

Fuentes raster originales preservadas con metadata: fondo 1672 × 940 y personajes 1024 × 1536.
Sin atlas ni rejilla de animación. Alpha de personajes validado por inspección y canal A.
Filtrado lineal con mipmaps en el plano, browser normal en HTML; colisión/pivote no aplican
al fondo ni retratos. El anclaje del captor es inferior y el de Vera se calibra desde cámara.

## Apertura

1. Nueva partida: negro sobre toda la sala, captor oculto, narración breve; omitir disponible.
2. A los 1800 ms aparece el anfitrión con su carta sobre el negro. Tono grave suave opcional.
3. A los 3300 ms se enciende el fondo mediante fundido de 1200 ms. El diálogo avanza a mano.
4. Al hablar Vera cambia el retrato. El anfitrión explica que los grilletes se abren y que
   la puerta sigue cerrada. Entrar a la sala habilita la primera mesa existente.

Con movimiento reducido: aparición a los 200 ms, luces a los 400 ms, sin fundido ni balanceo.
El volumen cero suprime el tono. Omitir cancela ambos temporizadores y evita renders tardíos.
No hay destellos ni sacudidas de cámara. El foco de teclado se conserva durante el cambio.

## Investigación y procedencia

Consultado 2026-10-23: el [sitio oficial de Cuphead](https://cupheadgame.com/) describe
animación tradicional, fondos de acuarela y referencia a dibujos de los años treinta.
Se toman esas propiedades visuales como dirección; los assets del juego no se descargan.
[Documentación de Babylon](https://doc.babylonjs.com/) y tipos del paquete fijado 9.32.0
para materiales, planos, alpha y contornos. La composición pintada + props 3D es una decisión
propia para conservar el MVP jugable. La recepción del estilo requiere evaluación del usuario.

Se aplicaron create-game-assets (brief, sistema visual, contexto y procedencia), imagegen
(herramienta integrada; tres generaciones) y webapp-testing (recorrido y revisión visual).
Se conservó Playwright TypeScript ya instalado, en lugar de instalar su variante Python.
Prompts, hashes y estado de revisión en [manifiesto](ink-assets.json).
No se etiquetan estas ilustraciones como CC0: el personaje adaptado conserva referencias
reconocibles a Marvel y no se declara licencia de esos derechos por haber sido generado.

## Validación

Primera pasada local: 10/10 pruebas de navegador, incluidas aparición, salto sin callbacks
tardíos y las ocho regresiones de la mesa. 15/15 unitarias, 64 verificaciones matemáticas y
92 archivos de skills verificados. Revisiones posteriores de contorno del vidrio, plaquitas
y retrato de Vera se comprueban con build y recorrido final antes de publicar.
Evidencia nueva en docs/evidence/ink; la evidencia del MVP y v2 se conserva como histórica.
No se afirma rendimiento de GPU, aprendizaje o diversión a partir de pruebas automatizadas.

## Pendiente de dirección

Revisar con el usuario la silueta y calma del captor a escala real. Después desarrollar
actuaciones por estados y ampliar a contratos/registros; esta entrega no agrega la campaña
ni el enfrentamiento final. La adaptación de Gambito es provisional por pedido del usuario.

Última comprobación local: tres pruebas específicas de apertura (incluida reducción de
movimiento) aprobadas tras los ajustes. Captura sin errores JS, requests fallidas, HTTP
erróneos ni recursos externos; ancho de documento 390 en viewport de 390. Revisión de
capturas de mesa, introducción, texto al 200 % y pantalla angosta. PNG originales suman
7.129.929 bytes; los recursos históricos se conservan pero no se solicitan al jugar.
## Publicación y cierre de revisión v3

Sitio: https://garypoui.github.io/TheGame/. Fuente de build:
`4ec4109a4a173e3935d955e740ddd78b66904a5e`; despliegue:
`ff872d5b12bca0f2e757e46d68c11711e95ee2fd`, versión `urns-mvp-ink-v3`.
GitHub Pages informó built. Se verificaron 123/123 archivos servidos por SHA-256.
Las 11/11 pruebas del navegador aprobaron sobre el sitio público: oscuridad completa,
aparición, movimiento reducido, salto sin callbacks tardíos, partida completa, guardado,
ayuda, atajos, ajustes y fallback sin WebGL. Evidencia:
[pruebas públicas](evidence/ink/public-browser.json) e
[integridad pública](evidence/ink/public-integrity.json).

PR de esta revisión: https://github.com/GaryPoui/TheGame/pull/4, sin merge automático.
Los commits posteriores de documentación no cambian los bytes del juego desplegado.
Para ver la aparición desde el comienzo, elegir Nueva partida; Retomar conserva el guardado.
