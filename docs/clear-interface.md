# Interfaz y lenguaje claros — 29 de octubre de 2026

Pedido: simplificar lectura, aumentar tamaño/peso de las fuentes, retirar títulos del
header y el punto del título inicial, usar «Reanudar partida», numerar las urnas,
agrupar opciones, mejorar ajustes, permitir repasar el tutorial y ofrecer videos al errar.

Se conserva tinta, acuarela, papel, ciruela y tipografía sin serifa. Base de texto de
18 px, títulos y controles en negrita; los ajustes conservan ampliación hasta 200 %.
No cambian reglas, probabilidades, RNG, puntuación ni formato de guardado.
U/V permanecen como identificadores internos para no romper guardados; las etiquetas
visibles de urnas, incluidos el canvas, el final y los atajos, dicen 1/2.

## Cambios

- Header con acceso a Ajustes; menú sin punto final y lema unido en una oración.
- Ajustes separados en Pantalla, Sonido y Controles, con teclado y cambios inmediatos.
- «Tarjetas» para los controles de urnas; «cartas» conserva su sentido narrativo
  cuando se refiere a la baraja del anfitrión.
- Tutorial de cuatro pasos con textos cortos, comparación, actualización de inventario,
  distinción entre decisión y suerte, y resumen desplegable al final.
- Ayuda y opciones secundarias agrupadas, con estado abierto conservado al actualizar.
- Los errores de decisión ofrecen repaso y videos externos opcionales. El azar adverso
  después de elegir bien no se presenta como un error del jugador.
- Composición compacta y datos adicionales desplegables. La ampliación de texto y las
  ayudas abiertas conservan reflujo: no se recortan controles para ocultar el scroll.

## Skills aplicadas

Leídas y aplicadas: game-ui-ux, frontend-design y webapp-testing locales.
Impeccable: `C:/Users/facub/.codex/skills/impeccable/SKILL.md`, referencias clarify,
distill y craft-floor. `context --target src/main.ts` confirmó refinamiento sobre el
diseño existente. Detector mecánico ejecutado una vez, sin hallazgos en esa revisión.
No se instalaron fuentes, motores ni dependencias nuevas. Las dependencias fijadas
se recuperaron con `npm ci --offline --ignore-scripts` desde la caché existente.

## Verificación y límites

- TypeScript y build aprobados; 41 pruebas unitarias aprobadas.
- `git diff --check` sin errores.
- HTTP desde el navegador sigue bloqueado por `ERR_NETWORK_ACCESS_DENIED`; no se cambió
  la configuración de seguridad. La entrega pública no fue actualizada.
- `scripts/build-local-check.mjs` reúne módulos y recursos públicos en una copia de prueba
  sin servidor: `.tools/clear-ui/full-dist/standalone.html`. Conserva el código de la escena
  y su RNG; sólo cambia el empaquetado y las rutas de imágenes por datos incrustados.
  La build normal de producción sigue separada.
- `scripts/check-game-local.mjs` abrió esa copia por archivo local y comprobó la escena
  real Babylon, con Chromium 1243 y SwiftShader. Vera renderizó etiquetas 1/2, selección
  y extracción guardada. Doble cargó su textura, aceptó una oferta y guardó un par de dados
  y una decisión; con movimiento reducido no se ejecuta la animación. Ada cargó su textura
  y aceptó diagnóstico y decisión sobre el archivo. Sin errores JavaScript.
- En 1366×768 y 390×844, las vistas iniciales de Doble, Ada y final no tuvieron scroll
  de página ni de panel. Se comprobó abrir/cerrar las combinaciones en celular.
  Evidencia: [campaña 3D](evidence/clear-interface/campaign-3d.json),
  [Vera 3D](evidence/clear-interface/vera-3d.json) y
  [Doble en celular](evidence/clear-interface/doble-mobile.png).
- La comprobación HTML anterior recorrió menú, ajustes, sala y tutorial de Vera en
  los mismos tamaños sin desborde de página. No se promete ausencia de scroll con
  texto al 200 %, ayudas abiertas, todos los estados de feedback o resoluciones no medidas.
  La ampliación y las ayudas conservan contenido accesible, aunque requieran reflujo.
- No se ejecutó la suite HTTP completa ni se verificó una publicación HTTPS nueva.
  La build local de prueba no verifica transporte, caché o carga de chunks en producción.
- Python de Microsoft Store rechazó ejecución; no se ejecutaron los verificadores
  documentales/matemáticos de Python. No hubo cambios en las reglas ni el núcleo matemático.
- Sin push ni publicación en esta revisión. No hay evidencia de aprendizaje, diversión,
  accesibilidad integral o rendimiento con GPU física. Los FPS de SwiftShader no son
  una medición de la GPU del usuario.

Para reproducir sin servidor, con dependencias del proyecto y Chromium disponibles:

```powershell
node scripts/build-local-check.mjs
# Opcional: PLAYWRIGHT_CHROMIUM_EXECUTABLE permite elegir un Chromium local.
node scripts/check-game-local.mjs
```

## Recursos de repaso

Se consultaron páginas primarias de Khan Academy; el juego enlaza a ellas sin copiar
sus videos ni transcripciones. Abren una pestaña nueva, avisada en el texto del enlace.

- [Introducción a la probabilidad teórica](https://es.khanacademy.org/math/cc-seventh-grade-math/cc-7th-probability-statistics/cc-7th-basic-prob/v/basic-probability)
- [Media o valor esperado](https://es.khanacademy.org/math/precalculus/x9e81a4f98389efdf:prob-comb/x9e81a4f98389efdf:expected-value/v/expected-value-of-a-discrete-random-variable)
- [Probabilidad independiente y dependiente](https://es.khanacademy.org/math/probability/probability-geometry/multiplication-rule-dependent-events/v/independent-events-1)
