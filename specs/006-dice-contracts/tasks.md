# Tasks: Dados y contratos

## Phase 1: Setup

- [x] T001 Leer spec, contratos y dependencias 005; reutiliza 004 y 009 en specs/006-dice-contracts/plan.md; preparar escenarios deterministas sin duplicar sistemas.

## Phase 2: Foundational

- [x] T002 Definir tipos/acciones legales y errores para src/core/tables/contracts.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Enumerar 36 resultados por contrato, jugar pérdida óptima y segunda orden; verificar que saldo no bloquea.

- [x] T003 [US1] Enumerar pares, EV neto, rango y probabilidades de umbral en src/core/math/dice.ts. Cobertura FR-006-01..05.
- [x] T004 [US1] Crear D1–D4 y política pública de Doble en src/core/tables/contracts.ts. Cobertura FR-006-01..05.
- [x] T005 [US1] Crear cuadrícula 6×6, ofertas y resumen de neto en src/ui/contracts.ts. Cobertura FR-006-01..05.
- [x] T006 [US1] Crear comparación 1/100 con stream separado en src/core/math/simulation.ts. Cobertura FR-006-01..05.

## Phase 4: User Story 2 (P2)

- [x] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-006-01..05 en tests/browser/campaign.spec.ts y UI correspondiente.
- [x] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/campaign.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [x] T009 Realizar aceptación manual SC-006-01..03 y revisar canvas/DOM; evidencia en [docs/doble-implementation.md](../../docs/doble-implementation.md). La comprobación manual
  no sustituye las suites pendientes T007/T008 ni un estudio educativo.

## Dependencies & parallel examples

Dependencias externas: 005; reutiliza 004 y 009. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega autorizada por «implementa la mesa doble»: reglas, interfaz, recuperación y persistencia
implementadas. T007/T008 eran pendientes en ese corte y se cerraron en la integración de campaña; ver el registro posterior. Los recorridos manuales y la compilación/typecheck se registran por separado.

Cierre automatizado 2026-10-26: pruebas de contratos y recuperación en tests/unit/campaign.test.ts; pérdida óptima, simulador sin efectos y recarga en tests/browser/campaign.spec.ts. Ver docs/campaign-implementation.md.
