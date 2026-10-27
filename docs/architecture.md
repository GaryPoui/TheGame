# Arquitectura y responsabilidades

Actualización 2026-10-26: la campaña está implementada. La raíz única sigue siendo `GameState`
en `src/core/game.ts`; gates en `src/core/campaign/progression.ts`, sesiones por mesa
en `src/core/tables/` y composición HTML en `src/main.ts`. El adaptador de guardado vive
todavía junto al validador raíz; no hay una segunda implementación en platform.
El esquema actual es v3 con `state`, acepta v1/v2. Los contratos siguientes conservan
el diseño original; la correspondencia real y evidencia están en [campaña](campaign-implementation.md).


Estado: diseño, no implementación. Fuente de reglas: [diseño educativo](educational-design.md).

## Capas y propiedad

| Módulo futuro | Responsabilidad única | Dependencias permitidas |
| --- | --- | --- |
| `src/core/math/` | Fracciones, urnas, enumeración 36 dados, momentos | TypeScript puro |
| `src/core/random/` | RNG con seed, rechazo sin sesgo, snapshot | Ninguna capa visual |
| `src/core/tables/` | Acciones legales, política rival, puntuación | Math + RNG inyectado |
| `src/core/campaign/` | Gates, insignias, ayuda, máquina de estados | Tables, contratos |
| `src/content/` | Diálogos, escenarios preparados, transferencia | Datos validados |
| `src/platform/` | LocalStorage, audio, teclado, reloj | Interfaces core |
| `src/presentation/` | Babylon, cámaras, animación, carga | Estado de sólo lectura |
| `src/ui/` | HTML semántico, foco, gráficos con tabla equivalente | Comandos de aplicación |
| `src/app/` | Construcción de servicios y despacho | Todas las capas |

El render loop nunca determina un resultado. Una animación consume un evento resuelto; omitirla no
cambia RNG ni puntos. Un único dispatcher valida y reduce comandos de forma atómica. No se usa
física de dados para decidir; mostrar el par generado y animarlo. El RNG decorativo es independiente.

## Máquina de estados

`boot → menu → street → blackout → restrained → released → room → dialogue → table → summary → room`.
`room → finale → ending` requiere tres insignias. `pause` conserva estado anterior y bloquea comandos.
`loading/error` permite reintentar o volver a menú. Street/blackout/restrained son omitibles hacia
released; emitir el evento de liberación una sola vez. La hebilla narrativa permanece sin limitar
las manos para jugar. En released se habilitan movimiento e interacción. Dialogue/table desactivan
movimiento, liberan puntero y fijan cámara; al salir restauran posición segura, foco y modo previo.
No depender de callbacks de animaciones para avanzar: confirmación de estado más timeout técnico.

## Contratos internos

Comando: `commandId`, `type`, `payload`, `expectedRevision`. Resultado: nuevo snapshot inmutable,
eventos de dominio y error tipado. Rechazar revisión antigua y doble confirmación sin consumir RNG.
Eventos: `DecisionCommitted`, `OutcomeRevealed`, `RoundExplained`, `TransferRecorded`,
`BadgeGranted`, `CampaignCompleted`. Payload educativo distingue `decisionScore`, `chanceTokens`,
`transferEvidence`, `assisted`. El rival recibe una proyección pública; nunca el seed ni el RNG.

RNG propuesto: algoritmo xorshift32-v1, estado uint32 no cero, seed cero normalizada a constante
documentada; no es criptográfico. Su ciclo excluye cero: m=2^32−1, word=nextUint32()−1;
para entero uniforme [0,n), con 1<=n<=m, aceptar word < floor(m/n)*n y usar word%n.
Esto elimina el sesgo de reducción módulo sobre el ciclo, no convierte el PRNG en azar físico.
Guardar algoritmo, estado y contador. Validar con vectores dorados
antes del prototipo. Resultado se genera al commit válido, no al hover, carga ni animación.

## Persistencia (propietario: spec 009)

Sobre `localStorage`, clave `thegame.save.v1`; envelope `schemaVersion`, `contentVersion`,
`revision`, `campaign`, `settings`, `random`, `savedAt`. Validar tipos, rangos, tamaños (máximo
256 KiB) y referencias de contenido antes de hidratar. Guardar checkpoints de datos tras cada
decisión y resultado resueltos, antes de animarlos, y al terminar ronda; no guardar animaciones
ni objetos Babylon. Reanudar una decisión confirmada muestra el mismo resultado y continúa
en explicación o siguiente acción: no vuelve a tirar. Si storage falla se anuncia la pérdida
de durabilidad; continuar en memoria no garantiza supervivencia al cierre de pestaña.
Escribir `pending`, verificar parseo, promover a `current` y conservar `backup`; no afirmar
transacción multi-key atómica. Recuperar current válido o backup; ambos inválidos ofrecen
reinicio explícito conservando preferencias válidas. Versión futura no se degrada ni se sobreescribe
automáticamente. Primera versión no tiene migraciones anteriores; agregar fixture por migración.
QuotaExceeded/SecurityError: continuar en memoria y mostrar aviso persistente de falta de guardado.

## Decisiones técnicas

- ADR-001: Babylon.js, TypeScript strict, Vite; fijados por el usuario. No sustituir motor.
- ADR-002: HTML/CSS sin framework para interfaz educativa; permite semántica y foco nativos.
- ADR-003: WebGL mediante Engine base; WebGPU queda fuera del primer prototipo.
- ADR-004: GLB, importaciones modulares y carga por fase. Sin Havok ni física para azar.
- ADR-005: Settings y Campaign se serializan como datos; assets, cámara y sonido se reconstruyen.
- ADR-006: Vitest para reglas; Playwright para navegación y capturas. DOM y canvas se verifican aparte.
- ADR-007: Sin backend, telemetría remota, cuentas, monetización ni datos personales.

## Versiones y entorno

Registro exacto: [consulta npm](evidence/npm-versions.json); pins en package.json y lockfile.
Node observado 22.17.1, npm 11.12.1, Python 3.11.9, Git 2.52.0.windows.1, Windows 10 AMD64.
Se preparan dependencias y lockfile sin crear aplicación. Compatibilidad de tipos/build pendiente
de spec 001: una versión estable publicada no demuestra integración. `strict`,
`noUncheckedIndexedAccess` y `exactOptionalPropertyTypes` son requisitos de esa spec.

## Distribución futura

Build estática `dist/`, HTTPS y rutas relativas; Pages es candidato sin servicio pago requerido.
Para repo TheGame usar base `/TheGame/`. `vite preview` sólo valida localmente. Decoders y assets
deben alojarse junto a la build; no depender de CDN en ejecución. MIME GLB correcto, CORS mismo
origen, caché por hash para assets e index sin caché prolongada. Sin service worker hasta justificar
su coste. Una pérdida de contexto WebGL ofrece reconstruir desde checkpoint o volver al menú.

## Skills aplicadas a esta propuesta

Se leyeron `save-systems`, `input-systems` y `dialogue-systems`: datos serializables en lugar
de objetos del motor, acciones reasignables con conflictos y grafo de diálogo con IDs/efectos
idempotentes. Se adaptaron conceptos a almacenamiento web y HTML; no se copian snippets de
Godot ni se adopta Ink/Yarn para una narrativa pequeña. Las skills Spec Kit orientaron el flujo
documental según docs/spec-kit.md; los registros visual y educativo identifican sus otras lecturas.
