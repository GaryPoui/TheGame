# Feature Specification: Mesa de las urnas

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Implementada en corte MVP; validación funcional en docs/mvp-validation.md
**Input**: Apartado 005 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Elegir oportunidades y actualizar probabilidades jugando una mesa completa. Dependencias: 002, 004, contrato/checkpoints mínimos de 009; base visual de 010. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Elegir urna para evento y revisar elección tras observar extracción (Priority: P1)

Como jugador quiero elegir urna para evento y revisar elección tras observar extracción para elegir oportunidades y actualizar probabilidades jugando una mesa completa.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-005-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Completar transferencia o recibir ayuda sin quedar bloqueado por azar (Priority: P2)

Como jugador quiero completar transferencia o recibir ayuda sin quedar bloqueado por azar para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- Empate tras roja U1.
- Evento con probabilidad cero o uno.
- Doble confirmar durante extracción.
- Todas las fichas aleatorias desfavorables.

## Requirements

### Functional Requirements

- **FR-005-01**: Implementar U1–U4 y comparación exacta de proporciones según docs/educational-design.md.
- **FR-005-02**: Mostrar inventario, evento, régimen, bandeja y próxima acción sin revelar resultado futuro.
- **FR-005-03**: Aplicar dos decisiones por ronda, empates óptimos válidos y fichas separadas.
- **FR-005-04**: Ejecutar cuatro rondas, sello por 6/8 o dos microescenarios guiados.
- **FR-005-05**: Actualizar inventario sin reposición y restaurarlo con reposición antes de siguiente acción.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-005-01**: Todos los estados de extracción de U1–U4 coinciden con fracciones exactas.
- **SC-005-02**: La mesa se completa con peor azar y ayuda acotada.
- **SC-005-03**: U4 registra transferencia y ayuda por separado del sello.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 002, 004, contrato/checkpoints mínimos de 009; base visual de 010.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
