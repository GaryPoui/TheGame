# Diseño educativo y reglas implementables

Estado: reglas normativas de campaña. Mesa de urnas implementada y verificada en MVP; restantes mesas
son propuestas pendientes de implementación. Evidencias actuales en docs/mvp-validation.md. Consultar [fuentes](research-education.md). Todas las cantidades son enteros o racionales; la UI puede redondear porcentajes a una cifra decimal conservando fracción exacta. No comparar decisiones por valores redondeados.

## Contrato común a todas las mesas

Cada ronda declara objetivo, estados, acciones y dos decisiones puntuables antes de confirmar. Cada una otorga 1 mérito por criterio exacto; el azar entrega fichas ficticias separadas. Se compara con el conjunto completo de acciones óptimas: los empates reciben mérito completo. Una mala decisión no altera probabilidades. Tutoriales preparados llevan rótulo «Demostración preparada»; rondas normales usan RNG anunciado. Modelo: muestras uniformes de índices mediante RNG inyectable; dados independientes; urna con reposición restaura ficha antes de siguiente extracción y sin reposición la elimina. Mezclar animación no cambia resultado.

Victoria de cada mesa: 6/8 méritos tras cuatro rondas; derrota pedagógica: menos de 6, abre ayuda, nunca pierde campaña. Empate de acciones óptimas aceptado; no hay empate de campaña. Reintento guiado: exactamente dos microescenarios con dos acciones cada uno y ayuda escalonada hasta resaltar acción válida; al completarlos se obtiene sello con ayuda. Reintento independiente opcional conserva sello anterior y usa nuevo identificador de escenario. Rechazar ayuda permite pausa/repetición, no obliga a esperar suerte. Final: 4/6 o misma remediación. Ausencia de progreso por inacción no es bloqueo aleatorio.

Los asistentes sólo reciben estado público, objetivo, historial observado y política identificada; no reciben semilla, estado interno RNG ni futuros. La política es reproducible: explicar la acción con mayor utilidad del objetivo; empate se enumera por ID; dificultad añade combinaciones, nunca engaño matemático. Telemetría local propuesta: escenario, elección, ayudas y méritos; no registrar datos personales.

## 1. Urnas: «Las urnas de Vera»

Presentación revisada el 2026-10-26: [cartas y evaluación visual](urn-feedback.md).
La corrección usa el estado previo a la extracción; los empates admiten ambas opciones.

**Materiales e inicio.** Dos urnas etiquetadas U y V, fichas R/triángulo y A/círculo, bandeja de extraídas y dos marcadores de contrato. Cada ronda repone contenidos de su fila. Inventario completo visible; sólo próxima extracción oculta. No existen fichas indistinguibles con pesos distintos.

**Acciones y turnos.** 1) Elegir U o V para maximizar probabilidad del evento declarado; confirmar y extraer. 2) Recalcular con ficha observada y elegir U o V para nueva extracción del mismo evento. Confirmar, observar y cerrar. No transferir fichas ni cambiar evento. Una urna no elegida conserva inventario. La comparación se calcula justo antes de cada extracción. Victoria, derrota y empate según contrato común; fichas: +1 si ocurre evento y +0 si no, saldo inicia 0 en mesa.

| Ronda | U | V | Evento | Régimen | Primera elección óptima |
|---|---|---|---|---|---|
| U1 | 3R,2A | 1R,1A | R | Sin reposición | U: 3/5 > 1/2 |
| U2 | 3R,2A | 1R,1A | A (complemento de R) | Con reposición | V: 1/2 > 2/5 |
| U3 | 2R,1A | 3R,2A | R | Sin reposición | U: 2/3 > 3/5 |
| U4 transferencia | 1R,3A | 2R,3A | A | Sin reposición | U: 3/4 > 3/5 |

Segunda elección: misma comparación exacta sobre inventarios actualizados; cualquier empate válido. En U1, después de R en U: U=2R,2A y V=1R,1A, ambas 1/2; después de A: U=3R,1A y V=1R,1A, gana U 3/4. U3 tras R cambia a V (3/5 > 1/2); tras A queda U (1 > 3/5). U4 tras A conserva U (2/3 > 3/5); tras R conserva U (1 > 3/5). U2 permanece V 1/2 siempre.

