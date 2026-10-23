# Validación futura: Mesa de las urnas

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias 002, 004, contrato/checkpoints mínimos de 009; base visual de 010 o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/005-urn-table.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/005-urn-table.spec.ts`.
Caso manual: Jugar U1 tras roja y azul, U2 reposición y U3 cambio de óptimo; completar U4 y ayuda con fake RNG adverso.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
