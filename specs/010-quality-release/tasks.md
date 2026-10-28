# Tasks: Arte, audio, accesibilidad y publicación

## Phase 1: Setup

- [x] T001 Leer spec, contratos y dependencias 001 para fundaciones tempranas; 002–009 para cierre/publicación en specs/010-quality-release/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [x] T002 Definir tipos/acciones legales y errores para src/style.css y src/ui/campaign.css; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Ejecutar campaña en build producción, capturar modos cámara, auditar assets, probar settings y medir tres corridas.

- [x] T003 [US1] Crear tokens y componentes accesibles en src/style.css y src/ui/campaign.css y settings en src/main.ts. Cobertura FR-010-01..06.
- [x] T004 [US1] Producir escena representativa y registro en public/asset-manifest.json según docs/asset-pipeline.md. Cobertura FR-010-01..06.
- [x] T005 [US1] Integrar buses y señales equivalentes sin audio en src/platform/audio.ts. Cobertura FR-010-01..06.
- [x] T006 [US1] Capturar scene real, medir y optimizar sólo cuellos observados en docs/evidence/runtime/. Cobertura FR-010-01..06.
- [x] T007 [US1] Configurar build base relativa ./ para raíz y /TheGame/ y publicación revisada en scripts/publish-pages.ps1 y validación en .github/workflows/validate.yml. Cobertura FR-010-01..06.

## Phase 4: User Story 2 (P2)

- [x] T008 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-010-01..06 en tests/browser/campaign.spec.ts y tests/browser/controls-dialogue.spec.ts y UI correspondiente.
- [x] T009 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/controls-dialogue.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [x] T010 Ejecutar aceptación SC-010-01..04, revisar canvas/DOM y registrar evidencia en docs/campaign-implementation.md.

## Dependencies & parallel examples

Dependencias externas: 001 para fundaciones tempranas; 002–009 para cierre/publicación. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Implementación autorizada el 2026-10-26; ver docs/campaign-implementation.md.

## Validación externa pendiente

- [ ] T011 Realizar playtests de duración, comprensión y comodidad, revisión con lector de pantalla y medición con GPU física/red controlada según docs/validation-plan.md y docs/visual-validation.md. El renderer de software no representa esos resultados.

## Revisión de composición solicitada — 2026-10-28

- [x] T012 Dar protagonismo a los tableros, encuadrar urnas/dados sin paneles encima y añadir utilería propia de cada mesa; conservar reglas, guardado y selección sincronizada. Validación de cuatro recorridos nuevos y regresión de campaña en docs/table-focus.md.
