# La Casa del Azar — TheGame

Videojuego educativo de probabilidad **y** estadística, de 30–45 minutos objetivo, en navegador
de escritorio. Babylon.js + TypeScript estricto + Vite. Título provisional.

**Estado de esta entrega:** investigación, instalación portable de skills, Spec Kit y documentación.
El juego todavía no está implementado. La siguiente fase requiere una instrucción posterior.

## Mapa de lectura

| Para conocer… | Leer |
| --- | --- |
| Qué se hizo y cómo continuar | [Continuidad](docs/continuity.md) |
| Requerimiento íntegro | [Prompt original](docs/original-prompt.md) |
| Experiencia, alcance y exclusiones | [Visión](docs/vision.md) y [GDD](docs/game-design.md) |
| Personajes y apertura | [Narrativa](docs/narrative.md) |
| Reglas exactas, tutoriales y progreso | [Diseño educativo](docs/educational-design.md) |
| Arquitectura, RNG y guardado | [Arquitectura y decisiones](docs/architecture.md) |
| Fuentes verificables | [Investigación técnica](docs/research.md) y [educativa](docs/research-education.md) |
| Skills instaladas y reinstalación | [Auditoría](docs/skills.md) y [manifiesto](skills-manifest.json) |
| Integración real de especificaciones | [Spec Kit](docs/spec-kit.md) y [constitución](.specify/memory/constitution.md) |
| Trabajo futuro dividido en diez cortes | [Índice de specs](specs/README.md) |
| Arte, interfaz y producción | [Dirección artística](docs/art-direction.md), [guía UI](docs/ui-style-guide.md), [pipeline](docs/asset-pipeline.md) |
| Cómo comprobar calidad | [Plan de validación](docs/validation-plan.md), [visual](docs/visual-validation.md), [análisis](docs/consistency-analysis.md) |
| Qué falta decidir | [Riesgos](docs/risks.md) |
| Derechos y licencias | [Terceros](third-party/README.md) |

## Comprobaciones disponibles hoy

Desde la raíz del repositorio, con Python 3.11+:

```powershell
python scripts/skills.py verify
python scripts/verify-math.py
python scripts/verify-docs.py
```

Hay 17 skills gamedev/diseño instaladas más 10 skills generadas por Spec Kit. Las instrucciones
están disponibles como archivos locales; el catálogo del agente puede requerir próximo turno o
nueva sesión. Se distinguen instalación, lectura y aplicación en la auditoría.

Las versiones propuestas están fijadas en package.json y package-lock.json. Se generó el lockfile
sin ejecutar scripts de dependencias. No hay aún `src`, servidor, build ni comandos de juego.
El futuro prototipo debe probar **una mesa completa en una sala simple** antes de producir campaña.
