# Feature Specification: Dados y contratos

**Feature Branch**: `codex/doble-contracts` (implementación; selección de spec independiente de rama)
**Created**: 2026-10-22
**Status**: Implementada con aceptación manual; cobertura automatizada nueva pendiente
**Input**: Apartado 006 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Elegir contratos según promedio, umbral y variabilidad. Dependencias: 005; reutiliza 004 y 009. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Firmar un contrato adecuado al encargo y observar coste/pago (Priority: P1)

Como jugador quiero firmar un contrato adecuado al encargo y observar coste/pago para elegir contratos según promedio, umbral y variabilidad.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-006-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Comparar una ronda con muchas sin confundir valor esperado y garantía (Priority: P2)

Como jugador quiero comparar una ronda con muchas sin confundir valor esperado y garantía para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- Saldo negativo.
- Suma 7 y suma 2.
- Empate de acciones óptimas.
- Reabrir resumen y volver a tirar.

## Requirements

### Functional Requirements

- **FR-006-01**: Enumerar 36 pares equiprobables y distribución de sumas no equiprobables.
- **FR-006-02**: Implementar S/C/J con costes y pagos exactos del diseño educativo.
- **FR-006-03**: Usar D1–D4, una tirada por ronda y segunda orden hipotética sin otra tirada.
- **FR-006-04**: Puntuar decisiones según objetivo, nunca según saldo ficticio.
- **FR-006-05**: Ofrecer comparación opcional de muchas partidas con seed visible sin alterar campaña.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-006-01**: Probabilidad de 7 es 6/36 y EV neto de J es 3.
- **SC-006-02**: Encargo EV elige J, umbral 4 elige C, garantía elige S.
- **SC-006-03**: Una mala tirada conserva los méritos de elección óptima.

## Evidencia de implementación — 23/10/2026

La mesa integra las cuatro rondas, segunda orden hipotética, cuadrícula de pares, comparación
1/100 independiente, recuperación guiada y guardado compartido versionado. Véase
[implementación, recorridos y límites](../../docs/doble-implementation.md).
La aceptación manual incluye elección óptima con pérdida que conserva mérito y recarga sin
otra tirada. No se añadieron ni ejecutaron tests nuevos; no se afirma aprendizaje validado.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 005; reutiliza 004 y 009.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
