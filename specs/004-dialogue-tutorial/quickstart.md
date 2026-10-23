# Validación futura: Diálogos y tutoriales

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias 001; adapta controles de 002 al integrar o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/004-dialogue-tutorial.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/004-dialogue-tutorial.spec.ts`.
Caso manual: Recorrer todas las ramas, repetir/omitir explicaciones y variar tamaño de texto sin cambiar mérito.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
