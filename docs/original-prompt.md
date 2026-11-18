Actuá como un equipo coordinado de desarrollo de videojuegos: producción, diseño de juegos, programación, narrativa, arte técnico, diseño educativo y QA. Tu objetivo es preparar y luego desarrollar un videojuego pequeño, entretenido y educativo sobre probabilidad y estadística.

Trabajá con investigación verificable, especificaciones claras y entregas pequeñas. Si disponés de subagentes, podés delegar investigaciones y revisiones independientes, manteniendo una única dirección técnica y de diseño.

# 1. Proyecto y estado conocido

Repositorio principal:
https://github.com/GaryPoui/TheGame.git

Colección de skills solicitada:
https://github.com/gamedev-skills/awesome-gamedev-agent-skills

Entorno inicial: Windows, PowerShell.

En la sesión anterior:
- Git estaba instalado y se verificó la versión 2.52.0.windows.1.
- El repositorio se clonó en `C:\Users\TomyG\Downloads\TheGame`.
- El repositorio contenía únicamente un README mínimo.
- Se verificó una sesión de GitHub autenticada como GaryPoui.
- Se investigaron preliminarmente motores, Spec Kit y skills.
- No se instalaron todavía las skills ni se subió la documentación.

Verificá nuevamente este estado: puede haber cambiado. No sobrescribas trabajo existente ni expongas credenciales.

Existe un enlace compartido a una instantánea inicial del chat:
https://chatgpt.com/s/cx_6adacb1e19ec8191882cff4f7533f6db

Esa instantánea se creó antes de decidir Babylon.js y puede estar incompleta. Este prompt y la documentación versionada deben conservar las decisiones posteriores. Si podés generar un enlace actualizado, registralo al finalizar; si no, explicá esa limitación.

# 2. Decisión técnica y alcance

Motor elegido: Babylon.js.
Lenguaje: TypeScript con configuración estricta.
Herramienta de desarrollo propuesta: Vite.
Plataforma inicial: navegador de escritorio, teclado y mouse.
Publicación prevista: hosting estático con HTTPS.
Interfaz educativa: HTML/CSS accesible superpuesta al escenario 3D cuando corresponda.
Modelos y animaciones: preferentemente glTF/GLB.
Persistencia inicial: guardado local versionado.

No agregues backend, cuentas, multijugador, servicios pagos ni dependencias grandes sin una necesidad concreta.

Usá WebGL como base de compatibilidad; cualquier uso de WebGPU debe tener una alternativa funcional. Seleccioná versiones estables verificadas y fijalas en el archivo de dependencias y su lockfile.

Duración objetivo: 30–45 minutos para una primera partida.
Estructura: introducción breve, tres asistentes y un enfrentamiento final.
Escenarios: una calle breve para la introducción y una sala principal compacta.
Priorizá terminar una experiencia pequeña, coherente y pulida.

# 3. Concepto y narrativa

El protagonista camina por la calle, es secuestrado y despierta sentado en una silla, con las manos sujetas mediante grilletes. Frente a él hay una mesa de juego.

El secuestrador explica que podrá obtener su libertad si supera las pruebas de sus asistentes y finalmente lo vence a él.

La historia debe tener misterio, tensión y humor oscuro moderado. Los personajes pueden ser excéntricos y expresivos. Evitá largas conversaciones y exposición innecesaria. Cada asistente debe tener una personalidad reconocible vinculada al concepto que enseña.

La apertura debe ser breve y realizable con recursos limitados: planos controlados, sonido, animaciones sencillas y una transición al despertar. No necesita una secuencia de acción compleja.

Resolvé explícitamente la aparente contradicción entre estar inmovilizado y elegir mesas. Propuesta: después de la explicación inicial, se libera parcialmente al protagonista para circular por la sala; las restricciones restantes tienen una explicación narrativa. Documentá cuándo se habilitan movimiento e interacción.

