# Tasks: Base técnica web

## Phase 1: Setup

- [x] T001 Leer spec, contratos y dependencias Ninguna en specs/001-web-foundation/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [x] T002 Definir tipos/acciones legales y errores para src/app/bootstrap.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Compilar, servir dist en subruta y desconectar un recurso; inspeccionar consola y controles de error.

- [x] T003 [US1] Configurar TypeScript strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes y scripts dev/build/typecheck/test en package.json y tsconfig.json. Cobertura FR-001-01..04.
- [x] T004 [US1] Crear bootstrap y ciclo de vida Engine/Scene con dispose en src/app/bootstrap.ts. Cobertura FR-001-01..04.
- [x] T005 [US1] Añadir menú, carga y fallback WebGL con botón reintentar en src/ui/startup.ts. Cobertura FR-001-01..04.
- [x] T006 [US1] Configurar vite.config.ts en raíz del repositorio para base relativa y assets locales. Cobertura FR-001-01..04.

## Phase 4: User Story 2 (P2)

- [x] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-001-01..04 en tests/browser/001-web-foundation.spec.ts y UI correspondiente.
- [x] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/001-web-foundation.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [x] T009 Ejecutar aceptación SC-001-01..02, revisar canvas/DOM y registrar evidencia en docs/evidence/runtime/001-web-foundation.md.

## Dependencies & parallel examples

Dependencias externas: Ninguna. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Corte ejecutado tras autorización del usuario el 2026-10-23; evidencias en docs/mvp-validation.md.

## Implementación real del corte MVP

Consolidación deliberada: bootstrap/UI en src/main.ts; escena y picking en src/presentation/scene.ts;
reglas, RNG y persistencia en src/core/game.ts. Pruebas unitarias tests/unit/game.test.ts y de
navegador tests/browser/mvp.spec.ts. Se conserva la separación núcleo/presentación sin crear
wrappers vacíos sólo para reproducir los nombres propuestos en el plan. Validación de aprendizaje
y diversión humana sigue pendiente; las marcas acreditan implementación y QA funcional.
