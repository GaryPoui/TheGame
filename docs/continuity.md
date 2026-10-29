# Continuidad del proyecto

Actualización 2026-10-28: Ada pasa a [Las fotos tramposas](photos-redesign.md), con pregunta inicial sin puntos sobre independencia, fotos completas frente a seleccionadas y textos sencillos. Doble conserva sus reglas con consignas más simples. Las mesas mantienen el diseño anterior solicitado. Las sesiones antiguas conservan progreso y pueden empezar el álbum nuevo.


## Restauración solicitada — 2026-10-28

El usuario pidió volver la mesa a su diseño anterior. Se restauró exactamente la presentación de 2adb98e (campaña v5.2), conservando reglas, progreso y guardado. La revisión de mesas protagonistas queda como antecedente descartado.

## Mesas protagonistas — 2026-10-28

El usuario pidió centrar la atención en las mesas y agregar objetos relacionados con cada juego. Se implementa en la rama vigente `codex/complete-campaign` / PR #7: tableros amplios, consignas sobre el paño, opciones junto a objetos, personajes secundarios y bandejas/inventarios/utilería por puesto. Las tres fases del final usan objetos reales de su desafío. Ver [composición y validación](table-focus.md). Regresión local: 32 unitarias y 28 casos de navegador aprobados. La tarea externa 010/T011 sigue abierta.


## Campaña y final — 2026-10-26

Pedido vigente: completar specs restantes, preservar diseño y publicar avances por commits.
Se integró la rama Doble con las mejoras recientes de urnas, luego Ada y el anfitrión.
Rama `codex/complete-campaign`; ver [implementación y validación](campaign-implementation.md).
Esta autorización supera las restricciones históricas de una sola mesa. Las secciones
siguientes son registros de sus entregas, no el estado actual.


## Ajustes del primer juego — 2026-10-26

El usuario pidió centrarse en urnas antes de otra spec. Ver [selección y feedback](urn-feedback.md):
título Las urnas, cartas plegables, brillo sincronizado tarjeta/urna y corrección verde/roja
según la decisión anterior a extraer. Se incorporó la tipografía sin serifa del remoto
fac1368 antes de crear codex/urn-feedback. Sin cambios al RNG, reglas o esquema de guardado.


## Publicación autorizada de jugabilidad — 2026-10-23

El usuario cambió la restricción anterior y pidió «PUSHEA TODO PARA QUE ESTE EN EL PAGES».
Se autoriza subir el corte de jugabilidad y actualizar gh-pages, conservando PR #5 sin merge
automático. La sección de corte local siguiente documenta el estado previo a esta autorización.
Publicado: fuente `7b463b0`, despliegue `8e64958`, versión `urns-contracts-playability-v1`.
Pages finalizó con éxito; HTTP 200, build-info correcto y bundle público igual al compilado local.

## Jugabilidad local — 2026-10-23

El usuario pidió mejorar ritmo, explicación práctica y diseño de Vera y Doble; luego indicó
**no hacer push**. Este corte permanece local, sin commit ni publicación. Incluye fichas
contables sobre el paño, tutorial interactivo de Vera, mentor contextual, comparación antes/después,
ensayo manual de dos dados para Doble, vista de 36 casos al seleccionar y acciones móviles fijas.
Se conserva el núcleo matemático, RNG y guardado. Detalle: [jugabilidad local](playability-local.md).
La publicación anterior de Doble sigue siendo la versión pública.

## Mesa de Doble — 2026-10-23

El usuario pidió «implementa la mesa doble». El corte vigente se desarrolla en
`codex/doble-contracts`, derivado de `codex/ink-theatre`; la build pública sigue usando `gh-pages`.
Vera habilita contratos S/C/J con cuatro rondas y ocho decisiones, dados 3D, comparación opcional
1/100, ayuda finita y guardado esquema 2 compatible con urnas legado. Sellos y métodos se conservan
al practicar. El teatro de tinta y Arial sans siguen vigentes. Ada y el final están pendientes.
Detalle y evidencia: [Doble](doble-implementation.md). Se realizaron recorridos manuales y
build/typecheck; no se añadieron ni ejecutaron suites nuevas y T007/T008 siguen pendientes.
El hash de publicación se registra sólo después de subir y publicar realmente este corte.
Las secciones siguientes de entregas previas quedan como historial, no como estado vigente.

## Teatro de tinta — 2026-10-23

El usuario corrigió la dirección: referencia Cuphead más tranquila, oscuridad inicial y captor
adaptado de Gambito. Nueva rama `codex/ink-theatre`, derivada de la revisión v2. Tres assets
generados con herramienta integrada, escena híbrida pintada/3D y apertura con salto/reducción
de movimiento. Ver [dirección y validación](ink-theatre.md). La sección realista siguiente es
histórica y no define el arte vigente. Campaña posterior pendiente.


## Actualización visual — 2026-10-23

