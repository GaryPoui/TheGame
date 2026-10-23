> Registro histórico de v2. Dirección vigente: [Teatro de tinta](ink-theatre.md), por instrucción posterior del usuario.

# Mejora visual hacia el realismo — 2026-10-23

El usuario pidió continuar el MVP y superar su aspecto caricaturesco. Esta revisión cambia la
presentación de la primera mesa: no añade las otras mesas ni modifica sus reglas matemáticas.

## Dirección aplicada

- Vera tiene una cabeza anatómica derivada de MakeHuman, UV originales y piel fotografiada
  de OnlyTheGhosts. Se ajustaron escala, cuello, ojos, cabello y apoyo de manos sobre la mesa.
- Madera, suelo y pared usan mapas PBR de Poly Haven; el fieltro incorpora relieve textil discreto.
  Albedo en sRGB y mapas de superficie en espacio lineal. ARM: oclusión R, rugosidad G, metal B.
- Luz cálida de mesa, relleno direccional, reflejos HDR y sombra de contacto; ACES controla altas luces.
- Urnas huecas de vidrio, fichas apoyadas y separadas, letras U/V más grandes y ventanas con marcos.
- Se ajustó el contraste de texto secundario sin cambiar el flujo de decisiones y guardado.

## Procedencia y reproducción

Se aplicaron las skills locales `create-game-assets`, `performance-optimization` y
`webapp-testing`: inspección antes/después, manifiesto, medición y prueba jugable. Los 17 paquetes
instalados y sus 92 archivos siguen verificables mediante `python scripts/skills.py verify`.

[Manifiesto de assets](realistic-assets.json) registra fuentes primarias, autores, licencias,
dimensiones y hashes. Las texturas son locales: no hay solicitudes de imágenes a terceros en juego.
Los originales/licencias se conservan en `third-party/makehuman` y `third-party/polyhaven`.
`python scripts/prepare-dealer.py` reproduce la extracción de cabeza desde el OBJ fijado.
`python scripts/verify-realistic-assets.py` contrasta byte por byte todos los hashes con el
manifiesto y comprueba su copia en la build. La piel original ocupa 3.65 MB a 2048²; los otros
mapas son 1024² y el HDR 1k. El total de texturas distribuidas es 11,357,108 bytes. La build
final pesa 13,935,822 bytes (11,598,321 bytes gzip); el informe reproducible está en
`evidence/realistic/build-report.json`.

## Evidencia y límites

Las capturas y resultados de esta revisión se guardan separados del primer MVP en
`docs/evidence/realistic/`. `before-table.png` conserva el sitio anterior y `after-table.png`
la escena nueva desde la cámara jugable. `after-menu.png` y `after-text-200.png` documentan menú
y ampliación. La validación incluye recorrido completo, recarga, consola, solicitudes, contraste
y ampliación de texto. También se completaron **8/8 pruebas contra GitHub Pages**, registradas en
`browser-public.json`: partida, guardado, ajustes, decisiones guiadas, atajos, guardado inválido,
fallback de WebGL y regresión de modales. `public-integrity.json` confirma 137/137 recursos con
hash igual al de la build y `build-info.json` identifica la versión publicada.

Vera sigue siendo una malla estática: faltan rig, actuación facial, cabello por mechones y
animaciones de reparto. El vestido y parte del mobiliario continúan siendo geometría original
simplificada. La mejora apunta a materiales y proporciones más naturales; no se afirma acabado
fotorrealista ni rendimiento de GPU a partir de pruebas con renderizado por software.
