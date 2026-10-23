# Feature Specification: Base técnica web

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Especificada; implementación pendiente de instrucción posterior
**Input**: Apartado 001 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Abrir una experiencia estable con carga y fallos comprensibles. Dependencias: Ninguna. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Iniciar desde menú y ver una sala técnica vacía (Priority: P1)

Como jugador quiero iniciar desde menú y ver una sala técnica vacía para abrir una experiencia estable con carga y fallos comprensibles.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-001-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Abrir sin capacidad gráfica y recibir una explicación recuperable (Priority: P2)

Como jugador quiero abrir sin capacidad gráfica y recibir una explicación recuperable para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- Carga de asset fallida.
- WebGL no disponible.
- Red cortada y reintento.
- Viewport 1280×720.

## Requirements

### Functional Requirements

- **FR-001-01**: Mostrar menú, carga, error y reintento sin pantalla vacía permanente.
- **FR-001-02**: Ofrecer inicio manual para habilitar audio y controles.
- **FR-001-03**: Servir recursos desde subruta sin solicitudes a servicios externos.
- **FR-001-04**: Mantener reglas independientes de presentación y configuración estricta.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-001-01**: 100% de rutas de inicio llegan a menú o error accionable.
- **SC-001-02**: La misma build abre en raíz y subruta sin 404.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: Ninguna.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