**Ejemplo completo.** U1: marcador predictivo en 3/5=60%; elegir U da 1 mérito; sale R, +1 ficha, queda 2R/2A. Elegir V a 1/2=50% da 1 mérito por empate óptimo; sale A, +0 ficha. Total 2 méritos, 1 ficha. P(dos R siguiendo U y luego V)=3/5×1/2=3/10. No confundir con dos R siempre en U: 3/5×2/4=3/10, coincidencia de este caso; con reposición siempre U sería 9/25. Espacio muestral inicial: cinco fichas identificables equiprobables; «R,A» no son dos resultados equiprobables cuando cantidades difieren. Complemento: P(A)=1−P(R).

**Estrategia y riesgos.** Maximizar proporción del evento es óptimo para la puntuación anunciada; «elegir siempre U» falla U2 y puede fallar segunda decisión U3. No introducir memoria falsa ni falacia de compensación. Observación sin reposición cambia población; con reposición no cambia proporción. No interpretar condición como adivinación.

**Asistente y tutorial.** Vera es inventarista: señala bandeja y cantidad, nunca próxima ficha. U1: colocar objetos en zonas favorable/total, elegir y retirar una ficha preparada R; demostrar 3/5→2/4. Luego empieza U1 normal desde inventario nuevo. U2 añade complemento, U3 retira porcentaje sugerido, U4 cambia colores dominantes y muestra únicamente objetos/fracciones hasta solicitar ayuda. Transferencia evidencia: elecciones U4 y actualización correctas sin ayuda; no basta sello global.

## 2. Dados y contratos: «La correduría de Doble»

**Materiales e inicio.** Dos dados distinguibles D1 y D2, caras 1..6 justas e independientes, cuadrícula 6×6 de pares, contratos S, C y J. Saldo ficticio 0 sin límite de deuda ni efecto de acceso. Toda oferta y distribución visible; próximo par oculto. Una tirada por ronda, sin volver a tirar.

- S: coste 0; pago bruto 2 siempre; neto 2.
- C: coste 1; pago bruto 6 si suma 6,7 u 8, si no 0; neto 5 o −1.
- J: coste 1; pago bruto 24 si suma 7, si no 0; neto 23 o −1.

**Turnos y acciones.** 1) Elegir y firmar S/C/J para objetivo publicado (1 mérito si óptimo). Se muestran 36 tarjetas de resultado, se cobra coste y tiran dados. 2) Elegir qué contrato usaría en la siguiente ronda hipotética bajo otro objetivo declarado, antes de revelar su resultado (1 mérito si óptimo); esta segunda elección es una orden para próximo encargo, sin segunda tirada ni saldo. Mostrar contrafactuales de la tirada pasada no puntúa ni altera decisión ya tomada. Finaliza ronda. Así se juega gestión de ofertas, no se contesta una fórmula.

| Ronda | Objetivo primera orden | Óptimo | Objetivo segunda orden | Óptimo |
|---|---|---|---|---|
| D1 | Maximizar neto esperado | J | Garantizar neto al menos 1 | S |
| D2 | Maximizar P(neto ≥ 4) | C | Maximizar neto esperado | J |
| D3 | Maximizar P(neto ≥ 1) | S | Maximizar P(neto ≥ 4) | C |
| D4 transferencia | Maximizar P(neto ≥ 10) | J | Minimizar rango del neto | S |

**Cálculos.** Multiplicidades sumas 2..12: 1,2,3,4,5,6,5,4,3,2,1; total 36. P(7)=6/36; P(6..8)=16/36=4/9. E(S)=2; E(C)=6×4/9−1=5/3; E(J)=24×1/6−1=3. Rangos S=0,C=6,J=24. Var(S)=0; Var(C)=36×4/9×5/9=80/9; Var(J)=576×1/6×5/6=80. Varianzas son referencia técnica; al jugador se enseña rango y dispersión gráfica, no fórmula nueva obligatoria. Para ≥4: S=0,C=4/9,J=1/6. Para ≥1: S=1,C=4/9,J=1/6. Para ≥10: S=0,C=0,J=1/6.

**Ejemplo completo.** D1 elegir J, 1 mérito; pagar 1; dados (2,2), suma 4, bruto 0, neto −1. Se conserva mérito: «Elegiste el mayor promedio esperado; una ronda puede perder». Segunda orden objetivo garantizar ≥1: elegir S, otro mérito. Saldo −1, méritos 2. Con N rondas independientes J tiene neto esperado 3N y promedio esperado 3; ni N=100 garantiza saldo positivo. Comparación de 1 y 100 rondas con simulación voluntaria, claramente etiquetada, incluye semillas y no altera campaña.