Las mesas muestran sus requisitos. La elección puede ser libre entre las disponibles, pero la progresión respeta los conocimientos previos. Tras superar a los tres asistentes se habilita el secuestrador.

El enfrentamiento final es una partida de mesa que combina lo aprendido. No agregues combate físico, armas ni sistemas de shooter por el hecho de usar primera persona.

# 4. Dirección visual y sonora

Estética: entornos y materiales con una base realista, personajes caricaturescos y actuaciones expresivas, especialmente durante los diálogos.

Buscá coherencia visual mediante:
- Iluminación atmosférica preparada y pocas luces dinámicas.
- Materiales PBR y texturas optimizadas.
- Siluetas claras y proporciones estilizadas.
- Gestos, miradas y poses que apoyen cada intervención.
- Cámara estable y legibilidad de los elementos de mesa.

El realismo no implica alcanzar calidad AAA. Reducí cantidad de escenarios y personajes antes de sacrificar claridad o rendimiento.

Audio: ambiente inquietante, efectos claros para las acciones y música discreta. La información educativa debe poder comprenderse sin audio. El doblaje completo es opcional; subtítulos y texto son obligatorios.

Registrá procedencia y licencia de cada recurso. No presupongas permisos por encontrar un asset en internet.

# 5. Diseño educativo y selección de juegos

El juego debe enseñar probabilidad Y estadística mediante decisiones jugables. Evitá que se convierta en un cuestionario intercalado con tiradas al azar.

Proponé y validá tres minijuegos originales o adaptaciones de mecánicas genéricas, sin copiar la presentación de juegos comerciales.

Progresión sugerida:

1. Mesa de las urnas:
   - Espacio muestral, eventos, probabilidades y complemento.
   - Extracciones con y sin reposición.
   - Actualización de probabilidades después de observar una extracción.
   - Representación mediante objetos, fracciones y porcentajes.

2. Mesa de los dados y contratos:
   - Distribución de resultados de dos dados.
   - Diferencia entre resultados equiprobables y sumas no equiprobables.
   - Valor esperado, variabilidad y decisiones con riesgo.
   - Comparación entre un resultado individual y el comportamiento de muchas partidas.

3. Mesa de los registros:
   - Frecuencia relativa, media y dispersión.
   - Comparación de muestras de mecanismos conocidos.
   - Tamaño de muestra, sesgo de selección e incertidumbre.
   - Decidir cuándo hay evidencia suficiente y cuándo hace falta observar más.

Enfrentamiento final:
- Combina conceptos ya enseñados.
- Incluye decisiones de riesgo, actualización de probabilidades e interpretación de datos.
- No introduce fórmulas nuevas sin preparación.
- Si se incorpora Bayes formal, debe enseñarse antes y justificarse dentro del alcance; no es obligatorio.

Para cada juego documentá:
- Materiales y estado inicial.
- Información visible y oculta.
- Acciones legales y orden de turnos.
- Modelo aleatorio y supuestos.
- Condiciones de victoria, derrota, empate y reintento.
- Sistema de puntos y su relación con las decisiones.
- Ejemplo completo resuelto.
- Cálculos exactos de referencia.
- Estrategias razonables y posibles estrategias dominantes.
- Errores conceptuales que puede provocar.
- Política del asistente y cómo aumenta la dificultad.
- Tutorial interactivo y evaluación de transferencia.

Las reglas deben ser implementables sin ambigüedades. Si un juego no aporta una decisión interesante o no enseña bien el concepto, reemplazalo y justificá el cambio.

# 6. Tutoriales, dificultad y azar justo

Usá el ciclo:
predecir → decidir → observar → explicar → volver a aplicar.

Introducí un concepto por vez. Las ayudas aparecen durante una acción concreta, pueden repetirse y se retiran gradualmente.

Distinguí:
- Calidad de la decisión.
- Resultado aleatorio.
- Evidencia de aprendizaje.

Una buena decisión puede perder una ronda. El feedback debe reconocerlo. No enseñes que una estrategia óptima garantiza ganar.

