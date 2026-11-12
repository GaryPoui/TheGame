# Tasks: Diálogos y tutoriales

## Phase 1: Setup

- [x] T001 Leer spec, contratos y dependencias 001; adapta controles de 002 al integrar en specs/004-dialogue-tutorial/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [x] T002 Definir tipos/acciones legales y errores para src/core/dialogue/runner.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Recorrer todas las ramas, repetir/omitir explicaciones y variar tamaño de texto sin cambiar mérito.

- [x] T003 [US1] Definir esquema y validador de nodos en src/content/dialogue-schema.ts. Cobertura FR-004-01..05.
- [x] T004 [US1] Crear runner sin eval con efectos idempotentes en src/core/dialogue/runner.ts. Cobertura FR-004-01..05.
- [x] T005 [US1] Crear panel semántico y subtítulos ajustables en src/main.ts. Cobertura FR-004-01..05.
- [x] T006 [US1] Crear ciclo tutorial y registro de ayudas en src/core/tutorial/runner.ts. Cobertura FR-004-01..05.

## Phase 4: User Story 2 (P2)

- [x] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-004-01..05 en tests/browser/controls-dialogue.spec.ts y UI correspondiente.
- [x] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/controls-dialogue.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [x] T009 Ejecutar aceptación SC-004-01..03, revisar canvas/DOM y registrar evidencia en docs/campaign-implementation.md.

## Dependencies & parallel examples

Dependencias externas: 001; adapta controles de 002 al integrar. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Implementación autorizada el 2026-10-26. Consolidación y límites: docs/campaign-implementation.md.
