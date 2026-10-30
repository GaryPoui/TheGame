# Implementation Plan: Dados y contratos

> Ejecución 2026-10-26/27: implementación y correspondencia de módulos en
> [campaña](../../docs/campaign-implementation.md). Este documento conserva el plan inicial;
> las tareas y la evidencia distinguen implementación de validación externa pendiente.

**Branch**: `codex/doble-contracts` | **Date**: 2026-10-23 | **Spec**: [spec.md](spec.md)

## Summary

Elegir contratos según promedio, umbral y variabilidad. Implementación incremental completada
en este corte; dependencias: 005; reutiliza tutoriales, ajustes y adaptador de guardado compartidos.
Tests nuevos pendientes; aceptación manual registrada en [Doble](../../docs/doble-implementation.md).

## Technical Context

**Language/Version**: TypeScript 7.0.2 estricto.
**Primary Dependencies**: Babylon.js core/loaders 9.32.0, Vite 8.3.5; pins en package.json.
**Storage**: Sólo adaptador local versionado de 009; sin backend.
**Testing**: Vitest 5.0.5 + Playwright 1.64.1, enumeración exacta y revisión visual humana.
**Target Platform**: Navegador escritorio WebGL, Windows inicial; sin WebGPU obligatorio.
**Project Type**: Aplicación web estática con HTML/CSS semántico.
**Performance Goals**: presupuestos de docs/visual-validation.md, no mediciones existentes.
**Constraints**: Sin servicios pagos, cuentas, física de azar, frameworks UI ni fórmulas nuevas ocultas.
**Scale/Scope**: Dados y contratos, dos historias; campaña total una calle/sala y cuatro encuentros.

## Constitution Check

Pre-investigación y post-diseño: PASS documental de cinco principios; matemática pura,
azar inyectable, ayuda finita, accesibilidad, fuentes/licencias y alcance acotado.
No hay excepciones. Este PASS describe consistencia documental; la instrucción posterior del
usuario «implementa la mesa doble» autoriza este corte, no el PASS por sí solo.

## Project Structure

Documentos: spec.md, plan.md, research.md, data-model.md, contracts/ui-state.md, quickstart.md,
tasks.md y checklists/requirements.md en esta carpeta.
Código principal: `src/core/tables/contracts.ts`, `src/core/math/dice.ts`,
`src/core/math/simulation.ts`, `src/ui/contracts.ts` y `src/ui/contracts.css`.
Integración en `src/main.ts`, escena Babylon y guardado de `src/core/game.ts`.
Capas y propietarios en docs/architecture.md.
Tests futuros: `tests/unit/006-dice-contracts.test.ts`, `tests/browser/006-dice-contracts.spec.ts`.
No crear backend ni duplicar CampaignState, RNG, runner, settings o guardado.

## Phase 0: investigación

Decisiones y alternativas: [research.md](research.md). No quedan incertidumbres de API
bloqueantes para planificar; volver a verificar firmas exactas al implementar.

## Phase 1: diseño

Datos: [data-model.md](data-model.md). Interfaz: [contrato](contracts/ui-state.md).
Validación E2E: [quickstart.md](quickstart.md). La estrategia de construcción vive en tareas.

## Complexity Tracking

Sin violaciones justificadas. Cualquier dependencia nueva requiere necesidad concreta y licencia.

## Decisiones del corte implementado

Una tirada por ronda; la segunda orden sólo planifica. Comparaciones exactas sobre 36 pares,
RNG separado para simulaciones y consejo de Doble limitado al objetivo público.
El reducer registra comandos con ID/revisión y valida snapshots mediante replay.
Esquema 2 acepta el legado esquema 1 en el mismo slot; conserva resultados y sellos al repetir.
Arte de Doble SVG original y dados 3D amplían el teatro de tinta con Arial sans existente.
No se incorporan servicios, motor físico ni dependencias nuevas. T007/T008 se cerraron con
las pruebas de campaña; la aceptación manual original permanece documentada por separado.
