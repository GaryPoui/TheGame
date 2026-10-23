# Sistema de interfaz y accesibilidad

Estado: especificación propuesta; no hay pantallas implementadas ni auditoría de conformidad. Consulta de fuentes: 2026-10-22. Complementa el GDD y [dirección visual](art-direction.md).

## Identidad y tokens

Interfaz de expedientes y fichas, con superficies opacas, bordes finos y numeración clara. El papel y los sellos pertenecen al mundo; el texto operativo usa formas simples, sin manchas ni inclinaciones. No añadir framework para conseguir esta estética.

| Token | Valor inicial | Uso |
| --- | --- | --- |
| surface-dark | #181D20 | Paneles sobre escena |
| text-light | #F6EFD9 | Texto principal oscuro |
| surface-paper | #EEE4CB | Explicaciones y registros |
| text-ink | #182426 | Texto sobre papel |
| accent | #F2C66D | Acción y foco sobre oscuro |
| event-a | #B54249 + círculo + «Roja» | Evento A |
| event-b | #397DB9 + triángulo + «Azul» | Evento B |
| spacing | 4, 8, 12, 16, 24, 32 px | Retícula, mínimo 12 px entre acciones |
| radius | 4 px | Controles y tarjetas |

Los tokens son candidatos: validar todas las parejas realmente usadas. No usar texto pequeño en accent sobre papel. Bordes y foco necesitan contraste propio; hover, selección y deshabilitado no se diferencian solamente por color.

Tipografía propuesta: Source Sans 3 para lectura, cifras y controles; distribución original Adobe bajo SIL OFL 1.1, con nombre reservado Source. [Licencia primaria](https://github.com/adobe-fonts/source-sans/blob/release/LICENSE.md). Conservar licencia y copyright al incorporar los archivos, fijar versión/hash y usar WOFF2 autoalojado; no se ha descargado ni instalado la fuente en esta fase. Fallback `Arial, sans-serif`. Evitar otra familia para reducir peso. Números tabulares para tablas; fracciones con texto equivalente (3/5, 60 %), sin fórmulas como imágenes.

Jerarquía inicial: título 32 px, sección 24 px, cuerpo 20 px, etiqueta secundaria 18 px; interlineado 1.45. Subtítulos 24 px por defecto con opciones 20/24/30/36 px y fondo opaco ajustable. Escalado general 100–200 %; reflujo y scroll en paneles, nunca reducción automática hasta texto ilegible. Son propuestas a validar a 1280 × 720 y 1920 × 1080 con zoom del navegador.

## Controles y estados

Botones HTML nativos, altura objetivo 44 CSS px y nombre visible. Estados: normal, hover, focus-visible, activo, seleccionado, deshabilitado y pendiente. Foco: anillo exterior de 3 px con separación de 2 px, contraste ≥3:1 respecto al fondo contiguo. Selección lleva marca y «Seleccionado». Deshabilitado explica requisito en texto accesible, sin tooltip obligatorio. Pendiente anuncia acción y evita doble confirmación.

Tab recorre en orden de lectura; Enter/Espacio activan; Escape cierra capa y restaura foco al disparador. Un diálogo modal contiene temporalmente el foco, tiene título y cierre, y lo devuelve al salir. Pausa y ajustes se alcanzan con teclado; nunca requieren pointer lock. Remapeo incluye exploración, interacción, pausa y navegación; detectar conflictos, permitir cancelar y restaurar valores. Las etiquetas muestran asignación vigente. Arrastrar no es obligatorio: seleccionar origen y destino mediante dos activaciones.

## Pantallas especificadas

| Pantalla | Composición / prioridad | Caso límite |
| --- | --- | --- |
| Inicio | Título, continuar, nueva partida, ajustes, créditos/licencias | Sin guardado: continuar inactivo con explicación; ajustes antes de la intro. |
| Pausa | Reanudar, ayuda, ajustes, salir | No pierde respuesta ni avanza el RNG. |
| Diálogo | Nombre, intervención, continuar, historial y omitir cuando proceda | No avanza solo; texto largo refluye; subtítulos no cubren mesa. |
| Mesa | Objetivo arriba; objetos centrales; acciones e información lateral/inferior | A 200 %, cambiar a panel apilado y permitir alternar vista sin esconder datos necesarios. |
| Tutorial | Una instrucción contextual, «Repetir», «Ayuda», acción disponible | Sin límite de tiempo ni tooltip que desaparezca. |
| Resumen | Decisión, resultado aleatorio y explicación en bloques distintos | «Tu elección tenía mayor valor esperado; esta ronda salió mal»; no marcar razonamiento correcto como error. |
| Registros | Gráfico, leyenda, tabla equivalente, tamaño de muestra y mecanismo | Ejes con unidades y origen declarado; no presentar más muestras como certeza absoluta. |
| Ajustes | Texto/subtítulos, controles, cámara/movimiento, audio, gráficos | Vista previa, restaurar por sección y persistencia validada. |

Gráficos sin 3D decorativo; barras con etiquetas, escala consistente y tabla accesible. Actualizaciones de resultado mediante región de estado moderada; no anunciar cada frame o ficha animada. Inventario visible y estado de la mesa tienen representación DOM; canvas no reemplaza nombres, instrucciones o acciones.

## Criterios de acceso

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) sustenta objetivos de interfaz: texto normal ≥4.5:1, grande ≥3:1, controles y gráficos necesarios ≥3:1, teclado y foco visible, texto escalable. El objetivo interno de foco toma la referencia de apariencia AAA, sin afirmar cumplimiento global AAA. La [lista de Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/) sustenta remapeo, sensibilidad, texto al ritmo del jugador y alternativas al tiempo preciso.

