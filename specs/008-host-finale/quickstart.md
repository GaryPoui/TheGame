# Validación futura: Secuestrador y final

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias 005, 006, 007, 009; intro 003 para campaña completa o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/008-host-finale.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/008-host-finale.spec.ts`.
Caso manual: Recorrer 6/6, 4/6, 0/6 con ayuda y repetir; confirmar epílogo único y libertad persistente.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
