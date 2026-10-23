# Narrativa y guion de introducción

Estado actual: apertura breve implementada en el MVP; la secuencia de calle y el final de
campaña descritos más abajo siguen propuestos. Título provisional: La Casa del Azar. Tensión
y humor oscuro moderado, sin violencia gráfica. «Saltar introducción» lleva a la sala, donde
se recuerda que las manos están libres y la puerta cerrada.

## Apertura vigente del MVP — revisión v3

Por instrucción del usuario, la sala comienza completamente a oscuras. A los 1,8 segundos
aparece el captor adaptado de las referencias de Gambito; a los 3,3 segundos empieza a
encenderse la sala. El texto se avanza manualmente. Movimiento reducido abrevia la secuencia.
Tiempos, retratos y procedencia en [Teatro de tinta](ink-theatre.md).

- El anfitrión: «Ah… por fin. Tu libertad se juega acá. La suerte reparte; vos vas a tener
  que entender la mano».
- El anfitrión: «Los grilletes se abren. Podés moverte; la puerta seguirá cerrada. Tres
  asistentes. Tres sellos. Después, una partida conmigo y la puerta se abre».
- Vera: «En esta casa una buena decisión puede terminar mal. Eso no la convierte en una
  mala decisión. Te voy a mostrar por qué».

El MVP presenta liberación e ingreso mediante texto y selector de mesa. No contiene aún
calle caminable, grilletes modelados, actuaciones por cuadros ni final contra el captor.

## Premisa y personajes

El anfitrión llama «azar» a todo lo que le conviene, incluso a sus propias decisiones. Los asistentes conocen su oficio y sus contradicciones. Ganar no consiste en demostrar que el azar desaparece, sino en identificar qué puede elegirse y qué permanece incierto.

- Vera, inventarista de urnas: precisa, ordena compulsivamente, cuenta con los dedos; «Lo que sacaste ya no está adentro. Mi contabilidad suele ser así de radical».
- Doble, corredor de contratos: dos solapas desiguales, entusiasmo mercantil y pausa al mencionar costes; «El promedio es magnífico. La noche individual tiene carácter».
- Ada, archivista: expresiva con ceja y sello, protege registros completos; «Este álbum sólo guarda victorias. También mi currículum. Ninguno es una muestra honesta».
- El anfitrión: teatral, convierte incertidumbre en autoridad; al perder, se aferra al reglamento que él mismo firmó. No hace trampas al RNG: su antagonismo es retórico y narrativo.
- Protagonista: silencioso por defecto; decisiones mediante acciones. No requiere avatar completo ni brazos animados durante exploración.

## Propuesta de apertura ampliada de campaña (objetivo 100–130 segundos)

| Tiempo aproximado | Imagen/acción viable | Texto/subtítulo y sonido | Control |
|---|---|---|---|
| 0–20 s | Calle modular, plano a altura de ojos; 6–10 m caminables | Ambiente de noche, un paso detrás; texto opcional «Llegar a casa» | Movimiento y mirada; tutorial de controles |
| 20–25 s | Sombra fuera de campo, giro controlado opcional, corte a negro sin forcejeo | Golpe seco suave, corte ambiente; sin grito obligatorio | Bloqueo breve anunciado; versión reducida funde directamente |
| 25–40 s | Despertar ante mesa; grilletes visibles como props estáticos | «Bienvenido. Te debo una explicación. Y, técnicamente, una disculpa» | Mirada limitada configurable, sin movimiento |
| 40–65 s | Anfitrión en plano medio, gesto simple y foco estable | «Tres asistentes. Tres sellos. Después, una partida conmigo. Si la completás, la puerta se abre» | Avanzar texto, historial, pausa; nunca espera automática obligatoria |
| 65–85 s | Primer plano estable de cerradura abriéndose; manos sólo sugeridas por sombra | «La silla era para la presentación. Podés moverte. La pulsera es puro protocolo: no muerde» | Se abren grilletes de silla; persiste pulsera decorativa |
| 85–105 s | Plano general de sala y placas | Vera: «Empezá acá. Traé tus sospechas; las fichas ya las puse yo» | Devuelve control explícitamente; mensaje «Movimiento habilitado» |
| 105–130 s | Jugador llega a Vera; mesa accesible directa por menú | «Las otras mesas muestran lo que necesitan. Acá no hace falta apurarse» | Exploración y E/Enter habilitados |

Los tiempos son metas de puesta en escena; lectura y pausa no tienen límite. Todos los diálogos se avanzan manualmente. La versión saltada muestra: «Estás en la sala. Ganá tres sellos y completá la mesa final. Tus manos están libres; la puerta sigue cerrada».

## Intervenciones de mesa

Antes de cada ronda: una línea de objetivo, una reacción gestual, apertura inmediata del tablero. Tras decidir: no interrumpir la lectura del estado. Tras observar: máximo dos frases, una sobre el resultado y otra sobre la elección. Ejemplo de buena decisión/mal resultado: «Salió azul. Elegiste la mayor probabilidad de roja; esa elección no prometía certeza». Ejemplo de error/suerte: «Salió roja, pero tu urna tenía menor proporción. El premio llegó; el plan puede mejorar».

## Final y cierre

Con tres sellos se desbloquea anfitrión. «Acepto los mismos contratos. Una concesión sorprendentemente razonable». Al cumplir ruta independiente o asistida abre la puerta sin otra tirada. «El azar no me hizo perder. Firmar ese reglamento fue una decisión». Calle final reutiliza escenario inicial, funde a resumen de decisiones, ayudas y resultado separados. No secuela obligatoria ni amenaza que anule la libertad ganada. Opción de práctica desde menú.

## Producción de contenido

Diálogos como datos con IDs estables `intro.host.offer`, `urn.goodDecision.badOutcome`, etc.; intención, emisor, texto, gesto y disparador. Subtítulos obligatorios ajustables y comprensión sin audio. No ligar avance a duración del clip ni producir doblaje completo como requisito. Validar lectura, tono y adecuación de contenido con usuarios antes de actuación final.
