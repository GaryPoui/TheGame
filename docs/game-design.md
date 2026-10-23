# GDD único — La Casa del Azar

Estado: especificación de diseño, sin implementación. Autoridad de reglas: [educational-design.md](educational-design.md). No crear otro GDD divergente. Visión: [vision.md](vision.md).

## Bucle y controles

Explorar sala → acercarse a mesa → leer objetivo y requisitos → sentarse → predecir colocando un marcador → elegir una acción de juego → observar extracción/contrato/datos → comparar plan y resultado → aplicar en un estado diferente. El marcador es opcional para progreso, útil para reflexión; no hay cuestionarios de opción múltiple que sustituyan la acción.

Exploración: WASD/flechas configurables, mouse para mirar, E/Enter para interactuar, Escape para pausa. Toda interacción de mesa tiene equivalente HTML enfocable, Enter confirma, Escape cancela antes de confirmar. Sin decisiones cronometradas. Cursor liberado en diálogos, pausa y mesa; recuperar captura requiere acción explícita. Configuración de sensibilidad, inversión, subtítulos, escala y movimiento reducido antes de empezar.

## Estados y habilitación

Los nombres canónicos son los de [arquitectura](architecture.md): `boot → menu → street → blackout → restrained → released → room → dialogue → table → summary → room`; tras tres sellos `room → finale → ending`. `pause` conserva subestado. No existe una segunda máquina de campaña en el GDD. Los nombres de experiencia «introducción», «exploración», «mesa» y «epílogo» corresponden respectivamente a `street/blackout/restrained/released`, `room`, `dialogue/table/summary` y `ending`.

Después de la explicación inicial (`restrained → released`) se abren grilletes de la silla; queda una pulsera de latón sin efecto mecánico y la puerta permanece cerrada. Movimiento libre sólo en `room` (y tramo caminable `street`); interacción educativa desde `dialogue` al abrir `table`. `table` contiene subfases de acción `ready/committed/revealed/reviewed`, definidas en diseño educativo, que no sustituyen los estados de campaña. No alternar controles durante una animación.

Cada decisión confirmada resuelve resultado, méritos y estado RNG en un snapshot estable antes de animar. Persistir ese snapshot, y otro al cerrar la explicación/ronda; no serializar una animación a medio reproducir. Salir o recargar restaura la decisión ya resuelta y su explicación pendiente, nunca vuelve a tirar ni repite recompensas. Antes del compromiso se conserva la próxima acción legal. Si la escritura falla, avisar y conservar estado en memoria; no ofrecer una confirmación exitosa de guardado.

## Distribución

Una sala legible con puerta de salida, tres mesas periféricas y mesa del anfitrión al fondo. Placas muestran «Disponible», «Requiere sello de …», «Superada» y «Práctica». No puzzle de navegación. Llegar a cada mesa desde el centro en menos de 10 segundos como objetivo. Opcional «Ir a mesa» por menú accesible, sin ventaja educativa.

## Tres decisiones

| Mesa | Decisión principal | Información | Consecuencia | Prueba de diseño |
|---|---|---|---|---|
| Urnas / Vera | Elegir contenedor y volver a elegir tras consumir una ficha | Contenidos, reposición y evento | Cambia probabilidad del sello ficticio | Jugador señala qué ficha cambió su plan y resuelve estado nuevo |
| Contratos / Doble | Elegir flujo estable o pago variable según encargo | 36 pares, costes, pagos y objetivo | Saldo aleatorio y mérito determinista separados | Cambia elección cuando cambia objetivo sin culpar a una tirada |
| Registros / Ada | Elegir qué registro auditar y qué decisión autoriza la evidencia | Mecanismos conocidos, procedencia, n, datos y coste de observación | Compra bloque pertinente o cierra informe prudente | Rechaza selección favorable y termina de observar cuando ya cumple la regla |

Los oponentes son presentadores y adversarios retóricos, no jugadores que ocultamente cambian ofertas. No copiar nombres, presentación ni identidad de juegos comerciales. Las mecánicas genéricas de urnas, contratos y auditoría se combinan en una puesta propia.

## Puntuación y progresión

Cada mesa tiene cuatro rondas de dos decisiones observables; cada decisión da 1 mérito si satisface el objetivo publicado, 0 si no. Fichas de resultado se muestran por separado y jamás compran méritos. 6/8 habilita sello independiente. Menos de 6 abre dos microescenarios guiados de dos acciones cada uno; no hay límite de intentos, temporizador ni RNG para su validación, y las ayudas finalmente señalan la acción legal. Completar los dos habilita sello «con ayuda». Esto limita el contenido adicional a cuatro acciones guiadas; no promete tiempo máximo si el jugador no actúa. Puede repetir transferencia para quitar etiqueta sin perder progreso.

El final tiene tres rondas de dos decisiones: 4/6 para conclusión independiente, o dos microescenarios guiados para la misma libertad con etiqueta de ayuda. No game over por saldo. Abandonar una ronda antes de confirmar no consume RNG. Tras confirmar, reabrir conserva resultado; nunca ofrece reroll mediante recarga.

## Presentación y feedback

Cámara estable en exploración; conversación con mirada suave opcional; mesa con objetos grandes; apertura con planos controlados. Animación y audio breves para anticipar, revelar y asentar. Reacción de calidad de decisión distinta de reacción al resultado: «Plan correcto; esta vez salió azul». Colores acompañados por R/triángulo y A/círculo; dados distinguibles por borde y etiqueta.

## Hipótesis y puerta de producción

Antes de ampliar campaña, observar 5 sesiones exploratorias de primera mesa: tiempo, acciones erróneas, uso de ayuda, identificación de reposición, explicación de mala suerte, disfrute autoinformado. No es ensayo de eficacia. Si predominan clics siguiendo ayudas sin comprensión, revisar mecánica antes de arte final. Tras prototipo, comparar transferencia inmediata y diferida si hay recursos y consentimiento; no recolectar datos personales por defecto.
