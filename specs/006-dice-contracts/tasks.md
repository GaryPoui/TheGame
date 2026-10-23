# Tasks: Dados y contratos

## Phase 1: Setup

- [ ] T001 Leer spec, contratos y dependencias 005; reutiliza 004 y 009 en specs/006-dice-contracts/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [ ] T002 Definir tipos/acciones legales y errores para src/core/tables/contracts.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Enumerar 36 resultados por contrato, jugar pérdida óptima y segunda orden; verificar que saldo no bloquea.

- [ ] T003 [US1] Enumerar pares, EV neto, rango y probabilidades de umbral en src/core/math/dice.ts. Cobertura FR-006-01..05.
- [ ] T004 [US1] Crear D1–D4 y política pública de Doble en src/core/tables/contracts.ts. Cobertura FR-006-01..05.
- [ ] T005 [US1] Crear cuadrícula 6×6, ofertas y resumen de neto en src/ui/contracts.ts. Cobertura FR-006-01..05.
- [ ] T006 [US1] Crear comparación 1/100 con stream separado en src/core/math/simulation.ts. Cobertura FR-006-01..05.

## Phase 4: User Story 2 (P2)

- [ ] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-006-01..05 en tests/browser/006-dice-contracts.spec.ts y UI correspondiente.
- [ ] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/006-dice-contracts.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [ ] T009 Ejecutar aceptación SC-006-01..03, revisar canvas/DOM y registrar evidencia en docs/evidence/runtime/006-dice-contracts.md.

## Dependencies & parallel examples

Dependencias externas: 005; reutiliza 004 y 009. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Todas las tareas están pendientes; no iniciar sin instrucción posterior.
