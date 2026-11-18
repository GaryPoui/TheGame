# Investigación: Base técnica web

Decisión: Abrir una experiencia estable con carga y fallos comprensibles. Evidencia: [investigación técnica](../../docs/research.md),
[educativa](../../docs/research-education.md), [skills](../../docs/skills.md).
Razón: alcance y requisitos explícitos del prompt, con verificaciones exactas donde corresponde.
Alternativas consideradas: otro motor/backend/framework UI se rechazan por alcance;
reglas duplicadas se rechazan por riesgo de divergencia. Elegir contratos, cámara y runner
existentes según responsabilidades de arquitectura. Específico de esta spec: Configurar TypeScript strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes y scripts dev/build/typecheck/test en package.json y tsconfig.json.
Hipótesis pendiente: comprobar experiencia real mediante compilar, servir dist en subruta y desconectar un recurso; inspeccionar consola y controles de error.
La aceptación matemática no demuestra entretenimiento, eficacia educativa ni rendimiento.
