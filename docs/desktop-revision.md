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

El registro de cierre y los resultados ejecutados se incorporan al completar las
pruebas locales y públicas. Destino autorizado: la rama `gh-pages`, sin fusionar PR.