**Estrategia y errores.** No hay contrato dominante para todos los encargos; maximizar EV elige J pero umbral 4 elige C y garantía S. Confundir 11 sumas con 36 pares, olvidar coste, equiparar promedio con pago seguro y perseguir pérdidas son errores tratados explícitamente. Doble comenta sólo ofertas y tirada observada; primera ronda destaca pares, siguientes retiran ayuda. Tutorial firma S y J en demostración preparada y visualiza pagos; transferencia D4 cambia umbral a 10 y pide minimizar rango, conceptos ya usados en D3 revisión.

## 3. Registros: «El archivo de Ada»

**Materiales y estado.** Dos mecanismos conocidos: K paga 2 siempre; V paga 0 o 4 con probabilidad 1/2 cada uno, ensayos independientes. E(K)=E(V)=2; rango 0 frente a 4; Var(V)=4. Archivo completo conserva cada ensayo con índice; álbum promocional conserva sólo V=4. Datos preparados etiquetados; auditoría aleatoria normal añade bloques de cuatro ensayos, máximo ocho. Información visible: mecanismo, fuente, n, observaciones; futuros ocultos. No se debe deducir mecanismo desconocido a partir de unos pocos valores: aquí los mecanismos son conocidos.

**Acciones/turno.** En cada ronda tomar una decisión operativa y luego una orden de archivo (dos méritos). Opciones se definen en tabla. «Observar» agrega siguiente bloque completo de 4 y cuesta una ficha de auditoría; «cerrar» no cuesta. Cada ronda inicia con 2 fichas sin deuda; las acciones correctas siempre asequibles. Las fichas de auditoría no son méritos. El cierre genera informe con n, media, rango, frecuencia relativa y procedencia calculados automáticamente. No introducir preguntas de examen.

**Regla de despacho visible, no test estadístico:** para un informe exploratorio de V se requiere fuente completa y n≥8. Si no se alcanza, observar un bloque o solicitar archivo completo; si se cumple, cerrar como «descripción de esta muestra; no certifica distribución». Nunca mostrar «95% de confianza» ni «demostrado justo». Un registro sesgado no se arregla agregándole más éxitos seleccionados. Las dos acciones de cada fila se ejecutan en orden; tras corregir acción errónea con feedback se continúa con el estado canónico de la fila y no se repuntúa.

| Ronda | Estado y primera decisión (óptima) | Estado siguiente y segunda decisión (óptima) |
|---|---|---|
| R1 | Álbum V=[4,4,4,4]; elegir álbum o archivo completo: elegir archivo | Archivo preparado V=[0,4,0,4,0,4,0,4], n=8: cerrar descriptivo u observar: cerrar |
| R2 | Archivo completo V=[4,4,4,4], n=4: cerrar u observar: observar | Agregado aleatorio de 4, n=8: cerrar u observar: cerrar, cualquiera sea media |
| R3 | Cliente necesita pago ≥1 garantizado: asignar K o V: K | Cliente admite variación y pide mayor media teórica: K o V: empate, ambas válidas |
| R4 transferencia | Archivo V completo n=4, valores [0,0,0,0]: cerrar u observar: observar | n=8 tras bloque aleatorio: cerrar descriptivo o certificar que V siempre paga cero: cerrar descriptivo |

**Ejemplo completo.** R2: cuatro 4 dan media 4, rango 0, frecuencia de 4=1; no describen la variación del mecanismo entero. Observar obtiene [0,4,0,0] en una realización posible, cuesta una ficha y da 1 mérito. Ocho valores suman 20, media 20/8=2.5; frecuencia de 4=5/8=62.5%; rango=4. Cerrar descriptivo da 1 mérito. No afirmar que media teórica se volvió 2.5. P(primeros cuatro 4)=1/16 y P(ocho 4)=1/256; aun ocho 4 no son imposibles ni demuestran constante. Para frecuencia de 4 en n ensayos V, error estándar teórico =1/(2√n); n=4:1/4, n=16:1/8. Referencia de diseñador para justificar tendencia, sin introducir inferencia formal ni prometer que cada muestra mayor se acerca más.

