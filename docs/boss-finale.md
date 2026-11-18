# Ada pulida y duelo final combinado

Pedido del 13 de noviembre de 2026. Un único alcance de implementación y revisión.
Se mantiene la identidad de tinta, colores, fuentes sin serifa y controles de mouse.
No se añaden dependencias, assets externos ni cambios de motor.

## Alcance y aceptación

- Ada: mostrar las cinco cartas que deciden cada mano, distinguir acierto de victoria,
  destacar la quinta comunitaria y reducir opciones imposibles. Conservar puntuación,
  cartas ocultas, meta de 24 y guardados anteriores.
- Mesa IV: un duelo contra el anfitrión con 36 de resistencia y seis defensas del
  jugador. Cada ciclo combina urnas, contratos de dados y predicción de póker.
  El orden rota con una variante reproducible; los objetivos cambian entre ciclos.
- Urnas: elegir por proporción y extraer dos veces sin reposición. Una ficha favorable carga
  el combo. Dados: elegir según el objetivo, tirar una vez; un pago favorable carga
  el combo. Póker: anunciar categoría, revelar quinta carta y comparar manos.
- Cada lectura óptima causa dos de daño, independientemente de la suerte. En póker,
  acertar y superar al rival añade el premio de esa mano más la carga acumulada; la carga se consume.
  Una elección inferior consume una defensa; un mal resultado aleatorio no la consume.
  No hay temporizador ni pérdida de sellos o libertad al practicar.
- Al agotar defensas o seis ciclos sin derrotarlo se ofrece reintentar o continuar
  con ayuda. La ayuda exige tres decisiones óptimas, una de cada mecánica, y abre
  la puerta con etiqueta de ayuda; no modifica los puntos de Ada.
- Todos los cambios y resultados se guardan antes de presentarlos. Rechazar comandos
  duplicados y alteraciones de RNG, vida, carga o resultados. Conservar finales antiguos
  con un cambio voluntario al nuevo jefe. Versionar guardado y replay.
- Verificar límites superior e inferior de controles, cartas y marcadores en PC a
  1024 × 640 y 1280 × 720, texto normal/ampliado; revisar también vista estrecha.
  Completar duelo, derrota/ayuda, recarga, progreso y epílogo en pruebas reales.

## Dirección

Se conserva el paño verde, papel crema, tinta ciruela y acento dorado. El duelo da
protagonismo al retrato existente del anfitrión, barra de resistencia y objetos en la
mesa. Un panel lateral contiene únicamente la decisión actual; reglas en modal.
La secuencia y el combo hacen visible la relación entre mecánicas, sin añadir otros menús.

Guías aplicadas: game-designer, game-ui-ux, frontend-design, game-ai, save-systems
y webapp-testing bajo `.createapp/POLICY.md`, en una sola sesión y usando los runners
existentes. Matemática y reglas de póker reutilizan los módulos ya comprobados.

## Validación y entrega

Build y TypeScript aprobados; 60 unitarias, con enumeración de 2.598.960 manos
de cinco cartas y oráculo de siete cartas heredados. Siete casos iniciales de
navegador aprobaron a 1280 × 720, 1024 × 640, 390 × 844, texto normal/ampliado;
cuatro casos finales revalidaron la escena real con el anfitrión, derrota/ayuda y
duelo independiente completo con libertad conservada al repetir. Se corrigió la
visibilidad del canvas heredada del final anterior; DOM solo no se tomó como prueba
de escena válida. No se afirma diversión,
aprendizaje, rendimiento o accesibilidad integral a partir de las pruebas automáticas.

La puntuación de Ada no cambió. El nuevo jefe usa guardado v8 / campaign-boss-v8,
con lectura v1–7. Los finales anteriores mantienen su reductor y ofrecen empezar
el jefe nuevo; el paso es voluntario y no borra sellos ni libertad.

Revisión consolidada de entradas, guardado y UI: los comandos y selecciones se
validan en el reductor, las propiedades de salud/carga se reconstruyen por replay,
no hay datos enviados ni nuevas dependencias. Se aplicaron también ca-security y
ca-web-review, consultando sus fuentes fijadas bajo las excepciones de POLICY.md.

Cierre local: nueve casos distintos cubiertos; el último bloque de cuatro aprobó
el encuadre, texto al 200 %, resultado de Ada y alternativa sin WebGL. La escena
comparte la mesa original y la textura del anfitrión; hay imagen y paño HTML si
falla WebGL. Se verifican límites superior/inferior, reglas en modal, cartas ocultas,
recarga, victoria independiente, salida asistida y libertad conservada al repetir.

Resultados: [unitarias](evidence/boss-finale/unit-tests.txt),
[primer recorrido](evidence/boss-finale/local-browser.txt),
[final completo](evidence/boss-finale/final-browser.txt) y
[acabado y alternativa HTML](evidence/boss-finale/polish-browser.txt).
Chrome headless de escritorio en Windows; estas pruebas no son una medición de GPU.
La spec activa no estaba disponible en `.specify/feature.json`; no se dedujo de Git
ni se marcaron pendientes documentales como gameplay completado.

## Publicación

Versión `boss-finale-2026-11-13`, fuente `577f191`, rama `codex/boss-finale`.
La rama estática `gh-pages` quedó en `fe1bde7`. Los 146 archivos publicados
coinciden por SHA-256 con la build revisada.

La creación de PR se intentó por el conector (403, sin permiso de la integración)
y por la sesión normal del navegador (sin respuesta). No se extrajeron credenciales
ni se fusionaron ramas. [Comparación preparada para revisión](https://github.com/GaryPoui/TheGame/compare/codex%2Fcomplete-campaign...codex%2Fboss-finale).
La publicación de Pages y la rama de código no dependen de crear ese PR.

Tres casos públicos por la alternativa HTML aprobaron: resultado de Ada al 200 %,
duelo independiente completo con libertad conservada y controles sin WebGL.
El recorrido público 3D agotó 180 segundos durante un clic y la limpieza del contexto
también se demoró; se interrumpió el resto de ese bloque. No se afirma que el recorrido
3D público haya aprobado. La escena 3D se verificó localmente y la captura pública
muestra al anfitrión y la mesa. La alternativa se ejecutó con GPU desactivada en
el navegador de prueba, sin cambiar el código publicado.

Evidencia: [integridad pública](evidence/boss-finale/public-integrity.json),
[recorrido público HTML](evidence/boss-finale/public-html-browser.txt) y
[recorrido 3D interrumpido](evidence/boss-finale/public-3d-interrupted.txt).
