# Personajes, Doble y evaluación — 2026-10-28

Pedido: cuerpo completo durante diálogos, interfaz de dados clara, Ada más exigente y final sin pistas.

## Implementación

- Tres extensiones de las ilustraciones existentes: Vera con falda y zapatos, Doble con pantalón y zapatos, Ada con falda larga y zapatos. El captor ya era de cuerpo completo. Se usan espacios propios y object-fit contain para que manos y pies entren en el encuadre, también en móvil. Se conservan los archivos anteriores.
- Doble muestra el objetivo antes de las ofertas, coste separado, resultado después de pagar y selección clara. Se eliminan las pequeñas cuadrículas de sus tarjetas; las cuentas avanzadas quedan desplegables. En pantallas angostas las ofertas se apilan. La confirmación no flota sobre el juego y el cuaderno deja de tener un scroll interior limitado. Costes, RNG y puntuación no cambian.
- Ada nueva usa photos-v2: compara proporciones de álbumes con distinto número de fotos (2/4 frente a 4/8; en repetición 3/4 frente a 4/8) y calcula la probabilidad de ganar dos partidas independientes seguidas. Hay tres respuestas posibles y la solución se explica después de confirmar: 1/4 por enumeración de GG, GP, PG y PP. Las preguntas iniciales y ayuda finita se conservan. La dificultad mayor es una intención de diseño, pendiente de validar con personas.
- El final independiente no incluye vista previa calculada de contratos, sumas automáticas de fotos ni explicación del método antes de elegir. Conserva inventarios, reglas, costes y objetivo: quitarlos impediría una evaluación justa. La devolución aparece tras responder. La recuperación se etiqueta como práctica y sigue disponible; tampoco muestra flechas ni explicaciones antes de responder. La marca assisted de guardados conserva su compatibilidad.
- Guardado v5 / campaign-challenge-v5 acepta versiones 1–4. Sesiones photos-v1 y estadísticas antiguas mantienen sus reglas al retomarse; practicar de nuevo abre photos-v2. No se reemplaza un ejercicio en curso silenciosamente.

## Arte y skills

Se leyeron/aplicaron imagegen, game-ui-ux y frontend-design, junto al diseño y pruebas existentes. Los tres assets se generaron con la herramienta integrada, cada uno usando su ilustración anterior como referencia. Prompt compartido: extender el personaje exacto a cuerpo completo de pie, conservar rostro/cabello/vestuario/tinta/acuarela/estilo de animación de los años treinta, incluir ambas manos y zapatos con margen, fondo transparente, sin textos ni rediseño. Archivos en public/art/*-full-v1.png, RGBA 1024×1536, alpha 0–254; hashes y procedencia en public/asset-manifest.json. No son CC0; se conservan las restricciones de los personajes originales. No se agregan paquetes ni servicios.

## Validación

Pruebas específicas de proporciones, variación de repetición, probabilidad conjunta, replay legado y ausencia de pistas calculadas antes del final en tests/unit/challenge.test.ts. Se detectó una carrera de foco al cerrar Ajustes: un evento de cierre tardío podía quitar foco a una opción ya seleccionada con teclado. Ahora sólo se restaura foco si el usuario no pasó a otro control.

Las pruebas humanas, lector de pantalla, GPU física y red controlada siguen en 010/T011. No se afirma que la dificultad o comprensión estén validadas por tener pruebas automáticas. Resultados de publicación se registran al cierre.
