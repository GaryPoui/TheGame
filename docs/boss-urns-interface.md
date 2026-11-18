# Urnas compartidas y acabado de combate

Pedido: usar las mismas Urna 1 y Urna 2 del nivel 1 en el nivel 4, publicar y seguir
mejorando la interfaz. Se mantienen reglas, cantidades variables del jefe, puntos,
RNG y guardado v8. No se cambia el reparto del nivel 1 ni se añaden dependencias.

La escena final reutiliza los modelos existentes: cristal torneado, base de latón,
placas 1/2, fichas triangulares y circulares, aros y selección luminosa. Los modelos
se habilitan sólo en la fase de urnas. La selección por clic pasa por el mismo
callback que Vera y no extrae fichas hasta confirmar. Las tarjetas de ambos niveles
comparten ahora `src/ui/urn-choice.ts`; se conserva su contenido y estados de Vera.
La alternativa HTML sigue disponible si falta WebGL, sin superponer dibujos al cristal.

La interfaz de combate usa el marco de tinta y latón de los menús, botón principal
dorado, cabecera de turno/extracción y seis indicadores de defensas y carga. El orden
de los ataques se muestra tal como se jugará. Ada comparte el marco de combate.
Se conserva una tipografía sin serifa y las explicaciones se abren en ventanas.

Guías aplicadas: game-ui-ux, frontend-design y webapp-testing bajo las excepciones
de `.createapp/POLICY.md`, en una sola sesión y con Playwright TypeScript existente.
Revisión final de UI según ca-web-review y su fuente ya consultada. No se afirma
accesibilidad integral, diversión, aprendizaje o rendimiento a partir de estas pruebas.

## Validación

Build y TypeScript; 60 unitarias aprobadas. La prueba histórica de replay de cartas
agotó inicialmente cinco segundos mientras se ejecutaba el navegador: se fijó su
presupuesto explícito en 20 segundos, conservando todas las aserciones.

Las comprobaciones de navegador verifican dos recipientes y fichas reales, selección
por clic sobre el cristal, selección por tarjeta, aro luminoso, RNG sin cambios al
seleccionar, extracción única, recuento sin reposición y funcionamiento de Vera.
Se probaron 1280 × 720, 1024 × 640 al 200 % y 390 × 844, además del resultado de
Ada ampliado y alternativa sin WebGL. Se corrigieron la intercepción del clic por
una regla CSS y el botón fuera de pantalla con texto ampliado. Una consulta inicial
de métricas se adelantó a la carga 3D; el test espera ahora su señal de disponibilidad.

Resultados y capturas en `docs/evidence/boss-urns/`. La presentación fue inspeccionada
en el canvas, además de las verificaciones del DOM. Equipo de prueba: Chrome headless
de escritorio en Windows, con movimiento reducido; no es una medición de GPU.

Cierre local: seis casos distintos cubiertos, con tres aprobados en el bloque de
corrección y el caso de 1280 × 720 aprobado tras esperar la carga de la escena.
Las aserciones originales de límites y selección se conservaron. Evidencia:
[primer bloque](evidence/boss-urns/local-browser.txt),
[correcciones](evidence/boss-urns/correction-browser.txt),
[carga y clic directo](evidence/boss-urns/ready-browser.txt) y
[unitarias](evidence/boss-urns/unit-tests.txt).

## Publicación

Publicada `boss-urns-ui-2026-11-13`, fuente `040afe5`, gh-pages `71d0a82`.
El caso HTTPS de 1280 × 720 aprobó con el canvas real y clic sobre la urna: dos
recipientes visibles, selección luminosa, tarjetas compartidas y recuento conservado.
Los 146 archivos coinciden por SHA-256. La primera comprobación se adelantó a la
propagación de Pages; después, un 503 temporal del shader se repitió y coincidió.

Evidencia: [navegador público](evidence/boss-urns/public-browser.txt),
[integridad](evidence/boss-urns/public-integrity.json) y
[captura pública](evidence/boss-urns/public/boss-urns-1280-1.png).
El conector de GitHub siguió devolviendo 403 para crear PR; la rama existente
`codex/boss-finale` y su comparación conservan el trabajo sin merge.
