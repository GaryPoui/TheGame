# Validación futura: Mesa de registros

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias 006; reutiliza 004 y 009 o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/007-records-table.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/007-records-table.spec.ts`.
Caso manual: Jugar álbum sesgado, muestra extrema y empate de medias; revisar informes sin afirmaciones inferenciales.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
