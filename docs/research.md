# Investigación técnica y registro de decisiones

Consulta: 2026-10-22, America/Buenos_Aires. Las respuestas y registros locales complementan las
fuentes; no acreditan ejecución de un videojuego. Fecha de cierre y commit en continuidad.

| ID | Fuente primaria consultada | Hecho documentado | Decisión o límite |
| --- | --- | --- | --- |
| B01 | [Babylon specifications](https://www.babylonjs.com/specifications/) | Publica soporte WebGL, picking, animación, PBR y audio | Motor cubre alcance; no necesitamos otro motor |
| B02 | [Cámaras](https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction) | Universal y ArcRotate tienen modelos de control distintos | Universal exploración; vistas controladas conversación/mesa |
| B03 | [Picking, fuente oficial](https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/mesh/interactions/picking_collisions.md) | Picking permite rayos y filtros | Limitar selección a interactuables; alternativa de lista por teclado |
| B04 | [Secuenciar animación](https://doc.babylonjs.com/features/featuresDeepDive/animation/sequenceAnimations) | Se pueden coordinar clips con tiempos explícitos | Intro con planos y eventos cortos, sin secuencia de acción |
| B05 | [GUI](https://doc.babylonjs.com/features/featuresDeepDive/gui/) | HTML/CSS puede superponerse a escena | UI educativa DOM; no sumar paquete GUI por defecto |
| B06 | [Importación, fuente oficial](https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/importers/loadingFileTypes.md) | Hay loaders asíncronos y contenedores | GLB por escena, errores recuperables y dispose |
| B07 | [Audio V2, fuente oficial](https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/audio/v2/playingSoundsMusic.md) | CreateAudioEngineAsync inicializa; unlockAsync espera permiso de reproducción tras interacción | Inicio manual, buses separados y silencio funcional; cotejar tipos del pin antes de implementar |
| B08 | [Optimización](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene) | Motor ofrece congelación, instancias y reducción de trabajo | Medir escena representativa antes de optimizar |
| T01 | [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict.html) | Agrupa comprobaciones estrictas; cambios de versión pueden añadir errores | strict y compilación obligatoria antes de aceptar base |
| T02 | [Vite deploy](https://vite.dev/guide/static-deploy.html) | Build estática y base distinta para Pages de repositorio | Publicación futura de dist; preview no es servidor productivo |
| S01 | [Spec Kit instalación](https://github.github.io/spec-kit/installation.html) | PyPI oficial; CLI version y init documentados | Instalación real specify-cli==1.2.3 y logs conservados |
| S02 | [Integración Codex](https://github.github.io/spec-kit/integrations/codex.html) | Skills en .agents/skills, invocación con $ | Integración codex portable, no comandos antiguos --ai |
| S03 | [Flujo SDD](https://github.github.io/spec-kit/quickstart.html) | Constitución, specify, clarify, plan, tasks, analyze son pasos del agente | Aplicar instrucciones instaladas; no tratar slash como CLI |
| S04 | [Releases oficiales](https://github.com/github/spec-kit/releases/tag/v1.2.3) | Release consultada 1.2.3, publicada 2026-10-22 | Fijar CLI y preservar archivos generados |
| V01 | [Registro npm oficial](https://registry.npmjs.org/) | Metadatos version/engines/license consultados por npm view | Versiones exactas en evidencia y package-lock; integración pendiente |

## Hechos, propuestas e hipótesis

Hechos: estado mínimo del repo y acceso GitHub observados; CLI instalada e inicialización ejecutada;
paquetes consultados al registro; archivos de skills auditados en sus commits. Evidencias en
`docs/evidence/` y manifiestos. No se usa antigüedad de un tutorial como autoridad de API actual.

Propuestas: xorshift32-v1, arquitectura de capas, budgets, Pages candidato, tono narrativo y reglas
educativas. Se convierten en requisitos versionados; no son prestaciones del motor ya verificadas.

Hipótesis: duración 30–45 min, entretenimiento, transferencia educativa, legibilidad en cámara y
rendimiento en GPU integrada. Requieren prototipo y prueba humana; no hay estudio de eficacia.

## Límites y trazabilidad

Una apertura de picking en `/events/picking/` falló y se sustituyó por contenido oficial en GitHub.
La ruta antigua de reproducción audio no respondió; se consultó después la fuente oficial V2
en GitHub y se verificó la inicialización/desbloqueo sin ejecutar audio del juego.
No se adopta Babylon Lite: la investigación y dependencias son Babylon.js core.
La instantánea compartida del chat es antecedente, no fuente normativa ni documento de decisiones;
no se pudo verificar su contenido con las herramientas usadas. El prompt íntegro queda versionado.
Educación: [investigación específica](research-education.md). Arte/licencias y accesibilidad:
[pipeline](asset-pipeline.md), [validación visual](visual-validation.md). Skills: [auditoría](skills.md).