No bloquees la campaña indefinidamente por mala suerte. Diseñá puntos por razonamiento y decisiones verificables, práctica asistida y reintentos breves. La condición de progreso debe ser explícita y acotada.

Las primeras mesas usan pocas opciones e información clara; las siguientes combinan conceptos y reducen ayudas. No aumentes la dificultad haciendo trampas.

La IA de los oponentes:
- Usa solamente información que legítimamente conoce.
- Tiene políticas documentadas y reproducibles.
- No consulta resultados futuros del generador aleatorio.
- No modifica probabilidades ocultamente para perjudicar al jugador.

Usá escenarios preparados y claramente identificados para enseñar. En las partidas normales, respetá el modelo aleatorio anunciado.

No incluyas dinero real, compras de ventajas ni monetización basada en apuestas.

# 7. Skills: investigar, seleccionar e instalar

Esta parte es prioritaria. Investigá skills de desarrollo de videojuegos y seleccioná las más útiles para este proyecto, sin afirmar que existe una lista universal de “las mejores”.

Evaluá:
- Relación con Babylon.js y el alcance.
- Calidad de instrucciones y referencias.
- Mantenimiento, compatibilidad y licencia.
- Dependencias, permisos y scripts incluidos.
- Solapamiento con otras skills.

Revisá la colección indicada y considerá especialmente estas skills existentes:
- `router`
- `dialogue-systems`
- `save-systems`
- `game-ai`
- `game-ui-ux`
- `camera-systems`
- `input-systems`
- `audio-design`
- `level-design`
- `performance-optimization`
- `create-game-assets`
- `prototype-fast`
- `puzzle` o `card-game`, según el diseño definitivo.

Instalá las que correspondan y explicá para qué se utilizará cada una. No instales todas sin criterio.

No uses skills de Unreal, Unity, Godot o Three.js como autoridad sobre las APIs de Babylon.js. Si no encontrás una skill de Babylon.js suficientemente sólida, registrá el faltante y trabajá con documentación oficial; no inventes su existencia.

Usá el instalador disponible en el entorno cuando corresponda. Conservá las referencias y archivos auxiliares que necesite cada skill. Verificá que sus enlaces relativos funcionen después de instalar.

Dejá un manifiesto reproducible con:
- Nombre y origen.
- Ruta dentro del repositorio fuente.
- Commit o versión exacta.
- Licencia.
- Destino de instalación.
- Motivo de selección.
- Fecha y resultado de verificación.
- Pasos para reinstalar en otro equipo.

Las skills del proyecto deben quedar disponibles en una ubicación reconocida por el agente, como `.agents/skills`, según su compatibilidad real. La instalación global, si se usa, no reemplaza la portabilidad del repositorio.

Informá si requieren un nuevo turno o reiniciar la sesión para aparecer en el catálogo. No confundas “instalada” con “cargada y aplicada”.

# 8. Investigación y Spec Kit

Investigá fuentes primarias sobre:
- Babylon.js, cámaras, interacción, animaciones, GUI, audio y carga de assets.
- Optimización y distribución de juegos 3D web.
- Spec Kit e integración con el agente utilizado.
- Enseñanza activa de probabilidad y estadística.
- Accesibilidad en videojuegos.
- Licencias y recursos apropiados.

Puntos de partida:
https://doc.babylonjs.com/
https://www.babylonjs.com/specifications/
https://github.com/github/spec-kit
https://github.github.io/spec-kit/
https://openstax.org/books/introductory-statistics-2e/
https://asacollegegaise.org/
https://gameaccessibilityguidelines.com/

Registrá enlaces, fechas de consulta, conclusiones y la decisión que apoya cada fuente. Separá hechos documentados, propuestas de diseño e hipótesis pendientes de validar. No afirmes eficacia educativa demostrada sin un estudio adecuado.

Verificá la versión y los comandos actuales de Spec Kit antes de ejecutarlos. Inicializá su integración con el agente real y conservá los archivos generados.

