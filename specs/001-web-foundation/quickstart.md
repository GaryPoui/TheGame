# Validación futura: Base técnica web

Estado: instrucciones para cuando exista implementación; no ejecutadas como juego en esta fase.
Preparación: Node >=22.12, `npm ci`, implementar dependencias Ninguna o fixtures equivalentes.
Comandos previstos tras 001: `npm run typecheck`, `npm test -- tests/unit/001-web-foundation.test.ts`,
`npm run build`; servir build y ejecutar `npx playwright test tests/browser/001-web-foundation.spec.ts`.
Caso manual: Compilar, servir dist en subruta y desconectar un recurso; inspeccionar consola y controles de error.
Esperado: todas las FR/SC de spec.md pasan; errores son recuperables, foco visible y estado
no duplica efectos. Revisar consola y canvas con capturas reales cuando haya escena.
No marcar tasks completas sólo por leer este documento o generar un lockfile.
