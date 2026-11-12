# Revisión de escritorio y cartas — 29 de octubre de 2026

Pedido del usuario: menos texto, nada de desplazamiento en PC, mesas con patas,
mesa de dados mayor, explicaciones en un cartel central con cruz, Ada con cartas de
póker, quitar la mesa superpuesta del anfitrión, controles, recorrido y ensayo opcional.

## Cambios

- Cuatro patas físicas y pies de latón en la mesa Babylon compartida; cámara
  encuadrada para mostrar los apoyos y el personaje. La mesa de Doble ocupa el espacio
  vertical que dejan las ofertas abreviadas.
- Ofertas con nombre, ganancia neta y condición de pago. Las cuentas y los pares
  se consultan en ventanas centrales. Todas las antiguas secciones desplegables se
  convierten en botones que abren esas ventanas; las lecturas largas tienen páginas.
- [Ada con cartas](ada-poker.md): cuatro rondas, ocho decisiones, extracción uniforme
  sin reposición y ayuda finita. Guardado v6 compatible con v1–5; las partidas antiguas
  de Ada se pueden continuar o cambiar por cartas conservando los sellos.
- Sin panel «Recorrer la sala», pestaña de controles ni atajos personalizados de
  gameplay. Las mesas y acciones se eligen con el mouse. Se conservan los controles
  nativos HTML y el cierre normal del diálogo.
- Retirados los dos ejercicios opcionales del cierre, la mesa HTML superpuesta
  al anfitrión y notas ambientales o repetidas que no ayudan a elegir.
- Escritorio desde 1000 píxeles de ancho: la página ocupa la ventana, sin scroll;
  composición compacta de preguntas, respuestas, feedback y botones.

## Skills y fuentes

Se aplicaron `game-ui-ux` para la jerarquía y las ventanas, `frontend-design` para
preservar tinta, papel, latón y tipografía sin serifa, `game-designer` para Ada y
`webapp-testing` para recorridos y capturas con Playwright. Se usaron las herramientas
ya presentes en el proyecto, sin dependencias ni recursos de terceros nuevos.
Referencia oficial de cámara: [Babylon UniversalCamera](https://doc.babylonjs.com/typedoc/classes/BABYLON.UniversalCamera),
campo de visión en radianes y `setTarget`.

La evidencia de esta entrega diferencia las pruebas de reglas de las de navegador.
SwiftShader sirve para verificar la escena y sus controles, sin afirmar rendimiento
de GPU real, diversión ni eficacia educativa. La ampliación de texto extrema y las
ventanas de escritorio inferiores a las resoluciones ensayadas requieren evaluación
adicional; no se declara accesibilidad integral.

## Validación y publicación

Cierre local 2026-10-30: TypeScript y build aprobados; 46 pruebas unitarias,
70 comprobaciones matemáticas y 92 archivos de skills verificados. La suite completa
recorrió 39 casos: 38 aprobados y uno detectó padding excesivo en la cabecera con
texto al 200 % en 390 × 844. Se corrigió ese padding, se reconstruyó y el caso
fallido pasó al repetirse. Los recorridos de campaña sin scroll incluyen 1280 × 720,
1366 × 768 y 1920 × 1080, con todas las decisiones y cierres de Vera, Ada y anfitrión,
ventanas centrales, partidas guardadas y controles de Doble. Las pruebas específicas
cubren animación, movimiento reducido y alternativa HTML sin WebGL.

Resultados: [suite local](evidence/desktop-poker/local-browser-results.txt),
[corrección revalidada](evidence/desktop-poker/correction-browser-results.txt),
[build y hashes](evidence/desktop-poker/build-report.json) y
[revisión previa a push](evidence/desktop-poker/prepush-review.json).
Capturas: [Vera](evidence/desktop-poker/vera-desktop.png),
[Doble](evidence/desktop-poker/dice-desktop.png) y
[Ada](evidence/desktop-poker/ada-desktop.png).

Publicación autorizada en `gh-pages`, conservando el historial y el PR #7 sin fusionar.
Publicada el 2026-10-30 como `desktop-poker-2026-10-30`:
fuente `7a9ed90`, rama estática `013e7a4`. [Jugar por HTTPS](https://garypoui.github.io/TheGame/).
Los 146 archivos públicos coinciden con la build por SHA-256, sin diferencias.

En HTTPS completaron campaña a 1366 × 768, texto al 200 % en ventana angosta,
dados con movimiento reducido y alternativa HTML sin WebGL. Dos recorridos con
capturas agotaron los tiempos del navegador y su cierre; el intento largo quedó
interrumpido. No se presentan como aprobados. Una comprobación adicional sin
capturar imágenes pasó en 6,7 segundos: animación normal, resultado guardado,
segunda elección sin relanzar, RNG conservado y ausencia de errores de página.

Evidencia: [integridad pública](evidence/desktop-poker/public-integrity.json),
[pruebas cortas](evidence/desktop-poker/public-browser-results.txt),
[intento largo](evidence/desktop-poker/public-browser-interrupted.txt) y
[acciones animadas sin captura](evidence/desktop-poker/public-actions.json).
La CI de la fuente seguía en ejecución al consultar su estado; no se declara aprobada.
