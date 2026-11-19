# Actualización del enlace público — 19 de noviembre de 2026

## Diagnóstico confirmado

El enlace del README es `https://garypoui.github.io/TheGame/`. Al iniciar la revisión,
`build-info.json` indicaba `final-delivery-2026-11-18`, fuente
`2c2aa9f597a81aff92a90b6d2560f4df63a59bea`. Sin embargo, `origin/main` ya estaba en
`b90f7d1`, con tres cambios posteriores aún sin publicar: tutorial interactivo del jefe,
duelo de ocho rondas de Doble y urnas del jefe con proporciones cercanas.

Se actualizó la copia de referencias remotas y se trabajó desde `origin/main` en
`codex/pages-latest-audit`, conservando todas las ramas y archivos. El destino sigue siendo
la raíz de `gh-pages`; el flujo `validate.yml` valida main, pero no publica el juego.
Por eso actualizar el código del repositorio no actualizaba automáticamente el enlace.
No se encontró registro de service worker en la aplicación.

## Revisión y comprobaciones

Se revisaron la entrada del juego, las reglas de las cuatro mesas, el guardado versionado,
los cambios de interfaz desde la fuente publicada, la configuración de Vite y el script
de publicación. No fue necesario sustituir código: las mejoras ya estaban en main.
Se utilizó la guía local de pruebas web con el runner TypeScript y Chrome existentes,
sin instalar dependencias.

- Pruebas unitarias completas: 78 aprobadas en 17 archivos.
- TypeScript estricto y compilación de producción: aprobados.
- Matemática: 70 comprobaciones aprobadas; skills: 92 archivos verificados.
- Documentación: comprobación estructural aprobada.
- Navegador local: tres recorridos aprobados, incluyendo ganar/perder las ocho rondas,
  revancha y persistencia del primer dado del jefe.

La partida guardada conserva sus reglas anteriores por compatibilidad; volver a jugar la
mesa de Doble inicia el duelo nuevo. No se borró el progreso del navegador.

La compilación mantiene la advertencia existente sobre el tamaño del módulo de escena.
Estas comprobaciones no acreditan diversión, aprendizaje, todas las resoluciones ni FPS.

## Publicación

Versión publicada: `latest-main-2026-11-19`, a partir de
`b90f7d18faf4e27045915f16c9734e7d966ff93b`. Commit de Pages:
`fbf2b77c221642dc4669cb22c26b582218cc1716`.
[El despliegue terminó correctamente](https://github.com/GaryPoui/TheGame/actions/runs/44516909891).
La raíz y `build-info.json` responden con la publicación nueva; los 149 archivos
coinciden por SHA-256 con la compilación validada.

El primer intento de nueve pruebas públicas se interrumpió por errores de conexión en
`page.goto` (cuatro fallos de conexión y cinco casos sin ejecutar). La primera descarga
con Node también falló por conexión; ambas evidencias se conservan. La comparación
completa posterior con curl aprobó los 149 archivos, sin diferencias. Repetido tras
restablecerse la conexión, el recorrido público completo de ocho rondas de Doble aprobó.
También aprobaron los seis casos públicos posteriores: ayuda del jefe, práctica interactiva
a 512×320, dos extracciones con urnas cercanas y recarga, utilería y cartas del jefe,
póker de Ada con bono aditivo y pantalla final con salida en primera persona.
Total público confirmado: siete casos. Se inspeccionó además la captura pública del jefe
con su mesa, pedestal, cartas y lectura separada.

Los resultados de publicación, integridad y navegador público se guardan en
[la evidencia de esta revisión](evidence/pages-latest-2026-11-19/).
