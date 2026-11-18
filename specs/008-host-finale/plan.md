# Implementation Plan: Secuestrador y final

> Ejecución 2026-10-26/27: implementación y correspondencia de módulos en
> [campaña](../../docs/campaign-implementation.md). Este documento conserva el plan inicial;
> las tareas y la evidencia distinguen implementación de validación externa pendiente.

**Branch**: `codex/research-specs-skills` | **Date**: 2026-10-22 | **Spec**: [spec.md](spec.md)

## Summary

Combinar lo aprendido para obtener libertad sin nuevas fórmulas. Implementación futura incremental, dependencias: 005, 006, 007, 009; intro 003 para campaña completa.

## Technical Context

**Language/Version**: TypeScript 7.0.2 estricto.
**Primary Dependencies**: Babylon.js core/loaders 9.32.0, Vite 8.3.5; pins en package.json.
**Storage**: Sólo adaptador local versionado de 009; sin backend.
**Testing**: Vitest 5.0.5 + Playwright 1.64.1, enumeración exacta y revisión visual humana.
**Target Platform**: Navegador escritorio WebGL, Windows inicial; sin WebGPU obligatorio.
**Project Type**: Aplicación web estática con HTML/CSS semántico.
**Performance Goals**: presupuestos de docs/visual-validation.md, no mediciones existentes.
**Constraints**: Sin servicios pagos, cuentas, física de azar, frameworks UI ni fórmulas nuevas ocultas.
**Scale/Scope**: Secuestrador y final, dos historias; campaña total una calle/sala y cuatro encuentros.

## Constitution Check

Pre-investigación y post-diseño: PASS documental de cinco principios; matemática pura,
azar inyectable, ayuda finita, accesibilidad, fuentes/licencias y alcance acotado.
No hay excepciones ni implementación aprobada por este resultado.

## Project Structure

Documentos: spec.md, plan.md, research.md, data-model.md, contracts/ui-state.md, quickstart.md,
tasks.md y checklists/requirements.md en esta carpeta.
Código futuro principal: `src/core/tables/finale.ts`. Capas y propietarios en docs/architecture.md.
Tests futuros: `tests/unit/008-host-finale.test.ts`, `tests/browser/008-host-finale.spec.ts`.
No crear backend ni duplicar CampaignState, RNG, runner, settings o guardado.

## Phase 0: investigación

Decisiones y alternativas: [research.md](research.md). No quedan incertidumbres de API
bloqueantes para planificar; volver a verificar firmas exactas al implementar.

## Phase 1: diseño

Datos: [data-model.md](data-model.md). Interfaz: [contrato](contracts/ui-state.md).
Validación E2E: [quickstart.md](quickstart.md). La estrategia de construcción vive en tareas.

## Complexity Tracking

Sin violaciones justificadas. Cualquier dependencia nueva requiere necesidad concreta y licencia.