Seguí el flujo de constitución, especificación, aclaraciones, plan, tareas y análisis de consistencia. No presentes carpetas escritas manualmente como prueba de haber instalado Spec Kit.

# 9. Arquitectura prevista y validación

Separá el núcleo matemático de la presentación:
- Reglas y cálculos en TypeScript puro.
- Generador aleatorio inyectable y con semillas reproducibles.
- Estado de partida y máquina de estados explícita.
- Renderizado Babylon.js como consumidor del estado.
- Diálogos y contenido educativo definidos como datos.
- Guardados con versión y recuperación ante datos inválidos.

Verificá matemáticas mediante enumeración exacta cuando sea posible. Usá simulaciones como complemento, con tolerancias justificadas.

Ejemplos de referencia:
- Con dos dados justos independientes, P(suma 7) = 6/36.
- En una urna con 3 fichas rojas y 2 azules, P(roja) = 3/5.
- Tras extraer una roja sin reponerla, P(siguiente roja) = 2/4.
- El valor esperado de un contrato debe incluir el coste de entrada cuando exista.

Planificá pruebas de reglas, probabilidades, guardado, progresión, tutoriales y ausencia de bloqueos. Para navegador, considerá Vitest y Playwright si encajan.

Definí presupuestos medibles de carga, memoria y rendimiento. Son objetivos hasta medirlos en un equipo identificado.

Accesibilidad mínima: controles reasignables, subtítulos ajustables, símbolos además de colores, navegación por teclado, cámara configurable, reducción de movimiento y ausencia de decisiones educativas con tiempo obligatorio.

# 10. Documentación y especificaciones

Primera fase autorizada: investigación, instalación de herramientas y skills, documentación y subida al repositorio. No desarrolles todavía el videojuego completo.

Prepará como mínimo:
- README con mapa de lectura.
- Visión, alcance y exclusiones.
- Documento de diseño del juego.
- Narrativa y guion de la introducción.
- Diseño educativo y reglas matemáticas.
- Dirección visual y sonora.
- Arquitectura y decisiones técnicas.
- Investigación con fuentes.
- Inventario y reinstalación de skills.
- Plan de validación.
- Riesgos, supuestos y preguntas pendientes.
- Documento de continuidad y este prompt.
- Constitución y especificaciones de Spec Kit.

Dividí el trabajo en specs pequeñas:
001: base técnica web.
002: cámara e interacción.
003: introducción y transición a la sala.
004: diálogos y tutoriales.
005: primera mesa.
006: segunda mesa.
007: tercera mesa.
008: secuestrador y final.
009: progresión y guardado.
010: arte, audio, accesibilidad, rendimiento y publicación.

Cada spec debe tener objetivos, dependencias, historias de usuario, requisitos, criterios de aceptación, casos límite y tareas. Registrá dependencias transversales y evitá duplicar sistemas.

El primer prototipo futuro debe probar una mesa completa en una sala sencilla antes de producir toda la campaña.

# 11. Entrega y continuidad

Guardá los documentos en Markdown dentro del repositorio y conservá licencias de terceros. Añadí instrucciones para que otro agente pueda continuar sin acceso al chat.

El documento de continuidad debe indicar:
- Qué se hizo realmente.
- Qué está propuesto.
- Qué se verificó y con qué evidencia.
- Qué falta y cuál es el siguiente paso.
- Cómo preparar el entorno y reinstalar skills.
- Cómo usar Spec Kit.
- Rama, commit y enlace de la entrega.

Revisá cambios y secretos antes de subir. Usá una rama descriptiva, hacé commit y push; abrí un PR si las herramientas y el acceso lo permiten. No fuerces actualizaciones ni sobrescribas historia.

Si algo no puede instalarse o publicarse, completá lo demás y describí el impedimento exacto. No afirmes éxito sin comprobarlo.

Al finalizar esta fase, entregá los enlaces al repositorio, documentación y PR, junto con una explicación breve del estado. La implementación del juego quedará preparada para una instrucción posterior.

