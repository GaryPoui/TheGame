# Tasks: Secuestrador y final

## Phase 1: Setup

- [x] T001 Leer spec, contratos y dependencias 005, 006, 007, 009; intro 003 para campaña completa en specs/008-host-finale/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [x] T002 Definir tipos/acciones legales y errores para src/core/tables/finale.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Recorrer 6/6, 4/6, 0/6 con ayuda y repetir; confirmar epílogo único y libertad persistente.

- [x] T003 [US1] Componer las tres rondas desde reglas existentes en src/core/tables/finale.ts. Cobertura FR-008-01..05.
- [x] T004 [US1] Crear política del anfitrión sin acceso RNG en src/core/tables/host-policy.ts. Cobertura FR-008-01..05.
- [x] T005 [US1] Integrar puerta, epílogo y final repetible en src/core/campaign/progression.ts. Cobertura FR-008-01..05.
- [x] T006 [US1] Crear resumen y transferencia opcional en src/ui/ending.ts. Cobertura FR-008-01..05.

## Phase 4: User Story 2 (P2)

- [x] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-008-01..05 en tests/browser/campaign.spec.ts y UI correspondiente.
- [x] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/campaign.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [x] T009 Ejecutar aceptación SC-008-01..03, revisar canvas/DOM y registrar evidencia en docs/campaign-implementation.md.

## Dependencies & parallel examples

Dependencias externas: 005, 006, 007, 009; intro 003 para campaña completa. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Implementación autorizada el 2026-10-26; el avance y la evidencia están en docs/campaign-implementation.md.
