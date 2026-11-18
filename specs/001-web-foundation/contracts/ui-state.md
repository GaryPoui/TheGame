# Contrato de interfaz: Base técnica web

Entrada: comando con commandId único, type, payload validado y expectedRevision.
Salida: snapshot de sólo lectura, eventos de dominio y error tipado o null.
Renderizar `BootState: loading|menu|error` desde estado, nunca decidir resultado dentro de animación.
Interacción HTML/teclado y picking deben emitir el mismo comando; movimiento deshabilitado
durante panel modal/mesa. Escape vuelve o pausa sin perder decisión confirmada.
Error de asset, control o storage ofrece reintentar o volver; nunca simular éxito silencioso.
Feedback separa decisión, azar y ayuda. Cambiar foco, animar o repetir texto no consume RNG.
Pruebas específicas: Compilar, servir dist en subruta y desconectar un recurso; inspeccionar consola y controles de error.
