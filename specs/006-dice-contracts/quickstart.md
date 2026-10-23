# Validación futura: Dados y contratos

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias 005; reutiliza 004 y 009 o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/006-dice-contracts.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/006-dice-contracts.spec.ts`.
Caso manual: Enumerar 36 resultados por contrato, jugar pérdida óptima y segunda orden; verificar que saldo no bloquea.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
