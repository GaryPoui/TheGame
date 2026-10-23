# Tasks: Arte, audio, accesibilidad y publicación

## Phase 1: Setup

- [ ] T001 Leer spec, contratos y dependencias 001 para fundaciones tempranas; 002–009 para cierre/publicación en specs/010-quality-release/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [ ] T002 Definir tipos/acciones legales y errores para src/ui/styles.css; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Ejecutar campaña en build producción, capturar modos cámara, auditar assets, probar settings y medir tres corridas.

- [ ] T003 [US1] Crear tokens y componentes accesibles en src/ui/styles.css y settings en src/ui/settings.ts. Cobertura FR-010-01..06.
- [ ] T004 [US1] Producir escena representativa y registro en assets/manifest.json según docs/asset-pipeline.md. Cobertura FR-010-01..06.
- [ ] T005 [US1] Integrar buses y señales equivalentes sin audio en src/platform/audio.ts. Cobertura FR-010-01..06.
- [ ] T006 [US1] Capturar scene real, medir y optimizar sólo cuellos observados en docs/evidence/runtime/. Cobertura FR-010-01..06.
- [ ] T007 [US1] Configurar build base relativa ./ para raíz y /TheGame/ y publicación revisada en .github/workflows/deploy.yml. Cobertura FR-010-01..06.

## Phase 4: User Story 2 (P2)

- [ ] T008 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-010-01..06 en tests/browser/010-quality-release.spec.ts y UI correspondiente.
- [ ] T009 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/010-quality-release.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [ ] T010 Ejecutar aceptación SC-010-01..04, revisar canvas/DOM y registrar evidencia en docs/evidence/runtime/010-quality-release.md.

## Dependencies & parallel examples

Dependencias externas: 001 para fundaciones tempranas; 002–009 para cierre/publicación. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Todas las tareas están pendientes; no iniciar sin instrucción posterior.