El usuario pidió mayor realismo visual. Rama de trabajo `codex/realistic-visuals` derivada de la
fuente MVP. La sala ahora usa materiales PBR y HDR locales CC0; Vera tiene cabeza anatómica,
textura facial CC0, cabello, escala y apoyo de manos revisados en cámara. Se corrigió el winding
Babylon LH que mostraba interior de rostro. Build validado, 8/8 pruebas browser aprobadas en
GitHub Pages y 137/137 archivos servidos verificados. Evidencia específica, procedencia y límites
en [mejora visual](visual-upgrade.md). La siguiente etapa es playtest humano antes de ampliar la
campaña.

## Actualización MVP — 2026-10-23

El usuario autorizó continuar hasta un MVP y hostearlo. Se implementó la mesa de urnas completa,
con sala Babylon.js, Vera, tutorial preparado, cuatro rondas, ayuda finita, guardado validado y
ajustes/atajos reasignables. Código en `codex/playable-mvp`; sitio https://garypoui.github.io/TheGame/.
PR del MVP: https://github.com/GaryPoui/TheGame/pull/2, sin merge. Fuente `52bc021`, despliegue `c1db9d9`.
Ver [alcance](mvp-scope.md), [validación](mvp-validation.md), [despliegue](deployment.md) y delivery.json.
El objetivo siguiente es prueba humana de esta mesa antes de desarrollar contratos/registros/final.
Los apartados siguientes conservan la entrega documental inicial y sus evidencias históricas.

