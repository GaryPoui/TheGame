# Investigación: Progresión y guardado

Decisión: Conservar progreso y poder continuar ante errores de almacenamiento. Evidencia: [investigación técnica](../../docs/research.md),
[educativa](../../docs/research-education.md), [skills](../../docs/skills.md).
Razón: alcance y requisitos explícitos del prompt, con verificaciones exactas donde corresponde.
Alternativas consideradas: otro motor/backend/framework UI se rechazan por alcance;
reglas duplicadas se rechazan por riesgo de divergencia. Elegir contratos, cámara y runner
existentes según responsabilidades de arquitectura. Específico de esta spec: Definir contratos de CampaignState, comandos y checkpoints en src/core/campaign/types.ts.
Hipótesis pendiente: comprobar experiencia real mediante cargar fixtures válidas/corruptas/futuras y storage que falla; recargar sin volver a tirar ni duplicar méritos.
La aceptación matemática no demuestra entretenimiento, eficacia educativa ni rendimiento.
