# Tasks: Mesa de las urnas

## Phase 1: Setup

- [ ] T001 Leer spec, contratos y dependencias 002, 004, contrato/checkpoints mínimos de 009; base visual de 010 en specs/005-urn-table/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [ ] T002 Definir tipos/acciones legales y errores para src/core/tables/urns.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Jugar U1 tras roja y azul, U2 reposición y U3 cambio de óptimo; completar U4 y ayuda con fake RNG adverso.

- [ ] T003 [US1] Implementar fracciones y selección uniforme con RNG inyectado en src/core/math/urns.ts. Cobertura FR-005-01..05.
- [ ] T004 [US1] Crear reducer U1–U4 y política pública de Vera en src/core/tables/urns.ts. Cobertura FR-005-01..05.
- [ ] T005 [US1] Integrar urna, fichas simbólicas, vista de mesa y panel en src/presentation/urn-table.ts. Cobertura FR-005-01..05.
- [ ] T006 [US1] Integrar U4, ayuda acotada y checkpoint con campaña en src/app/urn-session.ts. Cobertura FR-005-01..05.

## Phase 4: User Story 2 (P2)

- [ ] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-005-01..05 en tests/browser/005-urn-table.spec.ts y UI correspondiente.
- [ ] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/005-urn-table.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [ ] T009 Ejecutar aceptación SC-005-01..03, revisar canvas/DOM y registrar evidencia en docs/evidence/runtime/005-urn-table.md.

## Dependencies & parallel examples

Dependencias externas: 002, 004, contrato/checkpoints mínimos de 009; base visual de 010. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Todas las tareas están pendientes; no iniciar sin instrucción posterior.
