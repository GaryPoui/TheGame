# Feature Specification: Secuestrador y final

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Especificada; implementación pendiente de instrucción posterior
**Input**: Apartado 008 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Combinar lo aprendido para obtener libertad sin nuevas fórmulas. Dependencias: 005, 006, 007, 009; intro 003 para campaña completa. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Aplicar actualización, contratos y registros en el contrato de salida (Priority: P1)

Como jugador quiero aplicar actualización, contratos y registros en el contrato de salida para combinar lo aprendido para obtener libertad sin nuevas fórmulas.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-008-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Continuar con ayuda y ver un epílogo coherente (Priority: P2)

Como jugador quiero continuar con ayuda y ver un epílogo coherente para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- Seis malas decisiones.
- Cero fichas con decisiones correctas.
- Repetir final ya ganado.
- Guardado justo antes de epílogo.

## Requirements

### Functional Requirements

- **FR-008-01**: Habilitar final sólo tras los tres sellos, incluidos asistidos.
- **FR-008-02**: Ejecutar tres rondas y seis acciones del final definido en diseño educativo.
- **FR-008-03**: Abrir salida con 4/6 o dos microescenarios guiados sin rehacer asistentes.
- **FR-008-04**: Reutilizar conceptos, contratos y comparación exacta sin fórmulas nuevas.
- **FR-008-05**: Conservar libertad al repetir final y ofrecer transferencia opcional no bloqueante.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-008-01**: Puerta abre con 4/6 incluso con peor saldo aleatorio.
- **SC-008-02**: Ayuda acotada llega a epílogo sin repetir la campaña.
- **SC-008-03**: Todos los elementos educativos del final se enseñaron previamente.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 005, 006, 007, 009; intro 003 para campaña completa.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
