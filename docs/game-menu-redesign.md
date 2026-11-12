# Menús de juego — rama de revisión

Pedido del 12 de noviembre de 2026: mejorar Ajustes y la mayoría de los menús para
que se presenten como un juego, desarrollar la propuesta en una rama aparte y
subirla antes de fusionar. Base: `3bd7282`, rama de trabajo
`codex/game-menu-redesign`. El pedido posterior del mismo día autorizó publicar
también en `gh-pages`, manteniendo la fuente en esta rama separada.

## Dirección y alcance

Se conserva el teatro de tinta y sus ilustraciones. Los menús usan un mismo marco
de tinta ciruela y latón: fondo `#251e2c`, panel `#302636`, borde `#9e815c`, acento
`#e8c17a`, texto `#f7ead3` y texto secundario `#d4bfa7`. La tipografía sigue siendo
la familia sin serifa del proyecto. No se incorporan fuentes, imágenes ni dependencias.

- Inicio: lista vertical con Reanudar, Nueva partida, Opciones y Créditos. El título
  y el personaje siguen llevando la escena; se retiran las descripciones duplicadas.
- Opciones: panel ancho con categorías Pantalla, Sonido y Partida, controles con
  flechas, volumen con valor visible y regreso fijo en el borde inferior.
- Selección de mesas: retratos de cada personaje, estado disponible/completada y
  candados con los requisitos de progreso existentes. Regreso directo al inicio.
- Cierres de mesa, lecturas, créditos y confirmaciones: marco, botones y contraste
  coherentes. Se mantienen separadas las acciones de conservar y borrar progreso.

Los controles nativos de selección, rango y switch conservan etiquetas y operación
con teclado. Las flechas de texto y volumen tienen límites; las categorías admiten
flechas, Inicio y Fin. Las opciones se guardan mediante el adaptador existente.
Volver al inicio no relanza dados ni reinicia la campaña. Las acciones destructivas
requieren confirmación y tienen cancelación explícita.

La escala de texto de la partida conserva sus valores. Las superficies de menú
usan tamaños fluidos acotados para mantener visibles los controles; se verificaron
con los ajustes al 100 % y 200 %. No se alteran matemáticas, RNG ni formato de guardado.

## Implementación y revisión

`src/ui/game-menus.ts` contiene la presentación de opciones y los iconos SVG propios.
`src/ui/game-menus.css` reúne la nueva capa visual. Se reutilizan las acciones de
`src/main.ts`, conservando el manejo de guardados y el bloqueo de mesas.

Se aplicaron las guías `impeccable`, `game-ui-ux`, `frontend-design` y
`webapp-testing`, sujetas a `.createapp/POLICY.md`. Se trabajó en una sesión y se
heredó la identidad existente. El contexto de Impeccable y su detector mecánico se
ejecutaron; el detector no reportó hallazgos. No se instalaron coordinadores ni
herramientas nuevas.

Validación: build/TypeScript; 46 pruebas unitarias con un worker; 70 verificaciones
matemáticas y documentación estructural aprobadas. La ejecución paralela inicial
agotó los cinco segundos de una prueba extensa de reproducción de partidas; con
un worker aprobaron las 46. No se interpreta ese tiempo como rendimiento del juego.

Se cubrieron 18 casos de navegador en Chrome headless de escritorio, Windows:
opciones a 1024 × 640, 1440 × 900 y 390 × 844; ajustes también a 1366 × 768; texto
normal/ampliado, valores y persistencia, límites de controles, foco, bloqueo de mesas,
regreso al inicio, confirmaciones y cierre de mesa. En la segunda revisión aprobaron
17 casos y se detectó un botón recortado en el cierre con texto al 200 %. Se corrigió
el espaciado y aprobaron los tres casos específicos repetidos, sin quitar aserciones.

Evidencia en [capturas y resultados](evidence/game-menu-redesign/validation.json).
Las capturas verifican presentación; no demuestran aprendizaje, diversión,
accesibilidad integral ni rendimiento de GPU.

## Estado de entrega

Implementación terminada en su propia rama, sin fusionar la rama de campaña.
Publicación en `gh-pages` autorizada por el usuario; se registran el commit y la
comprobación pública al terminar la entrega.
