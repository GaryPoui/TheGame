# La Casa del Azar — TheGame

Videojuego educativo de probabilidad **y** estadística, de 30–45 minutos objetivo, en navegador
de escritorio. Babylon.js + TypeScript estricto + Vite. Título provisional.

**Estado actual:** Vera y Doble implementadas: urnas y contratos con dados, sala ilustrada,
mesas 3D, tutoriales, ayuda guiada, sellos y guardado local compartido. El nuevo corte de Doble
se documenta en [implementación y evidencia](docs/doble-implementation.md).
[Jugar la versión publicada por HTTPS](https://garypoui.github.io/TheGame/); la publicación
del nuevo corte se identifica en ese registro cuando se complete.
Ada y el final siguen en desarrollo; la duración objetivo de 30–45 minutos no está validada.

La [dirección visual actual](docs/ink-theatre.md) usa tinta, acuarela y personajes de animación
de los años treinta, con una apertura a oscuras y captor inspirado en las referencias de Gambito.
La revisión realista anterior queda documentada como histórica.

Autorización de implementación y hosting: 2026-10-23. [Alcance del corte](docs/mvp-scope.md),
[validación real](docs/mvp-validation.md) y [publicación reproducible](docs/deployment.md).

## Mapa de lectura

[Memoria compartible del chat y del proyecto](docs/memoria-del-chat.md), con decisiones,
entregas, validación y contexto para continuar en otra conversación.

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
| Entregas y trabajo pendiente en diez cortes | [Índice de specs](specs/README.md) |
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

Las versiones están fijadas en package.json y package-lock.json. Para ejecutar: `npm ci`,
`npm run dev`. Validación: `npm test`, `npm run build`, `npm run preview` y, con preview activo,
`npm run test:browser`. Se implementó una mesa completa antes de ampliar a Doble. La evidencia
histórica del MVP está en docs/mvp-validation.md; el alcance manual y la cobertura automatizada
pendiente del nuevo corte están en docs/doble-implementation.md. Enumerar comandos disponibles
no significa que se hayan ejecutado en esta entrega.
