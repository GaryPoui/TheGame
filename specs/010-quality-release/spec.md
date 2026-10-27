# Feature Specification: Arte, audio, accesibilidad y publicación

> Actualización v3 (2026-10-23): apertura breve a oscuras y arte de tinta integrados en el MVP.
> Ver [alcance, procedencia y evidencia](../../docs/ink-theatre.md). Esto no completa las
> tareas de calle/campaña, actuación por estados ni validación humana pendientes.

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Campaña, audio, interfaz y publicación implementados; validación externa T011 pendiente, distinguida en [evidencia](../../docs/campaign-implementation.md).
**Input**: Apartado 010 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Evaluar calidad representativa y publicar una campaña legible y medible. Dependencias: 001 para fundaciones tempranas; 002–009 para cierre/publicación. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Jugar con interfaz clara, cámara cómoda y sonidos comprensibles (Priority: P1)

Como jugador quiero jugar con interfaz clara, cámara cómoda y sonidos comprensibles para evaluar calidad representativa y publicar una campaña legible y medible.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-010-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Ajustar preferencias y acceder a la campaña publicada por HTTPS (Priority: P2)

Como jugador quiero ajustar preferencias y acceder a la campaña publicada por https para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- GLB o textura faltante.
- Audio deshabilitado.
- Zoom 200% y ventana pequeña.
- Pérdida contexto WebGL.

## Requirements

### Functional Requirements

- **FR-010-01**: Aplicar dirección artística y tokens UI con símbolos además de color.
- **FR-010-02**: Producir escena representativa de una mesa antes de campaña completa.
- **FR-010-03**: Mantener registro por asset, licencia, fuente, GLB y validación desde cámara real.
- **FR-010-04**: Verificar teclado, subtítulos, reescalado, reducción de movimiento y señal visual sin audio.
- **FR-010-05**: Medir carga, memoria y renderizado en equipo identificado frente a presupuestos.
- **FR-010-06**: Publicar build estática HTTPS sólo después de pasar gates de campaña y licencias.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-010-01**: Todas las pantallas educativas pasan revisión sin texto cortado a zoom 200%.
- **SC-010-02**: 100% de assets integrados tienen origen y licencia registrados.
- **SC-010-03**: Reporte identifica equipo y compara mediciones con budgets sin inventar resultados.
- **SC-010-04**: Build publicada abre en subruta HTTPS con recursos propios.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 001 para fundaciones tempranas; 002–009 para cierre/publicación.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
