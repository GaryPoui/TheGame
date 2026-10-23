# Feature Specification: Diálogos y tutoriales

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Especificada; implementación pendiente de instrucción posterior
**Input**: Apartado 004 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Aprender durante una acción y repetir ayudas sin perder la ronda. Dependencias: 001; adapta controles de 002 al integrar. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Recibir indicaciones durante predecir, decidir, observar, explicar y reaplicar (Priority: P1)

Como jugador quiero recibir indicaciones durante predecir, decidir, observar, explicar y reaplicar para aprender durante una acción y repetir ayudas sin perder la ronda.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-004-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Repetir explicación o continuar con ayudas ajustadas (Priority: P2)

Como jugador quiero repetir explicación o continuar con ayudas ajustadas para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- Nodo inexistente o ciclo automático.
- Repetir línea con efecto.
- Cerrar y reabrir diálogo.
- Texto largo a zoom 200%.

## Requirements

### Functional Requirements

- **FR-004-01**: Definir líneas, elecciones y efectos como datos con identificadores estables.
- **FR-004-02**: Ejecutar efectos una sola vez y validar que todos los nodos terminan.
- **FR-004-03**: Identificar demostración preparada antes de revelar resultados.
- **FR-004-04**: Separar feedback de decisión, suerte y evidencia de transferencia.
- **FR-004-05**: Ofrecer ayuda gradual, repetición, tamaño de texto y avance manual sin límite de tiempo.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-004-01**: Cada rama de diálogo alcanza un cierre o elección válida.
- **SC-004-02**: Repetir una explicación no cambia puntos ni RNG.
- **SC-004-03**: Las cinco etapas y el rótulo preparado aparecen en tutorial de mesa.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 001; adapta controles de 002 al integrar.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
