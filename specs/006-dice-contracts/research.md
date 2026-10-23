# Investigación: Dados y contratos

Decisión: Elegir contratos según promedio, umbral y variabilidad. Evidencia: [investigación técnica](../../docs/research.md),
[educativa](../../docs/research-education.md), [skills](../../docs/skills.md).
Razón: alcance y requisitos explícitos del prompt, con verificaciones exactas donde corresponde.
Alternativas consideradas: otro motor/backend/framework UI se rechazan por alcance;
reglas duplicadas se rechazan por riesgo de divergencia. Elegir contratos, cámara y runner
existentes según responsabilidades de arquitectura. Específico de esta spec: Enumerar pares, EV neto, rango y probabilidades de umbral en src/core/math/dice.ts.
Hipótesis pendiente: comprobar experiencia real mediante enumerar 36 resultados por contrato, jugar pérdida óptima y segunda orden; verificar que saldo no bloquea.
La aceptación matemática no demuestra entretenimiento, eficacia educativa ni rendimiento.
