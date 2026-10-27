# Visión y alcance — La Casa del Azar

Estado: campaña de tres asistentes y final implementada y publicada. Fecha de revisión: 2026-10-27. Validación funcional y límites en [campaña](campaign-implementation.md). Dirección vigente: [Teatro de tinta](ink-theatre.md). La implementación del MVP no demuestra eficacia educativa.

## Experiencia

Una persona secuestrada despierta en una casa donde la libertad se negocia con decisiones sobre azar. Tres asistentes teatrales custodian sellos de salida. El jugador aprende a distinguir una decisión defendible de un resultado afortunado y usa esa diferencia para desenmascarar al anfitrión.

Público provisional: adolescentes mayores y adultos que manejan sumas y divisiones simples; no se presupone formación estadística. La adecuación etaria y comprensión deben validarse. Tensión moderada, secuestro y grilletes sin violencia gráfica; advertencia de contenido y salto de apertura disponibles.

## Alcance cerrado

- Navegador de escritorio, teclado y mouse; Babylon.js + TypeScript estricto + Vite; WebGL base.
- Calle de unos 20 segundos y una sala principal compacta con cuatro puestos. Tres asistentes y anfitrión, sin otros NPC necesarios.
- Introducción 2–3 minutos; urnas 7–9; contratos 7–9; registros 8–10; final 5–7; navegación/epílogo 1–3. Total objetivo 30–41 minutos, margen de lectura hasta 45. Objetivo sujeto a prueba.
- Una campaña local sin cuentas, backend, multijugador, dinero real ni compras. Persistencia versionada local.
- MVP existente: primera mesa completa, sala ilustrada con mesa 3D, Vera, apertura breve, guardado y ajustes. Validarlo con jugadores antes de ampliar la campaña.

## Experiencia y decisión central

El objetivo jugable es conseguir sellos mediante planes que respetan la información disponible. Los puntos de decisión habilitan progreso; las fichas obtenidas al azar cambian reacciones y balance visible, nunca bloquean la salida. La libertad se gana por completar una ruta de aprendizaje; una victoria asistida no se registra como dominio independiente.

La elección de mesa es libre entre disponibles: urnas al inicio, contratos tras urnas y registros tras contratos. Mesas ya superadas admiten práctica opcional sin penalización. Mostrar requisitos y permitir inspeccionar mesas bloqueadas. La estructura lineal conserva conocimientos previos sin fingir una libertad que no existe.

## Exclusiones

Combate físico, armas, shooter, acción de secuestro compleja, generación procedural de niveles, Bayes formal, inferencia con intervalos de confianza, doblaje completo obligatorio, personajes originales con rig complejo obligatorio, WebGPU exclusivo, framework de UI obligatorio, física determinando probabilidades y simulaciones presentadas como pruebas exactas.

## Criterios de éxito

Experiencia terminable sin suerte favorable; reglas reproducibles; ausencia de errores matemáticos; decisiones comprensibles con objetos y texto; navegación completa por teclado; lectura sin audio; rendimiento medido en equipo identificado. Diversión y aprendizaje son hipótesis, no resultados. Ver [diseño educativo](educational-design.md), [GDD](game-design.md) y plan de validación del proyecto.