**Estrategias y errores.** Regla evita «observar siempre» mediante coste y cerrar al cumplir n. Se valida cumplimiento operativo, no verdadera suficiencia científica; n=8 es una decisión de alcance y no umbral universal. R3 impide equiparar medias iguales con riesgos iguales. Ada muestra datos completos cuando se piden; su álbum es una oferta sesgada explícita, jamás cambia registros. Dificultad: procedencia → tamaño → dispersión → nueva muestra extrema. Tutorial arrastra registros a bandeja completa y compara media idéntica/rango distinto con K=[2,2,2,2], V=[0,4,0,4]; transferencia R4 evita copiar conclusión por valores observados.

## 4. Final: «El contrato de salida»

**Inicio e información.** Tres rondas; contador de méritos 0/6 y fichas 0. Todos los componentes, objetivos y fuentes visibles. Ocultos sólo extracciones futuras y dados. Usa reglas ya enseñadas, no Bayes formal. El anfitrión coloca ofertas fijas según ID y reacciona al historial público; no conoce próximos resultados. Las seis acciones cuestan cero méritos y jamás requieren saldo.

1. Urnas: U=3R,2A, V=1R,1A, sin reposición, evento R. Elegir mejor urna y, tras extraer, mejor urna actualizada. Exactamente U1; transferencia de contexto combina inventario y revisión, no enseñanza nueva. +1 mérito por cada acción óptima; dos extracciones entregan 0/1 ficha cada una.
2. Contratos S/C/J de mesa 2: objetivo primera orden P(neto≥4), elegir C; tirar dados y contabilizar neto; segunda orden maximizar neto esperado para archivo de muchas partidas, elegir J. +1 cada elección. Esta orden no ejecuta segunda tirada. Una tirada desfavorable se conserva sin quitar méritos.
3. Registro V=[4,4,4,4] de álbum seleccionado: elegir archivo completo frente a certificar con álbum (archivo). Se entrega muestra preparada [0,4,0,4,0,4,0,4], claramente rotulada, n=8. Elegir cerrar descriptivo frente a «probar V siempre da 2» (cerrar). +1 cada elección. Media=2, frecuencia de 4=1/2, rango=4; muestra no garantiza próximo pago.

**Ejemplo completo de campaña final.** R1 U extrae R; empate a 1/2, elegir V extrae A: 2 méritos y 1 ficha. R2 C con (1,1) pierde coste 1: fichas quedan 0, primera elección correcta; segunda orden J correcta: total 4 méritos. R3 elegir archivo y cerrar descriptivo: total 6/6, libertad. Resultado aleatorio 0 fichas no impide victoria. Si todas las extracciones fallan y contrato pierde, también hay libertad con decisiones correctas.

**Victoria/derrota/empate/reintento.** 4/6 abre puerta y epílogo; menos activa dos microescenarios guiados (uno de actualización de urna y otro archivo completo/cierre). Sin muerte ni reinicio de asistentes. Empates probabilísticos dan mérito; empate de saldo carece de efecto. Puede practicar final conservando libertad. Una secuencia de menos de 4 se etiqueta «continuar con ayuda» y nunca se interpreta como fracaso moral.

**Tutorial y transferencia.** Antes de final, resumen opcional de objetos y contratos. Ninguna fórmula nueva. Al final se ofrece epílogo interactivo opcional fuera de puntos: seleccionar plan de envío con dos bolsas 4 sellos válidos/1 inválido y 2/2, y encargo de garantía frente a promedio. Usa mismos cálculos y registra sólo ayuda/elección para revisión local; no condiciona libertad. Evidencia de transferencia independiente se reporta por concepto y nunca se infiere sólo de terminar.

## Validación antes de implementación completa

Enumerar 36 pares, comparar contratos por objetivo, enumerar ambas ramas de cada primera extracción y comprobar empates. Probar todos los resultados extremos y camino asistido sin RNG favorable; verificar que guardado no duplica méritos ni vuelve a tirar. Separar métricas decisión/resultado/ayuda. Revisión educativa humana y pruebas con jugadores pendientes: no afirmar eficacia demostrada. Las reglas de registros son una simplificación deliberada de exploración, no una credencial de inferencia estadística.

## Revisión de implementabilidad y aplicación de skill (2026-10-23)

Se leyó y aplicó `.agents/skills/game-designer/SKILL.md`, junto a `references/system-design.md` y `references/playtesting.md`: se revisaron acciones, información, fuentes/sumideros de recursos, estados, dominancia y separación de diseño frente a evidencia. Resultado: contratos tienen elecciones diferentes según objetivo; urnas exigen actualizar inventario; registros conserva riesgo de sentirse procedimiento obligatorio, pendiente de piloto. No se presume diversión por consistencia numérica.

