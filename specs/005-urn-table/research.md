# Investigación: Mesa de las urnas

Decisión: Elegir oportunidades y actualizar probabilidades jugando una mesa completa. Evidencia: [investigación técnica](../../docs/research.md),
[educativa](../../docs/research-education.md), [skills](../../docs/skills.md).
Razón: alcance y requisitos explícitos del prompt, con verificaciones exactas donde corresponde.
Alternativas consideradas: otro motor/backend/framework UI se rechazan por alcance;
reglas duplicadas se rechazan por riesgo de divergencia. Elegir contratos, cámara y runner
existentes según responsabilidades de arquitectura. Específico de esta spec: Implementar fracciones y selección uniforme con RNG inyectado en src/core/math/urns.ts.
Hipótesis pendiente: comprobar experiencia real mediante jugar u1 tras roja y azul, u2 reposición y u3 cambio de óptimo; completar u4 y ayuda con fake rng adverso.
La aceptación matemática no demuestra entretenimiento, eficacia educativa ni rendimiento.
