# Feature Specification: Introducción y sala

> Actualización v3 (2026-10-23): apertura breve a oscuras y arte de tinta integrados en el MVP.
> Ver [alcance, procedencia y evidencia](../../docs/ink-theatre.md). Esto no completa las
> tareas de calle/campaña, actuación por estados ni validación humana pendientes.

**Feature Branch**: `codex/research-specs-skills` (entrega documental; spec independiente de rama)
**Created**: 2026-10-22
**Status**: Parcialmente implementada en el MVP; alcance de campaña y validación pendientes
**Input**: Apartado 003 del prompt original y decisiones versionadas.

## Objetivo y dependencias

Entender el cautiverio y recuperar movimiento con una transición breve. Dependencias: 002, 004; no bloquea prototipo de 005. No incluye sistemas de otras specs ni amplía alcance.

## User Scenarios & Testing

### User Story 1 - Ver calle, apagón y despertar con explicación breve (Priority: P1)

Como jugador quiero ver calle, apagón y despertar con explicación breve para entender el cautiverio y recuperar movimiento con una transición breve.
**Why this priority**: Es el flujo principal de esta entrega pequeña.
**Independent Test**: Ejecutar el flujo con fixtures de dependencias; sin campaña completa.
**Acceptance Scenarios**:

1. **Given** dependencias disponibles y estado inicial válido, **When** completo el flujo principal,
   **Then** se cumplen FR-003-01 y los criterios medibles de esta spec.
2. **Given** el estado de la acción anterior, **When** repito la confirmación,
   **Then** no se duplican efectos ni se consume azar adicional.

### User Story 2 - Omitir la intro y recibir control de sala consistente (Priority: P2)

Como jugador quiero omitir la intro y recibir control de sala consistente para continuar con información y control.
**Why this priority**: Evita bloqueo y conserva claridad en errores o ayudas.
**Independent Test**: Forzar casos límite con fixtures, sin requerir todas las escenas.
**Acceptance Scenarios**:

1. **Given** uno de los casos límite listados, **When** uso la recuperación o ayuda indicada,
   **Then** puedo continuar o volver al menú sin pérdida silenciosa de estado válido.
2. **Given** navegación por teclado, **When** abro y cierro este flujo,
   **Then** el foco visible vuelve al control de origen y no hay entrada de movimiento residual.

### Edge Cases

- Omitir durante apagón o diálogo.
- Audio bloqueado.
- Reanudar antes/después de liberación.
- Asset de personaje faltante.

## Requirements

### Functional Requirements

- **FR-003-01**: Conservar el comienzo a oscuras solicitado por el usuario y ofrecer la calle como recuerdo opcional con planos controlados, sonido y apagón sin combate.
- **FR-003-02**: Mostrar subtítulos de todas las líneas según guion versionado.
- **FR-003-03**: Liberar manos al terminar explicación antes de permitir circular.
- **FR-003-04**: Permitir omitir hacia estado released una sola vez con resumen.
- **FR-003-05**: Habilitar movimiento e interacción de sala sólo después de liberación; la calle inicial permite controles acotados.

### Key Entities

Definiciones y relaciones en [data-model.md](data-model.md). El modelo de partida y preferencias
es propiedad de 009; esta spec no crea un guardado alternativo. Reglas de mesa y puntuación en
[diseño educativo](../../docs/educational-design.md).

## Success Criteria

### Measurable Outcomes

- **SC-003-01**: Intro automática dura como máximo 130 s, sin contar lectura pausada.
- **SC-003-02**: Omitir y finalizar producen el mismo acceso a mesas.
- **SC-003-03**: No hay salida de cinemática con manos aún atadas y movimiento habilitado.

## Assumptions

- Navegador escritorio, español inicial, sin cuenta ni backend.
- Valores de tiempo y calidad son objetivos, aún sin mediciones de juego.
- Dependencias: 002, 004; no bloquea prototipo de 005.
- Diseño educativo y accesibilidad compartidos se reutilizan, no se duplican.

## Clarifications

### Session 2026-10-22

Revisión de ambigüedades realizada por agente contra prompt; cero preguntas al usuario y cero
respuestas inventadas. Alcance, plataforma y entregable actual ya estaban definidos. Ajustes
reversibles de detalle quedan en plan, riesgos y criterios específicos; público/hardware final
pendientes no impiden especificar. No se detectó ambigüedad crítica que requiera consulta formal.
