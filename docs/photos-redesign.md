# Las fotos tramposas y textos sencillos — 2026-10-28

El usuario eligió reemplazar el juego de registros por fotos que esconden derrotas. Pidió una pregunta inicial Sí/No sobre cuatro victorias previas. Se conserva el diseño anterior de las mesas y se simplifican preguntas, tutorial y explicaciones de Doble, sin cambiar costes, pagos ni probabilidades.

## Regla y pregunta inicial

En este ejemplo se lanza de nuevo una moneda equilibrada en cada partida: cara gana, cruz pierde. Las partidas son independientes y las reglas no cambian. Pregunta: **«¿Por haber ganado las cuatro anteriores, tenés más chances de ganar la siguiente?»** Opciones Sí y No, sin preselección. La respuesta correcta es No: sigue siendo 1/2, tampoco existe una derrota pendiente.

La independencia es una condición explícita del ejemplo. No se generaliza a deportes, habilidades, urnas sin reposición ni juegos que cambian de reglas. Con probabilidad desconocida, las observaciones pueden informar una estimación; eso no equivale a que una racha modifique por sí misma el mecanismo.

Fuente primaria consultada el 2026-10-28: [OpenStax, eventos independientes](https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events). Se aplicó la condición de que un resultado previo no cambia la probabilidad del siguiente. El verificador matemático enumera los 32 resultados de cinco lanzamientos y comprueba P(victoria siguiente | cuatro victorias) = P(victoria siguiente | cuatro derrotas) = 1/2.

La primera respuesta se guarda sólo localmente en `diagnostic`, con su comando en el journal. No suma puntos, no consume azar, no puede reemplazarse después de ver la explicación y sobrevive a recargar. No se presenta como evaluación validada del conocimiento general de probabilidad/estadística ni se envía a un servidor.

## Secuencia jugable

| Ronda | Primera decisión | Segunda decisión |
| --- | --- | --- |
| 1 | Pedir todas las fotos frente a un álbum de cuatro victorias | Describir cuatro ganadas de ocho frente a asegurar la próxima victoria |
| 2 | Rechazar que cuatro derrotas aumenten las chances de ganar | Rechazar que cuatro derrotas aseguren otra derrota |
| 3 | Pedir todas las fotos de otro álbum seleccionado | Contar las victorias de esas fotos sin prometer el futuro |
| 4 | Rechazar que una racha cambie la chance de la próxima | Elegir mostrar todas las fotos, no sólo las ganadoras |

Son ejemplos preparados, identificados como tales, sin sortear otra partida para calificar una respuesta. Al confirmar la primera elección de los álbumes se revela el conjunto completo aun si se eligió mal; el texto lo explica. Cuatro rondas, ocho decisiones; seis buenas decisiones dan el sello. Si no alcanza, dos ejemplos con ayuda y cuatro acciones correctas finitas. La pregunta inicial queda fuera de esos ocho puntos. Se eliminan del nuevo juego K/V, promedios, rangos, presupuesto de observación y la regla de ocho ensayos como requisito de cierre.

El final reutiliza las fotos seleccionadas y completas: pedir la historia completa y describir lo observado frente a garantizar la próxima victoria. La política correcta continúa siendo `archive` y `close`; no cambian el umbral de libertad ni el azar del final.

## Compatibilidad y presentación

Las sesiones nuevas usan `experience: photos-v1`. Los estados sin ese campo conservan el reducer y la interfaz anteriores, validados por replay; se ofrece empezar el nuevo álbum conservando sellos, sin reemplazar un ejercicio en curso silenciosamente. El esquema de guardado pasa a 4 / `campaign-photos-v4`, cargando versiones 1–3. Los clientes anteriores reconocen el esquema 4 como futuro y evitan sobrescribirlo. No se agregan paquetes ni servicios.

Las fotos son tarjetas originales dibujadas con HTML/CSS, estrella/cruz y texto Ganada/Perdida; no son fotos ajenas. Se mantiene papel/ciruela, sans-serif, foco nativo, verde/rojo con símbolos, y disposición responsive actual. Procedencia en `public/asset-manifest.json`.

Skills leídas y aplicadas: `game-designer`, `game-ui-ux` y `webapp-testing` para secuencia de decisiones, texto claro, controles nativos y revisión de capturas. Se conserva Playwright TypeScript existente. La simplificación es una hipótesis de comprensión; T011 de validación humana sigue abierta.

## Validación y entrega

Pruebas específicas: ambas respuestas iniciales sin puntos ni RNG, bloqueo de doble respuesta, recarga, revelación de derrotas, replay de todos los checkpoints, ayuda finita, compatibilidad de sesiones anteriores y migración a guardado 4. El informe definitivo de publicación se registra tras comprobar la versión HTTPS.

Validación de la build local final: 37 pruebas unitarias y ocho recorridos de Ada/Doble/final aprobados. Se verificaron 67 referencias matemáticas, 92 archivos de skills y documentación. Se revisaron las capturas de ambas respuestas iniciales, álbum completo y texto al 200 %. Evidencia seleccionada en docs/evidence/photos/approved-local/ e informe en local-browser-results.json.


## Publicación comprobada

Versión `photos-and-clear-dice-v7.1`, fuente `99a7086986dedb1e7c8a8eba5316223d04e55b45`, deployment `fe040aac8034fa140b49ae82fcc5c14102698768`. [Juego](https://garypoui.github.io/TheGame/) y [PR #7](https://github.com/GaryPoui/TheGame/pull/7), sin merge automático. Las fotos conservan sus números al revelar el álbum completo; se añadieron dos comprobaciones de esa identidad.

Resultado sobre HTTPS: 26/26 recorridos aprobaron sin fallos, omitidos ni casos inestables, y 143/143 archivos coincidieron por SHA-256. Evidencia en `docs/evidence/photos/public-browser-results.json`, `public-integrity.json` y `approved-public/`. Las 37 pruebas unitarias y las 67 referencias matemáticas aprobaron. El commit posterior de registro no cambia la build publicada.

CI de la fuente 99a7086: [40783289937](https://github.com/GaryPoui/TheGame/actions/runs/40783289937), aprobada con instalación limpia, build, 37 unitarias y 26 recorridos de navegador, además de documentación, skills y matemática.