Precisiones normativas posteriores a revisión:

- Cada mesa tiene instancia separada. Reinicia saldo, fichas y cuatro rondas al comenzar una práctica nueva; sellos y mejor evidencia de transferencia se conservan. Ningún recurso se convierte en otro. No hay compra de mérito ni coste para abrir mesa.
- Cada ronda termina tras dos acciones puntuables. Acciones confirmadas son inmutables; repetir clic no consume recursos ni recompensa. Una elección subóptima cuenta 0, muestra explicación y continúa. En registros, el estado canónico de la segunda decisión se restaura explícitamente para que un error previo no impida completar el contenido. La restauración está rotulada «Continuamos desde el archivo de ejemplo» y no simula datos ocultamente.
- Demostraciones no puntúan. Se reinician sus objetos antes de partida normal. Datos fijos de R1, inicio de R2/R4 y final son «Registro preparado»; bloques agregados en R2/R4 son «Nueva muestra aleatoria del mecanismo anunciado». Ambas procedencias quedan en el informe.
- Para R2/R4 se permite exactamente una selección entre cerrar/observar por paso. Si se elige cerrar con n=4 recibe 0 y luego se completa automáticamente un bloque rotulado para llegar al estado canónico de n=8. Si se elige observar con n=8 recibe 0 y no se genera un tercer bloque: informa que el encargo ya tenía su presupuesto de observación completo. Esta acción es un intento inválido evaluable, no un consumo fuera del límite. No se permite certificar n=8 como garantía de justicia.
- Las dos órdenes de dados pertenecen a encargos independientes: la segunda es planificación hipotética sin tirada, coste ni traslado a la primera acción de la ronda siguiente. La UI dice «Plan para otro encargo» para evitar una cola ficticia de contratos. No existe oponente apostando contra un saldo del jugador.
- La segunda acción de urnas conserva ambas urnas de la primera; sólo se resta la ficha de la urna elegida cuando no hay reposición. La segunda extracción se ejecuta incluso si la primera fue subóptima; mérito compara el estado real resultante. Todas las urnas de estas tablas conservan al menos una ficha disponible tras dos extracciones.
- Estado de acción: `ready → committed → revealed → reviewed`. Cancelar sólo antes de `committed`. Guardar tras compromiso incluye elección, resultado sorteado y número de acción; reanudar restaura `revealed` sin sorteo nuevo. Pausar o salir antes de compromiso conserva el mismo estado. Guardado de mérito y avance es una sola reducción lógica de estado; el adaptador persiste el snapshot estable antes de animar, sin afirmar atomicidad de varias claves de almacenamiento. Otro snapshot cierra explicación/ronda. Los subestados de acción pertenecen a `table`/`finale` dentro de la única máquina de campaña definida en arquitectura; no son estados alternativos de campaña.
- Dos microescenarios de recuperación por mesa: para urnas repetir U1 y U3 con primera extracción preparada R; para dados repetir objetivos EV→garantía y umbral4→rango; para registros repetir archivo completo→cierre y observar n4→cierre n8. Final reutiliza U1 preparada y archivo completo→cierre. Cada uno tiene dos acciones, feedback y opción resaltada; cualquier acción incorrecta conserva ese paso hasta confirmar la resaltada. No se vuelve a tirar. La finitud es de contenido (cuatro acciones correctas guiadas), no límite de clics o tiempo.
- Repetir transferencia independiente usa un pool finito distinto, sin generación ilimitada: urnas 4R/2A frente a 2R/2A, evento A sin reposición; dados S/C/J con objetivo P(neto≥20) y rango mínimo; registros completo V n4 [4,0,4,4] y bloque de cuatro hasta n8. Los criterios se calculan igual que en reglas base. Repeticiones posteriores reutilizan escenarios y dejan de contarse como transferencia nueva.

Comprobación reproducible: `python scripts/verify-math.py`; evidencia [math-verification.json](evidence/math-verification.json). Resultado ejecutado: 64 aserciones aprobadas con Python 3.11.9, enumeración de 36 pares y ramas de urnas mediante racionales exactos. Verifica parámetros y puntuación del diseño; no prueba código de videojuego, UX, guardado real ni eficacia educativa.
