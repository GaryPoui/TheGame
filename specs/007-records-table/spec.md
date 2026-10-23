# Feature Specification: Mesa de registros

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Especificada; implementación pendiente de instrucción posterior
**Input**: Apartado 007 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Comparar datos, procedencia y variación sin afirmar certezas injustificadas. Dependencias: 006; reutiliza 004 y 009. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Pedir registros completos y observar cuando falta muestra (Priority: P1)

Como jugador quiero pedir registros completos y observar cuando falta muestra para comparar datos, procedencia y variación sin afirmar certezas injustificadas.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-007-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Cerrar informe descriptivo distinguiendo media observada y mecanismo (Priority: P2)

Como jugador quiero cerrar informe descriptivo distinguiendo media observada y mecanismo para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- Todos ceros o todos cuatros.
- Muestra seleccionada enorme.
- Empate media teórica K/V.
- Observación extra agotada.

## Requirements

### Functional Requirements

- **FR-007-01**: Implementar K=2 y V=0/4 justo, archivos completos y álbum sesgado identificados.
- **FR-007-02**: Implementar R1–R4, dos decisiones por ronda y bloques completos de cuatro ensayos.
- **FR-007-03**: Aplicar regla operativa fuente completa y n>=8 sin presentarla como inferencia formal.
- **FR-007-04**: Calcular media, rango y frecuencia relativa conservando observaciones e índice.
- **FR-007-05**: Distinguir igualdad de medias teóricas de garantía y dispersión diferentes.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-007-01**: Ejemplo R2 da media 2.5, frecuencia 5/8 y rango 4.
- **SC-007-02**: Ningún informe afirma distribución demostrada ni certeza al alcanzar n=8.
- **SC-007-03**: Cada ronda permite continuar con las dos fichas disponibles.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 006; reutiliza 004 y 009.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