# 12. Ampliación de skills para diseño y calidad visual

Esta sección amplía la selección de skills del apartado 7. Conservá Babylon.js + TypeScript, la duración de 30–45 minutos y la primera fase centrada en investigación y documentación.

## Skills adicionales prioritarias

### A. Diseño de juego: `game-designer`

Fuente:
https://github.com/setcodes/gamedev-skills/tree/main/skills/game-designer

Revisá e instalá esta skill para diseñar y evaluar:
- Decisiones interesantes en cada mesa.
- Reglas, progresión y dificultad.
- Relación entre enseñanza y entretenimiento.
- Hipótesis y planes de pruebas con jugadores.

Su función es orientar el diseño, no reemplazar Spec Kit ni determinar las APIs del motor. Mantené un único GDD y evitá documentos contradictorios.

Entregable: para cada mesa, una descripción de la decisión principal, qué información utiliza el jugador, qué consecuencias tiene y cómo comprobar si resulta comprensible y entretenida.

### B. Identidad visual de la interfaz: `frontend-design`

Fuente:
https://github.com/anthropics/skills/tree/main/skills/frontend-design

Revisá e instalá esta skill para el diseño de las interfaces HTML/CSS:
- Menú inicial, pausa y configuración.
- Diálogos y subtítulos.
- Tutoriales y explicaciones matemáticas.
- Resúmenes de ronda y gráficos estadísticos.

Diseñá una identidad que pertenezca al mundo del juego: fichas, expedientes, anotaciones y materiales de mesa pueden servir de inspiración.

La lectura tiene prioridad sobre la decoración. No imites una página comercial ni agregues un framework de interfaz solamente por usar esta skill. Sus ejemplos o supuestas preferencias de clientes no constituyen requisitos de este proyecto.

Entregable: sistema visual con paleta, tipografías y licencias, jerarquía de texto, espaciado, botones, estados, foco y ejemplos de pantallas.

### C. Modelado desde referencias: `blender-image-to-3d`

Fuente:
https://github.com/majidmanzarpour/blender-game-skills/tree/main/skills/blender-image-to-3d

Evaluá esta skill como herramienta opcional para producir modelos propios a partir de referencias:
- Mesa principal, sillas y grilletes.
- Urnas, dados, fichas y objetos narrativos.
- Elementos modulares de la sala.
- Personajes estilizados, si el presupuesto de producción lo permite.

La skill declara Blender 4.2 o posterior y permite ejecución local sin exigir un servidor MCP. Verificá compatibilidad, scripts y dependencias antes de usarla.

Primero resolvé silueta, escala y proporciones; después materiales, detalle, rig y animación. Exportá GLB y comprobalo dentro de Babylon.js.

No conviertas el modelado original de todos los personajes en un requisito para completar el juego. Compará su coste con adaptar recursos correctamente licenciados.

Entregable por asset: archivo fuente, GLB, texturas, licencia o procedencia, informe técnico y captura desde la cámara real de juego.

## Skills de la colección original que deben reforzarse

Repositorio:
https://github.com/gamedev-skills/awesome-gamedev-agent-skills

Todas las siguientes están en `skills/disciplines/<nombre>/`.

### `create-game-assets`: dirección artística y coherencia

Definí una guía visual antes de producir familias de assets:
- Lenguaje de formas y siluetas.
- Paleta y contraste.
- Materiales, desgaste y densidad de detalle.
- Relación entre escenario realista y personajes caricaturescos.
- Escala, pivotes, texturas y convenciones de exportación.

La generación de una imagen no demuestra que exista un modelo 3D utilizable. Validá geometría, UV, materiales, rig y rendimiento según corresponda.

### `game-feel`: respuesta visual de las acciones

Aplicá feedback breve y consistente al seleccionar, mover y revelar objetos, confirmar decisiones y completar partidas.

Priorizá animaciones de anticipación y asentamiento, efectos sonoros y cambios visuales claros. Los temblores de cámara, flashes y partículas son opcionales y deben respetar la reducción de movimiento.

