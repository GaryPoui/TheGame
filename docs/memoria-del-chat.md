# Memoria compartible del proyecto y del chat

**Proyecto:** La Casa del Azar / TheGame. **Corte:** 23 de octubre de 2026.
Este documento resume el trabajo y las decisiones de esta conversación; no es una
transcripción literal. Puede compartirse con otra persona o usarse como contexto en otro chat.

## 1. Enlaces para empezar

- Juego: [La Casa del Azar](https://garypoui.github.io/TheGame/).
- Repositorio: [GaryPoui/TheGame](https://github.com/GaryPoui/TheGame).
- Rama vigente: `codex/ink-theatre`.
- Revisión vigente: [PR #4](https://github.com/GaryPoui/TheGame/pull/4), abierto y sin merge al preparar esta memoria.
- [README de la rama vigente](https://github.com/GaryPoui/TheGame/blob/codex/ink-theatre/README.md).
- [Dirección visual y evidencia v3](https://github.com/GaryPoui/TheGame/blob/codex/ink-theatre/docs/ink-theatre.md).

Para ver la apertura a oscuras, elegir **Nueva partida**. Retomar conserva el progreso anterior.
El juego publicado no requiere cuentas ni instalación.

## 2. Pedido original y evolución de las instrucciones

El usuario pidió trabajar como un equipo coordinado de producción, diseño, programación,
narrativa, arte técnico, diseño educativo y QA para preparar y desarrollar un videojuego
pequeño sobre probabilidad y estadística. Dio prioridad a investigar, instalar skills útiles
y documentar cada aspecto antes de implementar. El [prompt íntegro](original-prompt.md) se
conserva en el repositorio.

La autorización inicial abarcaba investigación y documentación. Luego el usuario pidió
continuar hasta un MVP, hostearlo y subir tanto avances como resultados finales al repositorio.
La fase de implementación y publicación quedó expresamente autorizada.

La dirección visual evolucionó así:

1. Primer MVP: escenario y personajes simples para tener una mesa completa jugable.
2. El usuario pidió menos caricatura y más realismo. Se produjo una revisión con materiales
   fotografiados, HDR y rostro anatómico.
3. El usuario aclaró que esa versión era demasiado realista y pidió discutir el rumbo.
4. Finalmente eligió una estética similar a **Cuphead**, más tranquila, con un inicio tétrico:
   luces apagadas y aparición del captor. Solicitó que el villano fuera provisionalmente una
   adaptación de **Gambito de Marvel**, y aportó tres imágenes de referencia.

**La última instrucción prevalece.** La versión realista se conserva como historia y evidencia,
pero no define el arte vigente. No volver a llevar los personajes al fotorrealismo por basarse
en documentos antiguos.

## 3. Concepto y campaña prevista

El protagonista es secuestrado y despierta en una casa de juegos. El anfitrión propone ganar
su libertad superando a tres asistentes y finalmente enfrentándolo en una partida de mesa.
El tono combina misterio, tensión y humor oscuro moderado, sin violencia gráfica.

Personajes y conceptos previstos:

- **Vera:** urnas, eventos, probabilidades, complemento y actualización del inventario.
- **Doble:** dados, contratos, valor esperado y variabilidad.
- **Ada:** registros, frecuencias, media, dispersión, muestras y sesgo.
- **Anfitrión/captor:** final que combina lo aprendido, sin introducir combate físico.

La campaña completa tiene una duración objetivo de 30–45 minutos, todavía sin validar.
El MVP actual **no equivale a esa campaña ni tiene esa duración**. Se priorizó terminar una
mesa antes de producir todos los escenarios y personajes.

## 4. Investigación, skills y especificaciones realizadas

Se investigaron fuentes primarias y se documentaron decisiones técnicas, educativas y de
producción. Las fuentes y fechas están en [investigación técnica](research.md) y
[investigación educativa](research-education.md). Se distinguieron hechos, propuestas e
hipótesis pendientes de probar con jugadores.

Se instalaron **17 skills portables** en `.agents/skills`, con fuentes, commits, licencias,
archivos auxiliares y verificación reproducible. Cubren diseño de juego, arte, interfaz,
cámaras, input, audio, narrativa, IA, guardado, niveles, rendimiento, shaders, prototipado,
pruebas web y Blender. El catálogo exacto y los motivos están en [skills](skills.md) y en
`skills-manifest.json`. El verificador comprueba **92 archivos**. Instalar una skill no implica
haberla aplicado ni haber ejecutado sus herramientas opcionales.

Se descartó el router upstream porque no reconoce Babylon.js. Los ejemplos de otros motores
sirven como conceptos; las APIs se resuelven con documentación oficial de Babylon.

Se instaló **Specify CLI 1.2.3** y se ejecutó una inicialización real con integración Codex y
PowerShell. Se generaron constitución y diez especificaciones con planes, tareas y documentos
asociados. También existen diez skills generadas por Spec Kit. Ver [procedimiento](spec-kit.md)
y [especificaciones](../specs/README.md).

Los diez cortes abarcan: base web; cámara e interacción; introducción y sala; diálogo y tutorial;
urnas; contratos; registros; final; progreso y guardado; calidad y publicación. Los documentos
no prueban que todos esos sistemas estén implementados. Quedan tareas abiertas.

## 5. Tecnología y reglas de trabajo

- Babylon.js **9.32.0**, TypeScript **7.0.2**, Vite **8.3.5**.
- Vitest **5.0.5**, Playwright **1.64.1**. Versiones fijadas en package y lockfile.
- Navegador de escritorio, teclado y mouse; WebGL como base.
- Núcleo matemático separado de la presentación; RNG inyectable y guardado local versionado.
- Interfaz HTML/CSS superpuesta a Babylon. Sin backend, cuentas ni multijugador.
- Hosting estático HTTPS en GitHub Pages, rama `gh-pages`.

Reglas centrales: reconocer la calidad de una decisión por separado del resultado aleatorio;
no cambiar probabilidades ocultamente ni consultar el futuro del RNG; una buena decisión no
garantiza una extracción favorable. La práctica guiada permite continuar sin depender de
suerte favorable. No hay dinero real ni decisiones educativas con tiempo obligatorio.

Antes de trabajar, leer `AGENTS.md`, README, continuidad, prompt original y constitución.
La spec activa se consulta en `.specify/feature.json`, no se deduce de la rama. Revisar cambios,
secretos y licencias antes de subir; no forzar Git, perder archivos ni fusionar PR automáticamente.

## 6. Qué está implementado realmente

El MVP incluye menú, introducción breve, selector de sala y **mesa de urnas completa**:

- Tutorial preparado y señalado como demostración.
- Cuatro rondas con extracciones con y sin reposición.
- Inventarios visibles, fracciones, símbolos y explicación de los resultados.
- Méritos por decisiones y fichas obtenidas por azar, registrados por separado.
- Práctica asistida finita si el desempeño no alcanza el objetivo.
- Final del primer capítulo y opción de volver a practicar.
- Guardado y reanudación, validación de datos guardados y recuperación ante guardado inválido.
- Ayuda, pausa, volumen, texto ajustable, movimiento reducido y atajos reasignables.
- Controles HTML que permiten jugar incluso si no se inicia WebGL.

No están terminadas las mesas de contratos y registros, el enfrentamiento final, la calle
caminable ni la campaña completa. La sala del MVP se recorre mediante selección de mesa;
no es todavía exploración libre en primera persona.

## 7. Arte y apertura vigentes: Teatro de tinta v3

Se eligió tinta y acuarela de animación de los años treinta, con contornos oscuros cálidos,
formas curvas y paleta de marfil, ocre, nogal, ciruela y verde salvia. Violeta para la carta del
captor; rojo/triángulo y azul/círculo conservan sus funciones educativas.

Se generaron tres ilustraciones con la herramienta integrada de generación de imágenes:

- `public/art/captor-v3.png`: captor de abrigo largo, cabello levantado, guantes y carta violeta,
  adaptado de las referencias de Gambito.
- `public/art/parlour-v3.png`: salón pintado, cortinas, ventanas nocturnas y lámpara cálida.
- `public/art/vera-v3.png`: Vera ilustrada con chaleco y cabello ondulado.

El fondo y el captor usan capas HTML; Vera es un plano con alpha dentro de Babylon. Mesa,
urnas y fichas siguen siendo objetos 3D interactivos, con materiales mates y contornos.
Prompts completos, dimensiones, hashes y procedencia: [manifiesto de arte](ink-assets.json).
Las ilustraciones no se declaran CC0; el captor es una adaptación de un personaje de terceros.
Las imágenes de referencia no se redistribuyeron. La revisión realista mantiene sus atribuciones
históricas de MakeHuman, OnlyTheGhosts y Poly Haven.

Secuencia implementada:

1. Nueva partida: corte a negro, captor oculto y narración breve; se puede omitir.
2. A los 1800 ms aparece el captor con su carta.
3. A los 3300 ms comienza un fundido de 1200 ms para encender la sala.
4. Diálogos a ritmo del jugador; el anfitrión explica la liberación de grilletes y la puerta
   cerrada. Cuando habla Vera cambia el retrato.

Movimiento reducido abrevia los tiempos a 200/400 ms y elimina fundido y balanceo. El mute
suprime el tono de aparición. Omitir cancela temporizadores y evita cambios tardíos de pantalla.
Los personajes son ilustraciones estáticas con movimiento de composición; **no hay todavía
animación tradicional cuadro a cuadro ni lip sync**.

## 8. Validación y publicación registradas

La revisión v3 se publicó como `urns-mvp-ink-v3`. Las verificaciones registradas al cierre fueron:

- Build y comprobación de tipos aprobadas; **15/15 pruebas unitarias**.
- **64 verificaciones matemáticas** y **92 archivos de skills** comprobados.
- **11/11 pruebas de navegador sobre el sitio público**.
- **123/123 archivos públicos** coincidentes por SHA-256 con la build.
- Capturas de escritorio 1440 × 900, texto al 200 % y pantalla angosta de 390 px.
- Captura de revisión sin errores JS, solicitudes fallidas ni recursos externos.

Las pruebas cubren oscuridad, aparición, reducción de movimiento, salto, partida completa,
reanudación, ayuda, ajustes, atajos y fallback sin WebGL. Evidencia en `docs/evidence/ink`.
Son resultados de esa entrega, no garantía de ausencia de errores futuros.

El navegador automatizado usó **SwiftShader por software**: sus FPS no representan rendimiento
de GPU real. Tampoco se demostró aprendizaje, diversión ni accesibilidad integral mediante
estas pruebas; falta evaluación humana.

Fuente de la build pública: `4ec4109a4a173e3935d955e740ddd78b66904a5e`.
Commit del deployment: `ff872d5b12bca0f2e757e46d68c11711e95ee2fd`.
Último commit previo a esta memoria: `d05f841b9d06b4f9cb4b2612392e21993b93bd70`.
Los commits documentales posteriores no alteran la build publicada. Detalles en `delivery.json`.

Historial de entregas: [PR #1, investigación](https://github.com/GaryPoui/TheGame/pull/1),
[PR #2, MVP](https://github.com/GaryPoui/TheGame/pull/2),
[PR #3, realismo histórico](https://github.com/GaryPoui/TheGame/pull/3) y
[PR #4, dirección vigente](https://github.com/GaryPoui/TheGame/pull/4).

## 9. Cómo continuar sin este chat

La carpeta local de trabajo usada fue `C:/Users/TomyG/Downloads/TheGame`.
Para otra máquina: clonar el repositorio, abrir la rama `codex/ink-theatre`, leer las fuentes de
verdad y conservar los cambios existentes. Node requerido por el proyecto: >=22.12.0; Python
3.11+ para los verificadores. No hace falta instalar otro motor para continuar el MVP.

```powershell
npm ci
python scripts/skills.py verify
python scripts/verify-math.py
python scripts/verify-docs.py
npm test
npm run build
npm run preview
```

Con preview activo, ejecutar `npm run test:browser` en otra terminal. Revisar el puerto real;
por defecto se espera 4173 y puede configurarse `PLAYWRIGHT_BASE_URL`. Para no pisar capturas
históricas, usar `EVIDENCE_DIR` con una carpeta nueva. Las pruebas de introducción usan la
carpeta de evidencia de tinta. Chromium de Playwright debe estar disponible.

La publicación está descrita en [deployment](deployment.md). El script conserva la historia
de `gh-pages`; no requiere merge a main. Herramientas Blender/Python opcionales que no se
usaron en este flujo siguen pendientes de preparación específica, no bloquean el MVP actual.

Orden recomendado de continuación:

1. Revisar con el usuario la nueva dirección visual en el juego, especialmente captor y tono.
2. Hacer un playtest humano de la mesa: comprensión, legibilidad, duración y claridad del feedback.
3. Ajustar arte y actuación; desarrollar estados de personaje con una familia visual coherente.
4. Implementar contratos, después registros y finalmente captor/final, siguiendo las specs.
5. Actualizar documentos y evidencia; subir avances y cierre al repositorio y publicar builds validadas.

No interpretar esta lista como una afirmación de trabajo ya completado ni como aprobación
anticipada de nuevas compras, servicios pagos o merges.

## 10. Texto de contexto para pegar en otro chat

Estoy continuando TheGame / La Casa del Azar, repositorio GaryPoui/TheGame, rama vigente
codex/ink-theatre. Ya hay un MVP de urnas publicado en https://garypoui.github.io/TheGame/.
Leé AGENTS.md, README, docs/memoria-del-chat.md, docs/continuity.md, docs/original-prompt.md,
la constitución y delivery.json antes de modificar archivos. La investigación, instalación de
skills y documentación inicial ya se realizaron: verificá lo existente y evitá reiniciar el
proyecto. La estética vigente es tinta y acuarela de los años treinta, similar a Cuphead pero
más tranquila, con inicio a oscuras y captor provisional adaptado de Gambito según referencias
del usuario. La versión fotorrealista es histórica. El juego conserva una mesa 3D interactiva;
contratos, registros y final siguen pendientes. Respetá las reglas educativas, RNG y guardados.
Hay autorización previa para el MVP, su hosting y subir avances y cierre al repositorio; no
hagas merge automático ni force push. Distinguí siempre lo implementado de lo propuesto.
Consultame el objetivo concreto siguiente si no está incluido en mi nuevo mensaje.

## 11. Continuidad en esta máquina y tipografía (23/10/2026)

El usuario confirmó que el repositorio actual es GaryPoui/TheGame. Se descargó la rama
`codex/ink-theatre` desde `3c5c905`; se leyó esta memoria como contexto vigente, sustituyendo
las suposiciones del proyecto anterior JuegoFiore. La copia de trabajo está en
`C:/Users/facub/Documents/JuegoFiore/TheGame`. No se borraron historiales ni bases globales de Codex.

La rama `gh-pages` contiene la build publicada, con `build-info.json` que identifica fuente
`4ec4109` y versión `urns-mvp-ink-v3`. La fuente vigente y la rama de publicación son distintas;
`main` conserva el README inicial y no contiene el juego actual.

Pedido actual: quitar la serifa a todos los textos. Se unifica HTML/CSS en Arial/Helvetica/sans-serif
mediante `--font-ui`, se cambian los rótulos generados en canvas y se actualizan los créditos y
la procedencia tipográfica actual. Se preservan arte, reglas, RNG y guardados.
La validación histórica de las secciones anteriores corresponde a su entrega original.

## Publicación tipográfica — 23/10/2026

La invitación de GaryPoui a bula393 estaba pendiente; se aceptó y GitHub confirmó push access.
Fuente subida: `da2de6d4ac921feddfcd76424719f28d32499ac2` en `codex/ink-theatre`.
Build publicada: `d10ae4aafa5ec57ea5e693a50fa9969be9d76fe4` en `gh-pages`,
versión `urns-mvp-ink-v3-sans`. Los jobs build, deploy y report-build-status finalizaron con éxito:
https://github.com/GaryPoui/TheGame/actions/runs/39947942329.

Comprobación manual en https://garypoui.github.io/TheGame/: menú con fuentes computadas
Arial/Helvetica/sans-serif y hoja `index-C7ohENi8.css`; Retomar abrió el cierre del capítulo
con el progreso existente (8/8 decisiones y 5 fichas), sin reiniciarlo. Consola sin errores
capturados. Captura pública: `docs/evidence/sans/public-menu.png` desde la raíz del repo.
La revisión local previa cubrió tutorial y mesa, incluyendo los rótulos canvas.
No se repitieron las suites automatizadas de gameplay en esta publicación tipográfica.


## 12. Revisión del primer juego — 26/10/2026

El usuario pidió arreglar urnas antes de la siguiente spec: título Las urnas, brillo
sincronizado en urna/tarjeta, cartas ocultas con botón y respuestas verdes/rojas al comprobar,
con explicaciones más simples. Rama de revisión codex/urn-feedback sobre fac1368, PR #6.
Se conserva la tipografía sin serifa de bula393 y no se integra codex/doble-contracts.
Ver [alcance y evidencia](urn-feedback.md); la corrección usa probabilidades antes de extraer,
ambas cartas quedan verdes en empate y una buena decisión conserva verde aunque salga otro color.

## 12. Implementación de Doble — 23/10/2026

Pedido directo: «implementa la mesa doble». Rama del corte `codex/doble-contracts` sobre la
fuente de tinta. Doble ya tiene tutorial preparado, personaje SVG original, dados 3D, contratos
S/C/J, cuatro rondas con dos decisiones, segunda orden hipotética sin tirada, cuadrícula de
36 pares y simulación separada de 1/100 tiradas. El sello se obtiene con 6/8 o completando dos
microescenarios guiados; saldo negativo no bloquea ni quita méritos. Repetición cambia el
umbral de transferencia a 20 y conserva sellos y su método. El guardado compartido usa esquema
2 con aceptación del esquema legado 1; el resultado revelado no se vuelve a sortear al cargar.

Se conserva el teatro de tinta y toda la tipografía sans vigente. Ada y anfitrión/final no están
implementados por este pedido. Evidencia y límites en [doble-implementation](doble-implementation.md):
recorridos manuales, build/typecheck, sin nuevas suites automatizadas ni afirmación de aprendizaje
validado. T007/T008 de 006 quedan pendientes. El estado de publicación y sus hashes se agregan
únicamente después de confirmar el push y el despliegue; no inferirlos de esta nota.

## Publicación verificada de Doble — 23/10/2026

- Fuente: `0c039791eb9e07840cf57584ed803239db0d71c7`, rama `codex/doble-contracts`.
- Revisión abierta: https://github.com/GaryPoui/TheGame/pull/5, base `codex/ink-theatre`, sin merge automático.
- Build estática: `a5a1977f5125f0e213aaf6a43dc28620735497b1`, rama `gh-pages`, versión `urns-contracts-v1`.
- GitHub Pages terminó con éxito: https://github.com/GaryPoui/TheGame/actions/runs/39951468045.
- Juego: https://garypoui.github.io/TheGame/.

Comprobación pública: el guardado anterior abrió Vera completada con 8/8 y 5 fichas; el botón
«Llevar el sello a Doble» habilitó presentación y primera mesa. Contratos S/C/J, dados y personaje
cargaron, sin aviso de guardado y sin errores de consola capturados. No se reinició Vera ni se
confirmó una tirada nueva en el perfil público. Fuentes computadas Arial/Helvetica/sans-serif.
Captura: `docs/evidence/doble/public-table.png`. La partida completa y la ayuda se recorrieron
localmente; esta comprobación pública cubre migración, acceso y carga, no todo el recorrido.

La rama de fuente vigente para continuar esta entrega es `codex/doble-contracts`; la rama
`codex/ink-theatre` conserva la versión previa. El sitio sigue publicando sólo desde `gh-pages`.

## Retrato de Doble, revisión v2 — 23/10/2026

El usuario pidió que el crupier coincidiera con los demás personajes. Se sustituyó el SVG activo
por `public/art/doble-v2.png`, generado con imagegen usando Vera como referencia principal de
estilo, el anfitrión como referencia secundaria de acabado/paleta y una captura del Doble previo
para conservar identidad. Tinta de grosor variable, textura pictórica, ojos expresivos, traje
ciruela, solapas desiguales y sombrero. El encuadre hasta la cadera permite leer cara y manos
sobre la mesa. La imagen se comparte entre presentación HTML y plano de Babylon.

PNG 1024×1536 RGBA, 2.236.166 bytes, alfa 0..254 y esquinas transparentes. Copia byte a byte de
la salida de imagegen, sin edición de píxeles; el SVG anterior permanece histórico. Prompt exacto,
referencias, hash, herramienta y derechos en `public/doble-art-v2.json` y `docs/doble-art-v2.json`.
La generación no implica animación nueva. Reglas, puntuación y guardado siguen iguales.

Compilación/typecheck aprobadas; inspección del retrato y de la mesa en escritorio, sin errores
de consola capturados. Captura en `docs/evidence/doble-art-v2/table-desktop.png`. No se ejecutaron
suites de tests ni se repitió el recorrido de juego para esta sustitución de arte.

### Publicación de la revisión artística

Fuente `61268d31e1b01e1f284b076126ea79c4b1ce3dfb`, despliegue `80100dc3562495397dffe3f75784762999455665`,
versión `urns-contracts-doble-art-v2`. GitHub Pages finalizó con éxito:
https://github.com/GaryPoui/TheGame/actions/runs/39953002366.
Se abrió el juego público, se retomó el progreso existente y se inspeccionó el nuevo retrato
detrás de la mesa sin errores de consola capturados. Captura:
`docs/evidence/doble-art-v2/public-table.png`. PR #5 conserva los cambios sin merge automático.


## Jugabilidad más práctica — 2026-10-23 · sólo local

Pedido: mejorar las dos mesas, explicar mientras se juega y hacerlas más atractivas.
Restricción posterior explícita: **no pushes al repo**. No commit, push ni despliegue en este corte.

Vera: inventarios con fichas contables en el paño; tutorial de tres momentos con elección real,
extracción roja preparada y comparación de fracciones equivalentes; explicación según urna elegida;
antes/después de la fracción y manejo de urna vacía. El cierre de ronda se integra en Continuar,
sin saltar decisiones. Repetir Vera conserva sellos y entra a jugar sin repetir la apertura.
Doble: distribuciones de 36 casos en cada contrato, cálculo contextual del elegido y ensayo manual
de dos dados (2,2 inicial; cada botón cambia un dado entre 1 y 6). El ensayo es estado de interfaz,
no llama al RNG, no modifica campaña/saldo y no se guarda. Recibo visual del mismo par mantiene
señalado el contrato firmado original, incluso después de la orden hipotética.

Diseño: teatro de tinta, arte existente y textos sans; progreso de decisiones, controles sobre el
paño, acción principal fija y objetivo visible en celular. Feedback breve después del resultado,
sin bloqueo de controles y respetando movimiento reducido; las acciones de teclado no lo animan.
Build/typecheck completadas; inspección visual de escritorio y celular y manipulación del ensayo.
Sin suites de pruebas automatizadas nuevas ni ejecutadas; diversión y aprendizaje no medidos.
Detalle y capturas locales: docs/playability-local.md y docs/evidence/playability/.


### Autorización posterior de publicación

El usuario pidió «PUSHEA TODO PARA QUE ESTE EN EL PAGES». Esta instrucción reemplaza la
restricción de no hacer push para el corte de jugabilidad. Se prepara la subida de fuente y build
a gh-pages; los identificadores finales se registran tras la publicación efectiva.


### Publicación efectiva de jugabilidad

Fuente `7b463b0f3c04a73b26dff0020fc94d3d861c0e9e`, despliegue
`8e64958f8c2c35d8b40666b963dca42731b893ec`, versión `urns-contracts-playability-v1`.
Workflow https://github.com/GaryPoui/TheGame/actions/runs/39956779863 completado con éxito.
Se comprobó HTTP 200 del sitio, build-info con fuente/versión correctas y coincidencia del
bundle público con dist local (incluye rehearse-die-). No se ejecutaron suites de gameplay.
PR #5 actualizado; sin merge automático. Este registro reemplaza el estado local anterior.
