# Validación futura: Cámara e interacción

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias 001 o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/002-camera-interaction.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/002-camera-interaction.spec.ts`.
Caso manual: Recorrer cuatro modos, abrir pausa, perder foco y reasignar interactuar; completar con teclado.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