Proyecto: [GaryPoui/TheGame](https://github.com/GaryPoui/TheGame).
Rama de entrega: `codex/research-specs-skills`. Base: `main` con README mínimo al comenzar.
La investigación comenzó el 2026-10-22 y la auditoría de skills continuó el 2026-10-23,
America/Buenos_Aires. Los documentos conservan su fecha de consulta, no una fecha única ficticia.

## Hecho realmente

- Se leyó y conservó íntegro [el prompt](original-prompt.md), incluidas ampliaciones visuales.
- Se verificaron repo, rama, árbol limpio inicial, Git y acceso GitHub; no se guardaron credenciales.
- Se investigaron fuentes primarias y se distinguieron hechos, propuestas e hipótesis.
- Se instalaron 17 skills portables auditadas con commits, licencias, referencias y reinstalación.
- Se instaló Specify CLI 1.2.3 y se ejecutó init real con integración Codex y PowerShell.
- Se aplicó el flujo documental, constitución 1.0.0 y diez specs con planes/tareas/checklists.
- Se fijaron paquetes estables consultados al registro y se generó lockfile sin scripts de paquetes.
- Se documentaron diseño, narrativa, matemáticas, arte, UI, arquitectura, validación y riesgos.
- Se verificaron matemáticas del diseño con enumeración exacta y se revisaron contradicciones.

## Propuesto, sin implementar

Título La Casa del Azar, campaña 30–45 min, urnas/contratos/registros/final. Babylon.js 9.32.0,
TypeScript 7.0.2, Vite 8.3.5; guardado local, RNG reproducible y HTML/CSS. Los paquetes están
resueltos en lockfile, no probados como aplicación integrada. No existen src, build, juego jugable,
GLB, sonidos, screenshots de juego, perfiles de GPU ni estudio educativo. Ninguna tarea de
implementación está marcada como terminada.

## Evidencia disponible

- `docs/evidence/specify-init.txt`, version/integration y spec-workflow: instalación y scripts reales.
- `docs/evidence/skills-install.json`, skills-verify: instalación, archivos, licencias y hashes.
- `docs/evidence/math-verification.json`: comprobaciones exactas del diseño, no del runtime.
- `docs/evidence/npm-versions.json`: versiones, licencias e integridad consultadas.
- `docs/evidence/docs-verification.json`: estructura, enlaces locales y pins/lock.
- `docs/evidence/clone-verification.json`: cinco verificaciones aprobadas desde clon limpio con
  autocrlf de Windows, incluyendo integridad Spec Kit y selección de feature local.
- [Análisis](consistency-analysis.md): revisión semántica, hallazgos y correcciones.

## Preparar otro equipo

1. Clonar repo y hacer checkout de la rama/commit de esta entrega; no depende del historial del chat.
2. Leer README, AGENTS, constitución y educational-design.
3. Python 3.11+: `python scripts/skills.py verify`. Las skills ya están en el clon;
   si faltan carpetas usar `python scripts/skills.py install` y verificar de nuevo.
4. Para CLI Spec Kit: `python -m pip install --user uv`, luego
   `python -m uv tool install specify-cli==1.2.3`; agregar su bin a PATH o usar ruta devuelta.
   No volver a inicializar encima de documentos existentes. Seleccionar 001 creando el puntero
   local .specify/feature.json con el comando de [procedimiento](spec-kit.md).
5. Ejecutar `python scripts/verify-math.py` y `python scripts/verify-docs.py`.
6. Node >=22.12: cuando se autorice implementar, `npm ci`; preparar scripts y tsconfig en 001.
   Instalar browser de Playwright sólo al comenzar pruebas reales; no afirmar cobertura ahora.

Auxiliares opcionales pendientes: Blender >=4.2 identificado, entorno Python Playwright y Pillow
compatible con auxiliares raster. No bloquean lectura de skills ni documentación. Instalada no
significa cargada: catálogo puede requerir próximo turno/nueva sesión; archivos fueron leídos
directamente para aplicar instrucciones. Detalles y riesgos de scripts en docs/skills.md.

## Siguiente paso original de la fase documental (ya autorizado y ejecutado en el MVP)

La instrucción posterior de implementación llegó el 2026-10-23. El plan original era: Empezar por 001, luego cámara 002, runner 004,
contratos/checkpoints mínimos de 009 y tokens/presupuestos de 010; construir 005 completa en sala
simple con un asistente. Revisar legibilidad, matemáticas, reanudación y experiencia antes de
003/006/007/008 y arte de campaña. No empezar produciendo todos los personajes.

## Publicación y enlaces de entrega

Commit de contenido: `2e9ea08adba152c547e59ff9ad3078a96d1ec834`.
PR publicado: https://github.com/GaryPoui/TheGame/pull/1 (sin merge).
El commit y enlaces definitivos están registrados en `delivery.json` en la raíz.
Ese registro identifica el commit de contenido; su propio commit de registro será posterior
para evitar una referencia de hash a sí mismo. El historial Git y el PR permiten recuperar ambos.
No hay deployment ni juego público en esta fase. Nunca hacer force push ni merge no solicitado.

Instantánea antigua: [chat compartido previo](https://chatgpt.com/s/cx_6adacb1e19ec8191882cff4f7533f6db).
No se verificó su contenido y no se usa como autoridad. Se generó una instantánea nueva pública:
https://chatgpt.com/s/cx_6adad17a40b481919db1688aa8ed27b9, también en delivery.json. Es una captura
durante el cierre, no un enlace que se actualiza solo con mensajes posteriores. La continuidad
completa y las decisiones posteriores a Babylon.js están en este repositorio.
## Cierre de la revisión de tinta

Publicación v3 comprobada: fuente `4ec4109`, deployment `ff872d5`, PR
https://github.com/GaryPoui/TheGame/pull/4. 11/11 pruebas públicas y 123/123 archivos por hash.
El usuario pidió subir el avance y el cierre al repositorio: avance en `ba95833` y registro
final en el commit siguiente. Fuente y documentación en `codex/ink-theatre`. Próximo trabajo:
revisión humana de la dirección visual y actuaciones por estados antes de ampliar campaña.


Cierre de ajustes de urnas (2026-10-26): fuente 29c4148, deployment 1e6bfd4, PR #6.
14/14 pruebas públicas y 138/138 archivos verificados; detalle en docs/urn-feedback.md.
La siguiente spec no se inició. Se conserva el progreso y el régimen matemático del MVP.

Cierre de campaña 2026-10-27: v5.2, fuente 93c7e42, deployment 8ea9003, PR #7. Las tres mesas y el final están publicados, con 32 unitarias, 24 recorridos públicos y 143 hashes correctos. Pendiente real: 010/T011, validación humana y con hardware/red representativos. Ver docs/campaign-implementation.md y delivery.json.

Cierre de mesas 2026-10-28: fuente d9c4f82, deployment b264adc, versión table-focus-v6. Publicados y comprobados 143 hashes y 7 recorridos HTTPS; 28 casos completos locales. Detalle en docs/table-focus.md y delivery.json.

Restauración publicada y verificada: table-layout-restored-v6.1, fuente d314eb9, deployment a10c692. Build y 32 unitarias aprobadas; 3/3 casos públicos de urnas y 143/143 hashes correctos. Evidencia en docs/evidence/table-restore/.

Fotos publicadas 2026-10-28: photos-and-clear-dice-v7.1, fuente 99a7086, deployment fe040aa. 37 unitarias, 26 recorridos HTTPS y 143 hashes correctos; 67 referencias matemáticas. Guardado v4 compatible con v1–3 y sesiones antiguas de Ada. Ver docs/photos-redesign.md y delivery.json.


Actualización 2026-10-28: [personajes y desafíos](character-challenge-update.md) amplía Ada nueva a comparación de proporciones y probabilidad conjunta, simplifica Doble y elimina pistas calculadas del final independiente. Diálogos de cuerpo completo, guardado v5 compatible con v1–4.


Revisión de carteles y diálogo 2026-10-28: acción principal amplia, utilidades separadas, historial por intervenciones y modales con cabecera clara. Reglas y progreso conservados. Ver [cambio y evidencia](dialogue-polish.md).


Corrección 2026-10-28: cuerpo completo sólo en diálogos; durante partidas, personajes detrás de sus mesas, sin duplicados en el cuaderno. Tutorial de Vera integrado a las mismas cartas, selección y extracción de la partida normal, con resultados preparados sin alterar progreso/RNG. Ver [detalle y evidencia](table-tutorial.md).

Revisión de Doble 2026-10-28: tres ofertas compactas antes de los dados, con gráficos de los pares que pagan y explicación de órdenes inversos. Texto ampliado puede crecer verticalmente. Reglas intactas. Ver [detalle y evidencia](dice-combinations.md).
