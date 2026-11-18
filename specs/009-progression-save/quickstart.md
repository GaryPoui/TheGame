# Validación futura: Progresión y guardado

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias 001; contrato mínimo antes de 005, integración completa tras 008 o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/009-progression-save.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/009-progression-save.spec.ts`.
Caso manual: Cargar fixtures válidas/corruptas/futuras y storage que falla; recargar sin volver a tirar ni duplicar méritos.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
