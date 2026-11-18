# Tasks: Progresión y guardado

## Phase 1: Setup

- [x] T001 Leer spec, contratos y dependencias 001; contrato mínimo antes de 005, integración completa tras 008 en specs/009-progression-save/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [x] T002 Definir tipos/acciones legales y errores para src/core/campaign/progression.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Cargar fixtures válidas/corruptas/futuras y storage que falla; recargar sin volver a tirar ni duplicar méritos.

- [x] T003 [US1] Definir contratos de CampaignState, comandos y checkpoints en src/core/campaign/types.ts. Cobertura FR-009-01..05.
- [x] T004 [US1] Crear gates, ayuda y reducer idempotente en src/core/campaign/progression.ts. Cobertura FR-009-01..05.
- [x] T005 [US1] Crear adaptador localStorage con current/backup/pending y validación en src/core/game.ts. Cobertura FR-009-01..05.
- [x] T006 [US1] Crear recuperación, reset explícito y detección multi-tab en src/main.ts. Cobertura FR-009-01..05.

## Phase 4: User Story 2 (P2)

- [x] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-009-01..05 en tests/browser/campaign.spec.ts y UI correspondiente.
- [x] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/game.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [x] T009 Ejecutar aceptación SC-009-01..03, revisar canvas/DOM y registrar evidencia en docs/campaign-implementation.md.

## Dependencies & parallel examples

Dependencias externas: 001; contrato mínimo antes de 005, integración completa tras 008. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Implementación autorizada el 2026-10-26; el avance y la evidencia están en docs/campaign-implementation.md.
