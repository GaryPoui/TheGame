# Dirección visual y sonora

Estado: propuesta para «La Casa del Azar» (título provisional). Fase documental: no se han producido modelos, capturas, audio ni escenas. Investigación consultada el 2026-10-22, salvo futuras verificaciones que registren su propia fecha. Alcance: experiencia de 30–45 minutos, calle breve y sala compacta; Babylon.js + TypeScript, WebGL base.

## Intención y lenguaje de formas

Una casa clandestina de juegos que parece un pequeño teatro administrativo: madera oscura, fieltro, latón y expedientes usados. Misterio y humor oscuro moderado mediante objetos y gestos; evitar sangre, violencia gráfica y decoración que distraiga del problema. El entorno tiene proporciones creíbles y materiales PBR; los personajes usan cabezas y manos ligeramente exageradas, contornos simples y poses legibles. No se busca detalle AAA.

La mesa, el rostro y la información relevante forman la jerarquía de cada plano. Muebles rectangulares estables; urnas redondeadas; dados con aristas suavizadas; registros con retícula ordenada. El desgaste se concentra en cantos y zonas de contacto, nunca sobre símbolos, puntos de dados o números. Dos o tres materiales principales por familia, sin ruido visual uniforme.

Paleta ambiental propuesta: carbón #181D20, madera #49362B, fieltro #254C46, latón #B99A58 y papel #EEE4CB. Los colores de eventos educativos se especifican en [la guía de interfaz](ui-style-guide.md) y siempre llevan símbolo y nombre. No asumir contraste por la elección de códigos: debe verificarse en el render y en CSS.

## Iluminación y materiales

Una luz principal cálida sobre la mesa y relleno ambiental frío tenue separan figura y fondo. Preparar iluminación estática/bake cuando el pipeline lo permita, con un máximo inicial de dos luces dinámicas y una sola sombra dinámica. Sin niebla volumétrica, SSR ni shaders propios como requisito. El reflejo no debe ocultar las caras del dado. Evitar transparencias para urnas: usar recipiente abierto u opaco con inventario visible en HTML, reduciendo problemas de orden y rendimiento.

Babylon documenta materiales PBR y el flujo metallic–roughness; esta es la base técnica, no una garantía automática de realismo. El estilo se valida desde cámara de juego. Referencia técnica primaria: [PBR de Babylon.js](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/introToPBR). Referencias materiales candidatas: biblioteca [Poly Haven](https://polyhaven.com/license), cuyos assets se publican CC0; todavía no se seleccionó ni incorporó ninguno.

## Personajes y actuación

Son propuestas de función visual, sujetas al GDD único: asistente de urnas con gesto metódico de contar; asistente de contratos con postura teatral y manos abiertas; asistente de registros inclinado sobre papeles; anfitrión de silueta alta y calma excesiva. Evitar asociar discapacidad o rasgos culturales con engaño. Reutilizar un rig base si el coste lo justifica, conservando siluetas y accesorios distinguibles.

Banco mínimo por personaje: reposo, mirar al jugador, señalar objeto, esperar decisión, reconocer razonamiento y reaccionar al resultado. Una reacción adversa al azar no debe negar una decisión correcta. No es obligatorio lip sync ni doblaje completo; gestos breves acompañan subtítulos y texto avanzable.

## Cámara y devolución de control

| Modo | Encuadre y transición | Control |
| --- | --- | --- |
| Introducción | 3–4 planos controlados: calle, sonido fuera de campo, negro, despertar. Sin forcejeo complejo ni sacudida obligatoria. | Omitir disponible; muestra resumen equivalente. |
| Despertar/conversación | Altura sentada; mirada estable al anfitrión y grilletes visibles sin primer plano prolongado. | Texto a ritmo del jugador. |
| Exploración | Primera persona; sin balanceo por defecto; FOV y sensibilidad ajustables. | Se habilita cuando el anfitrión libera manos y piernas tras su explicación. Puerta cerrada justifica permanencia, no una cadena que contradiga movimiento. |
| Mesa | Cámara fija oblicua con dados y fichas distinguibles, sin perspectiva extrema. | Cursor libre, teclado y panel HTML. Interactuar entra; cancelar devuelve al punto seguro previo. |
| Diálogo en mesa | Rostro en tercio superior y tablero completo visible. | Sin desplazar foco arbitrariamente; pausa conserva selección. |

Transición propuesta 250–400 ms, sustituida por corte o fundido simple con movimiento reducido. Estos valores son hipótesis, no resultados de pruebas. Cambio de modo nunca deja pointer lock activo sobre un menú. Salir de foco pausa interacción; reanudar exige acción del usuario.

## Respuesta y sonido

Seleccionar: contorno estable + etiqueta; confirmar: asentamiento de ficha y clic seco; revelar: movimiento corto + texto del resultado; completar: sello y resumen. Anticipación 100–150 ms y asentamiento 150–250 ms como punto de partida ajustable. No flashes, temblores ni partículas obligatorios. Reducir movimiento sustituye desplazamiento por cambio inmediato y mantiene significado.

Audio ambiental de habitación y calle en capas discretas; efectos distinguibles para selección, confirmación y revelación. Música sin pulso urgente durante razonamiento. Controles separados de música, ambiente y efectos, mute general y estado persistente. Iniciar audio únicamente tras interacción del usuario. Toda información esencial tiene equivalente textual/visual: «puerta cerrada», «ficha extraída», resultado y turno. No depender de estéreo, voz o música para ganar.

## Escena representativa futura

Construir primero una sala gris de aproximadamente 6 × 8 m (hipótesis de escala), una mesa, silla, urna, cinco fichas (3 círculo/rojas y 2 triángulo/azules), un asistente y una luz principal. Secuencia: entrar → diálogo breve → predecir → elegir extracción sin reposición → observar roja preparada e identificada como tutorial → comparar 3/5 con 2/4 → explicación → nueva decisión. El núcleo matemático determina el resultado; la animación sólo lo presenta.

Probar un plano de rostro, vista de mesa y retorno a exploración con texto ampliado y movimiento reducido. Capturas y perfiles deben preceder la producción de más personajes. El gate incluye una ronda completa, símbolos legibles, ausencia de solapamientos y presupuesto medido; ver [validación visual](visual-validation.md). Este ejercicio no demuestra eficacia educativa ni rendimiento de la campaña.
