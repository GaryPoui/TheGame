# Plan de validación

Estado: pruebas del juego planificadas; se ejecutan sólo validaciones documentales y matemáticas
en esta fase. Evidencia ejecutada separada en `docs/evidence/`.

| Área | Casos obligatorios | Método futuro | Responsable/spec |
| --- | --- | --- | --- |
| Núcleo | 36 pares, sumas, complemento, urna tras reposición/extracción, EV neto, media y dispersión | Enumeración exacta + Vitest con fracciones | 005–008 |
| RNG | Mismo seed/mismos comandos; seed cero; n=1; rechazo; reinicio tras checkpoint | Vectores dorados, fake RNG límites | 005/009 |
| Progresión | 0 puntos y peor azar completan ayuda finita; empate; doble click; todas las rutas legales | Transiciones exhaustivas en estados finitos | 004/009 |
| Guardado | Válido, truncado, futuro, backup, quota, modo privado, contenido antiguo | Fixtures y adaptador storage fallable | 009 |
| Rival | Sólo proyección pública, no resultado siguiente, empate reproducible | Fake RNG que falla si rival consulta | 005–008 |
| Tutorial | Cinco pasos, repetir, retirar ayuda, transferencia nueva, omitir intro | Prueba integración + observación humana | 004 |
| Accesibilidad | Teclado, foco retorno, zoom 200%, sin color/audio, remapeo conflictos, cámara reducida | Playwright + revisión manual | 002/004/010 |
| Canvas | Dados legibles y coherentes con outcome, GLB válido, sombras, pérdida de contexto | Capturas cámara real + estado comparado | 005/010 |
| Publicación | HTTPS, base subruta, carga sin CDN, asset faltante, reconexión | Navegador sobre build de producción | 001/010 |

Simulación futura: para estimar P(suma 7), n=100000, error absoluto <=0.01; Hoeffding da
P(error>0.01)<=2exp(-20), pero no sustituye 6/36 exacto ni prueba calidad criptográfica del RNG.
No usar un test estocástico no reproducible en CI. Seeds fijas y reporte de parámetros.

## Prueba de experiencia y aprendizaje (hipótesis)

Primero 5 participantes adultos voluntarios, sin telemetría remota ni datos identificatorios:
comprender objetivo, jugar mesa 005, describir por qué una buena decisión puede perder y resolver
una variante nueva. Registrar con consentimiento notas anónimas: tiempo, acciones, ayuda, confusión,
abandonos y disfrute de 1–5. Umbral de iteración propuesto: al menos 4/5 comprenden objetivo y
completan la mesa sin explicación oral del facilitador, 3/5 explican el complemento correctamente;
si falla, rediseñar tutorial. Muestra exploratoria sin afirmaciones causales ni generalización.

Luego campaña completa: primera partida objetivo 30–45 min con ayudas incluidas, omisión de intro
posible y sin límite máximo forzado. Separar tiempo de lectura/pausa. Comparar respuesta inicial
y transferencia sin concluir eficacia educativa demostrada. No confundir ayuda completada con
dominio. Validar aburrimiento por estrategia dominante y que las decisiones cambien según objetivo.

## Presupuestos y cierre

Presupuestos en [validación visual](visual-validation.md) son objetivos. Identificar CPU/GPU/RAM,
SO, browser/version, resolución, caché fría/caliente y red simulada para cada medición.
Registrar 3 repeticiones, mediana y p95 frame time tras calentamiento de 30 s; no inventar FPS.
Para cerrar un corte: aceptación cubierta, reglas exactas, sin bloqueos, UI navegable y capturas
revisadas; únicamente entonces ampliar campaña. Build, pruebas y bugs pendientes deben constar
en el PR futuro. La fase documental no presenta `npm run build` como aprobado: aún no hay app.
