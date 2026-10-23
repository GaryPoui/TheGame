# Tasks: Mesa de registros

## Phase 1: Setup

- [ ] T001 Leer spec, contratos y dependencias 006; reutiliza 004 y 009 en specs/007-records-table/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [ ] T002 Definir tipos/acciones legales y errores para src/core/tables/records.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Jugar álbum sesgado, muestra extrema y empate de medias; revisar informes sin afirmaciones inferenciales.

- [ ] T003 [US1] Crear estadísticas descriptivas exactas en src/core/math/statistics.ts. Cobertura FR-007-01..05.
- [ ] T004 [US1] Crear R1–R4 y bloque de muestreo íntegro en src/core/tables/records.ts. Cobertura FR-007-01..05.
- [ ] T005 [US1] Crear archivo, histograma y tabla equivalente en src/ui/records.ts. Cobertura FR-007-01..05.
- [ ] T006 [US1] Crear feedback de incertidumbre y transferencia extrema en src/content/records.ts. Cobertura FR-007-01..05.

## Phase 4: User Story 2 (P2)

- [ ] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-007-01..05 en tests/browser/007-records-table.spec.ts y UI correspondiente.
- [ ] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/007-records-table.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [ ] T009 Ejecutar aceptación SC-007-01..03, revisar canvas/DOM y registrar evidencia en docs/evidence/runtime/007-records-table.md.

## Dependencies & parallel examples

Dependencias externas: 006; reutiliza 004 y 009. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Todas las tareas están pendientes; no iniciar sin instrucción posterior.