Separá la respuesta a una buena decisión del resultado aleatorio: una tirada desfavorable no debe comunicar que el razonamiento correcto fue incorrecto.

### `shader-programming`: materiales y efectos

Usala para fundamentos de shaders y efectos concretos, como resaltar objetos interactivos o diferenciar materiales.

La implementación debe consultar las APIs y herramientas actuales de Babylon.js. No copies directamente código de Godot, Unity o Unreal.

Preferí materiales PBR y efectos existentes antes de crear shaders personalizados. Evitá efectos que dificulten leer dados, fichas, texto o gráficos.

### `camera-systems`: encuadre y comodidad

Diseñá modos explícitos:
- Exploración en primera persona.
- Conversación con personajes.
- Vista de mesa.
- Cinemática inicial.

Documentá las transiciones y cómo se devuelve el control. Comprobá legibilidad, ausencia de vibraciones y opciones de sensibilidad y movimiento reducido.

### `game-ui-ux`: claridad y navegación

Usala junto con `frontend-design`: esta skill orienta la interacción y el flujo; la otra, la identidad visual.

Comprobá navegación por teclado, foco visible, escalado, contraste y distribución de explicaciones. Evitá que la interfaz tape información necesaria para decidir.

### `performance-optimization`: calidad visual sostenible

Medí antes de optimizar. Establecé presupuestos de geometría, texturas, luces, sombras y efectos.

Compará capturas y tiempos de renderizado en un equipo identificado. Los objetivos de rendimiento son hipótesis hasta medirlos.

## Verificación visual complementaria: `webapp-testing`

Fuente:
https://github.com/anthropics/skills/tree/main/skills/webapp-testing

Evaluá e instalá esta skill para comprobar interfaces, capturar pantallas y revisar errores de navegador mediante Playwright.

Sus herramientas pueden ayudar a detectar texto cortado, superposiciones y fallos de navegación. El contenido 3D del canvas requiere capturas y comprobaciones específicas; inspeccionar el DOM no demuestra que la escena funcione correctamente.

## Orden de aplicación

1. `game-designer`: definir experiencia, decisiones y alcance.
2. `create-game-assets`: establecer dirección artística y presupuestos.
3. `game-ui-ux` + `frontend-design`: diseñar interfaz y tutoriales.
4. `camera-systems`: validar los encuadres.
5. `blender-image-to-3d`, si corresponde: producir assets concretos.
6. `game-feel` + `shader-programming`: añadir acabado visual.
7. `performance-optimization` + `webapp-testing`: verificar el resultado.

Instalar varias skills no significa cargar todas en cada tarea. Leé solamente las pertinentes y registrá cuáles aplicaste.

## Entregables visuales adicionales

Durante la fase documental prepará:
- `docs/art-direction.md`: dirección visual y referencias.
- `docs/ui-style-guide.md`: sistema de interfaz y accesibilidad.
- `docs/asset-pipeline.md`: producción, licencias y exportación.
- `docs/visual-validation.md`: criterios de revisión y presupuestos.
- Una lista priorizada de assets: imprescindibles, reutilizables y opcionales.

Para el futuro prototipo, especificá una escena representativa con una mesa, un asistente, iluminación, un diálogo y una interacción educativa. Debe permitir evaluar la dirección visual antes de producir toda la campaña.

La prioridad es una experiencia coherente, legible y expresiva. Cada mejora visual debe aportar a la ambientación, la comprensión o la respuesta del juego y justificar su coste.

## Instalación reproducible

Antes de instalar, verificá el contenido actual y fijá un commit. Conservá licencias, referencias y scripts necesarios.

Añadí las nuevas skills al manifiesto del apartado 7, distinguiendo:
- Instalada y verificada.
- Instalada con dependencias pendientes.
- Evaluada y descartada, con motivo.

No incorpores preferencias personales de autores u otros clientes como decisiones del proyecto. Las instrucciones del usuario y el alcance acordado tienen prioridad.