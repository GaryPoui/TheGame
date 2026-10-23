# La Casa del Azar Constitution

## Core Principles

### I. Matemática verificable y azar justo
Las reglas DEBEN existir en TypeScript puro, sin importar el renderizador. Probabilidades finitas
se verifican por enumeración exacta; las simulaciones sólo complementan. El RNG es inyectable,
versionado y reproducible. Ningún oponente accede al futuro ni altera probabilidades ocultamente.

### II. Aprender mediante decisiones
Cada mesa DEBE usar predecir → decidir → observar → explicar → volver a aplicar. La calidad de
la decisión, el resultado aleatorio y la transferencia se registran por separado. El azar no
puede bloquear la campaña; la ayuda acotada habilita continuidad sin certificar dominio.

### III. Alcance compacto y accesibilidad desde el inicio
Una calle, una sala, tres asistentes y un final de mesa, sin combate, backend ni cuentas.
Objetivo de primera partida: 30–45 minutos, pendiente de prueba. Controles reasignables,
subtítulos ajustables, teclado completo, símbolos además de colores y movimiento reducido
son obligatorios. No existen decisiones educativas con tiempo obligatorio.

### IV. Una fuente de verdad y trazabilidad
El prompt del usuario y las decisiones versionadas prevalecen sobre skills. Cada fuente,
dependencia y asset DEBE identificar origen, versión y licencia. Hechos, propuestas e hipótesis
se distinguen. Las APIs de Babylon.js se verifican en fuentes oficiales, nunca en otro motor.

### V. Entregas pequeñas con evidencia
Cada spec DEBE incluir aceptación, casos límite, plan, tareas y validación pertinente.
Una build exitosa no demuestra aprendizaje, accesibilidad ni rendimiento. Las mediciones
DEBEN identificar equipo, navegador, resolución y condiciones. No se afirma trabajo no ejecutado.

## Restricciones técnicas

Babylon.js + TypeScript estricto + Vite; WebGL base, HTML/CSS accesible, GLB preferido y guardado
local versionado. Dependencias estables exactas y lockfile. No introducir servicios pagos,
framework UI, motor físico o shaders propios sin necesidad y decisión registrada.

## Flujo de desarrollo y revisión

Constitución → especificación → aclaraciones → plan → tareas → análisis de consistencia.
La fase actual termina con documentación e instalación publicadas. La implementación necesita
una instrucción posterior. El primer prototipo futuro es una mesa completa en una sala simple;
el resto de la campaña depende de validar ese corte. Revisar secretos, licencias y cambios antes
de cada push; nunca forzar historia ni sobrescribir trabajo ajeno.

## Governance

Esta constitución aplica a agentes y colaboradores. Cambios se proponen por PR con motivo,
impacto en specs y validación; prevalecen instrucciones explícitas del usuario. SemVer:
major cambia principios incompatibles, minor agrega reglas, patch aclara. Toda revisión
debe comprobar los cinco principios y registrar excepciones justificadas en el plan.

**Version**: 1.0.0 | **Ratified**: 2026-10-22 | **Last Amended**: 2026-10-22
