# Feature Specification: Cámara e interacción

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Implementada en el teatro de tinta; adaptación y evidencia en [campaña](../../docs/campaign-implementation.md).
**Input**: Apartado 002 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Explorar y elegir una mesa sin perder comodidad ni control. Dependencias: 001. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Acercarme e interactuar con una mesa disponible (Priority: P1)

Como jugador quiero acercarme e interactuar con una mesa disponible para explorar y elegir una mesa sin perder comodidad ni control.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-002-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Cambiar sensibilidad y jugar sólo con teclado (Priority: P2)

Como jugador quiero cambiar sensibilidad y jugar sólo con teclado para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- Pointer lock rechazado o perdido.
- Tecla repetida o acción doble.
- Foco fuera del canvas.
- Colisión y mesa ocluida.

## Requirements

### Functional Requirements

- **FR-002-01**: Definir modos exploración, diálogo, mesa y cinemática, con transición cancelable.
- **FR-002-02**: Mostrar requisitos y motivo de bloqueo antes de entrar a una mesa.
- **FR-002-03**: Reasignar movimiento e interacción con detección de conflictos y reset.
- **FR-002-04**: Permitir lista de mesas por teclado y devolver foco/posición al salir.
- **FR-002-05**: Respetar reducción de movimiento y detener entradas al abrir pausa.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-002-01**: Todas las mesas pueden inspeccionarse con teclado sin mouse.
- **SC-002-02**: Ninguna transición deja movimiento activo en una mesa.
- **SC-002-03**: Cambiar bindings actualiza indicaciones sin reiniciar.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 001.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