La interfaz HTML accesible no demuestra acceso completo al mundo 3D. En el prototipo se probará una lista de mesas/objetos accionable con teclado, equivalente a apuntar, y descripciones textuales del estado. La navegación espacial para lectores de pantalla requiere prueba específica; queda pendiente hasta implementarla. No afirmar conformidad antes de revisión manual con tecnologías de apoyo y jugadores.

Movimiento reducido elimina balanceo, shake y desplazamiento de cámara; FOV inicial 75° con rango propuesto 60–100°, sensibilidad e inversión por eje. No aplicar desenfoque de movimiento. Texto y símbolos comprensibles con audio apagado y colores desaturados. Cada ronda puede pausarse; ninguna decisión educativa tiene temporizador obligatorio.

## Composición adaptable y flujo

Usar CSS Grid/Flex con contenido que fluye; margen seguro mínimo propuesto 24 px y respeto de `safe-area-inset-*`. No fijar texto con coordenadas de un único viewport. Anchuras de lectura de 45–75 caracteres, alineación izquierda; cifras de tabla a derecha. En ultrawide limitar ancho del panel y mantenerlo próximo a la mesa. El objetivo es escritorio; no se añade soporte móvil como obligación por ejemplos de una skill.

Pila de pantallas explícita: juego → pausa → ajustes. Sólo la capa superior recibe entrada; al retroceder se restauran foco, selección y cámara previa. Las actualizaciones HTML responden a eventos del estado de juego, no consultan el canvas cada frame. Las cadenas pertenecen a datos y los contenedores aceptan expansión de texto.

Esquema propuesto de la vista de mesa (a 200 % se apila):

```text
[Objetivo y requisitos de la ronda]
[Tablero 3D: urna, fichas] [Inventario: círculo Roja ×3 / triángulo Azul ×2]
                         [Probabilidad 3/5 = 60 % y ayuda]
[Seleccionar opción] [Confirmar extracción] [Volver / Ayuda]
[Diálogo o subtítulo con nombre; zona reservada sin tapar objetos]
```

El gráfico estadístico reemplaza inventario en la tercera mesa pero conserva acciones y ayuda en las mismas posiciones relativas. Elegir filas o símbolos se puede hacer con teclado; el foco del panel identifica también el objeto 3D correspondiente sin mover la cámara.

## Tipografía vigente — 23/10/2026

El usuario pidió retirar todas las serifas. La interfaz implementada usa `--font-ui: Arial, Helvetica, sans-serif` para títulos, diálogos, cifras y controles. Créditos y etiquetas canvas de Babylon usan la misma familia sin serifa. Se conservan los tamaños ajustables, el reflujo y la jerarquía existentes; no se distribuyen archivos de fuentes.
