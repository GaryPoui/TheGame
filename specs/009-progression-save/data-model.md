# Modelo de datos: Progresión y guardado

Entidad local propuesta: `SaveEnvelope: schemaVersion, contentVersion, revision, campaign, settings, random; Badge: independent|assisted`.
Relación: sesión pertenece a campaña; identificadores de contenido estables, revisión monotónica.
Estado no contiene objetos Babylon/DOM, funciones ni futuros RNG. Entrada válida produce snapshot
y eventos; doble commandId o revisión desactualizada no aplica efectos dos veces.
Estados compartidos y envelope definidos en docs/architecture.md; checkpoints propiedad de 009.
Validación: enumeraciones cerradas, enteros finitos, IDs existentes, acciones legales por fase;
si una acción no es válida se devuelve error tipado y estado idéntico sin consumir RNG.
