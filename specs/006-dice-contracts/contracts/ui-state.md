# Contrato de interfaz: Dados y contratos

Entrada: comando con commandId único, type, payload validado y expectedRevision.
Salida: snapshot de sólo lectura, eventos de dominio y error tipado o null.
Renderizar `Contract: cost, grossPayout` desde estado, nunca decidir resultado dentro de animación.
Interacción HTML/teclado y picking deben emitir el mismo comando; movimiento deshabilitado
durante panel modal/mesa. Escape vuelve o pausa sin perder decisión confirmada.
Error de asset, control o storage ofrece reintentar o volver; nunca simular éxito silencioso.
Feedback separa decisión, azar y ayuda. Cambiar foco, animar o repetir texto no consume RNG.
Pruebas específicas: Enumerar 36 resultados por contrato, jugar pérdida óptima y segunda orden; verificar que saldo no bloquea.
