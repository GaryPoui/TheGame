# Entregas pequeñas y dependencias

Estado 2026-10-23: 001 y 005 implementadas en el MVP; 006 tiene implementación jugable y aceptación
manual, con tareas de tests automatizados pendientes. Las demás conservan trabajo pendiente. Cada carpeta contiene spec, plan,
investigación, modelo, contrato UI, quickstart, tareas y checklist documental.

| Spec | Objetivo | Dependencias |
| --- | --- | --- |
| [001](001-web-foundation/spec.md) | Base web, ciclo de vida y carga recuperable | Ninguna |
| [002](002-camera-interaction/spec.md) | Modos cámara, controles e interacción | 001 |
| [003](003-intro-room/spec.md) | Calle, cautiverio, liberación y sala | 002 + 004; no bloquea primer prototipo |
| [004](004-dialogue-tutorial/spec.md) | Runner y ciclo educativo reutilizable | 001, integra 002 |
| [005](005-urn-table/spec.md) | Urnas completa y transferencia | 002 + 004 + mínimo de 009 y 010 |
| [006](006-dice-contracts/spec.md) | Contratos, valor esperado y variación | 005; reutiliza infraestructura |
| [007](007-records-table/spec.md) | Datos, muestra y sesgo | 006 |
| [008](008-host-finale/spec.md) | Síntesis, salida y epílogo | 005–007 + 009; 003 para campaña |
| [009](009-progression-save/spec.md) | Gates, checkpoints y recuperación | Contratos tras 001; integración final tras 008 |
| [010](010-quality-release/spec.md) | Calidad visual, audio, accesibilidad y publicación | Fundaciones tras 001; cierre tras 002–009 |

## Secuencia y dependencias transversales

No interpretar números como orden estricto. Secuencia de construcción:
001 → (002, 004, contrato de 009, tokens/budgets de 010) → 005 → revisión del prototipo.
Después: 006 → 007 → 008; 003 se integra antes de campaña completa. Cierre de 009 y 010 después.
Los planes de 008 y 009 no forman un ciclo de construcción: 008 depende del contrato mínimo 009,
y la verificación global de 009 depende de tener todas las mesas. No implementar dos reducers.

| Sistema compartido | Propietario | Consumidores |
| --- | --- | --- |
| Bootstrap y configuración estricta | 001 | Todos |
| Cámara/input/picking | 002 | 003–008 |
| Runner diálogo/tutorial | 004 | 003, 005–008 |
| Fracciones, urnas, RNG | 005 | 006–008, 009 serializa estado |
| Dados/contratos | 006 | 008 |
| Estadística descriptiva | 007 | 008 |
| CampaignState, comando, gates, save, settings persistidos | 009 | Todos mediante interfaces |
| Tokens UI, asset manifest, audio y medición | 010 | Todos desde fundación mínima |

Las tareas sin marcar son pendientes reales, aunque sus documentos estén completos. Los requisitos y
criterios enlazan a fuente única de reglas. El análisis de consistencia distingue cobertura
planificada de evidencia de ejecución. El corte actual desarrolla 006-dice-contracts en
`codex/doble-contracts`; la selección local de Spec Kit se consulta en `.specify/feature.json`,
no se infiere de la rama. Evidencia y límites: [Doble](../docs/doble-implementation.md).
