# Tasks: Cámara e interacción

## Phase 1: Setup

- [ ] T001 Leer spec, contratos y dependencias 001 en specs/002-camera-interaction/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [ ] T002 Definir tipos/acciones legales y errores para src/presentation/camera-controller.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Recorrer cuatro modos, abrir pausa, perder foco y reasignar interactuar; completar con teclado.

- [ ] T003 [US1] Crear cámara Universal y presets estables con límites en src/presentation/camera-controller.ts. Cobertura FR-002-01..05.
- [ ] T004 [US1] Implementar picking filtrado y límites de distancia/oclusión en src/presentation/interaction.ts. Cobertura FR-002-01..05.
- [ ] T005 [US1] Crear mapa de acciones y remapeo con conflictos en src/platform/input.ts. Cobertura FR-002-01..05.
- [ ] T006 [US1] Crear lista alternativa y retorno de foco en src/ui/table-list.ts. Cobertura FR-002-01..05.

## Phase 4: User Story 2 (P2)

- [ ] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-002-01..05 en tests/browser/002-camera-interaction.spec.ts y UI correspondiente.
- [ ] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/002-camera-interaction.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [ ] T009 Ejecutar aceptación SC-002-01..03, revisar canvas/DOM y registrar evidencia en docs/evidence/runtime/002-camera-interaction.md.

## Dependencies & parallel examples

Dependencias externas: 001. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Todas las tareas están pendientes; no iniciar sin instrucción posterior.
