# Validación visual, accesibilidad y rendimiento

Estado: plan, no ejecución. No hay juego, assets ni equipo de referencia perfilado. Todas las cifras son objetivos iniciales; ninguna se presenta como medida. Consultas primarias: 2026-10-22.

## Presupuestos iniciales del prototipo

| Métrica | Objetivo de partida | Cómo medir y decidir |
| --- | --- | --- |
| Fluidez | Mediana ≤16.7 ms/frame, p95 ≤33.3 ms en 60 s de interacción | Captura CPU/GPU sin herramientas de edición abiertas; descartar calentamiento, registrar pausas y stutter. Reducir sombras/resolución antes que legibilidad. |
| Primera mesa utilizable | ≤10 s en frío con perfil de 20 Mbps / 100 ms RTT | Desde navegación hasta controles funcionales; 5 corridas, mediana y peor valor, caché vacía, servidor HTTPS. Registrar tamaño y compilación de shaders. |
| Transferencia inicial | ≤15 MiB comprimidos | Recursos necesarios para primera mesa, con código/decoders/fuentes; campaña incremental total objetivo ≤40 MiB. |
| Memoria | Heap JS estable ≤150 MiB y texturas estimadas ≤128 MiB | Heap y estimación GPU se reportan por separado; no afirmar memoria GPU precisa con heap. Comparar después de 10 entradas/salidas de mesa. |
| Geometría | ≤150k triángulos visibles, asistente ≤25k | Inspector y export; sólo límites de diseño hasta medición, nunca promesa de FPS. |
| Draw calls | ≤100 por plano de mesa | Inspector, incluyendo sombras; comparar contra proxy. |
| Luces y sombras | ≤2 luces dinámicas; ≤1 mapa de sombras 1024² | Revisar lectura y coste; decoración usa luz/material preparado. |
| Texturas | 512–1024 por prop; 2048 excepcional | Inventario, canales y memoria decodificada; valorar distancia de cámara. |

Equipo mínimo todavía pendiente de identificar: CPU, GPU integrada/dedicada y driver, RAM, SO, navegador/versión, resolución, DPR, energía, API gráfica y conexión. No convertir el ordenador de desarrollo en «mínimo soportado» por omisión. Usar WebGL como baseline; cualquier WebGPU futuro necesita mismo flujo y comprobación funcional en WebGL.

[Babylon: optimizar escena](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene) ofrece técnicas condicionadas por el cuello de botella. Congelar materiales/matrices sólo si son realmente estáticos; no congelar personajes/props móviles ni desactivar picking requerido. Medir primero, comparar una variable y conservar captura anterior/posterior con idéntico seed/cámara. Presets bajos reducen sombras, resolución de render y decoración; conservan símbolos, cifras y estados.

## Matriz de aceptación visual

| Prueba | Criterio y evidencia futura |
| --- | --- |
| Cámara de mesa | Todas las caras necesarias y conteos se distinguen a 720p; capturas con y sin panel educativo. |
| Materiales | Dados sin reflejo que oculte puntos; fichas separables por forma y nombre, sin depender de color. |
| Personaje | Señalar dirige a objeto correcto; ninguna mano tapa dato al confirmar; reposo no distrae. |
| Feedback justo | Una decisión correcta con resultado desfavorable mantiene reconocimiento del razonamiento; seed adverso reproducible. |
| Movimiento reducido | Sin shake/balanceo/transición espacial; información equivalente y retorno de control correcto. |
| Escalado | 100 %, 150 %, 200 % a 1280×720 y 1920×1080: sin texto cortado ni acciones inaccesibles; scroll permitido y foco visible. |
| Teclado | Completar una ronda, abrir/cerrar ayuda, pausar, reconfigurar y salir sin mouse ni bloqueo de foco. |
| Subtítulos/audio | Audio apagado conserva instrucciones, eventos y narrativa; tamaño/fondo ajustables, sin ocultar tablero. |
| Contraste | Medir pares CSS y capturas sobre fondo real según [WCAG 2.2](https://www.w3.org/TR/WCAG22/); 4.5:1 texto normal, 3:1 grande y elementos necesarios. |
| Gráficos | Tabla equivalente y nombres/unidades; lectura no depende de animación o color. |
| Carga/error | Progreso y reintentar para GLB/fuente/audio fallidos; no iniciar interacción con objetos ausentes. |
| Contexto perdido | Recuperación o mensaje accionable; estado matemático guardado independiente del render. |

[Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/) apoya la revisión contextual de remapeo, ritmo de texto y controles. Cumplir una tabla interna no equivale a certificación WCAG ni demuestra acceso completo a canvas. Añadir prueba manual con lector de pantalla de nombres, orden, estado y alternativa a apuntar; prueba con usuarios para comodidad y comprensión.

## Automatización y revisión humana

Playwright futuro: capturas fijas en seed/cámara/resolución, espera por señal explícita de escena lista, cobertura DOM de navegación y controles, registro de errores de consola y peticiones fallidas. Evitar sleeps arbitrarios y tolerancias de imagen que escondan texto ausente. La comparación visual puede variar por GPU; conservar plataforma y versión con cada baseline y revisar diferencias humanas.

Canvas exige evidencia específica: captura de tablero, conteo de fichas esperado, orientación del dado, estado visual coincidente con núcleo y prueba de interacción. Un botón DOM presente no demuestra que exista el objeto 3D. Los tests unitarios matemáticos tampoco demuestran legibilidad.

Guion de la escena representativa: abrir ajustes → activar subtítulos grandes y movimiento reducido → entrar a mesa → completar tutorial preparado → ronda normal con seed conocido → resultado adverso de buena decisión → pausa/reanudar → salir/volver → recargar. Guardar capturas de exploración, diálogo, selección, revelación, resumen y vista 200 %. Registrar defectos por severidad: bloquea decisión, altera significado, acceso/comodidad, presentación.

Gate para expandir arte: una mesa completa funcional, ningún defecto que bloquee o distorsione decisión, derechos y archivos de cada asset trazables, perfil reproducible dentro del presupuesto o excepción explícita y justificada. Estado actual: gate pendiente; no se produjeron capturas, perfiles ni resultados de usuarios.

## Aplicación documental de skills

Se leyeron las instalaciones locales `create-game-assets` y sus referencias art-direction, three-d-pipeline y provenance; `frontend-design`, `game-ui-ux`, `camera-systems`, `game-feel`, `performance-optimization` y `webapp-testing`. Aplicación efectiva: guía de formas/familias y gate en escena real; tokens propios del expediente/mesa; foco y pila de pantallas; modos de cámara y retorno; feedback separado del núcleo; presupuestos y medición reproducible. `webapp-testing` orienta el plan futuro: no se ejecutó Playwright, porque no hay aplicación en esta fase. Estas lecturas manuales no prueban recarga del catálogo de skills. Los ejemplos Godot/Unity no se usan como autoridad Babylon.js. No se ejecutaron scripts de modelado o generación.

La revisión del plan conserva una sola familia tipográfica y quita sellos decorativos de instrucciones: el sello queda reservado a completar una mesa. El papel se justifica por registros y contratos del juego; no se adopta una plantilla comercial ni los supuestos sobre clientes de frontend-design. La implementación y capturas pertenecen a la siguiente fase autorizada.
