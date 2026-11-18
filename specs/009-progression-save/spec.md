# Feature Specification: Progresión y guardado

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Implementada y verificada por reglas y recorridos automáticos; validación humana pendiente. Ver [evidencia de campaña](../../docs/campaign-implementation.md).
**Input**: Apartado 009 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Conservar progreso y poder continuar ante errores de almacenamiento. Dependencias: 001; contrato mínimo antes de 005, integración completa tras 008. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Ver requisitos y conservar sellos al volver al juego (Priority: P1)

Como jugador quiero ver requisitos y conservar sellos al volver al juego para conservar progreso y poder continuar ante errores de almacenamiento.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-009-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Recuperar backup o continuar en memoria ante guardado inválido (Priority: P2)

Como jugador quiero recuperar backup o continuar en memoria ante guardado inválido para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- JSON truncado o campos maliciosos.
- Cuota y SecurityError.
- Versión futura.
- Dos pestañas con revisión distinta.

## Requirements

### Functional Requirements

- **FR-009-01**: Centralizar gates urnas→dados→registros→final y distinguir sello independiente/asistido.
- **FR-009-02**: Persistir checkpoints estables después de cada decisión y resultado resueltos antes de animación, y al terminar ronda con versión de esquema y contenido.
- **FR-009-03**: Validar datos, recuperar backup y rechazar versión futura sin sobrescribirla.
- **FR-009-04**: Mantener RNG y revisión para impedir repetición involuntaria de tiradas o méritos.
- **FR-009-05**: Permitir continuar sin storage con aviso y reinicio sólo por acción explícita.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-009-01**: Reload de checkpoint conserva inventario, mérito y siguiente RNG.
- **SC-009-02**: Todos los casos inválidos ofrecen recuperación o reinicio explícito.
- **SC-009-03**: Ningún camino de peor azar bloquea progreso asistido.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 001; contrato mínimo antes de 005, integración completa tras 008.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
