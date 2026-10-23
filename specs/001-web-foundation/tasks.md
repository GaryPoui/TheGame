# Tasks: Base técnica web

## Phase 1: Setup

- [ ] T001 Leer spec, contratos y dependencias Ninguna en specs/001-web-foundation/plan.md; preparar fixtures sin duplicar sistemas.

## Phase 2: Foundational

- [ ] T002 Definir tipos/acciones legales y errores para src/app/bootstrap.ts; enlazar contratos compartidos de 009.

## Phase 3: User Story 1 (P1)

Prueba independiente: Compilar, servir dist en subruta y desconectar un recurso; inspeccionar consola y controles de error.

- [ ] T003 [US1] Configurar TypeScript strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes y scripts dev/build/typecheck/test en package.json y tsconfig.json. Cobertura FR-001-01..04.
- [ ] T004 [US1] Crear bootstrap y ciclo de vida Engine/Scene con dispose en src/app/bootstrap.ts. Cobertura FR-001-01..04.
- [ ] T005 [US1] Añadir menú, carga y fallback WebGL con botón reintentar en src/ui/startup.ts. Cobertura FR-001-01..04.
- [ ] T006 [US1] Configurar vite.config.ts en raíz del repositorio para base relativa y assets locales. Cobertura FR-001-01..04.

## Phase 4: User Story 2 (P2)

- [ ] T007 [US2] Cubrir recuperación, ayuda, teclado y casos límite de FR-001-01..04 en tests/browser/001-web-foundation.spec.ts y UI correspondiente.
- [ ] T008 [P] [US2] Añadir pruebas de reglas/estado, entradas inválidas e idempotencia en tests/unit/001-web-foundation.test.ts, usando fixtures independientes.

## Phase 5: Polish & cross-cutting

- [ ] T009 Ejecutar aceptación SC-001-01..02, revisar canvas/DOM y registrar evidencia en docs/evidence/runtime/001-web-foundation.md.

## Dependencies & parallel examples

Dependencias externas: Ninguna. T001→T002→US1→US2→cierre. Una vez definidas interfaces, pruebas unitarias de fixtures y UI de US2 pueden prepararse en archivos separados; integración después de US1.

## Implementation strategy

Entrega mínima: US1 con fixtures y validación local. Luego US2 y recuperación. Todas las tareas están pendientes; no iniciar sin instrucción posterior.
